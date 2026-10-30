---
title: Actualización de datos
theme: light
sidebar: false
toc: false
---

# Estado de actualización y fuentes

La publicación se construye desde el historial de datos seleccionado por Idea Lab. Las fuentes oficiales se comprueban periódicamente, pero **una fuente accesible no significa que todas sus cifras se hayan importado**.

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

## Vigencia de los datos representados

- **Panel de España:** series históricas seleccionadas, con fecha individual para cada observación.
- **Sankey de finanzas públicas:** ejercicio **2024**, pendiente de incorporación y validación de la versión oficial posterior.
- **Alquiler:** los 252 registros cuya desagregación geográfica no se pudo reconstruir permanecen excluidos.
- **Fuente canónica de trabajo:** Drive privado de Idea Lab; su contenido no se publica aquí.

## Qué se actualiza automáticamente

El workflow público consulta semanalmente fuentes oficiales del INE y la IGAE y vuelve a compilar este sitio. Las cifras del dashboard **no se modifican solo porque una fuente haya cambiado**. Cada nueva versión debe superar comprobaciones de identidad de la serie, territorio, unidad, metodología y conciliación con las tablas canónicas del laboratorio.

## Frecuencia

La comprobación está programada los lunes a las **07:17 UTC**, y también puede ejecutarse manualmente desde el repositorio público. Las ejecuciones programadas de GitHub pueden demorarse.

[Volver al resumen](./) · [Abrir finanzas públicas](./finanzas-publicas)
