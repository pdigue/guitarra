// Comprueba la disposición de la app en las pantallas de referencia (F3.2) y
// guarda una captura de cada una.
//
// Uso, desde la carpeta del proyecto:
//     node herramientas/comprobar-disposicion.js [carpeta-de-capturas]
//
// Necesita Node y Playwright con Chromium. Es una herramienta de desarrollo:
// la app no la usa. Abre index.html en cada pantalla de la tabla PANTALLAS,
// con dedo (pointer: coarse) o con ratón, y mide en el dibujo ya pintado:
// - el alto de cada cuerda: ≥ 40 px en horizontal con alto útil ≥ 268 px
//   (V-01, F3.2) y en vertical con el dedo si la pantalla mide ≥ 660 px de
//   alto (G-05); en las más bajas manda que la navegación no se salga;
// - que el pentagrama, si está encendido, mide al menos 60 px (AR-05 #2);
// - el ancho de los trastes con el dedo: ≥ 40 px (V-04);
// - que todo botón, desplegable e interruptor visible mide al menos 40 × 40 px
//   con el dedo (G-05), también con Ajustes abierto;
// - que nada visible se sale de la pantalla;
// - que ningún control (botón, desplegable, interruptor) queda fuera de la
//   pantalla, debajo de una zona segura (la cámara, la barra de inicio) o
//   recortado por una caja; solo puede quedar por debajo en una caja que se
//   desplaza en vertical, como el panel en horizontal (16/11: «Ver la respuesta»
//   se salía del panel en el iPhone y esto no lo miraba);
// - que el aviso para girar sale donde debe y solo ahí (V-01).
// Cada pantalla puede llevar zonas seguras (las de un iPhone con isla, simuladas
// con Emulation.setSafeAreaInsetsOverride de Chromium) y un estado de la app
// (p. ej. Adivinar tras un fallo, con las dos pistas). Ver ESTADOS.
// Falla (código 1) si algo no se cumple.
'use strict';
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');
// La app sigue el idioma del navegador (G-12): por defecto se comprueba en español;
// con IDIOMA=en-US, en inglés.
const LOCALE = process.env.IDIOMA || 'es-ES';

const RAIZ = path.resolve(__dirname, '..');
const APP = 'file://' + path.join(RAIZ, process.env.APP_HTML || 'index.html');
const SALIDA = process.argv[2] || path.join(RAIZ, 'docs', 'verificaciones', 'img', 'F3.2');
const MIN = 40;

