---
title: Quiénes somos | IDEA LAB
theme: light
sidebar: false
toc: false
footer: IDEA LAB · Investigación, análisis y divulgación
---

<style>
:root{--il-ink:#102a4c;--il-muted:#52627a;--il-border:#e2e7ee;--il-paper:#f7f9fc;--il-accent:#b49a63;}
.observablehq{max-width:1680px;margin:0 auto;padding:0 clamp(16px,3vw,34px)}
.il-about{color:var(--il-ink);padding:clamp(12px,2.5vw,30px) 0 40px}
.il-about-return{display:inline-block;margin:4px 0 22px;color:#294c7d;font-size:.9rem;text-decoration:none}
.il-about-kicker{color:#a38a55;font-size:.77rem;letter-spacing:.12em;text-transform:uppercase;font-weight:750}
.il-about h1{font-size:clamp(2.4rem,5.4vw,4rem);line-height:1.1;margin:.55rem 0 1rem}
.il-about-lead{color:#43556b;font-size:clamp(1.05rem,1.7vw,1.28rem);max-width:none;line-height:1.65;margin-bottom:1.45rem}
.il-about h2{font-size:1.48rem;line-height:1.2;margin:0 0 .85rem}
.il-about p,.il-about li{line-height:1.65}
.il-about section{border-top:1px solid var(--il-border);padding:1.65rem 0}
.il-about-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}
.il-about-card{border:1px solid var(--il-border);padding:1.1rem 1.2rem;border-radius:12px;background:white}
.il-about-card h3{font-size:1.08rem;margin:0 0 .45rem}
.il-about-card p{font-size:.96rem;color:var(--il-muted);margin:.2rem 0 .8rem}
.il-about-card a{font-weight:650;color:#244f84}
.il-about-actions{display:flex;gap:.7rem;flex-wrap:wrap;margin-top:1.3rem}
.il-about-actions a{display:inline-flex;align-items:center;padding:.67rem .95rem;border-radius:8px;border:1px solid var(--il-ink);color:var(--il-ink);text-decoration:none;font-weight:700;font-size:.9rem}
.il-about-actions a:first-child{background:var(--il-ink);color:white}
.il-about-note{background:var(--il-paper);padding:1rem 1.2rem;border:1px solid var(--il-border);border-radius:10px;font-size:.9rem;color:var(--il-muted)}
@media(max-width:640px){.il-about-grid{grid-template-columns:1fr}.il-about section{padding:1.3rem 0}}

/* Long-form paragraphs are justified; cards and navigation remain legible. */
.il-about p {text-align:justify;text-align-last:left;hyphens:auto;-webkit-hyphens:auto;}


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

/* About: remove reading-column caps; use side-by-side purpose paragraphs. */
.il-about { width: 100%; max-width: none; box-sizing: border-box; }
.il-about-lead, .il-about section > p, .il-about-card p, .il-about-note {
  box-sizing: border-box;
  width: 100%;
  max-width: none;
  text-align: justify;
  text-align-last: left;
  hyphens: auto;
  -webkit-hyphens: auto;
}
@media (min-width: 1100px) {
  .il-about section:first-of-type {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: .75rem 1.8rem;
    align-items: start;
  }
  .il-about section:first-of-type > h2 { grid-column: 1 / -1; }
  .il-about section:first-of-type > p { margin: 0; min-width: 0; }
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


<main class="il-about">
  <div class="il-about-kicker">IDEA LAB · Sobre nuestra iniciativa</div>
  <h1>Quiénes somos</h1>
  <p class="il-about-lead"><strong>Somos IDEA LAB, una iniciativa independiente de investigación, análisis y divulgación.</strong> Estudiamos la realidad económica, social e institucional, y trabajamos para explicarla con datos verificables, contexto y metodología transparente.</p>

  <section>
    <h2>Nuestro propósito</h2>
    <p>Queremos facilitar el acceso a información pública comprensible y contrastable. Reunimos fuentes oficiales, revisamos sus definiciones y límites, construimos visualizaciones y distinguimos los hechos de nuestras interpretaciones.</p>
    <p>Nos interesa comprender cómo evoluciona la sociedad, cómo funciona la economía y cómo se gestionan los recursos y las instituciones públicas. No confundimos la disponibilidad de un dato con su vigencia ni la correlación con la causalidad.</p>
  </section>

  <section>
    <h2>Nuestros productos y canales</h2>
    <div class="il-about-grid">
      <div class="il-about-card">
        <h3>España en Datos</h3>
        <p>Es uno de nuestros productos: un <strong>observatorio económico, social e institucional de España</strong>. Integramos indicadores, series históricas y visualizaciones; destacamos un mapa interactivo del dinero público. Indicamos la fecha de referencia y el grado de validación de cada fuente.</p>
        <a href="/#mapa-dinero">Explorar el observatorio</a>
      </div>
      <div class="il-about-card">
        <h3>LAREALIDAD · Canal editorial</h3>
        <p>En X compartimos análisis de actualidad, explicaciones y materiales de divulgación. Diferenciamos datos, opiniones e hipótesis, y vinculamos nuestras publicaciones con fuentes siempre que sea posible.</p>
        <a href="https://x.com/LARREALIDAD" target="_blank" rel="noopener noreferrer">Visitar @LARREALIDAD</a>
      </div>
    </div>
  </section>

  <section>
    <h2>Cómo trabajamos</h2>
    <p>Partimos de preguntas concretas, localizamos fuentes primarias, comprobamos unidades, periodos y cobertura, y documentamos nuestras transformaciones. Publicamos conclusiones proporcionadas a la evidencia disponible y explicitamos las incertidumbres o discrepancias detectadas.</p>
    <p>Mostramos el <a href="/metodologia.html">procedimiento de análisis y validación</a> y el <a href="/actualizaciones.html">estado de actualización de las fuentes</a>. Las series históricas no se presentan como cifras actuales sin una comprobación adicional.</p>
  </section>

  <section>
    <h2>Independencia y límites</h2>
    <p>No representamos a ninguna administración pública ni hablamos en nombre de los organismos cuyos datos utilizamos. Nuestras publicaciones son análisis y divulgación independientes, no comunicaciones oficiales.</p>
    <p>Nos comprometemos a corregir errores verificables, conservar la trazabilidad y separar la investigación de la valoración editorial. <strong>España en Datos es un producto de IDEA LAB; IDEA LAB no es una administración ni un organismo estadístico oficial.</strong></p>
    <div class="il-about-note">Nuestra denominación identifica un proyecto de investigación y divulgación. No implica, por sí misma, una forma societaria concreta, una plantilla determinada ni acreditación institucional.</div>
  </section>

  <div class="il-about-actions">
    <a href="/">Entrar en España en Datos</a>
    <a href="https://x.com/LARREALIDAD" target="_blank" rel="noopener noreferrer">Seguir nuestro canal en X</a>
  </div>
</main>
