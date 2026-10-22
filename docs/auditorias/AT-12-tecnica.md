# AT-12 · Auditoría técnica (F6.1, ligera)

**Fecha:** 22/10/2026 · **Alcance:** solo lo que cambió en F6.1 (0.6.0): `tests/autonomo.test.js`, `tests/banco.test.js` (envoltorio `test`, `unaVez`, `cargaFalsa`, idioma, prueba del ensamblador), `tests/dom-minimo.js` (`parseBody`, `conAtributos`), `herramientas/ensamblar.js`, `herramientas/generar-autonomo.py` y versión. Se ha contrastado con el criterio de G-08 en la matriz. No se ha ejecutado nada: el resultado del banco (150/150) y las comprobaciones en Chromium son los que se me han pasado.

**Nada bloqueante:** no hay hallazgos críticos ni altos.

**Cuadra:**
- **Cuentas:** primera pasada, 71 de `banco` + 5 de `escalas` + 6 de `tono` = 82. Segunda pasada, 71 − 4 `unaVez` + 1 propia = 68. Total 150. `node --test` ejecuta cada archivo en su propio proceso, así que poner `APP_HTML` y `TRASTEANDO_FORMA` no afecta a la primera pasada.
- **Prueba propia del autónomo:** la app lee de verdad las 17 grabaciones incrustadas, sus huellas sha256 se comparan con `autonomo.json` (sin importar el orden) y no hay ninguna descarga. Solo se sustituye la decodificación, que necesita un altavoz.
- **`cargaFalsa`:** cubre las dos rutas (`fetchAndDecode` y `decodeData`) sin cambiar lo que pasaba en la primera pasada.
- **`ensamblar.js`:**
  - Los `replace` usan una función, así que un `$&` dentro de un módulo no lo estropea.
  - `conSalto` evita que el nombre se pegue a la última línea.
  - `incrustable` compara sin distinguir mayúsculas y avisa con el archivo y la línea.
  - `scripts()` separa los módulos por su `sourceURL` y deja fuera los bloques de audio.
  - La prueba del ensamblador compara nombres, orden y código byte a byte, y el archivo temporal se borra en un `finally`.
- **`generar-autonomo.py`:** si falla el ensamblado, `sys.exit(mensaje)` sale con código 1 sin escribir nada en `dist/`.
- **`dom-minimo.js`:** solo conserva los `<script>` con `id`, que son datos. `conAtributos` se ha factorizado sin cambiar su comportamiento.
- **Prueba de idioma:** quitar los `<script>` evita falsos positivos. Las claves del código se siguen revisando aparte, en `js/`.
- **Versión:** la prueba de F4.1 se pasa también contra el autónomo, y ahí comprueba de paso que su `APP_VERSION` coincide con los `?v=` de `index.html`.

**Hallazgos:**

1. **Medio (hoy; al crecer, más) · `tests/autonomo.test.js`, `tests/escalas.test.js`: el banco no se pasa «entero» contra el autónomo.**
   - `escalas.test.js` arranca la app con `boot(APP)` y lee `APP_HTML`, pero nadie lo carga en la segunda pasada. Sus 5 pruebas de corrección musical nunca se pasan contra `dist/trasteando.html`.
   - El criterio dice «el mismo banco», y CHANGELOG, matriz, requisitos e IT-04 dicen «entero».
   - Que `tono.test.js` no se pase está justificado: carga `js/10-tono.js` directamente, sin pasar por ninguna de las dos formas.
   - Al crecer: cada archivo de pruebas nuevo que use `boot(APP)` quedará fuera de la segunda pasada sin que nadie lo note.

   Corrección: llevar el envoltorio a `dom-minimo.js` y cargar `escalas` desde el autónomo.
   ```js
   // dom-minimo.js
   const nodeTest = require('node:test');
   const FORMA = process.env.TRASTEANDO_FORMA || '';
   const test = FORMA ? (n, ...r) => nodeTest(`[${FORMA}] ${n}`, ...r) : nodeTest;
   module.exports = { boot, sleep, El, fuente: ensamblar, test, unaVez: FORMA ? () => {} : test };
   // autonomo.test.js
   require('./banco.test.js');
   require('./escalas.test.js');
   ```
   Añadir además un guardián, con `unaVez`, en `banco.test.js`:
   ```js
   unaVez('cada archivo de pruebas que arranca la app se pasa también contra el autónomo (G-08)', () => {
     const aut = fs.readFileSync(path.join(__dirname, 'autonomo.test.js'), 'utf8');
     for (const f of fs.readdirSync(__dirname).filter(f => f.endsWith('.test.js') && f !== 'autonomo.test.js'))
       if (/boot\(APP\)/.test(fs.readFileSync(path.join(__dirname, f), 'utf8')))
         assert.ok(aut.includes(`./${f}`), f + ' no se pasa contra el autónomo');
   });
   ```
   El total pasaría a 156 (5 de `escalas` y el guardián): hay que actualizar la cifra en ESTADO y en los documentos.

