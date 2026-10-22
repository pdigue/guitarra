// Segunda pasada del banco de pruebas: las mismas pruebas de banco.test.js, pero
// contra el archivo autónomo, dist/trasteando.html (G-08, F6.1).
//
// Por qué: la app existe en dos formas. Para trabajarla, el código vive en varios
// archivos (index.html, css/ y js/): es el «código fuente». Para llevársela y
// abrirla con doble clic, herramientas/generar-autonomo.py los une en uno solo con
// el audio dentro: es el «artefacto distribuible». banco.test.js ya comprueba que
// el autónomo es una copia exacta de la app; esta pasada comprueba además que esa
// copia funciona, es decir, que se comporta igual que la app de la que sale.
//
// node --test ejecuta cada archivo *.test.js en su propio proceso, así que las
// variables de entorno que se ponen aquí no afectan a la primera pasada.
'use strict';
const path = require('path');
const DIST = path.join(__dirname, '..', 'dist');
process.env.APP_HTML = path.join(DIST, 'trasteando.html');
process.env.TRASTEANDO_FORMA = 'autónomo';
require('./banco.test.js');

// Y una prueba que solo tiene sentido aquí: la app del autónomo encuentra dentro de
// la página sus grabaciones, exactamente las que generó la herramienta (sus huellas
// sha256 están en dist/autonomo.json), y no intenta descargar ninguna: sin conexión
// y con doble clic no podría.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const crypto = require('crypto');
const { boot } = require('./dom-minimo');

test('[autónomo] la app lee de dentro de la página sus grabaciones, las generadas, y no descarga ninguna (G-07, G-08)', async () => {
  const informe = JSON.parse(fs.readFileSync(path.join(DIST, 'autonomo.json'), 'utf8'));
  const A = boot(process.env.APP_HTML);
  // Se cuentan las descargas y se guarda lo que la app lee antes de decodificarlo
  // (decodificar de verdad necesita un altavoz, que el banco no tiene).
  A.ev(`globalThis.__descargas = 0; globalThis.__leidas = [];
    fetchAndDecode = async () => { __descargas++; return null; };
    decodeData = async datos => {
      __leidas.push(datos);
      return { sampleRate: 44100, getChannelData: () => new Float32Array(10).fill(0.5) };
    };`);
  for (const timbre of ['nylon', 'acoustic']) assert.equal(await A.ev(`loadSamples('${timbre}')`), true, timbre);
  assert.equal(A.ev('__descargas'), 0, 'ha intentado descargar audio');
  // Array.from: el array viene del contexto de la app, y deepEqual lo daría por distinto.
  const huellas = Array.from(A.ev('__leidas'), d => crypto.createHash('sha256').update(new Uint8Array(d)).digest('hex'));
  assert.deepEqual(huellas.sort(), informe.muestras.map(m => m.sha256).sort());
});
