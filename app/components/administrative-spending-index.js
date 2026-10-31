/* Verified admin-budget rows are indexed without inventing funding links.
 * PGE 2025-P credits and IGAE regional COFOG 2024 remain separate. */
const AREA={
  "0":"Deuda y operaciones financieras",
  "1":"Servicios públicos básicos",
  "2":"Protección y promoción social",
  "3":"Servicios públicos preferentes",
  "4":"Actuaciones de carácter económico",
  "9":"Actuaciones de carácter general"
};
const number=v=>Number(v);
const valid=(parent,source)=>parent?.verified===true &&
  Array.isArray(parent.flows)&&parent.flows.length>0 &&
  parent.flows.every(f=>f.code&&f.name&&Number.isFinite(number(f.value_mill_eur))&&number(f.value_mill_eur)>=0) &&
  Math.abs(parent.flows.reduce((sum,f)=>sum+number(f.value_mill_eur),0)-
    number(parent.total_mill_eur))<=0.15 &&
  typeof parent.source_url==="string"&&parent.source_url.startsWith(source);
const millionToEuro=v=>Math.round(number(v)*1000000);
const budgetRoute=(ministry,code)=>"./administraciones.html?tipo=ministerio&id="+
  encodeURIComponent(ministry)+"&nivel=programa&codigo="+encodeURIComponent(code);
const regionalRoute=(region,code)=>"./administraciones.html?tipo=ccaa&id="+
  encodeURIComponent(region)+"&nivel=funcion&codigo="+encodeURIComponent(code);
export function indexAdministrativeSpending(data){
  const out=[];
  for(const m of data?.ministries||[]){
    if(!valid(m,"https://www.sepg.pap.hacienda.gob.es/"))continue;
    for(const flow of m.flows){
      const area=String(flow.code).charAt(0);
      const parent=AREA[area]||"Área "+area;
      const title=String(flow.name).trim();
      out.push({
        id:"pge-2025p-m"+m.id+"-"+flow.code, tipo:"programa",
        titulo:title,anio:2025,periodo:"2025-P · prorrogado para 2026",
        importe_eur:millionToEuro(flow.value_mill_eur),
        importe_mill_eur:number(flow.value_mill_eur),
        importe_tipo:"Crédito del programa presupuestario, no gasto ejecutado",
        organismo:m.name,entidad:m.name,pais:"España",sector:parent,
        codigo_presupuestario:flow.code,codigo_seccion:String(m.id),
        fuente_url:m.source_url,
        descripcion:"Programa oficial "+flow.code+" de "+m.name+
          " · PGE 2025-P prorrogado para 2026.",
        naturaleza_importe:"Crédito presupuestario; no son pagos, obligaciones reconocidas ni cifras COFOG.",
        trazabilidad:"Sección ministerial "+m.id+" → área "+area+" → programa "+flow.code+
          ". Sin conexión contable demostrada con ingresos fiscales individuales.",
        admin_hierarchy:{
          href:budgetRoute(m.id,flow.code),
          steps:[
            {code:"PGE",title:"Presupuestos ministeriales"},
            {code:String(m.id),title:m.name},
            {code:area,title:parent},
            {code:flow.code,title}
          ],
          caution:"PGE 2025-P prorrogado para 2026. Los importes de programa están incluidos en su sección; no se suman a los agregados COFOG."
        }
      });
    }
  }
  for(const region of data?.regions||[]){
    if(!valid(region,"https://www.igae.pap.hacienda.gob.es/"))continue;
    for(const flow of region.flows){
      out.push({
        id:"igae-ccaa-2024-"+region.id+"-"+flow.code,
        tipo:"regional",titulo:flow.name,anio:2024,
        periodo:"2024 · IGAE COFOG regional",
        importe_eur:millionToEuro(flow.value_mill_eur),
        importe_mill_eur:number(flow.value_mill_eur),
        importe_tipo:"Gasto de la administración regional, no presupuesto estatal",
        organismo:region.name,entidad:region.name,
        pais:"España",sector:"COFOG regional "+flow.code,
        codigo_funcion:flow.code, codigo_region:String(region.id),
        fuente_url:region.source_url,
        descripcion:"Función COFOG "+flow.code+" en "+region.name+" · 2024.",
        naturaleza_importe:"Gasto COFOG de la administración autonómica. No incluye todo el gasto público territorial.",
        trazabilidad:"S.1312 → "+region.name+" → función "+flow.code+
          ". Grupos y clases inferiores sin importe autonómico desglosado.",
        admin_hierarchy:{
          href:regionalRoute(region.id,flow.code),
          steps:[
            {code:"S.1312",title:"Administraciones regionales"},
            {code:String(region.id),title:region.name},
            {code:flow.code,title:flow.name}
          ],
          caution:"Función regional publicada por IGAE (2024). No es el gasto de todas las administraciones en ese territorio; no distribuir entre grupos sin desglose publicado."
        }
      });
    }
  }
  // A budget programme in two distinct sections is two distinct official
  // observations, even if its programme code or wording is identical.
  const ids=new Set();
  for(const item of out){
    if(ids.has(item.id))throw Error("Registro oficial duplicado: "+item.id);
    ids.add(item.id);
  }
  return out;
}
