// Comprueba la lista de F1.1 del roadmap en un Chromium real (Playwright).
// Herramienta de desarrollo: necesita Playwright con Chromium y una copia local
// de Tone.js en la ruta TONE (el entorno del agente no llega a cdnjs). Sirve la
// app como Live Server, redirige el audio a samples/, recorre las 15
// comprobaciones, emula un iPhone en vertical y apaisado, y graba las notas de
// los trastes 7, 8 y 12 para medir su afinación con medir-afinacion.py.
// Uso: node herramientas/comprobar-en-navegador.js <repo> index.html <salida>

const { chromium, devices } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path');

const [REPO, HTML, OUT] = process.argv.slice(2);
const TONE = process.env.TONE_JS || path.join(__dirname, '..', 'tone', 'site', 'build', 'Tone.js');
const SAMPLES = [path.join(REPO, 'samples'), '/home/claude/terceros/tonejs-instruments/samples'];
fs.mkdirSync(OUT, { recursive: true });

// Servidor local, como Live Server.
const server = http.createServer((req, res) => {
  const f = path.join(REPO, decodeURIComponent(req.url.split('?')[0]));
  if (!f.startsWith(REPO) || !fs.existsSync(f) || fs.statSync(f).isDirectory()){ res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': f.endsWith('.html') ? 'text/html; charset=utf-8' : 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});

const results = [];
const check = (n, name, ok, info = '') => { results.push({ n, name, ok: !!ok, info: String(info) }); };
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function setup(context){
  const external = [];
  await context.route('**/*', route => {
    const u = route.request().url();
    if (u.startsWith('http://127.0.0.1')) return route.continue();
    if (/cdnjs\.cloudflare\.com\/.*\/Tone\.js$/.test(u)) return route.fulfill({ path: TONE, contentType: 'application/javascript' });
    const m = u.match(/tonejs-instruments\/samples\/guitar-(nylon|acoustic)\/([A-Za-z0-9]+\.mp3)$/);
    if (m){
      const local = path.join(SAMPLES[0], m[1], m[2]);
      const old = path.join(SAMPLES[1], 'guitar-' + m[1], m[2]);
      const f = fs.existsSync(local) ? local : old;
      return route.fulfill({ path: f, contentType: 'audio/mpeg' });
    }
    external.push(u); return route.abort();
  });
  return external;
}

async function newPage(context, errors){
  const page = await context.newPage();
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  page.on('dialog', d => d.accept());
  return page;
}

async function start(page, url){
  await page.goto(url);
  await page.click('#gate-btn');
  await page.waitForFunction(() => typeof samplerReady !== 'undefined' && samplerReady, null, { timeout: 15000 });
}

// Graba la salida de audio mientras suena una nota (MediaRecorder, en webm).
async function record(page, midi, file){
  const b64 = await page.evaluate(async (midi) => {
    const raw = Tone.getContext().rawContext;
    const dest = raw.createMediaStreamDestination();
    Tone.getDestination().connect(dest);
    const rec = new MediaRecorder(dest.stream), chunks = [];
    rec.ondataavailable = e => chunks.push(e.data);
    const done = new Promise(r => rec.onstop = r);
    rec.start(); await new Promise(r => setTimeout(r, 150));
    playMidi(midi, 1.4);
    await new Promise(r => setTimeout(r, 1500));
    rec.stop(); await done; Tone.getDestination().disconnect(dest);
    const buf = new Uint8Array(await new Blob(chunks).arrayBuffer());
    let s = ''; for (let i = 0; i < buf.length; i++) s += String.fromCharCode(buf[i]);
    return btoa(s);
  }, midi);
  fs.writeFileSync(file + '.webm', Buffer.from(b64, 'base64'));
  require('child_process').execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', file + '.webm', '-ac', '1', '-ar', '44100', file + '.wav']);
  return fs.statSync(file + '.wav').size;
}

(async () => {
  await new Promise(r => server.listen(5599, '127.0.0.1', r));
  const URL = 'http://127.0.0.1:5599/' + HTML;
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });

  // ---------------- Escritorio ----------------
  const errors = [];
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const external = await setup(ctx);
  const page = await newPage(ctx, errors);
  await start(page, URL);
  const cell = (midi, fret) => page.locator(`.fret-cell[data-midi="${midi}"][data-fret="${fret}"]`).first();

  // 12. Versión
  check(12, 'Ajustes muestra la versión', (await page.textContent('#app-version')) === 'Trasteando ' + await page.evaluate(() => APP_VERSION), await page.textContent('#app-version'));

  // 2. Suena al instante: de la pulsación a la orden de sonar
  await page.evaluate(() => {
    window.__t = {}; document.addEventListener('pointerdown', () => { __t.down = performance.now(); }, true);
    const orig = sampler.triggerAttackRelease.bind(sampler);
    sampler.triggerAttackRelease = (...a) => { __t.play = performance.now(); __t.when = a[2]; __t.now = Tone.immediate(); return orig(...a); };
  });
  await cell(45, 5).click();
  const lat = await page.evaluate(() => ({ ms: __t.play - __t.down, ahead: __t.when - __t.now }));
  check(2, 'La nota suena al instante', lat.ms < 30 && Math.abs(lat.ahead) < 0.02, `${lat.ms.toFixed(1)} ms hasta la orden; programada a ${(lat.ahead*1000).toFixed(1)} ms`);

  // 3. 1ª cuerda, trastes 12 y 24 en el pentagrama
  await cell(76, 12).click(); const s12 = await page.textContent('#staff');
  await cell(88, 24).click(); const s24 = await page.textContent('#staff');
  check(3, '1ª cuerda: traste 12 sin marca, 24 con 8va', !/8va|15ma/.test(s12) && /8va/.test(s24), `12: «${s12.replace(/\s+/g,' ').trim()}» · 24: «${s24.replace(/\s+/g,' ').trim()}»`);
  await page.screenshot({ path: path.join(OUT, 'escritorio-libre.jpg'), quality: 60, type: 'jpeg' });

  // 6. Nomenclatura pasados 3 s
  await cell(64, 0).click(); const n1 = await page.textContent('#note-name');
  await sleep(3000); await page.click('#qb-notation'); const n2 = await page.textContent('#note-name');
  check(6, 'Cambiar a C D E pasados 3 s cambia el nombre', n1 !== n2, `${n1} → ${n2}`);
  await page.click('#qb-notation');

  // 7. Zoom conserva el tramo
  const fretAtCenter = () => page.evaluate(() => { const s = document.getElementById('board-scroll');
    const fw = parseFloat(getComputedStyle(document.getElementById('board')).getPropertyValue('--fret-w'));
    return (s.scrollLeft + s.clientWidth/2 - NUT_W) / fw; });
  await page.click('#zoom-in'); await page.click('#zoom-in'); await page.click('#zoom-in'); await sleep(200);
  await page.evaluate(() => { const s = document.getElementById('board-scroll');
    const fw = parseFloat(getComputedStyle(document.getElementById('board')).getPropertyValue('--fret-w'));
    s.scrollLeft = 15 * fw + NUT_W - s.clientWidth/2; });
  await sleep(100); const c1 = await fretAtCenter();
  await page.click('#zoom-in'); await sleep(200); const c2 = await fretAtCenter();
  check(7, 'Hacer zoom sobre el traste 15 mantiene la vista', Math.abs(c1 - c2) < 0.6, `centro ${c1.toFixed(2)} → ${c2.toFixed(2)}`);

  // 1. Afinador sin mástil
  await page.click('.tab[data-screen="tuner"]'); await sleep(150);
  const vis = await page.evaluate(() => ({ board: document.getElementById('board-area').offsetParent !== null, tuner: document.getElementById('tuner').offsetParent !== null }));
  check(1, 'Al abrir Afinador desaparece el mástil', !vis.board && vis.tuner, JSON.stringify(vis));

  // 4. Bajar la 6ª al mínimo: 8vb en el pentagrama del afinador
  const minus6 = page.locator('#strings-tuner button[aria-label="Bajar la 6ª cuerda"]');
  for (let i = 0; i < 15; i++) await minus6.click();
  const ts = await page.textContent('#tuner-staff-svg');
  check(4, '6ª cuerda al mínimo: aparece 8vb', /8vb/.test(ts), (await page.evaluate(() => sciName(activeTuning()[0]))));
  await page.screenshot({ path: path.join(OUT, 'escritorio-afinador.jpg'), quality: 60, type: 'jpeg' });

  // 5. Acústica y Restablecer: vuelve la clásica
  await page.click('#btn-settings'); await sleep(300);
  await page.click('#set-timbre [data-v="acoustic"]');
  await page.waitForFunction(() => samplerTimbre === 'acoustic', null, { timeout: 15000 });
  await page.click('#set-reset');
  await page.waitForFunction(() => samplerTimbre === 'nylon' && state.timbre === 'nylon', null, { timeout: 15000 }).catch(() => {});
  const t5 = await page.evaluate(() => ({ state: state.timbre, sampler: samplerTimbre, tuning: state.tuningId, panelAbierto: document.getElementById('sheet').classList.contains('open') }));
  check(5, 'Acústica + Restablecer: vuelve a sonar la clásica', t5.state === 'nylon' && t5.sampler === 'nylon' && t5.tuning === 'standard', JSON.stringify(t5));
  await sleep(300);

  // 11. Numeración «Guía»
  const sheetOpen = await page.evaluate(() => document.getElementById('sheet').classList.contains('open'));
  if (!sheetOpen){ await page.click('#btn-settings'); await sleep(400); }
  await page.click('#set-fretnums [data-v="guide"]');
  const shown = await page.evaluate(() => [...document.querySelectorAll('.fret-num')].filter(e => getComputedStyle(e).visibility !== 'hidden' && e.textContent.trim()).map(e => e.textContent.trim()));
  check(11, 'Numeración en Guía: solo 3, 5, 7, 9, 12…', shown.join(',') === '3,5,7,9,12,15,17,19,21,24', shown.join(','));

  // 10. Ver todas las notas: en Libre sí, en Adivinar no
  await page.click('#set-showall');
  await page.keyboard.press('Escape'); await sleep(300);
  await page.click('.tab[data-screen="free"]'); await sleep(150);
  const visNames = () => page.evaluate(() => [...document.querySelectorAll('.fret-cell')].filter(c => {
      const t = c.querySelector('.dot'); if (!t) return false; const cs = getComputedStyle(t); return cs.opacity !== '0' && cs.visibility !== 'hidden' && cs.display !== 'none'; }).length);
  const libre = await visNames();
  await page.click('.tab[data-screen="guess"]'); await sleep(500);
  const adiv = await visNames();
  check(10, '«Ver todas las notas»: en Libre se ven, en Adivinar no', libre > 100 && adiv < 10, `celdas con nombre visible: Libre ${libre}, Adivinar ${adiv}`);
  await page.screenshot({ path: path.join(OUT, 'escritorio-adivinar.jpg'), quality: 60, type: 'jpeg' });

  // 9. Fallar en Adivinar
  await page.evaluate(() => { window.__plays = []; const o = playMidi; playMidi = (m, d) => { __plays.push(m); return o(m, d); }; });
  const target = await page.evaluate(() => challenge.midi);
  const wrongMidi = target === 45 ? 46 : 45;
  await page.locator(`.fret-cell[data-midi="${wrongMidi}"]`).first().click();
  await sleep(900);
  const f9 = await page.evaluate(t => ({ wrong: document.querySelectorAll('.fret-cell.wrong').length,
    reveal: document.querySelectorAll('.fret-cell.reveal').length, expected: positionsFor(t).length,
    text: document.getElementById('challenge-text').textContent, plays: __plays.slice() }), target);
  check(9, 'Fallo: se marca, se iluminan las correctas y suena la buscada', f9.wrong === 1 && f9.reveal === f9.expected && f9.plays.includes(target) && /Era/.test(f9.text), `${f9.reveal}/${f9.expected} iluminadas; sonaron ${f9.plays.join(', ')}; «${f9.text.trim()}»`);

  // 13. Récord y ajustes tras recargar
  await sleep(2600);
  const t13 = await page.evaluate(() => challenge.midi);
  await page.locator(`.fret-cell[data-midi="${t13}"]`).first().click(); await sleep(200);
  const before = await page.evaluate(() => ({ record: state.record, fretNums: state.fretNums, showAll: state.showAllNotes }));
  await page.reload(); await page.click('#gate-btn'); await sleep(500);
  const after = await page.evaluate(() => ({ record: state.record, fretNums: state.fretNums, showAll: state.showAllNotes }));
  check(13, 'El récord y los ajustes sobreviven a recargar', before.record >= 1 && JSON.stringify(before) === JSON.stringify(after), `${JSON.stringify(before)} → ${JSON.stringify(after)}`);

  // 8. Ventana estrecha y zoom al mínimo
  await page.setViewportSize({ width: 420, height: 800 }); await sleep(300);
  await page.click('.tab[data-screen="free"]');
  for (let i = 0; i < 25; i++){ if (await page.isDisabled('#zoom-out')) break; await page.click('#zoom-out'); }
  const z = await page.evaluate(() => { const s = document.getElementById('board-scroll');
    const fw = parseFloat(getComputedStyle(document.getElementById('board')).getPropertyValue('--fret-w'));
    return { label: document.getElementById('zoom-label').textContent, fits: (s.clientWidth - LABEL_W - NUT_W) / fw }; });
  const said = parseInt(z.label) || 24;
  check(8, 'Ventana estrecha: la etiqueta dice los trastes que caben', said <= z.fits + 0.05 && said >= Math.floor(z.fits) - 0.05, `«${z.label}»; caben ${z.fits.toFixed(2)}`);

  // 15. Afinación real del sonido: 1ª cuerda, trastes 7, 8 y 12 en clásica
  await page.setViewportSize({ width: 1280, height: 800 });
  const recs = {};
  for (const [fret, midi] of [[7, 71], [8, 72], [12, 76]]) recs[fret] = await record(page, midi, path.join(OUT, 'nylon-' + midi));
  check(15, 'Grabadas las notas de los trastes 7, 8 y 12 (se miden aparte)', Object.values(recs).every(n => n > 50000), JSON.stringify(recs));

  // 14. Recorrido sin errores
  for (const s of ['free', 'guess', 'tuner', 'free']){ await page.click(`.tab[data-screen="${s}"]`); await sleep(300); }
  await page.click('#btn-settings'); await sleep(300); await page.keyboard.press('Escape');
  check(14, 'Recorrido completo sin errores en la consola', errors.length === 0 && external.length === 0, errors.concat(external).join(' | ') || 'ninguno');
  await ctx.close();

  // ---------------- iPhone (emulado en Chromium) ----------------
  const ierr = [];
  for (const [name, dev] of [['iphone', devices['iPhone 13']], ['iphone-apaisado', devices['iPhone 13 landscape']]]){
    const ictx = await browser.newContext({ ...dev });
    await setup(ictx);
    const ip = await newPage(ictx, ierr);
    await start(ip, URL);
    await ip.locator('.fret-cell[data-midi="60"]').first().tap();
    await sleep(300);
    await ip.screenshot({ path: path.join(OUT, name + '.jpg'), quality: 60, type: 'jpeg' });
    const m = await ip.evaluate(() => ({ visibles: maxVisibleFrets(), ancho: innerWidth, alto: innerHeight,
      cuerda: document.querySelector('.fret-cell').getBoundingClientRect().height }));
    check('M', `Móvil (${name}): abre, suena y se pulsa sin errores`, ierr.length === 0, `${m.ancho}×${m.alto}, alto de cuerda ${m.cuerda.toFixed(0)} px, caben hasta ${m.visibles} trastes`);
    await ictx.close();
  }

  await browser.close(); server.close();
  fs.writeFileSync(path.join(OUT, 'resultados.json'), JSON.stringify(results, null, 1));
  for (const r of results.sort((a, b) => (typeof a.n === 'number' ? a.n : 99) - (typeof b.n === 'number' ? b.n : 99)))
    console.log(`${r.ok ? 'OK   ' : 'FALLA'} ${String(r.n).padStart(2)} ${r.name} — ${r.info}`);
})().catch(e => { console.error('ERROR', e); server.close(); process.exit(1); });
