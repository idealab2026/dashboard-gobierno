/* Tesoro público: emisiones de mercado y amortizaciones 2024.
 * Source: Tesoro Público, Estrategia de Financiación 2025, Cuadro 2,
 * Cierre 2024 (términos efectivos, M€).
 * State Treasury ≠ all Spanish General Government (ESA S.13).
 * Financing net is a *saldo*, never a payment or spending COFOG category.
 */
export const TREASURY_DEBT_2024=Object.freeze({
  year:2024,scope:"Tesoro del Estado",unit:"M€",
  official_gross:259365,
  official_net:55034,
  lines:[
    {code:"long",label:"Bonos, obligaciones y otros préstamos",
      gross:169898,repayments:118118,net:51780},
    {code:"bills",label:"Letras del Tesoro",
      gross:89468,repayments:86214,net:3254}
  ],
  source:"https://www.tesoro.es/sites/default/files/estrategia/Estrategia_Tesoro_Publico_2025_Espan%CC%83ol.pdf",
  document:"Estrategia de financiación del Tesoro 2025 · Cuadro 2 · Cierre 2024"
});
export function validateTreasuryDebt(data=TREASURY_DEBT_2024){
  if(data.year!==2024||data.unit!=="M€"||data.scope!=="Tesoro del Estado")
    throw Error("No se puede mezclar Tesoro del Estado con S.13");
  for(const d of data.lines){
    if(![d.gross,d.repayments,d.net].every(v=>Number.isInteger(v)&&v>=0))
      throw Error("Flujo financiero inválido");
    if(d.gross!==d.repayments+d.net)
      throw Error("Las emisiones del Tesoro no concilian para "+d.code);
  }
  const sum=key=>data.lines.reduce((v,line)=>v+line[key],0);
  const gross=sum("gross"),repayments=sum("repayments"),net=sum("net");
  const publishedRounding=gross-data.official_gross;
  if(net!==data.official_net||Math.abs(publishedRounding)>1)
    throw Error("Diferencia con las cifras oficiales de cierre");
  if(gross!==repayments+net)throw Error("Flujos brutos no conciliados");
  return {gross,repayments,net,publishedRounding,
    officialGross:data.official_gross,officialNet:data.official_net};
}
const NS="http://www.w3.org/2000/svg";
const svgEl=(tag,attrs={})=>{
  const el=document.createElementNS(NS,tag);
  for(const [k,v] of Object.entries(attrs))el.setAttribute(k,String(v));
  return el;
};
const dom=(tag,cls,text)=>{
  const e=document.createElement(tag);
  if(cls)e.className=cls;
  if(text!==undefined)e.textContent=String(text);
  return e;
};
const fmt=n=>new Intl.NumberFormat("es-ES").format(n)+" M€";
function curve(sx,sy,tx,ty,width){
  const mid=(sx+tx)/2,half=width/2;
  return "M "+sx+","+(sy-half)+" C "+mid+","+(sy-half)+" "+
    mid+","+(ty-half)+" "+tx+","+(ty-half)+
    " L "+tx+","+(ty+half)+" C "+mid+","+(ty+half)+
    " "+mid+","+(sy+half)+" "+sx+","+(sy+half)+" Z";
}
function addText(parent,x,y,value,klass){
  const t=svgEl("text",{x,y,class:klass});t.textContent=value;parent.append(t);
}
function box(svg,x,y,w,h,title,value,kind){
  const group=svgEl("g",{class:"pf-tesoro-node "+kind});
  group.append(svgEl("rect",{x,y,width:w,height:h,rx:9}));
  addText(group,x+14,y+26,title,"pf-tesoro-label");
  addText(group,x+14,y+56,fmt(value),"pf-tesoro-number");
  svg.append(group);
}
export function createTreasuryDebtView(data=TREASURY_DEBT_2024){
  const totals=validateTreasuryDebt(data);
  const root=dom("section","pf-tesoro");
  root.setAttribute("aria-label","Emisión bruta de deuda del Tesoro de 2024 y su descomposición contable");
  const heading=dom("div","pf-tesoro-head");
  heading.append(dom("strong","","Emisión y amortización de deuda · Tesoro del Estado"),
    dom("span","",String(data.year)+" · cifras de cierre"));
  const description=dom("p","pf-tesoro-desc",
    "Aquí se ve la deuda que se emitió, la antigua que se devolvió y la financiación neta captada. " +
    "Es el Tesoro del Estado, no el gasto de todas las Administraciones Públicas.");
  root.append(heading,description);
  const frame=dom("div","pf-tesoro-scroll");
  const svg=svgEl("svg",{viewBox:"0 0 1240 580",width:"1240",height:"580",
    role:"img","aria-label":"Las emisiones brutas del Tesoro de 259.366 millones (suma de líneas), " +
    "se descomponen en 204.332 millones de amortizaciones y 55.034 de emisión neta."});
  const cap=[
    ["EMISIONES BRUTAS","",38],
    ["TESORO DEL ESTADO","",465],
    ["DESCOMPOSICIÓN CONTABLE","",915]
  ];
  cap.forEach(([name,,x])=>addText(svg,x,30,name,"pf-tesoro-caption"));
  // El área total de los flujos utiliza los subtotales publicados, que
  // sí cuadran. El total publicado difiere en 1 M€ por redondeo.
  const grossY=256;
  svg.append(svgEl("path",{d:curve(383,295,462,295,82),
    class:"pf-tesoro-ribbon pf-tesoro-main"}));
  const a=totals.repayments/totals.gross;
  const b=totals.net/totals.gross;
  const repayWidth=82*a,netWidth=82*b;
  svg.append(svgEl("path",{
    d:curve(747,278,909,205,repayWidth),
    class:"pf-tesoro-ribbon pf-tesoro-amort"
  }));
  svg.append(svgEl("path",{
    d:curve(747,323,909,386,netWidth),
    class:"pf-tesoro-ribbon pf-tesoro-net"
  }));
  box(svg,38,grossY,345,109,"Emisión bruta · suma de líneas",totals.gross,"pf-tesoro-source");
  box(svg,462,grossY,285,109,"Tesoro Público",totals.gross,"pf-tesoro-center");
  box(svg,909,151,305,109,"Amortización de deuda",totals.repayments,"pf-tesoro-amort-box");
  box(svg,909,332,305,109,"Emisión neta",totals.net,"pf-tesoro-net-box");
  addText(svg,915,484,"Financiación neta ≠ gasto público",
    "pf-tesoro-explainer");
  addText(svg,915,506,"Tampoco equivale al déficit del S.13",
    "pf-tesoro-explainer");
  frame.append(svg);root.append(frame);
  const cards=dom("div","pf-tesoro-cards");
  for(const row of data.lines){
    const card=dom("div","pf-tesoro-card");
    card.append(dom("strong","",row.label),
      dom("span","","Emitido: "+fmt(row.gross)),
      dom("span","","Devuelto: "+fmt(row.repayments)),
      dom("span","","Emisión neta: "+fmt(row.net)));
    cards.append(card);
  }
  root.append(cards);
  const note=dom("p","pf-tesoro-note",
    "Conciliación por líneas: "+fmt(totals.repayments)+" amortizado + "+
    fmt(totals.net)+" emisión neta = "+fmt(totals.gross)+" emitido. " +
    "Total bruto publicado: "+fmt(totals.officialGross)+
    " (diferencia de 1 M€ por redondeo). La emisión neta no es una salida de caja: " +
    "es el saldo tras amortizar. Falta la contabilidad de caja y de activos financieros " +
    "para construir entradas = pagos + variación de tesorería.");
  root.append(note);
  const source=dom("a","pf-tesoro-official","Fuente original: Tesoro Público · Cierre 2024 ↗");
  source.href=data.source;source.target="_blank";source.rel="noopener noreferrer";
  root.append(source);
  return root;
}


