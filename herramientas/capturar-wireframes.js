// Captura los bocetos de docs/interfaz/wireframes.html como imágenes PNG y
// comprueba las medidas que promete la propuesta de interfaz (F3.1).
//
// Uso, desde la carpeta del proyecto:
//     node herramientas/capturar-wireframes.js
//
// Necesita Node y Playwright con Chromium. Es una herramienta de desarrollo:
// la app no la usa. Escribe docs/interfaz/<grupo>.png y falla si en algún
// boceto en horizontal una cuerda mide menos de 40 px (criterio de F3.2) o
// si algún marco se desborda (algo no cabe en la pantalla que representa).
'use strict';
const path = require('path');
const { chromium } = require('playwright');

const RAIZ = path.resolve(__dirname, '..');
const PAGINA = 'file://' + path.join(RAIZ, 'docs', 'interfaz', 'wireframes.html');
const GRUPOS = ['vertical-1', 'vertical-2', 'horizontal', 'escritorio'];
const MIN_CUERDA = 40;

(async () => {
  const navegador = await chromium.launch();
  const pagina = await navegador.newPage({ viewport: { width: 1800, height: 1200 }, deviceScaleFactor: 1.5 });
  await pagina.goto(PAGINA);
  await pagina.waitForTimeout(300);
  let fallos = 0;

  // 1. Alto de cuerda y ancho de traste en los bocetos en horizontal.
  const medidas = await pagina.$$eval('[data-cuerda]', els => els.map(e => ({
    marco: e.closest('div:not(.frame) > .frame').previousElementSibling.textContent,
    cuerda: +e.dataset.cuerda, traste: +e.dataset.traste })));
  for (const m of medidas) {
    const ok = m.cuerda >= MIN_CUERDA;
    if (!ok) fallos++;
    console.log(`${ok ? 'ok   ' : 'FALLO'} ${m.marco}: cuerda ${m.cuerda} px, traste ${m.traste} px`);
  }
  if (medidas.length === 0) { console.log('FALLO no hay bocetos con medida'); fallos++; }

  // 2. Nada se sale de su marco: el contenido cabe en la pantalla que representa.
  const desbordes = await pagina.$$eval('.frame', els => els.flatMap(f => {
    const r = f.getBoundingClientRect(), out = [];
    f.querySelectorAll('.row, .board, .tabbar, .rail, .side, .strs, .gauge, .btn, .sheet .sr').forEach(e => {
      const b = e.getBoundingClientRect();
      if (b.bottom > r.bottom + 1 || b.right > r.right + 1 || e.scrollWidth > e.clientWidth + 1)
        out.push(f.previousElementSibling.textContent + ' → ' + e.className);
    });
    return out;
  }));
  for (const d of desbordes) { console.log('FALLO desborde: ' + d); fallos++; }

  // 3. Imágenes.
  for (const g of GRUPOS) {
    const destino = path.join(RAIZ, 'docs', 'interfaz', g + '.png');
    await pagina.locator('#g-' + g).screenshot({ path: destino });
    console.log('imagen: docs/interfaz/' + g + '.png');
  }
  await navegador.close();
  console.log(fallos ? `${fallos} fallo(s)` : 'Todo correcto');
  process.exit(fallos ? 1 : 0);
})();
