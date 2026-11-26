const number = new Intl.NumberFormat('en-US');
function perColony(values) {
  if(values.some(v=>v===null))return 'Unknown';
  const low = Math.min(...values), high = Math.max(...values);
  return low === high ? '+' + number.format(low) : '+' + number.format(low) + ' to +' + number.format(high);
}

export function drawCard(canvas, model, label) {
  const W=1100, rowH=38, top=394, totalY=top+model.rows.length*rowH;
  canvas.width=W; canvas.height=totalY+196;
  const ctx=canvas.getContext('2d');
  const bg=ctx.createLinearGradient(0,0,0,canvas.height);
  bg.addColorStop(0,'#241924'); bg.addColorStop(1,'#0b111b');
  ctx.fillStyle=bg; ctx.fillRect(0,0,W,canvas.height);
  function text(value,x,y,size,color='#f5f2f0',weight=500,align='left',width=1000){
    ctx.font=weight+' '+size+'px system-ui, sans-serif'; ctx.fillStyle=color; ctx.textAlign=align;
    let s=String(value);
    if(ctx.measureText(s).width>width){
      let chars=Array.from(s); while(chars.length && ctx.measureText(chars.join('')+'…').width>width) chars.pop();
      s=chars.join('')+'…';
    }
    ctx.fillText(s,x,y);
  }
  for(let i=0;i<100;i++){ctx.fillStyle=i%4?'#665660':'#b6a8ab';ctx.fillRect((i*137)%W,(i*i*13)%240,1.6,1.6);}
  ctx.beginPath();ctx.ellipse(940,110,126,43,-.42,0,Math.PI*2);ctx.strokeStyle='#805b58';ctx.stroke();
  const planet=ctx.createRadialGradient(912,83,4,947,109,85);planet.addColorStop(0,'#f6b898');planet.addColorStop(.45,'#ba715b');planet.addColorStop(1,'#482a38');
  ctx.fillStyle=planet;ctx.beginPath();ctx.arc(940,110,78,0,Math.PI*2);ctx.fill();
  text(label || 'OGAME / EMPIRE VIEW',48,52,22,'#ffad88',650,'left',790);
  text('Project Orion',48,129,74,'#fcf6ef',720);
  text('Planet field projection',50,183,38);
  const cards = [
    [perColony([model.universeGain]), 'Universe gain / colony'],
    [perColony(model.rows.map(r => r.terraGain)), 'Est. Terraformer gain / colony'],
    [perColony(model.rows.map(r => r.gain)), 'Projected gain / colony']
  ];
  cards.forEach(([value,title],i)=>{
    const x=48+i*339;
    ctx.fillStyle='#202735';ctx.fillRect(x,223,323,99);
    ctx.fillStyle=['#ffaa87','#9bdfdb','#f5eeee'][i];ctx.fillRect(x,223,323,4);
    text(value,x+15,273,40,ctx.fillStyle,700);text(title,x+15,304,18);
  });
  const columns=[62,572,806,1038];
  ['COLONY','FREE NOW','NEW CAPACITY','PROJECTED FREE'].forEach((v,i)=>text(v,columns[i],375,18,'#b6c4d0',650,i?'right':'left'));
  model.rows.forEach((r,i)=>{
    const y=top+i*rowH;
    ctx.fillStyle=i%2?'#151c28':'#1b2330';ctx.fillRect(48,y,1004,rowH);
    [r.name,r.free,r.projected,r.freeAfter].forEach((v,j)=>text(j?(v===null?'—':number.format(v)):v,columns[j],y+27,23,j===3?'#9bdfdb':'#f5f3f2',j?500:630,j?'right':'left',j?205:364));
  });
  ctx.fillStyle='#24353d';ctx.fillRect(48,totalY,1004,52);
  [model.rows.length+'-COLONY TOTAL',model.total.free,model.total.projected,model.total.freeAfter].forEach((v,j)=>text(j?(v===null?'—':number.format(v)):v,columns[j],totalY+35,24,j===3?'#9bdfdb':'#fff',700,j?'right':'left'));
  text(model.total.gain===null?'Universe increase unavailable · empire gain unknown':'+'+number.format(model.total.gain)+' fields across '+model.rows.length+(model.rows.length===1?' colony':' colonies'),50,totalY+91,25,'#9bdfdb',700);
  text(model.terraformState==='before'?'Includes the conditional +1 field per existing Terraformer level.':model.terraformState==='included'?'Existing Terraformer gains are already in the supplied capacity.':'Projection includes the universe field change only.',50,totalY+132,21,'#d9d8dc');
  text('SKIE FIELD MANUAL  /  REVIEWED EMPIRE VIEW',50,totalY+171,16,'#aab9c7');
}
