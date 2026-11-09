import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const data=JSON.parse(await readFile(resolve(root,'data/content.json'),'utf8'));
const get=id=>data.guides.find(g=>g.id===id),section=(g,s)=>get(g).sections.find(x=>x.id===s);
const html=id=>readFile(resolve(root,`dist/guide-${id}.html`),'utf8');
const plain=id=>readFile(resolve(root,`dist/downloads/${id}.txt`),'utf8');
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let passed=0;const check=(name,fn)=>{fn();passed++;console.log('PASS '+name);};
const pairs={building:'economy-roi',energy:'energy-planning',colonization:'colony-planning',research:'research-reference',crawlers:'crawler-reference',fleetsaving:'fleetsave-reference',expeditions:'expedition-reference',moons:'moonshot-reference','moon-tools':'moon-network-reference','special-buildings':'nanite-missile-reference',defense:'defense-comparison-reference'};
const legacyAnchors={building:['mine-basics','first-session','audit','bottleneck','compare','storage','review'],energy:['compare','formulas','table','interpret','transition','decision'],colonization:['role','unlock','choose','slot-table','field-modifiers','arrival','develop'],research:['goal','types','plan','lab','validate'],crawlers:['unlock','cap','worked','ceiling','profit','rollout'],fleetsaving:['principle','route','launch','timing','response'],expeditions:['mechanics','slot-bonuses','inputs','value-cargo','fleet','launch','hold','measure','improve'],moons:['moons-purpose','moons-shot-math','moons-prepare','moons-modifiers','moons-fields','moons-build-order','moons-supply','moons-survival'],'moon-tools':['tools-unlocks','tools-jump','tools-cooldown','tools-scan','tools-range','tools-visibility','tools-boundaries','tools-safe-routine'],'special-buildings':['special-unlocks','special-nanite-effect','special-time-math','special-nanite-decision','special-silo-capacity','special-ipm-effect','special-range-timing','special-launch-check'],defense:['purpose','universe','units','rapidfire','shields','repair','missiles','missile-math','build-workflow','simulation','response']};
const index=await readFile(resolve(root,'dist/index.html'),'utf8');
for(const [parent,id]of Object.entries(pairs)){
 const g=get(id),p=get(parent),h=await html(id),ph=await html(parent),txt=await plain(id),pt=await plain(parent);
 check(`${parent}: concise overview preserves anchors and links complete reference`,()=>{
  assert.equal(g.kind,'reference');assert.equal(g.parent,parent);
  assert.ok(!p.sections.some(s=>s.table),parent);assert.ok(p.sections.map(s=>s.body||'').join(' ').split(/\s+/).length<650);
  for(const anchor of legacyAnchors[parent]){const s=p.sections.find(s=>s.id===anchor);assert.ok(s,anchor);assert.ok(s.links.some(l=>l.guide===id),anchor);}
  assert.ok(ph.includes(`href="guide-${id}.html`));assert.ok(pt.includes(`https://theilluminate92.github.io/skie-guides/guide-${id}.html`));
  assert.ok(h.includes(`href="guide-${parent}.html"`));assert.ok(index.includes(`data-progress-guide="${id}"`));
  const nav=index.match(/<nav aria-label="Manual chapters">([\s\S]*?)<\/nav>/)[1];assert.ok(!nav.includes(`guide-${id}.html`));
  assert.match(h,/class="reference-nav"/);assert.equal([...h.matchAll(/aria-current="page"/g)].length,1);
  assert.ok(txt.split(/\s+/).length>900,id);
 });
}
for(const g of data.guides){const h=await html(g.id),t=await plain(g.id);
 check(`${g.id}: all detailed prose, table cells and links appear in download`,()=>{
  for(const s of g.sections){for(const v of [s.title,s.body,...(s.paragraphs||[]),...(s.items||[]),...(s.steps||[]),...(s.table?[...s.table.headers,...s.table.rows.flat()]:[]),...(s.example?[s.example.title,s.example.text]:[]),...(s.callout?[s.callout.title,s.callout.text]:[])].filter(Boolean))assert.ok(t.includes(v),g.id+'/'+s.id+': '+v.slice(0,80));
   for(const l of s.links||[]){assert.ok(t.includes(`https://theilluminate92.github.io/skie-guides/guide-${l.guide}.html${l.section?'#'+l.section:''}`));if(l.title)assert.ok(h.includes(esc(l.title)));}}
  assert.doesNotMatch(t,/libfile_|library_file_id|chatgpt\.com\/(?:c|g)\/|source_path|\/workspace\/scratch|agent_notes|internalreports|ghp_|sk-proj-/i);
  assert.doesNotMatch(t,/\ba\d|[a-z],\d|\+60 minutes|Practical lesson|Worked practical lesson|fleetsaving lesson|Stage [123]:/);
 });
}
const near=(actual,expected,tolerance=.005)=>assert.ok(Math.abs(actual-expected)<=tolerance,`${actual} versus ${expected}`);
const mine=(kind,l,temp=40,eco=1,slot=1)=>({M:30,C:20,D:10}[kind])*l*1.1**l*(kind==='D'?1.44-.004*temp:1)*eco*slot;
const mineCost=(kind,l)=>{const [m,c,f]={M:[60,15,1.5],C:[48,24,1.6],D:[225,75,1.5]}[kind];return [Math.floor(m*f**(l-1)),Math.floor(c*f**(l-1))];};
const fusion=(f,e)=>30*f*(1.05+.01*e)**f,fuel=(f,e)=>10*f*1.1**f*e;
check('Mine output and complete marginal comparison arithmetic',()=>{
 [mine('M',10),mine('C',10),mine('D',10,40),mine('D',10,-90)].forEach((n,i)=>near(n,[778.12,518.75,332,466.87][i]));
 const expected=[['M',30,11505063,2876265,23179.79,715.43,28.44],['C',25,6084722,3042361,6240.79,390.05,47.40],['D',25,5681512,1893837,3994.11,780.10,29.63]];
 for(const[k,l,m,c,prod,e,days]of expected){assert.deepEqual(mineCost(k,l+1),[m,c]);const delta=mine(k,l+1,40,8,k==='M'?1.35:1)-mine(k,l,40,8,k==='M'?1.35:1);near(delta,prod);near((k==='D'?20:10)*((l+1)*1.1**(l+1)-l*1.1**l),e);near((m+1.5*c)/(24*delta*({M:1,C:1.5,D:3}[k])),days);}
 assert.match(JSON.stringify(section('economy-roi','a-real-baseline-mine-comparison')),/60 Metal \/ 15 Crystal/);
});
check('Colony temperature, diameter and position tradeoffs retain units',()=>{assert.equal(Math.floor((15000*1.15/1000)**2),297);near((1.88/1.24-1)*100,51.61);near((1.96/1.8-1)*100,8.89);const m=mine('M',30,50,8)*.35,d=mine('D',25,-110,8)-mine('D',25,50,8);near(m,43972.49);near(d,13868.42);near(m/d,3.1706915625,1e-8);assert.equal(40+35+37+22+20,154);});
check('Astrophysics rounded prices and capacity thresholds',()=>{const cost=(l,b)=>100*Math.floor(b*1.75**(l-1)/100+.5);assert.deepEqual([4000,8000,4000].map(b=>cost(18,b)),[54163500,108327000,54163500]);assert.deepEqual([4000,8000,4000].map(b=>cost(19,b)),[94786100,189572300,94786100]);assert.deepEqual([4000,8000,4000].map(b=>cost(18,b)+cost(19,b)),[148949600,297899300,148949600]);const levels=[0,1,3,4,8,9,16,17,19,21,25];assert.deepEqual(levels.map(a=>1+Math.floor((a+1)/2)),[1,2,3,3,5,6,9,10,11,12,14]);assert.deepEqual(levels.map(a=>Math.floor(Math.sqrt(a))),[0,1,1,2,2,3,4,4,4,4,5]);});
check('Plasma account-wide payback and IRN savings',()=>{const gains=[1000000*.01,500000*.0066,300000*.0033];assert.deepEqual(gains,[10000,3300,990]);const daily=24*(gains[0]+1.5*gains[1]+3*gains[2]);assert.equal(daily,430080);const costs=[2000,4000,1000].map(b=>b*2**14);assert.deepEqual(costs,[32768000,65536000,16384000]);assert.equal(costs[0]+1.5*costs[1]+3*costs[2],180224000);near(180224000/daily,419.05);near((1-23/31)*100,25.81);});
check('Fusion comparisons include fuel and common-demand net resources',()=>{near(fusion(20,21),61032.64);near(fusion(21,20),68304.74);near(fuel(21,8),12432.42);near((fusion(20,21)/fusion(20,20)-1)*100,17.28);assert.equal(Math.round(10*(fusion(20,21)-fusion(20,20))),89909);assert.equal(9600+1.5*5760+3*(2880-4000),14880);assert.equal(14880*24,357120);near(1e7/357120,28);});
check('Crawler overload count, output and draw remain separate',()=>{const g=get('crawler-reference');assert.equal((30+25+25)*8,640);assert.equal(640*1.1,704);for(let workload=100;workload<=150;workload+=10){assert.equal(50*(1+2*(workload-100)/100),workload-50);near(640*.0002*1.5*(workload/100)*100,19.2*(workload/100),1e-10);}near(1111*.045,49.995,1e-9);assert.ok(1112*.045>50);assert.match(JSON.stringify(g),/PTS/);assert.match(JSON.stringify(g),/not a fresh measurement|not a fresh live-universe measurement/);});
check('Waiting time handles deliveries only at arrival and storage is constrained',()=>{assert.equal(Math.max(200000/20000,150000/5000,20000/2000),30);const funding=arrival=>Math.min(20,arrival);assert.equal(funding(12),12);assert.equal(funding(30),20);assert.equal((1000000-600000)/50000,8);assert.equal((12-8)*50000,200000);const s=JSON.stringify(section('economy-roi','find-the-actual-waiting-time-bottleneck'));assert.match(s,/add each delivery only when it arrives/);assert.match(s,/not immediately/);assert.match(section('building','bottleneck').body,/actual arrival times/);});
check('Moonshot recovery keeps Metal and Crystal separate',()=>{assert.deepEqual([625*3000,625*1000],[1875000,625000]);assert.deepEqual([625*3000*.8,625*1000*.8],[1500000,500000]);assert.deepEqual([1875000-1500000,625000-500000],[375000,125000]);near((1-.8**5)*100,67.232,.0001);near((1-.6**3)*100,78.4,.0001);assert.match(JSON.stringify(section('moonshot-reference','loss-budget')),/375,000 Metal plus 125,000 Crystal/);});
check('Expedition value, cargo, class boundaries and cycle examples',()=>{assert.equal((2000+2000)/200,20);assert.equal((6000+6000)/200,60);assert.equal(15*20,5*60);assert.equal(15*5000,75000);assert.equal(5*25000,125000);assert.equal(1.5*8*2,24);assert.equal(5e6*24,120e6);assert.equal(20+60+20,100);assert.equal(15+60+15,90);assert.equal(6*9e6,54e6);const text=JSON.stringify(get('expedition-reference'));assert.match(text,/Deathstar/);assert.match(text,/black.hole/i);assert.match(text,/older|test-server|test notes/);});
check('Nanite, missile, defense and multi-wave examples',()=>{assert.deepEqual([0,1,2,3].map(n=>11e6/(2500*11*8*2**n)),[50,25,12.5,6.25]);assert.equal(40+2*5,10*5);assert.equal(5*6-1,29);assert.equal((30+60*10)/2,315);assert.deepEqual([12500,2500,10000].map(n=>n*20),[250000,50000,200000]);assert.equal(1000*2000,800*(1500+1000));assert.equal(6+4-5-1,4);assert.equal(0+0-5-1,-6);near(1000*.7**3,343,1e-9);});
check('Source boundaries and reference tone survive integration',()=>{assert.match(JSON.stringify(get('nanite-missile-reference')),/beta and release-candidate/);assert.doesNotMatch(JSON.stringify(get('nanite-missile-reference')),/Lifeform-era live fixes/);assert.match(JSON.stringify(get('moon-network-reference')),/observations, not an official timing formula/);for(const id of ['path-miner','path-expedition','path-fleet']){assert.ok(get(id).sections.length>=8);assert.ok(get(id).related.length>=3);assert.doesNotMatch(JSON.stringify(get(id)),/Stage [123]:/);}assert.equal(data.glossary.length,17);assert.match(index,/FOUNDATIONS TO ADVANCED TRADE-OFFS/);});
console.log(`${passed} comprehensive checks passed; linked overviews, download parity, original anchors and audited arithmetic validated.`);
