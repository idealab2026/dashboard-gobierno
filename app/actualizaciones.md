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

</style>

<nav class="il-site-navigation" aria-label="Navegación del observatorio">
  <a class="il-site-brand" href="/dashboard-gobierno/" aria-label="IDEA LAB · Volver al inicio">IDEA LAB</a>
  <a class="il-site-home" href="/dashboard-gobierno/">← Inicio</a>
  <details class="il-site-menu">
    <summary aria-label="Abrir menú del observatorio">Menú ☰</summary>
    <div class="il-site-menu-links">
      <a href="/dashboard-gobierno/">Inicio</a>
      <a href="/dashboard-gobierno/#mapa-dinero">Mapa del dinero</a>
      <a href="/dashboard-gobierno/#resumen">Indicadores</a>
      <a href="/dashboard-gobierno/finanzas-publicas.html">Finanzas públicas</a>
      <a href="/dashboard-gobierno/actualizaciones.html">Actualización</a>
      <a href="/dashboard-gobierno/metodologia.html">Metodología</a>
      <a href="/dashboard-gobierno/quienes-somos.html">Quiénes somos</a>
    </div>
  </details>
</nav>


# Estado de actualización y fuentes

En IDEA LAB construimos **España en Datos**, nuestro observatorio económico, social e institucional, a partir de series históricas seleccionadas y fuentes públicas. Comprobamos periódicamente la disponibilidad de las fuentes oficiales, pero **una fuente accesible no significa que todas sus cifras se hayan importado o actualizado**. [Conoce nuestra iniciativa](/dashboard-gobierno/quienes-somos.html).

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

[Volver al resumen](/dashboard-gobierno/) · [Abrir finanzas públicas](/dashboard-gobierno/finanzas-publicas.html)
