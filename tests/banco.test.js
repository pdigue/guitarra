// Banco de pruebas de Trasteando. Se ejecuta desde la carpeta del proyecto con:  node --test
// (Node busca solo los archivos *.test.js; no hace falta instalar nada).
// Cada prueba cita los requisitos que verifica (ver docs/matriz-cumplimiento.md).
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { boot, sleep } = require('./dom-minimo');

// APP_HTML permite pasar el banco a otra versión, por ejemplo para comprobar que una
// prueba nueva falla con la versión anterior a la corrección.
const APP = process.env.APP_HTML || path.join(__dirname, '..', 'index.html');
const sinErrores = A => A.errors.filter(e => !/AudioContext|muestras/.test(e));

test('arranque: mástil, numeración, versión y panel (D-01, G-10)', () => {
  const A = boot(APP);
  assert.equal(A.doc.querySelectorAll('.fret-cell').length, 150, '6 cuerdas × 25 posiciones');
  assert.equal(A.doc.querySelectorAll('.fret-num').length, 25);
  assert.equal(A.$('app-version').textContent, 'Trasteando ' + A.ev('APP_VERSION'));
  assert.match(A.ev('APP_VERSION'), /^\d+\.\d+\.\d+$/);
  assert.equal(A.$('sheet').inert, true, 'el panel de ajustes nace inerte');
  assert.equal(A.ev('state.fretNums'), 'all');
  assert.ok(!A.$('fret-nums').classList.contains('hidden'));
  assert.deepEqual(sinErrores(A), []);
});

test('migración de ajustes de la 0.1.1 (C-05, D-04)', () => {
  const B = boot(APP, { showFretNums: false, record: 7 });
  assert.equal(B.ev('state.fretNums'), 'none');
  assert.ok(B.$('fret-nums').classList.contains('hidden'));
  assert.equal(B.ev('state.record'), 7);
  assert.equal(B.ev('"showFretNums" in state'), false);
});

test('ajustes corruptos no rompen la app (C-05)', () => {
  const B = boot(APP, { tuningId: 'no-existe', customTuning: [1, 2], notation: 'x', visibleFrets: 999, record: -3 });
  assert.equal(B.ev('state.tuningId'), 'standard');
  assert.equal(B.ev('state.customTuning.length'), 6);
  assert.equal(B.ev('state.notation'), 'latin');
  assert.equal(B.ev('state.record'), 0);
});

test('numeración en tres modos (D-04, V-09)', () => {
  const A = boot(APP);
  const nums = A.$('fret-nums');
  A.doc.querySelector('#set-fretnums [data-v="guide"]').click();
  assert.ok(nums.classList.contains('guide') && !nums.classList.contains('hidden'));
  assert.equal(JSON.parse(A.store.get('trasteando.v1')).fretNums, 'guide');
  assert.equal(A.doc.querySelector('#set-fretnums [data-v="guide"]').getAttribute('aria-pressed'), 'true');
  A.doc.querySelector('#set-fretnums [data-v="none"]').click();
  assert.ok(nums.classList.contains('hidden') && !nums.classList.contains('guide'));
});

test('«ver todas las notas» no se aplica en Adivinar (L-02, J-12)', () => {
  const A = boot(APP);
  A.$('set-showall').click();
  assert.ok(A.$('board').classList.contains('show-all'));
  A.doc.querySelector('.tab[data-screen="guess"]').click();
  assert.ok(!A.$('board').classList.contains('show-all'));
  A.doc.querySelector('.tab[data-screen="free"]').click();
  assert.ok(A.$('board').classList.contains('show-all'));
});

test('Adivinar: fallo, revelación y reto nuevo (J-07, J-10)', async () => {
  const A = boot(APP);
  A.doc.querySelector('.tab[data-screen="guess"]').click();
  await sleep(400);
  const target = A.ev('challenge');
  const wrong = A.doc.querySelectorAll('.fret-cell').find(c => +c.dataset.midi !== target.midi);
  A.press(wrong);
  assert.equal(A.ev('streak'), 0);
  assert.ok(wrong.classList.contains('wrong'));
  assert.match(A.$('challenge-text').innerHTML, /Era/);
  await sleep(800);
  const reveals = A.doc.querySelectorAll('.fret-cell.reveal');
  assert.equal(reveals.length, A.ev('positionsFor(challenge.midi).length'));
  assert.ok(reveals.length > 0 && reveals.every(c => +c.dataset.midi === target.midi));
  assert.equal(A.ev('locked'), true, 'durante la revelación no se puede volver a fallar');
  await sleep(2500);
  assert.notEqual(A.ev('challenge'), target);
  assert.equal(A.doc.querySelectorAll('.fret-cell.reveal, .fret-cell.wrong').length, 0);
  assert.doesNotMatch(A.$('challenge-text').innerHTML, /Era/, 'el reto nuevo arranca limpio');
});

