import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {createApi,createQuota,readImage} from './extract.mjs';
import {project} from '../assets/empire/fields.js';
import {available,RETIRES} from '../assets/empire/window.js';

const baseline={bonus:30,universeState:'before',terraformState:'before'};
test('each field bonus may already be included independently',()=>{
  const rows=[{used:304,capacity:362,level:13},{used:340,capacity:300,level:0}];
  assert.deepEqual(project(rows,baseline).rows.map(r=>[r.free,r.projected,r.freeAfter]),[[58,415,111],[-40,340,0]]);
  for(const [universeState,terraformState,gain] of [['included','included',0],['before','omit',40],['included','before',13]]){
    assert.equal(project(rows,{...baseline,universeState,terraformState}).rows[0].gain,gain);
  }
  assert.throws(()=>project([{...rows[0],level:null}],baseline),/Terraformer level/);
  assert.throws(()=>project([{used:null,capacity:400,level:0}],baseline),/fields used/);
  assert.throws(()=>project(rows,{...baseline,universeState:''}),/Choose/);
});
test('heterogeneous totals across 17 synthetic colonies',()=>{
  const free=Array.from({length:17},(_,i)=>60+i);
  const r=project(free.map(n=>({used:304,capacity:304+n,level:13})),baseline);
  assert.deepEqual(r.total,{free:1156,projected:7225,freeAfter:2057,gain:901});
});
test('daily and minute reservations survive limiter reinitialization',()=>{
  const db=new DatabaseSync(':memory:');const t=Date.parse('2026-11-26T10:00Z');
  const reserve=createQuota(db,4);for(let i=0;i<3;i++)reserve(t);
  assert.throws(()=>reserve(t),/allowance/);createQuota(db,4)(t+61000);
  assert.throws(()=>createQuota(db,4)(t+120000),/allowance/);
  createQuota(db,4)(t+86400000);db.close();
});
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aD6sAAAAASUVORK5CYII=','base64');
test('HTTP validates consent, bytes, Responses call, retirement and key absence',async t=>{
  const origin='http://localhost', rows=[{name:'One',used:88,capacity:200,level:null}];let calls=0,reservations=0,now=RETIRES-1;
  const fetcher=async(url,opts)=>{
    assert.equal(url,'https://api.openai.com/v1/responses');
    const req=JSON.parse(opts.body);assert.equal(req.store,false);assert.equal(req.text.format.strict,true);
    assert.ok(req.input[0].content[0].image_url.startsWith('data:image/png;base64,'));
    calls++;return Response.json({status:'completed',output:[{content:[{type:'output_text',text:JSON.stringify({rows})}]}]});
  };
  const serve=async key=>{
    const server=createApi({origin,key,reserve:()=>reservations++,now:()=>now,fetcher});
    await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));t.after(()=>server.close());
    return 'http://127.0.0.1:'+server.address().port+'/api/empire/extract';
  };
  const url=await serve('synthetic');const headers={origin,'content-type':'image/png','x-empire-consent':'yes'};
  const send=(address,body,extra={})=>fetch(address,{method:'POST',headers:{...headers,...extra},body});
  assert.equal((await send(url,png,{origin:'https://other.invalid'})).status,403);
  assert.equal((await send(url,png,{'x-empire-consent':'no'})).status,403);
  assert.equal((await send(url,Buffer.from('bad'))).status,422);
  assert.equal((await send(await serve(''),png)).status,503);
  const good=await send(url,png);assert.deepEqual(await good.json(),{rows});assert.equal(calls,1);
  assert.equal(available(now),true);now=RETIRES;assert.equal(available(now),false);
  assert.equal((await send(url,png)).status,410);assert.equal(reservations,1);
});
test('refused or incomplete vision results never produce editable guesses',async()=>{
  for(const response of [{status:'incomplete'}, {status:'completed',output:[{content:[{type:'refusal'}]}]}, {status:'completed',output:[]}]){
    await assert.rejects(readImage(png,'image/png','fixture',async()=>Response.json(response)));
  }
});

