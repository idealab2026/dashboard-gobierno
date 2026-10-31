"""Regresión visual estática: anchura editorial y párrafos justificados en IDEA LAB."""
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[2]
PAGES = (
    "index.md",
    "finanzas-publicas.md",
    "quienes-somos.md",
    "metodologia.md",
    "actualizaciones.md",
)


class EditorialLayoutTests(unittest.TestCase):
    def test_all_public_pages_share_full_width_justified_contract(self):
        for filename in PAGES:
            with self.subTest(page=filename):
                source = (ROOT / "app" / filename).read_text(encoding="utf-8")
                self.assertIn("IDEA LAB EDITORIAL LAYOUT", source)
                self.assertIn("max-width: 1680px !important", source)
                self.assertIn("text-align: justify", source)
                self.assertIn("text-align-last: left", source)
                self.assertIn("@media (max-width: 768px)", source)
                self.assertIn("</style>", source)

    def test_home_explanations_not_limited_to_reading_column(self):
        home = (ROOT / "app" / "index.md").read_text(encoding="utf-8")
        self.assertIn(".hero-subtitle, .section-description, .section-note", home)
        self.assertIn(".il-spotlight-top > :first-child", home)
        self.assertNotIn("max-width:76ch", home)
        self.assertNotIn("max-width:840px", home)

    def test_about_uses_full_width_and_optional_two_columns(self):
        about = (ROOT / "app" / "quienes-somos.md").read_text(encoding="utf-8")
        self.assertIn(".il-about-lead, .il-about section > p", about)
        self.assertIn("grid-template-columns: repeat(2, minmax(0, 1fr))", about)
        self.assertIn("@media (min-width: 1100px)", about)
        self.assertNotIn("max-width:75ch", about)
        self.assertNotIn("max-width:1050px", about)

    def test_finance_paragraphs_expand_without_touching_sankey(self):
        finances = (ROOT / "app" / "finanzas-publicas.md").read_text(encoding="utf-8")
        self.assertIn(".pf-hero p, .pf-after-map p", finances)
        self.assertIn(".pf-explorer-host", finances)
        self.assertNotIn("max-width: 980px;", finances)


if __name__ == "__main__":
    unittest.main()
