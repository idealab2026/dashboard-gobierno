---
title: Dinero público
theme: light
sidebar: false
toc: false
footer: By Idea Lab - OBSERVATORIO ESTADÍSTICO
---

<style>
:root {
  --idealab-navy: #0b2447;
  --idealab-blue: #19376d;
  --idealab-gold: #b89b5e;
  --idealab-cream: #f8f5ef;
  --idealab-border: #e3e6ea;
  --idealab-muted: #667085;
}

.observablehq {
  width: 100%;
  max-width: 1680px;
  margin: 0 auto;
  padding-left: clamp(16px, 3vw, 48px);
  padding-right: clamp(16px, 3vw, 48px);
  box-sizing: border-box;
}

/*
 * Observable aplica un max-width de lectura a ciertos bloques de Markdown.
 * El componente interactivo debe vivir en un host HTML explícito para no
 * heredar ese ancho de prosa y poder ocupar todo el ancho de la página.
 */
.pf-explorer-host {
  width: 100%;
  max-width: none;
  min-width: 0;
  margin: 0;
  padding: 0;
}
.pf-explorer-host > .pf-explorer {
  width: 100%;
  max-width: none;
  min-width: 0;
}

html {
  scroll-behavior: smooth;
  font-size: 16px;
  color-scheme: light;
}

body {
  background: #fff;
  color: var(--idealab-navy);
}

/* La aplicación usa una única navegación horizontal propia. */
.idealab-nav {
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding: .9rem 1.5rem;
  background: rgba(255,255,255,.96);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--idealab-border);
}

.idealab-brand {
  flex-shrink: 0;
  color: var(--idealab-navy) !important;
  text-decoration: none !important;
  font-size: .9rem;
  font-weight: 800;
  letter-spacing: .045em;
}

.idealab-nav-links {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  overflow-x: auto;
  scrollbar-width: none;
  white-space: nowrap;
}
.idealab-nav-links::-webkit-scrollbar { display: none; }
.idealab-nav-links a {
  color: var(--idealab-muted) !important;
  text-decoration: none !important;
  font-size: .84rem;
  font-weight: 650;
}
.idealab-nav-links a:hover,
.idealab-nav-links a.is-active {
  color: var(--idealab-navy) !important;
}
.idealab-nav-links a.is-active {
  font-weight: 800;
}

.pf-hero {
  padding: 1.5rem 0 .55rem;
}
.pf-kicker {
  color: var(--idealab-gold);
  font-size: .78rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .12em;
}
.pf-hero h1 {
  color: var(--idealab-navy);
  font-size: clamp(2.45rem, 4.8vw, 4rem);
  line-height: 1;
  margin: .5rem 0 .75rem;
}
.pf-hero p {
  color: var(--idealab-muted);
  max-width: 980px;
  line-height: 1.55;
  margin: 0;
  font-size: .97rem;
}

.pf-summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0,1fr));
  gap: .75rem;
  margin: 1.1rem 0 1.35rem;
}
.pf-summary-card {
  background: #fff;
  border: 1px solid var(--idealab-border);
  border-radius: 12px;
  padding: 1rem 1.05rem;
  box-shadow: 0 2px 10px rgba(11,36,71,.025);
}
.pf-summary-label {
  color: var(--idealab-muted);
  text-transform: uppercase;
  letter-spacing: .06em;
  font-size: .7rem;
  font-weight: 800;
}
.pf-summary-value {
  color: var(--idealab-navy);
  font-size: 1.48rem;
  font-weight: 800;
  margin-top: .3rem;
}
.pf-summary-note {
  color: var(--idealab-muted);
  font-size: .71rem;
  margin-top: .2rem;
}

.pf-section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  margin: .7rem 0 .2rem;
}
.pf-section-heading h2 {
  color: var(--idealab-navy);
  margin: 0;
  font-size: 1.45rem;
}
.pf-section-heading p {
  color: var(--idealab-muted);
  margin: 0;
  font-size: .78rem;
  text-align: right;
}

.pf-after-map {
  display: grid;
  grid-template-columns: repeat(2, minmax(0,1fr));
  gap: .75rem;
  margin: 1.2rem 0 2rem;
}
.pf-after-map details {
  border: 1px solid var(--idealab-border);
  border-radius: 10px;
  background: #fff;
  padding: .75rem .9rem;
  color: var(--idealab-muted);
  font-size: .8rem;
  line-height: 1.55;
}
.pf-after-map summary {
  cursor: pointer;
  color: var(--idealab-navy);
  font-weight: 800;
}
.pf-after-map p { margin: .65rem 0 0; }
.pf-after-map code { font-size: .75rem; }

@media (max-width: 900px) {
  .idealab-nav {
    flex-direction: column;
    align-items: flex-start;
    gap: .55rem;
    padding: .75rem 1rem;
  }
  .idealab-nav-links { width: 100%; }
  .pf-summary-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
  .pf-section-heading { align-items: flex-start; flex-direction: column; }
  .pf-section-heading p { text-align: left; }
  .pf-after-map { grid-template-columns: 1fr; }
}

@media (max-width: 560px) {
  .pf-summary-grid { grid-template-columns: 1fr 1fr; }
  .pf-summary-value { font-size: 1.22rem; }
  .pf-summary-note { display: none; }
}

@media print {
  .idealab-nav { position: static; backdrop-filter: none; }
  .pf-summary-card,
  .pf-after-map details,
  .pf-explorer,
  .pf-layout {
    break-inside: avoid;
    page-break-inside: avoid;
  }
}
</style>

