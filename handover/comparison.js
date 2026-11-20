(() => {
const visible=()=>Array.from(document.querySelectorAll('main figure')).filter(f=>!f.hidden&&!f.closest('section').hidden);
const title=f=>f.querySelector('img').alt;
const dialog=document.getElementById('image-compare'),open=document.getElementById('compare-open'),exportButton=document.getElementById('export-list'),status=document.getElementById('compare-status');
let list=[];
const panes=['left','right'].map(side=>({side,select:document.getElementById('compare-'+side),image:document.getElementById(side+'-image'),stage:document.getElementById(side+'-stage'),size:document.getElementById(side+'-size'),prev:document.getElementById(side+'-prev'),next:document.getElementById(side+'-next'),loaded:false}));
function announce(){status.textContent=panes.map(p=>p.side+': '+title(list[Number(p.select.value)])+(p.loaded?'':' · loading')).join(' | ');}
function render(p){
 const index=Number(p.select.value),fig=list[index];if(!fig)return;
 p.loaded=false;p.image.alt=title(fig);p.image.src=fig.querySelector('img').getAttribute('src');
 p.stage.classList.remove('actual');p.size.setAttribute('aria-pressed','false');p.size.textContent='Actual size';p.stage.scrollTo(0,0);
 p.prev.disabled=index===0;p.next.disabled=index===list.length-1;
 const link=document.getElementById(p.side+'-download');link.href=p.image.src;link.setAttribute('aria-label','Download '+p.side+' capture: '+title(fig));
 document.getElementById(p.side+'-meta').textContent=fig.querySelector('figcaption span').textContent+' · '+(index+1)+' of '+list.length;announce();
}
open.addEventListener('click',()=>{
 list=visible();if(list.length<2)return;
 panes.forEach((p,i)=>{p.select.replaceChildren(...list.map((f,n)=>{const o=document.createElement('option');o.value=String(n);o.textContent=title(f);return o;}));p.select.value=String(i);});
 panes.forEach(render);dialog.showModal();document.body.classList.add('preview-open');document.getElementById('compare-close').focus();
});
panes.forEach(p=>{
 p.select.addEventListener('change',()=>render(p));
 for(const [button,delta] of [[p.prev,-1],[p.next,1]])button.addEventListener('click',()=>{const n=Number(p.select.value)+delta;if(n<0||n>=list.length)return;p.select.value=String(n);render(p);});
 p.size.addEventListener('click',()=>{const actual=p.stage.classList.toggle('actual');p.size.setAttribute('aria-pressed',String(actual));p.size.textContent=actual?'Fit image':'Actual size';p.stage.scrollTo(0,0);});
 p.image.addEventListener('load',()=>{p.loaded=true;announce();});
 p.image.addEventListener('error',()=>{status.textContent='Could not load the '+p.side+' capture. Choose another image.';});
});
document.getElementById('compare-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{document.body.classList.remove('preview-open');open.focus();});
dialog.addEventListener('keydown',e=>{
 if(e.key!=='Tab')return;
 const nodes=Array.from(dialog.querySelectorAll('button:not(:disabled),select,a[href],[tabindex="0"]'));
 if(e.shiftKey&&document.activeElement===nodes[0]){e.preventDefault();nodes[nodes.length-1].focus();}
 else if(!e.shiftKey&&document.activeElement===nodes[nodes.length-1]){e.preventDefault();nodes[0].focus();}
});
function updateActions(){const n=visible().length;open.disabled=n<2;open.title=n<2?'At least two matching captures are required':'Compare matching captures';exportButton.disabled=n===0;}
new MutationObserver(updateActions).observe(document.getElementById('captures'),{subtree:true,attributes:true,attributeFilter:['hidden']});updateActions();
exportButton.addEventListener('click',()=>{
 const rows=[['Module','Capture','Dimensions','Full-resolution link'],...visible().map(f=>[f.closest('section').querySelector('h2').firstChild.textContent.trim(),f.dataset.variant,f.querySelector('figcaption span').textContent,f.querySelector('img').getAttribute('src')])];
 const csv='\uFEFF'+rows.map(row=>row.map(value=>'"'+String(value).replaceAll('"','""')+'"').join(',')).join('\r\n');
 const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='ValaTube_filtered_captures.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
})();
