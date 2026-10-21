"use strict";

// 03-audio.js · Audio: el reproductor de grabaciones, la guitarra sintetizada de reserva y el ciclo de vida del sonido.
// Se carga como <script> clásico, en el orden de index.html: lo declarado aquí
// (const, let, function) lo ven los archivos que vienen después.

/* ============================================================
   3. AUDIO
   ============================================================ */

/* Reproductor de muestras propio (F2.2). Sustituye a la librería externa que
   se usaba hasta la 0.1.5: la app ya no descarga nada de otros servidores
   (S-07) y cada nota se programa en el instante de la pulsación.

   Qué grabación corresponde a cada nota, por timbre, y cuánto se desvía de su
   nota según la medición (cents; 100 cents = 1 semitono; S-08 y
   samples/afinacion.json). Entre dos grabaciones se transporta la más cercana.
   El D5 de nylon del repositorio de origen suena en Re#5: en nylon va el E5.
   El As5 de nylon (F2.4) acerca el registro agudo: en afinación estándar
   ninguna nota se transporta más de 6 semitonos. La acústica no tiene
   grabaciones por encima del D5. */
const SAMPLE_MAPS = {
  nylon:    { E2:['E2.mp3',-2.8], A2:['A2.mp3',0.8], D3:['D3.mp3',-2.4], G3:['G3.mp3',2.6],
              B3:['B3.mp3',-0.6], E4:['E4.mp3',-2.1], A4:['A4.mp3',-0.2], E5:['E5.mp3',-2.4],
              As5:['As5.mp3',-10.0] },
  acoustic: { E2:['E2.mp3',-1.9], A2:['A2.mp3',1.0], D3:['D3.mp3',-2.5], G3:['G3.mp3',-4.2],
              B3:['B3.mp3',-0.5], E4:['E4.mp3',4.5], A4:['A4.mp3',2.8], D5:['D5.mp3',1.9] }
};
const SAMPLE_BASE = 'samples/';      // dentro del propio proyecto
const MAX_VOICES = 8;                // notas sonando a la vez como máximo

let audioCtx = null, audioReady = false, audioOut = null;
let samples = [], samplerReady = false, samplerTimbre = null;
const voices = [];

/**
 * Un único AudioContext para toda la app, creado dentro del toque en
 * «Empezar»: los navegadores solo dejan sonar tras un gesto del usuario.
 * Todo sale por audioOut, un control de volumen común.
 */
function unlockAudio(){
  try {
    if (!audioCtx){
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioOut = audioCtx.createGain();
      audioOut.gain.value = 0.7;
      audioOut.connect(audioCtx.destination);
      audioCtx.onstatechange = updateAudioStatus;   // «Estado del sonido» al día (AT-06 #1)
    }
    // Safari 16.4+: con 'playback' suena aunque el interruptor de silencio del
    // iPhone esté puesto, como un reproductor de música. Donde no existe, se
    // omite (PL-04, docs/compatibilidad.md).
    if (navigator.audioSession){ try { navigator.audioSession.type = 'playback'; } catch(e){} }
    const b = audioCtx.createBuffer(1,1,22050);
    const s = audioCtx.createBufferSource();
    s.buffer = b; s.connect(audioCtx.destination); s.start(0);
    if (audioCtx.state === 'suspended') audioCtx.resume();
    audioReady = true;
  } catch(e){ console.error(e); }
}

/** 'Fs3' → 66. La octava 4 empieza en el Do central (MIDI 60). */
function midiOfName(n){
  return 12 * (+n.slice(-1) + 1) + ['C','Cs','D','Ds','E','F','Fs','G','Gs','A','As','B'].indexOf(n.slice(0, -1));
}

/** Convierte los bytes de un mp3 en sonido. Forma con funciones de respuesta: la única que entienden los Safari antiguos. */
function decodeData(data){
  return new Promise((ok, ko) => audioCtx.decodeAudioData(data, ok, ko));
}

/** Descarga y decodifica una grabación. Va aparte para poder simularla en las pruebas. */
async function fetchAndDecode(url){
  const res = await fetch(url);
  if (!res.ok) throw new Error(url + ': ' + res.status);
  return decodeData(await res.arrayBuffer());
}

/**
 * En el archivo autónomo (dist/trasteando.html, F2.3) cada grabación viaja
 * dentro de la propia página, en base64: texto que representa bytes. Así
 * suena con doble clic y sin conexión, donde un archivo local no puede leer
 * otros. Si la grabación no está dentro, devuelve null y se descarga.
 */
