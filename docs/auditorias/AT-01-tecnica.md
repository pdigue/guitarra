# Trasteando — Auditoría técnica 01

| Campo | Valor |
|---|---|
| **Fecha** | 15 de septiembre de 2026 |
| **Alcance** | `index.html` (versión actual del proyecto) y `requisitos.md` v1.0 |
| **Emisor** | Chat de Auditoría técnica |
| **Destinatario** | Chat de Desarrollo (único con permiso de edición) |
| **Tipo** | Auditoría inicial: código, rendimiento, arquitectura, infraestructura, UX técnica y roadmap |

---

## Cómo usar este documento

- Cada hallazgo tiene un identificador **AUD-xx**. Al responder o al hacer commits, referenciad ese ID para poder seguir el estado.
- **Verificar** indica algo que depende del comportamiento en runtime o en dispositivo real y que no se ha podido comprobar desde la lectura del código.
- Los fragmentos de código son propuestas acotadas, no parches listos para pegar a ciegas. Adaptadlos al contexto exacto del archivo.
- Se distingue entre **problema hoy** (secciones 1–3) y **problema al crecer** (secciones 4–6).
- El plan de acción priorizado está en la sección 7.

---

## Resumen

El código es legible y está bien comentado para ser un archivo único. Una decisión clave ya está bien tomada: todo el mástil se deriva de la afinación.

Aun así, hay cinco defectos que rompen la experiencia hoy, dos de ellos en modos principales. Además, la separación en módulos y la infraestructura offline no pueden esperar a V5, porque V3 las exige técnicamente.

---

## 0. Proceso

### AUD-00 · `requisitos.md` no refleja el código

Muchos requisitos figuran como `Pendiente` pero ya están implementados: J-01 a J-09, L-03, S-02, S-03, S-06, D-04, N-02, N-05, P-04, A-01, A-06 a A-11, C-01, C-02, C-05, V-04 y V-08.

La nota de D-03 sigue citando `index_v2.html`. La alineación de números de traste parece correcta ya, porque `.fn-spacer` y `.string-label` miden lo mismo con `border-box`.

Esto importa porque el documento es el contrato entre chats. Si está desfasado, las decisiones de prioridad se toman sobre información falsa. **Acción:** sincronizar los estados antes de la siguiente iteración.

---

## 1. Críticos: rotos hoy

### AUD-01 · El mástil sigue visible en la pantalla Afinador

`setScreen` hace `board-area.hidden = isTuner`, pero `.board-area` declara `display:flex`. Cualquier regla de autor gana a la regla `[hidden]{display:none}` del navegador, así que el atributo no tiene efecto. El mástil y el afinador acaban compartiendo el espacio flex. Para `.challenge` ya se añadió `.challenge[hidden]`; para `.board-area` no.

Solución global, para que no vuelva a pasar con ningún componente futuro:

```css
[hidden] { display: none !important; }
```

### AUD-02 · Desplazar el mástil toca notas y, en Adivinar, cuenta como fallo

Cada celda escucha `pointerdown`. En táctil, `pointerdown` se dispara al apoyar el dedo, antes de que el navegador decida si el gesto es un scroll. Como el mástil está cubierto de celdas, **todo gesto de desplazamiento empieza pulsando una nota**. En modo Adivinar eso llama a `evaluate()` y rompe la racha.

El problema se agrava por otro detalle: `newChallenge()` elige trastes entre 0 y 24. En un móvil vertical se ven unos 5, así que el usuario está obligado a desplazarse, y al hacerlo falla.

Propuesta: un único listener delegado en lugar de 150, y distinguir toque de arrastre solo donde importa. `#strings` no se reconstruye (solo se vacía su contenido), así que la delegación sobrevive a `buildBoard()`. Hay que eliminar el `addEventListener` que hoy se añade a cada celda.

