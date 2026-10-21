"use strict";

// 14-metronomo.js · Metrónomo (F5.6, MT-01 a MT-05): tempo, compás, figura y
// acento, con los golpes programados en el reloj de audio.
// Se carga como <script> clásico, en el orden de index.html: lo declarado aquí
// (const, let, function) lo ven los archivos que vienen después.

/* ============================================================
   14. METRÓNOMO
   ============================================================ */

/* Por qué el reloj de audio (MT-04). Un setInterval de JavaScript se retrasa
   unos milisegundos cada vez que el navegador está ocupado, y esos retrasos se
   oyen: el pulso «se arrastra». La tarjeta de sonido, en cambio, tiene su propio
   reloj (audioCtx.currentTime), exacto. Así que un temporizador normal se
   despierta cada 25 ms solo para *programar* los golpes de los próximos 100 ms
   en ese reloj; aunque se despierte tarde, el golpe ya está apuntado para su
   momento exacto. Cada golpe se calcula desde el inicio (inicio + n × intervalo),
   no sumando intervalos, para que los redondeos no se acumulen. */

const METRO_CADA = 0.025;       // s entre repasos del programador
const METRO_ADELANTO = 0.1;     // s de golpes programados por adelantado

const metro = {
  sonando: false,
  ctx: null,                    // el contexto de audio con el que arrancó
  inicio: 0, n: 0,              // el golpe n suena en inicio + n × intervalo
  paso: 0,                      // golpe dentro del compás (0 … pulsos × subdivisión − 1)
  timer: null, frame: null,
  cola: [],                     // pulsos programados que aún no se han visto: { t, pulso }
  taps: [], tapPuntero: false,  // marcas de «Marcar» (ms); si el toque llegó con el dedo
  aviso: ''                     // por qué se paró, si no lo paraste tú
};

const compasActual = () => COMPASES.find(c => c.id === state.metro.sig);
/** Segundos entre dos golpes (pulsos o subdivisiones). */
const metroIntervalo = () => 60 / state.metro.bpm / state.metro.sub;

/** Nombre italiano del tempo, el que se escribe en las partituras (MT-01). */
const TEMPOS = [[40, 'Grave'], [45, 'Largo'], [60, 'Lento'], [76, 'Adagio'], [108, 'Andante'],
                [120, 'Moderato'], [156, 'Allegro'], [176, 'Vivace'], [200, 'Presto'], [Infinity, 'Prestissimo']];
const nombreTempo = bpm => TEMPOS.find(([hasta]) => bpm < hasta)[1];

/** Un golpe: un pitido muy corto. El acento, más agudo y fuerte; el pulso,
 *  medio; la subdivisión, más grave y suave (MT-02, MT-03). */
function metroClic(t, tipo){
  const ctx = metro.ctx;
  const f = { fuerte: 1760, normal: 1175, sub: 880 }[tipo];
  const vol = { fuerte: 1, normal: 0.6, sub: 0.28 }[tipo];
  const osc = ctx.createOscillator(), g = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.value = f;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.002);     // entrada de 2 ms: sin chasquido
  g.gain.setTargetAtTime(0, t + 0.002, 0.012);         // y se apaga en unos 50 ms
  osc.connect(g); g.connect(audioOut || ctx.destination);
  osc.start(t);
  osc.stop(t + 0.08);
}

/** Qué suena en el golpe `paso` del compás. */
function metroQueSuena(paso){
  const sub = state.metro.sub, pulso = Math.floor(paso / sub);
  if (paso % sub) return { pulso, tipo: 'sub' };
  return { pulso, tipo: pulso === 0 && state.metro.accent ? 'fuerte' : 'normal' };
}

