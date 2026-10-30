# IDEA LAB · Auditoría X @LARREALIDAD (coste cero)

## Estado real

- **Registro canónico privado:** Google Sheet `IDEA LAB — Auditoría X · @LARREALIDAD`, propiedad de la cuenta Drive IDEA LAB, dentro de su carpeta propia. No hay copia de datos reales en GitHub.
- **Capa pública:** `editorial/audit_x.py` y pruebas. Código gratuito y reproducible, sin accesos a X/Drive.
- **Primera línea base:** una lectura supervisada de la pestaña X (30/10/2026) con **8 posts visibles**. La captura no contiene todos los posts ni la publicación nueva.
- **Autenticación X:** no existe. La sesión abierta de ChatGPT NO se transmite a GitHub Actions.

## Uso local / desde una exportación de Google Sheets

1. En el Drive privado de IDEA LAB, abrir el Sheet de auditoría.
2. Descargar **solo la pestaña Publicaciones** como CSV (Archivo → Descargar → CSV).
3. Ejecutar `python3 editorial/audit_x.py /ruta/privada/Publicaciones.csv`.
4. Opcional: `python3 editorial/audit_x.py /ruta/privada/Publicaciones.csv --json`.
5. Guardar el informe en el Drive de IDEA LAB si se necesita histórico documental. **No subir el CSV al repositorio público.**

El Google Sheet privado contiene `Perfil`, `Publicaciones`, `Últimas`, `Resumen`, `Formatos`, `Seguimiento` y `Metodologia`. `Últimas` consolida el valor de la **última fila añadida** para cada `post_id` (por eso las lecturas deben añadirse por orden cronológico); `Resumen` y `Formatos` agregan esas últimas lecturas sin sumar instantáneas duplicadas. `Seguimiento` calcula la cobertura frente al objetivo de 20–30 publicaciones y deja el siguiente corte documentado. Si se detecta una corrección histórica, se añade una nueva lectura rectificativa en la última fila para ese post.

La pestaña `Publicaciones` es append-only: una fila por post y fecha de lectura, con columnas `fecha_observacion,post_id,fecha_post,formato,tema,extracto,visualizaciones,me_gusta,reposts,respuestas,url,fuente,cobertura`. El script toma **la última observación por post** y compara primera/última cuando hay más de una fecha. No suma varias lecturas del mismo post.

## Prueba reproducible en GitHub Actions

Workflow `Auditoría X · CI con datos ficticios`: ejecuta tests offline y una auditoría demostrativa con `editorial/fixtures/SOLO_DATOS_FICTICIOS.csv`. Está pensado como prueba de funcionalidad, NO como acceso real a la cuenta de X. No requiere tokens, ni APIs de pago, ni navegador. Runs estándar en repositorio público sin coste de minutos.

## Objetivo metodológico

Medir, con trazabilidad, evolución de publicaciones y métricas observables; segmentar por formato sin confundir datos descriptivos con causalidad algorítmica. Antes de recomendar cambios por formato, obtener >=20 publicaciones diversas y capturas en fechas diferentes. Para deducir conversión a seguidores hacen falta datos de visitas y seguimiento con adecuada cobertura; esta auditoría no los inventa.

## Privacidad y cumplimiento

No introducir cookies, claves, exportaciones privadas ni tokens de Google/X en Actions públicas. No usar scraping programático no autorizado ni automatización de navegador en X. El navegador ChatGPT puede permitir consulta asistida puntual, sin prometer persistencia, refresco ni ejecución desatendida.
