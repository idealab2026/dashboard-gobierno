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
            }
            if not all(checks.values()):
                raise AssertionError(f"Runtime incompleto: {checks}; HTML chars={len(dom)}")
            print(f"Observatorio OK en Chrome: {checks}")
        finally:
            server.shutdown()
            server.server_close()
            thread.join(timeout=3)


if __name__ == "__main__":
    main()
