"use strict";
const $=s=>document.querySelector(s);
const numberFmt=new Intl.NumberFormat("es-ES",{maximumFractionDigits:1});
const exactFmt=new Intl.NumberFormat("es-ES",{maximumFractionDigits:2});
const euroFmt=new Intl.NumberFormat("es-ES",{maximumFractionDigits:0});
const escapeHtml=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const linkUrl=url=>/^https?:\/\//i.test(String(url??"").trim())?String(url).trim().split("|")[0]:"";
const n=v=>Number(v);
function parseDSV(text,delimiter){
 let result=[],row=[],field="",quoted=false;
 for(let i=0;i<text.length;i++){
  const c=text[i];
  if(quoted){if(c==='"'&&text[i+1]==='"'){field+='"';i++}else if(c==='"')quoted=false;else field+=c}
  else if(c==='"')quoted=true;
  else if(c===delimiter){row.push(field);field=""}
  else if(c==="\n"){row.push(field.replace(/\r$/,""));result.push(row);row=[];field=""}
  else field+=c;
 }
 if(field!==""||row.length){row.push(field);result.push(row)}
 const head=result.shift()||[];
 return result.filter(r=>r.some(x=>x!=="")).map(r=>Object.fromEntries(head.map((x,i)=>[x.replace(/^\uFEFF/,""),r[i]??""])));
}
async function loadFile(filename,delimiter){
 const response=await fetch(filename,{cache:"no-cache"});
 if(!response.ok)throw new Error("No se pudo cargar "+filename+" ("+response.status+")");
 return parseDSV(await response.text(),delimiter);
}
function latestRow(rows,id){
 const candidates=rows.filter(r=>r.indicator_id===id&&(!r.geo_name||r.geo_name==="España")&&Number.isFinite(Number(r.value)));
 const grouped=new Map();
 for(const r of candidates){const k=Number(r.year);if(!grouped.has(k))grouped.set(k,[]);grouped.get(k).push(r)}
 return [...grouped.entries()].filter(([year,group])=>new Set(group.map(x=>Number(x.value))).size===1)
    .map(([year,group])=>({...group[0],year,value:n(group[0].value)})).sort((a,b)=>a.year-b.year);
}
function format(v,unit,id){
 if(!Number.isFinite(n(v)))return "—";
 const x=n(v),u=String(unit||"").toLowerCase();
 if(id==="pib_nominal_eur")return exactFmt.format(x/1e12)+" billones €";
 if(u==="%"||u.includes("porcentaje")||u.includes("puntos porcentuales"))return exactFmt.format(x)+" %";
 if(u.includes("millones de euros"))return euroFmt.format(x)+" M€";
 if(u==="euros"||u.includes("euros por"))return euroFmt.format(x)+" €";
 if(Math.abs(x)>=1e6)return exactFmt.format(x/1e6)+" M";
 if(Math.abs(x)>=1e3)return euroFmt.format(x);
 return exactFmt.format(x)+(u==="índice"?"":"");
}
function formatM(v){return euroFmt.format(n(v))+" M€"}
function setText(id,value){const el=document.getElementById(id);if(el)el.textContent=value}
function renderKpis(rows){
 const cfg=[
  {id:"crecimiento_pib_real",name:"Crecimiento del PIB real"},
  {id:"tasa_desempleo",name:"Tasa de desempleo"},
  {id:"deuda_publica_pde_pib",name:"Deuda pública / PIB"},
  {id:"inflacion_ipc_media_anual",name:"Inflación media anual"}
 ];
 const el=$("#kpi-grid");
 el.innerHTML=cfg.map(x=>{
  const list=latestRow(rows,x.id),last=list.at(-1);
  const source=last?linkUrl(last.source_url):"";
  return '<article class="kpi"><h3>'+escapeHtml(x.name)+'</h3><div class="value">'+
   (last?escapeHtml(format(last.value,last.unit,x.id)):"—")+'</div>'+
   '<p class="when">'+(last?"Dato "+escapeHtml(last.year):"Dato no disponible")+'</p>'+
   (last?'<div class="source">'+(source?'<a href="'+escapeHtml(source)+'" target="_blank" rel="noopener noreferrer">Fuente oficial</a>':'<span>Fuente no disponible</span>')+'</div>':"")+
   '</article>';
 }).join("");
}
function renderPlot(list){
 const el=$("#plot");
 if(!list.length){el.innerHTML='<div class="loading">Serie sin observaciones verificadas</div>';return;}
 const vals=list.map(x=>x.value),min=Math.min(...vals),max=Math.max(...vals);
 const pad=(max-min)||Math.max(Math.abs(max)*.12,1);const low=min-.12*pad,high=max+.15*pad;
 const W=900,H=320,l=79,r=22,t=23,b=48;
 const x=i=>l+(list.length<2?0.5:i/(list.length-1))*(W-l-r);
 const y=v=>t+(high-v)/(high-low)*(H-t-b);
 const points=list.map((o,i)=>[x(i),y(o.value)]);
 const path=points.map(([xx,yy],i)=>(i?"L":"M")+xx.toFixed(2)+","+yy.toFixed(2)).join(" ");
 const area=path+" L "+x(list.length-1)+","+(H-b)+" L "+x(0)+","+(H-b)+" Z";
 const nTicks=4,grid=[];
 for(let i=0;i<=nTicks;i++){const v=low+(high-low)*i/nTicks,yy=y(v);grid.push('<line x1="'+l+'" y1="'+yy+'" x2="'+(W-r)+'" y2="'+yy+'" stroke="#e8eff4" stroke-width="1"/><text x="'+(l-9)+'" y="'+(yy+4)+'" fill="#76889b" font-size="12" text-anchor="end">'+escapeHtml(numberFmt.format(v))+'</text>')}
 const labels=list.filter((_,i)=>i%Math.max(1,Math.ceil(list.length/7))===0||i===list.length-1).map(o=>{const i=list.indexOf(o);return '<text x="'+x(i)+'" y="'+(H-18)+'" font-size="12" text-anchor="middle" fill="#718397">'+o.year+'</text>'}).join("");
 const dot=points.at(-1);
 el.innerHTML='<svg role="img" aria-label="Evolución histórica del indicador" viewBox="0 0 '+W+' '+H+'" xmlns="http://www.w3.org/2000/svg">'+grid.join("")+'<path d="'+area+'" fill="#e5f2f2"/><path d="'+path+'" stroke="#157e78" stroke-width="3.3" fill="none" stroke-linejoin="round" stroke-linecap="round"/><circle cx="'+dot[0]+'" cy="'+dot[1]+'" r="5" fill="#157e78" stroke="white" stroke-width="2"/>'+labels+'</svg>';
}
function renderIndicator(rows,id){
 const list=latestRow(rows,id);const last=list.at(-1);
 const title=last?.indicator_name||id.replace(/_/g," ");
 setText("indicator-title",title);
 setText("indicator-description",last?.definition||"Evolución histórica de la serie estadística seleccionada.");
 renderPlot(list);
 setText("indicator-period",list.length?list[0].year+"–"+list.at(-1).year:"Sin periodo válido");
 const ref=$("#indicator-ref");
 if(last){const url=linkUrl(last.source_url);ref.innerHTML='<strong>Procedencia:</strong> '+escapeHtml(last.source||"Sin organismo identificado")+
   (url?' · <a target="_blank" rel="noopener noreferrer" href="'+escapeHtml(url)+'">Abrir fuente</a>':"")+
   '<br><strong>Unidad:</strong> '+escapeHtml(last.unit||"sin unidad")+
   ' · <strong>Revisión declarada:</strong> '+escapeHtml(last.source_revision_date||"no consta")+
   ' · <strong>Estado:</strong> '+escapeHtml(last.status||"sin clasificar");}
 else ref.textContent="No hay una serie unívoca para esta selección.";
 const tbody=$("#history-rows");
 tbody.innerHTML=list.slice(-10).reverse().map(x=>'<tr><td>'+x.year+'</td><td class="num"><strong>'+escapeHtml(format(x.value,x.unit,id))+'</strong></td><td>'+escapeHtml(x.status||"—")+'</td></tr>').join("")||'<tr><td colspan="3">Sin datos válidos.</td></tr>';
}
async function initPanorama(){
 const data=await loadFile("./data/observations.csv",",");
 const national=data.filter(x=>!x.geo_name||x.geo_name==="España");
 renderKpis(national);
 const ids=[...new Set(national.map(x=>x.indicator_id))];
 const categories=[...new Set(national.map(x=>x.category).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"es"));
 const category=$("#category-select"),metric=$("#metric-select");
 category.innerHTML='<option value="">Todas las áreas</option>'+categories.map(x=>'<option value="'+escapeHtml(x)+'">'+escapeHtml(x)+'</option>').join("");
 const preferred="crecimiento_pib_real";
 function refresh(){
  const filtered=category.value?national.filter(x=>x.category===category.value):national;
  const found=[...new Set(filtered.map(x=>x.indicator_id))].sort((a,b)=>a.localeCompare(b,"es"));
  const previous=metric.value;
  metric.innerHTML=found.map(id=>{const r=filtered.find(x=>x.indicator_id===id);return '<option value="'+escapeHtml(id)+'">'+escapeHtml(r?.indicator_name||id)+'</option>'}).join("");
  metric.value=found.includes(previous)?previous:found.includes(preferred)?preferred:found[0]||"";
  renderIndicator(filtered,metric.value);
 }
 category.addEventListener("change",refresh);
 metric.addEventListener("change",()=>renderIndicator(national,metric.value));
 refresh();
 setText("series-count",ids.length+" indicadores · "+data.length+" observaciones históricas");
}
function metricBar(label,value,total,color=""){
 const pct=total>0?Math.max(0,Math.min(100,value/total*100)):0;
 return '<div class="metric-row"><div class="row-head"><strong>'+escapeHtml(label)+'</strong><span class="num">'+escapeHtml(formatM(value))+'</span></div><div class="bar-bg"><div class="bar '+color+'" style="width:'+pct.toFixed(2)+'%"></div></div></div>';
}
async function initFinance(){
 const data=await loadFile("./data/public-finance.csv",";");
 const getCode=c=>data.find(r=>r.codigo===c);
 const gasto=getCode("S13.GASTO"),ingreso=getCode("S13.RECURSOS"),deficit=getCode("S13.DEFICIT");
 if(!gasto||!ingreso||!deficit)throw Error("Faltan agregados contables imprescindibles.");
 const g=n(gasto.valor),i=n(ingreso.valor),d=n(deficit.valor);
 setText("fin-year",gasto.año||"2024");
 setText("fin-income",formatM(i));setText("fin-expense",formatM(g));setText("fin-deficit",formatM(d));
 setText("fin-balance",Math.abs(g-(i+d))<=.5?"Cuadre contable verificado: ingresos + financiación = gastos":"ATENCIÓN: descuadre contable en la fuente.");
 $("#fin-flow").innerHTML='<div class="flow-node"><strong>'+escapeHtml(formatM(i))+'</strong><span>Recursos no financieros</span></div><div class="flow-arrow">+</div><div class="flow-node"><strong>'+escapeHtml(formatM(d))+'</strong><span>Necesidad de financiación</span></div><div class="flow-arrow">→</div><div class="flow-node"><strong>'+escapeHtml(formatM(g))+'</strong><span>Gastos no financieros</span></div>';
 const expenses=data.filter(x=>x.lado==="gasto"&&x.parent_codigo==="S13.GASTO"&&String(x.nivel)==="1").sort((a,b)=>n(b.valor)-n(a.valor));
 const revenues=data.filter(x=>x.lado==="ingreso"&&x.parent_codigo==="S13.RECURSOS").sort((a,b)=>n(b.valor)-n(a.valor));
 $("#expense-bars").innerHTML=expenses.map(x=>metricBar(x.indicador,n(x.valor),g)).join("")||'<p class="subtle">Sin detalle funcional consolidado.</p>';
 $("#revenue-bars").innerHTML=revenues.map(x=>metricBar(x.indicador,n(x.valor),i,"gold")).join("")||'<p class="subtle">Sin desglose verificado.</p>';
 const url=linkUrl(gasto.url_verificable);
 $("#finance-source").innerHTML='<strong>Fuente agregada:</strong> '+escapeHtml(gasto.fuente_oficial)+(url?' · <a href="'+escapeHtml(url)+'" target="_blank" rel="noopener noreferrer">Consultar publicación</a>':'')+'<br>Unidad: millones de euros. Ejercicio: '+escapeHtml(gasto.año||"—")+'. Las categorías son clasificaciones contables y no representan pagos asignables a un impuesto concreto.';
}
const page=document.body.dataset.page;
(async()=>{try{if(page==="panorama")await initPanorama();if(page==="finance")await initFinance()}catch(e){console.error(e);const tgt=page==="finance"?$("#fin-layout"):$("#dashboard-content");if(tgt)tgt.innerHTML='<div class="error">No se han podido cargar los datos. Comprueba que la web esté publicada mediante HTTPS y que los archivos CSV sean accesibles.</div>';}})();