/** Programa los golpes que caen en los próximos 100 ms. */
function metroProgramar(){
  // Si el contexto de audio cambió (se rehízo tras una llamada en el iPhone) o
  // se cerró, se para: los golpes irían a un reloj que ya no suena.
  if (!audioCtx || audioCtx !== metro.ctx || audioCtx.state === 'closed'){ stopMetro(); return; }
  const total = compasActual().pulsos * state.metro.sub;
  const hasta = audioCtx.currentTime + METRO_ADELANTO;
  for (let t = metro.inicio + metro.n * metroIntervalo(); t < hasta; t = metro.inicio + metro.n * metroIntervalo()){
    const golpe = metroQueSuena(metro.paso % total);
    metroClic(t, golpe.tipo);
    if (golpe.tipo !== 'sub') metro.cola.push({ t, pulso: golpe.pulso });
    metro.paso = (metro.paso + 1) % total;
    metro.n++;
  }
}

/** Ilumina el pulso que suena y hace latir la pestaña (MT-04, MT-05). */
function metroDibujar(){
  if (!metro.sonando) return;
  const ahora = audioCtx ? audioCtx.currentTime : 0;
  let visto = null;
  while (metro.cola.length && metro.cola[0].t <= ahora) visto = metro.cola.shift();
  if (visto){
    document.querySelectorAll('#metro-dots .md').forEach((d, i) => d.classList.toggle('now', i === visto.pulso));
    const tab = document.querySelector('.tab[data-screen="metro"]');
    if (tab){
      tab.classList.add('beat');
      clearTimeout(metroDibujar.apaga);
      metroDibujar.apaga = setTimeout(() => tab.classList.remove('beat'), 110);
    }
  }
  metro.frame = requestAnimationFrame(metroDibujar);
}

function startMetro(){
  if (metro.sonando) return;
  unlockAudio();
  wakeAudio();
  if (!audioCtx){ metro.aviso = t('metro.noAudio'); renderMetro(); return; }
  metro.ctx = audioCtx;
  metro.sonando = true;
  metro.aviso = '';
  metro.inicio = audioCtx.currentTime + 0.06;   // un respiro para que el primer golpe no se corte
  metro.n = 0; metro.paso = 0; metro.cola = [];
  metroProgramar();
  metro.timer = setInterval(metroProgramar, METRO_CADA * 1000);
  metro.frame = requestAnimationFrame(metroDibujar);
  renderMetro();
}

/** Para el metrónomo. `motivo` ('mic' u 'hidden') explica por qué, si no fuiste tú.
 *  Devuelve si estaba sonando. */
function stopMetro(motivo){
  const estaba = metro.sonando;
  metro.sonando = false;
  clearInterval(metro.timer); metro.timer = null;
  cancelAnimationFrame(metro.frame); metro.frame = null;
  metro.cola = [];
  if (estaba && motivo) metro.aviso = t(motivo === 'mic' ? 'metro.stoppedMic' : 'metro.stoppedHidden');
  const tab = document.querySelector('.tab[data-screen="metro"]');
  if (tab) tab.classList.remove('beat');
  renderMetro();
  return estaba;
}

function toggleMetro(){ if (metro.sonando) stopMetro(); else startMetro(); }

/** Cambia el tempo, dentro de 30 a 250 (MT-01). Sonando, el siguiente golpe
 *  sigue en su sitio y los demás se cuentan desde él con el ritmo nuevo. */
function setTempo(bpm){
  const antes = metroIntervalo();
  const nuevo = Math.max(METRO_MIN, Math.min(METRO_MAX, Math.round(bpm)));
  if (nuevo === state.metro.bpm) return;
  if (metro.sonando){ metro.inicio += metro.n * antes; metro.n = 0; }
  state.metro.bpm = nuevo;
  save();
  renderMetro();
}

/** «Marcar»: el tempo sale de la media de los últimos toques. Una pausa de más
 *  de 2 s empieza a contar de nuevo. */
function tapTempo(ahora){
  const ts = metro.taps;
  if (ts.length && ahora - ts[ts.length - 1] > 2000) ts.length = 0;
  ts.push(ahora);
  if (ts.length > 5) ts.shift();
  if (ts.length < 2){ metro.aviso = t('metro.tapHint'); renderMetro(); return; }
  const media = (ts[ts.length - 1] - ts[0]) / (ts.length - 1);
  metro.aviso = '';
  setTempo(60000 / media);
  renderMetro();
}

