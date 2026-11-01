---
title: Sankeys por ministerio y comunidad autónoma | España en Datos | IDEA LAB
theme: light
sidebar: false
toc: false
footer: IDEA LAB · Investigación y divulgación independiente
---

<style>
:root{--idealab-navy:#0b2447;--idealab-gold:#b89b5e;--idealab-border:#e3e6ea;--idealab-muted:#667085}
.observablehq{width:100%;max-width:none!important;padding-inline:clamp(13px,2.6vw,44px)!important;box-sizing:border-box}
.il-admin-intro{width:100%;max-width:none!important;margin:22px 0 15px;padding-bottom:14px;border-bottom:3px solid #b89b5e}
.il-admin-intro .label{font:800 .75rem/1.4 system-ui,sans-serif;letter-spacing:.11em;color:#a18445;text-transform:uppercase}
.il-admin-intro h1{font:700 clamp(1.9rem,4.1vw,3.5rem)/1.17 Georgia,serif;margin:9px 0;color:#0b2447}
.il-admin-intro p{width:100%;max-width:none!important;text-align:justify;text-align-last:left;color:#61738c;font:400 .98rem/1.55 Georgia,serif;margin:0}
.il-admin-coverage{display:flex;gap:9px;flex-wrap:wrap;margin:10px 0 18px}
.il-admin-coverage span{border:1px solid #e2e7ed;border-radius:7px;background:#fbfcff;color:#51647b;font:700 .76rem/1.35 system-ui;padding:8px 10px}
@media(max-width:700px){.il-admin-intro{margin-top:10px}.il-admin-intro h1{font-size:1.85rem}}
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




</style>

<nav class="idealab-nav" aria-label="Navegación de España en Datos">
  <div class="il-header-identity">
    <a class="idealab-brand" href="/" aria-label="España en Datos, inicio">España en Datos</a>
    <a class="il-parent-brand" href="https://idealab2026.github.io/" aria-label="UN PRODUCTO DE IDEA LAB · Visitar la web corporativa">
      <span>Un producto de</span><img class="idealab-brand-logo" src="./logo-idea-lab.svg" alt="IDEA LAB" width="72" height="17" />
    </a>
  </div>
  <div class="idealab-nav-links">
    <a class="idealab-nav-priority" href="/#mapa-dinero">Mapa del dinero</a>
    <a href="/visualizaciones.html">Visualizaciones</a>
    <details class="idealab-nav-areas">
      <summary>Áreas temáticas</summary>
      <div class="idealab-nav-areas-panel">
        <a class="il-areas-overview" href="/#resumen">España en un minuto</a>
        <a href="/#economia">Economía</a>
        <a href="/#empleo">Empleo</a>
        <a href="/#vivienda">Vivienda</a>
        <a href="/#estado">Sector público</a>
        <a href="/#pensiones">Pensiones</a>
        <a href="/#sociedad">Sociedad</a>
        <a href="/#mundo">Mundo</a>
      </div>
    </details>
    <a href="/finanzas-publicas.html">Finanzas públicas</a>
    <a href="/buscador-partidas.html">Buscar partidas</a>
    <a class="is-active" aria-current="page" href="/administraciones.html">Administraciones</a>
    <details class="il-nav-more">
      <summary>Más</summary>
      <div class="il-nav-more-panel">
        <a href="/metodologia.html">Metodología</a>
        <a href="/actualizaciones.html">Actualizaciones</a>
        <a href="/quienes-somos.html">Quiénes somos</a>
        <a href="https://x.com/LARREALIDAD" target="_blank" rel="noopener noreferrer">Canal en X ↗</a>
      </div>
    </details>
  </div>
  <details class="idealab-nav-mobile">
    <summary aria-label="Abrir menú de navegación">Menú <span aria-hidden="true">☰</span></summary>
    <div class="idealab-nav-mobile-panel">
      <a href="/">Inicio</a>
      <a href="/#mapa-dinero">Mapa del dinero</a>
      <a href="/visualizaciones.html">Visualizaciones</a>
      <a href="/finanzas-publicas.html">Finanzas públicas</a>
      <a href="/buscador-partidas.html">Buscar partidas</a>
      <a href="/administraciones.html" aria-current="page">Administraciones</a>
      <div class="idealab-nav-mobile-heading">Áreas temáticas</div>
      <a class="il-areas-overview" href="/#resumen">España en un minuto</a>
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
</nav>

```js

const pointerCanHover = window.matchMedia("(hover: hover) and (pointer: fine)");
const desktopNav = window.matchMedia("(min-width: 1101px)");
const navDropdowns = [...document.querySelectorAll(".idealab-nav .idealab-nav-areas, .idealab-nav .il-nav-more")];
const closeNavDropdowns = except => {
  for (const item of navDropdowns) if (item !== except) item.open = false;
};
for (const item of navDropdowns) {
  item.addEventListener("pointerenter", event => {
    if (event.pointerType !== "mouse" || !pointerCanHover.matches || !desktopNav.matches) return;
    closeNavDropdowns(item);
    item.open = true;
  });
  item.addEventListener("pointerleave", event => {
    if (event.pointerType === "mouse") item.open = false;
  });
  item.addEventListener("focusout", event => {
    if (!item.contains(event.relatedTarget)) item.open = false;
  });
  item.querySelector("summary")?.addEventListener("click", event => {
    // Con ratón la apertura es por hover; no cerrar al clicar el título.
    if (pointerCanHover.matches && desktopNav.matches && event.detail > 0) event.preventDefault();
  });
  item.addEventListener("click", event => {
    if (event.target.closest("a")) item.open = false;
  });
}
document.addEventListener("pointerdown", event => {
  if (!navDropdowns.some(item => item.contains(event.target))) closeNavDropdowns();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeNavDropdowns();
});
const compactNav = document.querySelector(".idealab-nav-mobile");
if (compactNav) {
  compactNav.addEventListener("pointerenter", event => {
    if (event.pointerType === "mouse" && pointerCanHover.matches && !desktopNav.matches) compactNav.open = true;
  });
  compactNav.addEventListener("pointerleave", event => {
    if (event.pointerType === "mouse") compactNav.open = false;
  });
}

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

<section class="il-admin-intro">
  <div class="label">IDEA LAB · Observatorio de las Administraciones Públicas</div>
  <h1>El dinero público, administración por administración</h1>
  <p>Explora los flujos de gasto de cada ministerio y de cada comunidad autónoma. Los ministerios muestran los programas de los Presupuestos Generales del Estado prorrogados; las comunidades muestran el gasto registrado por funciones COFOG. Las dos series tienen perímetros, ejercicios y metodologías distintos y no deben sumarse entre sí.</p>
</section>

<div class="il-admin-coverage">
  <span>22 ministerios · presupuestos prorrogados 2026 (tablas 2025-P)</span>
  <span>17 comunidades autónomas · gasto COFOG 2024</span>
  <span>Fuentes oficiales IGAE y Secretaría de Estado de Presupuestos</span>
</div>

```js
import {AdministrationSankeys} from "./components/administration-sankeys.js";
const administrationData = await FileAttachment("./data/admin-sankeys.json").json();
const administrationExplorer = AdministrationSankeys(administrationData);
display(administrationExplorer);
```

