#!/usr/bin/env python3
"""Before deploy, verify full production bundle and private-data exclusion."""
import re
import sys
from pathlib import Path
d=Path("dist")
errors=[]
for name in ("index.html","finanzas-publicas.html","metodologia.html","buscador-partidas.html"):
    if not (d/name).exists(): errors.append("Falta página "+name)
f=(d/"finanzas-publicas.html")
if f.exists():
    html=f.read_text(encoding="utf-8")
    if "pf-explorer-host" not in html and "sankey" not in html.lower():
        errors.append("Falta contenedor del Sankey V2")
search_html=d/"buscador-partidas.html"
if search_html.exists():
    markup=search_html.read_text(encoding="utf-8")
    if "partidas-buscador" not in markup or "Buscar partidas y proyectos" not in markup:
        errors.append("Buscador no incorporado al HTML publicado")

# A logo and icon are required on every release, not merely in source.
for name in ("logo-idea-lab.svg", "favicon.svg"):
    if not (d / name).exists():
        errors.append("Falta identidad corporativa: " + name)
if not list(d.rglob("*.js")): errors.append("No se generó JavaScript interactivo")
if not list(d.rglob("*.csv")): errors.append("No se generaron las fuentes CSV")
markers=("mam"+"g97","ate"+"nea","litos"+"artesania","mayor"+"domo","idealab.research2026@gmail.com","1WQJdVDAdrUoWt1CK6A2zjWyHgZutQ4BA","1P3BRnEQ3f89GqF5c0PR0kIznDk5SseXtNaLiDarWxfs")
secrets=[r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----",r"github_pat_[A-Za-z0-9_]{20,}"]
for p in d.rglob("*"):
 if not p.is_file():continue
 # Ignore independently vendored npm bundles to avoid false matches in minified code.
 if "_npm" in p.parts:continue
 if p.name in (".env","data-sources.json","credentials.json","service-account.json"):errors.append("Archivo privado "+str(p))
 if p.suffix.lower() not in (".js",".html",".css",".json",".csv",".txt",".svg"):continue
 content=p.read_text(encoding="utf-8",errors="replace")
 for marker in markers:
  if marker.lower() in content.lower():errors.append("Referencia privada: "+str(p))
 for regex in secrets:
  if re.search(regex,content):errors.append("Secreto detectado: "+str(p))

# Validate built navigation against real artifacts deployed by GitHub Pages.
# This catches the extensionless-path 404 which source-only checks missed.
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse, unquote

class AnchorLinks(HTMLParser):
 def __init__(self):
  super().__init__(convert_charrefs=True)
  self.hrefs=[]
 def handle_starttag(self,tag,attrs):
  if tag.lower()=="a":
   href=dict(attrs).get("href")
   if href:self.hrefs.append(href)

pages=("index.html","quienes-somos.html","actualizaciones.html",
       "metodologia.html","finanzas-publicas.html","buscador-partidas.html")
for page in pages:
 published=d/page
 if not published.exists():
  errors.append("Falta página de navegación: "+page)
  continue
 parser=AnchorLinks()
 parser.feed(published.read_text(encoding="utf-8"))
 origin="https://idealab2026.github.io/dashboard-gobierno/"+("" if page=="index.html" else page)
 for href in parser.hrefs:
  if href.startswith(("#","mailto:","tel:","javascript:")):continue
  # The corporate IDEA LAB homepage is an intentional, trusted parent-site link.
  # All other same-origin links must remain inside this product's Pages base path.
  if href == "https://idealab2026.github.io/":continue
  target=urlparse(urljoin(origin,href))
  if target.netloc!="idealab2026.github.io":continue
  path=unquote(target.path)
  if not path.startswith("/dashboard-gobierno/"):
   errors.append(f"{page}: enlace fuera del proyecto: {href}")
   continue
  relative=path[len("/dashboard-gobierno/"):]
  if not relative or relative.endswith("/"):
   relative+="index.html"
  if not relative.endswith(".html") and "." not in relative.rsplit("/",1)[-1]:
   errors.append(f"{page}: URL sin extensión no servida en Pages: {href}")
   continue
  if not (d/relative).is_file():
   errors.append(f"{page}: URL a un archivo no publicado: {href} (dist/{relative})")

if errors:
 print("\n".join(errors[:25]),file=sys.stderr)
 raise SystemExit(1)
print("OK: Sankey V2, páginas, JS, CSV y privacidad del artefacto público")
