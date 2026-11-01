import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {pensionSeries,salariesByYear,housingSeries} from "../../app/components/social-trends.js";

const data=JSON.parse(readFileSync(new URL("../../app/data/social-trends.json",import.meta.url),"utf8"));
const housing=JSON.parse(readFileSync(new URL("../../app/data/housing-history.json",import.meta.url),"utf8"));

test("pension share: identified pensions, not COFOG 10.1–10.3 proxy",()=>{
 const s=pensionSeries(data);
 assert.equal(s.length,5);
 assert.deepEqual(s.map(r=>r.year),[2020,2021,2022,2023,2024]);
 const last=s.at(-1);
 assert.equal(last.pensions,206130);
 assert.equal(last.spending,725001);
 assert.ok(Math.abs(last.pct-28.4316849218)<.0001);
 assert.ok(s.every(x=>x.pct>25&&x.pct<30));
 assert.throws(()=>pensionSeries({pensions:{rows:[{year:2024,pensions:800,spending:700}]}}));
});

test("INE salary series by age, complete annual 2019–2024",()=>{
 assert.equal(data.salaries.years.length,6);
 assert.equal(data.salaries.groups.length,5);
 const x=salariesByYear(data,2024,false);
 assert.equal(x[0].amount,1372.8);
 assert.equal(x[4].amount,2680.7);
 const relative=salariesByYear(data,2024,true);
 assert.ok(Math.abs(relative[0].value-57.5)<.1);
 assert.ok(Math.abs(relative[4].value-112.4)<.1);
 assert.throws(()=>salariesByYear(data,2026));
});

test("MIVAU housing shows only verified quarters and never invented regional numbers",()=>{
 assert.equal(housing.schema,"idea-lab-mivau-housing-v1");
 assert.ok(["partial-verified","verified"].includes(housing.status));
 const es=housingSeries(housing,"España"),madrid=housingSeries(housing,"Madrid");
 assert.ok(es.length>=10&&madrid.length>=10);
 assert.equal(es.find(x=>x.year===2026&&x.quarter===2)?.value,2355);
 assert.equal(madrid.find(x=>x.year===2026&&x.quarter===2)?.value,4089.6);
 for(const series of [es,madrid]){
  assert.ok(series.every((x,i)=>i===0||x.year>series[i-1].year||
   (x.year===series[i-1].year&&x.quarter>series[i-1].quarter)));
 }
});

test("CIS survey proportions must not be treated as exhaustive or additive",()=>{
 assert.equal(data.concerns.study,"CIS 3582");
 assert.equal(data.concerns.rows[0].key,"housing");
 assert.equal(data.concerns.rows[0].pct,55.7);
 assert.ok(data.concerns.rows.reduce((x,y)=>x+y.pct,0)>100);
 assert.match(data.concerns.kind,/respuesta múltiple/);
 for(const k of ["housing","migration","economy","work","health","unemployment"])
  assert.ok(data.objective[k]?.url?.startsWith("https://"));
});

test("compact atlas renders all six interactive previews with search and modal",()=>{
 const page=readFileSync(new URL("../../app/visualizaciones.md",import.meta.url),"utf8");
 const gallery=readFileSync(new URL("../../app/components/visualization-gallery.js",import.meta.url),"utf8");
 for(const s of ["visual-gallery-root","createVisualizationGallery","housing-history.json",
                 "social-trends.json",".il-gallery-grid",".il-gallery-modal-content",
                 ".il-gallery-card",".il-gallery-search"]){
  assert.ok(page.includes(s),"Missing gallery integration "+s);
 }
 for(const id of ["gasto","pensiones","salarios","vivienda","preocupaciones","indicadores"])
  assert.match(gallery,new RegExp('id:"'+id+'"'));
 assert.match(gallery,/input\.type="search"/);
 assert.match(gallery,/input\.addEventListener\("input",filter\)/);
 assert.match(gallery,/button\.addEventListener\("click",\(\)=>openChart\(spec\.id,button\)\)/);
 assert.match(gallery,/dialog\.showModal\(\)/);
 assert.match(gallery,/close\.addEventListener\("click",closeChart\)/);
 assert.match(gallery,/dialog\.addEventListener\("close"/);
 assert.match(gallery,/dialog\.addEventListener\("click"/);
 assert.match(gallery,/lastTrigger\.focus/);
 assert.match(gallery,/queryMicrotask\(\(\)=>openChart\(initial\)\)/);
 assert.match(gallery,/objective\.append\(sub,objectiveGrid\)/);
 assert.doesNotMatch(page,/<div id="cofog-treemap-root"><\/div>/);
 assert.doesNotMatch(page,/<div class="il-audit"/);
});