function embeddedAudio(kind, name){
  const el = document.getElementById('audio-' + kind + '-' + name);
  if (!el) return null;
  const bin = atob(el.textContent.trim());
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

/**
 * Dónde empieza a sonar la grabación: el primer punto que llega al 5 % del
 * pico, menos 2 ms. Algunas traen hasta 52 ms de silencio al principio, que se
 * notaba como retardo en cada toque (AT-02 #4).
 */
function soundStart(buffer){
  const d = buffer.getChannelData(0);
  let peak = 0;
  for (let i = 0; i < d.length; i++){ const v = Math.abs(d[i]); if (v > peak) peak = v; }
  const threshold = peak * 0.05;
  for (let i = 0; i < d.length; i++){
    if (Math.abs(d[i]) >= threshold) return Math.max(0, i / buffer.sampleRate - 0.002);
  }
  return 0;
}

/**
 * Carga las grabaciones del timbre pedido. El contador de peticiones evita
 * que una carga lenta se instale después de una elección más reciente, también
 * cuando se vuelve al timbre ya instalado (AT-02 #1).
 */
let samplerRequest = 0;
async function loadSamples(timbre){
  const req = ++samplerRequest;
  if (samplerReady && samplerTimbre === timbre) return true;
  const kind = timbre === 'acoustic' ? 'acoustic' : 'nylon';
  try {
    const loaded = await Promise.all(Object.entries(SAMPLE_MAPS[kind]).map(async ([name, [file, cents]]) => {
      const inside = embeddedAudio(kind, name);
      const buffer = inside ? await decodeData(inside) : await fetchAndDecode(SAMPLE_BASE + kind + '/' + file);
      return { midi: midiOfName(name), buffer, cents, offset: soundStart(buffer) };
    }));
    if (req !== samplerRequest) return 'stale';
    // Solo se guarda el timbre activo: decodificada, la acústica ocupa unos
    // 11 MB, y en un móvil la memoria cuenta.
    samples = loaded;
    samplerReady = true;
    samplerTimbre = timbre;
    return true;
  } catch(e){
    if (req !== samplerRequest) return 'stale';
    console.error('No se pudieron cargar las muestras de', timbre, e);
    return false;
  }
}

/** La grabación más cercana a la nota; a igual distancia, la de arriba. */
function pickSample(midi){
  let best = null;
  for (const s of samples){
    const d = Math.abs(midi - s.midi), db = best ? Math.abs(midi - best.midi) : Infinity;
    if (d < db || (d === db && s.midi > best.midi)) best = s;
  }
  return best;
}

/**
 * Cuánto acelerar la grabación para que suene la nota pedida. Cada semitono
 * multiplica la frecuencia por 2^(1/12); de paso se descuenta lo que la
 * grabación ya se desvía según su medición.
 */
function playbackRateFor(midi, s){
  return Math.pow(2, (midi - s.midi) / 12 - s.cents / 1200);
}

/** Hace sonar una nota con las grabaciones. Devuelve false si no están cargadas. */
function playSample(midi, duration){
  if (!audioCtx || !samplerReady || !samples.length) return false;
  const s = pickSample(midi), t = audioCtx.currentTime;
  const dur = duration || 1.8, release = 1.2;
  const src = audioCtx.createBufferSource(), g = audioCtx.createGain();
  src.buffer = s.buffer;
  src.playbackRate.value = playbackRateFor(midi, s);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(1, t + 0.003);      // 3 ms de entrada: sin chasquido
  g.gain.setTargetAtTime(0, t + dur, release / 4);   // y se apaga poco a poco
  src.connect(g); g.connect(audioOut);
  src.start(t, s.offset);
  src.stop(t + dur + release);
  const voice = { src, g };
  voices.push(voice);
  src.onended = () => { const i = voices.indexOf(voice); if (i >= 0) voices.splice(i, 1); };
  if (voices.length > MAX_VOICES){                   // la más antigua se apaga en 30 ms
    const old = voices.shift();
    try {
      old.g.gain.cancelScheduledValues(t);
      old.g.gain.setValueAtTime(old.g.gain.value, t);
      old.g.gain.setTargetAtTime(0, t, 0.01);
      old.src.stop(t + 0.05);
    } catch(e){}
  }
  return true;
}

/* --- El sonido y el segundo plano (Sesión 1: C07, C08 y D03) ---
   Con el iPhone bloqueado seguía sonando lo que estaba programado (la nota de
   la corrección), y a veces, al volver, el sonido se quedaba mudo hasta cerrar
   la app. Ahora: al ocultarse la página se cortan las notas, se cancelan las
   que iban a sonar y se pausa el audio; al volver se reanuda, y si iOS no lo
   deja reanudar, el siguiente toque crea un contexto de audio nuevo. Además,
   Ajustes enseña el estado del sonido y tiene un botón para reactivarlo.
   Es un fallo conocido de Safari en las apps de pantalla de inicio (WebKit
   291892): a veces el audio dice «activo» y no suena. Por eso el botón crea
   un contexto nuevo sin preguntar; si ni así suena, cerrar la app lo arregla. */
let needsRebuild = false;

let rebuildOnNextGesture = false;
let audioFallback = false;      // las grabaciones no recargaron: suena la sintetizada
let lastRebuild = 0;

/** Primero se intenta reanudar; si en 300 ms no lo consigue, el audio se rehace
 *  en el siguiente toque. Un temporizador no es un gesto del usuario, e iOS
 *  solo deja arrancar el sonido dentro de uno (AT-06 #2). */
function recoverAudio(){
  wakeAudio();
  setTimeout(() => {
    if (document.hidden || !audioCtx || audioCtx.state === 'running') return;
    rebuildOnNextGesture = true;
    updateAudioStatus();
  }, 300);
}

/** Cada toque (al levantar el dedo, que es cuando iOS lo cuenta como gesto)
 *  reanuda el audio y, si hace falta, lo rehace. */
function onGesture(){
  if (rebuildOnNextGesture){ rebuildOnNextGesture = false; rebuildAudio(); return; }
  if (needsRebuild){ needsRebuild = false; recoverAudio(); return; }
  wakeAudio();
}

/** Corta ya todas las notas que suenan. */
function silenceAll(){
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  voices.splice(0).forEach(v => {
    try { v.g.gain.cancelScheduledValues(t); v.g.gain.setValueAtTime(0, t); v.src.stop(t + 0.02); } catch(e){}
  });
}

/** Contexto de audio nuevo, con las grabaciones decodificadas otra vez para él.
 *  Mientras cargan, suena la guitarra sintetizada. */
function rebuildAudio(){
  const now = Date.now();
  if (now - lastRebuild < 1000) return;       // pulsaciones repetidas: una basta (AT-06 #6)
  lastRebuild = now;
  if (typeof stopMic === 'function') stopMic();   // el micrófono va atado al audio viejo (AT-07 #6)
  needsRebuild = false; rebuildOnNextGesture = false;
  const old = audioCtx;
  silenceAll();
  audioCtx = null; audioOut = null;
  try { if (old && old.state !== 'closed') old.close().catch(() => {}); } catch(e){}
  unlockAudio();
  samplerReady = false; samplerTimbre = null; samples = [];   // libera las grabaciones viejas
  loadSamples(state.timbre).then(r => {
    if (r === 'stale') return;
    audioFallback = (r === false);
    const note = document.getElementById('timbre-note');
    if (note) note.textContent = r ? timbreText(state.timbre)
      : t('timbre.synth');
    updateAudioStatus();
  });
  updateAudioStatus();
}

function timbreText(t){
  return t === 'nylon' ? window.t('timbre.nylon') : window.t('timbre.acoustic');
}

function updateAudioStatus(){
  const el = document.getElementById('audio-state');
  if (!el) return;
  el.textContent = !audioCtx ? t('audio.none') :
    (['running','suspended','interrupted','closed'].includes(audioCtx.state) ? t('audio.' + audioCtx.state) : audioCtx.state) +
    (samplerReady ? '' : audioFallback ? t('audio.synth') : t('audio.loading')) +
    (rebuildOnNextGesture ? t('audio.rebuild') : '');
}

function onVisibility(){
  if (document.hidden){
    clearTimeout(playTimer);
    if (screen === 'guess' && locked) clearTimeout(nextTimer);   // ni corrección ni reto con la pantalla apagada
    silenceAll();
    try { if (audioCtx && audioCtx.state === 'running') audioCtx.suspend().catch(() => {}); } catch(e){}
  } else {
    // resume() siempre, no wakeAudio(): si el suspend() de hace un instante aún
    // no ha terminado, el estado dice 'running' y wakeAudio no haría nada (AT-06 #4).
    try { if (audioCtx && audioCtx.state !== 'closed') audioCtx.resume().catch(() => {}); } catch(e){}
    if (screen === 'guess'){
      // Se retoma esperando a ▶: ese toque es el que iOS exige para
      // reactivar el sonido, y no suena nada sin que lo pidas.
      guessStarted = false;
      if (locked) newChallenge(); else renderChallenge();
    }
    // Si iOS no deja reanudar, el próximo toque crea un contexto nuevo.
    setTimeout(() => { if (audioCtx && audioCtx.state !== 'running') needsRebuild = true; updateAudioStatus(); }, 400);
  }
  updateAudioStatus();
}

/**
 * iOS deja el contexto de audio en 'interrupted' tras una llamada, al bloquear
 * la pantalla o al cambiar de app, y no lo reanuda solo (AT-02 #3).
 */
function wakeAudio(){
  if (audioCtx && audioCtx.state !== 'running' && audioCtx.state !== 'closed'){
    try { audioCtx.resume().catch(() => {}); } catch(e){}
  }
}

function playMidi(midi, duration){
  if (needsRebuild){ needsRebuild = false; recoverAudio(); }   // dentro del toque que lo pide
  wakeAudio();
  try { if (playSample(midi, duration)) return; } catch(e){ console.error(e); }
  playSynth(midi);
}

/**
 * Plan B si las muestras no cargan: cuerda pulsada por Karplus-Strong,
 * pasada por filtros que imitan la caja de resonancia.
 */
const synthCache = new Map();

function playSynth(midi){
  if (!audioCtx || !audioReady) return;
  wakeAudio();
  const now = audioCtx.currentTime, dur = 2.6;
  // Generar la cuerda cuesta ~125.000 muestras en el hilo principal.
  // Cada nota se calcula una sola vez y se reutiliza.
  let buffer = synthCache.get(midi);
  if (!buffer){
    buffer = renderString(noteInfo(midi).freq, dur);
    synthCache.set(midi, buffer);
  }
  const src = audioCtx.createBufferSource(); src.buffer = buffer;
  const body1 = audioCtx.createBiquadFilter();
  body1.type='peaking'; body1.frequency.value=100; body1.Q.value=6; body1.gain.value=7;
  const body2 = audioCtx.createBiquadFilter();
  body2.type='peaking'; body2.frequency.value=200; body2.Q.value=4; body2.gain.value=4;
  const tone = audioCtx.createBiquadFilter();
  tone.type='lowpass'; tone.Q.value=0.7;
  tone.frequency.setValueAtTime(4500,now);
  tone.frequency.exponentialRampToValueAtTime(600,now+dur);
  const warm = audioCtx.createBiquadFilter();
  warm.type='highshelf'; warm.frequency.value=5000; warm.gain.value=-8;
  const out = audioCtx.createGain(); out.gain.value=0.55;
  src.connect(tone); tone.connect(body1); body1.connect(body2);
  body2.connect(warm); warm.connect(out); out.connect(audioOut || audioCtx.destination);
  src.start(now); src.stop(now+dur);
}

/** Cuerda pulsada por Karplus-Strong. Devuelve el buffer crudo. */
function renderString(frequency, dur){
  const sr = audioCtx.sampleRate;
  const n = Math.floor(sr*dur);
  const buffer = audioCtx.createBuffer(1,n,sr);
  const data = buffer.getChannelData(0);
  const len = Math.max(2, Math.floor(sr/frequency));
  const line = new Float32Array(len);
  for (let i=0;i<len;i++) line[i] = Math.random()*2-1;
  for (let p=0;p<3;p++){                     // suavizar el ataque
    let prev = line[len-1];
    for (let i=0;i<len;i++){ const v=(line[i]+prev)*0.5; prev=line[i]; line[i]=v; }
  }
  let mx=0; for (let i=0;i<len;i++) mx=Math.max(mx,Math.abs(line[i]));
  if (mx>0) for (let i=0;i<len;i++) line[i]/=mx;
  let idx=0;
  const damp = 0.998 - Math.min(0.005, frequency/100000);
  for (let i=0;i<n;i++){
    const cur=line[idx], nxt=line[(idx+1)%len];
    data[i]=cur; line[idx]=(cur+nxt)*0.5*damp; idx=(idx+1)%len;
  }
  for (let i=0;i<n;i++){
    const t=i/sr; let env=1;
    if (t<0.002) env=t/0.002; else if (t>dur-0.6) env=Math.max(0,(dur-t)/0.6);
    data[i]*=env;
  }
  return buffer;
}

function buzz(pattern){
  if (navigator.vibrate){ try { navigator.vibrate(pattern); } catch(e){} }
}
