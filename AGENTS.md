# IDEA LAB · España en Datos — Normas obligatorias del repositorio

Estas normas rigen cualquier edición (Codex, ChatGPT, colaboradores, auditorías automáticas) y cualquier nueva iteración. No son preferencias opcionales.

## Contrato visual permanente: párrafos a ancho completo y justificados

- **Todos los párrafos narrativos** deben usar `text-align: justify` y ocupar **el 100 % del ancho de su contenedor**; no introducir anchos máximos tipográficos como `90ch`, `70ch`, `720px`, etc.
- La última línea se mantiene alineada a la izquierda (`text-align-last: left`) para no generar espacios antinaturales. Activar partición de palabras (`hyphens: auto`) cuando sea compatible con el navegador.
- Aplicar la norma en **portada y todas las páginas**, tanto en escritorio como en móvil, incluidas descripciones del Observatorio, metodologías, textos explicativos, bloques de análisis y tarjetas narrativas.
- No aplicar justificación a títulos, botones, menús, cifras, métricas, etiquetas, valores tabulares ni a visualizaciones: su alineación semántica debe respetarse. El ancho completo se refiere al **contenedor natural** de cada párrafo: no sacar un párrafo de su tarjeta o columna.
- La fuente global de este contrato es `observablehq.config.js` → `head` → `<style id="il-editorial-typography-contract">`. No añadir reglas locales que lo anulen. Elimina o corrige cualquier CSS contradictorio.
- La maquetación principal no debe imponer un límite horizontal artificial de 1440/1680 píxeles; usa márgenes laterales discretos y responsivos y permite el ancho disponible de la ventana.
- El control automático `scripts/tests/test_typography_contract.py` forma parte del workflow de GitHub Actions. **No relajar la prueba ni desactivarla** para que pase un cambio visual: corregir la causa raíz.
- Antes de declarar una publicación como finalizada, verificar **pruebas, compilación, auditoría del artefacto y despliegue Pages**; no confundir commit con despliegue público.

## Contrato visual permanente: cabecera en una sola línea

- El nombre de producto «España en Datos» y su afiliación corporativa «IDEA LAB» aparecen en **una misma fila**, nunca uno encima del otro, en las cinco páginas.
- En dispositivos estrechos se puede ocultar el texto «Un producto de» y mantener el icono corporativo enlazado, sin crear una segunda fila ni generar desplazamiento horizontal.
- La navegación principal debe conservar acceso funcional al mapa del dinero y a la web de IDEA LAB.
- La comprobación automática `scripts/tests/test_brand_identity.py` verifica estas invariantes. No introducir reglas `flex-direction: column` en `.il-header-identity` ni en `.il-site-identity`.

## Integridad y seguridad

- Conservar el aislamiento de identidad entre IDEA LAB y proyectos privados. No publicar nombres o cuentas personales, secretos, credenciales, rutas locales ni información privada.
- No alterar datos oficiales, cálculos, valores canónicos ni conciliaciones cuando el trabajo sea solo visual.
- Conservar las fuentes, limitaciones estadísticas, interactividad del Sankey y rutas reales de GitHub Pages.