test('Adivinar: acierto en cualquier posición y récord guardado (J-02, J-07, J-08)', async () => {
  const A = boot(APP);
  A.doc.querySelector('.tab[data-screen="guess"]').click();
  await sleep(400);
  const midi = A.ev('challenge.midi');
  const cells = A.doc.querySelectorAll('.fret-cell').filter(c => +c.dataset.midi === midi);
  A.press(cells[cells.length - 1]);
  assert.equal(A.ev('streak'), 1);
  assert.ok(JSON.parse(A.store.get('trasteando.v1')).record >= 1);
});

test('arrastrar el mástil no cuenta como pulsación en Adivinar (AUD-02)', async () => {
  const A = boot(APP);
  A.doc.querySelector('.tab[data-screen="guess"]').click();
  await sleep(400);
  const midi = A.ev('challenge.midi');
  const other = A.doc.querySelectorAll('.fret-cell').find(c => +c.dataset.midi !== midi);
  A.press(other, true);
  assert.equal(A.ev('streak'), 0);
  assert.ok(!other.classList.contains('wrong'));
});

test('cambiar de afinación durante una revelación no revela el reto nuevo (A-10, D-02)', async () => {
  const A = boot(APP);
  A.doc.querySelector('.tab[data-screen="guess"]').click();
  await sleep(400);
  const t = A.ev('challenge');
  A.press(A.doc.querySelectorAll('.fret-cell').find(c => +c.dataset.midi !== t.midi));
  await sleep(200);
  const sel = A.$('set-tuning'); sel.value = 'dropd'; sel.dispatchEvent({ type: 'change', target: sel });
  await sleep(1000);
  assert.equal(A.doc.querySelectorAll('.fret-cell.reveal').length, 0);
  assert.equal(A.doc.querySelectorAll('.string-label').map(l => l.textContent).join(' '), 'Mi Si Sol Re La Re');
});

test('restablecer vuelve a los valores por defecto (C-05)', async () => {
  const A = boot(APP);
  A.doc.querySelector('#set-fretnums [data-v="none"]').click();
  A.$('set-reset').click();
  await sleep(50);
  assert.equal(A.ev('state.tuningId'), 'standard');
  assert.equal(A.ev('state.fretNums'), 'all');
});

test('pentagrama: ninguna nota del rango posible se sale del dibujo (P-01)', () => {
  const A = boot(APP);
  const fuera = A.ev(`(() => { let n = 0;
    for (let m = MIN_TUNING_MIDI; m <= MAX_TUNING_MIDI + NUM_FRETS; m++){
      const y = staffY(fitOctave(m).drawMidi); if (y < 4 || y > 124) n++; }
    return n; })()`);
  assert.equal(fuera, 0);
});

// Nota científica ('Fs3') → número MIDI (66).
const midiDe = n => 12 * (+n.slice(-1) + 1) + ['C','Cs','D','Ds','E','F','Fs','G','Gs','A','As','B'].indexOf(n.slice(0, -1));

const medida = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'samples', 'afinacion.json'), 'utf8'));
const hz = midi => 440 * 2 ** ((midi - 69) / 12);

