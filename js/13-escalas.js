"use strict";

// 13-escalas.js · Escalas (F5.3 y F5.8 #5): una posición cada vez, con sus
// intervalos, el paso a paso, «Escuchar», «Todas» y una Práctica sencilla
// (tocar la posición en orden). La Práctica de antes (pertenencia) se quitó en la 0.6.4.
// Se carga como <script> clásico, en el orden de index.html: lo declarado aquí
// (const, let, function) lo ven los archivos que vienen después.

/* ============================================================
   13. ESCALAS
   ============================================================ */

/* La teoría (qué notas tiene cada escala y cómo se escriben) está en
   01-teoria.js; aquí solo se enseña. Desde la 0.6.4 (F5.8 #5) la escala no
   llena el mástil: se enseña **una posición cada vez**, un trozo de pocos
   trastes donde la mano no se mueve, y se puede escuchar entera. */

const sc = {
  pos: 0,         // posición elegida (índice en posicionesEscala(); la 0 es la de la tónica)
  paso: 0,        // paso del guiado dentro de la posición (E-06)
  sonando: null,  // temporizador de «Escuchar» (null = en silencio)
  todas: false,   // «Todas»: la escala también en el resto del mástil, más apagada (E-10)
  practica: false,// «Practicar»: tocar la posición de grave a agudo (E-05b)
  hechas: 0,      // en Práctica, cuántas notas de la posición llevas en orden
  fallo: null     // en Práctica, la casilla del último fallo (para el aviso)
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

/** Las posiciones de la escala (E-07). Cada una empieza en una nota de la
 *  escala sobre la 6.ª cuerda y va subiendo nota a nota: 3 notas en cada
 *  cuerda en la mayor y la menor (7 posiciones) y 2 en las pentatónicas (las 5
 *  «cajas» de siempre). Se calcula con alturas, no con dibujos aprendidos de
 *  memoria, así que vale en cualquier afinación.
 *  Devuelve listas de notas { cuerda (0 = la 6.ª), traste, midi, grado (0 =
 *  tónica) }. La primera es la que empieza en la tónica, como en los libros
 *  (tu decisión del 15/11); las siguientes van hacia el cuerpo de la guitarra
 *  y, al pasar del traste 11, siguen desde la cejuela. */
function posicionesEscala(){
  const afin = activeTuning(), e = escalaActual();
  const porCuerda = e.semitonos.length >= 7 ? 3 : 2;
  const grave = afin[0];
  // Todas las alturas de la escala, de la más grave a la más aguda del mástil.
  const alturas = [];
  for (let m = grave; m <= Math.max(...afin) + NUM_FRETS; m++){
    const g = e.semitonos.indexOf(((m - state.scalePc) % 12 + 12) % 12);
    if (g >= 0) alturas.push({ midi: m, grado: g });
  }
  const posiciones = e.semitonos.map((_, g) => {
    // Empieza en el grado g, lo más cerca de la cejuela (trastes 0 a 11).
    let i = alturas.findIndex(a => a.grado === g);
    const notas = [];
    for (let c = 0; c < afin.length && i < alturas.length; c++){
      let enEsta = 0;
      while (i < alturas.length){
        const a = alturas[i], siguiente = afin[c + 1];
        // Pasa a la cuerda siguiente al llegar a las de cada cuerda… salvo que
        // la nota no exista allí (más grave que la cuerda al aire: pasa con
        // afinaciones como Drop D, donde las dos graves están más separadas).
        if (enEsta >= porCuerda && c < afin.length - 1 && a.midi >= siguiente) break;
        if (enEsta >= porCuerda && c === afin.length - 1) break;
        // Con una afinación personalizada muy abierta, la nota podría quedar más
        // allá del último traste: entonces se pasa a la cuerda siguiente (AT-16 #4).
        if (a.midi - afin[c] > NUM_FRETS){ if (c < afin.length - 1) break; i = alturas.length; break; }
        notas.push({ cuerda: c, traste: a.midi - afin[c], midi: a.midi, grado: a.grado });
        enEsta++; i++;
      }
    }
    return notas.filter(n => n.traste >= 0 && n.traste <= NUM_FRETS);
  });
  posiciones.sort((a, b) => a[0].traste - b[0].traste);         // de la cejuela al cuerpo…
  const t0 = Math.max(0, posiciones.findIndex(p => p[0].grado === 0));
  return posiciones.slice(t0).concat(posiciones.slice(0, t0));    // …empezando por la de la tónica
}

/** La posición que se enseña: la elegida (al llegar, la 1, la de la tónica). */
function posicionActual(){
  const todas = posicionesEscala();
  if (sc.pos >= todas.length) sc.pos = 0;
  return todas[sc.pos];
}

/** El guiado (E-06): las notas de la posición, de la más grave a la más aguda.
 *  Cada paso es un sonido concreto en una casilla concreta, con su nota escrita. */
function pasosEscala(){
  const notas = notasEscala(), filas = activeTuning().length;
  return posicionActual().map(n => ({ midi: n.midi, esc: notas[n.grado], grado: n.grado,
    celda: (filas - 1 - n.cuerda) + '-' + n.traste }));     // fila 0 = la cuerda de arriba, la aguda
}

/** Escribe un texto en versión larga y corta; el CSS decide cuál se ve
 *  (la corta, en el móvil). El lector de pantalla lee la larga. Si no cambia,
 *  no se toca: así una zona `aria-live` no se anuncia en cada repintado (AT-16 #1). */
function conLargoYCorto(nodo, largo, corto){
  if (nodo.dataset.txt === largo + '|' + corto) return;
  nodo.dataset.txt = largo + '|' + corto;
  nodo.textContent = '';
  const l = document.createElement('span'); l.className = 'sc-long'; l.textContent = largo;
  const c = document.createElement('span'); c.className = 'sc-short'; c.textContent = corto;
  c.setAttribute('aria-hidden', 'true');
  nodo.appendChild(l); nodo.appendChild(c);
}

/** Intervalo entre dos sonidos seguidos de la escala, como texto: «un tono»,
 *  «un semitono», «un tono y medio». Con una afinación personalizada rara
 *  podría haber otro salto: entonces se dicen los semitonos (AT-16 #4). */
function textoSalto(semitonos){
  const k = { 1: 'ST', 2: 'T', 3: 'T½' }[semitonos];
  return k ? t('scale.gap.' + k) : t('scale.gapN', { n: semitonos });
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

/** Pinta todo lo de Escalas: posición, mástil, pentagrama, intervalos y paso a
 *  paso (o la práctica). Solo actúa en el área de Escalas. */
function renderScales(){
  if (screen !== 'scales') return;
  const todas = posicionesEscala(), pos = posicionActual(), pasos = pasosEscala();
  sc.paso = Math.min(sc.paso, pasos.length - 1);
  sc.hechas = Math.min(sc.hechas, pasos.length);
  const practica = sc.practica, total = pasos.length;

  // Posición: «Posición 1 de 7 · trastes 8 a 13» (en el móvil, «1/7»).
  const trastes = pos.map(n => n.traste);
  const v = { i: sc.pos + 1, total: todas.length, a: Math.min(...trastes), b: Math.max(...trastes) };
  conLargoYCorto(document.getElementById('scale-pos'), t('scale.pos', v), t('scale.posShort', v));
  document.getElementById('scale-pos-prev').disabled = sc.pos === 0;
  document.getElementById('scale-pos-next').disabled = sc.pos === todas.length - 1;
  // «Escuchar»: una sola señal para el lector, «pulsado» mientras suena (AT-16 #6).
  const play = document.getElementById('scale-play');
  conLargoYCorto(play, t(sc.sonando ? 'scale.stop' : 'scale.play'), sc.sonando ? '■' : '♪');
  play.setAttribute('aria-label', t('scale.playLabel'));
  play.setAttribute('aria-pressed', String(!!sc.sonando));
  play.classList.toggle('on', !!sc.sonando);                  // naranja mientras suena
  for (const [id, on] of [['qb-scale-all', sc.todas], ['qb-scale-practice', practica]]){
    const b = document.getElementById(id);
    b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on));
  }

  // Mástil: las casillas de la posición, con su nombre escrito y la tónica con
  // anillo; el paso del guiado, resaltado. Con «Todas», el resto de la escala,
  // más apagado. En Práctica, las de la posición sin nombre hasta que las tocas.
  const notas = notasEscala(), pcs = pcsEscala();
  const enPos = new Map(pasos.map((p, k) => [p.celda, k]));
  const pasoCelda = (!practica || sc.sonando) ? pasos[sc.paso].celda : null;
  const board = document.getElementById('board');
  board.classList.add('scales');
  board.classList.toggle('practice', practica);
  document.querySelectorAll('.fret-cell').forEach(c => {
    const clave = c.dataset.row + '-' + c.dataset.fret, k = enPos.get(clave);
    const midi = +c.dataset.midi, i = pcs.indexOf(((midi % 12) + 12) % 12);
    const en = k !== undefined;
    c.classList.toggle('scale', en);
    c.classList.toggle('scale-all', !en && sc.todas && i >= 0);
    c.classList.toggle('scale-tonic', i === 0 && (en || sc.todas));
    c.classList.toggle('scale-step', clave === pasoCelda);
    c.classList.toggle('correct', practica && en && k < sc.hechas);
    c.querySelector('.dot').textContent = i >= 0 ? nombreEscrito(notas[i]) : noteName(midi);
  });

  // Intervalos (E-04): la escala de tónica a tónica, «Do T Re T Mi ST Fa…»,
  // con el grado del paso actual (o de la última nota acertada) resaltado.
  const ultimo = practica ? sc.hechas - 1 : sc.paso;
  const line = document.getElementById('scale-line');
  line.textContent = '';
  const iv = intervalosEscala(escalaActual()), gradoAhora = ultimo >= 0 ? pasos[ultimo].grado : -1;
  notas.concat([notas[0]]).forEach((n, i) => {
    const s = document.createElement('span'); s.className = 'sc-note' + (i === gradoAhora ? ' now' : '');
    s.textContent = nombreEscrito(n); line.appendChild(s);
    if (i < iv.length){ const g = document.createElement('b'); g.className = 'sc-gap'; g.textContent = iv[i]; line.appendChild(g); }
  });

  // Paso a paso (E-06) o, en Práctica, cómo vas (E-05b).
  let texto;
  if (practica && !sc.sonando){
    if (sc.hechas === total) texto = t('scale.pr.done', { p: sc.pos + 1, e: nombreEscala() });
    else if (sc.fallo) texto = t(sc.fallo, { i: sc.hechas + 1, total });
    else if (sc.hechas === 0) texto = t('scale.pr.start');
    else texto = t('scale.pr.next', { i: sc.hechas + 1, total });
  } else {
    const p = pasos[sc.paso];
    let que;
    if (sc.paso === 0) que = t(p.grado === 0 ? 'scale.stepTonic' : 'scale.stepFirst', { n: nombreEscrito(p.esc) });
    else {
      const ant = pasos[sc.paso - 1];
      que = t(p.grado === 0 ? 'scale.stepUpTonic' : 'scale.stepUp', { n: nombreEscrito(p.esc),
        d: textoSalto(p.midi - ant.midi), prev: nombreEscrito(ant.esc) });
    }
    texto = t('scale.step', { i: sc.paso + 1, total }) + ' · ' + que;
  }
  document.getElementById('scale-step-text').textContent = texto;
  document.getElementById('scale-prev').disabled = practica || sc.paso === 0;
  document.getElementById('scale-next').disabled = practica || sc.paso === total - 1;

  drawScaleStaff(pasos, practica && !sc.sonando ? sc.hechas : null);
  labelCells();                  // el lector de pantalla también nombra como la escala
  refrescarLector();
}

