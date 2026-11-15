// IDEA LAB · Títulos principales de una sola línea.
// Ajusta tipografía según espacio disponible. No altera títulos de tarjetas
// ni las etiquetas de los gráficos. Se activa en todas las páginas públicas.
const TITLE_SELECTOR = [
  ".il-compact-intro h1",
  "#mapa-dinero .il-spotlight-top h2",
  ".section-header h2",
  ".il-quick-spending h2",
  ".metric-group-title",
  ".pf-hero h1",
  ".pf-section-heading h2",
  ".il-admin-intro h1",
  ".il-finder-hero h1",
  ".il-visual-intro h1",
  ".il-gallery-intro h1",
  ".il-29n-hero h1",
  ".il-29n-section-title",
  ".il-about h1",
  ".il-about section > h2",
  "#observablehq-main > h1",
  "#observablehq-main > h2",
  "#observablehq-main > h3"
].join(",");

export function enableOneLineHeadings() {
  if (typeof document === "undefined" || typeof window === "undefined") return () => {};
  let scheduled = false;
  const fit = (heading) => {
    if (heading.getClientRects().length === 0) return;
    // Remove previous fit so a wider window restores the intended font size.
    heading.style.removeProperty("font-size");
    const computed = window.getComputedStyle(heading);
    if (computed.display === "none") return;
    const initialSize = Number.parseFloat(computed.fontSize);
    const available = heading.clientWidth;
    const naturalWidth = heading.scrollWidth;
    if (!Number.isFinite(initialSize) || available <= 0 || naturalWidth <= available + 1) return;
    // Headings remain on one line. Preserve readability as far as viewport allows.
    const lowerBound = window.innerWidth < 500 ? 11 : 12;
    let size = Math.max(lowerBound, Math.floor(initialSize * available / naturalWidth * 0.975));
    heading.style.setProperty("font-size", size + "px", "important");
    while (heading.scrollWidth > available + 1 && size > lowerBound) {
      size -= 0.5;
      heading.style.setProperty("font-size", size + "px", "important");
    }
  };
  const update = () => {
    scheduled = false;
    document.querySelectorAll(TITLE_SELECTOR).forEach(fit);
  };
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(update);
  };
  // Observable pages can render charts and headings asynchronously.
  const observer = new MutationObserver(records => {
    if (records.some(record => record.type === "childList")) schedule();
  });
  observer.observe(document.body, {childList:true, subtree:true});
  window.addEventListener("resize", schedule, {passive:true});
  if (document.fonts?.ready) document.fonts.ready.then(schedule);
  schedule();
  return () => {
    observer.disconnect();
    window.removeEventListener("resize",schedule);
  };
}
