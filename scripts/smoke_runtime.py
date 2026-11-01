#!/usr/bin/env python3
"""Browser-level fail-closed smoke check for the built Observable application.

Observable Framework's build can succeed when its reactive dependency graph
throws a RuntimeError only in the browser. This smoke check uses the Chrome
already installed on GitHub's Ubuntu runners; no paid services are needed.
"""
from __future__ import annotations

import functools
import http.server
import pathlib
import re
import shutil
import subprocess
import tempfile
import threading
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
BASE = "dashboard-gobierno"


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, _format, *_args):
        pass


def main() -> None:
    if not (DIST / "index.html").is_file():
        raise SystemExit("No se encontró dist/index.html: primero compilar la web.")
    chrome = next(
        (binary for name in ("google-chrome", "google-chrome-stable", "chromium", "chromium-browser")
         if (binary := shutil.which(name))),
        None,
    )
    if not chrome:
        raise SystemExit("No hay Chromium/Google Chrome: no se permite publicar sin probar el runtime.")

    with tempfile.TemporaryDirectory(prefix="idealab-runtime-") as tmp:
        tmp_path = pathlib.Path(tmp)
        (tmp_path / BASE).symlink_to(DIST, target_is_directory=True)
        handler = functools.partial(QuietHandler, directory=str(tmp_path))
        server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            url = f"http://127.0.0.1:{server.server_port}/{BASE}/"
            with urllib.request.urlopen(url, timeout=8) as response:
                if response.status != 200:
                    raise AssertionError(f"Servidor local: HTTP {response.status}")

            args = [
                chrome, "--headless=new", "--no-sandbox", "--disable-gpu",
                "--disable-dev-shm-usage", "--disable-extensions",
                "--disable-background-networking", "--no-first-run",
                "--no-default-browser-check",
                f"--user-data-dir={tmp_path / 'chrome-profile'}",
                "--window-size=1440,900",
                "--virtual-time-budget=15000",
                "--dump-dom", url,
            ]
            result = subprocess.run(args, text=True, capture_output=True, timeout=85)
            if result.returncode:
                raise AssertionError(
                    f"Chrome falló (exit {result.returncode}): {result.stderr[-2500:]}"
                )
            dom = result.stdout
            if not dom.strip().lower().startswith("<!doctype html") and "<html" not in dom[:400]:
                raise AssertionError(f"Chrome no devolvió HTML: {dom[:600]!r}")
            for error in ("RuntimeError: circular definition", "RuntimeError:",
                          "Uncaught SyntaxError", "Uncaught ReferenceError"):
                if error in dom:
                    raise AssertionError(f"Error del navegador detectado: {error}")

            checks = {
                "Sankey interactivo": 'class="pf-explorer' in dom,
                "España en un minuto": "<h2>España en un minuto</h2>" in dom,
                "Tarjetas de indicadores": 'class="kpi-card' in dom,
                "Detalle de gasto COFOG": "TOTAL COFOG" in dom,
                "Buscador visible en portada": 'id="il-quick-spending-query"' in dom,
                "Formulario que envía búsqueda": 'class="il-quick-spending-form"' in dom,
                "Selector de ministerios en portada": 'id="il-ministry-sankey"' in dom,
                "Selector de CCAA en portada": 'id="il-region-sankey"' in dom,
                "Total nacional disponible": "España · conjunto" in dom and 'class="pf-explorer' in dom,
            }
            if not all(checks.values()):
                # Heavy multi-module SPA can finish its first Chrome paint before
                # the Observable async bundle is ready on a cold CI worker.
                # Retry with a fresh profile, but still require every signal.
                retry=subprocess.run([
                    *args[:-3],
                    "--virtual-time-budget=28000","--dump-dom",url
                ],text=True,capture_output=True,timeout=85)
                if retry.returncode:
                    raise AssertionError("Segundo intento Chrome fallido: "+retry.stderr[-800:])
                dom=retry.stdout
                checks={
                    "Sankey interactivo": 'class="pf-explorer' in dom,
                    "España en un minuto": "<h2>España en un minuto</h2>" in dom,
                    "Tarjetas de indicadores": 'class="kpi-card' in dom,
                    "Detalle de gasto COFOG": "TOTAL COFOG" in dom,
                    "Buscador visible en portada": 'id="il-quick-spending-query"' in dom,
                    "Formulario que envía búsqueda": 'class="il-quick-spending-form"' in dom,
                    "Selector de ministerios en portada": 'id="il-ministry-sankey"' in dom,
                    "Selector de CCAA en portada": 'id="il-region-sankey"' in dom,
                    "Total nacional disponible": "España · conjunto" in dom and 'class="pf-explorer' in dom,
                }
                if any(x in dom for x in ("RuntimeError:","Uncaught SyntaxError")):
                    raise AssertionError("Error runtime en reintento de portada")
            if not all(checks.values()):
                raise AssertionError(f"Runtime incompleto tras reintento: {checks}; HTML chars={len(dom)}")
            print(f"Observatorio OK en Chrome: {checks}")
            # The default route must already show every published Treasury
            # debt number IN the principal diagram, with no mode switch.
            for fragment in (
                'class="pf-bridge-overview"',
                'data-perimeter="s13"',
                'data-perimeter="treasury"',
                "Cuenta no financiera · S.13",
                "Emisión y amortización · Tesoro",
                "relación conceptual, no igualdad",
                'class="pf-integrated-financing"',
                'data-perimeter="treasury-state"',
                'class="pf-integrated-canvas"',
                'class="pf-integrated-bar"',
                'class="pf-integrated-bar-repay"',
                'class="pf-integrated-bar-net"',
                "Nueva deuda emitida",
                "Capital devuelto",
                "Intereses de deuda · COFOG 01.7",
                "39.644 M€",
                "Emisión neta",
                "259.365 M€",
                "204.332 M€",
                "55.034 M€",
                "No debe sumarse a COFOG",
                "Mapa principal · gasto y deuda"
            ):
                if fragment not in dom:
                    raise AssertionError("El mapa principal no muestra deuda: "+fragment)
            if "Gasto público · S.13" not in dom and "Mapa principal · gasto y deuda" not in dom:
                raise AssertionError("Se perdió la representación S.13")
            if dom.index('class="pf-integrated-financing"') < dom.index('class="pf-center-box"'):
                raise AssertionError("Deuda figura por encima de la clasificación COFOG")
            print("Mapa PRINCIPAL: S.13 y deuda Tesoro presentes sin cambiar vista")
            for fragment in (
                'class="pf-cash-concept"',
                "¿De dónde sale el dinero para devolver deuda?",
                "Impuestos y otros cobros + nueva financiación + caja inicial",
                "Tesorería del Estado",
                "Servicios, intereses, capital devuelto y saldo final",
                "Esquema conceptual del Estado"
            ):
                if fragment not in dom:
                    raise AssertionError("No se ve el circuito de caja conceptual: "+fragment)
            # A click on the S.13 central node calls openDetail(center).
            # The QA deeplink calls EXACTLY that same handler to ensure the
            # drawer is populated rather than opened as an empty white box.
            central_url=url+"?detalle-central=1#mapa-dinero"
            central=subprocess.run([*args[:-1],"--virtual-time-budget=15000",central_url],
                                   text=True,capture_output=True,timeout=85)
            if central.returncode:
                raise AssertionError("Chrome no abre el detalle del nodo S.13")
            center_dom=central.stdout
            for fragment in (
                'class="pf-explorer is-detail-open',
                'class="pf-center-facts"',
                "¿De dónde sale y adónde va el dinero?",
                "Cómo se paga la deuda",
                "Impuestos + otros cobros + deuda emitida + caja inicial",
                "Servicios + intereses + amortizaciones",
                "Ver amortizaciones en el mismo mapa"
            ):
                if fragment not in center_dom:
                    raise AssertionError("Panel S.13 vacío o incompleto: "+fragment)
            print("Click en centro S.13: panel de caja y deuda poblado y accesible en Chrome")



            # Debt is a separate STATE Treasury flow within the same
            # public Sankey component, not mixed with government S.13 COFOG.
            finance_url=url+"?vista=deuda#mapa-dinero"
            debt=subprocess.run([*args[:-1],"--virtual-time-budget=18000",
                                 finance_url],
                text=True,capture_output=True,timeout=85)
            if debt.returncode:
                raise AssertionError("Chrome no abre el modo deuda")
            finance_dom=debt.stdout
            for fragment in (
                'class="pf-tesoro"',
                'class="pf-tesoro-scroll"',
                "Emisión y amortización de deuda",
                "204.332 M€",
                "55.034 M€",
                "259.366 M€",
                "259.365 M€",
                'aria-pressed="true"',
                "Financiación neta ≠ gasto público",
                "no es una salida de caja"
            ):
                if fragment not in finance_dom:
                    raise AssertionError("Modo deuda no renderizado: "+fragment)
            if 'class="pf-center-box"' in finance_dom:
                raise AssertionError("Se solapan el Sankey S13 y la vista Tesoro")
            if "RuntimeError:" in finance_dom:
                raise AssertionError("RuntimeError en vista de deuda del Tesoro")
            print("Vista Tesoro 2024: emisiones y amortizaciones verificadas en Chrome")


            # Los filtros de portada cambian el mismo mapa. El modo ministerial
            # conserva las 22 ramas y amplía columnas horizontalmente.
            for query, expected in [
                ("?ambito=ministerio&id=17",
                 ("Presupuestos por ministerio","2025-P",
                  'data-mode="ministry-budget-tree"',
                  'data-selected-ministry="17"',
                  'class="mbt-svg"')),
                ("?ambito=ccaa&id=1",
                 ("Andalucía","2024","Gasto por comunidad autónoma",
                  'data-administration-mode="regions"',
                  'class="ad-flow"'))
            ]:
                scoped = subprocess.run(
                    [*args[:-1], "--virtual-time-budget=14000", url+query],
                    text=True, capture_output=True, timeout=85
                )
                if scoped.returncode:
                    raise AssertionError("Chrome no carga scope del Sankey en portada "+query)
                scoped_dom=scoped.stdout
                for required in expected:
                    if required not in scoped_dom:
                        raise AssertionError("Portada "+query+" sin "+required)
                if 'class="pf-explorer' in scoped_dom or "RuntimeError:" in scoped_dom:
                    raise AssertionError("Se duplicó o falló el Sankey en "+query)
                if "ministerio" in query:
                    nodes=re.findall(
                        r'<g class="mbt-node"[^>]+data-code="(1[2-9]|2[0-9]|3[0-3])"',
                        scoped_dom
                    )
                    if len(set(nodes))!=22:
                        raise AssertionError("Faltan ministerios en vista completa: "+str(nodes))
                    if 'data-drill-level="ministerio"' not in scoped_dom:
                        raise AssertionError("La vista no ha abierto el primer nivel ministerial")
                    if 'class="mbt-source"' not in scoped_dom or "Suma de secciones" not in scoped_dom:
                        raise AssertionError("El origen ministerial debe estar rotulado como suma presupuestaria, no como S.13")
                print("Portada Sankey seleccionado OK:",query)

            # Comparar dos niveles de profundización. No hay panel lateral:
            # las mismas 22 ramas originales permanecen montadas en el SVG.
            for query,level,required in [
                ("?ambito=ministerio&id=17&nivel=area&codigo=4",
                 "area",("Actuaciones de carácter económico", "ÁREAS DE GASTO",
                         'data-selected-area="4"')),
                ("?ambito=ministerio&id=17&nivel=programa&codigo=453A",
                 "programa",("453A","DOCUMENTACIÓN DEL PROGRAMA",
                           'data-selected-program="453A"')),
            ]:
                result=subprocess.run(
                    [*args[:-1],"--virtual-time-budget=15000",url+query],
                    text=True,capture_output=True,timeout=85
                )
                if result.returncode:
                    raise AssertionError("Chrome no carga desglose ministerial "+query)
                page=result.stdout
                if 'data-drill-level="'+level+'"' not in page:
                    raise AssertionError("Nivel ministerial equivocado "+query)
                if 'class="mbt-svg"' not in page or "RuntimeError:" in page:
                    raise AssertionError("Sankey ministerial no se conserva "+query)
                for needle in required:
                    if needle not in page:
                        raise AssertionError("Falta "+needle+" en "+query)
                codes=re.findall(
                    r'<g class="mbt-node"[^>]+data-code="(1[2-9]|2[0-9]|3[0-3])"',
                    page
                )
                if len(set(codes))!=22:
                    raise AssertionError("Se perdieron ministerios al profundizar "+query)
                print("Linaje ministerial verificado:",query)


            search_url = f"http://127.0.0.1:{server.server_port}/{BASE}/buscador-partidas.html"
            search_args = [
                *args[:-1],
                "--virtual-time-budget=12000",
                search_url,
            ]
            search_result = subprocess.run(
                search_args, text=True, capture_output=True, timeout=85
            )
            if search_result.returncode:
                raise AssertionError(
                    f"Chrome no abre buscador: {search_result.stderr[-2500:]}"
                )
            search_dom = search_result.stdout
            checks_search = {
                "Formulario de búsqueda": 'class="spending-finder"' in search_dom,
                "Documentos oficiales indexados": ('class="sf-record sf-card-open"' in search_dom and 'class="sf-card-lineage"' in search_dom),
                "Campo de texto": 'type="search"' in search_dom,
                "Índice ministerial y autonómico": (
                    "programas PGE" in search_dom and
                    "funciones CCAA" in search_dom and
                    "categorías COFOG nacionales" in search_dom),
            }
            if any(error in search_dom for error in
                   ("RuntimeError:", "Uncaught SyntaxError", "Uncaught ReferenceError")):
                raise AssertionError("Error Observable en buscador de partidas")
            if not all(checks_search.values()):
                print("SEARCH CHROME DIAGNÓSTICO:", {
                    "len": len(search_dom),
                    "start": search_dom[:850],
                    "runtime_errors": [q for q in
                        ("RuntimeError:", "ReferenceError", "SyntaxError", "NotFoundError")
                        if q in search_dom],
                    "stderr_tail": search_result.stderr[-900:]
                })
                raise AssertionError(f"Buscador incompleto en Chrome: {checks_search}")
            # The publicly indexed administrative records must be searchable:
            # no pretending that the former 84 selected records cover all PGE.
            volume = re.search(
                r"Mostrando 24 de ([0-9]+) registros del índice",
                search_dom
            )
            if not volume or int(volume.group(1)) <= 254:
                raise AssertionError(
                    "No se indexaron todos los programas PGE y funciones CCAA: "+
                    (volume.group(1) if volume else "sin contador"))
            if ('class="sf-pagination"' not in search_dom or
                'class="sf-load-more"' not in search_dom):
                raise AssertionError("Paginación ausente, siguen ocultos resultados")
            if "primeros 70" in search_dom:
                raise AssertionError("Persistió el límite antiguo de 70")
            print("Cobertura oficial indexada:",volume.group(1),
                  "registros; paginación sin truncamiento")
            if ('class="sf-coverage"' not in search_dom or
                'class="sf-coverage-stats"' not in search_dom or
                'class="sf-class-chart"' not in search_dom):
                raise AssertionError("Falta el panel gráfico de clasificación del índice")
            for fragment in ("591","337","170","71","13",
                             "Programas PGE · área","COFOG · España",
                             "COFOG · CCAA",
                             'class="sf-bar-choice"'):
                if fragment not in search_dom:
                    raise AssertionError("Recuento o barra ausente: "+fragment)
            # A deep link selects the very same bar that a click selects,
            # preserving the option to clear it and all index counters.
            classified_url = search_url + "?clasificacion=area&grupo=4"
            grouped = subprocess.run(
                [*args[:-1], "--virtual-time-budget=10000", classified_url],
                text=True, capture_output=True, timeout=85
            )
            if grouped.returncode:
                raise AssertionError("Chrome no abre el gráfico prefiltrado")
            classified_dom=grouped.stdout
            if ('data-classification-key="4" aria-pressed="true"' not in classified_dom and
                'aria-pressed="true" data-classification-key="4"' not in classified_dom):
                raise AssertionError("La barra de área económica no está seleccionada")
            filtered_count = re.search(
                r"Mostrando (\d+) de (\d+) registros del índice",classified_dom
            )
            if (not filtered_count or int(filtered_count.group(2))<=0 or
                int(filtered_count.group(2))>=337):
                raise AssertionError("El gráfico no filtra programas del área 4")
            if "RuntimeError:" in classified_dom:
                raise AssertionError("Error Observable al abrir categoría prefiltrada")
            print("Cobertura interactiva validada: 591 registros, barras y filtro PGE 4")

            # Landing: only compact gallery and six static data previews.
            # Full charts load on demand through the same openChart handler.
            atlas_url=f"http://127.0.0.1:{server.server_port}/{BASE}/visualizaciones.html"
            atlas=subprocess.run(
                [*args[:-1],"--virtual-time-budget=11000",atlas_url],
                text=True,capture_output=True,timeout=85
            )
            if atlas.returncode:
                raise AssertionError("Chrome no abre el atlas")
            atlas_dom=atlas.stdout
            for fragment in (
                'class="il-gallery"',
                'id="il-gallery-query"',
                'class="il-gallery-grid"',
                'class="il-gallery-preview"',
                'data-chart="gasto"',
                'data-chart="pensiones"',
                'data-chart="salarios"',
                'data-chart="vivienda"',
                'data-chart="preocupaciones"',
                'data-chart="indicadores"',
                "6 de 6 gráficas",
                'class="il-gallery-dialog"',
                "28,4 %"
            ):
                if fragment not in atlas_dom:
                    raise AssertionError("Galería compacta no renderizada: "+fragment)
            if any(s in atlas_dom for s in ("RuntimeError:","Uncaught SyntaxError")):
                raise AssertionError("RuntimeError en galería")
            if 'class="il-treemap"' in atlas_dom:
                raise AssertionError("El treemap gigante sigue visible en la portada")
            print("Galería compacta: seis tarjetas, vista previa, buscador sin treemap gigante")
            for width, height in ((1440, 900), (390, 844)):
                nav_page = subprocess.run(
                    [*args[:-1], f"--window-size={width},{height}",
                     "--virtual-time-budget=16000", atlas_url+"?nav-qa=1"],
                    text=True, capture_output=True, timeout=85
                )
                if nav_page.returncode:
                    raise AssertionError("Chrome no verificó menú "+str(width))
                if "NAV_QA_OK" not in nav_page.stdout or "NAV_QA_FAIL" in nav_page.stdout:
                    index=nav_page.stdout.find('id="il-atlas-nav-qa"')
                    context=nav_page.stdout[max(0,index-40):index+300] if index>=0 else "NO HAY MARCADOR"
                    raise AssertionError("El menú solapa elementos en ancho "+str(width)+": "+context)
            print("Menú atlas validado en escritorio y móvil")

            # Deep-link and click use the same gallery openChart() handler.
            # The deep links let CI test dialogs without synthetic mouse clicks.
            for chart_name,visible in (
                ("gasto",('class="il-treemap"', 'class="il-tm-canvas"',
                          "Pensiones e incapacidad","2024 · 725.001 millones")),
                ("pensiones",('id="il-pensions-chart"', "Pensiones: porcentaje del gasto público",
                             "206.130","2020–2024")),
                ("vivienda",('id="il-housing-chart"', "Vivienda: valor tasado por m²",
                            'class="il-social-chart-wrap"')),
                ("preocupaciones",('id="il-concerns-chart"',
                                  "¿Qué preocupa a los españoles?")),
                ("indicadores",('id="il-indicators-chart"',
                               'class="il-social-objectives"'))
            ):
                chart_url=atlas_url+"?grafica="+chart_name
                page=subprocess.run(
                    [*args[:-1],"--virtual-time-budget=15000",chart_url],
                    text=True,capture_output=True,timeout=85
                )
                if page.returncode:
                    raise AssertionError("Chrome no abre gráfica ampliada "+chart_name)
                html=page.stdout
                for fragment in visible:
                    if fragment not in html:
                        raise AssertionError("Modal de "+chart_name+" sin "+fragment)
                if not re.search(r'<dialog[^>]*\bopen(?:\s|=|>)',html):
                    raise AssertionError("Modal de "+chart_name+" no se abrió")
                if "RuntimeError:" in html or "Uncaught SyntaxError" in html:
                    raise AssertionError("RuntimeError en el detalle "+chart_name)
            print("Modales gráficos abiertos en Chrome: gasto, pensiones, vivienda, CIS, indicadores")
            print(f"Buscador de partidas OK en Chrome: {checks_search}")

            # Verify a query submitted from the homepage is applied at the destination.
            from urllib.parse import quote
            filtered_url = search_url + "?q=" + quote("Honduras")
            filtered = subprocess.run(
                [*args[:-1], "--virtual-time-budget=8000", filtered_url],
                text=True, capture_output=True, timeout=85
            )
            if filtered.returncode:
                raise AssertionError(f"Chrome no ejecuta consulta: {filtered.stderr[-1200:]}")
            filtered_dom = filtered.stdout
            if "Empleo y resiliencia para mujeres migrantes" not in filtered_dom:
                import re as _re
                result_header = _re.search(
                    r'<div class="sf-summary"[^>]*>(.{0,1200})</div>',
                    filtered_dom, _re.DOTALL
                )
                print("DIAGNÓSTICO Honduras:", {
                    "dom_chars": len(filtered_dom),
                    "summary": result_header.group(1)[:850] if result_header else "(ninguno)",
                    "honduras_occurrences": filtered_dom.lower().count("honduras"),
                    "empty_state": "Sin coincidencias en el índice disponible" in filtered_dom,
                    "runtime_error": "RuntimeError:" in filtered_dom,
                })
                raise AssertionError("El filtro enviado desde portada no encuentra Honduras")
            if "RuntimeError:" in filtered_dom:
                raise AssertionError("Error Observable al abrir consulta prefiltrada")
            print("Búsqueda profunda desde portada OK en Chrome")

            # Fail publication if the ordinary synonym "sanidad" shows an empty result.
            health_url = search_url + "?q=sanidad"
            health = subprocess.run(
                [*args[:-1], "--virtual-time-budget=8000", health_url],
                text=True, capture_output=True, timeout=85
            )
            if health.returncode:
                raise AssertionError("Chrome no ejecuta q=sanidad")
            health_dom = health.stdout
            if ('Sin coincidencias en el índice disponible' in health_dom or
                    '102.942' not in health_dom or
                    'Servicios hospitalarios' not in health_dom):
                raise AssertionError("La búsqueda por sanidad no devuelve gasto sanitario oficial 2024")
            if "RuntimeError:" in health_dom:
                raise AssertionError("RuntimeError en búsqueda sanidad")
            print("Búsqueda sanidad OK: 102.942 M€, servicios hospitalarios y subfunciones")

            # A common search must show the entire verified lineage BELOW
            # the results, with a functional deep-link to the original Sankey.
            hospital = subprocess.run(
                [*args[:-1], "--virtual-time-budget=10000",
                 search_url+"?q=hospital"],
                text=True, capture_output=True, timeout=85
            )
            if hospital.returncode:
                raise AssertionError("Chrome no ejecuta q=hospital")
            hospital_dom=hospital.stdout
            for required in (
                'class="sf-result-group"',
                'class="sf-card-lineage"',
                'class="sf-record sf-card-open"',
                'class="sf-result-details"',
                'class="sf-lineage-list"',
                'id="linaje-07-3"',
                "07 · Salud",
                "07.3 · Servicios hospitalarios",
                "43.650 M€",
                "07.3.1",
                "07.3.2",
                "07.3.3",
                "07.3.4",
                "Subcategorías COFOG (4)",
                './?detalle-cofog=07.3#mapa-dinero',
                './?detalle-cofog=07.3.1#mapa-dinero',
                "Abrir Sankey"

            ):
                if required not in hospital_dom:
                    raise AssertionError(
                        "El linaje hospitalario no aparece en el buscador: "+required)
            if "RuntimeError:" in hospital_dom:
                raise AssertionError("RuntimeError en linaje hospitalario")
            if 'class="sf-lineage-card"' in hospital_dom:
                raise AssertionError("El linaje no debe mostrarse en otra tarjeta")
            if 'class="sf-sources-details"' not in hospital_dom:
                raise AssertionError("Fuentes extensas no accesibles")
            if 'class="sf-result-details" open' in hospital_dom:
                raise AssertionError("Detalles visibles sin pedirlos")
            first_card=hospital_dom.find('class="sf-record sf-card-open"')
            first_lineage=hospital_dom.find('class="sf-card-lineage"')
            if not 0 <= first_lineage < first_card:
                raise AssertionError("El linaje debe aparecer encima de la tarjeta")
            print("Búsqueda hospital: linaje superior, tarjeta clicable y texto oculto")

            # Road maintenance query must lead to an actual 453C State Budget
            # program, never to a fabricated execution figure from COFOG 04.5.
            road_url = search_url + "?q=" + quote("mantenimiento de carreteras")
            road = subprocess.run(
                [*args[:-1], "--virtual-time-budget=8000", road_url],
                text=True, capture_output=True, timeout=85
            )
            if road.returncode:
                raise AssertionError("Chrome no ejecuta consulta de mantenimiento de carreteras")
            road_dom = road.stdout
            for required in ("Conservación, mantenimiento y explotación de carreteras",
                             "1.208,41 M€", "453C", "Ver capítulos presupuestarios",
                             "Crédito PGE · no ejecutado"):
                if required not in road_dom:
                    import re as _regex
                    print("DIAGNÓSTICO 453C:", {
                        "required": required,
                        "amount_nodes": _regex.findall(
                            r'<strong class="sf-amount"[^>]*>[^<]{0,80}</strong>',
                            road_dom
                        )[:15],
                        "near_title": road_dom[
                            max(0, road_dom.find("Conservación, mantenimiento")-250):
                            road_dom.find("Conservación, mantenimiento")+800
                        ][:1050],
                    })
                    raise AssertionError("No se encontró programa 453C o su trazabilidad: " + required)
            if "Sin coincidencias en el índice disponible" in road_dom or "RuntimeError:" in road_dom:
                raise AssertionError("La búsqueda de mantenimiento de carreteras ha fallado")
            print("Búsqueda mantenimiento carreteras OK: programa 453C, 1.208,41 M€ (2024-P)")

            # A SINGLE SVG must grow rightwards, with original nodes intact.
            import re as _re_cofog
            for code,fragments in [
                ("01.3",("01.1","01.3","01.7",
                    "NIVEL 3 COFOG", "01.3.1",
                    "01.3.2", "01.3.3")),
                ("04.5",("04.1","04.5", "NIVEL 3 COFOG",
                    "04.5.1", "04.5.2", "04.5.3", "04.5.4", "04.5.5")),
                ("07.3",("07.1","07.3","NIVEL 3 COFOG",
                    "07.3.1", "07.3.2", "07.3.3", "07.3.4")),
                ("09.1",("09.1.1", "09.1.2", "NIVEL 3 COFOG")),
            ]:
                selected_url=url+"?detalle-cofog="+code
                result=subprocess.run(
                    [*args[:-1],"--virtual-time-budget=12000",selected_url],
                    text=True,capture_output=True,timeout=85
                )
                if result.returncode:
                    raise AssertionError("Chrome no abre COFOG "+code)
                page=result.stdout
                for item in fragments:
                    if item not in page:
                        raise AssertionError("Falta partida en "+code+": "+item)
                for required in (
                    'class="pf-chart is-expanded"',
                    'class="pf-inline-extension"',
                    'data-expanded-code="'+code+'"',
                    'class="pf-inline-trail"',
                    'class="pf-node-group pf-spend"'
                ):
                    if required not in page:
                        raise AssertionError("Ampliación original del SVG ausente "+code+": "+required)
                if 'class="pf-explorer is-detail-open"' in page:
                    raise AssertionError("Se abrió un menú separado en "+code)
                codes=_re_cofog.findall(
                    r'class="pf-extension-node"[^>]*data-code="([^"]+)"',page)
                if code not in codes:
                    raise AssertionError("Rama no encontrada "+code+": "+repr(codes))
                if code=="01.3" and not(codes.index("01.1") <
                    codes.index("01.3") < codes.index("01.7")):
                    raise AssertionError("Orden COFOG incorrecto: "+repr(codes))
                if 'class="pf-extension-ribbon"' not in page:
                    raise AssertionError("Faltan las bandas conectadas al Sankey "+code)
                # Prevent the previously observed overlap of two headings in
                # the exact same COFOG column (same x, same y).
                headers=_re_cofog.findall(
                    r'<text x="([0-9.]+)" y="23" class="pf-extension-heading"',
                    page
                )
                if len(headers)!=len(set(headers)):
                    raise AssertionError("Encabezados COFOG solapados: "+code+
                                         " "+repr(headers))
                if "RuntimeError:" in page:
                    raise AssertionError("Error Observable en COFOG "+code)
                if ('data-selected-class=' in page or
                    'class="pf-doc-line"' in page or
                    'PROGRAMAS RELACIONADOS (OTRO PERÍMETRO)' in page):
                    raise AssertionError("Los programas PGE se abren antes de seleccionar una clase: "+code)
                print("Sankey SVG original extendido y verificado:",code,
                    "sin programas desplegados hasta seleccionar clase")

            # A level-III click must selectively reveal documentary programs.
            # The deep link reproduces exactly the same state transition as
            # clicking a COFOG class node in the SVG.
            for class_code,expected in [
                ("04.5.1",("453B", "453C")),
                ("04.5.2",("441N", "454M")),
                ("04.5.3",("453A", "45AC")),
                ("04.5.4",("441O", "455M")),
                ("07.3.1",("Sin programas indexados para esta clase",)),
            ]:
                selected_url=url+"?detalle-cofog="+class_code
                result=subprocess.run(
                    [*args[:-1],"--virtual-time-budget=12000",selected_url],
                    text=True,capture_output=True,timeout=85
                )
                if result.returncode:
                    raise AssertionError("Chrome no abre clase COFOG "+class_code)
                page=result.stdout
                if ('data-selected-class="'+class_code+'"' not in page or
                    'aria-current="step"' not in page or
                    'class="pf-inline-extension"' not in page):
                    raise AssertionError("No se seleccionó clase "+class_code)
                for fragment in expected:
                    if fragment not in page:
                        raise AssertionError("Programa relacionado ausente en "+
                                             class_code+": "+fragment)
                current_anchor=_re_cofog.search(
                    r'<g class="pf-extension-node is-taxonomy"[^>]*data-code="'+
                    _re_cofog.escape(class_code)+
                    r'"[^>]*data-anchor-y="([^"]+)"',page
                )
                if not current_anchor:
                    raise AssertionError("Falta coordenada en clase "+class_code)
                links=_re_cofog.findall(
                    r'<path [^>]*class="pf-doc-line"[^>]*'+
                    r'data-source-code="([^"]+)"[^>]*data-source-y="([^"]+)"',
                    page
                )
                if class_code.startswith("04.5"):
                    if not links:
                        raise AssertionError("Faltan conexiones documentales de "+class_code)
                    if any(source!=class_code or y!=current_anchor.group(1)
                           for source,y in links):
                        raise AssertionError("Conexiones no ancladas a la clase seleccionada: "+
                                             class_code+" "+repr(links[:4]))
                elif links:
                    raise AssertionError("Conexiones documentales inventadas en "+class_code)
                if "RuntimeError:" in page:
                    raise AssertionError("Error JS al seleccionar clase "+class_code)
                print("Clase COFOG "+class_code+" verificada: programas selectivos y origen correcto")

            # Each administration has its own audited flow: ministry PGE and
            # CCAA IGAE are rendered separately with their vintage visible.
            for type_arg, expected in [
                ("?tipo=ministerio&id=17",("Transportes y Movilidad Sostenible",
                   "2025-P", "11.457", "Administraciones" )),
                ("?tipo=ccaa&id=1", ("Andalucía","2024","COFOG","Salud"))
            ]:
                admin_url=f"http://127.0.0.1:{server.server_port}/{BASE}/administraciones.html"+type_arg
                admin_browser = subprocess.run(
                    [*args[:-1], "--virtual-time-budget=10000", admin_url],
                    text=True, capture_output=True, timeout=85
                )
                if admin_browser.returncode:
                    raise AssertionError("Chrome no abre Sankeys por administración: "+type_arg)
                admin_dom=admin_browser.stdout
                for needle_text in expected:
                    if needle_text not in admin_dom:
                        raise AssertionError(f"Falta {needle_text} en Sankey {type_arg}")
                if 'class="ad-flow"' not in admin_dom or "RuntimeError:" in admin_dom:
                    raise AssertionError("Sankey ministerial o regional ausente: "+type_arg)
                print("Sankey validado en Chrome",type_arg)

            # Direct deep links must extend the SAME Sankey horizontally;
            # ministry PGE and region IGAE have different quantification.
            for query,expected_level,expected_code,required in [
                ("?tipo=ccaa&id=10&nivel=funcion&codigo=07","funcion","07",
                 ("Extremadura","07.3","GRUPOS COFOG")),
                ("?tipo=ccaa&id=10&nivel=subfuncion&codigo=07.3","subfuncion","07.3",
                 ("Extremadura","07.3.1","07.3.2","CLASES COFOG")),
                ("?tipo=ccaa&id=10&nivel=clase&codigo=07.3.1","clase","07.3.1",
                 ("Último nivel de clasificación COFOG","Sin importe autonómico desglosado")),
                ("?tipo=ministerio&id=17&nivel=area&codigo=4","area","4",
                 ("Transportes y Movilidad Sostenible","PROGRAMAS PRESUPUESTARIOS","453C")),
                ("?tipo=ministerio&id=17&nivel=programa&codigo=453C","programa","453C",
                 ("Crédito PGE · no gasto ejecutado","Consultar fuente oficial"))
            ]:
                deep_url=f"http://127.0.0.1:{server.server_port}/{BASE}/administraciones.html"+query
                browser=subprocess.run(
                    [*args[:-1],"--virtual-time-budget=14000",deep_url],
                    text=True,capture_output=True,timeout=85
                )
                if browser.returncode:
                    raise AssertionError("Fallo Chrome en nivel: "+query)
                page=browser.stdout
                for fragment in required:
                    if fragment not in page:
                        raise AssertionError("Falta rama o clase "+query+": "+fragment)
                if ('data-drill-level="'+expected_level+'"' not in page or
                    'data-drill-code="'+expected_code+'"' not in page):
                    raise AssertionError("Nivel del árbol incorrecto "+query)
                if ('class="ad-flow"' not in page or
                    'class="ad-stage"' not in page or
                    'class="ad-inline-node' not in page and
                    'class="ad-branch ad-inline-node' not in page):
                    raise AssertionError("No se preservó el Sankey "+query)
                if ('class="ad-drill-panel"' in page or
                    'class="ad-stage is-drilling"' in page):
                    raise AssertionError("Regresó el panel lateral "+query)
                import re as _re
                branch_codes=_re.findall(
                    r'<g class="ad-branch ad-inline-node"[^>]+data-code="([^"]+)"',
                    page
                )
                if "tipo=ccaa" in query:
                    expected_all={f"{n:02d}" for n in range(1,11)}
                    if not expected_all.issubset(set(branch_codes)):
                        raise AssertionError("Faltan funciones originales en "+query)
                    if "Sin importe" not in page and "no publicado" not in page:
                        raise AssertionError("Se ocultó la falta de importes regionales")
                elif not branch_codes:
                    raise AssertionError("Faltan áreas ministeriales originales "+query)
                if 'class="ad-inline-dashed"' not in page and "tipo=ccaa" in query:
                    raise AssertionError("Faltan conexiones taxonómicas "+query)
                if "RuntimeError:" in page:
                    raise AssertionError("Error de ejecución "+query)
                print("Sankey expandido dentro del SVG validado:",query)



        finally:
            server.shutdown()
            server.server_close()
            thread.join(timeout=3)


if __name__ == "__main__":
    main()
