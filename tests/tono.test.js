// Banco del detector de tono (F4.2, A-02-CA). Se ejecuta con el resto: node --test
// Criterio: error ≤ ±2 cents y latencia < 300 ms sobre grabaciones reales de cada
// cuerda al aire, desafinadas una cantidad conocida. La referencia es la
// frecuencia medida de cada grabación (samples/afinacion.json), no la teórica.
// Las muestras las prepara herramientas/generar-muestras-afinador.py.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const fs = require('fs');
const vm = require('vm');

const RAIZ = path.join(__dirname, '..');
const ctx = vm.createContext({ Math, Float64Array, Float32Array, JSON });
vm.runInContext(fs.readFileSync(path.join(RAIZ, 'js', '10-tono.js'), 'utf8'), ctx, { filename: 'js/10-tono.js' });
const detectar = (x, sr) => ctx.detectarTono(x, sr);

const MUESTRAS = path.join(__dirname, 'muestras-afinador');
const indice = JSON.parse(fs.readFileSync(path.join(MUESTRAS, 'indice.json'), 'utf8'));
const SR = indice.sr;
const FRAME = 4096;                       // lo que entrega el AnalyserNode del afinador (fftSize 4096 desde F5.8 #2)
const cents = (hz, ref) => 1200 * Math.log2(hz / ref);

/** WAV de 16 bits mono (el que escribe generar-muestras-afinador.py) → Float32Array. */
function leerWav(nombre){
  const b = fs.readFileSync(path.join(MUESTRAS, nombre));
  const datos = b.indexOf('data') + 8;
  const x = new Float32Array((b.length - datos) / 2);
  for (let i = 0; i < x.length; i++) x[i] = b.readInt16LE(datos + 2 * i) / 32768;
  return x;
}

/** Desafina `c` cents leyendo más deprisa o más despacio (como girar la clavija). */
function desafinar(x, c){
  const r = 2 ** (c / 1200), y = new Float32Array(Math.floor((x.length - 1) / r));
  for (let i = 0; i < y.length; i++){
    const p = i * r, k = Math.floor(p), f = p - k;
    y[i] = x[k] * (1 - f) + x[k + 1] * f;
  }
  return y;
}

const trozo = (x, fin) => x.slice(fin - FRAME, fin);
const mediana = v => { const s = [...v].sort((a, b) => a - b); return s[s.length >> 1]; };

const DESAFINADOS = [-45, -20, -6, 4, 15, 40];
// Ventana en la que se midió cada grabación (medir-afinacion.py): desde 80 ms
// tras el ataque, 2^15 muestras a 44,1 kHz.
const VENTANA = [0.08, 0.08 + 2 ** 15 / 44100];

/** Medidas cada 20 ms dentro de [desde, hasta] segundos tras el ataque: [{ t, hz }]. */
function medidas(y, ataque, desde, hasta){
  const out = [];
  for (let t = desde; t <= hasta + 1e-9; t += 0.02){
    const fin = ataque + Math.round(t * SR);
    if (fin > y.length) break;
    const res = detectar(trozo(y, fin), SR);
    out.push({ t, hz: res ? res.hz : null });
  }
  return out;
}

test('precisión absoluta: cada cuerda al aire, en los dos timbres y desafinada de −45 a +40 cents, a ±2 cents de su frecuencia medida (A-02-CA)', () => {
  let peor = { err: 0 };
  for (const m of indice.muestras){
    const x = leerWav(m.archivo);
    for (const c of [0, ...DESAFINADOS]){
      const y = c ? desafinar(x, c) : x, r = 2 ** (c / 1200), ref = m.hz_medida * r;
      // Los trozos que caben enteros en la ventana de la medida de referencia.
      const v = medidas(y, Math.round(m.ataque_s * SR / r), VENTANA[0] / r + FRAME / SR, VENTANA[1] / r);
      assert.ok(v.every(p => p.hz), `${m.archivo} ${c} cents: algún trozo sin nota`);
      const err = mediana(v.map(p => cents(p.hz, ref)));
      if (Math.abs(err) > Math.abs(peor.err)) peor = { err, caso: `${m.archivo} ${c}` };
      assert.ok(Math.abs(err) <= 2, `${m.archivo} desafinada ${c} cents: error ${err.toFixed(2)} cents`);
    }
  }
  console.log('  peor error absoluto: %s cents (%s)', peor.err.toFixed(2), peor.caso);
});

