// Comprueba dist/trasteando.html como lo usaría alguien con doble clic: abierto
// desde el disco (file://) y sin conexión. Mide cuánto tarda en abrir y en
// tener el sonido listo, anota cualquier intento de conexión y graba unas notas
// de cada timbre para medir su afinación con medir-afinacion.py.
// Herramienta de desarrollo: necesita Playwright con Chromium.
// Uso: node herramientas/comprobar-autonomo.js <dist/trasteando.html> <carpeta de salida>
const { chromium } = require('playwright');
// La app sigue el idioma del navegador (G-12): por defecto se comprueba en español;
// con IDIOMA=en-US, en inglés.
const LOCALE = process.env.IDIOMA || 'es-ES';
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');

const [FILE, OUT] = process.argv.slice(2);
fs.mkdirSync(OUT, { recursive: true });

async function record(page, midi, file){
  const b64 = await page.evaluate(async midi => {
    const dest = audioCtx.createMediaStreamDestination(); audioOut.connect(dest);
    const rec = new MediaRecorder(dest.stream), chunks = [];
    rec.ondataavailable = e => chunks.push(e.data);
    const done = new Promise(r => rec.onstop = r);
    rec.start(); await new Promise(r => setTimeout(r, 150));
    playMidi(midi, 1.4); await new Promise(r => setTimeout(r, 1500));
    rec.stop(); await done; audioOut.disconnect(dest);
    const buf = new Uint8Array(await new Blob(chunks).arrayBuffer());
    let s = ''; for (let i = 0; i < buf.length; i++) s += String.fromCharCode(buf[i]);
    return btoa(s);
  }, midi);
  fs.writeFileSync(file + '.webm', Buffer.from(b64, 'base64'));
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', file + '.webm', '-ac', '1', '-ar', '44100', file + '.wav']);
}

(async () => {
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const ctx = await browser.newContext({ locale: LOCALE, offline: true, viewport: { width: 1280, height: 800 } });
  const intentos = [], errores = [];
  await ctx.route('**/*', r => { const u = r.request().url(); if (u.startsWith('file:') || u.startsWith('data:')) return r.continue(); intentos.push(u); r.abort(); });
  const page = await ctx.newPage();
  page.on('pageerror', e => errores.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });

  const t0 = Date.now();
  await page.goto('file://' + path.resolve(FILE), { waitUntil: 'load' });
  const abre = Date.now() - t0;
  const t1 = Date.now();
  await page.click('#gate-btn');
  await page.waitForFunction(() => samplerReady, null, { timeout: 15000 });
  const listo = Date.now() - t1;
  const r = { version: await page.evaluate(() => APP_VERSION), abre_ms: abre, sonido_listo_ms: listo,
              timbre: await page.evaluate(() => samplerTimbre) };
  // F6.1 (AT-12 #2): un error dentro del autónomo tiene que decir el módulo y la línea
  // de verdad. Se provoca en soundStart, cuya primera línea lee el búfer, y se compara
  // con la línea que tiene en js/03-audio.js. El banco no puede verlo: solo el navegador.
  const audioJs = fs.readFileSync(path.join(__dirname, '..', 'js', '03-audio.js'), 'utf8').split('\n');
  const esperada = 'js/03-audio.js:' + (audioJs.findIndex(l => l.startsWith('function soundStart(')) + 2);
  const pila = await page.evaluate(() => { try { soundStart(null); } catch (e) { return e.stack; } return ''; });
  const dice = (pila.match(/js\/03-audio\.js:\d+/) || ['ningún módulo'])[0];
  r.nombre_de_modulo = dice;
  if (dice !== esperada) errores.push(`el error dice «${dice}» y debería decir «${esperada}»`);
  for (const midi of [40, 64, 76, 88]) await record(page, midi, path.join(OUT, 'autonomo-nylon-' + midi));
  await page.evaluate(() => setTimbre('acoustic'));
  await page.waitForFunction(() => samplerTimbre === 'acoustic', null, { timeout: 15000 });
  for (const midi of [40, 64, 76, 88]) await record(page, midi, path.join(OUT, 'autonomo-acoustic-' + midi));
  r.intentos_de_conexion = intentos; r.errores = errores;
  console.log(JSON.stringify(r, null, 1));
  await browser.close();
})().catch(e => { console.error('ERROR', e); process.exit(1); });
