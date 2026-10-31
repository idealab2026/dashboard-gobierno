import {OFFICIAL_DRILL_ROUTES, relatedBudgetPrograms} from "./official-drill-routes.js";
import {canonicalFinanceCode} from "./finance-code.js";
import {compareFinanceCodes,sortedFinanceChildren,financeExpansionPath,financeExpansionColumns} from "./finance-hierarchy.js";

const SVG_NS = "http://www.w3.org/2000/svg";

function number(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function text(value) {
  return value == null ? "" : String(value);
}

function normalizeYes(value) {
  return ["sí", "si", "yes", "true", "1"].includes(
    text(value).trim().toLowerCase()
  );
}

function formatMillions(value) {
  return `${new Intl.NumberFormat("es-ES", {
    maximumFractionDigits: 0
  }).format(number(value))} M€`;
}

function formatCompactMillions(value) {
  const v = number(value);
  if (Math.abs(v) >= 1000) {
    return `${new Intl.NumberFormat("es-ES", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(v / 1000)} mil M€`;
  }
  return formatMillions(v);
}

function formatPct(value, total, digits = 1) {
  const denominator = number(total);
  if (!denominator) return "—";
  return `${new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format((number(value) / denominator) * 100)} %`;
}

function wrapText(label, maxChars = 36, maxLines = 2) {
  const words = text(label).split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, maxLines);
}

function svgEl(name, attrs = {}) {
  const el = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attrs)) {
    if (value != null) el.setAttribute(key, String(value));
  }
  return el;
}

function htmlEl(name, className = "") {
  const el = document.createElement(name);
  if (className) el.className = className;
  return el;
}

function makeRibbon(sx, sy, tx, ty, width) {
  // La anchura ya viene calculada con una única escala global.
  // Solo imponemos 1 px para que ajustes técnicos muy pequeños sigan siendo clicables.
  const w = Math.max(1, width);
  const mid = (sx + tx) / 2;
  const y1a = sy - w / 2;
  const y1b = sy + w / 2;
  const y2a = ty - w / 2;
  const y2b = ty + w / 2;
  return [
    `M ${sx},${y1a}`,
    `C ${mid},${y1a} ${mid},${y2a} ${tx},${y2a}`,
    `L ${tx},${y2b}`,
    `C ${mid},${y2b} ${mid},${y1b} ${sx},${y1b}`,
    "Z"
  ].join(" ");
}

function stackPorts(items, scale, top, height) {
  const widths = items.map(item => Math.max(1, number(item.value) * scale));
  const bandsHeight = widths.reduce((sum, width) => sum + width, 0);
  const remaining = Math.max(0, height - bandsHeight);
  const gap = items.length > 1
    ? Math.min(4, remaining / (items.length - 1))
    : 0;
  const occupied = bandsHeight + gap * Math.max(0, items.length - 1);

  let current = top + Math.max(0, (height - occupied) / 2);
  const result = new Map();

  items.forEach((item, index) => {
    const width = widths[index];
    result.set(item.code, {center: current + width / 2, width});
    current += width + gap;
  });

  return result;
}

function rowLabel(row) {
  return row?.indicator_name || row?.indicator || row?.code || "Partida";
}

function sourceFor(row, sourceMap) {
  const dim = sourceMap.get(text(row?.source_id));
  return {
    name: dim?.title || row?.source || "Fuente oficial",
    organization: dim?.organization || "",
    url: dim?.url || row?.source_url || "",
    vintage: dim?.vintage_or_date || row?.vintage || "",
    character: dim?.character || row?.status || ""
  };
}

