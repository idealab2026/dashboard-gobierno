# IDEA LAB · Estadísticas del Observatorio Nacional

## Estado real a 31 de octubre de 2026

**No está instalado ningún contador de visitas histórico en GitHub Pages.** Los datos de "Insights → Traffic" en GitHub son visitas al repositorio, no visitas a nuestro observatorio. No se conocen las visitas anteriores y **no se deben inventar**.

Hemos preparado un instrumento de analítica gratuito, sin cookies instaladas por la web y sin almacenamiento de identificadores por nuestro código, utilizando [GoatCounter](https://www.goatcounter.com/). Requiere **registrar una cuenta independiente para IDEA LAB** (no usar ninguna credencial del Segundo Cerebro). La recogida está **DESACTIVADA por defecto** hasta completar esta configuración.

## Activación necesaria (una sola vez)

1. Acceder a https://www.goatcounter.com/signup y crear una cuenta con el correo público de IDEA LAB, no con cuentas personales; como nombre de cuenta elegir un código disponible. La URL resultante será `https://CODIGO.goatcounter.com`.
2. Conservar el usuario y contraseña exclusivamente en GoatCounter. **No introducirlos en GitHub, en chat ni en el repositorio.**
3. Editar `app/components/site-analytics.js`: sustituir `GOATCOUNTER_ENDPOINT = ""` por `GOATCOUNTER_ENDPOINT = "https://CODIGO.goatcounter.com/count"`.
4. Abrir PR en `idealab2026/dashboard-gobierno`, pasar tests, compilar y desplegar GitHub Pages. Comprobar en las herramientas de red del navegador que se envían un único pageview y eventos anónimos al dominio correcto. Verificar en el dashboard privado de GoatCounter después de unos minutos.
5. Revisar la documentación de privacidad de la web antes de activarlo. GoatCounter no utiliza cookies por defecto, pero el tratamiento de registros de uso y eventuales consentimientos debe evaluarse conforme a la legislación aplicable.
6. En GoatCounter, revisar **Paths**, **Referrers**, **Browsers**, **Devices** y los eventos `event-*`. Mantener el acceso a las estadísticas bajo credenciales de IDEA LAB.

GoatCounter ofrece actualmente alojamiento gratuito para uso público razonable; confirmar las condiciones vigentes al registrarse. Este instrumento no usa Cloudflare del Segundo Cerebro, GitHub Issues como base de datos ni tokens de X.

## Qué mediremos

| Métrica | Fuente |
| --- | --- |
| Visitas por página | Pageviews de GoatCounter; consultas de la portada /, /finanzas-publicas, /buscador-partidas, /metodologia, /actualizaciones y /quienes-somos |
| Repetición de páginas / visitantes | Métrica de visitas de GoatCounter; aproximación dependiente del cómputo de sesiones y de bloqueadores |
| Procedencia | Referrer normalizado a dominio, sin query ni URL individual |
| Móvil vs ordenador | Información agregada que muestra el proveedor |
| Interacción Sankey | `event-sankey_desglose_gasto`, `event-sankey_desglose_ingreso`, `event-sankey_desglose_otro`, `event-sankey_cambio_anio` y `event-sankey_metodologia` |
| Búsqueda de partidas | `event-busqueda_enviada`; **no guardamos las búsquedas ni sus palabras** |
| Descarga | `event-download_csv` y `event-download_excel` |
| Interacción con menús | `event-nav_*` |
| Salidas al canal editorial X, web corporativa y fuentes | `event-outbound_x`, `event-outbound_idea_lab` y `event-outbound_fuente` |

El conteo de clics es descriptivo, no indica que el usuario haya completado una lectura o descarga. La analítica no mide todas las visitas por bloqueadores, opciones de privacidad y robots. **No tenemos datos retrospectivos.**

## Protección de privacidad y calidad

- Analítica desactivada hasta que el propietario configure el destino. Sin activar, el sitio no llama a servicios de analítica.
- No enviamos correos, usuarios, cookies, direcciones IP por código propio, sesiones, búsquedas ni valores de parámetros como `q` o `cofog`.
- Se envían categorías estables y URLs de página **normalizadas**, sin `query strings` ni fragmentos libres.
- GoatCounter, al servir la medición, recibirá información técnica de conexión; revisar sus condiciones, contratos y residencia de datos.
- No relacionar visitantes con usuarios personales ni mostrar métricas privadas en una página pública.
- No usar GitHub Actions como colector de eventos de usuarios; su función es exclusivamente probar el código.
