import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {TREASURY_DEBT_2024,validateTreasuryDebt} from "../../app/components/treasury-debt-flow.js";

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
 assert.match(file,/summaryRow\("01 · Cuenta no financiera · S\.13"/);
 assert.match(file,/summaryRow\("02 · Emisión y amortización · Tesoro"/);
 assert.match(file,/\{value:recursos\.value,label:"Recursos"\}/);
 assert.match(file,/\{value:deficit\.value,label:"Brecha B\.9"/);
 assert.match(file,/\{value:gasto\.value,label:"Gasto"/);
 assert.match(file,/\{value:debt\.repayments,label:"Capital devuelto"/);
 assert.match(file,/\{value:debt\.net,label:"Emisión neta"/);
 assert.match(file,/relación conceptual, no igualdad/);
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
