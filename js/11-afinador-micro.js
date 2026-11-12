"use strict";

// 11-afinador-micro.js · Afinador por micrófono (F4.3, A-02 a A-05): escucha la
// cuerda, la compara con la afinación activa y dice cuánto subir o bajar.
// Se carga como <script> clásico, en el orden de index.html: lo declarado aquí
// (const, let, function) lo ven los archivos que vienen después.

/* ============================================================
   11. AFINADOR POR MICRÓFONO
   ============================================================ */

/* Recorrido del sonido: micrófono → filtros → AnalyserNode (guarda los últimos
   4096 valores) → cada 50 ms copiamos esos valores y se los damos al detector
   (10-tono.js), que trabaja en un hilo aparte → con cada frecuencia
   calculamos los cents respecto a la cuerda y movemos la aguja.
   Un cent es la centésima parte de un semitono: cents = 1200 · log2(f / fRef). */

/* Seguir la nota (F5.8 #2). Una cuerda suena fuerte y clara solo al pulsarla;
   después se apaga durante segundos, cada vez más floja y más mezclada con el
   ruido de la habitación. Para no quedarse solo con ese primer instante:
   1. Antes de analizar, se filtra el sonido: fuera lo que queda por debajo de
      60 Hz (zumbidos) y por encima de 1200 Hz (soplido), donde no hay nada de
      una cuerda al aire que haga falta para saber su nota.
   2. Para EMPEZAR a seguir una nota se pide lo de siempre: dos lecturas
      seguidas, claras y que coincidan. Así un golpe o una voz no mueven la aguja.
   3. Una vez «enganchada», basta con mucha menos claridad y volumen mientras
      la lectura siga cerca de las anteriores: la nota se sigue hasta que se
      hunde en el ruido de fondo. Ese ruido se mide todo el rato (el nivel más
      bajo oído últimamente), y una lectura solo cuenta si suena bastante por
      encima: pegada al ruido, la nota «baila» y la aguja engañaría.
   4. Cuando deja de oírse, lo último medido se queda en pantalla, atenuado,
      un par de segundos: da tiempo a mirar y girar la clavija. */
const MIC = {
  PERIODO_MS: 50,        // un trozo cada 50 ms: 20 lecturas por segundo
  AFINADA: 5,            // ±5 cents es «afinada» (A-03)
  CLARIDAD: 0.8,         // para empezar a seguir una nota: lecturas menos claras (ruido, golpes) se ignoran
  CLARIDAD_SEGUIR: 0.5,  // siguiéndola ya, basta con esto…
  CERCA: 20,             // …si cae a menos de estos cents de las últimas lecturas
  LECTURAS: 7,           // cuántas lecturas se promedian para la aguja
  SOBRE_RUIDO: 4,        // una lectura cuenta si suena al menos 4 veces (12 dB) por encima del ruido de fondo
  RUIDO_INICIAL: 0.0005, // ruido de fondo supuesto al encender, hasta medirlo
  RUIDO_MINIMO: 0.0002,  // suelo: un instante de silencio total (al arrancar el micrófono) no es «el ruido de la habitación» (AT-14 #2)
  RUIDO_SUBE: 1.03,      // sin nota, el ruido estimado sube como mucho un 3 % por trozo (se dobla en 1,2 s)…
  RUIDO_SUBE_NOTA: 1.002, // …y con una nota sonando, un 0,2 % (17 s): la nota no es ruido. Bajar, baja al instante
  SOLTAR_MS: 600,        // sin lecturas de la nota seguida durante este tiempo, se suelta
  SOSTEN_MS: 2500,       // lo último medido se queda en pantalla este tiempo, atenuado
  GRAVES_HZ: 60, AGUDOS_HZ: 1200   // el filtro de antes del análisis
};
// Lo que se le pide al detector en cada caso (sustituye a TONO en ese trozo).
MIC.BUSCAR = Object.assign({}, TONO, { MIN_RMS: 0.002 });
MIC.SEGUIR = Object.assign({}, TONO, { MIN_RMS: 0.0006, MAX_DPRIMA: 1 - MIC.CLARIDAD_SEGUIR });

