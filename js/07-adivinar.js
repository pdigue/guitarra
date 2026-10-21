"use strict";

// 07-adivinar.js · Adivinar: retos, aciertos, fallos, racha y récord.
// Se carga como <script> clásico, en el orden de index.html: lo declarado aquí
// (const, let, function) lo ven los archivos que vienen después.

/* ============================================================
   7. MODO ADIVINAR
   ============================================================ */

let screen = 'free';
let challenge = null;      // { midi }
let streak = 0;
let locked = false;
let nextTimer = null;
let playTimer = null;   // sonido del reto, 320 ms después de mostrarlo
let guessStarted = false; // en cada visita, el primer sonido espera a ▶ (Sesión 1, E06)

// Tiempos tras responder. La Sesión 1 (A09) pidió más margen entre la nota
// que pulsaste y la corrección para poder compararlas.
const REVEAL_DELAY = 1200;      // fallo → suena y se ilumina la nota buscada
const NEXT_AFTER_REVEAL = 3000; // corrección → reto nuevo
const NEXT_AFTER_HIT = 1500;    // acierto → reto nuevo

function updateScore(){
  document.getElementById('st-streak').textContent = t('streak', { n: streak });
  const r = document.getElementById('st-record');
  r.textContent = t('record', { n: currentRecord(), afin: tuningShort() });
  r.title = t('record.title', { afin: tuningShort() });
}

/** Todas las posiciones del mástil que producen exactamente esta nota. */
function positionsFor(midi){
  const out = [];
  displayStrings().forEach((s, rowIdx) => {
    const fret = midi - s.openMidi;
    if (fret >= 0 && fret <= NUM_FRETS) out.push({ rowIdx, fret, string: s });
  });
  return out;
}

function newChallenge(){
  // Cualquier temporizador pendiente pertenece al reto anterior. Sin esto, un
  // cambio de afinación durante la revelación de un fallo acababa iluminando
  // la respuesta del reto nuevo.
  clearTimeout(nextTimer);
  locked = false;
  clearMarks(['correct','wrong','equal','active','reveal']);

  // Elegimos una nota que exista al menos una vez en el mástil actual.
  // El rango se limita a los primeros trastes: con el mástil completo, un reto
  // en el traste 22 obliga a desplazarse por una zona que casi nadie practica.
  const top = Math.min(state.maxChallengeFret, NUM_FRETS);
  let midi, guard = 0;
  do {
    const strs = displayStrings();
    const s = strs[Math.floor(Math.random()*strs.length)];
    midi = s.openMidi + Math.floor(Math.random()*(top+1));
    guard++;
  } while (challenge && midi === challenge.midi && guard < 20);

  challenge = { midi };
  renderChallenge();
  clearTimeout(playTimer);
  if (guessStarted) playTimer = setTimeout(playChallenge, 320);
}

function playChallenge(){
  if (screen === 'guess' && challenge) playMidi(challenge.midi);
}

/** ▶: la primera vez empieza el juego; después repite el sonido. */
function onRepeat(){
  if (!guessStarted){ guessStarted = true; renderChallenge(); }
  clearTimeout(playTimer);
  playChallenge();
}

/** El récord de la afinación activa (J-11). */
function currentRecord(){ return state.records[state.tuningId] || 0; }
function tuningShort(){ const a = TUNINGS.find(a => a.id === state.tuningId); return a ? a.short : ''; }

/** Las pistas (comentario del 21/10): encendida, cada una enseña su respuesta
 *  dentro del propio botón, grande: «NOTA Sol#3», «CUERDAS 3ª 4ª». Se ven
 *  también antes de pulsar ▶ y tras un fallo. Apagadas, dicen «Nombre» y «Cuerda». */
