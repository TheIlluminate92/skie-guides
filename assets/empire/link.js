import {available,RETIRES} from './window.js';
const host=document.getElementById('empire-card-link');
if(host && available()){
  const link=document.createElement('a');link.href='assets/empire/index.html';link.textContent='Create an Empire field card →';link.className='inline-link';host.append(link);
  const expire=()=>{if(!available())host.replaceChildren();else setTimeout(expire,Math.min(RETIRES-Date.now(),86400000));};
  expire();
}
