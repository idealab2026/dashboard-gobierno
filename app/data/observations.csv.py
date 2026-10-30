from pathlib import Path
import sys
sys.stdout.write((Path(__file__).resolve().parent / "seed" / "observations.csv").read_text(encoding="utf-8-sig"))
