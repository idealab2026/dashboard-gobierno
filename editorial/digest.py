#!/usr/bin/env python3
"""Radar de fuentes públicas para revisión editorial; nunca publica en X."""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from html import unescape
from pathlib import Path
from urllib.parse import urlsplit
from urllib.request import Request, urlopen

MAX_FEED_BYTES = 2_000_000
MAX_ITEMS_PER_SOURCE = 25
USER_AGENT = "IdeaLabEditorialRadar/0.1 (public RSS research monitor)"
DEFAULT_SOURCES = Path(__file__).with_name("sources.json")


def clean(value: str, limit: int = 220) -> str:
    result = re.sub(r"\s+", " ", unescape(str(value or ""))).strip()
    return result[:limit]


def safe_https_url(value: str) -> str | None:
    url = str(value or "").strip()
    try:
        parts = urlsplit(url)
        if parts.scheme != "https" or not parts.hostname or parts.username or parts.password:
            return None
        if any(c.isspace() or ord(c) < 32 for c in url):
            return None
        return url
    except ValueError:
        return None


def _tag(node: ET.Element) -> str:
    return node.tag.rsplit("}", 1)[-1]


def _field(entry: ET.Element, name: str) -> str:
    for child in entry:
        if _tag(child) == name:
            return "".join(child.itertext()).strip()
    return ""


def parse_feed(xml: bytes) -> list[dict[str, str]]:
    root = ET.fromstring(xml)
    records = []
    for entry in root.iter():
        if _tag(entry) not in ("item", "entry"):
            continue
        title = clean(_field(entry, "title"))
        link = _field(entry, "link")
        if not link:
            for child in entry:
                if _tag(child) == "link" and child.attrib.get("rel", "alternate") == "alternate":
                    link = child.attrib.get("href", "")
                    break
        url = safe_https_url(link)
        if not title or not url:
            continue
        date = clean(_field(entry, "pubDate") or _field(entry, "published") or _field(entry, "updated"), 100)
        records.append({"title": title, "url": url, "date": date})
    return records


def fetch_feed(url: str) -> bytes:
    if not safe_https_url(url):
        raise ValueError("La fuente debe ser HTTPS y no contener credenciales")
    req = Request(url, headers={"User-Agent": USER_AGENT, "Accept": "application/rss+xml, application/atom+xml, application/xml, text/xml"})
    with urlopen(req, timeout=15) as response:
        payload = response.read(MAX_FEED_BYTES + 1)
    if len(payload) > MAX_FEED_BYTES:
        raise ValueError("RSS superior al tamaño permitido")
    return payload


def collect(sources: list[dict], fetcher=fetch_feed) -> tuple[list[dict], list[str]]:
    result, failures, seen = [], [], set()
    for source in sources:
        name = clean(source["name"], 80)
        url = source["url"]
        try:
            max_items = max(1, min(int(source.get("max_items", 8)), MAX_ITEMS_PER_SOURCE))
            items = parse_feed(fetcher(url))
            for item in items[:max_items]:
                if item["url"] not in seen:
                    seen.add(item["url"])
                    result.append({**item, "source": name})
        except (ValueError, OSError, ET.ParseError, KeyError, TypeError) as exc:
            failures.append(f"{name}: {type(exc).__name__} ({clean(str(exc), 120)})")
    return result, failures


def md_escape(value: str) -> str:
    return clean(value).replace("\\", "\\\\").replace("[", "\\[").replace("]", "\\]").replace("<", "&lt;").replace(">", "&gt;")


def render(items: list[dict], failures: list[str], timestamp: datetime) -> str:
    lines = [
        "# IDEA LAB · Radar editorial de fuentes públicas",
        "",
        f"Generado: {timestamp.astimezone(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}",
        "",
        "Este listado es una **bandeja de fuentes**, no un análisis verificado ni un borrador publicable.",
        "Antes de publicar: abrir documentos, confirmar fechas, comprobar magnitudes y contrastar contexto.",
        "No hay publicación automática, IA de pago ni acceso a datos privados.",
        "",
    ]
    if not items:
        lines.extend(["**Sin resultados comprobables. No publicar contenido a partir de esta ejecución.**", ""])
    else:
        for i, item in enumerate(items, 1):
            title = md_escape(item["title"])
            source = md_escape(item["source"])
            date = md_escape(item["date"] or "fecha no proporcionada por la fuente")
            url = item["url"].replace(")", "%29")
            lines.append(f"{i}. [{title}]({url}) — {source} · {date}")
        lines.append("")
    if failures:
        lines += ["## Incidencias de ingesta", ""]
        lines.extend(f"- {md_escape(failure)}" for failure in failures)
        lines.append("")
    lines += ["## Checklist antes de elaborar un hilo", "", "- [ ] Fuente primaria revisada y accesible", "- [ ] Fecha, unidad y alcance identificados", "- [ ] Contraste independiente cuando proceda", "- [ ] Hechos separados de inferencias y opiniones", "- [ ] Revisión humana y autorización de publicación", ""]
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description="Radar editorial gratuito de fuentes RSS")
    parser.add_argument("--sources", type=Path, default=DEFAULT_SOURCES)
    parser.add_argument("--output", type=Path, help="Archivo de salida; por defecto GITHUB_STEP_SUMMARY o stdout")
    args = parser.parse_args()
    config = json.loads(args.sources.read_text(encoding="utf-8"))
    items, failures = collect(config["sources"])
    summary = render(items, failures, datetime.now(timezone.utc))
    dest = args.output or (Path(os.environ["GITHUB_STEP_SUMMARY"]) if os.environ.get("GITHUB_STEP_SUMMARY") else None)
    if dest:
        with dest.open("a", encoding="utf-8") as fh:
            fh.write(summary)
    else:
        print(summary)
    print(f"Fuentes recogidas: {len(items)}; fuentes con error: {len(failures)}", file=sys.stderr)
    return 0 if items else 1


if __name__ == "__main__":
    raise SystemExit(main())
