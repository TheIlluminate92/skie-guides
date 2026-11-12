// Shared by the browser and regression checks; no external search service.
export const words=text=>String(text).normalize('NFKD').toLowerCase().match(/[\p{L}\p{N}]+/gu)||[];
export function searchEntries(entries,query,scope='all'){
  const terms=[...new Set(words(query))];
  if(!terms.length)return [];
  const scored=[];
  for(const item of entries){
    const reference=['Glossary','Alliance','Server','Update'].includes(item.kind);
    if(scope==='guides'&&reference||scope==='reference'&&!reference)continue;
    const title=words(item.title),page=words(item.page),body=words(item.text);
    const all=new Set([...title,...page,...body]);
    if(!terms.every(t=>all.has(t)))continue;
    const score=terms.reduce((s,t)=>s+(title.includes(t)?12:0)+(page.includes(t)?5:0),0)+(words(item.title).join(' ')===terms.join(' ')?30:0);
    scored.push({item,score});
  }
  return scored.sort((a,b)=>b.score-a.score||a.item.title.localeCompare(b.item.title)).map(x=>x.item);
}
export function excerpt(text,query){
  const raw=String(text).replace(/https:\/\/\S+/g,'').replace(/\s+/g,' ').trim();
  const term=words(query)[0];
  const pos=term?raw.toLowerCase().indexOf(term):-1;
  const start=Math.max(0,pos-65),slice=raw.slice(start,start+240);
  return (start?'…':'')+slice+(start+240<raw.length?'…':'');
}
