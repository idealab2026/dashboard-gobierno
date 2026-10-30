#!/usr/bin/env python3
"""Análisis offline de instantáneas públicas de @LARREALIDAD.

NO accede a X, NO usa la API de X y NO recibe credenciales de Drive.
Las métricas reales se mantienen en el Google Sheet privado de IDEA LAB.
"""
from __future__ import annotations

import argparse
import csv
import json
import statistics
import sys
from collections import defaultdict
from datetime import date
from pathlib import Path
from urllib.parse import urlsplit

REQUIRED_COLUMNS = (
    "fecha_observacion", "post_id", "fecha_post", "formato",
    "visualizaciones", "me_gusta", "reposts", "respuestas", "url"
)
COUNTER_COLUMNS = ("visualizaciones", "me_gusta", "reposts", "respuestas")


def read_observations(path: Path) -> list[dict]:
    """CSV compatible con exportación de pestaña Publicaciones de Google Sheets."""
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        missing = set(REQUIRED_COLUMNS) - set(reader.fieldnames or [])
        if missing:
            raise ValueError("Columnas necesarias ausentes: " + ", ".join(sorted(missing)))
        output = []
        for number, row in enumerate(reader, start=2):
            if not any((v or "").strip() for v in row.values() if isinstance(v, str)):
                continue
            try:
                observation = dict(row)
                observation["fecha_observacion"] = date.fromisoformat(row["fecha_observacion"].strip())
                observation["fecha_post"] = date.fromisoformat(row["fecha_post"].strip())
                observation["post_id"] = row["post_id"].strip()
                observation["formato"] = (row["formato"] or "").strip() or "No clasificado"
                if not observation["post_id"]:
                    raise ValueError("post_id vacío")
                url = (row["url"] or "").strip()
                parsed = urlsplit(url)
                if parsed.scheme != "https" or parsed.hostname not in ("x.com", "twitter.com"):
                    raise ValueError("URL del post no permitida")
                if f"/status/{observation['post_id']}" not in parsed.path:
                    raise ValueError("URL y post_id no coinciden")
                for counter in COUNTER_COLUMNS:
                    value = (row[counter] or "").strip()
                    if not value.isdigit():
                        raise ValueError(f"{counter} no es un entero no negativo")
                    observation[counter] = int(value)
                if observation["fecha_post"] > observation["fecha_observacion"]:
                    raise ValueError("fecha_post posterior a fecha_observacion")
                output.append(observation)
            except (ValueError, TypeError, KeyError) as exc:
                raise ValueError(f"Fila {number}: {exc}") from exc
    return output


def analyze(observations: list[dict]) -> dict:
    """Usa la última fecha observada por post: nunca suma capturas duplicadas."""
    if not observations:
        raise ValueError("No hay observaciones")
    history = defaultdict(list)
    for obs in observations:
        history[obs["post_id"]].append(obs)
    latest = []
    changes = []
    for post_id, group in history.items():
        # Resolución determinista si se importó dos veces la misma fecha:
        # última fila del archivo prevalece y se identifica como corrección.
        group = sorted(enumerate(group), key=lambda x: (x[1]["fecha_observacion"], x[0]))
        snapshots = [entry for _, entry in group]
        latest.append(snapshots[-1])
        if snapshots[0]["fecha_observacion"] < snapshots[-1]["fecha_observacion"]:
            first = snapshots[0]
            last = snapshots[-1]
            changes.append({
                "post_id": post_id,
                "desde": first["fecha_observacion"].isoformat(),
                "hasta": last["fecha_observacion"].isoformat(),
                "delta_visualizaciones": last["visualizaciones"] - first["visualizaciones"],
                "delta_interacciones": sum(last[k] - first[k] for k in COUNTER_COLUMNS[1:]),
            })
    latest.sort(key=lambda r: (r["fecha_post"], r["post_id"]), reverse=True)
    count = len(latest)
    total_views = sum(r["visualizaciones"] for r in latest)
    total_interactions = sum(sum(r[k] for k in COUNTER_COLUMNS[1:]) for r in latest)
    groups = defaultdict(list)
    for post in latest:
        groups[post["formato"]].append(post)
    by_format = []
    for fmt, posts in sorted(groups.items()):
        views = [x["visualizaciones"] for x in posts]
        interactions = sum(sum(p[k] for k in COUNTER_COLUMNS[1:]) for p in posts)
        by_format.append({
            "formato": fmt,
            "posts": len(posts),
            "mediana_visualizaciones": statistics.median(views),
            "visualizaciones": sum(views),
            "interacciones": interactions,
            "interacciones_por_100_visualizaciones": round(100 * interactions / sum(views), 2) if sum(views) else None,
        })
    return {
        "fuente": "CSV privado exportado manualmente de IDEA LAB",
        "observaciones_importadas": len(observations),
        "posts_unicos": count,
        "fecha_ultima_observacion": max(x["fecha_observacion"] for x in observations).isoformat(),
        "visualizaciones": total_views,
        "mediana_visualizaciones": statistics.median(r["visualizaciones"] for r in latest),
        "media_visualizaciones": round(total_views / count, 2),
        "interacciones": total_interactions,
        "interacciones_por_100_visualizaciones": round(100 * total_interactions / total_views, 2) if total_views else None,
        "formatos": by_format,
        "cambios_observados": changes,
        "cobertura_limitada": count < 20,
    }


