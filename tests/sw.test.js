// Banco del Service Worker (F6.2, G-03). Se ejecuta con el resto: node --test
// sw.js no corre en una página, sino aparte, en el navegador. Aquí se ejecuta en
// un contexto propio con lo mínimo que usa: `self` (sus eventos), `caches` (las
// copias guardadas) y `fetch` (la red, que se puede cortar). Las respuestas son
// las de verdad del proyecto, leídas del disco, con las Request y Response de Node.
// No arranca la app, así que no se repite contra el autónomo.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const fs = require('fs');
const vm = require('vm');

const RAIZ = path.join(__dirname, '..');
const leer = f => fs.readFileSync(path.join(RAIZ, f), 'utf8');
const BASE = 'https://pdigue.github.io/guitarra/';   // como en la web de pruebas

/** Una caché como la del navegador: guarda respuestas por su dirección completa. */
function cachesFalsas(){
  const almacen = new Map();
  const abrir = nombre => {
    if (!almacen.has(nombre)) almacen.set(nombre, new Map());
    const m = almacen.get(nombre);
    const clave = p => (typeof p === 'string' ? new URL(p, BASE).href : p.url);
    return {
      m,
      async put(p, r){ m.set(clave(p), r); },
      async match(p){ const r = m.get(clave(p)); return r ? r.clone() : undefined; },
      async addAll(ps){
        const rs = await Promise.all(ps.map(p => entorno.fetch(p)));
        if (rs.some(r => !r.ok)) throw new TypeError('addAll: alguna respuesta no es ok');
        ps.forEach((p, i) => m.set(clave(p), rs[i]));
      },
    };
  };
  let entorno;
  return {
    almacen, conectar(e){ entorno = e; },
    open: async n => abrir(n),
    keys: async () => [...almacen.keys()],
    delete: async n => almacen.delete(n),
    async match(p, op){
      const nombres = op && op.cacheName ? [op.cacheName] : [...almacen.keys()];
      for (const n of nombres) if (almacen.has(n)){ const r = await abrir(n).match(p); if (r) return r; }
      return undefined;
    },
  };
}

/** Carga sw.js con una red que sirve el repositorio y que se puede cortar o frenar. */
function cargarSW(opciones = {}){
  const oyentes = {}, peticiones = [];
  const red = { estado: 'bien', cambios: {} };   // 'bien' | 'cortada' | 'colgada'
  const caches = cachesFalsas();
  const fetchFalso = async p => {
    const req = typeof p === 'string' ? new Request(new URL(p, BASE)) : p;
    peticiones.push(req);
    if (red.estado === 'cortada') throw new TypeError('Failed to fetch');
    if (red.estado === 'colgada') return new Promise(() => {});
    const ruta = decodeURIComponent(new URL(req.url).pathname.replace('/guitarra/', '')) || 'index.html';
    if (red.cambios[ruta]) return new Response(red.cambios[ruta], { status: 200 });
    const f = path.join(RAIZ, ruta);
    if (!f.startsWith(RAIZ) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) return new Response('', { status: 404 });
    return new Response(fs.readFileSync(f), { status: 200 });
  };
  const self = {
    location: new URL('sw.js', BASE),
    addEventListener: (t, f) => { oyentes[t] = f; },
    skipWaiting: async () => { self.esperaSaltada = true; },
    clients: { claim: async () => { self.reclamado = true; } },
  };
  const ctx = { self, caches, fetch: fetchFalso, Request, Response, URL, Promise, console,
    setTimeout: opciones.setTimeout || setTimeout };
  caches.conectar(ctx);
  vm.createContext(ctx);
  vm.runInContext(leer('sw.js'), ctx, { filename: 'sw.js' });

  /** Lanza un evento como el navegador y espera a lo que el Service Worker pida esperar. */
  async function lanzar(tipo, datos = {}){
    const esperas = []; let respuesta;
    const e = { ...datos, waitUntil: p => esperas.push(p), respondWith: p => { respuesta = p; } };
    oyentes[tipo](e);
    const r = respuesta ? await respuesta : undefined;
    await Promise.all(esperas);
    return r;
  }
  // Para la red colgada: lanza el evento sin esperar a lo que pide esperar.
  const lanzarCrudo = (tipo, e) => oyentes[tipo](e);
  return { ctx, self, caches, red, peticiones, lanzar, lanzarCrudo };
}

/** Request con mode 'navigate', que Node no deja poner en el constructor. */
const navegacion = url => { const r = new Request(new URL(url, BASE)); Object.defineProperty(r, 'mode', { value: 'navigate' }); return r; };
const recurso = url => new Request(new URL(url, BASE));
const pedir = (sw, peticion) => sw.lanzar('fetch', { request: peticion });

async function instalado(opciones){
  const sw = cargarSW(opciones);
  await sw.lanzar('install');
  await sw.lanzar('activate');
  return sw;
}

const VERSION_APP = leer('js/01-teoria.js').match(/APP_VERSION = '([\d.]+)'/)[1];

test('sw.js lleva la versión de la app (G-03): cambiarla es lo que instala el nuevo', () => {
  const sw = cargarSW();
  assert.equal(vm.runInContext('VERSION', sw.ctx), VERSION_APP);
  assert.equal(vm.runInContext('CACHE', sw.ctx), 'trasteando-' + VERSION_APP);
});

