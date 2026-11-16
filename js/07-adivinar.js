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
    k.className = 'clue-k'; k.textContent = etiqueta[1] + ' ';   // el lector lee «Nota Sol#3», no «NotaSol#3»
    v.className = 'clue-v';
    // El valor es un texto («Fa#4») o una lista de cuerdas: cada una, su número
    // grande y su «ª» (o «st», «nd»…) pequeña, que es lo que menos informa (F5.8, 16/11).
    if (typeof valor === 'string') v.textContent = valor;
    else valor.forEach(([num, fin], j) => {
      const c = document.createElement('span'), s = document.createElement('small');
      // El espacio va delante del número: el texto sigue siendo «4ª 5ª» para el lector.
      c.className = 'ord'; c.textContent = (j ? ' ' : '') + num; s.textContent = fin;
      c.appendChild(s); v.appendChild(c);
    });
    if (color) v.style.color = color;
    b.appendChild(k); b.appendChild(v);
    encajar(v);
  };
  const midi = challenge ? challenge.midi : null;
  const i = challenge ? noteInfo(midi) : null;
  chip('qb-hint-note', state.hintNote && screen === 'guess', [t('hint.name'), t('hint.note')],
       challenge ? noteName(midi) + i.octave : '', i && i.color);
  // ord(3) = «3ª» o «3rd»: el número, por un lado, y lo demás, por otro.
  const cuerdas = challenge ? positionsFor(midi).map(p => { const n = String(p.string.number); return [n, ord(p.string.number).slice(n.length)]; }) : [];
  chip('qb-hint-string', state.hintString && screen === 'guess', [t('hint.string'), t(cuerdas.length > 1 ? 'hint.strings' : 'hint.string')],
       cuerdas);
  const pistas = document.querySelector('.ch-hints');
  pistas.classList.toggle('has-clue', !!challenge && screen === 'guess' && (state.hintNote || state.hintString));
  // Al encender la franja cambia el ancho de cada recuadro: se vuelve a encajar.
  pistas.querySelectorAll('.clue-v').forEach(encajar);
}

/** Que la respuesta de una pista quepa entera en su recuadro (F5.8, 16/11).
 *  Antes, el tamaño dependía del número de letras («21 px si pasa de 7»), y
 *  con 4 o 5 cuerdas en inglés no cabía: salía «1st 2nd 3rd …», y en el panel
 *  estrecho del horizontal, nada. Ahora se mide de verdad: se parte del tamaño
 *  del CSS (30 px en el móvil, 44 en tableta) y se baja de 1 en 1 hasta que
 *  cabe, sin bajar de ENCAJE_MIN; si ni así, se parte en dos líneas.
 *  Medir obliga al navegador a calcular la página, pero son pocas vueltas y
 *  solo al cambiar de reto, de pista o de tamaño de ventana. */
const ENCAJE_MIN = 13;
function encajar(v){
  v.style.fontSize = ''; v.classList.remove('wrap');
  if (!v.clientWidth) return;                 // oculta: se encaja cuando se vea
  let px = parseFloat(getComputedStyle(v).fontSize);
  while (v.scrollWidth > v.clientWidth + 1 && px > ENCAJE_MIN){ px -= 1; v.style.fontSize = px + 'px'; }
  if (v.scrollWidth > v.clientWidth + 1) v.classList.add('wrap');
}
// Girar el móvil o cambiar la ventana cambia el sitio disponible.
window.addEventListener('resize', () => document.querySelectorAll('.ch-hints .clue-v').forEach(encajar));

function renderChallenge(){
  const box = document.getElementById('challenge-text');
  const btn = document.getElementById('btn-repeat');
  btn.classList.toggle('ready', !guessStarted);
  btn.setAttribute('aria-label', guessStarted ? t('guess.repeat') : t('guess.startAria'));
  renderClues();
  // «Ver la respuesta»: solo en el modo de seguir intentando, tras fallar (J-13),
  // y mientras el reto está en marcha: si se pausó al ocultar la app, primero ▶ (AT-09 #9).
  const rendirse = document.getElementById('qb-giveup');
  rendirse.hidden = !(guessStarted && challenge && challenge.misses && !challenge.revealed && !challenge.solved);
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

  if (challenge.misses && !challenge.solved){
    box.innerHTML = '<b class="ko">' + t('guess.miss') + '</b> <span class="dim">' + t('guess.tryAgain') + '</span>';
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
    // La racha cuenta aciertos a la primera: tras un fallo (modo «seguir
    // intentando», J-13) se pasa al siguiente reto, pero no suma.
    if (!challenge.misses) streak++;
    if (streak > currentRecord()){ state.records[state.tuningId] = streak; save(); }
    challenge.solved = true;
    renderChallenge();
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
    // J-10: el fallo rompe la racha siempre.
    streak = 0;
    cell.classList.add('wrong');
    box.classList.add('flash-ko');
    buzz([12,60,12]);
    updateScore();
    if (state.onMiss === 'retry'){
      // J-13 (tu petición del 21/10): sigues buscándola. La casilla fallada
      // se marca un momento; ▶ repite el sonido y «Ver la respuesta» se rinde.
      challenge.misses = (challenge.misses || 0) + 1;
      renderChallenge();
      marcarUnMomento(cell, 'wrong', 900);   // cada casilla, su temporizador (AT-09 #4)
      return;
    }
    revealAnswer(REVEAL_DELAY);
  }
}


/** Enseña dónde estaba la nota y pasa al reto siguiente (J-10). `espera`:
 *  cuánto esperar antes de que suene y se ilumine (tras un fallo, el tiempo de
 *  oír la nota que pulsaste; si te rindes, nada). */
function revealAnswer(espera){
  if (!challenge || challenge.revealed) return;
  locked = true;
  challenge.revealed = true;
  renderChallenge();
  // Primero suena la nota que pulsaste; un instante después, la que se
  // buscaba, mientras se iluminan sus posiciones. Oír las dos seguidas es lo
  // que educa el oído: la diferencia se aprende por contraste.
  const target = challenge;
  clearTimeout(nextTimer);
  nextTimer = setTimeout(() => {
    if (screen !== 'guess' || challenge !== target) return;
    positionsFor(target.midi).forEach(p => {
      const c = document.querySelector('.fret-cell[data-row="'+p.rowIdx+'"][data-fret="'+p.fret+'"]');
      if (c) c.classList.add('reveal');
    });
    playMidi(target.midi);
    nextTimer = setTimeout(newChallenge, NEXT_AFTER_REVEAL);
  }, espera);
}