test('precisión trozo a trozo: lo que se gira la clavija se mide a ±2 cents en cada instante (A-02-CA)', () => {
  // La cuerda real no suena fija: al pulsarla suena algo alta y oscila unos
  // cents. Comparando cada trozo con el mismo instante sin desafinar, esa
  // oscilación se cancela y queda solo el error del detector.
  let peor = { err: 0 };
  for (const m of indice.muestras){
    const x = leerWav(m.archivo), ax = Math.round(m.ataque_s * SR);
    for (const c of DESAFINADOS){
      const r = 2 ** (c / 1200), y = desafinar(x, c), ay = Math.round(m.ataque_s * SR / r);
      // Desde 0,15 s: en los primeros 100 ms el tono cae tan deprisa que dos trozos
      // «del mismo instante» ya no suenan igual (el desafinado dura r veces menos).
      for (let t = 0.15; t <= 0.8; t += 0.05){
        const fy = ay + Math.round(t * SR), fx = ax + Math.round(t * r * SR);
        if (fy > y.length || fx > x.length) break;
        const a = detectar(trozo(y, fy), SR), b = detectar(trozo(x, fx), SR);
        assert.ok(a && b, `${m.archivo} ${c} cents: sin nota a ${t.toFixed(2)} s`);
        const err = cents(a.hz, b.hz) - c;
        if (Math.abs(err) > Math.abs(peor.err)) peor = { err, caso: `${m.archivo} ${c} a ${t.toFixed(2)} s` };
        assert.ok(Math.abs(err) <= 2, `${m.archivo} ${c} cents a ${t.toFixed(2)} s: error ${err.toFixed(2)} cents`);
      }
    }
  }
  console.log('  peor error trozo a trozo: %s cents (%s)', peor.err.toFixed(2), peor.caso);
});

test('latencia: desde que suena la cuerda hasta que el detector da su nota, menos de 300 ms (A-02-CA)', () => {
  // Es la latencia del detector y de la espera entre trozos; la del micrófono
  // del aparato y la animación de la aguja (0,12 s) se suman aparte (AT-07 #10).
  // «Da su nota»: dos lecturas seguidas a menos de 15 cents de la
  // referencia, sin saltos de octava. Que luego la cuerda baje unos cents
  // mientras se asienta es la cuerda, no el detector (prueba anterior).
  const HOP = Math.round(0.05 * SR);       // la app pide un trozo cada 50 ms
  let peor = 0, coste = [], caso = 0;
  for (const m of indice.muestras){
    for (const c of [-20, 0, 15]){
      const nota = desafinar(leerWav(m.archivo), c), r = 2 ** (c / 1200), ref = m.hz_medida * r;
      const silencio = Math.round(0.3 * SR) + (caso++ * 977) % HOP;   // el ataque cae en distintos puntos entre dos trozos
      const y = new Float32Array(silencio + nota.length); y.set(nota, silencio);
      const inicio = silencio + Math.round(m.ataque_s * SR / r);
      let latencia = null, previa = false;
      for (let fin = FRAME; fin <= y.length; fin += HOP){
        const t0 = process.hrtime.bigint();
        const res = detectar(trozo(y, fin), SR);
        if (res) coste.push(Number(process.hrtime.bigint() - t0) / 1e6);
        if (fin < inicio - FRAME / 2) { assert.equal(res, null, 'en silencio no inventa notas'); continue; }
        const buena = !!res && Math.abs(cents(res.hz, ref)) <= 15;
        if (buena && previa){ latencia = (fin - inicio) / SR * 1000; break; }
        previa = buena;
      }
      assert.ok(latencia !== null, `${m.archivo} ${c}: la aguja nunca sale en su nota`);
      peor = Math.max(peor, latencia);
    }
  }
  const calculo = Math.max(...coste);
  console.log('  peor latencia: %s ms de sonido; cálculo por trozo: hasta %s ms', peor.toFixed(0), calculo.toFixed(1));
  assert.ok(peor + calculo < 300, `latencia ${peor.toFixed(0)} ms + ${calculo.toFixed(1)} ms de cálculo`);
});

