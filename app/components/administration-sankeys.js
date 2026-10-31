/* Interactive ministry and regional Sankeys, backed only by reconciled official amounts. */
const ns="http://www.w3.org/2000/svg";
const nf=new Intl.NumberFormat("es-ES",{maximumFractionDigits:1});
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
 @media(max-width:700px){.ad-chooser{grid-template-columns:1fr}.ad-chooser aside{text-align:left}.ad-details{grid-template-columns:1fr}.ad-tabs button{flex:1;font-size:.79rem}.ad-flow{min-width:730px}.ad-metadata strong{font-size:1.1rem}}
 `;
 root.append(style);
 const tabs=mk("div","ad-tabs");
 const tabButtons={};
 for(const [key,name] of [["ministries","Ministerios"],["regions","Comunidades autónomas"]]){
  const b=mk("button","",name);b.type="button";b.setAttribute("role","tab");
  b.onclick=()=>{mode=key;selectedGroup=null;render();};
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
 const details=mk("div","ad-details");
 const note=mk("p","ad-footnote");
 root.append(metadata,graphic,actions,details,note);
 const params=new URLSearchParams(window.location.search);
 let mode=options.mode==="regions"?"regions":options.mode==="ministries"?"ministries":params.get("tipo")==="ccaa"?"regions":"ministries",selectedGroup=null;
 let selectedIds={ministries:null,regions:null};
 if(options.selectedId!=null)selectedIds[mode]=String(options.selectedId);
 else if(params.has("id") && !embedded)selectedIds[mode]=params.get("id");
 select.addEventListener("change",()=>{selectedIds[mode]=select.value;selectedGroup=null;render();});
 function drawFlow(subject,branches){
  const W=1200,rowH=48,top=42,bottom=35;
  const H=Math.max(370,top+branches.length*rowH+bottom);
  const el=svg("svg",{class:"ad-flow",viewBox:`0 0 ${W} ${H}`,role:"img","aria-label":"Diagrama Sankey de "+subject.name});
  const defs=svg("defs");el.append(defs);
  const fromX=15,midX=460,toX=775,nodeW=395,h=39;
  const total=Number(subject.total_mill_eur);
  // Ribbons are proportional to the same verified consolidated total, and
  // visually spaced for legibility. Width floors are graphic only.
  const sum=branches.reduce((x,b)=>x+Number(b.value_mill_eur),0);
  if(Math.abs(sum-total)>0.15)throw Error("Sankey no conciliado: "+subject.name+" "+sum+" != "+total);
  const boxHeight=Math.min(165,Math.max(90,branches.length*18));
  const cy=H/2;
  const drawBox=(x,y,width,height,title,value,isMiddle=false)=>{
    const group=svg("g");
    group.append(svg("rect",{x,y,width,height,rx:9,fill:isMiddle?"#0b2447":"#f6f2e8",stroke:isMiddle?"#0b2447":"#bfcedb"}));
    const t=svg("text",{x:x+14,y:y+27,"font-size":isMiddle?17:14,"font-weight":800,fill:isMiddle?"#fff":"#0b2447"});t.textContent=title;group.append(t);
    const v=svg("text",{x:x+14,y:y+54,"font-size":isMiddle?19:14,"font-weight":750,fill:isMiddle?"#fff":"#53677f"});v.textContent=money(value);group.append(v);
    el.append(group);
  };
  // Draw source -> institution, whose amounts are exactly the same; no manufactured tax flows.
  const sourceY=cy-boxHeight/2,midY=cy-boxHeight/2;
  const flow=svg("path",{d:`M ${fromX+nodeW} ${cy} C 438 ${cy}, 438 ${cy}, ${midX} ${cy}`,
   stroke:"#c3d4e4","stroke-width":Math.max(8,boxHeight*.75),fill:"none","stroke-opacity":.8});el.append(flow);
  let start=cy-boxHeight/2;
  for(const [index,b] of branches.entries()){
    const pos=top+index*rowH;
    const width=Math.max(1.5,Math.min(17,(b.value_mill_eur/total)*boxHeight));
    const link=svg("path",{d:`M ${midX+270} ${start+boxHeight*(index+.5)/branches.length} C 765 ${start+boxHeight*(index+.5)/branches.length}, 770 ${pos+h/2}, ${toX} ${pos+h/2}`,
      class:"ad-flow-path gold","stroke-width":width});
    el.append(link);
  }
  drawBox(fromX,sourceY,nodeW,boxHeight,mode==="ministries"?"Presupuesto estatal":"Gasto regional IGAE",total);
  drawBox(midX,midY,270,boxHeight,subject.name.length>24?subject.name.slice(0,24)+"…":subject.name,total,true);
  for(const [index,b] of branches.entries()){
    const y=top+index*rowH;
    const g=svg("g",{class:"ad-branch",role:"button",tabindex:0,"aria-label":b.name+" "+money(b.value_mill_eur)});
    g.append(svg("rect",{x:toX,y,width:390,height:h,rx:7,fill:"#f7f4ed",stroke:"#cbd5df"}));
    const lines=wrap((b.code?b.code+" · ":"")+b.name,46);
    lines.forEach((line,j)=>{const t=svg("text",{x:toX+11,y:y+(lines.length===1?15:12)+j*12,class:"ad-branch-name"});t.textContent=line;g.append(t)});
    const v=svg("text",{x:toX+379,y:y+32,"text-anchor":"end",class:"ad-branch-value"});v.textContent=money(b.value_mill_eur);g.append(v);
    if(b.items) {
      g.addEventListener("click",()=>{selectedGroup=b.code;render();});
      g.addEventListener("keydown",ev=>{if(ev.key==="Enter"||ev.key===" "){ev.preventDefault();selectedGroup=b.code;render();}});
    }else{
      g.addEventListener("click",()=>showDetails(b));
      g.addEventListener("keydown",ev=>{if(ev.key==="Enter"||ev.key===" "){ev.preventDefault();showDetails(b);}});
    }
    const tip=svg("title");tip.textContent=b.name+" · "+money(b.value_mill_eur);
    g.append(tip);el.append(g);
  }
  return el;
 }
 function showDetails(branch){
  details.replaceChildren();
  const card=mk("article","ad-detail");
  card.append(mk("h3","",(branch.code?branch.code+" · ":"")+branch.name));
  card.append(mk("strong","",money(branch.value_mill_eur)));
  card.append(mk("small","",mode==="ministries"?
     "Programa presupuestario: crédito, NO obligación reconocida ni pago":"Función COFOG: gasto regional registrado, NO presupuesto"));
  const obj=(mode==="ministries"?data.ministries:data.regions).find(x=>x.id===selectedIds[mode]);
  const url=safeLink(obj?.source_url);
  if(url){const a=mk("a","","Ver la fuente oficial y sus desgloses");a.href=url;a.target="_blank";a.rel="noopener noreferrer";card.append(a);}
  details.append(card);
 }
 function render(){
  if(!embedded)tabs.querySelectorAll("button").forEach(x=>x.setAttribute("aria-selected",String(x===tabButtons[mode])));
  select.replaceChildren();
  const list=data[mode]||[];
  if(!selectedIds[mode]||!list.some(x=>x.id===selectedIds[mode]))selectedIds[mode]=list[0]?.id||null;
  for(const entity of list){const o=mk("option","",entity.name);o.value=entity.id;o.selected=entity.id===selectedIds[mode];select.append(o)}
  const chosen=list.find(x=>x.id===selectedIds[mode]);
  period.textContent=chosen?.year_label||"No hay importes oficiales cargados";
  root.dataset.administrationMode=mode;
  root.dataset.administrationId=chosen?.id||"";
  metadata.replaceChildren();graphic.replaceChildren();actions.replaceChildren();details.replaceChildren();
  if(!chosen || !chosen.verified || !Array.isArray(chosen.flows)||!chosen.flows.length){
    graphic.append(mk("p","ad-empty","No se ha validado todavía una cifra oficial conciliada para esta administración. No se representa un Sankey sin datos."));
    note.textContent="Consulta las fuentes oficiales. La falta de visualización no implica gasto cero.";
    return;
  }
  const title=mk("div"),h2=mk("h2","",chosen.name),p=mk("p","",chosen.year_label+" · "+chosen.amount_kind);
  title.append(h2,p);metadata.append(title,mk("strong","",money(chosen.total_mill_eur)));
  const source=safeLink(chosen.source_url);
  const back=mk("button","","Volver a áreas de gasto");back.type="button";back.onclick=()=>{selectedGroup=null;render();};
  if(selectedGroup && mode==="ministries")actions.append(back);
  const view=mode==="ministries"?(selectedGroup?groupMinistry(chosen.flows).find(x=>x.code===selectedGroup)?.items:groupMinistry(chosen.flows)):chosen.flows;
  if(!view||!view.length)throw Error("Subfunción vacía");
  const summary=mk("p","",mode==="ministries"?
    (selectedGroup?"Programas individuales · pulsar para consultar documentación":"Áreas de gasto · pulsa una para desplegar todos sus programas"):
    "Funciones oficiales COFOG · pulsa una para consultar su origen");
  actions.append(summary);
  graphic.append(drawFlow(chosen,selectedGroup&&mode==="ministries"
    ? [...view,{code:"RESTO",name:"Resto de programas de la sección",value_mill_eur:Math.max(0,chosen.total_mill_eur-view.reduce((a,b)=>a+b.value_mill_eur,0))}].filter(x=>x.value_mill_eur>0)
    :view));
  note.textContent=chosen.note+" "+data.not_comparable;
  if(source){const a=mk("a","ad-source","Consultar documento original del organismo");a.href=source;a.target="_blank";a.rel="noopener noreferrer";actions.append(a);}
 }
 render();return root;
}
