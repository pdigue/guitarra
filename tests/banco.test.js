// Banco de pruebas de Trasteando. Se ejecuta desde la carpeta del proyecto con:  node --test
// (Node busca solo los archivos *.test.js; no hace falta instalar nada).
// Cada prueba cita los requisitos que verifica (ver docs/matriz-cumplimiento.md).
'use strict';
const assert = require('node:assert/strict');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
// Desde la 0.6.0 (F6.1, G-08) este banco se pasa dos veces: aquí, contra la app de
// varios archivos (index.html con css/ y js/), y desde autonomo.test.js, contra el
// archivo autónomo (dist/trasteando.html), con «[autónomo]» delante de cada nombre
// para saber cuál de las dos formas falla. `test` y `unaVez` vienen de dom-minimo.js:
// lo que compara las dos formas entre sí, o lee archivos del repositorio en vez de
// la app, se marca con `unaVez` y solo corre en la primera pasada.
const { boot, sleep, fuente, test, unaVez } = require('./dom-minimo');

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
// Carga lenta simulada: cada grabación queda pendiente hasta terminarCargas().
// En la app de varios archivos se sustituye la descarga (fetchAndDecode); en el
// archivo autónomo la app lee de verdad el audio incrustado y lo que se sustituye
// es el último paso, decodificarlo, que necesita un altavoz (G-08, F6.1).
const cargaFalsa = `globalThis.__pend = [];
  globalThis.__buf = { sampleRate: 44100, getChannelData: () => { const d = new Float32Array(2000); d.fill(0.5, 1000); return d; } };
  fetchAndDecode = url => new Promise(r => __pend.push(() => r(__buf)));
  decodeData = datos => new Promise(r => __pend.push(() => r(__buf)));`;
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

unaVez('el ensamblador nombra cada módulo del autónomo y se niega a incrustar uno que cortaría la página (G-08, F6.1)', () => {
  const { scripts } = require('../herramientas/ensamblar');
  // El autónomo trae los mismos módulos que index.html, en el mismo orden, con su
  // nombre (//# sourceURL) y el mismo código.
  const raiz = path.join(__dirname, '..');
  const sueltos = scripts(path.join(raiz, 'index.html'));
  const dentro = scripts(path.join(raiz, 'dist', 'trasteando.html'));
  assert.deepEqual(dentro.map(s => s.nombre), sueltos.map(s => s.nombre));
  // (si un módulo no acabara en salto de línea, el ensamblador se lo añade)
  const conSalto = c => c.endsWith('\n') ? c : c + '\n';
  dentro.forEach((s, i) => assert.equal(s.codigo, conSalto(sueltos[i].codigo) + '//# sourceURL=' + s.nombre + '\n', s.nombre));
  // El código va pegado a <script>: un salto ahí contaría como primera línea del módulo
  // y el navegador daría cada línea con una de más (AT-12 #2).
  assert.doesNotMatch(fs.readFileSync(path.join(raiz, 'dist', 'trasteando.html'), 'utf8'), /<script>\n/);
  // Un módulo con «</script» dentro: como archivo suelto funciona, incrustado cortaría la página.
  const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'trasteando-'));
  try {
    fs.mkdirSync(path.join(tmp, 'js'));
    fs.writeFileSync(path.join(tmp, 'index.html'), '<body>\n<script src="js/a.js"></script>\n</body>\n');
    fs.writeFileSync(path.join(tmp, 'js', 'a.js'), "const x = 1;\nconst y = '</script>';\n");
    assert.throws(() => fuente(path.join(tmp, 'index.html')), /js\/a\.js, línea 2: contiene «<\/script»/);
    // Y con «<!--», que dejaría sin efecto el cierre de verdad (AT-12 #3).
    fs.writeFileSync(path.join(tmp, 'js', 'a.js'), "const x = '<!--';\n");
    assert.throws(() => fuente(path.join(tmp, 'index.html')), /js\/a\.js, línea 1: contiene «<!--»/);
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
});

