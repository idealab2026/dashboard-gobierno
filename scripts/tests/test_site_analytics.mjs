import test from "node:test";
import assert from "node:assert/strict";
import {
  GOATCOUNTER_ENDPOINT, EVENT_NAMES, validateEndpoint,
  safePagePath, classifyLink, referrerLabel, installSiteAnalytics
} from "../../app/components/site-analytics.js";

const BASE = "https://idealab2026.github.io/dashboard-gobierno/";

test("tracking is disabled before activation and allows only a legitimate configured endpoint", () => {
  if (!GOATCOUNTER_ENDPOINT) {
    assert.equal(validateEndpoint(GOATCOUNTER_ENDPOINT), false);
    assert.equal(installSiteAnalytics(), false);
  } else {
    assert.equal(validateEndpoint(GOATCOUNTER_ENDPOINT), true);
  }
});
test("only legitimate GoatCounter HTTPS collection endpoints accepted", () => {
  assert.equal(validateEndpoint("https://idea-lab.goatcounter.com/count"), true);
  assert.equal(validateEndpoint("https://abc.example.com/count"), false);
  assert.equal(validateEndpoint("http://idea-lab.goatcounter.com/count"), false);
  assert.equal(validateEndpoint("https://idea-lab.goatcounter.com/count?token=x"), false);
});
test("no raw search queries, hash values or dynamic user paths become analytic page paths", () => {
  assert.equal(safePagePath("/dashboard-gobierno/buscador-partidas.html?q=micorreo@test"), "/buscador-partidas");
  assert.equal(safePagePath("/dashboard-gobierno/#economia"), "/");
  assert.equal(safePagePath("/dashboard-gobierno/finanzas-publicas.html"), "/finanzas-publicas");
  assert.equal(safePagePath("/dashboard-gobierno/random/private"), "/otras");
});
test("specific navigation, external links, downloads and X are grouped safely", () => {
  assert.equal(classifyLink("#mapa-dinero", BASE), "nav_mapa_dinero");
  assert.equal(classifyLink("finanzas-publicas.html", BASE), "nav_finanzas_publicas");
  assert.equal(classifyLink("buscador-partidas.html?q=private", BASE), "nav_buscador_partidas");
  assert.equal(classifyLink("https://x.com/LARREALIDAD", BASE), "outbound_x");
  assert.equal(classifyLink("https://idealab2026.github.io/", BASE), "outbound_idea_lab");
  assert.equal(classifyLink("https://www.ine.es/x", BASE), "outbound_fuente");
  assert.equal(classifyLink("_file/data/public-finance-1.csv", BASE), "download_csv");
  assert.equal(classifyLink("files/public-finance.xlsx", BASE), "download_excel");
  assert.equal(classifyLink("mailto:a@example.org", BASE), null);
});
test("referral paths, query and private data are discarded", () => {
  assert.equal(referrerLabel("https://x.com/someone/status/123?secret=abc"), "x.com");
  assert.equal(referrerLabel("https://example.com/private?id=5"), "example.com");
  assert.equal(referrerLabel("invalid"), "");
});
test("events are explicitly whitelisted", () => {
  assert.equal(EVENT_NAMES.includes("sankey_desglose_gasto"), true);
  assert.equal(EVENT_NAMES.includes("busqueda_enviada"), true);
  assert.equal(EVENT_NAMES.includes("foo-from-user-input"), false);
});
