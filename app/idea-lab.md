---
title: IDEA LAB | Investigación, datos y modelización
theme: light
sidebar: false
toc: false
footer: IDEA LAB · Investigación, análisis y divulgación independiente
---

<style>
/* Corporate-only design: deliberate separation from observational pages. */
#il-corporate{--ink:#0b2447;--muted:#52647b;--gold:#b4914e;--line:#dce3e9;--paper:#f7f8fa;color:var(--ink);font-family:Georgia,'Times New Roman',serif;box-sizing:border-box;max-width:1540px;margin-inline:auto;padding:0 clamp(12px,3vw,42px);}
#il-corporate *{box-sizing:border-box}
#il-corporate .il-head{display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;border-bottom:1px solid var(--line);padding:.55rem 0;}
#il-corporate .il-logo{width:clamp(148px,15vw,194px);height:auto;display:block;max-width:100%;}
#il-corporate .il-navigation{display:flex;align-items:center;gap:1rem;flex-wrap:wrap}
#il-corporate .il-navigation a{font-size:.85rem;text-decoration:none;color:#304762;font-weight:700}
#il-corporate .il-eyebrow{color:#93763e;font-family:Arial,Helvetica,sans-serif;text-transform:uppercase;font-weight:800;font-size:.7rem;letter-spacing:.14em}
#il-corporate .il-hero{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(230px,.45fr);gap:2rem;align-items:center;padding:clamp(35px,6vw,90px) 0;}
#il-corporate .il-hero h1{font-size:clamp(2.1rem,4.8vw,4.8rem);line-height:1.1;letter-spacing:-.03em;color:var(--ink);margin:.55rem 0 1.2rem;max-width:none}
#il-corporate p{line-height:1.65;text-align:justify;text-align-last:left;hyphens:auto;max-width:none}
#il-corporate .il-hero p{color:var(--muted);font-size:clamp(.95rem,1.3vw,1.15rem)}
#il-corporate .il-hero-mark{display:grid;place-items:center;padding:1.2rem}
#il-corporate .il-hero-mark img{width:min(100%,265px);height:auto}
#il-corporate .il-actions{display:flex;flex-wrap:wrap;gap:.65rem;margin-top:1.3rem}
#il-corporate .il-actions a{display:inline-flex;align-items:center;border:1px solid var(--ink);border-radius:8px;padding:.65rem .95rem;font-size:.84rem;font-weight:750;text-decoration:none;color:var(--ink)}
#il-corporate .il-actions a:first-child{background:var(--ink);color:#fff}
#il-corporate .il-section{border-top:1px solid var(--line);padding:clamp(30px,4.5vw,56px) 0}
#il-corporate .il-section h2{color:var(--ink);font-size:clamp(1.6rem,2.7vw,2.7rem);line-height:1.2;margin:.55rem 0 1rem}
#il-corporate .il-intro{color:var(--muted)}
#il-corporate .il-project-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.85rem;margin-top:1.3rem}
#il-corporate .il-project{border:1px solid var(--line);border-radius:12px;padding:1.25rem;display:flex;flex-direction:column;min-height:205px;background:#fff}
#il-corporate .il-project header{display:flex;justify-content:space-between;gap:.55rem;align-items:baseline;flex-wrap:wrap}
#il-corporate .il-project h3{font-size:1.22rem;margin:0;color:var(--ink)}
#il-corporate .il-project small{font:700 .64rem Arial,Helvetica,sans-serif;text-transform:uppercase;letter-spacing:.05em;color:#5a6a80}
#il-corporate .il-project p{font-size:.87rem;color:var(--muted);margin:.75rem 0}
#il-corporate .il-project a,#il-corporate .il-project .il-soon{font-size:.82rem;font-weight:700;margin-top:auto}
#il-corporate .il-soon{color:#63748a}
#il-corporate .il-pillars{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem;margin-top:1rem}
#il-corporate .il-pillars strong{color:var(--ink)}
#il-corporate .il-pillars p{font-size:.88rem;color:var(--muted);margin:.35rem 0}
#il-corporate .il-footer{border-top:1px solid var(--line);padding:1.5rem 0;font-size:.79rem;color:var(--muted)}
@media(max-width:850px){#il-corporate .il-hero{grid-template-columns:1fr}#il-corporate .il-hero-mark{display:none}#il-corporate .il-pillars{grid-template-columns:1fr;gap:.6rem}}
@media(max-width:620px){#il-corporate .il-project-grid{grid-template-columns:1fr}#il-corporate .il-project{min-height:0}#il-corporate .il-head{align-items:flex-start}#il-corporate .il-navigation{gap:.75rem}#il-corporate .il-navigation a{font-size:.74rem}}
</style>

<main id="il-corporate">
  <header class="il-head">
    <a href="/idea-lab.html" aria-label="IDEA LAB · Inicio corporativo"><img class="il-logo" src="./logo-idea-lab.svg" width="190" height="45" alt="IDEA LAB" /></a>
    <nav class="il-navigation" aria-label="Navegación corporativa">
      <a href="#proyectos">Proyectos</a><a href="#metodo">Metodología</a><a href="#nosotros">Quiénes somos</a><a href="https://x.com/LARREALIDAD" target="_blank" rel="noopener noreferrer">Canal en X</a>
    </nav>
  </header>
  <section class="il-hero">
    <div><div class="il-eyebrow">IDEA LAB · Investigación independiente</div>
      <h1>Comprender la realidad mediante datos y modelos.</h1>
      <p>Investigamos fenómenos económicos, sociales, institucionales y geopolíticos. Contrastamos fuentes, construimos visualizaciones y evaluamos modelos de sistemas complejos. Separamos los hechos observados, las interpretaciones y las hipótesis pendientes de validar.</p>
      <div class="il-actions"><a href="#proyectos">Explorar proyectos</a><a href="#metodo">Cómo investigamos</a></div>
    </div>
    <div class="il-hero-mark"><img src="./favicon.svg" alt="" aria-hidden="true" /></div>
  </section>
  <section class="il-section" id="proyectos">
    <div class="il-eyebrow">Productos y líneas de trabajo</div><h2>Proyectos de IDEA LAB</h2>
    <p class="il-intro">Nuestros productos públicos y las investigaciones experimentales se presentan por separado. No atribuimos capacidad predictiva validada a un modelo por el mero hecho de haber sido desarrollado o sometido a pruebas retrospectivas.</p>
    <div class="il-project-grid">
      <article class="il-project"><header><h3>España en Datos</h3><small>Publicado</small></header><p>Observatorio económico, social e institucional de España. Indicadores históricos, fuentes oficiales y mapa interactivo del dinero público.</p><a href="/">Abrir observatorio nacional ↗</a></article>
      <article class="il-project"><header><h3>LAREALIDAD</h3><small>Canal editorial</small></header><p>Divulgación, actualidad y análisis de datos, con distinción entre resultados verificables e interpretación editorial.</p><a href="https://x.com/LARREALIDAD" target="_blank" rel="noopener noreferrer">Consultar el canal en X ↗</a></article>
      <article class="il-project"><header><h3>Dinámicas sociales y sistemas complejos</h3><small>Investigación</small></header><p>Investigación exploratoria en fenómenos colectivos, evolución social, riesgos y dinámicas de sistemas complejos. Los resultados futuros requerirán contraste fuera de muestra.</p><span class="il-soon">Publicación técnica pendiente de revisión independiente</span></article>
      <article class="il-project"><header><h3>Modelización y estrategias cuantitativas</h3><small>Investigación</small></header><p>Experimentos reproducibles con indicadores, modelos de previsión y estrategias simuladas. Los backtests y carteras paper no acreditan rendimiento real ni ofrecen asesoramiento financiero.</p><span class="il-soon">Metodologías y resultados públicos en preparación</span></article>
    </div>
  </section>
  <section class="il-section" id="metodo"><div class="il-eyebrow">Método científico</div><h2>Rigor, trazabilidad y revisión</h2>
    <p class="il-intro">Un gráfico atractivo no demuestra una tesis. Una predicción no es fiable por utilizar inteligencia artificial. Publicamos evidencia con un alcance proporcionado a sus límites.</p>
    <div class="il-pillars"><div><strong>Fuentes comprobables</strong><p>Fecha, definición, cobertura, unidad, revisiones y procedencia verificable.</p></div><div><strong>Reproducibilidad</strong><p>Metodología y transformaciones documentadas, con separación entre datos e interpretación.</p></div><div><strong>Evaluación realista</strong><p>Baselines, validación temporal, incertidumbre y control de sesgos retrospectivos.</p></div></div>
  </section>
  <section class="il-section" id="nosotros"><div class="il-eyebrow">Nuestra iniciativa</div><h2>Quiénes somos</h2>
    <p class="il-intro">IDEA LAB es una iniciativa independiente de investigación, análisis y divulgación organizada en productos y líneas de trabajo. No representamos a ninguna administración ni organismo estadístico. El nombre no implica una forma societaria, plantilla o acreditación institucional específica.</p>
  </section>
  <footer class="il-footer">IDEA LAB · Investigación y divulgación independientes · <a href="/">España en Datos</a> · <a href="https://x.com/LARREALIDAD">Canal en X</a></footer>
</main>
