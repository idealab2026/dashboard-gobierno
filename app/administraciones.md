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





/* Navegación corregida: escritorio y móvil nunca se pintan a la vez.
 * También protege el estado cerrado de <details> frente a CSS heredado. */
.idealab-nav {
  box-sizing:border-box!important;
  width:100%!important;
  max-width:100%!important;
  min-width:0!important;
  isolation:isolate;
}
.idealab-nav .idealab-nav-mobile,
.idealab-nav .idealab-nav-mobile > .idealab-nav-mobile-panel {
  display:none!important;
}
.idealab-nav .idealab-nav-mobile > summary::marker {content:"";}
@media (max-width:1279px) {
  .idealab-nav {
    position:sticky!important;top:0!important;z-index:1100!important;
    display:flex!important;flex-direction:row!important;align-items:center!important;
    justify-content:space-between!important;flex-wrap:nowrap!important;
    gap:10px!important;min-height:56px!important;padding:8px 11px!important;
    overflow:visible!important;background:#fff!important;
  }
  .idealab-nav .idealab-nav-links {display:none!important;}
  .idealab-nav .il-header-identity {
    display:flex!important;align-items:center!important;
    flex:0 1 auto!important;min-width:0!important;max-width:calc(100% - 99px)!important;
    gap:7px!important;overflow:hidden!important;
  }
  .idealab-nav .idealab-brand {
    min-width:0!important;max-width:100%!important;white-space:nowrap!important;
    overflow:hidden!important;text-overflow:ellipsis!important;flex:0 1 auto!important;
  }
  .idealab-nav .il-parent-brand {flex:0 0 auto!important;}
  .idealab-nav .il-parent-brand > span {display:none!important;}
  .idealab-nav .il-parent-brand .idealab-brand-logo {
    display:block!important;width:28px!important;height:28px!important;max-width:28px!important;
    aspect-ratio:1!important;object-fit:cover!important;object-position:left center!important;
  }
  .idealab-nav .idealab-nav-mobile {
    display:block!important;position:relative!important;
    flex:0 0 auto!important;margin:0 0 0 auto!important;min-width:0!important;
  }
  .idealab-nav .idealab-nav-mobile > summary {
    display:inline-flex!important;align-items:center!important;justify-content:center!important;
    gap:7px!important;min-height:39px!important;padding:7px 12px!important;
    list-style:none!important;border:1px solid #0b2447!important;
    border-radius:8px!important;background:#0b2447!important;
    color:#fff!important;font:800 .79rem/1.25 system-ui,sans-serif!important;
    white-space:nowrap!important;cursor:pointer!important;
  }
  .idealab-nav .idealab-nav-mobile > .idealab-nav-mobile-panel {
    display:none!important;position:absolute!important;
    top:calc(100% + 9px)!important;right:0!important;left:auto!important;
    box-sizing:border-box!important;
    width:min(360px,calc(100vw - 22px))!important;max-width:calc(100vw - 22px)!important;
    max-height:min(72dvh,610px)!important;overflow-y:auto!important;overscroll-behavior:contain!important;
    grid-template-columns:repeat(2,minmax(0,1fr))!important;
    gap:4px 6px!important;margin:0!important;padding:10px!important;
    z-index:1500!important;background:#fff!important;
    border:1px solid #d6e1ec!important;border-radius:10px!important;
    box-shadow:0 14px 34px rgba(11,36,71,.19)!important;
  }
  .idealab-nav .idealab-nav-mobile[open] > .idealab-nav-mobile-panel {display:grid!important;}
  .idealab-nav .idealab-nav-mobile-panel a {
    display:flex!important;align-items:center!important;min-width:0!important;
    min-height:38px!important;padding:8px!important;
    color:#203c5b!important;background:transparent!important;
    text-decoration:none!important;border-radius:7px!important;
    font:650 .78rem/1.35 system-ui,sans-serif!important;
    white-space:normal!important;overflow-wrap:anywhere!important;
  }
  .idealab-nav .idealab-nav-mobile-panel a:hover,
  .idealab-nav .idealab-nav-mobile-panel a:focus-visible {background:#eef3f8!important;}
  .idealab-nav .idealab-nav-mobile-heading {
    grid-column:1/-1!important;font:800 .68rem/1.3 system-ui,sans-serif!important;
    letter-spacing:.06em!important;color:#896b35!important;
  }
}
@media (max-width:600px) {
  .idealab-nav .idealab-nav-mobile > .idealab-nav-mobile-panel {
    grid-template-columns:minmax(0,1fr)!important;
  }
  .idealab-nav .idealab-nav-mobile-heading {grid-column:1!important;}
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
        <a href="/administraciones.html" aria-current="page">Administraciones</a>
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