unaVez('cada archivo de pruebas que arranca la app se pasa también contra el autónomo (G-08, AT-12 #1)', () => {
  const autonomo = fs.readFileSync(path.join(__dirname, 'autonomo.test.js'), 'utf8');
  const conApp = fs.readdirSync(__dirname).filter(f => f.endsWith('.test.js') && f !== 'autonomo.test.js')
    .filter(f => /boot\(APP\b/.test(fs.readFileSync(path.join(__dirname, f), 'utf8')));
  assert.ok(conApp.includes('banco.test.js') && conApp.includes('escalas.test.js'), 'la búsqueda no encuentra los conocidos');
  for (const f of conApp) assert.ok(autonomo.includes(`require('./${f}')`), f + ' arranca la app y no se pasa contra el autónomo');
});

unaVez('el archivo autónomo está al día con la app, con su audio y dentro de sus límites (G-07, G-08, F2.3)', () => {
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

test('en Adivinar la lectura (pequeña desde la 0.6.3) es la nota que tocas; cada pista encendida enseña su respuesta en grande, también antes de ▶ (J-06, comentario del 21/10)', async () => {
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

test('con pistas encendidas en Adivinar, sin aviso para girar; vuelve al apagarlas y al cambiar de área (V-01, J-14)', async () => {
  const A = boot(APP, null, DEDO);
  A.doc.querySelector('.tab[data-screen="guess"]').click();
  await sleep(20);
  assert.equal(A.doc.body.classList.contains('con-pistas'), false, 'sin pistas, el aviso sigue');
  A.$('qb-hint-string').click();
  await sleep(20);
  assert.equal(A.doc.body.classList.contains('con-pistas'), true, 'con una pista, se esconde (css)');
  A.doc.querySelector('.tab[data-screen="free"]').click();
  await sleep(20);
  assert.equal(A.doc.body.classList.contains('con-pistas'), false, 'en Libre no hay pistas');
  A.doc.querySelector('.tab[data-screen="guess"]').click();
  A.$('qb-hint-string').click();
  await sleep(20);
  assert.equal(A.doc.body.classList.contains('con-pistas'), false, 'al apagarla, vuelve');
});

test('zoom de inicio en el móvil en horizontal: los trastes que caben a 40 px, sin las zonas seguras (V-04)', () => {
  const zonas = (izq, der) => ({ getComputedStyle: el => ({ paddingLeft: izq + 'px', paddingRight: der + 'px', getPropertyValue: () => '' }),
    matchMedia: q => ({ matches: /coarse|landscape/.test(q) }) });
  const trastes = (w, h, izq, der) => boot(APP, null, Object.assign({ innerWidth: w, innerHeight: h }, zonas(izq, der))).ev('defaultVisibleFrets()');
  assert.equal(trastes(932, 430, 59, 59), 11, 'iPhone Pro Max instalado (antes, 17 de 28 px)');
  assert.equal(trastes(852, 393, 59, 59), 9, 'iPhone 15 Pro instalado (antes, 10 de 38 px)');
  assert.equal(trastes(750, 342, 0, 0), 10, 'iPhone con Safari, como antes');
});

unaVez('MOVIL_H_RESTO (js/06-zoom.js) cuadra con el css: raíl de 64 px, panel de Adivinar de 204 y relleno del mástil de 6 + 6 (AT-22 M1)', () => {
  const css = fs.readFileSync(path.join(__dirname, '..', 'css', 'trasteando.css'), 'utf8');
  const zoom = fs.readFileSync(path.join(__dirname, '..', 'js', '06-zoom.js'), 'utf8');
  assert.match(zoom, /const MOVIL_H_RESTO = 64 \+ 204 \+ 12;/);
  assert.match(css, /body \{ display:grid; grid-template-columns:64px minmax\(0,1fr\) 176px;/);
  assert.match(css, /body\[data-screen="guess"\] \{ grid-template-columns:64px minmax\(0,1fr\) 204px; \}/);
  assert.match(css, /#board-area \{ grid-column:2; grid-row:1; min-height:0; padding:6px 6px 2px; \}/);
  assert.match(zoom, /\(orientation:landscape\) and \(max-height:520px\)/);
  assert.match(css, /@media \(orientation:landscape\) and \(max-height:520px\)\{\n  body \{ display:grid/);
  // Y la clave vieja del fallo largo ya no se usa (se borró en la 0.6.12).
  for (const f of fs.readdirSync(path.join(__dirname, '..', 'js')))
    assert.doesNotMatch(fs.readFileSync(path.join(__dirname, '..', 'js', f), 'utf8'), /guess\.tryAgain/, f);
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

test('en un marco aislado, donde history existe pero lanza SecurityError, la app arranca y navega sin historial (C-07, PL-04, 0.6.6)', () => {
  // Como la vista previa de un chat: pushState y replaceState están, pero fallan.
  const prohibido = () => { const e = new Error('Failed to execute pushState'); e.name = 'SecurityError'; throw e; };
  const h = { state: null, pushState: prohibido, replaceState: prohibido, back(){} };
  const B = boot(APP, null, { history: h });
  assert.equal(B.ev('canHistory'), false);
  assert.ok(B.doc.querySelectorAll('#board .fret-cell').length > 0, 'el mástil se dibuja');
  B.doc.querySelector('.tab[data-screen="chords"]').click();
  assert.equal(B.ev('screen'), 'chords');
  assert.ok(B.doc.querySelectorAll('#board .finger').length > 0, 'y Acordes también');
  B.$('btn-settings').click(); B.$('sheet-bg').click();
  assert.ok(!B.$('sheet').classList.contains('open'));
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
  // Un bloque por módulo, cada uno con su nombre (F6.1).
  assert.deepEqual([...pagina.matchAll(/\/\/# sourceURL=(\S+)\n<\/script>/g)].map(m => m[1]), cargados);
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
  // Al callar, lo último medido se queda a la vista, atenuado, y luego vuelve a reposo (F5.8 #2).
  A.ev('__senal.hz = 0');
  await sleep(1000);
  assert.equal(lectura(A).nota, 'Mi4', 'un segundo después sigue a la vista');
  assert.ok(A.$('mic-live').classList.contains('held'), 'atenuada: ya no se oye');
  assert.equal(A.$('mic-detail').textContent, 'Última lectura · +100 cents · 1ª cuerda', 'y lo dice con palabras (AR-15 #7)');
  // Elegir cuerda con una lectura a la vista la repinta con esa cuerda, sin perderla (AT-14 #3).
  A.doc.querySelector('#mic-string [data-v="2"]').click();
  assert.equal(lectura(A).nota, 'Si3');
  assert.match(A.$('mic-detail').textContent, /^Última lectura · .* · 2ª cuerda$/);
  await sleep(2200);
  assert.match(A.$('mic-detail').textContent, /Toca una cuerda/, 'en silencio la aguja vuelve a reposo');
  assert.ok(!A.$('mic-live').classList.contains('held'));
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
  // Solo el HTML, sin el código: en el archivo autónomo los módulos van dentro de la
  // página, y el ejemplo del comentario de 00-idioma.js parecería una clave más.
  const html = fs.readFileSync(APP, 'utf8').replace(/<script[^>]*>[\s\S]*?<\/script>/g, '');
  const usadas = [...html.matchAll(/data-t(?:-aria|-title|-placeholder)?="([^"]+)"/g)].map(m => m[1]);
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
  assert.equal(pestañas, 'Free Guess Tuner Scales Chords Metronome Settings');
  assert.equal(A.$('sheet-title').textContent, 'Settings');
  assert.equal(A.$('st-streak').textContent, 'Streak 3', 'la racha sigue');
  assert.equal(A.$('st-record').textContent, 'Best 0 · Standard');
  assert.match(A.$('challenge-text').innerHTML, /Listen and find it/);
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

test('Escalas: el mástil ilumina una posición de la escala con sus nombres escritos y la tónica con anillo; intervalos T y ST (E-01, E-03, E-04)', () => {
  const A = escalasA();
  assert.equal(A.$('scales-card').hidden, false);
  assert.ok(A.$('board').classList.contains('scales'));
  const pcs = new Set(celdasEscala(A).map(c => +c.dataset.midi % 12));
  assert.deepEqual([...pcs].sort((a, b) => a - b), [0, 2, 4, 5, 7, 9, 11], 'Do mayor');
  assert.equal(celdasEscala(A).length, 18, 'una posición: 3 notas en cada cuerda, no todo el mástil');
  assert.ok(A.doc.querySelectorAll('.fret-cell.scale-tonic').every(c => +c.dataset.midi % 12 === 0));
  assert.equal(A.$('scale-line').textContent, 'DoTReTMiSTFaTSolTLaTSiSTDo');
  elegir(A, 'scale-tonic', '5');                                  // Fa mayor: Si♭, no La#
  const sib = celdasEscala(A).find(c => +c.dataset.midi % 12 === 10);
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

test('Escalas: el paso a paso sube la posición desde la nota más grave, suena y se resalta (E-06, P-03)', () => {
  const A = escalasA();
  A.ev('globalThis.__plays = []; playMidi = m => __plays.push(m);');
  assert.match(A.$('scale-step-text').textContent, /^Paso 1 de 18 · Do, la tónica$/);
  assert.equal(A.$('scale-prev').disabled, true);
  A.$('scale-next').click(); A.$('scale-next').click();
  assert.deepEqual(A.ev('JSON.stringify(__plays)'), '[50,52]', 'Re3 y Mi3, desde el Do3');
  assert.equal(A.$('scale-step-text').textContent, 'Paso 3 de 18 · Mi, un tono sobre Re');
  const paso = A.doc.querySelectorAll('.fret-cell.scale-step');
  assert.equal(paso.length, 1, 'solo la casilla de la posición, no todos los Mi');
  assert.equal(+paso[0].dataset.midi, 52);
  assert.equal(A.doc.querySelector('#scale-line .now').textContent, 'Mi', 'los intervalos resaltan el grado');
  assert.equal(A.$('staff').querySelectorAll('ellipse').length, 8, 'el pentagrama escribe 8 notas de la posición');
  for (let i = 0; i < 20; i++) A.$('scale-next').click();
  assert.match(A.$('scale-step-text').textContent, /^Paso 18 de 18 · Fa, un semitono sobre Mi$/);
  assert.equal(A.$('scale-next').disabled, true);
});

test('Escalas: una posición cada vez; la 1 es la de la tónica y la vista la sigue (E-07, tu decisión del 15/11)', () => {
  const A = escalasA();
  const pos = () => A.$('scale-pos').querySelector('.sc-long').textContent;
  assert.equal(pos(), 'Posición 1 de 7 · trastes 8 a 13', 'Do mayor: la 1 empieza en el Do de la 6.ª, traste 8');
  assert.equal(A.$('scale-pos').querySelector('.sc-short').textContent, '1/7', 'en corto, para el móvil');
  assert.equal(A.$('scale-pos-prev').disabled, true);
  A.$('scale-pos-next').click();
  assert.equal(pos(), 'Posición 2 de 7 · trastes 10 a 15');
  assert.match(A.$('scale-step-text').textContent, /^Paso 1 de 18 · Re: aquí empieza la posición$/);
  A.$('scale-pos-next').click();
  assert.equal(pos(), 'Posición 3 de 7 · trastes 0 a 5', 'pasado el traste 11, sigue desde la cejuela: la abierta');
  // Las posiciones, como en los libros: 3 notas por cuerda; 2 en las pentatónicas.
  const formas = JSON.parse(A.ev(`JSON.stringify(posicionesEscala().map(p => p.map(n => n.traste).join(',')))`));
  assert.equal(formas[2], '0,1,3,0,2,3,0,2,3,0,2,4,1,3,5,1,3,5');
  for (let i = 0; i < 9; i++) A.$('scale-pos-next').click();
  assert.equal(pos(), 'Posición 7 de 7 · trastes 7 a 12');
  assert.equal(A.$('scale-pos-next').disabled, true);
  elegir(A, 'scale-type', 'pentaMenor'); elegir(A, 'scale-tonic', '9');
  assert.equal(pos(), 'Posición 1 de 5 · trastes 5 a 8', 'La menor pentatónica: la «caja 1» de siempre');
  assert.deepEqual(celdasEscala(A).map(c => +c.dataset.fret).sort((a, b) => a - b), [5,5,5,5,5,5,7,7,7,8,8,8]);
  // La vista va a la posición (AR-17 #4): un mástil de 300 px con trastes de 50.
  A.ev("document.getElementById('board').style.setProperty('--fret-w', '50px'); document.getElementById('board-scroll').clientWidth = 300;");
  A.$('scale-pos-next').click();                                   // caja 2: trastes 7 a 10
  assert.equal(A.ev("document.getElementById('board-scroll').scrollLeft"), 40 + 6 * 50, 'el traste 6, a la izquierda');
  // En Drop D, la 6.ª baja un tono: la posición se reparte de otra forma (4 en la grave).
  elegir(A, 'tuning-select', 'dropd');
  assert.ok(A.ev('posicionesEscala().every(p => p.every(n => n.traste >= 0))'));
  assert.equal(pos().startsWith('Posición 1 de 5'), true, 'otra afinación: vuelta a la 1');
});

test('Escalas: tocar una casilla de la posición la hace el paso actual; una de fuera solo suena (E-09)', () => {
  const A = escalasA({ scaleId: 'pentaMenor', scalePc: 9 });
  A.ev('globalThis.__plays = []; playMidi = m => __plays.push(m);');
  const c = A.doc.querySelector('.fret-cell.scale[data-row="0"][data-fret="8"]');    // Do5 en la 1.ª
  A.press(c);
  assert.ok(c.classList.contains('scale-step'));
  assert.match(A.$('scale-step-text').textContent, /^Paso 12 de 12 · Do, un tono y medio sobre La$/);
  assert.equal(A.doc.querySelector('#scale-line .now').textContent, 'Do');
  const fuera = A.doc.querySelector('.fret-cell[data-row="0"][data-fret="1"]');
  const antes = A.ev('__plays.length');
  A.press(fuera);
  assert.equal(A.ev('__plays.length'), antes + 1, 'suena');
  assert.ok(c.classList.contains('scale-step'), 'pero no cambia el paso');
});

test('Escalas › Todas: la escala también en el resto del mástil, más apagada; apagado de fábrica (E-10)', () => {
  const A = escalasA();
  assert.equal(A.$('qb-scale-all').hidden, false);
  assert.equal(A.$('qb-scale-all').getAttribute('aria-pressed'), 'false');
  assert.equal(A.doc.querySelectorAll('.fret-cell.scale-all').length, 0);
  A.$('qb-scale-all').click();
  assert.equal(A.$('qb-scale-all').getAttribute('aria-pressed'), 'true');
  const todas = A.doc.querySelectorAll('.fret-cell.scale-all');
  assert.ok(todas.length > 60, 'muchas más casillas: ' + todas.length);
  assert.ok(todas.every(c => [0, 2, 4, 5, 7, 9, 11].includes(+c.dataset.midi % 12)));
  assert.equal(celdasEscala(A).length, 18, 'la posición sigue destacada aparte');
  A.doc.querySelector('.tab[data-screen="free"]').click();
  assert.equal(A.$('qb-scale-all').hidden, true, 'fuera de Escalas no se ve el botón');
  assert.equal(A.doc.querySelectorAll('.fret-cell.scale-all').length, 0);
});

test('Escalas › Practicar: tocar la posición en orden, de grave a agudo; un fallo se marca y no avanza (E-05b)', async () => {
  const A = escalasA({ scaleId: 'pentaMenor', scalePc: 9 });
  A.ev('playMidi = () => {}');
  A.$('qb-scale-practice').click();
  assert.ok(A.$('board').classList.contains('practice'), 'sin nombres: se tocan de memoria');
  assert.match(A.$('scale-step-text').textContent, /^Práctica · toca la posición de grave a agudo/);
  assert.equal(A.$('staff').querySelectorAll('ellipse').length, 0, 'el pentagrama no da la respuesta');
  assert.equal(A.$('scale-next').disabled, true);
  const pasos = JSON.parse(A.ev('JSON.stringify(pasosEscala())'));
  const celda = k => { const [f, t] = pasos[k].celda.split('-'); return A.doc.querySelector(`.fret-cell[data-row="${f}"][data-fret="${t}"]`); };
  A.press(celda(0)); A.press(celda(1));
  assert.match(A.$('scale-step-text').textContent, /^Práctica · 3 de 12/);
  assert.equal(A.doc.querySelectorAll('.fret-cell.correct').length, 2);
  A.press(celda(5));                                               // se salta notas
  assert.match(A.$('scale-step-text').textContent, /^✗ Esa no · 3 de 12/);
  assert.ok(celda(5).classList.contains('wrong'));
  // La nota buena, pero en otra cuerda: Re3 en la 6.ª, traste 10, en vez de la 5.ª al aire+5.
  const otra = A.doc.querySelectorAll(`.fret-cell[data-midi="${pasos[2].midi}"]`).find(c => !c.classList.contains('scale'));
  A.press(otra);
  assert.match(A.$('scale-step-text').textContent, /otra cuerda/);
  for (let k = 2; k < 12; k++) A.press(celda(k));
  assert.match(A.$('scale-step-text').textContent, /^✓ ¡Completa! Ya tocas la posición 1 de la pentatónica menor de La/);
  assert.equal(A.$('staff').querySelectorAll('ellipse').length, 8);
  A.press(celda(0));
  assert.match(A.$('scale-step-text').textContent, /^Práctica · 2 de 12/, 'la primera vuelve a empezar');
  A.$('scale-pos-next').click();
  assert.equal(A.doc.querySelectorAll('.fret-cell.correct').length, 0, 'otra posición, desde cero');
  A.$('qb-scale-practice').click();
  assert.ok(!A.$('board').classList.contains('practice'));
  await sleep(1300);
  assert.equal(A.doc.querySelectorAll('.fret-cell.wrong').length, 0);
});

test('Escalas › Escuchar: la posición suena subiendo y bajando, nota a nota; se calla al pararla, al cambiar de escala, de afinación, al ocultar la app y al salir (E-08, AT-16 #2 y #3)', async () => {
  const A = escalasA({ scaleId: 'pentaMenor', scalePc: 9 });
  A.ev('globalThis.__plays = []; playMidi = m => __plays.push(m); PAUSA_ESCALA = 2;');
  A.$('scale-play').click();
  assert.equal(A.$('scale-play').querySelector('.sc-long').textContent, '■ Parar');
  assert.equal(A.$('scale-play').getAttribute('aria-pressed'), 'true');
  assert.equal(A.$('scale-play').getAttribute('aria-label'), 'Escuchar la posición', 'una sola señal: «pulsado»');
  for (let i = 0; i < 300 && A.ev('sc.sonando') !== null; i++) await sleep(10);   // cada repintado tarda un poco
  const oidas = JSON.parse(A.ev('JSON.stringify(__plays)'));
  assert.equal(oidas.length, 23, '12 subiendo y 11 bajando');
  assert.equal(oidas[0], 45, 'La2, la tónica en el traste 5 de la 6.ª');
  assert.deepEqual(oidas.slice(12), oidas.slice(0, 11).reverse());
  assert.equal(A.$('scale-play').querySelector('.sc-long').textContent, '▶ Escuchar', 'al acabar, se apaga sola');
  A.ev('PAUSA_ESCALA = 50;');
  const callaCon = async (accion, porque) => {
    A.$('scale-play').click();
    assert.notEqual(A.ev('sc.sonando'), null);
    accion();
    assert.equal(A.ev('sc.sonando'), null, porque);
    const n = A.ev('__plays.length'); await sleep(120);
    assert.equal(A.ev('__plays.length'), n, porque + ': no suena nada más');
  };
  await callaCon(() => A.$('scale-play').click(), 'otro toque');
  await callaCon(() => elegir(A, 'scale-tonic', '2'), 'otra tónica');
  await callaCon(() => elegir(A, 'scale-type', 'mayor'), 'otro tipo');
  await callaCon(() => elegir(A, 'tuning-select', 'dropd'), 'otra afinación');
  await callaCon(() => A.ev("Object.defineProperty(document, 'hidden', { value: true, configurable: true }); onVisibility()"), 'app oculta');
  A.ev("Object.defineProperty(document, 'hidden', { value: false, configurable: true })");
  await callaCon(() => A.doc.querySelector('.tab[data-screen="free"]').click(), 'salir de Escalas');
});

test('Escalas: las posiciones salen bien en todas las afinaciones, escalas y tónicas; el submodo antiguo se olvida (AT-16 #3)', () => {
  const A = escalasA({ scaleMode: 'practice' });
  assert.equal(A.ev("'scaleMode' in state"), false, 'se borra al cargar: no vuelve a guardarse');
  const malas = JSON.parse(A.ev(`JSON.stringify((() => {
    const malas = [], antes = [state.tuningId, state.scaleId, state.scalePc];
    const afins = TUNINGS.map(t => t.id);
    state.customTuning = [38, 45, 50, 55, 59, 62];               // personalizada (Open G grave)
    for (const af of afins) for (const e of ESCALAS) for (let pc = 0; pc < 12; pc++){
      state.tuningId = af; state.scaleId = e.id; state.scalePc = pc;
      const ps = posicionesEscala(), id = af + ' ' + e.id + ' ' + pc;
      if (ps.length !== e.semitonos.length) malas.push(id + ': ' + ps.length + ' posiciones');
      for (const p of ps){
        if (p.length < 6) malas.push(id + ': posición corta');
        if (p.some(n => n.traste < 0 || n.traste > NUM_FRETS)) malas.push(id + ': traste fuera');
        for (let k = 1; k < p.length; k++){ const d = p[k].midi - p[k-1].midi; if (d < 1 || d > 3) malas.push(id + ': salto ' + d); }
      }
      if (ps[0][0].grado !== 0) malas.push(id + ': la 1 no es la de la tónica');
    }
    [state.tuningId, state.scaleId, state.scalePc] = antes;
    return malas; })())`));
  assert.deepEqual(malas.slice(0, 5), []);
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
  assert.match(A.$('challenge-text').innerHTML, /Prueba otra vez/);
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

test('Escalas queda coherente: lector y lector de pantalla con la escritura de la escala, salir, cambiar de afinación y Restablecer (AT-09)', async () => {
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
  // #3: cambiar de afinación vuelve a la posición de la tónica (las casillas suenan a otra nota).
  A.doc.querySelector('.tab[data-screen="scales"]').click();
  A.$('scale-pos-next').click();
  elegir(A, 'tuning-select', 'dropd');
  assert.equal(A.ev('posicionActual()[0].grado'), 0, 'la de la tónica');
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
    n.start = t => n.arranques.push(t); n.stop = t => { n.parada = t; }; return n; };
  // Un golpe retirado (parado antes de arrancar) no llega a sonar: no cuenta.
  globalThis.__golpes = () => __nodos.filter(n => n.tipo === 'oscilador' && !(n.parada <= n.arranques[0]))
    .map(n => [n.arranques[0], n.frequency.value]);
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
    assert.ok(g.at(-1)[0] <= A.ev('__ctx.currentTime') + 0.3 + 1e-9, 'nunca más de 300 ms por adelantado');
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
  A.ev('__avanza(15.7)');                     // apuntados hasta 16,0 (300 ms por adelantado)
  const g = JSON.parse(A.ev('JSON.stringify(__golpes().map(x => x[0]))'));
  const pasos = g.slice(1).map((x, i) => Math.round((x - g[i]) * 1000) / 1000);
  assert.deepEqual(pasos, [1, 1, 1, 0.5, 0.5, 0.5, 0.5, 0.25, 0.25, 0.25]);
});

// --- F5.8 #7: el pulso, sin huecos y con lo que se ve a la par de lo que se oye (MT-04) ---

test('metrónomo: 60 s a 250 ppm con tirones del navegador de hasta 0,27 s, sin perder ni mover un golpe (MT-04, AR-12 #3, F5.8 #7)', t => {
  const A = boot(APP, { metro: { bpm: 250, sig: '4/4', sub: 1, accent: true } });
  A.ev(metroFalso);
  A.ev('startMetro()');
  t.after(() => A.ev('stopMetro()'));
  // El temporizador se despierta tarde a ratos: entre 5 y 270 ms (siempre los mismos, para repetirlo).
  A.ev(`(() => { let r = 7; const azar = () => (r = (r * 16807) % 2147483647) / 2147483647;
    while (__ctx.currentTime < 70){ __ctx.currentTime += 0.005 + 0.265 * azar(); metroProgramar(); } })()`);
  const g = JSON.parse(A.ev('JSON.stringify(__golpes().map(x => x[0]))'));
  const inicio = A.ev('metro.inicio');
  assert.ok(g.at(-1) >= 70, 'llega al final del minuto: ' + g.at(-1));
  assert.equal(g.length, Math.round((g.at(-1) - inicio) / 0.24) + 1, 'ni un golpe perdido');
  for (let i = 1; i < g.length; i++)
    assert.ok(Math.abs(g[i] - g[i - 1] - 0.24) < 1e-6, 'golpe ' + i + ': ' + (g[i] - g[i - 1]));
});

test('metrónomo: Parar calla lo ya apuntado; cambiar el tempo o el acento rehace lo apuntado sin mover el golpe siguiente (MT-04, F5.8 #7)', t => {
  const A = boot(APP, { metro: { bpm: 120, sig: '4/4', sub: 1, accent: true } });
  A.ev(metroFalso);
  A.ev('startMetro()');
  t.after(() => A.ev('stopMetro()'));
  const inicio = A.ev('metro.inicio');
  const golpes = () => JSON.parse(A.ev('JSON.stringify(__golpes())'));
  // Tempo: el golpe de inicio+0,5 ya está apuntado; pasa a 60 ppm y sigue ahí, sin repetirse.
  A.ev(`__avanza(${inicio + 0.3})`);
  assert.ok(golpes().some(x => Math.abs(x[0] - inicio - 0.5) < 1e-6), 'apuntado por adelantado');
  A.ev('setTempo(60)');
  A.ev(`__avanza(${inicio + 1.4})`);
  assert.deepEqual(golpes().map(x => Math.round((x[0] - inicio) * 1000) / 1000), [0, 0.5, 1.5], 'el siguiente, en su sitio; luego, cada segundo');
  // Acento: el primer tiempo del compás (inicio+3,5) ya está apuntado con acento; al quitarlo, suena normal.
  A.ev(`__avanza(${inicio + 3.3})`);
  assert.equal(golpes().find(x => Math.abs(x[0] - inicio - 3.5) < 1e-6)[1], 1760);
  A.ev('setAccent(false)');
  assert.equal(golpes().filter(x => Math.abs(x[0] - inicio - 3.5) < 1e-6).map(x => x[1]).join(), '1175', 'uno solo, sin acento');
  // Parar: lo apuntado que aún no ha sonado no suena.
  A.ev(`__avanza(${inicio + 4.3})`);
  assert.ok(golpes().some(x => x[0] > A.ev('__ctx.currentTime')), 'hay uno apuntado');
  A.ev('stopMetro()');
  assert.equal(golpes().filter(x => x[0] > A.ev('__ctx.currentTime')).length, 0, 'tras Parar, ninguno pendiente');
  assert.equal(A.ev('metro.programados.length'), 0);
});

test('metrónomo: cambiar compás o figura con el pulso ya apuntado lo rehace una vez; dos cambios seguidos no hacen saltar el contador (MT-03, MT-04, AT-18 A1, AR-19 #3)', t => {
  const A = boot(APP, { metro: { bpm: 60, sig: '4/4', sub: 2, accent: true } });
  A.ev(metroFalso);
  A.ev('startMetro()');
  t.after(() => A.ev('stopMetro()'));
  const golpes = () => JSON.parse(A.ev('JSON.stringify(__golpes().map(g => [Math.round(g[0] * 1000) / 1000, g[1]]))'));
  const en = s => golpes().filter(g => Math.abs(g[0] - s) < 1e-6);
  // Compás: el pulso de 12,06 ya está apuntado (con la 4/4: normal); pasa a 3/4 y es su primer tiempo.
  A.ev('__avanza(11.8)');
  assert.equal(en(12.06).length, 1, 'apuntado por adelantado');
  A.ev("setCompas('3/4')");
  A.ev('__avanza(15.3)');
  assert.deepEqual(en(12.06), [[12.06, 1760]], 'uno solo, con el acento del 3/4');
  assert.deepEqual([13.06, 14.06, 15.06].map(s => en(s).map(g => g[1]).join()), ['1175', '1175', '1760'], 'compás de tres');
  // Figura: el pulso de 16,06 ya está apuntado; con semicorcheas, el pulso no se mueve ni se repite.
  A.ev('__avanza(15.8)');
  A.ev('setSubdivision(4)');
  A.ev('__avanza(16.4)');
  assert.equal(en(16.06).length, 1);
  assert.deepEqual(en(16.31).map(g => g[1]), [880], 'y la semicorchea, a su cuarto de pulso');
  // Dos cambios seguidos: la corchea de 18,56 queda apuntada por el cambio de compás
  // (suena) y el de tempo, justo después, no debe volver a ella con el contador de antes.
  A.ev('setSubdivision(2)');
  A.ev('__avanza(18.3)');                         // apuntada la corchea de 18,56; el pulso de 19,06 aún no
  A.ev("setCompas('4/4'); setTempo(120)");
  A.ev('__avanza(19.5)');
  const tras = golpes().filter(g => g[0] > 18.5).map(g => g[0]);
  assert.deepEqual(tras.slice(0, 3), [18.56, 19.06, 19.31], 'la corchea suena y el pulso sigue en 19,06, ya a 120 ppm');
});

test('metrónomo: la luz y el péndulo van con lo que se oye, descontando la latencia de salida (MT-04, MT-06, PL-04, F5.8 #7)', t => {
  const A = boot(APP, { metro: { bpm: 60, sig: '4/4', sub: 1, accent: true } });
  A.ev(metroFalso);
  A.doc.querySelector('.tab[data-screen="metro"]').click();
  A.ev('startMetro()');
  t.after(() => A.ev('stopMetro()'));
  const inicio = A.ev('metro.inicio');
  const vistosEn = s => { A.ev(`__avanza(${s}); metroDibujar()`); return A.ev('metro.vistos'); };
  // 1. Sin datos de latencia, como antes: el reloj de audio.
  assert.equal(A.ev('metroOido() === __ctx.currentTime'), true);
  // 2. Declara 0,2 s de salida (unos auriculares Bluetooth): la luz espera a que se oiga.
  A.ev('__ctx.outputLatency = 0.2; __ctx.baseLatency = 0.01');
  assert.equal(vistosEn(inicio + 0.1), 0, 'calculado, pero aún no se oye');
  assert.equal(vistosEn(inicio + 0.22), 1, 'se oye: el primer pulso se ve');
  const angulo = parseFloat(A.$('metro-slider').style.getPropertyValue('--ang'));
  assert.ok(Math.abs(angulo + 30) < 0.5, 'y el péndulo está en su extremo cuando se oye (MT-06): ' + angulo);
  // 3. Con getOutputTimestamp(), manda la medida del navegador (aquí, 0,15 s de retraso).
  //    (El banco no trae el reloj performance del navegador: uno fijo basta.)
  A.ev('globalThis.performance = { now: () => 1000 }');
  A.ev(`__ctx.getOutputTimestamp = () => ({ contextTime: __ctx.currentTime - 0.15, performanceTime: performance.now() })`);
  assert.equal(vistosEn(inicio + 1.1), 1, 'el segundo pulso aún no se oye');
  assert.equal(vistosEn(inicio + 1.16), 2);
  assert.ok(Math.abs(A.ev('metroOido()') - (A.ev('__ctx.currentTime') - 0.15)) < 0.01);
  // Lo que pasó desde la medida se suma: 50 ms después, se oye 0,05 s más allá (AT-18 B3).
  A.ev('globalThis.performance = { now: () => 1050 }');
  A.ev(`__ctx.getOutputTimestamp = () => ({ contextTime: __ctx.currentTime - 0.15, performanceTime: 1000 })`);
  assert.ok(Math.abs(A.ev('metroOido()') - (A.ev('__ctx.currentTime') - 0.1)) < 1e-9);
  // 4. Una medida absurda (o los ceros del arranque) no deja la luz a destiempo.
  A.ev(`__ctx.getOutputTimestamp = () => ({ contextTime: __ctx.currentTime - 9, performanceTime: performance.now() })`);
  assert.ok(Math.abs(A.ev('__ctx.currentTime - metroOido()') - 0.5) < 1e-9, 'como mucho, 0,5 s');
  A.ev(`__ctx.getOutputTimestamp = () => ({ contextTime: 0, performanceTime: 0 })`);
  assert.ok(Math.abs(A.ev('__ctx.currentTime - metroOido()') - 0.21) < 1e-9, 'sin medida, las latencias declaradas');
});

// --- F5.8 #1: el péndulo del metrónomo (MT-06, tu comentario del 22/10) ---

test('metrónomo: la barra oscila como un péndulo, un extremo en cada pulso y por el centro entre dos (MT-06, F5.8)', t => {
  // 60 ppm: un pulso por segundo; en corcheas, para ver que la subdivisión no mueve el péndulo.
  const A = boot(APP, { metro: { bpm: 60, sig: '4/4', sub: 2, accent: true } });
  A.ev(metroFalso);
  A.doc.querySelector('.tab[data-screen="metro"]').click();      // el péndulo se pinta con su área a la vista
  A.ev('startMetro()');
  t.after(() => A.ev('stopMetro()'));
  const angulo = () => parseFloat(A.$('metro-slider').style.getPropertyValue('--ang'));
  const en = s => { A.ev(`__avanza(${s})`); A.ev('metroDibujar()'); return angulo(); };
  const inicio = A.ev('metro.inicio');                         // 10,06: el primer pulso
  assert.equal(en(inicio - 0.05), -30, 'antes del primer pulso, sujeto en el lado de salida');
  assert.equal(A.ev('metro.amplitud'), 30, '30° a cada lado si cabe');
  assert.ok(Math.abs(en(inicio) + 30) < 0.2, 'primer pulso: extremo izquierdo');
  assert.ok(Math.abs(en(inicio + 0.5)) < 2, 'a medio camino, por el centro (y la corchea no cuenta como pulso)');
  assert.ok(Math.abs(en(inicio + 1) - 30) < 0.2, 'segundo pulso: extremo derecho');
  assert.ok(Math.abs(en(inicio + 2) + 30) < 0.2, 'tercero: otra vez a la izquierda');
  assert.equal(A.ev('metro.vistos'), 3, 'tres pulsos, sin contar las corcheas');
  // Mientras la arrastras, recta; al soltarla, sigue.
  A.ev('metro.arrastrando = true; metroDibujar()');
  assert.equal(angulo(), 0);
  A.ev('metro.arrastrando = false; metroDibujar()');
  assert.ok(Math.abs(angulo()) > 25);
  // Parado, descansa recta.
  A.ev('stopMetro()');
  assert.equal(angulo(), 0);
});

test('metrónomo: con «reducir movimiento» el péndulo no oscila (MT-06, G-05, F5.8)', t => {
  const A = boot(APP, { metro: { bpm: 120, sig: '4/4', sub: 1, accent: true } },
    { matchMedia: q => ({ matches: /reduce/.test(q), media: q, addEventListener(){}, addListener(){} }) });
  A.ev(metroFalso);
  A.doc.querySelector('.tab[data-screen="metro"]').click();      // el péndulo se pinta con su área a la vista
  A.ev('startMetro()');
  t.after(() => A.ev('stopMetro()'));
  for (const s of [10.03, 10.06, 10.3, 10.56]){
    A.ev(`__avanza(${s}); metroDibujar()`);
    assert.equal(parseFloat(A.$('metro-slider').style.getPropertyValue('--ang')), 0, s + ' s');
  }
});

test('metrónomo: como en uno mecánico, la pesa arriba es lo más lento; el péndulo se abre menos si no cabe (MT-06, F5.8)', () => {
  const A = boot(APP, { metro: { bpm: 80, sig: '4/4', sub: 1, accent: true } });
  // La caja del deslizador: arriba en y = 100, 328 px de alto (300 de varilla).
  A.ev(`document.getElementById('metro-slider').getBoundingClientRect = () => ({ top: 100, bottom: 428, height: 328, left: 0, right: 60, width: 60 })`);
  assert.equal(A.ev('Math.round(sliderValor(114))'), 30, 'pesa arriba: 30 ppm');
  assert.equal(A.ev('Math.round(sliderValor(414))'), 250, 'pesa abajo: 250 ppm');
  assert.equal(A.ev('Math.round(sliderValor(264))'), 140, 'en medio: 140 ppm');
  const barra = A.$('metro-slider');
  barra.dispatchEvent({ type: 'pointerdown', clientY: 114, pointerId: 1 });
  assert.equal(A.ev('state.metro.bpm'), 30);
  assert.equal(A.ev('metro.arrastrando'), true, 'mientras la arrastras, recta');
  barra.dispatchEvent({ type: 'pointerup', pointerId: 1 });
  assert.equal(A.ev('metro.arrastrando'), false);
  assert.equal(barra.style.getPropertyValue('--p'), '0', 'el CSS pone la pesa arriba con --p = 0');
  barra.dispatchEvent({ type: 'pointerdown', clientY: 414, clientX: 30, pointerId: 1 });
  barra.dispatchEvent({ type: 'pointerup', pointerId: 1 });
  assert.equal(A.ev('state.metro.bpm'), 250, 'pesa abajo, con el dedo: 250 ppm');
  // Tocar la pesa donde se ve, con la varilla inclinada 30°, no cambia el tempo (AT-13 #1).
  A.ev('setTempo(80)');
  const d = 300 * (1 - (80 - 30) / 220), inclinada = Math.PI / 6;   // distancia de la pesa al pie; 30°
  barra.style.setProperty('--ang', '30deg');
  barra.dispatchEvent({ type: 'pointerdown', clientX: 30 + d * Math.sin(inclinada), clientY: 414 - d * Math.cos(inclinada), pointerId: 1 });
  barra.dispatchEvent({ type: 'pointerup', pointerId: 1 });
  assert.ok(Math.abs(A.ev('state.metro.bpm') - 80) <= 1, A.ev('state.metro.bpm') + ' ppm: tocarla no la mueve');
  barra.dispatchEvent({ type: 'lostpointercapture', pointerId: 1 });
  assert.equal(A.ev('metro.arrastrando'), false, 'si se pierde el dedo, no se queda enganchada');
  // La amplitud: con una varilla de 300 px, una caja de 400 deja los 30°; una de 200, unos 15°.
  assert.equal(A.ev('amplitudPendulo()'), null, 'con el área oculta no se puede medir');
  A.doc.querySelector('.tab[data-screen="metro"]').click();      // el péndulo se pinta con su área a la vista
  A.ev(`document.getElementById('metro-slider').clientHeight = 328`);
  A.ev(`document.getElementById('metro-pendulo').clientWidth = 400`);
  assert.equal(A.ev('amplitudPendulo()'), 30);
  A.ev(`document.getElementById('metro-pendulo').clientWidth = 200`);
  const a = A.ev('amplitudPendulo()');
  assert.ok(a > 14 && a < 16, a + '°: la pesa no se sale de la caja');
});

test('metrónomo: si giras el móvil con el metrónomo sonando en otra área, al volver el péndulo cabe (MT-06, AR-14 #1)', t => {
  const A = boot(APP, { metro: { bpm: 60, sig: '4/4', sub: 1, accent: true } });
  A.ev(metroFalso);
  const tab = n => A.doc.querySelector(`.tab[data-screen="${n}"]`).click();
  const tamano = ancho => A.ev(`document.getElementById('metro-pendulo').clientWidth = ${ancho}; document.getElementById('metro-slider').clientHeight = 328`);
  tamano(400); tab('metro');
  A.ev('startMetro()');
  t.after(() => A.ev('stopMetro()'));
  A.ev('__avanza(10.2); metroDibujar()');
  assert.equal(A.ev('metro.amplitud'), 30, 'en vertical, 30°');
  tab('free');                                                 // sigue sonando en Libre (MT-05)
  tamano(200); A.fireWin('resize');                            // giras el móvil
  A.ev('__avanza(10.5); metroDibujar()');
  assert.equal(A.ev('metro.amplitud'), null, 'oculta, no se mide');
  tab('metro');
  A.ev('__avanza(10.6); metroDibujar()');
  const a = A.ev('metro.amplitud');
  assert.ok(a > 14 && a < 16, a + '°: al volver, la que cabe');
  assert.ok(Math.abs(parseFloat(A.$('metro-slider').style.getPropertyValue('--ang'))) <= a + 1e-9);
});

test('metrónomo: un cambio grande de tempo en marcha no hace saltar el péndulo, y cambiar de compás no le hace perder pulsos (MT-06, AT-13 #3)', t => {
  const A = boot(APP, { metro: { bpm: 120, sig: '4/4', sub: 1, accent: true } });
  A.ev(metroFalso);
  A.doc.querySelector('.tab[data-screen="metro"]').click();
  A.ev('startMetro()');
  t.after(() => A.ev('stopMetro()'));
  const angulo = () => parseFloat(A.$('metro-slider').style.getPropertyValue('--ang'));
  const inicio = A.ev('metro.inicio');
  A.ev(`__avanza(${inicio + 0.75}); metroDibujar()`);         // a medio camino entre el 2.º y el 3.er pulso
  const antes = angulo();
  A.ev('setTempo(30); metroDibujar()');                        // Inicio: de 120 a 30 ppm
  assert.ok(Math.abs(angulo() - antes) < 3, `de ${antes}° a ${angulo()}°: sin salto`);
  const siguiente = JSON.parse(A.ev('JSON.stringify(proximoPulso())'));
  A.ev(`__ctx.currentTime = ${siguiente}; metroProgramar(); metroDibujar()`);
  assert.ok(Math.abs(Math.abs(angulo()) - 30) < 0.2, 'llega al extremo cuando suena el pulso siguiente');
  // Cambiar de compás con un pulso ya programado: suena, y el péndulo lo cuenta.
  // (setTempo deja el golpe ya previsto en su sitio: el próximo pulso es el que diga proximoPulso.)
  const prox = A.ev('proximoPulso()');
  A.ev(`__avanza(${prox - 0.05})`);                             // programado, pero aún no suena
  const vistos = A.ev('metro.vistos'), enCola = A.ev('metro.cola.length');
  assert.ok(enCola >= 1, 'hay un pulso programado');
  A.ev("setCompas('3/4')");
  A.ev(`__avanza(${prox + 0.05}); metroDibujar()`);
  assert.ok(A.ev('metro.vistos') > vistos, 'el pulso que sonó cuenta');
});

test('metrónomo: en 6/8 el péndulo marca la negra con puntillo, no cada corchea (MT-06, AT-13)', t => {
  const A = boot(APP, { metro: { bpm: 60, sig: '6/8', sub: 3, accent: true } });
  A.ev(metroFalso);
  A.doc.querySelector('.tab[data-screen="metro"]').click();
  A.ev('startMetro()');
  t.after(() => A.ev('stopMetro()'));
  const angulo = () => parseFloat(A.$('metro-slider').style.getPropertyValue('--ang'));
  const inicio = A.ev('metro.inicio');
  const lados = [];
  for (let k = 0; k < 4; k++){ A.ev(`__avanza(${inicio + k}); metroDibujar()`); lados.push(Math.round(angulo())); }
  assert.deepEqual(lados, [-30, 30, -30, 30], 'un extremo por pulso, alternando');
  assert.equal(A.ev('metro.vistos'), 4, 'cuatro pulsos; las corcheas no cuentan');
});

// --- F5.7: librería de acordes (AC-01 a AC-06, tu petición del 21/10) ---

test('acordes: cada digitación suena a su acorde, con la raíz (o el bajo) abajo, y se puede tocar con cuatro dedos (AC-01, AC-02)', () => {
  const A = boot(APP);
  const datos = JSON.parse(A.ev(`JSON.stringify(ACORDES.map(a => ({ id: idAcorde(a), tipo: a.tipo, c: a.c || null,
    cuerdas: cuerdasAcorde(a), tonos: notasAcorde(a).map(pcEscrita), bajo: a.bajo === undefined ? null : PC_LETRA[a.bajo] })))`));
  assert.equal(datos.length, 30);
  assert.equal(new Set(datos.map(d => d.id)).size, 30, 'sin repetidos');
  for (const d of datos){
    const suenan = d.cuerdas.filter(c => c.midi !== null);
    const pcs = new Set(suenan.map(c => c.midi % 12));
    for (const pc of pcs) assert.ok(d.tonos.includes(pc), d.id + ': suena una nota que no es del acorde');
    // La raíz, la tercera (o la cuarta en sus4) y la séptima, siempre; la quinta se puede omitir (C7).
    for (const i of [0, 1, 3]) if (d.tonos[i] !== undefined) assert.ok(pcs.has(d.tonos[i]), d.id + ': falta un tono esencial');
    const grave = Math.min(...suenan.map(c => c.midi));
    assert.equal(grave % 12, d.bajo ?? d.tonos[0], d.id + ': el bajo');
    // Dedos: cada cuerda pisada tiene dedo; un dedo, un solo traste; varias cuerdas solo con cejilla.
    const porDedo = {};
    for (const c of d.cuerdas){
      if (!c.traste){ assert.equal(c.dedo, 0, d.id + ': dedo en cuerda al aire'); continue; }
      assert.ok(c.dedo >= 1 && c.dedo <= 4, d.id + ': cuerda pisada sin dedo');
      (porDedo[c.dedo] ||= []).push(c);
    }
    for (const [dedo, cs] of Object.entries(porDedo)){
      assert.equal(new Set(cs.map(c => c.traste)).size, 1, d.id + ': el dedo ' + dedo + ' en dos trastes');
      if (cs.length > 1) assert.ok(d.c && +dedo === 1 && cs[0].traste === d.c[0], d.id + ': varias cuerdas sin cejilla');
    }
    const trastes = d.cuerdas.map(c => c.traste).filter(f => f);
    assert.ok(Math.max(...trastes) - Math.min(...trastes) <= 3, d.id + ': más de cuatro trastes de abertura');
  }
  // Se escriben como mandan: B7 lleva Re♯, no Mi♭.
  assert.equal(A.ev("notasAcorde(acordePorId('B7')).map(nombreEscrito).join(' ')"), 'Si Re♯ Fa♯ La');
  assert.equal(A.ev("notasAcorde(acordePorId('Cm')).map(nombreEscrito).join(' ')"), 'Do Mi♭ Sol');
});

test('acordes: se eligen con dos filas, la nota y el tipo; lo que no existe se apaga (AC-01, F5.8 #6)', () => {
  const A = boot(APP, { notation: 'anglo' });
  A.doc.querySelector('.tab[data-screen="chords"]').click();
  assert.equal(A.$('chords-card').hidden, false);
  assert.equal(A.$('board-area').hidden, false, 'arriba la elección, debajo el mástil');
  const raiz = n => A.doc.querySelectorAll('#chord-roots .chord-chip')[n];
  const tipos = () => A.doc.querySelectorAll('#chord-types .chord-chip');
  const tipo = txt => tipos().find(b => b.textContent === txt);
  assert.deepEqual(A.doc.querySelectorAll('#chord-roots .chord-chip').map(b => b.textContent), ['C', 'D', 'E', 'F', 'G', 'A', 'B']);
  assert.deepEqual(tipos().map(b => b.textContent), ['Mayor', 'menor', '7', 'm7', 'maj7', 'sus4', '/G']);
  const pulsados = () => [...A.doc.querySelectorAll('#chord-roots .chord-chip'), ...tipos()]
    .filter(b => b.getAttribute('aria-pressed') === 'true').map(b => b.textContent);
  assert.deepEqual(pulsados(), ['C', 'Mayor']);
  // Con Do, no hay m7 ni sus4 en el catálogo: se apagan; Do/Sol sí existe.
  assert.deepEqual(tipos().filter(b => b.disabled).map(b => b.textContent), ['m7', 'sus4']);
  // Otra nota conserva el tipo si existe: de Am a Em…
  raiz(5).click(); tipo('menor').click();
  assert.equal(A.$('chord-name').textContent, 'Am');
  raiz(2).click();
  assert.equal(A.$('chord-name').textContent, 'Em');
  // …y si no existe, vuelve al mayor: Dsus4 → (no hay Esus4) E.
  raiz(1).click(); tipo('sus4').click();
  assert.equal(A.$('chord-name').textContent, 'Dsus4');
  raiz(2).click();
  assert.deepEqual(pulsados(), ['E', 'Mayor']);
  // Con bajo: Do/Sol y Sol/Si; el botón dice qué bajo lleva (AR-18 #6) y, sin él, «/bajo» apagado.
  raiz(4).click();
  assert.equal(tipos()[6].textContent, '/B');
  tipos()[6].click();
  assert.equal(A.$('chord-name').textContent, 'G/B');
  assert.equal(tipos()[6].getAttribute('aria-label'), 'Con otra nota en el bajo');
  raiz(1).click();
  assert.equal(tipos()[6].textContent, '/bajo');
  assert.equal(tipos()[6].disabled, true);
  // Un tipo apagado no hace nada.
  raiz(3).click();                                     // Fa: solo mayor, menor y maj7
  assert.deepEqual(tipos().filter(b => !b.disabled).map(b => b.textContent), ['Mayor', 'menor', 'maj7']);
  tipo('7').click();
  assert.equal(A.$('chord-name').textContent, 'F');
  // Los 30 del catálogo se pueden elegir con los botones, y ninguno sobra.
  const alcanzables = new Set();
  const TIPOS = JSON.parse(A.ev('JSON.stringify(TIPOS_BOTON)'));
  for (let r = 0; r < 7; r++) for (const t of TIPOS){
    const id = A.ev(`(a => a ? idAcorde(a) : '')(acordeDe(${r}, ${JSON.stringify(t)}))`);
    if (id) alcanzables.add(id);
  }
  assert.equal(alcanzables.size, 30);
  // En Do Re Mi, las notas cambian de nombre; los tipos, no.
  A.ev("state.notation = 'latin'; refreshNoteText()");
  assert.deepEqual(A.doc.querySelectorAll('#chord-roots .chord-chip').map(b => b.textContent), ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si']);
  assert.equal(A.$('chord-name').textContent, 'Fa');
});

test('acordes: el mástil enseña los trastes 0 a 5 a todo el ancho, sin zoom; al salir vuelve el zoom guardado (AC-07)', () => {
  const A = boot(APP, { visibleFrets: 12 });
  A.$('board-scroll').clientWidth = 1270;               // 1270 − 30 − 40 = 1200 px para trastes
  A.$('board-scroll').scrollLeft = 300;
  A.doc.querySelector('.tab[data-screen="chords"]').click();
  A.ev('applyZoom()');
  assert.equal(A.ev("document.getElementById('board').style.getPropertyValue('--fret-w')"), '240px', '1200 / 5');
  assert.equal(A.$('board-scroll').scrollLeft, 0);
  assert.equal(A.ev('state.visibleFrets'), 12, 'el zoom guardado no se toca');
  // Las 30 digitaciones caben en esos trastes: si un día se añade una más alta, falla aquí (AR-18 #1).
  assert.ok(A.ev('Math.max(...ACORDES.flatMap(a => cuerdasAcorde(a).map(c => c.traste || 0)))') <= A.ev('TRASTES_ACORDE'));
  // Con el teclado, el foco no pasa del traste 5 (AT-17 M1).
  A.ev('setRoving(0, 5)');
  A.ev("document.getElementById('strings').dispatchEvent({ type: 'keydown', key: 'ArrowRight', target: cellAt(0, 5), preventDefault(){} })");
  assert.equal(A.ev('kbPos.fret'), 5);
  A.ev("document.getElementById('strings').dispatchEvent({ type: 'keydown', key: 'ArrowLeft', target: cellAt(0, 5), preventDefault(){} })");
  assert.equal(A.ev('kbPos.fret'), 4, 'la tecla llega: ← sí se mueve');
  A.doc.querySelector('.tab[data-screen="free"]').click();
  A.ev('applyZoom()');
  assert.equal(A.ev("document.getElementById('board').style.getPropertyValue('--fret-w')"), '100px', '1200 / 12');
  // Si en Libre el foco se quedó en el 12, al volver a Acordes pasa al 0.
  A.ev('setRoving(2, 12)');
  A.doc.querySelector('.tab[data-screen="chords"]').click();
  assert.equal(A.ev('kbPos.fret'), 0);
});

test('acordes: el elegido se dibuja en el mástil con dedos numerados, ○ y ✕, cejilla y rasgueo, sin pentagrama (AC-02, AC-04)', async () => {
  const A = boot(APP);                                             // Do Re Mi
  A.ev('globalThis.__plays = []; playMidi = m => __plays.push(m);');
  A.doc.querySelector('.tab[data-screen="chords"]').click();
  // Elegir por nota y tipo: 0 = Do … 6 = Si.
  const elige = (raiz, tipo) => { A.doc.querySelectorAll('#chord-roots .chord-chip')[raiz].click();
    A.doc.querySelectorAll('#chord-types .chord-chip').find(b => b.dataset.tipo === tipo).click(); };
  elige(5, 'm');
  assert.equal(A.doc.querySelectorAll('#chord-roots .chord-chip')[5].getAttribute('aria-pressed'), 'true');
  assert.equal(A.$('chord-name').textContent, 'Lam');
  assert.equal(A.$('chord-notes').textContent, 'La · Do · Mi');
  const dedos = () => A.doc.querySelectorAll('#board .finger').map(f => {
    const c = f.parentNode; return c.dataset.row + '-' + c.dataset.fret + ':' + f.textContent; }).sort();
  assert.deepEqual(dedos(), ['1-1:1', '2-2:3', '3-2:2'], '2ª cuerda traste 1 dedo 1; 3ª y 4ª en el 2');
  const marcas = A.doc.querySelectorAll('#board .string-label').map(l => l.dataset.mark || '');
  assert.deepEqual(marcas, ['○', '', '', '', '○', '✕'], '1ª y 5ª al aire; la 6ª no suena');
  assert.match(A.doc.querySelector('.fret-cell[data-row="1"][data-fret="1"]').getAttribute('aria-label'), /dedo 1/);
  assert.equal(A.$('staff').querySelectorAll('ellipse').length, 0, 'el pentagrama no escribe el acorde: manda el dibujo (F5.8 #6)');
  await sleep(250);
  assert.deepEqual(JSON.parse(A.ev('JSON.stringify(__plays)')), [45, 52, 57, 60, 64], 'rasgueado de grave a agudo');
  // Fa: cejilla en el 1, de la 6ª a la 1ª.
  elige(3, '');
  const cejilla = A.doc.querySelectorAll('#board .fret-cell.barre');
  assert.equal(cejilla.length, 6);
  assert.ok(cejilla.every(c => c.dataset.fret === '1'));
  assert.ok(A.doc.querySelector('.fret-cell.barre-top').dataset.row === '0' && A.doc.querySelector('.fret-cell.barre-bottom').dataset.row === '5');
  assert.deepEqual(A.doc.querySelectorAll('#board .string-label').map(l => l.dataset.mark || ''), ['', '', '', '', '', '']);
  assert.equal(JSON.parse(A.store.get('trasteando.v1')).chordId, 'F', 'el acorde elegido se recuerda');
  // Al salir de Acordes, el mástil vuelve a ser el de siempre.
  A.doc.querySelector('.tab[data-screen="free"]').click();
  assert.equal(A.doc.querySelectorAll('#board .finger, #board .barre').length, 0);
  assert.ok(!A.$('board').classList.contains('chords'));
  assert.equal(A.doc.querySelectorAll('#board .string-label[data-mark]').length, 0);
});

test('acordes: con otra afinación avisa y no dibuja; «Pasar a estándar» lo arregla (AC-05)', () => {
  const A = boot(APP, { tuningId: 'dropd', chordId: 'D' });
  A.doc.querySelector('.tab[data-screen="chords"]').click();
  assert.equal(A.$('chord-tuning').hidden, false);
  assert.equal(A.doc.querySelectorAll('#board .finger').length, 0, 'las digitaciones no valen en Drop D');
  assert.equal(A.$('chord-play').disabled, true);
  A.$('chord-standard').click();
  assert.equal(A.ev('state.tuningId'), 'standard');
  assert.equal(A.$('chord-tuning').hidden, true);
  assert.equal(A.doc.querySelectorAll('#board .finger').length, 3);
});

unaVez('acordes: los cuatro colores de dedo contrastan con el mástil (3:1) y su número con el círculo (4,5:1) (AC-02, G-05)', () => {
  const css = fs.readFileSync(path.join(__dirname, '..', 'css', 'trasteando.css'), 'utf8');
  const lum = hex => { const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map(v => v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
  const contraste = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const dedos = [1, 2, 3, 4].map(i => css.match(new RegExp(`--f${i}:(#[0-9a-f]{6})`))[1]);
  const numero = css.match(/\.finger \{[^}]*color:(#[0-9a-f]{6})/)[1];
  assert.equal(new Set(dedos).size, 4);
  for (const f of dedos){
    for (const madera of ['#32200f', '#432c16']) assert.ok(contraste(f, madera) >= 3, f + ' sobre ' + madera + ': ' + contraste(f, madera).toFixed(2));
    assert.ok(contraste(f, numero) >= 4.5, 'número sobre ' + f + ': ' + contraste(f, numero).toFixed(2));
  }
});

test('AT-10: cambiar de compás sonando no mueve el pulso; tras un bloqueo no se amontonan golpes; las figuras no se rehacen; avisos traducidos; Restablecer vuelve a Do', t => {
  const A = boot(APP, { metro: { bpm: 60, sig: '4/4', sub: 2, accent: true } });
  A.ev(metroFalso);
  A.ev('startMetro()');
  t.after(() => A.ev('stopMetro()'));
  A.ev('__avanza(11.08)');                    // pulso a 11,06; ya programada su corchea de 11,56
  A.ev("setCompas('3/4')");
  A.ev('__avanza(12.2)');
  const pulsos = JSON.parse(A.ev('JSON.stringify(__golpes().filter(g => g[1] !== 880).map(g => Math.round(g[0] * 1000) / 1000))'));
  assert.deepEqual(pulsos.slice(-2), [11.06, 12.06], 'el acento del 3/4 cae en el pulso, no en la corchea');
  assert.equal(JSON.parse(A.ev('JSON.stringify(__golpes().find(g => Math.abs(g[0] - 12.06) < 1e-6))'))[1], 1760);
  A.ev('__ctx.currentTime += 1.5; metroProgramar()');   // el navegador estuvo 1,5 s ocupado
  const atrasados = A.ev('__golpes().filter(g => g[0] < __ctx.currentTime - 0.01).length');
  assert.equal(atrasados, JSON.parse(A.ev('JSON.stringify(__golpes().filter(g => g[0] < 12.3).length)')), 'ninguno en el pasado');
  // Ventana: elegir figura no rehace los botones (el foco no se pierde) y en 5/8 dos por pulso son semicorcheas.
  A.doc.querySelector('.tab[data-screen="metro"]').click();
  A.$('metro-sig').click();
  const fig = A.doc.querySelector('#metro-sub [data-v="3"]');
  fig.click();
  assert.equal(A.doc.querySelector('#metro-sub [data-v="3"]'), fig, 'el mismo botón');
  A.doc.querySelector('#metro-sigs [data-v="5/8"]').click();
  assert.equal(A.doc.querySelector('#metro-sub [data-v="2"]').getAttribute('aria-label'), 'Dos por pulso (semicorcheas)');
  A.$('metro-ok').click();
  // El aviso se traduce al cambiar de idioma.
  A.ev("stopMetro(); startMetro(); stopMetro('hidden'); setLang('en')");
  assert.equal(A.$('metro-note').textContent, 'It stopped when you left the app.');
  A.ev("setLang('es')");
  // Restablecer vuelve a Do mayor, también en los botones de Acordes.
  A.doc.querySelector('.tab[data-screen="chords"]').click();
  A.ev("selectChord('Am', false)");                    // sin sonar: el rasgueo llegaría con la prueba ya acabada
  A.$('set-reset').click();
  assert.equal(A.ev('state.chordId'), 'C');
  assert.equal(A.doc.querySelectorAll('#chord-roots .chord-chip')[0].getAttribute('aria-pressed'), 'true');
});

// --- CP-5 (22/10): AT-11 #1, arrancar con el audio en pausa ---
// En el iPhone, tras una llamada, el audio queda en pausa. Safari no lo pone en
// 'running' en el mismo instante en que se pide resume(), sino un poco después.
// El audio simulado del banco despertaba al momento y por eso no se veía el fallo.
const resumeLento = `__ctx.resume = function(){ this.reanudar++;
  return new Promise(r => setTimeout(() => { this.state = 'running'; r(); }, 20)); };`;

test('AT-11: con el audio en pausa, Empezar espera a que despierte y suena; si no despierta, lo dice; Parar cancela la espera (MT-04)', async t => {
  const A = boot(APP, { metro: { bpm: 120, sig: '4/4', sub: 1, accent: true } });
  A.ev(metroFalso);
  t.after(() => A.ev('stopMetro()'));
  // 1. El audio despierta poco después: el metrónomo suena.
  A.ev(`__ctx.state = 'interrupted'; ${resumeLento}`);
  const espera = A.ev('startMetro()');
  assert.equal(A.ev('metro.sonando'), false, 'aún no suena: el audio está despertando');
  assert.ok(A.ev('__ctx.reanudar') >= 1, 'resume() se pide dentro del toque');
  await espera;
  assert.equal(A.ev('metro.sonando'), true, 'suena en cuanto el audio despierta');
  assert.equal(A.ev('metro.aviso'), '', 'sin «Se paró: el sistema detuvo el sonido»');
  A.ev('__avanza(11)');
  assert.ok(A.ev('__golpes().length') >= 2, 'y los golpes caen');
  A.ev('stopMetro()');
  // 2. El audio no despierta: no finge que suena, avisa.
  A.ev(`__ctx.state = 'suspended'; __ctx.resume = function(){ this.reanudar++; return new Promise(() => {}); };`);
  await A.ev('startMetro()');
  assert.equal(A.ev('metro.sonando'), false);
  assert.equal(A.ev('metro.aviso'), 'metro.noAudio');
  // 3. Pulsar otra vez mientras espera lo cancela: no arranca después.
  A.ev(resumeLento);
  const otra = A.ev('startMetro()');
  A.ev('toggleMetro()');
  await otra;
  assert.equal(A.ev('metro.sonando'), false, 'lo paraste antes de que despertara');
});

// --- Continuidad entre conversaciones (21/10): ESTADO.md no puede quedarse atrás ---

unaVez('docs/ESTADO.md está al día con la versión de la app (memoria entre conversaciones)', () => {
  const v = fs.readFileSync(path.join(__dirname, '..', 'js', '01-teoria.js'), 'utf8').match(/APP_VERSION = '([\d.]+)'/)[1];
  const estado = fs.readFileSync(path.join(__dirname, '..', 'docs', 'ESTADO.md'), 'utf8');
  const linea = estado.split('\n').find(l => l.startsWith('**Actualizado:**')) || '';
  assert.ok(linea.includes('`' + v + '`'), `ESTADO.md dice «${linea}», pero la app es la ${v}: actualízalo antes de cerrar`);
});

// --- Sin conexión desde la web (F6.2, G-03): cuándo se registra el Service Worker ---

test('el Service Worker se registra en la web, nunca en el autónomo ni con doble clic (G-03, PL-04)', () => {
  const conSW = protocol => {
    const llamadas = [];
    const sw = { register: (url, op) => { llamadas.push({ url, op }); return Promise.resolve(); } };
    const A = boot(APP, null, { navigator: { serviceWorker: sw }, location: { protocol } });
    A.fireWin('load');   // se registra al terminar de cargar, para no quitarle red a la página
    return { A, llamadas };
  };
  const autonomo = process.env.TRASTEANDO_FORMA === 'autónomo';
  const web = conSW('https:');
  if (autonomo) assert.equal(web.llamadas.length, 0, 'el autónomo lleva el audio dentro: no lo necesita');
  else {
    assert.deepEqual(web.llamadas.map(l => l.url), ['sw.js'], 'una vez, con la dirección relativa a la app');
    assert.equal(web.llamadas[0].op.updateViaCache, 'none');
  }
  assert.equal(conSW('file:').llamadas.length, 0, 'con doble clic no existe');
  // Sin Service Worker (como en el banco por defecto) la app arranca igual.
  const sin = boot(APP);
  assert.equal(sin.ev('registrarServiceWorker()'), false);
  assert.deepEqual(sinErrores(sin), []);
});

// --- F5.8 #2 (12/11): el afinador abre en Micrófono, y la pantalla no se apaga mientras se usa ---

test('el afinador abre en Micrófono donde se puede usar, sin escuchar todavía; tu elección se recuerda (A-02, F5.8 #2)', async () => {
  const A = boot(APP, null, microFalso());
  A.doc.querySelector('.tab[data-screen="tuner"]').click();
  assert.equal(A.$('tuner-mic').hidden, false, 'con micrófono disponible, abre en Micrófono');
  assert.equal(A.$('tuner-ear').hidden, true);
  assert.equal(A.ev('__mic.pedido'), 0, 'pero no escucha hasta que pulsas «Activar»');
  // Quien ya usaba la app tenía guardado «De oído» sin haberlo elegido: también le abre en Micrófono.
  const viejo = boot(APP, { tunerMode: 'ear' }, microFalso());
  assert.equal(viejo.$('tuner-mic').hidden, false);
  // Si lo eliges tú, se recuerda.
  A.doc.querySelector('#tuner-mode [data-v="ear"]').click();
  const guardado = JSON.parse(A.store.get('trasteando.v1'));
  assert.deepEqual([guardado.tunerMode, guardado.tunerPick], ['ear', true]);
  assert.equal(boot(APP, guardado, microFalso()).$('tuner-ear').hidden, false);
  // «Restablecer» olvida la elección, apaga el micrófono y devuelve la cuerda a «Auto» (AT-14 #12).
  const R = boot(APP, guardado, microFalso()); R.ev(analizadorFalso);
  R.doc.querySelector('#tuner-mode [data-v="mic"]').click();
  R.doc.querySelector('#mic-string [data-v="3"]').click();
  R.$('set-reset').click();
  await sleep(50);
  assert.equal(R.$('tuner-mic').hidden, false);
  assert.equal(R.ev('mic.string'), 'auto');
  assert.equal(JSON.parse(R.store.get('trasteando.v1')).tunerPick, false);
  // Donde el micrófono no se puede usar (sin https, con doble clic), abre en De oído.
  const sin = boot(APP);
  assert.equal(sin.$('tuner-ear').hidden, false);
  assert.equal(sin.$('tuner-mic').hidden, true);
});

test('la pantalla se mantiene encendida mientras suena el metrónomo o escucha el afinador, y se suelta al parar (G-13)', async t => {
  const pedidos = [];
  const wakeLock = { request: async tipo => { const c = { tipo, suelto: false, release: async () => { c.suelto = true; } }; pedidos.push(c); return c; } };
  const extra = microFalso(); extra.navigator.wakeLock = wakeLock;
  const A = boot(APP, null, extra);
  A.ev(analizadorFalso + metroExtra);
  t.after(() => A.ev('stopMetro(); stopMic()'));
  A.doc.querySelector('.tab[data-screen="metro"]').click();
  assert.equal(pedidos.length, 0, 'parado no se pide nada');
  A.$('metro-play').click(); await sleep(20);
  assert.deepEqual(pedidos.map(c => [c.tipo, c.suelto]), [['screen', false]]);
  assert.doesNotMatch(A.$('metro-note').textContent, /pantalla/);
  A.$('metro-play').click(); await sleep(5);
  assert.equal(pedidos[0].suelto, true, 'al parar, el móvil vuelve a bloquearse como siempre');
  // El afinador: mientras escucha.
  A.doc.querySelector('.tab[data-screen="tuner"]').click();
  A.$('mic-start').click(); await sleep(20);
  assert.deepEqual(pedidos.map(c => c.suelto), [true, false]);
  A.$('mic-stop').click(); await sleep(5);
  assert.deepEqual(pedidos.map(c => c.suelto), [true, true]);
  // Donde no existe (PL-04), todo funciona igual y el metrónomo lo avisa.
  const B = boot(APP); B.ev(metroFalso);
  t.after(() => B.ev('stopMetro()'));
  B.doc.querySelector('.tab[data-screen="metro"]').click();
  B.$('metro-play').click(); await sleep(20);
  assert.equal(B.ev('metro.sonando'), true);
  assert.match(B.$('metro-note').textContent, /si se apaga, el metrónomo se para/);
  assert.deepEqual(sinErrores(B), []);
  // Existe, pero el sistema lo niega (batería baja): mismo aviso (AT-14 #4).
  const negado = { navigator: { wakeLock: { request: async () => { throw new Error('NotAllowedError'); } } } };
  const C = boot(APP, null, negado); C.ev(metroFalso);
  t.after(() => C.ev('stopMetro()'));
  C.doc.querySelector('.tab[data-screen="metro"]').click();
  C.$('metro-play').click(); await sleep(30);
  assert.equal(C.ev('metro.sonando'), true);
  assert.match(C.$('metro-note').textContent, /si se apaga, el metrónomo se para/);
  // Si el sistema suelta el cerrojo con la app a la vista y sigue sonando, se pide otro (AT-14 #10).
  const dados = [];
  const conEvento = { navigator: { wakeLock: { request: async () => { const c = { oyentes: [], release: async () => {}, addEventListener(_t, f){ c.oyentes.push(f); } }; dados.push(c); return c; } } } };
  const D = boot(APP, null, conEvento); D.ev(metroFalso);
  t.after(() => D.ev('stopMetro()'));
  D.doc.querySelector('.tab[data-screen="metro"]').click();
  D.$('metro-play').click(); await sleep(30);
  assert.equal(dados.length, 1);
  dados[0].oyentes.forEach(f => f()); await sleep(10);
  assert.equal(dados.length, 2, 'se vuelve a pedir');
});

// --- F5.8 #3 y #4 (15/11): temas elegibles, y en Adivinar lo buscado en grande ---

test('el tema de fábrica es Madera; Ajustes › Aspecto lo cambia, lo anuncia y lo guarda; uno desconocido vuelve a Madera (V-10, C-02, C-05)', () => {
  const A = boot(APP);
  const html = A.doc.documentElement;
  assert.equal(html.dataset.theme, 'madera');
  assert.equal(html.dataset.scheme, 'dark');
  const boton = v => A.doc.querySelector(`#set-theme [data-v="${v}"]`);
  assert.equal(boton('madera').getAttribute('aria-pressed'), 'true');
  boton('partitura').click();
  assert.equal(html.dataset.theme, 'partitura');
  assert.equal(html.dataset.scheme, 'light', 'Partitura es un tema claro');
  assert.equal(boton('partitura').getAttribute('aria-pressed'), 'true');
  assert.equal(JSON.parse(A.store.get('trasteando.v1')).theme, 'partitura', 'se guarda');
  assert.equal(boot(APP, { theme: 'partitura' }).doc.documentElement.dataset.theme, 'partitura', 'y vuelve al abrir');
  assert.equal(boot(APP, { theme: 'neon' }).doc.documentElement.dataset.theme, 'madera', 'un valor desconocido no rompe nada');
});

test('«Automático» sigue el modo claro u oscuro del dispositivo, también si cambia con la app abierta; sin matchMedia, oscuro (V-10, PL-04)', () => {
  let oyente = null;
  const medio = { matches: true, addEventListener: (_, f) => { oyente = f; } };
  const A = boot(APP, { theme: 'auto' }, { matchMedia: q => /prefers-color-scheme/.test(q) ? medio : { matches: false } });
  const html = A.doc.documentElement;
  assert.equal(html.dataset.scheme, 'dark');
  medio.matches = false; oyente();
  assert.equal(html.dataset.scheme, 'light', 'el dispositivo pasa a claro y la app lo sigue');
  assert.equal(boot(APP, { theme: 'auto' }).doc.documentElement.dataset.scheme, 'dark', 'sin matchMedia, el caso más pobre: oscuro');
});

test('en un tema claro el pentagrama se escribe con la tinta del texto, no con el color pastel de la nota (V-10, G-05)', () => {
  const A = boot(APP, { theme: 'partitura' });
  A.press(A.doc.querySelectorAll('.fret-cell')[8]);
  const cabeza = A.$('staff').querySelector('ellipse');
  assert.equal(cabeza.getAttribute('fill'), 'currentColor', 'la tinta la pone el CSS, sin var() en el atributo (AT-15 #2)');
  // Cambiar de tema con una nota en el pentagrama la vuelve a escribir (AT-15 #1).
  A.doc.querySelector('#set-theme [data-v="madera"]').click();
  assert.match(A.$('staff').querySelector('ellipse').getAttribute('fill'), /^#/, 'de vuelta en Madera, otra vez su color');
  A.doc.querySelector('#set-theme [data-v="partitura"]').click();
  assert.equal(A.$('staff').querySelector('ellipse').getAttribute('fill'), 'currentColor');
  const B = boot(APP);
  B.press(B.doc.querySelectorAll('.fret-cell')[8]);
  assert.match(B.$('staff').querySelector('ellipse').getAttribute('fill'), /^#/, 'en Madera, el color de la nota');
});

test('en Adivinar las cuerdas de la pista son números grandes con la «ª» pequeña, y nada se corta con «…» (J-06, tu comentario del 16/11)', () => {
  const A = boot(APP, { hintNote: true, hintString: true });
  A.doc.querySelector('.tab[data-screen="guess"]').click();
  assert.ok(A.doc.querySelector('.ch-hints').classList.contains('has-clue'), 'con pistas encendidas, la franja es de pistas');
  const v = A.$('qb-hint-string').querySelector('.clue-v');
  const numeros = A.ev('positionsFor(challenge.midi).map(p => p.string.number)');
  const ords = v.querySelectorAll('.ord');
  assert.equal(ords.length, numeros.length, 'una por cuerda');
  ords.forEach((o, j) => {
    assert.equal(o.querySelector('small').textContent, 'ª', 'la «ª», aparte, para hacerla pequeña');
    assert.equal(o.textContent.trim(), numeros[j] + 'ª');
  });
  assert.ok(!v.classList.contains('long'), 'ya no se adivina el tamaño por el número de letras: se mide (encajar)');
  // El CSS: sin puntos suspensivos; la respuesta, a todo el ancho; y el iPhone
  // no agranda el texto por su cuenta al girar (text-size-adjust).
  const css = require('fs').readFileSync(require('path').join(__dirname, '..', 'css', 'trasteando.css'), 'utf8');
  const reglaV = css.match(/\.ch-hints\.has-clue \.chip\.clue \.clue-v \{[^}]*\}/)[0];
  assert.doesNotMatch(reglaV, /ellipsis/);
  assert.match(reglaV, /width:100%/);
  assert.match(css, /-webkit-text-size-adjust:\s*100%/);
  assert.match(css, /[^-]text-size-adjust:\s*100%/);
  assert.equal(A.ev('ENCAJE_MIN'), 20, 'nunca más pequeña que la nota que tocas (20 px, J-01); si no cabe, en dos líneas');
});

test('en inglés, las cuerdas de la pista llevan «st», «nd», «rd» y «th» pequeños (J-06, G-12)', () => {
  const A = boot(APP, { hintString: true, lang: 'en' });
  A.doc.querySelector('.tab[data-screen="guess"]').click();
  const fines = [...A.$('qb-hint-string').querySelectorAll('.ord small')].map(s => s.textContent);
  const esperados = JSON.parse(A.ev('JSON.stringify(positionsFor(challenge.midi).map(p => ord(p.string.number).replace(/^\\d+/, "")))'));
  assert.deepEqual(fines, esperados);
  assert.ok(fines.every(f => ['st', 'nd', 'rd', 'th'].includes(f)));
});