```js
// Sustituye a los 150 addEventListener de buildBoard(). Se registra una vez.
const TAP_SLOP = 10; // px
let tap = null;
const rows = document.getElementById('strings');

rows.addEventListener('pointerdown', ev => {
  const cell = ev.target.closest('.fret-cell');
  if (!cell) return;
  tap = { cell, x: ev.clientX, y: ev.clientY, id: ev.pointerId };
  if (screen !== 'guess') firePress(cell);           // Libre: sonido inmediato
});
rows.addEventListener('pointermove', ev => {
  if (tap && ev.pointerId === tap.id &&
      Math.hypot(ev.clientX - tap.x, ev.clientY - tap.y) > TAP_SLOP) tap = null;
});
rows.addEventListener('pointercancel', () => { tap = null; }); // el navegador tomó el scroll
rows.addEventListener('pointerup', ev => {
  if (!tap || ev.pointerId !== tap.id) return;
  const { cell } = tap; tap = null;
  if (screen === 'guess') firePress(cell);           // Adivinar: solo toques limpios
});

function firePress(cell){
  pressFret(cell, +cell.dataset.midi, +cell.dataset.row);
}
```

```css
.board-scroll { touch-action: pan-x; }
```

Compromiso deliberado: en modo Libre se mantiene la respuesta instantánea, aceptando que un scroll suene. En Adivinar se evalúa al levantar el dedo, lo que añade unos 100 ms pero elimina los falsos fallos.

Además, el rango del reto debería limitarse a trastes 0–12 por defecto, idealmente configurable. Es una decisión de producto que conviene añadir a J-01.

### AUD-03 · Latencia añadida de unos 100 ms en cada pulsación

`sampler.triggerAttackRelease(note, dur)` sin tiempo explícito programa la nota en `Tone.now()`. Ese valor es `currentTime + lookAhead`, y en Tone.js `lookAhead` vale **0,1 s por defecto**. Sumado a la latencia de salida del dispositivo, el toque se nota "blando" en móvil. Para una app cuyo núcleo es pulsar y oír, es el problema de UX más importante.

Cambio mínimo:

```js
sampler.triggerAttackRelease(sciName(midi), duration || 1.8, Tone.immediate());
```

Problema relacionado: **hay dos AudioContext**. `unlockAudio()` crea uno nativo para el sintetizador de respaldo y Tone crea el suyo. iOS limita el número de contextos simultáneos y cada uno consume recursos. Además, desbloquear uno no desbloquea el otro.

Mientras exista Tone, conviene reutilizar su contexto (**verificar**: en Tone 14 `rawContext` es un wrapper de standardized-audio-context, pero expone la API completa):

```js
function unlockAudio(){
  audioCtx = (typeof Tone !== 'undefined')
    ? Tone.getContext().rawContext
    : new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  audioReady = true;
}
```

### AUD-04 · En móvil horizontal el mástil se queda sin altura

V-01 establece que el mástil se usa preferentemente en horizontal, pero el layout apila todo en vertical. Según el CSS, la altura fija aproximada suma unos 315 px:

| Elemento | Altura aprox. |
|---|---|
| Cabecera | 55 px |
| Barra rápida | 40 px |
| Pentagrama en `max-height:520px` | 104 px |
| Números de traste y padding | 25 px |
| Zoom | 40 px |
| Barra de pestañas | 53 px |

Un móvil apaisado tiene entre 320 y 390 px útiles, así que quedan unos 60–75 px para 6 cuerdas. Eso son unos 11 px por cuerda y puntos de unos 9 px, muy lejos del mínimo de 44 px para un objetivo táctil. En Adivinar se suma la barra del reto, unos 56 px más, y el mástil prácticamente desaparece.

Esto no se arregla con un ajuste de CSS: es un layout alternativo para apaisado bajo. Mínimo viable:

```css
@media (orientation: landscape) and (max-height: 500px) {
  .header { display: none; }                  /* mover el botón de ajustes a la quickbar */
  body { display: grid;
         grid-template-columns: 1fr 180px;
         grid-template-rows: auto auto 1fr auto; }
  .display { grid-column: 2; grid-row: 1 / 4; max-height: none; border-bottom: none; }
  .display-inner { flex-direction: column; }
  .zoombar { position: absolute; right: 190px; bottom: 60px; padding: 0; }
  .tabbar { grid-column: 1 / 3; }
}
```

El pentagrama pasa a una columna lateral y el mástil recupera toda la altura. Esto depende de C-06 (interfaz sin especificar), así que conviene que esa sesión de diseño llegue antes de añadir más modos.

### AUD-05 · El pentagrama recorta buena parte del registro de la guitarra

