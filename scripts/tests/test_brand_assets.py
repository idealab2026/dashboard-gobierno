"""Public IDEA LAB identity and favicon contract, without image dependencies."""
from pathlib import Path
from xml.etree import ElementTree
import unittest

ROOT = Path(__file__).resolve().parents[2]
PAGES = ("index.md", "finanzas-publicas.md",
         "quienes-somos.md", "metodologia.md", "actualizaciones.md")


class IDEAAssetsTests(unittest.TestCase):
    def test_vector_assets_are_well_formed_and_safe(self):
        for filename in ("logo-idea-lab.svg", "favicon.svg"):
            with self.subTest(asset=filename):
                source = (ROOT / "app" / filename).read_text(encoding="utf-8")
                svg = ElementTree.fromstring(source)
                self.assertTrue(svg.tag.endswith("svg"))
                self.assertIn("IDEA LAB", source)
                self.assertNotIn("<script", source.lower())
                # XML SVG namespace uses the canonical http:// URL and is safe.
                # Only block externally fetched resources or hyperlinks.
                self.assertNotIn('href="http://', source.lower())
                self.assertNotIn('href="https://', source.lower())

    def test_logo_present_in_all_public_headers(self):
        for page in PAGES:
            with self.subTest(page=page):
                source = (ROOT / "app" / page).read_text(encoding="utf-8")
                self.assertIn('src="./logo-idea-lab.svg"', source)
                self.assertIn('alt="IDEA LAB"', source)

    def test_favicon_in_global_head(self):
        config = (ROOT / "observablehq.config.js").read_text(encoding="utf-8")
        self.assertIn('rel="icon"', config)
        self.assertRegex(config, r'href="\./favicon\.svg(?:\?v=[^"]+)?"')
        self.assertIn('name="theme-color"', config)


if __name__ == "__main__":
    unittest.main()