test('silencio y ruido no dan nota; tonos sintéticos de 61 a 440 Hz, a ±1 cent (A-02-CA)', () => {
  assert.equal(detectar(new Float32Array(FRAME), SR), null, 'silencio');
  let semilla = 7;
  const azar = () => { semilla = (semilla * 16807) % 2147483647; return semilla / 2147483647 - 0.5; };
  const ruido = (amp) => Float32Array.from({ length: FRAME }, () => amp * azar());
  assert.equal(detectar(ruido(0.005), SR), null, 'ruido muy bajo');
  assert.equal(detectar(ruido(0.4), SR), null, 'ruido fuerte: no es una nota');
  // Nota sintética de frecuencia exacta: 12 armónicos que se debilitan, con
  // fase al azar, apagándose y con un ruido de fondo 30 dB por debajo. Las
  // cuerdas reales (con armónicos algo desplazados) son las de las pruebas de arriba.
  for (const hz of [61.74, 65.41, 73.42, 98, 233.08, 392, 440]){
    const x = new Float32Array(FRAME);
    for (let k = 1; k <= 12; k++){
      const fase = 6.283 * (azar() + 0.5);
      for (let i = 0; i < FRAME; i++) x[i] += (0.5 / k) * Math.exp(-3 * i / SR) * Math.sin(6.283185307 * k * hz * i / SR + fase);
    }
    for (let i = 0; i < FRAME; i++) x[i] += 0.03 * azar();
    const res = detectar(x, SR);
    assert.ok(res, hz + ' Hz sin nota');
    assert.ok(Math.abs(cents(res.hz, hz)) <= 1, `${hz} Hz: ${cents(res.hz, hz).toFixed(2)} cents`);
  }
});

test('sin Worker, el detector trabaja en el hilo principal y da el mismo resultado (PL-04)', () => {
  const resultados = [];
  const det = ctx.crearDetector(r => resultados.push(r));
  assert.equal(det.hilo, false);
  const x = leerWav('nylon-A2.wav');
  det.analizar(trozo(x, Math.round(0.3 * SR)), SR);
  assert.equal(resultados.length, 1);
  assert.ok(Math.abs(cents(resultados[0].hz, 110.05)) <= 2);
});

test('con tarjetas de sonido de 96 kHz, un trozo de 4096 valores mide los graves; con uno corto calla en vez de equivocarse (AT-07 #1)', () => {
  const sr = 96000;
  const nota = (hz, n) => { const x = new Float32Array(n);
    for (let k = 1; k <= 8; k++) for (let i = 0; i < n; i++) x[i] += 0.3 / k * Math.sin(2 * Math.PI * k * hz * i / sr + k);
    return x; };
  for (const hz of [73.42, 82.41, 110]){
    const r = detectar(nota(hz, 4096), sr);
    assert.ok(r && Math.abs(cents(r.hz, hz)) <= 1, `${hz} Hz a 96 kHz: ${r && cents(r.hz, hz).toFixed(2)}`);
  }
  assert.equal(detectar(nota(82.41, 2048), sr), null, 'con 2048 valores a 96 kHz no abarca dos periodos: no responde');
});

// --- F5.8 #2 (12/11): seguir la nota mientras se apaga, no solo su ataque ---
// Se prueba la lógica de verdad (seguirNota, de js/11-afinador-micro.js) con una
// cuerda sintética que se apaga dentro de un ruido de fondo, a un volumen de
// micrófono de móvil sin control automático: pico de 0,05 sobre 1 y ruido de 0,002.
// Los filtros son los mismos que la app pone delante del analizador (BiquadFilterNode),
// escritos aquí con sus fórmulas, porque en Node no hay Web Audio.

