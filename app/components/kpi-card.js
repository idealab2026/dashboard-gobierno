import * as Plot from "npm:@observablehq/plot";
import * as htl from "npm:htl";

export function KpiCard(data, options = {}) {
  const {
    indicatorId,
    title = indicatorId,
    formatValue = value => String(value),
    unitLabel = "",
    isPercentage = false,
    comparisonMode = "auto"
  } = options;

  const candidates = data
    .filter(d =>
      d.indicator_id === indicatorId &&
      (!d.geo_name || d.geo_name === "España") &&
      Number.isFinite(Number(d.year)) &&
      Number.isFinite(Number(d.value))
    )
    .map(d => ({
      ...d,
      year: Number(d.year),
      value: Number(d.value)
    }));

  // A KPI card must have one unambiguous national value per year.
  // If the data lake contains several different values under the same
  // indicator/year/geography (for example, a lost territorial dimension),
  // that year is excluded instead of choosing one row arbitrarily.
  const byYear = new Map();
  for (const row of candidates) {
    if (!byYear.has(row.year)) byYear.set(row.year, []);
    byYear.get(row.year).push(row);
  }

  const rows = [...byYear.entries()]
    .map(([year, yearRows]) => {
      const distinctValues = [...new Set(yearRows.map(d => d.value))];
      return distinctValues.length === 1 ? yearRows[0] : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.year - b.year);

  const hasAmbiguousYears = [...byYear.values()].some(yearRows =>
    new Set(yearRows.map(d => d.value)).size > 1
  );

  if (!rows.length) {
    return htl.html`
      <article class="kpi-card">
        <div class="kpi-title">${title}</div>
        <div class="kpi-empty">${hasAmbiguousYears
          ? "En revisión · desagregación sin identificar"
          : "Dato no disponible"}</div>
      </article>
    `;
  }

  const latest = rows[rows.length - 1];
  const previous =
    rows.length > 1 ? rows[rows.length - 2] : null;

  let arrow = "•";
  let diffText = "Sin comparación anterior";

  if (previous) {
    const diff = latest.value - previous.value;

    arrow =
      diff > 0 ? "▲" :
        diff < 0 ? "▼" :
          "●";

    if (comparisonMode === "rank") {
      // En un ranking, un número menor implica una mejor posición.
      arrow = diff < 0 ? "▲" : diff > 0 ? "▼" : "●";
      const places = Math.abs(Math.round(diff));
      diffText = places === 0
        ? `Sin cambios vs ${previous.year}`
        : `${places} ${places === 1 ? "puesto" : "puestos"} vs ${previous.year}`;
    } else if (isPercentage) {
      diffText =
        `${Math.abs(diff).toLocaleString("es-ES", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1
        })} pp vs ${previous.year}`;
    } else {
      const diffPct =
        previous.value !== 0
          ? (diff / previous.value) * 100
          : 0;

      diffText =
        `${Math.abs(diffPct).toLocaleString("es-ES", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1
        })} % vs ${previous.year}`;
    }
  }

  const sparkline = Plot.plot({
    width: 280,
    height: 64,
    axis: null,
    marginTop: 6,
    marginRight: 4,
    marginBottom: 4,
    marginLeft: 4,

    marks: [
      Plot.lineY(rows, {
        x: "year",
        y: "value",
        stroke: "currentColor",
        strokeWidth: 2
      }),

      Plot.dot([latest], {
        x: "year",
        y: "value",
        fill: "currentColor",
        r: 3.5
      })
    ]
  });

  const firstYear = rows[0].year;
  const referencePeriod = String(latest.reference_period || latest.year);
  const periodLabel = /^\\d{4}-\\d{2}(-\\d{2})?$/.test(referencePeriod)
    ? referencePeriod
    : String(latest.year);
  const hasHistory = rows.length > 1;

  const source =
    latest.source ||
    "Fuente no disponible";

  const sourceUrlRaw =
    String(latest.source_url || "");

  const sourceUrl =
    sourceUrlRaw
      .split("|")[0]
      .trim();

  const hasSourceUrl =
    /^https?:\/\//i.test(sourceUrl);

  const status =
    latest.status || "";

  const definition =
    latest.definition || "";

  return htl.html`
    <article class="kpi-card">

      <div class="kpi-card-top">
        <div class="kpi-title">${title}</div>

        <div class="kpi-year">
          ${periodLabel}
        </div>
      </div>

      <div class="kpi-value-block">

        <div class="kpi-value">
          ${formatValue(latest.value)}
        </div>

        ${unitLabel
      ? htl.html`
                <div class="kpi-unit">
                  ${unitLabel}
                </div>
              `
      : ""
    }

      </div>

      ${hasHistory ? htl.html`<div class="kpi-diff"><span class="kpi-arrow">${arrow}</span>${diffText}</div>` : ""}

      ${hasHistory ? htl.html`<div class="kpi-spark">${sparkline}</div>` : ""}

      ${hasHistory ? htl.html`<div class="kpi-years"><span>${firstYear}</span><span>${latest.year}</span></div>` : htl.html`<div class="kpi-years"><span>Observación puntual</span><span>${periodLabel}</span></div>`}

      <div class="kpi-source">

        <span>Fuente · </span>

        ${hasSourceUrl
      ? htl.html`
                <a
                  href=${sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ${source}
                </a>
              `
      : source
    }

      </div>

      ${definition || status
      ? htl.html`
              <details class="kpi-details">

                <summary>
                  Metodología
                </summary>

                <div class="kpi-details-body">

                  ${status
          ? htl.html`
                          <div>
                            <strong>Estado:</strong>
                            ${status}
                          </div>
                        `
          : ""
        }

                  ${definition
          ? htl.html`
                          <div>
                            <strong>Definición:</strong>
                            ${definition}
                          </div>
                        `
          : ""
        }

                </div>

              </details>
            `
      : ""
    }

    </article>
  `;
}