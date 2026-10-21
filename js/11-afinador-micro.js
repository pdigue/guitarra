"use strict";

// 11-afinador-micro.js · Afinador por micrófono (F4.3, A-02 a A-05): escucha la
// cuerda, la compara con la afinación activa y dice cuánto subir o bajar.
// Se carga como <script> clásico, en el orden de index.html: lo declarado aquí
// (const, let, function) lo ven los archivos que vienen después.

/* ============================================================
   11. AFINADOR POR MICRÓFONO
   ============================================================ */

/* Recorrido del sonido: micrófono → AnalyserNode (guarda los últimos 2048
   valores) → cada 50 ms copiamos esos valores y se los damos al detector
   (10-tono.js), que trabaja en un hilo aparte → con cada frecuencia
   calculamos los cents respecto a la cuerda y movemos la aguja.
   Un cent es la centésima parte de un semitono: cents = 1200 · log2(f / fRef). */

const MIC = {
  PERIODO_MS: 50,     // un trozo cada 50 ms: 20 lecturas por segundo
  AFINADA: 5,         // ±5 cents es «afinada» (A-03)
  SILENCIO_MS: 1500,  // sin lecturas durante este tiempo, la aguja vuelve a reposo
  CLARIDAD: 0.8       // lecturas menos claras que esto (ruido, golpes) se ignoran
};

const mic = {
  stream: null, src: null, analyser: null, det: null, timer: null,
  string: 'auto',          // 'auto' o el número de cuerda elegido a mano (A-05)
  lecturas: [],            // últimas frecuencias coherentes entre sí
  ultima: 0,               // momento de la última lectura válida
  orden: '',               // para no repetir el aviso al lector de pantalla
  arrancando: false
};

const hzDeMidi = m => 440 * Math.pow(2, (m - 69) / 12);
const centsEntre = (hz, ref) => 1200 * Math.log2(hz / ref);

/** Por qué no se puede usar el micrófono aquí, o '' si se puede (PL-04). */
function micUnavailable(){
  if (typeof location !== 'undefined' && location.protocol === 'file:')
    return 'Abierta como archivo, el navegador no deja usar el micrófono. Usa la web de la app, o afina De oído.';
  if (window.isSecureContext === false)
    return 'El micrófono solo funciona en una dirección segura (https). Usa la web de la app, o afina De oído.';
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)
    return 'Este navegador no deja usar el micrófono. Puedes afinar De oído.';
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

/** Cada lectura del detector. Se ignoran las sueltas (un golpe, un salto de
 *  octava): solo cuentan cuando dos seguidas coinciden. La aguja muestra la
 *  mediana de las últimas, para que no tiemble. */
function onMicReading(r){
  if (!mic.analyser) return;
  const ahora = Date.now();
  if (!r || r.claridad < MIC.CLARIDAD){
    if (ahora - mic.ultima > MIC.SILENCIO_MS) showMicIdle();
    return;
  }
  const previa = mic.lecturas[mic.lecturas.length - 1];
  if (previa && Math.abs(centsEntre(r.hz, previa)) > 40) mic.lecturas = [];   // otra nota: se empieza de nuevo
  mic.lecturas.push(r.hz);
  if (mic.lecturas.length > 5) mic.lecturas.shift();
  if (mic.lecturas.length < 2) return;
  mic.ultima = ahora;
  const ordenadas = [...mic.lecturas].sort((a, b) => a - b);
  showMicReading(ordenadas[ordenadas.length >> 1]);
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
  document.getElementById('mic-detail').textContent =
    (redondo > 0 ? '+' : redondo < 0 ? '−' : '') + Math.abs(redondo) + ' cents · ' + s.number + 'ª cuerda';
  // Se decide con el número que se ve (AT-07 #5). Ya afinada, hace falta
  // pasar de ±7 para dejar de estarlo: así el aviso no parpadea en el borde
  // y el lector de pantalla no lo repite sin parar (AT-07 #4).
  const limite = mic.orden === 'afinada' ? MIC.AFINADA + 2 : MIC.AFINADA;
  let orden, texto;
  if (Math.abs(redondo) <= limite){ orden = 'afinada'; texto = ['✓', 'Afinada']; }
  else if (redondo < 0){ orden = redondo < -50 ? 'sube' : 'sube-poco'; texto = ['▲', redondo < -50 ? 'Sube' : 'Sube un poco']; }
  else { orden = redondo > 50 ? 'baja' : 'baja-poco'; texto = ['▼', redondo > 50 ? 'Baja' : 'Baja un poco']; }
  setMicOrder(orden, texto);
  setNeedle(c, true);
}