// nombre, ancho, alto, dedo, área, si debe salir el aviso para girar y si se abre Ajustes
const PANTALLAS = [
  ['iphone-safari-horizontal-libre',    750, 342, true,  'free',  false],
  ['iphone-safari-horizontal-adivinar', 750, 342, true,  'guess', false],
  ['iphone-instalada-horizontal',       844, 390, true,  'free',  false],
  ['android-chrome-horizontal-adivinar',780, 280, true,  'guess', false],
  ['iphone-safari-vertical-libre',      390, 664, true,  'free',  true ],
  ['iphone-safari-vertical-adivinar',   390, 664, true,  'guess', true ],
  ['iphone-safari-vertical-afinador',   390, 664, true,  'tuner', false],
  ['iphone-safari-horizontal-afinador', 750, 342, true,  'tuner', false],
  ['windows-1280',                     1280, 720, false, 'free',  false],
  ['windows-estrecha',                  500, 700, false, 'guess', false],
  // Pantallas bajas (AR-05 #1, AT-04 #1): la navegación no puede salirse.
  ['iphone-se-safari-vertical-adivinar', 375, 553, true,  'guess', true ],
  ['android-pequeno-vertical-libre',     360, 560, true,  'free',  true ],
  // Escalas (F5): tarjeta con submodo, tónica y tipo, y el paso a paso bajo el mástil.
  ['iphone-safari-vertical-escalas',    390, 664, true,  'scales', true ],
  ['iphone-se-safari-vertical-escalas', 375, 553, true,  'scales', true ],
  ['iphone-safari-horizontal-escalas',  750, 342, true,  'scales', false],
  // Metrónomo (F5.6): área propia, sin aviso para girar; y su ventana de compás.
  ['iphone-safari-vertical-metronomo',   390, 664, true,  'metro', false],
  ['iphone-se-safari-vertical-metronomo',375, 553, true,  'metro', false],
  ['iphone-safari-horizontal-metronomo', 750, 342, true,  'metro', false],
  ['windows-1280-metronomo',            1280, 720, false, 'metro', false],
  ['windows-tableta-metronomo',          768, 900, false, 'metro', false],
  ['iphone-safari-vertical-metronomo-compas',   390, 664, true, 'metro', false],
  ['iphone-se-safari-vertical-metronomo-compas',375, 553, true, 'metro', false],
  ['iphone-safari-horizontal-metronomo-compas', 750, 342, true, 'metro', false],
  // Acordes (F5.7; F5.8 #6): nota y tipo, y el acorde en grande en los trastes 0 a 5 (Fa, con cejilla).
  ['iphone-safari-vertical-acordes',     390, 664, true,  'chords', false],
  ['iphone-se-safari-vertical-acordes',  375, 553, true,  'chords', false],
  ['android-pequeno-vertical-acordes',   360, 560, true,  'chords', false],
  ['iphone-safari-horizontal-acordes',   750, 342, true,  'chords', false],
  ['windows-1280-acordes',              1280, 720, false, 'chords', false],
  ['windows-tableta-acordes',            768, 900, false, 'chords', false],
  // Tableta y ordenador (F5.8 #3, V-11): el mástil con un alto acotado (cuerdas de
  // 40 a 80 px) y las pestañas sin pisar el nombre ni Ajustes.
  ['ipad-vertical-adivinar',             820, 1180, true, 'guess', false],
  ['ipad-mini-vertical-libre',           744, 1133, true, 'free',  false],
  ['ipad-horizontal-libre',             1180, 820, true,  'free',  false],
  ['ipad-1024-horizontal-adivinar',     1024, 768, true,  'guess', false],
  ['ipad-vertical-metronomo',            820, 1180, true, 'metro', false],
  ['ipad-vertical-acordes',              820, 1180, true, 'chords', false],
  ['ordenador-1440-adivinar',           1440, 900, false, 'guess', false],
  ['ipad-vertical-ajustes',              820, 1180, true, 'free',  false, true],
  // Con las barras de Safari (AR-16 #1): iPad mini en horizontal y una ventana de
  // 1280 × 720 en Windows, que deja unos 620 px útiles.
  ['ipad-mini-horizontal-safari-libre', 1133, 670, true,  'free',  false],
  ['ipad-mini-horizontal-safari-adivinar', 1133, 670, true, 'guess', false],
  ['windows-1280-ventana-adivinar',     1280, 620, false, 'guess', false],
  ['windows-1280-ventana-acordes',      1280, 620, false, 'chords', false],
  // Ajustes abierto: sus controles también miden 40 px (AR-05 #3).
  ['iphone-safari-vertical-ajustes',     390, 664, true,  'free',  true,  true],
  ['iphone-safari-horizontal-ajustes',   750, 342, true,  'free',  false, true],
  // Estados que cambian el panel: Adivinar tras un fallo, con las dos pistas
  // (aparece «Ver la respuesta»), y Escalas practicando.
  ['iphone-safari-horizontal-adivinar-fallo', 750, 342, true, 'guess', false, false, { estado: 'fallo' }],
  ['iphone-safari-vertical-adivinar-fallo',   390, 664, true, 'guess', false, false, { estado: 'fallo' }],
  ['iphone-se-safari-vertical-adivinar-fallo',375, 553, true, 'guess', false, false, { estado: 'fallo' }],
  ['iphone-safari-horizontal-escalas-practica', 750, 342, true, 'scales', false, false, { estado: 'practica' }],
  // iPhone instalado (sin barras de Safari), con las zonas seguras de verdad: en
  // horizontal, 59 px a cada lado y 21 abajo; en vertical, 59 arriba y 34 abajo.
  // El 15 Pro (852 × 393) y el Pro Max (932 × 430), el de tu captura del 16/11.
  ...[['15pro', 852, 393], ['promax', 932, 430]].flatMap(([m, w, h]) => {
    const hz = { insets: { left: 59, right: 59, bottom: 21 } }, vt = { insets: { top: 59, bottom: 34 } };
    return [
      [`iphone-${m}-instalada-horizontal-libre`,    w, h, true, 'free',   false, false, hz],
      [`iphone-${m}-instalada-horizontal-adivinar`, w, h, true, 'guess',  false, false, hz],
      [`iphone-${m}-instalada-horizontal-adivinar-fallo`, w, h, true, 'guess', false, false, { ...hz, estado: 'fallo' }],
      [`iphone-${m}-instalada-horizontal-afinador`, w, h, true, 'tuner',  false, false, hz],
      [`iphone-${m}-instalada-horizontal-escalas`,  w, h, true, 'scales', false, false, hz],
      [`iphone-${m}-instalada-horizontal-escalas-practica`, w, h, true, 'scales', false, false, { ...hz, estado: 'practica' }],
      [`iphone-${m}-instalada-horizontal-metronomo`, w, h, true, 'metro', false, false, hz],
      [`iphone-${m}-instalada-horizontal-metronomo-compas`, w, h, true, 'metro', false, false, hz],
      [`iphone-${m}-instalada-horizontal-acordes`,  w, h, true, 'chords', false, false, hz],
      [`iphone-${m}-instalada-horizontal-ajustes`,  w, h, true, 'free',   false, true,  hz],
      [`iphone-${m}-instalada-vertical-adivinar-fallo`, h, w, true, 'guess', false, false, { ...vt, estado: 'fallo' }],
      [`iphone-${m}-instalada-vertical-escalas-practica`, h, w, true, 'scales', true, false, { ...vt, estado: 'practica' }],
      [`iphone-${m}-instalada-vertical-metronomo-compas`, h, w, true, 'metro', false, false, vt],
      [`iphone-${m}-instalada-vertical-acordes`,    h, w, true, 'chords', false, false, vt],
      [`iphone-${m}-instalada-vertical-ajustes`,    h, w, true, 'free',   true,  true,  vt],
    ];
  }),
];

