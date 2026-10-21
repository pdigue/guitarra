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
  document.getElementById('st-streak').textContent = 'Racha ' + streak;
  document.getElementById('st-record').textContent = 'Récord ' + state.record;
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

/** En Adivinar, la lectura grande y el pentagrama muestran la nota BUSCADA:
 *  «?» mientras no se sabe y la nota cuando se acierta, se revela o la pista
 *  de nota está activa. La nota pulsada ya se ve en su punto del mástil.
 *  Antes mostraban la última nota pulsada y confundían (Sesión 1, E06). */
function showGuessReader(){
  const nameEl = document.getElementById('note-name');
  const octEl = document.getElementById('note-oct');
  const known = challenge && (challenge.revealed || challenge.solved || state.hintNote);
  if (!known){
    nameEl.innerHTML = '<span class="note-placeholder">?</span>';
    octEl.textContent = 'nota buscada';
    clearStaff();
    return;
  }
  const i = noteInfo(challenge.midi);
  nameEl.textContent = noteName(challenge.midi);
  nameEl.style.setProperty('--note-color', i.color);
  nameEl.style.setProperty('--note-glow', i.color);
  octEl.textContent = 'buscada · octava ' + i.octave;
  showOnStaff(challenge.midi, i.color);
}

function renderChallenge(){
  const box = document.getElementById('challenge-text');
  const btn = document.getElementById('btn-repeat');
  btn.classList.toggle('ready', !guessStarted);
  btn.setAttribute('aria-label', guessStarted ? 'Repetir sonido' : 'Empezar: oír la nota');
  if (!challenge){ box.textContent = ''; return; }
  showGuessReader();

  if (!guessStarted){
    box.innerHTML = '<b>Pulsa ▶ <span class="sr-only">(Empezar)</span> para oír la nota</b><br><span class="dim">y búscala en el mástil</span>';
    return;
  }

  if (challenge.revealed){
    const i = noteInfo(challenge.midi);
    box.innerHTML = '<span class="dim">Era</span> <b style="color:'+i.color+'">'
      + noteName(challenge.midi) + '</b> <span class="dim">(octava ' + i.octave
      + '). Mira dónde estaba.</span>';
    return;
  }

  const parts = ['<span class="dim">Escucha y busca la nota</span>'];

  if (state.hintNote){
    const i = noteInfo(challenge.midi);
    parts.push('Es <b style="color:'+i.color+'">' + noteName(challenge.midi) +
               '</b> <span class="dim">(octava ' + i.octave + ')</span>');
  }
  if (state.hintString){
    const pos = positionsFor(challenge.midi);
    const names = pos.map(p => p.string.number + 'ª');
    parts.push('<span class="dim">Cuerda' + (names.length>1?'s':'') + ': </span>' + names.join(', '));
  }
  box.innerHTML = parts.join('<br>');
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
    if (streak > state.record){ state.record = streak; save(); }
    cell.classList.add('correct');
    box.classList.add('flash-ok');
    buzz(18);
    // Al acertar, mostramos las demás posiciones de esa misma nota.
    positionsFor(challenge.midi).forEach(p => {
      const c = document.querySelector('.fret-cell[data-row="'+p.rowIdx+'"][data-fret="'+p.fret+'"]');
      if (c && c !== cell) c.classList.add('equal');
    });
    challenge.solved = true;
    showGuessReader();
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