const afinador = vm.createContext({ Math, Float64Array, Float32Array, JSON, Object, Date });
for (const f of ['10-tono.js', '11-afinador-micro.js'])
  vm.runInContext(fs.readFileSync(path.join(RAIZ, 'js', f), 'utf8'), afinador, { filename: 'js/' + f });
vm.runInContext('this.api = { TONO, MIC, mic, seguirNota, detectarTono }', afinador);
const { MIC, mic, seguirNota } = afinador.api;

/** Filtro de segundo orden (fórmulas del «Audio EQ Cookbook», las de BiquadFilterNode). */
function biquad(x, tipo, f0, q){
  const w = 2 * Math.PI * f0 / SR, alfa = Math.sin(w) / (2 * q), c = Math.cos(w);
  const b0 = tipo === 'lowpass' ? (1 - c) / 2 : (1 + c) / 2, b1 = tipo === 'lowpass' ? 1 - c : -(1 + c);
  const a0 = 1 + alfa, a1 = -2 * c, a2 = 1 - alfa;
  const y = new Float32Array(x.length);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < x.length; i++){
    const v = (b0 * x[i] + b1 * x1 + b0 * x2 - a1 * y1 - a2 * y2) / a0;
    x2 = x1; x1 = x[i]; y2 = y1; y1 = v; y[i] = v;
  }
  return y;
}
const filtrosDelAfinador = x => biquad(biquad(biquad(x, 'highpass', MIC.GRAVES_HZ, 0.707), 'lowpass', MIC.AGUDOS_HZ, 0.54), 'lowpass', MIC.AGUDOS_HZ, 1.31);

/** Ruido repetible: el mismo en cada pasada del banco. */
function ruidoBlanco(n, rms, semilla = 7){
  const x = new Float32Array(n);
  let s = semilla;
  for (let i = 0; i < n; i++){ s = (s * 1664525 + 1013904223) >>> 0; x[i] = (s / 4294967296 - 0.5) * 2 * rms * Math.sqrt(3); }
  return x;
}

/** Una cuerda pulsada: seis armónicos que se apagan (los agudos, antes), con
 *  la nota en hz(t) por si se gira la clavija. Pico ≈ `pico`. */
function cuerda(hz, segundos, pico = 0.05){
  const n = Math.floor(segundos * SR), x = new Float32Array(n), fases = [0, 0, 0, 0, 0, 0];
  for (let i = 0; i < n; i++){
    const t = i / SR, f = typeof hz === 'function' ? hz(t) : hz;
    let v = 0;
    for (let k = 1; k <= 6; k++){ fases[k - 1] += 2 * Math.PI * k * f / SR; v += Math.sin(fases[k - 1]) / k * Math.exp(-t * k / 1.5); }
    x[i] = v * pico / 1.6;
  }
  return x;
}
const sumar = (a, b) => a.map((v, i) => v + b[i]);
/** Medio segundo de silencio (solo el ruido) antes de la nota, como al usar el
 *  afinador de verdad: así mide el ruido de fondo antes de que suene nada. */
const ENTRADA = 0.5;
function conRuido(nota, rms){
  const x = ruidoBlanco(nota.length + ENTRADA * SR, rms);
  for (let i = 0; i < nota.length; i++) x[i + ENTRADA * SR] += nota[i];
  return x;
}

/** Pasa el sonido por el afinador como hace la app: un trozo cada 50 ms. */
function escuchar(x, { filtrado = true, t0 = 0 } = {}){
  const s = filtrado ? filtrosDelAfinador(x) : x, n = 4096, lecturas = [];
  for (let fin = n; fin <= s.length; fin += SR * MIC.PERIODO_MS / 1000){
    const ms = t0 + fin / SR * 1000;
    const trozo = s.subarray(fin - n, fin);
    let suma = 0;
    for (let i = 0; i < n; i++) suma += trozo[i] * trozo[i];
    const r = afinador.api.detectarTono(trozo, SR, mic.siguiendo ? MIC.SEGUIR : MIC.BUSCAR);
    lecturas.push({ ms, hz: seguirNota(r, ms, Math.sqrt(suma / n)) });
  }
  return lecturas;
}
const reiniciar = () => Object.assign(mic, { lecturas: [], candidatas: [], siguiendo: false, ultima: 0, ruido: MIC.RUIDO_INICIAL });
const ultimaLectura = l => { const v = l.filter(e => e.hz); return v.length ? v[v.length - 1].ms / 1000 - ENTRADA : 0; };

