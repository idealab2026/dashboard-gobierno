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
  max-width: none;
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


/* IDEA LAB EDITORIAL LAYOUT: unbroken full-width content on every page.
   Keep numeric figures, tables, navigation and Sankey labels left/right aligned. */
.observablehq, #observablehq-main {
  box-sizing: border-box;
  width: 100%;
  max-width: 1680px !important;
  margin-inline: auto;
  padding-inline: clamp(12px, 2.6vw, 46px);
}
:is(.observablehq, #observablehq-main) > :is(p, blockquote, h1, h2, h3, ul, ol) {
  box-sizing: border-box;
  width: 100%;
  max-width: none;
}
:is(.observablehq, #observablehq-main) > p,
:is(.observablehq, #observablehq-main) > blockquote p {
  text-align: justify;
  text-align-last: left;
  hyphens: auto;
  -webkit-hyphens: auto;
}
@media (max-width: 768px) {
  .observablehq, #observablehq-main { padding-inline: 12px; }
}

/* Public finance: explanatory copy spans the canvas; Sankey sizing is unchanged. */
.pf-hero p, .pf-after-map p, .pf-documentation p,
.pf-source-note p, .pf-footnote {
  box-sizing: border-box;
  width: 100%;
  max-width: none;
  text-align: justify;
  text-align-last: left;
  hyphens: auto;
  -webkit-hyphens: auto;
}


/* IDEA LAB logotype: shared visual identity without replacing product naming. */
.idealab-brand {display:inline-flex; align-items:center; gap:.55rem; min-width:0;}
.idealab-brand-logo {display:block; flex:none; width:clamp(126px,12vw,160px); height:auto; aspect-ratio:660/156; object-fit:contain;}
@media(max-width:768px) {
  .idealab-brand-logo {width:118px;}
  .idealab-brand-product {display:none!important;}
}


/* Cabecera V3: producto primero, afiliación corporativa única y menús compactos. */
.idealab-nav {
  position: sticky; top: 0; z-index: 1100;
  display: flex; flex-direction: row; align-items: center; justify-content: space-between;
  flex-wrap: nowrap; gap: 18px; min-height: 66px; padding: 10px 14px;
  background: rgba(255,255,255,.98); border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 5px rgba(11,36,71,.04);
}
.il-header-identity {display:inline-flex;flex-direction:row;align-items:center;gap:10px;min-width:0;flex:none;white-space:nowrap;}
.idealab-nav .idealab-brand {
  display:inline-flex;align-items:center;flex:none;
  color:#0b2447!important;font-family:Georgia,serif;
  font-weight:800;letter-spacing:-.025em;font-size:clamp(1.06rem,1.35vw,1.28rem);
  white-space:nowrap;text-decoration:none!important;line-height:1.1;
}
.il-parent-brand {
  display:inline-flex;align-items:center;gap:5px;max-width:100%;
  color:#607189!important;text-decoration:none!important;
  font-family:system-ui,-apple-system,sans-serif;font-size:.67rem;
  font-weight:600;letter-spacing:0;line-height:1.2;
}
.il-parent-brand span {white-space:nowrap;}
.il-parent-brand .idealab-brand-logo {
  width:72px;height:auto;max-width:72px;aspect-ratio:660/156;
}
.il-parent-brand:hover {color:#0b2447!important;}
.idealab-nav .idealab-nav-links {
  min-width:0;width:auto;flex:1;display:flex;align-items:center;justify-content:flex-end;
  gap:clamp(8px,1.15vw,18px);flex-wrap:nowrap;overflow:visible;
  white-space:nowrap;padding:0;
}
.idealab-nav .idealab-nav-links > a,
.idealab-nav .idealab-nav-links > details > summary {
  color:#44566d!important;text-decoration:none!important;font-family:system-ui,-apple-system,sans-serif;
  font-size:.80rem;font-weight:650;line-height:1.3;white-space:nowrap;
}
.idealab-nav .idealab-nav-links > a:hover,
.idealab-nav .idealab-nav-links > details > summary:hover {color:#0b2447!important;}
.idealab-nav .idealab-nav-links .idealab-nav-priority {color:#0b2447!important;font-weight:750!important;}
.idealab-nav .idealab-nav-links a.is-active {color:#0b2447!important;font-weight:800!important;}
.idealab-nav :is(.idealab-nav-areas,.il-nav-more) {position:relative;font-family:system-ui,-apple-system,sans-serif;}
.idealab-nav :is(.idealab-nav-areas,.il-nav-more) > summary {
  list-style:none;cursor:pointer;display:inline-flex;align-items:center;gap:4px;min-height:32px;
}
.idealab-nav :is(.idealab-nav-areas,.il-nav-more) > summary::-webkit-details-marker {display:none;}
.idealab-nav :is(.idealab-nav-areas,.il-nav-more) > summary::after {content:"▾";font-size:.7rem;color:#718096;}
.idealab-nav :is(.idealab-nav-areas,.il-nav-more)[open] > summary::after {content:"▴";}
.idealab-nav :is(.idealab-nav-areas-panel,.il-nav-more-panel) {
  position:absolute;top:calc(100% + 10px);z-index:1200;
  min-width:178px;display:grid;gap:2px;padding:8px;background:#fff;
  border:1px solid #dce3eb;border-radius:10px;box-shadow:0 14px 32px rgba(11,36,71,.13);
}
.idealab-nav .idealab-nav-areas-panel {left:0;min-width:218px;}
.idealab-nav .idealab-nav-areas-panel .il-areas-overview {font-weight:800!important;color:#0b2447!important;border-bottom:1px solid #e2e8f0;border-radius:0;padding-bottom:11px;margin-bottom:3px;}
.idealab-nav .il-nav-more-panel {right:0;}
.idealab-nav :is(.idealab-nav-areas-panel,.il-nav-more-panel) a {
  display:block;padding:9px 10px;min-height:20px;border-radius:6px;white-space:nowrap;
  font-size:.79rem!important;font-weight:600!important;color:#314863!important;text-decoration:none!important;
}
.idealab-nav :is(.idealab-nav-areas-panel,.il-nav-more-panel) a:hover {background:#f3f6f9;}
.idealab-nav a:focus-visible,
.idealab-nav summary:focus-visible {outline:2px solid #b89b5e;outline-offset:3px;}
@media (max-width:1100px) {
  .idealab-nav {
    position:sticky!important;display:flex!important;flex-direction:row!important;
    align-items:center!important;justify-content:space-between!important;flex-wrap:nowrap!important;
    gap:7px!important;min-height:56px!important;padding:7px 9px!important;
  }
  .idealab-nav .idealab-nav-links {display:contents!important;}
  .idealab-nav .idealab-nav-links > :not(.idealab-nav-priority) {display:none!important;}
  .idealab-nav .idealab-nav-links .idealab-nav-priority {
    display:inline-flex!important;flex:none;align-items:center;justify-content:center;
    min-height:38px;margin-left:auto;padding:0 9px;border-radius:8px;
    border:1px solid #dbe3ec;background:#f7f9fc;
    font-size:.72rem!important;font-weight:750!important;
  }
  .idealab-nav .idealab-nav-mobile {display:block!important;position:relative;flex:none;}
  .idealab-nav .idealab-nav-mobile > summary {
    display:inline-flex;align-items:center;gap:6px;min-height:38px;padding:0 11px;
    list-style:none;cursor:pointer;border-radius:8px;background:#0b2447;
    color:#fff;font-family:system-ui,-apple-system,sans-serif;font-size:.78rem;font-weight:700;
  }
  .idealab-nav .idealab-nav-mobile > summary::-webkit-details-marker {display:none;}
  .idealab-nav .idealab-nav-mobile-panel {
    position:absolute;right:0;top:calc(100% + 9px);z-index:1500;
    display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:3px 5px;
    width:min(320px,calc(100vw - 25px));max-height:calc(100dvh - 75px);
    overflow:auto;overscroll-behavior:contain;background:white;
    border:1px solid #dce3eb;border-radius:11px;padding:10px;
    box-shadow:0 16px 32px rgba(11,36,71,.18);
  }
  .idealab-nav .idealab-nav-mobile-panel a {
    display:flex;align-items:center;min-height:38px;padding:8px 9px;
    font-family:system-ui,-apple-system,sans-serif;font-size:.78rem;
    border-radius:7px;color:#203c5b!important;text-decoration:none!important;
    overflow-wrap:anywhere;
  }
  .idealab-nav .idealab-nav-mobile-panel a:hover {background:#f3f6f9;}
  .idealab-nav .idealab-nav-mobile-heading {grid-column:1/-1;}
  .il-parent-brand .idealab-brand-logo {width:67px;}
}
@media (max-width:380px) {
  .idealab-nav .idealab-brand {font-size:.99rem!important;}
  .il-parent-brand span {display:none;}
  .il-parent-brand .idealab-brand-logo {width:68px;}
  .idealab-nav .idealab-nav-links .idealab-nav-priority {font-size:.68rem!important;padding-inline:7px;}
  .idealab-nav .idealab-nav-mobile > summary {padding-inline:8px;}
}


/* Identidad corporativa compacta: una única línea en todos los anchos. */
@media (max-width:1100px) {
  .il-header-identity, .il-site-identity {gap:6px;}
  .il-parent-brand > span, .il-site-parent > span {display:none;}
  .il-parent-brand .idealab-brand-logo, .il-site-parent .il-site-logo {
    display:block;width:28px!important;height:28px!important;max-width:28px;
    aspect-ratio:1!important;object-fit:cover!important;object-position:left center!important;
  }
}
@media (max-width:390px) {
  .il-header-identity, .il-site-identity {gap:4px;}
  .idealab-nav .idealab-brand, .il-site-navigation .il-site-brand {font-size:.95rem!important;}
  .idealab-nav .idealab-nav-links .idealab-nav-priority {font-size:.67rem!important;padding-inline:6px!important;}
  .il-site-navigation .il-site-home {font-size:.70rem!important;padding-inline:7px!important;}
}


/* Desplegables: sin hueco entre el disparador y el panel.
   Así el ratón puede pasar al panel sin disparar el cierre. */
@media (min-width:1101px) and (hover:hover) {
  .idealab-nav .idealab-nav-areas-panel,
  .idealab-nav .il-nav-more-panel {top:100%!important;margin-top:0!important;}
}



/* Atlas header: one deterministic, responsive navigation.
   These selectors supersede the legacy desktop/mobile header rules. */
.idealab-nav.il-atlas-nav{
  display:flex!important;flex-direction:row!important;align-items:center!important;
  justify-content:space-between!important;flex-wrap:nowrap!important;
  width:100%!important;max-width:100%!important;min-width:0!important;
  min-height:60px!important;box-sizing:border-box!important;
  position:sticky!important;top:0!important;z-index:1150!important;
  gap:14px!important;padding:10px 13px!important;
  background:#fff!important;border:0!important;border-bottom:1px solid #dfe6ed!important;
  box-shadow:0 1px 3px rgba(11,36,71,.04)!important;
}
.il-atlas-nav .il-header-identity{
  display:flex!important;align-items:center!important;gap:9px!important;
  min-width:0!important;max-width:100%!important;flex:0 1 auto!important;
  white-space:nowrap;
}
.il-atlas-nav .idealab-brand{
  font:800 clamp(1.02rem,1.7vw,1.24rem)/1.15 Georgia,serif!important;
  color:#0b2447!important;letter-spacing:-.02em!important;
  text-decoration:none!important;white-space:nowrap!important;
  flex:0 0 auto!important;
}
.il-atlas-nav .il-parent-brand{
  display:inline-flex!important;align-items:center!important;gap:5px!important;
  max-width:100%!important;flex:0 1 auto!important;text-decoration:none!important;
  font:650 .65rem/1.2 system-ui,sans-serif!important;color:#6c7d91!important;
}
.il-atlas-nav .il-parent-brand img{
  width:66px!important;height:auto!important;max-width:66px!important;
  object-fit:contain!important;aspect-ratio:660/156!important;
}
.il-atlas-nav .il-atlas-nav-actions{
  display:flex;align-items:center;justify-content:flex-end;gap:clamp(8px,1.6vw,20px);
  min-width:0;flex:0 1 auto;margin-left:auto;
}
.il-atlas-nav .il-atlas-nav-shortcut{
  color:#4d6179!important;font:700 .76rem/1.3 system-ui,sans-serif!important;
  white-space:nowrap;text-decoration:none!important;
}
.il-atlas-nav .il-atlas-nav-shortcut.is-active{
  color:#0b2447!important;font-weight:850!important;
}
.il-atlas-nav .il-atlas-menu{
  display:block!important;position:relative!important;min-width:0!important;
  flex:0 0 auto!important;
}
.il-atlas-nav .il-atlas-menu > summary{
  display:inline-flex!important;align-items:center!important;justify-content:center!important;
  list-style:none!important;gap:8px!important;min-height:37px!important;
  box-sizing:border-box!important;padding:7px 12px!important;
  border:1px solid #ccd8e3!important;border-radius:7px!important;
  background:#f9fafc!important;color:#163352!important;
  font:800 .77rem/1.2 system-ui,sans-serif!important;
  white-space:nowrap!important;cursor:pointer!important;
}
.il-atlas-nav .il-atlas-menu > summary::-webkit-details-marker{display:none!important}
.il-atlas-nav .il-atlas-menu > summary::marker{content:""}
.il-atlas-nav .il-atlas-menu[open] > summary{
  background:#0b2447!important;border-color:#0b2447!important;color:#fff!important;
}
.il-atlas-nav .il-atlas-menu .il-atlas-menu-panel{
  display:none!important;position:absolute!important;right:0!important;
  left:auto!important;top:calc(100% + 6px)!important;
  z-index:1600!important;box-sizing:border-box!important;
  width:min(350px,calc(100vw - 24px))!important;
  max-height:min(74dvh,620px)!important;overflow-y:auto!important;
  overscroll-behavior:contain!important;
  grid-template-columns:repeat(2,minmax(0,1fr))!important;
  gap:4px!important;margin:0!important;padding:11px!important;
  background:#fff!important;color:#173653!important;
  border:1px solid #d5e0ea!important;border-radius:10px!important;
  box-shadow:0 15px 40px rgba(13,37,68,.18)!important;
}
.il-atlas-nav .il-atlas-menu[open] > .il-atlas-menu-panel{
  display:grid!important;
}
.il-atlas-nav .il-atlas-menu-panel a{
  display:flex!important;min-width:0!important;align-items:center!important;
  min-height:34px!important;padding:7px 9px!important;
  background:transparent!important;color:#274561!important;
  border-radius:6px!important;text-decoration:none!important;
  font:650 .75rem/1.3 system-ui,sans-serif!important;
  white-space:normal!important;overflow-wrap:anywhere!important;
}
.il-atlas-nav .il-atlas-menu-panel a:hover,
.il-atlas-nav .il-atlas-menu-panel a:focus-visible{
  background:#eef3f8!important;color:#0b2447!important;
}
.il-atlas-nav .il-atlas-menu-panel a[aria-current="page"]{
  font-weight:850!important;background:#edf2f9!important;
}
.il-atlas-nav .il-atlas-menu-panel .idealab-nav-mobile-heading{
  grid-column:1/-1!important;color:#8b6c38!important;background:transparent!important;
  margin:8px 0 1px!important;padding:5px 7px 2px!important;
  font:850 .65rem/1.25 system-ui,sans-serif!important;
  letter-spacing:.08em!important;text-transform:uppercase!important;
  border:0!important;
}
@media(max-width:800px){
  .il-atlas-nav .il-atlas-nav-shortcut{display:none!important}
  .idealab-nav.il-atlas-nav{min-height:54px!important;padding:8px 10px!important}
  .il-atlas-nav .il-parent-brand > span{display:none!important}
  .il-atlas-nav .il-parent-brand img{
    width:28px!important;height:28px!important;max-width:28px!important;
    aspect-ratio:1!important;object-fit:cover!important;object-position:left center!important;
  }
}
@media(max-width:390px){
  .il-atlas-nav .idealab-brand{font-size:.98rem!important}
  .il-atlas-nav .il-header-identity{gap:5px!important}
  .il-atlas-nav .il-atlas-menu > summary{padding:7px 9px!important}
  .il-atlas-nav .il-atlas-menu-panel{grid-template-columns:1fr!important}
}

</style>


<nav class="idealab-nav il-atlas-nav" aria-label="Navegación de España en Datos">
  <div class="il-header-identity">
    <a class="idealab-brand" href="/" aria-label="España en Datos, inicio">España en Datos</a>
    <a class="il-parent-brand" href="https://idealab2026.github.io/" aria-label="IDEA LAB, web corporativa">
      <span>Un producto de</span><img class="idealab-brand-logo" src="./logo-idea-lab.svg" alt="IDEA LAB" width="72" height="17" />
    </a>
  </div>
  <div class="il-atlas-nav-actions">
    <a class="il-atlas-nav-shortcut" href="/#mapa-dinero">Mapa del dinero</a>
    <a class="il-atlas-nav-shortcut" href="/visualizaciones.html">Visualizaciones</a>
    <details class="idealab-nav-mobile il-atlas-menu">
      <summary aria-label="Abrir o cerrar menú de navegación">Menú <span aria-hidden="true">☰</span></summary>
      <div class="idealab-nav-mobile-panel il-atlas-menu-panel">
        <a href="/">Inicio</a>
        <a href="/#mapa-dinero">Mapa del dinero</a>
        <a href="/visualizaciones.html">Visualizaciones</a>
        <a href="/finanzas-publicas.html" aria-current="page">Finanzas públicas</a>
        <a href="/buscador-partidas.html">Buscar partidas</a>
        <a href="/administraciones.html">Administraciones</a>
        <div class="idealab-nav-mobile-heading">Áreas temáticas</div>
        <a href="/#resumen">España en un minuto</a>
        <a href="/#economia">Economía</a>
        <a href="/#empleo">Empleo</a>
        <a href="/#vivienda">Vivienda</a>
        <a href="/#estado">Sector público</a>
        <a href="/#pensiones">Pensiones</a>
        <a href="/#sociedad">Sociedad</a>
        <a href="/#mundo">Mundo</a>
        <div class="idealab-nav-mobile-heading">Más información</div>
        <a href="/metodologia.html">Metodología</a>
        <a href="/actualizaciones.html">Actualizaciones</a>
        <a href="/quienes-somos.html">Quiénes somos</a>
        <a href="https://x.com/LARREALIDAD" target="_blank" rel="noopener noreferrer">Canal en X ↗</a>
      </div>
    </details>
  </div>
</nav>

```js
// Menú único: cierre al navegar, al hacer clic fuera o al pulsar Escape.
const atlasMenu=document.querySelector(".il-atlas-nav .il-atlas-menu");
if(atlasMenu){
  atlasMenu.querySelectorAll(".il-atlas-menu-panel a").forEach(a=>{
    a.addEventListener("click",()=>{atlasMenu.open=false;});
  });
  document.addEventListener("pointerdown",event=>{
    if(atlasMenu.open&&!atlasMenu.contains(event.target))atlasMenu.open=false;
  });
  document.addEventListener("keydown",event=>{
    if(event.key==="Escape")atlasMenu.open=false;
  });
}
// Diagnóstico visual automatizado en Chrome (solo con ?nav-qa=1).
if(new URLSearchParams(window.location.search).has("nav-qa")){
  const head=document.querySelector(".il-atlas-nav");
  const menu=document.querySelector(".il-atlas-menu");
  menu?.querySelector("summary")?.click();
  requestAnimationFrame(()=>{
    const panel=menu?.querySelector(".il-atlas-menu-panel");
    const name=head?.querySelector(".idealab-brand");
    const trigger=menu?.querySelector("summary");
    const a=name?.getBoundingClientRect();
    const b=trigger?.getBoundingClientRect();
    const p=panel?.getBoundingClientRect();
    const issues=[];
    if(!menu?.open)issues.push("cerrado");
    if(getComputedStyle(panel).display!=="grid")issues.push("panel-no-visible");
    if(!a||!b||a.right>b.left-4)issues.push("logo-solapado");
    if(!p||p.left<0||p.right>window.innerWidth+1)issues.push("panel-desbordado");
    if(!p||p.top<b.bottom-3)issues.push("panel-encima");
    if(head?.querySelector(".idealab-nav-links"))issues.push("navegacion-duplicada");
    const result=document.createElement("div");
    result.id="il-atlas-nav-qa";
    result.dataset.status=issues.length?"fail":"ok";
    result.dataset.errors=issues.join(",");
    result.dataset.viewport=String(window.innerWidth);
    result.textContent=issues.length?"NAV_QA_FAIL "+issues.join(","):"NAV_QA_OK";
    document.body.append(result);
  });
}
```

<div style="margin: 0.6rem auto 1rem; max-width: 1400px; padding: 0.55rem 0.85rem; border: 1px solid #e3e6ea; border-radius: 10px; font-size: 0.84rem; color:#344054; background: #f8fafc;">Datos históricos en proceso de revisión. Algunas series están excluidas por metadatos ambiguos. <a href="/metodologia.html">Fuentes y limitaciones</a>.</div>

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
const verifiedSpendingCatalogue = await FileAttachment("./data/partidas-verificadas.json").json();

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
  <h2>Entradas, gasto público y deuda</h2>
  <p>${displayYear} · sector consolidado S.13 · clasificación funcional COFOG</p>
</div>

```js
const explorer = PublicFinanceExplorer(
  publicFinance,
  rawSources,
  rawTaxFigures,
  {year: displayYear, relatedPrograms: verifiedSpendingCatalogue.registros}
);
```

<div class="pf-explorer-host">${explorer}</div>

<div class="pf-after-map">
  <details>
    <summary>Cómo leer el diagrama</summary>
    <p>El diagrama superior representa recursos y gasto por finalidad de las Administraciones Públicas S.13; el déficit figura como brecha contable, nunca como dinero cobrado. La franja inferior muestra emisiones brutas, amortización de principal y emisión neta del Tesoro del Estado. Es un perímetro diferente y no constituye una conciliación global de caja. No atribuimos pagos concretos a impuestos individuales.</p>
  </details>
  <details>
    <summary>Criterio de publicación y trazabilidad</summary>
    <p>El gráfico se genera desde <code>Fact_finanzas_publicas</code>. Cada registro conserva fuente, metodología, estado y vintage. Las estadísticas con perímetros distintos se mantienen separadas en el data lake y no se fuerzan a coincidir artificialmente.</p>
  </details>
</div>
