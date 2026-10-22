"use strict";

// 13-escalas.js · Escalas (F5.3 y F5.4): Mostrar, con intervalos y paso a paso,
// y Práctica, que comprueba si cada nota que tocas pertenece a la escala.
// Se carga como <script> clásico, en el orden de index.html: lo declarado aquí
// (const, let, function) lo ven los archivos que vienen después.

/* ============================================================
   13. ESCALAS
   ============================================================ */

/* La teoría (qué notas tiene cada escala y cómo se escriben) está en
   01-teoria.js; aquí solo se enseña. Una nota del mástil pertenece a la
   escala si su clase de altura (Do, Do♯…, sin octava) es una de las suyas, así
   que funciona igual en cualquier afinación. */

const sc = {
  paso: 0,                  // paso del guiado (E-06)
  encontradas: new Set(),   // clases de altura encontradas en Práctica
  celdas: new Set(),        // casillas acertadas en Práctica ('fila-traste')
  aviso: null,              // { clave, vars } del último aviso de Práctica
  revelar: null             // temporizador del «enseñar las buenas» tras un fallo
};

function escalaActual(){ return ESCALAS.find(e => e.id === state.scaleId) || ESCALAS[0]; }
function pcsEscala(){ return escalaActual().semitonos.map(s => (state.scalePc + s) % 12); }
function notasEscala(){ return escribirEscala(state.scalePc, escalaActual()); }

/** Cómo se escribe una nota en la pantalla actual. En Escalas, si es de la
 *  escala, como la escribe la escala (Si♭ en Fa mayor, aunque prefieras La♯);
 *  si no, según tu elección de ♯ o ♭ (N-06, AT-09 #5). */
function escrituraEnPantalla(midi){
  if (screen === 'scales'){
    const i = pcsEscala().indexOf(((midi % 12) + 12) % 12);
    if (i >= 0) return notasEscala()[i];
  }
  if (screen === 'chords'){                     // en Acordes, como lo escribe el acorde (B7: Re♯)
    const e = escrituraEnAcorde(acordeActual(), midi);
    if (e) return e;
  }
  return escrituraPreferida(midi);
}

/** «Do mayor», «la pentatónica menor de La»… */
function nombreEscala(){
  const e = escalaActual();
  return t('scale.name.' + e.id, { t: nombreEscrito(tonicaEscrita(state.scalePc, e.modo)) });
}

/** El guiado (E-06): la escala subiendo una octava desde la tónica más grave
 *  que tiene el mástil. Cada paso es un sonido concreto, con su nota escrita. */
function pasosEscala(){
  const grave = Math.min(...activeTuning());
  const base = grave + ((state.scalePc - grave) % 12 + 12) % 12;
  const e = escalaActual(), notas = notasEscala();
  const pasos = e.semitonos.map((s, i) => ({ midi: base + s, esc: notas[i] }));
  pasos.push({ midi: base + 12, esc: notas[0] });
  return pasos;
}

/** Rellena los selectores de tónica y tipo (la tónica se escribe según el tipo:
 *  Re♭ mayor, pero Do♯ menor). */
function buildScaleSelects(){
  const tipo = document.getElementById('scale-type'), ton = document.getElementById('scale-tonic');
  tipo.innerHTML = '';
  for (const e of ESCALAS){
    const o = document.createElement('option'); o.value = e.id; o.textContent = t('scale.type.' + e.id); tipo.appendChild(o);
  }
  tipo.value = state.scaleId;
  ton.innerHTML = '';
  for (let pc = 0; pc < 12; pc++){
    const o = document.createElement('option'); o.value = String(pc);
    o.textContent = nombreEscrito(tonicaEscrita(pc, escalaActual().modo)); ton.appendChild(o);
  }
  ton.value = String(state.scalePc);
}

/** Pinta todo lo de Escalas: mástil, pentagrama, intervalos y el paso a paso
 *  o el estado de la práctica. Solo actúa en el área de Escalas. */