<nav class="idealab-nav">
  <a class="idealab-brand" href="./">IDEA LAB · España en datos</a>
  <div class="idealab-nav-links">
    <a href="./#resumen">Resumen</a>
    <a href="./#economia">Economía</a>
    <a href="./#empleo">Empleo</a>
    <a href="./#vivienda">Vivienda</a>
    <a href="./#estado">Sector público</a>
    <a class="is-active" href="./finanzas-publicas">Dinero público</a>
    <a href="./metodologia">Metodología</a>
    <a href="./actualizaciones">Actualización</a>
    <a href="./#pensiones">Pensiones</a>
    <a href="./#sociedad">Sociedad</a>
    <a href="./#mundo">Mundo</a>
  </div>
</nav>

<div style="margin: 0.6rem auto 1rem; max-width: 1400px; padding: 0.55rem 0.85rem; border: 1px solid #e3e6ea; border-radius: 10px; font-size: 0.84rem; color:#344054; background: #f8fafc;">Datos históricos en proceso de revisión. Algunas series están excluidas por metadatos ambiguos. <a href="./metodologia">Fuentes y limitaciones</a>.</div>

<div class="pf-hero">
  <div class="pf-kicker">IDEA LAB · Finanzas públicas</div>
  <h1>Mapa del dinero público</h1>
  <p>De dónde proceden los recursos de las Administraciones Públicas españolas y en qué se emplean. Pulsa cualquier rama para consultar su desglose, metodología y fuente oficial.</p>
</div>

```js
import {PublicFinanceExplorer} from "./components/public-finance-sankey.js";

const rawPublicFinance = await FileAttachment("./data/public-finance.csv").csv({typed: true});
const rawSources = await FileAttachment("./data/public-finance-sources.csv").csv({typed: true});
const rawTaxFigures = await FileAttachment("./data/public-finance-tax-figures.csv").csv({typed: true});

const publicFinanceDataUrl = await FileAttachment("./data/public-finance.csv").url();
const publicFinanceWorkbookUrl = await FileAttachment("./data/public-finance.xlsx").url();

const publicFinance = rawPublicFinance
  .map(d => ({...d, year:Number(d.year), value:Number(d.value)}))
  .filter(d => Number.isFinite(d.year) && Number.isFinite(d.value));

const completeYears = [...new Set(
  publicFinance
    .filter(d =>
      d.parent_code === "S13.GASTO" &&
      d.side === "gasto" &&
      String(d.level) === "1"
    )
    .map(d => d.year)
)].sort((a,b) => b-a);

const displayYear = completeYears[0];
const yearRows = publicFinance.filter(d => d.year === displayYear);
const byCode = new Map(yearRows.map(d => [d.code, d]));

const summaryValues = {
  resources: byCode.get("S13.RECURSOS")?.value,
  deficit: byCode.get("S13.DEFICIT")?.value,
  spending: byCode.get("S13.GASTO")?.value,
  pensions: byCode.get("PENS")?.value
};

const fmtM = value => Number.isFinite(value)
  ? `${new Intl.NumberFormat("es-ES", {maximumFractionDigits:0}).format(value)} M€`
  : "—";
```

<div class="pf-summary-grid">
  <div class="pf-summary-card">
    <div class="pf-summary-label">Recursos públicos</div>
    <div class="pf-summary-value">${fmtM(summaryValues.resources)}</div>
    <div class="pf-summary-note">Administraciones Públicas S.13 · ${displayYear}</div>
  </div>
  <div class="pf-summary-card">
    <div class="pf-summary-label">Déficit / financiación</div>
    <div class="pf-summary-value">${fmtM(summaryValues.deficit)}</div>
    <div class="pf-summary-note">Necesidad de financiación · ${displayYear}</div>
  </div>
  <div class="pf-summary-card">
    <div class="pf-summary-label">Gasto público</div>
    <div class="pf-summary-value">${fmtM(summaryValues.spending)}</div>
    <div class="pf-summary-note">Gasto consolidado · COFOG</div>
  </div>
  <div class="pf-summary-card">
    <div class="pf-summary-label">Pensiones</div>
    <div class="pf-summary-value">${fmtM(summaryValues.pensions)}</div>
    <div class="pf-summary-note">Corte analítico dentro de Protección social</div>
  </div>
</div>

<div class="pf-section-heading" id="mapa">
  <h2>Ingresos → Administraciones Públicas → gasto</h2>
  <p>${displayYear} · sector consolidado S.13 · clasificación funcional COFOG</p>
</div>

```js
const explorer = PublicFinanceExplorer(
  publicFinance,
  rawSources,
  rawTaxFigures,
  {
    year: displayYear,
    dataUrl: publicFinanceDataUrl,
    workbookUrl: publicFinanceWorkbookUrl
  }
);
```

<div class="pf-explorer-host">${explorer}</div>

<div class="pf-after-map">
  <details>
    <summary>Cómo leer el diagrama</summary>
    <p>Los ingresos confluyen en un fondo común. IDEA LAB no atribuye un impuesto concreto a un gasto concreto. En ingresos, el porcentaje se calcula sobre los recursos públicos; en gasto, sobre el gasto total. El déficit se representa como financiación adicional para cerrar el flujo, pero no como ingreso económico.</p>
  </details>
  <details>
    <summary>Criterio de publicación y trazabilidad</summary>
    <p>El gráfico se genera desde <code>Fact_finanzas_publicas</code>. Cada registro conserva fuente, metodología, estado y vintage. Las estadísticas con perímetros distintos se mantienen separadas en el data lake y no se fuerzan a coincidir artificialmente.</p>
  </details>
</div>