function setCompas(id){
  const c = COMPASES.find(x => x.id === id);
  if (!c || c.id === state.metro.sig) return;
  state.metro.sig = c.id;
  save();
  if (metro.sonando){ metro.paso = 0; metro.cola = []; }   // el compás nuevo empieza en su primer pulso
  buildMetroDots();
  renderMetro();
}

/** Golpes por pulso (MT-03). Sonando, la subdivisión nueva empieza en el
 *  próximo pulso, en su sitio: el pulso no se mueve. */
function setSubdivision(sub){
  if (sub === state.metro.sub) return;
  if (metro.sonando){
    const viejo = state.metro.sub, intervalo = metroIntervalo();
    const faltan = (viejo - metro.paso % viejo) % viejo;     // golpes hasta el próximo pulso
    metro.inicio += (metro.n + faltan) * intervalo; metro.n = 0;
    const pulso = ((metro.paso + faltan) % (compasActual().pulsos * viejo)) / viejo;
    metro.paso = pulso * sub;
  }
  state.metro.sub = sub;
  save();
  renderMetro();
}

function setAccent(on){
  state.metro.accent = !!on;
  save();
  renderMetro();
}

/* --- La barra vertical del tempo (MT-01) ---
   Hecha a mano y no con <input type="range"> en vertical, que cada navegador
   dibuja (o no) a su manera. Arriba, más rápido. Se arrastra con el dedo o el
   ratón y se mueve con las flechas del teclado, como cualquier deslizador. */
function sliderValor(clientY){
  const pista = document.querySelector('#metro-slider .ms-track');
  if (typeof pista.getBoundingClientRect !== 'function') return state.metro.bpm;
  const r = pista.getBoundingClientRect();
  if (!r.height) return state.metro.bpm;
  const p = Math.max(0, Math.min(1, (r.bottom - clientY) / r.height));
  return METRO_MIN + p * (METRO_MAX - METRO_MIN);
}
function bindSlider(){
  const s = document.getElementById('metro-slider');
  let arrastrando = false;
  s.addEventListener('pointerdown', ev => {
    arrastrando = true;
    try { s.setPointerCapture(ev.pointerId); } catch(e){}
    setTempo(sliderValor(ev.clientY));
    s.focus();
  });
  s.addEventListener('pointermove', ev => { if (arrastrando) setTempo(sliderValor(ev.clientY)); });
  const soltar = () => { arrastrando = false; };
  s.addEventListener('pointerup', soltar);
  s.addEventListener('pointercancel', soltar);
  s.addEventListener('keydown', ev => {
    const paso = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: 10, PageDown: -10 }[ev.key];
    if (paso) setTempo(state.metro.bpm + paso);
    else if (ev.key === 'Home') setTempo(METRO_MIN);
    else if (ev.key === 'End') setTempo(METRO_MAX);
    else return;
    ev.preventDefault();
  });
}

/* --- Figuras de la subdivisión, dibujadas en SVG --- */
function iconoFigura(k, compuesto){
  const svg = el('svg', { viewBox: '0 0 64 40', 'aria-hidden': 'true' });
  const xs = k === 1 ? [26] : k === 2 ? [18, 40] : k === 3 ? [10, 28, 46] : [6, 20, 34, 48];
  xs.forEach(x => {
    svg.appendChild(el('ellipse', { cx: x, cy: 33, rx: 6, ry: 4.4, transform: `rotate(-20 ${x} 33)`, fill: 'currentColor' }));
    svg.appendChild(el('line', { x1: x + 5.4, y1: 32, x2: x + 5.4, y2: 6, stroke: 'currentColor', 'stroke-width': 2 }));
  });
  if (k > 1){
    const a = xs[0] + 5.4, b = xs[xs.length - 1] + 5.4;
    svg.appendChild(el('rect', { x: a - 1, y: 5, width: b - a + 2, height: 4, fill: 'currentColor' }));
    if (k === 4) svg.appendChild(el('rect', { x: a - 1, y: 12, width: b - a + 2, height: 3.4, fill: 'currentColor' }));
  }
  if (k === 3 && !compuesto){
    const tx = el('text', { x: (xs[0] + xs[2]) / 2 + 5.4, y: 3.5, 'text-anchor': 'middle', 'font-size': 9, fill: 'currentColor' });
    tx.textContent = '3'; svg.appendChild(tx);
  }
  // En 6/8, 9/8 y 12/8 el pulso es una negra con puntillo.
  if (k === 1 && compuesto) svg.appendChild(el('circle', { cx: 37, cy: 33, r: 2.2, fill: 'currentColor' }));
  return svg;
}

