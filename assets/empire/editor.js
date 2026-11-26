import {prepareImage} from './detail.js';
import {wireUniverse} from './universe.js';
import {LIMIT,project} from './fields.js';
import {drawCard} from './render.js';
import {available,RETIRES} from './window.js';
const el=id=>document.getElementById(id);
function invalidate(){el('card').hidden=true;el('download').disabled=true;el('status').textContent='';}
function addRow(data={}){
  if(el('rows').children.length>=LIMIT)throw Error('Limit is 40 colonies per card.');
  const row=document.createElement('div');row.className='entry';
  for(const [key,title] of [['name','Colony'],['used','Used fields'],['capacity','Total fields'],['level','Terraformer level']]){
    const label=document.createElement('label'),input=document.createElement('input');
    label.textContent=title;input.dataset.key=key;input.type=key==='name'?'text':'number';
    if(key==='name')input.maxLength=64;else{input.min='0';input.max=key==='level'?'100':'99999';}
    if (key==='level') input.placeholder='Enter if estimating';
    input.value=data[key]??'';label.append(input);row.append(label);
  }
  const remove=document.createElement('button');remove.type='button';remove.textContent='Remove';remove.onclick=()=>{row.remove();invalidate();};
  row.append(remove);el('rows').append(row);invalidate();
}
function getRows(){return Array.from(el('rows').children,row=>Object.fromEntries(Array.from(row.querySelectorAll('input'),i=>[i.dataset.key,i.value])));}
addRow();
el('add').onclick=()=>{try{addRow();}catch(e){el('status').textContent=e.message;}};
document.querySelector('main').addEventListener('input',invalidate);
let getSelection;
el('draw').onclick=()=>{
  invalidate();
  try{
    const rows=getRows(),selected=getSelection();
    const missing=selected.terraformState==='before' && rows.some(r=>r.level===null||r.level==='');
    const model=project(rows,{...selected,terraformState:missing?'omit':selected.terraformState});
    drawCard(el('card'),model,selected.label);el('card').hidden=false;el('download').disabled=false;
    const summary=model.total.gain===null?model.total.free.toLocaleString('en-US')+' free now · universe gain unknown':
      '+'+model.total.gain.toLocaleString('en-US')+' total additional fields · '+model.total.freeAfter.toLocaleString('en-US')+' projected free fields';
    el('status').textContent=model.rows.length+' reviewed colonies · '+summary+'.'+(missing?' Terraformer estimate omitted because a level is missing.':'');

  }catch(e){el('status').textContent=e.message;}
};
el('download').onclick=()=>el('card').toBlob(blob=>{if(!blob)return;const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='orion-empire-fields.png';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),10000);},'image/png');
el('read').onclick=async()=>{
  const file=el('file').files[0];const status=el('readStatus');
  if(!file||!el('consent').checked){status.textContent='Choose a cropped screenshot and confirm consent first.';return;}
  if(!['image/jpeg','image/png'].includes(file.type)||file.size>6*1024*1024){status.textContent='Choose a PNG or JPEG under 6 MiB.';return;}
  const ids=['file','consent','read'];ids.forEach(id=>el(id).disabled=true);status.textContent='Reading visible colonies…';
  try{
    const upload=await prepareImage(file);
    const response=await fetch('/api/empire/extract',{method:'POST',credentials:'omit',headers:{'Content-Type':upload.type,'X-Empire-Consent':'yes'},body:upload,signal:AbortSignal.timeout(60000)});
    if(!response.headers.get('Content-Type')?.includes('application/json'))throw Error('Screenshot reading is unavailable here. You can enter colonies manually.');
    const data=await response.json();if(!response.ok)throw Error(data.error||'Screenshot reading failed.');
    if(!Array.isArray(data.rows)||!data.rows.length)throw Error('No planet-field columns were readable. Try a closer crop or enter the rows manually.');
    const existing=getRows();const blank=existing.length===1&&Object.values(existing[0]).every(v=>!v);
    if((blank?0:existing.length)+data.rows.length>LIMIT)throw Error('Adding these rows would exceed the 40-colony limit.');
    if(blank)el('rows').replaceChildren();
    data.rows.forEach(addRow);status.textContent=data.rows.length+' rows added. Compare them with your screenshot before previewing.';el('file').value='';el('consent').checked=false;
  }catch(e){status.textContent=e.name==='TimeoutError'?'Reading timed out. Your existing rows are still available.':e.message;}
  finally{ids.forEach(id=>el(id).disabled=false);}
};

function syncAvailability(){
  const open=available();
  document.querySelector('main').hidden=!open;
  el('retired').hidden=open;
  if(open)setTimeout(syncAvailability,Math.min(RETIRES-Date.now(),86400000));
  else{el('file').value='';el('rows').replaceChildren();invalidate();}
}
syncAvailability();
if(available()) getSelection=wireUniverse();