test('cada grabación es la nota a la que se asigna y su desviación está medida (S-08)', () => {
  const A = boot(APP);
  const mapas = JSON.parse(A.ev('JSON.stringify(SAMPLE_MAPS)'));
  const carpeta = path.join(__dirname, '..', 'samples');
  assert.deepEqual(Object.keys(mapas).sort(), ['acoustic', 'nylon']);
  for (const [timbre, mapa] of Object.entries(mapas)){
    for (const [nota, [archivo, cents]] of Object.entries(mapa)){
      const m = medida[timbre] && medida[timbre][archivo];
      assert.ok(m, `samples/${timbre}/${archivo} no está medido`);
      // La comparación es con la frecuencia medida, no con el nombre del archivo.
      const real = 1200 * Math.log2(m.hz_medida / hz(midiDe(nota)));
      // Menos de medio semitono: es esa nota y no la de al lado (lo que falló con el D5 de nylon).
      // La desviación que tenga la corrige la app; la prueba siguiente mide el resultado.
      assert.ok(Math.abs(real) < 50, `${timbre}/${archivo} se usa como ${nota} pero suena a ${real.toFixed(1)} cents: es otra nota`);
      assert.ok(Math.abs(cents - m.cents) < 0.05, `${timbre}/${archivo}: la app corrige ${cents} cents y la medición dice ${m.cents}`);
      const sha = crypto.createHash('sha256').update(fs.readFileSync(path.join(carpeta, timbre, archivo))).digest('hex');
      assert.equal(sha, m.sha256, `${timbre}/${archivo} no es el archivo medido`);
    }
  }
});

