"use strict";

// 15-acordes.js · Librería de acordes (F5.7; simplificada en F5.8 #6): se elige
// con dos filas de botones, la nota y el tipo, y el acorde se dibuja en grande en
// los primeros trastes del mástil, con el número y el color de cada dedo.
// Se carga como <script> clásico, en el orden de index.html: lo declarado aquí
// (const, let, function) lo ven los archivos que vienen después.

/* ============================================================
   15. ACORDES
   ============================================================ */

/* Tipos de acorde: cada nota es [semitonos sobre la raíz, letras sobre la raíz].
   Las letras dicen cómo se escribe: la tercera de Si es Re♯ (dos letras más
   arriba), no Mi♭. Es la misma idea de las escalas (F5.1). */
const TIPOS_ACORDE = {
  '':     [[0,0], [4,2], [7,4]],               // mayor
  'm':    [[0,0], [3,2], [7,4]],               // menor
  '7':    [[0,0], [4,2], [7,4], [10,6]],       // séptima (de dominante)
  'm7':   [[0,0], [3,2], [7,4], [10,6]],       // menor séptima
  'maj7': [[0,0], [4,2], [7,4], [11,6]],       // séptima mayor
  'sus4': [[0,0], [5,3], [7,4]]                // cuarta suspendida
};

/* El catálogo (AC-01): los 30 más habituales en canciones, en afinación
   estándar. `t` son los trastes de la 6ª a la 1ª cuerda (x = no suena,
   0 = al aire); `d`, el dedo de cada una (1 índice, 2 medio, 3 anular,
   4 meñique; - ninguno); `c`, la cejilla: [traste, de la cuerda, a la cuerda].
   `raiz` es la letra (0 = Do … 6 = Si); `bajo`, la letra del bajo si no es la raíz. */
const ACORDES = [
  { raiz:0, tipo:'',     t:'x32010', d:'-32-1-' },
  { raiz:0, tipo:'m',    t:'x35543', d:'-13421', c:[3,5,1] },
  { raiz:0, tipo:'7',    t:'x32310', d:'-3241-' },
  { raiz:0, tipo:'maj7', t:'x32000', d:'-32---' },
  { raiz:0, tipo:'',     t:'332010', d:'342-1-', bajo:4 },        // C/G
  { raiz:1, tipo:'',     t:'xx0232', d:'---132' },
  { raiz:1, tipo:'m',    t:'xx0231', d:'---231' },
  { raiz:1, tipo:'7',    t:'xx0212', d:'---213' },
  { raiz:1, tipo:'m7',   t:'xx0211', d:'---211', c:[1,2,1] },
  { raiz:1, tipo:'maj7', t:'xx0222', d:'---123' },
  { raiz:1, tipo:'sus4', t:'xx0233', d:'---134' },
  { raiz:2, tipo:'',     t:'022100', d:'-231--' },
  { raiz:2, tipo:'m',    t:'022000', d:'-23---' },
  { raiz:2, tipo:'7',    t:'020100', d:'-2-1--' },
  { raiz:2, tipo:'m7',   t:'020000', d:'-2----' },
  { raiz:3, tipo:'',     t:'133211', d:'134211', c:[1,6,1] },
  { raiz:3, tipo:'m',    t:'133111', d:'134111', c:[1,6,1] },
  { raiz:3, tipo:'maj7', t:'xx3210', d:'--321-' },
  { raiz:4, tipo:'',     t:'320003', d:'21---3' },
  { raiz:4, tipo:'m',    t:'355333', d:'134111', c:[3,6,1] },
  { raiz:4, tipo:'7',    t:'320001', d:'32---1' },
  { raiz:4, tipo:'',     t:'x20003', d:'-1---3', bajo:6 },        // G/B
  { raiz:5, tipo:'',     t:'x02220', d:'--123-' },
  { raiz:5, tipo:'m',    t:'x02210', d:'--231-' },
  { raiz:5, tipo:'7',    t:'x02020', d:'--2-3-' },
  { raiz:5, tipo:'m7',   t:'x02010', d:'--2-1-' },
  { raiz:6, tipo:'',     t:'x24442', d:'-12341', c:[2,5,1] },
  { raiz:6, tipo:'m',    t:'x24432', d:'-13421', c:[2,5,1] },
  { raiz:6, tipo:'7',    t:'x21202', d:'-213-4' },
  { raiz:6, tipo:'m7',   t:'x24232', d:'-13121', c:[2,5,1] }
];
/** Los tipos, en el orden de sus botones (AC-01). '/' es «con otra nota en el
 *  bajo»: Do/Sol y Sol/Si. */
const TIPOS_BOTON = ['', 'm', '7', 'm7', 'maj7', 'sus4', '/'];
/** Trastes que enseña el mástil en Acordes (AC-07): del 0 al 5, donde caben
 *  todas las digitaciones del catálogo (la más alta, Do menor, llega al 5). */
