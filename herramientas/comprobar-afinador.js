// Comprueba el afinador por micrófono en un Chromium real (F4.3).
// Herramienta de desarrollo: necesita Playwright con Chromium.
// Chromium deja sustituir el micrófono por un archivo WAV: le damos una
// grabación real de la 5ª cuerda (La2) desafinada 12 cents hacia abajo, y la
// app debe decir «La2 · −12 cents · ▲ Sube un poco», con el detector en su
// hilo aparte. También comprueba que, abierta como archivo, explica por qué no
// hay micrófono, y guarda capturas en vertical y en horizontal.
// Uso: node herramientas/comprobar-afinador.js <carpeta de salida>
const { chromium } = require('playwright');
// La app sigue el idioma del navegador (G-12): por defecto se comprueba en español;
// con IDIOMA=en-US, en inglés.
const LOCALE = process.env.IDIOMA || 'es-ES';
const http = require('http'), fs = require('fs'), path = require('path');
const RAIZ = path.resolve(__dirname, '..');
const OUT = process.argv[2] || path.join(RAIZ, 'docs', 'verificaciones', 'capturas-afinador');
fs.mkdirSync(OUT, { recursive: true });

// La grabación, desafinada leyendo más despacio (como aflojar la clavija).
function wavDesafinado(origen, cents, destino){
  const b = fs.readFileSync(origen), datos = b.indexOf('data') + 8, sr = b.readUInt32LE(24);
  const x = new Float32Array((b.length - datos) / 2);
  for (let i = 0; i < x.length; i++) x[i] = b.readInt16LE(datos + 2 * i) / 32768;
  const r = 2 ** (cents / 1200), n = Math.floor((x.length - 1) / r);
  const out = Buffer.alloc(44 + 2 * n);
  out.write('RIFF', 0); out.writeUInt32LE(36 + 2 * n, 4); out.write('WAVEfmt ', 8);
  out.writeUInt32LE(16, 16); out.writeUInt16LE(1, 20); out.writeUInt16LE(1, 22);
  out.writeUInt32LE(sr, 24); out.writeUInt32LE(sr * 2, 28); out.writeUInt16LE(2, 32); out.writeUInt16LE(16, 34);
  out.write('data', 36); out.writeUInt32LE(2 * n, 40);
  for (let i = 0; i < n; i++){ const p = i * r, k = Math.floor(p), f = p - k;
    out.writeInt16LE(Math.round(32767 * Math.max(-1, Math.min(1, x[k] * (1 - f) + x[k + 1] * f))), 44 + 2 * i); }
  fs.writeFileSync(destino, out);
}

const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' };
const server = http.createServer((req, res) => {
  const f = path.join(RAIZ, decodeURIComponent(req.url.split('?')[0]));
  if (!f.startsWith(RAIZ) || !fs.existsSync(f) || fs.statSync(f).isDirectory()){ res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TIPOS[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});

(async () => {
  const wav = path.join(OUT, 'la2-menos12.wav');
  wavDesafinado(path.join(RAIZ, 'tests', 'muestras-afinador', 'nylon-A2.wav'), -12, wav);
  await new Promise(r => server.listen(5598, '127.0.0.1', r));
  const browser = await chromium.launch({ args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream',
    '--use-file-for-fake-audio-capture=' + wav, '--autoplay-policy=no-user-gesture-required'] });
  const fallos = [], errores = [];
  const comprobar = (ok, texto) => { console.log((ok ? 'OK    ' : 'FALLA ') + texto); if (!ok) fallos.push(texto); };

  for (const [nombre, w, h] of [['vertical', 390, 664], ['horizontal', 750, 342]]){
    const ctx = await browser.newContext({ locale: LOCALE, viewport: { width: w, height: h }, hasTouch: true, isMobile: true });
    await ctx.grantPermissions(['microphone'], { origin: 'http://127.0.0.1:5598' });
    const page = await ctx.newPage();
    page.on('pageerror', e => errores.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
    await page.goto('http://127.0.0.1:5598/index.html');
    await page.click('#gate-btn');             // la pantalla de entrada
    await page.click('.tab[data-screen="tuner"]');
    await page.click('#tuner-mode [data-v="mic"]');
    await page.click('#mic-start');
    await page.waitForTimeout(2500);
    const r = await page.evaluate(() => ({ nota: document.getElementById('mic-note').textContent,
      detalle: document.getElementById('mic-detail').textContent, orden: document.getElementById('mic-order').textContent,
      hilo: !!(mic.det && mic.det.hilo), sr: audioCtx && audioCtx.sampleRate }));
    const c = +((r.detalle.match(/([+−-]?\d+) cents/) || [])[1] || 'NaN').toString().replace('−', '-');
    comprobar(r.nota === 'La2' && Math.abs(c + 12) <= 2 && r.orden === '▲ Sube un poco',
      `${nombre}: La2 a −12 cents → «${r.nota} · ${r.detalle} · ${r.orden}» (audio a ${r.sr} Hz)`);
    comprobar(r.hilo, `${nombre}: el detector trabaja en un hilo aparte`);
    const d = await page.evaluate(() => {
      const chicos = [...document.querySelectorAll('#tuner-mic button, #tuner-mode button')]
        .filter(b => b.offsetParent && b.getBoundingClientRect().height < 40).map(b => b.id || b.textContent);
      const stop = document.getElementById('mic-stop').getBoundingClientRect();
      return { chicos, cabe: stop.bottom <= innerHeight + 0.5, ancho: document.documentElement.scrollWidth <= innerWidth };
    });
    comprobar(!d.chicos.length && d.cabe && d.ancho,
      `${nombre}: controles de 40 px o más${d.chicos.length ? ' (no: ' + d.chicos.join(', ') + ')' : ''}, «Detener» a la vista sin desplazar${d.cabe ? '' : ' (NO)'}, nada se sale de lado`);
    await page.screenshot({ path: path.join(OUT, 'afinador-micro-' + nombre + '.png') });
    await page.click('.tab[data-screen="free"]');
    const apagado = await page.evaluate(() => !mic.stream && !mic.analyser);
    comprobar(apagado, `${nombre}: al salir del Afinador el micrófono se apaga`);
    await ctx.close();
  }

  // Abierta como archivo: sin micrófono, con el motivo, y De oído intacto.
  const ctx = await browser.newContext({ locale: LOCALE, viewport: { width: 390, height: 664 } });
  const page = await ctx.newPage();
  await page.goto('file://' + path.join(RAIZ, 'index.html'));
  await page.click('#gate-btn');
  await page.click('.tab[data-screen="tuner"]');
  await page.click('#tuner-mode [data-v="mic"]');
  const f = await page.evaluate(() => ({ motivo: document.getElementById('mic-why').textContent,
    desactivado: document.getElementById('mic-start').disabled }));
  comprobar(/archivo/.test(f.motivo) && f.desactivado, `archivo: «${f.motivo.slice(0, 60)}…», botón desactivado`);
  await page.screenshot({ path: path.join(OUT, 'afinador-micro-archivo.png') });

  comprobar(errores.length === 0, 'sin errores en la consola' + (errores.length ? ': ' + errores.join(' | ') : ''));
  await browser.close(); server.close();
  fs.unlinkSync(wav);
  console.log(fallos.length ? fallos.length + ' fallo(s)' : 'Todo correcto');
  process.exitCode = fallos.length ? 1 : 0;
})();
