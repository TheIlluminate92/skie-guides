import {catalog, observedDate} from './catalog.js';

const activation=Date.parse('2026-11-30T09:00:00Z');
export function universeSettings(universe,timing){
  if(!['before','included'].includes(timing))throw Error('Choose when the screenshot was taken.');
  const label=universe ? universe.name+' · '+universe.community.toUpperCase()+' '+universe.number : 'Unlisted universe';
  const alreadyOrion=universe?.opened==='2026-11-06' && universe.bonus===70;
  const oldBonus=Number.isInteger(universe?.bonus)&&universe.bonus>=0&&universe.bonus<=70?universe.bonus:null;
  return {label,bonus:oldBonus,universeState:timing==='included'?'included':oldBonus===null?'unknown':'before',
    terraformState:alreadyOrion||timing==='included'?'included':'before',alreadyOrion};
}

export function wireUniverse({defaultKey='',now=Date.now()}={}){
  const el=id=>document.getElementById(id);
  const select=el('universe'),timing=el('timing');
  const byKey=new Map();
  const options=[...catalog].sort((a,b)=>a.name.localeCompare(b.name,'en')||a.community.localeCompare(b.community)||a.number-b.number);
  for(const u of options){
    const key=u.community+u.number;
    if(byKey.has(key))throw Error('Duplicate lobby universe '+key);
    byKey.set(key,u);
    const option=document.createElement('option');option.value=key;option.textContent=u.name+' · '+u.community.toUpperCase()+' '+u.number;select.append(option);
  }
  const missing=document.createElement('option');missing.value='unlisted';missing.textContent='My universe is not listed';select.append(missing);
  if(defaultKey && byKey.has(defaultKey))select.value=defaultKey;
  if(now<activation)timing.value='before';
  function describe(){
    const u=byKey.get(select.value);
    if(!select.value){el('serverCheck').textContent='';return;}
    if(!u){el('serverCheck').textContent='No pre-release field setting is on record for this universe. The card can still show your available fields.';return;}
    const setting=u.bonus===null?'No field bonus on record.':'+'+u.bonus+' fields in the November 26 Gameforge lobby snapshot.';
    el('serverCheck').textContent=setting+' '+(u.opened==='2026-11-06'&&u.bonus===70?'Orion was already active when this universe opened.':'The November 30 announcement sets the universe bonus to +70.');
  }
  select.addEventListener('change',describe);describe();
  return ()=>{
    if(!select.value)throw Error('Choose your universe.');
    return universeSettings(byKey.get(select.value),timing.value);
  };
}
