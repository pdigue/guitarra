"use strict";

// 08-afinador-referencia.js · Afinador por referencia: hace sonar cada cuerda al aire para afinar de oído.
// Se carga como <script> clásico, en el orden de index.html: lo declarado aquí
// (const, let, function) lo ven los archivos que vienen después.

/* ============================================================
   8. AFINADOR POR REFERENCIA
   ============================================================ */

function buildTuner(){
  const sel = document.getElementById('tuning-select');
  const sel2 = document.getElementById('set-tuning');
  [sel, sel2].forEach(s => {
    s.innerHTML = '';
    TUNINGS.forEach(t => {
      const o = document.createElement('option');
      o.value = t.id; o.textContent = t.name;
      s.appendChild(o);
    });
    s.value = state.tuningId;
  });
  renderTunerStrings();
  renderTunerStaff();
}

function renderTunerStrings(){
  const box = document.getElementById('strings-tuner');
  box.innerHTML = '';
  displayStrings().forEach(str => {
    const info = noteInfo(str.openMidi);

    const row = document.createElement('div');
    row.className = 'tstring';

    const num = document.createElement('div');
    num.className = 'tstring-num';
    num.textContent = str.number + 'ª';
    row.appendChild(num);

    const play = document.createElement('button');
    play.className = 'tstring-play';
    play.innerHTML = '<span class="tstring-note" style="--tcol:'+info.color+'">'
                   + noteName(str.openMidi) + '</span>'
                   + '<span class="tstring-oct">octava ' + info.octave + '</span>'
                   + '<span class="tstring-hint">Pulsa para oírla</span>';
    play.addEventListener('click', () => {
      playMidi(str.openMidi, 3);
      row.classList.add('ringing');
      setTimeout(() => row.classList.remove('ringing'), 1400);
    });
    row.appendChild(play);

    // Ajuste fino por semitonos: cualquier cambio convierte la afinación
    // en personalizada, para no alterar los presets.
    const semi = document.createElement('div');
    semi.className = 'semi';
    [['−',-1],['+',1]].forEach(([txt,d]) => {
      const b = document.createElement('button');
      b.textContent = txt;
      b.setAttribute('aria-label', (d>0?'Subir':'Bajar') + ' la ' + str.number + 'ª cuerda');
      b.addEventListener('click', () => shiftString(str.lowIndex, d));
      semi.appendChild(b);
    });
    row.appendChild(semi);

    box.appendChild(row);
  });
}

function shiftString(lowIndex, delta){
  const current = activeTuning();
  current[lowIndex] = Math.max(MIN_TUNING_MIDI,
                      Math.min(MAX_TUNING_MIDI, current[lowIndex] + delta));
  state.customTuning = current;
  state.tuningId = 'custom';
  save();
  document.getElementById('tuning-select').value = 'custom';
  document.getElementById('set-tuning').value = 'custom';
  onTuningChanged();
  playMidi(current[lowIndex], 2);
}

function renderTunerStaff(){
  const svg = document.getElementById('tuner-staff-svg');
  drawStaffBase(svg, 38, 330);
  // De grave a aguda, repartidas a lo largo del pentagrama.
  activeTuning().forEach((midi, i) => {
    drawNote(svg, midi, 70 + i*46, noteInfo(midi).color, false);
  });
}

/** Punto único desde el que se propaga un cambio de afinación a toda la app. */
function onTuningChanged(){
  buildBoard();
  applyZoom();
  renderTunerStrings();
  renderTunerStaff();
  resetReader();
  // Cada afinación tiene su récord (J-11): una racha no pasa de una a otra.
  if (screen === 'guess'){ streak = 0; newChallenge(); }
  updateScore();
}

function resetReader(){
  lastMidi = null;
  clearStaff();
  document.getElementById('note-name').innerHTML = '<span class="note-placeholder">toca</span>';
  document.getElementById('note-oct').textContent = '';
}
