/** Coverage counts, not monetary sums: one indexed observation is one row.
 * Classifications are different lenses and MUST NOT be added together. */
const TYPE_LABELS={
  programa:"Programas PGE · secciones verificadas",
  programa_documental:"Programas con ficha documental",
  regional:"Funciones de CCAA",
  agregado:"Categorías COFOG · España",
  intervencion:"Intervenciones AECID",
  convocatoria:"Convocatorias",
  norma:"Normas de concesión"
};
const AREA_LABELS={
  "0":"Deuda y operaciones financieras",
  "1":"Servicios públicos básicos",
  "2":"Protección y promoción social",
  "3":"Servicios públicos preferentes",
  "4":"Actuaciones económicas",
  "9":"Actuaciones generales"
};
const FUNCTION_LABELS={
  "01":"Servicios públicos generales",
  "02":"Defensa",
  "03":"Orden público y seguridad",
  "04":"Asuntos económicos",
  "05":"Protección ambiental",
  "06":"Vivienda y servicios comunitarios",
  "07":"Salud",
  "08":"Cultura, ocio y religión",
  "09":"Educación",
  "10":"Protección social"
};
export const COVERAGE_MODES=Object.freeze([
  {id:"tipo",title:"Tipo de registro",
    caption:"Registros indexados por fuente y unidad de observación."},
  {id:"area",title:"Programas PGE · área",
    caption:"Solo programas PGE 2025-P. Cada sección y programa cuenta una vez."},
  {id:"cofog",title:"COFOG · España",
    caption:"Categorías nacionales COFOG por función. No son partidas económicas."},
  {id:"ccaa",title:"COFOG · CCAA",
    caption:"Funciones de 17 administraciones regionales, no todo el gasto territorial."}
]);
const recordType=x=>{
  // Two selected documentary programme sheets also have tipo="programa".
  // They are NOT two extra distinct budget programmes in the PGE index.
  if(x?.tipo==="programa")
    return x.codigo_seccion&&x.admin_hierarchy?"programa":"programa_documental";
  return Object.prototype.hasOwnProperty.call(TYPE_LABELS,x?.tipo)?x.tipo:"otro";
};
export function classificationKey(item,mode){
  if(mode==="tipo")return recordType(item);
  if(mode==="area"&&recordType(item)==="programa")
    return AREA_LABELS[String(item.codigo_presupuestario||"").slice(0,1)]
      ?String(item.codigo_presupuestario).slice(0,1):"otros";
  if(mode==="cofog"&&item?.tipo==="agregado"){
    const code=String(item.cofog_codigo||"");
    return /^\d{2}(?:\.\d+){0,2}$/.test(code)?code.slice(0,2):"otros";
  }
  if(mode==="ccaa"&&item?.tipo==="regional"){
    const code=String(item.codigo_funcion||"");
    return /^\d{2}$/.test(code)?code:"otros";
  }
  return null;
}
export function matchesClassification(item,mode,key){
  return classificationKey(item,mode)===key;
}
export function coverageSummary(records=[]){
  // Distinct observations. Identical programme code in different ministries
  // is NOT a duplicate; administrative index IDs include the section.
  const ids=new Set(),rows=[];
  for(const item of records){
    const id=String(item?.id||"");
    if(!id)throw Error("Registro sin identificador en el índice de cobertura");
    if(ids.has(id))throw Error("Identificador repetido en índice: "+id);
    ids.add(id);rows.push(item);
  }
  const grouped={};
  for(const mode of COVERAGE_MODES){
    const byKey=new Map();
    for(const item of rows){
      const key=classificationKey(item,mode.id);
      if(key!==null)byKey.set(key,(byKey.get(key)||0)+1);
    }
    const labels=mode.id==="tipo"?TYPE_LABELS:
      mode.id==="area"?AREA_LABELS:FUNCTION_LABELS;
    grouped[mode.id]=[...byKey].map(([key,count])=>({
      key,count,label:labels[key]||"Sin clasificación específica"
    })).sort((a,b)=>b.count-a.count||a.key.localeCompare(b.key,"es",{numeric:true}));
  }
  const total=rows.length;
  const counted=grouped.tipo.reduce((sum,x)=>sum+x.count,0);
  if(counted!==total)throw Error("Descuadre de tipologías en índice: "+counted+" / "+total);
  return {
    total,
    programCount:grouped.tipo.find(x=>x.key==="programa")?.count||0,
    regionalCount:grouped.tipo.find(x=>x.key==="regional")?.count||0,
    nationalCount:grouped.tipo.find(x=>x.key==="agregado")?.count||0,
    documentCount:grouped.tipo.filter(x=>!["programa","regional","agregado"].includes(x.key))
      .reduce((sum,x)=>sum+x.count,0),
    groups:grouped
  };
}