/* --- Pantalla --- */

function buildMetroDots(){
  const box = document.getElementById('metro-dots');
  box.innerHTML = '';
  for (let i = 0; i < compasActual().pulsos; i++){
    const d = document.createElement('span'); d.className = 'md'; box.appendChild(d);
  }
  box.classList.toggle('many', compasActual().pulsos > 5);
}

/** El compás escrito como en la partitura: un número sobre otro. */
function pintarCompas(boton, id){
  const [n, d] = id.split('/');
  boton.textContent = '';
  const a = document.createElement('span'); a.className = 'sig-n'; a.textContent = n;
  const b = document.createElement('span'); b.className = 'sig-d'; b.textContent = d;
  boton.appendChild(a); boton.appendChild(b);
}

function buildMetroPicker(){
  const sigs = document.getElementById('metro-sigs');
  sigs.innerHTML = '';
  for (const c of COMPASES){
    const b = document.createElement('button');
    b.className = 'mp-sig'; b.dataset.v = c.id;
    pintarCompas(b, c.id);
    b.setAttribute('aria-label', t('metro.sigOne', { c: c.id }));
    b.addEventListener('click', () => { setCompas(c.id); renderPicker(); });
    sigs.appendChild(b);
  }
  renderPicker();
}

/** Las figuras dependen del compás (con puntillo en los compuestos). */
function renderPicker(){
  const m = state.metro, compuesto = !!compasActual().compuesto;
  document.querySelectorAll('#metro-sigs .mp-sig').forEach(b => {
    const on = b.dataset.v === m.sig;
    b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on));
  });
  const subs = document.getElementById('metro-sub');
  subs.innerHTML = '';
  for (const k of [1, 2, 3, 4]){
    const b = document.createElement('button');
    b.className = 'mp-fig'; b.dataset.v = String(k);
    b.appendChild(iconoFigura(k, compuesto));
    b.setAttribute('aria-label', t('metro.sub.' + k + (compuesto && k > 1 ? 'c' : '')));
    b.classList.toggle('on', k === m.sub); b.setAttribute('aria-pressed', String(k === m.sub));
    b.addEventListener('click', () => { setSubdivision(k); renderPicker(); });
    subs.appendChild(b);
  }
  document.getElementById('metro-accent').checked = m.accent;
}

function renderMetro(){
  const m = state.metro;
  document.getElementById('metro-bpm').textContent = String(m.bpm);
  document.getElementById('metro-name').textContent = nombreTempo(m.bpm);
  const s = document.getElementById('metro-slider');
  s.style.setProperty('--p', String((m.bpm - METRO_MIN) / (METRO_MAX - METRO_MIN)));
  s.setAttribute('aria-valuenow', String(m.bpm));
  s.setAttribute('aria-valuetext', m.bpm + ' ' + t('metro.bpm') + ', ' + nombreTempo(m.bpm));
  document.getElementById('metro-minus').disabled = m.bpm <= METRO_MIN;
  document.getElementById('metro-plus').disabled = m.bpm >= METRO_MAX;
  const sig = document.getElementById('metro-sig');
  pintarCompas(sig, m.sig);
  sig.setAttribute('aria-label', t('metro.sigAria', { c: m.sig, f: t(m.accent ? 'metro.withAccent' : 'metro.noAccent') }));
  // El primer punto se marca si lleva acento: más grande, no solo de otro color.
  const dots = document.querySelectorAll('#metro-dots .md');
  dots.forEach((d, i) => {
    d.classList.toggle('acc', i === 0 && m.accent);
    if (!metro.sonando) d.classList.toggle('now', false);
  });
  const play = document.getElementById('metro-play');
  play.textContent = metro.sonando ? t('metro.stop') : t('metro.start');
  play.classList.toggle('on', metro.sonando);
  play.setAttribute('aria-pressed', String(metro.sonando));
  document.getElementById('metro-note').textContent = metro.aviso || (metro.sonando ? t('metro.playing') : '');
  // Fuera de su área, la pestaña dice que está en marcha (también al lector de pantalla).
  const tab = document.querySelector('.tab[data-screen="metro"]');
  if (tab){
    tab.classList.toggle('metro-on', metro.sonando);
    tab.setAttribute('aria-label', metro.sonando ? t('tab.metro') + ' · ' + t('metro.running') : t('tab.metro'));
  }
}

