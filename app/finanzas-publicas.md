---
title: Dinero público
theme: light
sidebar: false
toc: false
footer: IDEA LAB · Investigación y divulgación independiente
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

.idealab-nav{gap:1rem}
.idealab-nav-links{min-width:0;justify-content:flex-end;flex-wrap:wrap;white-space:normal;overflow:visible;gap:.45rem .85rem}
.idealab-nav-links a{white-space:nowrap}
@media(max-width:900px){.idealab-nav-links{justify-content:flex-start}}

/* El mismo patrón móvil de navegación utilizado en la portada. */
.idealab-nav-mobile{display:none;}
@media(max-width:768px){
  html,body{max-width:100%;overflow-x:clip;}
  .observablehq{box-sizing:border-box;max-width:100%;padding-inline:12px;}
  .idealab-nav{position:sticky;top:0;z-index:1050;display:flex!important;
    flex-direction:row!important;align-items:center!important;justify-content:space-between!important;
    flex-wrap:nowrap!important;gap:8px!important;min-height:54px;padding:8px 9px!important;
    background:rgba(255,255,255,.98);box-shadow:0 1px 5px rgba(11,36,71,.06);}
  .idealab-brand{font-size:.84rem!important;white-space:nowrap;letter-spacing:0!important;}
  .idealab-brand-product{display:none;}
  .idealab-nav-links{display:contents!important;}
  .idealab-nav-links>:not(.idealab-nav-priority){display:none!important;}
  .idealab-nav-links .idealab-nav-priority{display:inline-flex;min-height:40px;align-items:center;
    margin-left:auto;flex:none;justify-content:center;border:1px solid #d8dfeb;border-radius:9px;
    padding:0 9px;background:#f6f8fb;color:#0b2447!important;
    font-size:.76rem!important;font-weight:800!important;text-decoration:none;}
  .idealab-nav-mobile{display:block;position:relative;flex:none;}
  .idealab-nav-mobile>summary{list-style:none;display:flex;align-items:center;gap:6px;
    min-height:40px;padding:0 10px;border-radius:9px;border:1px solid #0b2447;
    background:#0b2447;color:#fff;font-family:inherit;font-weight:800;font-size:.79rem;cursor:pointer;}
  .idealab-nav-mobile>summary::-webkit-details-marker{display:none;}
  .idealab-nav-mobile>summary:focus-visible,.idealab-nav-mobile-panel a:focus-visible{outline:3px solid #b89b5e;outline-offset:2px;}
  .idealab-nav-mobile-panel{position:absolute;right:0;top:calc(100% + 10px);
    width:min(320px,calc(100vw - 24px));display:grid;grid-template-columns:repeat(2,minmax(0,1fr));
    gap:3px 5px;max-height:calc(100dvh - 78px);overflow-y:auto;overscroll-behavior:contain;
    background:white;border:1px solid #d9e0ea;border-radius:13px;padding:11px;
    box-shadow:0 14px 32px rgba(11,36,71,.18);z-index:1400;}
  .idealab-nav-mobile-panel a{display:flex;align-items:center;min-height:40px;
    padding:8px 9px;border-radius:8px;text-decoration:none;color:#1d3555!important;
    font-size:.79rem;font-weight:650;overflow-wrap:anywhere;}
  .idealab-nav-mobile-panel a:hover{background:#f1f5f9;}
  .idealab-nav-mobile-heading{grid-column:1/-1;padding:8px 8px 3px;margin-top:4px;
    border-top:1px solid #e7ebf0;color:#8b6c35;font-size:.65rem;font-weight:800;letter-spacing:.09em;}
  .pf-hero{padding:1rem 0 .75rem;}
  .pf-hero h1{font-size:clamp(1.65rem,6vw,2.2rem);line-height:1.15;}
  .pf-summary-grid{gap:9px;grid-template-columns:repeat(2,minmax(0,1fr));}
  .pf-summary-card{padding:12px 10px;}
  .pf-after-map{grid-template-columns:minmax(0,1fr);}
  .pf-section-heading{scroll-margin-top:68px;}
  .pf-explorer-host{min-width:0;max-width:100%;}
}


/* Justified editorial body text; retain aligned data, labels and table cells. */
.pf-hero p,.pf-section-heading p,.pf-after-map p,.pf-footnote,
.pf-source-note p,.observablehq > p,.pf-documentation p {
  text-align:justify;
  text-align-last:left;
  hyphens:auto;
  -webkit-hyphens:auto;
}
@media(max-width:768px){
  .pf-hero p,.pf-section-heading p,.pf-after-map p,
  .pf-footnote,.observablehq > p {
    text-align:justify!important;
    text-align-last:left!important;
  }
}

</style>

<nav class="idealab-nav" aria-label="Navegación España en Datos">
  <a class="idealab-brand" href="/dashboard-gobierno/">IDEA LAB <span class="idealab-brand-product">· España en Datos</span></a>
  <div class="idealab-nav-links">
    <a href="/dashboard-gobierno/" class="il-nav-start">Inicio</a>
    <a class="idealab-nav-priority" href="/dashboard-gobierno/#mapa-dinero">Mapa del dinero</a>
    <a href="/dashboard-gobierno/#resumen">Indicadores</a>
    <a class="is-active" href="/dashboard-gobierno/finanzas-publicas.html">Finanzas públicas</a>
    <a href="/dashboard-gobierno/metodologia.html">Metodología</a>
    <a href="/dashboard-gobierno/actualizaciones.html">Actualización</a>
    <a href="/dashboard-gobierno/quienes-somos.html">Quiénes somos</a>
    <a href="https://x.com/LARREALIDAD" target="_blank" rel="noopener noreferrer">En X</a>
  </div>
  <details class="idealab-nav-mobile">
    <summary aria-label="Abrir menú de navegación">Menú <span aria-hidden="true">☰</span></summary>
    <div class="idealab-nav-mobile-panel">
      <a href="/dashboard-gobierno/">Inicio</a>
      <a href="/dashboard-gobierno/#mapa-dinero">Mapa del dinero</a>
      <a href="/dashboard-gobierno/#resumen">Indicadores</a>
      <a href="/dashboard-gobierno/finanzas-publicas.html" aria-current="page">Finanzas públicas</a>
      <a href="/dashboard-gobierno/#economia">Economía</a>
      <a href="/dashboard-gobierno/#empleo">Empleo</a>
      <a href="/dashboard-gobierno/#vivienda">Vivienda</a>
      <a href="/dashboard-gobierno/#estado">Sector público</a>
      <a href="/dashboard-gobierno/#pensiones">Pensiones</a>
      <a href="/dashboard-gobierno/#sociedad">Sociedad</a>
      <a href="/dashboard-gobierno/#mundo">Mundo</a>
      <div class="idealab-nav-mobile-heading">Observatorio</div>
      <a href="/dashboard-gobierno/metodologia.html">Metodología</a>
      <a href="/dashboard-gobierno/actualizaciones.html">Actualización</a>
      <a href="/dashboard-gobierno/quienes-somos.html">Quiénes somos</a>
      <a href="https://x.com/LARREALIDAD" target="_blank" rel="noopener noreferrer">En X ↗</a>
    </div>
  </details>
</nav>

```js
const financesMobileMenu = document.querySelector(".idealab-nav-mobile");
if (financesMobileMenu) {
  financesMobileMenu.addEventListener("click", event => {
    if (event.target.closest("a")) financesMobileMenu.open = false;
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") financesMobileMenu.open = false;
  });
  document.addEventListener("click", event => {
    if (!financesMobileMenu.contains(event.target)) financesMobileMenu.open = false;
  });
}
```

<div style="margin: 0.6rem auto 1rem; max-width: 1400px; padding: 0.55rem 0.85rem; border: 1px solid #e3e6ea; border-radius: 10px; font-size: 0.84rem; color:#344054; background: #f8fafc;">Datos históricos en proceso de revisión. Algunas series están excluidas por metadatos ambiguos. <a href="/dashboard-gobierno/metodologia.html">Fuentes y limitaciones</a>.</div>

<div class="pf-hero">
  <div class="pf-kicker">ESPAÑA EN DATOS · UN PRODUCTO DE IDEA LAB</div>
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

<div style="margin:1rem 0;padding:1rem 1.2rem;border:1px solid #d9e3e9;background:#f7fafc;border-radius:12px;line-height:1.5">
  <div style="font-size:.72rem;font-weight:800;letter-spacing:.07em;color:#52647b;margin-bottom:.3rem">2025 · AVANCE OFICIAL, TODAVÍA NO INTEGRABLE EN EL SANKEY</div>
  <div style="display:flex;gap:1rem;flex-wrap:wrap;align-items:baseline">
    <strong style="font-size:1.52rem;color:#0b2447">766.296 M€</strong>
    <span style="font-size:.87rem;color:#344054">Empleos no financieros del total de AAPP, año 2025 (serie IGAE publicada en BDSICE).</span>
  </div>
  <p style="font-size:.78rem;color:#667085;margin:.5rem 0">La fuente actualizada el 30/09/2026 publica también 725.122 M€ para 2024, frente a los 725.001 M€ de la vintage del Sankey. <strong>Son revisiones diferentes: no mezclar importes entre versiones.</strong> La clasificación funcional COFOG de 2025 está prevista para el 30/11/2026; hasta disponer de ella no existe un reparto funcional completo y conciliado de 2025.</p>
  <a style="font-size:.79rem;font-weight:700" href="https://bdsice.mineco.gob.es/indeco/reports/verSerieGraf_limpio.aspx/?codigo=770a002000&amp;frec=-1" target="_blank" rel="noopener noreferrer">Fuente oficial · Serie anual 770a002000 ↗</a>
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
