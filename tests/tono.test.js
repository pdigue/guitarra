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
const FRAME = 2048;                       // lo que entrega un AnalyserNode con fftSize 2048
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

test('latencia: desde que suena la cuerda hasta que la aguja sale en su nota, menos de 300 ms (A-02-CA)', () => {
  // «Sale en su nota»: dos lecturas seguidas a menos de 15 cents de la
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
