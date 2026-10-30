---
title: Metodología y calidad de datos
theme: light
sidebar: false
toc: true
---

# Cómo trabajamos

**Somos IDEA LAB, una iniciativa independiente de investigación y divulgación.** Desarrollamos **España en Datos**, nuestro observatorio económico, social e institucional. Los indicadores que mostramos incluyen bases históricas y no deben confundirse con una fotografía completamente actualizada de España. Conoce [quiénes somos](./quienes-somos) y cómo distinguimos datos, interpretación y opinión.

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

[Volver a España en Datos](./) · [Quiénes somos](./quienes-somos)
