# IDEA LAB · Analítica del Observatorio Nacional — España en Datos

## Proveedor activo

**Cloudflare Web Analytics**, en la cuenta de Cloudflare independiente de IDEA LAB.

- Hostname configurado en Cloudflare: `idealab2026.github.io`.
- Sitio instrumentado: únicamente el producto **España en Datos**, publicado desde `idealab2026/dashboard-gobierno` bajo `/dashboard-gobierno/`.
- Plan: Web Analytics **gratuito**; no se han contratado Workers, Analytics Engine, dominios ni plan de pago.
- Instalación: snippet público de Cloudflare una sola vez en `observablehq.config.js` → `head`, aplicado a todas las páginas renderizadas por Observable Framework.
- **El identificador del sitio que contiene el snippet es público, no una contraseña ni una API key.** No publicar otros tokens de acceso ni credenciales.
- El código inactivo de GoatCounter se ha retirado y **no se envían datos a GoatCounter**.

## Métricas realmente disponibles

Cloudflare recoge visitas y visualizaciones de páginas del observatorio, procedencia (referrers), rutas, navegadores, dispositivos, países agregados y rendimiento web. No se necesitan cookies de nuestro propio sitio para el beacon.

**Advertencia sobre las interacciones:** Cloudflare Web Analytics no es una plataforma de eventos personalizados de aplicación. **No mide actualmente** de forma individual:
- apertura de cada rama o profundidad del Sankey;
- uso de filtros y búsquedas de partidas;
- clics de descarga CSV/Excel ni los enlaces a X;
- conversiones, scroll individual y clics por botón.

En el componente del Sankey siguen existiendo eventos **locales** `idealab:analytics` (sin destino externo), preparados para un eventual sistema first-party, pero **no se guardan ni transmiten**. Eliminar el antiguo sistema GoatCounter evita transmitir datos a terceros no aprobados; tampoco crea un contador de eventos que no existe.

## Verificación tras publicar

1. GitHub Actions debe superar CI, compilación, auditoría del bundle y publicación en GitHub Pages. No confundir fusión de código con despliegue exitoso.
2. Abrir la web `https://idealab2026.github.io/dashboard-gobierno/` y una página interna como `finanzas-publicas.html`.
3. Inspeccionar el HTML y confirmar **una** carga de `https://static.cloudflareinsights.com/beacon.min.js` con el identificador de IDEA LAB, sin llamadas a `goatcounter.com`.
4. En **Cloudflare → Observability → Analytics → Web Analytics**, pulsar el sitio creado para IDEA LAB. Comprobar que empiezan a aparecer Page Views, Visits, Paths y Referrers (el proveedor puede tardar en mostrarlos; navegadores con bloqueadores pueden omitir visitas).
5. Utilizar los informes para tomar decisiones sobre contenidos. **Las visitas anteriores a la instalación son desconocidas**; no se pueden deducir de «GitHub Insights → Traffic», que refleja únicamente tráfico del repositorio.

## Privacidad y aislamiento

- Cloudflare afirma que su Web Analytics no utiliza cookies de seguimiento ni perfiles individuales, pero los visitantes sí contactan con Cloudflare para cargar el script y enviar el beacon; publicar información transparente sobre este tratamiento.
- Usar solo el acceso de la cuenta **IDEA LAB** de Cloudflare. No mezclar con los Workers, credenciales, D1 u otros recursos de Segundo Cerebro.
- No atribuir visitas a personas determinadas. Las cifras agregadas pueden ser incompletas por bloqueadores, condiciones de red, retención o muestreo.
- Mantener el coste en 0 €. No activar Analytics Engine o productos de pago sin una decisión separada.

Referencias: [Cloudflare · Instalación manual](https://developers.cloudflare.com/web-analytics/get-started/) · [Cloudflare · Datos recogidos](https://developers.cloudflare.com/web-analytics/data-metrics/data-origin-and-collection/).
