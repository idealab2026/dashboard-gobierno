#!/usr/bin/env python3
"""IDEA LAB editorial calendar: review-only drafts, never posts to X."""
from __future__ import annotations
import argparse
from datetime import date, timedelta
import json
import os
from pathlib import Path
from urllib.parse import quote, urlsplit
from prepare_publication import validate

ROOT = Path(__file__).resolve().parent
SOURCE_DOMAINS = frozenset({"idealab2026.github.io","www.igae.pap.hacienda.gob.es"})

def all_scheduled(folder: Path = ROOT / "drafts") -> list[dict]:
    result, seen = [], set()
    for file in sorted(folder.glob("2026-11-*.json")):
        draft=json.loads(file.read_text(encoding="utf-8"))
        content, count=validate(draft)
        if not content or draft["id"] in seen or draft["id"] != file.stem:
            raise ValueError("Duplicate/mismatched editorial draft ID: "+file.name)
        seen.add(draft["id"])
        if draft.get("status") != "review_pending":
            raise ValueError("Only review_pending drafts can enter the queue")
        day=date.fromisoformat(draft["planned_date"])
        if day.isoformat()!=draft["planned_date"]:
            raise ValueError("Invalid date")
        src=urlsplit(draft.get("source_url",""))
        if src.scheme!="https" or src.hostname not in SOURCE_DOMAINS:
            raise ValueError("Untrusted source in "+file.name)
        if src.username or src.password or (src.fragment and src.hostname!="idealab2026.github.io"):
            raise ValueError("Disallowed URL fields")
        if draft.get("account")!="@LARREALIDAD":
            raise ValueError("Wrong account")
        result.append(draft)
    return sorted(result,key=lambda d:(d["planned_date"],d["id"]))

def next_posts(drafts: list[dict], today: date, window_days: int = 14) -> list[dict]:
    end=today+timedelta(days=window_days)
    return [d for d in drafts if today<=date.fromisoformat(d["planned_date"])<end]

def preview(drafts: list[dict], today: date, window_days: int = 14) -> str:
    posts=next_posts(drafts,today,window_days)
    lines=[
        "# IDEA LAB · Calendario editorial X · revisión manual",
        "",
        "**NO PUBLICADO EN X.** Se generan borradores; la publicación exige revisión humana.",
        "No se automatizan likes, respuestas, publicaciones ni seguimientos.",
        "",
        f"Revisión: {today.isoformat()} · próximos {window_days} días · {len(posts)} borradores",
        "",
    ]
    for item in posts:
        post,count=validate(item)
        intent="https://twitter.com/intent/tweet?text="+quote(post,safe="")
        lines.extend([
            f"## {item['planned_date']} · {item['theme']}",
            f"{item['format']} · {count}/280 caracteres · pendiente de revisión",
            "",
        ])
        lines.extend("> "+line if line else ">" for line in post.splitlines())
        lines.extend([
            "",
            f"[Fuente original]({item['source_url']}) · [Abrir borrador en X]({intent})",
            "",
            "Antes de publicar: comprobar fecha, magnitud, contexto y falta de duplicación.",
            "",
        ])
    if not posts:
        lines.extend(["No hay publicaciones previstas; ninguna se enviará automáticamente.",""])
    lines.append("Medir: visualizaciones a 24 y 72 h; reposts, respuestas útiles, seguidores netos y tráfico web.")
    return "\n".join(lines)+"\n"

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--today",type=date.fromisoformat,default=date.today())
    parser.add_argument("--days",type=int,default=14)
    args=parser.parse_args()
    if not 1<=args.days<=30:
        parser.error("days must be 1–30")
    output=preview(all_scheduled(),args.today,args.days)
    summary=os.environ.get("GITHUB_STEP_SUMMARY")
    if summary:
        with open(summary,"a",encoding="utf-8") as fh:
            fh.write("\n"+output)
    else:
        print(output)

if __name__=="__main__":
    main()