const mic = {
  stream: null, src: null, filtros: [], analyser: null, det: null, timer: null,
  string: 'auto',          // 'auto' o el número de cuerda elegido a mano (A-05)
  lecturas: [],            // últimas frecuencias de la nota que se sigue
  candidatas: [],          // lecturas claras de otra nota: con dos que coincidan, se cambia a ella
  siguiendo: false,        // hay una nota «enganchada»
  ultima: 0,               // momento de la última lectura válida
  ultimaHz: 0,             // lo último enseñado, para repintarlo si cambias de cuerda
  candidataT: 0,           // momento de la última candidata
  detalle: '',             // el texto de cents y cuerda, sin el «Última lectura»
  ruido: MIC.RUIDO_INICIAL, // nivel del ruido de fondo: el más bajo oído últimamente
  nivel: 0,                // nivel (RMS) del último trozo
  mostrando: false,        // hay una lectura en pantalla (sonando o sostenida)
  orden: '',               // para no repetir el aviso al lector de pantalla
  arrancando: false
};

const hzDeMidi = m => 440 * Math.pow(2, (m - 69) / 12);
const centsEntre = (hz, ref) => 1200 * Math.log2(hz / ref);

/** Por qué no se puede usar el micrófono aquí, o '' si se puede (PL-04). */
function micUnavailable(){
  if (typeof location !== 'undefined' && location.protocol === 'file:')
    return t('mic.file');
  if (window.isSecureContext === false)
    return t('mic.https');
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)
    return t('mic.nobrowser');
  return '';
}

/** A-04 y A-05: la cuerda de referencia para una frecuencia. Con «Auto», la de
 *  nota más cercana en la afinación activa; si eliges una, siempre esa.
 *  Devuelve { cuerda, hz }: hz puede ser la mitad de la detectada (abajo). */
function micTarget(hz){
  const cuerdas = displayStrings();
  if (mic.string !== 'auto'){
    const s = cuerdas.find(c => c.number === +mic.string);
    if (s) return { cuerda: s, hz };
  }
  const cercana = f => {
    let mejor = cuerdas[0], dist = Infinity;
    for (const c of cuerdas){
      const d = Math.abs(centsEntre(f, hzDeMidi(c.openMidi)));
      if (d < dist){ dist = d; mejor = c; }
    }
    return { cuerda: mejor, hz: f, dist };
  };
  // Con un micrófono pequeño, la fundamental de una cuerda grave puede casi no
  // oírse y el detector da su octava. Si la mitad cae justo en una cuerda y lo
  // detectado no, era eso (AT-07 #2).
  const tal = cercana(hz), mitad = cercana(hz / 2);
  return (tal.dist > 100 && mitad.dist < 50) ? mitad : tal;
}

/** El centro de unas lecturas: se ordenan, se quitan las de los extremos (con
 *  cinco o más, las dos más bajas y las dos más altas) y se promedia el resto.
 *  Una lectura suelta disparatada no lo mueve, y el temblor del ruido se reparte. */
function centro(v){
  const o = [...v].sort((x, y) => x - y), quitar = o.length >= 5 ? 2 : o.length >= 3 ? 1 : 0;
  const medio = o.slice(quitar, o.length - quitar);
  return medio.reduce((a, b) => a + b, 0) / medio.length;
}

/**
 * Decide qué hacer con una lectura del detector (o con su falta) y devuelve
 * la frecuencia que hay que enseñar, o 0 si esta lectura no cuenta.
 * Va aparte de la pantalla para poder probarla con grabaciones (tests/tono.test.js).
 */
