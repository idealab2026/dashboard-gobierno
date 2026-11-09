import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

/* Regression: Administraciones and Buscar partidas originally rendered
 * the mobile <details> at desktop widths, alongside the desktop links.
 * The mobile panel must be hidden when closed and must not auto-open on hover. */
for (const file of ["administraciones","buscador-partidas"]) {
  const source=readFileSync(new URL(`../../app/${file}.md`,import.meta.url),"utf8");

  test(`${file}: desktop cannot show mobile header over navigation`,()=>{
    assert.match(source,/\.idealab-nav \.idealab-nav-mobile,\s*\.idealab-nav \.idealab-nav-mobile > \.idealab-nav-mobile-panel\s*\{\s*display:none!important;/);
    assert.match(source,/@media \(max-width:1279px\)/);
    assert.match(source,/\.idealab-nav \.idealab-nav-links\s*\{display:none!important;\}/);
    assert.match(source,/\.idealab-nav \.idealab-nav-mobile\s*\{\s*display:block!important;/);
    assert.match(source,/\.idealab-nav \.idealab-nav-mobile\[open\] > \.idealab-nav-mobile-panel\s*\{display:grid!important;\}/);
    assert.match(source,/\.idealab-nav \.idealab-nav-mobile > \.idealab-nav-mobile-panel\s*\{\s*display:none!important;/);
  });
  test(`${file}: links do not collide with logo and panel stays below header`,()=>{
    assert.match(source,/max-width:calc\(100% - 99px\)!important/);
    assert.match(source,/text-overflow:ellipsis!important/);
    assert.match(source,/top:calc\(100% \+ 9px\)!important/);
    assert.match(source,/max-width:calc\(100vw - 22px\)!important/);
    assert.match(source,/max-height:min\(72dvh,610px\)!important/);
    assert.match(source,/grid-template-columns:minmax\(0,1fr\)!important/);
  });
  test(`${file}: toggles on click, no hover-open and closes on outside / Escape`,()=>{
    assert.doesNotMatch(source,/compactNav\.addEventListener\("pointerenter"/);
    assert.match(source,/if \(event\.key === "Escape"\) financesMobileMenu\.open = false/);
    assert.match(source,/if \(!financesMobileMenu\.contains\(event\.target\)\) financesMobileMenu\.open = false/);
    assert.equal((source.match(/<nav class="idealab-nav"/g)||[]).length,1);
  });
}