test('request deadline cancels an in-flight provider call',async t=>{
  const origin='http://localhost';
  let cancelled=false;
  const fetcher=async (_url,{signal})=>new Promise((_,reject)=>{
    signal.addEventListener('abort',()=>{cancelled=true;reject(signal.reason);},{once:true});
  });
  const server=createApi({origin,key:'synthetic',reserve:()=>{},fetcher,requestBudgetMs:100});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  t.after(()=>server.close());
  const url='http://127.0.0.1:'+server.address().port+'/api/empire/extract';
  const response=await fetch(url,{method:'POST',headers:{origin,'content-type':'image/png','x-empire-consent':'yes'},body:png});
  assert.equal(response.status,504);
  assert.equal(cancelled,true);
});

test('retired deep link hides editor and guide links stay empty', async()=>{
  const {readFile}=await import('node:fs/promises');
  const {runInNewContext}=await import('node:vm');
  const url=path=>new URL('../assets/empire/'+path,import.meta.url);
  const html=await readFile(url('index.html'),'utf8');
  assert.match(html,/<main hidden>/);
  const script=await readFile(url('editor.js'),'utf8');
  const fields={main:{hidden:true},retired:{hidden:true},file:{value:'x'},rows:{replaceChildren(){this.empty=true;}}};
  const context={available:()=>available(RETIRES),el:id=>fields[id],document:{querySelector:()=>fields.main},invalidate(){}};
  runInNewContext(script.slice(script.indexOf('function syncAvailability()')),context);
  assert.equal(fields.main.hidden,true);assert.equal(fields.retired.hidden,false);assert.equal(fields.rows.empty,true);
  const link=await readFile(url('link.js'),'utf8');let writes=0;
  runInNewContext(link.slice(link.indexOf('const host=')),{available:context.available,document:{getElementById:()=>({append:()=>writes++})}});
  assert.equal(writes,0);
});

import {universeSettings} from '../assets/empire/universe.js';
import {catalog} from '../assets/empire/catalog.js';
import {drawCard} from '../assets/empire/render.js';
test('headline gains have a per-colony denominator and exact separate subtotal',()=>{
  const g={addColorStop(){}},strings=[];
  const ctx=new Proxy({fillText:s=>strings.push(s),measureText:()=>({width:30}),createLinearGradient:()=>g,createRadialGradient:()=>g},{get:(o,k)=>o[k]||(()=>{})});
  const canvas={getContext:()=>ctx},base=Array.from({length:17},()=>({used:10,capacity:200,level:13}));
  drawCard(canvas,project(base,baseline),'fixture');
  for(const label of ['+40','+13','+53','+901 fields across 17 colonies'])assert.ok(strings.includes(label),label);
  strings.length=0;base[0].level=10;drawCard(canvas,project(base,baseline),'fixture');
  for(const label of ['+10 to +13','+50 to +53','+898 fields across 17 colonies'])assert.ok(strings.includes(label),label);
  strings.length=0;drawCard(canvas,project(base,{...baseline,terraformState:'omit'}),'fixture');
  assert.ok(strings.includes('+680 fields across 17 colonies'));assert.ok(strings.includes('Projection includes the universe field change only.'));
});

test('dated lobby baseline and activation rule apply to the selected universe only',()=>{
  assert.equal(catalog.length,267);assert.equal(new Set(catalog.map(u=>u.community+u.number)).size,267);
  const counts=new Map();for(const u of catalog)counts.set(u.bonus,(counts.get(u.bonus)??0)+1);
  assert.deepEqual([...counts].sort((a,b)=>a[0]-b[0]),[[10,34],[25,67],[30,141],[70,25]]);
  const mars=catalog.find(u=>u.community==='us'&&u.number===268), rows=[{used:304,capacity:362,level:13}];
  assert.equal(project(rows,universeSettings(mars,'before')).total.gain,53);
  assert.equal(project(rows,universeSettings(mars,'included')).total.gain,0);
  assert.equal(project(rows,universeSettings(catalog.find(u=>u.bonus===25),'before')).total.gain,58);
  assert.equal(project(rows,universeSettings(catalog.find(u=>u.bonus===70&&u.opened==='2026-11-06'),'before')).total.gain,0);
  const unknown=project(rows,universeSettings(null,'before'));
  assert.deepEqual(unknown.total,{free:58,gain:null,projected:null,freeAfter:null});
  assert.equal(project(rows,universeSettings(null,'included')).total.gain,0);
});
