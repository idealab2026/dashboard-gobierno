#!/usr/bin/env python3
"""Weekly free official-source availability audit.

Observation values are never changed by this process: an official table can
contain many non-comparable series. Automated numerical updates require a
verified 1:1 series mapping and synchronization to Idea Lab's canonical Drive.
"""
import datetime
import hashlib
import json
import os
import urllib.error
import urllib.request
from pathlib import Path

OUT=Path("app/data/official-checks.json")
UTC=datetime.timezone.utc
sources=[
    {"id":"INE_56934","name":"INE · Indicadores de población","url":"https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/56934?nult=1"},
    {"id":"INE_IPVA_59057","name":"INE · Índice de precios de vivienda en alquiler","url":"https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/59057?nult=1"},
    {"id":"IGAE_CUENTAS","name":"IGAE · Contabilidad nacional de las AAPP","url":"https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadNacional/Publicaciones/paginas/datosadminestado.aspx"},
]
result={"checked_at_utc":datetime.datetime.now(UTC).isoformat(timespec="seconds"),
        "data_updated":False,
        "mode":"official_source_availability_check_only",
        "disclaimer":"Comprobar un enlace oficial no equivale a actualizar ni validar los valores de una serie.",
        "sources":[]}
for source in sources:
    item={k:source[k] for k in ("id","name","url")}
    try:
        req=urllib.request.Request(source["url"],headers={"User-Agent":"IdeaLabResearchMonitor/1.0 (+https://idealab2026.github.io/dashboard-gobierno/)"})
        with urllib.request.urlopen(req,timeout=20) as response:
            data=response.read(2_000_000+1)
            if len(data)>2_000_000: raise ValueError("Fuente demasiado grande para monitor limitado")
            if not data:raise ValueError("Respuesta vacía")
            item.update(status="reachable",http_status=response.status,sha256=hashlib.sha256(data).hexdigest(),bytes=len(data))
    except (urllib.error.URLError,TimeoutError,ValueError,OSError) as error:
        item.update(status="unavailable",error=type(error).__name__)
    result["sources"].append(item)
OUT.parent.mkdir(parents=True,exist_ok=True)
OUT.write_text(json.dumps(result,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
print("Auditoría de enlaces oficiales completada:",[(x["id"],x["status"]) for x in result["sources"]])
print("NOTA: no se sustituyen datos históricos sin mapeo científico verificable.")
