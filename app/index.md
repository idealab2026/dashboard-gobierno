---
title: España en Datos | IDEA LAB
theme: light
toc: false
sidebar: false
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
  max-width: 1440px;
  margin: 0 auto;
}

/* =========================================================
   SINGLE PAGE NAVIGATION
   ========================================================= */

html {
  scroll-behavior: smooth;
  font-size: 16px;
}

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

  padding: 0.9rem 1.5rem;

  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(12px);

  border-bottom: 1px solid var(--idealab-border);
}

.idealab-brand {
  flex-shrink: 0;

  font-size: 0.86rem;
  font-weight: 800;
  letter-spacing: 0.045em;

  color: var(--idealab-navy) !important;
  text-decoration: none !important;
}

.idealab-nav-links {
  display: flex;
  align-items: center;

  gap: 1.35rem;

  overflow-x: auto;
  scrollbar-width: none;

  white-space: nowrap;
}

.idealab-nav-links::-webkit-scrollbar {
  display: none;
}

.idealab-nav-links a {
  color: var(--idealab-muted) !important;

  font-size: 0.85rem;
  font-weight: 600;

  text-decoration: none !important;

  transition: color 0.15s ease;
}

.idealab-nav-links a:hover {
  color: var(--idealab-navy) !important;
}


/* Cada bloque principal */

.dashboard-section {
  scroll-margin-top: 80px;

  padding-top: 0.0rem;
  padding-bottom: 0.5rem;

  border-top: 1px solid var(--idealab-border);
}


/* El primero no necesita línea superior */

.dashboard-section.first {
  border-top: none;
}


/* Responsive */

@media (min-width: 769px) {

  .columna-analisis {
    position: sticky;
    top: 90px;
  }
}


