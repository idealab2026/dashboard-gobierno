/* Interactive ministry and regional Sankeys, backed only by reconciled official amounts. */
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
 root.append(style);
 const tabs=mk("div","ad-tabs");
 const tabButtons={};
 for(const [key,name] of [["ministries","Ministerios"],["regions","Comunidades autónomas"]]){
  const b=mk("button","",name);b.type="button";b.setAttribute("role","tab");
  b.onclick=()=>{mode=key;selectedGroup=null;selectedLeaf=null;render();};
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
 let selectedLeaf=null;
 let selectedIds={ministries:null,regions:null};
 if(options.selectedId!=null)selectedIds[mode]=String(options.selectedId);
 else if(params.has("id") && !embedded)selectedIds[mode]=params.get("id");
 select.addEventListener("change",()=>{selectedIds[mode]=select.value;selectedGroup=null;selectedLeaf=null;render();});
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
    g.dataset.code=b.code;
    g.addEventListener("click",()=>openBranch(b));
    g.addEventListener("keydown",ev=>{if(ev.key==="Enter"||ev.key===" "){
      ev.preventDefault();openBranch(b);
    }});
    const tip=svg("title");tip.textContent=b.name+" · "+money(b.value_mill_eur);
    g.append(tip);el.append(g);
  }
  return el;
 }
 function reveal(){
   // El gráfico anterior puede ser mucho más alto; mantener el nivel nuevo visible.
   if(typeof graphic.scrollIntoView==="function")
     graphic.scrollIntoView({block:"nearest",behavior:"instant"});
 }
 function sourceAnchor(url,title){
   const safe=safeLink(url);
   if(!safe)return null;
   const link=mk("a","ad-source",title);
   link.href=safe;link.target="_blank";link.rel="noopener noreferrer";
   return link;
 }
 function showFinal(chosen,branch,kind){
   selectedLeaf=branch;
   render();
   reveal();
 }
 function openBranch(branch){
   const chosen=(data[mode]||[]).find(x=>x.id===selectedIds[mode]);
   if(!chosen)return;
   if(mode==="ministries"){
     if(!selectedGroup){selectedGroup=branch.code;selectedLeaf=null;render();}
     else showFinal(chosen,branch,"programa");
   }else{
     if(!selectedGroup){selectedGroup=branch.code;selectedLeaf=null;render();}
     else showFinal(chosen,branch,"subfuncion");
   }
   reveal();
 }
 function addInfo(text,style="ad-terminal-info"){
   const p=mk("p",style,text);
   graphic.append(p);return p;
 }
 function addOfficialLinks(chosen){
   const links=mk("div","ad-official-links");
   const original=sourceAnchor(chosen.source_url,mode==="ministries"?
      "Presupuestos oficiales de este ministerio":"COFOG oficial de la comunidad autónoma (IGAE, 2024)");
   if(original)links.append(original);
   if(mode==="regions"){
     const a=mk("a","ad-source","Presupuestos autonómicos por programas (Hacienda, 2026)");
     a.href="https://serviciostelematicosext.hacienda.gob.es/SGCIEF/PublicacionPresupuestos/aspx/inicio.aspx";
     a.rel="noopener noreferrer";a.target="_blank";links.append(a);
     const b=mk("a","ad-source","Clasificación COFOG: definición de funciones y grupos");
     b.href="https://www.hacienda.gob.es/es-ES/CDI/Paginas/ContabilidadNacional/COFOG/Clasificacion-funcional-del-gasto-de-las-Administraciones-Publicas.aspx";
     b.rel="noopener noreferrer";b.target="_blank";links.append(b);
   }
   if(links.children.length)graphic.append(links);
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
   root.dataset.drillLevel=selectedLeaf?"terminal":selectedGroup?"detalle":"general";
   root.dataset.drillCode=selectedLeaf?.code||selectedGroup||"";
   metadata.replaceChildren();graphic.replaceChildren();actions.replaceChildren();details.replaceChildren();
   if(!chosen||!chosen.verified||!Array.isArray(chosen.flows)||!chosen.flows.length){
     graphic.append(mk("p","ad-empty","No se ha validado todavía una cifra oficial conciliada para esta administración. No se representa un Sankey sin datos."));
     note.textContent="La ausencia de desglose no implica gasto cero.";
     return;
   }
   const title=mk("div"),h2=mk("h2","",chosen.name);
   const p=mk("p","",chosen.year_label+" · "+chosen.amount_kind);
   title.append(h2,p);metadata.append(title,mk("strong","",money(chosen.total_mill_eur)));
   const crumbs=mk("nav","ad-breadcrumbs");crumbs.setAttribute("aria-label","Ruta del desglose");
   const home=mk("button","ad-crumb","Vista general");
   home.type="button";home.onclick=()=>{selectedGroup=null;selectedLeaf=null;render();};
   crumbs.append(home);
   let groupInfo=null;
   if(selectedGroup){
     if(mode==="ministries"){
       groupInfo=groupMinistry(chosen.flows).find(x=>x.code===selectedGroup);
     }else{
       groupInfo=chosen.flows.find(x=>x.code===selectedGroup);
     }
     if(!groupInfo){selectedGroup=null;selectedLeaf=null;return render();}
     const level=mk("button","ad-crumb",groupInfo.name);
     level.type="button";level.onclick=()=>{selectedLeaf=null;render();};
     crumbs.append(mk("span","ad-crumb-sep","›"),level);
   }
   if(selectedLeaf)crumbs.append(mk("span","ad-crumb-sep","›"),
     mk("strong","ad-crumb-last",selectedLeaf.name));
   actions.append(crumbs);
   const cta=sourceAnchor(chosen.source_url,"Fuente original");
   if(cta)actions.append(cta);
   if(selectedLeaf){
     const final=mk("section","ad-terminal");
     const top=mk("div","ad-terminal-header");
     top.append(mk("span","ad-terminal-kicker",
       mode==="ministries"?"Último nivel cuantificado disponible · programa":"Subfunción COFOG · sin importe autonómico publicado aquí"));
     top.append(mk("h3","",selectedLeaf.code+" · "+selectedLeaf.name));
     if(mode==="ministries"){
       top.append(mk("strong","ad-terminal-amount",money(selectedLeaf.value_mill_eur)));
     }else{
       top.append(mk("strong","ad-terminal-amount","Importe territorial no disponible"));
     }
     final.append(top);
     const text=mode==="ministries"?
       "Crédito presupuestario del programa "+selectedLeaf.code+" en "+chosen.year_label+
       ". Este es el último nivel con importe verificado en la tabla ministerial cargada. Para capítulos económicos, partidas detalladas, ejecución y contratos debe consultarse la documentación oficial correspondiente. No son pagos ni obligaciones reconocidas.":
       "La subfunción "+selectedLeaf.code+" pertenece a "+groupInfo.name+
       ". La serie autonómica COFOG 2024 utilizada aquí publica el importe de la función "+groupInfo.code+
       " ("+money(groupInfo.value_mill_eur)+"), pero no desglosa ese total por subfunción. Por tanto, no puede deducirse cuánto corresponde a "+selectedLeaf.name+".";
     final.append(mk("p","",text));graphic.append(final);
     addOfficialLinks(chosen);
     note.textContent=chosen.note+" "+data.not_comparable;
     return;
   }
   if(selectedGroup && mode==="regions"){
     const panel=mk("section","ad-region-drill");
     panel.append(mk("h3","",groupInfo.code+" · "+groupInfo.name+" · "+money(groupInfo.value_mill_eur)));
     panel.append(mk("p","","Último nivel con importe territorial de esta serie IGAE: función COFOG. Puedes explorar las subfunciones oficiales, pero sus importes individuales no se publican aquí. No se reparte proporcionalmente el total regional."));
     graphic.append(panel);
     const groups=Array.isArray(data.cofog_group_labels?.[selectedGroup])?
         data.cofog_group_labels[selectedGroup]:[];
     if(groups.length){
       const title=mk("h4","ad-next-title","Subfunciones oficiales · estructura, sin importes autonómicos");
       graphic.append(title);
       const list=mk("div","ad-subgroups");
       for(const item of groups){
         const b=mk("button","ad-subgroup",item.code+" · "+item.name);
         b.type="button";b.setAttribute("aria-label","Explorar subfunción "+item.code+" "+item.name+"; importe autonómico no disponible");
         b.onclick=()=>showFinal(chosen,item,"subfuncion");
         list.append(b);
       }
       graphic.append(list);
     }else{
       addInfo("La fuente autonómica 2024 no permite profundizar más en esta función con importes verificados.");
     }
     addOfficialLinks(chosen);
     note.textContent=chosen.note+" "+data.not_comparable;
     return;
   }
   if(selectedGroup && mode==="ministries"){
     const programs=groupInfo.items;
     if(!programs?.length)throw Error("Sin programas oficiales en el área");
     const sectionTotal=groupInfo.value_mill_eur;
     const intro=mk("p","ad-stage-explainer",
       "Área "+groupInfo.name+" · "+money(sectionTotal)+". Cada rama siguiente es un programa presupuestario real de este ministerio; pulsa para ver su importe y documento oficial.");
     graphic.append(intro);
     graphic.append(drawFlow({
         name:groupInfo.name,total_mill_eur:sectionTotal
       },programs));
     note.textContent="Los programas suman exactamente el área seleccionada. "+
       chosen.note+" "+data.not_comparable;
     return;
   }
   const rootBranches=mode==="ministries"?groupMinistry(chosen.flows):chosen.flows;
   graphic.append(drawFlow(chosen,rootBranches));
   const descriptor=mk("p","ad-stage-explainer",
     mode==="ministries"?
      "Pulsa un área de gasto para ver sus programas; después pulsa un programa para abrir su ficha.":
      "Pulsa una función COFOG para conocer su desglose documental disponible. Las subfunciones sin importes autonómicos se identificarán expresamente.");
   graphic.prepend(descriptor);
   note.textContent=chosen.note+" "+data.not_comparable;
 }
 // Enlace reproducible para comprobar en navegador niveles concretos, sin
 // simular un clic ni alterar cifras: ?nivel=funcion&codigo=07, etc.
 if(!embedded){
   const code=params.get("codigo"),level=params.get("nivel");
   const selected=(data[mode]||[]).find(x=>x.id===selectedIds[mode]);
   if(selected && code && level){
     if(mode==="ministries"){
       const area=groupMinistry(selected.flows);
       if(level==="area" && area.some(x=>x.code===code))selectedGroup=code;
       if(level==="programa"){
         const program=selected.flows.find(x=>x.code===code);
         if(program){selectedGroup=program.code.charAt(0);selectedLeaf=program;}
       }
     }else{
       if(level==="funcion" && selected.flows.some(x=>x.code===code))selectedGroup=code;
       if(level==="subfuncion"){
         const groups=Object.entries(data.cofog_group_labels||{}).flatMap(([parent,items])=>
           items.map(item=>({...item,parent})));
         const found=groups.find(x=>x.code===code);
         if(found && selected.flows.some(x=>x.code===found.parent)){
           selectedGroup=found.parent;selectedLeaf=found;
         }
       }
     }
   }
 }

 render();return root;
}
