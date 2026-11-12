/* Trasteando — Service Worker (F6.2, G-03): la app sin conexión desde la web.

   Qué es: un programa pequeño que el navegador guarda aparte de la página y
   que se pone «en medio» de cada petición que hace la app (la página, el
   estilo, el código y las grabaciones). Así puede contestar él, con copias
   guardadas, cuando no hay red. Solo funciona con https o en localhost, y no
   con doble clic (file://): para eso está el archivo autónomo (G-07).

   Cómo trabaja:
   1. Al instalarse, descarga y guarda en una caché todo lo que la app
      necesita (PRECARGA): así basta con abrirla una vez con conexión.
   2. Al activarse, borra las cachés de versiones anteriores.
   3. En cada petición:
      - la página (index.html): primero la red, para ver siempre la última
        versión; si no hay red, o tarda más de ESPERA_RED ms, la copia;
      - estilo, código y grabaciones: primero la copia, que no cambia dentro de
        una versión (los ?v= de index.html cambian con cada una);
      - todo lo demás pasa sin tocar.

   La caché lleva la versión en el nombre. Cambiar VERSION cambia este archivo,
   y eso es lo que hace que el navegador instale el Service Worker nuevo. Una
   prueba del banco exige que coincida con APP_VERSION (js/01-teoria.js). */

const VERSION = '0.6.2';
const CACHE = 'trasteando-' + VERSION;
const ESPERA_RED = 3000;   // ms que se espera a la red antes de usar la copia de la página

// Lo que la app necesita para funcionar entera. El banco (tests/sw.test.js)
// comprueba que coincide con lo que carga index.html y con las grabaciones de
// js/03-audio.js, y que todo existe.
const MODULOS = ['00-idioma', '01-teoria', '02-estado', '03-audio', '04-pentagrama',
  '05-mastil', '06-zoom', '07-adivinar', '08-afinador-referencia', '09-navegacion',
  '10-tono', '11-afinador-micro', '13-escalas', '14-metronomo', '15-acordes', '99-arranque'];
const GRABACIONES = {
  nylon:    ['E2', 'A2', 'D3', 'G3', 'B3', 'E4', 'A4', 'E5', 'As5'],
  acoustic: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4', 'A4', 'D5'],
};
const PRECARGA = [
  'index.html',
  'css/trasteando.css?v=' + VERSION,
  ...MODULOS.map(m => 'js/' + m + '.js?v=' + VERSION),
  ...Object.entries(GRABACIONES).flatMap(([t, notas]) => notas.map(n => 'samples/' + t + '/' + n + '.mp3')),
];

// Direcciones completas: el alcance es la carpeta de este archivo (en la web
// de pruebas, /guitarra/), así que todo se resuelve respecto a ella.
const BASE = new URL('./', self.location).href;
const PAGINA = new URL('index.html', BASE).href;
const esPagina = url => url.split('?')[0] === BASE || url.split('?')[0] === PAGINA;
const esRecurso = url => /^(css|js|samples)\//.test(url.slice(BASE.length)) && url.startsWith(BASE);

self.addEventListener('install', e => {
  // addAll falla entera si falla un solo archivo: mejor no instalar que dejar
  // una caché a medias que luego, sin red, no sonaría.
  // cache: 'reload' se salta la caché normal del navegador (GitHub Pages deja
  // copias de 10 minutos): así no se guarda un index.html de la versión anterior.
  const peticiones = PRECARGA.map(u => new Request(new URL(u, BASE), { cache: 'reload' }));
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(peticiones)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(nombres => Promise.all(nombres
        .filter(n => n.startsWith('trasteando-') && n !== CACHE)
        .map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

/** La página: primero la red (y se guarda la copia nueva); sin red, la guardada. */
function paginaRedPrimero(e){
  let guardar = Promise.resolve();
  const red = fetch(e.request).then(r => {
    // La copia se hace antes de entregar la respuesta: el cuerpo solo se lee una vez.
    if (r.ok){ const copia = r.clone(); guardar = caches.open(CACHE).then(c => c.put(PAGINA, copia)); }
    return r;
  });
  // Que el navegador no duerma al Service Worker antes de guardar la copia nueva.
  e.waitUntil(red.then(() => guardar, () => {}));
  const copia = () => caches.match(PAGINA, { cacheName: CACHE }).then(r => r || caches.match(PAGINA));
  const sinRed = red.catch(() => copia().then(r => r || Promise.reject(new Error('sin red y sin copia'))));
  // Con una red muy lenta no se deja a nadie esperando: pasado ESPERA_RED se
  // usa la copia (si la hay) y la red, si llega, deja la suya para la próxima.
  const plazo = new Promise(ok => setTimeout(() => copia().then(r => r && ok(r)), ESPERA_RED));
  return Promise.race([sinRed, plazo]);
}

/** Estilo, código y grabaciones: primero la copia; si no está, la red, y se guarda. */
function recursoCachePrimero(peticion){
  return caches.match(peticion).then(guardada => guardada || fetch(peticion).then(r => {
    if (r.ok){ const copia = r.clone(); caches.open(CACHE).then(c => c.put(peticion, copia)); }
    return r;
  }));
}

self.addEventListener('fetch', e => {
  const p = e.request;
  if (p.method !== 'GET') return;
  if (p.mode === 'navigate' && esPagina(p.url)) e.respondWith(paginaRedPrimero(e));
  else if (esRecurso(p.url)) e.respondWith(recursoCachePrimero(p));
  // Lo demás (otras carpetas, otros servidores) va directo a la red.
});
