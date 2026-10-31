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
                self.assertIn(item["tipo"], {"intervencion", "convocatoria", "norma", "programa"})
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

    def test_road_maintenance_budget_is_published_as_prorogued_pge_not_executed(self):
        by_id = {r["id"]: r for r in self.records}
        maintenance = by_id["pge-2024-p-17-453c"]
        new_roads = by_id["pge-2024-p-17-453b"]
        self.assertEqual(maintenance["tipo"], "programa")
        self.assertEqual(maintenance["anio"], 2024)
        self.assertEqual(maintenance["importe_eur"], 1208409410)
        self.assertEqual(maintenance["codigo_presupuestario"], "453C")
        self.assertEqual(maintenance["cofog_referencia"], "04.5")
        self.assertEqual(sum(p["importe_eur"] for p in maintenance["desglose"]), maintenance["importe_eur"])
        self.assertIn("No son obligaciones reconocidas", maintenance["naturaleza_importe"])
        self.assertIn("no a todas las carreteras del país", maintenance["descripcion"])
        self.assertNotEqual(new_roads["codigo_presupuestario"], maintenance["codigo_presupuestario"])
        self.assertEqual(new_roads["importe_eur"], 1593547100)

    def test_road_maintenance_is_reachable_both_from_sankey_and_finder(self):
        sankey = (ROOT / "app/components/public-finance-sankey.js").read_text(encoding="utf-8")
        finder = (ROOT / "app/components/partidas-search.js").read_text(encoding="utf-8")
        engine = (ROOT / "app/components/spending-query.js").read_text(encoding="utf-8")
        self.assertIn('roadUrl.searchParams.set("q", "mantenimiento de carreteras")', sankey)
        self.assertIn("Mantenimiento de carreteras · 453C", sankey)
        self.assertIn('["programa","Programas presupuestarios"]', finder)
        self.assertIn('programa:"Programa de los PGE"', finder)
        self.assertIn('part.importe_eur/1000000', finder)
        self.assertIn('Conservación y mantenimiento de carreteras', finder)
        self.assertIn('carretera: "04.5"', engine)
        self.assertIn('item.tipo === "programa" ? 195', engine)

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
        self.assertIn("Correspondencia temática COFOG", source)
        self.assertIn("no son contratos ni proyectos individuales", source)
        self.assertIn("const matching=searchSpendingRecords(", source)
        matching = (ROOT / "app/components/spending-query.js").read_text(encoding="utf-8")
        self.assertIn("terms.every", matching)
        self.assertIn("if (!matchesAll) continue", matching)
        self.assertIn("aliasHit", matching)
        self.assertIn("No significa que la partida no exista", source)
        self.assertIn('target="_blank"', source) if 'target="_blank"' in source else self.assertIn('a.target="_blank"', source)


    def test_health_search_must_have_real_cofog_aliases_and_browser_coverage(self):
        component = (ROOT / "app/components/partidas-search.js").read_text(encoding="utf-8")
        aliases = (ROOT / "app/components/spending-query.js").read_text(encoding="utf-8")
        smoke = (ROOT / "scripts/smoke_runtime.py").read_text(encoding="utf-8")
        workflow = (ROOT / ".github/workflows/observable-pages.yml").read_text(encoding="utf-8")
        self.assertIn('sanidad: "07"', aliases)
        self.assertIn('hospitales: "07.3"', aliases)
        self.assertIn('medicamentos: "07.1"', aliases)
        self.assertIn('const matching=searchSpendingRecords(', component)
        self.assertIn('Sanidad corresponde a la función oficial COFOG 07', component)
        self.assertIn('q=sanidad', smoke)
        self.assertIn('node --test scripts/tests/test_spending_query.mjs', workflow)

    def test_sankey_functional_drawer_links_to_scoped_finder(self):
        sankey = (ROOT / "app/components/public-finance-sankey.js").read_text(encoding="utf-8")
        self.assertIn('new URL("buscador-partidas.html", window.location.href)', sankey)
        self.assertIn('finderUrl.searchParams.set("cofog", String(row.code))', sankey)
        self.assertIn('finderUrl.searchParams.set("anio", String(currentYear))', sankey)
        self.assertIn('u.searchParams.set("cofog", "04.5")', sankey)
        self.assertIn('u2.searchParams.set("q", "ferrocarril")', sankey)
        self.assertIn("El gasto COFOG clasifica finalidades, no ministerios", sankey)
        self.assertIn("row.side === \"gasto\"", sankey)

    def test_cofog_filter_is_code_and_year_scoped_without_inventing_project_relationship(self):
        page = (ROOT / "app/buscador-partidas.md").read_text(encoding="utf-8")
        component = (ROOT / "app/components/partidas-search.js").read_text(encoding="utf-8")
        self.assertIn('cofog_codigo: String(row.codigo)', page)
        self.assertIn('get("cofog")', page)
        self.assertIn('get("anio")', page)
        self.assertIn('initialCofog', component)
        pure_query = (ROOT / "app/components/spending-query.js").read_text(encoding="utf-8")
        self.assertIn('selectedCode + "."', pure_query)
        self.assertIn('item.tipo === "agregado"', pure_query)
        self.assertIn('Quitar filtro COFOG', component)
        self.assertIn("distinta metodología y no son sumables", component)

    def test_official_routes_for_three_independent_budget_dimensions(self):
        component = (ROOT / "app/components/partidas-search.js").read_text(encoding="utf-8")
        for expected in [
            "Por ministerio", "Por comunidad autónoma", "Ferrocarriles e infraestructuras",
            "www.igae.pap.hacienda.gob.es",
            "PublicacionLiquidaciones",
            "www.sepg.pap.hacienda.gob.es",
            "ofe_2024.pdf",
            "Un crédito presupuestario no es inversión efectivamente realizada",
            "No se calculan totales administrativos a partir de COFOG",
        ]:
            self.assertIn(expected, component)
        with (ROOT / "app/data/seed/fact_finanzas_publicas_2024.csv").open(
            encoding="utf-8-sig", newline=""
        ) as source:
            rows = list(csv.DictReader(source, delimiter=";"))
        transport = [r for r in rows if r["clasificacion"] == "COFOG" and r["codigo"] == "04.5"]
        self.assertEqual(len(transport), 1)
        self.assertEqual(transport[0]["indicador"], "Transporte")
        self.assertEqual(transport[0]["valor"], "28634")
        self.assertEqual(transport[0]["unidad"], "millones de euros")


if __name__ == "__main__":
    unittest.main()
