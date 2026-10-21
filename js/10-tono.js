"use strict";

// 10-tono.js · Detector de tono (F4.2, A-02-CA): de un trozo de sonido del
// micrófono saca la frecuencia de la nota que suena, en un hilo aparte.
// Se carga como <script> clásico, en el orden de index.html: lo declarado aquí
// (const, let, function) lo ven los archivos que vienen después.

/* ============================================================
   10. DETECTOR DE TONO
   ============================================================ */

/* Cómo se encuentra la nota: el método YIN (de Cheveigné y Kawahara, 2002).
   Una cuerda que vibra repite su forma de onda cada «periodo»: 12,1 ms para
   el Mi grave (82,4 Hz), 3 ms para el Mi agudo. Si comparamos el sonido con
   una copia de sí mismo retrasada τ muestras, la diferencia es casi cero
   cuando τ es justo un periodo. YIN busca ese τ:
     1. Diferencia d(τ) entre el sonido y su copia retrasada, para cada τ.
     2. La normaliza (d'), para que un umbral sirva igual a cualquier volumen.
     3. Se queda con el PRIMER τ que baja del umbral: el primero es el periodo;
        los siguientes (2τ, 3τ) son octavas por debajo, el error típico.
     4. Afina τ entre dos muestras con una parábola: sin esto, a 48 kHz el
        error en el Mi agudo llegaría a varios cents.
   La frecuencia es entonces muestras por segundo / τ. */

const TONO = {
  MIN_HZ: 55,        // por debajo del La1: cabe un Do2 de afinaciones muy graves
  MAX_HZ: 1000,      // por encima de cualquier cuerda al aire
  UMBRAL: 0.15,      // d' por debajo de esto ya es «periódico»
  MIN_RMS: 0.004,    // por debajo, silencio: no se intenta adivinar
  MAX_DPRIMA: 0.35   // si ni el mejor τ baja de aquí, es ruido, no una nota
};

/**
 * Frecuencia fundamental de `x` (muestras entre −1 y 1) grabadas a `sr` Hz.
 * Devuelve { hz, claridad, rms } o null si no hay una nota clara.
 * Es autónoma (solo usa TONO), porque su texto se copia al hilo aparte.
 */
function detectarTono(x, sr, ajustes){
  const T = ajustes || TONO;
  const n = x.length;
  let suma = 0;
  for (let i = 0; i < n; i++) suma += x[i] * x[i];
  const rms = Math.sqrt(suma / n);
  if (rms < T.MIN_RMS) return null;

  const tauMin = Math.max(2, Math.floor(sr / T.MAX_HZ));
  const tauMax = Math.min(Math.ceil(sr / T.MIN_HZ), Math.floor(n / 2));
  const w = n - tauMax;                       // muestras que se comparan para cada τ
  const d = new Float64Array(tauMax + 2);

  // 1. Diferencia. Es la parte cara: unas 10⁶ operaciones por trozo.
  for (let tau = 1; tau <= tauMax + 1 && tau + w <= n; tau++){
    let s = 0;
    for (let j = 0; j < w; j++){ const v = x[j] - x[j + tau]; s += v * v; }
    d[tau] = s;
  }
  // 2. Normalizada: d'(τ) = d(τ) · τ / Σ d(1..τ).
  d[0] = 1;
  let acumulada = 0;
  for (let tau = 1; tau < d.length; tau++){
    acumulada += d[tau];
    d[tau] = acumulada > 0 ? d[tau] * tau / acumulada : 1;
  }
  // 3. El primer τ bajo el umbral, bajando hasta el fondo de ese valle.
  let tau = -1;
  for (let t = tauMin; t <= tauMax; t++){
    if (d[t] < T.UMBRAL){
      while (t + 1 <= tauMax && d[t + 1] < d[t]) t++;
      tau = t; break;
    }
  }
  if (tau < 0){                               // ninguno bajo el umbral: el mínimo, si es claro
    let mejor = tauMin;
    for (let t = tauMin + 1; t <= tauMax; t++) if (d[t] < d[mejor]) mejor = t;
    if (d[mejor] > T.MAX_DPRIMA) return null;
    tau = mejor;
  }
  // 4. Parábola por los tres puntos alrededor del mínimo.
  let fino = tau;
  if (tau > 1 && tau < d.length - 1){
    const a = d[tau - 1], b = d[tau], c = d[tau + 1];
    const den = a - 2 * b + c;
    if (den > 0) fino = tau + 0.5 * (a - c) / den;
  }
  const hz = sr / fino;
  if (hz < T.MIN_HZ || hz > T.MAX_HZ) return null;
  return { hz, claridad: 1 - d[tau], rms };
}

/**
 * Pone el detector en un hilo aparte (un Worker), para que analizar 20 trozos
 * por segundo no frene la aguja ni el resto de la app. El código del hilo se
 * crea aquí mismo a partir de detectarTono, así funciona también en el archivo
 * autónomo. Si el navegador no deja crear el hilo, analiza en el principal
 * (PL-04): va igual, solo que comparte tiempo con la interfaz.
 *   alResultado(r, sr)  recibe lo que devuelve detectarTono
 * Devuelve { analizar(x, sr), cerrar(), hilo } (hilo: true si hay Worker).
 */
function crearDetector(alResultado){
  const enPrincipal = {
    hilo: false,
    analizar(x, sr){ alResultado(detectarTono(x, sr), sr); },
    cerrar(){}
  };
  if (typeof Worker === 'undefined' || typeof Blob === 'undefined' || typeof URL === 'undefined') return enPrincipal;
  let url = null, w = null;
  try {
    const codigo = '"use strict";\nconst TONO = ' + JSON.stringify(TONO) + ';\n' + detectarTono.toString() +
      '\nonmessage = e => postMessage({ r: detectarTono(e.data.x, e.data.sr), sr: e.data.sr });\n';
    url = URL.createObjectURL(new Blob([codigo], { type: 'text/javascript' }));
    w = new Worker(url);
  } catch(e){
    if (url) URL.revokeObjectURL(url);
    return enPrincipal;
  }
  const det = {
    hilo: true,
    ocupado: false,
    analizar(x, sr){
      if (!det.hilo) return enPrincipal.analizar(x, sr);
      if (det.ocupado) return;                // si va con retraso, se salta un trozo
      det.ocupado = true;
      w.postMessage({ x, sr }, [x.buffer]);   // se pasa el trozo sin copiarlo
    },
    cerrar(){ try { w.terminate(); URL.revokeObjectURL(url); } catch(e){} }
  };
  w.onmessage = e => { det.ocupado = false; alResultado(e.data.r, e.data.sr); };
  // Algunos navegadores crean el hilo pero luego no lo dejan arrancar (por
  // ejemplo, abriendo la página como archivo): entonces, al principal.
  w.onerror = ev => { try { ev.preventDefault(); } catch(e){} det.hilo = false; det.ocupado = false; det.cerrar(); };
  return det;
}
