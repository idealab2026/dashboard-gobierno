"""Permanent editorial layout contract for every IDEA LAB observatory iteration.

Runs in the existing GitHub Actions unittest discovery before the build.
"""
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[2]
PAGES = (
    "index.md",
    "finanzas-publicas.md",
    "metodologia.md",
    "actualizaciones.md",
    "quienes-somos.md",
)
PROSE_SELECTORS = (
    ".hero-subtitle",
    ".section-description",
    ".section-note",
    ".il-about-lead",
    ".il-spotlight-top p",
    ".il-finance-coverage > p",
    ".columna-analisis p",
)
ALLOWED_PROSE_MAX_WIDTH = ("none", "100%")


class TypographyContractTests(unittest.TestCase):
    def test_global_rule_is_loaded_for_all_framework_pages(self):
        config = (ROOT / "observablehq.config.js").read_text(encoding="utf-8")
        self.assertIn('id="il-editorial-typography-contract"', config)
        self.assertIn("text-align: justify !important", config)
        self.assertIn("text-align-last: left !important", config)
        self.assertIn("hyphens: auto", config)
        self.assertIn("width: 100% !important", config)
        self.assertIn("max-width: none !important", config)
        for selector in ("#observablehq-main", ".hero .hero-subtitle",
                         ".il-about-lead", ".section-description"):
            self.assertIn(selector, config)
        self.assertIn("scripts/tests/test_typography_contract.py",
                      (ROOT / "AGENTS.md").read_text(encoding="utf-8"))

    def test_page_css_cannot_restrict_narrative_prose_width(self):
        # Catch the precise regression that constrained the hero to 90ch.
        # Check other prose selectors too; no numeric reading-column caps.
        for name in PAGES:
            source = (ROOT / "app" / name).read_text(encoding="utf-8")
            for match in re.finditer(r"([^{}]+)\{([^{}]*)\}", source):
                selector, rules = match.groups()
                if not any(target in selector for target in PROSE_SELECTORS):
                    continue
                for size in re.findall(r"max-width\s*:\s*([^;\n}]+)", rules):
                    self.assertIn(
                        size.strip().lower().replace("!important", "").strip(),
                        ALLOWED_PROSE_MAX_WIDTH,
                        f"{name}: {selector.strip()!r} limita un párrafo a {size!r}",
                    )

    def test_hero_is_not_clipped_or_replaced_by_a_fixed_text_column(self):
        home = (ROOT / "app" / "index.md").read_text(encoding="utf-8")
        self.assertIn('class="hero-subtitle"', home)
        self.assertNotRegex(
            home,
            r"\.hero-subtitle\s*\{[^}]*max-width\s*:\s*[0-9.]+\s*(?:ch|em|rem|px)",
        )
        self.assertNotIn("max-width:90ch", home)


if __name__ == "__main__":
    unittest.main()
