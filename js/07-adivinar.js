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
  pistas.classList.toggle('dos', !!challenge && screen === 'guess' && state.hintNote && state.hintString);
  // Se encajan al final, con la franja ya encendida y su ancho definitivo.
  pistas.querySelectorAll('.clue-v').forEach(encajar);
}

/** Que la respuesta de una pista quepa entera en su recuadro (F5.8, 16/11).
 *  Antes, el tamaño dependía del número de letras («21 px si pasa de 7»), y
 *  con 4 o 5 cuerdas en inglés no cabía: salía «1st 2nd 3rd …», y en el panel
 *  estrecho del horizontal, nada. Ahora se mide de verdad: scrollWidth es lo
 *  que el texto necesita y clientWidth, lo que el recuadro le da. Se parte del
 *  tamaño del CSS (26 px en el móvil, 38 en tableta; desde la 0.6.13), se calcula de una vez el
 *  que cabría (una regla de tres) y se afina de 1 en 1.
 *  Nunca baja de ENCAJE_MIN, 20 px: es el tamaño de la nota que tocas (J-01), y
 *  lo que buscas no debe verse más pequeño que lo que tocas (tu #4, AR-22 #1).
 *  Si ni así cabe, se parte en dos líneas. */
const ENCAJE_MIN = 20;
function encajar(v){
  v.style.fontSize = ''; v.classList.remove('wrap');
  if (!v.clientWidth) return;                 // oculta: se encaja cuando se vea
  const noCabe = () => v.scrollWidth > v.clientWidth + 1;
  if (!noCabe()) return;
  const max = parseFloat(getComputedStyle(v).fontSize);
  let px = Math.max(ENCAJE_MIN, Math.min(max, Math.floor(max * v.clientWidth / v.scrollWidth)));
  v.style.fontSize = px + 'px';
  while (noCabe() && px > ENCAJE_MIN){ px -= 1; v.style.fontSize = px + 'px'; }
  if (noCabe()) v.classList.add('wrap');
}
// Si cambia el ancho de la franja (girar el móvil, cambiar la ventana, aparecer
// «Ver la respuesta»…), se vuelve a encajar, una vez por fotograma como mucho.
// ResizeObserver avisa de cualquier cambio de tamaño de un elemento; donde no
// exista, basta el aviso de la ventana (resize).
let encajePendiente = 0;
function reencajar(){
  cancelAnimationFrame(encajePendiente);
  encajePendiente = requestAnimationFrame(() => document.querySelectorAll('.ch-hints .clue-v').forEach(encajar));
}
if (typeof ResizeObserver === 'function') new ResizeObserver(reencajar).observe(document.querySelector('.ch-hints'));
else window.addEventListener('resize', reencajar);

function renderChallenge(){
  const box = document.getElementById('challenge-text');
  const btn = document.getElementById('btn-repeat');
  btn.classList.toggle('ready', !guessStarted);
  btn.setAttribute('aria-label', guessStarted ? t('guess.repeat') : t('guess.startAria'));
  // «Ver la respuesta»: solo en el modo de seguir intentando, tras fallar (J-13),
  // y mientras el reto está en marcha: si se pausó al ocultar la app, primero ▶ (AT-09 #9).
  // Va antes que las pistas: al aparecer, las estrecha, y se miden ya con su ancho (AT-21 #1).
  const rendirse = document.getElementById('qb-giveup');
  rendirse.hidden = !(guessStarted && challenge && challenge.misses && !challenge.revealed && !challenge.solved);
  renderClues();
  if (!challenge){ box.textContent = ''; return; }

  if (!guessStarted){
    // Una sola frase: «Pulsa ▶, escucha y encuéntrala» (antes, dos: «… para oír la nota»
    // y «y búscala en el mástil»). El lector de pantalla oye además «(Empezar)».
    box.innerHTML = '<b>' + t('guess.press1') + '<span class="sr-only"> ' + t('guess.pressSr') + '</span>' + t('guess.press2') + '</b>';
    return;
  }

  if (challenge.revealed){
    const i = noteInfo(challenge.midi);
    box.innerHTML = '<span class="dim">' + t('guess.was') + '</span> <b style="color:'+i.color+'">'
      + noteName(challenge.midi) + '</b> <span class="dim">' + t('guess.wasEnd', { n: i.octave }) + '</span>';
    return;
  }

  if (challenge.misses && !challenge.solved){
    // Corto (tu comentario del 16/11): «✗ ¡Prueba otra vez!»; que ▶ repite la nota
    // ya lo dice la frase del reto. La ✗, oculta al lector de pantalla, que la
    // leería como «multiplicación» (AT-22 B5).
    box.innerHTML = '<b class="ko"><span aria-hidden="true">✗ </span>' + t('guess.miss') + '</b>';
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
