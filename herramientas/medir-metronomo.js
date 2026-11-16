// Mide el pulso del metrónomo en un Chromium real (F5.8 #7, MT-04, AR-12 #3).
// Herramienta de desarrollo: necesita Playwright con Chromium.
// Arranca el metrónomo a 250 ppm y, mientras suena, bloquea el hilo principal
// 200 ms cada 0,7 s (lo que le pasa a un móvil ocupado). Apunta cada golpe que
// se programa en el reloj de audio y cuándo se enciende la luz de cada pulso, y
// cuenta: golpes perdidos, desviación de los intervalos y cuánto se adelanta o
// retrasa la luz respecto a lo que se oye.
// Uso: node herramientas/medir-metronomo.js <raíz del repositorio> [segundos]
// (la raíz permite medir otra versión: p. ej. una copia de main para comparar).
'use strict';
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');

const RAIZ = path.resolve(process.argv[2] || path.join(__dirname, '..'));
const SEGUNDOS = +(process.argv[3] || 15);
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' };
const server = http.createServer((req, res) => {
  const f = path.join(RAIZ, decodeURIComponent(req.url.split('?')[0]));
  if (!f.startsWith(RAIZ) || !fs.existsSync(f) || fs.statSync(f).isDirectory()){ res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TIPOS[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});

(async () => {
  await new Promise(r => server.listen(5597, '127.0.0.1', r));
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage({ viewport: { width: 390, height: 664 } });
  const errores = [];
  page.on('pageerror', e => errores.push(e.message));
  await page.goto('http://127.0.0.1:5597/index.html');
  await page.click('#gate-btn');
  await page.click('.tab[data-screen="metro"]');
  const r = await page.evaluate(async segundos => {
    // Se espía la función que crea cada golpe, sin cambiar lo que hace.
    const golpes = [], luces = [];
    const original = metroClic;
    metroClic = function(t, tipo){ const x = original.apply(this, arguments); golpes.push({ t, x }); return x; };
    // La luz: cuándo se enciende cada pulso, en el reloj de audio.
    new MutationObserver(ms => ms.forEach(m => {
      if (m.target.classList.contains('now')) luces.push(audioCtx.currentTime);
    })).observe(document.getElementById('metro-dots'), { subtree: true, attributes: true, attributeFilter: ['class'] });
    setTempo(250);
    await startMetro();
    const tirones = setInterval(() => { const fin = performance.now() + 200; while (performance.now() < fin); }, 700);
    await new Promise(r => setTimeout(r, segundos * 1000));
    clearInterval(tirones);
    const ctx = audioCtx;
    stopMetro();
    // Mientras se mide no se cambia nada, así que no hay golpes retirados (solo
    // los que calla Parar, al final): cada momento distinto es un golpe.
    const ts = golpes.map(g => g.t).filter((t, i, a) => a.indexOf(t) === i).sort((a, b) => a - b);
    const iv = 60 / 250, desv = ts.slice(1).map((t, i) => Math.abs(t - ts[i] - iv)).filter(d => d < iv / 2);
    const esperados = Math.round((ts.at(-1) - ts[0]) / iv) + 1;
    // Retraso de cada luz respecto a su golpe más cercano anterior.
    const retrasos = luces.map(l => { const t = ts.filter(x => x <= l).at(-1); return t === undefined ? null : l - t; })
      .filter(x => x !== null && x < 0.6);
    const media = a => a.reduce((s, x) => s + x, 0) / (a.length || 1);
    return { golpes: ts.length, esperados, perdidos: esperados - ts.length, desvMax: Math.max(0, ...desv),
      luzMedia: media(retrasos), luces: retrasos.length,
      outputLatency: ctx.outputLatency, baseLatency: ctx.baseLatency,
      getOutputTimestamp: typeof ctx.getOutputTimestamp === 'function', adelanto: typeof METRO_ADELANTO === 'number' ? METRO_ADELANTO : null };
  }, SEGUNDOS);
  console.log(`Raíz: ${RAIZ} · ${SEGUNDOS} s a 250 ppm, con tirones de 200 ms cada 0,7 s`);
  console.log(`Adelanto programado: ${r.adelanto} s`);
  console.log(`Golpes: ${r.golpes} de ${r.esperados} → perdidos: ${r.perdidos}`);
  console.log(`Desviación máxima entre golpes seguidos: ${(r.desvMax * 1000).toFixed(3)} ms (los perdidos aparte)`);
  console.log(`La luz se enciende, de media, ${(r.luzMedia * 1000).toFixed(1)} ms después de que el reloj de audio pase por el golpe (${r.luces} luces)`);
  console.log('(En Chromium sin altavoz real, la latencia no es la de un móvil: el retraso de la luz solo sirve para comparar versiones.)');
  console.log(`Latencias que declara el navegador: salida ${r.outputLatency} s, base ${r.baseLatency} s; getOutputTimestamp: ${r.getOutputTimestamp ? 'sí' : 'no'}`);
  if (errores.length) console.log('Errores: ' + errores.join(' | '));
  await browser.close(); server.close();
})().catch(e => { console.error(e); process.exit(1); });
