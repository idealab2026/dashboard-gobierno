# IDEA LAB · Dashboard de indicadores de España

Web pública e independiente para divulgar estadísticas económicas, sociales y de finanzas públicas con fuentes y fechas verificables.

## Sitio

**URL tras activar GitHub Pages:** https://idealab2026.github.io/dashboard-gobierno/

El sitio completo está en `docs/`. Son archivos estáticos HTML, CSS, JavaScript y CSV, **sin backend, sin claves ni dependencias externas obligatorias**.

Páginas:
- `index.html`: indicadores nacionales y series históricas interactivas;
- `finanzas-publicas.html`: ingresos, gastos, necesidad de financiación y clasificación funcional;
- `metodologia.html`: fuentes, límites, trazabilidad y revisión estadística.

## Activar publicación (GitHub Free)

1. Abrir https://github.com/idealab2026/dashboard-gobierno/settings/pages
2. **Build and deployment → Source: Deploy from a branch**.
3. **Branch: main**, **Folder: /docs** → Save.
4. Esperar a que GitHub muestre **Your site is live at** y verificar el enlace.

No se necesita GitHub Pro, npm, GitHub Actions ni base de datos. La cuenta debe mantenerse sin facturación habilitada.

## Conjuntos de datos

- `docs/data/observations.csv`: 351 observaciones históricas y calculadas con metadatos de procedencia.
- `docs/data/public-finance.csv`: 99 registros de las finanzas públicas históricas.
- `docs/data/finance-sources.csv`: 7 referencias de fuentes.

**Nota de calidad:** el exportador excluyó 252 filas del alquiler con dimensión geográfica perdida. La fuente privada mantiene los registros originales para reparación. No se presenta como actualizado en tiempo real.

## Separación

Este repositorio es público y **no contiene** los secretos, el código de ingesta, la configuración del Drive, ni los documentos privados del laboratorio. No tiene acceso a ningún repositorio personal o del taller. Su contenido puede analizarse y descargarse libremente; no se concede automáticamente una licencia de reutilización del código.

No representa a ningún gobierno ni publica calificaciones políticas. Distingue observaciones estadísticas, cálculos y metodología.
