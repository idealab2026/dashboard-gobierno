import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {dsvFormat} from "d3-dsv";
import {searchSpendingRecords, normalizeSpending} from "../../app/components/spending-query.js";
import {OFFICIAL_DRILL_ROUTES, relatedBudgetPrograms} from "../../app/components/official-drill-routes.js";
import {canonicalFinanceCode} from "../../app/components/finance-code.js";
import {compareFinanceCodes,sortedFinanceChildren} from "../../app/components/finance-hierarchy.js";

const source = readFileSync(new URL("../../app/data/seed/fact_finanzas_publicas_2024.csv", import.meta.url), "utf8").replace(/^\uFEFF/, "");
const items = dsvFormat(";").parse(source)
  .filter(x=>x.clasificacion==="COFOG" && x.lado==="gasto")
  .map(x=>({
    tipo:"agregado",cofog_codigo:x.codigo,titulo:x.indicador,
    anio:Number(x.año),pais:"España",importe_eur:Number(x.valor),
    organismo:"IGAE",sector:"COFOG "+x.codigo,
    descripcion:x.definicion,
    _search:normalizeSpending([x.indicador,x.definicion,x.codigo,x.año,"España"].join(" "))
  }));

test("sanidad returns the original COFOG 07 total and all six official groups",()=>{
  const found=searchSpendingRecords(items,"sanidad");
  assert.deepEqual(found.map(x=>x.cofog_codigo).sort(),["07","07.1","07.2","07.3","07.4","07.5","07.6"]);
  assert.equal(found[0].cofog_codigo,"07");
  assert.equal(found[0].importe_eur,102942);
  assert.equal(found[0]._matchKind,"cofog-alias");
  assert.equal(found.filter(x=>x.cofog_codigo!=="07").reduce((n,x)=>n+x.importe_eur,0),102942);
});

test("salud, gasto en sanidad, and accented terms are robust",()=>{
  for(const q of ["salud","gasto en sanidad","SANIDAD","sanidad 2024","atención sanitaria"]) {
    const found=searchSpendingRecords(items,q);
    assert.ok(found.some(x=>x.cofog_codigo==="07"),q);
  }
});
test("specific hospital and pharmacy searches cannot be promoted to the entire health budget",()=>{
  assert.deepEqual(searchSpendingRecords(items,"hospitales").map(x=>x.cofog_codigo),["07.3"]);
  assert.deepEqual(searchSpendingRecords(items,"medicamentos").map(x=>x.cofog_codigo),["07.1"]);
  assert.deepEqual(searchSpendingRecords(items,"salud pública").map(x=>x.cofog_codigo),["07.4"]);
});

test("unknown geographic or project qualifier cannot generate a fictitious national allocation",()=>{
  assert.equal(searchSpendingRecords(items,"sanidad Andalucía").length,0);
  assert.equal(searchSpendingRecords(items,"ferrocarril Marruecos").length,0);
  assert.equal(searchSpendingRecords(items,"charlas feministas").length,0);
  const found=searchSpendingRecords(items,"ferrocarril");
  assert.deepEqual(found.map(x=>x.cofog_codigo),["04.5"]);
});

test("COFOG official code, type and year filters remain strict",()=>{
  assert.deepEqual(searchSpendingRecords(items,"sanidad",{cofog:"07.3"}).map(x=>x.cofog_codigo),["07.3"]);
  assert.equal(searchSpendingRecords(items,"sanidad",{cofog:"07.3",anio:"2023"}).length,0);
  assert.equal(searchSpendingRecords(items,"sanidad",{tipo:"intervencion"}).length,0);
  assert.equal(searchSpendingRecords(items,"sanidad",{pais:"Paraguay"}).length,0);
});

test("health data have official IGAE provenance and no generated project allocations",()=>{
  const health=items.filter(x=>x.cofog_codigo.startsWith("07"));
  assert.equal(health.length,7);
  assert.ok(health.every(x=>x.organismo==="IGAE"&&x.tipo==="agregado"&&x.pais==="España"));
});

const named=JSON.parse(readFileSync(new URL("../../app/data/partidas-verificadas.json",import.meta.url),"utf8")).registros;
const all=[...items,...named];

test("mantenimiento de carreteras returns the actual 453C budget program, not a fictitious COFOG maintenance figure",()=>{
  const results=searchSpendingRecords(all,"mantenimiento de carreteras");
  assert.equal(results.length,1);
  assert.equal(results[0].codigo_presupuestario,"453C");
  assert.equal(results[0].importe_eur,1208409410);
  assert.equal(results[0].tipo,"programa");
  assert.equal(results[0].desglose.reduce((n,p)=>n+p.importe_eur,0),1208409410);
});