// Estados de la app que se preparan antes de medir.
const ESTADOS = {
  // Un fallo, con las dos pistas encendidas: «✗ ¡Prueba otra vez!» y «Ver la respuesta».
  fallo: () => { state.hintNote = state.hintString = true; guessStarted = true;
    challenge = { midi: 60, misses: 1 }; renderChallenge(); },
  practica: () => document.getElementById('qb-scale-practice').click(),
};

(async () => {
  fs.mkdirSync(SALIDA, { recursive: true });
  const navegador = await chromium.launch();
  let fallos = 0;
  const fallo = (pantalla, msg) => { fallos++; console.log(`FALLO ${pantalla}: ${msg}`); };

  for (const [nombre, w, h, dedo, area, avisoEsperado, ajustes, extra = {}] of PANTALLAS) {
    const ctx = await navegador.newContext({ locale: LOCALE, viewport: { width: w, height: h }, hasTouch: dedo,
                                             isMobile: dedo, deviceScaleFactor: 2 });
    const pagina = await ctx.newPage();
    const zonas = { top: 0, right: 0, bottom: 0, left: 0, ...extra.insets };
    if (extra.insets) await (await ctx.newCDPSession(pagina)).send('Emulation.setSafeAreaInsetsOverride', { insets: zonas });
    await pagina.goto(APP);
    // La puerta de audio no hace falta para medir la disposición.
    await pagina.evaluate(() => document.getElementById('gate').classList.add('hidden'));
    if (area !== 'free') await pagina.click(`.tab[data-screen="${area}"]`);
    // En el metrónomo, el caso de más puntos (7/8) en las pantallas pequeñas, y su ventana de compás.
    if (area === 'metro' && /se-|horizontal/.test(nombre)) await pagina.evaluate(() => setCompas('7/8'));
    if (nombre.endsWith('-compas')) await pagina.click('#metro-sig');
    if (area === 'chords') await pagina.evaluate(() => selectChord('F', false));
    if (ajustes) await pagina.evaluate(() => [...document.querySelectorAll('#btn-settings, #btn-settings-rail')]
      .find(b => b.getClientRects().length).click());
    if (extra.estado) await pagina.evaluate(`(${ESTADOS[extra.estado]})()`);
    await pagina.waitForTimeout(400);

    const m = await pagina.evaluate(([min, zonas]) => {
      const vis = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 &&
        getComputedStyle(e).visibility !== 'hidden' && !e.closest('[hidden], .gate.hidden, .sheet:not(.open)'); };
      const out = { dedo: matchMedia('(pointer: coarse)').matches };
      const strings = document.getElementById('strings');
      if (vis(strings)) {
        out.cuerda = strings.getBoundingClientRect().height / 6;
        const celdas = [...document.querySelectorAll('.string-row:first-child .fret-cell')];
        out.cejuela = celdas[0].getBoundingClientRect().width;
        out.traste = celdas[1].getBoundingClientRect().width;
        out.etiquetaZoom = document.getElementById('zoom-label').textContent;
      }
      const metro = document.getElementById('metro');
      if (vis(metro)) out.metroDesplaza = metro.scrollHeight > metro.clientHeight + 1;
      // Las pestañas no pueden pisar el nombre ni el botón de Ajustes (F5.8 #3).
      const choca = (x, y) => { if (!x || !y || !vis(x) || !vis(y)) return false;
        const a = x.getBoundingClientRect(), b = y.getBoundingClientRect();
        return a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom; };
      const barra = document.querySelector('.tabbar');
      out.pisa = ['.brand', '#btn-settings'].filter(q => choca(barra, document.querySelector(q)));
      out.aviso = !document.getElementById('rotate-hint').hidden && vis(document.getElementById('rotate-hint'));
      const disp = document.getElementById('display');
      if (vis(disp) && !disp.classList.contains('hidden')) out.pentagrama = disp.getBoundingClientRect().height;
      out.pequenos = [...document.querySelectorAll('button, select, [role="switch"]')].filter(vis).filter(b => {
        const r = b.getBoundingClientRect(); return r.width < min - 0.5 || r.height < min - 0.5;
      }).map(b => (b.id || b.className || b.textContent.trim()).slice(0, 30) + ' ' +
                  Math.round(b.getBoundingClientRect().width) + '×' + Math.round(b.getBoundingClientRect().height));
      // Lo que se sale de la pantalla. El panel en horizontal puede desplazarse
      // por dentro (interfaz.md §7), así que lo que cuenta es el propio panel.
      out.fuera = [...document.querySelectorAll('.header, .quickbar, .challenge, .scales-card, .sc-nav, .display, .zoombar, .rotate-hint, .board-area, .tabbar, .tuner, .metro, .chords-card, .panel, .brand')]
        .filter(vis).filter(e => {
          if (e.closest('.panel') && getComputedStyle(document.getElementById('panel')).display !== 'contents') return false;
          const r = e.getBoundingClientRect();
          return r.bottom > innerHeight + 0.5 || r.right > innerWidth + 0.5 || r.top < -0.5 || r.left < -0.5;
        }).map(e => e.className.split(' ')[0]);
      // Cada control, entero a la vista: dentro de la pantalla menos las zonas
      // seguras y de toda caja que lo recorte. Solo puede quedar por debajo (o
      // por encima) en una caja que se desplaza en vertical, y a los lados en las
      // que se desplazan a propósito en horizontal (el mástil, la tira de compases).
      const despLado = e => e.matches('.board-scroll, .mp-sigs');
      out.cortados = [...document.querySelectorAll('button, select, input, [role="switch"], a[href]')].filter(vis).filter(b => {
        const r = b.getBoundingClientRect();
        let dentroLado = false, dentroAlto = false;
        for (let a = b.parentElement; a && a !== document.body; a = a.parentElement){
          const cs = getComputedStyle(a);
          if (cs.overflowX === 'visible' && cs.overflowY === 'visible') continue;
          const c = a.getBoundingClientRect();
          const despAlto = /auto|scroll/.test(cs.overflowY) && a.scrollHeight > a.clientHeight;
          if (despLado(a)) dentroLado = true;
          else if (r.left < c.left - 0.5 || r.right > c.right + 0.5) return true;
          if (despAlto) dentroAlto = true;
          else if (!dentroAlto && (r.top < c.top - 0.5 || r.bottom > c.bottom + 0.5)) return true;
        }
        if (!dentroLado && (r.left < zonas.left - 0.5 || r.right > innerWidth - zonas.right + 0.5)) return true;
        if (!dentroAlto && (r.top < zonas.top - 0.5 || r.bottom > innerHeight - zonas.bottom + 0.5)) return true;
        return false;
      }).map(b => (b.id || b.className || b.textContent.trim()).slice(0, 30));
      return out;
    }, [MIN, zonas]);

    const partes = [];
    if (m.cuerda !== undefined) {
      partes.push(`cuerda ${m.cuerda.toFixed(1)} px`, `traste ${m.traste.toFixed(1)} px`,
                  `cejuela ${m.cejuela.toFixed(0)} px`, `«${m.etiquetaZoom}»`);
      const exigeCuerda = dedo && (w < h ? h >= 660 : h >= 268);
      if (exigeCuerda && m.cuerda < MIN - 0.5) fallo(nombre, `cuerda de ${m.cuerda.toFixed(1)} px`);
      if (dedo && (m.traste < MIN - 0.5 || m.cejuela < MIN - 0.5)) fallo(nombre, `traste de ${m.traste.toFixed(1)} px o cejuela de ${m.cejuela.toFixed(1)} px`);
    }
    if (m.pentagrama !== undefined) {
      partes.push(`pentagrama ${m.pentagrama.toFixed(0)} px`);
      if (m.pentagrama < 59.5) fallo(nombre, `pentagrama encendido de solo ${m.pentagrama.toFixed(0)} px`);
    }
    // En pantallas de 700 × 600 o más (tableta, ordenador) el mástil no se estira (V-11).
    // Con ratón basta con 30 px por cuerda (los 40 px son para el dedo, G-05).
    const minTab = dedo ? MIN : 30;
    if (m.cuerda !== undefined && w >= 700 && h >= 600 && (m.cuerda < minTab - 0.5 || m.cuerda > 80.5))
      fallo(nombre, `cuerda de ${m.cuerda.toFixed(1)} px en tableta u ordenador (de ${minTab} a 80)`);
    if (m.pisa.length) fallo(nombre, 'las pestañas pisan ' + m.pisa.join(' y '));
    if (m.metroDesplaza !== undefined) partes.push(m.metroDesplaza ? 'metrónomo: hay que desplazar' : 'metrónomo: cabe entero');
    if (dedo !== m.dedo) fallo(nombre, 'la emulación del puntero no coincide');
    if (dedo && m.pequenos.length) fallo(nombre, 'botones de menos de 40 px: ' + m.pequenos.join(', '));
    if (m.fuera.length) fallo(nombre, 'se sale de la pantalla: ' + m.fuera.join(', '));
    if (m.cortados.length) fallo(nombre, 'controles cortados o tapados: ' + m.cortados.join(', '));
    if (m.aviso !== avisoEsperado) fallo(nombre, `aviso para girar ${m.aviso ? 'visible' : 'oculto'}, se esperaba ${avisoEsperado ? 'visible' : 'oculto'}`);
    partes.push(`aviso ${m.aviso ? 'sí' : 'no'}`);
    console.log(`${nombre} (${w} × ${h}, ${dedo ? 'dedo' : 'ratón'}): ${partes.join(' · ')}`);

    await pagina.screenshot({ path: path.join(SALIDA, nombre + '.png') });
    await ctx.close();
  }
  await navegador.close();
  console.log(fallos ? `${fallos} fallo(s)` : 'Todo correcto');
  process.exit(fallos ? 1 : 0);
})();
