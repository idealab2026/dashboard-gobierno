/* COFOG spending lineage: official hierarchy and observed amounts only.
   A subject match is NOT evidence of financing or a fiscal transfer. */
import {COFOG_STRUCTURE,cofogsBelow,cofogsFind} from "./cofog-structure.js";
import {OFFICIAL_BUDGET_PROGRAMS} from "./official-budget-catalog.js";

const CODE=/^\d{2}(?:\.\d+){0,2}$/;
const isCode=code=>CODE.test(String(code||""));
const sourceCode=item=>String(item?.cofog_codigo||"");
const officialTitle=(code,observed)=>{
  if(code==="S13.GASTO")return "Gasto consolidado de las Administraciones Públicas";
  return observed.get(code)?.titulo || cofogsFind(code)?.title || "";
};
export function sankeyDeepLink(code){
  return isCode(code)?"./?detalle-cofog="+encodeURIComponent(code)+"#mapa-dinero":null;
}
export function spendingLineage(item,aggregateRows=[]){
  if(!item || item.tipo!=="agregado" || !isCode(sourceCode(item)))return null;
  const code=sourceCode(item);
  const observed=new Map(aggregateRows.filter(x=>
    x.tipo==="agregado"&&isCode(x.cofog_codigo)&&
    Number(x.anio)===Number(item.anio)
  ).map(x=>[String(x.cofog_codigo),x]));
  observed.set(code,item);
  const path=["S13.GASTO"];
  const parts=code.split(".");
  for(let i=1;i<=parts.length;i++){
    const c=parts.slice(0,i).join(".");
    path.push(c);
  }
  const steps=path.map((c,i)=>{
    const value=c==="S13.GASTO"?null:observed.get(c)?.importe_eur;
    const hasValue=Number.isFinite(Number(value))&&value!=null;
    return {
      code:c,
      title:officialTitle(c,observed)||String(c),
      amount_mill_eur:hasValue?Number(value):null,
      quantification:hasValue?"IGAE 2024 · gasto COFOG":"sin cuantía en esta serie",
      href:sankeyDeepLink(c)
    };
  });
  const descendants=cofogsBelow(code).map(row=>{
    const record=observed.get(row.code);
    const valid=record?.importe_eur!=null&&Number.isFinite(Number(record.importe_eur));
    return {code:row.code,title:record?.titulo||row.title,
      amount_mill_eur:valid?Number(record.importe_eur):null,
      href:sankeyDeepLink(row.code)};
  });
  return {
    code,
    year:Number(item.anio),
    steps,
    descendants,
    href:sankeyDeepLink(code),
    measured:item.importe_eur!=null&&Number.isFinite(Number(item.importe_eur)),
    caution:"Los importes superiores incluyen los inferiores: no se suman. Las clases sin importe desglosado son categorías oficiales de la ONU, no partidas ejecutadas ni contratos individuales."
  };
}
export function relatedProgramLineage(item,aggregateRows=[]){
  if(item?.tipo!=="programa"||!isCode(item.cofog_referencia))return null;
  // A PGE program is not an accounting child of an IGAE aggregate.
  // Se utiliza la correspondencia temática documentada más específica,
  // nunca se deduce una asignación contable a partir del título.
  const verifiedProgram=OFFICIAL_BUDGET_PROGRAMS.find(x=>
    x.codigo_presupuestario===item.codigo_presupuestario &&
    Number(x.anio)===Number(item.anio));
  const reference=verifiedProgram?.cofog_referencia||item.cofog_referencia;
  const relation=spendingLineage({
    tipo:"agregado",cofog_codigo:reference,
    anio:item.anio,importe_eur:null
  },aggregateRows);
  if(!relation)return null;
  return {
    ...relation,
    relation:"temática, no contable",
    href:verifiedProgram&&relation.href
      ?relation.href.replace("#mapa-dinero",
        "&programa-pge="+encodeURIComponent(verifiedProgram.codigo_presupuestario)+
        "#mapa-dinero")
      :relation.href,
    caution:"Correspondencia temática con COFOG. El crédito del programa de los PGE no constituye una porción comprobada de los importes consolidados de la IGAE. Los ejercicios y perímetros pueden ser distintos."
  };
}
