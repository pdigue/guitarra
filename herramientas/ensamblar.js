// Une index.html con su estilo (css/) y su código (js/) en una sola página.
// Desde la 0.4.0 (F4.1) la app vive en varios archivos para poder trabajarla por
// temas; el navegador los carga uno a uno, pero el archivo autónomo
// (dist/trasteando.html) tiene que ser uno solo para abrir con doble clic.
//
// Uso:
//   node herramientas/ensamblar.js [index.html]      → escribe la página en la salida
//   const { ensamblar, scripts } = require('./ensamblar')
//
// No necesita instalar nada. Lo usan generar-autonomo.py y el banco de pruebas,
// así que los dos ven exactamente la misma página.
'use strict';
const fs = require('fs');
const path = require('path');

// El «?v=…» del final (la versión, para la caché del navegador) no es parte del nombre.
const RE_CSS = /<link rel="stylesheet" href="(css\/[^"?]+)(?:\?[^"]*)?">/g;
const RE_JS = /<script src="(js\/[^"?]+)(?:\?[^"]*)?"><\/script>/g;

const leer = (base, rel) => fs.readFileSync(path.join(base, rel), 'utf8').replace(/\r\n/g, '\n');

/** La página con el CSS y el JS dentro. */
function ensamblar(htmlPath){
  const base = path.dirname(htmlPath);
  return leer(base, path.basename(htmlPath))
    .replace(RE_CSS, (_, rel) => '<style>\n' + leer(base, rel) + '</style>')
    .replace(RE_JS, (_, rel) => '<script>\n' + leer(base, rel) + '</script>');
}

/** [{ nombre, codigo }] de cada script, en orden. Con una página de un solo
 *  archivo (versiones anteriores a la 0.4.0), su único <script>. */
function scripts(htmlPath){
  const base = path.dirname(htmlPath);
  const html = leer(base, path.basename(htmlPath));
  const sueltos = [...html.matchAll(RE_JS)].map(m => ({ nombre: m[1], codigo: leer(base, m[1]) }));
  if (sueltos.length) return sueltos;
  return [{ nombre: path.basename(htmlPath), codigo: html.split('<script>\n', 2)[1].split('</script>')[0] }];
}

module.exports = { ensamblar, scripts };

if (require.main === module){
  const html = process.argv[2] || path.join(__dirname, '..', 'index.html');
  process.stdout.write(ensamblar(path.resolve(html)));
}