/** El pentagrama escribe la posición (P-03): como no caben sus 12 o 18 notas,
 *  enseña 8 seguidas alrededor del paso actual, que va resaltado. En Práctica,
 *  solo las que ya has tocado (`hechas`): si no, sería darte la respuesta. */
function drawScaleStaff(pasos, hechas){
  const svg = document.getElementById('staff');
  svg.setAttribute('viewBox', '0 0 340 132');      // la escala necesita todo el ancho
  drawStaffBase(svg, 38, 320);
  const lista = hechas === null ? pasos : pasos.slice(0, hechas);
  const foco = hechas === null ? sc.paso : hechas - 1;
  const desde = Math.max(0, Math.min(foco - 3, lista.length - 8));
  const visibles = lista.slice(desde, desde + 8), n = visibles.length;
  visibles.forEach((p, i) => {
    const x = 78 + i * (n > 1 ? Math.min(34, 236 / (n - 1)) : 0);
    const ahora = p === lista[foco];
    if (ahora) svg.appendChild(el('rect', { x: x - 14, y: STAFF_TOP - 26, width: 28, height: 4 * GAP + 52, rx: 6, fill: 'rgba(232,164,92,.18)' }));
    drawNote(svg, p.midi, x, ahora ? 'var(--amber)' : noteInfo(p.midi).color, false, p.esc);
  });
}

