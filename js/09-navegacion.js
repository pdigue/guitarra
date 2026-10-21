"use strict";

// 09-navegacion.js · Navegación y Ajustes: áreas, botón «atrás», panel de Ajustes y sus controles.
// Se carga como <script> clásico, en el orden de index.html: lo declarado aquí
// (const, let, function) lo ven los archivos que vienen después.

/* ============================================================
   9. NAVEGACIÓN Y AJUSTES
   ============================================================ */

function setScreen(next){
  screen = next;
  document.querySelectorAll('.tab[data-screen]').forEach(t =>
    t.classList.toggle('active', t.dataset.screen === next));

  const isTuner = next === 'tuner';
  const isGuess = next === 'guess';
  const isScales = next === 'scales';

  document.getElementById('board-area').hidden = isTuner;
  document.getElementById('tuner').hidden = !isTuner;
  if (!isTuner) stopMic();      // el micrófono se apaga al salir del Afinador (interfaz.md §6)
  // El panel lleva atajos, reto, pentagrama y zoom: nada de eso es del
  // Afinador. Las pistas van dentro del reto, así que solo salen al adivinar.
  document.getElementById('panel').hidden = isTuner;
  document.getElementById('challenge').hidden = !isGuess;
  document.getElementById('scales-card').hidden = !isScales;
  document.getElementById('scale-nav').hidden = !isScales;
  updateRotateHint();

  clearMarks(['active','equal','correct','wrong','reveal']);
  clearTimeout(nextTimer);
  clearTimeout(playTimer);
  applyBoardFlags();          // «ver todas las notas» depende del modo (J-12)
  labelCells();               // las etiquetas dicen la nota o no, según el área

  if (isGuess){
    streak = 0;
    guessStarted = false;
    updateScore();
    newChallenge();
  } else {
    challenge = null;
    renderClues();              // fuera de Adivinar, las pistas no enseñan respuesta
  }
  if (isScales){ resetScalePractice(); sc.paso = 0; renderScales(); }
  else leaveScales();
  if (!isTuner) requestAnimationFrame(applyZoom);
}

