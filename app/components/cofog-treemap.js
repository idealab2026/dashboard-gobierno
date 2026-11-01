/* IDEA LAB · Treemap editorial del gasto público
 * Una cifra = una fila IGAE COFOG verificada; sin interpolar ejercicios.
 * SVG sin bibliotecas, sin telemetría, sin imitar el artwork ajeno.
 */
import {cofogsFind} from "./cofog-structure.js";
const FNS={
  "01":"Servicios públicos generales","02":"Defensa","03":"Orden público y seguridad",
  "04":"Asuntos económicos","05":"Medio ambiente","06":"Vivienda y servicios comunitarios",
  "07":"Salud","08":"Cultura, ocio y religión","09":"Educación","10":"Protección social"
};
const PALETTE={
  "01":"#657581","02":"#b8bec4","03":"#7f8d96","04":"#434a55",
  "05":"#637e71","06":"#8c9ca4","07":"#152638","08":"#93a4aa",
  "09":"#475b69","10":"#edbf34"
};
const NUM=new Intl.NumberFormat("es-ES",{maximumFractionDigits:0});
const PCT=new Intl.NumberFormat("es-ES",{minimumFractionDigits:1,maximumFractionDigits:1});
const make=(tag,cls,text)=>{
  const e=document.createElement(tag);if(cls)e.className=cls;
  if(text!==undefined)e.textContent=String(text);return e;
};
function assertRows(rows,year){
  const top=rows.filter(r=>r.code&&/^0[1-9]$|^10$/.test(r.code)&&r.level===1);
  if(top.length!==10||new Set(top.map(r=>r.code)).size!==10)
    throw Error("COFOG "+year+": faltan funciones oficiales");
  if(top.some(r=>!Number.isFinite(r.value)||r.value<=0))
    throw Error("COFOG "+year+": gasto positivo obligatorio");
  const sum=top.reduce((s,r)=>s+r.value,0);
  const grand=rows.find(r=>r.code==="S13.GASTO");
  if(!grand||Math.abs(sum-grand.value)>0.51)
    throw Error("COFOG "+year+": suma de funciones no concilia con total S.13");
  return {top:top.sort((a,b)=>b.value-a.value),total:sum};
}
// Treemap de división binaria por áreas, sin pérdida de superficie.
export function treemapLayout(items,w,h){
  if(!Number.isFinite(w*h)||w<=0||h<=0)throw Error("Dimensiones inválidas");
  if(!items.length)return [];
  if(items.some(x=>!Number.isFinite(x.value)||x.value<0))
    throw Error("Importe no verificable");
  const rects=[];
  function visit(list,x,y,width,height){
    if(!list.length)return;
    if(list.length===1){
      rects.push({...list[0],x,y,w:width,h:height});return;
    }
    const total=list.reduce((s,t)=>s+t.value,0);
    if(total<=0)throw Error("No se puede dibujar importe cero");
    let idx=1,partial=list[0].value,best=Math.abs(partial-total/2);
    for(let k=2;k<list.length;k++){
      partial+=list[k-1].value;let delta=Math.abs(partial-total/2);
      if(delta<best){best=delta;idx=k;}
    }
    const a=list.slice(0,idx),b=list.slice(idx);
    const split=a.reduce((s,t)=>s+t.value,0)/total;
    if(width>=height){
      const dx=width*split;visit(a,x,y,dx,height);visit(b,x+dx,y,width-dx,height);
    }else{
      const dy=height*split;visit(a,x,y,width,dy);visit(b,x,y+dy,width,height-dy);
    }
  }
  visit(items,0,0,w,h);
  const original=items.reduce((n,r)=>n+r.value,0);
  const area=rects.reduce((s,r)=>s+r.w*r.h,0);
  if(Math.abs(area-w*h)>1e-5||original<=0)
    throw Error("Treemap no reconciliado");
  return rects;
}
export function createCofogTreemap({rows,history=null,initialYear=2024}={}){
  const validRows=(rows||[]).map(r=>({
    ...r,year:Number(r.year),value:Number(r.value),
    level:Number(r.level)
  }));
  const datasets=new Map();
  for(const r of validRows){
    if(!datasets.has(r.year))datasets.set(r.year,[]);
    datasets.get(r.year).push(r);
  }
  if(Array.isArray(history)){
    for(const entry of history){
      if(!entry||!Number.isInteger(entry.year)||!Array.isArray(entry.functions))continue;
      const checked=entry.functions.map(r=>({
        code:String(r.code),title:String(r.title||FNS[r.code]||r.code),
        level:1,value:Number(r.value),year:entry.year
      }));
      for(const g of entry.groups||[]){
        const resolved=cofogsFind(String(g.code));
        checked.push({code:String(g.code),title:resolved?.title||String(g.code),
          level:2,value:Number(g.value),year:entry.year});
      }
      checked.push({code:"S13.GASTO",value:Number(entry.total),level:0,year:entry.year});
      assertRows(checked,entry.year);
      // Sólo se importa si la serie completa se ha reconciliado oficialmente.
      datasets.set(entry.year,checked);
    }
  }
  const years=[...datasets.keys()].sort((a,b)=>a-b);
  const validated=years.filter(y=>{
    try{assertRows(datasets.get(y),y);return true;}catch{return false;}
  });
  if(!validated.length)throw Error("No existe un año COFOG conciliado");
  let year=validated.includes(initialYear)?initialYear:validated.at(-1);
  let drill=null;
  const el=make("section","il-treemap");
  el.setAttribute("aria-label","Treemap del gasto de las Administraciones Públicas");
  const top=make("div","il-tm-top");
  const heading=make("div","il-tm-headings");
  const eyebrow=make("div","il-tm-eyebrow","IGAE · GASTO PÚBLICO S.13");
  const title=make("h2","il-tm-title");
  heading.append(eyebrow,title);
  const yearBox=make("div","il-tm-year");
  const yearLabel=make("strong","",year);
  const badge=make("small","",validated.length>1?"Serie oficial contrastada":"Ejercicio verificado");
  yearBox.append(yearLabel,badge);
  top.append(heading,yearBox);
  const kicker=make("p","il-tm-lead");
  const region=make("div","il-tm-canvas");
  const panel=make("div","il-tm-selection");panel.hidden=true;
  const control=make("div","il-tm-controls");
  const timeline=make("div","il-tm-timeline");
  const play=make("button","il-tm-play","▶ Reproducir");
  play.type="button";
  const scrub=make("input","il-tm-range");
  scrub.type="range";scrub.min=String(validated[0]);
  scrub.max=String(validated.at(-1));scrub.step="1";
  scrub.value=String(year);scrub.setAttribute("aria-label","Recorrer años COFOG");
  timeline.append(play,scrub);
  let playback=null;
  const stopPlayback=()=>{
    if(playback!==null){clearInterval(playback);playback=null;}
    play.textContent="▶ Reproducir";
  };
  if(validated.length===1){play.disabled=true;scrub.disabled=true;timeline.hidden=true;}
  play.addEventListener("click",()=>{
    if(playback!==null){stopPlayback();return;}
    if(year>=validated.at(-1))year=validated[0];
    play.textContent="Ⅱ Pausar";
    playback=setInterval(()=>{
      const idx=validated.indexOf(year);
      if(idx<0||idx>=validated.length-1){stopPlayback();return;}
      year=validated[idx+1];select.value=String(year);
      scrub.value=String(year);drill=null;render();
    },700);
  });
  scrub.addEventListener("input",()=>{
    stopPlayback();year=Number(scrub.value);
    select.value=String(year);drill=null;render();
  });
  const label=make("label","","Año");
  const select=make("select","il-tm-year-select");
  select.setAttribute("aria-label","Año de gasto COFOG");
  for(const y of validated){
    const opt=make("option","",y);opt.value=String(y);select.append(opt);
  }
  select.value=String(year);
  if(validated.length===1){select.disabled=true;label.textContent="Último año validado";}
  label.append(select);
  const tiny=make("span","il-tm-period",validated.length>1
    ?"Años publicados y conciliados · no se interpola"
    :"La evolución histórica se activará tras conciliar la serie oficial 1995–2024.");
  control.append(timeline,label,tiny);
  const note=make("p","il-tm-source");
  const back=make("button","il-tm-back","‹ Todas las funciones");
  back.type="button";back.hidden=true;
  back.addEventListener("click",()=>{drill=null;render();});
  select.addEventListener("change",()=>{
    stopPlayback();year=Number(select.value);scrub.value=String(year);
    drill=null;render();
  });
  const explanation=make("details","il-tm-method");
  const summary=make("summary","","Método y comparación con otras fuentes");
  const method=make("div","il-tm-method-content");
  method.innerHTML=
    "<p>Rectángulos proporcionales al gasto de cada función COFOG del sector Administraciones Públicas (S.13). La fuente es IGAE, contabilidad nacional SEC 2010. No representa créditos ministeriales, transferencias individuales ni financiación atribuible a impuestos concretos.</p>"+
    "<p>La gráfica de Las Hespérides divide protección social y servicios generales en grupos editoriales (pensiones, desempleo, intereses) que <strong>no equivalen</strong> a las diez funciones de primer nivel. Solo se pueden contrastar después de reconstruir idénticas subfunciones, año, revisión y denominador.</p>"+
    "<p>El gráfico de 2012 facilitado por el lector muestra 26,6 % para pensiones e incapacidad temporal y 6,7 % para intereses de deuda. Esas cifras no deben trasladarse al Observatorio como valores auditados sin consultar el dataset de origen y la serie IGAE de 2012.</p>";
  explanation.append(summary,method);
  el.append(top,kicker,back,region,panel,control,note,explanation);
  const resize=()=>draw();
  let activeData=null;
  function render(){
    const data=assertRows(datasets.get(year),year);
    activeData=data;yearLabel.textContent=String(year);
    scrub.value=String(year);
    const percent=(data.top.find(x=>x.code==="10")?.value/data.total||0)*100;
    title.textContent=drill
      ?(FNS[drill]||drill)+" · desglose del gasto"
      :"Dónde se concentra el gasto público";
    kicker.textContent=drill
      ?"El tamaño representa la proporción dentro de esta función, cuando hay desglose verificable."
      :"Cada rectángulo ocupa exactamente su porcentaje del gasto consolidado. "+
      "Protección social representa "+PCT.format(percent)+" % en "+year+".";
    note.replaceChildren();
    note.append(make("span","","Fuente: IGAE · Clasificación funcional COFOG · "+
      year+" · "+NUM.format(data.total)+" millones de euros · ejercicio "+
      (year===2024?"provisional":"oficial")+"."));
    const link=make("a","","Consultar serie oficial ↗");
    link.href="https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadNacional/Publicaciones/Paginas/iacogofseries.aspx";
    link.target="_blank";link.rel="noopener noreferrer";
    note.append(link);back.hidden=!drill;
    draw();
  }
  function draw(){
    if(!activeData)return;
    const bounds=region.getBoundingClientRect();
    const width=Math.max(320,Math.round(bounds.width||1000));
    const height=Math.max(390,Math.min(650,Math.round(width*.59)));
    region.style.height=height+"px";
    const source=activeData.top;
    const items=drill
      ?datasets.get(year).filter(r=>r.code.startsWith(drill+".") &&
          r.level===2 && Number.isFinite(r.value) && r.value>0)
      :source;
    let list=items.length?items:source;
    if(drill&&!items.length){drill=null;back.hidden=true;list=source;}
    const layout=treemapLayout(list,width,height);
    const denom=list.reduce((s,r)=>s+r.value,0);
    region.replaceChildren();
    for(const cell of layout){
      const px=Math.round(cell.w*cell.h);
      const button=make("button","il-tm-cell");
      const key=cell.code.slice(0,2);
      button.style.left=(100*cell.x/width)+"%";
      button.style.top=(100*cell.y/height)+"%";
      button.style.width=(100*cell.w/width)+"%";
      button.style.height=(100*cell.h/height)+"%";
      button.style.background=PALETTE[key]||"#536b78";
      button.classList.toggle("il-tm-dark",!["10","02","03","06","08"].includes(key));
      const pct=100*cell.value/denom;
      const label=drill?String(cell.title||cell.code):FNS[cell.code]||cell.title||cell.code;
      const tooSmall=cell.w<115||cell.h<62;
      const titleNode=make("span","il-tm-cell-label",label);
      const valueNode=make("strong","il-tm-cell-percent",PCT.format(pct)+" %");
      if(px<4800){titleNode.classList.add("il-tm-sr-only");valueNode.classList.add("il-tm-sr-only");}
      else if(tooSmall){button.classList.add("il-tm-compact");}
      button.append(titleNode,valueNode);
      button.type="button";
      button.setAttribute("aria-label",
        label+": "+PCT.format(pct)+" % · "+NUM.format(cell.value)+" M€ · abrir detalle");
      button.title=label+" · "+NUM.format(cell.value)+" M€ · "+PCT.format(pct)+" %";
      button.addEventListener("click",()=>{
        panel.hidden=false;panel.replaceChildren();
        const row=make("div","il-tm-detail-main");
        const text=make("div","il-tm-detail-copy");
        text.append(make("strong","",label),make("span","",
          NUM.format(cell.value)+" M€ · "+PCT.format(pct)+" % de "+
          (drill?"la función":"todo el gasto")));
        row.append(text);
        const href=make("a","","Ver en el Sankey ↗");
        href.href="/?detalle-cofog="+encodeURIComponent(cell.code)+"#mapa-dinero";
        row.append(href);panel.append(row);
        if(!drill && datasets.get(year).some(x=>x.level===2&&x.code.startsWith(cell.code+"."))){
          const expand=make("button","il-tm-expand","Desglosar función →");
          expand.type="button";expand.addEventListener("click",()=>{
            drill=cell.code;panel.hidden=true;render();
          });
          panel.append(expand);
        }
      });
      region.append(button);
    }
  }
  render();
  if(typeof ResizeObserver!=="undefined"){
    const observer=new ResizeObserver(resize);observer.observe(region);
  }else window.addEventListener("resize",resize);
  return el;
}
