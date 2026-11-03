import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {TREASURY_DEBT_2024,validateTreasuryDebt} from "../../app/components/treasury-debt-flow.js";
import {PUBLIC_CASH_2024,validatePublicCashFlow,cents} from "../../app/components/public-cash-sankey.js";
import {TREASURY_HISTORY,validateTreasuryHistory,reconcileTreasuryStock,TREASURY_HISTORY_SOURCES,PIB_NOMINAL_INE,treasuryDebtToGdpPercent,DEUDA_AAPP_PDE_BDE,aappDebtToGdpPercent} from "../../app/components/treasury-history.js";

test("debt issuance reconciles by instrument: principal repayments and NET issuance",()=>{
 const rows=TREASURY_DEBT_2024.lines;
 assert.equal(rows.length,2);
 assert.deepEqual(rows.map(x=>[x.gross,x.repayments,x.net]),
  [[169898,118118,51780],[89468,86214,3254]]);
 const result=validateTreasuryDebt();
 assert.equal(result.gross,259366);
 assert.equal(result.repayments,204332);
 assert.equal(result.net,55034);
 assert.equal(result.repayments+result.net,result.gross);
 assert.equal(result.officialGross,259365);
 assert.equal(result.publishedRounding,1);
 assert.equal(result.officialNet,55034);
});
test("debt flow fails closed when amounts, perimeter or vintage are wrong",()=>{
 const data=TREASURY_DEBT_2024;
 assert.throws(()=>validateTreasuryDebt({...data,scope:"Administraciones Públicas S.13"}));
 assert.throws(()=>validateTreasuryDebt({...data,year:2025}));
 assert.throws(()=>validateTreasuryDebt({...data,lines:[{...data.lines[0],repayments:100},data.lines[1]]}),/no concilian/);
 assert.throws(()=>validateTreasuryDebt({...data,official_gross:270000}),/Diferencia/);
});

