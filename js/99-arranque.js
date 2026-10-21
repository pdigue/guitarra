"use strict";

// 99-arranque.js · Arranque: conecta los eventos y pone la app en marcha. Va el último porque usa todo lo anterior.
// Se carga como <script> clásico, en el orden de index.html: lo declarado aquí
// (const, let, function) lo ven los archivos que vienen después.

/* ============================================================
   99. ARRANQUE Y EVENTOS
   ============================================================ */

document.getElementById('gate-btn').addEventListener('click', async () => {
  const btn = document.getElementById('gate-btn');
  const sub = document.getElementById('gate-sub');
  btn.disabled = true;
  btn.textContent = t('gate.loading');
  sub.textContent = t('gate.downloading');

  unlockAudio();
  const ok = await loadSamples(state.timbre);
  if (!ok){
    sub.textContent = t('gate.failed');
    await new Promise(r => setTimeout(r, 900));
  }
  document.getElementById('gate').classList.add('hidden');
  requestAnimationFrame(applyZoom);
});

['btn-settings','btn-settings-rail'].forEach(id => {
  document.getElementById(id).addEventListener('click', ev => showSettings(ev.currentTarget));
});
document.getElementById('sheet-bg').addEventListener('click', hideSettings);

// En Ajustes, tocar cualquier parte de una fila con interruptor lo cambia
// (G-05): la fila es un blanco mucho mayor que el interruptor.
document.getElementById('sheet').addEventListener('click', ev => {
  const row = ev.target.closest('.set-row');
  if (!row || ev.target.closest('button, select')) return;
  row.querySelector('.sw')?.click();
});

// Cerrar Ajustes deslizando el asa hacia abajo (interfaz.md §6), solo cuando
// es una hoja que sube desde abajo. Más de 80 px, o un gesto rápido, cierra.
(function(){
  const sheet = document.getElementById('sheet'), handle = document.getElementById('sheet-handle');
  const grabber = handle.querySelector('.grabber');
  let drag = null;
  handle.addEventListener('pointerdown', ev => {
    if (typeof getComputedStyle === 'function' && getComputedStyle(grabber).display === 'none') return;
    drag = { y:ev.clientY, t:Date.now(), id:ev.pointerId, dy:0 };
    // El asa se queda con el puntero: si se suelta fuera, el arrastre termina igual.
    if (typeof handle.setPointerCapture === 'function') handle.setPointerCapture(ev.pointerId);
    sheet.classList.add('dragging');
  });
  handle.addEventListener('pointermove', ev => {
    if (!drag || ev.pointerId !== drag.id) return;
    drag.dy = Math.max(0, ev.clientY - drag.y);
    sheet.style.transform = 'translateY(' + drag.dy + 'px)';
  });
  const end = ev => {
    if (!drag || (ev && ev.pointerId !== undefined && ev.pointerId !== drag.id)) return;
    const rapido = drag.dy > 30 && drag.dy / Math.max(1, Date.now() - drag.t) > 0.5;
    const cerrar = drag.dy > 80 || rapido;
    drag = null;
    sheet.classList.remove('dragging');
    // Si se cierra, la hoja sigue bajando desde donde la soltaste: openSheet
    // quita el desplazamiento al cerrar, sin rebote (AT-05 #3).
    if (cerrar) hideSettings();
    else sheet.style.transform = '';
  };
  handle.addEventListener('pointerup', end);
  handle.addEventListener('pointercancel', end);
  handle.addEventListener('lostpointercapture', end);
})();
document.getElementById('rotate-close').addEventListener('click', () => {
  state.rotateHintClosed = true; save(); updateRotateHint();
});

document.getElementById('qb-notation').addEventListener('click', toggleNotation);
document.getElementById('qb-staff').addEventListener('click', () => {
  state.showStaff = !state.showStaff; save(); syncUI();
});
document.getElementById('qb-hint-note').addEventListener('click', () => {
  state.hintNote = !state.hintNote; save(); syncUI(); renderChallenge();
});
document.getElementById('qb-hint-string').addEventListener('click', () => {
  state.hintString = !state.hintString; save(); syncUI(); renderChallenge();
});