/** Lleva la vista del mástil a los trastes de la posición. */
function verTrastesPosicion(){
  if (screen !== 'scales') return;
  const scroll = document.getElementById('board-scroll');
  const fw = parseFloat(getComputedStyle(document.getElementById('board')).getPropertyValue('--fret-w')) || 0;
  if (!fw || !scroll.clientWidth) return;
  const trastes = posicionActual().map(n => n.traste);
  const lo = Math.min(...trastes), hi = Math.max(...trastes);
  const visible = scroll.clientWidth - LABEL_W;
  scroll.scrollLeft = NUT_W + hi * fw <= visible ? 0 : NUT_W + Math.max(0, lo - 1) * fw;
}

/** ◀ ▶ del paso a paso: suena la nota del paso y se resalta. */
function scaleStep(delta){
  pararEscala();
  const pasos = pasosEscala();
  sc.paso = Math.max(0, Math.min(pasos.length - 1, sc.paso + delta));
  playMidi(pasos[sc.paso].midi);
  renderScales();
  fococontrario('scale-prev', 'scale-next', delta);
}

/** ◀ ▶ de la posición: la anterior o la siguiente (la 1 es la de la tónica). */
function cambiarPosicion(delta){
  pararEscala();
  const total = posicionesEscala().length;
  sc.pos = Math.max(0, Math.min(total - 1, sc.pos + delta));
  sc.paso = 0; empezarPractica();
  renderScales();
  verTrastesPosicion();
  fococontrario('scale-pos-prev', 'scale-pos-next', delta);
}

