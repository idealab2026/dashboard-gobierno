/* IDEA LAB · gallery-first atlas. Compact, searchable previews; source graphs
 * and interactive controls mount only in the expanded dialog. No duplicate
 * numbers: previews are generated from the same official data as each graph.
 */
import {treemapLayout,editorialCofogGroups} from "./cofog-treemap.js";
import {pensionSeries,salariesByYear,housingSeries} from "./social-trends.js";
const ES=new Intl.NumberFormat("es-ES",{maximumFractionDigits:1});
const NS="http://www.w3.org/2000/svg";
const el=(tag,cls="",value)=>{
  const node=document.createElement(tag);
  if(cls)node.className=cls;
  if(value!==undefined)node.textContent=String(value);
  return node;
};
const sv=(tag,props={})=>{
  const node=document.createElementNS(NS,tag);
  for(const [k,v] of Object.entries(props))node.setAttribute(k,String(v));
  return node;
};
const normal=s=>(s||"").toLocaleLowerCase("es").normalize("NFD")
 .replace(/[\u0300-\u036f]/g,"").replace(/\s+/g," ").trim();
function spark(points,{color="#b89b5e",minY,maxY}={}){
 const w=350,h=110,p=10;
 const root=sv("svg",{viewBox:"0 0 350 110",role:"presentation","aria-hidden":"true"});
 if(!points.length)return root;
 const lower=minY===undefined?Math.min(...points)*.96:minY;
 const upper=maxY===undefined?Math.max(...points)*1.04:maxY;
 const y=v=>h-p-(v-lower)/Math.max(.0001,upper-lower)*(h-2*p);
 const x=i=>p+(w-2*p)*i/Math.max(1,points.length-1);
 for(let k=1;k<4;k++){
  root.append(sv("line",{x1:0,x2:w,y1:k*h/4,y2:k*h/4,stroke:"#e5eaf0"}));
 }
 const d=points.map((v,i)=>(i?"L":"M")+x(i)+" "+y(v)).join(" ");
 root.append(sv("path",{d,fill:"none",stroke:color,"stroke-width":3.6,
  "stroke-linecap":"round","stroke-linejoin":"round"}));
 root.append(sv("circle",{cx:x(points.length-1),cy:y(points.at(-1)),r:4.2,fill:color}));
 return root;
}
function stackedBars(values,{max=100,color="#183959"}={}){
 const root=el("div","il-gallery-bars");
 for(const d of values){
  const line=el("div","il-gallery-bar-row");
  line.append(el("span","",d.label));
  const track=el("div","il-gallery-bar-track");
  const width=Math.max(0,Math.min(100,100*d.value/max));
  const fill=el("div","il-gallery-bar-fill");
  fill.style.width=width+"%";fill.style.background=color;track.append(fill);
  line.append(track);
  root.append(line);
 }
 return root;
}
function treemapThumbnail(rows){
 const root=el("div","il-gallery-tree");
 const top=rows.filter(r=>Number(r.level)===1);
 const groups=editorialCofogGroups(rows);
 const items=groups?.length?groups:top.map(x=>({
   ...x,color:"#4d667e",dark:true
 }));
 const pieces=treemapLayout(items,360,170);
 for(const tile of pieces){
  const part=el("div","il-gallery-tree-cell");
  part.style.left=(tile.x/360*100)+"%";
  part.style.top=(tile.y/170*100)+"%";
  part.style.width=(tile.w/360*100)+"%";
  part.style.height=(tile.h/170*100)+"%";
  part.style.background=tile.color||"#62778a";
  root.append(part);
 }
 return root;
}
function thumbnail(spec,data){
 const box=el("div","il-gallery-preview");
 box.setAttribute("aria-hidden","true");
 if(spec.id==="gasto"){
   box.append(treemapThumbnail(data.rows));return box;
 }
 if(spec.id==="pensiones"){
  box.append(spark(pensionSeries(data.social).map(x=>x.pct),{color:"#caa127",minY:25,maxY:30}));
 }else if(spec.id==="salarios"){
  box.append(stackedBars(salariesByYear(data.social,2024).map(x=>({
    label:x.label,value:x.value})),{max:3150}));
 }else if(spec.id==="vivienda"){
  box.append(spark(housingSeries(data.housing,"España").filter(x=>x.year>=2016)
    .map(x=>x.value),{color:"#267e9a"}));
 }else if(spec.id==="preocupaciones"){
  box.append(stackedBars(data.social.concerns.rows.slice(0,5).map(x=>({
   label:x.label,value:x.pct})),{max:65,color:"#b99a4e"}));
 }else if(spec.id==="indicadores"){
  const grid=el("div","il-gallery-stat-grid");
  for(const [key,caption] of [["housing","Vivienda"],["economy","Inflación"],
    ["unemployment","Paro"],["health","Sanidad"]]){
    const d=data.social.objective[key],n=el("span","il-gallery-stat");
    n.append(el("small","",caption),
      el("strong","",ES.format(d.value)+(key==="housing"?" €/m²":
        key==="health"?" días":" %")));
    grid.append(n);
  }
  box.append(grid);
 }
 return box;
}
export function createVisualizationGallery({treemap,socialRoot,rows,history,socialData,housingData}){
 if(!treemap||!socialRoot)throw Error("Los gráficos originales son obligatorios");
 const root=el("section","il-gallery");
 root.id="atlas-galeria";
 root.setAttribute("aria-label","Catálogo interactivo de visualizaciones");
 const searchArea=el("div","il-gallery-toolbar");
 const wrapper=el("label","il-gallery-search");
 const lens=el("span","il-gallery-search-icon","⌕");
 const input=el("input");
 input.type="search";input.id="il-gallery-query";
 input.placeholder="Buscar gráfica, tema o indicador…";
 input.autocomplete="off";input.setAttribute("aria-label","Buscar entre las visualizaciones");
 const clear=el("button","il-gallery-clear","×");
 clear.type="button";clear.setAttribute("aria-label","Borrar búsqueda");
 clear.hidden=true;
 wrapper.append(lens,input,clear);
 const count=el("span","il-gallery-count");
 searchArea.append(wrapper,count);root.append(searchArea);
 const grid=el("div","il-gallery-grid");
 root.append(grid);
 const empty=el("p","il-gallery-empty","No hay gráficas para esta búsqueda.");
 empty.hidden=true;root.append(empty);
 const socialIds=["il-pensions-chart","il-salaries-chart","il-housing-chart","il-concerns-chart"];
 const articles=new Map(socialIds.map(id=>[id,socialRoot.querySelector("#"+id)]));
 if([...articles.values()].some(x=>!x))throw Error("Falta alguna gráfica social");
 const objective=el("article","il-social-card");
 objective.id="il-indicators-chart";
 objective.append(el("header","il-social-card-header"));
 const indicatorHead=objective.querySelector("header");
 indicatorHead.append(el("h2","","Percepción e indicadores"),
  el("p","","Datos medidos · fechas y fuentes diferenciadas"));
 const concerns=articles.get("il-concerns-chart");
 const sub=concerns.querySelector(".il-social-subtitle");
 const objectiveGrid=concerns.querySelector(".il-social-objectives");
 const foot=concerns.querySelector(".il-social-foot");
 if(!objectiveGrid||!sub)throw Error("No están los indicadores contrastados");
 objective.append(sub,objectiveGrid);
 if(foot)objective.append(foot);
 const description=el("details","il-social-details");
 description.append(el("summary","","Cómo interpretar la comparación"),
  el("p","","Las menciones del CIS son percepciones; los datos de inflación, paro, vivienda o sanidad miden fenómenos distintos y tienen sus propias fechas."));
 objective.append(description);
 const sources=el("p","il-gallery-indicator-source");
 sources.append(el("span","","Fuentes: "),
  ...["INE","MIVAU","Ministerio de Sanidad"].map((s,i)=>{
    const a=el("a","",s+" ↗");
    a.href=[
      "https://www.ine.es",
      "https://cdn.mivau.gob.es/portal-web-mivau/Datos_MIVAU/CSV/VDP006_01.csv",
      "https://www.sanidad.gob.es"
    ][i];a.target="_blank";a.rel="noopener noreferrer";return a;
  }));
 objective.append(sources);
 const ps=pensionSeries(socialData),latest=ps.at(-1);
 const housing=housingSeries(housingData,"España").at(-1);
 const spending=rows.find(r=>r.code==="S13.GASTO");
 const specs=[
  {id:"gasto",title:"Gasto público",tag:"Finanzas",
    metric:(spending?(ES.format(spending.value/1000)+" mil M€"):"IGAE · S.13"),
    info:"COFOG · 1995–2024",keywords:"treemap impuestos presupuesto ministerios cofogs dinero sanciones pension salud"},
  {id:"pensiones",title:"Pensiones / gasto",tag:"Economía",
    metric:ES.format(latest.pct)+" %",info:"2024 · IGAE",
    keywords:"jubilacion pensionistas pensiones incapacidad prestaciones porcentaje"},
  {id:"salarios",title:"Salarios por edad",tag:"Sociedad",
    metric:ES.format(socialData.salaries.total.at(-1))+" €",info:"2024 · INE",
    keywords:"salarios retribucion nomina sueldo edad tramos renta sueldo bruto"},
  {id:"vivienda",title:"Precio del m²",tag:"Vivienda",
    metric:ES.format(housing?.value||0)+" €/m²",info:"2026 · España / CCAA",
    keywords:"vivienda casa piso inmueble precio metro cuadrado comunidad autonoma provincias madrid alquiler tasacion"},
  {id:"preocupaciones",title:"Preocupaciones",tag:"Sociedad",
    metric:ES.format(socialData.concerns.rows[0].pct)+" %",info:"CIS · octubre 2026",
    keywords:"cis problemas encuesta españoles vivienda inmigracion sanidad preocupaciones opiniones"},
  {id:"indicadores",title:"Percepción vs datos",tag:"Indicadores",
    metric:"6 indicadores",info:"Vivienda · empleo · IPC…",
    keywords:"realidad datos indicadores paro desempleo inmigracion inflación sanidad economia salarios seguridad incrementos"}
 ];
 const data={rows,history,social:socialData,housing:housingData};
 const nodes=new Map([
  ["gasto",treemap],["pensiones",articles.get("il-pensions-chart")],
  ["salarios",articles.get("il-salaries-chart")],
  ["vivienda",articles.get("il-housing-chart")],
  ["preocupaciones",concerns],["indicadores",objective]
 ]);
 const dialog=el("dialog","il-gallery-dialog");
 dialog.setAttribute("aria-label","Visualización ampliada");
 const frame=el("div","il-gallery-dialog-frame");
 const header=el("header","il-gallery-modal-header");
 const heading=el("div","il-gallery-modal-heading");
 const title=el("h2");
 const subheading=el("p");
 heading.append(title,subheading);
 const close=el("button","il-gallery-close","×");
 close.type="button";close.setAttribute("aria-label","Cerrar gráfica ampliada");
 header.append(heading,close);
 const content=el("div","il-gallery-modal-content");
 frame.append(header,content);dialog.append(frame);
 root.append(dialog);
 let lastTrigger=null,currentId=null;
 function openChart(id,trigger=null){
  const spec=specs.find(s=>s.id===id);
  if(!spec)return;
  if(dialog.open)dialog.close();
  const widget=nodes.get(id);
  content.replaceChildren(widget);
  title.textContent=spec.title;
  subheading.textContent=spec.info;
  currentId=id;lastTrigger=trigger;
  dialog.showModal();
  close.focus({preventScroll:true});
  if(id==="gasto")window.dispatchEvent(new Event("resize"));
 }
 function closeChart(){if(dialog.open)dialog.close();}
 close.addEventListener("click",closeChart);
 dialog.addEventListener("click",event=>{if(event.target===dialog)closeChart();});
 dialog.addEventListener("close",()=>{
  currentId=null;
  if(lastTrigger?.isConnected)lastTrigger.focus({preventScroll:true});
 });
 specs.forEach(spec=>{
  const button=el("button","il-gallery-card");
  button.type="button";
  button.dataset.chart=spec.id;
  button.setAttribute("aria-label","Ampliar gráfica: "+spec.title);
  const top=el("div","il-gallery-card-top");
  top.append(el("span","il-gallery-card-tag",spec.tag),
    el("span","il-gallery-open-glyph","↗"));
  const name=el("h3","",spec.title);
  const metric=el("strong","il-gallery-card-value",spec.metric);
  const note=el("span","il-gallery-card-period",spec.info);
  button.append(top,name,metric,thumbnail(spec,data),note);
  button.addEventListener("click",()=>openChart(spec.id,button));
  grid.append(button);
 });
 const filter=()=>{
  const query=normal(input.value);
  let visible=0;
  for(const spec of specs){
   const btn=grid.querySelector('[data-chart="'+spec.id+'"]');
   const haystack=normal(spec.title+" "+spec.tag+" "+spec.info+" "+spec.keywords);
   btn.hidden=Boolean(query)&&!haystack.includes(query);
   if(!btn.hidden)visible++;
  }
  count.textContent=visible+" de "+specs.length+" gráficas";
  empty.hidden=visible>0;
  clear.hidden=!query;
 };
 input.addEventListener("input",filter);
 clear.addEventListener("click",()=>{input.value="";filter();input.focus();});
 filter();
 const params=new URLSearchParams(window.location.search);
 const initial=params.get("grafica")||
  {"il-pensions-chart":"pensiones","il-salaries-chart":"salarios",
   "il-housing-chart":"vivienda","il-concerns-chart":"preocupaciones",
   "il-indicators-chart":"indicadores","contraste-hesperides":"gasto"}[
      decodeURIComponent(window.location.hash.slice(1))];
 if(initial&&nodes.has(initial))queueMicrotask(()=>openChart(initial));
 return root;
}
