---
title: Metodología y calidad de datos
theme: light
sidebar: false
toc: true
---


<style>
/* Justified methodology body text without modifying links or tables. */
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

/* Methodology: narrative sections expand; numbered methods stay ordinary lists. */
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
        <a href="/finanzas-publicas.html">Finanzas públicas</a>
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
        <a href="/metodologia.html" aria-current="page">Metodología</a>
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


# Cómo trabajamos

**Somos IDEA LAB, una iniciativa independiente de investigación y divulgación.** Desarrollamos **España en Datos**, nuestro observatorio económico, social e institucional. Los indicadores que mostramos incluyen bases históricas y no deben confundirse con una fotografía completamente actualizada de España. Conoce [quiénes somos](/quienes-somos.html) y cómo distinguimos datos, interpretación y opinión.

## Procedimiento científico

1. **Pregunta contrastable.** Especificar variable, población, periodo, ámbito geográfico e hipótesis.
2. **Fuente y metadatos.** Identificar al organismo, la operación estadística, la publicación y su revisión.
3. **Calidad.** Verificar definiciones, unidades, duplicados, datos faltantes y cambios metodológicos.
4. **Análisis.** Diferenciar estadística descriptiva de inferencia causal, siempre con incertidumbre explícita.
5. **Reproducción.** Mantener código, transformaciones y snapshots históricos versionados.
6. **Divulgación.** Redactar conclusiones comprensibles sin atribuir más certeza de la que permiten los datos.

## Incidencias conocidas

**Alquiler (IPVA):** el conjunto histórico de 2018–2024 contiene 18 valores para cada indicador y año, todos etiquetados erróneamente como si fueran una única serie nacional. La fuente [INE tabla 59057](https://www.ine.es/jaxiT3/Tabla.htm?t=59057) incluye datos nacionales y autonómicos. Mientras no se reconstruya su dimensión geográfica, esos indicadores quedan **en revisión** y no se mostrará una cifra seleccionada arbitrariamente.

**PIB nominal:** las cantidades del dataset se expresan en euros y se dividen entre un millón únicamente para la presentación. La unidad de los registros históricos ha sido corregida sin modificar los valores.

**Vigencia:** las fechas de referencia no equivalen a la fecha de consulta. Se requiere actualización y validación contra la fuente primaria antes de publicar conclusiones actuales.

## Fuentes

Se conservan enlaces a [INE](https://www.ine.es/) y [IGAE](https://www.igae.pap.hacienda.gob.es/), con la distinción entre valores publicados y cálculos derivados. No se utiliza ninguna cuenta personal como alojamiento de datos.


## Analítica de uso del observatorio

Utilizamos **Cloudflare Web Analytics** para conocer, de forma agregada, las visitas a las páginas de España en Datos, su procedencia general y el rendimiento de carga. Hemos instalado el fragmento de medición únicamente en este observatorio, sin incorporar cookies de seguimiento propias ni mezclar sus estadísticas con otros proyectos. El servicio recibe datos técnicos de navegación necesarios para elaborar sus informes; [Cloudflare explica su funcionamiento y privacidad](https://developers.cloudflare.com/web-analytics/about/).

Este sistema **no registra las búsquedas que introducen los lectores ni qué ramas del Sankey abren**. Esas interacciones no están cuantificadas y no presentamos estimaciones como si fueran datos observados. Las estadísticas empiezan cuando la instalación queda operativa, sin recuperación de visitas previas.

## Política editorial

Ningún resultado se califica de «predicción validada» si no dispone de evaluación fuera de muestra. Las inferencias causales deben tener una estrategia de identificación, supuestos explícitos y análisis de sensibilidad.

[Volver a España en Datos](/) · [Quiénes somos](/quienes-somos.html)
