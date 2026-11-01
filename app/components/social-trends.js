/* IDEA LAB · Four official-data visualisations.
 * Sources are pinned in data files. No inference, fabricated intermediate years,
 * mixing pension-benefits with every COFOG 10.1-10.3 service, or prices with
 * home-sale transaction values. Browser APIs confined to UI functions.
 */
const NS="http://www.w3.org/2000/svg";
const format=(n,d=0)=>new Intl.NumberFormat("es-ES",{minimumFractionDigits:d,maximumFractionDigits:d}).format(n);
const dom=(tag,cls="",text)=>{
 const n=document.createElement(tag);if(cls)n.className=cls;
 if(text!==undefined)n.textContent=String(text);
 return n;
};
const svg=(tag,attrs={})=>{
 const n=document.createElementNS(NS,tag);
 Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,String(v)));
 return n;
};
const pct=n=>format(n,1)+" %";
export function pensionSeries(data){
 if(!data?.pensions?.rows?.length)throw Error("Datos IGAE ausentes");
 return data.pensions.rows.map(r=>{
  if(!Number.isFinite(r.pensions)||!Number.isFinite(r.spending)||
     r.pensions<0||r.spending<=r.pensions)throw Error("Importes de pensiones inválidos");
  return {period:String(r.year),year:r.year,pct:100*r.pensions/r.spending,
    pensions:r.pensions,spending:r.spending};
 });
}
export function salariesByYear(data,year=2024,relative=false){
 const s=data.salaries,index=s.years.indexOf(Number(year));
 if(index<0)throw Error("Ejercicio de salarios inexistente");
 const avg=s.total[index];
 return s.groups.map(g=>({label:g.label,code:g.code,amount:g.values[index],
    value:relative?g.values[index]/avg*100:g.values[index]}));
}
export function housingSeries(data,territory="España"){
 return (data.records||[]).filter(x=>x.territory===territory)
  .sort((a,b)=>a.year-b.year||a.quarter-b.quarter)
  .map(x=>({...x,period:x.year+" T"+x.quarter}));
}
function sourceLink(url){
 const a=dom("a","il-social-source","Consultar fuente oficial ↗");
 a.href=url;a.target="_blank";a.rel="noopener noreferrer";return a;
}
function card(id,title,subtitle){
 const root=dom("article","il-social-card");root.id=id;
 const head=dom("div","il-social-card-header");
 head.append(dom("h2","",title),dom("p","",subtitle));root.append(head);
 return root;
}
function metricRow(textMain,textSub){
 const row=dom("div","il-social-metric");
 row.append(dom("strong","",textMain),dom("span","",textSub));return row;
}
function detailBlock(text){
 const d=dom("details","il-social-details");
 d.append(dom("summary","","Definición y cautelas"),dom("p","",text));return d;
}
function select(label,choices,value){
 const wrap=dom("label","il-social-select-label");
 wrap.append(dom("span","",label));
 const input=dom("select","il-social-select");
 for(const choice of choices){
  const v=typeof choice==="string"?choice:choice.value;
  const text=typeof choice==="string"?choice:choice.label;
  const opt=dom("option","",text);opt.value=String(v);
  input.append(opt);
 }
 input.value=String(value);wrap.append(input);return {wrap,input};
}
function lineChart(values,{unit="%",color="#bf9b41",min=null,max=null}={}){
 const box=dom("div","il-social-chart-wrap");
 const w=920,h=330,p={l:77,r:24,t:22,b:58};
 const W=w-p.l-p.r,H=h-p.t-p.b;
 const lower=min===null?Math.floor(Math.min(...values.map(x=>x.value))*0.93):min;
 const upper=max===null?Math.ceil(Math.max(...values.map(x=>x.value))*1.035):max;
 const dy=Math.max(.001,upper-lower);
 const X=i=>p.l+(values.length===1?W/2:W*i/(values.length-1));
 const Y=v=>p.t+H-(v-lower)*H/dy;
 const s=svg("svg",{viewBox:"0 0 920 330",role:"img",
  "aria-label":"Evolución temporal de "+values.length+" observaciones"});
 for(let k=0;k<5;k++){
  const val=lower+dy*k/4,y=Y(val);
  s.append(svg("line",{x1:p.l,y1:y,x2:w-p.r,y2:y,
    stroke:"#e6ebf0","stroke-width":1}));
  const t=svg("text",{x:p.l-12,y:y+4,"text-anchor":"end",
    fill:"#677d94","font-size":"13"});
  t.textContent=format(val,unit==="%"?1:0);s.append(t);
 }
 if(values.length>1){
  const line=values.map((d,i)=>(i?"L":"M")+X(i)+","+Y(d.value)).join(" ");
  s.append(svg("path",{d:line,fill:"none",stroke:color,"stroke-width":4,
    "stroke-linejoin":"round","stroke-linecap":"round"}));
 }
 const every=Math.max(1,Math.ceil(values.length/9));
 values.forEach((d,i)=>{
  const c=svg("circle",{cx:X(i),cy:Y(d.value),r:values.length>25?3.2:5,
    fill:color,stroke:"white","stroke-width":2});
  const tooltip=svg("title");tooltip.textContent=
   d.period+": "+format(d.value,unit==="%"?2:1)+" "+unit;
  c.append(tooltip);s.append(c);
  if(i%every===0||i===values.length-1){
   const label=svg("text",{x:X(i),y:h-p.b+23,"text-anchor":"middle",
      fill:"#6b7c91","font-size":values.length>18?"11":"13"});
   label.textContent=d.period;s.append(label);
  }
 });
 box.append(s);return box;
}
function horizontalBars(data,{suffix="",max=null}={}){
 const root=dom("div","il-social-bars");
 const ceiling=max||Math.max(...data.map(d=>d.value))*1.08;
 for(const d of data){
  const item=dom("div","il-social-bar-item");
  const head=dom("div","il-social-bar-heading");
  head.append(dom("span","",d.label),
    dom("strong","",format(d.value,1)+suffix));item.append(head);
  const track=dom("div","il-social-bar-track");
  const fill=dom("div","il-social-bar-fill");
  fill.style.width=Math.max(0,Math.min(100,100*d.value/ceiling))+"%";
  track.append(fill);item.append(track);root.append(item);
 }
 return root;
}
export function createSocialTrends(data,housing){
 const root=dom("section","il-social-root");
 root.setAttribute("aria-label","Gráficas sociales basadas en estadísticas oficiales");
 const intro=dom("header","il-social-intro");
 intro.append(dom("span","il-social-eyebrow","TENDENCIAS SOCIALES"),
  dom("h2","","Las cifras detrás de las preocupaciones"),
  dom("p","","Datos públicos, series temporales y fuentes consultables. Las percepciones se comparan con indicadores, no se presentan como hechos demostrados."));
 root.append(intro);
 const jump=dom("nav","il-social-jump");
 jump.setAttribute("aria-label","Gráficas sociales");
 for(const [id,name] of [["il-pensions-chart","Pensiones"],
   ["il-salaries-chart","Salarios"],["il-housing-chart","Vivienda"],
   ["il-concerns-chart","Preocupaciones"]]){
   const a=dom("a","",name);a.href="#"+id;jump.append(a);
 }
 root.append(jump);
 // PENSIONS: only independently reported pension benefits.
 const pensions=pensionSeries(data);
 const p=card("il-pensions-chart","Pensiones: porcentaje del gasto público",
   "España · AAPP S.13 · datos oficiales IGAE · 2020–2024");
 const lp=pensions.at(-1),fp=pensions[0];
 p.append(metricRow(pct(lp.pct),"2024 · "+format(lp.pensions)+" M€ de pensiones"));
 p.append(lineChart(pensions.map(x=>({period:String(x.year),value:x.pct})),
   {unit:"%",color:"#c79b32",min:24,max:30}));
 const growth=100*(lp.pensions/fp.pensions-1);
 const detail=dom("div","il-social-stat-line");
 detail.textContent="Pensiones: "+format(fp.pensions)+" M€ → "+format(lp.pensions)+
   " M€ (+"+format(growth,1)+" % nominal, 2020–2024).";
 p.append(detail,detailBlock(data.pensions.definition+
  " Denominador: gasto total no financiero de las AAPP, no presupuesto estatal inicial."),sourceLink(data.pensions.url));
 root.append(p);
 // SALARIES: year and mode switches.
 const sal=card("il-salaries-chart","Salarios brutos por edad",
  "INE · EPA · empleo principal · 2019–2024");
 const salControls=dom("div","il-social-controls");
 const salYear=select("Año",data.salaries.years.map(String),"2024");
 const salType=select("Comparar",[
  {value:"amount",label:"Euros al mes"},
  {value:"relative",label:"Índice · media = 100"}],"amount");
 salControls.append(salYear.wrap,salType.wrap);sal.append(salControls);
 const salaryPlot=dom("div");
 sal.append(salaryPlot);
 const sr=dom("p","il-social-stat-line");
 const renderSalary=()=>{
  const year=Number(salYear.input.value),relative=salType.input.value==="relative";
  const rows=salariesByYear(data,year,relative);
  salaryPlot.replaceChildren(horizontalBars(rows,{
   suffix:relative?"":" €",max:relative?140:3300
  }));
  const n=data.salaries.years.indexOf(year);
  sr.textContent="Media nacional: "+format(data.salaries.total[n],1)+
     " €/mes · índice 100. Las medias por edad no representan percentiles.";
 };
 salYear.input.addEventListener("change",renderSalary);
 salType.input.addEventListener("change",renderSalary);renderSalary();
 sal.append(sr,detailBlock(data.salaries.definition),sourceLink(data.salaries.url));
 root.append(sal);
 // HOUSING, quarters: region history only for verified data actually available.
 const house=card("il-housing-chart","Vivienda: valor tasado por m²",
  "Ministerio de Vivienda · €/m² · precio tasado, no compraventa");
 const territories=[...new Set((housing.records||[]).map(d=>d.territory))].sort(
  (a,b)=>a==="España"?-1:b==="España"?1:a.localeCompare(b,"es"));
 const hControls=dom("div","il-social-controls");
 const hTerritory=select("Territorio",territories,"España");
 hControls.append(hTerritory.wrap);house.append(hControls);
 const housePlot=dom("div");house.append(housePlot);
 const houseInfo=dom("p","il-social-stat-line");
 const renderHousing=()=>{
  const d=housingSeries(housing,hTerritory.input.value);
  housePlot.replaceChildren();
  if(!d.length){housePlot.append(dom("p","il-social-no-data",
    "No se dispone de serie verificada para este territorio."));return;}
  const latest=d.at(-1);
  housePlot.append(metricRow(format(latest.value,1)+" €/m²",
    latest.period+" · "+hTerritory.input.value));
  housePlot.append(lineChart(d.map(x=>({period:x.year+"T"+x.quarter,
    value:x.value})),{unit:"€/m²",color:"#1d698e"}));
  const before=d.find(x=>x.year===latest.year-1&&x.quarter===latest.quarter);
  houseInfo.textContent=before
    ?"Variación interanual: "+format((latest.value/before.value-1)*100,1)+
      " % · "+format(before.value,1)+" → "+format(latest.value,1)+" €/m²"
    :"La variación interanual requiere el mismo trimestre del año anterior.";
 };
 hTerritory.input.addEventListener("change",renderHousing);renderHousing();
 house.append(houseInfo,detailBlock(
  "Valor tasado medio de la vivienda libre. No es el precio final de venta ni de anuncio. "+
  "Se muestran únicamente periodos y territorios con valores obtenidos y verificables. "+
  "Estado de ingestión: "+housing.status+"."),
  sourceLink("https://datos.gob.es/es/catalogo/e05233601-valor-tasado-de-la-vivienda"));
 root.append(house);
 // Perceptions are survey percentages, not measured objective incidence.
 const concerns=card("il-concerns-chart","¿Qué preocupa a los españoles?",
  "CIS · octubre 2026 · menciones entre los tres principales problemas");
 concerns.append(horizontalBars(data.concerns.rows.map(x=>({...x,
  value:x.pct})),{suffix:" %",max:65}));
 concerns.append(detailBlock(data.concerns.kind));
 concerns.append(sourceLink(data.concerns.url));
 const objectTitle=dom("h3","il-social-subtitle","La percepción frente al indicador verificable");
 concerns.append(objectTitle);
 const matrix=dom("div","il-social-objectives");
 for(const c of data.concerns.rows){
  const fact=data.objective[c.key];
  if(!fact)continue;
  const item=dom("article","il-social-objective");
  item.append(dom("span","il-social-objective-topic",c.label),
   dom("strong","",format(fact.value,fact.value>100?0:2)+" "+fact.unit),
   dom("small","",fact.period));
  const info=dom("p","",fact.description);item.append(info);
  const link=dom("a","","Fuente ↗");link.href=fact.url;
  link.target="_blank";link.rel="noopener noreferrer";item.append(link);
  matrix.append(item);
 }
 concerns.append(matrix);
 const final=dom("p","il-social-foot");
 final.textContent="La correlación entre preocupación ciudadana e indicadores económicos o sociales no demuestra causalidad. Cada dato lleva su fecha, unidad y definición.";
 concerns.append(final);root.append(concerns);
 return root;
}
