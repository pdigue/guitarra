// Comprueba la accesibilidad de la app en Chromium (F3.4, G-05).
//
// Uso, desde la carpeta del proyecto:
//     node herramientas/comprobar-accesibilidad.js
//
// Necesita Node y Playwright con Chromium. Es una herramienta de desarrollo:
// la app no la usa. Hace dos cosas y falla (código 1) si algo no se cumple:
//
// 1. Recorre la app SOLO CON TECLADO, como lo haría alguien sin ratón:
//    entra por la puerta con Intro, llega con el tabulador a las pestañas, a
//    los atajos, al zoom y al mástil; dentro del mástil se mueve con las
//    flechas y toca con Intro; abre Ajustes, comprueba que el foco no se
//    escapa del diálogo y lo cierra con Escape. Todo lo que recibe el foco
//    debe mostrarlo (contorno visible).
// 2. Mide el CONTRASTE de cada texto visible con su fondo real, en Libre con
//    «Ver todas las notas» y posiciones iguales, en Adivinar, en el Afinador y
//    con Ajustes abierto: 4,5:1, o 3:1 en texto grande (24 px, o 18,7 px en
//    negrita). Los controles desactivados no cuentan (WCAG 1.4.3).
// 3. Con el sistema en «reducir movimiento», la app no anima nada.
'use strict';
const path = require('path');
const { chromium } = require('playwright');
// La app sigue el idioma del navegador (G-12): por defecto se comprueba en español;
// con IDIOMA=en-US, en inglés.
const LOCALE = process.env.IDIOMA || 'es-ES';

const APP = 'file://' + path.resolve(path.resolve(__dirname, '..'), process.env.APP_HTML || 'index.html');
let fallos = 0;
const fallo = msg => { fallos++; console.log('FALLO ' + msg); };

// Se ejecuta dentro de la página: contraste de cada texto visible con su fondo.
function medirContraste(){
  const rgba = s => { const m = s.match(/[\d.]+/g).map(Number); return { r:m[0], g:m[1], b:m[2], a:m.length > 3 ? m[3] : 1 }; };
  const lum = c => { const f = x => { x /= 255; return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
  const mezcla = (arriba, abajo) => ({ r: arriba.r * arriba.a + abajo.r * (1 - arriba.a),
    g: arriba.g * arriba.a + abajo.g * (1 - arriba.a), b: arriba.b * arriba.a + abajo.b * (1 - arriba.a), a: 1 });
  const MADERA = { r:0x43, g:0x2c, b:0x16, a:1 };   // el tono más claro del degradado del mástil
  const FONDO = rgba(getComputedStyle(document.documentElement).getPropertyValue('--bg').trim().replace(/^#(..)(..)(..)$/,
    (_, r, g, b) => `rgb(${parseInt(r, 16)},${parseInt(g, 16)},${parseInt(b, 16)})`));
  // Fondo efectivo: se apilan los fondos de los antepasados de abajo arriba.
  const fondoDe = el => {
    const capas = [];
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage && cs.backgroundImage.includes('gradient') && n.id === 'board') { capas.push(MADERA); break; }
      const c = rgba(cs.backgroundColor);
      if (c.a > 0) { capas.push(c); if (c.a >= 1) break; }
    }
    return capas.reverse().reduce((abajo, arriba) => mezcla(arriba, abajo), FONDO);
  };
  const opacidad = el => { let o = 1; for (let n = el; n && n.nodeType === 1; n = n.parentElement) o *= parseFloat(getComputedStyle(n).opacity); return o; };
  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    const propio = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    if (!propio) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0 || r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) continue;
    if (el.closest('[hidden], .gate.hidden, .sheet:not(.open), [inert], :disabled, .tab:disabled, select')) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden') continue;
    const op = opacidad(el);
    if (op < 0.05) continue;          // invisible a propósito (los puntos sin pulsar)
    const fondo = fondoDe(el);
    const texto = rgba(cs.color); texto.a *= op;
    const t = mezcla(texto, fondo);
    const ratio = (Math.max(lum(t), lum(fondo)) + 0.05) / (Math.min(lum(t), lum(fondo)) + 0.05);
    const tam = parseFloat(cs.fontSize), negrita = parseInt(cs.fontWeight, 10) >= 700;
    const minimo = tam >= 24 || (negrita && tam >= 18.66) ? 3 : 4.5;
    if (ratio < minimo) out.push(`«${el.textContent.trim().slice(0, 24)}» (${el.className || el.tagName}) ${ratio.toFixed(2)}:1 < ${minimo}`);
  }
  return out;
}