/** Si ◀ o ▶ se desactiva al llegar al extremo, el foco del teclado pasa al
 *  otro, en vez de perderse (AT-16 #6). */
function fococontrario(idPrev, idNext, delta){
  const yo = document.getElementById(delta < 0 ? idPrev : idNext);
  if (yo.disabled && document.activeElement === yo) document.getElementById(delta < 0 ? idNext : idPrev).focus();
}

/** «Escuchar»: la posición entera, subiendo y bajando, con cada nota resaltada
 *  (tu comentario #5: ir escuchando la propia escala). Otro toque la para. */
let PAUSA_ESCALA = 380;   // ms entre nota y nota (tu decisión del 15/11: fijo). Es `let` para que el banco lo acorte.
function escucharEscala(){
  if (sc.sonando){ pararEscala(); renderScales(); return; }
  const n = pasosEscala().length;
  const orden = [...Array(n).keys()];
  orden.push(...orden.slice(0, -1).reverse());      // sube y vuelve a bajar, sin repetir la de arriba
  let k = 0;
  const siguiente = () => {
    try {
      if (k >= orden.length || screen !== 'scales'){ pararEscala(); renderScales(); return; }
      sc.paso = orden[k++];
      playMidi(pasosEscala()[sc.paso].midi);
      renderScales();
      sc.sonando = setTimeout(siguiente, PAUSA_ESCALA);
    } catch (e){                                    // que un fallo no deje el botón en «Parar» (AT-16 #8)
      console.error(e); pararEscala(); renderScales();
    }
  };
  sc.sonando = -1;                                  // ya suena (antes del primer temporizador)
  siguiente();
}

