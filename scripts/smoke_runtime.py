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
                raise AssertionError(f"Runtime incompleto: {checks}; HTML chars={len(dom)}")
            print(f"Observatorio OK en Chrome: {checks}")

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
                "Documentos oficiales indexados": 'class="sf-record"' in search_dom,
                "Campo de texto": 'type="search"' in search_dom,
                "Proyectos de AECID": "Prevención de la violencia" in search_dom,
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
                             "No equivale a gasto ejecutado"):
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

            # Deep browser checks: each Sankey branch must advance in place to
            # a visible next stage and reach an explicit final evidence level.
            for query,expected_level,expected_code,required in [
                ("?tipo=ccaa&id=10&nivel=funcion&codigo=07","detalle","07",
                 ("Extremadura","2.333","Subfunciones oficiales",
                  "sin importes autonómicos","ad-subgroup")),
                ("?tipo=ccaa&id=10&nivel=subfuncion&codigo=07.3","terminal","07.3",
                 ("Extremadura","Importe territorial no disponible",
                  "La serie autonómica COFOG 2024","presupuestos y programas autonómicos")),
                ("?tipo=ministerio&id=17&nivel=area&codigo=4","detalle","4",
                 ("Transportes y Movilidad Sostenible","programa presupuestario real","Vista general")),
                ("?tipo=ministerio&id=17&nivel=programa&codigo=453C","terminal","453C",
                 ("Crédito presupuestario del programa","No son pagos ni obligaciones reconocidas",
                  "Consultar tabla ministerial en Hacienda"))
            ]:
                deep_url=f"http://127.0.0.1:{server.server_port}/{BASE}/administraciones.html"+query
                browser=subprocess.run(
                    [*args[:-1],"--virtual-time-budget=14000",deep_url],
                    text=True,capture_output=True,timeout=85
                )
                if browser.returncode:
                    raise AssertionError("Fallo Chrome en subnivel: "+query)
                page=browser.stdout
                for fragment in required:
                    if fragment not in page:
                        raise AssertionError("Falta siguiente nivel "+query+": "+fragment)
                if ('data-drill-level="'+expected_level+'"' not in page or
                    'data-drill-code="'+expected_code+'"' not in page):
                    raise AssertionError("No avanzó la jerarquía "+query)
                # A drill must preserve the entire source Sankey SVG. The
                # previous implementation destroyed it and rendered only a
                # standalone terminal card beneath the original position.
                if ('class="ad-flow"' not in page or
                    'class="ad-stage is-drilling"' not in page or
                    'class="ad-drill-panel"' not in page or
                    'class="ad-drill-body"' not in page):
                    raise AssertionError("Sankey original desapareció al profundizar "+query)
                import re as _re
                branches = _re.findall(r'class="ad-branch"',page)
                min_branches = 10 if "tipo=ccaa" in query else 1  # algunas secciones tienen una sola área
                if len(branches)<min_branches:
                    raise AssertionError("Ramas originales perdidas "+query)
                if "RuntimeError:" in page:
                    raise AssertionError("Error Observable en nivel "+query)
                print("Desglose de administración validado:",query)



        finally:
            server.shutdown()
            server.server_close()
            thread.join(timeout=3)


if __name__ == "__main__":
    main()