function syncUI(){
  // Acceso rápido
  const qn = document.getElementById('qb-notation');
  qn.textContent = state.notation === 'latin' ? 'Do Re Mi' : 'C D E';
  qn.classList.add('on');
  document.getElementById('qb-staff').classList.toggle('on', state.showStaff);
  document.getElementById('qb-hint-note').classList.toggle('on', !!state.hintNote);
  document.getElementById('qb-hint-string').classList.toggle('on', !!state.hintString);

  // Pentagrama
  document.getElementById('display').classList.toggle('hidden', !state.showStaff);

  // Ajustes. Los selectores segmentados anuncian su opción activa también a
  // los lectores de pantalla (aria-pressed), no solo con el color.
  const segs = { 'set-notation': state.notation, 'set-timbre': state.timbre,
                 'set-fretnums': state.fretNums, 'set-lang': state.lang };
  for (const id in segs){
    document.querySelectorAll('#'+id+' button').forEach(b => {
      const on = b.dataset.v === segs[id];
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }
  const switches = {
    'set-staff': state.showStaff,
    'set-showall': state.showAllNotes,
    'set-equals': state.showEquals
  };
  for (const id in switches){
    const sw = document.getElementById(id);
    sw.classList.toggle('on', switches[id]);
    sw.setAttribute('aria-checked', switches[id] ? 'true' : 'false');
  }
  document.getElementById('set-tuning').value = state.tuningId;
  document.getElementById('tuning-select').value = state.tuningId;

  applyBoardFlags();
  updateScore();
}

let sheetOpener = null;   // botón que abrió Ajustes: el foco vuelve a él

function openSheet(open){
  const sheet = document.getElementById('sheet');
  sheet.classList.toggle('open', open);
  document.getElementById('sheet-bg').classList.toggle('open', open);
  // Cerrado solo está desplazado con transform, así que sin inert seguiría
  // recibiendo el foco al tabular por la página. Abierto, es lo único que se
  // puede usar: el resto de la página queda inerte, como en un diálogo, y el
  // teclado no puede cambiar de área por detrás (AT-04 #2).
  sheet.inert = !open;
  if (!open) sheet.style.transform = '';   // por si se cerró deslizando el asa
  for (const e of document.body.children)
    if (e !== sheet && e.id !== 'sheet-bg' && e.id !== 'gate') e.inert = open;
  if (open){ sheet.querySelector('button, select, [tabindex]')?.focus(); return; }
  // El foco vuelve al botón que abrió Ajustes, o al otro si al girar el móvil
  // ese ya no se ve (AT-04 #3).
  const visible = b => b && (typeof b.getClientRects !== 'function' || b.getClientRects().length > 0);
  [sheetOpener, document.getElementById('btn-settings'), document.getElementById('btn-settings-rail')]
    .find(visible)?.focus();
}

/* --- Botón «atrás» del sistema (C-07, interfaz.md §4) ---
   Cada área tiene su dirección (#libre, #adivinar…) y cada cambio de área o
   apertura de Ajustes apunta un paso en el historial del navegador. Así
   «atrás» cierra Ajustes o vuelve al área anterior. Desde la primera área no
   se bloquea nada: actúa el sistema. Es un estándar presente en todos los
   navegadores; si faltara, la app funciona igual sin ese paso. */
const SCREEN_HASH = { free:'libre', guess:'adivinar', tuner:'afinador', scales:'escalas' };
const canHistory = typeof history !== 'undefined' && typeof history.pushState === 'function';
const sheetIsOpen = () => document.getElementById('sheet').classList.contains('open');

function goTo(next){
  if (next === screen) return;   // tocar la pestaña en la que estás no reinicia nada
  setScreen(next);
  if (canHistory) history.pushState({ screen:next }, '', '#' + SCREEN_HASH[next]);
}
function showSettings(opener){
  sheetOpener = opener || null;
  updateAudioStatus();
  openSheet(true);
  if (canHistory) history.pushState({ screen, sheet:true }, '', '#' + SCREEN_HASH[screen]);
}
let closingSheet = false;   // un back() pendiente: no se pide otro (AT-04 #5)
function hideSettings(){
  // Si abrir Ajustes apuntó un paso, se deshace con back(): el cierre real lo
  // hace el aviso popstate de abajo. Así el historial no acumula pasos.
  if (closingSheet) return;
  if (canHistory && history.state && history.state.sheet){ closingSheet = true; history.back(); }
  else openSheet(false);
}
window.addEventListener('popstate', ev => {
  closingSheet = false;
  if (sheetIsOpen()){ openSheet(false); return; }
  const target = ev.state && ev.state.screen;
  if (target && target !== screen && SCREEN_HASH[target]) setScreen(target);
  // Un paso que deja la misma área no hace nada visible: pasa, por ejemplo,
  // tras recargar estando en Adivinar. Se sigue hacia atrás para que una
  // pulsación de «atrás» siempre se note (AR-05 #6).
  else if (canHistory && (!target || target === screen)) history.back();
});

document.addEventListener('keydown', ev => {
  if (ev.key === 'Escape' && sheetIsOpen()) hideSettings();
});

/* --- Aviso para girar el móvil (V-01, interfaz.md §7) ---
   Solo con el dedo, en vertical y en pantallas de menos de 600 px; nunca en
   el Afinador, que funciona igual en las dos orientaciones. Cerrado no vuelve:
   se guarda con los ajustes, y «Restablecer» lo recupera. */
function updateRotateHint(){
  const show = coarsePointer() && window.innerHeight > window.innerWidth &&
               window.innerWidth < 600 && screen !== 'tuner' && !state.rotateHintClosed;
  document.getElementById('rotate-hint').hidden = !show;
}

function toggleNotation(){
  state.notation = state.notation === 'latin' ? 'anglo' : 'latin';
  save();
  refreshNoteNames();
  renderTunerStrings();
  if (challenge) renderChallenge();
  buildScaleSelects(); renderScales();     // los nombres escritos siguen la nomenclatura
  // El lector de nota se refresca desde lastMidi: la clase .active se limpia
  // a los 2,2 s, así que consultar el DOM fallaba pasado ese tiempo.
  if (lastMidi !== null)
    document.getElementById('note-name').textContent = noteName(lastMidi);
  syncUI();
}

async function setTimbre(timbre){
  if (timbre === state.timbre && samplerReady) return;
  const note = document.getElementById('timbre-note');
  const previous = state.timbre;
  state.timbre = timbre;
  save();
  syncUI();
  note.textContent = t('timbre.loading');
  const ok = await loadSamples(timbre);
  // Llegó otra elección mientras tanto: manda la última.
  if (ok === 'stale' || state.timbre !== timbre){
    // Otra carga la relevó (otra elección o «Reactivar sonido»); esa pone el texto.
    if (samplerReady) note.textContent = timbreText(state.timbre);
    return;
  }
  if (ok){
    note.textContent = timbreText(timbre);
    // Ya no suena una nota de muestra al elegir: sorprendía (Sesión 1, A14).
  } else {
    state.timbre = previous;
    save(); syncUI();
    note.textContent = t('timbre.failed');
  }
}
