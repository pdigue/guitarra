// Pruebas de los documentos vivos (baseline 0.6.2, 15/11). No arrancan la app, así
// que no van en autonomo.test.js: solo leen archivos del repositorio.
//
// 1. El baseline conserva lo que había: cada requisito del histórico (requisitos
//    v1.27 y matriz v1.25, en docs/historico/) sigue existiendo, y su texto, su
//    estado, su criterio y su evidencia no cambian salvo que el control de cambios
//    de requisitos.md lo declare (la lista de ID de cada versión, en CAMBIOS de
//    herramientas/documentos/generar-requisitos.py). Así ningún cambio pasa sin avisar.
// 2. Las versiones que se citan unos documentos a otros cuadran: la app, requisitos,
//    matriz, roadmap, CHANGELOG y ESTADO dicen lo mismo. (El roadmap solo dice la
//    suya, que requisitos, matriz y ESTADO citan: se actualiza al cerrar cada bloque.)
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const leer = (...p) => fs.readFileSync(path.join(RAIZ, ...p), 'utf8');

// Filas de la matriz en texto: «| **ID** | etapa | método | criterio | … |», por ID.
function filasMatriz(md) {
  const m = new Map();
  for (const l of md.split('\n')) {
    const r = l.match(/^\| \*\*([A-Z]+-[0-9A-Za-z-]+)\*\* \|/);
    if (r) m.set(r[1], l);
  }
  return m;
}

test('el baseline conserva todos los ID, textos, estados y criterios del histórico (salvo cambios declarados)', () => {
  const viejo = JSON.parse(leer('docs', 'historico', 'requisitos-v1.27.json'));
  const nuevo = JSON.parse(leer('herramientas', 'documentos', 'requisitos.json'));
  const declarados = new Set(nuevo.cambios.flatMap(c => c.ids));
  const porId = new Map(nuevo.reqs.map(r => [r.id, r]));

  const faltan = viejo.reqs.filter(r => !porId.has(r.id)).map(r => r.id);
  assert.deepEqual(faltan, [], 'requisitos del histórico que han desaparecido');

  const cambiados = [];
  for (const r of viejo.reqs) {
    if (declarados.has(r.id)) continue;
    const n = porId.get(r.id);
    for (const k of ['text', 'prio', 'etapa', 'impl', 'valid', 'cat'])
      if (n[k] !== r[k]) cambiados.push(`${r.id}.${k}`);
    // «Desde» es la versión en que se implementó; en 13 requisitos llevaba pegada la
    // nota de la Sesión 1, que el baseline pasó a «Notas». Se compara la versión.
    if ((n.desde || '').split(' ')[0] !== (r.desde || '').split(' ')[0]) cambiados.push(`${r.id}.desde`);
  }
  assert.deepEqual(cambiados, [], 'cambian sin estar en el control de cambios de requisitos.md');

  const mv = filasMatriz(leer('docs', 'historico', 'matriz-cumplimiento.md'));
  const mn = filasMatriz(leer('docs', 'matriz-cumplimiento.md'));
  assert.equal(mv.size, viejo.reqs.length, 'la matriz histórica tiene una fila por requisito');
  const distintas = [...mv].filter(([id, fila]) => !declarados.has(id) && mn.get(id) !== fila).map(([id]) => id);
  assert.deepEqual(distintas, [], 'filas de la matriz (método, criterio, evidencia, verificación) que cambian sin declararlo');
});

test('las versiones citadas entre documentos cuadran (app, requisitos, matriz, roadmap, CHANGELOG, ESTADO)', () => {
  const app = leer('js', '01-teoria.js').match(/APP_VERSION = '([\d.]+)'/)[1];
  const { versiones: v } = JSON.parse(leer('herramientas', 'documentos', 'requisitos.json'));
  const req = leer('docs', 'requisitos.md');
  const mat = leer('docs', 'matriz-cumplimiento.md');
  const road = leer('docs', 'roadmap.md');
  const log = leer('CHANGELOG.md');
  const estado = leer('docs', 'ESTADO.md');
  const tiene = (doc, nombre, trozo) => assert.ok(doc.includes(trozo), `${nombre} debería decir «${trozo}»`);

  assert.equal(v.app, app, 'requisitos (APP_V en generar-requisitos.py) cita otra versión de la app');
  tiene(req, 'requisitos.md', `**Versión del documento:** ${v.doc} `);
  tiene(req, 'requisitos.md', `app \`${app}\` · \`roadmap.md\` v${v.roadmap} · \`matriz-cumplimiento\` v${v.matriz}`);
  tiene(mat, 'matriz-cumplimiento.md', `**Versión:** ${v.matriz} `);
  tiene(mat, 'matriz-cumplimiento.md', `\`requisitos.md\` v${v.doc} · app \`${app}\` · \`roadmap.md\` v${v.roadmap}`);
  tiene(road, 'roadmap.md', `**Versión:** ${v.roadmap} `);
  // El roadmap no cita a los demás: se pone al día al cerrar cada bloque, no en cada versión.
  const ultima = (log.match(/^## \[(\d+\.\d+\.\d+)\]/m) || [])[1];
  assert.equal(ultima, app, 'la entrada más reciente de CHANGELOG.md no es la versión de la app');
  tiene(log, 'CHANGELOG.md', `| **${app}** |`);
  const linea = estado.split('\n').find(l => l.startsWith('**Documentos:**')) || '';
  assert.ok(linea.includes(`requisitos v${v.doc}`) && linea.includes(`matriz v${v.matriz}`) && linea.includes(`roadmap v${v.roadmap}`),
    `ESTADO.md dice «${linea}»; debería citar requisitos v${v.doc}, matriz v${v.matriz} y roadmap v${v.roadmap}`);
});
