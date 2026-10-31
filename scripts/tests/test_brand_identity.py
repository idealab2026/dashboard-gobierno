"""Comprobaciones de la identidad institucional pública de IDEA LAB."""
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[2]


class BrandIdentityTests(unittest.TestCase):
    def test_product_and_parent_brand_are_distinct(self):
        home = (ROOT / "app" / "index.md").read_text(encoding="utf-8")
        self.assertIn("UN PRODUCTO DE IDEA LAB", home)
        self.assertIn("<h1>España en Datos</h1>", home)
        self.assertIn("Nuestro observatorio económico, social e institucional", home)
        self.assertIn('href="/quienes-somos.html"', home)

    def test_about_page_and_independence(self):
        about = (ROOT / "app" / "quienes-somos.md").read_text(encoding="utf-8")
        for literal in ("Quiénes somos", "Somos IDEA LAB", "España en Datos", "LAREALIDAD", "No representamos a ninguna administración pública"):
            self.assertIn(literal, about)
        self.assertNotIn("somos una empresa registrada", about.lower())

    def test_finances_and_methodology_have_about_link(self):
        for name in ("finanzas-publicas.md", "metodologia.md", "actualizaciones.md"):
            content = (ROOT / "app" / name).read_text(encoding="utf-8")
            self.assertIn("/quienes-somos.html", content)

    def test_all_pages_can_return_to_main_menu(self):
        """Canonical links must work even with trailing slashes or deep URLs."""
        pages = (
            "index.md",
            "finanzas-publicas.md",
            "metodologia.md",
            "actualizaciones.md",
            "quienes-somos.md",
        )
        for page in pages:
            with self.subTest(page=page):
                text = (ROOT / "app" / page).read_text(encoding="utf-8")
                self.assertIn('href="/"', text)
                self.assertNotIn('href="./"', text)
                self.assertIn("/quienes-somos.html", text)
        for page in ("metodologia.md", "actualizaciones.md", "quienes-somos.md"):
            with self.subTest(page=page):
                text = (ROOT / "app" / page).read_text(encoding="utf-8")
                self.assertIn('class="il-site-navigation"', text)
                self.assertIn('class="il-site-home"', text)
                self.assertIn('class="il-site-menu"', text)

    def test_static_github_pages_routes_use_real_files(self):
        config = (ROOT / "observablehq.config.js").read_text(encoding="utf-8")
        self.assertIn("preserveExtension: true", config)
        for page in ("index.md", "finanzas-publicas.md",
                     "actualizaciones.md", "metodologia.md", "quienes-somos.md"):
            content = (ROOT / "app" / page).read_text(encoding="utf-8")
            for slug in ("quienes-somos", "finanzas-publicas",
                         "actualizaciones", "metodologia"):
                self.assertNotIn(f'/{slug}"', content)
                self.assertNotIn(f'/{slug})', content)
                self.assertIn(f'/{slug}.html', (ROOT / "app" / "index.md").read_text(encoding="utf-8"))
            self.assertNotIn("/dashboard-gobierno/", content)

    def test_product_and_parent_brand_share_one_header_row(self):
        """Prevent regressions to two-line logos and corporate affiliations."""
        pages = (
            "index.md", "finanzas-publicas.md", "metodologia.md",
            "actualizaciones.md", "quienes-somos.md",
        )
        for page in pages:
            with self.subTest(page=page):
                source = (ROOT / "app" / page).read_text(encoding="utf-8")
                wrapper = "il-header-identity" if page in ("index.md", "finanzas-publicas.md") else "il-site-identity"
                rule = re.search(r"\\." + wrapper + r"\\s*\\{([^}]*)\\}", source)
                self.assertIsNotNone(rule, "Falta regla del contenedor de identidad")
                self.assertRegex(rule.group(1), r"flex-direction\\s*:\\s*row")
                self.assertNotRegex(rule.group(1), r"flex-direction\\s*:\\s*column")
                nav = source.split("<nav", 1)[1].split("</nav>", 1)[0]
                self.assertEqual(nav.count('href="https://idealab2026.github.io/"'), 1)
                self.assertIn('src="./logo-idea-lab.svg"', nav)
                self.assertIn('href="/"', nav)
                self.assertIn("il-parent-brand" if wrapper == "il-header-identity" else "il-site-parent", nav)

    def test_x_bio_fits_limit(self):
        content = (ROOT / "editorial" / "PERFIL_X.md").read_text(encoding="utf-8")
        result = re.search(r"^> (Somos el canal editorial de IDEA LAB\..+)$", content, flags=re.M)
        self.assertIsNotNone(result, "Falta la propuesta institucional para X")
        self.assertLessEqual(len(result.group(1)), 160)


if __name__ == "__main__":
    unittest.main()