function pararEscala(){
  if (sc.sonando !== null && sc.sonando !== -1) clearTimeout(sc.sonando);
  sc.sonando = null;
}

/** La práctica empieza de nuevo: ninguna nota hecha. */
function empezarPractica(){ sc.hechas = 0; sc.fallo = null; }

/** Tocar una casilla. Sin Práctica (E-09): si es de la posición, pasa a ser el
 *  paso actual (el texto, los intervalos y el pentagrama la siguen); las de
 *  fuera solo suenan. En Práctica (E-05b): hay que tocar la posición en orden,
 *  de grave a agudo; la buena se queda en verde con su nombre y una que no toca
 *  se marca en rojo un momento. */
function onScalePress(cell){
  if (screen !== 'scales') return;
  const pasos = pasosEscala(), clave = cell.dataset.row + '-' + cell.dataset.fret;
  const i = pasos.findIndex(p => p.celda === clave);
  if (!sc.practica){
    if (i < 0) return;
    pararEscala();
    sc.paso = i;
    renderScales();
    return;
  }
  pararEscala();
  if (sc.hechas === pasos.length){                 // completa: tocar la primera vuelve a empezar
    if (i !== 0){ renderScales(); return; }
    empezarPractica();
  }
  if (i === sc.hechas){
    sc.hechas++; sc.paso = i; sc.fallo = null;
  } else {
    marcarUnMomento(cell, 'wrong', 1200);
    buzz([12, 60, 12]);
    sc.fallo = +cell.dataset.midi === pasos[sc.hechas].midi ? 'scale.pr.otherString' : 'scale.pr.no';
  }
  renderScales();
}

/** «Todas» (E-10): la escala también en el resto del mástil, más apagada. */
function alternarTodas(){ sc.todas = !sc.todas; renderScales(); }

/** «Practicar» (E-05b): entra o sale de la práctica, siempre desde el principio. */
function alternarPractica(){
  pararEscala();
  sc.practica = !sc.practica; sc.paso = 0; empezarPractica();
  clearMarks(['wrong']);
  renderScales();
}

/** Otra escala, otra afinación o Restablecer: vuelve a la posición 1, la de la tónica. */
function reiniciarEscala(){
  pararEscala();
  sc.pos = 0; sc.paso = 0; empezarPractica();
}

/** Al salir de Escalas, el mástil, el lector y el pentagrama vuelven a ser los
 *  de siempre: el pentagrama ya no enseña la escala (AT-09 #2). */
function leaveScales(){
  pararEscala();
  const board = document.getElementById('board');
  board.classList.remove('scales', 'practice');
  clearMarks(['scale', 'scale-all', 'scale-tonic', 'scale-step', 'correct', 'wrong']);
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
    reiniciarEscala(); renderScales(); verTrastesPosicion();
  });
  document.getElementById('scale-tonic').addEventListener('change', ev => {
    state.scalePc = +ev.target.value; save();
    reiniciarEscala(); renderScales(); verTrastesPosicion();
  });
  document.getElementById('scale-pos-prev').addEventListener('click', () => cambiarPosicion(-1));
  document.getElementById('scale-pos-next').addEventListener('click', () => cambiarPosicion(1));
  document.getElementById('scale-play').addEventListener('click', escucharEscala);
  document.getElementById('scale-prev').addEventListener('click', () => scaleStep(-1));
  document.getElementById('scale-next').addEventListener('click', () => scaleStep(1));
  document.getElementById('qb-scale-all').addEventListener('click', alternarTodas);
  document.getElementById('qb-scale-practice').addEventListener('click', alternarPractica);
}
