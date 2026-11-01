import test from "node:test";
import assert from "node:assert/strict";
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
