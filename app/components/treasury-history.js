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
 *
 * STOCK (stock property, M€): official Tesoro chart 01,
 * "Deuda del Estado en circulación" (end-of-year nominal outstanding).
 * For 2026 the stock is the September 2026 balance, not year end.
 * These stock values are NOT S.13 general government debt (PDE).
 * Issuance/redemptions are financing flows in effective terms,
 * whereas stock is nominal and may include adjustments/other items;
 * therefore year-end stock change need not equal issued - paid.
 * PIB nominal anual (M€) de España: INE serie CNE16231, consulta 03/11/2026.
 * No extrapolamos el PIB de 2025 a 2026 ni mezclamos el PIB trimestral con el anual.
 */
export const TREASURY_HISTORY=Object.freeze([
  {
    "year": 2012,
    "issued": 249600,
    "paid": 153000,
    "net": 96600,
    "precision": "rounded",
    "period": "año completo",
    "stock": 688231
  },
  {
    "year": 2013,
    "issued": 238600,
    "paid": 164900,
    "net": 73700,
    "precision": "rounded",
    "period": "año completo",
    "stock": 760256
  },
  {
    "year": 2014,
    "issued": 241300,
    "paid": 185700,
    "net": 55600,
    "precision": "rounded",
    "period": "año completo",
    "stock": 841041
  },
  {
    "year": 2015,
    "issued": 236800,
    "paid": 189100,
    "net": 47700,
    "precision": "rounded",
    "period": "año completo",
    "stock": 889019
  },
  {
    "year": 2016,
    "issued": 221400,
    "paid": 186400,
    "net": 35000,
    "precision": "rounded",
    "period": "año completo",
    "stock": 923003
  },
  {
    "year": 2017,
    "issued": 233900,
    "paid": 188900,
    "net": 45000,
    "precision": "rounded",
    "period": "año completo",
    "stock": 968460
  },
  {
    "year": 2018,
    "issued": 213000,
    "paid": 178700,
    "net": 34300,
    "precision": "rounded",
    "period": "año completo",
    "stock": 1003829
  },
  {
    "year": 2019,
    "issued": 192800,
    "paid": 172800,
    "net": 20000,
    "precision": "rounded",
    "period": "año completo",
    "stock": 1023760
  },
  {
    "year": 2020,
    "issued": 277100,
    "paid": 167200,
    "net": 109900,
    "precision": "rounded",
    "period": "año completo",
    "stock": 1134248
  },
  {
    "year": 2021,
    "issued": 264300,
    "paid": 189200,
    "net": 75100,
    "precision": "rounded",
    "period": "año completo",
    "stock": 1212897
  },
  {
    "year": 2022,
    "issued": 232600,
    "paid": 162500,
    "net": 70100,
    "precision": "rounded",
    "period": "año completo",
    "stock": 1299193
  },
  {
    "year": 2023,
    "issued": 252000,
    "paid": 186900,
    "net": 65100,
    "precision": "rounded",
    "period": "año completo",
    "stock": 1382012
  },
  {
    "year": 2024,
    "issued": 259365,
    "paid": 204332,
    "net": 55034,
    "precision": "official",
    "period": "año completo",
    "stock": 1440970
  },
  {
    "year": 2025,
    "issued": 274017,
    "paid": 219241,
    "net": 54775,
    "precision": "official",
    "period": "año completo",
    "stock": 1516859
  },
  {
    "year": 2026,
    "issued": 234364,
    "paid": 171489,
    "net": 62875,
    "precision": "official",
    "period": "enero-septiembre",
    "stock": 1585361
  }
]);
export const TREASURY_HISTORY_SOURCES=Object.freeze({
  annual:"https://www.tesoro.es/sites/default/files/estrategia/Estrategia_Tesoro_Publico_2026_Espan%CC%83ol.pdf",
  debt2024:"https://www.tesoro.es/sites/default/files/estrategia/Estrategia_Tesoro_Publico_2025_Espan%CC%83ol.pdf",
  monthly:"https://www.tesoro.es/documents/d/tesoro/13-pdf",
  stock:"https://www.tesoro.es/documents/d/tesoro/01-pdf"
});
export const PIB_NOMINAL_INE=Object.freeze({
  source:"https://ine.es/consul/serie.do?c=2&d=true&s=CNE16231",
  series:"CNE16231",
  unit:"M€",
  label:"PIB a precios de mercado, precios corrientes, España",
  annual:Object.freeze({
    2012:1035964,2013:1025652,2014:1038949,2015:1087112,
    2016:1122967,2017:1170024,2018:1212276,2019:1253710,
    2020:1129214,2021:1235474,2022:1375863,2023:1496277,
    2024:1598588,2025:1690012
  })
});
export function treasuryDebtToGdpPercent(entry,gdp=PIB_NOMINAL_INE){
  // The stock/annual GDP ratio is defined here ONLY for closed calendar years.
  if(entry?.period!=="año completo")return null;
  if(!Number.isSafeInteger(entry.stock)||entry.stock<0)
    throw Error("Tesoro: deuda pendiente no válida");
  if(gdp?.series!=="CNE16231"||gdp?.unit!=="M€")
    throw Error("PIB: serie o unidad incompatible");
  const denominator=gdp.annual?.[entry.year];
  if(!Number.isSafeInteger(denominator)||denominator<=0)
    throw Error("PIB anual nominal ausente para "+entry.year);
  return entry.stock/denominator*100;
}
export function validateTreasuryHistory(rows=TREASURY_HISTORY){
  if(!Array.isArray(rows)||rows.length<2)throw Error("Tesoro: falta serie histórica");
  const years=new Set();
  for(const d of rows){
    if(!Number.isInteger(d.year)||years.has(d.year))throw Error("Tesoro: año repetido o incorrecto");
    years.add(d.year);
    if(![d.issued,d.paid,d.net,d.stock].every(v=>Number.isInteger(v)&&v>=0))
      throw Error("Tesoro: importes negativos o no enteros");
    if(Math.abs(d.issued-d.paid-d.net)>1)throw Error("Tesoro: balance sin conciliar");
    if(d.precision!=="rounded"&&d.precision!=="official")throw Error("Tesoro: precisión no informada");
    if(d.precision==="rounded"&&[d.issued,d.paid,d.net].some(v=>v%100!==0))
      throw Error("Tesoro: la serie redondeada no conserva la precisión de su fuente");
    if(d.year===2026&&d.period!=="enero-septiembre")throw Error("Tesoro: 2026 no es un año completo");
    // Cierre anual 2012-2025: no dar porcentajes si falta el PIB comparable.
    if(d.period==="año completo")treasuryDebtToGdpPercent(d);
  }
  return rows;
}
export function reconcileTreasuryStock(year,rows=TREASURY_HISTORY){
  const current=rows.find(d=>d.year===year);
  const previous=rows.find(d=>d.year===year-1);
  if(!current||!previous)return null;
  const change=current.stock-previous.stock;
  const netByFlows=current.issued-current.paid;
  return {year,previousStock:previous.stock,stock:current.stock,change,
    netByFlows,difference:change-netByFlows};
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
  root.setAttribute("aria-label","Histórico por año de deuda emitida, pagada, balance, deuda pendiente y porcentaje del PIB del Tesoro");
  const header=dom("div","pf-debt-history-head");
  const title=dom("h3","","Deuda del Estado: emisión, devolución y deuda pendiente");
  const period=dom("span","","2012–2026 · M€ y porcentaje del PIB");
  header.append(title,period);
  root.append(header);
  const scroller=dom("div","pf-debt-history-scroll");
  scroller.tabIndex=0;
  scroller.setAttribute("role","region");
  scroller.setAttribute("aria-label","Tabla desplazable horizontalmente por años");
  const table=dom("table","pf-debt-history-table");
  const caption=dom("caption","","Evolución de emisiones, amortizaciones, financiación neta, deuda pendiente y ratio de deuda del Tesoro sobre el PIB nominal anual de España. Año 2026 parcial.");
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
    {label:"Balance (emitida − pagada)",key:"net"},
    {label:"Deuda total pendiente",key:"stock"},
    {label:"Deuda pendiente / PIB (%)",key:"gdpPct"}
  ]){
    const tr=dom("tr",key==="net"?"pf-debt-history-net":key==="stock"?"pf-debt-history-stock":key==="gdpPct"?"pf-debt-history-gdp":"");
    const rowName=dom("th","pf-debt-history-first",label);
    rowName.scope="row";tr.append(rowName);
    for(const entry of ordered){
      const cell=dom("td",entry.year===2026?"pf-debt-history-partial":"");
      if(key==="gdpPct"){
        const pct=treasuryDebtToGdpPercent(entry);
        cell.textContent=pct===null?"—":new Intl.NumberFormat("es-ES",{
          minimumFractionDigits:1,maximumFractionDigits:1
        }).format(pct)+" %";
        cell.title=pct===null
          ?"2026 es parcial. Esta fila exige PIB nominal anual del mismo año; no se sustituye por el PIB de 2025 ni por una previsión."
          :`Deuda nominal del Tesoro ${fmt(entry.stock)} M€ / PIB nominal INE ${fmt(PIB_NOMINAL_INE.annual[entry.year])} M€ × 100. No es la ratio oficial de deuda PDE del conjunto de administraciones.`;
      }else{
        const value=entry[key];
        cell.textContent=(key==="net"&&value>0?"+":"")+(key!=="stock"&&entry.precision==="rounded"?"≈ ":"")+fmt(value);
        cell.title=key==="stock"
          ?`Deuda nominal oficial pendiente al ${entry.year===2026?"30/09":"31/12"}/${entry.year}. Tesoro Público, cuadro 01, millones de euros.`
          :`${label} · ${entry.year} (${entry.period}); ${entry.precision==="rounded"?"importe aproximado, fuente redondeada a 100 millones":"dato oficial en millones de euros"}`;
      }
      tr.append(cell);
    }
    tbody.append(tr);
  }
  table.append(tbody);
  scroller.append(table);
  root.append(scroller);
  const notes=dom("div","pf-debt-history-notes");
  const bridge=dom("details","pf-debt-history-explainer");
  bridge.append(dom("summary","","¿Por qué la deuda pendiente no coincide exactamente con la suma del año anterior y el balance?"));
  const example24=reconcileTreasuryStock(2024,rows);
  const example25=reconcileTreasuryStock(2025,rows);
  const sign=n=>n>0?"+":"";
  bridge.append(dom("p","",
    "Deuda final = deuda anterior + deuda emitida − deuda devuelta + otros cambios de valoración o cobertura. " +
    "El Tesoro publica las emisiones en términos efectivos y el saldo pendiente en términos nominales; no son magnitudes idénticas. " +
    "La diferencia se muestra como residuo de conciliación, no se atribuye sin prueba a un movimiento concreto."));
  if(example24&&example25)bridge.append(dom("p","",
    `Ejemplos: 2024, variación de deuda nominal ${sign(example24.change)}${fmt(example24.change)} frente a balance emitido − pagado ${sign(example24.netByFlows)}${fmt(example24.netByFlows)}; residuo ${sign(example24.difference)}${fmt(example24.difference)}. `+
    `2025, variación ${sign(example25.change)}${fmt(example25.change)} frente a balance ${sign(example25.netByFlows)}${fmt(example25.netByFlows)}; residuo ${sign(example25.difference)}${fmt(example25.difference)}.`));
  notes.append(bridge);
  notes.append(dom("p","",
    "Deuda pendiente / PIB = deuda nominal del Tesoro al 31 de diciembre ÷ PIB nominal anual de España (INE, serie CNE16231) × 100. No es la ratio oficial de deuda pública PDE de todas las administraciones. En 2026 figura «—» porque todavía no hay PIB anual cerrado."));
  notes.append(
    dom("p","","Un balance positivo significa que se emitió más deuda de la que se devolvió; no demuestra que cada devolución se pagara íntegramente con deuda nueva."),
    dom("p","","Emisión, amortización y balance 2012–2023: cifras aproximadas (redondeadas a 100 M€). Deuda total pendiente: importe oficial nominal al cierre de cada año, sin redondeo adicional. 2026: datos hasta septiembre; no son un cierre anual. Ámbito: Tesoro del Estado, no todas las administraciones; los intereses se contabilizan aparte.")
  );
  const sources=dom("p","");
  sources.append("Fuentes: ");
  const a=dom("a","","Tesoro · estrategia 2026");
  a.href=TREASURY_HISTORY_SOURCES.annual;a.target="_blank";a.rel="noopener noreferrer";
  const b=dom("a","","Tesoro · financiación mensual");
  b.href=TREASURY_HISTORY_SOURCES.monthly;b.target="_blank";b.rel="noopener noreferrer";
  const c=dom("a","","Tesoro · deuda nominal en circulación (cuadro 01)");
  c.href=TREASURY_HISTORY_SOURCES.stock;c.target="_blank";c.rel="noopener noreferrer";
  const d=dom("a","","INE · PIB nominal anual (CNE16231)");
  d.href=PIB_NOMINAL_INE.source;d.target="_blank";d.rel="noopener noreferrer";
  sources.append(a," · ",b," · ",c," · ",d);
  notes.append(sources);
  root.append(notes);
  return root;
}
