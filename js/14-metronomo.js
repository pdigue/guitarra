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
  arrancando: false,            // esperando a que el audio despierte (AT-11 #1)
  ctx: null,                    // el contexto de audio con el que arrancó
  inicio: 0, n: 0,              // el golpe n suena en inicio + n × intervalo
  paso: 0,                      // golpe dentro del compás (0 … pulsos × subdivisión − 1)
  timer: null, frame: null,
  cola: [],                     // pulsos programados que aún no se han visto: { t, pulso }
  taps: [], tapPuntero: false,  // marcas de «Marcar» (ms); si el toque llegó con el dedo
  aviso: '',                    // clave del texto que explica por qué se paró, si no lo paraste tú
  // El péndulo (MT-06): cuántos pulsos se han visto, cuándo sonó el último, cuánto
  // se abre y si lo estás arrastrando (entonces se queda recto).
  vistos: 0, ultimo: null, amplitud: null, arrastrando: false   // amplitud null: aún sin medir
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
  if (!audioCtx || audioCtx !== metro.ctx || audioCtx.state === 'closed'){ stopMetro('audio'); return; }
  // Una llamada o el sistema dejan el audio en pausa: no suena nada, así que
  // no se puede decir que siga «en marcha» (AT-10 #6).
  if (audioCtx.state !== 'running'){ stopMetro('audio'); return; }
  const total = compasActual().pulsos * state.metro.sub;
  const hasta = audioCtx.currentTime + METRO_ADELANTO;
  for (let t = metro.inicio + metro.n * metroIntervalo(); t < hasta; t = metro.inicio + metro.n * metroIntervalo()){
    const golpe = metroQueSuena(metro.paso % total);
    // Si el navegador estuvo ocupado y un golpe ya pasó, se salta: sonaría a
    // destiempo, amontonado con los demás (AT-10 #2).
    if (t >= audioCtx.currentTime - 0.005){
      metroClic(t, golpe.tipo);
      if (golpe.tipo !== 'sub') metro.cola.push({ t, pulso: golpe.pulso });
    }
    metro.paso = (metro.paso + 1) % total;
    metro.n++;
  }
}