test('la app no descarga nada de otros servidores (S-07, F2.2)', () => {
  const src = fs.readFileSync(APP, 'utf8');
  const urls = [...new Set(src.match(/https?:\/\/[^\s"'`)<>]+/g) || [])];
  // El espacio de nombres de SVG parece una dirección, pero el navegador no la descarga.
  assert.deepEqual(urls.filter(u => u !== 'http://www.w3.org/2000/svg'), []);
  const A = boot(APP);
  assert.equal(A.ev('SAMPLE_BASE'), 'samples/');
});

/** Descargas simuladas: acaban cuando la prueba quiere, con 1000 muestras de silencio y luego sonido. */
const cargaFalsa = `globalThis.__pend = [];
  globalThis.__buf = { sampleRate: 44100, getChannelData: () => { const d = new Float32Array(2000); d.fill(0.5, 1000); return d; } };
  fetchAndDecode = url => new Promise(r => __pend.push(() => r(__buf)));`;
const terminarCargas = A => A.ev('while (__pend.length) __pend.shift()()');

test('cambiar de timbre deprisa deja instalado el último elegido (S-02, AT-02 #1)', async () => {
  const A = boot(APP);
  A.ev(cargaFalsa);
  const p0 = A.ev("loadSamples('nylon')"); await sleep(0); terminarCargas(A); await p0;
  assert.equal(A.ev('samplerTimbre'), 'nylon');
  const pa = A.ev("setTimbre('acoustic')"); await sleep(0);   // descarga lenta en curso
  await A.ev("setTimbre('nylon')");                           // vuelta inmediata
  terminarCargas(A); await pa;                                 // termina la acústica
  assert.equal(A.ev('state.timbre'), 'nylon');
  assert.equal(A.ev('samplerTimbre'), 'nylon');
});

test('todas las notas posibles suenan en su frecuencia, en los dos timbres (S-01, S-08, F2.2)', async () => {
  const A = boot(APP);
  A.ev(cargaFalsa);
  for (const timbre of ['nylon', 'acoustic']){
    const p = A.ev(`loadSamples('${timbre}')`); await sleep(0); terminarCargas(A); await p;
    const [min, max] = A.ev('[MIN_TUNING_MIDI, MAX_TUNING_MIDI + NUM_FRETS]');
    let peor = 0, transporte = 0, transporteEstandar = 0;
    for (let midi = min; midi <= max; midi++){
      const s = JSON.parse(A.ev(`(() => { const s = pickSample(${midi}); return JSON.stringify({ midi: s.midi, rate: playbackRateFor(${midi}, s) }); })()`));
      const archivo = Object.values(JSON.parse(A.ev('JSON.stringify(SAMPLE_MAPS)'))[timbre]).find(([f]) => midiDe(f.slice(0, -4)) === s.midi)[0];
      // Frecuencia que sonará = frecuencia medida de la grabación × velocidad.
      const error = 1200 * Math.log2(medida[timbre][archivo].hz_medida * s.rate / hz(midi));
      peor = Math.max(peor, Math.abs(error));
      transporte = Math.max(transporte, Math.abs(midi - s.midi));
      if (midi >= 40 && midi <= 88) transporteEstandar = Math.max(transporteEstandar, Math.abs(midi - s.midi));
    }
    assert.ok(peor <= 0.5, `${timbre}: una nota se desvía ${peor.toFixed(2)} cents`);
    // Hoy llega a +17 en nylon y +19 en acústica con una afinación personalizada
    // muy aguda; F2.4 lo reducirá añadiendo muestras.
    assert.ok(transporte <= 19, `${timbre}: transporte máximo ${transporte} semitonos`);
    // F2.4: en afinación estándar (Mi2 a Mi6), nylon ≤ 6; la acústica no tiene grabaciones
    // por encima del D5 y se queda en 14.
    assert.ok(transporteEstandar <= (timbre === 'nylon' ? 6 : 14), `${timbre}: ${transporteEstandar} semitonos en afinación estándar`);
  }
});

test('se salta el silencio inicial de cada grabación (AT-02 #4)', () => {
  const A = boot(APP);
  A.ev(cargaFalsa);
  const offset = A.ev('soundStart(__buf)');
  assert.ok(Math.abs(offset - (1000 / 44100 - 0.002)) < 1e-6, `empieza en ${offset}`);
});

test('con el audio dentro de la página no descarga nada (G-07, F2.3)', async () => {
  const A = boot(APP);
  A.ev(cargaFalsa);
  A.ev(`globalThis.__descargas = 0;
    fetchAndDecode = async () => { __descargas++; return __buf; };
    decodeData = async () => __buf;
    for (const nota of Object.keys(SAMPLE_MAPS.nylon)){
      const el = document.createElement('script');
      el.setAttribute('id', 'audio-nylon-' + nota); el.textContent = btoa('mp3 de prueba');
      document.body.appendChild(el);
    }`);
  assert.equal(await A.ev("loadSamples('nylon')"), true);
  assert.equal(A.ev('__descargas'), 0);
});

test('el archivo autónomo existe, está al día con index.html y pesa 1,5 MB o menos (G-07, G-08, F2.3)', () => {
  const dist = path.join(__dirname, '..', 'dist', 'trasteando.html');
  const pagina = fs.readFileSync(dist, 'utf8');
  assert.ok(fs.statSync(dist).size <= 1_500_000, `pesa ${fs.statSync(dist).size} bytes`);
  const i = pagina.indexOf('<!-- AUDIO INCRUSTADO: inicio'), f = pagina.indexOf('<!-- AUDIO INCRUSTADO: fin -->');
  assert.ok(i > 0 && f > i, 'faltan las marcas del audio incrustado');
  const sinAudio = pagina.slice(0, i) + pagina.slice(f + '<!-- AUDIO INCRUSTADO: fin -->\n'.length);
  assert.equal(sinAudio, fs.readFileSync(APP, 'utf8'), 'dist/trasteando.html no se ha regenerado tras cambiar index.html');
  const ids = [...pagina.slice(i, f).matchAll(/id="audio-(\w+)-(\w+)"/g)].map(m => m[1] + '-' + m[2]).sort();
  const A = boot(APP);
  const mapas = JSON.parse(A.ev('JSON.stringify(SAMPLE_MAPS)'));
  assert.deepEqual(ids, Object.entries(mapas).flatMap(([t, m]) => Object.keys(m).map(n => t + '-' + n)).sort());
  const urls = [...new Set(pagina.match(/https?:\/\/[^\s"'`)<>]+/g) || [])].filter(u => u !== 'http://www.w3.org/2000/svg');
  assert.deepEqual(urls, []);
});

test('el reto suena una sola vez aunque se cambie de pestaña deprisa (J-01, AT-02 #5)', async () => {
  const A = boot(APP);
  A.ev('globalThis.__plays = 0; playMidi = () => { __plays++; };');
  const tab = s => A.doc.querySelector('.tab[data-screen="' + s + '"]');
  tab('guess').click(); tab('free').click(); tab('guess').click();
  await sleep(600);
  assert.equal(A.ev('__plays'), 1);
});

test('tocar la pestaña activa no reinicia la racha (J-07, AT-02 #6)', async () => {
  const A = boot(APP);
  const tab = A.doc.querySelector('.tab[data-screen="guess"]');
  tab.click(); await sleep(50);
  A.ev('streak = 3');
  tab.click();
  assert.equal(A.ev('streak'), 3);
});