export function PublicFinanceExplorer(data, sources = [], taxFigures = [], options = {}) {
  const root = htmlEl("div", "pf-explorer");

  const parsed = (data || [])
    .map(d => ({
      ...d,
      year: number(d.year),
      value: number(d.value),
      code: canonicalFinanceCode(d.code),
      parent_code: canonicalFinanceCode(d.parent_code),
      level: text(d.level),
      side: text(d.side),
      is_vintage_adjustment: normalizeYes(d.is_vintage_adjustment),
      is_analytic_cut: normalizeYes(d.is_analytic_cut)
    }))
    .filter(d => d.year && d.code);

  const sourceMap = new Map(
    (sources || []).map(d => [text(d.source_id), d])
  );

  const parsedTaxFigures = (taxFigures || [])
    .map(d => ({
      ...d,
      year: number(d.year),
      value_mill_eur: number(d.value_mill_eur),
      sec_group: text(d.sec_group),
      tax_figure: text(d.tax_figure)
    }))
    .filter(d => d.year && d.sec_group);

  const years = [...new Set(parsed.map(d => d.year))].sort((a, b) => b - a);
  let currentYear = options.year && years.includes(options.year)
    ? options.year
    : years[0];
  let currentRow = null;

  const style = document.createElement("style");
  style.textContent = `
    .pf-explorer {
      width:100%; max-width:none; min-width:0;
      --pf-navy: var(--idealab-navy, #0b2447);
      --pf-gold: var(--idealab-gold, #b89b5e);
      --pf-cream: var(--idealab-cream, #f8f5ef);
      --pf-border: var(--idealab-border, #e3e6ea);
      --pf-muted: var(--idealab-muted, #667085);
      font-family: inherit;
    }
    .pf-toolbar {
      display:flex; align-items:center; gap:.55rem; flex-wrap:wrap;
      padding:.3rem 0 .85rem; margin:.2rem 0 .2rem;
      background:transparent; border:0;
    }
    .pf-toolbar button, .pf-toolbar select, .pf-toolbar a, .pf-detail-actions a, .pf-detail-actions button {
      appearance:none; border:1px solid var(--pf-border); background:#fff; color:var(--pf-navy);
      border-radius:8px; padding:.46rem .68rem; font:inherit; font-size:.76rem; font-weight:700;
      text-decoration:none; cursor:pointer;
    }
    .pf-toolbar button:hover, .pf-toolbar a:hover, .pf-detail-actions a:hover, .pf-detail-actions button:hover {
      border-color:#aeb8c4; background:#f8fafc;
    }
    .pf-toolbar select {border-color:#c9d0d8; min-width:72px;}
    .pf-toolbar-label {font-size:.76rem; color:var(--pf-muted); font-weight:700; margin-left:.05rem;}
    .pf-toolbar-spacer {flex:1 1 auto;}
    .pf-badge {display:inline-flex; align-items:center; border-radius:999px; padding:.36rem .6rem; font-size:.68rem; font-weight:800; background:#fbf6e9; color:#75520b; border:1px solid #ead9ae;}
    .pf-layout {position:relative; display:block; background:transparent; border:0; overflow:visible;}
    .pf-chart {width:100%; max-width:none; min-width:0; overflow:visible; padding:.25rem 0 .35rem; min-height:0;}
    .pf-chart svg {display:block; width:100%; max-width:none; min-width:0; height:auto; overflow:visible;}
    .pf-drawer-backdrop {
      position:fixed; inset:0; z-index:1190; background:rgba(7,20,38,.22);
      opacity:0; pointer-events:none; transition:opacity .2s ease;
    }
    .pf-drawer {
      position:fixed; right:0; top:0; bottom:0; width:min(92vw,480px); z-index:1200;
      background:#fff; border-left:1px solid var(--pf-border); box-shadow:-16px 0 48px rgba(11,36,71,.16);
      transform:translateX(102%); transition:transform .22s ease; overflow:hidden;
    }
    .pf-explorer.is-detail-open .pf-drawer-backdrop {opacity:1; pointer-events:auto;}
    .pf-explorer.is-detail-open .pf-drawer {transform:translateX(0);}
    .pf-drawer-inner {padding:1.1rem; max-height:100vh; overflow:auto;}
    .pf-close {float:right; border:0 !important; background:transparent !important; padding:.1rem .3rem !important; font-size:1.25rem !important;}
    .pf-detail-title {font-size:1.05rem; line-height:1.25; margin:0 2rem .25rem 0; color:var(--pf-navy);}
    .pf-detail-meta, .pf-source, .pf-note {font-size:.76rem; color:var(--pf-muted); line-height:1.5; margin:.5rem 0;}
    .pf-note {background:#f7f8fa; border:1px solid var(--pf-border); border-radius:8px; padding:.6rem .7rem;}
    .pf-note.caution {background:#fff8e6; border-color:#e6cc8a; color:#715513;}
    .pf-source a {color:var(--pf-navy); font-weight:700;}
    .pf-detail-actions {display:flex; gap:.5rem; flex-wrap:wrap; margin:.75rem 0;}
    .pf-table {width:100%; border-collapse:collapse; font-size:.74rem; margin:.65rem 0;}
    .pf-table th {text-align:left; padding:.45rem .5rem; background:#f0f3f6; color:var(--pf-navy); border-bottom:1px solid #cad2db;}
    .pf-table td {padding:.45rem .5rem; border-bottom:1px solid #eceff2; vertical-align:top;}
    .pf-table td.num, .pf-table th.num {text-align:right; white-space:nowrap;}
    .pf-table-row-link {cursor:pointer;}
    .pf-table-row-link:hover td {background:#f7f9fb;}
    .pf-table-row-link:focus {outline:2px solid #b9c7d6; outline-offset:-2px;}
    .pf-row-arrow {color:var(--pf-navy); font-weight:900; margin-left:.3rem;}
    .pf-breadcrumb {
      appearance:none; border:0; background:transparent; color:var(--pf-muted);
      padding:0; margin:0 0 .55rem; font:inherit; font-size:.74rem; font-weight:750; cursor:pointer;
    }
    .pf-breadcrumb:hover {color:var(--pf-navy); text-decoration:underline;}
    .pf-detail-subtitle {font-size:.8rem; color:var(--pf-navy); margin:1rem 0 .25rem;}

    /* Continuidad de investigación: niveles cuantitativos separados de las fuentes */
    .pf-drill-terminal{padding:.65rem .8rem;margin:.65rem 0 .4rem;
      border-left:3px solid #b89b5e;background:#fff9ed;border-radius:6px;
      font-size:.78rem;line-height:1.5;color:#4b5970;text-align:justify;text-align-last:left;}
    .pf-drill-route{margin:7px 0;border:1px solid #dfe6ee;border-radius:9px;
      padding:0;background:#fff;overflow:hidden;max-width:100%}
    .pf-drill-route > summary{padding:12px 14px;cursor:pointer;list-style:revert;
      color:#0b2447;font-size:.8rem;font-weight:750;line-height:1.4;}
    .pf-drill-route[open] > summary{border-bottom:1px solid #e5e9ef;background:#f6f9fc}
    .pf-drill-route-inner{padding:10px 14px 13px}
    .pf-drill-route-inner > p{margin:0 0 10px;font-size:.76rem;
      text-align:justify;text-align-last:left;color:#56667b;line-height:1.5}
    .pf-drill-links{display:flex;flex-direction:column;gap:7px}
    .pf-drill-links a{display:block;padding:8px 9px;border:1px solid #d9e2ea;border-radius:7px;
      color:#174571;background:#fff;text-decoration:none;font-size:.74rem;font-weight:750;
      overflow-wrap:anywhere;line-height:1.5}
    .pf-drill-links a:hover{background:#edf4f9;text-decoration:underline}
    .pf-drill-links small{display:block;color:#667587;font-weight:500;margin-top:2px}
    .pf-related-label{display:block;font-size:.74rem;color:#596b80;margin:7px 0}
    .pf-program{margin:6px 0 10px;border:1px solid #e1d5bb;border-radius:8px;padding:10px;
      background:#fdfbf6}
    .pf-program > summary{font-size:.77rem;line-height:1.4;color:#0b2447;font-weight:800;
      cursor:pointer;overflow-wrap:anywhere}
    .pf-program-info{margin:8px 0;font-size:.73rem;line-height:1.5;color:#55647a;text-align:justify;text-align-last:left}
    .pf-program-table{width:100%;border-collapse:collapse;font-size:.71rem}
    .pf-program-table td{padding:5px 3px;border-bottom:1px solid #e9e2d5}
    .pf-program-table td:last-child{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
    .pf-program-source{display:inline-block;margin-top:8px;font-size:.75rem;color:#134571;font-weight:750}

    .pf-empty {padding:2rem; color:var(--pf-muted); text-align:center;}
    .pf-footnote {font-size:.72rem; color:var(--pf-muted); line-height:1.5; margin:.65rem .15rem 0;}
    .pf-col-title {font-size:13px; font-weight:800; letter-spacing:1.4px; fill:#627086;}
    .pf-node-box {fill:#fff; stroke:#c7d0da; stroke-width:1.2;}
    .pf-node-group {cursor:pointer;}
    .pf-node-group:hover .pf-node-box {stroke:#0b2447; stroke-width:2; filter:drop-shadow(0 2px 3px rgba(0,0,0,.12));}
    .pf-income .pf-node-box {fill:#edf5fb;}
    .pf-adjust .pf-node-box {fill:#fbfaf7; stroke:#d7c79d; stroke-dasharray:4 3;}
    .pf-deficit .pf-node-box {fill:#fff2e7; stroke:#d48a49;}
    .pf-spend .pf-node-box {fill:#f6f2e8;}
    .pf-detail-node .pf-node-box {fill:#eef4ea;}
    .pf-center-box {fill:#0b2447; stroke:#0b2447;}
    .pf-center-label {fill:#fff; font-size:18px; font-weight:800;}
    .pf-center-value {fill:#fff; font-size:18px; font-weight:800;}
    .pf-center-sub {fill:#dce7f3; font-size:12px;}
    .pf-node-label {fill:#152033; font-size:12px; font-weight:700;}
    .pf-node-value {fill:#526175; font-size:10.5px; font-weight:650;}
    .pf-small-note {font-size:10.5px; fill:#8a6b25; font-weight:650;}
    .pf-link {cursor:pointer; stroke:none; transition:opacity .15s ease;}
    .pf-link:hover {opacity:.68;}
    .pf-income-link {fill:rgba(44,95,138,.29);}
    .pf-spend-link {fill:rgba(185,149,77,.30);}
    .pf-detail-link {fill:rgba(89,123,75,.33);}
    .pf-deficit-link {fill:rgba(212,138,73,.40);}
    .pf-adjust-link {fill:rgba(170,148,104,.20);}
    @media (max-width: 900px) {
      .pf-chart {overflow:visible; padding-bottom:.6rem;}
      .pf-chart svg {width:100%; min-width:0;}
      .pf-drawer {width:min(94vw,460px);}
    }
    @media (max-width: 560px) {
      /* En móvil se prioriza legibilidad: el mapa sigue completo y puede
         desplazarse horizontalmente en vez de cortar nodos. */
      .pf-chart {overflow-x:auto; overflow-y:hidden;}
      .pf-chart svg {min-width:760px;}
    }

    .pf-scroll-hint {display:none;}
    @media (max-width: 768px) {
      .pf-explorer,.pf-layout {width:100%;max-width:100%;min-width:0;}
      .pf-toolbar {display:grid;grid-template-columns:repeat(2,minmax(0,1fr));
        gap:7px;padding:.45rem 0 .6rem;}
      .pf-toolbar-spacer {display:none;}
      .pf-toolbar button,.pf-toolbar a,.pf-toolbar select {
        min-height:41px;min-width:0;display:inline-flex;align-items:center;
        justify-content:center;box-sizing:border-box;text-align:center;
        font-size:.72rem;padding:.5rem .5rem;
      }
      .pf-badge {grid-column:1/-1;justify-content:center;font-size:.7rem;}
      .pf-chart {width:100%;max-width:100%;overflow-x:auto!important;overflow-y:hidden!important;
        -webkit-overflow-scrolling:touch;overscroll-behavior-x:contain;
        touch-action:pan-x pan-y;scrollbar-width:thin;scrollbar-color:#94a3b8 #edf2f7;
        padding:.35rem 0 .7rem;border:1px solid #e2e8f0;border-radius:11px;
        background:#fafcfe;}
      .pf-chart svg {width:100%;min-width:790px!important;max-width:none!important;
        display:block;height:auto;overflow:visible;}
      .pf-scroll-hint {display:flex;gap:7px;align-items:center;justify-content:center;
        margin:0 0 .55rem;padding:.45rem .6rem;border-radius:8px;
        color:#53657a;background:#edf3f7;font-size:.74rem;font-weight:700;}
      .pf-drawer {top:0;bottom:0;width:min(100vw,480px);
        max-height:100dvh;border-radius:0;}
      .pf-drawer-inner {height:100%;max-height:100dvh;overflow-y:auto;
        overscroll-behavior:contain;box-sizing:border-box;padding:15px 13px 25px;}
      .pf-close {min-width:42px;min-height:42px;font-size:1.5rem!important;}
      .pf-table {display:block;max-width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch;}
      .pf-table th,.pf-table td {min-width:72px;overflow-wrap:anywhere;}
      .pf-footnote {font-size:.72rem;line-height:1.45;}
      .pf-detail-actions a,.pf-detail-actions button {min-height:42px;max-width:100%;}
    }

    /* Compact mobile controls: primary visualization before documentation. */
    .pf-mobile-tools {display:none;}
    @media(max-width:768px) {
      .pf-toolbar {display:flex!important;gap:6px!important;align-items:center;
        padding:2px 0 0!important;min-height:0!important;justify-content:flex-start;}
      .pf-toolbar > button,.pf-toolbar > a,.pf-toolbar > .pf-toolbar-spacer {display:none!important;}
      .pf-toolbar .pf-badge {display:inline-flex!important;width:auto!important;
        margin:0!important;grid-column:auto!important;
        padding:3px 8px!important;font-size:.66rem!important;
        border-radius:999px!important;}
      .pf-mobile-tools {display:block!important;margin:0 0 2px!important;
        padding:0!important;color:#64748b;}
      .pf-mobile-tools > summary {cursor:pointer;display:inline-flex;gap:5px;align-items:center;
        list-style:none;min-height:32px;padding:1px 3px;font-size:.7rem;
        color:#405773;font-weight:700;}
      .pf-mobile-tools > summary::-webkit-details-marker {display:none;}
      .pf-mobile-tools > summary:focus-visible {outline:2px solid #b89b5e;outline-offset:2px;}
      .pf-mobile-tools-inner {display:flex;flex-wrap:wrap;gap:7px;
        align-items:center;padding:7px;background:#f8fafc;border:1px solid #e3e8ee;
        border-radius:9px;margin:0 0 5px;}
      .pf-mobile-tools-inner > button,.pf-mobile-tools-inner > a {display:inline-flex;
        align-items:center;justify-content:center;min-height:38px;
        background:white;border:1px solid #d4dce7;border-radius:7px;
        color:#173556;padding:6px 9px;font-size:.7rem;font-weight:700;text-decoration:none;
        font-family:inherit;cursor:pointer;}
      .pf-mobile-tools-inner > p {margin:1px 0 0;font-size:.7rem;
        color:#58677d;line-height:1.4;width:100%;}
      .pf-scroll-hint {margin:0 0 3px!important;padding:2px 6px!important;
        min-height:24px!important;font-size:.67rem!important;
        line-height:1.2!important;background:transparent!important;
        justify-content:flex-start!important;color:#627085!important;}
      .pf-chart {margin:0!important;}
      .pf-footnote {display:none!important;}
    }


    /* Expansion of ONE SVG with a horizontal scrollbar, not a second panel. */
    .pf-layout{display:block!important;min-width:0;max-width:100%}
    .pf-chart{min-width:0;max-width:100%;box-sizing:border-box}
    .pf-chart.is-expanded{overflow-x:auto!important;overflow-y:hidden!important;
      -webkit-overflow-scrolling:touch;overscroll-behavior-x:contain;
      border:1px solid #dae4ee;border-radius:10px;
      scrollbar-color:#98aac1 #edf3f8;scrollbar-width:thin}
    .pf-chart.is-expanded svg{max-width:none!important;height:auto;display:block}
    .pf-extension-ribbon{fill:rgba(190,151,84,.34);cursor:pointer;stroke:none}
    .pf-extension-ribbon:hover{fill:rgba(190,151,84,.53)}
    .pf-extension-node{cursor:pointer}
    .pf-extension-node rect{fill:#f7f2e8;stroke:#c6d4e2;stroke-width:1.3}
    .pf-extension-node:hover rect,.pf-extension-node:focus-visible rect{
      stroke:#a37d37;stroke-width:2.4;fill:#fff4dc}
    .pf-extension-node[aria-current="step"] rect{stroke:#a17a34;stroke-width:2.8;fill:#fff1d3}
    .pf-extension-heading{fill:#937033;font:800 13px system-ui;letter-spacing:.07em}
    .pf-extension-label{fill:#122f50;font:750 13px system-ui}
    .pf-extension-value{fill:#516880;font:600 11px system-ui}
    .pf-extension-end rect{fill:#fff9ed;stroke:#d7bc83;stroke-width:1.4}
    .pf-extension-end text{fill:#4b6278;font:600 13px system-ui}
    .pf-extension-end .pf-extension-end-title{fill:#8a662b;font-weight:800}
    .pf-extension-end a text{fill:#19547f;font-weight:800;text-decoration:underline}
    .pf-inline-trail{display:flex;align-items:center;gap:6px;flex-wrap:wrap;
      padding:9px 11px;border:1px solid #dbe5ef;border-radius:9px;
      background:#f6f9fc;margin:8px 0;min-width:0}
    .pf-inline-trail[hidden],.pf-expand-hint[hidden]{display:none!important}
    .pf-inline-trail button{border:0!important;background:transparent!important;
      font:750 .74rem/1.4 system-ui;color:#17527c;padding:5px!important;
      text-align:left;cursor:pointer}
    .pf-inline-trail button:hover{text-decoration:underline}
    .pf-inline-trail strong{font:750 .74rem/1.4 system-ui;color:#0b2447}
    .pf-inline-trail span{color:#8998ab}
    .pf-inline-trail .pf-trail-close{border:1px solid #decda5!important;
      border-radius:7px;background:#fff!important;padding:6px 9px!important;
      color:#74531d!important;margin-left:auto}
    .pf-expand-hint{font:650 .72rem/1.5 system-ui;color:#536880;margin:6px 0}
    @media(max-width:768px){.pf-inline-trail{gap:3px;padding:6px}
      .pf-inline-trail button{font-size:.68rem!important}}

    @media print {
      .pf-toolbar {display:none;}
      .pf-chart {overflow:visible; min-height:0;}
      .pf-chart svg {min-width:0 !important; width:100% !important;}
      .pf-layout {break-inside:avoid; page-break-inside:avoid;}
      .pf-drawer, .pf-drawer-backdrop {display:none !important;}
    }
  `;
  root.append(style);

  const toolbar = htmlEl("div", "pf-toolbar");
  const yearLabel = htmlEl("span", "pf-toolbar-label");
  yearLabel.textContent = "Ejercicio";
  const yearSelect = htmlEl("select");
  for (const year of years) {
    const option = document.createElement("option");
    option.value = String(year);
    option.textContent = String(year);
    option.selected = year === currentYear;
    yearSelect.append(option);
  }

  const methodologyButton = htmlEl("button");
  methodologyButton.type = "button";
  methodologyButton.textContent = "Metodología y fuentes";

  const spacer = htmlEl("span", "pf-toolbar-spacer");

  const badge = htmlEl("span", "pf-badge");

  // Mientras solo exista un ejercicio completo, no mostramos un selector que no aporta nada.
  if (years.length > 1) toolbar.append(yearLabel, yearSelect);
  // Las exportaciones se ocultan por decisión editorial; se conservan fuentes.
  toolbar.append(methodologyButton, spacer, badge);
  root.append(toolbar);

  // Móvil: fuentes accesibles sin enlaces de descarga ni controles redundantes.
  const mobileTools = htmlEl("details", "pf-mobile-tools");
  const mobileSummary = htmlEl("summary");
  mobileSummary.textContent = "ⓘ Fuentes y metodología";
  const mobileToolsInner = htmlEl("div", "pf-mobile-tools-inner");
  const mobileMethodologyButton = htmlEl("button");
  mobileMethodologyButton.type = "button";
  mobileMethodologyButton.textContent = "Metodología y fuentes";
  const mobileExplanation = htmlEl("p");
  mobileExplanation.textContent = "Selecciona una rama para consultar importes, porcentajes y referencias. El ajuste estadístico es técnico, no un ingreso económico.";
  mobileToolsInner.append(mobileMethodologyButton, mobileExplanation);
  mobileTools.append(mobileSummary, mobileToolsInner);
  root.append(mobileTools);

  const layout = htmlEl("div", "pf-layout");
  const scrollHint = htmlEl("p", "pf-scroll-hint");
  scrollHint.textContent = "↔ Desliza · Toca una rama para explorar";
  const chart = htmlEl("main", "pf-chart");
  chart.tabIndex = 0;
  chart.setAttribute("role", "region");
  chart.setAttribute("aria-label", "Sankey del dinero público; desliza horizontalmente en móvil para ver todas las ramas");
  const backdrop = htmlEl("div", "pf-drawer-backdrop");
  const drawer = htmlEl("aside", "pf-drawer");
  const drawerInner = htmlEl("div", "pf-drawer-inner");
  const closeButton = htmlEl("button", "pf-close");
  closeButton.type = "button";
  closeButton.textContent = "×";
  closeButton.setAttribute("aria-label", "Cerrar detalle");
  const detail = htmlEl("div");
  drawerInner.append(closeButton, detail);
  drawer.append(drawerInner);
  const trail=htmlEl("nav","pf-inline-trail");
  trail.hidden=true;trail.setAttribute("aria-label","Ruta del desglose del gasto");
  const expandHint=htmlEl("p","pf-expand-hint");
  expandHint.hidden=true;
  expandHint.textContent="↔ Desliza hacia la derecha para seguir las ramas conectadas";
  layout.append(trail,scrollHint,chart,expandHint,drawer);
  root.append(layout,backdrop);

  const footnote = htmlEl("div", "pf-footnote");
  root.append(footnote);

  function rowsForYear() {
    return parsed.filter(d => d.year === currentYear);
  }

  function rowMapForYear() {
    return new Map(rowsForYear().map(row => [row.code, row]));
  }

  function children(code, {includeAnalytic = false} = {}) {
    return sortedFinanceChildren(rowsForYear(),code,{includeAnalytic});
  }

  function taxRowsFor(row) {
    if (!row || !["D.2", "D.5", "D.91"].includes(row.code)) return [];
    return parsedTaxFigures
      .filter(d => d.year === currentYear && d.sec_group === row.code)
      .sort((a, b) => b.value_mill_eur - a.value_mill_eur);
  }

  function table(rows, parentTotal, {tax = false} = {}) {
    const table = htmlEl("table", "pf-table");
    const thead = document.createElement("thead");
    const hrow = document.createElement("tr");
    for (const label of ["Código", "Partida / detalle", String(currentYear), "%"] ) {
      const th = document.createElement("th");
      th.textContent = label;
      if ([String(currentYear), "%"].includes(label)) th.className = "num";
      hrow.append(th);
    }
    thead.append(hrow);
    table.append(thead);
    const tbody = document.createElement("tbody");

    for (const row of rows) {
      const tr = document.createElement("tr");
      const values = tax
        ? [row.subsector || row.sec_group, row.tax_figure, row.value_mill_eur, "—"]
        : [row.code, rowLabel(row), row.value, formatPct(row.value, parentTotal)];

      // Las filas contables son navegables: permiten drill-down sin cerrar el drawer.
      if (!tax) {
        tr.className = "pf-table-row-link";
        tr.tabIndex = 0;
        tr.setAttribute("role", "button");
        tr.setAttribute("aria-label", `Abrir ${rowLabel(row)}`);
        tr.addEventListener("click", () => openDetail(row));
        tr.addEventListener("keydown", event => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openDetail(row);
          }
        });
      }

      values.forEach((value, index) => {
        const td = document.createElement("td");
        if (index === 2) {
          td.textContent = formatMillions(value);
        } else if (!tax && index === 1) {
          td.append(document.createTextNode(text(value)));
          const arrow = htmlEl("span", "pf-row-arrow");
          arrow.textContent = "→";
          td.append(arrow);
        } else {
          td.textContent = text(value);
        }
        if (index >= 2) td.className = "num";
        tr.append(td);
      });
      tbody.append(tr);
    }
    table.append(tbody);
    return table;
  }

  function detailRowsFor(row) {
    if (!row) return [];
    if (row.code === "S13.GASTO") {
      return rowsForYear()
        .filter(d => d.parent_code === "S13.GASTO")
        .filter(d => d.side === "gasto")
        .sort(compareFinanceCodes);
    }
    return children(row.code, {includeAnalytic: row.is_analytic_cut});
  }


  const programNumber = new Intl.NumberFormat("de-DE",{
    minimumFractionDigits:2,maximumFractionDigits:2
  });
  function appendFurtherInvestigation(container, row, hasChildren) {
    // Los programas y las rutas siguientes no son descendientes cuantitativos
    // de COFOG. Son otras dimensiones de consulta, con perímetros propios.
    if (!hasChildren) {
      const terminal = htmlEl("p", "pf-drill-terminal");
      const code = text(row.code);
      const isGroup = /^\d{2}\.\d/.test(code);
      terminal.textContent = isGroup
        ? `Fin del desglose numérico COFOG para ${code} en la serie IGAE ${currentYear}. España no publica de forma general un tercer nivel COFOG por clases. Para llegar a programas, capítulos, proyectos o pagos hay que cambiar a la fuente presupuestaria correspondiente; no se distribuye artificialmente el importe de esta función.`
        : `No hay más subpartidas cuantificadas para este código en el conjunto cargado (${currentYear}). Puedes continuar por otras fuentes oficiales sin inventar una relación numérica.`;
      container.append(terminal);
    }

    const related = relatedBudgetPrograms(row.code, currentYear, options.relatedPrograms);
    if (related.length) {
      const label = htmlEl("h3", "pf-detail-subtitle");
      label.textContent = "Programas presupuestarios relacionados · otra clasificación";
      container.append(label);
      const description = htmlEl("p","pf-related-label");
      description.textContent = "Relación temática, no desglose directo de COFOG. Importes de los PGE prorrogados para 2024; no se suman al total de esta función.";
      container.append(description);
      for (const item of related) {
        const entry = htmlEl("details","pf-program");
        const summary = htmlEl("summary");
        summary.textContent = `${item.codigo_presupuestario} · ${item.titulo} · ${programNumber.format(item.importe_eur/1000000)} M€ (presupuesto ${item.anio})`;
        entry.append(summary);
        const caveat = htmlEl("p","pf-program-info");
        caveat.textContent = item.naturaleza_importe + " " + item.trazabilidad;
        entry.append(caveat);
        if (Array.isArray(item.desglose) && item.desglose.length) {
          const table = htmlEl("table","pf-program-table");
          for (const chapter of item.desglose) {
            const tr = htmlEl("tr");
            const title = htmlEl("td");
            const val = htmlEl("td");
            title.textContent = chapter.concepto;
            val.textContent = programNumber.format(chapter.importe_eur/1000000)+" M€";
            tr.append(title,val);
            table.append(tr);
          }
          entry.append(table);
        }
        if (item.fuente_url?.startsWith("https://www.sepg.pap.hacienda.gob.es/")) {
          const a = htmlEl("a","pf-program-source");
          a.href = item.fuente_url;
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          a.textContent = "Ver documento presupuestario oficial";
          entry.append(a);
        }
        container.append(entry);
      }
    }

    const subtitle = htmlEl("h3","pf-detail-subtitle");
    subtitle.textContent = "Continuar hasta la partida, ejecución o contrato verificable";
    container.append(subtitle);
    for (const [index, route] of OFFICIAL_DRILL_ROUTES.entries()) {
      const details = htmlEl("details","pf-drill-route");
      // En un nodo terminal facilitar la continuación sin otro clic.
      details.open = !hasChildren && index === 0;
      const summary = htmlEl("summary");
      summary.textContent = route.title;
      details.append(summary);
      const inner = htmlEl("div","pf-drill-route-inner");
      const p = htmlEl("p");
      p.textContent = route.description;
      inner.append(p);
      const links = htmlEl("div","pf-drill-links");
      for (const [label,url,period] of route.links) {
        const a = document.createElement("a");
        if (url.startsWith("/buscador-partidas.html")) {
          const target = new URL("buscador-partidas.html", window.location.href);
          if (/^\d{2}(?:\.\d+)?$/.test(String(row.code))) {
            target.searchParams.set("cofog",String(row.code));
            target.searchParams.set("anio",String(currentYear));
          }
          a.href = target.href;
        } else {
          a.href = url;
        }
        a.target = url.startsWith("http") ? "_blank" : "_self";
        if (a.target === "_blank") a.rel="noopener noreferrer";
        a.append(document.createTextNode(label));
        const small = htmlEl("small");
        small.textContent = period;
        a.append(small);
        links.append(a);
      }
      inner.append(links);
      details.append(inner);
      container.append(details);
    }
  }


  // The full national Sankey is the persistent root of every expansion.
  function resetInlineSankey(){
    const svg=chart.querySelector("svg");
    if(svg){
      svg.querySelectorAll(".pf-inline-extension").forEach(element=>element.remove());
      svg.setAttribute("viewBox","0 0 1320 760");
      svg.style.width="";
      svg.style.minWidth="";
      delete svg.dataset.expandedCode;
    }
    chart.classList.remove("is-expanded");
    root.classList.remove("is-tree-open");
    trail.hidden=true;
    trail.replaceChildren();
    expandHint.hidden=true;
    chart.scrollLeft=0;
  }

  function expandInlineSankey(selected){
    const svg=chart.querySelector("svg");
    if(!svg)return;
    const rows=rowsForYear();
    const path=financeExpansionPath(rows,selected.code);
    if(path.length<2)return;
    const columns=financeExpansionColumns(rows,selected.code);
    const expenseRows=rows.filter(d=>d.parent_code==="S13.GASTO"&&
      d.side==="gasto"&&d.level==="1").sort(compareFinanceCodes);
    const rootExpense=path[1];
    const rootIndex=expenseRows.findIndex(item=>item.code===rootExpense.code);
    if(rootIndex<0)return;

    // Replace only the extension group; the ORIGINAL SVG nodes never unmount.
    svg.querySelectorAll(".pf-inline-extension").forEach(element=>element.remove());
    const sourceX=1290,nodeW=390,stageGap=145,stageStride=535;
    const boxH=56,rowGap=15;
    const maxCount=Math.max(1,...columns.map(column=>column.children.length));
    const height=Math.max(760,maxCount*(boxH+rowGap)+90);
    const width=1320+Math.max(columns.length,1)*stageStride;
    const scale=Math.max(1,chart.clientWidth/1320);
    svg.setAttribute("viewBox","0 0 "+width+" "+height);
    // Explicit physical width preserves the original node text dimensions
    // rather than shrinking the entire diagram as columns are added.
    const physicalWidth=Math.round(width*scale);
    svg.style.width=physicalWidth+"px";
    svg.style.minWidth=physicalWidth+"px";
    svg.dataset.expandedCode=selected.code;
    chart.classList.add("is-expanded");
    root.classList.remove("is-detail-open");
    trail.hidden=false;
    expandHint.hidden=false;
    trail.replaceChildren();
    for(const [index,item] of path.entries()){
      if(index){
        const separator=htmlEl("span");separator.textContent="›";trail.append(separator);
      }
      const title=item.code==="S13.GASTO"?"España · gasto consolidado":
        item.code+" · "+rowLabel(item);
      if(index===path.length-1){
        const strong=htmlEl("strong");strong.textContent=title;trail.append(strong);
      }else{
        const back=htmlEl("button");
        back.type="button";back.textContent=title;
        back.addEventListener("click",()=>item.code==="S13.GASTO"
          ?resetInlineSankey():openDetail(item));
        trail.append(back);
      }
    }
    const close=htmlEl("button","pf-trail-close");
    close.type="button";close.textContent="Volver al mapa completo";
    close.addEventListener("click",resetInlineSankey);
    trail.append(close);

    const group=svgEl("g",{class:"pf-inline-extension"});
    const ribbons=svgEl("g",{class:"pf-extension-ribbons"});
    const nodes=svgEl("g",{class:"pf-extension-nodes"});
    group.append(ribbons,nodes);
    const positions=new Map([[rootExpense.code,42+rootIndex*72+boxH/2]]);
    const initialMaximum=Math.max(1,...rows.filter(d=>
      d.parent_code==="S13.RECURSOS"||d.parent_code==="S13.GASTO"
    ).map(d=>d.value));
    const flowScale=54/initialMaximum;
    let focusX=sourceX;

    for(const [columnIndex,column] of columns.entries()){
      const {parent,children,selectedChildCode}=column;
      const x=sourceX+stageGap+stageStride*columnIndex;
      focusX=x;
      const parentY=positions.get(parent.code);
      if(!Number.isFinite(parentY))continue;
      const heading=svgEl("text",{x,y:23,class:"pf-extension-heading"});
      heading.textContent=(columnIndex+2)+" · "+parent.code+" · "+rowLabel(parent);
      nodes.append(heading);
      const incomingX=columnIndex===0?sourceX:
        sourceX+stageStride*(columnIndex-1)+stageGap+nodeW;

      if(!children.length){
        // There is no invented third-level figure. The branch terminates
        // inside the SVG and links to separate documentary classifications.
        const y=Math.max(52,Math.min(height-160,parentY-55));
        const end=svgEl("g",{class:"pf-extension-end"});
        end.append(svgEl("rect",{x,y,width:390,height:150,rx:10}));
        const title=svgEl("text",{
          x:x+13,y:y+26,class:"pf-extension-end-title"
        });
        title.textContent="ÚLTIMO NIVEL COFOG CUANTIFICADO";
        end.append(title);
        for(const [n,line] of [
          "La IGAE no publica aquí más ramas",
          "con importes propios verificables.",
          "Programas y contratos: fuentes distintas."
        ].entries()){
          const text=svgEl("text",{x:x+13,y:y+55+n*20});
          text.textContent=line;end.append(text);
        }
        const anchor=svgEl("a",{
          href:"buscador-partidas.html?cofog="+encodeURIComponent(parent.code)+
            "&anio="+currentYear,
          target:"_blank",rel:"noopener noreferrer"
        });
        const link=svgEl("text",{x:x+13,y:y+132});
        link.textContent="Investigar partidas relacionadas →";
        anchor.append(link);end.append(anchor);
        ribbons.append(svgEl("path",{
          d:makeRibbon(incomingX,parentY,x,y+75,2),
          class:"pf-extension-ribbon"
        }));
        nodes.append(end);
        continue;
      }

      const totalHeight=children.length*(boxH+rowGap)-rowGap;
      const firstY=Math.max(45,Math.min(
        parentY-totalHeight/2,height-totalHeight-45));
      for(const [childIndex,child] of children.entries()){
        const y=firstY+childIndex*(boxH+rowGap);
        const center=y+boxH/2;
        positions.set(child.code,center);
        const ribbon=svgEl("path",{
          d:makeRibbon(incomingX,parentY,x,center,
            Math.max(1.3,child.value*flowScale)),
          class:"pf-extension-ribbon"
        });
        ribbon.addEventListener("click",()=>openDetail(child));
        ribbons.append(ribbon);
        const node=svgEl("g",{
          class:"pf-extension-node",role:"button",tabindex:"0",
          "data-code":child.code,
          "aria-label":rowLabel(child)+" · "+formatMillions(child.value)
        });
        if(child.code===selectedChildCode)
          node.setAttribute("aria-current","step");
        node.append(svgEl("rect",{x,y,width:nodeW,height:boxH,rx:8}));
        const label=svgEl("text",{x:x+12,y:y+19,class:"pf-extension-label"});
        label.textContent=child.code+" · "+(wrapText(rowLabel(child),39,1)[0]||"");
        const amount=svgEl("text",{x:x+12,y:y+43,class:"pf-extension-value"});
        amount.textContent=formatMillions(child.value)+" · "+
          formatPct(child.value,parent.value)+" del nivel anterior";
        const tooltip=svgEl("title");
        tooltip.textContent=rowLabel(child)+" · "+formatMillions(child.value);
        node.append(label,amount,tooltip);
        node.addEventListener("click",()=>openDetail(child));
        node.addEventListener("keydown",event=>{
          if(event.key==="Enter"||event.key===" "){
            event.preventDefault();openDetail(child);
          }
        });
        nodes.append(node);
      }
    }
    svg.append(group);
    // A subtle but persistent root highlight ties the expansion to its source.
    for(const node of svg.querySelectorAll(".pf-node-group")){
      node.setAttribute("aria-pressed",String(
        node.getAttribute("data-code")===rootExpense.code));
    }
    const target=Math.max(0,focusX*scale-chart.clientWidth*.55);
    requestAnimationFrame(()=>chart.scrollTo({left:target,behavior:"smooth"}));
  }

  function openDetail(row) {
    if (!row) return;
    // Categorías públicas agregadas: no se envían códigos ni textos de las partidas.
    const dimension = row.side === "gasto" ? "gasto" : row.side === "ingreso" ? "ingreso" : "otro";
    document.dispatchEvent(new CustomEvent("idealab:analytics", {
      detail: {name: "sankey_desglose_" + dimension}
    }));
    currentRow = row;
    root.classList.add("is-detail-open");
    detail.replaceChildren();
    if(row.side==="gasto" && row.code!=="S13.GASTO"){
      expandInlineSankey(row);
      return;
    }
    resetInlineSankey();
    if(row.code==="S13.GASTO")return;

    const yearMap = rowMapForYear();
    const parent = row.parent_code ? yearMap.get(row.parent_code) : null;

    if (parent) {
      const breadcrumb = htmlEl("button", "pf-breadcrumb");
      breadcrumb.type = "button";
      breadcrumb.textContent = `← ${rowLabel(parent)}`;
      breadcrumb.addEventListener("click", () => openDetail(parent));
      detail.append(breadcrumb);
    }

    const title = htmlEl("h2", "pf-detail-title");
    title.textContent = rowLabel(row);
    detail.append(title);

    const center = yearMap.get("S13.GASTO");
    const resources = yearMap.get("S13.RECURSOS");
    const referenceTotal = row.side.startsWith("ingreso")
      ? resources?.value || row.value
      : center?.value || row.value;

    const meta = htmlEl("div", "pf-detail-meta");
    const percentage = row.code === "S13.GASTO"
      ? "100 % del gasto"
      : row.code === "S13.RECURSOS"
        ? "100 % de los recursos"
        : `${formatPct(row.value, referenceTotal)} del ${row.side.startsWith("ingreso") ? "total de recursos" : "gasto público"}`;

    const localShare = parent && !["S13.GASTO", "S13.RECURSOS"].includes(parent.code)
      ? ` · ${formatPct(row.value, parent.value)} de ${rowLabel(parent)}`
      : "";
    meta.innerHTML = `<b>${formatMillions(row.value)}</b> · ${percentage}${localShare}`;
    detail.append(meta);

    const childRows = detailRowsFor(row);
    if (childRows.length) {
      const subtitle = htmlEl("h3", "pf-detail-subtitle");
      subtitle.textContent = "Desglose oficial disponible";
      detail.append(subtitle, table(childRows, row.value));
    }

    if (row.code === "10") {
      const analyticCuts = children("10", {includeAnalytic: true}).filter(d => d.is_analytic_cut);
      if (analyticCuts.length) {
        const subtitle = htmlEl("h3", "pf-detail-subtitle");
        subtitle.textContent = "Cortes analíticos relacionados";
        detail.append(subtitle, table(analyticCuts, row.value));
      }
    }

    const taxRows = taxRowsFor(row);
    if (taxRows.length) {
      const subtitle = htmlEl("h3", "pf-detail-subtitle");
      subtitle.textContent = "Figuras tributarias destacadas";
      const note = htmlEl("div", "pf-note caution");
      note.textContent = "Listado informativo y no exhaustivo. Estas cifras no deben sumarse entre sí para reconstruir el total nacional S.13; se retirará este puente cuando se ingiera el XLSX anual de IGAE con el detalle completo por figura tributaria.";
      detail.append(subtitle, note, table(taxRows, null, {tax: true}));
    }

    const noteText = text(row.notes);
    if (noteText) {
      const note = htmlEl("div", row.is_vintage_adjustment ? "pf-note caution" : "pf-note");
      note.textContent = noteText;
      detail.append(note);
    }

    if (row.definition) {
      const definition = htmlEl("div", "pf-note");
      definition.innerHTML = `<b>Definición:</b> ${text(row.definition)}`;
      detail.append(definition);
    }

    const src = sourceFor(row, sourceMap);
    const sourceBlock = htmlEl("div", "pf-source");
    const sourcePrefix = src.organization ? `${src.organization} · ` : "";
    sourceBlock.append(document.createTextNode(`Fuente: ${sourcePrefix}${src.name}`));
    if (src.url && /^https?:\/\//i.test(src.url)) {
      sourceBlock.append(document.createTextNode(" · "));
      const a = document.createElement("a");
      a.href = src.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = "abrir fuente oficial";
      sourceBlock.append(a);
    }
    if (src.vintage) {
      sourceBlock.append(document.createElement("br"));
      sourceBlock.append(document.createTextNode(`Vintage / fecha: ${src.vintage}`));
    }
    detail.append(sourceBlock);

    // El Sankey es contabilidad nacional por finalidad (COFOG), no un
    // reparto presupuestario por ministerios o por comunidades autónomas.
    // El enlace transmite sólo código/año, nunca importes o atribuciones.
    if (row.side === "gasto" || row.code === "S13.GASTO") {
      const links = htmlEl("section", "pf-detail-bridge");
      const bridgeTitle = htmlEl("h3", "pf-detail-subtitle");
      bridgeTitle.textContent = "Investigar partidas y administraciones";
      const bridgeNote = htmlEl("p", "pf-note");
      bridgeNote.textContent = "El gasto COFOG clasifica finalidades, no ministerios, comunidades autónomas ni proyectos. Los portales siguientes tienen ámbitos y criterios distintos; sus importes no se suman a los del gráfico.";
      links.append(bridgeTitle, bridgeNote);
      appendFurtherInvestigation(links, row, childRows.length > 0);

      const actions = htmlEl("div", "pf-detail-actions pf-investigation-actions");
      const search = document.createElement("a");
      const finderUrl = new URL("buscador-partidas.html", window.location.href);
      if (/^\d{2}(?:\.\d+)?$/.test(String(row.code))) {
        finderUrl.searchParams.set("cofog", String(row.code));
        finderUrl.searchParams.set("anio", String(currentYear));
      }
      search.href = finderUrl.href;
      search.textContent = "Ver partidas de esta función";
      search.setAttribute("aria-label", "Ver partidas COFOG de " + rowLabel(row) + " en el buscador");
      actions.append(search);

      if (row.code === "04" || row.code === "04.5") {
        const transport = document.createElement("a");
        const u = new URL("buscador-partidas.html", window.location.href);
        u.searchParams.set("cofog", "04.5");
        u.searchParams.set("anio", String(currentYear));
        transport.href = u.href;
        transport.textContent = "Transporte · COFOG 04.5";
        actions.append(transport);
        const railway = document.createElement("a");
        const u2 = new URL("buscador-partidas.html", window.location.href);
        u2.searchParams.set("q", "ferrocarril");
        railway.href = u2.href;
        railway.textContent = "Buscar proyectos ferroviarios";
        actions.append(railway);
        // 453C es un programa del PGE estatal, NO un subnivel numérico COFOG.
        // Se enlaza con búsqueda libre para evitar aplicar un filtro COFOG
        // que excluiría los programas presupuestarios.
        const roadMaintenance = document.createElement("a");
        const roadUrl = new URL("buscador-partidas.html", window.location.href);
        roadUrl.searchParams.set("q", "mantenimiento de carreteras");
        roadMaintenance.href = roadUrl.href;
        roadMaintenance.textContent = "Mantenimiento de carreteras · 453C";
        roadMaintenance.setAttribute("aria-label", "Consultar presupuesto estatal de conservación de carreteras, programa 453C");
        actions.append(roadMaintenance);
      }
      links.append(actions);
      const guide = htmlEl("p", "pf-note");
      guide.textContent = "Para identificar ministerio, territorio o inversión ejecutada, consulta en el buscador las rutas oficiales de presupuesto estatal, COFOG regional, liquidaciones autonómicas y observatorio ferroviario.";
      links.append(guide);
      detail.append(links);
    }
  }

  function openMethodology() {
    document.dispatchEvent(new CustomEvent("idealab:analytics", {
      detail: {name: "sankey_metodologia"}
    }));
    const map = rowMapForYear();
    const gasto = map.get("S13.GASTO");
    const recursos = map.get("S13.RECURSOS");
    const deficit = map.get("S13.DEFICIT");
    const adjustment = map.get("ADJ.VINTAGE.2024") || rowsForYear().find(d => d.is_vintage_adjustment);

    resetInlineSankey();
    root.classList.add("is-detail-open");
    currentRow = null;
    detail.replaceChildren();

    const title = htmlEl("h2", "pf-detail-title");
    title.textContent = "Metodología y trazabilidad";
    detail.append(title);

    const blocks = [
      recursos && `Recursos vigentes: ${formatMillions(recursos.value)}.`,
      deficit && `Necesidad de financiación / déficit: ${formatMillions(deficit.value)}.`,
      gasto && `Gasto consolidado: ${formatMillions(gasto.value)}.`,
      gasto && recursos && deficit
        ? `Control: recursos + déficit = ${formatMillions(recursos.value + deficit.value)}; gasto = ${formatMillions(gasto.value)}.`
        : "",
      adjustment
        ? `Existe un ajuste técnico de vintage de ${formatMillions(adjustment.value)}. No es un ingreso económico; hace explícita la diferencia entre la vintage del detalle de ingresos y el total vigente de IGAE.`
        : ""
    ].filter(Boolean);

    for (const value of blocks) {
      const note = htmlEl("div", value.includes("ajuste técnico") ? "pf-note caution" : "pf-note");
      note.textContent = value;
      detail.append(note);
    }

    const sourcesTitle = htmlEl("h3", "pf-detail-subtitle");
    sourcesTitle.textContent = "Fuentes oficiales utilizadas";
    detail.append(sourcesTitle);

    const list = document.createElement("ul");
    list.className = "pf-source";
    const usedSourceIds = [...new Set(rowsForYear().map(d => d.source_id).filter(Boolean))];
    for (const sourceId of usedSourceIds) {
      const source = sourceMap.get(sourceId);
      if (!source) continue;
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.textContent = `${source.organization ? `${source.organization} · ` : ""}${source.title || sourceId}`;
      a.href = source.url || "#";
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      li.append(a);
      if (source.vintage_or_date) {
        li.append(document.createTextNode(` — ${source.vintage_or_date}`));
      }
      list.append(li);
    }
    detail.append(list);
  }

  function addNode(svg, row, x, y, width, height, className, denominator, suffix = "") {
    const group = svgEl("g", {class: `pf-node-group ${className}`, "data-code": row.code});
    group.setAttribute("tabindex", "0");
    group.setAttribute("role", "button");
    group.setAttribute("aria-label", `${rowLabel(row)}: ${formatMillions(row.value)}`);
    group.addEventListener("click", () => openDetail(row));
    group.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") openDetail(row);
    });

    const rect = svgEl("rect", {
      x, y, width, height, rx: 8, class: "pf-node-box"
    });
    group.append(rect);

    const displayLabel = row.is_vintage_adjustment
      ? "Ajuste técnico de conciliación"
      : rowLabel(row);
    const lines = wrapText(displayLabel, width >= 350 ? 42 : 31, 2);
    lines.forEach((line, index) => {
      const label = svgEl("text", {
        x: x + 12,
        y: y + 20 + index * 15,
        class: "pf-node-label"
      });
      label.textContent = line;
      group.append(label);
    });

    const valueText = svgEl("text", {
      x: x + width - 12,
      y: y + height - 9,
      "text-anchor": "end",
      class: "pf-node-value"
    });
    valueText.textContent = `${formatCompactMillions(row.value)} · ${formatPct(row.value, denominator)}${suffix ? ` ${suffix}` : ""}`;
    group.append(valueText);
    svg.append(group);
  }

  function addLink(svg, row, sx, sy, tx, ty, width, className) {
    const path = svgEl("path", {
      d: makeRibbon(sx, sy, tx, ty, width),
      class: `pf-link ${className}`
    });
    path.addEventListener("click", () => openDetail(row));
    const title = svgEl("title");
    title.textContent = `${rowLabel(row)} · ${formatMillions(row.value)}`;
    path.append(title);
    svg.append(path);
  }

  function renderChart() {
    chart.replaceChildren();
    const rows = rowsForYear();
    const byCode = rowMapForYear();
    const gasto = byCode.get("S13.GASTO");
    const recursos = byCode.get("S13.RECURSOS");
    const deficit = byCode.get("S13.DEFICIT");

    if (!gasto || !recursos || !deficit) {
      const empty = htmlEl("div", "pf-empty");
      empty.textContent = `El ejercicio ${currentYear} todavía no contiene el cierre completo necesario para dibujar el Sankey (recursos, déficit y gasto).`;
      chart.append(empty);
      badge.textContent = `${currentYear} · datos incompletos`;
      return;
    }

    const incomeRows = rows
      .filter(d => d.parent_code === "S13.RECURSOS" && d.side === "ingreso")
      .sort((a, b) => b.value - a.value);
    const expenseRows = rows
      .filter(d => d.parent_code === "S13.GASTO" && d.side === "gasto")
      .filter(d => d.level === "1")
      .sort((a, b) => a.code.localeCompare(b.code, "es", {numeric: true}));

    if (!expenseRows.length) {
      const empty = htmlEl("div", "pf-empty");
      empty.textContent = `El ejercicio ${currentYear} dispone de totales, pero aún no tiene desglose COFOG de nivel 1. Se mostrará cuando IGAE publique y se ingiera el detalle funcional.`;
      chart.append(empty);
      badge.textContent = `${currentYear} · pendiente COFOG`;
      return;
    }

    // Tres columnas en la vista principal. El detalle vive en el panel interactivo
    // para que el gráfico sea legible y no se recorte en pantallas de escritorio/PDF.
    const W = 1320;
    const H = 760;
    const leftX = 22;
    const leftW = 355;
    const centerX = 555;
    const centerW = 210;
    const rightX = 900;
    const rightW = 390;
    const boxH = 56;

    const svg = svgEl("svg", {
      viewBox: `0 0 ${W} ${H}`,
      role: "img",
      "aria-label": `Mapa del dinero público en España ${currentYear}`
    });

    const titles = [
      [leftX, "DE DÓNDE SALE"],
      [centerX, "FONDO COMÚN"],
      [rightX, "EN QUÉ SE GASTA"]
    ];
    for (const [x, label] of titles) {
      const t = svgEl("text", {x, y: 24, class: "pf-col-title"});
      t.textContent = label;
      svg.append(t);
    }

    const leftItems = [...incomeRows, deficit];
    const leftY0 = 48;
    const leftGap = 15;
    const leftPos = new Map(
      leftItems.map((row, index) => [row.code, leftY0 + index * (boxH + leftGap)])
    );

    const rightGap = 16;
    const rightY0 = 42;
    const rightPos = new Map(
      expenseRows.map((row, index) => [row.code, rightY0 + index * (boxH + rightGap)])
    );

    // Una única escala de grosor para ambos lados. Así 1 M€ ocupa exactamente
    // el mismo ancho visual tanto en ingresos como en gasto.
    const centerY = 255;
    const centerH = 235;
    const maxRibbonWidth = 54;
    const maxFlow = Math.max(
      ...leftItems.map(d => d.value),
      ...expenseRows.map(d => d.value),
      1
    );
    const flowScale = maxRibbonWidth / maxFlow;
    const portTop = centerY + 8;
    const portHeight = centerH - 16;
    const inPorts = stackPorts(leftItems, flowScale, portTop, portHeight);
    const outPorts = stackPorts(expenseRows, flowScale, portTop, portHeight);

    // Ribbons are appended before nodes so boxes remain legible and clickable.
    for (const row of leftItems) {
      const sourceY = leftPos.get(row.code) + boxH / 2;
      const port = inPorts.get(row.code);
      const className = row.code === "S13.DEFICIT"
        ? "pf-deficit-link"
        : row.is_vintage_adjustment
          ? "pf-adjust-link"
          : "pf-income-link";
      addLink(
        svg,
        row,
        leftX + leftW,
        sourceY,
        centerX,
        port.center,
        port.width,
        className
      );
    }

    for (const row of expenseRows) {
      const port = outPorts.get(row.code);
      const targetY = rightPos.get(row.code) + boxH / 2;
      addLink(
        svg,
        row,
        centerX + centerW,
        port.center,
        rightX,
        targetY,
        port.width,
        "pf-spend-link"
      );
    }

    // Los cortes analíticos (por ejemplo, Pensiones) se muestran al pulsar
    // Protección social en el panel de detalle, no como cuarta columna.

    // Left nodes.
    for (const row of incomeRows) {
      const nodeClass = row.is_vintage_adjustment ? "pf-adjust" : "pf-income";
      addNode(svg, row, leftX, leftPos.get(row.code), leftW, boxH, nodeClass, recursos.value, "ingresos");
    }
    addNode(svg, deficit, leftX, leftPos.get(deficit.code), leftW, boxH, "pf-deficit", gasto.value, "gasto");

    // Center.
    const centerGroup = svgEl("g", {class: "pf-node-group"});
    centerGroup.setAttribute("tabindex", "0");
    centerGroup.setAttribute("role", "button");
    centerGroup.addEventListener("click", () => openDetail(gasto));
    centerGroup.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") openDetail(gasto);
    });
    centerGroup.append(svgEl("rect", {
      x: centerX,
      y: centerY,
      width: centerW,
      height: centerH,
      rx: 10,
      class: "pf-center-box"
    }));
    const centerLabel = svgEl("text", {x: centerX + 18, y: centerY + 36, class: "pf-center-label"});
    centerLabel.textContent = "Administraciones";
    const centerLabel2 = svgEl("text", {x: centerX + 18, y: centerY + 60, class: "pf-center-label"});
    centerLabel2.textContent = "Públicas (S.13)";
    const centerValue = svgEl("text", {x: centerX + 18, y: centerY + 105, class: "pf-center-value"});
    centerValue.textContent = formatCompactMillions(gasto.value);
    const centerSub1 = svgEl("text", {x: centerX + 18, y: centerY + 138, class: "pf-center-sub"});
    centerSub1.textContent = `Recursos: ${formatCompactMillions(recursos.value)}`;
    const centerSub2 = svgEl("text", {x: centerX + 18, y: centerY + 160, class: "pf-center-sub"});
    centerSub2.textContent = `Déficit: ${formatCompactMillions(deficit.value)}`;
    const centerSub3 = svgEl("text", {x: centerX + 18, y: centerY + 182, class: "pf-center-sub"});
    centerSub3.textContent = `Gasto: ${formatCompactMillions(gasto.value)}`;
    const centerSub4 = svgEl("text", {x: centerX + 18, y: centerY + 212, class: "pf-center-sub"});
    centerSub4.textContent = "Clic para ver desglose y fuentes";
    centerGroup.append(centerLabel, centerLabel2, centerValue, centerSub1, centerSub2, centerSub3, centerSub4);
    svg.append(centerGroup);

    // Expense nodes.
    for (const row of expenseRows) {
      addNode(svg, row, rightX, rightPos.get(row.code), rightW, boxH, "pf-spend", gasto.value, "gasto");
    }


    chart.append(svg);

    badge.textContent = `${currentYear} · ${expenseRows.length} funciones COFOG`;
    const hasAdjustment = incomeRows.some(d => d.is_vintage_adjustment);
    footnote.innerHTML = `<b>Interacción.</b> Pulsa un nodo o una rama para consultar el desglose, porcentaje, metodología y fuente oficial.${hasAdjustment ? " La pequeña rama de ajuste estadístico es técnica y no representa un ingreso económico." : ""}`;
  }

  const closeDrawer = () => {
    root.classList.remove("is-detail-open");
    if(chart.classList.contains("is-expanded"))resetInlineSankey();
  };
  closeButton.addEventListener("click", closeDrawer);
  backdrop.addEventListener("click", closeDrawer);
  methodologyButton.addEventListener("click", openMethodology);
  mobileMethodologyButton.addEventListener("click", () => { mobileTools.open = false; openMethodology(); });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && root.classList.contains("is-detail-open")) {
      root.classList.remove("is-detail-open");
    }
  });

  yearSelect.addEventListener("change", () => {
    document.dispatchEvent(new CustomEvent("idealab:analytics", {
      detail: {name: "sankey_cambio_anio"}
    }));
    currentYear = Number(yearSelect.value);
    root.classList.remove("is-detail-open");
    resetInlineSankey();
    currentRow = null;
    renderChart();
  });

  renderChart();
  // Deep-link reproducible para QA y para compartir una subfunción concreta.
  // Nunca se abre si el código no figura en los datos del ejercicio vigente.
  const deepCode = new URLSearchParams(window.location.search).get("detalle-cofog");
  if (deepCode && /^\d{2}(?:\.\d+)?$/.test(deepCode)) {
    const selected = rowMapForYear().get(deepCode);
    if (selected?.side === "gasto") openDetail(selected);
  }
  return root;
}