(async () => {
  const navegador = await chromium.launch();
  const pagina = await navegador.newPage({ locale: LOCALE, viewport: { width: 1280, height: 720 } });
  await pagina.addInitScript(() => localStorage.setItem('trasteando.v1',
    JSON.stringify({ showAllNotes: true, showEquals: true })));
  await pagina.goto(APP);

  // ---------- 1. Solo con teclado ----------
  const foco = () => pagina.evaluate(() => {
    const e = document.activeElement; if (!e || e === document.body) return null;
    const cs = getComputedStyle(e);
    const marca = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0;
    return { id: e.id, cls: e.className, txt: (e.getAttribute('aria-label') || e.textContent).trim().slice(0, 30),
             marca, dentroAjustes: !!e.closest('#sheet'), celda: e.classList.contains('fret-cell') };
  });
  await pagina.keyboard.press('Tab');
  let f = await foco();
  if (!f || f.id !== 'gate-btn') fallo('el primer Tab no llega al botón «Empezar»');
  await pagina.keyboard.press('Enter');
  await pagina.waitForFunction(() => document.getElementById('gate').classList.contains('hidden'), null, { timeout: 5000 });

  const visitados = [];
  for (let i = 0; i < 25; i++) {
    await pagina.keyboard.press('Tab');
    await pagina.waitForTimeout(30);
    f = await foco();
    if (!f) continue;
    visitados.push(f.id || f.txt);
    if (!f.marca) fallo(`el foco no se ve en «${f.id || f.txt}»`);
    if (f.celda) break;
  }
  console.log('Recorrido con Tab: ' + visitados.join(' → '));
  // Un botón desactivado (el «−» del zoom con el mástil completo) no recibe el foco, y es lo correcto.
  const activos = await pagina.evaluate(() => ['zoom-out', 'zoom-in'].filter(id => !document.getElementById(id).disabled));
  for (const necesario of ['btn-settings', 'Libre', 'Adivinar', 'Afinador', 'qb-notation', 'qb-staff', ...activos])
    if (!visitados.some(v => v === necesario || v.startsWith(necesario))) fallo(`con el tabulador no se llega a «${necesario}»`);
  if (!f || !f.celda) fallo('con el tabulador no se llega al mástil');

  // Dentro del mástil: flechas e Intro.
  for (const k of ['ArrowRight', 'ArrowRight', 'ArrowRight', 'ArrowDown', 'Enter']) await pagina.keyboard.press(k);
  const tocada = await pagina.evaluate(() => ({ nota: document.getElementById('note-name').textContent,
    etiqueta: document.activeElement.getAttribute('aria-label') }));
  console.log(`Mástil con teclado: «${tocada.etiqueta}» → suena y se lee «${tocada.nota}»`);
  if (!/^Re4, 2ª cuerda, traste 3$/.test(tocada.etiqueta || '') || tocada.nota !== 'Re') fallo('las flechas e Intro no tocan la nota esperada (Re4)');
  // El tabulador sale del mástil de una vez, no casilla a casilla.
  await pagina.keyboard.press('Tab');
  f = await foco();
  if (f && f.celda) fallo('el tabulador se queda dentro del mástil');

  // Ajustes: el foco entra, no se escapa y vuelve al cerrar con Escape.
  await pagina.focus('#btn-settings');
  await pagina.keyboard.press('Enter');
  await pagina.waitForTimeout(350);
  let escapa = false;
  for (let i = 0; i < 30; i++) { await pagina.keyboard.press('Tab'); f = await foco(); if (f && !f.dentroAjustes) escapa = true; }
  if (escapa) fallo('con Ajustes abierto, el tabulador sale del diálogo');
  await pagina.keyboard.press('Escape');
  await pagina.waitForTimeout(350);
  f = await foco();
  const cerrado = await pagina.evaluate(() => !document.getElementById('sheet').classList.contains('open'));
  if (!cerrado || !f || f.id !== 'btn-settings') fallo('Escape no cierra Ajustes o el foco no vuelve a su botón');
  console.log(`Ajustes con teclado: el foco ${escapa ? 'se escapa' : 'no se escapa'}; Escape lo cierra y el foco vuelve a «${f && f.id}»`);

  // ---------- 2. Contraste ----------
  const escenas = [
    ['Libre, con todas las notas y una pulsada', async () => {
      await pagina.click('.fret-cell[data-row="3"][data-fret="5"]');
      await pagina.waitForTimeout(250);
    }],
    ['Adivinar', async () => { await pagina.click('.tab[data-screen="guess"]'); await pagina.waitForTimeout(700); }],
    ['Afinador', async () => { await pagina.click('.tab[data-screen="tuner"]'); await pagina.waitForTimeout(250); }],
    ['Metrónomo, sonando', async () => { await pagina.click('.tab[data-screen="metro"]'); await pagina.click('#metro-play'); await pagina.waitForTimeout(400); }],
    ['Ajustes abierto', async () => { await pagina.click('#metro-play');
      await pagina.click('#btn-settings'); await pagina.waitForTimeout(400); }],
  ];
  for (const [nombre, preparar] of escenas) {
    await preparar();
    const malos = await pagina.evaluate(medirContraste);
    console.log(`Contraste, ${nombre}: ${malos.length ? malos.length + ' textos por debajo' : 'todo ≥ 4,5:1 (3:1 en texto grande)'}`);
    malos.forEach(m => fallo(`${nombre}: ${m}`));
  }

  // ---------- 3. Movimiento reducido ----------
  const quieta = await navegador.newPage({ locale: LOCALE, viewport: { width: 1280, height: 720 }, reducedMotion: 'reduce' });
  await quieta.goto(APP);
  const mov = await quieta.evaluate(() => [...document.querySelectorAll('.dot, .sheet, .display, .chip')].slice(0, 40)
    .filter(e => getComputedStyle(e).transitionDuration.split(',').some(d => parseFloat(d) > 0) ||
                 getComputedStyle(e).animationName !== 'none').length);
  console.log(`Movimiento reducido: ${mov ? mov + ' elementos siguen animándose' : 'nada se anima'}`);
  if (mov) fallo('con «reducir movimiento» hay elementos que se animan');

  await navegador.close();
  console.log(fallos ? `${fallos} fallo(s)` : 'Todo correcto');
  process.exit(fallos ? 1 : 0);
})();
