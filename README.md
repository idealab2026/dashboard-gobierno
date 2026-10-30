# IDEA LAB · Observatorio de España

Web pública gratuita e independiente de divulgación estadística: https://idealab2026.github.io/dashboard-gobierno/

## Qué está publicado

El **Sankey interactivo original de IDEA LAB** es la visualización protagonista de la portada y dispone de explorador independiente en `/finanzas-publicas`. Se conservan las secciones de economía, empleo, vivienda, sector público, pensiones, sociedad y mundo.

Esta web se construye con **Observable Framework** desde `app/` y se publica exclusivamente mediante el workflow público `.github/workflows/observable-pages.yml`, utilizando **GitHub Pages → Source: GitHub Actions**. La antigua carpeta `docs/` ya no es la fuente de publicación. El resultado en `dist/` contiene únicamente los recursos públicos auditados.

## Datos y actualización

- **Fuente estadística:** organismos públicos y emisores de datos oficiales identificados en los metadatos.
- **Auditoría semanal de enlaces:** 41 referencias oficiales registradas (INE, IGAE, Banco de España, BOE, MITES, Sanidad, FMI); URL, fecha de consulta y disponibilidad en `/actualizaciones`. Un enlace accesible no acredita que sus cifras se hayan conciliado.
- **Actualización numérica automática comprobada:** serie INE **ECP320**, población nacional total, filtrada estrictamente al **1 de enero**. Datos trimestrales de abril, julio y octubre no se agregan por error al indicador anual. Si la revisión histórica, la identidad, la unidad o el salto entre periodos fallan, la actualización se bloquea.
- **Snapshot versionado 2026:** población **49.596.376** habitantes (dato provisional, 1/1/2026) y crecimiento anual calculado **0,95 %**. Los mismos valores se han conciliado con la hoja privada canónica de Idea Lab.
- **Resto de indicadores:** históricos versionados; no se actualizan automáticamente hasta disponer de un mapeo unívoco de serie, calendario, territorio, unidad y revisión.
- **Sankey:** últimos flujos completos internamente conciliados de **2024**; no se asignan impuestos a funciones concretas ni se inventa un cierre 2025. Para renovar se requieren las cuentas IGAE no financieras y la COFOG de una misma revisión estadística, con cuadre.
- **Alquiler:** se excluyen 252 filas con dimensión territorial ambigua.

### Flujo autónomo público

```text
Lunes · GitHub Actions público gratuito
  → comprueba enlaces oficiales
  → consulta y valida ECP320 (solo 1 de enero)
  → rechaza cambios inconsistentes
  → ejecuta tests y controles de calidad
  → compila Observable V2 + Sankey
  → audita referencias personales y secretos
  → publica HTML y datos verificados en GitHub Pages
```

Los datos del artefacto público se descargan sin credenciales desde fuentes oficiales. El **Google Drive privado de Idea Lab** almacena los datos canónicos del laboratorio; las actualizaciones autónomas de ese Drive requieren una integración OAuth/Apps Script propia de Idea Lab, **todavía no activada**, y no pueden inferirse del workflow público.

## Privacidad

Repositorio y páginas públicas sin credenciales, sin referencias a cuentas personales, sin acceso al Drive privado, ni permisos sobre otros proyectos. Los datos inéditos, investigación interna y documentación privada permanecen en `idealab2026/analisis-geopolitico` y en el Drive de Idea Lab.

## Costes

GitHub Pages y GitHub Actions con `ubuntu-latest` estándar en este repositorio **público**: coste de ejecución incluido en el servicio gratuito. No se requiere infraestructura facturable ni métodos de pago. No activar runners de pago.

## Validación y mantenimiento

```bash
npm ci
python -m unittest discover -s scripts/tests -p 'test_*.py' -v
python scripts/refresh_official.py
python scripts/fetch_ine_latest.py
python scripts/update_ine_ecp320.py
python scripts/validate_public.py
npm run build
python scripts/audit_build.py
```

**Distinguir fecha de publicación del sitio, fecha de consulta, año de referencia y estado definitivo/provisional de cada dato.** El observatorio no representa a ninguna administración pública ni emite evaluaciones políticas globales.
