#!/usr/bin/env python3
"""Official INE ECP320 → validated in-memory public snapshot.

Never guesses the identity of a geographic, sex or age series. The input
is pinned to the exact official series code AND title. Existing historical
values are immutable: revisions force quarantine, not silent overwrites.

Runs from public GitHub Actions, requires no tokens, cloud billing, or Drive
access. It modifies only workspace files used to compile the static site;
the separate private canonical Google Drive is NOT changed by this job.
"""
import csv
import datetime as dt
import hashlib
import io
import json
import math
import os
import urllib.error
import urllib.request
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
INPUT=ROOT/"app"/"data"/"seed"/"observations.csv"
STATUS=ROOT/"app"/"data"/"official-sync-status.json"
CODE="ECP320"
TITLE="Total Nacional. Todas las edades. Total. Población. Número."
SERIES_URL="https://servicios.ine.es/wstempus/js/ES/DATOS_SERIE/ECP320?nult=8"
TABLE_URL="https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/56934?nult=2"
REFERENCE_URL="https://ine.es/jaxiT3/Tabla.htm?t=56934"
UTC=dt.timezone.utc

class OfficialDataError(Exception):
    pass

def parse_series(payload):
    if isinstance(payload,list):
        if len(payload)!=1: raise OfficialDataError("Expected exactly one official series")
        payload=payload[0]
    if not isinstance(payload,dict):raise OfficialDataError("Invalid official JSON envelope")
    name=str(payload.get("Nombre","")).strip()
    if name!=TITLE:
        raise OfficialDataError("Official source identity/title has changed")
    code=str(payload.get("COD",CODE))
    if code!=CODE:
        raise OfficialDataError("Official source ID mismatch")
    data=payload.get("Data")
    if not isinstance(data,list): raise OfficialDataError("Official source missing data array")
    years={}
    for point in data:
        if not isinstance(point,dict):continue
        year=point.get("Anyo"); value=point.get("Valor")
        if value is None or year is None:continue
        try: y=int(year);n=float(value)
        except (TypeError,ValueError):raise OfficialDataError("Invalid official year/value")
        if y<1971 or y>dt.datetime.now(UTC).year+1 or not math.isfinite(n):
            raise OfficialDataError("Out-of-range official observation")
        if n<=20_000_000 or n>=80_000_000 or not n.is_integer():
            raise OfficialDataError("Population magnitude or units invalid")
        if y in years and years[y]!=int(n):
            raise OfficialDataError("Several inconsistent official values for one year")
        years[y]=int(n)
    if len(years)<2:raise OfficialDataError("Official series has insufficient history")
    return years

def read_csv():
    with INPUT.open(encoding="utf-8-sig",newline="") as fd:
        rd=csv.DictReader(fd)
        return rd.fieldnames,list(rd)

def apply_official(years,fields,rows):
    pop={int(r["year"]):r for r in rows if r.get("indicator_id")=="poblacion_residente" and r.get("geo_name")=="España"}
    if len(pop)<2:raise OfficialDataError("Missing historical national population observations")
    if not all(r.get("unit")=="personas" and r.get("period_type")=="1 de enero" for r in pop.values()):
        raise OfficialDataError("Canonical units or period definition changed")
    latest=max(pop)
    if latest<2025 or latest not in years:
        raise OfficialDataError("Historical reference year absent in official source")
    # Check every overlapping archived year, not merely the most recent one.
    for year,value in years.items():
        if year in pop and int(float(pop[year]["value"]))!=value:
            raise OfficialDataError(f"Historical source revision detected for {year}: snapshot={pop[year]['value']}; official={value} (manual review required)")
    newer=sorted(y for y in years if y>latest)
    if newer and newer!=list(range(latest+1,max(newer)+1)):
        raise OfficialDataError("Gap in official annual reporting")
    if len(newer)>3:raise OfficialDataError("Unexpected jump in publication period")
    today=dt.datetime.now(UTC).date().isoformat()
    added=[]
    for year in newer:
        population=years[year]
        previous=years.get(year-1)
        if previous is None or previous<=0:raise OfficialDataError("Missing previous period for growth")
        if abs(population/previous-1)>.08:
            raise OfficialDataError("Implausible population jump >8%; block until reviewed")
        def row(indicator,name,value,unit,status):
            base=dict(pop[latest])
            base.update(year=str(year),indicator_id=indicator,indicator_name=name,
                       value=str(value),unit=unit,reference_period=str(year),
                       source="INE · ECP320 (serie nacional fijada)",
                       source_url=REFERENCE_URL,source_revision_date=today,status=status,
                       notes="Actualización automática desde INE ECP320 validada frente al histórico previo.")
            return {k:base.get(k,"") for k in fields}
        rows.append(row("poblacion_residente","Población residente",population,"personas","oficial"))
        rows.append(row("crecimiento_poblacion","Crecimiento población",
                        f"{(population/previous-1)*100:.2f}","%","calculado"))
        added.append({"year":year,"population":population,"growth_pct":round((population/previous-1)*100,2)})
    return rows,added