function seguirNota(r, ahora, nivel){
  // El ruido de fondo: el nivel más bajo oído últimamente. Baja de golpe a
  // cualquier nivel menor; subir, sube despacio, y casi nada mientras suena una
  // nota, para que una nota larga no pase por ruido. Sin nivel, no se usa.
  if (nivel >= 0){
    const esNota = mic.siguiendo || (r && r.claridad >= MIC.CLARIDAD);
    mic.ruido = Math.min(Math.max(nivel, MIC.RUIDO_MINIMO), mic.ruido * (esNota ? MIC.RUIDO_SUBE_NOTA : MIC.RUIDO_SUBE));
    if (r && nivel < mic.ruido * MIC.SOBRE_RUIDO) r = null;   // pegada al ruido: no cuenta
  }
  if (mic.siguiendo && !mic.lecturas.length) mic.siguiendo = false;   // sin lecturas no hay con qué comparar (AT-14 #3)
  if (mic.siguiendo && r && r.claridad >= MIC.CLARIDAD_SEGUIR){
    // ¿Es la nota que se sigue? Se compara con el centro de las últimas
    // lecturas, no con la primera: al girar la clavija la nota se desliza, y
    // hay que ir con ella; y una lectura mala suelta no arrastra a las demás.
    // Al apagarse la fundamental, el detector puede dar la octava: se pliega,
    // pero solo si llega floja. Clara y en otra octava es otra cuerda (en Drop D,
    // la 6ª y la 4ª son Re con una octava de por medio) y va a candidata (AT-14 #1).
    let c = centsEntre(r.hz, centro(mic.lecturas));
    const octavas = Math.round(c / 1200);
    c -= 1200 * octavas;
    const plegable = octavas === 0 || (Math.abs(octavas) === 1 && r.claridad < MIC.CLARIDAD);
    if (Math.abs(c) < MIC.CERCA && plegable){
      mic.lecturas.push(r.hz / Math.pow(2, octavas));
      if (mic.lecturas.length > MIC.LECTURAS) mic.lecturas.shift();
      mic.candidatas = [];
      mic.ultima = ahora;
      return centro(mic.lecturas);
    }
  }
  if (r && r.claridad >= MIC.CLARIDAD){
    // Clara, pero no es la que se sigue (o no se sigue ninguna): candidata.
    const previa = mic.candidatas[mic.candidatas.length - 1];
    // «Seguidas» de verdad: una candidata de hace más de tres trozos ya no cuenta (AT-14 #5).
    if (previa && (Math.abs(centsEntre(r.hz, previa)) > 40 || ahora - mic.candidataT > 3 * MIC.PERIODO_MS)) mic.candidatas = [];
    mic.candidatas.push(r.hz); mic.candidataT = ahora;
    if (mic.candidatas.length >= 2){          // dos seguidas que coinciden: es otra nota
      mic.lecturas = mic.candidatas; mic.candidatas = [];
      mic.siguiendo = true;
      mic.ultima = ahora;
      return centro(mic.lecturas);
    }
  }
  if (mic.siguiendo && ahora - mic.ultima > MIC.SOLTAR_MS){ mic.siguiendo = false; mic.lecturas = []; }
  return 0;
}

/** Cada lectura del detector: se enseña si cuenta; si no, lo último medido se
 *  queda un rato atenuado y después la aguja vuelve a reposo. */
function onMicReading(r, _sr, ahora = Date.now()){
  if (!mic.analyser) return;
  const hz = seguirNota(r, ahora, mic.nivel);
  if (hz){ mic.ultimaHz = hz; showMicReading(hz); return; }
  if (!mic.mostrando) return;
  if (ahora - mic.ultima > MIC.SOSTEN_MS) showMicIdle();
  else if (ahora - mic.ultima > 4 * MIC.PERIODO_MS) setMicHeld(true);   // 200 ms: sin parpadeos al borde del ruido (AT-14 #8)
}

