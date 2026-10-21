"use strict";

// 05-mastil.js · Mástil: construye las cuerdas y los trastes, y responde al dedo, al ratón y al teclado.
// Se carga como <script> clásico, en el orden de index.html: lo declarado aquí
// (const, let, function) lo ven los archivos que vienen después.

/* ============================================================
   5. MÁSTIL
   ============================================================ */

function buildBoard(){
  const nums = document.getElementById('fret-nums');
  const rows = document.getElementById('strings');
  nums.innerHTML = '';
  rows.innerHTML = '';

  // Fila de números. El hueco inicial mide exactamente lo mismo que la
  // etiqueta de cuerda, y cada número lo mismo que su celda: así el número
  // cae justo encima de la franja donde se pulsa esa nota.
  const spacer = document.createElement('div');
  spacer.className = 'fn-spacer';
  nums.appendChild(spacer);
  for (let f=0; f<=NUM_FRETS; f++){
    const n = document.createElement('div');
    n.className = 'fret-num' + (f===0 ? ' nut' : '')
                + (MARKERS_SINGLE.includes(f) || MARKERS_DOUBLE.includes(f) ? ' key' : '');
    n.textContent = f;
    nums.appendChild(n);
  }

  // El mástil es una cuadrícula para los lectores de pantalla y un único punto
  // de parada del tabulador: dentro, las flechas mueven el foco (roving tabindex).
  rows.setAttribute('role', 'grid');
  rows.setAttribute('aria-label', 'Mástil. Flechas para moverte, Intro o Espacio para tocar');
  displayStrings().forEach((str, rowIdx) => {
    const row = document.createElement('div');
    row.className = 'string-row';
    row.setAttribute('role', 'row');
    row.style.setProperty('--sth', str.thickness + 'px');

    const label = document.createElement('div');
    label.className = 'string-label';
    label.setAttribute('role', 'rowheader');
    label.textContent = noteName(str.openMidi);
    row.appendChild(label);

    const frets = document.createElement('div');
    frets.className = 'frets-row';

    for (let f=0; f<=NUM_FRETS; f++){
      const cell = document.createElement('div');
      cell.className = 'fret-cell' + (f===0 ? ' nut' : '');

      if (rowIdx===3 && MARKERS_SINGLE.includes(f)){
        const m = document.createElement('div'); m.className='marker'; cell.appendChild(m);
      }
      if ((rowIdx===1 || rowIdx===4) && MARKERS_DOUBLE.includes(f)){
        const m = document.createElement('div'); m.className='marker'; cell.appendChild(m);
      }

      const midi = str.openMidi + f;
      const info = noteInfo(midi);
      const dot = document.createElement('div');
      dot.className = 'dot';
      dot.setAttribute('aria-hidden', 'true');   // lo que se anuncia es la etiqueta de la casilla
      dot.style.setProperty('--dot', info.color);
      dot.textContent = noteName(midi);
      cell.appendChild(dot);

      cell.dataset.midi = midi;
      cell.dataset.row = rowIdx;
      cell.dataset.fret = f;
      cell.setAttribute('role', 'gridcell');
      cell.setAttribute('tabindex', '-1');
      // Sin listener por celda: los eventos se delegan una sola vez en #strings.
      frets.appendChild(cell);
    }
    row.appendChild(frets);
    rows.appendChild(row);
  });

  setRoving(kbPos.row, kbPos.fret);
  labelCells();
  applyBoardFlags();
}

/* --- Mástil con teclado (G-05) ---
   Solo una casilla tiene tabindex 0: la última visitada. Las flechas mueven
   el foco, Inicio y Fin van al primer y al último traste a la vista, e Intro o
   Espacio tocan la nota, igual que el dedo. */
let kbPos = { row:0, fret:0 };

function cellAt(row, fret){
  return document.querySelector('.fret-cell[data-row="' + row + '"][data-fret="' + fret + '"]');
}
/** Lo que oye un lector de pantalla. En Adivinar no dice la nota: sería la respuesta (J-12). */
function cellLabel(cell){
  const row = +cell.dataset.row, fret = +cell.dataset.fret;
  const str = displayStrings()[row];
  const where = str.number + 'ª cuerda, ' + (fret === 0 ? 'al aire' : 'traste ' + fret);
  const midi = +cell.dataset.midi;
  return screen === 'guess' ? where : noteName(midi) + (Math.floor(midi / 12) - 1) + ', ' + where;
}
function setRoving(row, fret){
  const old = cellAt(kbPos.row, kbPos.fret);
  if (old) old.setAttribute('tabindex', '-1');
  kbPos = { row, fret };
  const cell = cellAt(row, fret);
  if (cell) cell.setAttribute('tabindex', '0');
  return cell;
}
/** Pone a todas las casillas su etiqueta. Se llama al construir el mástil y al
 *  cambiar de área o de nomenclatura: en Adivinar ninguna casilla dice su nota,
 *  ni siquiera las que no tienen el foco (AR-06 #1). */