El `viewBox` del pentagrama es fijo (`0 0 340 110`) y `staffY()` no limita el resultado.

- **Por arriba:** cualquier nota que suene por encima de Re5 (MIDI 74) da `y < 0` y queda fuera. En afinación estándar eso ocurre en la 1ª cuerda desde el traste 10 y en la 2ª desde el 15. Un Mi del traste 24 cae en `y = −39`.
- **Por abajo:** la afinación personalizada admite hasta MIDI 28 (Mi1), que cae en `y ≈ 136`.

La imagen de referencia del proyecto muestra justo ese registro alto con muchas líneas adicionales, así que el caso está dentro del alcance.

Solución convencional: marcas de octava.

```js
/** Nota que realmente se dibuja y su marca de octava, para no salir del viewBox. */
function fitOctave(midi){
  let shift = 0;
  while (staffY(midi - shift) < STAFF_TOP - 3*GAP)    shift += 12;  // >3 líneas adicionales arriba
  while (staffY(midi - shift) > STAFF_BOTTOM + 4*GAP) shift -= 12;  // >4 abajo (Drop D cabe)
  const mark = {12:'8va', 24:'15ma', [-12]:'8vb'}[shift] || '';
  return { drawMidi: midi - shift, mark };
}
```

Para que funcione:

- Subir `STAFF_TOP` a unos 40 (con `STAFF_BOTTOM` a 80) y ampliar el `viewBox` a unos 130 de alto. Con ese margen, una marca 8va basta para llegar al traste 24 y el Re2 de Drop D cabe sin marca.
- `drawNote` debe usar `drawMidi` y pintar la marca **al lado** de la nota (no encima), porque en el caso extremo la cabeza queda cerca del borde superior.
- Limitar `shiftString` a un rango razonable, por ejemplo MIDI 33–69.

---

## 2. Altos

### AUD-06 · La PWA probablemente no es instalable (G-04, prioridad Alta, V1)

- El manifiesto no declara `icons`. Chrome exige iconos de 192 y 512 px para ofrecer la instalación real en Android.
- El manifiesto va como `data:` URL, que tiene soporte irregular, y el `start_url: "."` se resuelve contra el `data:` en lugar de contra la página.
- iOS no admite SVG en `apple-touch-icon`, así que usa una captura de pantalla como icono.

El estado real de G-04 es "no cumplido". Propuesta de archivos en el repositorio:

```html
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="icons/apple-touch-icon-180.png">
```

```json
{
  "name": "Trasteando", "short_name": "Trasteando",
  "start_url": "./", "scope": "./", "display": "standalone",
  "background_color": "#140e09", "theme_color": "#140e09",
  "icons": [
    { "src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "icons/icon-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

Las rutas relativas (`./`) son obligatorias, porque GitHub Pages sirve el proyecto bajo `/guitarra/`, no en la raíz.

### AUD-07 · Dependencias de terceros en tiempo de ejecución

**Tone.js bloquea el primer render.** Se carga en `<head>` sin `defer`: unos cientos de KB (verificar en Network) antes de pintar la puerta de entrada, y sin `integrity`. El código solo usa Tone dentro de `loadSampler()`, que se ejecuta tras un clic, así que `defer` es seguro:

```html
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.js"
        integrity="sha384-…" crossorigin="anonymous"></script>
