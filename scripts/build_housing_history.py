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

def clean(s):
    return " ".join((s or "").replace("\u00a0"," ").split()).strip()
def parse_value(s):
    s=clean(s)
    if not s or s.lower() in ("null","..","-","nan"):return None
    # EU value format from MIVAU CSV: 2355.0, 2355,0 or 2.355,0
    if "," in s:s=s.replace(".","").replace(",",".")
    v=float(s)
    return v if 100<v<20000 else None

def extract(body):
    text=body.decode("utf-8-sig")
    rd=csv.DictReader(io.StringIO(text),delimiter=";")
    required={"Año","Trimestre","Valor","Régimen","CPRO","Provincia","Comunidad_Autónoma","CODAUTO"}
    if not required.issubset(set(rd.fieldnames or [])):
        raise ValueError("MIVAU schema changed: "+str(rd.fieldnames))
    filtered=[]
    sample=[]
    seen=set()
    for row in rd:
        year=int(row["Año"])
        quarter=int(row["Trimestre"])
        if not 1995<=year<=2026 or quarter not in (1,2,3,4):continue
        if clean(row["Régimen"]).lower()!="libre":continue
        v=parse_value(row["Valor"])
        if v is None:continue
        prov=clean(row["Provincia"])
        community=clean(row["Comunidad_Autónoma"])
        code=clean(row["CODAUTO"])
        cpro=clean(row["CPRO"])
        if year==2026 and quarter==2 and len(sample)<60:
            sample.append({"cpro":cpro,"province":prov,
                  "region":community,"code":code,"value":v})
        # Source includes provincial figures, which MUST NOT be averaged to
        # synthesize an autonomous community estimate.
        if cpro not in ("","null","None","NA","-"):continue
        territory=community
        # Provincial aggregate lacking CPRO is only a territorial total when
        # explicitly labelled as the same community or "Total".
        norm=lambda s:unicodedata.normalize("NFKD",s).encode("ascii","ignore").decode().lower().strip()
        if norm(prov) not in ("","total","total nacional","nacional",norm(community)):
            continue
        if not territory:continue
        if territory.lower() in ("total nacional","total","nacional"):territory="España"
        if norm(territory) in ("comunidad de madrid","madrid"):territory="Madrid"
        key=(territory,year,quarter)
        if key in seen:raise ValueError("Duplicated regional aggregate "+str(key))
        seen.add(key)
        filtered.append({"territory":territory,"year":year,"quarter":quarter,"value":v})
    print("HOUSING_AGGREGATE_DIAG",json.dumps(sample[:40],ensure_ascii=False))
    print("HOUSING_PARSED_COUNTS",len(filtered),
          sorted(set(d["territory"] for d in filtered)))
    return filtered

def main():
    report=dict(BASE)
    try:
        req=urllib.request.Request(URL,headers={"User-Agent":"IDEALAB-Observatory/1.0 (official open data)"})
        with urllib.request.urlopen(req,timeout=30) as f:
            body=f.read(28_000_001)
        if len(body)>28_000_000:raise ValueError("CSV too large")
        rows=extract(body)
        latest={(x["territory"],x["year"],x["quarter"]):x["value"] for x in rows}
        # Validate publication against the nationally verified benchmarks.
        if len(set(x["territory"] for x in rows))<18 or len(rows)<1500:
            raise ValueError("Incomplete MIVAU regional aggregate extraction")
        for k,v in [(("España",2026,2),2355.0),(("Madrid",2026,2),4089.6)]:
            if abs(latest.get(k,-100)-v)>1:
                raise ValueError("MIVAU benchmark mismatch "+str(k)+": "+str(latest.get(k)))
        report.update(status="verified",records=sorted(rows,
            key=lambda x:(x["territory"],x["year"],x["quarter"])),
            note="Datos oficiales MIVAU: solo registros agregados nacional y CCAA, régimen libre. Sin promediar provincias.")
        print("HOUSING_OFFICIAL_VERIFIED",len(rows),len(set(x["territory"] for x in rows)))
    except Exception as exc:
        print("::warning::HOUSING_SOURCE_UNAVAILABLE",type(exc).__name__,str(exc)[:170])
        report["note"]="CSV oficial inaccesible o esquema no validado: se conserva serie parcial publicada con fuente."
    OUT.write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf8")
    print("HOUSING_RECORDS",len(report["records"]),report["status"])
if __name__=="__main__":main()
