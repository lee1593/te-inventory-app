// very small IndexedDB helper
const DB_NAME='te_inventory_db';
const DB_VERSION=1;
let _db;

function openDB(){
  return new Promise((resolve,reject)=>{
    const req=indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded=(e)=>{
      const db=e.target.result;
      if(!db.objectStoreNames.contains('inspections')){
        const os=db.createObjectStore('inspections',{keyPath:'id', autoIncrement:true});
        os.createIndex('status','status');
      }
      if(!db.objectStoreNames.contains('photos')){
        const os=db.createObjectStore('photos',{keyPath:'id', autoIncrement:true});
        os.createIndex('inspectionId','inspectionId');
      }
      if(!db.objectStoreNames.contains('signatures')){
        const os=db.createObjectStore('signatures',{keyPath:'id', autoIncrement:true});
        os.createIndex('inspectionId','inspectionId');
      }
    };
    req.onsuccess=()=>{_db=req.result; resolve(_db);};
    req.onerror=(e)=>reject(e);
  });
}

async function db(){
  if(_db) return _db;
  return openDB();
}

export async function saveInspection(data){
  const d=await db();
  return new Promise((resolve,reject)=>{
    const tx=d.transaction('inspections','readwrite');
    tx.objectStore('inspections').put(data);
    tx.oncomplete=()=>resolve(true);
    tx.onerror=(e)=>reject(e);
  });
}

export async function createInspection(payload){
  const d=await db();
  return new Promise((resolve,reject)=>{
    const tx=d.transaction('inspections','readwrite');
    const req=tx.objectStore('inspections').add(payload);
    req.onsuccess=()=>resolve(req.result);
    req.onerror=(e)=>reject(e);
  });
}

export async function listInspections(){
  const d=await db();
  return new Promise((resolve,reject)=>{
    const tx=d.transaction('inspections','readonly');
    const req=tx.objectStore('inspections').getAll();
    req.onsuccess=()=>resolve(req.result);
    req.onerror=(e)=>reject(e);
  });
}

export async function getInspection(id){
  const d=await db();
  return new Promise((resolve,reject)=>{
    const tx=d.transaction('inspections','readonly');
    const req=tx.objectStore('inspections').get(id);
    req.onsuccess=()=>resolve(req.result);
    req.onerror=(e)=>reject(e);
  });
}

export async function addPhoto(obj){
  const d=await db();
  return new Promise((resolve,reject)=>{
    const tx=d.transaction('photos','readwrite');
    const req=tx.objectStore('photos').add(obj);
    req.onsuccess=()=>resolve(req.result);
    req.onerror=(e)=>reject(e);
  });
}

export async function listPhotos(inspectionId){
  const d=await db();
  return new Promise((resolve,reject)=>{
    const tx=d.transaction('photos','readonly');
    const idx=tx.objectStore('photos').index('inspectionId');
    const req=idx.getAll(inspectionId);
    req.onsuccess=()=>resolve(req.result);
    req.onerror=(e)=>reject(e);
  });
}

export async function saveSignature(obj){
  const d=await db();
  return new Promise((resolve,reject)=>{
    const tx=d.transaction('signatures','readwrite');
    const req=tx.objectStore('signatures').add(obj);
    req.onsuccess=()=>resolve(req.result);
    req.onerror=(e)=>reject(e);
  });
}

export async function listSignatures(inspectionId){
  const d=await db();
  return new Promise((resolve,reject)=>{
    const tx=d.transaction('signatures','readonly');
    const idx=tx.objectStore('signatures').index('inspectionId');
    const req=idx.getAll(inspectionId);
    req.onsuccess=()=>resolve(req.result);
    req.onerror=(e)=>reject(e);
  });
}