function showMicReading(hzDetectada){
  const { cuerda: s, hz } = micTarget(hzDetectada);
  let c = centsEntre(hz, hzDeMidi(s.openMidi));
  // Con una cuerda elegida a mano, un salto de octava del detector (oír el
  // segundo armónico) no debe decir «baja 12 semitonos»: una cuerda no se
  // desafina una octava.
  if (mic.string !== 'auto') c -= 1200 * Math.round(c / 1200);
  const info = noteInfo(s.openMidi);
  const nota = document.getElementById('mic-note');
  nota.textContent = noteName(s.openMidi) + info.octave;
  const redondo = Math.round(c);
  mic.detalle = t('mic.detail', { c: (redondo > 0 ? '+' : redondo < 0 ? '−' : '') + Math.abs(redondo), o: ord(s.number) });
  document.getElementById('mic-detail').textContent = mic.detalle;
  // Se decide con el número que se ve (AT-07 #5). Ya afinada, hace falta
  // pasar de ±7 para dejar de estarlo: así el aviso no parpadea en el borde
  // y el lector de pantalla no lo repite sin parar (AT-07 #4).
  const limite = mic.orden === 'afinada' ? MIC.AFINADA + 2 : MIC.AFINADA;
  let orden, texto;
  if (Math.abs(redondo) <= limite){ orden = 'afinada'; texto = ['✓', t('mic.tuned')]; }
  else if (redondo < 0){ orden = redondo < -50 ? 'sube' : 'sube-poco'; texto = ['▲', t(redondo < -50 ? 'mic.up' : 'mic.upBit')]; }
  else { orden = redondo > 50 ? 'baja' : 'baja-poco'; texto = ['▼', t(redondo > 50 ? 'mic.down' : 'mic.downBit')]; }
  setMicOrder(orden, texto);
  setNeedle(c, true);
  mic.mostrando = true;
  setMicHeld(false);
}

/** Sostenida: ya no se oye, pero lo último medido sigue a la vista, atenuado. */
function setMicHeld(on){
  const vivo = document.getElementById('mic-live');
  if (vivo.classList.contains('held') === on) return;
  vivo.classList.toggle('held', on);
  // Se dice con palabras, no solo atenuando: que nadie gire la clavija creyendo
  // que la aguja va en directo (AR-15 #7).
  if (mic.mostrando) document.getElementById('mic-detail').textContent = on ? t('mic.held') + ' · ' + mic.detalle : mic.detalle;
}

function showMicIdle(){
  mic.lecturas = []; mic.candidatas = []; mic.siguiendo = false; mic.mostrando = false;
  setMicHeld(false);
  document.getElementById('mic-note').textContent = '—';
  document.getElementById('mic-detail').textContent = t('mic.play');
  setMicOrder('', null);
  setNeedle(0, false);
}

/** La orden: el símbolo va aparte y oculto al lector de pantalla, que leería
 *  «triángulo negro» (AT-07 #4). Solo se toca si cambia. */
function setMicOrder(orden, texto){
  if (mic.orden === orden) return;
  mic.orden = orden;
  const el = document.getElementById('mic-order');
  el.textContent = '';
  if (texto){
    const simbolo = document.createElement('span'), palabras = document.createElement('span');
    simbolo.setAttribute('aria-hidden', 'true');
    simbolo.textContent = texto[0];
    palabras.textContent = ' ' + texto[1];
    el.appendChild(simbolo); el.appendChild(palabras);
  }
  el.className = 'mic-order' + (orden ? (orden === 'afinada' ? ' ok' : ' ko') : '');
}

/** Aguja: −50 cents a la izquierda, +50 a la derecha; más allá se queda en el tope. */
function setNeedle(c, activa){
  const g = document.getElementById('mic-gauge');
  const angulo = Math.max(-50, Math.min(50, c)) / 50 * 80;
  const aguja = g.querySelector('.needle');
  if (aguja) aguja.style.transform = 'rotate(' + angulo.toFixed(1) + 'deg)';   // con transición suave (CSS)
  g.classList.toggle('idle', !activa);
}