```

**Los samples dependen de un tercero.** Vienen de `nbrosowsky.github.io`, el GitHub Pages personal de otra persona. Si lo borra, lo mueve o cambia los nombres de archivo, la app pasa a sintetizador sin avisar a nadie. Tampoco controláis las cabeceras de caché.

- Recomendación: alojarlos en `/samples/` del propio repositorio.
- Hay que revisar la licencia del paquete, que probablemente exige atribución.
- **Verificar** que existen los 8 archivos en *ambas* carpetas. Un solo 404 hace fallar `Tone.loaded()` y todo el set cae al sintetizador.

**Calidad en el registro agudo.** El sample más agudo es Re5 y la nota más aguda del mástil estándar es Mi6: 14 semitonos de transposición, que suenan metálicos y cortos. Si el paquete tiene muestras más agudas (verificar), conviene añadir una o dos al `SAMPLE_MAP`.

**A medio plazo, valorar quitar Tone.** Solo se usa como Sampler. Un sampler propio con `decodeAudioData` y `playbackRate` ocupa unas 50 líneas. Eliminaría la dependencia pesada, la latencia de `lookAhead` y el doble contexto, y prepara el terreno para el afinador por micrófono, que va a trabajar con Web Audio directo de todos modos. No es urgente si se aplica AUD-03.

### AUD-08 · El estado se propaga a mano y ya produce bugs visibles

`state` se modifica desde unos 15 sitios. Cada uno recuerda (o no) llamar a `save()`, `syncUI()`, `onTuningChanged()`, `refreshNoteNames()` o `renderChallenge()`. Bugs concretos que salen de ahí:

1. **Restablecer no recarga el timbre.** La interfaz marca "Clásica" pero sigue sonando la acústica.
2. **Restablecer en Adivinar deja un reto imposible.** No llama a `newChallenge()`. Si la afinación previa era Drop D y el reto era Re2 (MIDI 38), en estándar esa nota no existe y el usuario falla indefinidamente.
3. **Cambiar la nomenclatura deja el lector con el nombre antiguo.** Pasados los 2,2 s, `.fret-cell.active` ya no existe y `toggleNotation` no encuentra qué refrescar. Hay que guardar `lastMidi` en lugar de deducirlo del DOM.
4. **Girar el móvil borra el zoom del usuario.** `orientationchange` sobrescribe `state.visibleFrets`, lo que contradice V-08. Además, ese evento está obsoleto y `resize` ya cubre el caso.
5. **Condición de carrera en `setTimbre`.** Dos toques rápidos lanzan dos cargas en paralelo. La más lenta puede sobrescribir y destruir el sampler correcto, y la reversión por fallo puede pisar la elección más reciente. Además, si la carga falla, el `Sampler` creado no se destruye.
6. **`localStorage` sin validar.** Un `customTuning` corrupto, o un `tuningId` eliminado en una versión futura, rompe o desincroniza la app. `hintNote` y `hintString` ni siquiera están en `DEFAULTS`.

Arreglo para el punto 5:

```js
let samplerReq = 0;
async function loadSampler(timbre){
  const req = ++samplerReq;
  // … crear `next` …
  try { await Tone.loaded(); }
  catch(e){ next.dispose(); return false; }
  if (req !== samplerReq){ next.dispose(); return 'stale'; }  // llegó una petición posterior
  // … sustituir sampler …
}
```

Arreglo para el punto 6:

```js
const SCHEMA = 1;
function sanitize(raw){
  const s = Object.assign({}, DEFAULTS, raw);
  if (!TUNINGS.some(t => t.id === s.tuningId)) s.tuningId = 'standard';
  if (!Array.isArray(s.customTuning) || s.customTuning.length !== 6 ||
      !s.customTuning.every(n => Number.isInteger(n) && n >= 33 && n <= 69))
    s.customTuning = DEFAULTS.customTuning.slice();
  if (!['latin','anglo'].includes(s.notation)) s.notation = 'latin';
  if (!['nylon','acoustic'].includes(s.timbre)) s.timbre = 'nylon';
  s.schema = SCHEMA;
  return s;
}
```

La corrección de fondo, para que estos bugs dejen de aparecer, es el store de AUD-20.

### AUD-09 · Accesibilidad: el núcleo de la app no se puede usar sin puntero

- **Mástil:** las celdas son `div` sin rol ni foco, así que la función principal es inaccesible con teclado o lector de pantalla. Lo adecuado es `role="grid"` con *roving tabindex*: una sola celda con `tabindex=0`, flechas para moverse y Enter o Espacio para tocar. No conviene hacer 150 paradas de tabulación.
- **Interruptores:** los `.sw` son `div` con clic. Deberían ser `<button role="switch" aria-checked="…">`.
- **Panel de ajustes:** cerrado, sigue en el orden de tabulación (solo está desplazado con `transform`), no se cierra con Escape y no gestiona el foco. Solución básica: `sheet.inert = !open;` más un listener de `Escape`.
- **Anuncios:** faltan regiones `aria-live="polite"` en el lector de nota y en el resultado del reto. El acierto o fallo hoy se comunica solo por color (verde o rojo), lo que también falla para daltónicos.
- **Zoom bloqueado:** `maximum-scale=1, user-scalable=no` y `gesturestart` impiden ampliar, lo que incumple WCAG 1.4.4. iOS lo ignora igualmente desde hace años; en Android sí bloquea. Conviene quitarlo y controlar el doble toque con `touch-action`.

### AUD-10 · Paleta de colores: pares indistinguibles y texto ilegible

El color por nota solo sirve si se distinguen las notas contiguas, y hoy media paleta son casi duplicados:

- Do `#e74c3c` y La# `#c0392b`
- Re `#f39c12` y Re# `#d4ac0d`
- Fa# `#3498db` y Sol `#5dade2`
- Sol#, La y Si: tres morados muy parecidos

