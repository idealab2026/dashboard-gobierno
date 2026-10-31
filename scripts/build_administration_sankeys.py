#!/usr/bin/env python3
"""Download and reconcile all ministries and the 17 CCAA from official sources.

No estimated allocations. Ministerial PGE 2025-P (published as prorogued 2026)
and IGAE regional COFOG 2024 represent different accounting systems.
External links must remain authoritative; fail-closed on data mismatch.
"""
from __future__ import annotations
import csv
import io
import json
from pathlib import Path
import re
import sys
from urllib.request import Request, urlopen
import xml.etree.ElementTree as ET
import zipfile

ROOT=Path(__file__).resolve().parents[1]
OUTPUT=ROOT/"app/data/admin-sankeys.json"
PGE="https://www.sepg.pap.hacienda.gob.es/Presup/PGE2025Prorroga/MaestroDocumentos/PGE-ROM"
CCAA_URL="https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadNacional/Publicaciones/Documents/CCAA-A/COFOG_A_Detalle_CCAA_2024.xlsx"
MINISTRY_NAMES={
 12:"Asuntos Exteriores, Unión Europea y Cooperación",
 13:"Presidencia, Justicia y Relaciones con las Cortes",
 14:"Defensa",15:"Hacienda",16:"Interior",
 17:"Transportes y Movilidad Sostenible",
 18:"Educación, Formación Profesional y Deportes",
 19:"Trabajo y Economía Social",20:"Industria y Turismo",
 21:"Agricultura, Pesca y Alimentación",
 22:"Política Territorial y Memoria Democrática",
 23:"Transición Ecológica y Reto Demográfico",24:"Cultura",
 25:"Vivienda y Agenda Urbana",26:"Sanidad",27:"Economía, Comercio y Empresa",
 28:"Ciencia, Innovación y Universidades",
 29:"Derechos Sociales, Consumo y Agenda 2030",30:"Igualdad",
 31:"Juventud e Infancia",32:"Inclusión, Seguridad Social y Migraciones",
 33:"Transformación Digital y Función Pública"
}
REGION_NAMES=[
 "Andalucía","Aragón","Principado de Asturias","Illes Balears",
 "Canarias","Cantabria","Castilla-La Mancha","Castilla y León",
 "Cataluña","Extremadura","Galicia","Comunidad de Madrid",
 "Región de Murcia","Comunidad Foral de Navarra","La Rioja",
 "Comunitat Valenciana","País Vasco"
]
FUNCTION_NAMES=[
 "Servicios públicos generales","Defensa","Orden público y seguridad",
 "Asuntos económicos","Protección del medio ambiente",
 "Vivienda y servicios comunitarios","Salud","Ocio, cultura y religión",
 "Educación","Protección social"
]
NS={"s":"http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
def fetch(url):
    if not (url.startswith(PGE+"/") or url==CCAA_URL):
        raise ValueError("Origen no autorizado")
    req=Request(url,headers={"User-Agent":"Observatorio-Espana-en-Datos/1.0"})
    with urlopen(req,timeout=25) as response:
        return response.read(10_000_000)

def number(s):
    raw=str(s or "").strip().replace(".","").replace(",",".")
    return float(raw) if raw else 0.0

def ministry_url(code):
    return f"{PGE}/doc/CSV/N_25P_E_R_31_1{code:02d}_1_1_2_1_1.CSV"

def parse_ministry(code,name):
    url=ministry_url(code)
    binary=fetch(url)
    decoded=None
    for encoding in ("utf-8-sig","cp1252","latin1"):
        try:decoded=binary.decode(encoding);break
        except UnicodeDecodeError:pass
    rows=list(csv.reader(io.StringIO(decoded),delimiter=";"))
    report=" ".join(" ".join(row) for row in rows[:10])
    if f"Sección: {code} " not in report:
        raise ValueError(f"Sección {code}: cabecera incorrecta")
    # La fuente informa en miles de euros: dividimos entre 1000 para M€.
    if "2025-P" not in report or "Miles de euros" not in report:
        raise ValueError(f"Sección {code}: vintage/unidad incorrectos")
    programs=[]
    total=None
    for row in rows:
        if len(row)<3:continue
        label=row[0].strip().upper()
        descriptor=row[1].strip()
        # La tabla oficial usa de 2 a 4 subsector columns depending on
        # whether a ministry has autonomous agencies / other entities.
        # The final nonempty numeric cell is always the consolidated Total.
        numeric=[cell.strip() for cell in row[2:] if cell.strip()]
        if re.fullmatch(r"[0-9][0-9A-Z]{3}",label) and label!="000X":
            if not descriptor or not numeric:continue
            amount=number(numeric[-1])/1000
            if amount>0:
                programs.append({"code":label,"name":descriptor,"value_mill_eur":round(amount,5)})
        elif descriptor.upper()=="TOTAL CONSOLIDADO":
            total=number(numeric[-1])/1000 if numeric else None
    if total is None or total<=0 or not programs:
        raise ValueError(f"Sección {code}: total/programas ausentes")
    summed=sum(x["value_mill_eur"] for x in programs)
    if abs(summed-total)>0.06:
        raise ValueError(f"Sección {code} desbalanceada: {summed} vs {total}")
    return {
      "id":str(code),"name":name,"source_url":url,
      "amount_kind":"presupuesto prorrogado, no ejecución",
      "year_label":"2025-P · Presupuesto prorrogado para 2026",
      "total_mill_eur":round(total,5),"flows":programs,
      "verified":True,
      "note":"Estado, OO.AA. y entidades con presupuesto limitativo; total consolidado capítulos 1–8, excluidas transferencias internas."
    }

def xlsx_cells(archive, sheet_name, strings):
    root=ET.fromstring(archive.read(sheet_name))
    rows={}
    for row in root.findall(".//s:sheetData/s:row",NS):
        ix=int(row.attrib["r"])
        vals={}
        for cell in row.findall("s:c",NS):
            addr=cell.attrib.get("r","")
            col=re.match(r"[A-Z]+",addr)
            if not col:continue
            v=cell.find("s:v",NS)
            if v is None:continue
            text=v.text or ""
            if cell.attrib.get("t")=="s":text=strings[int(text)]
            vals[col.group()]=text
        rows[ix]=vals
    return rows

def parse_regions():
    binary=fetch(CCAA_URL)
    result=[]
    with zipfile.ZipFile(io.BytesIO(binary)) as archive:
        strings=[
          "".join(node.itertext())
          for node in ET.fromstring(archive.read("xl/sharedStrings.xml")).findall("s:si",NS)
        ]
        sheet_names=[
          filename for filename in archive.namelist()
          if re.fullmatch(r"xl/worksheets/sheet\d+\.xml",filename)
        ]
        sheet_names.sort(key=lambda s:int(re.search(r"sheet(\d+)",s).group(1)))
        if len(sheet_names)<19:
            raise ValueError("IGAE regional: faltan las 17 hojas autonómicas")
        # Hoja 1: índice; 2: total regional; 3-19: las 17 CCAA.
        national=xlsx_cells(archive,sheet_names[1],strings)
        national_total=float(national[9]["M"])
        for index,name in enumerate(REGION_NAMES):
            rows=xlsx_cells(archive,sheet_names[index+2],strings)
            header=str(rows.get(1,{}).get("A","")).lower()
            # Reconciliamos contra el total impreso, nunca extrapolamos una subpartida.
            total=float(rows[9]["M"])
            values=[float(rows[9][col]) for col in "CDEFGHIJKL"]
            if not (total>0 and abs(sum(values)-total)<0.1):
                raise ValueError(f"IGAE {name}: no concilia total/funciones {total} vs {sum(values)}")
            result.append({
             "id":str(index+1),"name":name,
             "source_url":CCAA_URL,
             "amount_kind":"gasto en contabilidad nacional, no presupuesto",
             "year_label":"2024 · COFOG regional IGAE",
             "total_mill_eur":round(total,5),
             "flows":[{"code":f"{j+1:02d}","name":label,"value_mill_eur":round(val,5)}
                      for j,(label,val) in enumerate(zip(FUNCTION_NAMES,values))],
             "verified":True,
             "note":"Administración regional S.1312. No incluye todo el gasto de Estado y ayuntamientos ejecutado en esta comunidad."
            })
        difference=sum(r["total_mill_eur"] for r in result)-national_total
        # The source publishes 268013 M€ for the whole S.1312 and 268131 M€
        # as the sum of its 17 territorial sheets (118 M€ gap). Preserve the
        # discrepancy as published; NEVER force territorial sums to agree.
        if abs(difference)>max(1000,0.02*national_total):
            raise ValueError("Diferencia regional excesiva: "+str(difference))
        print("IGAE REGIONAL published",national_total,"M€; sum of 17 CCAA",
              sum(r["total_mill_eur"] for r in result),"M€; gap",difference,"M€ (sin ajuste)")
        parse_regions.reconciliation={
            "national_regional_total_mill_eur":national_total,
            "sum_17_regions_mill_eur":round(sum(r["total_mill_eur"] for r in result),5),
            "difference_mill_eur":round(difference,5),
            "caveat":"Diferencia entre total regional IGAE y suma de hojas territoriales, sin ajuste. No atribuir automáticamente su origen."
        }
    return result

def cofog_group_labels():
    """Only COFOG group names from the official national classification.

    These groups have NO regional amounts in the available 2024 workbook.
    Never transfer a national amount or distribution into a CCAA.
    """
    source=ROOT/"app/data/seed/fact_finanzas_publicas_2024.csv"
    found={}
    with source.open(encoding="utf-8-sig",newline="") as handle:
        for r in csv.DictReader(handle,delimiter=";"):
            code=(r.get("codigo") or "").strip()
            if (r.get("lado")=="gasto" and r.get("clasificacion")=="COFOG"
                and re.fullmatch(r"\\d{2}\\.\\d",code)):
                parent=code.split(".")[0]
                found.setdefault(parent,[])
                if not any(x["code"]==code for x in found[parent]):
                    found[parent].append({"code":code,"name":r["indicador"]})
    for groups in found.values():
        groups.sort(key=lambda x:x["code"])
    if not all(found.get(x) for x in ("01","04","07")):
        raise ValueError("Faltan grupos COFOG oficiales de ejemplo")
    return found


def main():
    import concurrent.futures
    # Gobierno: los 22 ministerios identificados por sección en el índice oficial.
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
        jobs={pool.submit(parse_ministry,c,n):c for c,n in MINISTRY_NAMES.items()}
        ministries=[]
        for result in concurrent.futures.as_completed(jobs):
            ministries.append(result.result())
    ministries.sort(key=lambda r:int(r["id"]))
    regions=parse_regions()
    if len(ministries)!=len(MINISTRY_NAMES) or len(regions)!=17:
        raise ValueError("Cobertura incompleta")
    data={
      "schema":1,
      "ministries_source":f"{PGE}/Indice.htm",
      "regions_source":CCAA_URL,
      "ministry_count":len(ministries),"region_count":len(regions),
      "ministries":ministries,"regions":regions,
      "cofog_group_labels":cofog_group_labels(),
      "regional_reconciliation":parse_regions.reconciliation,
      "not_comparable":"El presupuesto prorrogado de ministerios (2025-P) no es gasto regional COFOG (2024); no se suman ni se comparan como si fueran el mismo perímetro.",
      "freshness":"Publicaciones disponibles al 31/10/2026. Se consulta origen oficial en cada compilación."
    }
    OUTPUT.parent.mkdir(parents=True,exist_ok=True)
    OUTPUT.write_text(json.dumps(data,ensure_ascii=False,separators=(",",":"))+"\n",encoding="utf-8")
    print(f"DATOS DE ADMINISTRACIONES VALIDADOS: {len(ministries)} ministerios, {len(regions)} CCAA, {(sum(len(x['flows']) for x in ministries))} programas; salida {OUTPUT.stat().st_size} bytes")
    print("Total gasto regional IGAE",sum(r["total_mill_eur"] for r in regions),"M€")
if __name__=="__main__":
    main()