/** Dibuja la esfera: arco de −50 a +50 con la franja verde de ±5 (A-03). */
function drawGauge(){
  const g = document.getElementById('mic-gauge');
  const NS = 'http://www.w3.org/2000/svg', R = 92, CX = 120, CY = 120;
  const punto = (c, r) => { const a = (c / 50 * 80 - 90) * Math.PI / 180; return [CX + r * Math.cos(a), CY + r * Math.sin(a)]; };
  const arco = (c1, c2, r) => { const [x1, y1] = punto(c1, r), [x2, y2] = punto(c2, r);
    return 'M' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' A' + r + ' ' + r + ' 0 0 1 ' + x2.toFixed(1) + ' ' + y2.toFixed(1); };
  const el = (tag, at, padre) => { const e = document.createElementNS(NS, tag);
    for (const k in at) k === 'class' ? e.classList.add(at[k]) : e.setAttribute(k, at[k]);
    (padre || g).appendChild(e); return e; };
  g.innerHTML = '';
  el('path', { d: arco(-50, 50, R), fill: 'none', stroke: 'var(--line2)', 'stroke-width': 12, 'stroke-linecap': 'round' });
  el('path', { d: arco(-5, 5, R), fill: 'none', stroke: 'var(--ok)', 'stroke-width': 12 });
  for (const c of [-50, -25, 0, 25, 50]){
    const [x, y] = punto(c, R + 16);
    const t = el('text', { x: x.toFixed(1), y: (y + 4).toFixed(1), 'text-anchor': 'middle', 'font-size': 11, fill: 'var(--muted)' });
    t.textContent = c > 0 ? '+' + c : String(c);
  }
  const aguja = el('g', { class: 'needle' });
  el('line', { x1: CX, y1: CY, x2: CX, y2: CY - R + 4, stroke: 'var(--ko)', 'stroke-width': 3, 'stroke-linecap': 'round' }, aguja);
  el('circle', { cx: CX, cy: CY, r: 6, fill: 'var(--ko)' });
  g.classList.add('idle');
}