El texto blanco de 10 px sobre amarillos, naranjas y verdes claros tiene un contraste de entre 2:1 y 2,5:1, por debajo del 4,5:1 recomendado.

Propuesta con tonos equiespaciados y ordenados por quintas. Así, dos notas separadas por un semitono (trastes vecinos) quedan a 150° o 210° de tono, con máximo contraste:

```js
const COLORS = Array.from({ length: 12 },
  (_, pc) => `oklch(0.74 0.14 ${(pc * 7 % 12) * 30})`);
// y en .dot: color: #1a1006 (texto oscuro) en lugar de blanco
```

`oklch` funciona en Safari 15.4+ y Chrome 111+.

**Decisión pendiente:** la imagen de referencia del proyecto usa otra asignación (Mi amarillo, Si cian, Re verde…) que el código no sigue. Si esa imagen es la guía visual, hay que decidir cuál manda.

### AUD-11 · El listener `touchmove` no pasivo en `document` provoca tirones

`{ passive:false }` en `document` obliga al navegador a esperar al hilo principal antes de hacer scroll en **cualquier** toque, incluido el del mástil. En móviles modestos eso se nota como tirones. Mejor sustituirlo por CSS:

```css
html, body     { overscroll-behavior: none; touch-action: manipulation; }
.board-scroll  { touch-action: pan-x; }
.tuner, .sheet { touch-action: pan-y; }
```

Con esto se eliminan el listener `touchmove` y el de `gesturestart`. Si en iOS reaparece el rebote de página (verificar; `body{position:fixed}` ya lo mitiga), el listener debe limitarse a `.header, .quickbar, .tabbar`, nunca a `document`.

---

## 3. Medios

- **AUD-12 · La etiqueta de zoom puede mentir.** Con `MIN_FRET_W = 34`, en un móvil vertical "Mástil completo" muestra unos 9 trastes, y el botón − sigue activo sin hacer nada. Hay que calcular el máximo real con `Math.floor(avail / MIN_FRET_W)` y usarlo para la etiqueta y para desactivar el botón.
- **AUD-13 · El zoom no conserva la posición.** Al cambiar `--fret-w`, `scrollLeft` sigue en píxeles y la vista salta a otros trastes, algo que V-06 pide evitar. Hay que guardar el traste central antes de hacer zoom y recalcular `scrollLeft` después.
- **AUD-14 · `--fret-w` está en `:root`.** Eso invalida el estilo de todo el documento en cada `resize`. Debería definirse en `#board` y el cálculo agruparse con `requestAnimationFrame`.
- **AUD-15 · Consultas al DOM repetidas.** Cada pulsación ejecuta dos o tres `querySelectorAll('.fret-cell')` sobre 150 nodos. Hoy es irrelevante; con escalas y marcas múltiples dejará de serlo. La solución es el modelo de AUD-21.
- **AUD-16 · Sintetizador de respaldo sin caché.** `playSynth` genera unas 125.000 muestras con cinco pasadas en el hilo principal en cada toque, lo que en Android modesto puede costar decenas de ms. Solución: `Map<midi, AudioBuffer>`.
- **AUD-17 · Clave de sol como glifo Unicode.** `\u{1D11E}` depende de las fuentes del sistema y en muchos Android aparece como un cuadro vacío. Conviene sustituirla por un `<path>` SVG.
- **AUD-18 · `vh` en el panel de ajustes.** `max-height: 86vh` falla en iOS con la barra dinámica del navegador; `86dvh` lo resuelve.

---

