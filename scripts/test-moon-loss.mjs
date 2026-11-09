import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile,readdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const data=JSON.parse(await readFile(resolve(root,'data/content.json'),'utf8'));
const get=id=>data.guides.find(g=>g.id===id);
const sha=value=>createHash('sha256').update(value).digest('hex');
const hashGuide=g=>sha(JSON.stringify(g));
const baseline={
  "starter": "35c61703cba58f22154e3478f6ed3123473739ff23badab2b97945dba2f60ce5",
  "building": "73a958ba77452c95c111e4285235229660ab39dfad7c81955ba3930de1b9b09a",
  "fleetsaving": "5576e6a64a78821c98effee185a4718a92e17f271e63df07379337c2d54b934c",
  "colonization": "224c48e8c1eb3906177e485905e188e0baafc50f0a5d374a07be75d279fb44e9",
  "research": "05c81f51ecc5106abd99031e092b5ff9630392f90858812c39dfc32514a92340",
  "energy": "ef68bb46d3fcca32f6040c26eab1f62b860df0eaa9aa8f6e68c89f1100957d19",
  "crawlers": "5bfa4ce70d1c025adae3ac88376b89698695f702d6a1f19a5826c458fbdd3f8b",
  "expeditions": "9d8b46f4ab3f64352c53d6bfe9dbcb39b15b992137f59ce31bfceadca1bd3cc0",
  "lifeforms": "3e59ca7a92867c6a7fab44695cfdba110c5bda38c4fbfdc3057176bdc5acce25",
  "moons": "b5679d5a0e05c1c697faeb81afdada20684c03645e6bd1a248ad0f89e5fea952",
  "moon-tools": "7899789b3874a374a32a607fed7987d97d4e72b335de7b41afd46bfb73552761",
  "special-buildings": "dfc9cf7b0dd3dd265eec2fd1156a192c5287b8aa3c6a23f324160029d09d28e4",
  "defense": "2f655f2674e58620fd1b2086cd2258c5cf731476fa0b9b5e28adff60ad90c111",
  "path-miner": "01576b3f5e334b04da15d2896e1f75f530e66cea27f39aff59db281d1f014d5a",
  "path-expedition": "924e4b6be5f61f0b6908e830319b9d57320f0f0a4470f3939ad583dbd5adc12f",
  "path-fleet": "c5737e6a85095108e447dd64e8753aee8aa7336c9bc28de6213912af98ccd94d",
  "orion": "dbf9075fccbfdc279a031ece8d8932bdd142ba762f480159b0ae632a03677f1a",
  "lifeform-population": "9c229ff1376dff63915113a5d5c6c5e8cb8a87308d305a1dfa94732b38c3e876",
  "lifeform-research-humans": "7e46f72775f499c1c4dd3558d6f57d8ea7df21bcc92b4ca5111e27348810b20c",
  "lifeform-research-rocktal": "f4f6b0ee452c42d57bb8b97f6e13f41f210f975f1d1f66360deeb8010ad5866c",
  "lifeform-research-mechas": "41828dc2c30fce3ea52ee4af5aa9cdf2b9a904592aa75c7cf86cb78b2a201d98",
  "lifeform-research-kaelesh": "d8a607bec385022952e845ca3aae2d59b993768f16358aaf8f4872721d3df93b",
  "lifeform-stacking": "59f2565f15873b16b1f0df38b8cb520283d9bb24ee7b5e6116e42c05691fd738",
  "economy-roi": "057b43f0a9ac0729fed48cef3ea4313262be0fe8674ad11b5d0e46e68eaf68c1",
  "energy-planning": "7e571deba40b588885cb51d118da5002e639410e9238c03426f5f9e85649af67",
  "colony-planning": "54ce80f044fc9818991040beecf8c09a763ea95044892b60845ae64f437b30b0",
  "research-reference": "6b43134c7a2cce5e3bfd75dc918a0c1f97e2c2ec6342c5591d72b0a7e9a92926",
  "crawler-reference": "f30c1a00116de5b62053476daed66ea2e2b4b2148c098c3d0edd1d4e02becf60",
  "fleetsave-reference": "4cf4339916a359651830519fa2bbaf8a953fb582e41784c8294830824cfda2c8",
  "expedition-reference": "f3dc846b82f071878fd1a04dfc9f429956c67f95eb17ba43fdbda618ed2b6bbb",
  "moonshot-reference": "7391559b1df387d472eb18dfbf3c7b02ab895441be08c041dc010b696181c56c",
  "moon-network-reference": "345a2c1b812268b85e7eebdb8e38d713679af3d1d81fe2aec26b2dcaf37ca302",
  "nanite-missile-reference": "e48d82510afbdaac70b695843d31dab666f150b6d7d4ce84c52e67eee91f6ce3",
  "defense-comparison-reference": "a9980fe1bbfa51397e15657490393daaecd3b83fbf549eb4d7e1223652c15abf"
};
const assets={
  "assets/skie-alliance-world-serpent.png": "38359219351b7d7ead08e50a1200493ae19e26b080b673d1512a4be485e7eecb",
  "assets/style.css": "7bf8092d374740fdd47d8f6f994bd68a190bbcc625f59b1bd662b6c5eaf7e48e",
  "assets/app.js": "4fe64ae73742cd6f889e90187eb3c67a0cfcfd68526e3c3124893290b83e326b",
  "assets/circuit-lines.svg": "d5eceafac5fa5a221280d94b5b159a826d9df214c6d81b8405b96181149336e6",
  "assets/costs.js": "1a6daf154ad1beab6f5c2068f33b3df3b182fe7d7e70b4c22cc8e4f3daa563a9",
  "assets/mark.svg": "f3454c770b862465148b7eed3d97670b9f986392c10333c46fce4e7ddf9b3d04"
};
const caveat="Version caveat: a 22 September 2021 staff reply described a Deployment already en route from a planet to its own moon when the moon was destroyed: on reaching the missing destination, it automatically returned to the planet and became phalanx-visible. Live version 12.0.36, released on 27 March 2025, later included moon-loss Deployment visibility fixes, but its notes do not identify this exact same-coordinate case. The current-version behavior of that automatic return has not been verified. Do not assume an automatic return behaves like a player-initiated recall; recheck the actual route and landing.";
const sources=[
  {
    "label": "Phalanx Help · staff reply, 22 September 2021; relayed code-check, not a current-version test",
    "url": "https://board.en.ogame.gameforge.com/index.php?postID=7156654&thread/828054-phalanx-help/="
  },
  {
    "label": "Live version 12.0.36 · released 27 March 2025; moon-loss Deployment visibility fixes, exact same-coordinate case unspecified",
    "url": "https://board.en.ogame.gameforge.com/index.php?postID=7246359&thread/847700-version-12/="
  }
];
const link={
  "guide": "fleetsave-reference",
  "section": "moon-loss",
  "title": "Moon loss and automatic-return version caveat",
  "description": "Distinguish a player recall from the unverified current behavior of a same-coordinate automatic return."
};
const fleet=get('fleetsave-reference'),network=get('moon-network-reference');
const moon=fleet.sections.find(s=>s.id==='moon-loss');
const visibility=network.sections.find(s=>s.id==='tools-visibility');
const fleetHtml=await readFile(resolve(root,'dist/guide-fleetsave-reference.html'),'utf8');
const fleetText=await readFile(resolve(root,'dist/downloads/fleetsave-reference.txt'),'utf8');
const networkHtml=await readFile(resolve(root,'dist/guide-moon-network-reference.html'),'utf8');
const networkText=await readFile(resolve(root,'dist/downloads/moon-network-reference.txt'),'utf8');
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let passed=0;const check=(name,fn)=>{fn();passed++;console.log('PASS '+name);};
check('Moon-loss caveat preserves the historical already-en-route same-coordinate case and dates',()=>{
 assert.equal(moon.paragraphs[2],caveat);
 for(const pattern of [/22 September 2021 staff reply/,/already en route from a planet to its own moon when the moon was destroyed/,/on reaching the missing destination, it automatically returned to the planet and became phalanx-visible/,/12\.0\.36, released on 27 March 2025/])assert.match(caveat,pattern);
 assert.equal(moon.paragraphs.filter(p=>p.startsWith('Version caveat:')).length,1);
});
check('Automatic return is not equated with player recall or asserted as current-version fact',()=>{
 assert.match(caveat,/notes do not identify this exact same-coordinate case/);
 assert.match(caveat,/current-version behavior of that automatic return has not been verified/);
 assert.match(caveat,/Do not assume an automatic return behaves like a player-initiated recall/);
 assert.match(caveat,/recheck the actual route and landing/);
 assert.match(moon.paragraphs[1],/^A player-recalled Deployment keeps/);
});
check('Moon-loss sources retain precise dates, evidence limits and both exact public links',()=>{
 for(const source of sources){assert.deepEqual(fleet.sources.find(s=>s.url===source.url),source);assert.equal(fleet.sources.filter(s=>s.url===source.url).length,1);assert.ok(fleetHtml.includes(esc(source.label)));assert.ok(fleetHtml.includes(esc(source.url)));assert.ok(fleetText.includes(source.label));assert.ok(fleetText.includes(source.url));}
 assert.match(sources[0].label,/relayed code-check, not a current-version test/);
 assert.match(sources[1].label,/exact same-coordinate case unspecified/);
});
check('The single moon-loss caveat is rendered unchanged in HTML and plain text',()=>{
 assert.ok(fleetHtml.includes(esc(caveat)));assert.ok(fleetText.includes(caveat));
 assert.equal(fleetText.split(caveat).length-1,1);
 const section=fleetHtml.match(/<section[^>]*id="moon-loss"[\s\S]*?<\/section>/)?.[0];
 assert.ok(section?.includes(esc(caveat)));
});
check('Moon visibility links to the caveat with the generic section-link schema',()=>{
 assert.deepEqual(visibility.links,[link]);
 assert.ok(networkHtml.includes('href="guide-fleetsave-reference.html#moon-loss"'));
 assert.ok(networkText.includes('https://theilluminate92.github.io/skie-guides/guide-fleetsave-reference.html#moon-loss'));
 assert.ok(networkHtml.includes(esc(link.title)));assert.ok(networkText.includes(link.description));
});
check('All 32 untargeted guide records, their order and beginner overviews match frozen 1.6.0',()=>{
 assert.deepEqual(data.guides.map(g=>g.id),Object.keys(baseline));
 for(const g of data.guides.filter(g=>!['fleetsave-reference','moon-network-reference'].includes(g.id)))assert.equal(hashGuide(g),baseline[g.id],g.id);
 assert.equal(data.guides.length-2,32);
});
check('Both targeted records preserve every other field, including ordinary visibility matrices',()=>{
 const restoredFleet=structuredClone(fleet),restoredNetwork=structuredClone(network);
 const restoredMoon=restoredFleet.sections.find(s=>s.id==='moon-loss');
 assert.equal(restoredMoon.paragraphs.splice(2,1)[0],caveat);
 restoredMoon.paragraphs[1]=restoredMoon.paragraphs[1].replace('A player-recalled Deployment keeps','A recalled Deployment keeps');
 assert.deepEqual(restoredFleet.sources.splice(-2),sources);
 delete restoredNetwork.sections.find(s=>s.id==='tools-visibility').links;
 assert.equal(hashGuide(restoredFleet),baseline[fleet.id]);assert.equal(hashGuide(restoredNetwork),baseline[network.id]);
});
const assetFiles=await readdir(resolve(root,'assets'));
const assetBytes=Object.fromEntries(await Promise.all(Object.keys(assets).map(async p=>[p,await readFile(resolve(root,p))])));
check('Every approved asset remains byte-identical to frozen 1.6.0',()=>{
 assert.deepEqual(assetFiles.sort(),Object.keys(assets).map(p=>p.slice('assets/'.length)).sort());
 for(const [p,expected]of Object.entries(assets))assert.equal(sha(assetBytes[p]),expected,p);
});
const pkg=JSON.parse(await readFile(resolve(root,'package.json'),'utf8'));
const generator=await readFile(resolve(root,'scripts/build.mjs'),'utf8');
const docs=await Promise.all(['README.md','PROVENANCE.md'].map(p=>readFile(resolve(root,p),'utf8')));
check('Patch release metadata, generator and documentation consistently identify 1.6.1',()=>{
 assert.equal(pkg.version,'1.6.1');assert.equal(data.meta.version,'1.6.1');assert.match(generator,/const presentationVersion='1\.6\.1'/);
 assert.match(docs[0],/^# Skie Field Manual 1\.6\.1/);assert.match(docs[0],/Version 1\.6\.1 adds/);assert.match(docs[1],/Release version 1\.6\.1/);
 assert.match(docs[1],/neither published code nor a current-version test/);
});
console.log(`${passed} moon-loss patch checks passed; exact historical case, source limits, current uncertainty and preservation validated.`);
