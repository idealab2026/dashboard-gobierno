#!/usr/bin/env python3
"""Produce the public COFOG time series strictly from the official IGAE XLSX.

Every historical year must have all ten function totals and exactly reconcilable
subfunctions. Never interpolate; fall back to the site's already-validated 2024
if the provider times out, revises the file unexpectedly, or changes its layout.
This output is generated at build time, not added to Git history.
"""
from __future__ import annotations
import hashlib,io,json,re,urllib.request,zipfile
from pathlib import Path
from xml.etree import ElementTree as ET
URL=("https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/"
     "Contabilidad/ContabilidadNacional/Publicaciones/"
     "Documents/AAPP_A/COFOG_A_AAPP.xlsx")
OUT=Path("app/data/cofog-history.json")
N={"m":"http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
NAMES={"01":"Servicios públicos generales","02":"Defensa",
 "03":"Orden público y seguridad","04":"Asuntos económicos",
 "05":"Protección del medio ambiente","06":"Vivienda y servicios comunitarios",
 "07":"Salud","08":"Ocio, cultura y religión","09":"Educación",
 "10":"Protección social"}
EXPECTED_2024={"01":92551,"02":14233,"03":28628,"04":80908,
 "05":15539,"06":7613,"07":102942,"08":19193,"09":65862,"10":297532}
BASE={"schema":"idea-lab-cofog-history-v1","source":"IGAE S.13, SEC 2010, revisión estadística 2024",
 "source_url":URL,"years":[],"status":"not-reconciled"}
def get_value(cell,ss):
    value=cell.find("m:v",N)
    raw=(value.text or "") if value is not None else ""
    if cell.attrib.get("t")=="s" and raw:return ss[int(raw)]
    if cell.attrib.get("t")=="inlineStr":
        inline=cell.find("m:is",N)
        return "".join(x.text or "" for x in inline.findall(".//m:t",N)) if inline is not None else ""
    return raw
def extract_zip(data):
    with zipfile.ZipFile(io.BytesIO(data)) as book:
        ss=[]
        if "xl/sharedStrings.xml" in book.namelist():
            root=ET.fromstring(book.read("xl/sharedStrings.xml"))
            ss=["".join(x.text or "" for x in si.findall(".//m:t",N))
                for si in root.findall("m:si",N)]
        annual=[]
        for year in range(1995,2025):
            # The verified workbook Index sheet is sheet1; sheet2=1995...
            sheet="xl/worksheets/sheet"+str(year-1993)+".xml"
            if sheet not in book.namelist():
                raise ValueError("Missing year sheet "+str(year))
            root=ET.fromstring(book.read(sheet))
            cells={}
            for row in root.findall(".//m:sheetData/m:row",N):
                rid=int(row.attrib.get("r",0))
                if rid not in (7,8,9):continue
                cells[rid]={}
                for cell in row.findall("m:c",N):
                    col=re.match(r"^[A-Z]+",cell.attrib["r"]).group()
                    cells[rid][col]=get_value(cell,ss).strip()
            ystamp=cells.get(7,{}).get("A","")
            if not ystamp.startswith(str(year)):
                raise ValueError("Year mismatch "+str(year)+": "+ystamp)
            if cells.get(9,{}).get("B","").upper()!="GASTO TOTAL":
                raise ValueError("Unexpected COFOG accounting row "+str(year))
            headers=cells[8]
            vals=cells[9]
            functions={}
            groups={}
            for col,h in headers.items():
                h=h.strip().replace("\u00a0"," ")
                m=re.fullmatch(r"Total\s+(0[1-9]|10)",h,re.IGNORECASE)
                if m:
                    if not re.fullmatch(r"\d{1,9}",vals.get(col,"")):
                        raise ValueError("Non-numeric division "+str(year)+" "+h)
                    functions[m.group(1)]=int(vals[col])
                elif re.fullmatch(r"(?:0[1-9]|10)\.\d",h):
                    if re.fullmatch(r"\d{1,9}",vals.get(col,"")):
                        groups[h]=int(vals[col])
            if set(functions)!=set(NAMES):
                raise ValueError("Not exactly 10 divisions in "+str(year))
            total=sum(functions.values())
            if total<=0:raise ValueError("Zero total "+str(year))
            # Directly source the 10, never sum the groups into the root,
            # because the spreadsheet has both parents and children.
            # Integers in millions may have small official rounding residuals.
            for major,v in functions.items():
                subs=[x for x in groups if x.startswith(major+".")]
                if subs and abs(sum(groups[x] for x in subs)-v)>5:
                    raise ValueError("Subfunction does not reconcile "+
                                     str(year)+" "+major)
            if year==2024 and any(abs(functions[k]-v)>1
                                  for k,v in EXPECTED_2024.items()):
                raise ValueError("Vintage 2024 is not compatible with current site's IGAE vintage")
            annual.append({"year":year,"total":total,
              "functions":[{"code":k,"title":NAMES[k],"value":functions[k]}
                 for k in sorted(NAMES)],
              "groups":[{"code":k,"value":groups[k]}
                 for k in sorted(groups)]})
        if len(annual)!=30 or annual[-1]["total"]!=725001:
            raise ValueError("COFOG annual series total or vintage mismatch")
        return annual
def main():
    report=dict(BASE)
    try:
        request=urllib.request.Request(URL,headers={"User-Agent":
            "IDEALAB-PublicObservatory/1.0 official COFOG validation"})
        with urllib.request.urlopen(request,timeout=25) as response:
            data=response.read(9_000_001)
        if len(data)>9_000_000 or not data.startswith(b"PK"):
            raise ValueError("Invalid XLSX payload")
        annual=extract_zip(data)
        report.update(status="verified",
            sha256=hashlib.sha256(data).hexdigest(),
            years=annual,n_years=len(annual))
        print("COFOG_HISTORY_VERIFIED",len(annual),
              "1995",annual[0]["total"],"2012",annual[17]["total"],
              "2024",annual[-1]["total"])
        y12=annual[17]
        g={x["code"]:x["value"] for x in y12["groups"]}
        s=sum(g.get(c,0) for c in ("10.1","10.2","10.3"))
        print("COFOG_2012_HESPERIDES_RECONSTRUCTION",
             json.dumps({"pensions_plus_IT_mill":s,
               "pensions_plus_IT_percent":round(100*s/y12["total"],2),
               "unemployment_percent":round(100*g.get("10.5",0)/y12["total"],2),
               "interest_percent":round(100*g.get("01.7",0)/y12["total"],2)},
               ensure_ascii=False))
        # Cross-check the editorial labels of the 2012 reference image.
        f={x["code"]:x["value"] for x in y12["functions"]}
        research_codes=("01.4","01.5","02.4","03.5","04.8","05.5",
                        "06.5","07.5","08.5","09.7","10.8")
        research=sum(g.get(k,0) for k in research_codes)
        editorial={
          "pensions":s,
          "health":f["07"]-g.get("07.5",0),
          "education":f["09"]-g.get("09.7",0),
          "economy_other":f["04"]-g.get("04.5",0)-g.get("04.8",0),
          "transport":g.get("04.5",0),
          "research":research,
          "interest":g.get("01.7",0),
          "general":f["01"]-g.get("01.7",0)-g.get("01.4",0)-g.get("01.5",0),
          "unemployment":g.get("10.5",0),
          "family":g.get("10.4",0),
          "social_other":f["10"]-s-g.get("10.4",0)-g.get("10.5",0)-g.get("10.8",0),
          "public_order":f["03"]-g.get("03.5",0),
          "defence":f["02"]-g.get("02.4",0),
          "culture":f["08"]-g.get("08.5",0),
          "environment":f["05"]-g.get("05.5",0),
          "housing":f["06"]-g.get("06.5",0)
        }
        if sum(editorial.values())!=y12["total"]:
            raise ValueError("2012 editorial recomposition does not reconcile")
        comparisons={k:round(100*v/y12["total"],2) for k,v in editorial.items()}
        print("COFOG_2012_EDITORIAL_PERCENT",json.dumps(comparisons,ensure_ascii=False))
        y24=annual[-1]
        gp24={x["code"]:x["value"] for x in y24["groups"]}
        p24=sum(gp24.get(k,0) for k in ("10.1","10.2","10.3"))
        print("COFOG_2024_PENSIONS_SHARE",p24,round(100*p24/y24["total"],2))
    except Exception as err:
        report.update(status="unavailable",warning=type(err).__name__+": "+str(err)[:230])
        print("::warning::No official verified history, retaining the validated 2024 chart:",report["warning"])
    OUT.write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf8")
if __name__=="__main__":main()
