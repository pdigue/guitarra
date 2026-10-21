"use strict";

// 02-estado.js · Estado: los ajustes y el récord, en un solo objeto que se guarda en el navegador.
// Se carga como <script> clásico, en el orden de index.html: lo declarado aquí
// (const, let, function) lo ven los archivos que vienen después.

/* ============================================================
   2. ESTADO — una sola fuente de verdad, persistida
   ============================================================ */

const MIN_TUNING_MIDI = 33, MAX_TUNING_MIDI = 69;

const DEFAULTS = {
  notation:'latin',
  showStaff:true,
  fretNums:'all',         // 'all' todos · 'guide' solo trastes con marca · 'none' ninguno
  showAllNotes:false,
  showEquals:true,
  hintNote:false,
  hintString:false,
  timbre:'nylon',
  tuningId:'standard',
  customTuning:[40,45,50,55,59,64],
  visibleFrets:null,      // se calcula en el primer arranque según la pantalla
  maxChallengeFret:12,    // hasta dónde llegan los retos del modo Adivinar
  record:0,
  rotateHintClosed:false  // el aviso para girar, una vez cerrado, no vuelve (V-01)
};

const storage = {
  read(){
    try {
      const raw = localStorage.getItem('trasteando.v1');
      return raw ? JSON.parse(raw) : {};
    } catch(e){ return {}; }
  },
  write(obj){
    try { localStorage.setItem('trasteando.v1', JSON.stringify(obj)); } catch(e){}
  }
};

/**
 * Lo que sale de localStorage es texto que pudo escribir una versión anterior
 * de la app, o quedar corrupto. Se valida campo a campo antes de confiar en él:
 * un tuningId que ya no existe o una afinación mal formada dejarían la app
 * en un estado imposible.
 */
function sanitize(raw){
  const s = Object.assign({}, DEFAULTS, raw || {});
  if (!TUNINGS.some(t => t.id === s.tuningId)) s.tuningId = DEFAULTS.tuningId;
  if (!Array.isArray(s.customTuning) || s.customTuning.length !== 6 ||
      !s.customTuning.every(n => Number.isInteger(n) &&
        n >= MIN_TUNING_MIDI && n <= MAX_TUNING_MIDI)) {
    s.customTuning = DEFAULTS.customTuning.slice();
  }
  if (!['latin','anglo'].includes(s.notation)) s.notation = DEFAULTS.notation;
  if (!['nylon','acoustic'].includes(s.timbre)) s.timbre = DEFAULTS.timbre;
  ['showStaff','showAllNotes','showEquals','hintNote','hintString','rotateHintClosed']
    .forEach(k => { s[k] = !!s[k]; });
  // fretNums sustituye al interruptor showFretNums de la 0.1.1. Quien lo tuviera
  // apagado conserva su elección al actualizar. Se mira el valor guardado (raw),
  // no el ya mezclado con DEFAULTS: ese siempre trae 'all' y la migración no
  // llegaría a ocurrir nunca.
  if (!['all','guide','none'].includes(raw && raw.fretNums))
    s.fretNums = (raw && raw.showFretNums === false) ? 'none' : 'all';
  delete s.showFretNums;
  if (!Number.isInteger(s.visibleFrets) || s.visibleFrets < 3 || s.visibleFrets > NUM_FRETS)
    s.visibleFrets = null;
  if (!Number.isInteger(s.maxChallengeFret) || s.maxChallengeFret < 3 || s.maxChallengeFret > NUM_FRETS)
    s.maxChallengeFret = DEFAULTS.maxChallengeFret;
  if (!Number.isInteger(s.record) || s.record < 0) s.record = 0;
  return s;
}

let state = sanitize(storage.read());
function save(){ storage.write(state); }

/** Afinación activa, de grave a aguda. */
function activeTuning(){
  if (state.tuningId === 'custom') return state.customTuning.slice();
  const t = TUNINGS.find(t => t.id === state.tuningId);
  return t ? t.midi.slice() : TUNINGS[0].midi.slice();
}

/**
 * Cuerdas en orden de pantalla: la primera del array es la de arriba
 * del diagrama, que es la más aguda. Es como se dibuja una tablatura.
 */
function displayStrings(){
  const tuning = activeTuning();
  return tuning.map((openMidi, i) => ({
    openMidi,
    thickness: THICKNESS[i],
    lowIndex: i,                    // 0 = más grave
    number: 6 - i                   // numeración de guitarrista: 1ª = más aguda
  })).reverse();
}
