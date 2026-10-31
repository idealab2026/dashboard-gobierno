"""Cobertura de COFOG ONU 1999 y de programas documentales, sin cifras imputadas."""
import csv
import json
import pathlib
import re
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[2]
TAXONOMY = ROOT / "app/components/cofog-structure.js"
PROGRAMS = ROOT / "app/components/official-budget-catalog.js"
FACTS = ROOT / "app/data/seed/fact_finanzas_publicas_2024.csv"


def js_literal(path, pattern):
    match = re.search(pattern, path.read_text(encoding="utf-8"))
    if not match:
        raise AssertionError(f"Falta literal comprobable en {path.name}")
    return json.loads(match.group(1))


class COFOGCoverageTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.structure = js_literal(
            TAXONOMY, r"const STRUCTURE = (\[.+\]);"
        )
        cls.programs = js_literal(
            PROGRAMS, r"OFFICIAL_BUDGET_PROGRAMS=Object.freeze\((\[.+\])\);"
        )
        cls.codes = {code for code, _ in cls.structure}

    def test_complete_official_structure(self):
        groups = {code for code in self.codes if code.count(".") == 1}
        classes = {code for code in self.codes if code.count(".") == 2}
        self.assertEqual(len(groups), 69, "COFOG ONU exige 69 grupos")
        self.assertEqual(len(classes), 109, "COFOG ONU exige 109 clases")
        self.assertEqual(len(self.codes), len(self.structure), "Códigos duplicados")
        for division in range(1, 11):
            self.assertTrue(any(code.startswith(f"{division:02d}.")
                                for code in groups))
        for code in classes:
            self.assertIn(code.rsplit(".", 1)[0], groups)
        for code in groups:
            self.assertTrue(any(child.startswith(code + ".") for child in classes),
                            f"Grupo sin clases COFOG: {code}")

    def test_official_facts_not_missing_from_taxonomy(self):
        with FACTS.open("r", encoding="utf-8-sig", newline="") as source:
            for row in csv.DictReader(source, delimiter=";"):
                code = row.get("codigo", "")
                if row.get("clasificacion") == "COFOG" and code.count(".") == 1:
                    self.assertIn(code, self.codes, f"Grupo IGAE no reconocido: {code}")

    def test_road_rail_air_water_health_and_education(self):
        for code in ("04.5.1", "04.5.2", "04.5.3", "04.5.4",
                     "04.5.5", "07.1.1", "07.2.1", "07.3.1",
                     "07.3.2", "07.3.3", "07.3.4", "09.1.1",
                     "09.1.2", "10.1.2"):
            self.assertIn(code, self.codes)

    def test_budget_catalog_independent_and_evidenced(self):
        by_code = {item["codigo_presupuestario"]: item
                   for item in self.programs}
        self.assertEqual(len(by_code), 30)
        for code in ("453A", "453B", "453C", "441N", "441O", "455M", "454M"):
            self.assertIn(code, by_code)
        for row in self.programs:
            self.assertIn(row["cofog_referencia"], self.codes)
            self.assertEqual(row["anio"], 2024)
            self.assertGreater(row["importe_eur"], 0)
            self.assertTrue(row["fuente_url"].startswith(
                "https://www.sepg.pap.hacienda.gob.es/"))
            self.assertIn("prorrogado", row["importe_tipo"])

    def test_no_monies_in_taxonomy(self):
        body = TAXONOMY.read_text(encoding="utf-8")
        self.assertNotIn("importe_eur", body)
        sankey = (ROOT / "app/components/public-finance-sankey.js").read_text(
            encoding="utf-8"
        )
        self.assertIn("Sin importe", sankey)
        self.assertIn("pf-class-line", sankey)
        self.assertIn("matchingBudgetPrograms", sankey)


if __name__ == "__main__":
    unittest.main()