document.getElementById('btn-repeat').addEventListener('click', onRepeat);

document.getElementById('zoom-in').addEventListener('click', () => zoom(-2));
document.getElementById('zoom-out').addEventListener('click', () => zoom(2));

document.querySelectorAll('.tab[data-screen]').forEach(t => {
  // Tocar la pestaña en la que ya estás no hace nada: antes reiniciaba la racha.
  t.addEventListener('click', () => goTo(t.dataset.screen));
});

document.querySelectorAll('#set-notation button').forEach(b => {
  b.addEventListener('click', () => {
    if (state.notation !== b.dataset.v) toggleNotation();
  });
});
// Idioma (G-12): se cambian los textos fijos y se repinta lo que se escribe
// desde el código. El estado del juego y del micrófono no se tocan.
function setLang(l){
  if (state.lang === l) return;
  const antes = state.lang;
  state.lang = l; save();
  refreshLanguage(antes);
}
function refreshLanguage(antes){
  // El motivo que enseñaba el micrófono (sin permiso, cortado…) se traduce
  // buscando su clave en el idioma anterior (AT-08 #4).
  const why = document.getElementById('mic-why');
  const clave = antes && Object.keys(TEXTOS[antes]).find(k => TEXTOS[antes][k] === why.textContent);
  aplicarIdioma();
  buildTuner();
  labelCells();
  labelMicStrings();
  if (!mic.analyser) showMicPanel(micUnavailable() || (clave ? t(clave) : ''));
  else {
    mic.orden = null;                         // fuerza a repintar la orden en el idioma nuevo
    if (mic.lecturas.length >= 2 && mic.ultimaHz) showMicReading(mic.ultimaHz); else showMicIdle();
  }
  document.getElementById('timbre-note').textContent = samplerReady ? timbreText(state.timbre) : t('set.guitar.sub');
  updateAudioStatus();
  updateScore();
  renderChallenge();
  buildScaleSelects(); renderScales();
  if (lastMidi === null) document.getElementById('note-name').innerHTML = '<span class="note-placeholder">' + t('reader.play') + '</span>';
  else document.getElementById('note-oct').textContent = t('octave', { n: noteInfo(lastMidi).octave });
  syncUI();
  applyZoom();
}
// ♯ o ♭ para cada tecla negra (N-06): los botones se crean con sus nombres.
function buildAccidentals(){
  const box = document.getElementById('set-accidentals');
  box.innerHTML = '';
  for (const pc of NEGRAS){
    const seg = document.createElement('div'); seg.className = 'seg';
    for (const v of ['sharp', 'flat']){
      const b = document.createElement('button');
      b.dataset.pc = String(pc); b.dataset.v = v;
      const n = escribir(pc, PC_LETRA.indexOf(v === 'sharp' ? pc - 1 : pc + 1));
      b.textContent = nombreEscrito(n);
      b.addEventListener('click', () => {
        state.accidentals[pc] = v; save();
        refreshNoteText();
      });
      seg.appendChild(b);
    }
    box.appendChild(seg);
  }
  syncUI();
}
document.querySelectorAll('#set-onmiss button').forEach(b => {
  b.addEventListener('click', () => { state.onMiss = b.dataset.v; save(); syncUI(); });
});
document.getElementById('qb-giveup').addEventListener('click', () => revealAnswer(0));
document.querySelectorAll('#set-lang button').forEach(b => {
  b.addEventListener('click', () => setLang(b.dataset.v));
});
document.querySelectorAll('#set-timbre button').forEach(b => {
  b.addEventListener('click', () => setTimbre(b.dataset.v));
});
document.getElementById('set-staff').addEventListener('click', () => {
  state.showStaff = !state.showStaff; save(); syncUI();
});
document.querySelectorAll('#set-fretnums button').forEach(b => {
  b.addEventListener('click', () => { state.fretNums = b.dataset.v; save(); syncUI(); });
});
document.getElementById('set-showall').addEventListener('click', () => {
  state.showAllNotes = !state.showAllNotes; save(); syncUI();
});
document.getElementById('set-equals').addEventListener('click', () => {
  state.showEquals = !state.showEquals; save(); syncUI();
});
['tuning-select','set-tuning'].forEach(id => {
  document.getElementById(id).addEventListener('change', ev => {
    state.tuningId = ev.target.value;
    if (state.tuningId === 'custom' && !state.customTuning) state.customTuning = activeTuning();
    save();
    document.getElementById('tuning-select').value = state.tuningId;
    document.getElementById('set-tuning').value = state.tuningId;
    onTuningChanged();
  });
});
document.getElementById('set-clear-record').addEventListener('click', () => {
  if (!confirm(t('confirm.clear'))) return;
  state.records = {}; save(); updateScore();
});
document.getElementById('audio-wake').addEventListener('click', rebuildAudio);
document.addEventListener('visibilitychange', onVisibility);
['pointerup', 'touchend', 'click'].forEach(t =>
  document.addEventListener(t, onGesture, { capture:true, passive:true }));
