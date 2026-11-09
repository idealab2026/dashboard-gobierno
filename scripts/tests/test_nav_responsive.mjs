import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

/* All public sections use the SAME one-row sticky header, identical
 * responsive menu, and page-specific aria-current. The menu is hidden
 * until <details open>, never duplicated with the desktop navigation. */
const pages=[
  ["index","Mapa del dinero"],
  ["finanzas-publicas","Finanzas públicas"],
  ["administraciones","Administraciones"],
  ["buscador-partidas","Buscar partidas"],
  ["visualizaciones","Visualizaciones"],
  ["metodologia","Metodología"],
  ["actualizaciones","Actualizaciones"],
  ["quienes-somos","Quiénes somos"]
];
const read=path=>readFileSync(new URL("../../app/"+path+".md",import.meta.url),"utf8");
const cssBlock=s=>{
  const a=s.indexOf("/* Atlas header:");
  assert.ok(a>=0,"Falta el CSS de cabecera común");
  const b=s.indexOf("</style>",a);
  assert.ok(b>=0);
  return s.slice(a,b).trim();
};
const referenceCSS=cssBlock(read("visualizaciones"));

for(const [file,page] of pages){
  const source=read(file);
  test(file+": cabecera idéntica y persistente en todo el Observatorio",()=>{
    assert.equal(cssBlock(source),referenceCSS);
    assert.match(source,/position:sticky!important;top:0!important;z-index:1150!important/);
    assert.match(source,/\.il-atlas-nav \.il-atlas-menu\[open\] > \.il-atlas-menu-panel\{\s*display:grid!important;/);
    assert.match(source,/\.il-atlas-nav \.il-atlas-menu \.il-atlas-menu-panel\{\s*display:none!important;/);
    assert.match(source,/@media\(max-width:800px\)/);
    assert.match(source,/@media\(max-width:390px\)/);
    assert.match(source,/max-height:min\(74dvh,620px\)!important/);
  });
  test(file+": una sola navegación sin enlaces solapados y con página activa",()=>{
    const navStart=source.indexOf('<nav class="idealab-nav il-atlas-nav"');
    const navEnd=source.indexOf("</nav>",navStart);
    assert.ok(navStart>=0&&navEnd>navStart);
    const markup=source.slice(navStart,navEnd+6);
    assert.equal((source.match(/<nav class="idealab-nav il-atlas-nav"/g)||[]).length,1);
    assert.doesNotMatch(markup,/class="idealab-nav-links"|class="il-site-menu"/);
    assert.match(markup,/class="il-atlas-nav-actions"/);
    assert.match(markup,/class="idealab-nav-mobile il-atlas-menu"/);
    assert.match(markup,/class="idealab-nav-mobile-panel il-atlas-menu-panel"/);
    assert.match(markup,/Mapa del dinero/);
    assert.match(markup,/Visualizaciones/);
    assert.match(markup,/Administraciones/);
    assert.match(markup,/Buscar partidas/);
    const current=markup.slice(markup.indexOf('class="idealab-nav-mobile-panel il-atlas-menu-panel"'));
    const active=String.raw`aria-current="page">${page}</a>`;
    assert.ok(current.includes(active),file+" no identifica su sección activa");
  });
  test(file+": menú accesible, cierre seguro y diagnóstico visual",()=>{
    assert.match(source,/atlasMenu\.querySelectorAll\("\.il-atlas-menu-panel a"\)/);
    assert.match(source,/if\(atlasMenu\.open&&!atlasMenu\.contains\(event\.target\)\)atlasMenu\.open=false/);
    assert.match(source,/if\(event\.key==="Escape"\)atlasMenu\.open=false/);
    assert.match(source,/NAV_QA_OK/);
    assert.doesNotMatch(source,/compactNav\.addEventListener\("pointerenter"/);
  });
}
test("Visualizaciones: sin segunda raya dorada entre cabecera y galería",()=>{
  const source=read("visualizaciones");
  assert.match(source,/\.il-gallery-intro\{[^\n]*border-top:0\}/);
  assert.match(source,/\.il-visual-intro\{[^\n]*border-top:0/);
  assert.doesNotMatch(source,/\.il-gallery-intro\{[^\n]*border-top:2px/);
});
