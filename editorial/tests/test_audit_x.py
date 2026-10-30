import csv
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from audit_x import analyze, read_observations, report_markdown


def sample(post_id, day, views, likes=0, fmt="Análisis"):
    return {
        "fecha_observacion": day,
        "post_id": post_id,
        "fecha_post": "2026-10-26",
        "formato": fmt,
        "visualizaciones": str(views),
        "me_gusta": str(likes),
        "reposts": "0",
        "respuestas": "0",
        "url": f"https://x.com/LARREALIDAD/status/{post_id}",
    }


class AuditTests(unittest.TestCase):
    def load(self, records):
        with tempfile.TemporaryDirectory() as directory:
            p = Path(directory) / "private.csv"
            with p.open("w", newline="", encoding="utf-8") as f:
                writer = csv.DictWriter(f, fieldnames=records[0].keys())
                writer.writeheader()
                writer.writerows(records)
            return read_observations(p)

    def test_multiple_captures_count_only_latest(self):
        data = self.load([sample("101", "2026-10-29", 10), sample("101", "2026-10-30", 20, likes=1),
                          sample("102", "2026-10-30", 30, fmt="Hilo")])
        out = analyze(data)
        self.assertEqual(out["posts_unicos"], 2)
        self.assertEqual(out["visualizaciones"], 50)
        self.assertEqual(out["mediana_visualizaciones"], 25)
        self.assertEqual(out["interacciones"], 1)
        self.assertEqual(out["cambios_observados"][0]["delta_visualizaciones"], 10)

    def test_rejects_wrong_url(self):
        with self.assertRaisesRegex(ValueError, "URL"):
            self.load([{**sample("101", "2026-10-30", 20), "url": "http://x.com/LARREALIDAD/status/101"}])

    def test_rejects_bad_counters(self):
        with self.assertRaisesRegex(ValueError, "entero"):
            self.load([sample("101", "2026-10-30", "-4")])

    def test_rejects_non_matching_post_id(self):
        with self.assertRaisesRegex(ValueError, "no coinciden"):
            self.load([{**sample("101", "2026-10-30", 20), "url": "https://x.com/test/status/102"}])

    def test_honest_quality_limits(self):
        out = analyze(self.load([sample("101", "2026-10-30", 0)]))
        text = report_markdown(out)
        self.assertIn("shadowban", text)
        self.assertIn("Muestra reducida", text)
        self.assertIn("N/D", text)

if __name__ == "__main__":
    unittest.main()
