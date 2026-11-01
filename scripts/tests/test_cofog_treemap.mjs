import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {dsvFormat} from "d3-dsv";
import {treemapLayout,editorialCofogGroups} from "../../app/components/cofog-treemap.js";

const file=readFileSync(new URL(
  "../../app/data/seed/fact_finanzas_publicas_2024.csv",import.meta.url),"utf8").replace(/^\uFEFF/,"");
const entries=dsvFormat(";").parse(file).filter(r=>Number(r.año)===2024&&
  r.clasificacion==="COFOG"&&r.lado==="gasto"&&Number(r.nivel)===1)
  .map(r=>({code:r.codigo,title:r.indicador,value:Number(r.valor)}));
const total=725001;

test("2024 official top-level COFOG is ten functions, not ten selected anecdotes",()=>{
  assert.equal(entries.length,10);
  assert.equal(new Set(entries.map(x=>x.code)).size,10);
  assert.equal(entries.reduce((s,r)=>s+r.value,0),total);
  assert.equal(entries.find(r=>r.code==="10").value,297532);
  assert.equal(entries.find(r=>r.code==="07").value,102942);
  assert.equal(entries.find(r=>r.code==="04").value,80908);
});
test("treemap shape occupies precisely the equivalent area of each expenditure",()=>{
  const shape=treemapLayout(entries,1200,720);
  assert.equal(shape.length,10);
  assert.equal(shape.reduce((sum,x)=>sum+x.w*x.h,0),1200*720);
  assert.equal(shape.map(x=>x.code).sort().join(","),entries.map(x=>x.code).sort().join(","));
  for(const rect of shape){
    assert.ok(rect.x>=0&&rect.y>=0);
    assert.ok(rect.x+rect.w<=1200+1e-6&&rect.y+rect.h<=720+1e-6);
    const expected=rect.value/total;
    assert.ok(Math.abs(rect.w*rect.h/(1200*720)-expected)<1e-10,
      "incorrect area for "+rect.code);
  }
});
test("treemap fails closed for non-finite values",()=>{
  assert.throws(()=>treemapLayout([{value:NaN}],900,500));
  assert.throws(()=>treemapLayout([{value:1}],0,500));
});

test("editorial composition reconciles exactly to 10 COFOG divisions for every verified year",()=>{
  const payload=JSON.parse(readFileSync(new URL(
    "../../app/data/cofog-history.json",import.meta.url),"utf8"));
  if(payload.status!=="verified"){
    assert.deepEqual(payload.years,[],"Unvalidated history must never be published");
    return;
  }
  assert.equal(payload.years.length,30);
  assert.equal(payload.years[0].year,1995);
  assert.equal(payload.years.at(-1).year,2024);
  for(const y of payload.years){
    const rows=[
      ...y.functions.map(f=>({...f,level:1})),
      ...y.groups.map(g=>({...g,level:2}))
    ];
    const editorial=editorialCofogGroups(rows);
    assert.ok(editorial?.length>=14&&editorial?.length<=16, "missing areas "+y.year);
    assert.equal(editorial.reduce((s,x)=>s+x.value,0),y.total);
    const pixels=treemapLayout(editorial,1200,680);
    assert.equal(Math.round(pixels.reduce((s,x)=>s+x.w*x.h,0)),816000);
  }
  const y12=payload.years.find(x=>x.year===2012);
  const groups=new Map(y12.groups.map(x=>[x.code,x.value]));
  const percent=codes=>100*codes.reduce((s,k)=>s+(groups.get(k)||0),0)/y12.total;
  assert.ok(Math.abs(percent(["10.1","10.2","10.3"])-26.6)<0.08);
  assert.ok(Math.abs(percent(["10.5"])-6.8)<0.08);
  assert.ok(Math.abs(percent(["01.7"])-6.7)<0.08);
});
