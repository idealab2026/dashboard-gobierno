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

</style>

<nav class="il-site-navigation" aria-label="Navegación del observatorio">
  <div class="il-site-identity">
    <a class="il-site-brand" href="/" aria-label="España en Datos, inicio">España en Datos</a>
    <a class="il-site-parent" href="https://idealab2026.github.io/" aria-label="IDEA LAB · Web corporativa">
      <span>Un producto de</span><img class="il-site-logo" src="./logo-idea-lab.svg" alt="IDEA LAB" width="72" height="17" />
    </a>
  </div>
  <a class="il-site-home" href="/#mapa-dinero">Mapa del dinero</a>
  <details class="il-site-menu">
    <summary aria-label="Abrir menú del observatorio">Menú ☰</summary>
    <div class="il-site-menu-links">
      <a href="/">Inicio</a>
      <a href="/#resumen">España en un minuto</a>
      <a href="/finanzas-publicas.html">Finanzas públicas</a>
      <a href="/buscador-partidas.html">Buscar partidas</a>
      <a href="/#economia">Economía</a>
      <a href="/#empleo">Empleo</a>
      <a href="/#vivienda">Vivienda</a>
      <a href="/#estado">Sector público</a>
      <a href="/#pensiones">Pensiones</a>
      <a href="/#sociedad">Sociedad</a>
      <a href="/#mundo">Mundo</a>
      <a href="/metodologia.html">Metodología</a>
      <a href="/actualizaciones.html">Actualizaciones</a>
      <a href="/quienes-somos.html">Quiénes somos</a>
      <a href="https://x.com/LARREALIDAD" target="_blank" rel="noopener noreferrer">Canal en X ↗</a>
    </div>
  </details>
</nav>


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

## Política editorial

Ningún resultado se califica de «predicción validada» si no dispone de evaluación fuera de muestra. Las inferencias causales deben tener una estrategia de identificación, supuestos explícitos y análisis de sensibilidad.

[Volver a España en Datos](/) · [Quiénes somos](/quienes-somos.html)
