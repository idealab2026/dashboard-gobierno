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
                rule = re.search(r"\." + wrapper + r"\s*\{([^}]*)\}", source)
                self.assertIsNotNone(rule, "Falta regla del contenedor de identidad")
                self.assertRegex(rule.group(1), r"flex-direction\s*:\s*row")
                self.assertNotRegex(rule.group(1), r"flex-direction\s*:\s*column")
                nav = source.split("<nav", 1)[1].split("</nav>", 1)[0]
                self.assertEqual(nav.count('href="https://idealab2026.github.io/"'), 1)
                self.assertIn('src="./logo-idea-lab.svg"', nav)
                self.assertIn('href="/"', nav)
                self.assertIn("il-parent-brand" if wrapper == "il-header-identity" else "il-site-parent", nav)

    def test_homepage_has_single_sankey_section_divider(self):
        """Prevent the grey hero rule from reappearing beside the gold Sankey rule."""
        home = (ROOT / "app" / "index.md").read_text(encoding="utf-8")
        self.assertIn("border-top:3px solid #b89b5e", home)
        self.assertRegex(home, r"\.hero\s*\{[^}]*border-bottom:\s*0")
        self.assertIn(">Ver análisis completo</a>", home)
        self.assertNotIn(">Ver análisis completo ↗</a>", home)

    def test_finance_tables_and_note_share_layout_axis(self):
        """Footnote must render in the tables' own block; COFOG must not stretch."""
        home = (ROOT / "app" / "index.md").read_text(encoding="utf-8")
        self.assertIn('financeSection.append(financePair);', home)
        self.assertIn('financeSection.append(financeNote);', home)
        self.assertIn('display(financeSection);', home)
        self.assertNotIn('<div class="il-spotlight-footnote">', home)
        self.assertRegex(home, r"\.il-public-finance-pair\s*\{[^}]*align-items:\s*start")
        self.assertIn('methodologyLink.href = "/metodologia.html"', home)
        self.assertIn('updatesLink.href = "/actualizaciones.html"', home)

    def test_espana_en_un_minuto_is_visible_before_detail_tables(self):
        """KPI summary must follow the Sankey, not the two long finance tables."""
        home = (ROOT / "app" / "index.md").read_text(encoding="utf-8")
        self.assertIn("<h2>España en un minuto</h2>", home)
        self.assertIn('header.id = "resumen"', home)
        self.assertLess(home.index("display(spotlightSankey);"), home.index('header.id = "resumen"'))
        self.assertLess(home.index("display(seccionContainer);"), home.index('const financePair = document.createElement("div")'))
        self.assertLess(home.index("display(seccionContainer);"), home.index("display(financeSection);"))
        self.assertIn('href="#resumen"', home)

    def test_public_finance_download_buttons_are_hidden_everywhere(self):
        """CSV and Excel actions are deliberately absent from the public UI."""
        component = (ROOT / "app" / "components" / "public-finance-sankey.js").read_text(encoding="utf-8")
        for identifier in ("csvAnchor", "xlsxAnchor", "mobileCsv", "mobileExcel",
                           "downloadBranch", "downloadCsv", "Descargar CSV",
                           "Descargar Excel", "Excel completo", "Fuentes y descargas"):
            self.assertNotIn(identifier, component)
        self.assertIn('mobileSummary.textContent = "ⓘ Fuentes y metodología"', component)
        self.assertIn('methodologyButton.textContent = "Metodología y fuentes"', component)
        for page in ("index.md", "finanzas-publicas.md"):
            content = (ROOT / "app" / page).read_text(encoding="utf-8")
            self.assertNotIn("workbookUrl:", content)
            self.assertNotIn("dataUrl:", content)

    def test_navigation_dropdowns_use_hover_on_desktop_and_click_on_touch(self):
        """Open on pointer enter; close when the cursor leaves or clicks outside."""
        for page in ("index.md", "finanzas-publicas.md"):
            with self.subTest(page=page):
                content = (ROOT / "app" / page).read_text(encoding="utf-8")
                self.assertIn('const navDropdowns =', content)
                self.assertIn('item.addEventListener("pointerenter"', content)
                self.assertIn('item.addEventListener("pointerleave"', content)
                self.assertIn('event.pointerType !== "mouse"', content)
                self.assertIn('pointerCanHover.matches', content)
                self.assertIn('item.open = false', content)
                self.assertIn('top:100%!important', content)
                self.assertIn('const compactNav = document.querySelector(".idealab-nav-mobile")', content)
                self.assertIn('event.key === "Escape"', content)

    def test_observable_reactive_cells_do_not_form_finance_kpi_cycle(self):
        """The browser runtime is reactive: build success alone does not catch cycles.

        Dashboard definitions use pensions/Sankey data, so the Sankey cell
        must not import indicators or KPI functions from the dashboard cell.
        """
        home = (ROOT / "app" / "index.md").read_text(encoding="utf-8")
        cells = re.findall(r"```js\n([\s\S]*?)\n```", home)
        self.assertGreaterEqual(len(cells), 6, "La portada debe separar celdas de datos, Sankey y KPIs")
        data_cells = [i for i, cell in enumerate(cells) if "function renderMetricSection(" in cell]
        finance_cells = [i for i, cell in enumerate(cells) if "const spotlightFinanceRaw =" in cell]
        kpi_cells = [i for i, cell in enumerate(cells) if 'header.id = "resumen"' in cell]
        table_cells = [i for i, cell in enumerate(cells) if 'const financePair = document.createElement("div")' in cell]
        self.assertEqual([len(data_cells), len(finance_cells), len(kpi_cells), len(table_cells)], [1, 1, 1, 1])
        dashboard, finance, kpi, tables = (data_cells[0], finance_cells[0], kpi_cells[0], table_cells[0])
        self.assertNotEqual(finance, kpi, "El Sankey y los KPI no pueden estar en la misma celda reactiva")
        self.assertNotEqual(finance, tables, "El Sankey y el detalle deben ser celdas separadas")
        self.assertLess(finance, kpi)
        self.assertLess(kpi, tables)
        self.assertIn("pensionMonthlyRows", cells[dashboard])
        self.assertIn("const pensionMonthlyRows =", cells[finance])
        for name in ("KpiCard", "indicatorsToShow", "spainData", "renderMetricSection",
                     "kpiPresentation", "getTitle(", "formatter(", "isPercentage("):
            self.assertNotIn(name, cells[finance], f"Dependencia circular desde Sankey: {name}")
        self.assertIn("display(spotlightSankey);", cells[finance])
        self.assertIn("display(seccionContainer);", cells[kpi])
        self.assertIn("display(financeSection);", cells[tables])

    def test_one_minute_dashboard_is_first_in_thematic_dropdown(self):
        """The overview needs a discoverable menu item, not only an anchor target."""
        for page, target in (("index.md", "#resumen"),
                             ("finanzas-publicas.md", "/#resumen")):
            with self.subTest(page=page):
                source = (ROOT / "app" / page).read_text(encoding="utf-8")
                nav = source.split("<nav", 1)[1].split("</nav>", 1)[0]
                dropdown = nav.split('<div class="idealab-nav-areas-panel">', 1)[1]
                self.assertRegex(
                    dropdown,
                    r'^\s*<a class="il-areas-overview" href="' +
                    re.escape(target) + r'">España en un minuto</a>'
                )
                self.assertEqual(nav.count(f'href="{target}">España en un minuto'), 2)
                self.assertNotIn(">Indicadores</a>", nav)
                self.assertIn(f'href="{target.replace("resumen", "economia")}">Economía</a>', nav)
                self.assertIn("pointerenter", source)
        home = (ROOT / "app" / "index.md").read_text(encoding="utf-8")
        self.assertIn('header.id = "resumen"', home)
        for page in ("metodologia.md", "actualizaciones.md", "quienes-somos.md"):
            source = (ROOT / "app" / page).read_text(encoding="utf-8")
            nav = source.split("<nav", 1)[1].split("</nav>", 1)[0]
            self.assertEqual(nav.count('href="/#resumen">España en un minuto</a>'), 1)

    def test_x_bio_fits_limit(self):
        content = (ROOT / "editorial" / "PERFIL_X.md").read_text(encoding="utf-8")
        result = re.search(r"^> (Somos el canal editorial de IDEA LAB\..+)$", content, flags=re.M)
        self.assertIsNotNone(result, "Falta la propuesta institucional para X")
        self.assertLessEqual(len(result.group(1)), 160)


if __name__ == "__main__":
    unittest.main()
