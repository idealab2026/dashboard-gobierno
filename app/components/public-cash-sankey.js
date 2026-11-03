/*
 * Caja real, no gasto SEC: Cuenta General del Estado 2024, Estado de flujos
 * de efectivo consolidado, p. 21 del documento (IGAE).
 * Sector público estatal consolidado ≠ Administraciones Públicas SEC S.13
 * y ≠ Tesoro Público individual. No imputar euros de impuestos a pagos.
 *
 * Valores literales en euros y céntimos para conservar el cierre contable:
 * https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadPublica/CPE/EjecucionPresupuestaria/Documents/C.G.E.%202024.pdf
 */
export const PUBLIC_CASH_2024=Object.freeze({
  year:2024,
  scope:"Sector público estatal consolidado · Cuenta General del Estado",
  unit:"EUR",
  source:"https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadPublica/CPE/EjecucionPresupuestaria/Documents/C.G.E.%202024.pdf",
  incoming:[
    {id:"gestion",label:"Cobros de gestión",euros:"397464802268.92",kind:"operating"},
    {id:"deuda-emitida",label:"Préstamos y deuda recibidos",euros:"180559006645.86",kind:"debt"},
    {id:"caja-inicial",label:"Dinero disponible al empezar 2024",euros:"81709263337.42",kind:"stock"},
    {id:"inversion-cobros",label:"Cobros por inversiones",euros:"15727380884.13",kind:"investment"},
    {id:"patrimonio-entradas",label:"Aportaciones al patrimonio",euros:"2195716018.96",kind:"other"},
    {id:"empresas-gestion",label:"Flujo neto de empresas públicas",euros:"1839532100.84",kind:"other"},
    {id:"ajustes-positivos",label:"Ajustes contables positivos",euros:"1935596994.21",kind:"adjustment"}
  ],
  outgoing:[
    {id:"gestion-pagos",label:"Pagos de gestión",euros:"435119185163.04",kind:"operating"},
    {id:"deuda-devuelta",label:"Capital de deuda devuelto",euros:"118621650030.44",kind:"debt"},
    {id:"caja-final",label:"Dinero disponible al terminar 2024",euros:"67814015576.93",kind:"stock"},
    {id:"inversion-pagos",label:"Pagos por inversiones",euros:"58529384925.70",kind:"investment"},
    {id:"dividendos",label:"Dividendos y otros instrumentos",euros:"601087149.73",kind:"other"},
    {id:"fundaciones",label:"Gestión neta de fundaciones públicas",euros:"238120073.47",kind:"other"},
    {id:"ajustes-negativos",label:"Ajustes contables negativos",euros:"504815089.73",kind:"adjustment"},
    {id:"patrimonio-salidas",label:"Pagos a propietarios",euros:"3040241.30",kind:"other"}
  ],
  adjustments:{
    /* Positivos: cambio de perímetro (+1.737.103.655,85 €)
       y cobros corregidos al revertir pagos pendientes (-M, +198.493.338,36 €). */
    positive:["1737103655.85","198493338.36"],
    /* Negativos: cobros pendientes negativos (-452.155.372,71 €)
       y efecto de cambio (-52.659.717,02 €). */
    negative:["452155372.71","52659717.02"]
  }
});

export function cents(euros){
  if(!/^\d+\.\d{2}$/.test(String(euros)))throw Error("Importe de caja sin dos decimales");
  const [whole,decimals]=String(euros).split(".");
  const result=Number(whole)*100+Number(decimals);
  if(!Number.isSafeInteger(result)||result<0)throw Error("Importe de caja fuera de rango");
  return result;
}
export function validatePublicCashFlow(data=PUBLIC_CASH_2024){
  if(data.year!==2024||data.unit!=="EUR"||
    data.scope!=="Sector público estatal consolidado · Cuenta General del Estado")
    throw Error("Caja: ejercicio, unidad o perímetro no conciliables");
  if(!data.incoming?.length||!data.outgoing?.length)throw Error("Caja: faltan entradas o salidas");
  const seen=new Set();
  const validateRows=(rows)=>{
    for(const item of rows){
      if(seen.has(item.id))throw Error("Caja: movimiento duplicado");
      seen.add(item.id);
      if(!item.label)throw Error("Caja: movimiento sin etiqueta");
      cents(item.euros);
    }
    return rows.reduce((sum,row)=>sum+cents(row.euros),0);
  };
  const incomingCents=validateRows(data.incoming);
  const outgoingCents=validateRows(data.outgoing);
  if(incomingCents!==outgoingCents)throw Error("Caja: los cobros y pagos no cuadran");
  const get=(name)=>[...data.incoming,...data.outgoing].find(d=>d.id===name);
  const opening=cents(get("caja-inicial")?.euros);
  const closing=cents(get("caja-final")?.euros);
  const issued=cents(get("deuda-emitida")?.euros);
  const redeemed=cents(get("deuda-devuelta")?.euros);
  const pos=data.adjustments?.positive?.reduce((a,b)=>a+cents(b),0);
  const neg=data.adjustments?.negative?.reduce((a,b)=>a+cents(b),0);
  if(pos!==cents(get("ajustes-positivos")?.euros)||
     neg!==cents(get("ajustes-negativos")?.euros))
    throw Error("Caja: ajustes del IGAE no conciliados");
  if(opening-closing!==1389524776049)throw Error("Caja: saldo inicial/final incorrecto");
  if(issued!==18055900664586||redeemed!==11862165003044)
    throw Error("Caja: financiación o amortización fuera de la cuenta IGAE");
  return {incomingCents,outgoingCents,opening,closing,issued,redeemed,
    netCashChange:closing-opening};
}

