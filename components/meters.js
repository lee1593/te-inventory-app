export function MeterReads(initial={}){
  const v = { gas: initial.gas || '', electric: initial.electric || '', water: initial.water || '' };
  const wrap=document.createElement('div'); wrap.className='card';
  const title=document.createElement('h2'); title.textContent='Meter Reads'; wrap.append(title);

  function row(label, key){
    const l=document.createElement('label'); l.textContent=label;
    const input=document.createElement('input'); input.type='text'; input.value=v[key];
    input.inputMode='numeric';
    input.addEventListener('input', ()=>{ v[key]=input.value; });
    wrap.append(l, input);
  }
  row('Gas Reading','gas');
  row('Electric Reading','electric');
  row('Water Reading','water');

  return {
    el:wrap,
    value:()=>({ ...v })
  };
}