## 4. Arquitectura: lo que será un problema al crecer

### AUD-19 · Separar en módulos antes de V3, no en V5

No es una cuestión de estilo: V3 y V5 lo **fuerzan técnicamente**.

- El detector de tono del afinador por micrófono debe correr en un `AudioWorklet`, que se carga por URL (`audioWorklet.addModule('pitch.js')`).
- El Service Worker (G-03) tiene que ser un archivo propio en la raíz de su ámbito.
- Escalas añadirá teoría y lógica de validación que no deberían convivir con el renderizado del mástil.

No hace falta un bundler: GitHub Pages sirve módulos ES nativos. La única pega es que `file://` deja de funcionar, pero el micrófono ya obliga a usar localhost. Estructura propuesta:

```
index.html · manifest.webmanifest · sw.js
icons/  samples/nylon/  samples/acoustic/
src/main.js
src/store.js
src/theory/notes.js     tunings.js     scales.js      ← puros, testeables
src/audio/engine.js     pitch-worklet.js (V3)
src/ui/fretboard.js     staff.js       settings.js
src/modes/free.js       guess.js       tuner.js       scales.js
src/styles.css
```

### AUD-20 · Un store mínimo con suscripciones

Así desaparece toda la familia de bugs de AUD-08:

```js
// store.js
let state = sanitize(storage.read());
const subs = new Set();

export const getState = () => state;
export function setState(patch){
  const changed = new Set(Object.keys(patch).filter(k => state[k] !== patch[k]));
  if (!changed.size) return;
  state = { ...state, ...patch };
  storage.write(state);
  subs.forEach(fn => fn(state, changed));
}
export const subscribe = fn => (subs.add(fn), () => subs.delete(fn));
```

```js
// Cada módulo declara de qué depende, una vez:
subscribe((s, ch) => { if (ch.has('tuningId') || ch.has('customTuning')) rebuildFretModel(s); });
subscribe((s, ch) => { if (ch.has('notation')) refreshNoteNames(); });
subscribe((s, ch) => { if (ch.has('timbre')) audio.loadSampler(s.timbre); });
```

Con esto, "Restablecer" pasa a ser `setState({ ...DEFAULTS, visibleFrets: … })` y todo se propaga solo. Los arrays como `customTuning` deben sustituirse, nunca mutarse, para que la comparación por referencia detecte el cambio. El código actual ya lo hace así.

### AUD-21 · Un modelo derivado del mástil, calculado una vez por afinación

Hoy `displayStrings()` se recalcula en cada llamada, `positionsFor()` recorre el mástil entero y hay dos convenciones de índice (`rowIdx`, de agudo a grave, y `lowIndex`, de grave a agudo) que ya obligan a traducir entre el mástil y el afinador. Escalas multiplicará ese problema.

```js
export function buildFretModel(tuning, numFrets){
  const strings = tuning.map((open, low) => ({ open, number: tuning.length - low })).reverse();
  const cells = [], byMidi = new Map();
  strings.forEach((s, row) => {
    for (let fret = 0; fret <= numFrets; fret++){
      const c = { row, fret, midi: s.open + fret, string: s.number, el: null };
      cells.push(c);
      if (!byMidi.has(c.midi)) byMidi.set(c.midi, []);
      byMidi.get(c.midi).push(c);
    }
  });
  return { strings, cells, byMidi };
}
```

Con este modelo, "mostrar iguales" es `byMidi.get(midi)`, las pistas de cuerda salen de ahí mismo y las escalas son un filtro por clase de nota. El DOM se referencia desde `c.el` y no se vuelve a consultar. La única convención externa debería ser el número de cuerda (1ª = aguda). Parametrizar con `tuning.length` en lugar del 6 fijo cuesta nada ahora.

### AUD-22 · Deletreo de notas: diseñarlo antes de V4

Hoy una nota es solo su número MIDI más un nombre sacado de una tabla que únicamente tiene sostenidos. Eso vale para el mástil libre, pero **es incorrecto para escalas**. Fa mayor contiene Si♭, no La#. Una escala de 7 notas debe usar 7 letras distintas. Y E-04 muestra la escala en el pentagrama, donde La# y Si♭ se dibujan en posiciones diferentes.

