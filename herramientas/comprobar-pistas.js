// Comprueba en un Chromium real que las pistas de Adivinar se leen enteras (J-06,
// tu comentario del 16/11): en iPhone grande y pequeño, en vertical y en
// horizontal, en español y en inglés, con notas que están en 2, 5 y 6 cuerdas.
// Cada respuesta debe verse (ancho mayor que 0), caber sin cortarse y no bajar
// de 13 px. Guarda una imagen con todas las franjas, para mirarlas de un vistazo.
// Herramienta de desarrollo: necesita Playwright con Chromium (y Python con PIL
// para juntar las capturas; sin él, deja las sueltas).
// Uso: node herramientas/comprobar-pistas.js <repo> <carpeta de salida>
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');

const [REPO, OUT] = process.argv.slice(2).map(p => path.resolve(p));
fs.mkdirSync(OUT, { recursive: true });
const TAMANOS = [['vertical', 393, 852], ['horizontal', 852, 393], ['SE', 375, 667], ['SE-horizontal', 667, 375]];
const IDIOMAS = ['es-ES', 'en-US'];
const NOTAS = [52, 61, 64];   // Mi3 (2 cuerdas en 12 trastes de reto, más con el mástil entero), Do#4 y Mi4
const MINIMO = 13;

(async () => {
  const navegador = await chromium.launch();
  const fallos = [], capturas = [];
  let total = 0;
  for (const locale of IDIOMAS) for (const [nombre, ancho, alto] of TAMANOS){
    const ctx = await navegador.newContext({ viewport: { width: ancho, height: alto }, deviceScaleFactor: 2,
      isMobile: true, hasTouch: true, locale });
    const pagina = await ctx.newPage();
    const errores = [];
    pagina.on('pageerror', e => errores.push(e.message));
    await pagina.goto('file://' + path.join(REPO, 'index.html'));
    // Sin pasar por la puerta de audio: aquí solo se mira el aspecto.
    await pagina.evaluate(() => document.getElementById('gate').classList.add('hidden'));
    for (const midi of NOTAS){
      const medidas = await pagina.evaluate(midi => {
        goTo('guess'); state.hintNote = true; state.hintString = true;
        challenge = { midi }; renderChallenge();
        return [...document.querySelectorAll('.ch-hints .clue-v')].map(v => ({
          texto: v.textContent, px: parseFloat(getComputedStyle(v).fontSize), partida: v.classList.contains('wrap'),
          ancho: v.clientWidth, cabe: v.scrollWidth <= v.clientWidth + 1 && v.scrollHeight <= v.parentElement.clientHeight + 1 }));
      }, midi);
      for (const m of medidas){
        total++;
        const ok = m.ancho > 0 && m.cabe && m.px >= MINIMO;
        if (!ok) fallos.push(`${locale} ${nombre} ${midi}: «${m.texto}» ${m.px}px, ancho ${m.ancho}${m.cabe ? '' : ', no cabe'}`);
      }
      const archivo = path.join(OUT, `${locale}-${nombre}-${midi}.png`);
      await (await pagina.$('#challenge')).screenshot({ path: archivo });
      capturas.push([`${locale} ${nombre} ${midi}: ` + medidas.map(m => m.texto + ' ' + m.px + 'px' + (m.partida ? ' (2 líneas)' : '')).join(' · '), archivo]);
    }
    if (errores.length) fallos.push(`${locale} ${nombre}: errores ${errores.join(' | ')}`);
    await ctx.close();
  }
  await navegador.close();
  capturas.forEach(([t]) => console.log(t));
  fs.writeFileSync(path.join(OUT, 'pistas.json'), JSON.stringify({ total, fallos, capturas }, null, 2));
  // Una sola imagen con todas las franjas (regla 7).
  try {
    execFileSync('python3', ['-c', `
import json,sys
from PIL import Image
d=json.load(open(sys.argv[1])); ims=[Image.open(f) for _,f in d['capturas']]
W=max(i.width for i in ims); col=[];
for i in ims: col.append(i)
H=sum(i.height+8 for i in col); out=Image.new('RGB',(W,H),'white'); y=0
for i in col: out.paste(i,(0,y)); y+=i.height+8
out.save(sys.argv[2])`, path.join(OUT, 'pistas.json'), path.join(OUT, 'pistas.png')]);
    console.log('Imagen: ' + path.join(OUT, 'pistas.png'));
  } catch (e){ console.log('Sin PIL: capturas sueltas en ' + OUT); }
  console.log(fallos.length ? '\n❌ ' + fallos.join('\n❌ ') : `\n✅ ${total} de ${total} respuestas se ven enteras, de ${MINIMO} px o más`);
  process.exit(fallos.length ? 1 : 0);
})();