/** Pide el micrófono y empieza a escuchar. Va dentro de un toque, como exige iOS. */
async function startMic(){
  if (mic.analyser || mic.arrancando) return;
  const motivo = micUnavailable();
  if (motivo){ showMicPanel(motivo); return; }
  mic.arrancando = true;
  document.getElementById('mic-start').disabled = true;
  // El clic del metrónomo entraría por el micrófono y confundiría al detector:
  // se para, y se dice por qué (MT-05).
  const aviso = document.getElementById('mic-metro');
  aviso.hidden = !stopMetro('mic');
  aviso.textContent = aviso.hidden ? '' : t('metro.stoppedMic');
  unlockAudio();
  wakeAudio();
  // En el iPhone, con la sesión de audio en «playback» no se puede grabar.
  if (navigator.audioSession){ try { navigator.audioSession.type = 'play-and-record'; } catch(e){} }
  try {
    // Sin cancelación de eco, reducción de ruido ni control de volumen: están
    // pensados para la voz y deforman el sonido de una cuerda.
    mic.stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
  } catch(err){
    mic.arrancando = false;
    restoreAudioSession();
    const negado = err && (err.name === 'NotAllowedError' || err.name === 'SecurityError');
    const sinMic = err && (err.name === 'NotFoundError' || err.name === 'OverconstrainedError');
    showMicPanel(negado
      ? t('mic.denied') : sinMic ? t('mic.nomic') : t('mic.error', { e: (err && err.name) || 'error' }));
    return;
  }
  mic.arrancando = false;
  if (screen !== 'tuner' || state.tunerMode !== 'mic' || document.hidden){ stopMic(); return; }   // te fuiste mientras pedía permiso
  wakeAudio();                              // iOS puede pausar el audio al cambiar la sesión
  // Si el sistema corta el micrófono (una llamada, otra app), se dice.
  // (la variable no se llama «t»: taparía la función de los textos; AT-08 #1)
  mic.stream.getTracks().forEach(pista => { pista.onended = () => { stopMic(); showMicPanel(t('mic.cut')); }; });
  try {
    mic.src = audioCtx.createMediaStreamSource(mic.stream);
    mic.analyser = audioCtx.createAnalyser();
    // El trozo abarca más de cuatro periodos del Do2 más grave: 4096 valores
    // (85 ms) a 44,1 o 48 kHz; el doble con tarjetas de 96 kHz (AT-07 #1). Con
    // el doble que antes, el detector promedia más sonido y el ruido le afecta
    // menos, que es lo que hace falta para seguir una nota que se apaga.
    let tam = 2048;
    while (tam < 4.4 * audioCtx.sampleRate / TONO.MIN_HZ && tam < 32768) tam *= 2;
    mic.analyser.fftSize = tam;
    // micrófono → filtros → analizador. Solo al analizador: no sale por el altavoz.
    // Dos pasos de agudos seguidos cortan más limpio que uno. Si el navegador
    // no tiene filtros, se analiza sin ellos (PL-04).
    let salida = mic.src;
    if (audioCtx.createBiquadFilter){
      for (const [tipo, hz, q] of [['highpass', MIC.GRAVES_HZ, 0.707], ['lowpass', MIC.AGUDOS_HZ, 0.54], ['lowpass', MIC.AGUDOS_HZ, 1.31]]){
        const f = audioCtx.createBiquadFilter();
        f.type = tipo; f.frequency.value = hz; f.Q.value = q;
        salida.connect(f); salida = f; mic.filtros.push(f);
      }
    }
    salida.connect(mic.analyser);
  } catch(e){ console.error(e); stopMic(); showMicPanel(t('mic.analyse')); return; }
  mic.det = crearDetector(onMicReading);
  mic.timer = setInterval(micTick, MIC.PERIODO_MS);
  mic.ultima = 0; mic.ruido = MIC.RUIDO_INICIAL; mic.nivel = 0;
  showMicIdle();
  pantallaDespierta('mic', true);           // que el móvil no se bloquee mientras afinas (G-13)
  const conFoco = document.activeElement && document.activeElement.id === 'mic-start';
  document.getElementById('mic-intro').hidden = true;
  document.getElementById('mic-live').hidden = false;
  if (conFoco) document.getElementById('mic-stop').focus();   // el foco no se pierde al ocultar el botón
}

function micTick(){
  if (!mic.analyser || !mic.det) return;
  const x = new Float32Array(mic.analyser.fftSize);
  mic.analyser.getFloatTimeDomainData(x);
  // El nivel del trozo, para medir el ruido de fondo (seguirNota). Se calcula
  // ANTES de dárselo al detector: al pasar al otro hilo, `x` se queda vacío.
  let suma = 0;
  for (let i = 0; i < x.length; i++) suma += x[i] * x[i];
  mic.nivel = Math.sqrt(suma / x.length);
  mic.det.analizar(x, audioCtx.sampleRate, mic.siguiendo ? MIC.SEGUIR : MIC.BUSCAR);
}

/** Apaga el micrófono del todo (el indicador del navegador desaparece). */
function stopMic(){
  const conFoco = document.activeElement && document.activeElement.id === 'mic-stop';
  clearInterval(mic.timer); mic.timer = null;
  if (mic.det){ mic.det.cerrar(); mic.det = null; }
  if (mic.src){ try { mic.src.disconnect(); } catch(e){} mic.src = null; }
  mic.filtros.forEach(f => { try { f.disconnect(); } catch(e){} }); mic.filtros = [];
  mic.analyser = null;
  pantallaDespierta('mic', false);
  if (mic.stream){ mic.stream.getTracks().forEach(pista => pista.stop()); mic.stream = null; restoreAudioSession(); }
  mic.lecturas = []; mic.candidatas = []; mic.siguiendo = false; mic.mostrando = false;
  showMicPanel('');
  if (conFoco) document.getElementById('mic-start').focus();
}