function renderScales(){
  if (screen !== 'scales') return;
  const practica = state.scaleMode === 'practice';
  document.querySelectorAll('#scale-mode button').forEach(b => {
    const on = b.dataset.v === state.scaleMode;
    b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on));
  });
  document.getElementById('scale-line').hidden = practica;
  document.getElementById('scale-nav').hidden = practica;
  document.getElementById('scale-practice').hidden = !practica;

  // Mástil: casillas de la escala, tónica con anillo, nombres escritos.
  const pcs = pcsEscala(), notas = notasEscala(), pasos = pasosEscala();
  const board = document.getElementById('board');
  board.classList.add('scales');
  board.classList.toggle('practice', practica);
  const pasoMidi = practica ? null : pasos[sc.paso].midi;
  document.querySelectorAll('.fret-cell').forEach(c => {
    const midi = +c.dataset.midi, pc = ((midi % 12) + 12) % 12, i = pcs.indexOf(pc);
    c.classList.toggle('scale', i >= 0);
    c.classList.toggle('scale-tonic', i === 0);
    c.classList.toggle('scale-step', midi === pasoMidi);
    c.querySelector('.dot').textContent = i >= 0 ? nombreEscrito(notas[i]) : noteName(midi);
  });

  // Intervalos (E-04): «Do T Re T Mi ST Fa…».
  const line = document.getElementById('scale-line');
  line.textContent = '';
  const iv = intervalosEscala(escalaActual());
  pasos.forEach((p, i) => {
    const n = document.createElement('span'); n.className = 'sc-note' + (i === sc.paso ? ' now' : '');
    n.textContent = nombreEscrito(p.esc); line.appendChild(n);
    if (i < iv.length){ const g = document.createElement('b'); g.className = 'sc-gap'; g.textContent = iv[i]; line.appendChild(g); }
  });

  // Paso a paso (E-06).
  const p = pasos[sc.paso], total = pasos.length;
  let que;
  if (sc.paso === 0) que = t('scale.stepTonic', { n: nombreEscrito(p.esc) });
  else que = t('scale.stepUp', { n: nombreEscrito(p.esc), d: t('scale.gap.' + iv[sc.paso - 1]), prev: nombreEscrito(pasos[sc.paso - 1].esc) });
  document.getElementById('scale-step-text').textContent = t('scale.step', { i: sc.paso + 1, total }) + ' · ' + que;
  document.getElementById('scale-prev').disabled = sc.paso === 0;
  document.getElementById('scale-next').disabled = sc.paso === total - 1;

  // Práctica (E-05).
  document.getElementById('scale-count').textContent = t('scale.count', { n: sc.encontradas.size, total: pcs.length });
  document.getElementById('scale-msg').textContent = sc.aviso ? t(sc.aviso.clave, sc.aviso.vars()) : t('scale.practiceHint', { e: nombreEscala() });
  document.querySelectorAll('.fret-cell').forEach(c => c.classList.toggle('correct', practica && sc.celdas.has(c.dataset.row + '-' + c.dataset.fret)));

  drawScaleStaff(pasos, practica);
  labelCells();                  // el lector de pantalla también nombra como la escala
  refrescarLector();
}

/** El pentagrama escribe la escala (P-03). En Práctica, solo las notas que ya
 *  has encontrado: si estuvieran todas, sería darte la respuesta. */
function drawScaleStaff(pasos, practica){
  const svg = document.getElementById('staff');
  svg.setAttribute('viewBox', '0 0 340 132');      // la escala necesita todo el ancho
  drawStaffBase(svg, 38, 320);
  const visibles = practica ? pasos.filter((p, i) => i < pasos.length - 1 && sc.encontradas.has(pcEscrita(p.esc))) : pasos;
  const n = visibles.length;
  visibles.forEach((p, i) => {
    const x = 78 + i * (n > 1 ? Math.min(34, 236 / (n - 1)) : 0);
    const ahora = !practica && p === pasos[sc.paso];
    if (ahora) svg.appendChild(el('rect', { x: x - 14, y: STAFF_TOP - 26, width: 28, height: 4 * GAP + 52, rx: 6, fill: 'rgba(232,164,92,.18)' }));
    drawNote(svg, p.midi, x, ahora ? 'var(--amber)' : noteInfo(p.midi).color, false, p.esc);
  });
}

