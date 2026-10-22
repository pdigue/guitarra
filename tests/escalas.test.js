// Banco de la teoría de escalas (F5.1 y F5.2). Se ejecuta con el resto: node --test
// Lo que se comprueba es música, no código: que cada escala se escribe como en
// cualquier libro de solfeo. Referencia: el círculo de quintas.
'use strict';
const assert = require('node:assert/strict');
const path = require('path');
// Como banco.test.js, se pasa también contra el archivo autónomo desde
// autonomo.test.js; `test` pone allí «[autónomo]» delante de cada nombre (G-08, F6.1).
const { boot, test } = require('./dom-minimo');
const APP = process.env.APP_HTML || path.join(__dirname, '..', 'index.html');

const A = boot(APP);
const ev = js => JSON.parse(A.ev('JSON.stringify(' + js + ')'));
const escala = (id, pc, notacion = 'anglo') =>
  ev(`(() => { state.notation = '${notacion}'; const e = ESCALAS.find(e => e.id === '${id}');
               return escribirEscala(${pc}, e).map(nombreEscrito).join(' '); })()`);

test('Si♭ y La♯ suenan igual pero se escriben distinto (F5.1)', () => {
  assert.equal(ev("(state.notation = 'latin', nombreEscrito(escribir(10, 6)))"), 'Si♭');
  assert.equal(ev("(state.notation = 'latin', nombreEscrito(escribir(10, 5)))"), 'La♯');
  assert.equal(ev('pcEscrita(escribir(10, 6))'), ev('pcEscrita(escribir(10, 5))'));
  assert.equal(ev('octavaEscrita({ letra: 6, alt: 1 }, 60)'), 3, 'Si♯3 es el Do4 que suena');
});

test('cada escala mayor y menor de las 12 tónicas usa siete letras distintas y sus sonidos son los del patrón (F5.1)', () => {
  for (const id of ['mayor', 'menor'])
    for (let pc = 0; pc < 12; pc++){
      const r = ev(`(() => { const e = ESCALAS.find(e => e.id === '${id}'); const n = escribirEscala(${pc}, e);
        return { letras: n.map(x => x.letra), pcs: n.map(pcEscrita), alts: n.map(x => x.alt), pat: e.semitonos }; })()`);
      assert.equal(new Set(r.letras).size, 7, `${id} ${pc}: letras ${r.letras}`);
      assert.deepEqual(r.pcs, r.pat.map(s => (pc + s) % 12), `${id} ${pc}: sonidos`);
      assert.ok(r.alts.every(a => Math.abs(a) <= 1), `${id} ${pc}: sin dobles alteraciones`);
      assert.ok(!(r.alts.includes(1) && r.alts.includes(-1)), `${id} ${pc}: no mezcla ♯ y ♭`);
    }
});

test('las tonalidades salen como en el libro: círculo de quintas (F5.2)', () => {
  const ref = {
    'mayor 0': 'C D E F G A B', 'mayor 7': 'G A B C D E F♯', 'mayor 5': 'F G A B♭ C D E',
    'mayor 1': 'D♭ E♭ F G♭ A♭ B♭ C', 'mayor 6': 'F♯ G♯ A♯ B C♯ D♯ E♯', 'mayor 10': 'B♭ C D E♭ F G A',
    'mayor 11': 'B C♯ D♯ E F♯ G♯ A♯', 'mayor 8': 'A♭ B♭ C D♭ E♭ F G',
    'menor 9': 'A B C D E F G', 'menor 4': 'E F♯ G A B C D', 'menor 2': 'D E F G A B♭ C',
    'menor 0': 'C D E♭ F G A♭ B♭', 'menor 3': 'D♯ E♯ F♯ G♯ A♯ B C♯', 'menor 8': 'G♯ A♯ B C♯ D♯ E F♯',
    'menor 10': 'B♭ C D♭ E♭ F G♭ A♭', 'menor 6': 'F♯ G♯ A B C♯ D E'
  };
  for (const [k, v] of Object.entries(ref)){ const [id, pc] = k.split(' '); assert.equal(escala(id, pc), v, k); }
});

test('pentatónicas: cinco notas, las de su escala mayor o menor (F5.2)', () => {
  assert.equal(escala('pentaMayor', 0), 'C D E G A');
  assert.equal(escala('pentaMayor', 5), 'F G A C D');
  assert.equal(escala('pentaMenor', 9), 'A C D E G');
  assert.equal(escala('pentaMenor', 2), 'D F G A C');
  assert.equal(escala('pentaMenor', 4, 'latin'), 'Mi Sol La Si Re');
  for (let pc = 0; pc < 12; pc++){
    const pm = escala('pentaMayor', pc).split(' '), m = escala('mayor', pc).split(' ');
    assert.ok(pm.every(n => m.includes(n)), `pentatónica mayor ${pc} ⊂ mayor`);
    const pn = escala('pentaMenor', pc).split(' '), n = escala('menor', pc).split(' ');
    assert.ok(pn.every(x => n.includes(x)), `pentatónica menor ${pc} ⊂ menor`);
  }
});

test('intervalos: T T ST T T T ST en la mayor; T ST T T ST T T en la menor (E-04)', () => {
  assert.equal(ev("intervalosEscala(ESCALAS[0]).join(' ')"), 'T T ST T T T ST');
  assert.equal(ev("intervalosEscala(ESCALAS[1]).join(' ')"), 'T ST T T ST T T');
  assert.equal(ev("intervalosEscala(ESCALAS[2]).join(' ')"), 'T T T½ T T½');
  assert.equal(ev("intervalosEscala(ESCALAS[3]).join(' ')"), 'T½ T T T½ T');
});
