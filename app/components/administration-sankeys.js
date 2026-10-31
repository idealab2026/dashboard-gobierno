/* Interactive ministry and regional Sankeys, backed only by reconciled official amounts. */
import {cofogsBelow} from "./cofog-structure.js";
const ns="http://www.w3.org/2000/svg";
const nf=new Intl.NumberFormat("de-DE",{maximumFractionDigits:1}); // agrupación 4 cifras: 2.333 en vez de 2333
const label=v=>String(v??"");
const money=v=>nf.format(Number(v))+" M€";
const SECTORS={
 "0":"Deuda y operaciones financieras",
 "1":"Servicios públicos básicos",
 "2":"Protección y promoción social",
 "3":"Servicios públicos preferentes",
 "4":"Actuaciones de carácter económico",
 "9":"Actuaciones de carácter general"
};
const mk=(tag,cls,t)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(t!=null)x.textContent=String(t);return x;};
const svg=(tag,attrs={})=>{const x=document.createElementNS(ns,tag);for(const [k,v] of Object.entries(attrs))x.setAttribute(k,String(v));return x;};
const safeLink=url=>{
 try{const u=new URL(url);return u.protocol==="https:"&&
  ["www.sepg.pap.hacienda.gob.es","www.igae.pap.hacienda.gob.es"].includes(u.hostname)
  ?u.href:null;}catch{return null;}
};
function wrap(text,len=27){
 const words=label(text).split(/\s+/);const lines=[];let line="";
 for(const w of words){
  const candidate=line?line+" "+w:w;
  if(candidate.length>len&&line){lines.push(line);line=w;}else line=candidate;
 }
 if(line)lines.push(line);
 return lines.slice(0,2);
}
function groupMinistry(items){
 const map=new Map();
 for(const item of items){
  const key=item.code.charAt(0);
  if(!map.has(key))map.set(key,{code:key,name:SECTORS[key]||"Otros programas ("+key+")",value_mill_eur:0,items:[]});
  const g=map.get(key);g.value_mill_eur+=Number(item.value_mill_eur);g.items.push(item);
 }
 return [...map.values()].sort((a,b)=>b.value_mill_eur-a.value_mill_eur);
}
export function AdministrationSankeys(data, options={}){
 const root=mk("section","ad-sankeys");
 root.id="administraciones-sankey";
 const style=mk("style");
 style.textContent=`
 .ad-sankeys{width:100%;max-width:none;box-sizing:border-box;font-family:system-ui,-apple-system,sans-serif;min-width:0;color:#0b2447}
 .ad-sankeys.ad-embedded{padding:0;margin:0}
 .ad-sankeys.ad-embedded .ad-metadata{margin-top:6px}
 .ad-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 14px}
 .ad-tabs button{padding:10px 15px;border:1px solid #cfd9e5;border-radius:9px;background:#fff;color:#273f5a;font:700 .84rem system-ui;cursor:pointer}
 .ad-tabs button[aria-selected="true"]{background:#0b2447;border-color:#0b2447;color:#fff}
 .ad-chooser{display:grid;grid-template-columns:minmax(170px,1fr) minmax(100px,.6fr);gap:12px;align-items:end;margin:0 0 14px}
 .ad-chooser label{font-size:.73rem;font-weight:800;color:#455d76;display:block;margin-bottom:6px}
 .ad-chooser select{width:100%;box-sizing:border-box;border-radius:8px;border:1px solid #cad5e2;padding:10px 12px;background:#fff;color:#0b2447;font:700 .86rem system-ui}
 .ad-chooser aside{font-size:.77rem;color:#66758b;line-height:1.5;text-align:right}
 .ad-metadata{display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;padding:12px 0;border-block:1px solid #e4e9ef;margin:0 0 14px}
 .ad-metadata h2{margin:0;font:700 clamp(1.2rem,2.2vw,1.6rem)/1.3 Georgia,serif;color:#0b2447}
 .ad-metadata strong{font-size:1.25rem;font-variant-numeric:tabular-nums}
 .ad-metadata p{margin:5px 0 0;line-height:1.45;color:#61728a;font-size:.78rem;text-align:justify;text-align-last:left;width:100%}
 .ad-flow-wrap{max-width:100%;min-width:0;overflow-x:auto;-webkit-overflow-scrolling:touch}
 .ad-flow{width:100%;min-width:800px;height:auto;display:block}
 .ad-branch{cursor:pointer;outline:none}
 .ad-branch:hover rect,.ad-branch:focus-visible rect{stroke:#0b2447;stroke-width:2}
 .ad-branch text{fill:#0b2447;font-family:system-ui,sans-serif}
 .ad-branch .ad-branch-name{font-weight:700;font-size:12px}
 .ad-branch .ad-branch-value{font-weight:600;font-size:10px;fill:#54667c}
 .ad-flow-path{fill:none;stroke:#c9d8e8;stroke-opacity:.85;pointer-events:none}
 .ad-flow-path.gold{stroke:#d6c09b}
 .ad-actions{display:flex;justify-content:space-between;gap:9px;align-items:center;margin:13px 0;flex-wrap:wrap}
 .ad-actions button{border:1px solid #c7d3df;border-radius:8px;background:#fff;color:#123b60;padding:9px 12px;font-weight:700;cursor:pointer}
 .ad-actions p{font-size:.78rem;color:#56657a;margin:0}
 .ad-details{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:10px 0}
 .ad-detail{padding:11px 12px;border:1px solid #e1e7ec;border-radius:9px;background:#fafbfd;display:flex;flex-direction:column;gap:6px}
 .ad-detail h3{font:700 .83rem/1.4 system-ui;margin:0}
 .ad-detail small{color:#617189;font-size:.72rem}
 .ad-detail a{color:#164e7e;font-size:.74rem;font-weight:700}
 .ad-footnote{margin:12px 0;padding:10px 13px;background:#f6f8fb;border-left:3px solid #b89b5e;color:#57687a;font:.76rem/1.55 system-ui;text-align:justify;text-align-last:left}
 .ad-empty{padding:20px;border:1px dashed #cbd5e1;border-radius:10px;color:#52647b}
 .ad-source{color:#1b5077;font-size:.79rem;font-weight:750}

 /* Master-detail: maintain the original Sankey SVG while exploring hierarchy. */
 .ad-stage{display:grid;grid-template-columns:minmax(0,1fr);gap:16px;align-items:start;
   width:100%;max-width:100%;min-width:0;box-sizing:border-box}
 .ad-stage.is-drilling{grid-template-columns:minmax(0,1fr) minmax(330px,395px)}
 .ad-stage>.ad-flow-wrap{min-width:0;max-width:100%;width:100%}
 .ad-stage>.ad-drill-panel{min-width:0;position:sticky;top:12px;align-self:start;
   max-height:calc(100vh - 32px);overflow-y:auto;overscroll-behavior:contain;
   border:1px solid #d6e0eb;border-radius:13px;background:#fff;
   box-shadow:0 12px 30px rgba(9,33,65,.10);box-sizing:border-box}
 .ad-drill-panel[hidden],.ad-drill-scrim[hidden]{display:none!important}
 .ad-drill-head{display:flex;align-items:flex-start;justify-content:space-between;
   gap:10px;padding:15px 16px 12px;border-bottom:1px solid #e2e9f0;
   background:#f8fafc;position:sticky;top:0;z-index:2}
 .ad-drill-head .ad-drill-heading{font:750 .93rem/1.3 system-ui;color:#0b2447}
 .ad-drill-head small{display:block;color:#62748c;font:.72rem/1.4 system-ui;margin-top:3px}
 .ad-drill-close{flex:none;min-width:36px;min-height:36px;border:1px solid #cad7e3;
   border-radius:8px;background:#fff;color:#193453;cursor:pointer;font-size:1.2rem}
 .ad-drill-body{padding:12px 16px 18px;min-width:0}
 .ad-breadcrumbs{display:flex;flex-wrap:wrap;align-items:center;gap:4px;
   margin:0 0 13px;min-width:0}
 .ad-breadcrumbs button{padding:5px 4px;border:0;border-radius:4px;background:transparent;
   cursor:pointer;color:#245982;font:700 .73rem/1.4 system-ui}
 .ad-breadcrumbs button:hover{text-decoration:underline}
 .ad-breadcrumbs strong{font:750 .73rem/1.45 system-ui;color:#0b2447}
 .ad-crumb-sep{color:#8a97a9}
 .ad-drill-section h3{margin:6px 0 10px;font:700 1.2rem/1.32 Georgia,serif;color:#0b2447}
 .ad-drill-section h4{font:750 .84rem/1.4 system-ui;color:#243f5a;margin:14px 0 8px}
 .ad-drill-section p{font:.79rem/1.62 system-ui;color:#586a80;max-width:none;
   text-align:justify;text-align-last:left;margin:7px 0 12px}
 .ad-drill-total{display:block;font:800 1.24rem/1.5 system-ui;color:#102c4c;margin:6px 0}
 .ad-drill-kicker{display:block;font:750 .67rem/1.4 system-ui;letter-spacing:.08em;
   text-transform:uppercase;color:#9d742e;margin-bottom:6px}
 .ad-drill-options{display:flex;flex-direction:column;gap:7px}
 .ad-drill-option,.ad-subgroup{display:flex;justify-content:space-between;
   align-items:flex-start;gap:12px;width:100%;box-sizing:border-box;
   border:1px solid #dbe4ed;border-radius:9px;padding:10px 11px;
   text-align:left;background:#fff;cursor:pointer;color:#183f65;
   font:700 .76rem/1.45 system-ui}
 .ad-drill-option:hover,.ad-drill-option:focus-visible,
 .ad-subgroup:hover,.ad-subgroup:focus-visible{
   background:#edf5fb;border-color:#5f87aa;outline:2px solid transparent}
 .ad-drill-option strong{white-space:nowrap;font-variant-numeric:tabular-nums;
   color:#0b2447;font-size:.77rem}
 .ad-drill-option small{display:block;font:.69rem/1.4 system-ui;color:#718096;margin-top:3px}
 .ad-drill-final{padding:12px;border:1px solid #d8e2ec;border-radius:10px;background:#f7f9fc}
 .ad-drill-final h3{overflow-wrap:anywhere}
 .ad-official-links{display:flex;flex-direction:column;gap:8px;margin:12px 0}
 .ad-official-links a{display:block;border:1px solid #dce5ed;background:#fff;
   padding:9px 10px;border-radius:8px;text-decoration:none;color:#205a87;
   font:700 .74rem/1.45 system-ui;overflow-wrap:anywhere}
 .ad-official-links a:hover{text-decoration:underline}
 .ad-branch[aria-pressed="true"] rect{stroke:#a27a3a;stroke-width:3;fill:#fff8e8}
 .ad-drill-scrim{display:none}
 @media(max-width:980px){
   .ad-stage.is-drilling{grid-template-columns:minmax(0,1fr)}
   .ad-stage>.ad-drill-panel{position:fixed;z-index:1100;right:0;top:0;
     bottom:0;width:min(92vw,440px);max-height:100dvh;border-radius:12px 0 0 12px;
     box-shadow:-12px 0 32px rgba(7,28,53,.25)}
   .ad-drill-scrim:not([hidden]){display:block;position:fixed;inset:0;z-index:1099;
     width:100vw;height:100dvh;background:rgba(11,28,52,.35);border:0;cursor:pointer}
 }

 .ad-breadcrumbs{display:flex;align-items:center;gap:5px;flex-wrap:wrap;min-width:0}
 .ad-crumb{border:0!important;padding:5px 7px!important;background:transparent!important;
  color:#214a79!important;font-size:.76rem!important;cursor:pointer;text-align:left}
 .ad-crumb:hover{text-decoration:underline}
 .ad-crumb-sep{color:#8b98a9}
 .ad-crumb-last{font-size:.75rem;color:#0b2447}
 .ad-stage-explainer{margin:8px 0 12px;color:#63758b;font:.8rem/1.5 system-ui;max-width:none;text-align:justify;text-align-last:left}
 .ad-region-drill{border:1px solid #d9e2e9;background:#fafbfe;border-radius:11px;padding:16px 18px;margin:10px 0 16px}
 .ad-region-drill h3{font:750 1.12rem/1.35 system-ui;margin:0 0 9px;color:#0b2447}
 .ad-region-drill p{font:.83rem/1.6 system-ui;color:#50637c;text-align:justify;margin:0;max-width:none}
 .ad-next-title{font:750 .86rem/1.4 system-ui;color:#213b5c;margin:12px 0 8px}
 .ad-subgroups{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
 .ad-subgroup{display:block;text-align:left;border:1px solid #dae3eb;border-radius:8px;background:#fff;
   padding:12px 14px;color:#1a426a;cursor:pointer;font:700 .78rem/1.5 system-ui}
 .ad-subgroup:hover,.ad-subgroup:focus-visible{border-color:#2c5e8a;background:#f2f7fc;outline:0}
 .ad-terminal{border:1px solid #ccd9e5;border-radius:12px;background:#f8fafc;margin:12px 0 8px;padding:20px 22px}
 .ad-terminal-kicker{display:block;text-transform:uppercase;letter-spacing:.08em;color:#986d34;font:.69rem/1.5 system-ui;font-weight:750}
 .ad-terminal h3{margin:6px 0 8px;font:700 clamp(1.1rem,2.5vw,1.65rem)/1.3 Georgia,serif;color:#0b2447}
 .ad-terminal-amount{display:block;font:800 clamp(1rem,2vw,1.35rem)/1.4 system-ui;color:#0b2447;margin-bottom:10px}
 .ad-terminal p,.ad-terminal-info{font:.85rem/1.65 system-ui;color:#52647b;text-align:justify;text-align-last:left;max-width:none;margin:6px 0}
 .ad-official-links{display:flex;align-items:center;flex-wrap:wrap;gap:9px;margin:12px 0 6px}
 .ad-official-links a{border:1px solid #dbe4ed;border-radius:8px;background:#fff;padding:10px 12px;text-decoration:none;font-size:.76rem}
 .ad-official-links a:hover{text-decoration:underline}
 .ad-branch:focus-visible{outline:2px solid #b89b5e;outline-offset:2px}
 @media(max-width:700px){.ad-subgroups{grid-template-columns:1fr}.ad-terminal{padding:14px}.ad-region-drill{padding:13px}}

 @media(max-width:700px){.ad-chooser{grid-template-columns:1fr}.ad-chooser aside{text-align:left}.ad-details{grid-template-columns:1fr}.ad-tabs button{flex:1;font-size:.79rem}.ad-flow{min-width:730px}.ad-metadata strong{font-size:1.1rem}}
 `;
 style.textContent+=`
 .ad-stage,.ad-stage.is-drilling{display:block!important;width:100%;min-width:0;max-width:100%}
 .ad-stage>.ad-flow-wrap{display:block;width:100%;max-width:100%;min-width:0;
   overflow-x:auto;overflow-y:hidden;scrollbar-width:thin;scrollbar-color:#b2c0d0 #eef3f8;
   border:1px solid #e2e8ee;border-radius:9px;box-sizing:border-box;
   -webkit-overflow-scrolling:touch}
 .ad-flow{display:block;max-width:none;height:auto}
 .ad-inline-heading{fill:#98743b;font:750 13px system-ui,sans-serif;letter-spacing:1px}
 .ad-inline-node[aria-current="step"] rect{fill:#fff0d0;stroke:#a0762d;stroke-width:2.6}
 .ad-inline-node.is-unquantified rect{fill:#edf5fb;stroke:#aabfd2}
 .ad-inline-ribbon{fill:none;stroke:#c4a570;opacity:.8;pointer-events:none}
 .ad-inline-dashed{fill:none;stroke:#91acc5;stroke-width:1.5;
   stroke-dasharray:5 7;opacity:.85;pointer-events:none}
 .ad-big-title{font:750 15px system-ui,sans-serif}
 .ad-big-amount{font:800 16px system-ui,sans-serif}
 .ad-inline-terminal rect{fill:#fff9eb;stroke:#c6a165;stroke-width:1.5}
 .ad-terminal-link{fill:#195883;text-decoration:underline;
   font:700 12px system-ui,sans-serif;cursor:pointer}
 .ad-trail{display:flex;align-items:center;flex-wrap:wrap;gap:6px 9px;
   margin:3px 0 12px;font:700 .74rem/1.4 system-ui;color:#526782}
 .ad-trail button{border:0;border-radius:5px;padding:5px 7px;
   background:transparent;color:#245782;font:inherit;cursor:pointer}
 .ad-trail button:hover{background:#edf3f9}
 .ad-trail strong{color:#18334f}
 .ad-stage-explainer{font-size:.74rem;margin:0 0 9px}
 .ad-drill-panel,.ad-drill-scrim{display:none!important}
 @media(max-width:750px){
   .ad-metadata{margin-bottom:7px;padding:7px 0}
   .ad-trail{font-size:.69rem}
   .ad-stage-explainer{font-size:.69rem}
 }`;
 root.append(style);
 const tabs=mk("div","ad-tabs");
 const tabButtons={};
 for(const [key,name] of [["ministries","Ministerios"],["regions","Comunidades autónomas"]]){
  const b=mk("button","",name);b.type="button";b.setAttribute("role","tab");
  b.onclick=()=>{mode=key;selectedGroup=null;selectedLeaf=null;selectedClass=null;render();};
  tabs.append(b);tabButtons[key]=b;
 }
 tabs.setAttribute("role","tablist");
 const embedded=Boolean(options.embedded);
 if(embedded)root.classList.add("ad-embedded");
 if(!embedded)root.append(tabs);
 const chooser=mk("div","ad-chooser");
 const selwrap=mk("div");
 const selLabel=mk("label","","Seleccionar administración");
 const select=mk("select");
 select.id="ad-entity-select";selLabel.htmlFor=select.id;
 selwrap.append(selLabel,select);
 const period=mk("aside");chooser.append(selwrap,period);
 if(!embedded)root.append(chooser);
 const metadata=mk("div","ad-metadata");
 const graphic=mk("div","ad-flow-wrap");
 const actions=mk("div","ad-actions");
 const stage=mk("div","ad-stage");
 const trail=mk("nav","ad-trail");
 trail.setAttribute("aria-label","Ruta del desglose seleccionado");
 const drawer=mk("aside","ad-drill-panel");
 drawer.id="ad-drill-panel";
 drawer.tabIndex=-1;
 drawer.setAttribute("role","region");
 drawer.setAttribute("aria-label","Desglose de la partida seleccionada");
 drawer.hidden=true;
 const scrim=mk("button","ad-drill-scrim");
 scrim.type="button";
 scrim.setAttribute("aria-label","Cerrar el detalle y volver al Sankey");
 scrim.hidden=true;
 const note=mk("p","ad-footnote");
 stage.append(graphic);
 root.append(metadata,actions,trail,stage,note);
 const params=new URLSearchParams(window.location.search);
 let mode=options.mode==="regions"?"regions":options.mode==="ministries"?"ministries":params.get("tipo")==="ccaa"?"regions":"ministries",selectedGroup=null;
 let selectedLeaf=null,selectedClass=null;
 let selectedIds={ministries:null,regions:null};
 if(options.selectedId!=null)selectedIds[mode]=String(options.selectedId);
 else if(params.has("id") && !embedded)selectedIds[mode]=params.get("id");
 select.addEventListener("change",()=>{selectedIds[mode]=select.value;selectedGroup=null;selectedLeaf=null;selectedClass=null;render();});
 function drawFlow(subject,branches){
  // Un solo Sankey horizontal: sin drawer ni atribuir importes no publicados.
  const rowStep=52,nodeH=43,toX=774,nodeW=390,areaX=1260,leafX=1746,endX=2232;
  const isMinistry=mode==="ministries",area=drillGroup(subject);
  const nextRows=area?(isMinistry?[...area.items].sort((a,b)=>
    a.code.localeCompare(b.code,"es",{numeric:true})):
    (data.cofog_group_labels?.[area.code]||[])):[];
  const currentLeaf=selectedLeaf&&nextRows.some(x=>x.code===selectedLeaf.code)?
    nextRows.find(x=>x.code===selectedLeaf.code):null;
  const classes=!isMinistry&&currentLeaf?cofogsBelow(currentLeaf.code):[];
  const pickedClass=classes.find(x=>x.code===selectedClass)||null;
  const W=isMinistry?(currentLeaf?endX-30:area?leafX+nodeW+45:1190):
    (pickedClass?endX+nodeW+50:currentLeaf?leafX+nodeW+45:
      area?areaX+nodeW+45:1190);
  const H=Math.max(660,96+branches.length*rowStep,
    120+nextRows.length*54,120+classes.length*54);
  const el=svg("svg",{class:"ad-flow",viewBox:"0 0 "+W+" "+H,
    role:"img","aria-label":"Árbol horizontal de "+subject.name});
  const level=pickedClass?"clase":currentLeaf?
    isMinistry?"programa":"subfuncion":area?
    isMinistry?"area":"funcion":"general";
  el.dataset.drillLevel=level;
  el.dataset.selectedGroup=selectedGroup||"";
  el.dataset.selectedLeaf=currentLeaf?.code||"";
  el.dataset.selectedClass=pickedClass?.code||"";
  const scale=Math.max(1,(graphic.clientWidth||1190)/1190);
  el.style.width=Math.round(W*scale)+"px";
  el.style.minWidth=Math.round(W*scale)+"px";
  const cy=H/2,fromX=15,midX=460,sourceW=395,midW=270;
  const total=Number(subject.total_mill_eur);
  const sum=branches.reduce((s,b)=>s+Number(b.value_mill_eur),0);
  if(Math.abs(sum-total)>0.15)
    throw Error("Sankey no conciliado: "+subject.name+" "+sum+" != "+total);
  const put=(parent,x,y,content,cls,attrs={})=>{
    const t=svg("text",{x,y,class:cls,...attrs});t.textContent=content;parent.append(t);
  };
  const caption=(x,v)=>put(el,x,25,v,"ad-inline-heading");
  caption(fromX,isMinistry?"ORIGEN · PGE 2025-P":"ORIGEN · IGAE 2024");
  caption(midX,isMinistry?"SECCIÓN MINISTERIAL":"ADMINISTRACIÓN REGIONAL");
  caption(toX,isMinistry?"ÁREAS DE GASTO":"FUNCIONES COFOG");
  if(area)caption(areaX,isMinistry?"PROGRAMAS PRESUPUESTARIOS":"GRUPOS COFOG · SIN CIFRA");
  if(currentLeaf)caption(leafX,isMinistry?"PROGRAMA · FUENTE":"CLASES COFOG · SIN CIFRA");
  if(pickedClass)caption(endX,"FIN DE LA CLASIFICACIÓN COFOG");
  const mainH=Math.min(165,Math.max(90,branches.length*18));
  el.append(svg("path",{d:"M "+(fromX+sourceW)+" "+cy+" C 436 "+cy+
    " 440 "+cy+" "+midX+" "+cy,class:"ad-flow-path",
    "stroke-width":mainH*.72}));
  const branchYs=new Map();
  branches.forEach((b,i)=>{
    const y=58+i*rowStep,center=y+nodeH/2;branchYs.set(b.code,center);
    const port=cy-mainH/2+(i+.5)*mainH/branches.length;
    el.append(svg("path",{
      d:"M "+(midX+midW)+" "+port+" C "+(midX+midW+40)+" "+port+
        " "+(toX-35)+" "+center+" "+toX+" "+center,
      class:"ad-flow-path gold",
      "stroke-width":Math.max(1.2,Math.min(16,mainH*Number(b.value_mill_eur)/total))
    }));
  });
  const big=(x,w,name,amount,mid=false)=>{
    const top=cy-mainH/2,g=svg("g",{class:mid?"ad-center-root":"ad-source-root"});
    g.append(svg("rect",{x,y:top,width:w,height:mainH,rx:8,
      fill:mid?"#0b2447":"#f6f2e8",
      stroke:mid?"#0b2447":"#bfcedb"}));
    put(g,x+14,top+27,wrap(name,34)[0],"ad-big-title",
      {fill:mid?"#fff":"#0b2447"});
    put(g,x+14,top+54,money(amount),"ad-big-amount",
      {fill:mid?"#fff":"#496079"});
    el.append(g);
  };
  big(fromX,sourceW,isMinistry?"Presupuesto ministerial":"Gasto regional IGAE",total);
  big(midX,midW,subject.name,total,true);
  const node=(x,y,title,sub,code,action,selected,missing=false)=>{
    const g=svg("g",{class:"ad-branch ad-inline-node"+(missing?" is-unquantified":""),
      role:"button",tabindex:"0","data-code":code,"aria-label":title+" · "+sub});
    if(selected)g.setAttribute("aria-current","step");
    g.append(svg("rect",{x,y,width:nodeW,height:nodeH,rx:7,
      fill:selected?"#fff0cf":missing?"#eef4fa":"#f7f4ed",
      stroke:selected?"#9b752f":"#c5d3df",
      "stroke-width":selected?2.6:1.2}));
    put(g,x+11,y+17,wrap(title,46)[0]||"","ad-branch-name");
    put(g,x+11,y+35,sub,"ad-branch-value");
    const tip=svg("title");tip.textContent=title+" · "+sub;g.append(tip);
    g.addEventListener("click",action);
    g.addEventListener("keydown",ev=>{
      if(ev.key==="Enter"||ev.key===" "){ev.preventDefault();action();}
    });
    el.append(g);
  };
  for(const b of branches){
    node(toX,branchYs.get(b.code)-nodeH/2,b.code+" · "+b.name,
      money(b.value_mill_eur),b.code,()=>openBranch(b),selectedGroup===b.code);
  }
  const distributed=(items,anchor,h=43,gap=54)=>{
    const span=items.length*gap-(gap-h);
    const y0=Math.max(58,Math.min(anchor-span/2,H-span-35));
    return items.map((item,i)=>({item,y:y0+i*gap,cy:y0+i*gap+h/2}));
  };
  let focus=toX;
  if(area){
    const yParent=branchYs.get(selectedGroup),children=distributed(nextRows,yParent);
    for(const n of children){
      const child=n.item;
      el.append(svg("path",{d:"M "+(toX+nodeW)+" "+yParent+
        " C "+(toX+nodeW+55)+" "+yParent+" "+(areaX-55)+" "+
        n.cy+" "+areaX+" "+n.cy,
        class:isMinistry?"ad-inline-ribbon":"ad-inline-dashed",
        "data-source-code":selectedGroup,
        "stroke-width":isMinistry?
          Math.max(1.2,Math.min(10,Number(child.value_mill_eur)/
            Number(area.value_mill_eur)*24)):1.5}));
      node(areaX,n.y,child.code+" · "+child.name,
        isMinistry?money(child.value_mill_eur):
          "Clasificación ONU · importe regional no publicado",
        child.code,()=>openLeaf(child),currentLeaf?.code===child.code,!isMinistry);
    }
    focus=areaX;
    if(currentLeaf){
      const anchor=children.find(x=>x.item.code===currentLeaf.code).cy;
      if(isMinistry){
        const top=Math.max(58,Math.min(anchor-40,H-125));
        el.append(svg("path",{d:"M "+(areaX+nodeW)+" "+anchor+
          " C "+(areaX+nodeW+45)+" "+anchor+" "+(leafX-45)+" "+
          (top+56)+" "+leafX+" "+(top+56),class:"ad-inline-ribbon",
          "stroke-width":2,"data-source-code":currentLeaf.code}));
        const card=svg("g",{class:"ad-inline-terminal"});
        card.append(svg("rect",{x:leafX,y:top,width:nodeW,height:113,rx:8}));
        put(card,leafX+12,top+22,
          currentLeaf.code+" · "+wrap(currentLeaf.name,38)[0],"ad-branch-name");
        put(card,leafX+12,top+47,money(currentLeaf.value_mill_eur),"ad-branch-value");
        put(card,leafX+12,top+68,"Crédito PGE · no gasto ejecutado","ad-branch-value");
        const link=sourceAnchor(subject.source_url,"Fuente");
        if(link){
          const a=svg("a",{href:link.href,target:"_blank",rel:"noopener noreferrer"});
          put(a,leafX+12,top+94,"Consultar fuente oficial ↗","ad-terminal-link");
          card.append(a);
        }
        el.append(card);
      }else{
        for(const n of distributed(classes,anchor)){
          el.append(svg("path",{d:"M "+(areaX+nodeW)+" "+anchor+
            " C "+(areaX+nodeW+60)+" "+anchor+" "+(leafX-60)+" "+
            n.cy+" "+leafX+" "+n.cy,
            class:"ad-inline-dashed","data-source-code":currentLeaf.code}));
          node(leafX,n.y,n.item.code+" · "+n.item.title,
            "Clase ONU · sin importe regional desglosado",
            n.item.code,()=>openClass(n.item),selectedClass===n.item.code,true);
        }
      }
      focus=leafX;
      if(pickedClass){
        const yClass=distributed(classes,anchor).find(n=>
          n.item.code===pickedClass.code).cy;
        const top=Math.max(59,Math.min(yClass-35,H-125));
        el.append(svg("path",{d:"M "+(leafX+nodeW)+" "+yClass+
          " C "+(leafX+nodeW+45)+" "+yClass+" "+(endX-45)+" "+
          (top+48)+" "+endX+" "+(top+48),
          class:"ad-inline-dashed","data-source-code":pickedClass.code}));
        const last=svg("g",{class:"ad-inline-terminal"});
        last.append(svg("rect",{x:endX,y:top,width:nodeW,height:106,rx:8}));
        put(last,endX+12,top+24,"Último nivel de clasificación COFOG","ad-branch-name");
        put(last,endX+12,top+49,"Sin importe autonómico desglosado","ad-branch-value");
        const url=safeLink(subject.source_url);
        if(url){
          const a=svg("a",{href:url,target:"_blank",rel:"noopener noreferrer"});
          put(a,endX+12,top+76,"Consultar fuente IGAE ↗","ad-terminal-link");
          last.append(a);
        }
        el.append(last);focus=endX;
      }
    }
  }
  el.dataset.focusX=String(focus);
  return el;
 }

 function getChosen(){
   return (data[mode]||[]).find(x=>x.id===selectedIds[mode])||null;
 }
 function sourceAnchor(url,title){
   const safe=safeLink(url);
   if(!safe)return null;
   const link=mk("a","ad-source",title);
   link.href=safe;link.target="_blank";link.rel="noopener noreferrer";
   return link;
 }
 function drillGroup(chosen){
   if(!chosen||!selectedGroup)return null;
   return mode==="ministries"
     ? groupMinistry(chosen.flows).find(x=>x.code===selectedGroup)||null
     : chosen.flows.find(x=>x.code===selectedGroup)||null;
 }
 function closeDrill(){
   selectedGroup=null;selectedLeaf=null;selectedClass=null;
   render();
 }
 scrim.addEventListener("click",closeDrill);
 root.addEventListener("keydown",ev=>{
   if(ev.key==="Escape"&&!drawer.hidden){ev.preventDefault();closeDrill();}
 });
 function openBranch(branch){
   if(selectedGroup===branch.code){
     selectedGroup=null;selectedLeaf=null;selectedClass=null;
   }else{
     selectedGroup=branch.code;selectedLeaf=null;selectedClass=null;
   }
   render();
 }
 function openLeaf(branch){
   if(selectedLeaf?.code===branch.code){
     selectedLeaf=null;selectedClass=null;
   }else{
     selectedLeaf=branch;selectedClass=null;
   }
   render();
 }
 function openClass(node){
   selectedClass=selectedClass===node.code?null:node.code;
   render();
 }
 function renderTrail(chosen){
   trail.replaceChildren();
   if(!chosen||!selectedGroup){trail.hidden=true;return;}
   trail.hidden=false;
   const crumb=(text,action)=>{
     if(trail.childNodes.length)trail.append(mk("span","ad-crumb-sep","›"));
     if(action){
       const b=mk("button","",text);b.type="button";b.addEventListener("click",action);
       trail.append(b);
     }else trail.append(mk("strong","",text));
   };
   crumb(chosen.name,closeDrill);
   const group=drillGroup(chosen);
   if(group)crumb(group.code+" · "+group.name,selectedLeaf?()=>{
     selectedLeaf=null;selectedClass=null;render();
   }:null);
   if(selectedLeaf)crumb(selectedLeaf.code+" · "+selectedLeaf.name,
     selectedClass?()=>{selectedClass=null;render();}:null);
   if(selectedClass)crumb(selectedClass,null);
 }
 function sectionLinks(chosen,body){
   const links=mk("div","ad-official-links");
   const original=sourceAnchor(chosen.source_url,
      mode==="ministries"?"Consultar tabla ministerial en Hacienda":
      "Consultar tabla autonómica COFOG en IGAE");
   if(original)links.append(original);
   if(mode==="regions"){
     // These are alternative classification routes, not numeric children.
     const a=mk("a","ad-source","Consultar presupuestos y programas autonómicos en Hacienda");
     a.href="https://serviciostelematicosext.hacienda.gob.es/SGCIEF/PublicacionPresupuestos/aspx/inicio.aspx";
     a.rel="noopener noreferrer";a.target="_blank";
     links.append(a);
   }
   body.append(links);
 }
 function renderDrawer(){
   const chosen=getChosen(),group=drillGroup(chosen);
   const open=Boolean(chosen&&group);
   root.dataset.drillLevel=open?(selectedLeaf?"terminal":"detalle"):"general";
   root.dataset.drillCode=open?(selectedLeaf?.code||selectedGroup):"";
   stage.classList.toggle("is-drilling",open);
   drawer.hidden=!open;
   scrim.hidden=!open;
   drawer.replaceChildren();
   // Highlight the branch in the original SVG instead of removing it.
   for(const node of graphic.querySelectorAll(".ad-branch")){
     node.setAttribute("aria-pressed",
       String(open&&node.dataset.code===selectedGroup));
   }
   if(!open)return;

   const header=mk("div","ad-drill-head");
   const title=mk("div");
   title.append(mk("div","ad-drill-heading","Explorar el desglose"));
   title.append(mk("small","",chosen.name+" · "+chosen.year_label));
   const close=mk("button","ad-drill-close","×");close.type="button";
   close.setAttribute("aria-label","Cerrar el desglose y mantener el Sankey");
   close.addEventListener("click",closeDrill);
   header.append(title,close);
   const body=mk("div","ad-drill-body");
   const crumbs=mk("nav","ad-breadcrumbs");
   crumbs.setAttribute("aria-label","Ruta de la partida");
   const back=mk("button","","Vista general");
   back.type="button";back.onclick=closeDrill;crumbs.append(back);
   crumbs.append(mk("span","ad-crumb-sep","›"));
   if(selectedLeaf){
     const section=mk("button","",group.name);
     section.type="button";section.onclick=()=>{
       selectedLeaf=null;renderDrawer();
     };
     crumbs.append(section,mk("span","ad-crumb-sep","›"));
     crumbs.append(mk("strong","",selectedLeaf.name));
   }else{
     crumbs.append(mk("strong","",group.name));
   }
   body.append(crumbs);
   const detail=mk("section","ad-drill-section");
   if(selectedLeaf){
     const item=selectedLeaf;
     const panel=mk("div","ad-drill-final");
     panel.append(mk("span","ad-drill-kicker",mode==="ministries"?
       "Último programa cuantificado en la fuente":"Subfunción COFOG · importe no publicado en esta fuente"));
     panel.append(mk("h3","",item.code+" · "+item.name));
     if(mode==="ministries"){
       panel.append(mk("strong","ad-drill-total",money(item.value_mill_eur)));
       panel.append(mk("p","",
         "Crédito presupuestario del programa "+item.code+" ("+chosen.year_label+
         "). No son pagos ni obligaciones reconocidas. Para capítulos económicos, contratos y ejecución detallada es necesario consultar las fuentes oficiales correspondientes."));
     }else{
       panel.append(mk("strong","ad-drill-total","Importe territorial no disponible"));
       panel.append(mk("p","",
         "La serie autonómica COFOG 2024 publica el importe de la función "+
         group.code+" ("+money(group.value_mill_eur)+"), pero no desglosa cuánto "+
         "corresponde a "+item.name+" ("+item.code+"). No se atribuye ninguna "+
         "parte del total autonómico sin datos verificables."));
     }
     detail.append(panel);
   }else if(mode==="ministries"){
     detail.append(mk("span","ad-drill-kicker","Área de gasto · siguiente nivel"));
     detail.append(mk("h3","",group.name));
     detail.append(mk("strong","ad-drill-total",money(group.value_mill_eur)));
     detail.append(mk("p","",
       "Selecciona un programa presupuestario real del área. Los importes "+
       "suman el total de esta rama y no son gasto ejecutado."));
     detail.append(mk("h4","","Programas presupuestarios"));
     const list=mk("div","ad-drill-options");
     const programs=[...group.items].sort((a,b)=>
       b.value_mill_eur-a.value_mill_eur);
     for(const item of programs){
       const button=mk("button","ad-drill-option");
       button.type="button";button.dataset.programCode=item.code;
       const name=mk("span","",item.code+" · "+item.name);
       const amount=mk("strong","",money(item.value_mill_eur));
       button.append(name,amount);
       button.addEventListener("click",()=>openLeaf(item));
       list.append(button);
     }
     detail.append(list);
   }else{
     detail.append(mk("span","ad-drill-kicker","Función COFOG · desglose territorial"));
     detail.append(mk("h3","",group.code+" · "+group.name));
     detail.append(mk("strong","ad-drill-total",money(group.value_mill_eur)));
     detail.append(mk("p","",
       "Importe contabilizado para esta función en "+chosen.name+
       ". Las subfunciones siguientes corresponden a la clasificación "+
       "COFOG oficial, pero la fuente autonómica utilizada no publica "+
       "importes individuales para ellas."));
     const groups=Array.isArray(data.cofog_group_labels?.[selectedGroup])?
       data.cofog_group_labels[selectedGroup]:[];
     if(groups.length){
       detail.append(mk("h4","","Subfunciones oficiales · sin importes autonómicos"));
       const list=mk("div","ad-drill-options");
       for(const item of groups){
         const button=mk("button","ad-subgroup",item.code+" · "+item.name);
         button.type="button";
         button.setAttribute("aria-label",
           "Explorar subfunción "+item.code+" · "+item.name+
           "; importe autonómico no disponible");
         button.addEventListener("click",()=>openLeaf(item));
         list.append(button);
       }
       detail.append(list);
     }else{
       detail.append(mk("p","",
         "No existen subfunciones verificadas en el índice para esta función. "+
         "Consulta la fuente oficial para continuar."));
     }
   }
   body.append(detail);
   sectionLinks(chosen,body);
   drawer.append(header,body);
   // Keep the same SVG node throughout drilling. Only the drawer is replaced.
   drawer.scrollTop=0;
 }
 function render(){
   if(!embedded)tabs.querySelectorAll("button").forEach(x=>
     x.setAttribute("aria-selected",String(x===tabButtons[mode])));
   select.replaceChildren();
   const list=data[mode]||[];
   if(!selectedIds[mode]||!list.some(x=>x.id===selectedIds[mode]))
     selectedIds[mode]=list[0]?.id||null;
   for(const entity of list){
     const option=mk("option","",entity.name);
     option.value=entity.id;option.selected=entity.id===selectedIds[mode];
     select.append(option);
   }
   const chosen=getChosen();
   period.textContent=chosen?.year_label||"No hay importes oficiales cargados";
   root.dataset.administrationMode=mode;
   root.dataset.administrationId=chosen?.id||"";
   metadata.replaceChildren();graphic.replaceChildren();actions.replaceChildren();
   if(!chosen||!chosen.verified||!Array.isArray(chosen.flows)||!chosen.flows.length){
     trail.hidden=true;
     graphic.append(mk("p","ad-empty",
       "No hay importes oficiales conciliados para esta administración."));
     note.textContent="La ausencia de información no significa gasto cero.";
     return;
   }
   const title=mk("div"),h2=mk("h2","",chosen.name);
   title.append(h2,mk("p","",chosen.year_label+" · "+chosen.amount_kind));
   metadata.append(title,mk("strong","",money(chosen.total_mill_eur)));
   graphic.append(mk("p","ad-stage-explainer",
     "Pulsa una rama para ampliar el árbol hacia la derecha. Desliza horizontalmente para explorar."));
   graphic.append(drawFlow(chosen,
     mode==="ministries"?groupMinistry(chosen.flows):chosen.flows));
   const source=sourceAnchor(chosen.source_url,"Consultar documento original del organismo");
   if(source)actions.append(source);
   note.textContent=chosen.note+" "+data.not_comparable;
   root.dataset.drillLevel=selectedClass?"clase":selectedLeaf?
     mode==="ministries"?"programa":"subfuncion":selectedGroup?
     mode==="ministries"?"area":"funcion":"general";
   root.dataset.drillCode=selectedClass||selectedLeaf?.code||selectedGroup||"";
   renderTrail(chosen);
   const graph=graphic.querySelector("svg.ad-flow");
   if(graph && selectedGroup){
     const zoom=Math.max(1,graphic.clientWidth/1190);
     const focus=Number(graph.dataset.focusX)||774;
     requestAnimationFrame(()=>graphic.scrollTo({
       left:Math.max(0,focus*zoom-graphic.clientWidth*.55),
       behavior:"smooth"
     }));
   }else if(graph)requestAnimationFrame(()=>{graphic.scrollLeft=0;});
 }
 // Direct links are reproducible, but the complete original Sankey is kept.
 if(!embedded){
   const code=params.get("codigo"),level=params.get("nivel");
   const selected=(data[mode]||[]).find(x=>x.id===selectedIds[mode]);
   if(selected&&code&&level){
     if(mode==="ministries"){
       const group=groupMinistry(selected.flows);
       if(level==="area"&&group.some(x=>x.code===code))
         selectedGroup=code;
       else if(level==="programa"){
         const program=selected.flows.find(x=>x.code===code);
         if(program){
           selectedGroup=program.code.charAt(0);
           selectedLeaf=program;
         }
       }
     }else{
       if(level==="funcion"&&selected.flows.some(x=>x.code===code))
         selectedGroup=code;
       else if(level==="subfuncion"){
         const matches=Object.entries(data.cofog_group_labels||{}).
           flatMap(([parent,items])=>items.map(item=>({...item,parent})));
         const item=matches.find(x=>x.code===code);
         if(item&&selected.flows.some(x=>x.code===item.parent)){
           selectedGroup=item.parent;selectedLeaf=item;
         }
       }else if(level==="clase"){
         const parentCode=code.split(".")[0];
         const parentGroup=code.slice(0,code.lastIndexOf("."));
         const cls=cofogsBelow(parentGroup).find(x=>x.code===code);
         const groupItem=(data.cofog_group_labels?.[parentCode]||[])
           .find(x=>x.code===parentGroup);
         if(cls&&groupItem&&selected.flows.some(x=>x.code===parentCode)){
           selectedGroup=parentCode;selectedLeaf=groupItem;selectedClass=code;
         }
       }
     }
   }
 }

 render();return root;
}
