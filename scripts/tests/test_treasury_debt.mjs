import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {TREASURY_DEBT_2024,validateTreasuryDebt} from "../../app/components/treasury-debt-flow.js";
import {PUBLIC_CASH_2024,validatePublicCashFlow,cents} from "../../app/components/public-cash-sankey.js";

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
