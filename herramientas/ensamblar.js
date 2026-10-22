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

// Desde la 0.6.0 (F6.1) cada módulo incrustado termina con «//# sourceURL=js/…».
// Es un estándar de las herramientas de desarrollo de los navegadores (y de Node):
// da nombre a un código que no viene de un archivo propio. Así, un error dentro del
// archivo autónomo dice «js/03-audio.js, línea 86» y no «trasteando.html, línea 2000»,
// y el banco puede volver a separar los módulos para ejecutarlos uno a uno.
const nombrar = rel => '//# sourceURL=' + rel + '\n';
// Si un módulo no acabara en salto de línea, el nombre se pegaría a su última línea.
const conSalto = codigo => codigo.endsWith('\n') ? codigo : codigo + '\n';
const RE_INCRUSTADO = /<script>\n([\s\S]*?)<\/script>/g;
const RE_NOMBRE = /\/\/# sourceURL=(\S+)\n$/;

/** El contenido de un archivo que va a ir dentro de <script> o <style>. Si contuviera
 *  «</script» (o «</style»), el navegador daría la etiqueta por cerrada ahí y cortaría
 *  el código: como archivo suelto funciona, pero dentro del autónomo no. Mejor que la
 *  construcción se pare con un aviso claro que fabricar un archivo roto (F6.1). */
function incrustable(base, rel, etiqueta){
  const codigo = leer(base, rel);
  const linea = codigo.split('\n').findIndex(l => l.toLowerCase().includes('</' + etiqueta));
  if (linea >= 0) throw new Error(`${rel}, línea ${linea + 1}: contiene «</${etiqueta}», que cortaría el archivo autónomo. ` +
    `Escríbelo partido, por ejemplo '<\\/${etiqueta}>'.`);
  return codigo;
}

/** La página con el CSS y el JS dentro. */
function ensamblar(htmlPath){
  const base = path.dirname(htmlPath);
  return leer(base, path.basename(htmlPath))
    .replace(RE_CSS, (_, rel) => '<style>\n' + incrustable(base, rel, 'style') + '</style>')
    .replace(RE_JS, (_, rel) => '<script>\n' + conSalto(incrustable(base, rel, 'script')) + nombrar(rel) + '</script>');
}

/** [{ nombre, codigo }] de cada script de la app, en orden, en cualquiera de sus
 *  dos formas: la de varios archivos (index.html y js/) o la de un solo archivo
 *  (el autónomo, o index.html antes de la 0.4.0). Los bloques de audio incrustado
 *  (<script type="application/octet-stream">) no son código y no se incluyen. */
function scripts(htmlPath){
  const base = path.dirname(htmlPath);
  const html = leer(base, path.basename(htmlPath));
  const sueltos = [...html.matchAll(RE_JS)].map(m => ({ nombre: m[1], codigo: leer(base, m[1]) }));
  if (sueltos.length) return sueltos;
  return [...html.matchAll(RE_INCRUSTADO)].map((m, i) => ({
    nombre: (m[1].match(RE_NOMBRE) || [])[1] || `${path.basename(htmlPath)} (bloque ${i + 1})`,
    codigo: m[1]
  }));
}

module.exports = { ensamblar, scripts };

if (require.main === module){
  const html = process.argv[2] || path.join(__dirname, '..', 'index.html');
  try { process.stdout.write(ensamblar(path.resolve(html))); }
  catch (e){ console.error('ensamblar.js: ' + e.message); process.exit(1); }   // solo el aviso, sin la traza
}
