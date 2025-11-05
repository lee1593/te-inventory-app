import { createInspection, listInspections, getInspection, addPhoto, listPhotos, saveSignature, listSignatures, saveInspection } from './db.js';
import { CameraCapture } from './components/camera.js';
import { SignatureBox } from './components/signature.js';
import { MeterReads } from './components/meters.js';

const app = document.getElementById('app');

function link(text, to){
  const a=document.createElement('button'); a.textContent=text; a.addEventListener('click', ()=>navigate(to)); return a;
}

function navigate(path){
  window.history.pushState({}, '', path);
  render();
}

window.addEventListener('popstate', render);

export function initRouter(){ render(); }

async function render(){
  const path = location.pathname;
  if(path==='/review'){
    return ReviewPage();
  }
  if(path.startsWith('/inspection/')){
    const id = parseInt(path.split('/')[2],10);
    return InspectionPage(id);
  }
  return HomePage();
}

async function HomePage(){
  app.innerHTML='';
  const card=document.createElement('div'); card.className='card';
  card.innerHTML=`<h2>Start New Inspection</h2>`;

  const addrL=document.createElement('label'); addrL.textContent='Property Address';
  const addr=document.createElement('input'); addr.type='text'; addr.placeholder='28 West Street, Dukinfield, SK16 4PL';
  const dateL=document.createElement('label'); dateL.textContent='Inspection Date';
  const date=document.createElement('input'); date.type='date';

  const start=link('Create Inspection','/');
  start.addEventListener('click', async ()=>{
    const id=await createInspection({ address: addr.value, date: date.value, status:'draft', meters:{}, notes:'' });
    navigate(`/inspection/${id}`);
  });

  card.append(addrL, addr, dateL, date, start);
  app.append(card);

  const listWrap=document.createElement('div'); listWrap.className='card';
  listWrap.innerHTML='<h2>Drafts</h2>';
  const ul=document.createElement('ul'); ul.className='list';
  const items=await listInspections();
  items.forEach(i=>{
    const li=document.createElement('li');
    li.innerHTML=`<span><span class="badge">#${i.id}</span> ${i.address || '(no address)'} <span class="note"> ${i.date||''}</span></span>`;
    const btn=link('Open', `/inspection/${i.id}`);
    li.append(btn);
    ul.append(li);
  });
  listWrap.append(ul);
  app.append(listWrap);
}

async function InspectionPage(id){
  app.innerHTML='';
  const model = await getInspection(id);
  if(!model){ app.innerHTML='<div class="card">Not found.</div>'; return; }

  const head=document.createElement('div'); head.className='card';
  head.innerHTML=`<h2>Inspection #${id}</h2><div class="note">${model.address || ''}</div>`;
  app.append(head);

  // meter reads
  const meters=MeterReads(model.meters||{});
  app.append(meters.el);

  // notes
  const notesCard=document.createElement('div'); notesCard.className='card';
  notesCard.innerHTML='<h2>Notes</h2>';
  const notesL=document.createElement('label'); notesL.textContent='General Notes';
  const notes=document.createElement('textarea'); notes.value=model.notes || '';
  notes.addEventListener('input', ()=>{ model.notes = notes.value; });
  notesCard.append(notesL, notes);
  app.append(notesCard);

  // photos
  const photosCard=document.createElement('div'); photosCard.className='card';
  photosCard.innerHTML='<h2>Photos</h2>';
  const addBtn=link('Add Photo','#');
  addBtn.addEventListener('click', ()=>{
    CameraCapture({ onConfirm: async (file)=>{
      const reader=new FileReader();
      reader.onload= async ()=>{
        await addPhoto({ inspectionId:id, room:'General', dataUrl: reader.result });
        render(); // refresh
      };
      reader.readAsDataURL(file);
    }});
  });
  photosCard.append(addBtn);
  const thumbs=document.createElement('div'); thumbs.className='row';
  const photos=await listPhotos(id);
  photos.forEach(p=>{
    const img=document.createElement('img'); img.src=p.dataUrl; img.className='thumb';
    thumbs.append(img);
  });
  photosCard.append(thumbs);
  app.append(photosCard);

  // signatures
  const sigWrap=document.createElement('div'); sigWrap.className='card';
  sigWrap.innerHTML='<h2>Signatures</h2>';
  const tenant=SignatureBox('Tenant');
  tenant.onSave(async (png)=>{ await saveSignature({ inspectionId:id, role:'tenant', dataUrl:png }); alert('Tenant signature saved'); });
  tenant.onClear();
  const agent=SignatureBox('Agent/Landlord');
  agent.onSave(async (png)=>{ await saveSignature({ inspectionId:id, role:'agent', dataUrl:png }); alert('Agent/Landlord signature saved'); });
  agent.onClear();
  sigWrap.append(tenant.el, agent.el);
  app.append(sigWrap);

  // nav actions
  const nav=document.createElement('div'); nav.className='nav';
  const saveBtn=link('Save Draft','#');
  saveBtn.addEventListener('click', async ()=>{
    model.meters = meters.value();
    await saveInspection(model);
    alert('Saved');
  });
  const reviewBtn=link('Go to Review','/review?id='+id);
  nav.append(saveBtn, reviewBtn);
  app.append(nav);
}

async function ReviewPage(){
  app.innerHTML='';
  const id = parseInt(new URLSearchParams(location.search).get('id'), 10);
  const model = await getInspection(id);
  if(!model){ app.innerHTML='<div class="card">Nothing to review.</div>'; return; }

  const card=document.createElement('div'); card.className='card';
  card.innerHTML=`<h2>Review #${id}</h2>
    <div><strong>Address:</strong> ${model.address||''}</div>
    <div><strong>Date:</strong> ${model.date||''}</div>
    <div><strong>Meters:</strong> Gas ${model.meters?.gas||''} | Electric ${model.meters?.electric||''} | Water ${model.meters?.water||''}</div>
    <div><strong>Notes:</strong> ${model.notes||''}</div>`;

  const photos=await listPhotos(id);
  if(photos.length){
    const row=document.createElement('div'); row.className='row';
    photos.forEach(p=>{
      const img=document.createElement('img'); img.src=p.dataUrl; img.className='thumb'; row.append(img);
    });
    card.append(row);
  }

  const sigs=await listSignatures(id);
  if(sigs.length){
    const row=document.createElement('div'); row.className='row';
    sigs.forEach(s=>{
      const img=document.createElement('img'); img.src=s.dataUrl; img.className='thumb'; row.append(img);
    });
    card.append(row);
  }

  const nav=document.createElement('div'); nav.className='nav';
  const back=link('Back to Draft','/inspection/'+id);
  const home=link('Home','/');
  nav.append(back, home);
  card.append(nav);

  app.append(card);
}