/**
 * A persistent, legible secondary tier INSIDE the principal money diagram.
 * Separate scope (State Treasury vs ESA S.13) and separate accounting basis.
 * Gross issues and principal repayments are flows; net issuance is a difference,
 * NOT a destination for the money received. No link is drawn to the S.13 fund.
 */
export function createIntegratedTreasuryRibbon(onExplore,data=TREASURY_DEBT_2024,{interest=null,onInterest=null}={}){
  const b=validateTreasuryDebt(data);
  const main=dom("section","pf-integrated-financing");
  main.setAttribute("aria-label","Deuda pública en el mapa principal: emisiones, amortizaciones y saldo neto del Tesoro");
  main.dataset.perimeter="treasury-state";
  const heading=dom("div","pf-integrated-heading");
  const intro=dom("div","pf-integrated-headline");
  intro.append(
    dom("strong","","02 · DEUDA Y FINANCIACIÓN"),
    dom("span","","Tesoro del Estado · "+data.year+" · no consolidado S.13")
  );
  const more=dom("button","pf-integrated-explore","Ver desglose de deuda ↗");
  more.type="button";
  if(typeof onExplore==="function")more.addEventListener("click",onExplore);
  heading.append(intro,more);
  main.append(heading);
  // One proportional horizontal bar is easier to read than a miniature
  // second Sankey. Parts sum EXACTLY to issue volume by instrument.
  const container=dom("div","pf-integrated-canvas");
  const ratio=b.repayments/b.gross;
  const bar=dom("div","pf-integrated-bar");
  bar.setAttribute("role","img");
  bar.setAttribute("aria-label",
    "Deuda bruta emitida "+fmt(b.gross)+": "+fmt(b.repayments)+
    " amortización ("+(100*ratio).toFixed(1)+" %) y "+
    fmt(b.net)+" emisión neta ("+(100*(1-ratio)).toFixed(1)+" %). "+
    "Emisión neta es un saldo, no un pago.");
  const repay=dom("div","pf-integrated-bar-repay");
  const net=dom("div","pf-integrated-bar-net");
  repay.style.width=(ratio*100).toFixed(3)+"%";
  net.style.width=((1-ratio)*100).toFixed(3)+"%";
  bar.append(repay,net);
  const legend=dom("div","pf-integrated-bar-legend");
  const a=dom("div","pf-integrated-bar-key");
  a.append(dom("span","pf-integrated-dot pf-integrated-dot-repay"),
    dom("span","","Capital devuelto · "+(100*ratio).toFixed(1).replace(".",",")+" %"),
    dom("strong","",fmt(b.repayments)));
  const n=dom("div","pf-integrated-bar-key");
  n.append(dom("span","pf-integrated-dot pf-integrated-dot-net"),
    dom("span","","Emisión neta · "+(100*(1-ratio)).toFixed(1).replace(".",",")+" %"),
    dom("strong","",fmt(b.net)));
  legend.append(a,n);
  const total=dom("div","pf-integrated-issued");
  total.append(dom("span","","Nueva deuda emitida"),
    dom("strong","",fmt(b.gross)),
    dom("small","","≈ 79 % refinancia deuda anterior"));
  container.append(total,bar,legend);
  main.append(container);
  if(interest&&Number.isFinite(Number(interest.value))&&Number(interest.value)>0){
    const existing=dom("div","pf-integrated-interest");
    existing.append(dom("strong","","Intereses de deuda · COFOG 01.7"),
      dom("span","",fmt(Number(interest.value))+" · ya incluidos en el gasto S.13 del gráfico superior"));
    if(typeof onInterest==="function"){
      const link=dom("button","","Explorar intereses en el Sankey ↗");
      link.type="button";link.addEventListener("click",onInterest);existing.append(link);
    }
    main.append(existing);
  }
  main.append(dom("p","pf-integrated-disclaimer",
    "Tesoro del Estado, no todas las AAPP. Emisión neta = deuda nueva − capital devuelto: "+
    "es un saldo de financiación, no gasto ni caja disponible. Total bruto oficial: "+
    fmt(b.officialGross)+" (1 M€ de redondeo). "+
    "No debe sumarse a COFOG ni confundirse con el déficit S.13."));
  return main;
}