test("principal map contains two independent identities and one compact proportional bar",()=>{
 const file=readFileSync(new URL("../../app/components/public-finance-sankey.js",import.meta.url),"utf8");
 const ribbon=readFileSync(new URL("../../app/components/treasury-debt-flow.js",import.meta.url),"utf8");
 assert.match(file,/chart\.append\(overview,svg\)/);
 assert.match(file,/chart\.append\(createIntegratedTreasuryRibbon\(/);
 assert.match(file,/pf-bridge-overview/);
 assert.match(file,/pf-bridge-compare/);
 assert.match(file,/summaryRow\("1 · ¿Cómo se paga el gasto público\?"/);
 assert.match(file,/summaryRow\("2 · ¿Cómo se renueva la deuda\?"/);
 assert.match(file,/\{value:recursos\.value,label:"Ingresos públicos"\}/);
 assert.match(file,/\{value:deficit\.value,label:"Déficit: lo que falta"/);
 assert.match(file,/\{value:gasto\.value,label:"Gasto \(con intereses\)"/);
 assert.match(file,/\{value:debt\.repayments,label:"Deuda antigua devuelta"/);
 assert.match(file,/\{value:debt\.net,label:"Financiación neta"/);
 assert.match(file,/El Tesoro no es una hucha/);
 assert.match(file,/Los intereses ya están incluidos en el gasto de arriba/);
 assert.match(file,/devolver el capital, no/);
 assert.match(file,/currentYear===TREASURY_DEBT_2024\.year/);
 assert.match(file,/if\(currentView==="treasury"\)/);
 assert.match(ribbon,/pf-integrated-financing/);
 assert.match(ribbon,/pf-integrated-bar/);
 assert.match(ribbon,/pf-integrated-bar-repay/);
 assert.match(ribbon,/pf-integrated-bar-net/);
 assert.match(ribbon,/repay\.style\.width=\(ratio\*100\)/);
 assert.match(ribbon,/net\.style\.width=\(\(1-ratio\)\*100\)/);
 assert.match(ribbon,/pf-integrated-interest/);
 assert.match(file,/byCode\.get\("01\.7"\)/);
 assert.match(ribbon,/ya incluidos en el gasto S\.13/);
 assert.match(ribbon,/No debe sumarse a COFOG/);
 assert.doesNotMatch(file,/chart\.replaceChildren\(createIntegratedTreasuryRibbon/);
});

test("clicking the center populates a cash-accounting explanation rather than an empty drawer",()=>{
 const source=readFileSync(new URL("../../app/components/public-finance-sankey.js",import.meta.url),"utf8");
 assert.match(source,/centerGroup\.addEventListener\("click", \(\) => openDetail\(gasto\)\)/);
 assert.match(source,/if\(row\.code==="S13\.GASTO"\)\{/);
 assert.match(source,/detail\.append\(h\)/);
 assert.match(source,/detail\.append\(facts\)/);
 assert.match(source,/detail\.append\(paths\)/);
 assert.match(source,/root\.classList\.add\("is-detail-open"\);\s*return;/);
 assert.match(source,/detalle-central/);
 assert.match(source,/pf-cash-concept/);
 assert.match(source,/Impuestos, otros ingresos, préstamos nuevos y dinero que ya había/);
 assert.match(source,/Esquema orientativo del Estado/);
 assert.doesNotMatch(source,/if\(row\.code==="S13\.GASTO"\)return;/);
});


test("IGAE 2024 consolidated public-sector cash flow balances to the euro cent",()=>{
  const result=validatePublicCashFlow(PUBLIC_CASH_2024);
  assert.equal(result.incomingCents,68143129825034);
  assert.equal(result.outgoingCents,68143129825034);
  assert.equal(result.issued,cents("180559006645.86"));
  assert.equal(result.redeemed,cents("118621650030.44"));
  assert.equal(result.opening,cents("81709263337.42"));
  assert.equal(result.closing,cents("67814015576.93"));
  assert.equal(result.netCashChange,-cents("13895247760.49"));
  assert.equal(PUBLIC_CASH_2024.incoming.length,7);
  assert.equal(PUBLIC_CASH_2024.outgoing.length,8);
});

test("IGAE cash Sankey fails closed for mixed S.13 perimeter, bad sums or wrong debt",()=>{
  assert.throws(()=>validatePublicCashFlow({...PUBLIC_CASH_2024,scope:"Administraciones Públicas S.13"}),/perímetro/);
  assert.throws(()=>validatePublicCashFlow({...PUBLIC_CASH_2024,year:2025}),/ejercicio/);
  assert.throws(()=>validatePublicCashFlow({
    ...PUBLIC_CASH_2024,
    outgoing:PUBLIC_CASH_2024.outgoing.map(x=>x.id==="gestion-pagos"?{...x,euros:"435119185163.05"}:x)
  }),/no cuadran/);
  assert.throws(()=>validatePublicCashFlow({
    ...PUBLIC_CASH_2024,
    incoming:PUBLIC_CASH_2024.incoming.map(x=>x.id==="deuda-emitida"?{...x,euros:"180559006645.87"}:x),
    outgoing:PUBLIC_CASH_2024.outgoing.map(x=>x.id==="gestion-pagos"?{...x,euros:"435119185163.05"}:x)
  }),/financiación/);
});

test("cash flow is attached to main Sankey without replacing COFOG and provides navigation",()=>{
  const file=readFileSync(new URL("../../app/components/public-finance-sankey.js",import.meta.url),"utf8");
  assert.match(file,/import \{createPublicCashSankey\}/);
  assert.match(file,/chart\.append\(overview,svg\)/);
  assert.match(file,/chart\.append\(createPublicCashSankey\(\)\)/);
  assert.match(file,/Ver Sankey de caja completo/);
  assert.match(file,/querySelector\("#pf-real-cash"\)/);
  assert.match(file,/\.pf-real-cash-scroll/);
});


test("treasury annual debt history includes all years 2012-2025 plus partial 2026",()=>{
  const data=validateTreasuryHistory();
  assert.equal(data.length,15);
  assert.deepEqual(data.map(x=>x.year),Array.from({length:15},(_,i)=>2012+i));
  const exact=year=>data.find(x=>x.year===year);
  assert.deepEqual([exact(2024).paid,exact(2024).issued,exact(2024).net],
    [204332,259365,55034]);
  assert.deepEqual([exact(2025).paid,exact(2025).issued,exact(2025).net],
    [219241,274017,54775]);
  assert.deepEqual([exact(2026).paid,exact(2026).issued,exact(2026).net],
    [171489,234364,62875]);
  assert.equal(exact(2026).period,"enero-septiembre");
  assert.ok(data.filter(x=>x.year<=2023).every(x=>x.precision==="rounded"));
  assert.ok(data.every(x=>Math.abs(x.issued-x.paid-x.net)<=1));
});

test("annual debt history fails closed on false precision and nonsensical balances",()=>{
  assert.throws(()=>validateTreasuryHistory([
    ...TREASURY_HISTORY.slice(0,1),
    {...TREASURY_HISTORY[1],paid:TREASURY_HISTORY[1].paid+200}
  ]),/balance/);
  assert.throws(()=>validateTreasuryHistory([
    {...TREASURY_HISTORY[0],issued:249601},
    ...TREASURY_HISTORY.slice(1)
  ]),/precisión/);
  assert.throws(()=>validateTreasuryHistory([
    ...TREASURY_HISTORY.slice(0,-1),
    {...TREASURY_HISTORY.at(-1),period:"año completo"}
  ]),/2026 no es un año completo/);
  assert.throws(()=>validateTreasuryHistory([
    TREASURY_HISTORY[0],TREASURY_HISTORY[0]
  ]),/repetido/);
});

test("annual table is directly below treasury debt ribbon, with year columns",()=>{
  const file=readFileSync(new URL("../../app/components/public-finance-sankey.js",import.meta.url),"utf8");
  const table=readFileSync(new URL("../../app/components/treasury-history.js",import.meta.url),"utf8");
  assert.match(file,/import \{createTreasuryHistoryTable\}/);
  assert.match(file,/chart\.append\(createTreasuryHistoryTable\(\)\)/);
  assert.match(file,/\.pf-debt-history-scroll/);
  assert.match(table,/Balance \(emitida − pagada\)/);
  assert.match(table,/Deuda pagada/);
  assert.match(table,/Deuda emitida/);
  assert.match(table,/enero-septiembre/);
  assert.match(table,/aria-label","Tabla desplazable horizontalmente por años"/);
});


test("official Tesoro nominal debt stock is published for each year 2012–2026",()=>{
  const stock=[688231,760256,841041,889019,923003,968460,1003829,1023760,
    1134248,1212897,1299193,1382012,1440970,1516859,1585361];
  assert.deepEqual(TREASURY_HISTORY.map(x=>x.stock),stock);
  assert.equal(TREASURY_HISTORY_SOURCES.stock,"https://www.tesoro.es/documents/d/tesoro/01-pdf");
  assert.ok(TREASURY_HISTORY.every(x=>Number.isSafeInteger(x.stock)&&x.stock>0));
  assert.equal(TREASURY_HISTORY.at(-1).period,"enero-septiembre");
});

test("debt stock reconciliation does not falsely equal net issuance to nominal stock change",()=>{
  const bridge2024=reconcileTreasuryStock(2024);
  assert.deepEqual(bridge2024,{year:2024,previousStock:1382012,stock:1440970,
    change:58958,netByFlows:55033,difference:3925});
  const bridge2025=reconcileTreasuryStock(2025);
  assert.deepEqual(bridge2025,{year:2025,previousStock:1440970,stock:1516859,
    change:75889,netByFlows:54776,difference:21113});
  assert.equal(reconcileTreasuryStock(2012),null);
});

test("historical debt table has seven rows and uses a sourced nominal stock, not a fabricated cumulative sum",()=>{
  const source=readFileSync(new URL("../../app/components/treasury-history.js",import.meta.url),"utf8");
  const css=readFileSync(new URL("../../app/components/public-finance-sankey.js",import.meta.url),"utf8");
  assert.match(source,/Deuda del Tesoro pendiente/);
  assert.match(source,/key:"stock"/);
  assert.match(source,/TREASURY_HISTORY_SOURCES\.stock/);
  assert.match(source,/reconcileTreasuryStock\(2024,rows\)/);
  assert.match(source,/Fuente|Fuentes/);
  assert.match(source,/deuda nominal/);
  assert.match(css,/\.pf-debt-history-stock/);
});


test("official INE nominal annual GDP series covers each closed Treasury debt year",()=>{
  const annual=PIB_NOMINAL_INE.annual;
  assert.equal(PIB_NOMINAL_INE.series,"CNE16231");
  assert.equal(PIB_NOMINAL_INE.unit,"M€");
  assert.equal(Object.keys(annual).length,14);
  assert.equal(annual[2012],1035964);
  assert.equal(annual[2014],1038949);
  assert.equal(annual[2023],1496277);
  assert.equal(annual[2024],1598588);
  assert.equal(annual[2025],1690012);
  assert.equal(annual[2026],undefined);
  assert.match(PIB_NOMINAL_INE.source,/ine\.es\/consul\/serie\.do/);
  assert.ok(TREASURY_HISTORY.filter(x=>x.period==="año completo")
    .every(x=>Number.isFinite(treasuryDebtToGdpPercent(x))));
});

test("debt-to-GDP ratio uses State Treasury outstanding, not all-administration PDE",()=>{
  const row=year=>TREASURY_HISTORY.find(x=>x.year===year);
  const p2024=treasuryDebtToGdpPercent(row(2024));
  const p2025=treasuryDebtToGdpPercent(row(2025));
  assert.ok(Math.abs(p2024-1440970/1598588*100)<1e-10);
  assert.ok(Math.abs(p2025-1516859/1690012*100)<1e-10);
  assert.equal(Number(p2024.toFixed(1)),90.1);
  assert.equal(Number(p2025.toFixed(1)),89.8);
  assert.equal(treasuryDebtToGdpPercent(row(2026)),null);
  assert.throws(()=>treasuryDebtToGdpPercent(row(2024),{
    ...PIB_NOMINAL_INE,
    unit:"EUR"
  }),/incompatible/);
  assert.throws(()=>treasuryDebtToGdpPercent(row(2024),{
    ...PIB_NOMINAL_INE,
    annual:{...PIB_NOMINAL_INE.annual,2024:undefined}
  }),/ausente/);
});

test("seventh historic row explains comparable annual GDP and omits incomplete 2026",()=>{
  const source=readFileSync(new URL("../../app/components/treasury-history.js",import.meta.url),"utf8");
  const component=readFileSync(new URL("../../app/components/public-finance-sankey.js",import.meta.url),"utf8");
  assert.match(source,/Deuda del Tesoro \/ PIB \(%\)/);
  assert.match(source,/key:"gdpPct"/);
  assert.match(source,/treasuryDebtToGdpPercent\(entry\)/);
  assert.match(source,/pct===null\?"—"/);
  assert.match(source,/PIB_NOMINAL_INE\.source/);
  assert.match(source,/No es la ratio oficial de deuda pública PDE/);
  assert.match(component,/\.pf-debt-history-gdp/);
});


test("deuda PDE AAPP consolidada: 2024 y 2025 coinciden con la referencia pública",()=>{
  assert.equal(DEUDA_AAPP_PDE_BDE.annual[2024],1620578);
  assert.equal(DEUDA_AAPP_PDE_BDE.annual[2025],1698355);
  assert.equal(DEUDA_AAPP_PDE_BDE.annual[2012],927813);
  assert.equal(DEUDA_AAPP_PDE_BDE.unit,"M€");
  const row=year=>TREASURY_HISTORY.find(x=>x.year===year);
  assert.equal(Number(aappDebtToGdpPercent(row(2024)).toFixed(1)),101.4);
  assert.equal(Number(aappDebtToGdpPercent(row(2025)).toFixed(1)),100.5);
  assert.equal(aappDebtToGdpPercent(row(2026)),null);
  assert.ok(DEUDA_AAPP_PDE_BDE.annual[2025]>row(2025).stock);
  assert.throws(()=>aappDebtToGdpPercent(row(2025),PIB_NOMINAL_INE,{
    ...DEUDA_AAPP_PDE_BDE,
    scope:"Tesoro Público"
  }),/perímetro/);
});

test("debt table distinguishes State Treasury issuance and total AAPP stock and ratios",()=>{
  const source=readFileSync(new URL("../../app/components/treasury-history.js",import.meta.url),"utf8");
  const css=readFileSync(new URL("../../app/components/public-finance-sankey.js",import.meta.url),"utf8");
  assert.match(source,/Deuda del Tesoro pendiente/);
  assert.match(source,/Deuda del Tesoro \/ PIB \(%\)/);
  assert.match(source,/Deuda total AAPP \(PDE\)/);
  assert.match(source,/Deuda total AAPP \/ PIB \(%\)/);
  assert.match(source,/key:"aappStock"/);
  assert.match(source,/key:"aappPct"/);
  assert.match(source,/DEUDA_AAPP_PDE_BDE\.officialSource/);
  assert.match(source,/algunas se prestan dinero entre sí/);
  assert.match(css,/\.pf-debt-history-aapp-pct/);
});