function restoreAudioSession(){
  if (navigator.audioSession){ try { navigator.audioSession.type = 'playback'; } catch(e){} }
}

/** Vuelve a la presentación (con un motivo si algo falló). */
function showMicPanel(motivo){
  const why = document.getElementById('mic-why');
  why.textContent = motivo || '';
  document.getElementById('mic-live').hidden = true;
  document.getElementById('mic-intro').hidden = false;
  const btn = document.getElementById('mic-start');
  btn.disabled = !!micUnavailable() || mic.arrancando;
}

/** Cambia entre De oído y Micrófono. El micrófono no se enciende solo: hay que
 *  pulsar «Activar el micrófono», así nunca escucha sin que lo pidas.
 *  `elegido`: lo has pulsado tú, y entonces se recuerda. Si nunca has elegido,
 *  el afinador abre en Micrófono donde se puede usar y en De oído donde no
 *  (el archivo con doble clic, una web sin https): F5.8 #2. */
function setTunerMode(modo, elegido){
  state.tunerMode = modo === 'mic' ? 'mic' : 'ear';
  if (elegido){ state.tunerPick = true; save(); }
  document.querySelectorAll('#tuner-mode button').forEach(b => {
    const on = b.dataset.v === state.tunerMode;
    b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
  });
  document.getElementById('tuner-ear').hidden = state.tunerMode !== 'ear';
  document.getElementById('tuner-mic').hidden = state.tunerMode !== 'mic';
  if (state.tunerMode !== 'mic') stopMic();
  else if (!mic.analyser) showMicPanel(micUnavailable());
}
/** El modo con el que abre el afinador: el que elegiste o, si nunca elegiste, el que se pueda usar. */
const tunerModeInicial = () => state.tunerPick ? state.tunerMode : (micUnavailable() ? 'ear' : 'mic');

function setMicString(v){
  mic.string = v;
  // La nota que suena es la misma; cambia con qué cuerda se compara. Se repinta
  // lo último medido con la cuerda nueva, sin soltar la nota (AT-14 #3).
  if (mic.mostrando && mic.ultimaHz){
    const sostenida = document.getElementById('mic-live').classList.contains('held');
    showMicReading(mic.ultimaHz);
    if (sostenida) setMicHeld(true);
  }
  document.querySelectorAll('#mic-string button').forEach(b => {
    const on = b.dataset.v === String(v);
    b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
  });
}

/** Nombres accesibles de los botones de cuerda («6ª cuerda», «6th string»). */
function labelMicStrings(){
  document.querySelectorAll('#mic-string button').forEach(b => {
    if (b.dataset.v !== 'auto') b.setAttribute('aria-label', t('mic.nth', { o: ord(+b.dataset.v) }));
  });
}

function bindMicTuner(){
  drawGauge();
  labelMicStrings();
  document.querySelectorAll('#tuner-mode button').forEach(b => b.addEventListener('click', () => setTunerMode(b.dataset.v, true)));
  document.querySelectorAll('#mic-string button').forEach(b => b.addEventListener('click', () => setMicString(b.dataset.v)));
  document.getElementById('mic-start').addEventListener('click', startMic);
  document.getElementById('mic-stop').addEventListener('click', stopMic);
  setMicString('auto');
  setTunerMode(tunerModeInicial());
  // Al bloquear el móvil o cambiar de app, el micrófono se apaga (privacidad, y iOS).
  // Se dice por qué: si no, al volver parece que el afinador se ha reiniciado solo (AR-15 #14).
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden || !mic.analyser) return;
    stopMic();
    if (state.tunerMode === 'mic') showMicPanel(t('mic.hidden'));
  });
}
