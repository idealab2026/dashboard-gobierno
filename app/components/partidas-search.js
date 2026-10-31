/* Buscador público de gastos verificables. Sin dependencias ni telemetría. */
import {searchSpendingRecords, normalizeSpending} from "./spending-query.js";
import {spendingLineage,relatedProgramLineage} from "./spending-lineage.js";
const fold = normalizeSpending;
const euro = new Intl.NumberFormat("es-ES", {maximumFractionDigits:0});
// de-DE fuerza agrupación también en 4 cifras: 1.208,41 en lugar de 1208,41.
const budgetMillions = new Intl.NumberFormat("de-DE", {minimumFractionDigits:2, maximumFractionDigits:2});
const make = (tag, className, text) => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = String(text);
  return el;
};
const official = url => {
  try {const u=new URL(url);return u.protocol==="https:" && ["datos.aecid.es","www.boe.es","boe.es","www.igae.pap.hacienda.gob.es","igae.pap.hacienda.gob.es","www.sepg.pap.hacienda.gob.es"].includes(u.hostname) ? u.href : null;}
  catch {return null;}
};
const external = (label, href) => {
  const a = make("a", "", label);
  a.href=href;a.target="_blank";a.rel="noopener noreferrer";
  return a;
};
export function createSpendingSearch({records = [], aggregates = [], coverage = "", initialQuery = "", initialCofog = "", initialYear = ""} = {}) {
  const root=make("section","spending-finder");
  root.id="partidas-buscador";
  const styles=make("style");
  styles.textContent=`
  .spending-finder{--sf-navy:#0b2447;--sf-border:#dfe5ed;--sf-muted:#667085;width:100%;max-width:none;min-width:0;font-family:system-ui,-apple-system,sans-serif}
  .sf-controls{display:grid;grid-template-columns:minmax(250px,1.7fr) repeat(3,minmax(145px,.6fr));gap:9px;margin:12px 0}
  .sf-field{display:flex;flex-direction:column;gap:5px;min-width:0}
  .sf-field label{font-size:.72rem;font-weight:750;color:#394c64}
  .sf-field input,.sf-field select{box-sizing:border-box;width:100%;min-width:0;border:1px solid #cad4e0;border-radius:9px;padding:10px 12px;font:inherit;font-size:.88rem;color:var(--sf-navy);background:#fff;min-height:43px}
  .sf-field :is(input,select):focus-visible{outline:2px solid #b89b5e;outline-offset:1px}
  .sf-examples{display:flex;flex-wrap:wrap;align-items:center;gap:7px;margin:6px 0 12px;font-size:.75rem;color:var(--sf-muted)}
  .sf-examples button{border:1px solid #dbe2e9;background:#fff;border-radius:20px;padding:6px 10px;cursor:pointer;font:inherit;color:#17375e}
  .sf-examples button:hover{background:#f1f5f9}
  .sf-summary{display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;align-items:center;border-bottom:1px solid var(--sf-border);margin:9px 0 13px;padding:0 0 10px;color:#52647d;font-size:.77rem}
  .sf-summary strong{color:var(--sf-navy)}
  .sf-results{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:0 0 12px}
  .sf-record{border:1px solid var(--sf-border);border-radius:12px;padding:15px 16px;background:#fff;min-width:0;display:flex;flex-direction:column;gap:8px}
  .sf-record h3{font:700 1.03rem/1.34 Georgia,serif;color:var(--sf-navy);margin:0;overflow-wrap:anywhere}
  .sf-record p{font:400 .81rem/1.5 system-ui,sans-serif;color:#45566e;margin:0;text-align:justify;text-align-last:left;max-width:none;width:100%}
  .sf-record .sf-tags{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
  .sf-record .sf-tag{display:inline-flex;align-items:center;border:1px solid #e0e5ec;border-radius:4px;padding:3px 6px;font:700 .64rem/1.3 system-ui,sans-serif;color:#5e6e84;background:#f7f9fb}
  .sf-record .sf-tag--related{color:#8a580b;background:#fff7e6;border-color:#e9d3a3}
  .sf-record .sf-amount{font:800 1.17rem/1.1 system-ui,sans-serif;color:var(--sf-navy);font-variant-numeric:tabular-nums}
  .sf-record .sf-row{font:400 .76rem/1.45 system-ui,sans-serif;color:#5b6b80}
  .sf-record .sf-row strong{color:#31455c}
  .sf-record .sf-cta{margin-top:auto;padding-top:3px;font-size:.8rem;font-weight:700;color:#16436e}
  /* Línea de procedencia por resultado, dentro de la página de búsqueda. */
  .sf-lineage-list{margin:17px 0 14px;width:100%;min-width:0}
  .sf-lineage-list>h2{font:700 1.35rem/1.25 Georgia,serif;color:#102b4c;margin:0 0 6px}
  .sf-lineage-intro{font:.78rem/1.55 system-ui;color:#60738b;
    width:100%;max-width:none;margin:0 0 11px;text-align:justify;text-align-last:left}
  .sf-lineage-card{border:1px solid #dce4ed;border-radius:10px;
    background:#fff;padding:13px 15px;margin-bottom:12px}
  .sf-lineage-card>h3{font:750 .88rem/1.4 system-ui;color:#163354;margin:0 0 9px}
  .sf-lineage-path{display:flex;gap:0;align-items:stretch;overflow-x:auto;
    min-width:0;padding:1px 0 8px;scrollbar-width:thin}
  .sf-lineage-step{display:flex;flex:1 0 0;min-width:185px;max-width:330px;align-items:center;gap:8px}
  .sf-lineage-step:not(:last-child):after{content:"→";color:#b2935b;font-size:1.05rem;flex:none}
  .sf-lineage-node{border:1px solid #d1dce7;background:#f7f9fb;border-radius:7px;
    padding:10px 11px;min-height:75px;min-width:0;flex:1;display:flex;
    flex-direction:column;gap:5px;justify-content:center;color:#233d5f;
    text-decoration:none!important}
  a.sf-lineage-node:hover,a.sf-lineage-node:focus-visible{
    border-color:#a7823e;background:#fff8e9;outline:none}
  .sf-lineage-step:last-child .sf-lineage-node{
    border-color:#b89b5e;background:#fff6e5}
  .sf-lineage-node strong{font:750 .75rem/1.35 system-ui;color:#143657}
  .sf-lineage-node small{font:.69rem/1.35 system-ui;color:#65758a}
  .sf-lineage-children{border-top:1px solid #e9edf2;padding-top:9px;margin-top:3px}
  .sf-lineage-children>strong{display:block;font:.74rem/1.4 system-ui;color:#4d637d;margin-bottom:6px}
  .sf-lineage-child-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(215px,1fr));gap:7px}
  .sf-lineage-child{display:flex;flex-direction:column;gap:4px;min-width:0;
    padding:8px 9px;border:1px dashed #bbcad8;border-radius:7px;
    background:#fbfcfe;color:#20466b!important;text-decoration:none!important}
  .sf-lineage-child:hover{background:#f0f6fc;border-color:#5f85a7}
  .sf-lineage-child strong{font:700 .72rem/1.4 system-ui}
  .sf-lineage-child small{font:.67rem/1.4 system-ui;color:#637a90}
  .sf-lineage-cta{display:inline-flex;align-items:center;gap:7px;
    border:1px solid #bda16c;border-radius:7px;padding:8px 11px;
    color:#12375b!important;background:#fff8e9;font:750 .78rem/1.3 system-ui;
    text-decoration:none!important;margin-top:10px}
  .sf-lineage-cta:hover{background:#f5e8cd}
  .sf-lineage-disclaimer{font:.73rem/1.5 system-ui;color:#6b7a8b;
    margin:7px 0 0;width:100%;text-align:justify;text-align-last:left}
  .sf-lineage-more{font:.73rem/1.45 system-ui;color:#65778d;margin:3px 0 0}
  .sf-jump-lineage{font:.73rem/1.4 system-ui;color:#1e5279!important;
    text-decoration:underline;text-underline-offset:2px}
  @media(max-width:700px){
    .sf-lineage-card{padding:10px}
    .sf-lineage-step{min-width:155px}
    .sf-lineage-node{padding:8px;min-height:68px}
    .sf-lineage-child-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
  }
  @media(max-width:400px){.sf-lineage-child-grid{grid-template-columns:1fr}}
  .sf-breakdown{margin:4px 0 8px;border-top:1px solid #dfe5ed;padding:8px 0 0}
  .sf-breakdown summary{font:.78rem/1.4 system-ui,sans-serif;font-weight:700;cursor:pointer;color:#16436e}
  .sf-breakdown-table{width:100%;border-collapse:collapse;font-size:.72rem;color:#46576c;margin-top:8px}
  .sf-breakdown-table td{border-bottom:1px solid #e9edf2;padding:6px 3px}
  .sf-breakdown-table td:last-child{text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums;font-weight:750}
  
  .sf-noresults{border:1px dashed #c7d3de;border-radius:12px;padding:18px;background:#f9fafc;color:#42546b;grid-column:1/-1}
  .sf-noresults strong{display:block;margin-bottom:6px;color:var(--sf-navy)}
  .sf-noresults p{font-size:.85rem}
  .sf-portals{display:flex;gap:10px;flex-wrap:wrap;margin-top:8px;font-size:.81rem;font-weight:700}
  .sf-footnote{font-size:.78rem;color:#637187;line-height:1.5;margin:8px 0;text-align:justify;text-align-last:left}
  .sf-alias-explanation{width:100%;font-weight:650;color:#264260;line-height:1.4}
  .sf-scope{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:11px 12px;margin:7px 0 12px;border:1px solid #d2ddeb;background:#f4f8fc;border-radius:9px;font-size:.81rem;color:#264260}
  .sf-scope strong{color:#0b2447}
  .sf-dimension-jump{display:inline-block;margin:3px 0 10px;font-size:.82rem;font-weight:760;color:#16436e;text-decoration:underline;text-underline-offset:3px}
  .sf-dimension-jump:focus-visible{outline:2px solid #b89b5e;outline-offset:3px}
  .sf-scope button{border:1px solid #aebed2;background:#fff;border-radius:7px;padding:7px 9px;font-size:.76rem;font-weight:750;color:#0b2447;cursor:pointer}
  .sf-investigation{margin:18px 0 12px}
  .sf-investigation h2{font:700 1.4rem Georgia,serif;margin:10px 0;color:#0b2447}
  .sf-investigation p{font-size:.86rem;color:#53647b;line-height:1.55;text-align:justify;text-align-last:left;width:100%;max-width:none}
  .sf-investigation-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
  .sf-investigation-grid article{border:1px solid #dfe5ed;border-radius:10px;padding:12px;min-width:0}
  .sf-investigation-grid h3{font:700 .98rem Georgia,serif;color:#0b2447;margin:2px 0 8px}
  .sf-investigation-grid a{display:block;font-size:.78rem;line-height:1.45;font-weight:650;color:#16436e;margin:9px 0;overflow-wrap:anywhere}
  .sf-investigation-grid small{font-size:.75rem;color:#62728a;line-height:1.4;display:block}
  @media(max-width:900px){.sf-investigation-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
  @media(max-width:650px){.sf-investigation-grid{grid-template-columns:1fr}}
  @media(max-width:900px){.sf-controls{grid-template-columns:repeat(2,minmax(0,1fr))}.sf-field:first-child{grid-column:1/-1}}
  @media(max-width:700px){.sf-results{grid-template-columns:1fr}.sf-controls{gap:7px}.sf-record{padding:12px}.sf-field input,.sf-field select{font-size:.83rem}}

  /* Buscar primero; la lista de ejemplos no compite con los resultados. */
  .spending-finder details.sf-examples{display:block;margin:2px 0 5px;border:0;padding:0}
  .spending-finder .sf-examples>summary{
    cursor:pointer;color:#5c7186;font:600 .7rem/1.4 system-ui,sans-serif;
    list-style:revert}
  .spending-finder .sf-example-options{display:flex;flex-wrap:wrap;gap:6px;padding:7px 0}
  .spending-finder .sf-example-options button{border-radius:7px;padding:5px 8px}
  .spending-finder .sf-dimension-jump{display:none}
  /* RESULTADOS V5: Una ficha, un importe, un recorrido. */
  .spending-finder .sf-controls{margin:10px 0 9px}
  .spending-finder .sf-scope{border:0;background:transparent;padding:0;margin:7px 0;
    color:#64768b;font-size:.73rem}
  .spending-finder .sf-examples{gap:6px;margin:6px 0 7px;font-size:.7rem}
  .spending-finder .sf-examples button{font-size:.7rem;padding:5px 9px}
  .spending-finder .sf-dimension-jump{font-size:.73rem;margin:2px 0 4px}
  .spending-finder .sf-summary{border:0;padding:0;margin:11px 0 9px;font-size:.76rem}
  .spending-finder .sf-alias-explanation{font-weight:500;font-size:.72rem;line-height:1.4}
  .spending-finder .sf-results{display:flex;flex-direction:column;gap:10px;max-width:none;width:100%;margin:0 0 12px}
  .spending-finder .sf-record{width:100%;box-sizing:border-box;display:block;
    border:1px solid #e0e6ec;border-radius:11px;padding:14px 18px;gap:0;
    background:#fff}
  .sf-record-top{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;
    gap:10px 22px}
  .sf-record-intro{min-width:210px;flex:1 1 330px}
  .sf-record-meta{display:flex;align-items:center;gap:5px;flex-wrap:wrap;margin-bottom:5px;
    color:#778496;font:600 .7rem/1.3 system-ui,sans-serif}
  .sf-record-kind{color:#7e642e}
  .sf-match-label{font:550 .67rem/1.3 system-ui;color:#986f2d}
  .spending-finder .sf-record h3{font:700 clamp(1.06rem,1.35vw,1.26rem)/1.25 Georgia,serif;margin:0}
  .sf-record-figure{display:flex;flex-direction:column;align-items:flex-end;gap:3px}
  .spending-finder .sf-record .sf-amount{font:800 clamp(1.2rem,1.8vw,1.5rem)/1.1 system-ui;
    white-space:nowrap;color:#0b2447}
  .sf-record-figure small{font:500 .68rem/1.35 system-ui;color:#718198;white-space:nowrap}
  .sf-record-source{color:#64758c;font:.75rem/1.4 system-ui;margin-top:4px}
  .sf-record-actions{display:flex;align-items:center;gap:13px;flex-wrap:wrap;margin:11px 0 0}
  .sf-record-actions a{font:700 .75rem/1.3 system-ui;color:#20496f!important;
    text-decoration:none!important}
  .sf-record-actions a:hover{text-decoration:underline!important;text-underline-offset:3px}
  .sf-record-actions .sf-record-sankey{color:#916c2f!important}
  .spending-finder .sf-lineage-list{margin:11px 0 0;border-top:1px solid #e8edf2;padding:9px 0 0}
  .sf-lineage-summary{cursor:pointer;list-style:none;display:flex;justify-content:space-between;
    gap:12px;align-items:center;color:#254566;font:700 .76rem/1.4 system-ui}
  .sf-lineage-summary::-webkit-details-marker{display:none}
  .sf-lineage-summary:after{content:"+";font:700 1.03rem/1 system-ui;color:#8996a6}
  .sf-lineage-list[open]>.sf-lineage-summary:after{content:"−"}
  .sf-lineage-summary:hover{color:#9a7135}
  .sf-lineage-body{padding-top:11px}
  .spending-finder .sf-lineage-path{display:flex;align-items:stretch;overflow-x:auto;gap:0;
    margin:0 0 11px;padding:0 0 3px;scrollbar-width:thin}
  .spending-finder .sf-lineage-step{display:flex;align-items:center;flex:0 0 auto;min-width:0;max-width:none;gap:7px}
  .spending-finder .sf-lineage-step:not(:last-child):after{
    content:"›";font:400 1.3rem/1 system-ui;color:#ae925e;margin-right:11px}
  .spending-finder .sf-lineage-node{display:flex;flex-direction:column;gap:2px;justify-content:center;
    min-width:0;min-height:0;max-width:none;flex:none;padding:7px 0;
    border:0;background:transparent;border-radius:0;color:#244668!important;text-decoration:none!important}
  .spending-finder .sf-lineage-node strong{font:700 .75rem/1.35 system-ui;color:#244668}
  .spending-finder .sf-lineage-node small{font:600 .67rem/1.35 system-ui;color:#7c8999}
  .spending-finder .sf-lineage-step:last-child .sf-lineage-node{
    border:0;background:transparent}
  .spending-finder .sf-lineage-step:last-child .sf-lineage-node strong{color:#8b6529}
  .spending-finder a.sf-lineage-node:hover strong{text-decoration:underline;text-underline-offset:3px}
  .spending-finder .sf-lineage-children{border:0;margin:0;padding:0}
  .sf-children-caption{display:block;color:#697b8f;font:600 .7rem/1.4 system-ui;margin-bottom:6px}
  .spending-finder .sf-lineage-child-grid{display:flex;align-items:stretch;flex-wrap:wrap;gap:5px}
  .spending-finder .sf-lineage-child{display:inline-flex;flex:0 1 auto;min-width:0;max-width:100%;
    background:#f8fafc;border:1px solid #e0e7ed;border-radius:6px;padding:6px 8px;
    gap:3px;color:#244769!important}
  .spending-finder .sf-lineage-child span{font:600 .72rem/1.32 system-ui}
  .spending-finder .sf-lineage-child small{font:.66rem/1.2 system-ui;color:#65788b}
  .spending-finder .sf-lineage-child:hover{background:#eef5fc;border-color:#b3c6d6}
  .sf-lineage-note{margin:8px 0 0}
  .sf-lineage-note summary{font:500 .7rem/1.35 system-ui;color:#748398;cursor:pointer}
  .sf-lineage-note p{margin:5px 0 0!important;font:.71rem/1.45 system-ui!important;color:#6a7a8a!important}
  .sf-record-details{margin:9px 0 0;border-top:1px solid #f0f2f5;padding:8px 0 0}
  .sf-record-details summary{font:500 .71rem/1.4 system-ui;color:#728299;cursor:pointer}
  .sf-record-details p{margin:6px 0!important;font:.74rem/1.45 system-ui!important;color:#67768a!important}
  .sf-sources-details,.spending-finder .sf-investigation{border-top:1px solid #e8edf1;
    margin:8px 0;padding-top:8px}
  .sf-sources-details summary,.spending-finder .sf-investigation>summary{
    font:650 .75rem/1.4 system-ui;color:#2c5276;cursor:pointer;list-style:revert}
  .sf-sources-details .sf-portals{margin:10px 0}
  .spending-finder .sf-investigation p{margin:8px 0;font-size:.74rem}
  @media(max-width:700px){
    .spending-finder .sf-record{padding:12px 13px}
    .sf-record-top{gap:8px}
    .sf-record-figure{align-items:flex-start}
    .sf-record-figure small{white-space:normal}
    .spending-finder .sf-lineage-path{gap:0}
    .spending-finder .sf-lineage-step{max-width:220px}
    .spending-finder .sf-lineage-node{max-width:220px}
    .spending-finder .sf-lineage-node strong{font-size:.7rem}
    .spending-finder .sf-lineage-step:not(:last-child):after{margin-right:8px}
    .spending-finder .sf-lineage-child{flex:1 1 45%}
  }
  `;
  root.append(styles);
  const controls=make("div","sf-controls");
  const field=(label,element)=>{
    const cell=make("div","sf-field");
    const id="sf-"+["buscar","tipo","ano","pais"].find(x=>!document.getElementById(x))+"-"+Math.random().toString(36).slice(2,7);
    element.id=id;const l=make("label","",label);l.htmlFor=id;cell.append(l,element);controls.append(cell);
    return element;
  };
  const input=make("input");input.type="search";input.placeholder="Ej. ferrocarril, Paraguay, igualdad, transporte…";input.autocomplete="off";input.value=typeof initialQuery==="string"?initialQuery.slice(0,180):"";field("Buscar por proyecto, organismo, lugar o concepto",input);
  const select=(label,opts)=>{
    const el=make("select");for(const [v,t] of opts){const o=make("option","",t);o.value=v;el.append(o);}field(label,el);return el;
  };
  const type=select("Tipo de registro",[["","Todos"],["intervencion","Proyectos AECID"],["agregado","Gasto agregado IGAE"],["programa","Programas presupuestarios"],["convocatoria","Convocatorias"],["norma","Normas de concesión"]]);
  const years=[...new Set([...records,...aggregates].map(x=>String(x.anio)).filter(Boolean))].sort((a,b)=>b.localeCompare(a));
  const year=select("Año",[["","Todos los años"],...years.map(y=>[y,y])]);
  if (years.includes(String(initialYear))) year.value=String(initialYear);
  const countries=[...new Set(records.map(x=>x.pais).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"es"));
  const country=select("País / región",[["","Todos los destinos"],...countries.map(y=>[y,y]),["España", "España"]].filter((x,i,a)=>a.findIndex(y=>y[0]===x[0])===i));
  root.append(controls);
  const focusCode=/^\d{2}(?:\.\d+)?$/.test(String(initialCofog)) ? String(initialCofog) : "";
  let selectedCode=focusCode;
  const scope=make("div","sf-scope");
  const known=aggregates.find(r=>r.cofog_codigo===selectedCode);
  const scopeLabel=make("span","",selectedCode
   ? "Filtro COFOG " + selectedCode + (known?" · "+known.titulo:"") + " · subfunciones incluidas"
   : "Cobertura: España · gasto COFOG · 2024. Ministerios y CCAA se consultan por separado.");
  const clearScope=make("button","","Quitar filtro COFOG");
  clearScope.type="button";
  clearScope.hidden=!selectedCode;
  scope.append(scopeLabel,clearScope);
  root.append(scope);
  const examples=make("details","sf-examples");
  examples.append(make("summary","","Sugerencias de búsqueda"));
  const suggested=make("div","sf-example-options");
  for(const label of ["Mantenimiento de carreteras","Carreteras","Sanidad","Hospitales","Transporte","Mujeres Paraguay","Ferrocarril Marruecos"]){
    const b=make("button","",label);b.type="button";b.addEventListener("click",()=>{
      selectedCode="";clearScope.hidden=true;
      scopeLabel.textContent="Cobertura: conjunto de las Administraciones Públicas · COFOG";
      input.value=label;type.value="";year.value="";country.value="";render();input.focus();
      examples.open=false;
    });suggested.append(b);
  }
  examples.append(suggested);root.append(examples);
  const quickGuide=make("a","sf-dimension-jump","Consultar por administración");
  quickGuide.href="#investigar-por-administracion";
  clearScope.addEventListener("click",()=>{selectedCode="";clearScope.hidden=true;scopeLabel.textContent="Sin filtro COFOG · consulta el catálogo general";render();});
  const summary=make("div","sf-summary"), results=make("div","sf-results");
  root.append(summary,results);
  const lineageId=code=>"linaje-"+String(code).replace(/[^a-zA-Z0-9-]/g,"-");
  const portals=make("div","sf-portals");
  for(const [title,href] of [
    ["Buscar todas las intervenciones de AECID","https://datos.aecid.es/lista-de-intervenciones"],
    ["Subvenciones y concesiones oficiales (BDNS)","https://www.infosubvenciones.es/bdnstrans/GE/es/inicio"],
    ["Contratos, convenios y subvenciones","https://transparencia.gob.es/publicidad-activa/por-materias/tramites"]
  ])portals.append(external(title,href));
  const footnote=make("p","sf-footnote",coverage+" Los registros de distintas fuentes, ejercicios y ámbitos NO pueden sumarse: pueden representar ayudas, límites normativos, pagos o estadísticas agregadas y existir solapamientos. Ningún dato permite afirmar qué impuesto financió un proyecto concreto.");
  const sourcesDetails=make("details","sf-sources-details");
  sourcesDetails.append(make("summary","","Fuentes y alcance del buscador"),
    make("p","sf-footnote","El índice muestra documentos oficiales seleccionados, no todos los contratos ni proyectos del sector público."),
    portals,footnote);
  root.append(sourcesDetails);

  // Rutas distintas. No se calculan totales administrativos a partir de COFOG.
  const guide=make("details","sf-investigation");
  guide.id="investigar-por-administracion";
  guide.append(make("summary","","Investigar por ministerio, comunidad o infraestructura"));
  guide.append(make("p","",
   "El Sankey cubre el sector Administraciones Públicas (S.13) por finalidad. " +
   "Un ministerio se estudia mediante ejecución presupuestaria estatal y sección orgánica; " +
   "una comunidad autónoma mediante COFOG regional o liquidaciones propias; " +
   "una inversión ferroviaria exige además el programa, el operador y el ejercicio de inversión. " +
   "Las cifras de estas vistas tienen distinta metodología y no son sumables por defecto."));
  const cards=make("div","sf-investigation-grid");
  const routes=[
   ["Por ministerio",
    "Busca sección orgánica, programa presupuestario, obligaciones reconocidas y pagos. Distingue presupuesto aprobado de gasto ejecutado.",
    [
     ["Ejecución presupuestaria del Estado · IGAE","https://transparencia.gob.es/publicidad-activa/por-materias/informacion-economico-presupuestaria/ejecucion"],
     ["PGE · programas de Transportes","https://www.sepg.pap.hacienda.gob.es/Presup/PGE2024Prorroga/MaestroDocumentos/PGE-ROM/N_24P_E_R_31_117_1_1_1.htm"]
    ]],
   ["Por comunidad autónoma",
    "Gasto COFOG de cada administración regional y liquidaciones consolidadas; no equivale a todo lo gastado por el Estado en ese territorio.",
    [
     ["IGAE · COFOG regional por comunidad","https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadNacional/Publicaciones/Paginas/iacofogCA.aspx"],
     ["Hacienda · liquidaciones definitivas CCAA","https://serviciostelematicosext.hacienda.gob.es/SGCIEF/PublicacionLiquidaciones/aspx/menuInicio.aspx"]
    ]],
   ["Conservación y mantenimiento de carreteras",
    "Programa 453C de la Administración General del Estado: distinguir presupuesto prorrogado, obligaciones reconocidas y contratos de conservación. El gasto COFOG de transporte no es una cifra equivalente.",
    [
      ["Consultar programa 453C y capítulos oficiales","https://www.sepg.pap.hacienda.gob.es/Presup/PGE2024Prorroga/MaestroDocumentos/PGE-ROM/doc/HTM/N_24P_E_R_31_117_1_1_1_1453C_2.HTM"],
      ["Buscar en el catálogo de IDEA LAB","/buscador-partidas.html?q=mantenimiento%20de%20carreteras"]
    ]],
   ["Ferrocarriles e infraestructuras",
    "Separar programa 453A, inversión de Adif/Renfe y gasto COFOG 04.5. Un crédito presupuestario no es inversión efectivamente realizada.",
    [
     ["PGE · infraestructura ferroviaria, programa 453A","https://www.sepg.pap.hacienda.gob.es/Presup/PGE2024Prorroga/MaestroDocumentos/PGE-ROM/N_24P_E_R_31_117_1_1_1.htm"],
     ["Observatorio del Ferrocarril · inversiones 2024","https://cdn.transportes.gob.es/portal-web-transportes/ferroviario/observatorio/ofe_2024.pdf"]
    ]]
  ];
  for(const [heading,summary,links] of routes){
    const card=make("article");
    card.append(make("h3","",heading),make("p","",summary));
    for(const [label,href] of links)card.append(external(label,href));
    cards.append(card);
  }
  guide.append(cards,make("p","",
   "Estados de datos: partidas presupuestadas, obligaciones reconocidas, pagos, inversión realizada y gasto COFOG son conceptos distintos. " +
   "No asignamos automáticamente importes nacionales a un ministerio, comunidad o proyecto sin clave administrativa y conciliación oficial."));
  root.append(guide);
  quickGuide.addEventListener("click",()=>{guide.open=true;});
  const all=[...records,...aggregates].map(x=>({...x,_search:fold([x.titulo,x.pais,x.sector,x.entidad,x.organismo,x.descripcion,x.id,x.trazabilidad,x.clasificacion,x.anio].join(" "))}));
  // La ruta es la cabecera de cada tarjeta, no un bloque de texto separado.
  // Nunca se abre un Sankey para un documento sin relación COFOG verificada.
  function card(item,related){
    const lineage=item.tipo==="agregado"?
      spendingLineage(item,aggregates):relatedProgramLineage(item,aggregates);
    const source=official(item.fuente_url),url=lineage?.href||source;
    const group=make("article","sf-result-group");
    const trail=make("nav","sf-card-lineage");
    trail.setAttribute("aria-label","Linaje de "+item.titulo);
    if(lineage){
      lineage.steps.forEach((step,index)=>{
        if(index)trail.append(make("span","sf-crumb-divider","›"));
        trail.append(make("span",index===lineage.steps.length-1?
          "sf-crumb sf-crumb-current":"sf-crumb",
          step.code==="S13.GASTO"?"S.13 · Gasto público":
            step.code+" · "+step.title));
      });
      if(lineage.relation)trail.append(make("span","sf-theme-relationship",
        "Correspondencia temática COFOG"));
    }else{
      trail.append(make("span","sf-crumb","Documento oficial"),
        make("span","sf-theme-relationship","Sin linaje COFOG verificado"));
    }
    group.append(trail);
    const tile=make(url?"a":"div","sf-record");
    tile.classList.add("sf-card-open");
    if(url){
      tile.href=url;
      if(!lineage){tile.target="_blank";tile.rel="noopener noreferrer";}
      tile.setAttribute("aria-label","Abrir "+item.titulo+
        (lineage?" en el Sankey con recorrido abierto":" en el documento oficial"));
    }
    const heading=make("div","sf-record-top");
    const left=make("div","sf-record-intro");
    const types={intervencion:"Intervención AECID",agregado:"Gasto COFOG",
      programa:"Programa de los PGE",convocatoria:"Convocatoria",norma:"Norma de concesión"};
    const meta=make("div","sf-record-meta");
    meta.append(make("span","sf-record-kind",types[item.tipo]||item.tipo),
      make("span","","· "+item.anio));
    if(item.tipo==="programa"&&item.codigo_presupuestario)
      meta.append(make("span","","· "+item.codigo_presupuestario));
    left.append(meta,make("h3","",item.titulo));
    const figure=make("div","sf-record-figure");
    const amount=item.tipo==="agregado"?euro.format(item.importe_eur)+" M€":
      item.tipo==="programa"?budgetMillions.format(item.importe_eur/1000000)+" M€":
        euro.format(item.importe_eur)+" €";
    figure.append(make("strong","sf-amount",amount),
      make("small","",item.tipo==="programa"?"No equivale a gasto ejecutado":
        item.tipo==="agregado"?"IGAE · gasto agregado":"Importe documentado"));
    heading.append(left,figure);tile.append(heading);
    const bottom=make("div","sf-card-bottom");
    bottom.append(make("span","sf-card-entity",item.organismo||"Fuente oficial"),
      make("span","sf-card-arrow",lineage?"Abrir Sankey ↗":source?"Ver fuente ↗":"Sin enlace"));
    tile.append(bottom);group.append(tile);
    const details=make("details","sf-result-details");
    details.append(make("summary","","Información y fuentes"));
    const body=make("div","sf-result-detail-body");
    if(item.entidad||item.pais)body.append(make("p","",
      [item.organismo,item.entidad,item.pais].filter(Boolean).join(" · ")));
    if(item.descripcion)body.append(make("p","",item.descripcion));
    if(item.naturaleza_importe)body.append(make("p","",item.naturaleza_importe));
    if(item.trazabilidad)body.append(make("p","",item.trazabilidad));
    if(related)body.append(make("p","",
      "Resultados por correspondencia temática con la clasificación oficial COFOG; no son contratos ni proyectos individuales."));
    if(lineage){
      body.append(make("p","",lineage.caution));
      if(lineage.descendants.length){
        const sub=make("details","sf-lineage-list");
        sub.id=lineageId(lineage.code);
        sub.append(make("summary","","Subcategorías COFOG ("+lineage.descendants.length+")"));
        const children=make("div","sf-lineage-child-grid");
        for(const child of lineage.descendants){
          if(!child.href)continue;
          const a=make("a","sf-lineage-child",child.code+" · "+child.title+
            (child.amount_mill_eur===null?" · sin importe desglosado":
              " · "+euro.format(child.amount_mill_eur)+" M€"));
          a.href=child.href;children.append(a);
        }
        sub.append(children);body.append(sub);
      }
    }
    if(Array.isArray(item.desglose)&&item.desglose.length){
      const breakdown=make("details","sf-breakdown");
      breakdown.append(make("summary","","Ver capítulos presupuestarios (incluidos en el total)"));
      const table=make("table","sf-breakdown-table");
      for(const part of item.desglose){
        const tr=make("tr");
        tr.append(make("td","",part.concepto),
          make("td","sf-breakdown-amount",
            budgetMillions.format(part.importe_eur/1000000)+" M€"));
        table.append(tr);
      }
      breakdown.append(table);body.append(breakdown);
    }
    if(source)body.append(external("Consultar documento oficial ↗",source));
    details.append(body);group.append(details);
    return group;
  }
  function render(){
    const q=fold(input.value);
    const matching=searchSpendingRecords(all,input.value,{
      cofog:selectedCode,tipo:type.value,anio:year.value,pais:country.value
    });
    results.replaceChildren();
    const slice=matching.slice(0,70);
    summary.replaceChildren();
    summary.append(make("span","",matching.length+
      (matching.length===1?" resultado":" resultados")+
      (matching.length>70?" · primeros 70":"")));
    const aliasMatch=q&&matching.some(item=>item._matchKind==="cofog-alias");
    if(aliasMatch){
      const info=make("details","sf-summary-explainer");
      info.append(make("summary","","Sobre las coincidencias"),
        make("p","",/\\bsanidad\\b/.test(q)
          ? "Sanidad corresponde a la función oficial COFOG 07 «Salud»; se muestran su total y subfunciones, sin sumar dos veces."
          : "Resultados por correspondencia temática con la clasificación oficial COFOG; no son contratos ni proyectos individuales."));
      summary.append(info);
    }
    if(!matching.length){
      const no=make("div","sf-noresults");
      no.append(make("strong","","Sin coincidencias en el índice disponible."),
        make("p","","No significa que la partida no exista. Prueba otra palabra o consulta las fuentes oficiales."));
      results.append(no);
    }else{
      for(const item of slice)
        results.append(card(item,item._matchKind==="cofog-alias"));
    }
  }
  for(const el of [input,type,year,country])el.addEventListener(el===input?"input":"change",render);
  render();
  return root;
}