test("carreteras displays actual official programs before the broader transport COFOG total",()=>{
  const results=searchSpendingRecords(all,"carreteras");
  assert.equal(results[0].codigo_presupuestario,"453C");
  assert.ok(results.some(x=>x.codigo_presupuestario==="453B"));
  assert.ok(results.some(x=>x.cofog_codigo==="04.5"));
  assert.ok(results.indexOf(results.find(x=>x.codigo_presupuestario==="453C")) <
            results.indexOf(results.find(x=>x.cofog_codigo==="04.5")));
});

test("new road construction, road maintenance and COFOG are not mistaken for the same budget",()=>{
  const construction=searchSpendingRecords(all,"construcción carreteras");
  assert.equal(construction[0].codigo_presupuestario,"453B");
  assert.ok(!construction.some(x=>x.codigo_presupuestario==="453C"));
  assert.ok(!searchSpendingRecords(all,"mantenimiento carreteras Andalucía").some(x=>x.codigo_presupuestario==="453C"));
  assert.equal(searchSpendingRecords(all,"mantenimiento carreteras",{cofog:"04.5"}).length,0);
  assert.equal(searchSpendingRecords(all,"mantenimiento carreteras",{tipo:"programa"}).length,1);
});

test("at terminal nodes all official alternative drill paths remain available and independent",()=>{
  assert.deepEqual(OFFICIAL_DRILL_ROUTES.map(x=>x.id),[
    "cofog-ambito","programa","ejecucion","contratacion"
  ]);
  for(const route of OFFICIAL_DRILL_ROUTES){
    assert.ok(route.links.length>=2,route.id);
    for(const [title,url,period] of route.links){
      assert.ok(title&&url&&period);
      assert.ok(url.startsWith("https://")||url==="/buscador-partidas.html");
    }
  }
  const official=OFFICIAL_DRILL_ROUTES.find(x=>x.id==="cofog-ambito");
  assert.equal(official.links.length,4);
  assert.ok(official.links.some(x=>x[1].includes("iacofogCA.aspx")));
});
test("budget programmes follow related COFOG function without becoming numerical children",()=>{
  const transport=relatedBudgetPrograms("04.5",2024,named);
  assert.deepEqual(transport.map(x=>x.codigo_presupuestario).sort(),["453B","453C"]);
  assert.deepEqual(relatedBudgetPrograms("04",2024,named).map(x=>x.codigo_presupuestario).sort(),["453B","453C"]);
  assert.deepEqual(relatedBudgetPrograms("01.3",2024,named),[]);
  assert.deepEqual(relatedBudgetPrograms("04.5",2023,named),[]);
});

test("typed CSV COFOG code normalization preserves official parent-child relationships",()=>{
  assert.equal(canonicalFinanceCode(1),"01");
  assert.equal(canonicalFinanceCode(1.3),"01.3");
  assert.equal(canonicalFinanceCode(4.5),"04.5");
  assert.equal(canonicalFinanceCode("01.3"),"01.3");
  assert.equal(canonicalFinanceCode(10),"10");
  assert.equal(canonicalFinanceCode("S13.GASTO"),"S13.GASTO");
  assert.equal(canonicalFinanceCode("D.5"),"D.5");
  assert.equal(canonicalFinanceCode("01.2+01.5+01.6+01.8"),"01.2+01.5+01.6+01.8");
  const parent=canonicalFinanceCode(1),child=canonicalFinanceCode(1.3);
  assert.ok(child.startsWith(parent+"."));
});

test("COFOG tree sorts by numerical classification code, never decreasing expenditure",()=>{
 const rows=[
  {code:"01.7",parent_code:"01",value:39644},
  {code:"01.3",parent_code:"01",value:16626},
  {code:"01.1",parent_code:"01",value:21444},
  {code:"01.4",parent_code:"01",value:8513},
  {code:"01.2+01.5+01.6+01.8",parent_code:"01",value:6324}
 ];
 assert.deepEqual(sortedFinanceChildren(rows,"01").map(x=>x.code),[
  "01.1","01.2+01.5+01.6+01.8","01.3","01.4","01.7"
 ]);
 assert.ok(compareFinanceCodes("02","10")<0);
 assert.ok(compareFinanceCodes("01.1","01.7")<0);
 assert.ok(compareFinanceCodes("01.7","01.3")>0);
});

test("COFOG hierarchy respects strict parent relationships and excludes analytic cuts by default",()=>{
 const rows=[
  {code:"01",parent_code:"S13.GASTO",value:92551},
  {code:"01.1",parent_code:"01",value:21444},
  {code:"01.2",parent_code:"01",value:2,is_analytic_cut:true},
  {code:"01.7",parent_code:"01",value:39644},
  {code:"04.5",parent_code:"04",value:28634}
 ];
 assert.deepEqual(sortedFinanceChildren(rows,"01").map(x=>x.code),["01.1","01.7"]);
 assert.deepEqual(sortedFinanceChildren(rows,"01",{includeAnalytic:true}).map(x=>x.code),["01.1","01.2","01.7"]);
 assert.deepEqual(sortedFinanceChildren(rows,"04").map(x=>x.code),["04.5"]);
});
