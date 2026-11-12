import {searchEntries,excerpt} from './search.js';
import { iasCosts } from './costs.js';
const $=s=>document.querySelector(s);
const key='skie-manual-progress-v2';
let saved={};let storageAvailable=true;
try{saved=JSON.parse(localStorage.getItem(key)||'{}');if(!saved||typeof saved!=='object'||Array.isArray(saved))saved={};}catch{saved={};storageAvailable=false;}
for(const [id,state]of Object.entries(saved)){if(!state||typeof state!=='object'||Array.isArray(state)){delete saved[id];continue;}state.complete=state.complete===true;if(!state.checks||typeof state.checks!=='object'||Array.isArray(state.checks))state.checks={};}
function persist(){try{localStorage.setItem(key,JSON.stringify(saved));}catch{storageAvailable=false;}}
let timer;
function toast(message){const el=$('#toast');el.textContent=message;el.hidden=false;clearTimeout(timer);timer=setTimeout(()=>el.hidden=true,3800);}
const menu=$('#menu-toggle'),sidebar=$('#sidebar');
function closeMenu(){sidebar.classList.remove('open');menu.setAttribute('aria-expanded','false');}
menu?.addEventListener('click',()=>{const open=sidebar.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&sidebar.classList.contains('open')){closeMenu();menu?.focus();}if(e.key==='/'&&$('#site-search')&&!e.ctrlKey&&!e.metaKey&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){e.preventDefault();$('#site-search').focus();}});
document.addEventListener('click',e=>{if(sidebar.classList.contains('open')&&!sidebar.contains(e.target)&&!menu.contains(e.target))closeMenu();});
window.matchMedia('(min-width:781px)').addEventListener('change',e=>{if(e.matches)closeMenu();});
document.querySelectorAll('[data-progress-guide]').forEach(card=>{card.classList.toggle('is-complete',!!saved[card.dataset.progressGuide]?.complete);});
if(!$('#guide-search')&&new URLSearchParams(location.search).has('q')&&/\/(?:index\.html)?$/.test(location.pathname)){location.replace('search.html'+location.search);}
const search=$('#guide-search');
if(search){
 let filter='all',entries=[],ready=false;
 const params=new URLSearchParams(location.search);search.value=params.get('q')||'';
 const header=$('#site-search');if(header)header.value=search.value;
 const results=$('#search-results');
 const apply=()=>{
   if(!ready)return;
   const q=search.value.trim();
   if(header)header.value=q;
   const url=new URL(location.href);if(q)url.searchParams.set('q',q);else url.searchParams.delete('q');history.replaceState(null,'',url);
   results.replaceChildren();
   const found=searchEntries(entries,q,filter);
   $('#guide-count').textContent=q?found.length+' matching '+(found.length===1?'section or page':'sections and pages'):'Enter a topic to search.';
   $('#no-results').hidden=!q||found.length>0;
   let shown=0;
   const more=document.createElement('button');more.className='button small';more.textContent='Show more results';
   const batch=()=>{more.remove();for(const item of found.slice(shown,shown+30)){
     const article=document.createElement('article');article.className='search-result';
     const label=document.createElement('p');label.className='eyebrow';label.textContent=item.kind+' / '+item.page;
     const h=document.createElement('h2'),link=document.createElement('a');link.href=item.url;link.textContent=item.title;h.append(link);
     const p=document.createElement('p');p.textContent=excerpt(item.text,q);article.append(label,h,p);results.append(article);
   }shown+=30;if(shown<found.length)results.append(more);};
   more.addEventListener('click',batch);batch();
 };
 search.addEventListener('input',apply);
 document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));apply();}));
 $('#clear-search')?.addEventListener('click',()=>{search.value='';filter='all';document.querySelectorAll('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.filter==='all')));apply();search.focus();});
 $('#guide-count').textContent='Loading search…';
 fetch('data/search-index.json').then(r=>{if(!r.ok)throw Error('Search unavailable');return r.json();}).then(data=>{entries=data;ready=true;apply();}).catch(()=>{$('#guide-count').textContent='Search could not load. Reload this page or use the guide library in the menu.';});
}
const checks=[...document.querySelectorAll('[data-check]')],guide=document.body.dataset.guide;
function refreshCheckStatus(){const n=checks.filter(x=>x.checked).length;const label=$('#check-status');if(label)label.textContent=`${n} of ${checks.length} checked`;const done=$('#mark-complete');if(done){done.textContent=saved[guide]?.complete?'Reviewed ✓':'Mark as reviewed';done.setAttribute('aria-pressed',String(!!saved[guide]?.complete));}}
if(guide){const state=saved[guide]||{};for(const c of checks){c.checked=!!state.checks?.[c.dataset.check];c.addEventListener('change',()=>{saved[guide]??={};saved[guide].checks=Object.fromEntries(checks.map(x=>[x.dataset.check,x.checked]));persist();refreshCheckStatus();});}$('#mark-complete')?.addEventListener('click',()=>{saved[guide]??={};saved[guide].complete=!saved[guide].complete;persist();refreshCheckStatus();toast(storageAvailable?'Progress saved on this device.':'Progress kept for this visit. Browser storage is unavailable.');});refreshCheckStatus();}
$('#reset-progress')?.addEventListener('click',()=>{if(!window.confirm('Clear your Skie guide checks and review marks on this device?'))return;saved={};persist();document.querySelectorAll('.is-complete').forEach(c=>c.classList.remove('is-complete'));toast('Guide review marks cleared on this device.');});
$('#print-lesson')?.addEventListener('click',()=>window.print());
$('#copy-lesson')?.addEventListener('click',async()=>{const text=$('#lesson-copy').textContent;try{if(!navigator.clipboard)throw new Error('Unavailable');await navigator.clipboard.writeText(text);toast('Guide copied. Share it where you choose.');}catch{const wrap=$('#copy-fallback'),field=wrap.querySelector('textarea');field.value=text;wrap.hidden=false;field.focus();field.select();toast('Automatic copy unavailable. Copy the selected text below.');}});
$('#close-copy')?.addEventListener('click',()=>{$('#copy-fallback').hidden=true;$('#copy-lesson').focus();});
const toc=$('.toc');if(toc){const tocMedia=matchMedia('(max-width:1200px)');toc.open=!tocMedia.matches;tocMedia.addEventListener('change',e=>{toc.open=!e.matches;});}
const sections=[...document.querySelectorAll('.lesson-section')];if(sections.length&&'IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){document.querySelectorAll('.toc a').forEach(a=>{if(a.hash==='#'+entry.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}},{rootMargin:'-100px 0px -65% 0px'});sections.forEach(s=>observer.observe(s));}
const progress=$('#reading-progress');if(progress){const update=()=>{const article=$('.reading');const start=article.offsetTop;const range=Math.max(1,article.offsetHeight-innerHeight+74);progress.value=Math.min(100,Math.max(0,(scrollY-start)/range*100));};addEventListener('scroll',update,{passive:true});addEventListener('resize',update);update();}
const calc=$('#ias-form');if(calc){const calculate=()=>{try{const from=$('#from-level'),to=$('#to-level');if(from.value===''||to.value==='')throw new Error('Enter both levels.');const costs=iasCosts(Number(from.value),Number(to.value));for(const [r,v]of Object.entries(costs))$('#cost-'+r).textContent=v.toLocaleString('en-US');$('#calc-error').hidden=true;}catch(e){$('#calc-error').textContent=e.message;$('#calc-error').hidden=false;for(const r of ['metal','crystal','deuterium'])$('#cost-'+r).textContent='—';}};calc.addEventListener('submit',e=>{e.preventDefault();calculate();});calculate();}
