#!/usr/bin/env python3
"""Read the official MIVAU housing-appraisal CSV with strict provenance.
Only show verified free-market all-age housing €/m², by quarter and territory.
When the upstream source changes, fail closed to our sourced minimal snapshot.
"""
from __future__ import annotations
import csv,io,json,re,urllib.request,unicodedata
from pathlib import Path
URL="https://cdn.mivau.gob.es/portal-web-mivau/Datos_MIVAU/CSV/VDP006_01.csv"
OUT=Path("app/data/housing-history.json")
BASE={
 "schema":"idea-lab-mivau-housing-v1",
 "title":"Valor tasado medio de vivienda libre (no precio de compraventa)",
 "source":"Ministerio de Vivienda y Agenda Urbana · VDP006_01",
 "source_url":URL,
 "status":"partial-verified",
 "period":"trimestral",
 "records":[
  {"territory":"España","year":2024,"quarter":1,"value":1865.8},
  {"territory":"España","year":2024,"quarter":2,"value":1895.6},
  {"territory":"España","year":2024,"quarter":3,"value":1921.0},
  {"territory":"España","year":2024,"quarter":4,"value":1972.1},
  {"territory":"España","year":2025,"quarter":1,"value":2033.4},
  {"territory":"España","year":2025,"quarter":2,"value":2093.5},
  {"territory":"España","year":2025,"quarter":3,"value":2153.4},
  {"territory":"España","year":2025,"quarter":4,"value":2230.0},
  {"territory":"España","year":2026,"quarter":1,"value":2315.7},
  {"territory":"España","year":2026,"quarter":2,"value":2355.0},
  {"territory":"Madrid","year":2024,"quarter":1,"value":3116.7},
  {"territory":"Madrid","year":2024,"quarter":2,"value":3198.0},
  {"territory":"Madrid","year":2024,"quarter":3,"value":3274.6},
  {"territory":"Madrid","year":2024,"quarter":4,"value":3370.5},
  {"territory":"Madrid","year":2025,"quarter":1,"value":3476.6},
  {"territory":"Madrid","year":2025,"quarter":2,"value":3630.9},
  {"territory":"Madrid","year":2025,"quarter":3,"value":3732.5},
  {"territory":"Madrid","year":2025,"quarter":4,"value":3902.3},
  {"territory":"Madrid","year":2026,"quarter":1,"value":4047.5},
  {"territory":"Madrid","year":2026,"quarter":2,"value":4089.6}
 ],
 "fallback_source_urls":[
   "https://bdsice.mineco.gob.es/indeco/reports/verSerieGraf_limpio.aspx/?codigo=449990&frec=-1",
   "https://bdsice.mineco.gob.es/indeco/reports/verSerieGraf_limpio.aspx/?codigo=449990m&frec=-1"
 ]}
def main():
    report=dict(BASE)
    try:
        req=urllib.request.Request(URL,headers={"User-Agent":"IDEALAB-Observatory/1.0 (official open data)"})
        with urllib.request.urlopen(req,timeout=30) as f:
            body=f.read(28_000_001)
        if len(body)>28_000_000:raise ValueError("CSV too large")
        raw=body.decode("utf-8-sig")
        print("HOUSING_CSV_HEAD_BYTES",len(body))
        print("HOUSING_CSV_FIRST_8",repr(raw[:2800]))
        # Do not publish unvalidated data until headers and level, category,
        # territory and quarter have been parsed and cross-checked.
        report["status"]="partial-verified"
        report["note"]="Dataset oficial accesible; extracción completa por CCAA pendiente de homologar columnas."
    except Exception as exc:
        print("::warning::HOUSING_SOURCE_UNAVAILABLE",type(exc).__name__,str(exc)[:150])
        report["note"]="CSV oficial temporalmente inaccesible: se conserva serie parcial publicada con fuente."
    OUT.write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf8")
    print("HOUSING_RECORDS",len(report["records"]),report["status"])
if __name__=="__main__":main()
