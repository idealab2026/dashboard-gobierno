/**
 * IDEA LAB · Analítica opcional de España en Datos.
 *
 * No se realizan solicitudes externas mientras el endpoint esté vacío.
 * Los eventos usan exclusivamente una taxonomía fija: no enviamos texto
 * de búsquedas, detalles de URL, valores de formularios ni identificadores.
 * No instala cookies ni almacena IDs de sesión en el navegador.
 */

// Introducir exclusivamente un subdominio de GoatCounter controlado por IDEA LAB.
// Ejemplo tras crear la cuenta: "https://<codigo-IDEA-LAB>.goatcounter.com/count"
// Dejar vacío hasta haber configurado y verificado el proveedor.
export const GOATCOUNTER_ENDPOINT = "";

export const EVENT_NAMES = Object.freeze([
  "nav_mapa_dinero",
  "nav_finanzas_publicas",
  "nav_buscador_partidas",
  "nav_metodologia",
  "nav_actualizaciones",
  "nav_quienes_somos",
  "nav_indicadores",
  "nav_areas",
  "nav_otros",
  "outbound_x",
  "outbound_idea_lab",
  "outbound_fuente",
  "download_csv",
  "download_excel",
  "busqueda_enviada",
  "filtro_cambiado",
  "sankey_desglose_gasto",
  "sankey_desglose_ingreso",
  "sankey_desglose_otro",
  "sankey_cambio_anio",
  "sankey_metodologia"
]);

const KNOWN_EVENTS = new Set(EVENT_NAMES);
const GC_PATTERN = /^https:\/\/[a-z0-9][a-z0-9-]*\.goatcounter\.com\/count$/;

export function validateEndpoint(endpoint) {
  return typeof endpoint === "string" && GC_PATTERN.test(endpoint);
}

/** Unifica páginas y prohíbe almacenar query params como ?q=... */
export function safePagePath(pathname) {
  if (typeof pathname !== "string") return "/";
  const clean = pathname.split("?")[0].split("#")[0].replace(/\/{2,}/g, "/");
  const prefix = "/dashboard-gobierno";
  let rest = clean === prefix ? "/" : clean.startsWith(prefix + "/") ? clean.slice(prefix.length) : clean;
  if (rest === "/" || rest === "/index.html" || rest === "") return "/";
  rest = rest.replace(/\.html$/, "");
  // Solo etiquetas de ruta a partir de un conjunto público y acotado.
  const routes = new Set([
    "/finanzas-publicas", "/buscador-partidas", "/metodologia",
    "/actualizaciones", "/quienes-somos"
  ]);
  return routes.has(rest) ? rest : "/otras";
}

export function classifyLink(rawHref, currentHref = "https://idealab2026.github.io/dashboard-gobierno/") {
  if (!rawHref || typeof rawHref !== "string") return null;
  if (/^(javascript:|mailto:|tel:)/i.test(rawHref)) return null;
  let target, current;
  try {
    target = new URL(rawHref, currentHref);
    current = new URL(currentHref);
  } catch {
    return null;
  }
  if (!["http:", "https:"].includes(target.protocol)) return null;
  if (/\.(csv)(?:$)/i.test(target.pathname)) return "download_csv";
  if (/\.(xlsx|xls)(?:$)/i.test(target.pathname)) return "download_excel";
  if (target.hostname === "x.com" || target.hostname === "twitter.com") return "outbound_x";
  if (target.origin === "https://idealab2026.github.io" && target.pathname === "/")
    return "outbound_idea_lab";
  if (target.origin !== current.origin) return "outbound_fuente";

  if (target.hash && target.pathname === current.pathname) {
    const hash = target.hash.toLowerCase().replace(/^#/, "");
    if (hash === "mapa-dinero") return "nav_mapa_dinero";
    if (hash === "resumen") return "nav_indicadores";
    if (["economia", "empleo", "vivienda", "estado", "pensiones", "sociedad", "mundo"].includes(hash))
      return "nav_areas";
    return "nav_otros";
  }
  const path = safePagePath(target.pathname);
  return ({
    "/finanzas-publicas": "nav_finanzas_publicas",
    "/buscador-partidas": "nav_buscador_partidas",
    "/metodologia": "nav_metodologia",
    "/actualizaciones": "nav_actualizaciones",
    "/quienes-somos": "nav_quienes_somos"
  })[path] || "nav_otros";
}

/** Fuente aproximada, sin ruta, término de búsqueda, URL completa ni parámetro UTM. */
export function referrerLabel(referrer) {
  if (!referrer) return "";
  try {
    const hostname = new URL(referrer).hostname.toLowerCase();
    if (!/^[a-z0-9.-]{1,120}$/.test(hostname)) return "";
    return hostname;
  } catch {
    return "";
  }
}

/**
 * Este instalador se llama desde cada página Observable. No contabiliza nada
 * hasta que IDEA LAB active un endpoint real y válido de GoatCounter.
 */
export function installSiteAnalytics() {
  if (typeof window === "undefined" || typeof document === "undefined") return false;
  if (!validateEndpoint(GOATCOUNTER_ENDPOINT)) return false;

  const page = safePagePath(window.location.pathname);
  const prior = window.__ideaLabSiteAnalytics;
  if (prior && prior.endpoint === GOATCOUNTER_ENDPOINT) {
    if (prior.page !== page) {
      prior.page = page;
      prior.pageview();
    }
    return true;
  }

  const state = {endpoint: GOATCOUNTER_ENDPOINT, ready: false, queue: [], page};
  function send({name, event = true}) {
    if (!state.ready || typeof window.goatcounter?.count !== "function") return;
    const data = {
      path: event ? "event-" + name : state.page,
      event,
      title: event ? "Interacción del observatorio" : document.title,
      referrer: referrerLabel(document.referrer)
    };
    if (event) data.no_session = true;
    window.goatcounter.count(data);
  }
  state.pageview = () => send({name: "", event: false});
  state.track = name => {
    if (!KNOWN_EVENTS.has(name)) return;
    if (!state.ready) {
      if (state.queue.length < 40) state.queue.push(name);
      return;
    }
    send({name});
  };
  window.__ideaLabSiteAnalytics = state;

  document.addEventListener("click", evt => {
    const item = evt.target?.closest?.("a[href], summary");
    if (!item) return;
    if (item.tagName === "SUMMARY") {
      if (item.closest(".idealab-nav")) state.track("nav_areas");
      return;
    }
    const action = classifyLink(item.getAttribute("href"), window.location.href);
    if (action) state.track(action);
  }, true);
  document.addEventListener("submit", evt => {
    const form = evt.target;
    if (form?.matches?.("form[role='search'], .il-quick-spending-form")) state.track("busqueda_enviada");
  }, true);
  document.addEventListener("change", evt => {
    const control = evt.target;
    if (control?.matches?.("select, input[type=checkbox], input[type=radio]") &&
        control?.closest?.(".il-spending-search, .il-finder, .pf-filters"))
      state.track("filtro_cambiado");
  }, true);
  document.addEventListener("idealab:analytics", evt => {
    state.track(evt.detail?.name);
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://gc.zgo.at/count.js";
  script.dataset.goatcounter = GOATCOUNTER_ENDPOINT;
  script.dataset.goatcounterSettings = JSON.stringify({no_onload: true, no_events: true});
  script.addEventListener("load", () => {
    state.ready = true;
    state.pageview();
    for (const name of state.queue.splice(0)) send({name});
  });
  script.addEventListener("error", () => {
    state.queue.length = 0;
  });
  document.head.append(script);
  return true;
}
