// Genera los iconos PNG de la app (G-04, F6.3) a partir de iconos/icono.svg,
// que es el único dibujo: si se cambia, se vuelve a ejecutar esto.
// Herramienta de desarrollo: necesita Playwright con Chromium (como las de
// comprobar-*.js). La app no la usa: solo lee los PNG ya generados.
// Uso, desde la carpeta del proyecto: node herramientas/generar-iconos.js
//
// Por qué cuatro archivos:
// - icono-192.png e icono-512.png («any»): los que pide el manifiesto para
//   instalar la app (Chrome exige al menos 192 y 512 px). Con las esquinas
//   redondeadas del dibujo y fondo transparente fuera de ellas.
// - icono-maskable-512.png («maskable»): Android recorta el icono con la forma
//   que quiera (círculo, gota…). Por eso va «a sangre» (fondo hasta los bordes,
//   sin esquinas) y el dibujo cabe en el círculo central del 80 % (la «zona
//   segura»): las cuerdas llegan a 56 de 90 px del centro, y el límite es 72.
// - apple-touch-icon.png (180 px): el iPhone no usa el manifiesto para el icono
//   ni acepta SVG; redondea él las esquinas y pinta de negro lo transparente,
//   así que también va a sangre.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const SVG = fs.readFileSync(path.join(RAIZ, 'iconos', 'icono.svg'), 'utf8');
// La versión a sangre: el mismo dibujo con el fondo sin redondear.
const A_SANGRE = SVG.replace(/<rect([^>]*) rx="\d+"/, '<rect$1');
if (A_SANGRE === SVG) throw new Error('No encuentro el fondo redondeado (rx) en icono.svg');

const ICONOS = [
  ['icono-192.png', 192, SVG],
  ['icono-512.png', 512, SVG],
  ['icono-maskable-512.png', 512, A_SANGRE],
  ['apple-touch-icon.png', 180, A_SANGRE],
];

(async () => {
  const navegador = await chromium.launch();
  const pagina = await navegador.newPage();
  for (const [nombre, lado, svg] of ICONOS){
    await pagina.setViewportSize({ width: lado, height: lado });
    // El SVG como imagen, del tamaño exacto: el navegador lo dibuja nítido.
    const datos = 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
    await pagina.setContent(`<html><body style="margin:0;background:transparent">
      <img src="${datos}" width="${lado}" height="${lado}" style="display:block"></body></html>`);
    await pagina.waitForFunction(() => document.images[0].complete);
    // omitBackground: lo que el dibujo no cubre queda transparente.
    await pagina.screenshot({ path: path.join(RAIZ, 'iconos', nombre), omitBackground: true });
    console.log('iconos/' + nombre, lado + '×' + lado);
  }
  await navegador.close();
})();
