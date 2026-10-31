"""Contract: Cloudflare Web Analytics only for IDEA LAB observatory."""
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[2]
EXPECTED_BEACON_TOKEN = "6fbdc8b6250b4bcba242121576b1e5f7"
PAGES = (
    "index.md",
    "finanzas-publicas.md",
    "buscador-partidas.md",
    "metodologia.md",
    "actualizaciones.md",
    "quienes-somos.md",
)


class CloudflareWebAnalyticsContract(unittest.TestCase):
    def test_one_beacon_in_shared_observatory_head(self):
        config = (ROOT / "observablehq.config.js").read_text(encoding="utf-8")
        self.assertEqual(config.count("https://static.cloudflareinsights.com/beacon.min.js"), 1)
        self.assertIn('<script type="module"', config)
        self.assertIn('data-cf-beacon=\'{"token":"' + EXPECTED_BEACON_TOKEN + '"}\'', config)
        self.assertIn('root: "app"', config)
        self.assertIn('base: "/dashboard-gobierno/"', config)

    def test_legacy_goatcounter_not_loaded_or_referenced_by_pages(self):
        self.assertFalse((ROOT / "app/components/site-analytics.js").exists())
        for name in PAGES:
            page = (ROOT / "app" / name).read_text(encoding="utf-8")
            self.assertNotIn("installSiteAnalytics", page, name)
            self.assertNotIn("site-analytics.js", page, name)
            self.assertNotIn("goatcounter", page.lower(), name)
            self.assertNotIn("static.cloudflareinsights.com", page, name)

    def test_no_sensitive_parameters_or_custom_event_claims_in_beacon(self):
        config = (ROOT / "observablehq.config.js").read_text(encoding="utf-8")
        beacon = re.search(r'<script[^>]+beacon\.min\.js[^>]+></script>', config)
        self.assertIsNotNone(beacon)
        self.assertNotRegex(beacon.group(0), r'(?i)(auth|secret|password|apikey|api_key|visitor_id)')
        self.assertNotIn('goatcounter', config.lower())

    def test_custom_sankey_events_are_only_local_hooks(self):
        file = (ROOT / "app/components/public-finance-sankey.js").read_text(encoding="utf-8")
        self.assertIn('new CustomEvent("idealab:analytics"', file)
        self.assertNotIn("goatcounter", file.lower())


if __name__ == "__main__":
    unittest.main()