2. **Medio (hoy) · `herramientas/ensamblar.js`: es probable que los números de línea del navegador vayan una línea por delante.**
   - El ensamblador escribe `'<script>\n' + código`. En HTML, el salto de línea que va justo después de `<script>` forma parte del texto del script (solo `<pre>` y `<textarea>` lo descartan).
   - Con `sourceURL`, el navegador cuenta las líneas desde el principio de ese texto, así que la línea N del módulo aparece como N+1.
   - La prueba que se hizo apunta a eso: `js/03-audio.js:101` es `let peak = 0;`, que no puede fallar. La línea que falla con un búfer malo es la 100 (`buffer.getChannelData(0)`).
   - En Node no se nota, porque `RE_INCRUSTADO` captura el código sin ese salto. Por eso el banco no puede detectarlo.
   - Pido confirmarlo con un error en una línea que no deje dudas antes de corregir. Si se confirma, el CHANGELOG («línea 101») también hay que corregirlo.

   Corrección:
   ```js
   .replace(RE_JS, (_, rel) => '<script>' + conSalto(incrustable(base, rel, 'script')) + nombrar(rel) + '</script>');
   const RE_INCRUSTADO = /<script>\n?([\s\S]*?)<\/script>/g;   // \n? : sigue leyendo las páginas anteriores a la 0.4.0
   ```
   En la prueba de F4.1 (línea 778), contar `//# sourceURL=` en lugar de `<script>\n`. En `comprobar-autonomo.js`, añadir una comprobación: provocar `soundStart(null)` y exigir que la pila diga `js/03-audio.js:` seguido de la línea de `function soundStart` + 1, calculada leyendo el archivo.

3. **Bajo (al crecer) · `herramientas/ensamblar.js`, `incrustable`: no detecta `<!--`.**
   Si un módulo tiene `<!--` y después `<script`, el navegador entra en un modo especial en el que el `</script>` siguiente no cierra el bloque y se traga los módulos que vienen detrás. Hoy ningún archivo de `js/` contiene `<!--`.
   Corrección: rechazar también `<!--` en los scripts.
   ```js
   const PROHIBIDO = { script: ['</script', '<!--'], style: ['</style'] };
   const linea = codigo.split('\n').findIndex(l => PROHIBIDO[etiqueta].some(p => l.toLowerCase().includes(p)));
   ```

4. **Bajo (al crecer) · `tests/banco.test.js`, envoltorio `test`: no tiene `.skip`, `.only` ni `.todo`.**
   Un `test.skip(…)` funcionaría en la primera pasada, pero en la segunda daría un `TypeError` al cargar el archivo, y la pasada del autónomo entera caería con un mensaje confuso.
   Corrección: `const test = FORMA ? Object.assign((n, ...r) => nodeTest(`[${FORMA}] ${n}`, ...r), { skip: (n, ...r) => nodeTest.skip(`[${FORMA}] ${n}`, ...r), todo: nodeTest.todo }) : nodeTest;`

5. **Bajo · `tests/banco.test.js`, prueba del ensamblador: es más estricta que el propio ensamblador.**
   Espera `código + '//# sourceURL=…'`, pero el ensamblador añade un salto (`conSalto`) cuando el módulo no termina en uno. Un módulo sin salto final haría fallar esta prueba aunque el autónomo estuviera bien.
   Corrección: `const conSalto = c => c.endsWith('\n') ? c : c + '\n';` y comparar con `conSalto(sueltos[i].codigo) + '//# sourceURL=' + s.nombre + '\n'`.

6. **Bajo · `tests/autonomo.test.js`: pasado por separado, no detecta un autónomo caducado.**
   La comprobación de que el autónomo está al día usa `unaVez`, así que con `node --test tests/autonomo.test.js` se validaría un `dist/` viejo. Con `node --test` sin argumentos sí se detecta.
   Corrección: anotarlo en la cabecera del archivo, o dejar que esa prueba corra también en la segunda pasada (cuesta poco).

**Pruebas que faltan para que el criterio de G-08 quede demostrado:**
- Las 5 de `escalas.test.js` contra el autónomo, y el guardián del hallazgo 1.
- La línea del `sourceURL` en el navegador (hallazgo 2), que el banco no puede ver.

Lo demás del criterio queda cubierto.

---

## Respuesta (ronda 1, 22/10/2026)

Sin críticos ni altos. Todos los hallazgos corregidos en la ronda 1; no hace falta ronda 2. Banco: 156 de 156.

| # | Nivel | Qué se hizo |
|---|---|---|
| 1 | Medio | **Corregido.** `test` y `unaVez` viven ahora en `dom-minimo.js`; `escalas.test.js` entra en la segunda pasada, y el guardián propuesto está en `banco.test.js` (comprobado: falla si se quita `require('./escalas.test.js')`). |
| 2 | Medio | **Confirmado y corregido.** Con el autónomo anterior, el error de `soundStart(null)` decía `js/03-audio.js:101`; la línea que falla es la 100. El código va ahora pegado a `<script>`, y `RE_INCRUSTADO` acepta el salto opcional. La prueba de F4.1 cuenta los nombres de módulo, la del ensamblador exige que no quede `<script>\n` en el autónomo, y `comprobar-autonomo.js` compara en Chromium la línea que dice el error con la de `js/03-audio.js`: con el autónomo anterior falla («dice 101 y debería decir 100») y con el nuevo pasa. CHANGELOG corregido. |
| 3 | Bajo | **Corregido.** `incrustable` rechaza también `<!--` en los scripts; la prueba del ensamblador lo comprueba. |
| 4 | Bajo | **Corregido.** `test` y `unaVez` admiten `.skip`, `.todo` y `.only`. |
| 5 | Bajo | **Corregido.** La prueba compara con `conSalto(…)`, como el ensamblador. |
| 6 | Bajo | **Anotado** en la cabecera de `autonomo.test.js`: para cerrar una etapa, siempre `node --test` entero. |
