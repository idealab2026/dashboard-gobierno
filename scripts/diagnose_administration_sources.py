"""Diagnostic of official 2026 State budget CSV and IGAE 2024 regional XLSX.
Never expose private information; these are public government publications.
"""
from __future__ import annotations
from urllib.request import Request, urlopen
import csv
import io
import zipfile
import xml.etree.ElementTree as ET

SOURCES = [
    ("MINISTRY", "https://www.sepg.pap.hacienda.gob.es/Presup/PGE2025Prorroga/MaestroDocumentos/PGE-ROM/doc/CSV/N_25P_E_R_31_117_1_1_2_1_1.CSV"),
    ("CCAA", "https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadNacional/Publicaciones/Documents/CCAA-A/COFOG_A_Detalle_CCAA_2024.xlsx")
]
for label, url in SOURCES:
    try:
        req = Request(url, headers={"User-Agent":"IDEA-LAB-Observatorio/1.0 (public research)"})
        with urlopen(req, timeout=23) as resp:
            data = resp.read(8_000_000)
            print(label,"status",resp.status,"bytes",len(data),"content-type",resp.headers.get("Content-Type"))
        if label=="MINISTRY":
            for enc in ("utf-8-sig","cp1252","latin-1"):
                try: body=data.decode(enc);break
                except UnicodeDecodeError:pass
            print("MINISTRY csv preview",repr(body[:1400]))
            for delim in [";","\t",","]:
                rows=list(csv.reader(io.StringIO(body), delimiter=delim))
                print("delimiter",repr(delim),"first_rows",[(len(r),r[:8]) for r in rows[:8]])
        else:
            with zipfile.ZipFile(io.BytesIO(data)) as z:
                files=z.namelist()
                print("CCAA sheets",[(name,z.getinfo(name).file_size) for name in files if name.startswith("xl/worksheets/sheet")][:15])
                print("CCAA workbook XML",z.read("xl/workbook.xml")[:1900].decode("utf-8","replace"))
                if "xl/sharedStrings.xml" in files:
                    ns={"s":"http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
                    tree=ET.fromstring(z.read("xl/sharedStrings.xml"))
                    texts=["".join(n.itertext()) for n in tree.findall("s:si",ns)]
                    print("CCAA shared strings",len(texts),texts[:70])
                for name in [v for v in files if v.startswith("xl/worksheets/sheet")][:2]:
                    tree=ET.fromstring(z.read(name))
                    ns={"s":"http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
                    cells=[]
                    for row in tree.findall(".//s:sheetData/s:row",ns)[:18]:
                        vals=[]
                        for cell in list(row)[:18]:
                            v=cell.find("s:v",ns)
                            vals.append((cell.attrib.get("r"),cell.attrib.get("t"),v.text if v is not None else ""))
                        cells.append(vals)
                    print("CCAA sheet preview",name,cells[:18])
    except Exception as exc:
        print(label,"UNAVAILABLE",type(exc).__name__,str(exc)[:350])
