// Banco de pruebas de Trasteando. Se ejecuta desde la carpeta del proyecto con:  node --test
// (Node busca solo los archivos *.test.js; no hace falta instalar nada).
// Cada prueba cita los requisitos que verifica (ver docs/matriz-cumplimiento.md).
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { boot, sleep, fuente } = require('./dom-minimo');

// APP_HTML permite pasar el banco a otra versión, por ejemplo para comprobar que una
// prueba nueva falla con la versión anterior a la corrección.
const APP = process.env.APP_HTML || path.join(__dirname, '..', 'index.html');
const sinErrores = A => A.errors.filter(e => !/AudioContext|muestras/.test(e));
/** Entra en Adivinar y pulsa ▶: desde la 0.3.3 nada suena ni puntúa hasta entonces. */
const jugar = A => { A.doc.querySelector('.tab[data-screen="guess"]').click(); A.$('btn-repeat').click(); };

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
  const B = boot(APP, { showFretNums: false, record: 7, records: { standard: 4, dropd: 2 } });
  assert.equal(B.ev('state.fretNums'), 'none');
  assert.ok(B.$('fret-nums').classList.contains('hidden'));
  assert.equal(B.ev('state.records.standard'), 7, 'el récord único de antes pasa a la afinación estándar si es mayor (J-11)');
  assert.equal(B.ev('state.records.dropd'), 2);
  assert.equal(B.ev('"record" in state'), false);
  assert.equal(B.ev('"showFretNums" in state'), false);
});

