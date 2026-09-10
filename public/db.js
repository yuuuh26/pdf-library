const DB_NAME='yuu-pdf-library';
let dbPromise;
export function database(){return dbPromise ||= new Promise((resolve,reject)=>{const r=indexedDB.open(DB_NAME,1);r.onupgradeneeded=()=>{const db=r.result;for(const name of ['documents','blobs','folders'])if(!db.objectStoreNames.contains(name))db.createObjectStore(name,{keyPath:'id'});};r.onsuccess=()=>{r.result.onversionchange=()=>r.result.close();resolve(r.result);};r.onerror=()=>reject(r.error);r.onblocked=()=>reject(new Error('別のタブを閉じてから再読み込みしてください。'));});}
export async function getAll(store){const db=await database();return new Promise((resolve,reject)=>{const r=db.transaction(store).objectStore(store).getAll();r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
export async function get(store,id){const db=await database();return new Promise((resolve,reject)=>{const r=db.transaction(store).objectStore(store).get(id);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
export async function transact(stores,fn){const db=await database();return new Promise((resolve,reject)=>{const tx=db.transaction(stores,'readwrite');tx.oncomplete=()=>resolve();tx.onabort=tx.onerror=()=>reject(tx.error||new Error('保存できませんでした'));try{fn(tx);}catch(e){tx.abort();reject(e);}});}
export async function addDocument(meta,blob){await transact(['documents','blobs'],tx=>{tx.objectStore('documents').add(meta);tx.objectStore('blobs').add({id:meta.id,blob});});}
export async function patch(id,changes){await transact(['documents'],tx=>{const s=tx.objectStore('documents');const r=s.get(id);r.onsuccess=()=>{if(r.result)s.put({...r.result,...changes});};});}
export async function removeDocument(id){await transact(['documents','blobs'],tx=>{tx.objectStore('documents').delete(id);tx.objectStore('blobs').delete(id);});}
export async function addFolder(folder){await transact(['folders'],tx=>tx.objectStore('folders').add(folder));}
export async function renameFolder(id,name){await transact(['folders'],tx=>tx.objectStore('folders').put({id,name}));}
export async function removeFolder(id){await transact(['documents','folders'],tx=>{tx.objectStore('folders').delete(id);const r=tx.objectStore('documents').openCursor();r.onsuccess=()=>{const c=r.result;if(c){if(c.value.folder===id)c.update({...c.value,folder:'',updatedAt:Date.now()});c.continue();}};});}
