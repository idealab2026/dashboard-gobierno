import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const root=new URL("../../app/",import.meta.url);
const read=name=>readFileSync(new URL(name+".md",root),"utf8");
const election=read("elecciones-29n");
const pages=["index","finanzas-publicas","administraciones","buscador-partidas",
  "visualizaciones","metodologia","actualizaciones","quienes-somos","elecciones-29n"];

test("29N: election date, 4 parties, candidate CVs and program status",()=>{
  assert.match(election,/29 noviembre 2026/);
  for(const [party,candidate] of [
    ["Partido Popular","Alberto Núñez Feijóo"],
    ["Partido Socialista Obrero Español","Pedro Sánchez"],
    ["Vox","Santiago Abascal"],
    ["Frente Amplio","Ada Colau"]
  ]){
    assert.ok(election.includes(party),party);
    assert.ok(election.includes(candidate),candidate);
  }
  assert.equal((election.match(/class="il-29n-profile" id="perfil-/g)||[]).length,4);
  assert.match(election,/Sin programa electoral integral verificado/);
  assert.match(election,/Avances de campaña; programa integral no verificado/);
  assert.equal((election.match(/Programa completo publicado/g)||[]).length,2);
  assert.match(election,/no se la presenta como presidenta de todos sus partidos integrantes/);
});
test("29N: documentary comparison of nine themes and 36 cells is accessible",()=>{
  assert.equal((election.match(/<tr data-topic="\d+"/g)||[]).length,9);
  assert.equal((election.match(/<td data-party="(?:pp|psoe|vox|fa)"/g)||[]).length,36);
  assert.match(election,/id="il-29n-compare-table"/);
  assert.match(election,/aria-label="Comparador desplazable horizontalmente"/);
  for(const id of ["pp","psoe","vox","fa"]){
    assert.equal((election.match(new RegExp('<td data-party="'+id+'"',"g"))||[]).length,9);
  }
  assert.match(election,/id="il-29n-party-choice"/);
  assert.match(election,/id="il-29n-topic-choice"/);
  assert.match(election,/classList.toggle\("il-29n-col-hidden"/);
  assert.match(election,/classList.toggle\("il-29n-topic-hidden"/);
  assert.match(election,/const partyFilter=document.getElementById/);
});
test("29N: verifiable source URLs and no fabricated political rankings",()=>{
  assert.match(election,/www\.pp\.es\/wp-content\/uploads\/2026\/11\/LA-RECONSTRUCCION-NACIONAL\.pdf/);
  assert.match(election,/www\.voxespana\.es\/wp-content\/uploads\/2026\/11\/Programa-completo-A5-1\.pdf/);
  assert.match(election,/www\.boe\.es\/diario_boe\/txt\.php\?id=BOE-A-2026-23103/);
  assert.match(election,/www\.lamoncloa\.gob\.es\/presidente\/biografia/);
  assert.match(election,/frenteamplio\.info\/noticias/);
  assert.match(election,/No se asignan notas a candidatos/);
  assert.doesNotMatch(election,/data-rating=|data-score=|mejor candidato|peor candidato|recomiendo votar/i);
  assert.ok((election.match(/class="il-29n-source"/g)||[]).length>=25);
});
test("29N: consistent menu visible in all 9 sections",()=>{
  for(const page of pages){
    const source=read(page);
    const i=source.indexOf('<nav class="idealab-nav"'),j=source.indexOf("</nav>",i);
    assert.ok(i>=0&&j>i,"Menu absent "+page);
    const nav=source.slice(i,j);
    assert.ok(nav.includes('href="/elecciones-29n.html"'),"Navigation missing "+page);
    assert.ok(nav.includes('class="idealab-nav-election'),"Direct header missing "+page);
    assert.ok(nav.includes('class="il-nav-more-panel"'),"More menu missing "+page);
    assert.ok(nav.includes('class="idealab-nav-mobile-panel"'),"Mobile missing "+page);
    assert.match(source,/\.idealab-nav \.idealab-nav-election\{display:none!important\}/);
  }
  const nav=election.slice(election.indexOf('<nav class="idealab-nav"'),
    election.indexOf("</nav>",election.indexOf('<nav class="idealab-nav"')));
  assert.ok(nav.includes('aria-current="page" href="/elecciones-29n.html"'));
});