/** Ilumina el pulso que suena, hace latir la pestaña y mueve el péndulo (MT-04, MT-05, MT-06). */
function metroDibujar(){
  if (!metro.sonando) return;
  const ahora = audioCtx ? audioCtx.currentTime : 0;
  let visto = null;
  while (metro.cola.length && metro.cola[0].t <= ahora){
    visto = metro.cola.shift();
    metro.vistos++; metro.ultimo = visto.t;     // el péndulo llega a un extremo en cada pulso
  }
  // El péndulo solo se pinta si su área se ve: oculta, todo mide 0 (AR-14 #1, AT-13 #2).
  if (!document.getElementById('metro').hidden) pintarPendulo(ahora);
  if (visto){
    if (visto.pulso >= 0)                       // −1: un pulso del compás anterior (setCompas)
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

/* --- El péndulo (MT-06, tu comentario del 22/10, F5.8 #1) ---
   Mientras suena, la barra oscila como la de un metrónomo mecánico: gira sobre su
   pie y llega a un extremo en cada pulso, alternando izquierda y derecha, y entre
   dos pulsos pasa por el centro. Sigue un coseno, como un péndulo de verdad:
   rápido en el centro y lento al llegar a los extremos.
   El ángulo sale del mismo reloj de audio que los golpes: en cada fotograma se
   pregunta cuánto ha pasado desde el último pulso y se dibuja dónde debe estar.
   Así no se adelanta ni se retrasa aunque el navegador vaya a tirones.
   Se queda recto parado, mientras lo arrastras y con «reducir movimiento» (G-05). */
const PENDULO_MAX = 30;          // grados a cada lado, como un metrónomo mecánico
const PENDULO_MARGEN = 22;       // px que necesita la pesa (su radio y su borde) para no salirse

/** Grados del péndulo en el instante `ahora`: `ultimo` es cuándo sonó el último
 *  pulso, `periodo` el tiempo hasta el siguiente y `lado` dónde estaba entonces
 *  (−1 izquierda, 1 derecha). Al pulso siguiente llega justo al otro lado. */
function anguloPendulo(ahora, ultimo, periodo, lado, amplitud){
  const u = Math.max(0, Math.min(1, (ahora - ultimo) / periodo));
  return lado * amplitud * Math.cos(Math.PI * u);
}

/** Cuándo suena el próximo pulso (no una subdivisión). Se mide hasta él y no con
 *  un periodo teórico: si cambias el tempo en marcha, el péndulo no salta y llega
 *  al extremo justo cuando suena el clic (AT-13 #3). */
function proximoPulso(){
  if (metro.cola.length) return metro.cola[0].t;
  const sub = state.metro.sub, faltan = (sub - metro.paso % sub) % sub;
  return metro.inicio + (metro.n + faltan) * metroIntervalo();
}

/** Cuánto puede abrirse sin salirse de su caja: 30°, o menos si la caja es
 *  estrecha para lo larga que es la varilla (con el móvil en horizontal).
 *  Con el área oculta no se puede medir (todo mide 0): devuelve null y se mide
 *  cuando se vea, por ejemplo si giraste el móvil en otra área (AR-14 #1). */
function amplitudPendulo(){
  const area = document.getElementById('metro');
  if (area && area.hidden) return null;
  const caja = document.getElementById('metro-pendulo'), barra = document.getElementById('metro-slider');
  const ancho = caja && caja.clientWidth, largo = barra && barra.clientHeight - 28;
  if (!(ancho > 0) || !(largo > 0)) return PENDULO_MAX;
  const seno = Math.max(0, Math.min(1, (ancho / 2 - PENDULO_MARGEN) / largo));
  return Math.min(PENDULO_MAX, Math.asin(seno) * 180 / Math.PI);
}

// La consulta se crea una vez: su .matches se actualiza solo si cambias el ajuste (AT-13 #4).
const consultaReducir = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null;
const reducirMovimiento = () => !!(consultaReducir && consultaReducir.matches);

/** Pone la barra en su ángulo y lo devuelve. Antes del primer pulso espera en el
 *  lado de salida, como un péndulo que sujetas antes de soltarlo. */
function pintarPendulo(ahora){
  if (metro.amplitud === null) metro.amplitud = amplitudPendulo();     // sigue en null si está oculta
  let grados = 0;
  if (metro.sonando && !metro.arrastrando && metro.amplitud !== null && !reducirMovimiento())
    grados = metro.ultimo === null ? -metro.amplitud
      : anguloPendulo(ahora, metro.ultimo, Math.max(0.05, proximoPulso() - metro.ultimo), metro.vistos % 2 ? -1 : 1, metro.amplitud);
  document.getElementById('metro-slider').style.setProperty('--ang', grados.toFixed(2) + 'deg');
  return grados;
}

/* Arrancar (AT-11 #1). En el iPhone, tras una llamada, Siri u otra app, el audio
   queda en pausa. resume() hay que pedirlo dentro del toque (iOS lo exige), pero
   el estado no pasa a 'running' en ese mismo instante, sino un poco después: así
   lo dice la especificación de Web Audio. Si se programaran los golpes enseguida,
   metroProgramar() vería el audio aún parado y pararía el metrónomo. Por eso, si
   no está sonando, se espera a que despierte (400 ms como mucho) y solo entonces
   se arranca. Si ya suena, arranca en el acto, como antes.
   Devuelve una promesa cuando tiene que esperar (el banco la usa). */
function startMetro(){
  if (metro.sonando || metro.arrancando) return;
  unlockAudio();
  wakeAudio();                                  // resume() dentro del gesto
  if (!audioCtx){ metro.aviso = 'metro.noAudio'; renderMetro(); return; }
  if (audioCtx.state === 'running'){ metroEnMarcha(); return; }
  const ctx = audioCtx;
  metro.arrancando = true;
  let espera, despierta;
  // resume() devuelve una promesa que se cumple cuando el audio ya suena.
  try { despierta = Promise.resolve(ctx.resume()).catch(() => {}); } catch(e){ despierta = Promise.resolve(); }
  return Promise.race([
    despierta,
    new Promise(r => { espera = setTimeout(r, 400); })
  ]).then(() => {
    clearTimeout(espera);
    if (!metro.arrancando) return;              // lo paraste mientras esperaba
    metro.arrancando = false;
    // Si el audio no despertó, o se rehízo mientras tanto, no se finge que suena.
    if (audioCtx !== ctx || ctx.state !== 'running'){ metro.aviso = 'metro.noAudio'; renderMetro(); return; }
    metroEnMarcha();
  });
}

/** Pone en marcha el metrónomo con el audio ya sonando. */
function metroEnMarcha(){
  metro.ctx = audioCtx;
  metro.sonando = true;
  metro.aviso = '';
  metro.inicio = audioCtx.currentTime + 0.06;   // un respiro para que el primer golpe no se corte
  metro.n = 0; metro.paso = 0; metro.cola = [];
  metro.vistos = 0; metro.ultimo = null; metro.amplitud = null;   // se mide al pintarlo, con el área a la vista
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
  metro.arrancando = false;                     // también cancela un arranque en espera
  clearInterval(metro.timer); metro.timer = null;
  cancelAnimationFrame(metro.frame); metro.frame = null;
  metro.cola = [];
  if (estaba && motivo) metro.aviso = { mic: 'metro.stoppedMic', hidden: 'metro.stoppedHidden', audio: 'metro.stoppedAudio' }[motivo];
  const tab = document.querySelector('.tab[data-screen="metro"]');
  if (tab) tab.classList.remove('beat');
  renderMetro();
  return estaba;
}

function toggleMetro(){ if (metro.sonando || metro.arrancando) stopMetro(); else startMetro(); }

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
  if (ts.length < 2){ metro.aviso = 'metro.tapHint'; renderMetro(); return; }
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
  if (metro.sonando){
    // El compás nuevo empieza en el próximo pulso, en su sitio: si el siguiente
    // golpe era una subdivisión, se espera al pulso (AT-10 #1).
    const s = state.metro.sub, faltan = (s - metro.paso % s) % s;
    metro.inicio += (metro.n + faltan) * metroIntervalo(); metro.n = 0;
    metro.paso = 0;
    // Los pulsos ya programados sonarán: el péndulo los cuenta, pero no encienden
    // ningún punto del compás nuevo (AT-13 #3).
    metro.cola.forEach(c => { c.pulso = -1; });
  }
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
   dibuja (o no) a su manera. Es la varilla del péndulo y la pesa marca el tempo:
   como en un metrónomo mecánico, con la pesa arriba va más lento (tu decisión
   del 22/10). Se arrastra con el dedo o el ratón y se mueve con las flechas del
   teclado; las flechas siguen la norma de los deslizadores (↑ sube el valor, o
   sea, más rápido), que es lo que espera un lector de pantalla. */
function sliderValor(clientY, clientX = 0, grados = 0){
  // La caja del deslizador no gira (gira su dibujo). Si la varilla está inclinada
  // `grados`, el toque se proyecta sobre ella: cuenta la distancia desde el pie a
  // lo largo de la varilla, así que tocar la pesa donde se ve no cambia el tempo
  // (AT-13 #1). Recta (grados = 0), es solo la altura del toque.
  const s = document.getElementById('metro-slider');
  if (typeof s.getBoundingClientRect !== 'function') return state.metro.bpm;
  const r = s.getBoundingClientRect(), largo = r.height - 28;   // la varilla deja 14 px arriba y abajo
  if (!(largo > 0)) return state.metro.bpm;
  const a = grados * Math.PI / 180, pieX = r.left + r.width / 2, pieY = r.bottom - 14;
  const d = (pieY - clientY) * Math.cos(a) + (clientX - pieX) * Math.sin(a);
  const p = Math.max(0, Math.min(1, 1 - d / largo));           // arriba (lejos del pie), 0: lo más lento
  return METRO_MIN + p * (METRO_MAX - METRO_MIN);
}
function bindSlider(){
  const s = document.getElementById('metro-slider');
  s.addEventListener('pointerdown', ev => {
    const grados = parseFloat(s.style.getPropertyValue('--ang')) || 0;   // donde la viste al tocarla
    metro.arrastrando = true;                   // recta mientras la mueves: se ve dónde está la pesa
    pintarPendulo(0);
    try { s.setPointerCapture(ev.pointerId); } catch(e){}
    setTempo(sliderValor(ev.clientY, ev.clientX, grados));
    s.focus();
  });
  s.addEventListener('pointermove', ev => { if (metro.arrastrando) setTempo(sliderValor(ev.clientY)); });
  const soltar = () => { metro.arrastrando = false; };   // al soltarla, el siguiente fotograma vuelve a oscilar
  s.addEventListener('pointerup', soltar);
  s.addEventListener('pointercancel', soltar);
  s.addEventListener('lostpointercapture', soltar);   // si se pierde el dedo, no se queda enganchada (AT-13 #6)
  s.addEventListener('keydown', ev => {
    const paso = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: 10, PageDown: -10 }[ev.key];
    if (paso) setTempo(state.metro.bpm + paso);
    else if (ev.key === 'Home') setTempo(METRO_MIN);
    else if (ev.key === 'End') setTempo(METRO_MAX);
    else return;
    ev.preventDefault();
  });
}

/* --- Figuras de la subdivisión, dibujadas en SVG ---
   El pulso es una negra (x/4), una corchea (3/8, 5/8, 7/8) o una negra con
   puntillo (6/8, 9/8, 12/8), y las figuras se dibujan desde él: en 5/8, dos por
   pulso son semicorcheas (AT-10 #4). */
const figuraPulso = c => c.compuesto ? 'puntillo' : c.id.endsWith('/8') ? 'corchea' : 'negra';
function iconoFigura(k, pulso){
  const svg = el('svg', { viewBox: '0 0 64 40', 'aria-hidden': 'true' });
  const xs = k === 1 ? [26] : k === 2 ? [18, 40] : k === 3 ? [10, 28, 46] : [6, 20, 34, 48];
  xs.forEach(x => {
    svg.appendChild(el('ellipse', { cx: x, cy: 33, rx: 6, ry: 4.4, transform: `rotate(-20 ${x} 33)`, fill: 'currentColor' }));
    svg.appendChild(el('line', { x1: x + 5.4, y1: 32, x2: x + 5.4, y2: 6, stroke: 'currentColor', 'stroke-width': 2 }));
  });
  // Barras: una por cada vez que se parte por la mitad.
  const base = pulso === 'corchea' ? 1 : 0;
  const barras = k === 1 ? base : pulso === 'puntillo' ? 1 : base + (k === 4 ? 2 : 1);
  if (k === 1){
    for (let i = 0; i < barras; i++)       // corchea sola: su corchete
      svg.appendChild(el('path', { d: `M ${31.4} ${6 + i * 6} c 7 4 8 9 4 14`, fill: 'none', stroke: 'currentColor', 'stroke-width': 2 }));
  } else {
    const a = xs[0] + 5.4, b = xs[xs.length - 1] + 5.4;
    for (let i = 0; i < barras; i++)
      svg.appendChild(el('rect', { x: a - 1, y: 5 + i * 6.5, width: b - a + 2, height: 3.6, fill: 'currentColor' }));
  }
  // Grupos irregulares, con su número: tresillo en los simples; dosillo y cuatrillo en los compuestos.
  const grupo = pulso === 'puntillo' ? (k === 2 || k === 4 ? k : 0) : (k === 3 ? 3 : 0);
  if (grupo){
    const tx = el('text', { x: (xs[0] + xs[xs.length - 1]) / 2 + 5.4, y: 3.5, 'text-anchor': 'middle', 'font-size': 9, fill: 'currentColor' });
    tx.textContent = String(grupo); svg.appendChild(tx);
  }
  if (k === 1 && pulso === 'puntillo') svg.appendChild(el('circle', { cx: 37, cy: 33, r: 2.2, fill: 'currentColor' }));
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
  // Las cuatro figuras se crean una vez: rehacerlas en cada toque hacía perder
  // el foco del teclado (AT-10 #3). Al cambiar de compás solo cambia su dibujo.
  const subs = document.getElementById('metro-sub');
  subs.innerHTML = ''; delete subs.dataset.pulso;
  for (const k of [1, 2, 3, 4]){
    const b = document.createElement('button');
    b.className = 'mp-fig'; b.dataset.v = String(k);
    b.addEventListener('click', () => { setSubdivision(k); renderPicker(); });
    subs.appendChild(b);
  }
  renderPicker();
}

/** Marca el compás y la figura elegidos; las figuras se dibujan según el pulso. */
function renderPicker(){
  const m = state.metro, pulso = figuraPulso(compasActual());
  document.querySelectorAll('#metro-sigs .mp-sig').forEach(b => {
    const on = b.dataset.v === m.sig;
    b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on));
  });
  const subs = document.getElementById('metro-sub');
  const redibujar = subs.dataset.pulso !== pulso;
  subs.dataset.pulso = pulso;
  subs.querySelectorAll('.mp-fig').forEach(b => {
    const k = +b.dataset.v;
    if (redibujar){ b.innerHTML = ''; b.appendChild(iconoFigura(k, pulso)); }
    b.setAttribute('aria-label', t('metro.sub.' + k + (k > 1 ? { negra: '', corchea: 'e', puntillo: 'c' }[pulso] : '')));
    b.classList.toggle('on', k === m.sub); b.setAttribute('aria-pressed', String(k === m.sub));
  });
  document.getElementById('metro-accent').checked = m.accent;
}

