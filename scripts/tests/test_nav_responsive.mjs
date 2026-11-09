import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const pages=[
  ["index","Mapa del dinero"],["finanzas-publicas","Finanzas públicas"],
  ["administraciones","Administraciones"],["buscador-partidas","Buscar partidas"],
  ["visualizaciones","Visualizaciones"],["metodologia","Metodología"],
  ["actualizaciones","Actualizaciones"],["quienes-somos","Quiénes somos"]
];
const read=p=>readFileSync(new URL("../../app/"+p+".md",import.meta.url),"utf8");
const canonicalCSS=s=>{
  const start=s.indexOf("/* Cabecera V3");
  assert.ok(start>=0,"Falta el tema compartido de navegación");
  const end=s.indexOf("</style>",start);
  assert.ok(end>start);
  return s.slice(start,end).trim();
};
const base=canonicalCSS(read("index"));
for(const [file,label] of pages){
  const source=read(file);
  test(file+": conserva la cabecera horizontal V3 original",()=>{
    assert.equal(canonicalCSS(source),base);
    const start=source.indexOf('<nav class="idealab-nav"'),end=source.indexOf("</nav>",start)+6;
    assert.ok(start>=0&&end>start);
    const nav=source.slice(start,end);
    assert.equal((source.match(/<nav class="idealab-nav"/g)||[]).length,1);
    assert.match(nav,/class="idealab-nav-links"/);
    assert.match(nav,/class="idealab-nav-mobile"/);
    assert.match(nav,/<summary>Áreas temáticas<\/summary>/);
    assert.match(nav,/<summary>Más<\/summary>/);
    for(const name of ["Mapa del dinero","Visualizaciones","Finanzas públicas",
      "Buscar partidas","Administraciones"]){
      assert.ok(nav.includes(name),file+" carece de "+name);
    }
    assert.match(nav,/UN PRODUCTO DE IDEA LAB/);
    assert.match(nav,/src=".\/logo-idea-lab.svg"/);
  });
  test(file+": menú compacto exclusivamente en móvil y sin solapamiento",()=>{
    assert.match(source,/@media\(max-width:1279px\)/);
    assert.match(source,/\.idealab-nav \.idealab-nav-links\{display:none!important\}/);
    assert.match(source,/\.idealab-nav \.idealab-nav-mobile\[open\]>\.idealab-nav-mobile-panel\{display:grid!important\}/);
    assert.match(source,/\.idealab-nav \.idealab-nav-mobile,\s*\.idealab-nav \.idealab-nav-mobile>\.idealab-nav-mobile-panel\{display:none!important\}/);
    assert.match(source,/max-width:calc\(100vw - 22px\)!important/);
    assert.match(source,/max-height:min\(72dvh,620px\)!important/);
    assert.match(source,/if\(event.key==="Escape"\)closeExcept\(null\)/);
    assert.match(source,/NAV_QA_OK/);
  });
  test(file+": marca la sección activa",()=>{
    const start=source.indexOf('<nav class="idealab-nav"'),end=source.indexOf("</nav>",start)+6;
    const nav=source.slice(start,end);
    const activeLinks=[...nav.matchAll(/<a\s+[^>]*aria-current="page"[^>]*>([^<]+)<\/a>/g)].map(m=>m[1]);
    assert.ok(activeLinks.includes(label),file+" sin selección activa");
    assert.ok(nav.includes('href="/administraciones.html"'));
    assert.ok(nav.includes('href="/quienes-somos.html"'));
  });
}
test("Metodología elimina el índice lateral que se superponía a la cabecera",()=>{
  assert.match(read("metodologia"),/toc: false/);
  assert.doesNotMatch(read("metodologia"),/toc: true/);
});
test("Visualizaciones mantiene eliminado el segundo separador dorado",()=>{
  const s=read("visualizaciones");
  assert.match(s,/\.il-gallery-intro\{[^\n]*border-top:0\}/);
  assert.doesNotMatch(s,/\.il-gallery-intro\{[^\n]*border-top:2px/);
});