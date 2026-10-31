"""Contracts for the named-spending finder: primary sources and no invented funding."""
import csv
import json
from pathlib import Path
import unittest
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[2]
ALLOWED = {
    "datos.aecid.es", "www.boe.es", "boe.es",
}


class NamedSpendingTests(unittest.TestCase):
    def setUp(self):
        self.catalogue = json.loads(
            (ROOT / "app/data/partidas-verificadas.json").read_text(encoding="utf-8")
        )
        self.records = self.catalogue["registros"]

    def test_every_named_record_has_direct_primary_source_and_amount_semantics(self):
        self.assertGreaterEqual(len(self.records), 8)
        ids = set()
        for item in self.records:
            with self.subTest(item=item.get("id")):
                self.assertTrue(item["titulo"])
                self.assertTrue(item["organismo"])
                self.assertTrue(item["pais"])
                self.assertGreaterEqual(item["anio"], 2024)
                self.assertGreater(item["importe_eur"], 0)
                self.assertIn(item["tipo"], {"intervencion", "convocatoria", "norma"})
                self.assertTrue(item["naturaleza_importe"])
                self.assertTrue(item["trazabilidad"])
                self.assertEqual(urlparse(item["fuente_url"]).scheme, "https")
                self.assertIn(urlparse(item["fuente_url"]).netloc, ALLOWED)
                self.assertNotIn(item["id"], ids)
                ids.add(item["id"])

    def test_official_examples_are_not_relabelled_as_unknown_expenses(self):
        by_id = {r["id"]: r for r in self.records}
        self.assertEqual(by_id["aecid-z03-25-01-20300"]["importe_eur"], 125000)
        self.assertEqual(by_id["aecid-z03-24-01-22500"]["importe_eur"], 200000)
        self.assertEqual(by_id["boe-2025-13130"]["importe_eur"], 550000)
        self.assertIn("Crédito de convocatoria", by_id["boe-2025-13130"]["naturaleza_importe"])
        self.assertIn("NO es un inventario exhaustivo", self.catalogue["cobertura"])

    def test_aggregate_search_is_not_confused_with_named_transfers(self):
        page = (ROOT / "app/buscador-partidas.md").read_text(encoding="utf-8")
        component = (ROOT / "app/components/partidas-search.js").read_text(encoding="utf-8")
        self.assertIn('row.clasificacion === "COFOG"', page)
        self.assertIn('row.lado === "gasto"', page)
        self.assertIn("NO sumarlos", page)
        self.assertIn("No identifica contratos", page)
        self.assertIn("ni permite identificar el impuesto", page)
        self.assertIn("Ningún dato permite afirmar qué impuesto", component)
        self.assertIn("Sin coincidencias en el índice disponible", component)
        self.assertIn("No significa que la partida no exista", component)
        self.assertIn("datos.aecid.es/lista-de-intervenciones", component)
        self.assertIn("www.infosubvenciones.es", component)

    def test_search_is_reachable_from_all_pages(self):
        for name in ("index.md", "finanzas-publicas.md", "metodologia.md",
                     "actualizaciones.md", "quienes-somos.md"):
            with self.subTest(name=name):
                source = (ROOT / "app" / name).read_text(encoding="utf-8")
                self.assertIn('href="/buscador-partidas.html"', source)
        self.assertIn('aria-current="page"', (ROOT / "app/buscador-partidas.md").read_text(encoding="utf-8"))

    def test_homepage_has_visible_search_and_preserves_sankey_priority(self):
        home = (ROOT / "app/index.md").read_text(encoding="utf-8")
        self.assertIn('class="il-quick-spending-form"', home)
        self.assertIn('action="./buscador-partidas.html" method="get"', home)
        self.assertIn('name="q"', home)
        self.assertIn('type="search"', home)
        self.assertIn('aria-labelledby="il-quick-spending-heading"', home)
        self.assertLess(
            home.index('<div id="inicio"'),
            home.index('class="il-quick-spending"')
        )
        self.assertLess(
            home.index('class="il-quick-spending"'),
            home.index('<section id="mapa-dinero"')
        )
        self.assertEqual(home.count('class="il-quick-spending"'), 1)

    def test_homepage_query_prefills_full_search(self):
        page = (ROOT / "app/buscador-partidas.md").read_text(encoding="utf-8")
        component = (ROOT / "app/components/partidas-search.js").read_text(encoding="utf-8")
        self.assertIn('new URLSearchParams(window.location.search).get("q")', page)
        self.assertIn('initialQuery:', page)
        self.assertIn('initialQuery = ""', component)
        self.assertIn('input.value=typeof initialQuery==="string"?initialQuery.slice(0,180):""', component)

    def test_verification_is_not_inferred_from_generic_topic_matches(self):
        source = (ROOT / "app/components/partidas-search.js").read_text(encoding="utf-8")
        self.assertIn("Solo relación temática", source)
        self.assertIn("Los resultados temáticos no prueban financiación", source)
        self.assertIn("No significa que la partida no exista", source)
        self.assertIn('target="_blank"', source) if 'target="_blank"' in source else self.assertIn('a.target="_blank"', source)


if __name__ == "__main__":
    unittest.main()
