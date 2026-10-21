"use strict";

// 15-acordes.js · Librería de acordes (F5.7, AC-01 a AC-06): un listado con
// buscador a un lado y, al otro, el acorde dibujado en el mástil, con el número
// y el color de cada dedo.
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
/** Los más tocados, arriba del listado (tu petición del 21/10). */
const ACORDES_POPULARES = ['C', 'G', 'D', 'A', 'E', 'Am', 'Em', 'Dm', 'F'];
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

/* --- Buscador (AC-06) ---
   «G» deja los acordes que empiezan por G: G, G7, G/B… Vale en las dos
   nomenclaturas: «Sol» encuentra lo mismo. Una sola letra solo se busca en la
   inglesa, para que «D» no traiga también los Do. # y b valen por ♯ y ♭. */
function normalizarBusqueda(q){
  return String(q || '').trim().replace(/\s+/g, '').replace(/#/g, '♯')
    .replace(/^([A-Ga-g])b/, '$1♭').toLowerCase();
}
function filtrarAcordes(q){
  const n = normalizarBusqueda(q);
  if (!n) return ACORDES.slice();
  return ACORDES.filter(a => nombreAcorde(a, 'anglo').toLowerCase().startsWith(n) ||
    (n.length >= 2 && nombreAcorde(a, 'latin').toLowerCase().startsWith(n)));
}

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

/* --- Listado --- */

function chipAcorde(a){
  const b = document.createElement('button');
  b.className = 'chord-chip';
  b.dataset.id = idAcorde(a);
  b.textContent = nombreAcorde(a);
  b.addEventListener('click', () => selectChord(idAcorde(a), true));
  return b;
}
function seccionAcordes(box, titulo, lista){
  const h = document.createElement('div'); h.className = 'cl-head'; h.textContent = titulo;
  const g = document.createElement('div'); g.className = 'cl-group';
  lista.forEach(a => g.appendChild(chipAcorde(a)));
  box.appendChild(h); box.appendChild(g);
}
function buildChordList(){
  const box = document.getElementById('chord-list');
  const q = document.getElementById('chord-search').value;
  box.innerHTML = '';
  const hallados = filtrarAcordes(q);
  if (!normalizarBusqueda(q)){
    seccionAcordes(box, t('chord.popular'), ACORDES_POPULARES.map(acordePorId));
    seccionAcordes(box, t('chord.all', { n: ACORDES.length }), ACORDES);
  } else if (hallados.length){
    seccionAcordes(box, t('chord.results', { n: hallados.length }), hallados);
  } else {
    const p = document.createElement('p'); p.className = 'cl-empty';
    p.textContent = t('chord.none', { q: q.trim() });
    box.appendChild(p);
  }
  marcarSeleccion();
}
function marcarSeleccion(){
  document.querySelectorAll('#chord-list .chord-chip').forEach(b => {
    const on = b.dataset.id === state.chordId;
    b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on));
  });
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

/** Lleva la vista del mástil a los trastes del acorde. */
function verTrastesAcorde(a){
  const scroll = document.getElementById('board-scroll');
  const fw = parseFloat(getComputedStyle(document.getElementById('board')).getPropertyValue('--fret-w')) || 0;
  if (!fw || !scroll.clientWidth) return;
  const trastes = cuerdasAcorde(a).map(c => c.traste).filter(f => f);
  const lo = Math.min(...trastes), hi = Math.max(...trastes);
  const visible = scroll.clientWidth - LABEL_W;
  scroll.scrollLeft = NUT_W + hi * fw <= visible ? 0 : NUT_W + (lo - 1) * fw;
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
  drawChordStaff(a);
  requestAnimationFrame(() => verTrastesAcorde(a));
}

/** El pentagrama escribe el acorde con sus notas apiladas (AC-03). Dos notas
 *  a un paso de distancia no caben una encima de otra: la de arriba va a la derecha. */
function drawChordStaff(a){
  const svg = document.getElementById('staff');
  svg.setAttribute('viewBox', STAFF_CORTO);
  drawStaffBase(svg, 38, 166);
  const notas = cuerdasAcorde(a).filter(c => c.midi !== null).map(c => ({ midi: c.midi, esc: escrituraEnAcorde(a, c.midi) }));
  let anteriorY = null, desplazada = false;
  notas.forEach(n => {
    const y = staffYEscrita(n.esc, n.midi);
    desplazada = anteriorY !== null && Math.abs(anteriorY - y) < GAP * 0.75 && !desplazada;
    drawNote(svg, n.midi, desplazada ? 124 : 108, 'var(--text)', false, n.esc);
    anteriorY = y;
  });
}

function leaveChords(){
  cr.strum.forEach(clearTimeout); cr.strum = [];
  document.getElementById('board').classList.remove('chords');
  limpiarAcorde();
}

function bindChords(){
  const q = document.getElementById('chord-search');
  q.addEventListener('input', buildChordList);
  document.getElementById('chord-play').addEventListener('click', () => strumChord(acordeActual()));
  document.getElementById('chord-standard').addEventListener('click', () => {
    setTuning('standard');
  });
  buildChordList();
}

/** Nomenclatura o idioma cambiados: los nombres del listado, otra vez. */
function refreshChords(){
  buildChordList();
  renderChords();
}
