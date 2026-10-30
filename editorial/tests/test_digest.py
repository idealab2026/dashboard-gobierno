import sys
import unittest
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from digest import collect, parse_feed, render, safe_https_url


RSS = b"""<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0"><channel><item><title>Primera norma</title>
<link>https://www.boe.es/boe/dias/2026/10/30/pdfs/BOE-A-2026-100.pdf</link>
<pubDate>Fri, 30 Oct 2026 07:00:00 GMT</pubDate></item>
<item><title>Enlace invalido</title><link>javascript:alert(1)</link></item>
</channel></rss>"""
ATOM = b"""<feed xmlns="http://www.w3.org/2005/Atom">
<entry><title>Comunicado BCE</title><link rel="alternate" href="https://www.ecb.europa.eu/press/test.html"/>
<updated>2026-10-30T10:00:00Z</updated></entry></feed>"""


class DigestTest(unittest.TestCase):
    def test_rss(self):
        rows = parse_feed(RSS)
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["title"], "Primera norma")

    def test_atom(self):
        rows = parse_feed(ATOM)
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["title"], "Comunicado BCE")

    def test_blocks_non_https_and_credentials(self):
        self.assertIsNone(safe_https_url("http://example.org"))
        self.assertIsNone(safe_https_url("https://user:password@example.org/x"))
        self.assertIsNone(safe_https_url("javascript:alert(1)"))

    def test_dedup_and_partial_failure(self):
        sources = [
            {"name": "BOE", "url": "https://www.boe.es/rss/boe.php"},
            {"name": "BOE duplicado", "url": "https://www.boe.es/rss/boe.php"},
            {"name": "Fallo", "url": "https://example.org/rss"},
        ]

        def fake_fetch(url):
            if "example.org" in url:
                raise OSError("network unavailable")
            return RSS

        rows, failed = collect(sources, fake_fetch)
        self.assertEqual(len(rows), 1)
        self.assertEqual(len(failed), 1)

    def test_render_human_review(self):
        rows = [{"source": "BOE", "title": "Dato", "url": "https://www.boe.es/documento", "date": ""}]
        doc = render(rows, [], datetime(2026, 10, 30, tzinfo=timezone.utc))
        self.assertIn("Revisión humana", doc)
        self.assertIn("https://www.boe.es/documento", doc)


if __name__ == "__main__":
    unittest.main()
