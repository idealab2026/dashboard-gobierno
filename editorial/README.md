# IDEA LAB · Radar editorial @LARREALIDAD

Módulo **público, gratuito y deliberadamente separado** del dashboard estadístico y del repositorio privado de investigación de IDEA LAB.

## Qué funciona

- Dos fuentes RSS oficiales (BOE y Banco Central Europeo) configurables en `sources.json`.
- Recogida diaria de titulares, fechas declaradas y enlaces originales sin API de pago.
- Normalización, deduplicación, validación HTTPS y resumen Markdown.
- Revisión visible en **GitHub Actions → Radar editorial IDEA LAB → última ejecución → Summary**.
- Pruebas unitarias sin red y ejecución manual `workflow_dispatch`.

## Qué NO hace

- **No publica en X**, no elude las condiciones de X ni usa un navegador automatizado.
- No consulta la API de OpenAI ni confunde una sesión de ChatGPT con credenciales API.
- No accede a Google Drive privado, al repositorio privado `analisis-geopolitico` ni a `mamg97`.
- No presenta titulares RSS como verdades contrastadas ni genera críticas políticas automáticas.
- No guarda borradores personales ni datos confidenciales en el repositorio público.

## Ejecución

```bash
python3 -m unittest discover -s editorial/tests -p 'test_*.py' -v
python3 editorial/digest.py
```

La ejecución programada corre **de lunes a viernes, 07:17 UTC**; se usa `ubuntu-latest` estándar de GitHub, que es gratuito en repositorios públicos. No se usan artifacts, caches, runners especiales ni servicios con facturación. El horario local varía entre CET y CEST.

Si una fuente no responde, se informa en el resumen; si todas fallan, el workflow falla explícitamente. El catálogo `sources.json` solo contiene URLs de acceso público.

## Flujo editorial

1. Abrir el Summary de la última ejecución.
2. Elegir una noticia verificable y leer el documento primario.
3. Investigar con fuentes adicionales y definir evidencia, contexto, incertidumbre y titular.
4. Revisar manualmente y preparar publicación en X (desde la interfaz oficial).
5. Registrar posteriormente métricas disponibles para evaluar alcance.

Si se desea registrar borradores o estadísticas privadas, su ubicación será un Google Sheet **de la cuenta IDEA LAB**, con una integración autorizada aparte. Una Action pública no tendrá acceso a esas credenciales.

## Evolución

Este módulo vive en una carpeta de `idealab2026/dashboard-gobierno` para utilizar ya la infraestructura pública gratuita existente. Puede migrarse a un repositorio público independiente `idealab2026/larrealidad-editorial` sin mover ni exponer el código ni los datos del laboratorio privado.
