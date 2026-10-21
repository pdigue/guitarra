"use strict";

// 06-zoom.js · Zoom: cuántos trastes se ven a la vez.
// Se carga como <script> clásico, en el orden de index.html: lo declarado aquí
// (const, let, function) lo ven los archivos que vienen después.

/* ============================================================
   6. ZOOM — cuántos trastes se ven a la vez
   ============================================================ */

function defaultVisibleFrets(){
  const w = window.innerWidth;
  const landscape = w > window.innerHeight;
  if (w >= 900) return NUM_FRETS;   // escritorio: mástil entero
  if (landscape) return 10;          // con 40 px por traste caben 10 en un iPhone con Safari
  return 5;                          // móvil vertical: pocos y anchos
}

const LABEL_W = 30, NUT_W = 40;   // deben coincidir con --label-w y --nut-w

/** Cuántos trastes caben de verdad sin bajar del ancho mínimo cómodo. */
function maxVisibleFrets(){
  const scroll = document.getElementById('board-scroll');
  const avail = scroll.clientWidth - LABEL_W - NUT_W;
  return Math.max(3, Math.min(NUM_FRETS, Math.floor(avail / zoomFloorW())));
}

function applyZoom(){
  const scroll = document.getElementById('board-scroll');
  const avail = scroll.clientWidth - LABEL_W - NUT_W;

  // Guardamos qué traste estaba centrado para volver a él tras el cambio:
  // el ancho cambia pero scrollLeft está en píxeles, así que sin esto la
  // vista saltaba a otra zona del mástil.
  const prevFw = parseFloat(getComputedStyle(document.getElementById('board'))
                  .getPropertyValue('--fret-w')) || 0;
  const centerFret = prevFw > 0
    ? (scroll.scrollLeft + scroll.clientWidth/2 - NUT_W) / prevFw
    : null;

  // Con el dedo, un traste no baja de 28 px aunque pidas más con «+» (por
  // defecto se ven los que caben a 40 px). Si el zoom guardado pide más de los
  // que caben, se muestran los que caben y la etiqueta lo dice, pero no se
  // pisa lo guardado: al girar el móvil vuelve el zoom elegido (V-08).
  let fw = Math.max(zoomFloorW(), Math.min(MAX_FRET_W, avail / state.visibleFrets));
  // La variable vive en #board, no en :root: cambiarla en la raíz obliga al
  // navegador a revalidar el estilo de todo el documento en cada resize.
  document.getElementById('board').style.setProperty('--fret-w', fw + 'px');

  if (centerFret !== null){
    scroll.scrollLeft = Math.max(0,
      centerFret * fw + NUT_W - scroll.clientWidth/2);
  }

  const cap = maxVisibleFrets();
  const shown = Math.min(state.visibleFrets, cap);
  document.getElementById('zoom-label').textContent =
    shown >= NUM_FRETS ? 'Mástil completo' : shown + ' trastes a la vista';
  document.getElementById('zoom-in').disabled  = state.visibleFrets <= 3;
  document.getElementById('zoom-out').disabled = state.visibleFrets >= cap;
}

function zoom(delta){
  const cap = maxVisibleFrets();
  state.visibleFrets = Math.max(3, Math.min(cap, state.visibleFrets + delta));
  save();
  applyZoom();
}