const NS="http://www.w3.org/2000/svg";
const dom=(tag,cls,txt)=>{
  const el=document.createElement(tag);
  if(cls)el.className=cls;
  if(txt!==undefined)el.textContent=String(txt);
  return el;
};
const svg=(tag,attrs={})=>{
  const el=document.createElementNS(NS,tag);
  for(const [key,value] of Object.entries(attrs))el.setAttribute(key,String(value));
  return el;
};
const mm=(c)=>c/1e8; // céntimos a millones de euros
const fmt=(value)=>new Intl.NumberFormat("es-ES",{maximumFractionDigits:1}).format(value)+" M€";
function ribbon(x1,y1,x2,y2,h){
  const halfway=(x1+x2)/2;
  const u=y1-h/2,l=y1+h/2,v=y2-h/2,w=y2+h/2;
  return [
    "M",x1,u,"C",halfway,u,halfway,v,x2,v,
    "L",x2,w,"C",halfway,w,halfway,l,x1,l,"Z"
  ].join(" ");
}
const KIND={
  operating:{incoming:"#7496b4",outgoing:"#c8aa85"},
  debt:{incoming:"#316b9a",outgoing:"#b87c35"},
  stock:{incoming:"#95a5b9",outgoing:"#7b95ad"},
  investment:{incoming:"#8ebcae",outgoing:"#c7b77c"},
  other:{incoming:"#b6b6be",outgoing:"#c6c2b6"},
  adjustment:{incoming:"#c7cbd1",outgoing:"#c7cbd1"}
};
export function createPublicCashSankey(data=PUBLIC_CASH_2024){
  const verified=validatePublicCashFlow(data);
  const root=dom("section","pf-real-cash");
  root.id="pf-real-cash";
  root.setAttribute("aria-label","Sankey de caja de 2024 del sector público estatal, deuda incluida");
  const heading=dom("div","pf-real-cash-heading");
  const title=dom("h3","", "Entradas y salidas reales de dinero · 2024");
  const scope=dom("p","", "Sector público estatal · datos de caja, no presupuesto");
  heading.append(title,scope);
  root.append(heading);
  const strip=dom("div","pf-real-cash-kpis");
  for(const [label,value] of [
    ["Deuda y préstamos recibidos",verified.issued],
    ["Capital de deuda devuelto",verified.redeemed],
    ["Dinero en caja al cierre",verified.closing]
  ]){
    const item=dom("div","pf-real-cash-kpi");
    item.append(dom("small","",label),dom("strong","",fmt(mm(value))));
    strip.append(item);
  }
  root.append(strip);
  const msg=dom("p","pf-real-cash-message",
    "Los ingresos, la nueva deuda y la caja inicial se reúnen para pagar servicios, inversiones y deuda que vence. No puede saberse qué euro concreto pagó cada cosa.");
  root.append(msg);
  const scroll=dom("div","pf-real-cash-scroll");
  const drawing=svg("svg",{
    viewBox:"0 0 1320 690",role:"img",
    "aria-label":"Entradas a una caja común y salidas desde esa misma caja, proporcionadas a sus importes"
  });
  const chartTitle=svg("title");
  chartTitle.textContent="Movimientos reales de caja consolidados: entradas igual a salidas, con devolución de deuda";
  drawing.append(chartTitle);
  const legend=[
    {x:26,label:"ENTRADAS Y CAJA INICIAL"},
    {x:543,label:"CAJA COMÚN"},
    {x:987,label:"PAGOS Y CAJA FINAL"}
  ];
  for(const t of legend){
    const node=svg("text",{x:t.x,y:32,class:"pf-real-cash-axis"});
    node.textContent=t.label;drawing.append(node);
  }
  const scale=535/verified.incomingCents;
  const yBase=82,gap=7;
  const columns=[
    {rows:data.incoming,origin:382,dest:582,kind:"incoming",labelX:28},
    {rows:data.outgoing,origin:738,dest:937,kind:"outgoing",labelX:949}
  ];
  const paths=new Map();
  for(const c of columns){
    let offset=0,coreOffset=0;
    for(const item of c.rows){
      const height=cents(item.euros)*scale;
      const hDisplay=Math.max(1.4,height);
      const yAtEdge=yBase+offset+hDisplay/2;
      const yAtCore=yBase+coreOffset+height/2+18;
      const left=c.kind==="incoming";
      const srcX=left?c.origin:c.origin;
      const dstX=left?c.dest:c.dest;
      const path=svg("path",{
        d:ribbon(srcX,yAtEdge,dstX,yAtCore,hDisplay),
        fill:KIND[item.kind][c.kind],
        class:"pf-real-cash-ribbon",
        "data-flow":item.id,
        "aria-label":item.label+" "+fmt(mm(cents(item.euros)))
      });
      const tip=svg("title");
      tip.textContent=item.label+": "+fmt(mm(cents(item.euros)));
      path.append(tip);drawing.append(path);
      paths.set(item.id,path);
      const block=svg("rect",{
        x:left?c.origin-13:c.dest,y:yAtEdge-hDisplay/2,
        width:13,height:hDisplay,rx:1,fill:KIND[item.kind][c.kind]
      });
      drawing.append(block);
      if(height>38){
        const label=svg("text",{
          x:c.labelX,y:yAtEdge-3,class:"pf-real-cash-label"
        });
        label.textContent=item.label;drawing.append(label);
        const value=svg("text",{
          x:c.labelX,y:yAtEdge+15,class:"pf-real-cash-value"
        });
        value.textContent=fmt(mm(cents(item.euros)));drawing.append(value);
      }
      offset+=hDisplay+gap;
      coreOffset+=height;
    }
  }
  const center=svg("rect",{x:582,y:78,width:156,height:588,rx:10,
    class:"pf-real-cash-center"});
  drawing.append(center);
  const big=svg("text",{x:660,y:355,"text-anchor":"middle",
    class:"pf-real-cash-center-main"});
  big.textContent="CAJA";drawing.append(big);
  const big2=svg("text",{x:660,y:382,"text-anchor":"middle",
    class:"pf-real-cash-center-sub"});
  big2.textContent="del sector público";drawing.append(big2);
  const big3=svg("text",{x:660,y:407,"text-anchor":"middle",
    class:"pf-real-cash-center-sub"});
  big3.textContent="estatal";drawing.append(big3);
  const big4=svg("text",{x:660,y:448,"text-anchor":"middle",
    class:"pf-real-cash-center-value"});
  big4.textContent=fmt(mm(verified.incomingCents));drawing.append(big4);
  scroll.append(drawing);
  root.append(scroll);
  const columnsText=dom("div","pf-real-cash-details");
  const buttons=new Map();
  let activeId=null;
  const setActive=(id)=>{
    activeId=activeId===id?null:id;
    for(const [name,path] of paths)path.style.opacity=activeId&&activeId!==name?".13":"";
    for(const [name,btn] of buttons)btn.setAttribute("aria-pressed",String(activeId===name));
  };
  for(const [label,rows] of [
    ["Cobros y dinero inicial",data.incoming],
    ["Pagos y dinero final",data.outgoing]
  ]){
    const list=dom("div","pf-real-cash-list");
    list.append(dom("strong","pf-real-cash-list-title",label));
    for(const entry of rows){
      const button=dom("button","pf-real-cash-entry");
      button.type="button";
      button.setAttribute("aria-pressed","false");
      const left=dom("span","pf-real-cash-entry-label");
      const dot=dom("i","pf-real-cash-dot");
      dot.style.backgroundColor=KIND[entry.kind][rows===data.incoming?"incoming":"outgoing"];
      left.append(dot,dom("span","",entry.label));
      button.append(left,dom("b","",fmt(mm(cents(entry.euros)))));
      button.addEventListener("click",()=>setActive(entry.id));
      button.addEventListener("mouseenter",()=>{if(!activeId)paths.get(entry.id).style.opacity="1";});
      button.addEventListener("mouseleave",()=>{if(!activeId)paths.get(entry.id).style.opacity="";});
      buttons.set(entry.id,button);
      list.append(button);
    }
    columnsText.append(list);
  }
  root.append(columnsText);
  const footer=dom("div","pf-real-cash-foot");
  const note=dom("p","",
    "Cuadre exacto: cobros + caja inicial + ajustes = pagos + caja final + ajustes. Incluye movimientos no monetarios de conciliación separados de los cobros/pagos. Los intereses forman parte de los pagos corrientes; el capital devuelto se muestra aparte.");
  const source=dom("a","","Fuente oficial: IGAE · Cuenta General del Estado 2024 · Estado de flujos de efectivo");
  source.href=data.source;
  source.target="_blank";source.rel="noopener noreferrer";
  const caution=dom("p","",
    "Ámbito distinto del Sankey S.13 (725.000 M€) y del cuadro de emisiones del Tesoro (204.332 M€ amortizados). Las cifras no deben sumarse ni identificarse entre sí.");
  footer.append(note,source,caution);
  root.append(footer);
  return root;
}
