/**
 * Clasificación oficial COFOG y lenguaje habitual del lector.
 * No inferimos que exista un contrato, pago, beneficiario o vínculo presupuestario
 * por compartir una palabra con un agregado estadístico.
 */
export const COFOG_ALIASES = Object.freeze({
  sanidad: "07", sanitario: "07", sanitaria: "07", sanitarios: "07", sanitarias: "07",
  salud: "07", hospital: "07.3", hospitales: "07.3", hospitalario: "07.3",
  hospitalaria: "07.3", hospitalarios: "07.3", hospitalarias: "07.3",
  ambulatorio: "07.2", ambulatoria: "07.2", ambulatorios: "07.2",
  ambulatorias: "07.2", farmacia: "07.1", farmacias: "07.1",
  medicamentos: "07.1", medicamento: "07.1", farmaceutico: "07.1",
  farmaceutica: "07.1",
  ferrocarril: "04.5", ferrocarriles: "04.5", ferroviario: "04.5",
  ferroviaria: "04.5", tren: "04.5", trenes: "04.5", transporte: "04.5",
  transportes: "04.5",
  educacion: "09", educativo: "09", educativa: "09", colegios: "09",
  colegio: "09", ensenanza: "09", escuelas: "09", escuela: "09",
  universidad: "09.4", universidades: "09.4",
  vivienda: "06", viviendas: "06",
  defensa: "02", militar: "02"
});
const STOP_WORDS = new Set([
  "de", "del", "la", "el", "los", "las", "en", "a", "al", "y", "o", "por",
  "para", "sobre", "con", "un", "una", "unos", "unas", "cuanto", "cuantos",
  "gasto", "gastos", "partida", "partidas", "importe", "importes", "euros",
  "inversion", "inversiones", "publico", "publica", "publicos", "publicas",
  "destinado", "destinados", "destinada", "se"
]);
export const normalizeSpending = value => String(value ?? "")
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

export function searchSpendingRecords(items, query, options = {}) {
  const q = normalizeSpending(query);
  const phraseHealthPublic = /\bsalud publica\b/.test(q);
  let terms = q.split(" ").filter(word => word && !STOP_WORDS.has(word));
  // «Atención sanitaria» es una expresión corriente para referirse al
  // conjunto de la función salud, no una fila de gasto llamada «atención».
  if (/\batencion sanitaria\b/.test(q)) terms = terms.filter(t=>t!=="atencion");
  // La expresión "salud pública" sí corresponde específicamente al grupo 07.4.
  if (phraseHealthPublic) terms = terms.filter(t => t !== "salud").concat(["saludpublica"]);
  const selectedCode = String(options.cofog || "");
  const selectedType = String(options.tipo || "");
  const selectedYear = String(options.anio || "");
  const selectedCountry = String(options.pais || "");
  const matches = [];
  for (const item of items) {
    const code = item.tipo === "agregado" ? String(item.cofog_codigo || "") : "";
    if (selectedCode && (!code || (code !== selectedCode && !code.startsWith(selectedCode + ".")))) continue;
    if (selectedType && item.tipo !== selectedType) continue;
    if (selectedYear && String(item.anio) !== selectedYear) continue;
    if (selectedCountry && item.pais !== selectedCountry) continue;
    const haystack = item._search || normalizeSpending([
      item.titulo, item.pais, item.sector, item.entidad, item.organismo,
      item.descripcion, item.id, item.trazabilidad, item.clasificacion, item.anio
    ].join(" "));
    let synonymHits = 0, directHits = 0;
    const matchesAll = terms.every(term => {
      const alias = term === "saludpublica" ? "07.4" : COFOG_ALIASES[term];
      const direct = term !== "saludpublica" && haystack.includes(term);
      const aliasHit = !!code && !!alias &&
        (code === alias || code.startsWith(alias + "."));
      if (direct) directHits += 1;
      if (aliasHit) synonymHits += 1;
      return direct || aliasHit;
    });
    if (!matchesAll) continue;
    // Precisión antes que cantidad: sin país, palabra o concepto verificado
    // no se debe mostrar un agregado nacional como proyecto de otra región.
    const codeDepth = code.split(".").length - 1;
    const relevance = terms.length
      ? (directHits * 25) + (synonymHits * 20)
        + (item.tipo === "agregado" ? 120 - codeDepth * 13 : 15)
      : (item.tipo === "agregado" ? 120 - codeDepth * 13 : 300);
    matches.push({
      ...item,
      _matchKind: terms.length && synonymHits ? "cofog-alias" : "literal",
      _score: relevance
    });
  }
  matches.sort((a,b) => b._score-a._score ||
    b.anio-a.anio || a.titulo.localeCompare(b.titulo,"es"));
  return matches;
}
