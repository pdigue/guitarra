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
  // Móvil en horizontal (la misma condición que el css: alto de 520 px o menos):
  // los trastes que caben a 40 px (G-05, V-04) en el mástil más estrecho, el de
  // Adivinar, descontando las zonas seguras (la isla y la barra de inicio, que
  // el css pone como relleno del body). Antes eran 10 fijos, y el iPhone Pro Max
  // (932 px) caía en la regla de tableta: 17 trastes de 28 px (16/11).
  if (landscape && window.innerHeight <= 520){
    const cs = getComputedStyle(document.body);
    const util = w - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0);
    return Math.max(5, Math.min(NUM_FRETS, Math.floor((util - MOVIL_H_RESTO - LABEL_W - NUT_W) / 40)));
  }
  // Escritorio: mástil entero. Con el dedo (un iPad en horizontal), los que
  // caben a 40 px (G-05, V-04): el mástil entero los dejaría en 38 px a 1024.
  if (w >= 900) return coarsePointer() ? Math.min(NUM_FRETS, Math.floor((w - LABEL_W - NUT_W - BOARD_PAD_X) / 40)) : NUM_FRETS;
  if (landscape) return 10;
  return 5;                          // móvil vertical: pocos y anchos
}

const LABEL_W = 30, NUT_W = 40;   // deben coincidir con --label-w y --nut-w
const BOARD_PAD_X = 40;           // relleno lateral de .board-area en tableta (20 + 20 px, css/trasteando.css)
// Móvil en horizontal: raíl (64) + panel de Adivinar (204, con su borde) + relleno
// del mástil (6 + 6) y 2 de margen (css/trasteando.css, «MÓVIL EN HORIZONTAL»).
const MOVIL_H_RESTO = 64 + 204 + 12 + 2;

/** Cuántos trastes caben de verdad sin bajar del ancho mínimo cómodo. */
function maxVisibleFrets(){
  const scroll = document.getElementById('board-scroll');
  const avail = scroll.clientWidth - LABEL_W - NUT_W;
  return Math.max(3, Math.min(NUM_FRETS, Math.floor(avail / zoomFloorW())));
}

function applyZoom(){
  const scroll = document.getElementById('board-scroll');
  const avail = scroll.clientWidth - LABEL_W - NUT_W;

  // En Acordes, el mástil se acota a los trastes del acorde (del 0 al 5) y los
  // estira a todo el ancho, para que el dibujo sea lo principal (AC-07): ni
  // zoom ni desplazamiento. El zoom guardado no se toca: vuelve al salir.
  if (screen === 'chords'){
    document.getElementById('board').style.setProperty('--fret-w', (avail / TRASTES_ACORDE) + 'px');
    scroll.scrollLeft = 0;
    return;
  }

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
    shown >= NUM_FRETS ? t('zoom.all') : t('zoom.n', { n: shown });
  document.getElementById('zoom-in').disabled  = state.visibleFrets <= 3;
  document.getElementById('zoom-out').disabled = state.visibleFrets >= cap;
}

function zoom(delta){
  const cap = maxVisibleFrets();
  state.visibleFrets = Math.max(3, Math.min(cap, state.visibleFrets + delta));
  save();
  applyZoom();
}