/* --- Ventana de compás, figura y acento ---
   Un <dialog> del navegador: ya trae el foco atrapado dentro, Escape para
   cerrar y el resto de la página inerte. Como Ajustes, apunta un paso en el
   historial para que «atrás» la cierre (C-07). Donde no exista showModal,
   se enseña igual, sin esas ayudas (PL-04). */
let cerrandoPicker = false;
const pickerAbierto = () => !document.getElementById('metro-picker').hidden;
function openPicker(){
  const d = document.getElementById('metro-picker');
  renderPicker();
  d.hidden = false;
  if (typeof d.showModal === 'function' && !d.open){ try { d.showModal(); } catch(e){} }
  if (canHistory) history.pushState({ screen, picker: true }, '', '#' + SCREEN_HASH[screen]);
  d.querySelector('.mp-sig.on')?.focus();
}
function cerrarPicker(){
  const d = document.getElementById('metro-picker');
  if (d.hidden) return;
  d.hidden = true;
  if (d.open && typeof d.close === 'function'){ try { d.close(); } catch(e){} }
  document.getElementById('metro-sig').focus();
}
function hidePicker(){
  if (cerrandoPicker) return;
  if (canHistory && history.state && history.state.picker){ cerrandoPicker = true; history.back(); }
  else cerrarPicker();
}

function bindMetro(){
  buildMetroDots();
  buildMetroPicker();
  bindSlider();
  document.getElementById('metro-minus').addEventListener('click', () => setTempo(state.metro.bpm - 1));
  document.getElementById('metro-plus').addEventListener('click', () => setTempo(state.metro.bpm + 1));
  const tap = document.getElementById('metro-tap');
  tap.addEventListener('pointerdown', ev => {
    // Al bajar el dedo y no al soltarlo: así el toque cae a tiempo. El teclado
    // (Intro o espacio) llega como click sin pointerdown.
    metro.tapPuntero = true; tapTempo(ev.timeStamp || Date.now());
  });
  tap.addEventListener('click', ev => {
    if (metro.tapPuntero){ metro.tapPuntero = false; return; }
    tapTempo(ev.timeStamp || Date.now());
  });
  document.getElementById('metro-sig').addEventListener('click', openPicker);
  document.getElementById('metro-accent').addEventListener('change', ev => setAccent(ev.target.checked));
  document.getElementById('metro-ok').addEventListener('click', hidePicker);
  const d = document.getElementById('metro-picker');
  d.addEventListener('cancel', ev => { ev.preventDefault(); hidePicker(); });   // Escape
  d.addEventListener('click', ev => {                                          // tocar fuera de la ventana
    if (ev.target !== d || typeof d.getBoundingClientRect !== 'function') return;
    const r = d.getBoundingClientRect();
    if (ev.clientX < r.left || ev.clientX > r.right || ev.clientY < r.top || ev.clientY > r.bottom) hidePicker();
  });
  document.getElementById('metro-play').addEventListener('click', toggleMetro);
  renderMetro();
}

/** «Restablecer» o un cambio de idioma: el metrónomo vuelve a pintarse entero. */
function refreshMetro(){
  buildMetroDots();
  buildMetroPicker();
  renderMetro();
}
