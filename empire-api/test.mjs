import test from 'node:test';
import assert from 'node:assert/strict';
import {crc32,deflateSync} from 'node:zlib';
import sharp from 'sharp';
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
  const reserve=createQuota(db,4);
  for(const ip of ['192.0.2.1','192.0.2.2','192.0.2.3'])reserve(t,ip);
  assert.throws(()=>reserve(t,'192.0.2.4'),/allowance/);
  createQuota(db,4)(t+61000,'192.0.2.4');
  assert.throws(()=>createQuota(db,4)(t+120000,'192.0.2.5'),/allowance/);
  createQuota(db,4)(t+86400000,'192.0.2.5');
  db.close();
});
test('visitor reservations share the day transaction and normalize address aliases',t=>{
  const db=new DatabaseSync(':memory:');
  t.after(()=>db.close());
  const minute=60000, first=Date.parse('2026-11-26T23:55Z');
  const reserve=createQuota(db,4);
  reserve(first,'192.0.2.4');
  reserve(first+minute,'::ffff:192.0.2.4');
  reserve(first+2*minute,'::ffff:c000:204');
  assert.throws(()=>createQuota(db,4)(first+3*minute,'192.0.2.4'),/visitor.*allowance/i);
  assert.equal(db.prepare("SELECT count FROM usage WHERE slot='day'").get().count,3);

  reserve(first+3*minute,'2001:db8::5');
  assert.throws(()=>reserve(first+4*minute,'2001:db8::6'),/allowance/i);
  reserve(first+5*minute,'192.0.2.4');
  assert.equal(db.prepare('SELECT count(*) as rows FROM visitor_usage').get().rows,1);
  assert.match(db.prepare('SELECT visitor FROM visitor_usage').get().visitor,/^[0-9a-f]{64}$/);
});
test('existing SQLite counters survive the visitor table migration',t=>{
  const db=new DatabaseSync(':memory:');
  t.after(()=>db.close());
  db.exec(`
    CREATE TABLE usage (slot TEXT PRIMARY KEY, value TEXT NOT NULL,count INTEGER NOT NULL);
    INSERT INTO usage VALUES ('day','2026-11-26',99),('minute','2026-11-26T12:00',2);
  `);
  const now=Date.parse('2026-11-26T12:00Z'), reserve=createQuota(db,100);
  reserve(now,'192.0.2.1');
  assert.throws(()=>reserve(now+60000,'192.0.2.2'),/allowance/);
  assert.equal(db.prepare("SELECT count FROM usage WHERE slot='day'").get().count,100);
  assert.equal(db.prepare('SELECT count(*) as rows FROM visitor_usage').get().rows,1);
});
function pngChunk(type, data){
  const chunk=Buffer.alloc(12+data.length);
  chunk.writeUInt32BE(data.length);
  chunk.write(type,4,'ascii');
  data.copy(chunk,8);
  chunk.writeUInt32BE(crc32(chunk.subarray(4,-4)),chunk.length-4);
  return chunk;
}
function syntheticPng(width=1,height=1,metadata=false){
  const header=Buffer.alloc(13);
  header.writeUInt32BE(width);
  header.writeUInt32BE(height,4);
  header[8]=8;
  header[9]=2;
  const scanlines=Buffer.alloc((1+width*3)*height);
  const stride=1+width*3;
  for(let row=0;row<height;row++){
    scanlines.fill(255,row*stride+1+Math.ceil(width/2)*3,(row+1)*stride);
  }
  const ancillary=metadata?[pngChunk('tEXt',Buffer.from('Comment\0synthetic hidden fixture'))]:[];
  return Buffer.concat([Buffer.from('89504e470d0a1a0a','hex'),pngChunk('IHDR',header),...ancillary,
    pngChunk('IDAT',deflateSync(scanlines)),pngChunk('IEND',Buffer.alloc(0))]);
}
const png=syntheticPng();
test('the provider receives only re-encoded screenshot frames',async()=>{
  const metadataPng=syntheticPng(1600,700,true);
  const metadataTile=syntheticPng(600,700,true);
  let requests=0;
  const mock=async(_url,{body})=>{
    requests++;
    const content=JSON.parse(body).input[0].content;
    assert.equal(content.length,2);
    for(const [index,frame] of content.entries()){
      const data=Buffer.from(frame.image_url.split(',')[1],'base64');
      assert.equal(data.includes('synthetic hidden fixture'),false);
      assert.deepEqual([data.readUInt32BE(16),data.readUInt32BE(20)],index===0?[1600,700]:[600,700]);
      const pixels=await sharp(data).raw().toBuffer();
      assert.equal(pixels[0],0);
      assert.equal(pixels.at(-1),255);
    }
    return Response.json({status:'completed',output:[{content:[{type:'output_text',text:'{"rows":[]}'}]}]});
  };
  await readImage(metadataPng,'image/png','fixture',mock,undefined,[{bytes:metadataTile,mime:'image/png'}]);
  assert.equal(requests,1);
  const jpeg=await sharp({create:{width:12,height:6,channels:3,background:'red'}})
    .withMetadata({orientation:6}).withExif({IFD0:{Artist:'synthetic hidden fixture'}}).jpeg().toBuffer();
  assert.equal(jpeg.includes('synthetic hidden fixture'),true);
  await readImage(jpeg,'image/jpeg','fixture',async(_url,{body})=>{
    const [frame]=JSON.parse(body).input[0].content;
    const data=Buffer.from(frame.image_url.split(',')[1],'base64');
    const {width,height,format,exif,icc}=await sharp(data).metadata();
    assert.deepEqual({width,height,format,exif,icc},{width:6,height:12,format:'jpeg',exif:undefined,icc:undefined});
    assert.equal(data.includes('synthetic hidden fixture'),false);
    return Response.json({status:'completed',output:[{content:[{type:'output_text',text:'{"rows":[]}'}]}]});
  });
});
test('a large but valid panorama preserves dimensions within the provider limit',async()=>{
  const width=3000,height=2000;
  const pixels=Buffer.alloc(width*height*3);
  let seed=79;
  for(let i=0;i<pixels.length;i++){
    seed=(Math.imul(seed,1664525)+1013904223)>>>0;
    pixels[i]=seed>>>24;
  }
  const jpeg=await sharp(pixels,{raw:{width,height,channels:3}}).jpeg({quality:91}).toBuffer();
  const tile=syntheticPng(1300,850,true);
  assert.ok(jpeg.length+tile.length<=6*1024*1024);
  await readImage(jpeg,'image/jpeg','fixture',async(_url,{body})=>{
    const content=JSON.parse(body).input[0].content;
    const [image,detail]=content.map(frame=>Buffer.from(frame.image_url.split(',')[1],'base64'));
    assert.ok(image.length+detail.length<=6*1024*1024);
    const output=await sharp(image).metadata();
    assert.deepEqual([output.width,output.height],[width,height]);
    assert.equal(detail.includes('synthetic hidden fixture'),false);
    return Response.json({status:'completed',output:[{content:[{type:'output_text',text:'{"rows":[]}'}]}]});
  },undefined,[{bytes:tile,mime:'image/png'}]);
});
test('HTTP validates consent, bytes, Responses call, retirement and key absence',async t=>{
  const origin='http://localhost', rows=[{name:'One',used:88,capacity:200,level:null}];let calls=0,reservations=0,now=RETIRES-1;
  const fetcher=async(url,opts)=>{
    assert.equal(url,'https://api.openai.com/v1/responses');
    const req=JSON.parse(opts.body);assert.equal(req.store,false);assert.equal(req.text.format.strict,true);
    assert.ok(req.input[0].content[0].image_url.startsWith('data:image/png;base64,'));
    calls++;return Response.json({status:'completed',output:[{content:[{type:'output_text',text:JSON.stringify({rows})}]}]});
  };
  const serve=async (key,trustedProxyIp='127.0.0.1')=>{
    const server=createApi({origin,key,trustedProxyIp,reserve:(_time,ip)=>{
      assert.equal(ip,'2001:db8::1');reservations++;
    },now:()=>now,fetcher});
    await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));t.after(()=>server.close());
    return 'http://127.0.0.1:'+server.address().port+'/api/empire/extract';
  };
  const url=await serve('synthetic');const headers={origin,'content-type':'image/png','x-empire-consent':'yes','x-skie-client-ip':'2001:0DB8::0001'};
  const send=(address,body,extra={})=>fetch(address,{method:'POST',headers:{...headers,...extra},body});
  assert.equal((await send(url,png,{origin:'https://other.invalid'})).status,403);
  assert.equal((await send(url,png,{'x-empire-consent':'no'})).status,403);
  assert.equal((await send(url,Buffer.from('bad'))).status,422);
  assert.equal((await send(url,png.subarray(0,40))).status,422);
  assert.equal((await send(await serve(''),png)).status,503);
  assert.equal((await send(await serve('synthetic','127.0.0.2'),png)).status,503);
  assert.equal((await send(url,png,{'x-skie-client-ip':'192.0.2.1, 192.0.2.2'})).status,503);
  const noVisitor={...headers};
  delete noVisitor['x-skie-client-ip'];
  assert.equal((await fetch(url,{method:'POST',headers:noVisitor,body:png})).status,503);
  assert.equal(reservations,0);
  assert.equal(calls,0);
  const good=await send(url,png);assert.deepEqual(await good.json(),{rows});assert.equal(calls,1);
  assert.equal(available(now),true);now=RETIRES;assert.equal(available(now),false);
  assert.equal((await send(url,png)).status,410);assert.equal(reservations,1);
});
test('retirement during image preparation blocks quota and provider dispatch',async t=>{
  const origin='http://localhost';
  let timeReads=0;
  const server=createApi({origin,key:'synthetic',trustedProxyIp:'127.0.0.1',
    now:()=>timeReads++===0?RETIRES-1:RETIRES,
    reserve:()=>assert.fail('retired request reserved quota'),
    fetcher:()=>assert.fail('retired request reached the provider')});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  t.after(()=>server.close());
  const response=await fetch('http://127.0.0.1:'+server.address().port+'/api/empire/extract',{
    method:'POST',headers:{origin,'content-type':'image/png','x-empire-consent':'yes','x-skie-client-ip':'192.0.2.1'},body:png});
  assert.equal(response.status,410);
  assert.equal(timeReads,2);
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
  const server=createApi({origin,key:'synthetic',trustedProxyIp:'127.0.0.1',reserve:()=>{},fetcher,requestBudgetMs:100});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  t.after(()=>server.close());
  const url='http://127.0.0.1:'+server.address().port+'/api/empire/extract';
  const response=await fetch(url,{method:'POST',headers:{origin,'content-type':'image/png','x-empire-consent':'yes','x-skie-client-ip':'192.0.2.1'},body:png});
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

import {strips,imageSet,TILE_MIME,MAX_UPLOAD} from '../assets/empire/detail.js';
test('panorama detail request uses one allowance, three overlapping crops, and the detail model',async t=>{
  assert.deepEqual(strips(900,600),[]);
  const cuts=strips(1997,807);assert.equal(cuts.length,3);assert.equal(cuts[0].x,0);
  assert.equal(cuts.at(-1).x+cuts.at(-1).width,1997);
  assert.ok(cuts.slice(1).every((col,i)=>cuts[i].x+cuts[i].width-col.x>=128));
  let reserves=0,calls=0;
  const fetcher=async(url,options)=>{
    const request=JSON.parse(options.body);calls++;
    assert.equal(request.model,'gpt-4.1-mini');assert.equal(request.reasoning,undefined);
    assert.equal(request.input[0].content.length,4);assert.ok(request.input[0].content.every(i=>i.detail==='high'));
    assert.match(request.instructions,/beside the coordinates/);assert.match(request.instructions,/Terraformer/);
    return Response.json({status:'completed',output:[{content:[{type:'output_text',text:'{"rows":[]}'}]}]});
  };
  const origin='http://localhost';const server=createApi({origin,key:'fixture',trustedProxyIp:'127.0.0.1',now:()=>RETIRES-1,reserve:()=>reserves++,fetcher});
  await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>server.close());
  const send=body=>fetch('http://127.0.0.1:'+server.address().port+'/api/empire/extract',{method:'POST',headers:{origin,'X-Empire-Consent':'yes','Content-Type':TILE_MIME,'X-SKIE-Client-IP':'192.0.2.1'},body});
  for(const malformed of [Buffer.alloc(0),Buffer.from([0,0,0,200,1]),Buffer.alloc(4)]) assert.equal((await send(malformed)).status,422);
  assert.equal(reserves,0);const overview=new Blob([png],{type:'image/png'});
  const frame=imageSet([overview,overview,overview,overview]);assert.ok(frame.size<=MAX_UPLOAD);
  assert.equal((await send(frame)).status,200);assert.equal(reserves,1);assert.equal(calls,1);
});