def retrieve():
    errors=[]
    for url in (SERIES_URL,TABLE_URL):
        try:
            req=urllib.request.Request(url,headers={"User-Agent":"IdeaLabScientificData/1.0"})
            with urllib.request.urlopen(req,timeout=22) as response:
                if response.status!=200:raise OfficialDataError("Non-200 official HTTP response")
                raw=response.read(5_000_001)
            if len(raw)>5_000_000:raise OfficialDataError("Oversized official response")
            payload=json.loads(raw.decode("utf-8-sig"))
            if url==TABLE_URL:
                if not isinstance(payload,list):raise OfficialDataError("Missing source table series list")
                matching=[p for p in payload if isinstance(p,dict) and str(p.get("COD",""))==CODE]
                if len(matching)!=1:raise OfficialDataError("Official table series not unique")
                payload=matching[0]
            return parse_series(payload),hashlib.sha256(raw).hexdigest(),url
        except (OSError,TimeoutError,ValueError,UnicodeError,json.JSONDecodeError,OfficialDataError) as e:
            errors.append(f"{url.split('/')[-1]}:{type(e).__name__}:{str(e)[:160]}")
    raise OfficialDataError("Official INE endpoints unavailable or incompatible: "+", ".join(errors))

def synchronize(fetch=retrieve):
    timestamp=dt.datetime.now(UTC).isoformat(timespec="seconds")
    report={"checked_at_utc":timestamp,"source":"INE","series_code":CODE,
            "series_title":TITLE,"source_url":SERIES_URL,"status":"unavailable",
            "published_new_rows":0,"historical_data_rewritten":False,
            "canonical_drive_modified":False,
            "scope":"Unicamente población residente nacional y crecimiento interanual calculado"}
    try:
        years,digest,url=fetch()
        fields,rows=read_csv()
        updated,added=apply_official(years,fields,rows)
        report.update(status="updated" if added else "unchanged",
                      source_url=url,official_sha256=digest,
                      last_official_year=max(years),
                      last_official_value=years[max(years)],new_periods=added,
                      published_new_rows=len(added)*2)
        if added:
            buffer=io.StringIO(newline="")
            w=csv.DictWriter(buffer,fieldnames=fields,lineterminator="\n")
            w.writeheader();w.writerows(updated)
            # Output is first checked in the build validator; no repo commits.
            INPUT.write_text(buffer.getvalue(),encoding="utf-8")
    except (OfficialDataError,ValueError,OSError,KeyError) as e:
        report.update(status="blocked",reason=str(e)[:180])
        print("::warning::INE ECP320 sync blocked: "+str(e))
    STATUS.parent.mkdir(parents=True,exist_ok=True)
    STATUS.write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print("INE_ECP320_STATUS",report["status"],"latest",report.get("last_official_year"),"new rows",report["published_new_rows"])
    return report

if __name__=="__main__":
    synchronize()