.section-action {
  display:inline-flex;
  align-items:center;
  margin:.2rem 0 1rem;
  padding:.58rem .85rem;
  border:1px solid var(--idealab-navy);
  border-radius:8px;
  color:var(--idealab-navy) !important;
  text-decoration:none !important;
  font-size:.8rem;
  font-weight:750;
}
.section-action:hover {background:#eef3f8;}

@media (max-width: 900px) {

  .idealab-nav {
    flex-direction: column;
    align-items: flex-start;

    gap: 0.65rem;

    padding: 0.8rem 1rem;
  }

  .idealab-nav-links {
    width: 100%;
  }

  .dashboard-section {
    scroll-margin-top: 115px;
  }
}

.hero {
  padding: 1.5rem 0 1rem;
  border-bottom: 1px solid var(--idealab-border);
  margin-bottom: 2.5rem;
}

.hero-kicker {
  color: var(--idealab-gold);
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.hero h1 {
  color: var(--idealab-navy);
  font-size: 4rem;
  line-height: 1;
  margin: 0.6rem 0 1rem;
  max-width:none;
  white-space: nowrap;
}

.hero-subtitle {
  color: var(--idealab-muted);
  font-size: 1.1rem;
  max-width: none;
  line-height: 1.6;
}

.hero-meta {
  display: flex;
  gap: 1rem;
  margin-top: 1.3rem;
  color: var(--idealab-muted);
  font-size: 0.95rem;
}

.section-header {
  margin-top: 2.5rem;
  margin-bottom: 1.5rem;
}

.section-kicker {
  color: var(--idealab-gold);
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.section-header h2 {
  color: var(--idealab-navy);
  margin: 0.4rem 0;

  font-size: 2rem;
  line-height: 1.15;
}

.section-description {
  color: var(--idealab-muted);
  max-width: none;
  font-size: 0.9rem;
  line-height: 1.55;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
}

.kpi-card {

  padding: 1.2rem 1.25rem;

  display: flex;
  flex-direction: column;

  background: white;

  border: 1px solid var(--idealab-border);
  border-radius: 12px;

  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.kpi-card:hover {
  transform: translateY(-2px);

  box-shadow:
    0 8px 24px rgba(11, 36, 71, 0.06);
}

.kpi-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.kpi-title {
  color: var(--idealab-muted);

  text-transform: uppercase;
  letter-spacing: 0.06em;

  font-weight: 700;
  font-size: 0.8rem;
  line-height: 1.4;
}

.kpi-year {
  flex-shrink: 0;

  padding: 0.2rem 0.45rem;

  border: 1px solid var(--idealab-border);
  border-radius: 100px;

  color: var(--idealab-muted);
  font-size: 0.76rem;
}

.kpi-value-block {
  margin-top: 0.7rem;
}

.kpi-value {
  color: var(--idealab-navy);

  font-size: 1.8rem;
  line-height: 1.05;

  font-weight: 700;
  overflow-wrap: break-word;
}

.kpi-unit {
  margin-top: 0.3rem;

  color: var(--idealab-muted);

  font-size: 0.8rem;
}

.kpi-diff {
  margin-top: 0.65rem;

  color: var(--idealab-muted);

  font-size: 0.85rem;
}

.kpi-arrow {
  color: var(--idealab-blue);
}

.kpi-spark {
  width: 90%;

  margin-top: auto;
  padding-top: 0.9rem;

  color: var(--idealab-blue);
}

.kpi-spark svg {
  display: block;

  width: 100%;
  height: auto;

  overflow: visible;
}

.kpi-years {
  display: flex;
  justify-content: space-between;

  margin-top: 0.15rem;

  color: var(--idealab-muted);

  font-size: 0.72rem;
}

.kpi-source {
  margin-top: 0.8rem;
  padding-top: 0.7rem;

  border-top: 1px solid var(--idealab-border);

  color: var(--idealab-muted);

  font-size: 0.6rem;
  line-height: 1.35;

  /* La fuente es parte de la trazabilidad: permitimos hasta dos líneas
     en vez de truncarla a una sola línea con puntos suspensivos. */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  white-space: normal;
}

.kpi-source a {
  color: var(--idealab-blue) !important;
  text-decoration: none !important;
}

.kpi-source a:hover {
  text-decoration: underline !important;
}

.kpi-details {
  margin-top: 0.55rem;

  color: var(--idealab-muted);

  font-size: 0.6rem;
}

.kpi-details summary {
  cursor: pointer;

  color: var(--idealab-muted);
}

.kpi-details-body {
  display: grid;
  gap: 0.45rem;

  margin-top: 0.6rem;

  line-height: 1.45;
}

.kpi-empty {
  margin-top: 1rem;

  color: var(--idealab-muted);
}

.perspective-box {
  padding: 1.5rem;
  background: var(--idealab-cream);
  border-radius: 12px;
}

.perspective-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.8rem;
}

.perspective-item {
  background: white;
  padding: 1rem;
  border-radius: 8px;
}

.perspective-label {
  color: var(--idealab-muted);
  font-size: 0.72rem;
  text-transform: uppercase;
}

.perspective-value {
  margin-top: 0.3rem;
  color: var(--idealab-navy);
  font-weight: 600;
}

.dev-details {
  margin-top: 4rem;
  color: var(--idealab-muted);
  font-size: 0.8rem;
}

.metric-group {
  margin-top: 2rem;
}

.metric-group:first-of-type {
  margin-top: 1.5rem;
}

.metric-group-title {
  margin: 0 0 1rem;

  color: var(--idealab-navy);

  font-size: 1.15rem;
  font-weight: 650;
}

.section-note {
  max-width: 900px;

  margin: 1rem 0 1.5rem;
  padding: 0.9rem 1rem;

  background: var(--idealab-cream);

  border-left: 3px solid var(--idealab-gold);
  border-radius: 4px;

  color: var(--idealab-muted);

  font-size: 0.9rem;
  line-height: 1.5;
}


/* Contenedor principal de la sección */
  .seccion-con-analisis {
    display: grid;
    grid-template-columns: 1fr 300px; /* 1fr (todo el espacio posible) para datos, 300px para el análisis */
    gap: 2.5rem; /* Espacio entre columnas */
    align-items: start;
    margin-bottom: 0.7rem; /* Espacio inferior del bloque */
  }

  /* La columna lateral de Idea Lab */
  .columna-analisis {
    border-left: 1px solid var(--theme-foreground-faintest); /* Línea fina vertical */
    padding-left: 2.5rem; /* Espacio entre la línea y el texto */
    font-size: 1rem;
    color: var(--theme-foreground-muted);
    text-align: justify;
  }

  /* Título del análisis */
  .columna-analisis h4 {
    margin-top: 0;
    color: var(--theme-foreground);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 700;
    margin-bottom: 1rem;
  }
/* =========================================================
   TABLET
   ========================================================= */

@media (max-width: 1000px) {

  .seccion-con-analisis {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  .columna-datos {
    min-width: 0;
  }

  .columna-analisis {
    position: static;

    border-left: none;
    border-top: 1px solid var(--idealab-border);

    padding-left: 0;
    padding-top: 1rem;

    text-align: left;
  }

  .kpi-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

}

/* =========================================================
   MOBILE
   ========================================================= */

@media (max-width: 700px) {

  html {
    font-size: 16px;
  }

  body {
    overflow-x: hidden;
  }

  .observablehq {
    width: 100%;
    max-width: 100%;

    box-sizing: border-box;

    padding-left: 16px;
    padding-right: 16px;
  }


  /* NAV */

  .idealab-nav {
    position: sticky;
    top: 0;

    width: 100%;

    flex-direction: column;
    align-items: flex-start;

    gap: 0.5rem;

    padding: 0.7rem 0;

    background: rgba(255, 255, 255, 0.97);
  }

  .idealab-brand {
    font-size: 0.8rem;
  }

  .idealab-nav-links {
    width: 100%;

    display: flex;
    gap: 0.9rem;

    overflow-x: auto;

    white-space: nowrap;

    padding-bottom: 0.2rem;
  }

  .idealab-nav-links a {
    flex: 0 0 auto;

    font-size: 0.76rem;
  }


  /* HERO */

  .hero {
    padding: 1.4rem 0 1rem;

    margin-bottom: 0.5rem;
  }

  .hero-kicker {
    font-size: 0.7rem;
  }

  .hero h1 {
    font-size: 2.4rem;
    line-height: 1.05;

    margin: 0.5rem 0 0.8rem;

    white-space: normal;
  }

  .hero-subtitle {
    max-width: 100%;

    font-size: 1rem;
    line-height: 1.45;
  }

  .hero-meta {
    display: flex;
    flex-wrap: wrap;

    gap: 0.4rem 1rem;

    margin-top: 0.8rem;

    font-size: 0.8rem;
  }


  /* SECCIONES */

  .dashboard-section {
    scroll-margin-top: 105px;

    padding-top: 1.25rem;
    padding-bottom: 1.25rem;
  }

  .section-header {
    margin-top: 1.25rem;
    margin-bottom: 0.8rem;
  }

  .section-header h2 {
    font-size: 1.55rem;
    line-height: 1.15;
  }

  .section-kicker {
    font-size: 0.7rem;
  }

  .section-description {
    max-width: 100%;

    font-size: 0.9rem;
    line-height: 1.45;
  }


  /* KPIs */

  .kpi-grid {
    grid-template-columns: 1fr;

    gap: 0.7rem;
  }

  .kpi-card {
    height: auto;
    min-height: 0;

    padding: 1rem;
  }

  .kpi-title {
    font-size: 0.75rem;
    line-height: 1.3;
  }

  .kpi-value {
    font-size: 1.85rem;
    line-height: 1.05;
  }

  .kpi-unit {
    font-size: 0.78rem;
  }

  .kpi-diff {
    font-size: 0.76rem;
  }

  .kpi-year {
    font-size: 0.68rem;
  }

  .kpi-spark {
    width: 100%;

    padding-top: 0.65rem;
  }

  .kpi-years {
    font-size: 0.65rem;
  }

  .kpi-source {
    white-space: normal;

    font-size: 0.7rem;
    line-height: 1.35;
  }

  .kpi-details {
    font-size: 0.7rem;
  }


  /* ANÁLISIS IDEA LAB */

  .seccion-con-analisis {
    display: grid;

    grid-template-columns: 1fr;

    gap: 1rem;
  }

  .columna-datos {
    min-width: 0;
  }

  .columna-analisis {
    position: static;

    border-left: none;
    border-top: 1px solid var(--idealab-border);

    padding-left: 0;
    padding-top: 1rem;

    font-size: 0.9rem;

    text-align: left;
  }

  .columna-analisis h4 {
    font-size: 0.72rem;

    margin-bottom: 0.7rem;
  }


  /* GRUPOS */

  .metric-group {
    margin-top: 1.25rem;
  }

  .metric-group:first-of-type {
    margin-top: 0.8rem;
  }

  .metric-group-title {
    margin-bottom: 0.7rem;

    font-size: 1rem;
  }

  .section-note {
    max-width: 100%;

    font-size: 0.82rem;
  }


  /* EVITAR OVERFLOW */

  img,
  svg,
  canvas {
    max-width: 100%;
  }

}


/* Impresión / exportación PDF: evitar tarjetas y bloques partidos entre páginas. */
@media print {
  .idealab-nav { position: static; backdrop-filter: none; }
  .kpi-card,
  .metric-group,
  .section-header,
  .idealab-analysis {
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .kpi-card:hover { transform: none; box-shadow: none; }
  .dashboard-section { break-before: auto; }
}

/* Prominencia editorial del Sankey original, antes del resumen KPI. */
.idealab-nav-priority {color: #b68a3f !important; font-weight: 850 !important;}
.il-sankey-spotlight {margin:2.1rem 0 .65rem; scroll-margin-top:100px; border-top:3px solid #b89b5e; padding:1.25rem 0 0;}
.il-spotlight-top {display:flex; justify-content:space-between; align-items:end; gap:1.5rem; flex-wrap:wrap;}
.il-spotlight-kicker {font-size:.69rem;letter-spacing:.13em;font-weight:850;color:#987333;margin-bottom:.45rem;}
.il-spotlight-top h2 {margin:0 0 .45rem; font-size:clamp(1.5rem,2.9vw,2.3rem);color:#0b2447;letter-spacing:-.03em;}
.il-spotlight-top p {max-width:840px; margin:.3rem 0 .65rem;color:#556277;font-size:.91rem;line-height:1.5;}
.il-sankey-cta {background:#0b2447;color:#fff !important;border-radius:9px;text-decoration:none;padding:.78rem 1rem;font-size:.8rem;font-weight:800;white-space:nowrap;margin:0 0 .35rem;}
.il-sankey-cta:hover {background:#19376d;text-decoration:none;}
.il-sankey-meta {font-size:.77rem;color:#65758a;background:#f8f5ef;padding:.7rem .9rem;border:1px solid #e9e0c9;border-radius:9px;margin:.5rem 0 .7rem;}
.il-spotlight-footnote {font-size:.76rem;color:#687789;line-height:1.4;margin:.3rem 0 1.5rem;}
.il-sankey-spotlight + .pf-explorer {margin:0 0 .3rem;max-width:100%;}
@media(max-width:560px){.il-sankey-spotlight{margin-top:1.2rem}.il-sankey-meta{font-size:.71rem}.il-sankey-cta{width:100%;text-align:center}}


/* Auditoría visual: datos COFOG y pensiones que no estaban expuestos en el panel. */
.il-finance-coverage {border:1px solid #e1e7ec;background:#fff;border-radius:14px;padding:18px 20px;margin:14px 0 28px;overflow:hidden}
.il-finance-coverage h3 {font-size:1.08rem;color:#0b2447;margin:0 0 4px}
.il-finance-coverage p {font-size:.83rem;color:#667085;margin:.25rem 0 13px;max-width:950px}
.il-finance-coverage table {width:100%;border-collapse:collapse;font-size:.83rem}
.il-finance-coverage th {font-size:.68rem;color:#6b798b;background:#f5f8fa;text-transform:uppercase;letter-spacing:.04em}
.il-finance-coverage td,.il-finance-coverage th {padding:10px 9px;border-bottom:1px solid #e9edf0;text-align:left}
.il-finance-coverage td:nth-child(2),.il-finance-coverage td:nth-child(3),.il-finance-coverage th:nth-child(2),.il-finance-coverage th:nth-child(3) {text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
.il-pension-info {margin:.7rem 0 1.4rem;padding:1rem;border:1px solid #e3e6ea;border-radius:12px;background:#fff}
.il-pension-info h3 {color:#0b2447;font-size:1.01rem;margin:0 0 10px}
.il-pension-figures {display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px}
.il-pension-figure {background:#f7f9fb;border-radius:9px;border:1px solid #e4e9ef;padding:13px 11px}
.il-pension-figure strong {display:block;color:#0b2447;font-size:clamp(.98rem,1.7vw,1.36rem);font-variant-numeric:tabular-nums}
.il-pension-figure small {display:block;color:#667085;font-size:.73rem;line-height:1.35}
.il-pension-info p {font-size:.79rem;margin:.7rem 0 0;color:#667085}
@media(max-width:760px){.il-pension-figures{grid-template-columns:repeat(2,minmax(0,1fr))}.il-finance-coverage{padding:14px 12px}}
@media(max-width:480px){.il-pension-figures{gap:6px}.il-finance-coverage table{font-size:.75rem}}


.il-pension-monthly{margin-top:12px;}
.il-pension-monthly>a{font-size:.78rem;font-weight:650}
.il-pension-breakdown{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px 19px}
.il-pension-payroll-label{display:flex;justify-content:space-between;gap:12px;font-size:.8rem;color:#475569}
.il-pension-payroll-label strong{color:#0b2447;font-variant-numeric:tabular-nums}
.il-pension-payroll-track{height:7px;background:#e7edf2;border-radius:9px;overflow:hidden;margin-top:4px}
.il-pension-payroll-bar{height:7px;background:#a58a4d;border-radius:9px}
@media(max-width:690px){.il-pension-breakdown{grid-template-columns:1fr}}


/* Marca matriz IDEA LAB · producto España en Datos */
.idealab-nav{gap:1rem;padding:.7rem 1rem}
.idealab-brand{white-space:nowrap}
.idealab-brand-product{font-weight:600;letter-spacing:0;color:#475569}
.idealab-nav-links{min-width:0;flex:1;justify-content:flex-end;gap:.4rem .8rem;flex-wrap:wrap;overflow:visible;white-space:normal}
.idealab-nav-links a{white-space:nowrap}
.idealab-nav-x{padding:.32rem .6rem;border:1px solid var(--idealab-border);border-radius:7px}
.idealab-nav-areas{position:relative;color:var(--idealab-muted);font-size:.85rem;font-weight:650}
.idealab-nav-areas>summary{cursor:pointer;white-space:nowrap;list-style:none}
.idealab-nav-areas>summary::-webkit-details-marker{display:none}
.idealab-nav-areas>summary::after{content:" ▾";font-size:.76em}
.idealab-nav-areas-panel{position:absolute;top:calc(100% + 12px);left:0;z-index:1200;min-width:180px;display:grid;gap:.65rem;padding:.85rem 1rem;border:1px solid var(--idealab-border);border-radius:10px;background:#fff;box-shadow:0 12px 30px rgba(11,36,71,.12)}
.idealab-nav-areas-panel a{display:block;text-decoration:none}
.hero{padding:.9rem 0 .8rem;margin-bottom:.7rem}
.hero h1{font-size:clamp(2.5rem,5vw,3.8rem);margin:.45rem 0 .7rem;white-space:normal}
.hero-subtitle{font-size:1.02rem;line-height:1.5;max-width:76ch}
.hero-actions{display:flex;flex-wrap:wrap;gap:.6rem;margin-top:1rem}
.hero-actions a{display:inline-block;padding:.62rem .9rem;border:1px solid var(--idealab-navy);border-radius:8px;font-weight:700;font-size:.87rem;color:var(--idealab-navy);text-decoration:none}
.hero-actions a:first-child{background:var(--idealab-navy);color:white}
.hero-meta{margin-top:.65rem}
@media(max-width:900px){
  .idealab-nav{align-items:flex-start;gap:.5rem}
  .idealab-nav-links{width:100%;justify-content:flex-start;flex-wrap:wrap;overflow:visible;white-space:normal;gap:.45rem .8rem;padding-bottom:.15rem}
  .dashboard-section{scroll-margin-top:165px}
}
@media(max-width:650px){
  .idealab-brand-product{font-size:.78em}
  .hero h1{font-size:2.4rem}
  .hero-subtitle{font-size:.95rem}
  .idealab-nav-links a,.idealab-nav-areas{font-size:.77rem}
}

</style>

<nav class="idealab-nav" aria-label="Navegación del observatorio España en Datos">
  <a class="idealab-brand" href="#inicio" aria-label="IDEA LAB · España en Datos">
    IDEA LAB <span class="idealab-brand-product">· España en Datos</span>
  </a>
  <div class="idealab-nav-links">
    <a class="idealab-nav-priority" href="#mapa-dinero">Mapa del dinero</a>
    <a href="#resumen">Indicadores</a>
    <details class="idealab-nav-areas">
      <summary>Áreas temáticas</summary>
      <div class="idealab-nav-areas-panel">
        <a href="#economia">Economía</a>
        <a href="#empleo">Empleo</a>
        <a href="#vivienda">Vivienda</a>
        <a href="#estado">Sector público</a>
        <a href="#pensiones">Pensiones</a>
        <a href="#sociedad">Sociedad</a>
        <a href="#mundo">Mundo</a>
      </div>
    </details>
    <a href="./finanzas-publicas">Finanzas públicas</a>
    <a href="./metodologia">Metodología</a>
    <a href="./actualizaciones">Actualización</a>
    <a href="./quienes-somos">Quiénes somos</a>
    <a class="idealab-nav-x" href="https://x.com/LARREALIDAD" target="_blank" rel="noopener noreferrer" aria-label="Canal editorial de IDEA LAB en X">En X</a>
  </div>
</nav>

<div style="margin: 0.6rem auto 1rem; max-width: 1400px; padding: 0.55rem 0.85rem; border: 1px solid #e3e6ea; border-radius: 10px; font-size: 0.84rem; color:#344054; background: #f8fafc;">Datos históricos en proceso de revisión. Algunas series están excluidas por metadatos ambiguos. <a href="./metodologia">Fuentes y limitaciones</a>.</div>

```js
import {KpiCard} from "./components/kpi-card.js";

const rawData = await FileAttachment(
  "./data/observations.csv"
).csv({typed: true});

const requiredColumns = [
  "indicator_id",
  "year",
  "value"
];

const availableColumns =
  rawData.columns ?? Object.keys(rawData[0] ?? {});

const missingColumns = requiredColumns.filter(
  column => !availableColumns.includes(column)
);

if (missingColumns.length > 0) {
  throw new Error(
    `Faltan columnas: ${missingColumns.join(", ")}`
  );
}

const data = rawData
  .filter(d =>
    d?.indicator_id != null &&
    d?.year != null &&
    d?.value != null
  )
  .map(d => ({
    ...d,
    indicator_id: String(d.indicator_id),
    year: Number(d.year),
    value: Number(d.value)
  }))
  .filter(d =>
    Number.isFinite(d.year) &&
    Number.isFinite(d.value)
  );

  const spainData = data.filter(
    d => !d.geo_name || d.geo_name === "España"
  );

const availableIndicators = [
  ...new Set(data.map(d => d.indicator_id))
];

function getRows(indicatorId) {
  const candidates = data.filter(d =>
    d.indicator_id === indicatorId &&
    (!d.geo_name || d.geo_name === "España")
  );

  const byYear = new Map();
  for (const row of candidates) {
    if (!byYear.has(row.year)) byYear.set(row.year, []);
    byYear.get(row.year).push(row);
  }

  return [...byYear.entries()]
    .map(([year, rows]) => {
      const distinctValues = [...new Set(rows.map(d => d.value))];
      return distinctValues.length === 1 ? rows[0] : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.year - b.year);
}

function getLatest(indicatorId) {
  const rows = getRows(indicatorId);
  return rows[rows.length - 1];
}

function getLatestValue(indicatorId) {
  return getLatest(indicatorId)?.value;
}

function getLatestYear(indicatorId) {
  return getLatest(indicatorId)?.year;
}

function formatLatest(indicatorId, formatFunction) {
  const value = getLatestValue(indicatorId);

  return Number.isFinite(value)
    ? formatFunction(value)
    : "—";
}

function getTitle(indicatorId) {
  const row = getLatest(indicatorId);

  return (
    row?.indicator ??
    row?.indicador ??
    row?.indicator_name ??
    indicatorId
      .replaceAll("_", " ")
      .replace(/\b\w/g, x => x.toUpperCase())
  );
}

function getUnit(indicatorId) {
  const row = getLatest(indicatorId);

  return row?.unit ?? row?.unidad ?? "";
}

function formatter(indicatorId) {
  const unit = getUnit(indicatorId);

  return value => {
    const formatted = new Intl.NumberFormat(
      "es-ES",
      {maximumFractionDigits: 1}
    ).format(value);

    return unit ? `${formatted} ${unit}` : formatted;
  };
}

function isPercentage(indicatorId) {
  const unit = String(getUnit(indicatorId)).toLowerCase();

  return (
    unit.includes("%") ||
    unit.includes("percent") ||
    unit.includes("porcentaje")
  );
}

const preferredIds = [
  "crecimiento_pib_real",
  "pib_per_capita_eur",
  "tasa_desempleo",
  "salario_mediano_anual_bruto_Total",
  "deuda_publica_pde_pib",
  "inflacion_ipc_media_anual",
  "tasa_arope",
  "variacion_precio_vivienda"

];

const nf0 = new Intl.NumberFormat("es-ES", {
  maximumFractionDigits: 0
});

const nf1 = new Intl.NumberFormat("es-ES", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1
});

const nfCompact = new Intl.NumberFormat("es-ES", {
  notation: "compact",
  maximumFractionDigits: 1
});

const euro0 = value => `${nf0.format(value)} €`;
const euro1 = value => `${nf1.format(value)} €`;
const pct1 = value => `${nf1.format(value)} %`;
const num1 = value => nf1.format(value);
const integer = value => nf0.format(value);
const compact = value => nfCompact.format(value);
const millionsEuro = value => `${nf0.format(value)} M€`;


const kpiPresentation = {

  /* ======================================================
     ECONOMÍA
     ====================================================== */

  crecimiento_pib_real: {
    title: "Crecimiento del PIB",
    formatValue: pct1,
    unitLabel: "variación real anual",
    isPercentage: true
  },

  pib_per_capita_eur: {
    title: "PIB per cápita",
    formatValue: euro0,
    unitLabel: "por habitante"
  },

  pib_nominal_eur: {
    title: "PIB nominal",
    formatValue: value => `${nf0.format(value / 1000000)}`, /* Dividimos entre 1 millón */
    unitLabel: "millones de euros"
  },

  posicion_pib_mundial: {
    title: "Posición económica mundial",
    formatValue: value => `#${Math.round(value)}`,
    unitLabel: "por tamaño del PIB",
    comparisonMode: "rank"
  },

  inflacion_ipc_media_anual: {
    title: "Inflación",
    formatValue: pct1,
    unitLabel: "IPC · media anual",
    isPercentage: true
  },

  inflacion_alimentos_media_anual: {
    title: "Inflación de alimentos",
    formatValue: pct1,
    unitLabel: "media anual",
    isPercentage: true
  },

  ipc_indice_general_media_anual: {
    title: "Índice general de precios",
    formatValue: num1,
    unitLabel: "base 2021 = 100"
  },


  /* ======================================================
     EMPLEO
     ====================================================== */

  tasa_actividad: {
    title: "Tasa de actividad",
    formatValue: pct1,
    unitLabel: "población activa",
    isPercentage: true
  },

  tasa_empleo: {
    title: "Tasa de empleo",
    formatValue: pct1,
    unitLabel: "población ocupada",
    isPercentage: true
  },

  tasa_desempleo: {
    title: "Tasa de desempleo",
    formatValue: pct1,
    unitLabel: "población activa",
    isPercentage: true
  },

  tasa_paro_juvenil: {
    title: "Paro juvenil",
    formatValue: pct1,
    unitLabel: "población activa joven",
    isPercentage: true
  },


  /* ======================================================
     SALARIOS
     ====================================================== */

  salario_mediano_anual_bruto_Total: {
    title: "Salario mediano",
    formatValue: euro0,
    unitLabel: "brutos al año por trabajador"
  },

  salario_medio_anual_bruto_Total: {
    title: "Salario medio",
    formatValue: euro0,
    unitLabel: "brutos al año por trabajador"
  },

  salario_modal_anual_bruto_Total: {
    title: "Salario más frecuente",
    formatValue: euro0,
    unitLabel: "brutos al año"
  },

  salario_mediano_mensual_bruto_epa_Total: {
    title: "Salario mediano mensual",
    formatValue: euro0,
    unitLabel: "empleo principal"
  },

  salario_medio_mensual_bruto_epa_Total: {
    title: "Salario medio mensual",
    formatValue: euro0,
    unitLabel: "empleo principal"
  },

  smi_mensual_14_pagas_Total: {
    title: "Salario mínimo",
    formatValue: euro0,
    unitLabel: "mensuales · 14 pagas"
  },

  smi_anual_14_pagas_Total: {
    title: "Salario mínimo anual",
    formatValue: euro0,
    unitLabel: "14 pagas"
  },

  salario_medio_anual_bruto_Hombres: {
    title: "Salario medio · hombres",
    formatValue: euro0,
    unitLabel: "brutos al año"
  },

  salario_medio_anual_bruto_Mujeres: {
    title: "Salario medio · mujeres",
    formatValue: euro0,
    unitLabel: "brutos al año"
  },

  brecha_salarial_media_anual_mujeres_hombres_Total: {
    title: "Brecha salarial",
    formatValue: pct1,
    unitLabel: "respecto al salario medio masculino",
    isPercentage: true
  },

  "salario_medio_mensual_bruto_epa_formacion_Hasta secundaria 1ª etapa": {
    title: "Salario · educación básica",
    formatValue: euro0,
    unitLabel: "brutos al mes"
  },

  "salario_medio_mensual_bruto_epa_formacion_Secundaria 2ª etapa": {
    title: "Salario · educación secundaria",
    formatValue: euro0,
    unitLabel: "brutos al mes"
  },

  "salario_medio_mensual_bruto_epa_formacion_Superior, incluido doctorado": {
    title: "Salario · educación superior",
    formatValue: euro0,
    unitLabel: "brutos al mes"
  },


  /* ======================================================
     VIVIENDA
     ====================================================== */

  variacion_precio_vivienda: {
    title: "Precio de la vivienda",
    formatValue: pct1,
    unitLabel: "variación anual",
    isPercentage: true
  },

  indice_precio_vivienda: {
    title: "Índice precio vivienda",
    formatValue: num1,
    unitLabel: "base 2015 = 100"
  },

  variacion_precio_alquiler: {
    title: "Precio del alquiler",
    formatValue: pct1,
    unitLabel: "variación anual",
    isPercentage: true
  },

  indice_precio_alquiler: {
    title: "Índice precio alquiler",
    formatValue: num1,
    unitLabel: "base 2015 = 100"
  },

  compraventas_viviendas_total: {
    title: "Compraventas de vivienda",
    formatValue: integer,
    unitLabel: "operaciones"
  },

  compraventas_vivienda_nueva: {
    title: "Compraventas · vivienda nueva",
    formatValue: integer,
    unitLabel: "operaciones"
  },


  /* ======================================================
     SECTOR PÚBLICO
     ====================================================== */

  deuda_publica_pde_pib: {
    title: "Deuda pública",
    formatValue: pct1,
    unitLabel: "del PIB",
    isPercentage: true
  },

  variacion_deuda_publica_pp: {
    title: "Variación de la deuda",
    formatValue: value => `${nf1.format(value)} pp`,
    unitLabel: "variación anual",
    isPercentage: true
  },

  gasto_sanitario_publico_pib: {
    title: "Gasto sanitario público",
    formatValue: pct1,
    unitLabel: "del PIB",
    isPercentage: true
  },


  /* ======================================================
     DEMOGRAFÍA
     ====================================================== */

  poblacion_residente: {
    title: "Población residente",
    formatValue: compact,
    unitLabel: "personas"
  },

  crecimiento_poblacion: {
    title: "Crecimiento de la población",
    formatValue: pct1,
    unitLabel: "variación anual",
    isPercentage: true
  },

  pensiones_ss_numero: {
    title: "Pensiones abonadas",
    formatValue: integer,
    unitLabel: "número de pensiones · octubre"
  },
  pensionistas_ss_aproximado: {
    title: "Personas pensionistas",
    formatValue: value => "≈" + compact(value),
    unitLabel: "personas · estimación oficial"
  },
  pension_media_sistema_mes: {
    title: "Pensión media del sistema",
    formatValue: euro0,
    unitLabel: "euros al mes · octubre"
  },
  pension_media_jubilacion_mes: {
    title: "Pensión media de jubilación",
    formatValue: euro0,
    unitLabel: "euros al mes · octubre"
  },
  nomina_pensiones_ss_mes_mill: {
    title: "Nómina mensual",
    formatValue: value => nf0.format(value) + " M€",
    unitLabel: "solo pensiones contributivas · octubre"
  },
  edad_media_acceso_jubilacion: {
    title: "Edad media de jubilación efectiva",
    formatValue: value => nf1.format(value),
    unitLabel: "años · dato hasta septiembre"
  },
  poblacion_mayor_64_porcentaje: {
    title: "Población de 65 años o más",
    formatValue: pct1,
    unitLabel: "de la población total · 2025",
    isPercentage: true
  },
  dependencia_mayores_65: {
    title: "Dependencia demográfica",
    formatValue: pct1,
    unitLabel: "65+ por 100 personas de 16–64 · 2025",
    isPercentage: true
  },
  afiliados_ss_desestacionalizados: {
    title: "Afiliación ajustada",
    formatValue: compact,
    unitLabel: "afiliados · 15 oct 2026"
  },


  /* ======================================================
     RENTA Y DESIGUALDAD
     ====================================================== */

  renta_neta_media_persona: {
    title: "Renta neta media",
    formatValue: euro0,
    unitLabel: "por persona"
  },

  renta_media_unidad_consumo: {
    title: "Renta por unidad de consumo",
    formatValue: euro0,
    unitLabel: "por unidad de consumo"
  },

  indice_gini: {
    title: "Desigualdad · Gini",
    formatValue: num1,
    unitLabel: "índice 0–100"
  },

  ratio_s80_s20: {
    title: "Desigualdad · S80/S20",
    formatValue: num1,
    unitLabel: "ratio de renta"
  },

  tasa_arope: {
    title: "Riesgo de pobreza o exclusión",
    formatValue: pct1,
    unitLabel: "tasa AROPE",
    isPercentage: true
  },

  tasa_riesgo_pobreza: {
    title: "Riesgo de pobreza",
    formatValue: pct1,
    unitLabel: "población",
    isPercentage: true
  },

  carencia_material_social_severa: {
    title: "Carencia material severa",
    formatValue: pct1,
    unitLabel: "población",
    isPercentage: true
  },

  baja_intensidad_trabajo: {
    title: "Baja intensidad laboral",
    formatValue: pct1,
    unitLabel: "población",
    isPercentage: true
  },


  /* ======================================================
     TURISMO / PROYECCIÓN EXTERIOR
     ====================================================== */

  turistas_internacionales: {
    title: "Turistas internacionales",
    formatValue: compact,
    unitLabel: "personas"
  },

  visitantes_internacionales_total: {
    title: "Visitantes internacionales",
    formatValue: compact,
    unitLabel: "personas"
  },

  gasto_turistico_internacional: {
    title: "Gasto turístico internacional",
    formatValue: millionsEuro,
    unitLabel: "millones de euros"
  },

  gasto_medio_turista: {
    title: "Gasto medio por turista",
    formatValue: euro0,
    unitLabel: "por viaje"
  },

  duracion_media_viaje_turista: {
    title: "Duración media del viaje",
    formatValue: value => `${nf1.format(value)} días`,
    unitLabel: "por turista"
  }

};


const sectionDefinitions = {

  economia: {
    kicker: "01 · Economía",
    title: "Economía y precios",
    description:
      "Crecimiento, renta, tamaño de la economía y evolución de los precios.",

    analysis: () => [
    `El PIB real crece un ${formatLatest(
      "crecimiento_pib_real",
      pct1
    )} en ${getLatestYear("crecimiento_pib_real")}. La inflación media se sitúa en ${formatLatest(
      "inflacion_ipc_media_anual",
      pct1
    )}.`,

    "La evolución agregada de la economía debe leerse junto con la renta por habitante y, en una fase posterior, con la convergencia respecto a la UE y otras economías comparables."
  ],

    groups: [
      {
        title: "Actividad y renta",
        indicators: [
          "crecimiento_pib_real",
          "pib_per_capita_eur",
          "pib_nominal_eur"
        ]
      },

      {
        title: "Precios",
        indicators: [
          "inflacion_ipc_media_anual",
          "inflacion_alimentos_media_anual",
          "ipc_indice_general_media_anual"
        ]
      }
    ]
  },


  empleo: {
    kicker: "02 · Mercado laboral",
    title: "Empleo y salarios",
    description:
      "Actividad, empleo, desempleo y evolución de las rentas del trabajo.",
    analysis: () => [
      `La tasa de desempleo se sitúa en ${formatLatest(
        "tasa_desempleo",
        pct1
      )}, mientras que el paro juvenil alcanza el ${formatLatest(
        "tasa_paro_juvenil",
        pct1
      )}.`,

      `La fotografía laboral no puede limitarse al volumen de empleo: salario mediano, salario medio y distribución salarial permiten analizar también la calidad económica del trabajo. Las principales series salariales disponibles llegan actualmente hasta ${getLatestYear(
        "salario_mediano_anual_bruto_Total"
      )}.`
    ],
    groups: [
      {
        title: "Mercado laboral",
        indicators: [
          "tasa_actividad",
          "tasa_empleo",
          "tasa_desempleo",
          "tasa_paro_juvenil"
        ]
      },

      {
        title: "Salarios",
        indicators: [
          "salario_mediano_anual_bruto_Total",
          "salario_medio_anual_bruto_Total",
          "salario_modal_anual_bruto_Total",
          "smi_mensual_14_pagas_Total",
          "salario_mediano_mensual_bruto_epa_Total",
          "salario_medio_mensual_bruto_epa_Total"
        ]
      },

      {
        title: "Brechas salariales",
        indicators: [
          "salario_medio_anual_bruto_Hombres",
          "salario_medio_anual_bruto_Mujeres",
          "brecha_salarial_media_anual_mujeres_hombres_Total"
        ]
      },

      {
        title: "Salario y formación",
        indicators: [
          "salario_medio_mensual_bruto_epa_formacion_Hasta secundaria 1ª etapa",
          "salario_medio_mensual_bruto_epa_formacion_Secundaria 2ª etapa",
          "salario_medio_mensual_bruto_epa_formacion_Superior, incluido doctorado"
        ]
      }
    ]
  },


  vivienda: {
    kicker: "03 · Vivienda",
    title: "Vivienda y accesibilidad",
    description:
      "Evolución de los precios de compra y alquiler y actividad del mercado residencial.",
    analysis: () => [
        `El precio de la vivienda registra una variación del ${formatLatest(
          "variacion_precio_vivienda",
          pct1
        )} en ${getLatestYear("variacion_precio_vivienda")}.`,

        "La evolución del precio, por sí sola, no mide la accesibilidad. El análisis deberá completarse con renta de los hogares, esfuerzo financiero, alquiler y oferta de vivienda."
      ],

    groups: [
      {
        title: "Precios",
        indicators: [
          "variacion_precio_vivienda",
          "indice_precio_vivienda"
        ]
      },

      {
        title: "Mercado residencial",
        indicators: [
          "compraventas_viviendas_total",
          "compraventas_vivienda_nueva"
        ]
      }
    ]
  },


  estado: {
    kicker: "04 · Sector público",
    title: "Finanzas públicas",
    description:
      "Deuda pública y algunos de los principales indicadores disponibles de gasto público.",

    action: {
      label: "Explorar ingresos y gastos públicos →",
      href: "./finanzas-publicas"
    },

    analysis: () => [
  `La deuda pública se sitúa en ${formatLatest(
    "deuda_publica_pde_pib",
    pct1
  )} del PIB en ${getLatestYear("deuda_publica_pde_pib")}.`,

  "La ratio ha descendido desde el máximo alcanzado durante la pandemia, pero el nivel de deuda continúa siendo una variable central para valorar el margen fiscal y la sostenibilidad de las cuentas públicas."
],

    groups: [
      {
        title: "Sector público",
        indicators: [
          "deuda_publica_pde_pib",
          "variacion_deuda_publica_pp",
          "gasto_sanitario_publico_pib"
        ]
      }
    ]
  },


  pensiones: {
    kicker: "05 · Pensiones y demografía",
    title: "Pensiones, cotizantes y envejecimiento",
    description:
      "Prestaciones, pensionistas, cotizaciones y estructura de edades: cada magnitud conserva su ámbito y periodo de referencia.",
    note:
      "No confundas 10,57 millones de pensiones con cerca de 9,6 millones de personas pensionistas. La nómina contributiva mensual de octubre de 2026 tampoco es el gasto anual COFOG de 2024.",
    analysis: () => [
      `El sistema de Seguridad Social abonó ${formatLatest("pensiones_ss_numero", integer)} pensiones en octubre de 2026, con una pensión media global de ${formatLatest("pension_media_sistema_mes", euro0)} al mes. La pensión media de jubilación fue de ${formatLatest("pension_media_jubilacion_mes", euro0)} mensuales.`,
      `En el censo de 2025, los mayores de 64 años representaban el ${formatLatest("poblacion_mayor_64_porcentaje", pct1)} de la población; su tasa de dependencia demográfica era del ${formatLatest("dependencia_mayores_65", pct1)} respecto a la población de 16 a 64 años.`,
      "La afiliación desestacionalizada de octubre de 2026 y el número aproximado de pensionistas no bastan para calcular una tasa sostenible de cotizantes por pensionista. Son poblaciones, definiciones y fechas diferentes.",
      "La evolución de la sostenibilidad financiera exige series de ingresos por cotizaciones, prestaciones, transferencias del Estado, empleo y escenarios actuariales comparables. Estos datos siguen pendientes."
    ],
    groups: [
      {
        title: "Pensiones y beneficiarios · octubre 2026",
        indicators: [
          "pensiones_ss_numero",
          "pensionistas_ss_aproximado",
          "pension_media_sistema_mes",
          "pension_media_jubilacion_mes",
          "nomina_pensiones_ss_mes_mill",
          "edad_media_acceso_jubilacion"
        ]
      },
      {
        title: "Población y envejecimiento",
        indicators: [
          "poblacion_residente",
          "crecimiento_poblacion",
          "poblacion_mayor_64_porcentaje",
          "dependencia_mayores_65"
        ]
      },
      {
        title: "Mercado laboral · referencia",
        indicators: ["afiliados_ss_desestacionalizados"]
      }
    ]
  },


  sociedad: {
    kicker: "06 · Sociedad",
    title: "Renta, pobreza y desigualdad",
    description:
      "Distribución de la renta, desigualdad económica y riesgo de pobreza o exclusión social.",
    analysis: () => [
  `La tasa AROPE se sitúa en ${formatLatest(
    "tasa_arope",
    pct1
  )} y el índice de Gini en ${formatLatest(
    "indice_gini",
    num1
  )}.`,

  "La mejora de la renta media no implica necesariamente una mejora equivalente para todos los hogares. Por eso este bloque combina nivel de renta, desigualdad, pobreza y exclusión social."
],

    groups: [
      {
        title: "Renta",
        indicators: [
          "renta_neta_media_persona",
          "renta_media_unidad_consumo"
        ]
      },

      {
        title: "Desigualdad",
        indicators: [
          "indice_gini",
          "ratio_s80_s20"
        ]
      },

      {
        title: "Pobreza y exclusión",
        indicators: [
          "tasa_arope",
          "tasa_riesgo_pobreza",
          "carencia_material_social_severa",
          "baja_intensidad_trabajo"
        ]
      }
    ]
  },


  mundo: {
    kicker: "07 · España en el mundo",
    title: "Posición y proyección internacional",
    description:
      "Peso económico y algunos indicadores de la inserción de España en los flujos internacionales.",

    note:
      "La comparación sistemática con UE, eurozona, OCDE y otras economías se incorporará en la siguiente fase.",
    analysis: () => [
  `España ocupa la posición ${formatLatest(
    "posicion_pib_mundial",
    value => `#${Math.round(value)}`
  )} por tamaño del PIB según la serie actualmente incorporada.`,

  "La posición internacional no debe medirse únicamente por el tamaño de la economía o el turismo. La siguiente ampliación incorporará comparaciones de renta, productividad, empleo, deuda y otros indicadores frente a UE, eurozona, OCDE y referentes globales."
],
    groups: [
      {
        title: "Posición internacional",
        indicators: [
          "posicion_pib_mundial"
        ]
      },

      {
        title: "Turismo internacional",
        indicators: [
          "turistas_internacionales",
          "visitantes_internacionales_total",
          "gasto_turistico_internacional",
          "gasto_medio_turista",
          "duracion_media_viaje_turista"
        ]
      }
    ]
  }

};

function renderMetricSection(sectionId) {

  const config = sectionDefinitions[sectionId];

  const section = document.createElement("section");

  section.id = sectionId;
  section.className = "dashboard-section";


  /* ============================
     HEADER
     ============================ */

  const header = document.createElement("div");
  header.className = "section-header";

  header.innerHTML = `
    <div class="section-kicker">
      ${config.kicker}
    </div>

    <h2>
      ${config.title}
    </h2>

    <div class="section-description">
      ${config.description}
    </div>
  `;

  section.append(header);


  /* ============================
     NOTA
     ============================ */

  if (config.note) {

    const note = document.createElement("div");

    note.className = "section-note";
    note.textContent = config.note;

    section.append(note);
  }

  if (sectionId === "pensiones") {
    const pensionRows=spotlightFinance.filter(d=>d.year===spotlightYears[0]);
    const byPensionCode=new Map(pensionRows.map(d=>[d.code,d]));
    const total=byPensionCode.get("PENS");
    const parts=["PENS.CONTR","PENS.NOCONTR","PENS.CP"].map(code=>byPensionCode.get(code));
    if (total && parts.every(Boolean) &&
        Math.abs(parts.reduce((sum,item)=>sum+item.value,0)-total.value)<1) {
      const wrapper=document.createElement("div");
      wrapper.className="il-pension-info";
      const title=document.createElement("h3");
      title.textContent="Gasto en pensiones · IGAE COFOG "+spotlightYears[0];
      wrapper.append(title);
      const cards=document.createElement("div");
      cards.className="il-pension-figures";
      const makeCard=(name,val)=>{
        const el=document.createElement("div");el.className="il-pension-figure";
        const strong=document.createElement("strong");
        strong.textContent=new Intl.NumberFormat("es-ES",{maximumFractionDigits:0}).format(val)+" M€";
        const label=document.createElement("small");label.textContent=name;
        el.append(strong,label);return el;
      };
      cards.append(makeCard("Pensiones · total COFOG",total.value));
      cards.append(makeCard("Contributivas de Seguridad Social",parts[0].value));
      cards.append(makeCard("No contributivas de Seguridad Social",parts[1].value));
      cards.append(makeCard("Clases pasivas",parts[2].value));
      wrapper.append(cards);
      const note=document.createElement("p");
      note.textContent="Desglose analítico dentro de protección social. Los importes del año "+spotlightYears[0]+" no deben sumarse de nuevo al resto del COFOG. Fuente: IGAE.";
      wrapper.append(note);
      section.append(wrapper);
    }
  }

  if (sectionId === "pensiones" && pensionMonthlyRows.length === 5) {
    const pensionMonth = "2026-10";
    const entries=pensionMonthlyRows.filter(r=>r.period===pensionMonth &&
      Number.isFinite(Number(r.monthly_million_eur)) &&
      Number(r.monthly_million_eur)>0);
    const total=entries.reduce((sum,r)=>sum+Number(r.monthly_million_eur),0);
    const certifiedTotal=Number(spainData.find(d=>
      d.indicator_id==="nomina_pensiones_ss_mes_mill" && String(d.reference_period)===pensionMonth)?.value);
    if(entries.length===5 && Number.isFinite(certifiedTotal) &&
        Math.abs(total-certifiedTotal)<0.2) {
      const panel=document.createElement("div");
      panel.className="il-pension-info il-pension-monthly";
      const title=document.createElement("h3");
      title.textContent="Nómina contributiva mensual por tipo · octubre 2026";
      panel.append(title);
      const formatter=new Intl.NumberFormat("es-ES",{maximumFractionDigits:1});
      const rows=document.createElement("div");
      rows.className="il-pension-breakdown";
      for(const data of [...entries].sort((a,b)=>b.monthly_million_eur-a.monthly_million_eur)){
        const amount=Number(data.monthly_million_eur);
        const item=document.createElement("div");item.className="il-pension-payroll-row";
        const top=document.createElement("div");top.className="il-pension-payroll-label";
        const name=document.createElement("span");name.textContent=data.pension_type;
        const value=document.createElement("strong");value.textContent=formatter.format(amount)+" M€";
        top.append(name,value);
        const track=document.createElement("div");track.className="il-pension-payroll-track";
        const bar=document.createElement("div");bar.className="il-pension-payroll-bar";
        bar.style.width=(amount/certifiedTotal*100).toFixed(2)+"%";
        track.append(bar);item.append(top,track);rows.append(item);
      }
      panel.append(rows);
      const info=document.createElement("p");
      info.textContent="Total oficial: "+formatter.format(certifiedTotal)+
        " M€ (suma de ramas "+formatter.format(total)+
        " M€; diferencia de redondeo). Es nómina mensual de Seguridad Social, no gasto público COFOG anual.";
      panel.append(info);
      const source=document.createElement("a");
      source.href=entries[0].source_url;
      source.target="_blank";source.rel="noopener noreferrer";
      source.textContent="Fuente oficial · Ministerio de Inclusión (27/10/2026)";
      panel.append(source);
      section.append(panel);
    }
  }

  if (config.action) {
    const action = document.createElement("a");
    action.className = "section-action";
    action.href = config.action.href;
    action.textContent = config.action.label;
    section.append(action);
  }


  /* ============================
     DOS COLUMNAS
     ============================ */

  const content =
    document.createElement("div");

  content.className = "seccion-con-analisis";


  /* COLUMNA DATOS */

  const columnaDatos =
    document.createElement("div");

  columnaDatos.className = "columna-datos";


  for (const group of config.groups) {

    const availableGroupIndicators =
      group.indicators.filter(
        id => availableIndicators.includes(id)
      );

    if (!availableGroupIndicators.length) {
      continue;
    }


    const groupElement =
      document.createElement("div");

    groupElement.className = "metric-group";


    const groupTitle =
      document.createElement("h3");

    groupTitle.className =
      "metric-group-title";

    groupTitle.textContent =
      group.title;

    groupElement.append(groupTitle);


    const grid =
      document.createElement("div");

    grid.className = "kpi-grid";


    for (
      const indicatorId
      of availableGroupIndicators
    ) {

      const presentation =
        kpiPresentation[indicatorId] ?? {};

      const card =
        KpiCard(spainData, {

          indicatorId,

          title:
            presentation.title ??
            getTitle(indicatorId),

          formatValue:
            presentation.formatValue ??
            formatter(indicatorId),

          unitLabel:
            presentation.unitLabel ?? "",

          isPercentage:
            presentation.isPercentage ??
            isPercentage(indicatorId),

          comparisonMode:
            presentation.comparisonMode ??
            "auto"

        });

      grid.append(card);
    }


    groupElement.append(grid);

    columnaDatos.append(groupElement);
  }


  content.append(columnaDatos);


  /* ============================
     ANÁLISIS IDEA LAB
     ============================ */

  const analysis =
    typeof config.analysis === "function"
      ? config.analysis()
      : config.analysis ?? [];


  if (analysis.length) {

    const columnaAnalisis =
      document.createElement("aside");

    columnaAnalisis.className =
      "columna-analisis";


    const analysisTitle =
      document.createElement("h4");

    analysisTitle.textContent =
      "Análisis Idea Lab";

    columnaAnalisis.append(
      analysisTitle
    );


    for (const text of analysis) {

      const paragraph =
        document.createElement("p");

      paragraph.textContent = text;

      columnaAnalisis.append(
        paragraph
      );
    }


    content.append(
      columnaAnalisis
    );
  }


  section.append(content);

  return section;
}




const selectedIndicators = preferredIds
  .filter(id => availableIndicators.includes(id));

const fallbackIndicators = availableIndicators
  .filter(id => !selectedIndicators.includes(id));

const indicatorsToShow = preferredIds
  .filter(id => availableIndicators.includes(id));


const years = data
  .map(d => d.year)
  .filter(Number.isFinite);

const latestDatasetYear =
  years.length ? Math.max(...years) : "—";

const observationCount = data.length;
const indicatorCount = availableIndicators.length;
```


<div id="inicio" class="hero">
  <div class="hero-kicker">UN PRODUCTO DE IDEA LAB · OBSERVATORIO DE ESPAÑA</div>
  <h1>España en Datos</h1>
  <div class="hero-subtitle">
    Nuestro observatorio económico, social e institucional de España. Reunimos, contrastamos y visualizamos datos de fuentes oficiales para ofrecer una mirada rigurosa y comprensible de la realidad.
  </div>
  <div class="hero-actions">
    <a href="#mapa-dinero">Explorar el mapa del dinero</a>
    <a href="./quienes-somos">Quiénes somos</a>
  </div>
</div>


```js
const meta = document.createElement("div");
meta.className = "hero-meta";

meta.innerHTML = `
  <span>
    <strong>${indicatorCount}</strong> indicadores
  </span>

  <span>
    <strong>${observationCount.toLocaleString("es-ES")}</strong>
    observaciones
  </span>

  <span>
    Último año presente en alguna serie:
    <strong>${latestDatasetYear}</strong>
  </span>
`;

display(meta);
```

<section id="mapa-dinero" class="il-sankey-spotlight">
  <div class="il-spotlight-top">
    <div>
      <div class="il-spotlight-kicker">LA VISUALIZACIÓN PRINCIPAL · FINANZAS PÚBLICAS</div>
      <h2>¿De dónde sale el dinero y en qué se gasta?</h2>
      <p>Explora el recorrido de los recursos públicos: ingresos, financiación y funciones de gasto. Selecciona cada rama para consultar importes, fuentes y metodología.</p>
    </div>
    <a href="./finanzas-publicas" class="il-sankey-cta">Ver análisis completo ↗</a>
  </div>
  <div class="il-sankey-meta">Ejercicio histórico · Sector consolidado S.13 · Datos sujetos a revisión · No se asignan impuestos a gastos concretos.</div>
</section>

```js
import {PublicFinanceExplorer} from "./components/public-finance-sankey.js";

const spotlightFinanceRaw = await FileAttachment("./data/public-finance.csv").csv({typed:true});
const spotlightSources = await FileAttachment("./data/public-finance-sources.csv").csv({typed:true});
const spotlightTaxes = await FileAttachment("./data/public-finance-tax-figures.csv").csv({typed:true});
const pensionMonthlyRows = await FileAttachment("./data/pensions-payroll.csv").csv({typed:true});
const spotlightFinance = spotlightFinanceRaw
  .map(d => ({...d, year:Number(d.year), value:Number(d.value)}))
  .filter(d => Number.isFinite(d.year) && Number.isFinite(d.value));
const spotlightYears = [...new Set(spotlightFinance
  .filter(d => d.parent_code === "S13.GASTO" && d.side === "gasto" && String(d.level) === "1")
  .map(d => d.year))].sort((a,b) => b-a);
const spotlightDataUrl = await FileAttachment("./data/public-finance.csv").url();
const spotlightWorkbookUrl = await FileAttachment("./data/public-finance.xlsx").url();
if (!spotlightYears.length) {
  throw new Error("Sankey: no existe ningún ejercicio con cierre de gasto público completo.");
}
const spotlightSankey = PublicFinanceExplorer(
  spotlightFinance, spotlightSources, spotlightTaxes,
  {year:spotlightYears[0],dataUrl:spotlightDataUrl,workbookUrl:spotlightWorkbookUrl}
);
display(spotlightSankey);

const spendingRows = spotlightFinance
  .filter(d => d.year === spotlightYears[0] && d.parent_code === "S13.GASTO" &&
    d.side === "gasto" && String(d.level) === "1")
  .sort((a,b) => b.value - a.value);
const centre = spotlightFinance.find(d => d.year === spotlightYears[0] && d.code === "S13.GASTO");
const spendingSum = spendingRows.reduce((a,d)=>a+d.value,0);
if (centre && spendingRows.length === 10 && Math.abs(spendingSum-centre.value)<1) {
  const section = document.createElement("section");
  section.className = "il-finance-coverage";
  section.setAttribute("aria-label","Detalle completo de las diez funciones oficiales del gasto");
  section.innerHTML = '<h3>Las 10 funciones del gasto público, sin ramas ocultas</h3><p>Clasificación COFOG de 2024 (IGAE). Haz clic en una rama del Sankey para explorar el siguiente nivel. El total de estas diez funciones cuadra exactamente con el gasto público consolidado.</p>';
  const table = document.createElement("table");
  const header = document.createElement("thead");
  header.innerHTML="<tr><th>Función del gasto</th><th>Millones €</th><th>% del gasto</th></tr>";
  table.append(header);
  const tbody=document.createElement("tbody");
  const fmt=new Intl.NumberFormat("es-ES",{maximumFractionDigits:1});
  for (const item of spendingRows) {
    const tr=document.createElement("tr");
    for (const val of [item.indicator_name,fmt.format(item.value),fmt.format(item.value/centre.value*100)+" %"]) {
      const td=document.createElement("td");
      td.textContent=val;
      tr.append(td);
    }
    tbody.append(tr);
  }
  const total=document.createElement("tr");
  for (const v of ["TOTAL COFOG",fmt.format(spendingSum),"100 %"]) {
    const td=document.createElement("td");td.textContent=v;td.style.fontWeight="800";total.append(td);
  }
  tbody.append(total);table.append(tbody);section.append(table);display(section);
} else {
  const warning=document.createElement("div");
  warning.className="section-note";
  warning.textContent="El desglose funcional no ha superado la conciliación. No se publican porcentajes hasta corregirlo.";
  display(warning);
}

const highlightedTaxes=(spotlightTaxes||[])
  .filter(d=>Number(d.year)===spotlightYears[0] &&
    Number.isFinite(Number(d.value_mill_eur)) &&
    Number(d.value_mill_eur)>0)
  .sort((a,b)=>Number(b.value_mill_eur)-Number(a.value_mill_eur))
  .slice(0,12);
if(highlightedTaxes.length) {
  const panel=document.createElement("section");panel.className="il-finance-coverage";
  panel.setAttribute("aria-label","Figuras tributarias documentadas por subsector");
  panel.innerHTML="<h3>Impuestos y figuras tributarias destacados</h3><p>Importes de 2024 extraídos de las cuentas de los distintos subsectores. <strong>Este listado no es exhaustivo ni se puede sumar</strong>: no reconstruye la recaudación consolidada de España y no debe confundirse con el total de ingresos del Sankey.</p>";
  const table=document.createElement("table");
  const thead=document.createElement("thead");
  thead.innerHTML="<tr><th>Figura tributaria</th><th>Subsector</th><th>Millones €</th></tr>";
  table.append(thead);
  const tbody=document.createElement("tbody");
  const format=new Intl.NumberFormat("es-ES",{maximumFractionDigits:0});
  for(const item of highlightedTaxes){
    const tr=document.createElement("tr");
    for (const value of [item.tax_figure,item.subsector,format.format(Number(item.value_mill_eur))]){
      const td=document.createElement("td");td.textContent=String(value);tr.append(td);
    }
    tbody.append(tr);
  }
  table.append(tbody);panel.append(table);display(panel);
}
```

<div class="il-spotlight-footnote">La necesidad de financiación (déficit) se representa separada de los ingresos no financieros. <a href="./metodologia">Consulta las limitaciones</a> y <a href="./actualizaciones">las fechas de actualización</a>.</div>

```js
// 1. Imprimimos el título y la descripción arriba de todo (ocupando el ancho completo)
const header = document.createElement("div");
header.id = "resumen";
header.className = "section-header dashboard-section first";
header.style.borderTop = "none";
header.style.marginTop = "0";
header.innerHTML = `
  <div class="section-kicker">Últimos datos disponibles</div>
  <h2>España en un minuto</h2>
  <div class="section-description">
    Indicadores con distintas fechas de referencia. Verifica el año de cada dato y consulta su fuente antes de interpretarlo.
  </div>
`;
display(header);

// 2. Creamos el contenedor en dos columnas para poner las tarjetas y el análisis al lado
const seccionContainer = document.createElement("div");
seccionContainer.className = "seccion-con-analisis";


// Columna izquierda: Las tarjetas KPI
const columnaDatos = document.createElement("div");
columnaDatos.className = "columna-datos";

const grid = document.createElement("div");
grid.className = "kpi-grid";

for (const indicatorId of indicatorsToShow) {
  const presentation = kpiPresentation[indicatorId] ?? {};
  const card = KpiCard(spainData, {
    indicatorId,
    title: presentation.title ?? getTitle(indicatorId),
    formatValue: presentation.formatValue ?? formatter(indicatorId),
    unitLabel: presentation.unitLabel ?? "",
    isPercentage: presentation.isPercentage ?? isPercentage(indicatorId),
    comparisonMode: presentation.comparisonMode ?? "auto"
  });
  grid.append(card);
}
columnaDatos.append(grid);
seccionContainer.append(columnaDatos);

// Columna derecha: El cuadro de Análisis Idea Lab
const columnaAnalisis = document.createElement("div");
columnaAnalisis.className = "columna-analisis";
columnaAnalisis.innerHTML = `
  <h4>Análisis Idea Lab</h4>
  <p>
    España combina crecimiento económico positivo con
    desequilibrios relevantes en empleo, cuentas públicas,
    vivienda y vulnerabilidad social.
  </p>
  <p>
    La lectura de la situación exige observar conjuntamente
    crecimiento, renta, salarios, desempleo, deuda,
    precios, vivienda y exclusión social; una mejora en
    una dimensión no implica necesariamente una mejora
    equivalente en las demás.
  </p>
`;
seccionContainer.append(columnaAnalisis);

// Mostramos el bloque de dos columnas
display(seccionContainer);

// 3. Renderizamos el resto de secciones del dashboard normalmente
const sectionOrder = [
  "economia",
  "empleo",
  "vivienda",
  "estado",
  "pensiones",
  "sociedad",
  "mundo"
];

for (const sectionId of sectionOrder) {
  display(
    renderMetricSection(sectionId)
  );
}

// Si llegamos desde otra página con un hash (p. ej. /#estado), el navegador
// puede intentar desplazarse antes de que Observable haya creado la sección.
// Repetimos el desplazamiento una vez renderizados todos los bloques dinámicos.
function scrollToCurrentHash() {
  const id = decodeURIComponent(window.location.hash.slice(1));
  if (!id) return;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({
          behavior: "auto",
          block: "start"
        });
      }
    });
  });
}

scrollToCurrentHash();
window.addEventListener("hashchange", scrollToCurrentHash);
```