function renderClues(){
  const chip = (id, on, etiqueta, valor, color) => {
    const b = document.getElementById(id);
    b.setAttribute('aria-pressed', String(!!on));
    b.textContent = '';
    if (!on || !challenge){ b.classList.remove('clue'); b.textContent = etiqueta[0]; return; }
    b.classList.add('clue');
    const k = document.createElement('span'), v = document.createElement('b');
    k.className = 'clue-k'; k.textContent = etiqueta[1];
    v.className = 'clue-v'; v.textContent = valor;
    if (color) v.style.color = color;
    b.appendChild(k); b.appendChild(v);
  };
  const midi = challenge ? challenge.midi : null;
  const i = challenge ? noteInfo(midi) : null;
  chip('qb-hint-note', state.hintNote && screen === 'guess', [t('hint.name'), t('hint.note')],
       challenge ? noteName(midi) + i.octave : '', i && i.color);
  const cuerdas = challenge ? positionsFor(midi).map(p => ord(p.string.number)) : [];
  chip('qb-hint-string', state.hintString && screen === 'guess', [t('hint.string'), t(cuerdas.length > 1 ? 'hint.strings' : 'hint.string')],
       cuerdas.join(' '));
  document.querySelector('.ch-hints').classList.toggle('has-clue',
    !!challenge && screen === 'guess' && (state.hintNote || state.hintString));
}

function renderChallenge(){
  const box = document.getElementById('challenge-text');
  const btn = document.getElementById('btn-repeat');
  btn.classList.toggle('ready', !guessStarted);
  btn.setAttribute('aria-label', guessStarted ? t('guess.repeat') : t('guess.startAria'));
  renderClues();
  if (!challenge){ box.textContent = ''; return; }

  if (!guessStarted){
    box.innerHTML = '<b>' + t('guess.press1') + ' <span class="sr-only">' + t('guess.pressSr') + '</span> ' + t('guess.press2') +
      '</b><br><span class="dim">' + t('guess.press3') + '</span>';
    return;
  }

  if (challenge.revealed){
    const i = noteInfo(challenge.midi);
    box.innerHTML = '<span class="dim">' + t('guess.was') + '</span> <b style="color:'+i.color+'">'
      + noteName(challenge.midi) + '</b> <span class="dim">' + t('guess.wasEnd', { n: i.octave }) + '</span>';
    return;
  }

  box.innerHTML = '<span class="dim">' + t('guess.listen') + '</span>';
}

function evaluate(cell, midi, rowIdx){
  if (locked || !challenge || !guessStarted) return;   // antes de ▶ se explora sin puntuar
  const hit = (midi === challenge.midi);
  const box = document.getElementById('challenge');
  box.classList.remove('flash-ok','flash-ko');
  void box.offsetWidth;                       // reinicia la animación

  if (hit){
    locked = true;
    streak++;
    if (streak > currentRecord()){ state.records[state.tuningId] = streak; save(); }
    cell.classList.add('correct');
    box.classList.add('flash-ok');
    buzz(18);
    // Al acertar, mostramos las demás posiciones de esa misma nota.
    positionsFor(challenge.midi).forEach(p => {
      const c = document.querySelector('.fret-cell[data-row="'+p.rowIdx+'"][data-fret="'+p.fret+'"]');
      if (c && c !== cell) c.classList.add('equal');
    });
    updateScore();
    clearTimeout(nextTimer);
    nextTimer = setTimeout(newChallenge, NEXT_AFTER_HIT);
  } else {
    // J-10: el fallo rompe la racha y enseña dónde estaba la nota.
    locked = true;
    streak = 0;
    cell.classList.add('wrong');
    box.classList.add('flash-ko');
    buzz([12,60,12]);
    updateScore();
    challenge.revealed = true;
    renderChallenge();
    // Primero suena la nota que pulsaste; un instante después, la que se
    // buscaba, mientras se iluminan sus posiciones. Oír las dos seguidas es lo
    // que educa el oído: la diferencia se aprende por contraste.
    const target = challenge;
    nextTimer = setTimeout(() => {
      if (screen !== 'guess' || challenge !== target) return;
      positionsFor(target.midi).forEach(p => {
        const c = document.querySelector('.fret-cell[data-row="'+p.rowIdx+'"][data-fret="'+p.fret+'"]');
        if (c) c.classList.add('reveal');
      });
      playMidi(target.midi);
      nextTimer = setTimeout(newChallenge, NEXT_AFTER_REVEAL);
    }, REVEAL_DELAY);
  }
}
