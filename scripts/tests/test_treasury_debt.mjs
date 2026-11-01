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

test("principal money map renders treasury band by default without replacing COFOG",()=>{
 const file=readFileSync(new URL("../../app/components/public-finance-sankey.js",import.meta.url),"utf8");
 const ribbon=readFileSync(new URL("../../app/components/treasury-debt-flow.js",import.meta.url),"utf8");
 assert.match(file,/chart\.append\(svg,createIntegratedTreasuryRibbon\(/);
 assert.match(file,/spendingButton\.textContent="Mapa principal · gasto y deuda"/);
 assert.match(file,/if\(currentView==="treasury"\)/);
 assert.match(file,/resetInlineSankey\(\)/);
 assert.match(file,/\.pf-integrated-financing/);
 assert.match(file,/\.pf-integrated-canvas>svg/);
 assert.match(ribbon,/data\.scope/);
 assert.match(ribbon,/pf-integrated-boundary/);
 assert.match(ribbon,/pf-integrated-disclaimer/);
 assert.match(ribbon,/el saldo neto/i);
 assert.match(ribbon,/no de todas las Administraciones Públicas/);
 assert.match(ribbon,/no se debe sumarse|No debe sumarse/);
 assert.doesNotMatch(file,/chart\.replaceChildren\(createIntegratedTreasuryRibbon/);
});
