export default {
 title: "IDEA LAB · España en Datos",
 root: "app",
 base: "/dashboard-gobierno/",
 sidebar: false,
 toc: false,
 pager: false,
 preserveExtension: true,
 head: `<link rel="icon" type="image/svg+xml" href="./favicon.svg"><meta name="theme-color" content="#07304b">
<!-- IDEA LAB · España en Datos · Cloudflare Web Analytics (free, cookieless) -->
<script type="module" src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"6fbdc8b6250b4bcba242121576b1e5f7"}'></script>
<style id="il-editorial-typography-contract">
/* CONTRATO GLOBAL DE MAQUETACIÓN (ver AGENTS.md).
   El contenido de lectura ocupa el ancho disponible. Justificar párrafos,
   pero jamás aplicar el justificado a botones, cifras, títulos o navegación. */
:is(.observablehq, #observablehq-main) {
  box-sizing: border-box;
  width: 100%;
  max-width: none !important;
  min-width: 0;
  padding-inline: clamp(12px, 2vw, 40px) !important;
}
:is(.observablehq, #observablehq-main) p,
:is(.observablehq, #observablehq-main) blockquote p,
:is(.observablehq, #observablehq-main) .hero .hero-subtitle,
:is(.observablehq, #observablehq-main) .section-description,
:is(.observablehq, #observablehq-main) .section-note,
:is(.observablehq, #observablehq-main) .il-about-lead,
:is(.observablehq, #observablehq-main) .il-about li {
  text-align: justify !important;
  text-align-last: left !important;
  hyphens: auto;
  -webkit-hyphens: auto;
  overflow-wrap: break-word;
}
:is(.observablehq, #observablehq-main) > p,
:is(.observablehq, #observablehq-main) .hero .hero-subtitle,
:is(.observablehq, #observablehq-main) .section-description,
:is(.observablehq, #observablehq-main) .section-note,
:is(.observablehq, #observablehq-main) .il-about-lead,
:is(.observablehq, #observablehq-main) .il-spotlight-top p,
:is(.observablehq, #observablehq-main) .il-finance-coverage > p,
:is(.observablehq, #observablehq-main) .columna-analisis p {
  box-sizing: border-box;
  width: 100% !important;
  max-width: none !important;
  min-width: 0;
}
</style>`,
 theme: "light"
};
