(() => {
const key='vt:handover:favorites';
const only=document.getElementById('favorites-only');
const status=document.getElementById('favorite-status');
const figures=Array.from(document.querySelectorAll('main figure'));
const path=fig=>fig.querySelector('img').getAttribute('src');
let saved=new Set(),persistent=true;
try {
 const raw=JSON.parse(localStorage.getItem(key)||'[]');
 if(Array.isArray(raw))saved=new Set(raw.filter(v=>typeof v==='string'));
} catch { persistent=false; }
function paint(fig){
 const active=saved.has(path(fig)),button=fig.querySelector('.favorite-toggle');
 fig.dataset.favorite=String(active);
 button.setAttribute('aria-pressed',String(active));
 button.setAttribute('aria-label',(active?'Remove favorite: ':'Save favorite: ')+fig.querySelector('img').alt);
 button.title=active?'Remove favorite':'Save favorite';
 button.querySelector('span').textContent=active?'★':'☆';
}
function announce(message=''){
 const count=figures.filter(f=>saved.has(path(f))).length;
 status.textContent=(message?message+' · ':'')+count+' saved capture'+(count===1?'':'s')+(persistent?'':' · Browser storage unavailable; favorites last only while this page stays open.');
}
figures.forEach(fig=>{
 paint(fig);
 fig.querySelector('.favorite-toggle').addEventListener('click',()=>{
  const id=path(fig),active=saved.has(id);
  if(active)saved.delete(id);else saved.add(id);
  try {localStorage.setItem(key,JSON.stringify([...saved]));persistent=true;}catch{persistent=false;}
  paint(fig);announce((active?'Removed ':'Saved ')+fig.querySelector('img').alt);
  filter();
  if(fig.hidden)only.focus();
 });
});
only.addEventListener('change',()=>filter());
window.addEventListener('storage',event=>{
 if(event.key!==key&&event.key!==null)return;
 try {
  const values=JSON.parse(event.newValue||'[]');
  saved=new Set(Array.isArray(values)?values.filter(v=>typeof v==='string'):[]);
  figures.forEach(paint);announce();filter();
 }catch{ /* Ignore malformed changes from other windows. */ }
});
announce();
})();