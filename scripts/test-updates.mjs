import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const read=p=>readFile(new URL('../'+p,import.meta.url),'utf8');
const data=JSON.parse(await read('data/content.json'));
const html=await read('dist/updates.html');
const search=JSON.parse(await read('dist/data/search-index.json'));
assert.equal(data.updates.scope,'US Mars (s268-us) server notices and official game changelogs');
assert.ok(data.updates.entries.every(e=>['Mars server','Changelog'].includes(e.category)));
for(const e of data.updates.entries){assert.ok(['board.us.ogame.gameforge.com','board.en.ogame.gameforge.com'].includes(new URL(e.url).hostname));assert.ok(html.includes('id="'+e.id+'"'));assert.ok(search.some(s=>s.url==='updates.html#'+e.id));}
assert.match(html,/not an automatic forum feed/);
assert.match(html,/Scheduled · around 10:00 CET/);
assert.match(html,/Version verified in server data/);
assert.match(html,/board-feed\/861/);
assert.doesNotMatch(html,/discord\.gg|November 11: Hardware upgrade|Combat Reports/);
console.log('Updates scope, official links, status labels, search coverage and privacy checks passed.');
