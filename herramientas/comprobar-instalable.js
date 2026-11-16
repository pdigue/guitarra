// Comprueba G-04 (F6.3) en un Chromium real: ¿la app es instalable?
// Es lo que mira Lighthouse para darla por instalable, pero preguntado al propio
// navegador por el protocolo de sus herramientas de desarrollo (CDP):
//   - Page.getInstallabilityErrors: la lista de motivos por los que Chrome NO
//     ofrecería «Instalar». Vacía = instalable.
//   - Page.getAppManifest: el manifiesto tal como lo ha entendido, con sus errores.
// Sirve el proyecto en /guitarra/, como la web de pruebas, para comprobar que las
// direcciones relativas del manifiesto funcionan fuera de la raíz del servidor.
// Herramienta de desarrollo: necesita Playwright con Chromium.
// Uso: node herramientas/comprobar-instalable.js <repo> <carpeta de salida>

const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');

const [REPO, OUT] = process.argv.slice(2).map(p => path.resolve(p));
fs.mkdirSync(OUT, { recursive: true });

const PREFIJO = '/guitarra/';
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.mp3': 'audio/mpeg', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json' };
const pedidas = [];
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  pedidas.push(url);
  if (!url.startsWith(PREFIJO)){ res.writeHead(404); return res.end(); }
  const rel = url.slice(PREFIJO.length) || 'index.html';
  const f = path.join(REPO, rel);
  if (!f.startsWith(REPO) || !fs.existsSync(f) || fs.statSync(f).isDirectory()){ res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TIPOS[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});

const resultados = [];
const anotar = (ok, que, detalle = '') => { resultados.push({ ok, que, detalle }); console.log((ok ? '✅ ' : '❌ ') + que + (detalle ? ' — ' + detalle : '')); };

(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  // localhost cuenta como seguro, como https.
  const URL_APP = `http://localhost:${server.address().port}${PREFIJO}`;
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ locale: 'es-ES', viewport: { width: 412, height: 860 } });
  const page = await ctx.newPage();
  const errores = [];
  page.on('pageerror', e => errores.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
  try {
    await page.goto(URL_APP);
    // Chrome exige un Service Worker que controle la página.
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.goto(URL_APP);
    const controlada = await page.evaluate(() => !!navigator.serviceWorker.controller);
    anotar(controlada, 'el Service Worker controla la página');

    const cdp = await ctx.newCDPSession(page);
    const { url, errors, data } = await cdp.send('Page.getAppManifest');
    anotar(url === URL_APP + 'manifest.webmanifest', 'el manifiesto es el archivo propio', url);
    anotar(errors.length === 0, 'el navegador lo lee sin errores', errors.map(e => e.message).join('; '));
    const m = JSON.parse(data || '{}');
    anotar(m.display === 'standalone' && m.name === 'Trasteando', 'nombre y pantalla completa', m.name + ', ' + m.display);

    const { installabilityErrors: motivos } = await cdp.send('Page.getInstallabilityErrors');
    anotar(motivos.length === 0, 'Chrome la da por instalable (sin motivos en contra)',
      motivos.map(e => e.errorId).join(', ') || 'ninguno');

    // Ojo: desde 2024 Chrome deja instalar casi cualquier página, aunque su
    // manifiesto no tenga iconos (pondría una captura o una letra), y Lighthouse
    // 12 retiró su prueba de «instalable». Con la 0.6.8, sin iconos, la consulta
    // de arriba también salía vacía. Por eso se exige además lo que pedía el
    // criterio clásico: iconos de 192 y 512 px, y uno «maskable» para Android.
    const iconos = m.icons || [];
    const hay = (lado, uso) => iconos.some(i => i.sizes === lado + 'x' + lado && (i.purpose || 'any').split(' ').includes(uso));
    anotar(hay(192, 'any') && hay(512, 'any') && hay(512, 'maskable'), 'iconos de 192 y 512 px, y uno «maskable»',
      iconos.map(i => i.sizes + ' ' + (i.purpose || 'any')).join(', ') || 'ninguno');

    // Los iconos responden y son PNG del tamaño anunciado (con el alcance /guitarra/).
    for (const i of m.icons || []){
      const r = await page.evaluate(async src => {
        const img = new Image(); img.src = src; await img.decode();
        return img.naturalWidth + 'x' + img.naturalHeight;
      }, new URL(i.src, URL_APP).href);
      anotar(r === i.sizes, 'icono ' + i.src, r);
    }
    const apple = await page.evaluate(async () => {
      const img = new Image(); img.src = document.querySelector('link[rel="apple-touch-icon"]').href;
      await img.decode(); return img.naturalWidth + 'x' + img.naturalHeight;
    });
    anotar(apple === '180x180', 'icono del iPhone', apple);
    anotar(errores.length === 0, 'sin errores en la consola', errores.join(' | '));
    anotar(!pedidas.some(p => p.endsWith('favicon.ico')), 'nadie pide favicon.ico');
  } catch (e){
    anotar(false, 'la comprobación terminó', e.message);
  } finally {
    fs.writeFileSync(path.join(OUT, 'instalable.json'), JSON.stringify(resultados, null, 2));
    const bien = resultados.filter(r => r.ok).length;
    console.log(`\n${bien} de ${resultados.length}`);
    await browser.close(); server.close();
    process.exit(bien === resultados.length ? 0 : 1);
  }
})();
