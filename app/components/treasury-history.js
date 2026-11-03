/*
 * Annual issuance / redemption / net financing of State Treasury debt.
 * Source 2012-2025: Tesoro, Estrategia de Financiación 2026, gráfico 2,
 * and exact 2024 (Tesoro Estrategia 2025) / 2025 (2026 Estrategia and
 * September 2026 monthly statistical table).
 *
 * Historical 2012-2023 amounts were digitized from labels rounded to 0.1
 * BILLION euros: do not claim million-euro precision for these years.
 * 2024 and 2025 Treasury publications differ by 1 M€ in arithmetic
 * because some aggregate/item series are rounded independently.
 * 2026 is a partial period, through September 2026 only.
 */
export const TREASURY_HISTORY=Object.freeze([
  {
    "year": 2012,
    "issued": 249600,
    "paid": 153000,
    "net": 96600,
    "precision": "rounded",
    "period": "año completo"
  },
  {
    "year": 2013,
    "issued": 238600,
    "paid": 164900,
    "net": 73700,
    "precision": "rounded",
    "period": "año completo"
  },
  {
    "year": 2014,
    "issued": 241300,
    "paid": 185700,
    "net": 55600,
    "precision": "rounded",
    "period": "año completo"
  },
  {
    "year": 2015,
    "issued": 236800,
    "paid": 189100,
    "net": 47700,
    "precision": "rounded",
    "period": "año completo"
  },
  {
    "year": 2016,
    "issued": 221400,
    "paid": 186400,
    "net": 35000,
    "precision": "rounded",
    "period": "año completo"
  },
  {
    "year": 2017,
    "issued": 233900,
    "paid": 188900,
    "net": 45000,
    "precision": "rounded",
    "period": "año completo"
  },
  {
    "year": 2018,
    "issued": 213000,
    "paid": 178700,
    "net": 34300,
    "precision": "rounded",
    "period": "año completo"
  },
  {
    "year": 2019,
    "issued": 192800,
    "paid": 172800,
    "net": 20000,
    "precision": "rounded",
    "period": "año completo"
  },
  {
    "year": 2020,
    "issued": 277100,
    "paid": 167200,
    "net": 109900,
    "precision": "rounded",
    "period": "año completo"
  },
  {
    "year": 2021,
    "issued": 264300,
    "paid": 189200,
    "net": 75100,
    "precision": "rounded",
    "period": "año completo"
  },
  {
    "year": 2022,
    "issued": 232600,
    "paid": 162500,
    "net": 70100,
    "precision": "rounded",
    "period": "año completo"
  },
  {
    "year": 2023,
    "issued": 252000,
    "paid": 186900,
    "net": 65100,
    "precision": "rounded",
    "period": "año completo"
  },
  {
    "year": 2024,
    "issued": 259365,
    "paid": 204332,
    "net": 55034,
    "precision": "official",
    "period": "año completo"
  },
  {
    "year": 2025,
    "issued": 274017,
    "paid": 219241,
    "net": 54775,
    "precision": "official",
    "period": "año completo"
  },
  {
    "year": 2026,
    "issued": 234364,
    "paid": 171489,
    "net": 62875,
    "precision": "official",
    "period": "enero-septiembre"
  }
]);
export const TREASURY_HISTORY_SOURCES=Object.freeze({
  annual:"https://www.tesoro.es/sites/default/files/estrategia/Estrategia_Tesoro_Publico_2026_Espan%CC%83ol.pdf",
  debt2024:"https://www.tesoro.es/sites/default/files/estrategia/Estrategia_Tesoro_Publico_2025_Espan%CC%83ol.pdf",
  monthly:"https://www.tesoro.es/documents/d/tesoro/13-pdf"
});
export function validateTreasuryHistory(rows=TREASURY_HISTORY){
  if(!Array.isArray(rows)||rows.length<2)throw Error("Tesoro: falta serie histórica");
  const years=new Set();
  for(const d of rows){
    if(!Number.isInteger(d.year)||years.has(d.year))throw Error("Tesoro: año repetido o incorrecto");
    years.add(d.year);
    if(![d.issued,d.paid,d.net].every(v=>Number.isInteger(v)&&v>=0))
      throw Error("Tesoro: importes negativos o no enteros");
    if(Math.abs(d.issued-d.paid-d.net)>1)throw Error("Tesoro: balance sin conciliar");
    if(d.precision!=="rounded"&&d.precision!=="official")throw Error("Tesoro: precisión no informada");
    if(d.precision==="rounded"&&[d.issued,d.paid,d.net].some(v=>v%100!==0))
      throw Error("Tesoro: la serie redondeada no conserva la precisión de su fuente");
    if(d.year===2026&&d.period!=="enero-septiembre")throw Error("Tesoro: 2026 no es un año completo");
  }
  return rows;
}
const dom=(tag,className,content)=>{
  const el=document.createElement(tag);
  if(className)el.className=className;
  if(content!==undefined)el.textContent=String(content);
  return el;
};
const fmt=n=>new Intl.NumberFormat("es-ES",{maximumFractionDigits:0}).format(n);
export function createTreasuryHistoryTable(rows=TREASURY_HISTORY){
  validateTreasuryHistory(rows);
  const ordered=[...rows].sort((a,b)=>b.year-a.year);
  const root=dom("section","pf-debt-history");
  root.id="pf-debt-history";
  root.setAttribute("aria-label","Histórico por año de deuda emitida, pagada y saldo del Tesoro");
  const header=dom("div","pf-debt-history-head");
  const title=dom("h3","","Deuda del Estado: emisión y devolución por año");
  const period=dom("span","","2012–2026 · millones de euros");
  header.append(title,period);
  root.append(header);
  const scroller=dom("div","pf-debt-history-scroll");
  scroller.tabIndex=0;
  scroller.setAttribute("role","region");
  scroller.setAttribute("aria-label","Tabla desplazable horizontalmente por años");
  const table=dom("table","pf-debt-history-table");
  const caption=dom("caption","","Evolución de emisiones brutas, amortizaciones y financiación neta del Tesoro Público; 2026 hasta septiembre.");
  table.append(caption);
  const thead=dom("thead");
  const heading=dom("tr");
  const firstHead=dom("th","pf-debt-history-first","Concepto");
  firstHead.scope="col";heading.append(firstHead);
  for(const entry of ordered){
    const cell=dom("th",entry.year===2026?"pf-debt-history-partial":"",String(entry.year));
    cell.scope="col";
    if(entry.year===2026)cell.append(dom("small","","ene–sep"));
    heading.append(cell);
  }
  thead.append(heading);table.append(thead);
  const tbody=dom("tbody");
  for(const {label,key} of [
    {label:"Deuda pagada",key:"paid"},
    {label:"Deuda emitida",key:"issued"},
    {label:"Balance (emitida − pagada)",key:"net"}
  ]){
    const tr=dom("tr",key==="net"?"pf-debt-history-net":"");
    const rowName=dom("th","pf-debt-history-first",label);
    rowName.scope="row";tr.append(rowName);
    for(const entry of ordered){
      const value=entry[key],cell=dom("td",entry.year===2026?"pf-debt-history-partial":"");
      cell.textContent=(key==="net"&&value>0?"+":"")+(entry.precision==="rounded"?"≈ ":"")+fmt(value);
      cell.title=`${label} · ${entry.year} (${entry.period}); ${entry.precision==="rounded"?"importe aproximado, fuente redondeada a 100 millones":"dato oficial en millones de euros"}`;
      tr.append(cell);
    }
    tbody.append(tr);
  }
  table.append(tbody);
  scroller.append(table);
  root.append(scroller);
  const notes=dom("div","pf-debt-history-notes");
  notes.append(
    dom("p","","Un balance positivo significa que se emitió más deuda de la que se devolvió; no demuestra que cada devolución se pagara íntegramente con deuda nueva."),
    dom("p","","2012–2023: cifras aproximadas, fuente redondeada a 100 M€. 2024–2025: importes publicados (puede haber diferencias de 1 M€ por redondeo). 2026: enero–septiembre, no comparable con años completos. Se muestran emisiones del Tesoro, no toda la deuda de las administraciones ni el gasto en intereses.")
  );
  const sources=dom("p","");
  sources.append("Fuentes: ");
  const a=dom("a","","Tesoro · estrategia 2026");
  a.href=TREASURY_HISTORY_SOURCES.annual;a.target="_blank";a.rel="noopener noreferrer";
  const b=dom("a","","Tesoro · financiación mensual");
  b.href=TREASURY_HISTORY_SOURCES.monthly;b.target="_blank";b.rel="noopener noreferrer";
  sources.append(a," · ",b);
  notes.append(sources);
  root.append(notes);
  return root;
}
