#!/usr/bin/env python3
"""Inspect official IGAE COFOG 1995-present workbook without publishing guesses.
Read-only diagnostic for mapping explicit row/column/year coordinates.
"""
from urllib.request import Request,urlopen
import zipfile,io,re,xml.etree.ElementTree as E
URL="https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadNacional/Publicaciones/Documents/AAPP_A/COFOG_A_AAPP.xlsx"
NS={"m":"http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
try:
  req=Request(URL,headers={"User-Agent":"IdeaLabIndependentResearch/1.0","Accept":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"})
  with urlopen(req,timeout=28) as rsp:
    data=rsp.read(12_000_000)
  if len(data)>12_000_000 or not data.startswith(b"PK"):raise ValueError("Not an XLSX archive")
  z=zipfile.ZipFile(io.BytesIO(data))
  strings=[]
  if "xl/sharedStrings.xml" in z.namelist():
    root=E.fromstring(z.read("xl/sharedStrings.xml"))
    for si in root.findall("m:si",NS):
      strings.append("".join(t.text or "" for t in si.findall(".//m:t",NS)))
  w=E.fromstring(z.read("xl/workbook.xml"))
  sheets=w.find("m:sheets",NS)
  print("IGAE_COF_HIST bytes",len(data),"sheets",[(s.attrib.get("name"),s.attrib.get("sheetId")) for s in sheets])
  for sh in sorted(x for x in z.namelist() if re.fullmatch(r"xl/worksheets/sheet\d+\.xml",x))[:3]:
    x=E.fromstring(z.read(sh))
    print("IGAE_COF_SHEET",sh)
    printed=0
    for row in x.findall(".//m:sheetData/m:row",NS):
      n=int(row.get("r") or 0)
      if n>180 or printed>=40:break
      vals=[]
      for cell in row.findall("m:c",NS)[:18]:
        loc=cell.get("r")
        kind=cell.get("t")
        v=cell.find("m:v",NS)
        inline=cell.find("m:is",NS)
        raw=(v.text or "") if v is not None else ""
        if kind=="s" and raw:raw=strings[int(raw)]
        elif kind=="inlineStr" and inline is not None:
          raw="".join(t.text or "" for t in inline.findall(".//m:t",NS))
        if raw: vals.append((loc,str(raw)[:72]))
      if vals:
        print("IGAE_COF_ROW",n,repr(vals[:14]))
        printed+=1
except Exception as exc:
  print("IGAE_COF_UNAVAILABLE",type(exc).__name__,str(exc)[:200])
