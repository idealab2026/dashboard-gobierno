#!/usr/bin/env python3
"""Produce una previsualización publicable en GitHub Actions; nunca envía a X."""
from __future__ import annotations

import argparse
import json
import os
import re
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parent
DEFAULT_DRAFT = ROOT / "drafts" / "2026-10-30-presentacion-sankey.json"


def validate(draft: dict) -> tuple[str, int]:
    if draft.get("account") != "@LARREALIDAD":
        raise ValueError("Cuenta de destino inesperada")
    if draft.get("status") != "review_pending":
        raise ValueError("Solo se permiten borradores pendientes de revisión")
    content = draft.get("text")
    if not isinstance(content, str) or not content.strip():
        raise ValueError("Texto vacío")
    allowed_urls = {"https://idealab2026.github.io/dashboard-gobierno/#mapa-dinero"}
    seen_urls = re.findall(r"https?://[^\s]+", content)
    if any(url not in allowed_urls for url in seen_urls):
        raise ValueError("Solo se permite el enlace público oficial al Sankey IDEA LAB")
    n = len(content)
    if n > 280:
        raise ValueError(f"Texto demasiado largo: {n}/280")
    return content, n


def render(draft: dict) -> str:
    text, n = validate(draft)
    intent_url = "https://twitter.com/intent/tweet?text=" + quote(text, safe="")
    return "\n".join([
        "## Prueba editorial @LARREALIDAD · SOLO PREVISUALIZACIÓN",
        "",
        "**NO PUBLICADO EN X.** La automatización solo prepara un borrador; la publicación",
        "requiere abrir X con la cuenta correcta y pulsar Publicar personalmente.",
        "",
        f"**Borrador:** `{draft['id']}` · **Longitud:** {n}/280 caracteres",
        "",
        "```text",
        text,
        "```",
        "",
        f"[Abrir borrador en el editor oficial de X]({intent_url})",
        "",
        "**Control de seguridad:** sin API de pago, sin claves de X, sin scripts en navegador,",
        "sin likes/respuestas/seguimientos automáticos. La URL solo abre el compositor.",
        "",
    ])


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--draft", type=Path, default=DEFAULT_DRAFT)
    args = parser.parse_args()
    draft = json.loads(args.draft.read_text(encoding="utf-8"))
    result = render(draft)
    summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary:
        with open(summary, "a", encoding="utf-8") as f:
            f.write(result)
    else:
        print(result)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
