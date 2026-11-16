// Banco de lo que hace instalable la app (G-04, F6.3): el manifiesto y sus iconos.
// Se ejecuta con el resto: node --test
// Qué es un manifiesto: un archivo JSON que le dice al navegador cómo se llama la
// app, con qué icono y cómo se abre (a pantalla completa, sin barra de direcciones).
// Con él, más un Service Worker y https, Chrome ofrece «Instalar». El iPhone lo usa
// para el nombre y la forma de abrirse, pero el icono lo toma de apple-touch-icon.
// No arranca la app, así que no se repite contra el autónomo.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');
const fs = require('fs');

const RAIZ = path.join(__dirname, '..');
const leer = f => fs.readFileSync(path.join(RAIZ, f), 'utf8');
const manifiesto = () => JSON.parse(leer('manifest.webmanifest'));

/** Ancho, alto y si tiene transparencia, leídos de la cabecera del PNG (IHDR). */
function cabeceraPNG(rel){
  const b = fs.readFileSync(path.join(RAIZ, rel));
  assert.equal(b.toString('latin1', 1, 4), 'PNG', rel + ' no es un PNG');
  // Tipo de color 4 o 6: con canal alfa (transparencia).
  return { ancho: b.readUInt32BE(16), alto: b.readUInt32BE(20), alfa: [4, 6].includes(b[25]) };
}

test('el manifiesto tiene lo que Chrome pide para instalar y abre a pantalla completa (G-04)', () => {
  const m = manifiesto();
  assert.equal(m.name, 'Trasteando');
  assert.ok(m.short_name && m.short_name.length <= 12, 'el nombre bajo el icono, corto');
  assert.equal(m.display, 'standalone', 'sin barra de direcciones');
  // Relativos: la web de pruebas vive en /guitarra/, no en la raíz del servidor.
  assert.equal(m.start_url, './');
  assert.equal(m.scope, './');
  assert.equal(m.id, './');
  assert.equal(m.lang, 'es');
  // Los mismos colores que la página, para que al abrir no haya un fogonazo de otro color.
  const tema = leer('index.html').match(/<meta name="theme-color" content="([^"]+)">/)[1];
  assert.equal(m.theme_color, tema);
  assert.equal(m.background_color, tema);
});

test('cada icono del manifiesto existe, es un PNG y mide lo que dice; hay 192, 512 y uno «maskable» (G-04)', () => {
  const iconos = manifiesto().icons;
  for (const i of iconos){
    assert.equal(i.type, 'image/png');
    const [ancho, alto] = i.sizes.split('x').map(Number);
    const png = cabeceraPNG(i.src);
    assert.deepEqual([png.ancho, png.alto], [ancho, alto], i.src);
  }
  const de = (lado, uso) => iconos.some(i => i.sizes === lado + 'x' + lado && i.purpose === uso);
  assert.ok(de(192, 'any') && de(512, 'any'), 'Chrome exige 192 y 512 px');
  assert.ok(de(512, 'maskable'), 'Android lo recorta a su forma: necesita uno a sangre');
  // El «maskable» va a sangre: sin transparencia, el fondo hasta los bordes.
  assert.equal(cabeceraPNG(iconos.find(i => i.purpose === 'maskable').src).alfa, false);
});

test('la página enlaza el manifiesto y el icono del iPhone, de 180 px y sin transparencia (G-04)', () => {
  const html = leer('index.html');
  assert.match(html, /^<link rel="manifest" href="manifest\.webmanifest">$/m);
  const apple = html.match(/^<link rel="apple-touch-icon" href="([^"]+)">$/m);
  assert.ok(apple, 'el iPhone no usa los iconos del manifiesto');
  const png = cabeceraPNG(apple[1]);
  assert.deepEqual([png.ancho, png.alto], [180, 180]);
  assert.equal(png.alfa, false, 'el iPhone pinta de negro lo transparente');
  assert.ok(!/data:application\/manifest/.test(html), 'ya no queda el manifiesto incrustado');
});

test('el icono de la pestaña es el mismo dibujo que iconos/icono.svg, del que salen los PNG', () => {
  const html = leer('index.html');
  const enLinea = html.match(/<link rel="icon" href='data:image\/svg\+xml;utf8,([^']+)'>/)[1];
  assert.equal(enLinea.replace(/%23/g, '#'), leer('iconos/icono.svg').trim(),
    'si cambias el dibujo, cámbialo en los dos sitios y vuelve a generar los PNG (herramientas/generar-iconos.js)');
});

test('el archivo autónomo no lleva manifiesto ni icono del iPhone: desde el disco no se instala', () => {
  const { ensamblar } = require('../herramientas/ensamblar');
  const pagina = ensamblar(path.join(RAIZ, 'index.html'));
  assert.ok(!/rel="manifest"/.test(pagina));
  assert.ok(!/rel="apple-touch-icon"/.test(pagina));
  assert.match(pagina, /<link rel="icon" href='data:image\/svg/, 'el de la pestaña sí, que va dentro');
});