function labelCells(){
  document.querySelectorAll('.fret-cell').forEach(c => c.setAttribute('aria-label', cellLabel(c)));
}
/** Primer y último traste que se ven enteros en la ventana del mástil. */
function visibleFretRange(){
  const scroll = document.getElementById('board-scroll');
  if (typeof scroll.getBoundingClientRect !== 'function') return [0, NUM_FRETS];
  const box = scroll.getBoundingClientRect();
  const vis = [...document.querySelectorAll('.fret-cell[data-row="0"]')].filter(c => {
    const r = c.getBoundingClientRect();
    return r.left >= box.left + LABEL_W - 1 && r.right <= box.right + 1;
  });
  return vis.length ? [+vis[0].dataset.fret, +vis[vis.length - 1].dataset.fret] : [0, NUM_FRETS];
}
function bindBoardKeys(){
  document.getElementById('strings').addEventListener('keydown', ev => {
    const cell = ev.target.closest && ev.target.closest('.fret-cell');
    if (!cell) return;
    let row = +cell.dataset.row, fret = +cell.dataset.fret;
    switch (ev.key){
      case 'ArrowRight': fret = Math.min(NUM_FRETS, fret + 1); break;
      case 'ArrowLeft':  fret = Math.max(0, fret - 1); break;
      case 'ArrowDown':  row = Math.min(displayStrings().length - 1, row + 1); break;
      case 'ArrowUp':    row = Math.max(0, row - 1); break;
      case 'Home':       fret = visibleFretRange()[0]; break;
      case 'End':        fret = visibleFretRange()[1]; break;
      case 'Enter': case ' ': ev.preventDefault(); if (!ev.repeat) firePress(cell); return;
      default: return;
    }
    ev.preventDefault();
    const next = setRoving(row, fret);
    if (next){
      next.focus();
      if (typeof next.scrollIntoView === 'function') next.scrollIntoView({ block:'nearest', inline:'nearest' });
    }
  });
}

/** Refresca solo los textos (al cambiar de nomenclatura no hay que reconstruir). */
function refreshNoteNames(){
  document.querySelectorAll('.fret-cell').forEach(c => {
    c.querySelector('.dot').textContent = noteName(parseInt(c.dataset.midi,10));
  });
  const strs = displayStrings();
  document.querySelectorAll('.string-label').forEach((l,i) => {
    l.textContent = noteName(strs[i].openMidi);
  });
  labelCells();
}

function applyBoardFlags(){
  // J-12: en Adivinar, ver todos los nombres sería tener la respuesta delante.
  document.getElementById('board').classList.toggle('show-all',
    state.showAllNotes && screen !== 'guess');
  const nums = document.getElementById('fret-nums');
  nums.classList.toggle('hidden', state.fretNums === 'none');
  nums.classList.toggle('guide',  state.fretNums === 'guide');
}

/* ------------------------------------------------------------
   Entrada táctil.

   En una pantalla táctil, pointerdown se dispara al apoyar el dedo, antes de
   que el navegador sepa si el gesto va a ser un toque o un desplazamiento.
   Como el mástil está enteramente cubierto de celdas, todo intento de
   desplazarse empezaba pulsando una nota, y en modo Adivinar eso rompía la
   racha sin que el usuario hubiera fallado nada.

   Compromiso elegido: en modo Libre la nota suena al apoyar el dedo, porque
   la respuesta inmediata es lo que hace que se sienta como un instrumento, y
   que suene algo al desplazarse es tolerable. En modo Adivinar se espera a
   levantar el dedo y solo cuenta si no hubo arrastre.
   ------------------------------------------------------------ */

const TAP_SLOP = 10;        // píxeles de margen antes de considerarlo arrastre
let pendingTap = null;

function bindBoardInput(){
  const rows = document.getElementById('strings');

  rows.addEventListener('pointerdown', ev => {
    const cell = ev.target.closest('.fret-cell');
    if (!cell) return;
    pendingTap = { cell, x:ev.clientX, y:ev.clientY, id:ev.pointerId };
    setRoving(+cell.dataset.row, +cell.dataset.fret);
    if (screen !== 'guess') firePress(cell);
  });

  rows.addEventListener('pointermove', ev => {
    if (!pendingTap || ev.pointerId !== pendingTap.id) return;
    if (Math.hypot(ev.clientX - pendingTap.x, ev.clientY - pendingTap.y) > TAP_SLOP)
      pendingTap = null;
  });

  // El navegador cancela el puntero cuando decide quedarse el gesto de scroll.
  rows.addEventListener('pointercancel', () => { pendingTap = null; });

  rows.addEventListener('pointerup', ev => {
    if (!pendingTap || ev.pointerId !== pendingTap.id) return;
    const cell = pendingTap.cell;
    pendingTap = null;
    if (screen === 'guess') firePress(cell);
  });
}

function firePress(cell){
  pressFret(cell, parseInt(cell.dataset.midi,10), parseInt(cell.dataset.row,10));
}

let activeTimer = null;
let lastMidi = null;        // última nota tocada, para refrescar al cambiar notación

function pressFret(cell, midi, rowIdx){
  clearMarks(['active','equal']);
  cell.classList.add('active');

  const info = noteInfo(midi);
  playMidi(midi);
  if (screen !== 'guess'){          // en Adivinar, el lector es de la nota buscada
    lastMidi = midi;
    const nameEl = document.getElementById('note-name');
    nameEl.textContent = noteName(midi);
    nameEl.style.setProperty('--note-color', info.color);
    nameEl.style.setProperty('--note-glow', info.color);
    document.getElementById('note-oct').textContent = 'octava ' + info.octave;
    showOnStaff(midi, info.color);
  }

  // Señal secundaria: dónde más suena exactamente esta misma nota.
  if (state.showEquals){
    document.querySelectorAll('.fret-cell').forEach(c => {
      if (c !== cell && parseInt(c.dataset.midi,10) === midi) c.classList.add('equal');
    });
  }

  clearTimeout(activeTimer);
  activeTimer = setTimeout(() => clearMarks(['active','equal']), 2200);

  if (screen === 'guess') evaluate(cell, midi, rowIdx);
}

function clearMarks(classes){
  document.querySelectorAll('.fret-cell').forEach(c => c.classList.remove(...classes));
}
