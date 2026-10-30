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
        self.assertIn('href="./quienes-somos"', home)

    def test_about_page_and_independence(self):
        about = (ROOT / "app" / "quienes-somos.md").read_text(encoding="utf-8")
        for literal in ("Quiénes somos", "Somos IDEA LAB", "España en Datos", "LAREALIDAD", "No representamos a ninguna administración pública"):
            self.assertIn(literal, about)
        self.assertNotIn("somos una empresa registrada", about.lower())

    def test_finances_and_methodology_have_about_link(self):
        for name in ("finanzas-publicas.md", "metodologia.md", "actualizaciones.md"):
            content = (ROOT / "app" / name).read_text(encoding="utf-8")
            self.assertIn("./quienes-somos", content)

    def test_x_bio_fits_limit(self):
        content = (ROOT / "editorial" / "PERFIL_X.md").read_text(encoding="utf-8")
        result = re.search(r"^> (Somos el canal editorial de IDEA LAB\..+)$", content, flags=re.M)
        self.assertIsNotNone(result, "Falta la propuesta institucional para X")
        self.assertLessEqual(len(result.group(1)), 160)


if __name__ == "__main__":
    unittest.main()