const TRASTES_ACORDE = 5;
const AFINACION_ESTANDAR = [40, 45, 50, 55, 59, 64];      // de la 6ª a la 1ª

/** Nombre del acorde: «Am», «G/B»… o «Lam», «Sol/Si». */
function nombreAcorde(a, notacion){
  const L = (notacion || state.notation) === 'latin' ? LETRAS_LATIN : LETRAS_ANGLO;
  return L[a.raiz] + a.tipo + (a.bajo !== undefined ? '/' + L[a.bajo] : '');
}
/** Identificador estable (en notación inglesa): «Am», «G/B». */
const idAcorde = a => nombreAcorde(a, 'anglo');
const acordePorId = id => ACORDES.find(a => idAcorde(a) === id);

/** Cada cuerda: { cuerda (6…1), traste (null si no suena), dedo, midi }. */
function cuerdasAcorde(a){
  return [...a.t].map((ch, i) => {
    const traste = ch === 'x' ? null : +ch, dedo = a.d[i] === '-' ? 0 : +a.d[i];
    return { cuerda: 6 - i, traste, dedo, midi: traste === null ? null : AFINACION_ESTANDAR[i] + traste };
  });
}

/** Las notas del acorde, escritas como manda (B7: Si, Re♯, Fa♯, La). */
function notasAcorde(a){
  const raizPc = PC_LETRA[a.raiz];
  return TIPOS_ACORDE[a.tipo].map(([semis, letras]) => escribir((raizPc + semis) % 12, (a.raiz + letras) % 7));
}
/** Cómo se escribe, dentro del acorde, una nota que suena (o null si no es suya). */
function escrituraEnAcorde(a, midi){
  const pc = ((midi % 12) + 12) % 12;
  return notasAcorde(a).find(n => pcEscrita(n) === pc) || null;
}

/** El tipo de un acorde, tal como lo dicen los botones: '/' si lleva otro bajo. */
const tipoDe = a => a.bajo !== undefined ? '/' : a.tipo;
/** El acorde de esa nota (0 = Do … 6 = Si) y ese tipo, o undefined si no está
 *  en el catálogo (no hay Fa7, por ejemplo: su botón se apaga). */
const acordeDe = (raiz, tipo) => ACORDES.find(a => a.raiz === raiz && tipoDe(a) === tipo);

const cr = { strum: [] };   // temporizadores del rasgueo en marcha

function acordeActual(){ return acordePorId(state.chordId) || ACORDES[0]; }
const afinacionEstandar = () => activeTuning().every((m, i) => m === AFINACION_ESTANDAR[i]);

/** Rasguea el acorde de grave a agudo, 35 ms entre cuerdas (AC-04). */
function strumChord(a){
  cr.strum.forEach(clearTimeout); cr.strum = [];
  cuerdasAcorde(a).filter(c => c.midi !== null).forEach((c, i) => {
    cr.strum.push(setTimeout(() => playMidi(c.midi, 2.4), i * 35));
  });
}

/* --- El selector: la nota y el tipo (AC-01) ---
   Dos filas de botones en lugar de un listado de 30 con buscador (F5.8 #6:
   «parece confuso y engorroso»). Cada botón dice si está pulsado (aria-pressed),
   y los tipos que no existen para esa nota se apagan (disabled). */

function etiquetaTipo(tipo){
  if (tipo === '') return t('chord.major');
  if (tipo === 'm') return t('chord.minor');
  if (tipo === '/') return t('chord.bass');
  return tipo;                                   // 7, m7, maj7 y sus4 se dicen igual en todas partes
}
function botonSelector(texto, alPulsar){
  const b = document.createElement('button');
  b.className = 'chord-chip';
  b.textContent = texto;
  b.addEventListener('click', alPulsar);
  return b;
}
/** Crea los botones; se rehacen al cambiar la nomenclatura o el idioma. */
function buildChordPicker(){
  const L = state.notation === 'latin' ? LETRAS_LATIN : LETRAS_ANGLO;
  const raices = document.getElementById('chord-roots');
  const tipos = document.getElementById('chord-types');
  raices.innerHTML = ''; tipos.innerHTML = '';
  L.forEach((letra, raiz) => {
    const b = botonSelector(letra, () => elegirRaiz(raiz));
    b.dataset.raiz = String(raiz);
    raices.appendChild(b);
  });
  TIPOS_BOTON.forEach(tipo => {
    const b = botonSelector(etiquetaTipo(tipo), () => elegirTipo(tipo));
    b.dataset.tipo = tipo;
    if (tipo === '/') b.setAttribute('aria-label', t('chord.bassAria'));
    tipos.appendChild(b);
  });
  marcarSeleccion();
}
function marcarSeleccion(){
  const a = acordeActual();
  document.querySelectorAll('#chord-roots .chord-chip').forEach(b => {
    const on = +b.dataset.raiz === a.raiz;
    b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on));
  });
  document.querySelectorAll('#chord-types .chord-chip').forEach(b => {
    const on = b.dataset.tipo === tipoDe(a);
    b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on));
    b.disabled = !acordeDe(a.raiz, b.dataset.tipo);
  });
}
/** Otra nota: se queda el tipo si existe (de Lam a Mim); si no, el mayor. */
function elegirRaiz(raiz){
  const nuevo = acordeDe(raiz, tipoDe(acordeActual())) || acordeDe(raiz, '');
  selectChord(idAcorde(nuevo), true);
}
function elegirTipo(tipo){
  const nuevo = acordeDe(acordeActual().raiz, tipo);
  if (nuevo) selectChord(idAcorde(nuevo), true);
}