/** ◀ ▶ del paso a paso: suena la nota del paso y se resalta. */
function scaleStep(delta){
  const pasos = pasosEscala();
  sc.paso = Math.max(0, Math.min(pasos.length - 1, sc.paso + delta));
  playMidi(pasos[sc.paso].midi);
  renderScales();
}

/** Práctica: cada nota que tocas, ¿es de la escala? (E-05, solo pertenencia). */
function onScalePress(cell, midi){
  if (screen !== 'scales' || state.scaleMode !== 'practice') return;
  const pc = ((midi % 12) + 12) % 12, i = pcsEscala().indexOf(pc);
  if (i >= 0){
    sc.encontradas.add(pc);
    sc.celdas.add(cell.dataset.row + '-' + cell.dataset.fret);
    // El nombre se calcula al pintar el aviso, no ahora: si cambias Do Re Mi
    // por C D E, el aviso también cambia (AT-09 #6).
    sc.aviso = sc.encontradas.size === pcsEscala().length
      ? { clave: 'scale.allFound', vars: () => ({ e: nombreEscala() }) }
      : { clave: 'scale.yes', vars: () => ({ n: nombreEscrito(notasEscala()[i]), e: nombreEscala() }) };
  } else {
    // Se marca en rojo y, un momento, se enseñan las casillas que sí son.
    marcarUnMomento(cell, 'wrong', 1500);
    sc.aviso = { clave: 'scale.no', vars: () => ({ n: noteName(midi), e: nombreEscala() }) };
    buzz([12, 60, 12]);
    const board = document.getElementById('board');
    board.classList.add('reveal-scale');
    clearTimeout(sc.revelar);
    sc.revelar = setTimeout(() => board.classList.remove('reveal-scale'), 2000);
  }
  renderScales();
}

function resetScalePractice(){
  sc.encontradas.clear(); sc.celdas.clear(); sc.aviso = null;
  clearTimeout(sc.revelar);
  document.getElementById('board').classList.remove('reveal-scale');
  clearMarks(['wrong']);
}

/** Al salir de Escalas, el mástil, el lector y el pentagrama vuelven a ser los
 *  de siempre: el pentagrama ya no enseña la escala (AT-09 #2). */
function leaveScales(){
  const board = document.getElementById('board');
  board.classList.remove('scales', 'practice', 'reveal-scale');
  clearMarks(['scale', 'scale-tonic', 'scale-step', 'correct', 'wrong']);
  refreshNoteNames();
  refrescarLector();
  if (pantallaConPentagramaPropio()) return;   // Acordes dibuja el suyo
  if (lastMidi !== null) showOnStaff(lastMidi, noteInfo(lastMidi).color);
  else clearStaff();
}

function bindScales(){
  buildScaleSelects();
  document.getElementById('scale-type').addEventListener('change', ev => {
    state.scaleId = ev.target.value; save();
    buildScaleSelects();                     // la tónica se escribe según el tipo
    sc.paso = 0; resetScalePractice(); renderScales();
  });
  document.getElementById('scale-tonic').addEventListener('change', ev => {
    state.scalePc = +ev.target.value; save();
    sc.paso = 0; resetScalePractice(); renderScales();
  });
  document.querySelectorAll('#scale-mode button').forEach(b => b.addEventListener('click', () => {
    if (state.scaleMode === b.dataset.v) return;
    state.scaleMode = b.dataset.v; save();
    resetScalePractice(); renderScales();
  }));
  document.getElementById('scale-prev').addEventListener('click', () => scaleStep(-1));
  document.getElementById('scale-next').addEventListener('click', () => scaleStep(1));
  document.getElementById('scale-reset').addEventListener('click', () => { resetScalePractice(); renderScales(); });
}
