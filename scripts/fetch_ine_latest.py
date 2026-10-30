#!/usr/bin/env python3
"""Fetch a clearly labeled raw sample of official annual INE observations.

This is an independent public preview, NOT a replacement for Idea Lab's
geographic or methodological mappings and NOT a canonical data update.
"""
import datetime
import json
import urllib.request
from pathlib import Path
URL="https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/56934?nult=1"
OUT=Path("app/data/ine-latest.json")
payload={"source":"Instituto Nacional de Estadística (INE)","source_url":URL,
         "checked_at_utc":datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds"),
         "scope":"Ejemplos de registros literales de la tabla oficial, sin asignar indicadores del dashboard",
         "records":[]}
try:
    req=urllib.request.Request(URL,headers={"User-Agent":"IdeaLabOfficialData/1.0"})
    with urllib.request.urlopen(req,timeout=20) as r:
        raw=r.read(3_000_001)
    if len(raw)>3_000_000:raise ValueError("Respuesta excesivamente grande")
    rows=json.loads(raw)
    if not isinstance(rows,list):raise ValueError("La API INE no devolvió un listado de series")
    for serie in rows:
        if not isinstance(serie,dict):continue
        title=str(serie.get("Nombre","")).strip()
        if not title or not any(x in title.casefold() for x in ("nacional","españa")):continue
        data=serie.get("Data",[])
        if not isinstance(data,list):continue
        entries=[v for v in data if isinstance(v,dict) and v.get("Valor") is not None and v.get("Anyo") is not None]
        if not entries:continue
        entries.sort(key=lambda v:int(v.get("Fecha") or v.get("Anyo") or 0),reverse=True)
        obs=entries[0]
        payload["records"].append({"serie_original":title,"anyo":str(obs.get("Anyo")),"valor_fuente":obs.get("Valor"),"fecha_ine":obs.get("Fecha"),"source_url":URL})
        if len(payload["records"])>=12:break
    payload["status"]="ok"
except (OSError,ValueError,TimeoutError,json.JSONDecodeError) as e:
    payload["status"]="unavailable"
    payload["error"]=type(e).__name__
OUT.parent.mkdir(parents=True,exist_ok=True)
OUT.write_text(json.dumps(payload,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
print("Lecturas literales INE:",len(payload["records"]),"estado:",payload["status"])
