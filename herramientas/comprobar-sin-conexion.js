// Comprueba G-03 (F6.2) en un Chromium real: la app sin conexión desde la web.
// Es el criterio del roadmap, «cargar, activar modo avión y seguir usándola»,
// en localhost (la web publicada se comprueba en F7.2):
//   1. sirve el proyecto como un servidor web y abre la app con conexión;
//   2. espera a que el Service Worker (sw.js) la tenga guardada;
//   3. apaga el servidor (como el modo avión) y vuelve a abrirla;
//   4. usa la app: «Empezar», notas de los dos timbres y las seis áreas;
//   5. sin red, nada debe fallar.
// Después comprueba que una versión nueva sustituye a la vieja al volver la red.
// Herramienta de desarrollo: necesita Playwright con Chromium.
// Uso: node herramientas/comprobar-sin-conexion.js <repo> <carpeta de salida>

const { chromium } = require('playwright');
const LOCALE = process.env.IDIOMA || 'es-ES';
const http = require('http'), fs = require('fs'), path = require('path');

const [REPO, OUT] = process.argv.slice(2).map(p => path.resolve(p));
fs.mkdirSync(OUT, { recursive: true });

// Servidor local. Apunta lo que le piden; `cambios` sirve otra versión de un
// archivo (para probar la actualización).
// Sin red = el servidor apagado: cada intento de conexión se rechaza al momento.
// (El modo sin conexión de Playwright no sirve aquí: corta la navegación antes de
// que el Service Worker pueda contestar. Por lo mismo se vuelve a abrir la app
// con goto y no con reload, que en Playwright se salta el Service Worker.)
const servidas = [], cambios = {};
const server = http.createServer((req, res) => {
  const ruta = decodeURIComponent(req.url.split('?')[0]);
  servidas.push(req.url);
  const f = path.join(REPO, ruta === '/' ? 'index.html' : ruta);
  const tipos = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.mp3': 'audio/mpeg' };
  const tipo = tipos[path.extname(f)] || 'application/octet-stream';
  if (cambios[ruta] !== undefined){ res.writeHead(200, { 'Content-Type': tipo }); return res.end(cambios[ruta]); }
  if (!f.startsWith(REPO) || !fs.existsSync(f) || fs.statSync(f).isDirectory()){ res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': tipo });
  fs.createReadStream(f).pipe(res);
});
let puerto = 0;
const encender = () => new Promise(r => server.listen(puerto, '127.0.0.1', () => { puerto = server.address().port; r(); }));
const apagar = () => new Promise(r => { server.close(r); server.closeAllConnections(); });

const resultados = [];
const anotar = (ok, que, detalle = '') => { resultados.push({ ok, que, detalle }); console.log((ok ? '✅ ' : '❌ ') + que + (detalle ? ' — ' + detalle : '')); };

(async () => {
  await encender();
  // localhost cuenta como seguro, como https: el Service Worker funciona en él.
  const URL_APP = `http://localhost:${puerto}/`;
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const ctx = await browser.newContext({ locale: LOCALE, viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  const errores = [], fallidas = [];
  page.on('pageerror', e => errores.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
  page.on('requestfailed', r => fallidas.push(r.url() + ' (' + (r.failure() || {}).errorText + ')'));

  try {
    // 1 y 2. Con conexión: abrir y esperar a que el Service Worker lo tenga guardado.
    await page.goto(URL_APP);
    const version = await page.evaluate(() => APP_VERSION);
    const t0 = Date.now();
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 15000 });
    const precarga = await page.evaluate(v => caches.open('trasteando-' + v).then(c => c.keys()).then(k => k.length), version);
    anotar(precarga === 35, 'con conexión, el Service Worker guarda la app entera', `${precarga} archivos en trasteando-${version}, en ${Date.now() - t0} ms`);

    // 3. Sin red, como en modo avión, y volver a abrirla.
    await apagar();
    fallidas.length = 0; errores.length = 0;
    const t1 = Date.now();
    await page.goto(URL_APP);
    await page.waitForSelector('#gate-btn');
    anotar(await page.textContent('#app-version') === 'Trasteando ' + version, 'sin red, la app vuelve a abrir', `${Date.now() - t1} ms`);

    // 4. Usarla: «Empezar», notas de los dos timbres y las seis áreas.
    await page.click('#gate-btn');
    await page.waitForFunction(() => samplerReady, null, { timeout: 10000 });
    anotar(true, 'sin red, «Empezar» carga las grabaciones de ' + await page.evaluate(() => samplerTimbre));
    await page.evaluate(() => { playMidi(40, 0.5); playMidi(64, 0.5); });
    await page.evaluate(() => setTimbre(state.timbre === 'nylon' ? 'acoustic' : 'nylon'));
    await page.waitForFunction(() => samplerReady, null, { timeout: 10000 });
    anotar(true, 'sin red, cambia de timbre a ' + await page.evaluate(() => samplerTimbre));
    const areas = await page.$$eval('.tab[data-screen]', ts => ts.map(t => t.dataset.screen));
    for (const a of areas) await page.click(`.tab[data-screen="${a}"]`);
    anotar(areas.length === 6, 'sin red, se recorren las seis áreas', areas.join(', '));
    await page.screenshot({ path: path.join(OUT, 'sin-conexion.png') });

    // 5. Nada debe haber fallado. (La página sí prueba antes la red, para ver la
    // última versión: ese intento lo hace el Service Worker y no cuenta aquí.)
    anotar(fallidas.length === 0, 'sin red, ninguna petición de la página falla', fallidas.slice(0, 3).join('; '));
    anotar(errores.length === 0, 'sin errores en la consola', errores.slice(0, 3).join('; '));

    // Actualización: con red otra vez, una versión nueva (otro sw.js y otra
    // página, con el mismo estilo y código) sustituye a la vieja y borra su caché.
    const nueva = '9.9.9';
    cambios['/sw.js'] = fs.readFileSync(path.join(REPO, 'sw.js'), 'utf8')
      .replace(/const VERSION = '[\d.]+'/, `const VERSION = '${nueva}'`)
      .replace(/\?v=' \+ VERSION/g, `?v=${version}'`);
    cambios['/index.html'] = fs.readFileSync(path.join(REPO, 'index.html'), 'utf8').replace('<title>', '<title>NUEVA ');
    await encender();
    const antes = servidas.length;
    await page.goto(URL_APP);
    // Cada vez que se abre, la app llama a register(), y eso hace que el
    // navegador mire si sw.js ha cambiado. Se espera hasta 20 s a que acabe.
    const soloLaNueva = () => page.evaluate(n => caches.keys().then(k => k.length === 1 && k[0] === 'trasteando-' + n), nueva);
    let sustituida = false;
    for (let i = 0; i < 80 && !(sustituida = await soloLaNueva()); i++) await page.waitForTimeout(250);
    anotar(sustituida, 'al volver la red, la versión nueva sustituye a la vieja',
      (await page.evaluate(() => caches.keys())).join(', ') + ` (${servidas.length - antes} descargas)`);
    await apagar();
    await page.goto(URL_APP);
    anotar((await page.title()).startsWith('NUEVA'), 'y sin red ya abre la página nueva');
  } catch (e){
    anotar(false, 'la comprobación no pudo terminar', e.message.split('\n')[0]);
  }

  fs.writeFileSync(path.join(OUT, 'sin-conexion.json'), JSON.stringify(resultados, null, 2));
  await browser.close();
  if (server.listening) await apagar();
  const fallos = resultados.filter(r => !r.ok).length;
  console.log(fallos ? `\n${fallos} comprobaciones fallan` : `\nTodo bien (${resultados.length} comprobaciones)`);
  process.exit(fallos ? 1 : 0);
})();
