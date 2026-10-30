#!/usr/bin/env python3
"""Public-only integrity and disclosure audit for Idea Lab V2."""
import csv
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT/"app"/"data"/"seed"
def load(name,delim):
    with (DATA/name).open(encoding="utf-8-sig",newline="") as f:
        return list(csv.DictReader(f,delimiter=delim))
obs=load("observations.csv",",")
fact=load("fact_finanzas_publicas_2024.csv",";")
sources=load("dim_fuentes_finanzas_publicas.csv",";")
tax=load("figuras_ingresos_2024.csv",";")
errors=[]
if len(obs)<300: errors.append("Historico de indicadores insuficiente")
if len(fact)<95: errors.append("Historico de finanzas publicas insuficiente")
if len(sources)<5: errors.append("Faltan fuentes")
for r in obs:
    if r["indicator_id"] in ("indice_precio_alquiler","variacion_precio_alquiler"):
        errors.append("Filas de alquiler sin dimension territorial");break
    if not r.get("source_url","").startswith("http"):
        errors.append("Fuente sin URL: "+r["indicator_id"]);break
    if r["indicator_id"]=="pib_nominal_eur" and r["unit"]!="euros":
        errors.append("PIB nominal requiere unidad euros");break
uniq=Counter((r["year"],r["indicator_id"],r["geo_name"]) for r in obs)
for k,v in uniq.items():
    vals={r["value"] for r in obs if (r["year"],r["indicator_id"],r["geo_name"])==k}
    if len(vals)>1:errors.append("Indicador ambiguo: "+str(k))
codes={r["codigo"]:r for r in fact}
def amount(code):
    return float(codes[code]["valor"])
try:
    if abs(amount("S13.GASTO")-amount("S13.RECURSOS")-amount("S13.DEFICIT"))>0.51:
        errors.append("Incoherencia de cierre contable")
except (KeyError,ValueError) as e:errors.append("Totales de finanzas publicas ausentes: "+str(e))
ids={r["source_id"] for r in sources}
unknown={r["source_id"] for r in fact if r.get("source_id") and r["source_id"] not in ids}
if unknown:errors.append("Fuentes sin definir: "+str(unknown))
for p in (ROOT/"app").rglob("*"):
    if not p.is_file() or p.suffix not in (".md",".js",".py",".csv"):continue
    data=p.read_text(encoding="utf-8-sig")
    for marker in ("mam"+"g97","ate"+"nea","mayor"+"domo","litos"+"artesania","idealab.research2026@gmail.com","docs.google.com/spreadsheets/d/","1WQJdVDAdrUoWt1CK6A2zjWyHgZutQ4BA"):
        if marker.lower() in data.lower():
            errors.append("Referencia no publicable: "+p.name)
# Regla adicional: los nuevos indicadores y su desagregación mensual
# deben coincidir con el boletín oficial y no mezclarse con COFOG anual.
pension_ids={
 "pensiones_ss_numero","pensionistas_ss_aproximado",
 "pension_media_sistema_mes","pension_media_jubilacion_mes",
 "nomina_pensiones_ss_mes_mill","edad_media_acceso_jubilacion",
 "poblacion_mayor_64_porcentaje","dependencia_mayores_65",
 "afiliados_ss_desestacionalizados"
}
by_id={r["indicator_id"]:r for r in obs if r["indicator_id"] in pension_ids}
if set(by_id)!=pension_ids:
    errors.append("Missing official pension or demographic source indicators")
else:
    if by_id["pensionistas_ss_aproximado"]["status"]!="aproximado":
        errors.append("Approximate count of pensioners must be explicitly labeled")
    if by_id["pension_media_sistema_mes"]["reference_period"]!="2026-10":
        errors.append("Pension monthly reference date missing")
    if by_id["dependencia_mayores_65"]["unit"]!="%":
        errors.append("Age dependency has wrong units")
    if by_id["afiliados_ss_desestacionalizados"]["reference_period"]!="2026-10-15":
        errors.append("Affiliation snapshot has wrong reference period")

with (DATA.parent/"pensions-payroll.csv").open(encoding="utf-8-sig",newline="") as f:
    pension_monthly=list(csv.DictReader(f))
if len(pension_monthly)!=5 or len({r["pension_type"] for r in pension_monthly})!=5:
    errors.append("Invalid pension monthly benefit breakdown")
else:
    total=sum(float(r["monthly_million_eur"]) for r in pension_monthly)
    reference=float(by_id.get("nomina_pensiones_ss_mes_mill",{}).get("value",0))
    if abs(total-reference)>.2:
        errors.append("Pension monthly components fail 0.2M EUR reconciliation")
    if any(r["period"]!="2026-10" or
           not r["source_url"].startswith("https://www.inclusion.gob.es/")
           for r in pension_monthly):
        errors.append("Pension benefits differ in source or reporting month")

if errors:
    print("\n".join("ERROR: "+e for e in errors[:25]),file=sys.stderr)
    raise SystemExit(1)
print("OK: public research snapshots; indicators:",len(obs),"fiscal entries:",len(fact),"tax-figures:",len(tax))
print("NOTE: validacion interna != actualidad ni exactitud de todas las fuentes")
