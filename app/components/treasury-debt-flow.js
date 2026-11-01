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
export function createIntegratedTreasuryRibbon(onExplore,data=TREASURY_DEBT_2024){
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
  const container=dom("div","pf-integrated-canvas");
  const svg=svgEl("svg",{
    viewBox:"0 0 1320 244",
    role:"img",
    "aria-label":"Tesoro del Estado 2024: emisiones brutas según suma de instrumentos 259.366 millones, amortización 204.332 millones, emisión neta 55.034 millones. Total bruto publicado 259.365 millones; redondeo de un millón."
  });
  const tag=(x,y,value,klass)=>{
    addText(svg,x,y,value,"pf-integrated-svg-text "+klass);
  };
  const pill=(x,y,w,h,top,major,cls)=>{
    const g=svgEl("g",{class:"pf-integrated-svg-box "+cls});
    g.append(svgEl("rect",{x,y,width:w,height:h,rx:8}));
    const lab=svgEl("text",{x:x+15,y:y+27,class:"pf-integrated-svg-title"});
    lab.textContent=top;g.append(lab);
    const value=svgEl("text",{x:x+15,y:y+66,class:"pf-integrated-svg-number"});
    value.textContent=fmt(major);g.append(value);svg.append(g);
  };
  // Dashed boundary: a visual sibling, NEVER an S.13 monetary connection.
  svg.append(svgEl("path",{
    d:"M 8 7 L 1312 7",
    class:"pf-integrated-boundary"
  }));
  tag(32,37,"ENTRADAS DEL TESORO","pf-integrated-overline");
  tag(503,37,"OPERACIONES FINANCIERAS","pf-integrated-overline");
  tag(903,37,"SALIDAS Y SALDO NETO","pf-integrated-overline");
  // The visual widths are proportional only WITHIN this perimeter.
  // The net difference is dotted and expressly NOT an expense.
  const width=39;
  svg.append(svgEl("path",{d:curve(360,125,470,125,width),
    class:"pf-integrated-svg-link pf-integrated-gross"}));
  svg.append(svgEl("path",{d:curve(793,110,900,99,width*b.repayments/b.gross),
    class:"pf-integrated-svg-link pf-integrated-amort"}));
  svg.append(svgEl("path",{d:curve(793,142,900,182,width*b.net/b.gross),
    class:"pf-integrated-svg-link pf-integrated-difference"}));
  pill(32,76,328,96,"Nueva deuda emitida",b.gross,"pf-integrated-in");
  pill(470,76,323,96,"Tesoro · emisiones brutas",b.gross,"pf-integrated-central");
  pill(900,48,390,91,"Capital devuelto (amortización)",b.repayments,"pf-integrated-out");
  pill(900,150,390,91,"Emisión neta · saldo, no pago",b.net,"pf-integrated-balance");
  container.append(svg);
  main.append(container);
  main.append(dom("p","pf-integrated-disclaimer",
    "Las entradas y salidas mostradas son del Tesoro, no de todas las Administraciones Públicas. "+
    "El saldo neto es la diferencia emisión − amortización, no un destino del dinero; "+
    "total bruto publicado: "+fmt(b.officialGross)+" (diferencia 1 M€ por redondeo). "+
    "No debe sumarse a COFOG ni interpretarse como una conciliación de caja del S.13."));
  return main;
}
