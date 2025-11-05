export function SignatureBox(label='Signature'){
  const wrap=document.createElement('div');
  wrap.className='card';

  const h=document.createElement('h2');
  h.textContent=label;
  wrap.append(h);

  const canvas=document.createElement('canvas');
  canvas.width=800; canvas.height=250;
  canvas.className='signature';
  const ctx=canvas.getContext('2d');
  ctx.lineWidth=2; ctx.lineCap='round';

  let drawing=false;
  function pos(e){
    const r=canvas.getBoundingClientRect();
    const t=e.touches? e.touches[0] : e;
    return { x: t.clientX - r.left, y: t.clientY - r.top };
  }
  canvas.addEventListener('mousedown',(e)=>{drawing=true; const p=pos(e); ctx.beginPath(); ctx.moveTo(p.x,p.y);});
  canvas.addEventListener('mousemove',(e)=>{ if(!drawing) return; const p=pos(e); ctx.lineTo(p.x,p.y); ctx.stroke();});
  canvas.addEventListener('mouseup',()=>drawing=false);
  canvas.addEventListener('mouseleave',()=>drawing=false);
  canvas.addEventListener('touchstart',(e)=>{e.preventDefault(); drawing=true; const p=pos(e); ctx.beginPath(); ctx.moveTo(p.x,p.y);});
  canvas.addEventListener('touchmove',(e)=>{e.preventDefault(); if(!drawing) return; const p=pos(e); ctx.lineTo(p.x,p.y); ctx.stroke();});
  canvas.addEventListener('touchend',()=>drawing=false);

  const btns=document.createElement('div'); btns.className='nav';
  const clear=document.createElement('button'); clear.textContent='Clear'; clear.className='secondary';
  const save=document.createElement('button'); save.textContent='Save';
  btns.append(clear, save);

  wrap.append(canvas, btns);

  return {
    el: wrap,
    clear: ()=>ctx.clearRect(0,0,canvas.width,canvas.height),
    toDataURL: ()=>canvas.toDataURL('image/png'),
    onClear: (fn)=>clear.addEventListener('click', fn || (()=>ctx.clearRect(0,0,canvas.width,canvas.height))),
    onSave: (fn)=>save.addEventListener('click', ()=>fn && fn(canvas.toDataURL('image/png')))
  };
}