`staffY()` e `isSharp()` asumen sostenidos, así que si Escalas se construye sobre el modelo actual, habrá que reescribir el pentagrama y la teoría a mitad de V4. Modelo propuesto:

```js
// La altura se deriva; la escritura no.
// { letter:'B', acc:-1, octave:3 } → Si♭3, MIDI 58
const LETTER_PC    = { C:0, D:2, E:4, F:5, G:7, A:9, B:11 };
const LETTER_LATIN = { C:'Do', D:'Re', E:'Mi', F:'Fa', G:'Sol', A:'La', B:'Si' };
export const toMidi = n => (n.octave + 1) * 12 + LETTER_PC[n.letter] + n.acc;
```

El pentagrama se posiciona por `letter + octave` y dibuja la alteración según `acc`. El modo libre sigue deletreando con sostenidos por defecto. Lo ideal es hacer este cambio al tocar el pentagrama por AUD-05, que es cuando sale más barato.

### AUD-23 · Tests mínimos sin dependencias

Las funciones de teoría son puras: `staffY`, el deletreo, `buildFretModel` y la generación de escalas. Con `node --test` y cero dependencias se cubren en una tarde, y protegen justo lo que más se va a tocar en V3 y V4.

Para el detector de tono, los propios samples de guitarra reproducidos con un `playbackRate` desafinado conocido sirven como banco de pruebas reproducible.

---

## 5. Roadmap: complejidad oculta y reordenación

**Infraestructura de V5 a antes de V3.** Módulos, Service Worker, samples propios y manifiesto real. El motivo técnico es el de AUD-19, y el funcional es que la dependencia de samples externos es un riesgo ya, no en V5. G-04 figura como Alta en V1 y hoy no se cumple.

**A-10 ya está resuelto en el código.** Era el riesgo "Alto" de la sección 15 de `requisitos.md`. Hay que actualizarlo y que no se pierda en un refactor futuro.

**A-02 (afinador por micrófono) esconde más de lo que aparenta.** Propuesta: dividirlo en "detector con banco de pruebas" y "interfaz del afinador".

- **Tratamiento de audio del navegador:** hay que desactivarlo, porque la cancelación de eco y el control de ganancia destruyen la señal para medir tono:
  ```js
  navigator.mediaDevices.getUserMedia({ audio: {
    echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
  ```
- **Rango:** Mi2 son 82 Hz y Drop D baja a 73 Hz. Hace falta una ventana de 2048–4096 muestras y un algoritmo YIN o MPM; la autocorrelación simple comete errores de octava con los armónicos de la guitarra.
- **Errores de octava y A-04:** en afinaciones abiertas como Open D (Re2, Re3, Re4), un error de octava del detector asigna la cuerda equivocada. Con afinaciones personalizadas pueden existir dos cuerdas al unísono, y la detección automática se vuelve ambigua. A-05 no es opcional: es necesario.
- **Estabilidad:** hace falta suavizado e histéresis para que la aguja no tiemble.
- **iOS:** activar el micrófono ha alterado históricamente el enrutado o el volumen de salida del audio. Hay que verificarlo pronto en dispositivo real, porque condiciona si referencia y micrófono pueden convivir en la misma pantalla.

**E-02, E-04 y E-05 (escalas) tienen tres decisiones que conviene cerrar antes de programar:**

1. **Digitaciones.** Si se guardan como datos (CAGED, 3 notas por cuerda), dejan de valer con cualquier afinación distinta de la estándar, lo que choca con A-10. Deben generarse con un algoritmo parametrizado por afinación, por ejemplo "N notas por cuerda dentro de una ventana de trastes".
2. **Intervalos de E-04.** "Respecto a la anterior" es ambiguo en un mástil, porque la nota anterior depende del recorrido. Hay que definirlo por grado de la escala, no por posición.
3. **Validación de orden en E-05.** Si se valida el orden, hace falta un modelo de recorrido (secuencia de celdas), no solo un conjunto de notas. Es bastante más trabajo que validar pertenencia.

**V-01 ya está decidido por la técnica.** El bloqueo de orientación solo funciona en Android a pantalla completa y no en iOS. Queda sugerir el horizontal y tener los dos layouts, lo que enlaza con AUD-04.