function renderMetro(){
  const m = state.metro;
  document.getElementById('metro-bpm').textContent = String(m.bpm);
  document.getElementById('metro-name').textContent = nombreTempo(m.bpm);
  const s = document.getElementById('metro-slider');
  s.style.setProperty('--p', String((m.bpm - METRO_MIN) / (METRO_MAX - METRO_MIN)));
  s.setAttribute('aria-valuenow', String(m.bpm));
  if (!metro.sonando) s.style.setProperty('--ang', '0deg');   // parado, el péndulo descansa recto
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
  play.classList.toggle('on', metro.sonando);   // el texto ya dice Empezar o Parar: sin aria-pressed (AT-10 #9)
  // El aviso se guarda como clave y se traduce al pintarlo: cambia con el idioma (AT-10 #5).
  document.getElementById('metro-note').textContent = metro.aviso ? t(metro.aviso) : (metro.sonando ? t('metro.playing') : '');
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
  tap.addEventListener('pointercancel', () => { metro.tapPuntero = false; });   // si no llega el click, no se traga el siguiente toque
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
  // Al girar el móvil cambia el sitio que tiene el péndulo para oscilar.
  window.addEventListener('resize', () => { metro.amplitud = null; });   // se mide de nuevo cuando se vea
  renderMetro();
}

/** «Restablecer» o un cambio de idioma: el metrónomo vuelve a pintarse entero. */
function refreshMetro(){
  buildMetroDots();
  buildMetroPicker();
  renderMetro();
}