def report_markdown(result: dict) -> str:
    def fmt_rate(v):
        return "N/D" if v is None else f"{v:.2f}%"
    lines = [
        "# IDEA LAB · Auditoría descriptiva de @LARREALIDAD",
        "",
        f"Última observación: {result['fecha_ultima_observacion']}. "
        f"Posts únicos incluidos: {result['posts_unicos']}. "
        f"Filas observadas: {result['observaciones_importadas']}.",
        "",
        f"- Visualizaciones sumadas por post: **{result['visualizaciones']}**.",
        f"- Visualizaciones medianas: **{result['mediana_visualizaciones']}**.",
        f"- Interacciones visibles (likes + reposts + respuestas): **{result['interacciones']}**.",
        f"- Interacciones / visualizaciones sumadas: **{fmt_rate(result['interacciones_por_100_visualizaciones'])}**.",
        "",
        "## Por formato",
        "",
        "| Formato | Posts | Mediana de visualizaciones | Interacciones por 100 visualizaciones |",
        "|---|---:|---:|---:|",
    ]
    for v in result["formatos"]:
        fmt = v["formato"].replace("|", "\\|").replace("\n", " ")
        lines.append(f"| {fmt} | {v['posts']} | {v['mediana_visualizaciones']} | {fmt_rate(v['interacciones_por_100_visualizaciones'])} |")
    lines += ["", "## Seguimiento entre capturas", ""]
    if result["cambios_observados"]:
        for c in result["cambios_observados"]:
            lines.append(f"- Post {c['post_id']} ({c['desde']} → {c['hasta']}): "
                         f"{c['delta_visualizaciones']:+d} visualizaciones, {c['delta_interacciones']:+d} interacciones.")
    else:
        lines.append("No hay capturas de fechas distintas para un mismo post.")
    lines += [
        "",
        "## Limitaciones y calidad",
        "",
        "- **Las visualizaciones sumadas NO son audiencia única ni impresiones internas de X.**",
        "- Los resultados dependen de la selección de posts observados; no equivalen a un histórico exhaustivo.",
        "- Un hilo se desglosa en posts individuales; las métricas no deben presentarse como total del hilo.",
        "- El cociente interacciones/visualizaciones es descriptivo, no mide clics ni conversiones.",
        "- No es posible deducir shadowban, calidad del contenido ni causas algorítmicas con estos datos.",
        "- La automatización lee archivos CSV locales, **no** sesiones de X ni el Drive privado.",
    ]
    if result["cobertura_limitada"]:
        lines.append("- **Muestra reducida (<20 posts): evitar conclusiones sobre qué formato funciona mejor.**")
    return "\n".join(lines) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description="Auditoría offline gratuita de publicaciones de X")
    parser.add_argument("csv", type=Path, help="Exportación privada de pestaña Publicaciones")
    parser.add_argument("--json", action="store_true", help="Emite JSON en lugar de Markdown")
    args = parser.parse_args()
    result = analyze(read_observations(args.csv))
    if args.json:
        print(json.dumps(result, indent=2, ensure_ascii=False))
    else:
        print(report_markdown(result))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (OSError, ValueError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise SystemExit(2)