test('el afinador sigue la nota mientras se apaga, no solo su ataque (A-02, F5.8 #2)', () => {
  const informe = [];
  for (const [nombre, hz] of [['Mi2', 82.41], ['La2', 110], ['Sol3', 196], ['Mi4', 329.63]]){
    const x = conRuido(cuerda(hz, 6), 0.002);
    // Antes: sin filtros y exigiendo siempre la claridad del ataque.
    let antes = 0;
    for (let fin = 2048; fin <= x.length; fin += SR * 0.05){
      const r = detectar(x.subarray(fin - 2048, fin), SR);
      if (r && r.claridad >= MIC.CLARIDAD) antes = fin / SR - ENTRADA;
    }
    reiniciar();
    const l = escuchar(x), ahora = ultimaLectura(l), validas = l.filter(e => e.hz);
    informe.push(`${nombre} ${antes.toFixed(1)} → ${ahora.toFixed(1)} s`);
    assert.ok(ahora >= 3, `${nombre}: se sigue ${ahora.toFixed(1)} s; debe seguirse al menos 3 s`);
    assert.ok(ahora >= 1.3 * antes, `${nombre}: ${antes.toFixed(1)} s antes, ${ahora.toFixed(1)} s ahora`);
    const peor = Math.max(...validas.map(e => Math.abs(cents(e.hz, hz))));
    assert.ok(peor <= 6, `${nombre}: con ruido y apagándose, la peor lectura se va ${peor.toFixed(1)} cents`);
    const primera = validas[0].ms - ENTRADA * 1000;
    assert.ok(primera < 300, `${nombre}: la primera lectura llega a los ${primera.toFixed(0)} ms`);
  }
  console.log('  nota seguida, antes → ahora: ' + informe.join(' · '));
});

test('el ruido solo no mueve la aguja; al girar la clavija la sigue; y otra cuerda la releva enseguida (A-02, A-04)', () => {
  for (const rms of [0.001, 0.004, 0.02]){
    reiniciar();
    assert.equal(escuchar(ruidoBlanco(10 * SR, rms)).filter(e => e.hz).length, 0, `ruido de ${rms}: ninguna lectura`);
  }
  // La clavija: de 40 cents baja a afinada en 2 s. Cada lectura, a menos de 8 cents de lo que suena en ese momento.
  reiniciar();
  const giro = t => 110 * 2 ** (-40 * Math.max(0, 1 - t / 2) / 1200);
  const l = escuchar(conRuido(cuerda(giro, 3, 0.05), 0.001)).filter(e => e.hz);
  assert.ok(l.length > 40, 'se sigue todo el giro: ' + l.length + ' lecturas');
  for (const e of l) assert.ok(Math.abs(cents(e.hz, giro(e.ms / 1000 - ENTRADA - 0.15))) < 8, `a los ${e.ms.toFixed(0)} ms`);
  assert.ok(Math.abs(cents(l[l.length - 1].hz, 110)) < 2, 'y acaba afinada');
  // Otra cuerda: sin esperar a soltar la anterior.
  const otra = escuchar(sumar(cuerda(146.83, 1), ruidoBlanco(SR, 0.001)), { t0: 3500 }).filter(e => e.hz);
  assert.ok(otra[0].ms - 3500 < 300 && Math.abs(cents(otra[0].hz, 146.83)) < 5, 'la 4ª releva a la 5ª en menos de 300 ms');
});