function showMicIdle(){
  mic.lecturas = [];
  document.getElementById('mic-note').textContent = '—';
  document.getElementById('mic-detail').textContent = 'Toca una cuerda';
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
      ? 'No hay permiso para el micrófono. En el iPhone: Ajustes › Safari › Micrófono › Permitir, o «aA» en la barra de direcciones › Ajustes del sitio web. En Chrome o Edge: el icono junto a la dirección › Micrófono › Permitir. Luego vuelve a pulsar el botón.'
      : sinMic ? 'No se encuentra ningún micrófono en este dispositivo.'
      : 'No se ha podido abrir el micrófono (' + ((err && err.name) || 'error') + ').');
    return;
  }
  mic.arrancando = false;
  if (screen !== 'tuner' || state.tunerMode !== 'mic' || document.hidden){ stopMic(); return; }   // te fuiste mientras pedía permiso
  wakeAudio();                              // iOS puede pausar el audio al cambiar la sesión
  // Si el sistema corta el micrófono (una llamada, otra app), se dice.
  mic.stream.getTracks().forEach(t => { t.onended = () => { stopMic(); showMicPanel('El sistema ha cortado el micrófono. Vuelve a activarlo.'); }; });
  try {
    mic.src = audioCtx.createMediaStreamSource(mic.stream);
    mic.analyser = audioCtx.createAnalyser();
    // El trozo debe abarcar dos periodos del Do2 más grave: 2048 valores a 44,1
    // o 48 kHz; el doble con tarjetas de 96 kHz (AT-07 #1).
    let tam = 2048;
    while (tam < 2.2 * audioCtx.sampleRate / TONO.MIN_HZ && tam < 32768) tam *= 2;
    mic.analyser.fftSize = tam;
    mic.src.connect(mic.analyser);          // solo al analizador: no sale por el altavoz
  } catch(e){ console.error(e); stopMic(); showMicPanel('No se ha podido analizar el sonido del micrófono.'); return; }
  mic.det = crearDetector(onMicReading);
  mic.timer = setInterval(micTick, MIC.PERIODO_MS);
  mic.ultima = 0;
  showMicIdle();
  const conFoco = document.activeElement && document.activeElement.id === 'mic-start';
  document.getElementById('mic-intro').hidden = true;
  document.getElementById('mic-live').hidden = false;
  if (conFoco) document.getElementById('mic-stop').focus();   // el foco no se pierde al ocultar el botón
}

function micTick(){
  if (!mic.analyser || !mic.det) return;
  const x = new Float32Array(mic.analyser.fftSize);
  mic.analyser.getFloatTimeDomainData(x);
  mic.det.analizar(x, audioCtx.sampleRate);
}

/** Apaga el micrófono del todo (el indicador del navegador desaparece). */
function stopMic(){
  const conFoco = document.activeElement && document.activeElement.id === 'mic-stop';
  clearInterval(mic.timer); mic.timer = null;
  if (mic.det){ mic.det.cerrar(); mic.det = null; }
  if (mic.src){ try { mic.src.disconnect(); } catch(e){} mic.src = null; }
  mic.analyser = null;
  if (mic.stream){ mic.stream.getTracks().forEach(t => t.stop()); mic.stream = null; restoreAudioSession(); }
  mic.lecturas = [];
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
 *  pulsar «Activar el micrófono», así nunca escucha sin que lo pidas. */
function setTunerMode(modo){
  state.tunerMode = modo === 'mic' ? 'mic' : 'ear';
  save();
  document.querySelectorAll('#tuner-mode button').forEach(b => {
    const on = b.dataset.v === state.tunerMode;
    b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
  });
  document.getElementById('tuner-ear').hidden = state.tunerMode !== 'ear';
  document.getElementById('tuner-mic').hidden = state.tunerMode !== 'mic';
  if (state.tunerMode !== 'mic') stopMic();
  else if (!mic.analyser) showMicPanel(micUnavailable());
}

function setMicString(v){
  mic.string = v;
  mic.lecturas = [];
  document.querySelectorAll('#mic-string button').forEach(b => {
    const on = b.dataset.v === String(v);
    b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
  });
}

function bindMicTuner(){
  drawGauge();
  document.querySelectorAll('#tuner-mode button').forEach(b => b.addEventListener('click', () => setTunerMode(b.dataset.v)));
  document.querySelectorAll('#mic-string button').forEach(b => b.addEventListener('click', () => setMicString(b.dataset.v)));
  document.getElementById('mic-start').addEventListener('click', startMic);
  document.getElementById('mic-stop').addEventListener('click', stopMic);
  setMicString('auto');
  setTunerMode(state.tunerMode);
  // Al bloquear el móvil o cambiar de app, el micrófono se apaga (privacidad, y iOS).
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopMic(); });
}
