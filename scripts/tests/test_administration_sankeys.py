"""Automated accounting checks for all ministry and CCAA Sankey data."""
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[2]
FILE = ROOT / "app/data/admin-sankeys.json"


class AdministrationSankeysContract(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = json.loads(FILE.read_text(encoding="utf-8"))

    def test_all_administrations_must_have_verified_figures_after_ci_build(self):
        # If data have not yet been materialized locally, this test is only
        # enforced in CI; production MUST ingest before running all tests.
        import os
        if not os.environ.get("CI") and not self.data["ministries"]:
            self.skipTest("Ejecutar primero build_administration_sankeys.py")
        self.assertEqual(len(self.data["ministries"]), 22)
        self.assertEqual(len(self.data["regions"]), 17)
        self.assertEqual(self.data["ministry_count"], 22)
        self.assertEqual(self.data["region_count"], 17)
        self.assertEqual(len({v["id"] for v in self.data["ministries"]}), 22)
        self.assertEqual(len({v["id"] for v in self.data["regions"]}), 17)

    def test_all_flow_amounts_reconcile_and_have_primary_source(self):
        import os
        if not os.environ.get("CI") and not self.data["ministries"]:
            self.skipTest("Ejecutar primero build_administration_sankeys.py")
        for section,kind in [("ministries","www.sepg.pap.hacienda.gob.es"),
                             ("regions","www.igae.pap.hacienda.gob.es")]:
            for item in self.data[section]:
                with self.subTest(section=section,name=item["name"]):
                    self.assertTrue(item["verified"])
                    self.assertTrue(item["source_url"].startswith("https://"+kind+"/"))
                    self.assertGreater(item["total_mill_eur"],0)
                    self.assertGreater(len(item["flows"]),0)
                    self.assertLess(abs(sum(v["value_mill_eur"] for v in item["flows"])
                                        - item["total_mill_eur"]),0.15)
                    self.assertTrue(all(v["value_mill_eur"]>=0 for v in item["flows"]))
                    if section=="regions":
                        self.assertEqual(len(item["flows"]),10)
                        self.assertIn("2024",item["year_label"])
                        self.assertIn("contabilidad nacional",item["amount_kind"])
                    else:
                        self.assertIn("2025-P",item["year_label"])
                        self.assertIn("presupuesto",item["amount_kind"])

    def test_website_does_not_mislabel_ministry_budget_as_executed(self):
        page=(ROOT/"app/administraciones.md").read_text(encoding="utf-8")
        widget=(ROOT/"app/components/administration-sankeys.js").read_text(encoding="utf-8")
        workflow=(ROOT/".github/workflows/observable-pages.yml").read_text(encoding="utf-8")
        self.assertIn("no deben sumarse",page)
        self.assertIn("22 ministerios",page)
        self.assertIn("17 comunidades autónomas",page)
        self.assertIn("Crédito presupuestario del programa", widget)
        self.assertIn("No son pagos ni obligaciones reconocidas", widget)
        self.assertIn("python scripts/build_administration_sankeys.py",workflow)
        self.assertLess(workflow.index("python scripts/build_administration_sankeys.py"),
                        workflow.index('python -m unittest discover'))

    def test_homepage_has_two_live_selectors_and_national_fallback(self):
        source=(ROOT/"app/index.md").read_text(encoding="utf-8")
        widget=(ROOT/"app/components/administration-sankeys.js").read_text(encoding="utf-8")
        self.assertIn('id="il-ministry-sankey"',source)
        self.assertIn('id="il-region-sankey"',source)
        self.assertIn('id="il-sankey-scope-status"',source)
        self.assertIn('España · conjunto',source)
        self.assertIn('const administrationSankeyData = await FileAttachment("./data/admin-sankeys.json").json()',source)
        self.assertIn('ministrySelect.addEventListener("change"',source)
        self.assertIn('regionSelect.addEventListener("change"',source)
        self.assertIn('sankeyHost.replaceChildren(spotlightSankey)',source)
        self.assertIn('sankeyHost.replaceChildren(AdministrationSankeys(',source)
        self.assertIn('embedded:true,mode,selectedId:chosen.id',source)
        self.assertIn('if(!embedded)root.append(tabs)',widget)
        self.assertIn('if(!embedded)root.append(chooser)',widget)

    def test_scope_changing_never_fabricates_fiscal_flow_or_merges_administrations(self):
        source=(ROOT/"app/index.md").read_text(encoding="utf-8")
        self.assertIn('regionSelect.value=""',source)
        self.assertIn('ministrySelect.value=""',source)
        self.assertIn('mode==="ministries"?"2025-P":"2024"',source)
        self.assertIn('No es el desglose de ingresos del Estado español',source)
        self.assertIn('const spotlightSankey = PublicFinanceExplorer(',source)
        self.assertLess(source.index('id="il-ministry-sankey"'),source.index('const spotlightSankey = PublicFinanceExplorer('))

    def test_multilevel_drilldown_has_visible_breadcrumb_and_terminal_state(self):
        widget=(ROOT/"app/components/administration-sankeys.js").read_text(encoding="utf-8")
        self.assertIn('root.dataset.drillLevel=selectedLeaf?"terminal":selectedGroup?"detalle":"general"',widget)
        self.assertIn('"ad-breadcrumbs"',widget)
        self.assertIn('function openBranch(branch)',widget)
        self.assertIn('g.addEventListener("click",()=>openBranch(b))',widget)
        self.assertIn('graphic.append(drawFlow({',widget)
        self.assertIn('total_mill_eur:sectionTotal',widget)
        self.assertNotIn('name:"Resto de programas de la sección"',widget)
        self.assertIn('"ad-region-drill"',widget)
        self.assertIn('"ad-subgroups"',widget)
        self.assertIn('importe autonómico',widget)
        self.assertIn('selectedLeaf=null;render();',widget)
        self.assertIn('selectedLeaf=program',widget)

    def test_regional_cofog_subgroups_never_inherit_national_amounts(self):
        importer=(ROOT/"scripts/build_administration_sankeys.py").read_text(encoding="utf-8")
        self.assertIn('def cofog_group_labels():',importer)
        self.assertIn('"cofog_group_labels":cofog_group_labels()',importer)
        self.assertIn('{"code":code,"name":r["indicador"]}',importer)
        self.assertNotIn('"value_mill_eur":r["valor"]',importer)
        import os
        if os.environ.get("CI"):
            for section,items in self.data["cofog_group_labels"].items():
                self.assertEqual(len(section),2)
                self.assertTrue(items)
                for item in items:
                    self.assertTrue(item["code"].startswith(section+"."))
                    self.assertNotIn("value_mill_eur",item)

    def test_official_ministries_and_regional_original_sources_remain_separate(self):
        self.assertIn("no se suman ni se comparan",self.data["not_comparable"])
        self.assertIn("sepg.pap.hacienda.gob.es",self.data["ministries_source"])
        self.assertIn("igae.pap.hacienda.gob.es",self.data["regions_source"])


if __name__=="__main__":
    unittest.main()
