---
title: Actualización de datos
theme: light
sidebar: false
toc: false
---


<style>
/* Editorial paragraphs, not labels or tabular values. */
.observablehq > p,.observablehq > blockquote p,.observablehq > div > p {
  text-align:justify;text-align-last:left;hyphens:auto;-webkit-hyphens:auto;
}

/* Consistent, unambiguous return to project home from information subpages. */
.il-site-navigation{position:sticky;top:0;z-index:1000;display:flex;gap:10px;
  align-items:center;justify-content:space-between;min-height:54px;
  padding:7px 12px;background:rgba(255,255,255,.98);border-bottom:1px solid #e1e7ee;
  box-shadow:0 1px 4px rgba(11,36,71,.05);}
.il-site-navigation a{text-decoration:none;color:#102a4c;}
.il-site-brand{font-family:Georgia,serif;font-weight:800;font-size:1.06rem;white-space:nowrap;}
.il-site-home{margin-left:auto;border:1px solid #dce3ec;border-radius:8px;
  padding:10px 13px;min-height:40px;box-sizing:border-box;
  font-size:.82rem;font-weight:750;}
.il-site-menu{position:relative;}
.il-site-menu>summary{list-style:none;display:flex;align-items:center;cursor:pointer;
  min-height:40px;padding:8px 13px;background:#0b2447;color:#fff;border-radius:8px;
  box-sizing:border-box;font-size:.82rem;font-weight:750;}
.il-site-menu>summary::-webkit-details-marker{display:none;}
.il-site-menu-links{position:absolute;right:0;top:calc(100% + 7px);
  display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px;
  width:min(320px,calc(100vw - 30px));max-height:70dvh;overflow-y:auto;
  padding:10px;background:white;border:1px solid #e0e6ef;border-radius:10px;
  box-shadow:0 12px 28px rgba(10,35,64,.16);}
.il-site-menu-links a{padding:10px 8px;min-height:40px;box-sizing:border-box;
  font-size:.8rem;border-radius:7px;overflow-wrap:anywhere;}
.il-site-menu-links a:hover{background:#f3f6f9;}
.il-site-navigation a:focus-visible,.il-site-navigation summary:focus-visible{
  outline:3px solid #b59b59;outline-offset:2px;}
@media(max-width:768px){
  .il-site-navigation{padding:7px 9px;min-height:53px;}
  .il-site-brand{font-size:.93rem;}
  .il-site-home{padding:9px;font-size:.76rem;}
  .il-site-menu>summary{padding:9px;font-size:.76rem;}
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

/* Updates: paragraphs expand; source tables and status labels remain untouched. */
:is(.observablehq, #observablehq-main) > :is(p, blockquote) {
  max-width: none;
  text-align: justify;
  text-align-last: left;
}


/* Shared brand identity on institutional subpages. */
.il-site-brand {display:inline-flex; align-items:center; min-width:0;}
.il-site-logo {display:block; width:clamp(122px,12vw,158px); height:auto; aspect-ratio:660/156; object-fit:contain;}
@media(max-width:768px){.il-site-logo{width:118px;}}


/* Misma jerarquía corporativa en todas las páginas informativas. */
.il-site-navigation {
  display:flex;align-items:center;justify-content:space-between;flex-wrap:nowrap;
  min-height:64px;gap:10px;padding:8px 12px;
  font-family:system-ui,-apple-system,sans-serif;
}
.il-site-identity {display:inline-flex;flex-direction:row;align-items:center;gap:10px;min-width:0;white-space:nowrap;}
.il-site-navigation .il-site-brand {
  display:inline-flex;font:800 clamp(1.05rem,1.4vw,1.28rem)/1.14 Georgia,serif;
  letter-spacing:-.025em;white-space:nowrap;color:#0b2447;
}
.il-site-parent {display:inline-flex;align-items:center;gap:5px;font-size:.67rem;
  color:#607189!important;font-weight:600;line-height:1.1;white-space:nowrap;}
.il-site-parent .il-site-logo {display:block;width:72px;height:auto;aspect-ratio:660/156;}
.il-site-navigation .il-site-home {font-size:.79rem;margin-left:auto;
  white-space:nowrap;display:inline-flex;align-items:center;justify-content:center;}
.il-site-navigation .il-site-menu {flex:none;}
.il-site-navigation .il-site-menu > summary {font-family:system-ui,-apple-system,sans-serif;}
.il-site-navigation a:focus-visible,.il-site-navigation summary:focus-visible {outline:2px solid #b89b5e;outline-offset:3px;}
@media (max-width:380px) {
 .il-site-navigation .il-site-brand {font-size:1rem;}
 .il-site-parent span {display:none;}
 .il-site-navigation .il-site-home {padding-inline:7px;font-size:.71rem;}
 .il-site-navigation .il-site-menu>summary {padding-inline:8px;font-size:.73rem;}
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



/* Corrección global: cabecera clásica restaurada, con versión compacta exclusiva. */
.idealab-nav{position:sticky!important;top:0!important;z-index:1450!important;
 box-sizing:border-box!important;width:100%!important;max-width:100%!important;
 display:flex!important;flex-direction:row!important;align-items:center!important;
 justify-content:space-between!important;flex-wrap:nowrap!important;gap:clamp(8px,1.1vw,18px)!important;
 margin:0!important;padding:10px 14px!important;min-height:62px!important;overflow:visible!important;
 background:rgba(255,255,255,.99)!important;border-bottom:1px solid #e2e8f0!important}
.idealab-nav .il-header-identity{display:flex!important;flex-direction:row!important;align-items:center!important;
 gap:9px!important;flex:0 0 auto!important;min-width:0!important}
.idealab-nav .idealab-nav-links{display:flex!important;align-items:center!important;justify-content:flex-end!important;
 flex:1 1 auto!important;min-width:0!important;width:auto!important;
 flex-wrap:nowrap!important;gap:clamp(7px,.92vw,17px)!important;white-space:nowrap!important;overflow:visible!important}
.idealab-nav .idealab-nav-links>a,.idealab-nav .idealab-nav-links>details>summary{
 font-size:clamp(.69rem,.8vw,.79rem)!important;white-space:nowrap!important}
.idealab-nav .idealab-nav-areas>.idealab-nav-areas-panel,
.idealab-nav .il-nav-more>.il-nav-more-panel{
 display:none!important;top:100%!important;margin:0!important;max-width:calc(100vw - 24px)!important;
 box-sizing:border-box!important}
.idealab-nav .idealab-nav-areas[open]>.idealab-nav-areas-panel,
.idealab-nav .il-nav-more[open]>.il-nav-more-panel{display:grid!important}
.idealab-nav .idealab-nav-mobile,
.idealab-nav .idealab-nav-mobile>.idealab-nav-mobile-panel{display:none!important}
@media(max-width:1279px){
 .idealab-nav{min-height:55px!important;gap:8px!important;padding:8px 11px!important}
 .idealab-nav .idealab-nav-links{display:none!important}
 .idealab-nav .il-header-identity{flex:0 1 auto!important;max-width:calc(100% - 110px)!important;
  min-width:0!important;overflow:hidden!important;gap:6px!important}
 .idealab-nav .idealab-brand{flex:0 1 auto!important;min-width:0!important;max-width:100%!important;
  overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
 .idealab-nav .il-parent-brand>span{display:none!important}
 .idealab-nav .il-parent-brand .idealab-brand-logo{
  display:block!important;width:28px!important;height:28px!important;max-width:28px!important;
  aspect-ratio:1!important;object-fit:cover!important;object-position:left center!important}
 .idealab-nav .idealab-nav-mobile{display:block!important;position:relative!important;
  flex:0 0 auto!important;margin:0 0 0 auto!important}
 .idealab-nav .idealab-nav-mobile>summary{
  display:inline-flex!important;align-items:center!important;gap:6px!important;min-height:38px!important;
  padding:7px 11px!important;list-style:none!important;cursor:pointer!important;
  background:#0b2447!important;color:#fff!important;border-radius:7px!important;
  font:750 .78rem/1.2 system-ui,sans-serif!important}
 .idealab-nav .idealab-nav-mobile>.idealab-nav-mobile-panel{
  display:none!important;position:absolute!important;right:0!important;left:auto!important;
  top:calc(100% + 7px)!important;z-index:1700!important;
  width:min(345px,calc(100vw - 22px))!important;max-width:calc(100vw - 22px)!important;
  max-height:min(72dvh,620px)!important;overflow-y:auto!important;overscroll-behavior:contain!important;
  box-sizing:border-box!important;margin:0!important;padding:10px!important;
  grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:4px!important;
  border-radius:10px!important;background:white!important;border:1px solid #dce3eb!important;
  box-shadow:0 16px 34px rgba(11,36,71,.19)!important}
 .idealab-nav .idealab-nav-mobile[open]>.idealab-nav-mobile-panel{display:grid!important}
 .idealab-nav .idealab-nav-mobile-panel a{display:flex!important;align-items:center!important;min-width:0!important;
  min-height:38px!important;padding:8px!important;font:650 .75rem/1.35 system-ui,sans-serif!important;
  white-space:normal!important;overflow-wrap:anywhere!important;color:#203c5b!important;
  text-decoration:none!important;border-radius:6px!important}
 .idealab-nav .idealab-nav-mobile-panel a[aria-current="page"]{
  color:#0b2447!important;font-weight:850!important;background:#eef4fa!important}
 .idealab-nav .idealab-nav-mobile-heading{grid-column:1/-1!important}
}
@media(max-width:470px){
 .idealab-nav .idealab-nav-mobile-panel{grid-template-columns:1fr!important}
 .idealab-nav .idealab-nav-mobile-heading{grid-column:1!important}
}


/* Elecciones 29N visible en cabeceras anchas; siempre disponible en Más y móvil. */
@media(max-width:1599px){.idealab-nav .idealab-nav-election{display:none!important}}
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
    <a href="/administraciones.html">Administraciones</a>
    <a class="idealab-nav-election" href="/elecciones-29n.html">Elecciones 29N</a>
    <details class="il-nav-more">
      <summary>Más</summary>
      <div class="il-nav-more-panel">
        <a href="/elecciones-29n.html">Elecciones 29N</a>
        <a href="/metodologia.html">Metodología</a>
        <a class="is-active" aria-current="page" href="/actualizaciones.html">Actualizaciones</a>
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
      <a href="/administraciones.html">Administraciones</a>
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
      <a href="/elecciones-29n.html">Elecciones 29N</a>
      <a href="/metodologia.html">Metodología</a>
      <a aria-current="page" href="/actualizaciones.html">Actualizaciones</a>
      <a href="/quienes-somos.html">Quiénes somos</a>
      <a href="https://x.com/LARREALIDAD" target="_blank" rel="noopener noreferrer">Canal en X ↗</a>
    </div>
  </details>
</nav>

```js
// Cabecera de navegación clásica: solo clic, cierre fuera y con Escape.
const navHeader=document.querySelector(".idealab-nav");
if(navHeader){
  const dropdowns=[...navHeader.querySelectorAll("details")];
  const closeExcept=other=>dropdowns.forEach(item=>{if(item!==other)item.open=false;});
  dropdowns.forEach(item=>{
    item.addEventListener("toggle",()=>{if(item.open)closeExcept(item);});
    item.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>item.open=false));
  });
  document.addEventListener("pointerdown",event=>{
    if(!navHeader.contains(event.target))closeExcept(null);
  });
  document.addEventListener("keydown",event=>{
    if(event.key==="Escape")closeExcept(null);
  });
  window.matchMedia("(min-width:1280px)").addEventListener("change",()=>closeExcept(null));
}
if(new URLSearchParams(window.location.search).has("nav-qa")){
  const nav=document.querySelector(".idealab-nav");
  const mobile=window.matchMedia("(max-width:1279px)").matches;
  const item=nav?.querySelector(mobile?".idealab-nav-mobile":".il-nav-more");
  item?.querySelector("summary")?.click();
  requestAnimationFrame(()=>{
    const panel=item?.querySelector(mobile?".idealab-nav-mobile-panel":".il-nav-more-panel");
    const a=nav?.querySelector(".idealab-brand")?.getBoundingClientRect();
    const b=item?.querySelector("summary")?.getBoundingClientRect();
    const p=panel?.getBoundingClientRect();
    const errors=[];
    if(!item?.open)errors.push("cerrado");
    if(!panel||getComputedStyle(panel).display!=="grid")errors.push("panel-no-visible");
    if(!a||!b||a.right>b.left-3)errors.push("logo-solapado");
    if(!p||!b||p.top<b.bottom-2)errors.push("panel-encima");
    if(!p||p.left<0||p.right>window.innerWidth+1)errors.push("panel-desbordado");
    if(mobile&&getComputedStyle(nav.querySelector(".idealab-nav-links")).display!=="none")errors.push("nav-duplicada");
    if(!mobile&&getComputedStyle(nav.querySelector(".idealab-nav-mobile")).display!=="none")errors.push("mobile-en-desktop");
    const out=document.createElement("div");out.id="il-atlas-nav-qa";
    out.dataset.status=errors.length?"fail":"ok";
    out.textContent=errors.length?"NAV_QA_FAIL "+errors.join(","):"NAV_QA_OK";
    document.body.append(out);
  });
}
```


# Estado de actualización y fuentes

En IDEA LAB construimos **España en Datos**, nuestro observatorio económico, social e institucional, a partir de series históricas seleccionadas y fuentes públicas. Comprobamos periódicamente la disponibilidad de las fuentes oficiales, pero **una fuente accesible no significa que todas sus cifras se hayan importado o actualizado**. [Conoce nuestra iniciativa](/quienes-somos.html).

```js
const state = await FileAttachment("./data/official-checks.json").json();
const checks = (state.sources || []).map(s => ({
  Organismo: s.name,
  Estado: s.status === "reachable" ? "Accesible" : "Sin verificar",
  "Fecha de comprobación (UTC)": state.checked_at_utc,
  "Documento oficial": s.url
}));
display(Inputs.table(checks));
```

## Actualización numérica automática · INE

La primera actualización de valores homologada está limitada a la serie **ECP320**, que identifica exactamente el total nacional de población residente, todas las edades y ambos sexos. Antes de añadir un nuevo año compara los valores coincidentes con el histórico; si el INE los revisa o cambia la identidad de la serie, **bloquea la sustitución** y conserva el dato anterior.

```js
const officialSync = await FileAttachment("./data/official-sync-status.json").json();
const syncDescription = ({
  updated:"Se incorporaron nuevas observaciones oficiales tras superar todas las validaciones.",
  unchanged:"La fuente oficial no contiene un año posterior al último histórico almacenado.",
  blocked:"Actualización bloqueada: la fuente ha cambiado, tiene cifras discrepantes o no ha podido validarse.",
  unavailable:"La fuente oficial no estuvo disponible durante esta ejecución.",
  not_run:"La consulta oficial todavía no se ha ejecutado en esta versión."
})[officialSync.status] ?? "Estado no reconocido";
display(html`<div style="border:1px solid #e0e6ed;border-radius:10px;padding:1rem;background:#f9fafb">
  <strong>INE · Población residente nacional (ECP320)</strong>
  <p>${syncDescription}</p>
  <p style="font-size:.86rem;color:#667085;margin-bottom:0">Comprobación UTC: ${officialSync.checked_at_utc || "pendiente"} · Último año oficial observado: ${officialSync.last_official_year || "no disponible"} · Nuevas observaciones añadidas: ${officialSync.published_new_rows || 0}.</p>
</div>`);
```

El crecimiento de población se calcula automáticamente con los valores de 1 de enero de dos años consecutivos. Esta ingesta solo modifica los datos del **artefacto público compilado**, no el Google Drive privado; la conciliación con el almacén canónico permanece como una fase independiente pendiente de autenticar.

## Lecturas recientes de la API oficial

A continuación se muestran **registros literales** del INE recogidos durante la comprobación, con su nombre de serie completo. Son ejemplos de la fuente, no cifras homologadas ni sustitutos de las tarjetas del observatorio.

```js
const latestOfficial = await FileAttachment("./data/ine-latest.json").json();
const preview = (latestOfficial.records || []).map(d => ({
  "Serie INE (nombre completo)": d.serie_original,
  "Año": d.anyo,
  "Valor publicado": d.valor_fuente,
  "URL origen": d.source_url
}));
display(preview.length ? Inputs.table(preview) : html`<p>No se han podido obtener ejemplos oficiales durante esta comprobación. Los datos históricos de la web se mantienen inalterados.</p>`);
```

## Avances oficiales de finanzas públicas

La serie anual de operaciones no financieras S.13 de la IGAE se descarga y examina automáticamente desde el fichero XLSX publicado por Hacienda. **Esta inspección no reemplaza los importes del Sankey**: el desglose de gasto por funciones COFOG de 2025 está previsto oficialmente para el **30 de noviembre de 2026**.

```js
const igStatus=await FileAttachment("./data/igae-annual-status.json").json();
const fiscalState=igStatus.status==="downloaded_for_mapping"
  ? "Fichero oficial anual descargado para mapeo de las series"
  : "La descarga del fichero anual no se ha podido verificar en esta ejecución";
display(html`<div style="background:#f8fafc;border:1px solid #dbe4eb;padding:1rem;border-radius:10px">
  <strong>IGAE · Operaciones no financieras anuales</strong>
  <p>${fiscalState}</p>
  <p style="font-size:.82rem;color:#667085">Última comprobación UTC: ${igStatus.checked_at_utc || "pendiente"}. El Sankey continúa con las cifras completas y conciliadas de 2024 hasta disponer del COFOG 2025.</p>
  <p><a href="https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadNacional/Publicaciones/Paginas/ianofinancierasTotal.aspx" target="_blank" rel="noopener noreferrer">Consultar publicación oficial IGAE</a></p>
</div>`);
```

## Vigencia de los datos representados

- **Panel de España:** series históricas seleccionadas, con fecha individual para cada observación.
- **Sankey de finanzas públicas:** ejercicio **2024**, pendiente de incorporación y validación de la versión oficial posterior.
- **Alquiler:** los 252 registros cuya desagregación geográfica no se pudo reconstruir permanecen excluidos.
- **Fuente canónica de trabajo:** Drive privado de Idea Lab; su contenido no se publica aquí.

## Qué se actualiza automáticamente

El workflow público consulta semanalmente fuentes oficiales del INE y la IGAE y vuelve a compilar este sitio. La población residente y su crecimiento anual **sí pueden actualizarse** cuando pasan el mapeo estricto ECP320 y la conciliación. Los restantes indicadores, incluidos ingresos y gasto del Sankey, **no se modifican solo porque una fuente haya cambiado**. Cada nueva versión debe superar comprobaciones de identidad de la serie, territorio, unidad, metodología y conciliación con las tablas canónicas del laboratorio.

## Frecuencia

La comprobación está programada los lunes a las **07:17 UTC**, y también puede ejecutarse manualmente desde el repositorio público. Las ejecuciones programadas de GitHub pueden demorarse.

[Volver al resumen](/) · [Abrir finanzas públicas](/finanzas-publicas.html)