**C-06 debería ir antes que Escalas.** El layout apaisado, la jerarquía de controles y la ubicación del reto dependen de esa especificación, y cada modo nuevo encarece rehacerla.

---

## 6. Infraestructura y coste

- **Coste recurrente:** GitHub Pages sigue siendo suficiente y gratuito. Los límites orientativos (1 GB de repositorio, unos 100 GB/mes de tráfico) quedan muy lejos: dos juegos de samples suman del orden de 1–3 MB.
- **Cacheo:** GitHub Pages envía `Cache-Control: max-age=600`, así que sin Service Worker el navegador revalida los recursos cada 10 minutos.
- **Estrategia recomendada para el Service Worker:**
  - *Precache* versionado del app shell: HTML, CSS, JS e iconos.
  - *Cache-first bajo demanda* para los samples. Solo se guarda el timbre que el usuario usa; no se precargan ambos.
  - La versión de caché, con un nombre como `trasteando-v3`, se sube con cada despliegue y se limpia en `activate`.
- **Tamaño:** Tone.js es el recurso más pesado y el único que se podría eliminar (AUD-07). Los MP3 están bien; no merece la pena migrar a otro formato por ahora.

---

## 7. Plan de acción priorizado

| # | Acción | Hallazgos | Gravedad | Esfuerzo | Cuándo |
|---|--------|-----------|----------|----------|--------|
| 1 | Regla `[hidden]{display:none!important}` | AUD-01 | Crítica | Minutos | Ya |
| 2 | Añadir `Tone.immediate()` y usar un único AudioContext | AUD-03 | Crítica | Minutos | Ya |
| 3 | Distinguir toque de arrastre y limitar el rango del reto | AUD-02 | Crítica | 1–2 h | Ya |
| 4 | Añadir marcas 8va/8vb y ampliar el `viewBox` del pentagrama | AUD-05 | Crítica | 1–2 h | Ya |
| 5 | Corregir restablecer, nomenclatura, `orientationchange` y carrera de timbre | AUD-08 | Alta | 1–2 h | Ya |
| 6 | Crear manifiesto real con iconos PNG | AUD-06 | Alta | 1 h | Ya (G-04 es V1) |
| 7 | Cargar Tone con `defer` y SRI, y alojar samples propios | AUD-07 | Alta | 1–2 h | V2 |
| 8 | Sustituir `touchmove` por `touch-action` | AUD-11 | Alta | 30 min | V2 |
| 9 | Layout apaisado para pantallas bajas | AUD-04 | Crítica en móvil | 0,5–1 día | Tras C-06 |
| 10 | Revisar paleta de colores y accesibilidad básica | AUD-09, AUD-10 | Alta | 1 día | V2 |
| 11 | Sincronizar `requisitos.md` con el código | AUD-00 | Proceso | 1 h | Ya |
| 12 | Separar en módulos, store y modelo del mástil | AUD-19, AUD-20, AUD-21 | Deuda | 1–2 días | Antes de V3 |
| 13 | Service Worker | Sección 6 | Deuda | 0,5 día | Antes de V3 |
| 14 | Modelo de deletreo de notas | AUD-22 | Deuda | 0,5–1 día | Antes de V4 |

Los puntos 1, 2, 5 y 8 son cambios pequeños y aislados que pueden ir en un mismo commit. Los puntos 3 y 4 conviene revisarlos en dispositivo real antes de dar la versión por buena. Los hallazgos medios (AUD-12 a AUD-18) pueden abordarse de forma oportunista al tocar cada zona.

---

## 8. Decisiones que este informe abre o afecta

Para añadir a la sección 16 de `requisitos.md`:

1. **J-01:** rango de trastes del reto en modo Adivinar (propuesta: 0–12 por defecto, configurable).
2. **AUD-10:** paleta de colores de referencia (la del código, la de la imagen de referencia o una nueva).
3. **AUD-02:** confirmar el compromiso de evaluar en `pointerup` solo en Adivinar.
4. **E-04:** definir los intervalos por grado de la escala, no por posición en el mástil.
5. **E-02:** digitaciones generadas por algoritmo, no almacenadas como datos.

---

*Informe emitido por el chat de Auditoría técnica. No modifica el código ni `requisitos.md`; las acciones corresponden al chat de Desarrollo.*
