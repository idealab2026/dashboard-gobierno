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
            }
            if not all(checks.values()):
                raise AssertionError(f"Runtime incompleto: {checks}; HTML chars={len(dom)}")
            print(f"Observatorio OK en Chrome: {checks}")

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

            # A genuine user path: opening the COFOG 01.3 leaf may NOT leave
            # an empty drawer. It must expose all sourced alternative routes.
            terminal_url = url + "?detalle-cofog=01.3"
            terminal_result = subprocess.run(
                [*args[:-1], "--virtual-time-budget=8000", terminal_url],
                text=True, capture_output=True, timeout=85
            )
            if terminal_result.returncode:
                raise AssertionError("Chrome no abre el detalle COFOG 01.3")
            terminal_dom = terminal_result.stdout
            for required in ("Servicios generales",
                             "Fin del desglose numérico COFOG para 01.3",
                             "1 · ¿Qué administración realizó el gasto?",
                             "2 · ¿Qué ministerio y programa presupuestario?",
                             "3 · ¿Cuánto se ejecutó o pagó?",
                             "4 · ¿Qué contrato, subvención o proyecto concreto?",
                             "iacofogCA.aspx",
                             "PGE2025Prorroga"):
                if required not in terminal_dom:
                    print("DIAGNÓSTICO COFOG 01.3:", {
                        "missing": required,
                        "body_chars": len(terminal_dom),
                        "has_drawer": 'class="pf-drawer"' in terminal_dom,
                        "has_open_state": 'class="pf-explorer is-detail-open"' in terminal_dom,
                        "has_further": '<details class="pf-drill-route"' in terminal_dom,
                        "titles": __import__("re").findall(
                            r'<h2 class="pf-detail-title"[^>]*>([^<]*)</h2>',
                            terminal_dom
                        )[:6],
                        "node_mentions": terminal_dom.count("Fin del desglose numérico COFOG para"),
                        "deep_tags": __import__("re").findall(
                            r'data-co-fog-deep-(?:code|status)="[^"]*"', terminal_dom
                        )[:10],
                        "cofog_01_3": terminal_dom.count("01.3"),
                        "has_runtime_error": "RuntimeError:" in terminal_dom,
                        "html_fragment": terminal_dom[terminal_dom.find("pf-detail")-130:
                            terminal_dom.find("pf-detail")+1500] if "pf-detail" in terminal_dom else terminal_dom[:900],
                    })
                    raise AssertionError("Rama COFOG terminal sin continuidad oficial: " + required)
            if "RuntimeError:" in terminal_dom:
                raise AssertionError("Error Runtime al profundizar en Servicios generales")
            print("Detalle COFOG 01.3 OK: cuatro rutas oficiales de continuidad")

            transport_url = url + "?detalle-cofog=04.5"
            transport_result = subprocess.run(
                [*args[:-1], "--virtual-time-budget=8000", transport_url],
                text=True, capture_output=True, timeout=85
            )
            if transport_result.returncode:
                raise AssertionError("Chrome no abre detalle de Transporte 04.5")
            transport_dom = transport_result.stdout
            for required in ("Programas presupuestarios relacionados",
                             "453B", "453C", "Ver documento presupuestario oficial",
                             "Gastos corrientes en bienes y servicios", "Inversiones reales"):
                if required not in transport_dom:
                    raise AssertionError("No hay detalle verificable de programa de Transporte: " + required)
            print("Detalle Transporte 04.5 OK: programas 453B/453C y capítulos respaldados")

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


        finally:
            server.shutdown()
            server.server_close()
            thread.join(timeout=3)


if __name__ == "__main__":
    main()