function selectChord(id, sonar){
  if (!acordePorId(id)) return;
  state.chordId = id;
  save();
  marcarSeleccion();
  renderChords();
  if (sonar && afinacionEstandar()) strumChord(acordeActual());
}

/* --- El acorde en el mástil (AC-02) --- */

/** Quita dedos, cejilla y marcas de cuerda del mástil. */
function limpiarAcorde(){
  document.querySelectorAll('#board .finger').forEach(f => f.remove());
  document.querySelectorAll('#board .fret-cell.barre, #board .fret-cell.chord-tone').forEach(c =>
    c.classList.remove('barre', 'barre-top', 'barre-bottom', 'chord-tone'));
  document.querySelectorAll('#board .string-label').forEach(l => {
    delete l.dataset.mark; l.removeAttribute('aria-label');
  });
}

function renderChords(){
  if (screen !== 'chords') return;
  const a = acordeActual();
  const estandar = afinacionEstandar();
  limpiarAcorde();
  document.getElementById('board').classList.add('chords');
  document.getElementById('chord-tuning').hidden = estandar;
  document.getElementById('chord-play').disabled = !estandar;
  // Nombre y notas, escritas como manda el acorde.
  document.getElementById('chord-name').textContent = nombreAcorde(a);
  document.getElementById('chord-notes').textContent = notasAcorde(a).map(nombreEscrito).join(' · ');
  marcarSeleccion();
  if (!estandar){ clearStaff(); labelCells(); return; }   // con otra afinación, el dibujo mentiría (AC-05)

  const filas = displayStrings();
  const [cejTraste, cejDe, cejA] = a.c || [];
  for (const c of cuerdasAcorde(a)){
    const fila = filas.findIndex(s => s.number === c.cuerda);
    // Al aire (○) o que no suena (✕), junto al nombre de la cuerda: siempre a la vista.
    const label = document.querySelectorAll('#board .string-label')[fila];
    if (label && (c.traste === null || c.traste === 0)){
      label.dataset.mark = c.traste === null ? '✕' : '○';
      label.setAttribute('aria-label', t('chord.stringAria', { o: ord(c.cuerda), e: t(c.traste === null ? 'chord.muted' : 'chord.open') }));
    }
    if (!c.traste) continue;
    const cell = cellAt(fila, c.traste);
    if (!cell) continue;
    cell.classList.add('chord-tone');
    const f = document.createElement('span');
    f.className = 'finger f' + c.dedo;
    f.setAttribute('aria-hidden', 'true');
    f.textContent = String(c.dedo);
    cell.appendChild(f);
  }
  // La cejilla: una barra que une todas las cuerdas que pisa el índice, también
  // las que otro dedo pisa más arriba (en Fa, la 5ª, la 4ª y la 3ª).
  if (cejTraste){
    for (let cuerda = cejA; cuerda <= cejDe; cuerda++){
      const cell = cellAt(filas.findIndex(s => s.number === cuerda), cejTraste);
      if (!cell) continue;
      cell.classList.add('barre');
      cell.classList.toggle('barre-top', cuerda === cejA);          // la 1ª cuerda va arriba
      cell.classList.toggle('barre-bottom', cuerda === cejDe);
    }
  }
  labelCells();
  clearStaff();          // en Acordes el pentagrama no se ve: manda el dibujo (F5.8 #6)
}

function leaveChords(){
  cr.strum.forEach(clearTimeout); cr.strum = [];
  document.getElementById('board').classList.remove('chords');
  limpiarAcorde();
}

function bindChords(){
  document.getElementById('chord-play').addEventListener('click', () => strumChord(acordeActual()));
  document.getElementById('chord-standard').addEventListener('click', () => {
    setTuning('standard');
  });
  buildChordPicker();
}

/** Nomenclatura o idioma cambiados: los nombres del listado, otra vez. */
function refreshChords(){
  buildChordPicker();
  renderChords();
}