test('siguiendo una nota, si el detector salta a su octava se pliega; una nota lejana no cuela con poca claridad (AT-07 #2)', () => {
  reiniciar();
  const clara = hz => ({ hz, claridad: 0.95 }), floja = hz => ({ hz, claridad: 0.6 });
  assert.equal(seguirNota(clara(110), 0), 0, 'una sola lectura no basta');
  assert.ok(Math.abs(seguirNota(clara(110.2), 50) - 110.2) < 0.2, 'dos que coinciden, sí');
  assert.ok(Math.abs(cents(seguirNota(floja(220.6), 100), 110.2)) < 5, 'la octava, floja, se pliega a la nota seguida');
  assert.equal(seguirNota(floja(146.8), 150), 0, 'otra nota, floja: se ignora');
  assert.equal(mic.siguiendo, true);
  assert.equal(seguirNota(null, 150 + MIC.SOLTAR_MS + 1), 0);
  assert.equal(mic.siguiendo, false, 'sin lecturas un rato, se suelta');
  assert.equal(seguirNota(floja(110), 900), 0, 'y ya no basta con una lectura floja');
});

// --- Correcciones de la auditoría AT-14 ---

test('una octava clara es otra cuerda (Drop D: 6ª y 4ª), no la misma plegada; y dos candidatas deben ser seguidas (AT-14 #1, #5)', () => {
  const clara = hz => ({ hz, claridad: 0.95 });
  reiniciar();
  seguirNota(clara(73.42), 0); seguirNota(clara(73.42), 50);          // la 6ª en Re2
  assert.equal(mic.siguiendo, true);
  assert.equal(seguirNota(clara(146.83), 100), 0, 'la primera lectura de la 4ª aún no releva');
  assert.ok(Math.abs(cents(seguirNota(clara(146.83), 150), 146.83)) < 1, 'la segunda, sí: Re3, no Re2');
  reiniciar();
  seguirNota(clara(110), 0);
  assert.equal(seguirNota(clara(110), 1000), 0, 'un segundo después ya no son «dos seguidas»');
  assert.equal(mic.siguiendo, false);
});

test('un instante de silencio total no deja el ruido de fondo en cero; y sin lecturas no se «sigue» nada (AT-14 #2, #3)', () => {
  reiniciar();
  for (let i = 0; i < 5; i++) seguirNota(null, i * 50, 0);
  assert.ok(mic.ruido >= MIC.RUIDO_MINIMO, 'ruido estimado: ' + mic.ruido);
  Object.assign(mic, { siguiendo: true, lecturas: [] });
  assert.equal(seguirNota({ hz: 110, claridad: 0.6 }, 300), 0);
  assert.equal(mic.siguiendo, false);
});

test('con las grabaciones reales y ruido de fondo, el camino entero del afinador da la nota a tiempo y sin lecturas disparatadas (A-02, AT-14)', () => {
  let peor = 0, masLenta = 0;
  for (const m of indice.muestras){
    const x0 = leerWav(m.archivo);
    let pico = 0;
    for (const v of x0) pico = Math.max(pico, Math.abs(v));
    reiniciar();
    const validas = escuchar(conRuido(x0.map(v => v / pico * 0.05), 0.001)).filter(e => e.hz);
    assert.ok(validas.length >= 5, `${m.archivo}: ${validas.length} lecturas`);
    const primera = validas[0].ms - ENTRADA * 1000 - m.ataque_s * 1000;
    masLenta = Math.max(masLenta, primera);
    // Al pulsarla, una cuerda real suena unos cents alta y se asienta en unos
    // 0,3 s (eso es la cuerda, no el detector): se mide ya asentada.
    for (const e of validas) if (e.ms - ENTRADA * 1000 > m.ataque_s * 1000 + 300) peor = Math.max(peor, Math.abs(cents(e.hz, m.hz_medida)));
  }
  console.log(`  grabaciones con ruido: primera lectura en ${masLenta.toFixed(0)} ms como mucho; ya asentada la cuerda, peor lectura a ${peor.toFixed(1)} cents de su medida`);
  assert.ok(masLenta < 300, 'primera lectura: ' + masLenta.toFixed(0) + ' ms');
  assert.ok(peor <= 5, 'peor lectura: ' + peor.toFixed(1) + ' cents');
});
