---
title: Actualización de datos
theme: light
sidebar: false
toc: false
---

# Estado de actualización y fuentes

En IDEA LAB construimos **España en Datos**, nuestro observatorio económico, social e institucional, a partir de series históricas seleccionadas y fuentes públicas. Comprobamos periódicamente la disponibilidad de las fuentes oficiales, pero **una fuente accesible no significa que todas sus cifras se hayan importado o actualizado**. [Conoce nuestra iniciativa](./quienes-somos).

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

[Volver al resumen](./) · [Abrir finanzas públicas](./finanzas-publicas)