test('la precarga es justo lo que carga index.html más todas las grabaciones, y todo existe (G-03)', () => {
  const sw = cargarSW();
  const precarga = JSON.parse(vm.runInContext('JSON.stringify(PRECARGA)', sw.ctx));
  const html = leer('index.html');
  const deLaPagina = [...html.matchAll(/(?:href|src)="((?:css|js)\/[^"]+)"/g)].map(m => m[1]);
  assert.ok(deLaPagina.length >= 17, 'el estilo y los 16 módulos');
  assert.deepEqual(precarga.filter(u => /^(css|js)\//.test(u)), deLaPagina, 'en el mismo orden, con el mismo ?v=');
  // Las grabaciones, sacadas de SAMPLE_MAPS (js/03-audio.js), que es lo que la app pide.
  const audio = vm.createContext({});
  vm.runInContext(leer('js/03-audio.js').match(/const SAMPLE_MAPS = \{[\s\S]*?\n\};/)[0] + '; this.M = SAMPLE_MAPS;', audio);
  const grabaciones = Object.entries(audio.M).flatMap(([t, m]) => Object.values(m).map(([f]) => 'samples/' + t + '/' + f));
  assert.deepEqual(precarga.filter(u => u.startsWith('samples/')).sort(), grabaciones.sort());
  assert.ok(precarga.includes('index.html'));
  for (const u of precarga) assert.ok(fs.existsSync(path.join(RAIZ, u.split('?')[0])), u + ' no existe');
});

test('al instalarse guarda la precarga, saltándose la caché normal; al activarse borra solo las versiones viejas', async () => {
  const sw = cargarSW();
  const vieja = await sw.caches.open('trasteando-0.6.1'); await vieja.put('index.html', new Response('vieja'));
  await sw.caches.open('otra-cosa');
  await sw.lanzar('install');
  const precarga = vm.runInContext('PRECARGA', sw.ctx);
  const nueva = sw.caches.almacen.get('trasteando-' + VERSION_APP);
  assert.equal(nueva.size, precarga.length);
  assert.ok(sw.peticiones.every(p => p.cache === 'reload'), 'GitHub Pages guarda copias de 10 minutos: no deben colarse');
  assert.ok(sw.self.esperaSaltada, 'no espera a que se cierren las pestañas viejas');
  await sw.lanzar('activate');
  assert.deepEqual((await sw.caches.keys()).sort(), ['otra-cosa', 'trasteando-' + VERSION_APP]);
  assert.ok(sw.self.reclamado, 'se encarga ya de la página abierta');
});

test('si falta un archivo, no se instala (mejor que una copia a medias que luego no suena)', async () => {
  const sw = cargarSW();
  const original = sw.ctx.fetch;
  sw.ctx.fetch = async p => (String(p.url || p).includes('E5.mp3') ? new Response('', { status: 404 }) : original(p));
  await assert.rejects(sw.lanzar('install'));
  assert.equal(sw.self.esperaSaltada, undefined);
});

test('sin red: la página, el estilo, el código y las grabaciones salen de la copia (G-03)', async () => {
  const sw = await instalado();
  sw.red.estado = 'cortada';
  for (const url of ['', 'index.html', 'index.html?desde=icono']){
    const r = await pedir(sw, navegacion(url));
    assert.equal(await r.text(), leer('index.html'), 'navegar a «' + url + '»');
  }
  const css = await pedir(sw, recurso('css/trasteando.css?v=' + VERSION_APP));
  assert.equal(await css.text(), leer('css/trasteando.css'));
  const mp3 = await pedir(sw, recurso('samples/acoustic/D5.mp3'));
  assert.equal((await mp3.arrayBuffer()).byteLength, fs.statSync(path.join(RAIZ, 'samples/acoustic/D5.mp3')).size);
  // Lo que no es de la app no se toca: el navegador lo pide a la red como siempre.
  assert.equal(await pedir(sw, recurso('docs/ESTADO.md')), undefined);
  assert.equal(await pedir(sw, recurso('https://otro.servidor/js/x.js')), undefined);
  assert.equal(await pedir(sw, navegacion('dist/trasteando.html')), undefined);
  assert.equal(await sw.lanzar('fetch', { request: new Request(BASE + 'js/x.js', { method: 'POST', body: 'x' }) }), undefined);
});

test('con red, la página viene de la red y deja su copia para la próxima vez sin conexión', async () => {
  const sw = await instalado();
  sw.red.cambios['index.html'] = 'versión nueva';
  assert.equal(await (await pedir(sw, navegacion(''))).text(), 'versión nueva');
  sw.red.estado = 'cortada';
  assert.equal(await (await pedir(sw, navegacion(''))).text(), 'versión nueva');
});

test('con la red colgada, pasado el plazo se usa la copia de la página', async () => {
  const plazos = [];
  // El plazo de verdad son ESPERA_RED ms; aquí se cumple a los 5 ms para no esperar.
  const sw = await instalado({ setTimeout: (f, ms) => { plazos.push(ms); return setTimeout(f, 5); } });
  sw.red.estado = 'colgada';
  // La red no contesta nunca, así que lo que pide esperar (guardar la copia nueva)
  // no acaba: se lanza el evento sin esperarlo.
  const r = await new Promise((ok, ko) => sw.lanzarCrudo('fetch',
    { request: navegacion(''), waitUntil(){}, respondWith: p => p.then(ok, ko) }));
  assert.equal(await r.text(), leer('index.html'));
  assert.ok(plazos.includes(vm.runInContext('ESPERA_RED', sw.ctx)));
});

test('sin red y sin copia, la página falla como fallaría sin Service Worker', async () => {
  const sw = cargarSW();          // sin instalar: no hay copia
  sw.red.estado = 'cortada';
  await assert.rejects(pedir(sw, navegacion('')));
});
