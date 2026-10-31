/* Buscador público de gastos verificables. Sin dependencias ni telemetría. */
const fold = value => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const euro = new Intl.NumberFormat("es-ES", {maximumFractionDigits:0});
const make = (tag, className, text) => {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = String(text);
  return el;
};
const official = url => {
  try {const u=new URL(url);return u.protocol==="https:" && ["datos.aecid.es","www.boe.es","boe.es","www.igae.pap.hacienda.gob.es","igae.pap.hacienda.gob.es"].includes(u.hostname) ? u.href : null;}
  catch {return null;}
};
const external = (label, href) => {
  const a = make("a", "", label);
  a.href=href;a.target="_blank";a.rel="noopener noreferrer";
  return a;
};
export function createSpendingSearch({records = [], aggregates = [], coverage = "", initialQuery = ""} = {}) {
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
  .sf-noresults{border:1px dashed #c7d3de;border-radius:12px;padding:18px;background:#f9fafc;color:#42546b;grid-column:1/-1}
  .sf-noresults strong{display:block;margin-bottom:6px;color:var(--sf-navy)}
  .sf-noresults p{font-size:.85rem}
  .sf-portals{display:flex;gap:10px;flex-wrap:wrap;margin-top:8px;font-size:.81rem;font-weight:700}
  .sf-footnote{font-size:.78rem;color:#637187;line-height:1.5;margin:8px 0}
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
  const type=select("Tipo de registro",[["","Todos"],["intervencion","Proyectos AECID"],["agregado","Gasto agregado IGAE"],["convocatoria","Convocatorias"],["norma","Normas de concesión"]]);
  const years=[...new Set([...records,...aggregates].map(x=>String(x.anio)).filter(Boolean))].sort((a,b)=>b.localeCompare(a));
  const year=select("Año",[["","Todos los años"],...years.map(y=>[y,y])]);
  const countries=[...new Set(records.map(x=>x.pais).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"es"));
  const country=select("País / región",[["","Todos los destinos"],...countries.map(y=>[y,y]),["España", "España"]].filter((x,i,a)=>a.findIndex(y=>y[0]===x[0])===i));
  root.append(controls);
  const examples=make("div","sf-examples");examples.append(make("span","","Prueba:"));
  for(const label of ["Transporte","Mujeres Paraguay","Ayuda militar exterior","Ferrocarril Marruecos","Charlas feministas"]){
    const b=make("button","",label);b.type="button";b.addEventListener("click",()=>{input.value=label;type.value="";year.value="";country.value="";render();input.focus();});examples.append(b);
  }
  root.append(examples);
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
  const all=[...records,...aggregates].map(x=>({...x,_search:fold([x.titulo,x.pais,x.sector,x.entidad,x.organismo,x.descripcion,x.id,x.trazabilidad,x.clasificacion].join(" "))}));
  function card(item,related){
    const box=make("article","sf-record");
    const tags=make("div","sf-tags");
    const kinds={intervencion:"Intervención AECID",agregado:"Gasto COFOG agregado",convocatoria:"Convocatoria",norma:"Norma de concesión"};
    tags.append(make("span","sf-tag",kinds[item.tipo]||item.tipo));
    if(related)tags.append(make("span","sf-tag sf-tag--related","Solo relación temática"));
    tags.append(make("span","sf-tag",item.anio));
    box.append(tags,make("h3","",item.titulo));
    const amount=make("strong","sf-amount",euro.format(item.importe_eur)+(item.tipo==="agregado"?" M€":" €"));
    box.append(amount);
    const meta=make("div","sf-row");
    meta.append(make("strong","","Organismo: "),document.createTextNode(item.organismo||"—"));
    if(item.pais)meta.append(document.createTextNode(" · "+item.pais));
    if(item.entidad)meta.append(document.createTextNode(" · Entidad: "+item.entidad));
    box.append(meta);
    if(item.descripcion)box.append(make("p","",item.descripcion));
    box.append(make("p","sf-row",item.naturaleza_importe||"Importe publicado (ver fuente original)."));
    if(item.trazabilidad)box.append(make("p","sf-row",item.trazabilidad));
    if(item.fuente_url && official(item.fuente_url)){
      const a=external("Consultar documento oficial",official(item.fuente_url));a.className="sf-cta";box.append(a);
    }
    return box;
  }
  function render(){
    const q=fold(input.value), tokens=q.split(" ").filter(Boolean);
    const matching=all.filter(x=>
      (!type.value||x.tipo===type.value) &&
      (!year.value||String(x.anio)===year.value) &&
      (!country.value || x.pais===country.value) &&
      (!tokens.length || tokens.some(t=>x._search.includes(t) || (x.tipo==="agregado" && /^(tren|ferrocar|ferroviar)/.test(t) && fold(x.titulo)==="transporte")))
    ).map(item=>{
      const exact=tokens.every(t=>item._search.includes(t));
      const hits=tokens.filter(t=>item._search.includes(t)).length;
      return {...item,_exact:exact,_score:(exact?1000:0)+hits*20+(item.tipo==="intervencion"?8:0)};
    }).sort((a,b)=>b._score-a._score || b.anio-a.anio || a.titulo.localeCompare(b.titulo,"es"));
    results.replaceChildren();
    const slice=matching.slice(0,70);
    summary.replaceChildren();
    summary.append(make("span","",matching.length+" resultados en el índice parcial"+(matching.length>70?" · primeros 70":"")));
    if(q&&matching.some(x=>!x._exact))summary.append(make("span","", "Los resultados temáticos no prueban financiación de la actividad buscada"));
    if(!matching.length){
      const no=make("div","sf-noresults");no.append(make("strong","","Sin coincidencias en el índice disponible."),make("p","", "No significa que la partida no exista o que no se haya destinado dinero. Consulta las fuentes oficiales o intenta otra expresión, país u organismo."));results.append(no);
    }else for(const item of slice)results.append(card(item,q&&!item._exact));
  }
  for(const el of [input,type,year,country])el.addEventListener(el===input?"input":"change",render);
  render();
  return root;
}