test('ajustes corruptos no rompen la app (C-05)', () => {
  const B = boot(APP, { tuningId: 'no-existe', customTuning: [1, 2], notation: 'x', visibleFrets: 999, record: -3,
    records: { standard: -1, dropd: 'x', inventada: 4, dadgad: 5 } });
  assert.equal(B.ev('state.tuningId'), 'standard');
  assert.equal(B.ev('state.customTuning.length'), 6);
  assert.equal(B.ev('state.notation'), 'latin');
  assert.equal(B.ev('JSON.stringify(state.records)'), '{"dadgad":5}', 'solo récords válidos de afinaciones que existen');
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

test('Adivinar con «Al fallar: Ver respuesta»: fallo, revelación y reto nuevo (J-07, J-10)', async () => {
  const A = boot(APP, { onMiss: 'reveal' });
  jugar(A);
  await sleep(400);
  const target = A.ev('challenge');
  const wrong = A.doc.querySelectorAll('.fret-cell').find(c => +c.dataset.midi !== target.midi);
  A.press(wrong);
  assert.equal(A.ev('streak'), 0);
  assert.ok(wrong.classList.contains('wrong'));
  assert.match(A.$('challenge-text').innerHTML, /Era/);
  await sleep(600);
  assert.equal(A.doc.querySelectorAll('.fret-cell.reveal').length, 0, 'la corrección espera: da tiempo a oír tu nota (Sesión 1, A09)');
  await sleep(700);
  const reveals = A.doc.querySelectorAll('.fret-cell.reveal');
  assert.equal(reveals.length, A.ev('positionsFor(challenge.midi).length'));
  assert.ok(reveals.length > 0 && reveals.every(c => +c.dataset.midi === target.midi));
  assert.equal(A.ev('locked'), true, 'durante la revelación no se puede volver a fallar');
  await sleep(3100);
  assert.notEqual(A.ev('challenge'), target);
  assert.equal(A.doc.querySelectorAll('.fret-cell.reveal, .fret-cell.wrong').length, 0);
  assert.doesNotMatch(A.$('challenge-text').innerHTML, /Era/, 'el reto nuevo arranca limpio');
});

test('Adivinar: acierto en cualquier posición y récord guardado (J-02, J-07, J-08)', async () => {
  const A = boot(APP);
  jugar(A);
  await sleep(400);
  const midi = A.ev('challenge.midi');
  const cells = A.doc.querySelectorAll('.fret-cell').filter(c => +c.dataset.midi === midi);
  A.press(cells[cells.length - 1]);
  assert.equal(A.ev('streak'), 1);
  assert.equal(JSON.parse(A.store.get('trasteando.v1')).records.standard, 1);
  assert.equal(A.$('st-record').textContent, 'Récord 1 · Estándar');
});

test('un récord por afinación: cambiar de afinación empieza la racha y enseña el récord de esa (J-11, decisión del 21/10)', async () => {
  const A = boot(APP, { records: { standard: 9, dropd: 2 } });
  jugar(A);
  assert.equal(A.$('st-record').textContent, 'Récord 9 · Estándar');
  A.ev('streak = 4');
  const sel = A.$('set-tuning'); sel.value = 'dropd'; sel.dispatchEvent({ type: 'change', target: sel });
  assert.equal(A.ev('streak'), 0, 'la racha no pasa de una afinación a otra');
  assert.equal(A.$('st-record').textContent, 'Récord 2 · Drop D');
  await sleep(400);
  for (let i = 0; i < 3; i++){
    const m = A.ev('challenge.midi');
    A.press(A.doc.querySelectorAll('.fret-cell').find(c => +c.dataset.midi === m));
    await sleep(1600);
  }
  const guardado = JSON.parse(A.store.get('trasteando.v1')).records;
  assert.deepEqual(guardado, { standard: 9, dropd: 3 }, 'sube solo el de Drop D');
});

test('arrastrar el mástil no cuenta como pulsación en Adivinar (AUD-02)', async () => {
  const A = boot(APP);
  jugar(A);
  await sleep(400);
  const midi = A.ev('challenge.midi');
  const other = A.doc.querySelectorAll('.fret-cell').find(c => +c.dataset.midi !== midi);
  A.press(other, true);
  assert.equal(A.ev('streak'), 0);
  assert.ok(!other.classList.contains('wrong'));
});

test('cambiar de afinación durante una revelación no revela el reto nuevo (A-10, D-02)', async () => {
  const A = boot(APP);
  jugar(A);
  await sleep(400);
  const t = A.ev('challenge');
  A.press(A.doc.querySelectorAll('.fret-cell').find(c => +c.dataset.midi !== t.midi));
  await sleep(200);
  const sel = A.$('set-tuning'); sel.value = 'dropd'; sel.dispatchEvent({ type: 'change', target: sel });
  await sleep(1400);
  assert.equal(A.doc.querySelectorAll('.fret-cell.reveal').length, 0);
  assert.equal(A.doc.querySelectorAll('.string-label').map(l => l.textContent).join(' '), 'Mi Si Sol Re La Re');
});

test('restablecer vuelve a los valores por defecto y conserva el récord; el récord se borra aparte (C-05, Sesión 1 A14)', async () => {
  const A = boot(APP);
  A.ev('state.records = { standard: 7, dadgad: 2 }; save()');
  A.doc.querySelector('#set-fretnums [data-v="none"]').click();
  A.$('set-reset').click();
  await sleep(50);
  assert.equal(A.ev('state.tuningId'), 'standard');
  assert.equal(A.ev('state.fretNums'), 'all');
  assert.deepEqual(JSON.parse(A.store.get('trasteando.v1')).records, { standard: 7, dadgad: 2 }, 'los récords no son ajustes');
  A.$('set-clear-record').click();
  assert.deepEqual(JSON.parse(A.store.get('trasteando.v1')).records, {});
  assert.equal(A.$('st-record').textContent, 'Récord 0 · Estándar');
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
  const src = fuente(APP);                   // la página con todo su CSS y JS
  const urls = [...new Set(src.match(/https?:\/\/[^\s"'`)<>]+/g) || [])];
  // Tampoco direcciones sin protocolo («//cdn…»), que el navegador completa con https.
  assert.deepEqual(src.match(/["'(=]\s*\/\/[a-z0-9]/gi) || [], []);
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

test('toda nota tiene grabación, afinación corregida y transporte acotado, en los dos timbres (S-01, S-08, F2.2, F2.4)', async () => {
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
    // Con una afinación personalizada muy aguda: +11 en nylon y +19 en acústica.
    const tope = { nylon: 11, acoustic: 19 }[timbre];
    assert.ok(transporte <= tope, `${timbre}: transporte máximo ${transporte} semitonos (tope ${tope})`);
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

test('el archivo autónomo está al día con la app, con su audio y dentro de sus límites (G-07, G-08, F2.3)', () => {
  const carpeta = path.join(__dirname, '..', 'dist');
  const pagina = fs.readFileSync(path.join(carpeta, 'trasteando.html'), 'utf8');
  const informe = JSON.parse(fs.readFileSync(path.join(carpeta, 'autonomo.json'), 'utf8'));
  const tramo = pagina.match(/<!-- AUDIO INCRUSTADO: inicio[\s\S]*?<!-- AUDIO INCRUSTADO: fin -->\r?\n/);
  assert.ok(tramo, 'faltan las marcas del audio incrustado');
  // Límites revisados en CP-2: el archivo entero ≤ 2 MB y el audio ≤ 1,45 MB.
  assert.ok(Buffer.byteLength(pagina) <= 2_000_000, `el archivo pesa ${Buffer.byteLength(pagina)} bytes`);
  const bloques = [...tramo[0].matchAll(/<script type="application\/octet-stream" id="audio-(\w+)-(\w+)">([^<]*)<\/script>/g)];
  const audio = bloques.reduce((n, m) => n + m[0].length, 0);
  assert.ok(audio <= 1_450_000, `el audio ocupa ${audio} bytes`);
  // Quitado el audio, es exactamente index.html con su css/ y su js/ dentro
  // (los \r de Windows no cuentan).
  const sinAudio = pagina.replace(tramo[0], '').replace(/\r\n/g, '\n');
  assert.equal(sinAudio, fuente(APP), 'dist/trasteando.html no se ha regenerado tras cambiar la app');
  const A = boot(APP);
  assert.equal(informe.version, A.ev('APP_VERSION'));
  const mapas = JSON.parse(A.ev('JSON.stringify(SAMPLE_MAPS)'));
  assert.deepEqual(bloques.map(m => m[1] + '-' + m[2]).sort(),
    Object.entries(mapas).flatMap(([t, m]) => Object.keys(m).map(n => t + '-' + n)).sort());
  // Y el audio es el que se generó a partir de las grabaciones actuales (huellas sha256).
  for (const [, timbre, nota, b64] of bloques){
    const fila = informe.muestras.find(r => r.timbre === timbre && r.nota === nota);
    assert.equal(crypto.createHash('sha256').update(Buffer.from(b64, 'base64')).digest('hex'), fila.sha256, `${timbre}-${nota}: el audio incrustado no es el generado`);
    assert.equal(fila.sha256_original, medida[timbre][fila.archivo].sha256, `${timbre}-${nota}: la grabación original ha cambiado; hay que regenerar`);
  }
  const urls = [...new Set(pagina.match(/https?:\/\/[^\s"'`)<>]+/g) || [])].filter(u => u !== 'http://www.w3.org/2000/svg');
  assert.deepEqual(urls, []);
});

/** Contexto de audio simulado: anota lo que la app le pide, sin sonar. */
const audioFalso = `globalThis.__nodos = [];
  class Param { constructor(v){ this.value = v; this.ev = []; }
    setValueAtTime(v, t){ this.ev.push(['valor', v, t]); } linearRampToValueAtTime(v, t){ this.ev.push(['rampa', v, t]); }
    setTargetAtTime(v, t, c){ this.ev.push(['hacia', v, t, c]); } cancelScheduledValues(t){ this.ev.push(['anular', t]); } }
  class Nodo { constructor(tipo){ this.tipo = tipo; __nodos.push(this); } connect(n){ this.destino = n; return n; } disconnect(){} }
  globalThis.__ctx = { state: 'running', currentTime: 10, sampleRate: 44100, destination: new Nodo('salida'), reanudar: 0,
    resume(){ this.reanudar++; this.state = 'running'; return Promise.resolve(); },
    createGain(){ const n = new Nodo('volumen'); n.gain = new Param(1); return n; },
    createBufferSource(){ const n = new Nodo('fuente'); n.playbackRate = new Param(1); n.arranques = []; n.paradas = [];
      n.start = (t, o) => n.arranques.push([t, o]); n.stop = t => n.paradas.push(t); return n; } };
  audioCtx = __ctx; audioReady = true; audioOut = __ctx.createGain();`;

test('cada nota arranca sin silencio, a su velocidad y con su envolvente (S-01, AT-03 #1)', async () => {
  const A = boot(APP);
  A.ev(cargaFalsa);
  const p = A.ev("loadSamples('nylon')"); await sleep(0); terminarCargas(A); await p;
  A.ev(audioFalso);
  A.ev('playMidi(64)');                                     // Mi4: su grabación se desvía −2,1 cents
  const r = JSON.parse(A.ev(`(() => { const f = __nodos.filter(n => n.tipo === 'fuente').pop();
    return JSON.stringify({ arranque: f.arranques[0], vel: f.playbackRate.value, env: f.destino.gain.ev, destino: f.destino.destino === audioOut }); })()`));
  assert.ok(Math.abs(r.arranque[0] - 10) < 1e-9);
  assert.ok(Math.abs(r.arranque[1] - (1000 / 44100 - 0.002)) < 1e-6, 'empieza donde suena, no en el silencio');
  assert.ok(Math.abs(r.vel - 2 ** (2.1 / 1200)) < 1e-9, 'corrige los −2,1 cents de la grabación');
  assert.deepEqual(r.env.slice(0, 2), [['valor', 0, 10], ['rampa', 1, 10.003]]);
  assert.equal(r.env[2][0], 'hacia');
  assert.ok(r.destino, 'sale por el volumen común');
});

test('con más de 8 notas se apaga la más antigua, y las acabadas se liberan (S-01, AT-03 #1)', async () => {
  const A = boot(APP);
  A.ev(cargaFalsa);
  const p = A.ev("loadSamples('nylon')"); await sleep(0); terminarCargas(A); await p;
  A.ev(audioFalso);
  for (let i = 0; i < 9; i++) A.ev(`playMidi(${50 + i})`);
  assert.equal(A.ev('voices.length'), 8);
  const primera = JSON.parse(A.ev(`JSON.stringify((() => { const f = __nodos.filter(n => n.tipo === 'fuente')[0]; return { paradas: f.paradas, env: f.destino.gain.ev.map(e => e[0]) }; })())`));
  assert.ok(primera.env.includes('anular') && primera.paradas.some(t => Math.abs(t - 10.05) < 1e-9), 'la más antigua se apaga en 50 ms');
  A.ev(`__nodos.filter(n => n.tipo === 'fuente').forEach(f => f.onended && f.onended())`);
  assert.equal(A.ev('voices.length'), 0);
});

test('el audio se reanuda si iOS lo interrumpe, y no si está cerrado (PL-04, AT-03 #1)', () => {
  const A = boot(APP);
  A.ev(audioFalso);
  A.ev("__ctx.state = 'interrupted'; wakeAudio()");
  assert.equal(A.ev('__ctx.reanudar'), 1);
  A.ev("__ctx.state = 'closed'; wakeAudio()");
  assert.equal(A.ev('__ctx.reanudar'), 1);
});

test('al ocultar la app se corta el sonido y no se programa nada; al volver, Adivinar espera a ▶ (C07 de la Sesión 1)', async () => {
  const A = boot(APP);
  A.ev(audioFalso);
  A.ev("__ctx.suspend = function(){ this.state = 'suspended'; this.pausas = (this.pausas || 0) + 1; return Promise.resolve(); }");
  A.ev('globalThis.__plays = 0; playMidi = () => { __plays++; };');
  jugar(A);
  const midi = A.ev('challenge.midi');
  A.press(A.doc.querySelectorAll('.fret-cell').find(c => +c.dataset.midi !== midi));   // fallo
  A.ev("voices.push({ src: __ctx.createBufferSource(), g: __ctx.createGain() })");
  const ocultar = h => { A.doc.hidden = h; (A.doc.listeners.visibilitychange || []).forEach(f => f({ type: 'visibilitychange' })); };
  const antes = A.ev('__plays');
  ocultar(true);
  assert.equal(A.ev('voices.length'), 0, 'se cortan las notas que sonaban');
  assert.equal(A.ev('__ctx.pausas'), 1, 'y se pausa el audio');
  await sleep(1500);
  assert.equal(A.ev('__plays'), antes, 'la corrección no suena con el móvil bloqueado');
  assert.equal(A.doc.querySelectorAll('.fret-cell.reveal').length, 0);
  ocultar(false);
  assert.equal(A.ev('__ctx.state'), 'running', 'al volver se reanuda');
  assert.ok(A.$('btn-repeat').classList.contains('ready'), 'y el reto nuevo espera a ▶');
  assert.equal(A.ev('locked'), false);
  await sleep(500);
  assert.equal(A.ev('needsRebuild'), false);
});

test('si iOS no deja reanudar el audio, se rehace dentro del siguiente toque; «Reactivar sonido» lo hace siempre (C08, D03 de la Sesión 1, AT-06 #2)', async () => {
  const A = boot(APP);
  A.ev(audioFalso);
  A.ev(`globalThis.__creados = 0;
    globalThis.AudioContext = function(){ __creados++; const c = Object.assign({}, __ctx, { state: 'running', cerrado: false });
      c.createBuffer = () => ({}); c.close = function(){ this.state = 'closed'; return Promise.resolve(); }; return c; };
    loadSamples = async () => true; playSynth = () => {};
    __ctx.close = function(){ this.state = 'closed'; this.cerrado = true; return Promise.resolve(); };
    __ctx.createBuffer = () => ({});`);
  A.ev("__ctx.state = 'interrupted'; __ctx.resume = () => new Promise(() => {})");   // iOS no lo suelta
  A.doc.hidden = false; (A.doc.listeners.visibilitychange || []).forEach(f => f({ type: 'visibilitychange' }));
  await sleep(450);
  assert.equal(A.ev('needsRebuild'), true);
  A.ev('playMidi(60)');
  await sleep(350);
  assert.equal(A.ev('__creados'), 0, 'un temporizador no es un gesto: aún no se rehace');
  assert.equal(A.ev('rebuildOnNextGesture'), true);
  const toque = () => (A.doc.listeners.pointerup || []).forEach(f => f({ type: 'pointerup' }));
  toque();
  assert.equal(A.ev('__ctx.cerrado'), true, 'el contexto atascado se cierra');
  assert.equal(A.ev('__creados'), 1, 'y se crea uno nuevo, dentro del toque');
  assert.equal(A.ev('audioCtx.state'), 'running');
  // Si aun así naciera en pausa, el toque siguiente lo reanuda.
  A.ev("audioCtx.state = 'suspended'; audioCtx.resume = function(){ this.state = 'running'; return Promise.resolve(); }");
  toque();
  assert.equal(A.ev('audioCtx.state'), 'running');
  A.ev('lastRebuild = 0');            // el botón ignora pulsaciones a menos de 1 s de otra
  A.$('audio-wake').click();
  assert.equal(A.ev('__creados'), 2, 'el botón crea otro aunque diga «activo»');
  assert.match(A.$('audio-state').textContent, /activo/);
});

test('restablecer desde la acústica deja la clásica sonando y anunciada (C-05, S-02, AT-03 #3)', async () => {
  const A = boot(APP);
  A.ev(cargaFalsa);
  let p = A.ev("loadSamples('nylon')"); await sleep(0); terminarCargas(A); await p;
  p = A.ev("setTimbre('acoustic')"); await sleep(0); terminarCargas(A); await p;
  assert.equal(A.ev('samplerTimbre'), 'acoustic');
  A.$('set-reset').click();
  await sleep(0); terminarCargas(A); await sleep(10);
  assert.equal(A.ev('state.timbre'), 'nylon');
  assert.equal(A.ev('samplerTimbre'), 'nylon');
  assert.match(A.$('timbre-note').textContent, /clásica/);
});

test('en Adivinar nada suena ni puntúa hasta pulsar ▶, y luego cada reto suena una vez (J-01, AT-02 #5, Sesión 1 E06)', async () => {
  const A = boot(APP);
  A.ev('globalThis.__plays = 0; playMidi = () => { __plays++; };');
  const tab = s => A.doc.querySelector('.tab[data-screen="' + s + '"]');
  tab('guess').click(); tab('free').click(); tab('guess').click();
  await sleep(600);
  assert.equal(A.ev('__plays'), 0, 'entrar no hace sonar nada');
  assert.ok(A.$('btn-repeat').classList.contains('ready'), '▶ resaltado');
  assert.match(A.$('challenge-text').innerHTML, /Pulsa ▶/);
  const midi = A.ev('challenge.midi');
  const otra = A.doc.querySelectorAll('.fret-cell').find(c => +c.dataset.midi !== midi);
  A.press(otra);                                       // explorar antes de ▶: suena, no puntúa
  assert.equal(A.ev('__plays'), 1);
  assert.ok(!otra.classList.contains('wrong'));
  assert.equal(A.ev('locked'), false);
  A.$('btn-repeat').click();
  assert.equal(A.ev('__plays'), 2, '▶ hace sonar el reto');
  assert.ok(!A.$('btn-repeat').classList.contains('ready'));
  A.press(A.doc.querySelectorAll('.fret-cell').find(c => +c.dataset.midi === midi));
  await sleep(1500 + 600);
  assert.equal(A.ev('__plays'), 4, 'el reto siguiente suena solo, una vez');
  tab('free').click(); tab('guess').click();
  await sleep(400);
  assert.equal(A.ev('__plays'), 4, 'cada visita vuelve a esperar a ▶');
});

test('en Adivinar la lectura grande es la nota que tocas; cada pista encendida enseña su respuesta en grande, también antes de ▶ (J-06, comentario del 21/10)', async () => {
  const A = boot(APP);
  A.doc.querySelector('.tab[data-screen="guess"]').click();
  const nota = A.$('qb-hint-note'), cuerda = A.$('qb-hint-string');
  assert.equal(nota.textContent, 'Nombre');
  cuerda.click();
  assert.ok(cuerda.classList.contains('clue'), 'antes de ▶ ya se ve la pista');
  assert.equal(cuerda.getAttribute('aria-pressed'), 'true');
  const pos = A.ev('positionsFor(challenge.midi).map(p => p.string.number + "ª").join(" ")');
  assert.equal(cuerda.querySelector('.clue-v').textContent, pos);
  assert.equal(nota.textContent, 'Nombre', 'la otra sigue apagada');
  nota.click();
  assert.equal(nota.querySelector('.clue-v').textContent, A.ev('noteName(challenge.midi) + noteInfo(challenge.midi).octave'));
  assert.doesNotMatch(A.$('challenge-text').innerHTML, /Cuerda|Es /, 'las pistas ya no van en el texto del reto');
  A.$('btn-repeat').click();
  const midi = A.ev('challenge.midi');
  const otra = A.doc.querySelectorAll('.fret-cell').find(c => +c.dataset.midi !== midi);
  A.press(otra);
  assert.equal(A.$('note-name').textContent, A.ev('noteName(' + otra.dataset.midi + ')'), 'la lectura grande es la tocada');
  assert.ok(nota.classList.contains('clue'), 'tras fallar, las pistas siguen');
  nota.click();
  assert.equal(nota.textContent, 'Nombre');
  assert.equal(nota.getAttribute('aria-pressed'), 'false');
  A.doc.querySelector('.tab[data-screen="free"]').click();
  assert.equal(cuerda.textContent, 'Cuerda', 'fuera de Adivinar, sin respuesta');
});

test('cambiar de guitarra no hace sonar ninguna nota (Sesión 1, A14)', async () => {
  const A = boot(APP);
  A.ev(cargaFalsa);
  A.ev('globalThis.__plays = 0; playMidi = () => { __plays++; };');
  const p = A.ev("setTimbre('acoustic')"); await sleep(0); terminarCargas(A); await p;
  assert.equal(A.ev('state.timbre'), 'acoustic');
  assert.equal(A.ev('__plays'), 0);
});

test('tocar la pestaña activa no reinicia la racha (J-07, AT-02 #6)', async () => {
  const A = boot(APP);
  const tab = A.doc.querySelector('.tab[data-screen="guess"]');
  tab.click(); await sleep(50);
  A.ev('streak = 3');
  tab.click();
  assert.equal(A.ev('streak'), 3);
});

// --- F3.2: disposición, aviso para girar, zoom táctil y botón «atrás» ---

const DEDO = { matchMedia: q => ({ matches: /coarse/.test(q) }) };    // pantalla táctil
const RATON = { matchMedia: () => ({ matches: false }) };

test('estructura de la interfaz aprobada: panel de controles y pistas dentro del reto (C-06, C-03, F3.2)', () => {
  const A = boot(APP);
  const dentro = (hijo, padre) => { for (let n = A.$(hijo); n; n = n.parentNode) if (n === A.$(padre)) return true; return false; };
  for (const id of ['quickbar', 'challenge', 'display', 'zoombar']) assert.ok(dentro(id, 'panel'), id + ' va en el panel');
  for (const id of ['board-area', 'rotate-hint', 'tuner']) assert.ok(!dentro(id, 'panel'), id + ' va fuera del panel');
  for (const id of ['qb-hint-label', 'qb-hint-note', 'qb-hint-string']) assert.ok(dentro(id, 'challenge'), id + ' va en el reto');
  assert.ok(A.$('btn-settings-rail').closest('.tabbar'), 'Ajustes también en el raíl');
  assert.equal(A.$('qb-staff').getAttribute('aria-label'), 'Pentagrama', 'el chip con la clave tiene nombre');
  // El Afinador no usa el panel: se oculta entero y vuelve al salir.
  A.doc.querySelector('.tab[data-screen="tuner"]').click();
  assert.equal(A.$('panel').hidden, true);
  A.doc.querySelector('.tab[data-screen="free"]').click();
  assert.equal(A.$('panel').hidden, false);
  assert.deepEqual(sinErrores(A), []);
});

test('aviso para girar: solo con el dedo, en vertical, fuera del Afinador, y cerrado no vuelve (V-01)', async () => {
  const A = boot(APP, null, DEDO);                  // 390 × 844: móvil en vertical
  assert.equal(A.$('rotate-hint').hidden, false, 'sale en Libre');
  A.doc.querySelector('.tab[data-screen="tuner"]').click();
  assert.equal(A.$('rotate-hint').hidden, true, 'nunca en el Afinador');
  A.doc.querySelector('.tab[data-screen="guess"]').click();
  assert.equal(A.$('rotate-hint').hidden, false, 'sale en Adivinar');
  A.$('rotate-close').click();
  assert.equal(A.$('rotate-hint').hidden, true);
  assert.equal(JSON.parse(A.store.get('trasteando.v1')).rotateHintClosed, true, 'se guarda con los ajustes');
  const B = boot(APP, { rotateHintClosed: true }, DEDO);
  assert.equal(B.$('rotate-hint').hidden, true, 'cerrado no vuelve al abrir otra vez');
  B.$('set-reset').click();
  await sleep(20);
  assert.equal(B.$('rotate-hint').hidden, false, '«Restablecer» lo recupera');
  assert.equal(boot(APP, null, RATON).$('rotate-hint').hidden, true, 'con ratón no sale');
  assert.equal(boot(APP, null, Object.assign({ innerWidth: 844, innerHeight: 390 }, DEDO)).$('rotate-hint').hidden, true, 'en horizontal no sale');
  assert.equal(boot(APP).$('rotate-hint').hidden, true, 'sin matchMedia, como el caso más pobre, no sale');
});

test('con el dedo los trastes miden 40 px por defecto y con «+» se ven más, hasta 28 px (V-04, G-05)', () => {
  assert.equal(boot(APP, null, DEDO).ev('minFretW()'), 40, 'ancho cómodo, el de la vista por defecto');
  assert.equal(boot(APP, null, DEDO).ev('zoomFloorW()'), 28, 'lo más estrecho que se puede pedir');
  assert.equal(boot(APP, null, RATON).ev('minFretW()'), 34);
  assert.equal(boot(APP, null, RATON).ev('zoomFloorW()'), 34);
  assert.equal(boot(APP).ev('zoomFloorW()'), 34, 'sin matchMedia se trata como ratón');
  assert.equal(boot(APP).ev('NUT_W'), 40, 'la cejuela también se toca con el dedo');
  // «+» enseña más trastes y «−» menos, en ese orden de izquierda a derecha.
  const A = boot(APP);
  const botones = A.$('zoombar').querySelectorAll('.zoom-btn');
  // (El DOM de prueba no traduce &minus;: se compara ya traducido.)
  assert.deepEqual(botones.map(x => [x.textContent.replace('&minus;', '−'), x.getAttribute('aria-label')]),
    [['−', 'Ver menos trastes'], ['+', 'Ver más trastes']]);
  A.$('board-scroll').clientWidth = 390;   // un móvil en vertical: caben 9 trastes de 34 px
  A.ev('state.visibleFrets = 5');
  A.$('zoom-out').click();
  assert.equal(A.ev('state.visibleFrets'), 7, '«+» suma trastes');
});

/** Historial de navegador simulado: una pila de pasos. back() retrocede uno y,
 *  como el navegador de verdad, avisa después con popstate (AT-04 #6). */
function historiaFalsa(pasosPrevios = []){
  const h = { pila: pasosPrevios.map(st => ({ st })), pos: pasosPrevios.length - 1, salio: false, app: null,
    get state(){ return this.pos >= 0 ? this.pila[this.pos].st : null; },
    get url(){ return this.pos >= 0 ? this.pila[this.pos].url : null; },
    pushState(st, _t, url){ this.pila.length = this.pos + 1; this.pila.push({ st, url }); this.pos++; },
    replaceState(st, _t, url){ if (this.pos < 0){ this.pila.push({ st, url }); this.pos = 0; } else this.pila[this.pos] = { st, url }; },
    back(){
      if (this.pos <= 0){ this.salio = true; return; }   // desde el primer paso, «atrás» sale de la app
      this.pos--; const st = this.pila[this.pos].st;
      setTimeout(() => this.app.fireWin('popstate', { state: st }), 0);
    } };
  return h;
}

test('botón «atrás»: vuelve al área anterior, cierra Ajustes y al abrir entra en Libre (C-07, L-01)', async () => {
  const h = historiaFalsa();
  const A = boot(APP, null, { history: h }); h.app = A;
  const tab = n => A.doc.querySelector(`.tab[data-screen="${n}"]`);
  assert.equal(h.pos, 0); assert.equal(h.url, '#libre'); assert.equal(h.state.screen, 'free');
  tab('guess').click();
  assert.equal(h.pos, 1); assert.equal(h.url, '#adivinar');
  tab('guess').click();
  assert.equal(h.pos, 1, 'tocar la pestaña activa no apunta otro paso');
  h.back(); await sleep(5);                                   // «atrás» del sistema
  assert.equal(A.ev('screen'), 'free');
  assert.ok(tab('free').classList.contains('active'));
  // Ajustes apunta su paso y deja el resto de la página inerte (AT-04 #2).
  A.$('btn-settings').click();
  assert.ok(A.$('sheet').classList.contains('open'));
  assert.equal(h.pos, 1); assert.equal(h.state.sheet, true);
  assert.equal(A.$('board-area').inert, true); assert.equal(A.doc.querySelector('.tabbar').inert, true);
  assert.equal(A.$('sheet').getAttribute('role'), 'dialog');
  h.back(); await sleep(5);
  assert.ok(!A.$('sheet').classList.contains('open'), '«atrás» cierra Ajustes');
  assert.equal(A.ev('screen'), 'free'); assert.equal(h.pos, 0);
  assert.equal(A.$('board-area').inert, false, 'al cerrar, la página vuelve a responder');
  // Cerrar tocando fuera deshace su paso; dos toques seguidos no retroceden dos (AT-04 #5).
  A.$('btn-settings').click();
  A.$('sheet-bg').click(); A.$('sheet-bg').click(); await sleep(5);
  assert.ok(!A.$('sheet').classList.contains('open'));
  assert.equal(h.pos, 0); assert.equal(h.salio, false, 'sigue en la app');
  // Restablecer cierra Ajustes igual, sin dejar pasos huérfanos.
  A.$('btn-settings').click(); A.$('set-reset').click(); await sleep(20);
  assert.ok(!A.$('sheet').classList.contains('open')); assert.equal(h.pos, 0);
  assert.deepEqual(sinErrores(A), []);
});

test('«atrás» tras recargar en otra área no se queda en la misma (C-07, AR-05 #6)', async () => {
  // Pasos de antes de recargar: Libre y Adivinar. Al recargar, la app entra en
  // Libre y reescribe el paso actual; el anterior también es Libre.
  const h = historiaFalsa([{ screen: 'free' }, { screen: 'guess' }]);
  const A = boot(APP, null, { history: h }); h.app = A;
  assert.equal(A.ev('screen'), 'free'); assert.equal(h.state.screen, 'free');
  h.back(); await sleep(10);
  assert.equal(h.salio, true, 'sigue hacia atrás hasta salir, en vez de no hacer nada');
});

test('sin history, como el caso más pobre, la navegación y Ajustes funcionan (C-07, PL-04)', () => {
  const B = boot(APP);
  B.doc.querySelector('.tab[data-screen="guess"]').click();
  assert.equal(B.ev('screen'), 'guess');
  B.$('btn-settings').click(); B.$('sheet-bg').click();
  assert.ok(!B.$('sheet').classList.contains('open'));
  assert.equal(B.$('board-area').inert, false);
  assert.deepEqual(sinErrores(B), []);
});

// --- F3.4: paleta, contraste y teclado ---

function luminancia(hex){
  const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map(x => x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4);
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
const contraste = (a, b) => { const [x, y] = [luminancia(a), luminancia(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

test('paleta: cada nota se lee con 4,5:1 y cada sostenido es un tono más claro de su natural (G-05, F3.4)', () => {
  const A = boot(APP);
  const colores = JSON.parse(A.ev('JSON.stringify(COLORS)'));
  assert.equal(colores.length, 12);
  for (const [i, c] of colores.entries()){
    assert.ok(contraste(c, '#160f07') >= 4.5, `nota ${i}: texto del punto a ${contraste(c, '#160f07').toFixed(2)}:1`);
    assert.ok(contraste(c, '#140e09') >= 4.5, `nota ${i}: como texto sobre el fondo a ${contraste(c, '#140e09').toFixed(2)}:1`);
  }
  for (const s of [1, 3, 6, 8, 10])
    assert.ok(luminancia(colores[s]) > luminancia(colores[s - 1]), `el sostenido ${s} es más claro que su natural`);
  assert.equal(new Set(colores).size, 12, 'doce colores distintos');
});

test('los grises de texto cumplen 4,5:1 sobre todos los fondos (G-05, F3.4)', () => {
  const css = fuente(APP);
  const v = n => css.match(new RegExp('--' + n + ':(#[0-9a-f]{6})'))[1];
  for (const texto of ['text', 'muted', 'faint', 'amber', 'ok', 'ko'])
    for (const fondo of ['bg', 'surface', 'surface2'])
      assert.ok(contraste(v(texto), v(fondo)) >= 4.5, `--${texto} sobre --${fondo}: ${contraste(v(texto), v(fondo)).toFixed(2)}:1`);
  assert.ok(contraste(v('muted'), '#432c16') >= 4.5, 'los números de traste sobre la madera');
});

test('el mástil se maneja con teclado y en Adivinar no dice la nota (G-05, J-12)', () => {
  const A = boot(APP);
  const strings = A.$('strings');
  assert.equal(strings.getAttribute('role'), 'grid');
  const conCero = A.doc.querySelectorAll('.fret-cell[tabindex="0"]');
  assert.equal(conCero.length, 1, 'un único punto de parada del tabulador');
  const tecla = (key) => { const c = A.doc.querySelector('.fret-cell[tabindex="0"]'); strings.dispatchEvent({ type: 'keydown', key, target: c }); return A.doc.querySelector('.fret-cell[tabindex="0"]'); };
  let c = tecla('ArrowRight');
  assert.equal(c.dataset.fret, '1'); assert.equal(c.dataset.row, '0');
  c = tecla('ArrowDown');
  assert.equal(c.dataset.row, '1');
  assert.match(c.getAttribute('aria-label'), /^Do4, 2ª cuerda, traste 1$/);
  assert.equal(A.doc.activeElement, c, 'el foco se mueve de verdad a la casilla');
  // Inicio y Fin van a lo que se ve: ventana de 300 px, etiqueta de 30, cejuela
  // de 40 y trastes de 60 → se ven enteros el 0 al 3 (AT-05 #6).
  A.$('board-scroll').getBoundingClientRect = () => ({ left: 0, right: 300 });
  A.doc.querySelectorAll('.fret-cell[data-row="0"]').forEach(x => {
    const f = +x.dataset.fret, left = f === 0 ? 30 : 70 + (f - 1) * 60;
    x.getBoundingClientRect = () => ({ left, right: left + (f === 0 ? 40 : 60) });
  });
  c = tecla('End');
  assert.equal(c.dataset.fret, '3', 'Fin: el último traste a la vista');
  c = tecla('Home');
  assert.equal(c.dataset.fret, '0');
  assert.equal(A.doc.querySelectorAll('.fret-cell[tabindex="0"]').length, 1);
  tecla('Enter');
  assert.equal(A.$('note-name').textContent, 'Si', 'Intro toca la nota, como el dedo');
  A.$('note-name').textContent = '';
  strings.dispatchEvent({ type: 'keydown', key: 'Enter', repeat: true, target: A.doc.querySelector('.fret-cell[tabindex="0"]') });
  assert.equal(A.$('note-name').textContent, '', 'mantener Intro pulsado no repite la nota');
  A.doc.querySelector('.tab[data-screen="guess"]').click();
  c = A.doc.querySelector('.fret-cell[tabindex="0"]');
  assert.equal(c.getAttribute('aria-label'), '2ª cuerda, al aire', 'en Adivinar no se anuncia la nota');
  assert.deepEqual(sinErrores(A), []);
});

test('en Ajustes la fila entera cambia el interruptor, y el asa cierra deslizando (G-05)', async () => {
  const A = boot(APP);
  const antes = A.ev('state.showEquals');
  A.$('set-equals').closest('.set-row').querySelector('.txt').click();
  assert.equal(A.ev('state.showEquals'), !antes, 'tocar el texto de la fila cambia el interruptor');
  A.$('set-equals').click();
  assert.equal(A.ev('state.showEquals'), antes, 'el propio interruptor sigue funcionando, una sola vez');
  A.$('btn-settings').click();
  assert.ok(A.$('sheet').classList.contains('open'));
  const asa = A.$('sheet-handle');
  asa.dispatchEvent({ type: 'pointerdown', clientY: 100, pointerId: 7 });
  asa.dispatchEvent({ type: 'pointermove', clientY: 140, pointerId: 7 });
  await sleep(120);
  asa.dispatchEvent({ type: 'pointerup', clientY: 140, pointerId: 7 });
  assert.ok(A.$('sheet').classList.contains('open'), '40 px despacio no cierra');
  asa.dispatchEvent({ type: 'pointerdown', clientY: 100, pointerId: 8 });
  asa.dispatchEvent({ type: 'pointermove', clientY: 220, pointerId: 8 });
  asa.dispatchEvent({ type: 'pointerup', clientY: 220, pointerId: 8 });
  assert.ok(!A.$('sheet').classList.contains('open'), '120 px cierra');
});

test('en Adivinar ninguna casilla anuncia su nota a un lector de pantalla (J-12, G-05, AR-06 #1)', () => {
  const A = boot(APP);
  const strings = A.$('strings');
  // Se visitan casillas en Libre con el teclado; luego se pasa a Adivinar.
  for (let i = 0; i < 3; i++) strings.dispatchEvent({ type: 'keydown', key: 'ArrowRight', target: A.doc.querySelector('.fret-cell[tabindex="0"]') });
  A.doc.querySelector('.tab[data-screen="guess"]').click();
  const nombres = /\b(Do|Re|Mi|Fa|Sol|La|Si)#?\d/;
  const conNota = A.doc.querySelectorAll('.fret-cell').filter(c => nombres.test(c.getAttribute('aria-label') || ''));
  assert.equal(conNota.length, 0, 'ninguna etiqueta dice la nota');
  assert.ok(A.doc.querySelectorAll('.dot').every(d => d.getAttribute('aria-hidden') === 'true'), 'el texto del punto no se lee');
  A.doc.querySelector('.tab[data-screen="free"]').click();
  assert.match(A.doc.querySelector('.fret-cell[data-row="0"][data-fret="0"]').getAttribute('aria-label'), /^Mi4, 1ª cuerda, al aire$/, 'en Libre sí');
});

// --- F4.1: la app repartida en archivos ---

test('la app vive en css/ y js/: index.html los carga todos, en orden, y el ensamblado no deja nada fuera (G-08, F4.1)', () => {
  const raiz = path.join(__dirname, '..');
  const html = fs.readFileSync(path.join(raiz, 'index.html'), 'utf8');
  const cargados = [...html.matchAll(/<script src="(js\/[^"?]+)\?v=([^"]+)"><\/script>/g)].map(m => m[1]);
  // Cada archivo lleva la versión en su dirección, para que la caché del navegador
  // no mezcle archivos de dos versiones (AT-07 #3).
  const version = boot(APP).ev('APP_VERSION');
  for (const m of html.matchAll(/(?:src|href)="((?:js|css)\/[^"]+)"/g)) assert.ok(m[1].endsWith('?v=' + version), m[1] + ' sin ?v=' + version);
  const enDisco = fs.readdirSync(path.join(raiz, 'js')).filter(f => f.endsWith('.js')).map(f => 'js/' + f).sort();
  assert.deepEqual([...cargados].sort(), enDisco, 'cada archivo de js/ se carga una vez, y ninguno sobra');
  assert.deepEqual(cargados, [...cargados].sort(), 'en el orden de su número');
  assert.match(cargados.at(-1), /-arranque\.js$/, 'el arranque va el último: usa todo lo anterior');
  for (const f of cargados) assert.match(fs.readFileSync(path.join(raiz, f), 'utf8'), /^"use strict";\n/, f + ' empieza en modo estricto');
  const pagina = fuente(APP);
  assert.doesNotMatch(pagina, /<script src=|<link rel="stylesheet"/, 'el ensamblado lleva todo dentro');
  assert.equal((pagina.match(/<script>\n/g) || []).length, cargados.length);
});

// --- F4.3: afinador por micrófono ---

/** Micrófono simulado: getUserMedia da una pista y el analizador entrega una
 *  nota sintética de __senal.hz (0 = silencio). */
const microFalso = (permiso = true) => {
  const __mic = { pedido: 0, pista: null };          // la app lo ve como __mic
  return { __mic, isSecureContext: true, location: { protocol: 'https:' },
    navigator: { mediaDevices: { getUserMedia: async () => {
      __mic.pedido++;
      if (!permiso) { const e = new Error('no'); e.name = 'NotAllowedError'; throw e; }
      __mic.pista = { parada: false, stop(){ this.parada = true; } };
      return { getTracks: () => [__mic.pista] };
    } } } };
};
const analizadorFalso = `${audioFalso}
  globalThis.__senal = { hz: 0 };
  __ctx.sampleRate = 48000;
  __ctx.createMediaStreamSource = () => ({ connect(){}, disconnect(){} });
  __ctx.createAnalyser = () => ({ fftSize: 2048, getFloatTimeDomainData(x){
    for (let i = 0; i < x.length; i++){ let v = 0;
      if (__senal.hz) for (let k = 1; k <= 8; k++) v += 0.3 / k * Math.sin(2 * Math.PI * k * __senal.hz * i / 48000 + k);
      x[i] = v; } } });`;
const lectura = A => ({ nota: A.$('mic-note').textContent, detalle: A.$('mic-detail').textContent, orden: A.$('mic-order').textContent });

async function abrirMicro(A){
  A.ev(analizadorFalso);
  A.doc.querySelector('.tab[data-screen="tuner"]').click();
  A.doc.querySelector('#tuner-mode [data-v="mic"]').click();
}

test('afinador por micrófono: no escucha hasta que lo pides, y luego dice cuánto subir o bajar (A-02, A-03, A-04)', async () => {
  const A = boot(APP, null, microFalso());
  await abrirMicro(A);
  assert.equal(A.ev('__mic.pedido'), 0, 'elegir «Micrófono» no lo enciende');
  assert.equal(A.$('mic-intro').hidden, false);
  assert.match(A.$('mic-intro').textContent, /solo en tu dispositivo/);
  A.$('mic-start').click(); await sleep(10);
  assert.equal(A.$('mic-live').hidden, false);
  assert.match(A.$('mic-detail').textContent, /Toca una cuerda/);
  A.ev('__senal.hz = 110 * 2 ** (-12 / 1200)');            // La2, 12 cents baja
  await sleep(300);
  assert.deepEqual(lectura(A), { nota: 'La2', detalle: '−12 cents · 5ª cuerda', orden: '▲ Sube un poco' });
  A.ev('__senal.hz = 110 * 2 ** (3 / 1200)');
  await sleep(400);
  assert.equal(lectura(A).orden, '✓ Afinada', 'dentro de ±5 cents');
  A.ev('__senal.hz = 246.94 * 2 ** (-80 / 1200)');          // Si3 muy baja: sigue siendo la 2ª (A-04)
  await sleep(400);
  assert.deepEqual(lectura(A), { nota: 'Si3', detalle: '−80 cents · 2ª cuerda', orden: '▲ Sube' });
  A.ev('__senal.hz = 349.23');                               // Fa4: 1 semitono sobre la 1ª
  await sleep(400);
  assert.deepEqual(lectura(A), { nota: 'Mi4', detalle: '+100 cents · 1ª cuerda', orden: '▼ Baja' });
  A.ev('__senal.hz = 0');
  await sleep(2000);
  assert.match(A.$('mic-detail').textContent, /Toca una cuerda/, 'en silencio la aguja vuelve a reposo');
  A.doc.querySelector('.tab[data-screen="free"]').click();
  assert.equal(A.ev('__mic.pista.parada'), true, 'al salir del Afinador se apaga el micrófono');
});

test('con una cuerda elegida a mano, el afinador la usa aunque suene otra; y se apaga al ocultar la app (A-05)', async () => {
  const A = boot(APP, null, microFalso());
  await abrirMicro(A);
  A.$('mic-start').click(); await sleep(10);
  A.doc.querySelector('#mic-string [data-v="6"]').click();
  A.ev('__senal.hz = 110');                                  // suena un La2, pero la elegida es la 6ª (Mi2)
  await sleep(300);
  assert.deepEqual(lectura(A), { nota: 'Mi2', detalle: '+500 cents · 6ª cuerda', orden: '▼ Baja' });
  A.ev('__senal.hz = 2 * 82.41 * 2 ** (-7 / 1200)');        // el detector oye la octava: no dice «baja 12 semitonos»
  await sleep(400);
  assert.deepEqual(lectura(A), { nota: 'Mi2', detalle: '−7 cents · 6ª cuerda', orden: '▲ Sube un poco' });
  A.doc.hidden = true; (A.doc.listeners.visibilitychange || []).forEach(f => f({ type: 'visibilitychange' }));
  assert.equal(A.ev('__mic.pista.parada'), true, 'al bloquear el móvil se apaga');
  assert.equal(A.$('mic-live').hidden, true);
});

test('sin permiso se explica cómo darlo; sin micrófono posible, se dice por qué y De oído sigue (A-02, PL-04)', async () => {
  const A = boot(APP, null, microFalso(false));
  await abrirMicro(A);
  A.$('mic-start').click(); await sleep(10);
  assert.match(A.$('mic-why').textContent, /permiso/);
  assert.equal(A.$('mic-start').disabled, false, 'se puede volver a intentar');

  const B = boot(APP, null, { location: { protocol: 'file:' } });
  B.doc.querySelector('.tab[data-screen="tuner"]').click();
  B.doc.querySelector('#tuner-mode [data-v="mic"]').click();
  assert.match(B.$('mic-why').textContent, /archivo/);
  assert.equal(B.$('mic-start').disabled, true);
  B.doc.querySelector('#tuner-mode [data-v="ear"]').click();
  assert.equal(B.$('tuner-ear').hidden, false);
  assert.equal(B.doc.querySelectorAll('#strings-tuner .tstring').length || B.$('strings-tuner').children.length, 6, 'De oído sigue con sus 6 cuerdas');
  assert.equal(JSON.parse(B.store.get('trasteando.v1')).tunerMode, 'ear', 'el modo se guarda');
});

test('cuerda automática: cada cuerda, 90 cents baja o alta, se identifica bien; también en Drop D (A-04)', async () => {
  const A = boot(APP, null, microFalso());
  await abrirMicro(A);
  A.$('mic-start').click(); await sleep(10);
  const hz = m => 440 * 2 ** ((m - 69) / 12);
  const comprobar = async (midi, cents, cuerda) => {
    A.ev(`mic.lecturas = []; __senal.hz = ${hz(midi) * 2 ** (cents / 1200)}`);
    await sleep(250);
    assert.match(A.$('mic-detail').textContent, new RegExp(`cents · ${cuerda}ª cuerda$`), `${midi} a ${cents} cents → ${cuerda}ª`);
  };
  const estandar = [64, 59, 55, 50, 45, 40];          // 1ª … 6ª
  for (const [i, midi] of estandar.entries())
    for (const c of [-90, 90]) await comprobar(midi, c, i + 1);
  const sel = A.$('tuning-select'); sel.value = 'dropd'; sel.dispatchEvent({ type: 'change', target: sel });
  await comprobar(38, -40, 6);                          // Re2 en Drop D
  assert.match(A.$('mic-note').textContent, /^Re2$/);
  A.doc.querySelector('.tab[data-screen="free"]').click();   // apaga el micrófono (y su temporizador)
});

test('cuerda automática: si el micrófono apenas capta la fundamental de la 6ª y se oye su octava, sigue siendo la 6ª (A-04, AT-07 #2)', async () => {
  const A = boot(APP, null, microFalso());
  await abrirMicro(A);
  A.ev(`__ctx.createAnalyser = () => ({ fftSize: 2048, getFloatTimeDomainData(x){
    for (let i = 0; i < x.length; i++){ let v = 0;      // solo armónicos pares: suena a Mi3
      for (const k of [2, 4, 6, 8]) v += 0.3 / k * Math.sin(2 * Math.PI * k * __senal.hz * i / 48000 + k);
      x[i] = v; } } })`);
  A.$('mic-start').click(); await sleep(10);
  A.ev('__senal.hz = 82.41 * 2 ** (-20 / 1200)');
  await sleep(300);
  assert.deepEqual(lectura(A), { nota: 'Mi2', detalle: '−20 cents · 6ª cuerda', orden: '▲ Sube un poco' });
  A.doc.querySelector('.tab[data-screen="free"]').click();
});

// --- F4.5: idioma (G-12) ---

test('idioma: cada texto existe en español y en inglés, y cada clave de la página tiene texto (G-12)', () => {
  const A = boot(APP);
  const es = JSON.parse(A.ev('JSON.stringify(Object.keys(TEXTOS.es).sort())'));
  const en = JSON.parse(A.ev('JSON.stringify(Object.keys(TEXTOS.en).sort())'));
  assert.deepEqual(en, es, 'las dos lenguas tienen las mismas claves');
  const html = fs.readFileSync(APP, 'utf8');
  const usadas = [...html.matchAll(/data-t(?:-aria|-title)?="([^"]+)"/g)].map(m => m[1]);
  assert.ok(usadas.length > 40);
  for (const k of usadas) assert.ok(es.includes(k), 'falta el texto de ' + k);
  // Y las claves que usa el código: t('…') con una clave literal.
  for (const f of fs.readdirSync(path.join(__dirname, '..', 'js')).filter(f => f !== '00-idioma.js')){   // su comentario usa t('clave') de ejemplo
    const src = fs.readFileSync(path.join(__dirname, '..', 'js', f), 'utf8');
    for (const m of src.matchAll(/\bt\('([\w.]+)'/g))   // una clave que acaba en «.» se completa en el código: basta con que exista alguna
      assert.ok(m[1].endsWith('.') ? es.some(k => k.startsWith(m[1])) : es.includes(m[1]) || m[1].startsWith('audio.'), `${f}: falta el texto de ${m[1]}`);
  }
});

test('idioma: en Ajustes se cambia a inglés y vuelve al español; se guarda y no toca la racha (G-12)', async () => {
  const A = boot(APP);
  jugar(A);
  A.ev('streak = 3; updateScore()');
  A.doc.querySelector('#set-lang [data-v="en"]').click();
  assert.equal(A.ev('state.lang'), 'en');
  assert.equal(JSON.parse(A.store.get('trasteando.v1')).lang, 'en');
  assert.equal(A.doc.documentElement.lang, 'en');
  const pestañas = A.doc.querySelectorAll('.tab [data-t]').map(e => e.textContent).join(' ');
  assert.equal(pestañas, 'Free Guess Tuner Scales Metronome Settings');
  assert.equal(A.$('sheet-title').textContent, 'Settings');
  assert.equal(A.$('st-streak').textContent, 'Streak 3', 'la racha sigue');
  assert.equal(A.$('st-record').textContent, 'Best 0 · Standard');
  assert.match(A.$('challenge-text').innerHTML, /Listen and find the note/);
  assert.match(A.$('zoom-label').textContent, /frets in view|Whole neck/);
  assert.equal(A.$('tuning-select').children[0].textContent, 'Standard (E A D G B E)');
  assert.match(A.doc.querySelector('.fret-cell[data-row="0"][data-fret="0"]').getAttribute('aria-label'), /^1st string, open$/);
  A.$('qb-hint-string').click();
  assert.match(A.$('qb-hint-string').textContent, /^Strings? \d/);
  assert.match(A.$('strings-tuner').textContent, /6th/, 'el afinador de oído numera en inglés');
  // Nada de español en lo que se ve del Afinador.
  A.doc.querySelector('.tab[data-screen="tuner"]').click();
  A.doc.querySelector('#tuner-mode [data-v="mic"]').click();
  const visto = ['tuner-mode', 'mic-string-label', 'mic-intro'].map(id => A.$(id).textContent).join(' ');
  assert.doesNotMatch(visto, /Afinación|Cuerda|micrófono|dispositivo|De oído/);
  A.doc.querySelector('#set-lang [data-v="es"]').click();
  assert.equal(A.$('sheet-title').textContent, 'Ajustes');
  assert.match(A.$('mic-intro').textContent, /escuchar con el micrófono/);
});

test('idioma: la primera vez sigue al navegador (inglés → C D E); restablecer no cambia el idioma (G-12)', async () => {
  const E = boot(APP, null, { navigator: { language: 'en-GB' } });
  assert.equal(E.ev('state.lang'), 'en');
  assert.equal(E.ev('state.notation'), 'anglo', 'en inglés, de entrada, C D E');
  assert.equal(E.$('gate-btn').textContent, 'Start');
  assert.equal(E.$('timbre-note').textContent, 'Nylon-string classical or steel-string acoustic', 'también los textos fijos de Ajustes');
  const C = boot(APP, null, { navigator: { languages: ['ca-ES', 'en'] } });
  assert.equal(C.ev('state.lang'), 'es', 'con catalán, español');
  const S = boot(APP, null, { navigator: { language: 'es-ES' } });
  assert.equal(S.ev('state.lang'), 'es');
  assert.equal(S.ev('state.notation'), 'latin');
  const G = boot(APP, { lang: 'en', notation: 'latin' }, { navigator: { language: 'es-ES' } });
  assert.equal(G.ev('state.lang'), 'en', 'lo elegido manda sobre el navegador');
  assert.equal(G.ev('state.notation'), 'latin', 'y la nomenclatura elegida se respeta');
  G.$('set-reset').click(); await sleep(20);
  assert.equal(G.ev('state.lang'), 'en');
  const H = boot(APP, { lang: 'es' }, { navigator: { language: 'en-US' } });
  H.$('set-reset').click(); await sleep(20);
  assert.equal(H.ev('state.notation'), 'latin', 'en español, restablecer deja Do Re Mi aunque el navegador esté en inglés');
});

// --- F5: Escalas ---

const escalasA = (preset) => { const A = boot(APP, preset); A.doc.querySelector('.tab[data-screen="scales"]').click(); return A; };
const celdasEscala = A => A.doc.querySelectorAll('.fret-cell.scale');
const elegir = (A, id, v) => { const s = A.$(id); s.value = v; s.dispatchEvent({ type: 'change', target: s }); };

test('Escalas › Mostrar: el mástil ilumina la escala con sus nombres escritos y la tónica con anillo; intervalos T y ST (E-01, E-03, E-04)', () => {
  const A = escalasA();
  assert.equal(A.$('scales-card').hidden, false);
  assert.ok(A.$('board').classList.contains('scales'));
  const pcs = new Set(celdasEscala(A).map(c => +c.dataset.midi % 12));
  assert.deepEqual([...pcs].sort((a, b) => a - b), [0, 2, 4, 5, 7, 9, 11], 'Do mayor');
  assert.ok(A.doc.querySelectorAll('.fret-cell.scale-tonic').every(c => +c.dataset.midi % 12 === 0));
  assert.equal(A.$('scale-line').textContent, 'DoTReTMiSTFaTSolTLaTSiSTDo');
  elegir(A, 'scale-tonic', '5');                                  // Fa mayor: Si♭, no La#
  const sib = A.doc.querySelector('.fret-cell[data-midi="70"]');
  assert.ok(sib.classList.contains('scale'));
  assert.equal(sib.querySelector('.dot').textContent, 'Si♭');
  elegir(A, 'scale-type', 'pentaMenor'); elegir(A, 'scale-tonic', '9');
  assert.equal(A.$('scale-line').textContent, 'LaT½DoTReTMiT½SolTLa');
  assert.equal(new Set(celdasEscala(A).map(c => +c.dataset.midi % 12)).size, 5);
  const guardado = JSON.parse(A.store.get('trasteando.v1'));
  assert.deepEqual([guardado.scaleId, guardado.scalePc], ['pentaMenor', 9]);
  A.doc.querySelector('.tab[data-screen="free"]').click();
  assert.equal(celdasEscala(A).length, 0, 'fuera de Escalas, el mástil de siempre');
  assert.equal(A.doc.querySelector('.fret-cell[data-midi="70"] .dot').textContent, 'La♯');
});

test('Escalas › Mostrar: el paso a paso sube la escala desde la tónica grave, suena y se resalta (E-06, P-03)', () => {
  const A = escalasA();
  A.ev('globalThis.__plays = []; playMidi = m => __plays.push(m);');
  assert.match(A.$('scale-step-text').textContent, /^Paso 1 de 8 · Do, la tónica$/);
  assert.equal(A.$('scale-prev').disabled, true);
  A.$('scale-next').click(); A.$('scale-next').click();
  assert.deepEqual(A.ev('JSON.stringify(__plays)'), '[50,52]', 'Re3 y Mi3, desde el Do3');
  assert.equal(A.$('scale-step-text').textContent, 'Paso 3 de 8 · Mi, un tono sobre Re');
  assert.ok(A.doc.querySelectorAll('.fret-cell.scale-step').every(c => +c.dataset.midi === 52));
  assert.ok(A.doc.querySelectorAll('.fret-cell.scale-step').length >= 2, 'todas las posiciones de ese Mi');
  assert.equal(A.$('staff').querySelectorAll('ellipse').length, 8, 'el pentagrama escribe la escala');
  for (let i = 0; i < 9; i++) A.$('scale-next').click();
  assert.match(A.$('scale-step-text').textContent, /^Paso 8 de 8 · Do, un semitono sobre Si$/);
  assert.equal(A.$('scale-next').disabled, true);
});

test('Escalas › Práctica: las notas de la escala cuentan una vez cada una; una ajena se marca y enseña las buenas (E-05)', async () => {
  const A = escalasA();
  A.doc.querySelector('#scale-mode [data-v="practice"]').click();
  assert.ok(A.$('board').classList.contains('practice'), 'las notas no se ven: se buscan');
  assert.equal(A.$('scale-count').textContent, '0 de 7');
  assert.equal(A.$('staff').querySelectorAll('ellipse').length, 0, 'el pentagrama no da la respuesta');
  const pulsa = midi => A.press(A.doc.querySelector('.fret-cell[data-midi="' + midi + '"]'));
  pulsa(48); pulsa(60);                                           // Do3 y Do4: la misma nota
  assert.equal(A.$('scale-count').textContent, '1 de 7');
  assert.match(A.$('scale-msg').textContent, /^✓ Do está en Do mayor$/);
  pulsa(54);                                                      // Fa#3
  assert.match(A.$('scale-msg').textContent, /^✗ Fa♯ no está en Do mayor$/);
  assert.ok(A.doc.querySelector('.fret-cell[data-midi="54"]').classList.contains('wrong'));
  assert.ok(A.$('board').classList.contains('reveal-scale'), 'un momento, se ven las buenas');
  assert.equal(A.$('scale-count').textContent, '1 de 7');
  for (const m of [50, 52, 53, 55, 57, 59]) pulsa(m);
  assert.equal(A.$('scale-count').textContent, '7 de 7');
  assert.match(A.$('scale-msg').textContent, /Todas/);
  assert.equal(A.$('staff').querySelectorAll('ellipse').length, 7);
  A.$('scale-reset').click();
  assert.equal(A.$('scale-count').textContent, '0 de 7');
  assert.equal(A.doc.querySelectorAll('.fret-cell.correct').length, 0);
  await sleep(10);
});

// --- Adivinar: al fallar, ver la respuesta o seguir intentando (J-13, tu petición del 21/10) ---

test('Adivinar con «Al fallar: Reintentar»: el reto sigue, la racha se rompe, y «Ver la respuesta» se rinde (J-13, J-10)', async () => {
  const A = boot(APP, { onMiss: 'retry' });
  A.ev('globalThis.__plays = []; playMidi = m => __plays.push(m);');
  jugar(A);
  A.ev('streak = 4');
  const reto = A.ev('challenge'), midi = A.ev('challenge.midi');
  const otra = A.doc.querySelectorAll('.fret-cell').find(c => +c.dataset.midi !== midi);
  A.press(otra);
  assert.equal(A.ev('streak'), 0, 'el fallo rompe la racha');
  assert.equal(A.ev('locked'), false, 'puedes seguir probando');
  assert.equal(A.ev('challenge'), reto, 'el mismo reto');
  assert.match(A.$('challenge-text').innerHTML, /No es esa/);
  assert.equal(A.$('qb-giveup').hidden, false, 'aparece «Ver la respuesta»');
  await sleep(1300);
  assert.equal(A.doc.querySelectorAll('.fret-cell.reveal').length, 0, 'no se revela sola');
  // Acertar tras fallar pasa al siguiente, pero no suma a la racha.
  A.press(A.doc.querySelectorAll('.fret-cell').find(c => +c.dataset.midi === midi));
  assert.equal(A.ev('streak'), 0);
  await sleep(1700);
  assert.notEqual(A.ev('challenge'), reto, 'reto nuevo');
  assert.equal(A.$('qb-giveup').hidden, true);
  // Rendirse: se ve y suena la respuesta en el acto.
  const m2 = A.ev('challenge.midi');
  A.press(A.doc.querySelectorAll('.fret-cell').find(c => +c.dataset.midi !== m2));
  A.$('qb-giveup').click();
  await sleep(20);
  assert.ok(A.doc.querySelectorAll('.fret-cell.reveal').length > 0);
  assert.equal(A.ev('__plays.at(-1)'), m2);
  assert.match(A.$('challenge-text').innerHTML, /Era/);
});

test('el ajuste «Al fallar» se guarda; por defecto se sigue intentando (J-13, tu decisión del 21/10)', () => {
  const A = boot(APP);
  assert.equal(A.ev('state.onMiss'), 'retry');
  A.doc.querySelector('#set-onmiss [data-v="reveal"]').click();
  assert.equal(JSON.parse(A.store.get('trasteando.v1')).onMiss, 'reveal');
  assert.equal(A.doc.querySelector('#set-onmiss [data-v="reveal"]').getAttribute('aria-pressed'), 'true');
  assert.equal(boot(APP, { onMiss: 'x' }).ev('state.onMiss'), 'retry');
});

// --- 0.5.3: lo que encontró la auditoría técnica AT-09 ---

test('Escalas queda coherente: lector y lector de pantalla con la escritura de la escala, salir, cambiar de afinación, Restablecer y dos fallos seguidos (AT-09)', async () => {
  const A = escalasA({ scaleId: 'mayor', scalePc: 5 });          // Fa mayor
  const celda = m => A.doc.querySelector('.fret-cell[data-midi="' + m + '"]');
  // #5: en Fa mayor, la tecla de La♯/Si♭ se lee Si♭ en todas partes.
  A.press(celda(58));
  assert.equal(A.$('note-name').textContent, 'Si♭');
  assert.match(celda(58).getAttribute('aria-label'), /^Si♭3, /);
  // Pentagrama: el Si♭ va en la línea del Si, no en el hueco del La (F5.1).
  const cy = svg => +svg.querySelectorAll('ellipse')[0].getAttribute('cy');
  const fa = A.$('staff');
  assert.equal(A.ev("staffYEscrita({letra:6,alt:-1},58)"), A.ev("staffYEscrita({letra:6,alt:0},59)"));
  // #2: al salir, el pentagrama vuelve a ser de una nota, con tu escritura.
  A.doc.querySelector('.tab[data-screen="free"]').click();
  assert.equal(fa.getAttribute('viewBox'), '0 0 176 132', 'el pentagrama ya no enseña la escala');
  assert.equal(fa.querySelectorAll('ellipse').length, 1);
  assert.equal(A.$('note-name').textContent, 'La♯', 'fuera de la escala, tu preferencia');
  assert.ok(cy(fa) > 0);
  // #3: cambiar de afinación reinicia la práctica (las casillas suenan a otra nota).
  A.doc.querySelector('.tab[data-screen="scales"]').click();
  A.doc.querySelector('#scale-mode [data-v="practice"]').click();
  A.press(celda(53));
  assert.equal(A.$('scale-count').textContent, '1 de 7');
  elegir(A, 'tuning-select', 'dropd');
  assert.equal(A.$('scale-count').textContent, '0 de 7');
  assert.equal(A.doc.querySelectorAll('.fret-cell.correct').length, 0);
  // #4: dos fallos seguidos; ninguna casilla se queda roja.
  A.press(celda(54)); await sleep(300); A.press(celda(56));
  await sleep(1700);
  assert.equal(A.doc.querySelectorAll('.fret-cell.wrong').length, 0, 'ninguna casilla roja pegada');
  // #1: Restablecer devuelve selectores y botones a lo de fábrica.
  A.$('qb-notation').click();                                    // C D E
  elegir(A, 'scale-type', 'menor'); elegir(A, 'scale-tonic', '9');
  A.$('set-reset').click();
  await sleep(10);
  assert.equal(A.$('scale-type').value, 'mayor');
  assert.equal(A.$('scale-tonic').value, '0');
  assert.equal(A.doc.querySelector('#set-accidentals [data-pc="6"][data-v="flat"]').textContent, 'Sol♭');
  assert.ok(A.doc.querySelectorAll('.fret-cell.scale').length > 0, 'el mástil enseña Do mayor');
  await sleep(10);
});

test('Adivinar en «Reintentar»: dos fallos seguidos no dejan casillas rojas; pausado al ocultar la app, «Ver la respuesta» no se ofrece (AT-09)', async () => {
  const A = boot(APP);
  A.ev('playMidi = () => {}');
  jugar(A);
  const midi = A.ev('challenge.midi');
  const otras = A.doc.querySelectorAll('.fret-cell').filter(c => +c.dataset.midi !== midi && (+c.dataset.midi % 12) !== (midi % 12));
  A.press(otras[0]); await sleep(300); A.press(otras[5]);
  await sleep(1100);
  assert.equal(A.doc.querySelectorAll('.fret-cell.wrong').length, 0);
  assert.equal(A.$('qb-giveup').hidden, false);
  A.ev('guessStarted = false; renderChallenge()');
  assert.equal(A.$('qb-giveup').hidden, true, 'primero ▶');
});

// --- 0.5.2: ♯ o ♭ por cada tecla negra (N-06, tu comentario del 21/10) ---

test('cada tecla negra se escribe con ♯ o con ♭ según Ajustes, igual en toda la app; dentro de una escala manda la escala (N-06)', () => {
  const A = boot(APP);
  const dot = m => A.doc.querySelector('.fret-cell[data-midi="' + m + '"] .dot').textContent;
  assert.equal(dot(54), 'Fa♯', 'por defecto, sostenido');
  const sol_b = A.doc.querySelector('#set-accidentals [data-pc="6"][data-v="flat"]');
  assert.equal(sol_b.textContent, 'Sol♭');
  sol_b.click();
  assert.equal(dot(54), 'Sol♭');
  assert.equal(dot(66), 'Sol♭', 'todas las de esa tecla');
  assert.equal(dot(56), 'Sol♯', 'las demás no cambian');
  assert.deepEqual(JSON.parse(A.store.get('trasteando.v1')).accidentals, { 6: 'flat' });
  A.press(A.doc.querySelector('.fret-cell[data-midi="54"]'));
  assert.equal(A.$('note-name').textContent, 'Sol♭');
  assert.ok(A.$('staff').querySelectorAll('text').some(t => t.textContent === '♭'), 'el pentagrama la escribe con ♭');
  // En Sol mayor, el Fa♯ es Fa♯ aunque prefieras Sol♭.
  A.doc.querySelector('.tab[data-screen="scales"]').click();
  const s = A.$('scale-tonic'); s.value = '7'; s.dispatchEvent({ type: 'change', target: s });
  assert.equal(dot(54), 'Fa♯');
  A.doc.querySelector('.tab[data-screen="free"]').click();
  assert.equal(dot(54), 'Sol♭');
  // Con C D E, los botones dicen «G♭».
  A.$('qb-notation').click();
  assert.equal(A.doc.querySelector('#set-accidentals [data-pc="6"][data-v="flat"]').textContent, 'G♭');
  assert.equal(boot(APP, { accidentals: { 6: 'flat', 2: 'flat', 8: 'x' } }).ev('JSON.stringify(state.accidentals)'), '{"6":"flat"}');
});

// --- F5.6: metrónomo (MT-01 a MT-05, tu petición del 21/10) ---

/** Lo que el metrónomo necesita del audio simulado: osciladores que apuntan
 *  cuándo arrancan, y un reloj (__ctx.currentTime) que avanza a mano. */
const metroExtra = `
  __ctx.createBuffer = () => ({});
  __ctx.createOscillator = () => { const n = new Nodo('oscilador'); n.frequency = { value: 0 }; n.arranques = [];
    n.start = t => n.arranques.push(t); n.stop = () => {}; return n; };
  globalThis.__golpes = () => __nodos.filter(n => n.tipo === 'oscilador').map(n => [n.arranques[0], n.frequency.value]);
  globalThis.__avanza = hasta => { while (__ctx.currentTime < hasta){ __ctx.currentTime += 0.025; metroProgramar(); } };`;
const metroFalso = audioFalso + metroExtra;

test('metrónomo: cada golpe cae a 60/tempo s exactos a 30, 120 y 250 ppm, programado por adelantado; el primero, con acento (MT-01, MT-04)', t => {
  for (const bpm of [30, 120, 250]){
    const A = boot(APP, { metro: { bpm, sig: '4/4', sub: 1, accent: true } });
    A.ev(metroFalso);
    A.ev('startMetro()');
    t.after(() => A.ev('stopMetro()'));        // aunque algo falle, no se queda sonando
    A.ev(`__avanza(${10 + 9 * 60 / bpm})`);
    const g = JSON.parse(A.ev('JSON.stringify(__golpes())'));
    assert.ok(g.length >= 9, bpm + ' ppm: ' + g.length + ' golpes');
    for (let i = 1; i < g.length; i++)
      assert.ok(Math.abs(g[i][0] - g[i - 1][0] - 60 / bpm) < 0.001, bpm + ' ppm, golpe ' + i + ': ' + (g[i][0] - g[i - 1][0]));
    assert.deepEqual(g.slice(0, 5).map(x => x[1]), [1760, 1175, 1175, 1175, 1760], 'fuerte, normal, normal, normal, fuerte');
    assert.ok(g.at(-1)[0] <= A.ev('__ctx.currentTime') + 0.1 + 1e-9, 'nunca más de 100 ms por adelantado');
    assert.equal(A.ev('stopMetro()'), true);
  }
});

test('metrónomo: compás y figura en su ventana, acento en el primer tiempo, un punto por pulso (MT-02, MT-03, MT-05)', t => {
  const A = boot(APP);
  A.ev(metroFalso);
  t.after(() => A.ev('stopMetro()'));
  A.doc.querySelector('.tab[data-screen="metro"]').click();
  const puntos = () => A.doc.querySelectorAll('#metro-dots .md');
  assert.equal(puntos().length, 4, '4/4: cuatro puntos');
  assert.ok(puntos()[0].classList.contains('acc'), 'el primero, con acento: más grande');
  A.$('metro-sig').click();
  assert.equal(A.$('metro-picker').hidden, false, 'tocar el compás abre su ventana');
  assert.equal(A.doc.querySelectorAll('#metro-sigs .mp-sig').length, 12);
  A.doc.querySelector('#metro-sigs [data-v="3/4"]').click();
  const acento = A.$('metro-accent'); acento.checked = false; acento.dispatchEvent({ type: 'change', target: acento });
  A.doc.querySelector('#metro-sub [data-v="2"]').click();          // dos por pulso: corcheas
  A.$('metro-ok').click();
  assert.equal(A.$('metro-picker').hidden, true, '«Listo» la cierra');
  assert.equal(puntos().length, 3);
  assert.ok(!puntos()[0].classList.contains('acc'));
  assert.equal(A.$('metro-sig').textContent, '34', 'el compás, un número sobre otro');
  assert.deepEqual(JSON.parse(A.store.get('trasteando.v1')).metro, { bpm: 80, sig: '3/4', sub: 2, accent: false });
  A.$('metro-play').click();
  assert.equal(A.$('metro-play').textContent, 'Parar');
  A.ev('__avanza(10 + 3 * 60 / 80)');                              // un compás
  let g = JSON.parse(A.ev('JSON.stringify(__golpes())'));
  assert.deepEqual(g.slice(0, 6).map(x => x[1]), [1175, 880, 1175, 880, 1175, 880], 'sin acento: todos los pulsos iguales');
  assert.ok(Math.abs(g[1][0] - g[0][0] - 60 / 80 / 2) < 0.001, 'la corchea parte el pulso por la mitad');
  const vol = JSON.parse(A.ev(`JSON.stringify(__nodos.filter(n => n.tipo === 'oscilador').map(n => n.destino.gain.ev[1][1]))`));
  assert.ok(vol[1] < vol[0], 'la subdivisión suena más suave');
  A.ev('setAccent(true)');
  A.ev('__avanza(10 + 3 * 3 * 60 / 80)');
  g = JSON.parse(A.ev('JSON.stringify(__golpes())'));
  assert.ok(g.some(x => x[1] === 1760), 'con acento, el primer pulso suena más agudo');
  A.$('metro-play').click();
  // Compases compuestos: el pulso es la negra con puntillo.
  for (const [c, n] of [['6/8', 2], ['9/8', 3], ['12/8', 4], ['7/8', 7], ['1/4', 1]]){
    A.ev(`setCompas('${c}')`);
    assert.equal(puntos().length, n, c + ': ' + n + ' puntos');
  }
  A.ev("setCompas('9/8'); renderPicker()");
  assert.equal(A.doc.querySelector('#metro-sub [data-v="3"]').getAttribute('aria-label'), 'Tres por pulso (corcheas)');
  // Lo guardado se valida: un dato roto vuelve al de fábrica.
  assert.equal(boot(APP, { metro: { bpm: 400, sig: '9/4', sub: 7, accent: 'sí' } }).ev('JSON.stringify(state.metro)'),
    '{"bpm":80,"sig":"4/4","sub":1,"accent":true}');
});

test('metrónomo: tempo con la barra vertical, − y +, el teclado y «Marcar», siempre entre 30 y 250, con su nombre (MT-01, G-02)', () => {
  const A = boot(APP);
  A.doc.querySelector('.tab[data-screen="metro"]').click();
  assert.equal(A.$('metro').hidden, false);
  assert.equal(A.$('board-area').hidden, true, 'sin mástil, como el Afinador');
  assert.equal(A.$('panel').hidden, true);
  assert.equal(A.$('rotate-hint').hidden, true, 'no pide girar el móvil');
  assert.equal(A.$('metro-name').textContent, 'Andante');
  A.$('metro-plus').click();
  assert.equal(A.$('metro-bpm').textContent, '81');
  A.$('metro-minus').click(); A.$('metro-minus').click();
  assert.equal(A.ev('state.metro.bpm'), 79);
  const barra = A.$('metro-slider');
  const tecla = key => barra.dispatchEvent({ type: 'keydown', key, preventDefault(){} });
  tecla('ArrowUp'); tecla('PageUp');
  assert.equal(A.ev('state.metro.bpm'), 90);
  assert.equal(barra.getAttribute('aria-valuenow'), '90');
  tecla('End');
  assert.equal(A.ev('state.metro.bpm'), 250);
  assert.equal(A.$('metro-plus').disabled, true);
  assert.equal(A.$('metro-name').textContent, 'Prestissimo');
  tecla('Home');
  assert.equal(A.$('metro-name').textContent, 'Grave');
  A.ev('setTempo(50)');
  assert.equal(A.$('metro-name').textContent, 'Lento', 'como en la app de referencia');
  A.ev('tapTempo(1000); tapTempo(1500); tapTempo(2000); tapTempo(2500)');
  assert.equal(A.ev('state.metro.bpm'), 120, 'cuatro toques cada medio segundo: 120');
  assert.equal(A.$('metro-name').textContent, 'Allegro');
  A.ev('tapTempo(6000)');                                       // tras una pausa, empieza de nuevo
  assert.equal(A.ev('state.metro.bpm'), 120);
  assert.match(A.$('metro-note').textContent, /Sigue tocando/);
  A.ev('tapTempo(6100)');                                       // 600 ppm: se queda en 250
  assert.equal(A.ev('state.metro.bpm'), 250);
});

test('metrónomo: sigue en las demás áreas con su pestaña latiendo; se para al escuchar con el micrófono y al ocultar la app (MT-04, MT-05)', async t => {
  const A = boot(APP, null, microFalso());
  A.ev(analizadorFalso + metroExtra);
  t.after(() => A.ev('stopMetro(); stopMic()'));
  const pestaña = A.doc.querySelector('.tab[data-screen="metro"]');
  pestaña.click();
  A.$('metro-play').click();
  A.doc.querySelector('.tab[data-screen="free"]').click();
  assert.equal(A.ev('metro.sonando'), true, 'sigue sonando en Libre');
  assert.ok(pestaña.classList.contains('metro-on'));
  assert.match(pestaña.getAttribute('aria-label'), /en marcha/);
  A.ev('__avanza(10.2)'); await sleep(15);
  assert.ok(pestaña.classList.contains('beat'), 'la pestaña late con el pulso');
  // El micrófono lo para, y lo dice.
  A.doc.querySelector('.tab[data-screen="tuner"]').click();
  A.doc.querySelector('#tuner-mode [data-v="mic"]').click();
  A.$('mic-start').click(); await sleep(10);
  assert.equal(A.ev('metro.sonando'), false);
  assert.equal(A.$('mic-metro').hidden, false);
  assert.match(A.$('mic-metro').textContent, /clic confundiría al afinador/);
  assert.ok(!pestaña.classList.contains('metro-on'));
  A.ev('stopMic()');
  // Con la app oculta, también.
  pestaña.click();
  A.$('metro-play').click();
  assert.equal(A.ev('metro.sonando'), true);
  A.ev('document.hidden = true; onVisibility(); document.hidden = false;');
  assert.equal(A.ev('metro.sonando'), false);
  assert.match(A.$('metro-note').textContent, /al salir de la app/);
  assert.equal(A.$('metro-play').textContent, 'Empezar');
});

test('metrónomo: cambiar el tempo o la subdivisión mientras suena no adelanta ni repite golpes (MT-04)', t => {
  const A = boot(APP, { metro: { bpm: 60, sig: '4/4', sub: 1, accent: true } });
  A.ev(metroFalso);
  A.ev('startMetro()');
  t.after(() => A.ev('stopMetro()'));
  A.ev('__avanza(12.5)');                     // golpes a 10,06, 11,06 y 12,06
  A.ev('setTempo(120)');                      // el siguiente sigue a 13,06; desde ahí, cada 0,5 s
  A.ev('__avanza(14.6)');
  A.ev('setSubdivision(2)');                  // empieza en el próximo tiempo, 15,06
  A.ev('__avanza(15.9)');
  const g = JSON.parse(A.ev('JSON.stringify(__golpes().map(x => x[0]))'));
  const pasos = g.slice(1).map((x, i) => Math.round((x - g[i]) * 1000) / 1000);
  assert.deepEqual(pasos, [1, 1, 1, 0.5, 0.5, 0.5, 0.5, 0.25, 0.25, 0.25]);
});