document.getElementById('set-reset').addEventListener('click', async () => {
  if (!confirm(t('confirm.reset'))) return;
  const previousTimbre = state.timbre, records = state.records, idioma = state.lang;
  state = sanitize({ lang: idioma });   // con el idioma, para que la nomenclatura por defecto sea la suya (AT-08 #5)
  state.records = records;        // los récords son tuyos, no ajustes (Sesión 1, A14)
  state.lang = idioma;            // y el idioma se queda: restablecer no debe cambiarte de lengua
  state.visibleFrets = defaultVisibleFrets();
  save();
  buildTuner();
  buildBoard();
  syncUI();
  applyZoom();
  updateRotateHint();          // «Restablecer» recupera el aviso para girar
  setTunerMode(state.tunerMode);   // el afinador vuelve a «De oído»
  hideSettings();
  // El reto anterior puede referirse a una nota que ya no existe en la
  // afinación restablecida, y dejaría al usuario fallando indefinidamente.
  if (screen === 'guess'){ streak = 0; updateScore(); newChallenge(); }
  // Y la interfaz mostraría "Clásica" mientras sigue sonando la acústica.
  // setTimbre ya actualiza el aviso y, si la carga falla, vuelve al timbre que
  // de verdad suena (AT-03 #3). Compara con el timbre actual: se le devuelve
  // el anterior para que haga el cambio completo.
  if (previousTimbre !== state.timbre){
    const elegido = state.timbre;
    state.timbre = previousTimbre;
    await setTimbre(elegido);
  }
});

// resize cubre también el giro del dispositivo, y orientationchange está
// obsoleto. Además, ya no se pisa el zoom elegido por el usuario (V-08).
let resizeFrame = null;
window.addEventListener('resize', () => {
  updateRotateHint();
  if (screen === 'tuner') return;
  if (resizeFrame) cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(applyZoom);
});

// --- Inicialización ---
if (!state.visibleFrets) state.visibleFrets = defaultVisibleFrets();
// El panel arranca cerrado: inert evita que el teclado entre en él antes de
// que nadie lo haya abierto nunca.
document.getElementById('sheet').inert = true;
document.getElementById('app-version').textContent = 'Trasteando ' + APP_VERSION;
// Rótulo corto del chip del pentagrama: la misma clave dibujada que en el
// pentagrama, porque el carácter Unicode falla en muchos Android.
(function(){
  const svg = el('svg', { viewBox:'4 13 17 41', width:11, height:26, 'aria-hidden':'true' });
  svg.appendChild(el('path', { d:CLEF_PATH, fill:'currentColor' }));
  document.getElementById('qb-staff-icon').appendChild(svg);
})();
// Al abrir se entra siempre en Libre (L-01), aunque la dirección diga otra área.
if (canHistory) history.replaceState({ screen:'free' }, '', '#libre');
aplicarIdioma();               // los textos fijos, en el idioma elegido (G-12)
buildTuner();
buildBoard();
bindBoardInput();
bindMicTuner();
bindScales();
buildAccidentals();
bindBoardKeys();
clearStaff();
syncUI();
applyZoom();
updateRotateHint();
