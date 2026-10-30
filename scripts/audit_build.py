#!/usr/bin/env python3
"""Before deploy, verify full production bundle and private-data exclusion."""
import re
import sys
from pathlib import Path
d=Path("dist")
errors=[]
for name in ("index.html","finanzas-publicas.html","metodologia.html"):
    if not (d/name).exists(): errors.append("Falta página "+name)
f=(d/"finanzas-publicas.html")
if f.exists():
    html=f.read_text(encoding="utf-8")
    if "pf-explorer-host" not in html and "sankey" not in html.lower():
        errors.append("Falta contenedor del Sankey V2")
if not list(d.rglob("*.js")): errors.append("No se generó JavaScript interactivo")
if not list(d.rglob("*.csv")): errors.append("No se generaron las fuentes CSV")
markers=("mam"+"g97","ate"+"nea","litos"+"artesania","mayor"+"domo","idealab.research2026@gmail.com","1WQJdVDAdrUoWt1CK6A2zjWyHgZutQ4BA","1P3BRnEQ3f89GqF5c0PR0kIznDk5SseXtNaLiDarWxfs")
secrets=[r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----",r"github_pat_[A-Za-z0-9_]{20,}"]
for p in d.rglob("*"):
 if not p.is_file():continue
 if p.name in (".env","data-sources.json","credentials.json","service-account.json"):errors.append("Archivo privado "+str(p))
 if p.suffix.lower() not in (".js",".html",".css",".json",".csv",".txt",".svg"):continue
 content=p.read_text(encoding="utf-8",errors="replace")
 for marker in markers:
  if marker.lower() in content.lower():errors.append("Referencia privada: "+str(p))
 for regex in secrets:
  if re.search(regex,content):errors.append("Secreto detectado: "+str(p))
if errors:
 print("\n".join(errors[:25]),file=sys.stderr)
 raise SystemExit(1)
print("OK: Sankey V2, páginas, JS, CSV y privacidad del artefacto público")
