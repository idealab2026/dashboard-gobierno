"""Public-only offline data loaders. No Google access or tokens."""
import csv
import sys
from pathlib import Path
BASE=Path(__file__).resolve().parent/"seed"
def read_table(name):
    with (BASE/name).open(encoding="utf-8-sig",newline="") as stream:
        rows=list(csv.reader(stream,delimiter=";"))
    if len(rows)<2:raise ValueError("Dataset sin filas: "+name)
    return rows,"snapshot_publico"
def emit_local(name,column_map,delimiter=";"):
    if delimiter!=";":raise ValueError("Delimitador no esperado")
    rows,_=read_table(name)
    writer=csv.writer(sys.stdout,lineterminator="\n")
    writer.writerow([column_map.get(x,x) for x in rows[0]])
    writer.writerows(rows[1:])
