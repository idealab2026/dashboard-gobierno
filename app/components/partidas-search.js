/* Buscador público de gastos verificables. Sin dependencias ni telemetría. */
import {searchSpendingRecords, normalizeSpending} from "./spending-query.js";
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
   : "Cobertura: categorías COFOG del conjunto de Administraciones Públicas; ministerios y CCAA requieren fuentes distintas.");
  const clearScope=make("button","","Quitar filtro COFOG");
  clearScope.type="button";
  clearScope.hidden=!selectedCode;
  scope.append(scopeLabel,clearScope);
  root.append(scope);
  const examples=make("div","sf-examples");examples.append(make("span","","Prueba:"));
  for(const label of ["Mantenimiento de carreteras","Carreteras","Sanidad","Hospitales","Transporte","Mujeres Paraguay","Ferrocarril Marruecos"]){
    const b=make("button","",label);b.type="button";b.addEventListener("click",()=>{selectedCode="";clearScope.hidden=true;scopeLabel.textContent="Sin filtro COFOG · resultados temáticos no equivalen a un desglose de la función";input.value=label;type.value="";year.value="";country.value="";render();input.focus();});examples.append(b);
  }
  root.append(examples);
  const quickGuide=make("a","sf-dimension-jump","Consultar por ministerio, comunidad autónoma o ferrocarril");
  quickGuide.href="#investigar-por-administracion";
  root.append(quickGuide);
  clearScope.addEventListener("click",()=>{selectedCode="";clearScope.hidden=true;scopeLabel.textContent="Sin filtro COFOG · consulta el catálogo general";render();});
  const summary=make("div","sf-summary"), results=make("div","sf-results");
  root.append(summary,results);
  const portals=make("div","sf-portals");
  for(const [title,href] of [
    ["Buscar todas las intervenciones de AECID","https://datos.aecid.es/lista-de-intervenciones"],
    ["Subvenciones y concesiones oficiales (BDNS)","https://www.infosubvenciones.es/bdnstrans/GE/es/inicio"],
    ["Contratos, convenios y subvenciones","https://transparencia.gob.es/publicidad-activa/por-materias/tramites"]
  ])portals.append(external(title,href));
  const footnote=make("p","sf-footnote",coverage+" Los registros de distintas fuentes, ejercicios y ámbitos NO pueden sumarse: pueden representar ayudas, límites normativos, pagos o estadísticas agregadas y existir solapamientos. Ningún dato permite afirmar qué impuesto financió un proyecto concreto.");
  root.append(make("p","sf-footnote","¿No encuentras una actuación? Comprueba los portales oficiales: este catálogo no sustituye su buscador completo."),portals,footnote);

  // Rutas distintas. No se calculan totales administrativos a partir de COFOG.
  const guide=make("section","sf-investigation");
  guide.id="investigar-por-administracion";
  guide.append(make("h2","","Investigar por ministerio, comunidad o infraestructura"));
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
  const all=[...records,...aggregates].map(x=>({...x,_search:fold([x.titulo,x.pais,x.sector,x.entidad,x.organismo,x.descripcion,x.id,x.trazabilidad,x.clasificacion,x.anio].join(" "))}));
  function card(item,related){
    const box=make("article","sf-record");
    const tags=make("div","sf-tags");
    const kinds={intervencion:"Intervención AECID",agregado:"Gasto COFOG agregado",programa:"Programa de los PGE",convocatoria:"Convocatoria",norma:"Norma de concesión"};
    tags.append(make("span","sf-tag",kinds[item.tipo]||item.tipo));
    if(related)tags.append(make("span","sf-tag sf-tag--related","Correspondencia temática COFOG"));
    tags.append(make("span","sf-tag",item.anio));
    box.append(tags,make("h3","",item.titulo));
    // COFOG se publica en millones. PGE aporta euros: presentar en M€
    // con una decimal para preservar la diferencia entre créditos y gastos.
    const amountLabel=item.tipo==="agregado"
      ? euro.format(item.importe_eur)+" M€"
      : item.tipo==="programa"
        ? budgetMillions.format(item.importe_eur/1000000)+" M€"
        : euro.format(item.importe_eur)+" €";
    const amount=make("strong","sf-amount",amountLabel);
    box.append(amount);
    if(item.tipo==="programa" && item.codigo_presupuestario){
      box.append(make("span","sf-row",
        "Programa "+item.codigo_presupuestario+" · Presupuesto prorrogado 2024-P · No equivale a gasto ejecutado"));
    }
    const meta=make("div","sf-row");
    meta.append(make("strong","","Organismo: "),document.createTextNode(item.organismo||"—"));
    if(item.pais)meta.append(document.createTextNode(" · "+item.pais));
    if(item.entidad)meta.append(document.createTextNode(" · Entidad: "+item.entidad));
    box.append(meta);
    if(item.descripcion)box.append(make("p","",item.descripcion));
    box.append(make("p","sf-row",item.naturaleza_importe||"Importe publicado (ver fuente original)."));
    if(item.trazabilidad)box.append(make("p","sf-row",item.trazabilidad));
    if(Array.isArray(item.desglose) && item.desglose.length){
      const details=make("details","sf-breakdown");
      details.append(make("summary","","Ver capítulos presupuestarios (incluidos en el total)"));
      const table=make("table","sf-breakdown-table");
      for(const part of item.desglose){
        const row=make("tr");
        const name=make("td","",part.concepto);
        const value=make("td","sf-breakdown-amount",
          budgetMillions.format(part.importe_eur/1000000)+" M€");
        row.append(name,value);
        table.append(row);
      }
      details.append(table,make("p","sf-row","Capítulos incluidos en el mismo programa: no sumarlos al total mostrado ni a COFOG."));
      box.append(details);
    }
    if(item.fuente_url && official(item.fuente_url)){
      const a=external("Consultar documento oficial",official(item.fuente_url));a.className="sf-cta";box.append(a);
    }
    return box;
  }
  function render(){
    const q=fold(input.value);
    const matching=searchSpendingRecords(all,input.value,{
      cofog:selectedCode,tipo:type.value,anio:year.value,pais:country.value
    });
    results.replaceChildren();
    const slice=matching.slice(0,70);
    summary.replaceChildren();
    summary.append(make("span","",matching.length+" resultados en el índice parcial"+
      (matching.length>70?" · primeros 70":"")+
      (selectedCode?" · COFOG "+selectedCode+" y subfunciones":"")));
    const aliasMatch=q&&matching.some(item=>item._matchKind==="cofog-alias");
    if(aliasMatch){
      const explanation=/\bsanidad\b/.test(q)
       ? "Sanidad corresponde a la función oficial COFOG 07 «Salud»; se muestran su total y subfunciones, sin sumar dos veces."
       : "Resultados por correspondencia temática con la clasificación oficial COFOG; no son contratos ni proyectos individuales.";
      summary.append(make("span","sf-alias-explanation",explanation));
    }
    if(!matching.length){
      const no=make("div","sf-noresults");
      no.append(
        make("strong","","Sin coincidencias en el índice disponible."),
        make("p","","No significa que la partida no exista o que no se haya destinado dinero. Consulta las fuentes oficiales o intenta otra expresión, país u organismo.")
      );
      results.append(no);
    }else for(const item of slice)results.append(card(item,item._matchKind==="cofog-alias"));
  }
  for(const el of [input,type,year,country])el.addEventListener(el===input?"input":"change",render);
  render();
  return root;
}
