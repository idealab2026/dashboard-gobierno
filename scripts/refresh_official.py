#!/usr/bin/env python3
"""Weekly bounded inventory of official source links for all published datasets.

A successful HTTP check is not a scientific validation of the values in the
document. Never rewrite statistical figures based on this inventory.
"""
import concurrent.futures
import csv
import datetime as dt
import json
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

UTC=dt.timezone.utc
ROOT=Path(__file__).resolve().parents[1]
SEED=ROOT/"app"/"data"/"seed"
OUT=ROOT/"app"/"data"/"official-checks.json"
WHITELIST={
    "ine.es","www.ine.es","servicios.ine.es",
    "www.igae.pap.hacienda.gob.es","igae.pap.hacienda.gob.es",
    "www.bde.es","bde.es","www.boe.es","boe.es",
    "www.sanidad.gob.es","sanidad.gob.es","www.mites.gob.es",
    "www.imf.org","imf.org",
}
ADDITIONAL=[
 {"name":"INE · Datos población ECP320","url":"https://servicios.ine.es/wstempus/js/ES/DATOS_SERIE/ECP320?nult=1"},
 {"name":"INE · Desglose alquiler IPVA","url":"https://servicios.ine.es/wstempus/js/ES/DATOS_TABLA/59057?nult=1"},
 {"name":"IGAE · Gasto por funciones COFOG (S.13)","url":"https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadNacional/Publicaciones/Paginas/iacogofseries.aspx"},
 {"name":"IGAE · Operaciones no financieras AAPP","url":"https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadNacional/Publicaciones/Paginas/ianofinancierasTotal.aspx"},
]

def valid_url(raw):
    raw=str(raw).strip()
    p=urllib.parse.urlparse(raw)
    return p.scheme=="https" and p.hostname in WHITELIST and not p.username and not p.password

def catalog():
    sources={}
    def add(url,name):
        url=url.split("|")[0].strip()
        if not valid_url(url):return
        if url not in sources:sources[url]={"name":name,"url":url}
    with (SEED/"observations.csv").open(encoding="utf-8-sig",newline="") as stream:
        for row in csv.DictReader(stream):
            add(row.get("source_url",""),row.get("source","INE · Serie publicada"))
    with (SEED/"dim_fuentes_finanzas_publicas.csv").open(encoding="utf-8-sig",newline="") as stream:
        for row in csv.DictReader(stream,delimiter=";"):
            for key,value in row.items():
                if isinstance(value,str) and value.startswith("https://"):
                    add(value,row.get("nombre_fuente","IGAE · Documento estadístico"))
    for src in ADDITIONAL:add(src["url"],src["name"])
    return sorted(sources.values(),key=lambda s:s["url"])

def probe(source):
    info=dict(source)
    # No external auth/cookies, no link scraping and bounded requests.
    url=source["url"]
    if not valid_url(url):
        return {**info,"status":"blocked","reason":"Unapproved source hostname"}
    for method in ("HEAD","GET"):
        try:
            headers={"User-Agent":"IdeaLabPublicSourceAudit/1.0"}
            if method=="GET":headers["Range"]="bytes=0-2047"
            req=urllib.request.Request(url,method=method,headers=headers)
            with urllib.request.urlopen(req,timeout=9) as response:
                status=int(response.status)
                if method=="GET":response.read(256)
                if 200<=status<400:
                    return {**info,"status":"reachable","http_status":status,
                            "etag":response.headers.get("ETag"),
                            "last_modified":response.headers.get("Last-Modified")}
        except (OSError,urllib.error.HTTPError,TimeoutError,ValueError):
            continue
    return {**info,"status":"unavailable"}

def main():
    sources=catalog()
    results=[]
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        results=list(pool.map(probe,sources))
    successes=sum(x["status"]=="reachable" for x in results)
    report={"checked_at_utc":dt.datetime.now(UTC).isoformat(timespec="seconds"),
            "mode":"official_publisher_url_audit",
            "data_updated":False,
            "disclaimer":"Disponibilidad del enlace no equivale a actualidad de una serie.",
            "sources_checked":len(results),"sources_reachable":successes,"sources":results}
    OUT.parent.mkdir(parents=True,exist_ok=True)
    OUT.write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print("IDEALAB_SOURCE_AUDIT",successes,"/",len(results),"official links reachable")
    if successes<len(results):
        print("::warning::Source registry has "+str(len(results)-successes)+" links requiring review. No figures were replaced.")

if __name__=="__main__":main()
