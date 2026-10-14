// Banco de pruebas de Trasteando. Se ejecuta desde la carpeta del proyecto con:  node --test
// (Node busca solo los archivos *.test.js; no hace falta instalar nada).
// Cada prueba cita los requisitos que verifica (ver docs/matriz-cumplimiento.md).
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const { boot, sleep } = require('./dom-minimo');

const APP = path.join(__dirname, '..', 'index.html');
const sinErrores = A => A.errors.filter(e => !/AudioContext|muestras/.test(e));

test('arranque: mástil, numeración, versión y panel (D-01, G-10)', () => {
  const A = boot(APP);
  assert.equal(A.doc.querySelectorAll('.fret-cell').length, 150, '6 cuerdas × 25 posiciones');
  assert.equal(A.doc.querySelectorAll('.fret-num').length, 25);
  assert.equal(A.$('app-version').textContent, 'Trasteando ' + A.ev('APP_VERSION'));
  assert.match(A.ev('APP_VERSION'), /^\d+\.\d+\.\d+$/);
  assert.equal(A.$('sheet').inert, true, 'el panel de ajustes nace inerte');
  assert.equal(A.ev('state.fretNums'), 'all');
  assert.ok(!A.$('fret-nums').classList.contains('hidden'));
  assert.deepEqual(sinErrores(A), []);
});

test('migración de ajustes de la 0.1.1 (C-05, D-04)', () => {
  const B = boot(APP, { showFretNums: false, record: 7 });
  assert.equal(B.ev('state.fretNums'), 'none');
  assert.ok(B.$('fret-nums').classList.contains('hidden'));
  assert.equal(B.ev('state.record'), 7);
  assert.equal(B.ev('"showFretNums" in state'), false);
});

test('ajustes corruptos no rompen la app (C-05)', () => {
  const B = boot(APP, { tuningId: 'no-existe', customTuning: [1, 2], notation: 'x', visibleFrets: 999, record: -3 });
  assert.equal(B.ev('state.tuningId'), 'standard');
  assert.equal(B.ev('state.customTuning.length'), 6);
  assert.equal(B.ev('state.notation'), 'latin');
  assert.equal(B.ev('state.record'), 0);
});

test('numeración en tres modos (D-04, V-09)', () => {
  const A = boot(APP);
  const nums = A.$('fret-nums');
  A.doc.querySelector('#set-fretnums [data-v="guide"]').click();
  assert.ok(nums.classList.contains('guide') && !nums.classList.contains('hidden'));
  assert.equal(JSON.parse(A.store.get('trasteando.v1')).fretNums, 'guide');
  assert.equal(A.doc.querySelector('#set-fretnums [data-v="guide"]').getAttribute('aria-pressed'), 'true');
  A.doc.querySelector('#set-fretnums [data-v="none"]').click();
  assert.ok(nums.classList.contains('hidden') && !nums.classList.contains('guide'));
});

test('«ver todas las notas» no se aplica en Adivinar (L-02, J-12)', () => {
  const A = boot(APP);
  A.$('set-showall').click();
  assert.ok(A.$('board').classList.contains('show-all'));
  A.doc.querySelector('.tab[data-screen="guess"]').click();
  assert.ok(!A.$('board').classList.contains('show-all'));
  A.doc.querySelector('.tab[data-screen="free"]').click();
  assert.ok(A.$('board').classList.contains('show-all'));
});

test('Adivinar: fallo, revelación y reto nuevo (J-07, J-10)', async () => {
  const A = boot(APP);
  A.doc.querySelector('.tab[data-screen="guess"]').click();
  await sleep(400);
  const target = A.ev('challenge');
  const wrong = A.doc.querySelectorAll('.fret-cell').find(c => +c.dataset.midi !== target.midi);
  A.press(wrong);
  assert.equal(A.ev('streak'), 0);
  assert.ok(wrong.classList.contains('wrong'));
  assert.match(A.$('challenge-text').innerHTML, /Era/);
  await sleep(800);
  const reveals = A.doc.querySelectorAll('.fret-cell.reveal');
  assert.equal(reveals.length, A.ev('positionsFor(challenge.midi).length'));
  assert.ok(reveals.length > 0 && reveals.every(c => +c.dataset.midi === target.midi));
  assert.equal(A.ev('locked'), true, 'durante la revelación no se puede volver a fallar');
  await sleep(2500);
  assert.notEqual(A.ev('challenge'), target);
  assert.equal(A.doc.querySelectorAll('.fret-cell.reveal, .fret-cell.wrong').length, 0);
  assert.doesNotMatch(A.$('challenge-text').innerHTML, /Era/, 'el reto nuevo arranca limpio');
});

test('Adivinar: acierto en cualquier posición y récord guardado (J-02, J-07, J-08)', async () => {
  const A = boot(APP);
  A.doc.querySelector('.tab[data-screen="guess"]').click();
  await sleep(400);
  const midi = A.ev('challenge.midi');
  const cells = A.doc.querySelectorAll('.fret-cell').filter(c => +c.dataset.midi === midi);
  A.press(cells[cells.length - 1]);
  assert.equal(A.ev('streak'), 1);
  assert.ok(JSON.parse(A.store.get('trasteando.v1')).record >= 1);
});

test('arrastrar el mástil no cuenta como pulsación en Adivinar (AUD-02)', async () => {
  const A = boot(APP);
  A.doc.querySelector('.tab[data-screen="guess"]').click();
  await sleep(400);
  const midi = A.ev('challenge.midi');
  const other = A.doc.querySelectorAll('.fret-cell').find(c => +c.dataset.midi !== midi);
  A.press(other, true);
  assert.equal(A.ev('streak'), 0);
  assert.ok(!other.classList.contains('wrong'));
});

test('cambiar de afinación durante una revelación no revela el reto nuevo (A-10, D-02)', async () => {
  const A = boot(APP);
  A.doc.querySelector('.tab[data-screen="guess"]').click();
  await sleep(400);
  const t = A.ev('challenge');
  A.press(A.doc.querySelectorAll('.fret-cell').find(c => +c.dataset.midi !== t.midi));
  await sleep(200);
  const sel = A.$('set-tuning'); sel.value = 'dropd'; sel.dispatchEvent({ type: 'change', target: sel });
  await sleep(1000);
  assert.equal(A.doc.querySelectorAll('.fret-cell.reveal').length, 0);
  assert.equal(A.doc.querySelectorAll('.string-label').map(l => l.textContent).join(' '), 'Mi Si Sol Re La Re');
});

test('restablecer vuelve a los valores por defecto (C-05)', async () => {
  const A = boot(APP);
  A.doc.querySelector('#set-fretnums [data-v="none"]').click();
  A.$('set-reset').click();
  await sleep(50);
  assert.equal(A.ev('state.tuningId'), 'standard');
  assert.equal(A.ev('state.fretNums'), 'all');
});

test('pentagrama: ninguna nota del rango posible se sale del dibujo (P-01)', () => {
  const A = boot(APP);
  const fuera = A.ev(`(() => { let n = 0;
    for (let m = MIN_TUNING_MIDI; m <= MAX_TUNING_MIDI + NUM_FRETS; m++){
      const y = staffY(fitOctave(m).drawMidi); if (y < 4 || y > 124) n++; }
    return n; })()`);
  assert.equal(fuera, 0);
});
