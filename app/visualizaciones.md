---
title: Visualizaciones de datos | España en Datos
theme: light
sidebar: false
toc: false
footer: IDEA LAB · Investigación y divulgación independiente
---

<style>

:root{--idealab-navy:#0b2447;--idealab-blue:#19376d;--idealab-gold:#b89b5e;--idealab-border:#e3e6ea;--idealab-muted:#667085}
.observablehq{box-sizing:border-box;width:100%;max-width:none!important;padding-inline:clamp(12px,2vw,40px)!important}
html{scroll-behavior:smooth;font-size:16px}
.il-finder-hero{width:100%;margin:21px 0 12px;padding-bottom:14px;border-bottom:3px solid #b89b5e}
.il-finder-kicker{font:.79rem/1.4 system-ui,sans-serif;letter-spacing:.11em;text-transform:uppercase;color:#a68448;font-weight:850}
.il-finder-hero h1{font:700 clamp(2.05rem,4.3vw,3.6rem)/1.14 Georgia,serif;color:#0b2447;margin:7px 0 9px}
.il-finder-hero p{font:400 .96rem/1.55 Georgia,serif;color:#637189;max-width:none!important;text-align:justify}
.il-finder-guide{display:flex;gap:10px;align-items:flex-start;flex-wrap:wrap;font:.78rem/1.5 system-ui,sans-serif;color:#53657b;margin:5px 0 15px}
.il-finder-guide span{display:inline-flex;align-items:center;gap:6px;border:1px solid #e3e7ee;border-radius:7px;padding:7px 9px}
@media(max-width:700px){.il-finder-hero{margin-top:10px}.il-finder-hero h1{font-size:2rem}}
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




/* Social trends · dense, factual and readable in both desktop and mobile. */
.il-social-root{width:100%;min-width:0;margin:54px auto 24px;font-family:system-ui,-apple-system,sans-serif}
.il-social-intro{border-top:3px solid #b89b5e;padding:23px 0 8px;margin:0}
.il-social-eyebrow{font-size:.72rem;letter-spacing:.14em;font-weight:850;color:#967035}
.il-social-intro h2{font:750 clamp(1.55rem,3vw,2.65rem)/1.17 Georgia,serif;color:#0b2447;margin:8px 0}
.il-social-intro p{color:#566a81;font-size:.88rem;line-height:1.45;margin:6px 0 14px;max-width:none;text-align:justify}
.il-social-jump{display:flex;flex-wrap:wrap;gap:7px;padding-bottom:19px}
.il-social-jump a{border:1px solid #ccd8e5;border-radius:6px;padding:8px 13px;
 color:#264a6c!important;background:#fff;font:.73rem/1.2 system-ui,sans-serif;font-weight:750;
 text-decoration:none!important}
.il-social-jump a:hover{background:#f0f4f8}
.il-social-card{border:1px solid #dbe3ed;border-radius:10px;padding:clamp(13px,2vw,25px);
 margin:0 0 16px;background:white;min-width:0;scroll-margin-top:90px}
.il-social-card-header h2{font:750 clamp(1.2rem,2.1vw,1.65rem)/1.2 Georgia,serif;
 color:#0b2447;margin:0 0 4px}
.il-social-card-header p{font:600 .75rem/1.4 system-ui,sans-serif;color:#697c90;margin:0 0 15px}
.il-social-metric{display:flex;gap:5px 17px;align-items:baseline;flex-wrap:wrap;margin:0 0 8px}
.il-social-metric strong{font:850 clamp(1.4rem,2.5vw,2.2rem)/1.15 system-ui,sans-serif;color:#0b2447}
.il-social-metric span{font:600 .73rem/1.35 system-ui,sans-serif;color:#62748a}
.il-social-chart-wrap{width:100%;min-width:0;overflow:hidden}
.il-social-chart-wrap svg{display:block;width:100%;height:auto;max-width:100%}
.il-social-controls{display:flex;gap:10px;align-items:end;flex-wrap:wrap;margin:8px 0 15px}
.il-social-select-label{display:flex;flex-direction:column;gap:4px;
 font:750 .70rem/1.25 system-ui,sans-serif;color:#3f5875}
.il-social-select{min-width:165px;max-width:100%;padding:9px 11px;border:1px solid #c9d5e2;
 border-radius:7px;background:#fff;color:#0b2447;font:650 .79rem/1.25 system-ui,sans-serif}
.il-social-bars{display:grid;gap:11px;width:100%;margin:10px 0 16px}
.il-social-bar-heading{display:flex;align-items:baseline;justify-content:space-between;
 gap:9px;font:650 .80rem/1.3 system-ui,sans-serif;color:#284561}
.il-social-bar-heading strong{color:#0b2447;font-weight:850;white-space:nowrap;font-variant-numeric:tabular-nums}
.il-social-bar-track{height:15px;border-radius:3px;background:#eef2f7;overflow:hidden;margin-top:5px}
.il-social-bar-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,#17395d,#bba067)}
.il-social-stat-line{font:700 .76rem/1.4 system-ui,sans-serif;color:#425b74;margin:12px 0}
.il-social-details{margin:11px 0;color:#61748a;font:550 .72rem/1.55 system-ui,sans-serif}
.il-social-details summary{cursor:pointer;font-weight:750;color:#345674}
.il-social-details p{margin:6px 0 10px;max-width:none;text-align:justify}
.il-social-source{display:inline-block;margin:5px 0 0;
 text-decoration:none!important;font:750 .72rem/1.4 system-ui,sans-serif;color:#1e5782!important}
.il-social-source:hover{text-decoration:underline!important}
.il-social-subtitle{font:750 1.05rem/1.3 Georgia,serif;color:#0b2447;margin:21px 0 12px}
.il-social-objectives{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.il-social-objective{border:1px solid #dde5ec;border-radius:7px;padding:13px;
 display:flex;flex-direction:column;gap:5px;min-width:0}
.il-social-objective-topic{font:800 .72rem/1.2 system-ui,sans-serif;color:#8b6b35}
.il-social-objective strong{font:850 clamp(1.05rem,1.6vw,1.4rem)/1.23 system-ui,sans-serif;
 color:#0b2447;overflow-wrap:anywhere}
.il-social-objective small{font-size:.68rem;color:#78889a}
.il-social-objective-change{display:flex;align-items:baseline;flex-wrap:wrap;gap:5px 9px;margin-top:3px}
.il-social-objective-change b{font:850 .82rem/1.3 system-ui,sans-serif;color:#7d5c27}
.il-social-objective-change small{font:550 .64rem/1.35 system-ui,sans-serif;color:#6e8297}
.il-social-objective p{font:550 .69rem/1.48 system-ui,sans-serif;color:#586b81;
 margin:4px 0;text-align:justify}
.il-social-objective a{font:750 .69rem/1.35 system-ui,sans-serif;color:#225c8b!important;text-decoration:none!important}
.il-social-foot{font:550 .70rem/1.55 system-ui,sans-serif;color:#687d91;
 border-top:1px solid #e8edf2;padding-top:11px;margin-top:17px}
.il-social-no-data{font:700 .75rem/1.4 system-ui,sans-serif;color:#7e5a23}
@media(max-width:900px){.il-social-objectives{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:540px){
 .il-social-objectives{grid-template-columns:1fr 1fr;gap:7px}
 .il-social-objective{padding:9px}
 .il-social-objective strong{font-size:1rem}
 .il-social-select-label{flex:1 1 140px}
 .il-social-select{min-width:0;width:100%}
 .il-social-card{margin-bottom:11px}
 .il-social-bar-heading{font-size:.71rem}
 .il-social-bar-track{height:12px}
}

</style>

<style>
.observablehq{max-width:none!important;width:100%;box-sizing:border-box;padding-inline:clamp(14px,3vw,52px)!important}
.il-visual-intro{padding:23px 0 11px;border-top:3px solid #b89b5e;margin:15px 0 0}
.il-visual-kicker{font:800 .72rem/1.4 system-ui,sans-serif;letter-spacing:.15em;color:#9c7737}
.il-visual-intro h1{font:800 clamp(2.2rem,4.7vw,5.6rem)/1.03 Georgia,serif;letter-spacing:-.045em;color:#0b2447;margin:8px 0 9px}
.il-visual-intro p{font:500 clamp(.9rem,1.2vw,1.1rem)/1.55 system-ui,sans-serif;color:#64758c;max-width:100%;margin:0 0 18px}
.il-treemap{box-sizing:border-box;width:100%;margin:0;border:0}
.il-tm-top{display:flex;justify-content:space-between;align-items:flex-start;gap:20px;margin:5px 0 5px}
.il-tm-headings{max-width:840px;min-width:0}
.il-tm-eyebrow{font:800 .75rem/1.3 system-ui,sans-serif;letter-spacing:.1em;color:#967638;margin-bottom:9px}
.il-tm-title{font:850 clamp(1.7rem,3.1vw,3.4rem)/1.08 system-ui,sans-serif!important;letter-spacing:-.04em;color:#0b2447!important;margin:0!important;text-align:left}
.il-tm-year{min-width:100px;text-align:right;display:flex;flex-direction:column;gap:5px}
.il-tm-year strong{font:850 clamp(3rem,6vw,6rem)/.9 system-ui,sans-serif;letter-spacing:-.065em;color:#0b2447;font-variant-numeric:tabular-nums}
.il-tm-year small{font:600 .65rem/1.35 system-ui,sans-serif;color:#778697}
.il-tm-lead{font:.88rem/1.45 system-ui,sans-serif;color:#657388;margin:7px 0 17px;width:100%}
.il-tm-canvas{width:100%;position:relative;overflow:hidden;min-height:390px;max-width:100%;
background:#f1f3f5;isolation:isolate}
.il-tm-cell{display:flex;position:absolute;flex-direction:column;align-items:flex-start;
justify-content:flex-start;padding:clamp(7px,1vw,17px);min-width:0;min-height:0;
border:2px solid #fff;box-sizing:border-box;overflow:hidden;text-align:left;
color:#0b2447;cursor:pointer;transition:filter .15s ease,box-shadow .15s ease}
.il-tm-cell.il-tm-dark{color:#fff}
.il-tm-cell:hover{filter:brightness(1.09);z-index:2;box-shadow:inset 0 0 0 2px #fff}
.il-tm-cell:focus-visible{outline:4px solid #c08e1e;outline-offset:-5px;z-index:5}
.il-tm-cell-label{font:800 clamp(.72rem,1.25vw,1.7rem)/1.05 system-ui,sans-serif;letter-spacing:-.035em}
.il-tm-cell-percent{font:850 clamp(1.05rem,2.8vw,4.2rem)/1 system-ui,sans-serif;letter-spacing:-.05em;font-variant-numeric:tabular-nums}
.il-tm-cell.il-tm-compact .il-tm-cell-label{font-size:.71rem;line-height:1.03}
.il-tm-cell.il-tm-compact .il-tm-cell-percent{font-size:1.05rem}
.il-tm-cell .il-tm-sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}
.il-tm-selection{padding:12px 14px;border:1px solid #d4dce5;background:#f8fafc;border-radius:7px;margin:9px 0}
.il-tm-selection[hidden]{display:none}
.il-tm-detail-main{display:flex;justify-content:space-between;gap:16px;align-items:center;flex-wrap:wrap}
.il-tm-detail-copy{display:flex;flex-direction:column;gap:3px}
.il-tm-detail-copy strong{font:750 .85rem/1.3 system-ui,sans-serif}
.il-tm-detail-copy span{font:.75rem/1.4 system-ui,sans-serif;color:#65788c}
.il-tm-detail-main a{font:700 .8rem system-ui,sans-serif;color:#164c79}
.il-tm-expand,.il-tm-back{font:750 .76rem/1.2 system-ui,sans-serif;cursor:pointer;
border:1px solid #bca676;border-radius:5px;padding:8px 10px;background:#fff4db;color:#6b4d1b}
.il-tm-expand{margin-top:7px}
.il-tm-back{margin:0 0 9px}
.il-tm-back[hidden]{display:none}
.il-tm-controls{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin:13px 0 4px}
.il-tm-controls label{display:flex;gap:9px;align-items:center;font:700 .8rem system-ui,sans-serif}
.il-tm-year-select{padding:8px 22px 8px 9px;border:1px solid #cbd5e0;border-radius:5px;background:#fff;font:.8rem system-ui}
.il-tm-year-select:disabled{opacity:.7}
.il-tm-period{font:500 .69rem/1.5 system-ui,sans-serif;color:#7c8999}
.il-tm-source{display:flex;flex-wrap:wrap;gap:5px 15px;align-items:center;
border-top:1px solid #e0e6ed;margin:7px 0 4px;padding-top:9px;
font:.69rem/1.4 system-ui,sans-serif;color:#708097}
.il-tm-source a{font-weight:700;color:#254d75}
.il-tm-method{margin:10px 0 22px;padding:8px 0;border-top:1px solid #edf0f3;border-bottom:1px solid #edf0f3}
.il-tm-method summary{font:700 .77rem/1.45 system-ui,sans-serif;color:#2e5273;cursor:pointer}
.il-tm-method-content p{font:.79rem/1.6 system-ui,sans-serif;color:#596a80;max-width:100%;text-align:justify;margin:9px 0}
.il-audit{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:22px 0}
.il-audit>article{padding:15px;border:1px solid #e0e5ec;border-radius:8px;background:#fbfcfd}
.il-audit h3{font:800 .78rem/1.35 system-ui,sans-serif;margin:0 0 8px;color:#0b2447}
.il-audit p{font:.75rem/1.48 system-ui,sans-serif;color:#64758a;margin:0}
.il-audit strong{color:#0c354f}
.il-audit-links{margin:8px 0 30px;font:.77rem/1.65 system-ui,sans-serif;color:#647589}
.il-audit-links a{color:#1f527c}


.il-tm-modes{display:flex;align-items:center;gap:5px;flex-wrap:wrap;margin:11px 0 10px}
.il-tm-modes button{padding:9px 13px;border:1px solid #d3dde5;background:#fff;
border-radius:5px;color:#47617c;cursor:pointer;font:700 .77rem/1.3 system-ui,sans-serif}
.il-tm-modes button[aria-pressed="true"]{color:#fff;background:#0b2447;border-color:#0b2447}
.il-tm-modes button:disabled{opacity:.45;cursor:not-allowed}
.il-tm-modes button:focus-visible{outline:3px solid #c29b41;outline-offset:2px}
.il-tm-timeline{display:flex;align-items:center;gap:13px;flex:1 1 390px;min-width:160px}
.il-tm-timeline[hidden]{display:none}
.il-tm-play{border:0;border-radius:5px;background:#0b2447;color:white;
font:750 .76rem/1.3 system-ui,sans-serif;padding:9px 12px;cursor:pointer;white-space:nowrap}
.il-tm-play:hover{background:#284363}
.il-tm-range{width:100%;min-width:80px;accent-color:#c99d2d;cursor:pointer}
.il-tm-period{flex:0 1 300px}
@media(max-width:760px){.il-tm-timeline{order:-1;flex:1 1 100%}}
@media(max-width:760px){
 .il-visual-intro{padding-top:15px}
 .il-tm-top{gap:7px}
 .il-tm-year{min-width:72px}
 .il-tm-year strong{font-size:2.9rem}
 .il-tm-title{font-size:clamp(1.7rem,6vw,2.45rem)!important}
 .il-tm-lead{font-size:.75rem}
 .il-tm-canvas{min-height:400px}
 .il-tm-cell{padding:5px;border-width:1px}
 .il-tm-cell-label{font-size:.67rem}
 .il-tm-cell-percent{font-size:1.4rem}
 .il-tm-cell.il-tm-compact .il-tm-cell-label{font-size:.59rem}
 .il-tm-cell.il-tm-compact .il-tm-cell-percent{font-size:.86rem}
 .il-audit{grid-template-columns:1fr;gap:7px}
 .il-audit>article{padding:12px}
}
@media(prefers-reduced-motion:reduce){.il-tm-cell{transition:none}}

/* ATLAS gallery-first: compact entry, six graphics immediately browsable. */
.il-gallery-intro{margin:18px 0 9px;padding:13px 0 0;border-top:2px solid #baa16d}
.il-gallery-intro span{display:block;color:#96753d;font:800 .68rem/1.3 system-ui,sans-serif;letter-spacing:.13em}
.il-gallery-intro h1{font:750 clamp(1.5rem,2.8vw,2.35rem)/1.1 Georgia,serif;color:#0b2447;
 margin:4px 0 12px}
.il-gallery{font-family:system-ui,-apple-system,sans-serif;max-width:none;width:100%}
.il-gallery-toolbar{display:flex;align-items:center;gap:12px;margin:3px 0 15px}
.il-gallery-search{display:flex;align-items:center;gap:8px;border:1px solid #cfdbe7;
 background:#fff;border-radius:9px;padding:0 12px;flex:1;max-width:720px;min-width:0;
 box-shadow:0 1px 3px rgba(11,36,71,.03)}
.il-gallery-search:focus-within{outline:2px solid #bd9a55;outline-offset:2px}
.il-gallery-search-icon{color:#8092a4;font-size:1.3rem}
.il-gallery-search input{height:44px;min-width:0;flex:1;border:0!important;outline:0!important;
 background:transparent;color:#0b2447;font:600 .81rem/1.3 system-ui,sans-serif;
 box-shadow:none!important}
.il-gallery-clear{background:none;border:0;color:#59728d;cursor:pointer;
 padding:6px;font:600 1.3rem/1 system-ui,sans-serif}
.il-gallery-clear[hidden]{display:none}
.il-gallery-count{white-space:nowrap;color:#70839a;font:650 .72rem/1.3 system-ui,sans-serif}
.il-gallery-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:0 0 20px}
.il-gallery-card{display:flex;flex-direction:column;text-align:left;min-width:0;width:100%;height:260px;
 padding:14px;border:1px solid #dbe3eb;border-radius:10px;background:white;
 cursor:pointer;color:#0b2447!important;transition:border-color .12s,box-shadow .12s,transform .12s;
 font-family:system-ui,-apple-system,sans-serif}
.il-gallery-card:hover{border-color:#b49a68;box-shadow:0 7px 21px rgba(11,36,71,.09);transform:translateY(-2px)}
.il-gallery-card:focus-visible{outline:3px solid #c4a15e;outline-offset:2px}
.il-gallery-card[hidden]{display:none}
.il-gallery-card-top{display:flex;align-items:center;justify-content:space-between;gap:7px;margin:0 0 5px}
.il-gallery-card-tag{font:800 .60rem/1.3 system-ui,sans-serif;letter-spacing:.055em;
 text-transform:uppercase;color:#937037}
.il-gallery-open-glyph{font:800 1rem/1 system-ui,sans-serif;color:#7189a1}
.il-gallery-card h3{font:780 .95rem/1.25 system-ui,sans-serif;color:#112d4b;margin:0 0 4px}
.il-gallery-card-value{font:850 clamp(1.2rem,2.1vw,1.8rem)/1.17 system-ui,sans-serif;
 letter-spacing:-.025em;color:#0b2447;font-variant-numeric:tabular-nums}
.il-gallery-card-period{font:600 .69rem/1.35 system-ui,sans-serif;color:#7a8a9c;margin-top:auto}
.il-gallery-preview{height:115px;width:100%;margin-top:8px;overflow:hidden;min-width:0;
 border-radius:5px;position:relative;flex:none}
.il-gallery-preview svg{width:100%;height:100%;object-fit:fill;display:block}
.il-gallery-tree{position:relative;width:100%;height:100%;background:#eee}
.il-gallery-tree-cell{position:absolute;border:1.5px solid white;box-sizing:border-box}
.il-gallery-bars{display:flex;flex-direction:column;gap:8px;width:100%;padding:2px 3px}
.il-gallery-bar-row{display:grid;grid-template-columns:minmax(66px,120px) 1fr;gap:7px;align-items:center}
.il-gallery-bar-row>span{font:650 .60rem/1.2 system-ui,sans-serif;color:#627891;
 white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.il-gallery-bar-track{height:9px;border-radius:2px;overflow:hidden;background:#edf1f5}
.il-gallery-bar-fill{height:100%;border-radius:2px}
.il-gallery-stat-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;height:100%}
.il-gallery-stat{display:flex;flex-direction:column;gap:5px;padding:7px;
 border:1px solid #e0e6ec;background:#f8fafc;border-radius:6px;overflow:hidden}
.il-gallery-stat small{font:600 .62rem/1.1 system-ui,sans-serif;color:#7c8ba0}
.il-gallery-stat strong{font:850 .96rem/1.12 system-ui,sans-serif;color:#103456;white-space:nowrap}
.il-gallery-empty{font:650 .84rem/1.5 system-ui,sans-serif;color:#71849a;padding:30px 4px}
.il-gallery-empty[hidden]{display:none}
.il-gallery-dialog{width:min(1110px,calc(100vw - 28px));max-width:1110px;
 height:min(91dvh,980px);max-height:91dvh;margin:auto;border:1px solid #dbe3ec;
 border-radius:12px;box-shadow:0 20px 70px rgba(5,23,48,.24);
 padding:0;background:white;color:#0b2447;box-sizing:border-box;overflow:hidden}
.il-gallery-dialog::backdrop{background:rgba(8,25,47,.65);backdrop-filter:blur(2px)}
.il-gallery-dialog-frame{display:flex;flex-direction:column;width:100%;height:100%;min-height:0}
.il-gallery-modal-header{position:sticky;top:0;z-index:5;display:flex;justify-content:space-between;
 align-items:center;gap:12px;padding:13px 18px;background:white;border-bottom:1px solid #e3e8ef;
 flex:none}
.il-gallery-modal-heading h2{font:780 clamp(1.12rem,2vw,1.55rem)/1.25 Georgia,serif;
 color:#0b2447;margin:0}
.il-gallery-modal-heading p{font:600 .72rem/1.4 system-ui,sans-serif;
 color:#76889d;margin:4px 0 0}
.il-gallery-close{background:#f1f4f8;color:#173452;border:1px solid #d6e0e9;
 cursor:pointer;width:38px;height:38px;border-radius:7px;font:700 1.6rem/1 system-ui,sans-serif}
.il-gallery-close:hover{background:#e7edf4}
.il-gallery-close:focus-visible{outline:2px solid #bf9e5f;outline-offset:2px}
.il-gallery-modal-content{overflow:auto;overscroll-behavior:contain;flex:1;min-height:0;
 padding:clamp(10px,2vw,22px)}
.il-gallery-modal-content>.il-social-card{border:0;margin:0;padding:0}
.il-gallery-modal-content>.il-treemap{margin:0}
.il-gallery-modal-content .il-tm-title{font-size:clamp(1.25rem,2vw,2.2rem)!important}
.il-gallery-modal-content .il-tm-year strong{font-size:clamp(1.8rem,3vw,3rem)!important}
.il-gallery-modal-content .il-tm-canvas{max-height:520px}
.il-gallery-indicator-source{display:flex;gap:7px;flex-wrap:wrap;
 font:650 .72rem/1.4 system-ui,sans-serif;color:#61778c}
.il-gallery-indicator-source a{color:#245b8b;text-decoration:none}
@media(max-width:1000px){
 .il-gallery-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media(max-width:540px){
 .il-gallery-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
 .il-gallery-card{height:216px;padding:9px}
 .il-gallery-card h3{font-size:.79rem}
 .il-gallery-card-value{font-size:1.22rem}
 .il-gallery-card-period{font-size:.58rem}
 .il-gallery-preview{height:96px;margin-top:6px}
 .il-gallery-card-tag{font-size:.54rem}
 .il-gallery-stat{padding:5px}
 .il-gallery-stat small{font-size:.53rem}
 .il-gallery-stat strong{font-size:.72rem}
 .il-gallery-bar-row{grid-template-columns:minmax(36px,73px) 1fr;gap:3px}
 .il-gallery-bar-row>span{font-size:.51rem}
 .il-gallery-bar-track{height:7px}
 .il-gallery-toolbar{gap:7px}
 .il-gallery-count{font-size:.60rem}
 .il-gallery-search{padding:0 7px}
 .il-gallery-search input{font-size:.74rem}
 .il-gallery-modal-header{padding:9px 12px}
 .il-gallery-dialog{width:calc(100vw - 10px);height:96dvh;max-height:96dvh;
  border-radius:8px}
 .il-gallery-modal-content{padding:10px}
}
@media(max-width:330px){.il-gallery-grid{grid-template-columns:1fr}
 .il-gallery-card{height:220px}.il-gallery-preview{height:110px}}


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
    <a class="il-atlas-nav-shortcut is-active" href="/visualizaciones.html" aria-current="page">Visualizaciones</a>
    <details class="idealab-nav-mobile il-atlas-menu">
      <summary aria-label="Abrir o cerrar menú de navegación">Menú <span aria-hidden="true">☰</span></summary>
      <div class="idealab-nav-mobile-panel il-atlas-menu-panel">
        <a href="/">Inicio</a>
        <a href="/#mapa-dinero">Mapa del dinero</a>
        <a href="/visualizaciones.html" aria-current="page">Visualizaciones</a>
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
```


<div class="il-gallery-intro">
  <span>OBSERVATORIO · ATLAS VISUAL</span>
  <h1>Visualizaciones</h1>
</div>

<div id="visual-gallery-root"></div>

```js
import {dsvFormat} from "npm:d3-dsv";
import {createCofogTreemap} from "./components/cofog-treemap.js";
import {createSocialTrends} from "./components/social-trends.js";
import {createVisualizationGallery} from "./components/visualization-gallery.js";
const csv = await FileAttachment("./data/seed/fact_finanzas_publicas_2024.csv").text();
const rows = dsvFormat(";").parse(csv.replace(/^\uFEFF/,""))
 .filter(r=>Number(r.año)===2024 &&
   ((r.clasificacion==="COFOG"&&r.lado==="gasto")||r.codigo==="S13.GASTO"))
 .map(r=>({code:r.codigo,title:r.indicador,year:Number(r.año),
   value:Number(r.valor),level:Number(r.nivel)}));
const verifiedHistory=await FileAttachment("./data/cofog-history.json").json();
const socialData=await FileAttachment("./data/social-trends.json").json();
const housingData=await FileAttachment("./data/housing-history.json").json();
const currentYear=Number(new URLSearchParams(window.location.search).get("anio"))||2024;
const treemap=createCofogTreemap({
 rows,history:verifiedHistory.status==="verified"?verifiedHistory.years:null,
 initialYear:currentYear
});
document.getElementById("visual-gallery-root").replaceChildren(
 createVisualizationGallery({
  treemap,socialRoot:createSocialTrends(socialData,housingData),
  rows,history:verifiedHistory,socialData,housingData
 })
);
```
