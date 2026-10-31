// Rutas de continuidad: no representan relaciones monetarias auditadas entre COFOG y PGE.
// Son rutas de investigación independientes, con fuente oficial y año/perímetro explícitos.
export const OFFICIAL_DRILL_ROUTES = Object.freeze([
  {
    id:"cofog-ambito",
    title:"1 · ¿Qué administración realizó el gasto?",
    description:"Cambiar el perímetro de S.13 a un subsector de la IGAE. Los importes de estas tablas no deben sumarse sin revisar las consolidaciones y transferencias.",
    links:[
      ["Administración central (S.1311) · COFOG y naturaleza económica", "https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadNacional/Publicaciones/Paginas/iacofogAC.aspx","Serie oficial IGAE · última edición en origen"],
      ["Comunidades autónomas (S.1312) · detalle territorial", "https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadNacional/Publicaciones/Paginas/iacofogCA.aspx","IGAE · detalle regional 2024 disponible al 31/10/2026"],
      ["Administración local (S.1313)", "https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadNacional/Publicaciones/Paginas/iacofogCL.aspx","Serie oficial IGAE · última edición en origen"],
      ["Seguridad Social (S.1314)", "https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadNacional/Publicaciones/Paginas/iacofog.aspx","Serie oficial IGAE · última edición en origen"]
    ]
  },
  {
    id:"programa",
    title:"2 · ¿Qué ministerio y programa presupuestario?",
    description:"Los programas y capítulos de los PGE son otra clasificación. No se puede asignarles automáticamente un porcentaje de este grupo COFOG.",
    links:[
      ["Presupuestos Generales del Estado prorrogados para 2026", "https://www.sepg.pap.hacienda.gob.es/sitios/sepg/es-ES/Presupuestos/PGE/PGE2025Prorroga/Paginas/PGE2025Prorroga.aspx", "2026 · presupuesto aprobado/prorrogado, no pagos"],
      ["Buscar partidas y programas nominales en IDEA LAB", "/buscador-partidas.html", "Índice parcial de documentos acreditados"]
    ]
  },
  {
    id:"ejecucion",
    title:"3 · ¿Cuánto se ejecutó o pagó?",
    description:"Contrastar crédito, obligaciones reconocidas y pagos. La ejecución de 2026 es acumulada y no equivale al gasto anual consolidado COFOG de 2024.",
    links:[
      ["Ejecución del presupuesto estatal · IGAE", "https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadPublica/CPE/EjecucionPresupuestaria/Paginas/ejecucionpresupuestaria.aspx","Series mensuales y liquidaciones · última publicación en fuente"],
      ["Ejecución por comunidad autónoma · Hacienda", "https://serviciostelematicosext.hacienda.gob.es/SGCIEF/Cimcanet/aspx/consulta/consulta.aspx","Datos mensuales de 2026 · comprobar fecha al abrir"],
      ["Presupuestos y liquidaciones de entidades locales", "https://serviciostelematicosext.hacienda.gob.es/sgfal/conprel", "Liquidaciones 2025 y presupuestos 2026 · comprobar fecha"]
    ]
  },
  {
    id:"contratacion",
    title:"4 · ¿Qué contrato, subvención o proyecto concreto?",
    description:"Aquí se buscan licitaciones, adjudicaciones, beneficiarios y proyectos; no se infiere qué contratos forman parte de este total COFOG sin una clave de conciliación.",
    links:[
      ["Plataforma de Contratación del Sector Público", "https://contrataciondelestado.es/wps/portal/plataforma", "Licitaciones y adjudicaciones · consulta actual"],
      ["Base de Datos Nacional de Subvenciones (BDNS)", "https://www.infosubvenciones.es/bdnstrans/GE/es/inicio", "Convocatorias y concesiones · consulta actual"],
      ["Intervenciones de cooperación de AECID", "https://datos.aecid.es/lista-de-intervenciones", "Proyectos documentados · consulta actual"]
    ]
  }
]);

export function relatedBudgetPrograms(code, year, records) {
  const selected = String(code || "");
  const period = Number(year);
  // Solo referencias temáticas verificadas; nunca descendientes contables de COFOG.
  const matching = (records || []).filter(row=>
    row?.tipo==="programa" && row?.cofog_referencia &&
    (selected===row.cofog_referencia ||
     (selected.length===2 && row.cofog_referencia.startsWith(selected+"."))) &&
    Number(row.anio) <= period && Number.isFinite(row.importe_eur) &&
    typeof row.fuente_url==="string" && row.fuente_url.startsWith("https://www.sepg.pap.hacienda.gob.es/")
  );
  return matching.sort((a,b)=>b.anio-a.anio||a.titulo.localeCompare(b.titulo,"es"));
}
