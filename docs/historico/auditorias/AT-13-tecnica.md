# AT-13 · Auditoría técnica (F5.8 #1, ligera)

**Fecha:** 22/10/2026 · **Alcance:** solo lo que cambió en la entrega 0.6.1 (MT-06, el péndulo). Leído: `js/14-metronomo.js` (programador, `metroDibujar`, péndulo, `setTempo`, `setCompas`, `setSubdivision`, `bindSlider`, escucha de `resize`), el diff de `index.html`, el de `css/trasteando.css` y el de las tres pruebas nuevas de `tests/banco.test.js`, y la fila MT-06 de `docs/matriz-cumplimiento.md`. Banco: 162 de 162, según el informe de la etapa.

**Cuadra:** sí, en lo principal. El péndulo se calcula con el mismo reloj de audio que los golpes, así que no se va desfasando con el tiempo. Solo cuentan los pulsos, no las subdivisiones. Si se pierde un pulso porque el navegador va con retraso, el péndulo espera en el extremo (`u` acotado a 1) y sigue a tiempo con el siguiente golpe que suena, sin dar saltos. Los compases compuestos funcionan porque el periodo, `60/bpm`, coincide con el espacio entre pulsos. Las tres pruebas nuevas cubren lo que dice el criterio de MT-06. Quedan tres casos que el criterio no prueba: tocar la pesa mientras oscila, girar el móvil con el área oculta y cambiar mucho el tempo en marcha.

No hay nada crítico. Hay **un hallazgo alto** que se debe corregir antes de cerrar la etapa.

---

## Hallazgos

### 1. Alto (hoy) · Tocar la pesa mientras oscila cambia el tempo entre 15 y 30 ppm
**Archivo:** `js/14-metronomo.js`, `sliderValor` (l. 295) y `pointerdown` de `bindSlider` (l. 306).

**Problema:** cuando la varilla está girada, la pesa se dibuja más abajo y hacia un lado de donde estaría recta. Con un ángulo θ, queda `d·(1−cos θ)` píxeles más abajo, siendo `d` la distancia de la pesa al pie. El toque llega al deslizador aunque caiga fuera de su caja, porque la pesa es un hijo transformado del deslizador. Pero `sliderValor` solo mira `clientY`, como si la varilla estuviera recta.

En el iPhone en vertical (varilla de 190 px, 220 ppm de recorrido) y a 30°:
- a 80 ppm, cogerla en el extremo la lleva a unos 103 ppm;
- a 30 ppm, a unos 60 ppm.

A tempos lentos el péndulo pasa casi todo el tiempo cerca de los extremos, así que el caso más habitual es justo el peor. Es precisamente el gesto que Pablo hará al probar el péndulo.

**Corrección:** en el `pointerdown`, proyectar el toque sobre la varilla girada usando el ángulo de ese momento. Después la varilla ya está recta y `grados` vale 0.

```js
function sliderValor(clientY, clientX = 0, grados = 0){
  const s = document.getElementById('metro-slider');
  if (typeof s.getBoundingClientRect !== 'function') return state.metro.bpm;
  const r = s.getBoundingClientRect(), largo = r.height - 28;
  if (!(largo > 0)) return state.metro.bpm;
  // Distancia desde el pie medida a lo largo de la varilla, aunque esté girada.
  const a = grados * Math.PI / 180, pieX = r.left + r.width / 2, pieY = r.bottom - 14;
  const d = (pieY - clientY) * Math.cos(a) + (clientX - pieX) * Math.sin(a);
  const p = Math.max(0, Math.min(1, 1 - d / largo));
  return METRO_MIN + p * (METRO_MAX - METRO_MIN);
}
// pointerdown:
const g = parseFloat(s.style.getPropertyValue('--ang')) || 0;   // ángulo antes de enderezarla
metro.arrastrando = true; pintarPendulo(0);
setTempo(sliderValor(ev.clientY, ev.clientX, g));
```

**Prueba que falta:** con `--ang` a 30° y la pesa en 80 ppm, un `pointerdown` en la posición dibujada de la pesa deja el tempo en 80 ±1.

### 2. Medio (hoy) · Si giras el móvil con el metrónomo sonando en otra área, al volver la pesa se sale de su caja
**Archivo:** `js/14-metronomo.js`, `amplitudPendulo` (l. 139) y escucha de `resize` (l. 513).

**Problema:** el metrónomo sigue sonando en las demás áreas (MT-05). Con `#metro` oculto, `clientWidth` vale 0 y `amplitudPendulo()` devuelve `PENDULO_MAX`, que son 30°. El caso es este: arrancas en vertical, pasas a Escalas, giras a horizontal y vuelves. El péndulo oscila ±30° en vez de ±12,7°. Como `.metro` tiene `overflow-y:auto`, la pesa sale unos 84 px de su columna: a la izquierda se corta contra el borde de `#metro` y a la derecha tapa el número de ppm.

Esto contradice el criterio de MT-06, «sin salirse de la pantalla en ninguna disposición». La comprobación en Chromium solo arrancó en cada disposición y no probó este camino.

**Corrección:** no pintar el péndulo cuando está oculto, y medir de nuevo cuando se vea. Así no hace falta ninguna capacidad nueva.

```js
window.addEventListener('resize', () => { metro.amplitud = null; });   // se mide cuando se vea
// amplitudPendulo(): si no se puede medir (oculto), return null en vez de PENDULO_MAX
// metroDibujar():
if (!document.getElementById('metro').hidden){
  if (metro.amplitud === null) metro.amplitud = amplitudPendulo() ?? PENDULO_MAX;
  pintarPendulo(ahora);
}
```

De paso, esto quita el `setProperty` de cada fotograma cuando el área no se ve (ver el hallazgo 4).

**Prueba que falta:** arrancar con la caja a 400 px, ocultar `#metro`, lanzar `resize` con la caja a 200 px, mostrar `#metro` y llamar a `metroDibujar()`. La amplitud debe quedar en unos 15°.

### 3. Medio (hoy) · El péndulo da saltos si cambias mucho el tempo en marcha
**Archivo:** `js/14-metronomo.js`, `pintarPendulo` (l. 151); relacionado con `setCompas` (l. 260).

**Problema:** el periodo se calcula como `60/state.metro.bpm` en cada fotograma. En cambio, `setTempo` deja el siguiente golpe donde estaba. Al cambiar el tempo, `u` cambia de golpe y el ángulo salta.

Ejemplo: a 120 ppm, a mitad de recorrido, pulsas Inicio (30 ppm). El péndulo salta unos 28° hacia atrás. Cuando suena el pulso siguiente, que mantiene el tempo antiguo, salta otros 51° hasta el extremo. Pasa con Inicio/Fin, RePág/AvPág y «Marcar». Con ±1 ppm el salto no se nota.

Además, `setCompas` vacía `metro.cola`. Si ya había un pulso programado en los 100 ms siguientes, suena pero el péndulo no lo cuenta y se queda quieto un pulso en el extremo.

**Corrección:** interpolar hasta el pulso siguiente real, no hasta un periodo teórico. Así el péndulo llega al extremo justo cuando suena el clic, y un pulso perdido solo hace más lenta esa oscilación.

```js
/** Cuándo suena el próximo pulso (no subdivisión). */
function proximoPulso(){
  if (metro.cola.length) return metro.cola[0].t;
  const s = state.metro.sub, faltan = (s - metro.paso % s) % s;
  return metro.inicio + (metro.n + faltan) * metroIntervalo();
}
// en pintarPendulo:
anguloPendulo(ahora, metro.ultimo, Math.max(0.05, proximoPulso() - metro.ultimo), lado, metro.amplitud)
// en setCompas, en lugar de metro.cola = []:
metro.cola.forEach(c => { c.pulso = -1; });   // suenan: el péndulo los cuenta, ningún punto se enciende
```

**Pruebas que faltan:**
- A 120 ppm, `__avanza` hasta u = 0,5, `setTempo(30)` y dos fotogramas seguidos: el ángulo no cambia más de 3°. En el pulso siguiente, extremo ±0,2°.
- `setCompas` en marcha con un pulso en la cola: `metro.vistos` lo cuenta.

### 4. Bajo (al crecer) · Coste por fotograma
**Archivo:** `js/14-metronomo.js` l. 147 a 153; `css/trasteando.css` l. 388.

**Hoy es despreciable.** En cada fotograma se crea un `MediaQueryList` nuevo con `matchMedia(...)`, se busca el elemento con `getElementById` y se escribe `--ang`. Como `--ang` es una variable que se hereda, el navegador recalcula el estilo de los 5 nodos del deslizador. Eso no provoca recolocación (*layout*), porque `transform` no la necesita. Pero sin capa propia, el iPhone vuelve a pintar la pesa, que tiene `box-shadow`, 60 veces por segundo. Además, hoy se pinta aunque el área esté oculta (se arregla con el hallazgo 2).

**Corrección:**

```js
const mqReducir = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null;
const reducirMovimiento = () => !!(mqReducir && mqReducir.matches);   // .matches se actualiza solo
```

```css
.ms-rod { will-change:transform; }   /* capa propia: el giro lo hace la tarjeta gráfica */
```

Conviene comprobar que la prueba de «reducir movimiento» inyecta `matchMedia` antes de cargar el script. Por cómo se llama a `boot(...)`, parece que sí.

### 5. Bajo (a verificar en la Sesión 2 con el iPhone) · Tirones y desfase con auriculares
**Archivo:** `js/14-metronomo.js`, `metroDibujar` (l. 98).

**Problema:**
- En Safari, `audioCtx.currentTime` avanza a saltos del tamaño del búfer del sistema, de unos 10 ms. A 250 ppm, cerca del centro, eso son saltos de unos 4° entre fotogramas, que se pueden ver como tirones.
- `currentTime` es la hora a la que se programa el sonido, no la hora a la que se oye. Con auriculares Bluetooth, el péndulo llegará al extremo entre 150 y 250 ms antes que el clic. Con los puntos ya pasaba, pero en el péndulo se nota más.

**Corrección:** usar `getOutputTimestamp()` si existe, y `currentTime` si no. Es una capacidad nueva, así que hay que anotarla en `docs/compatibilidad.md` (regla 10).

```js
const ts = typeof audioCtx.getOutputTimestamp === 'function' ? audioCtx.getOutputTimestamp() : null;
const ahora = ts && ts.contextTime > 0 ? ts.contextTime + (performance.now() - ts.performanceTime) / 1000
                                       : audioCtx.currentTime;
```

Solo si en la Sesión 2 se ve el problema. No hace falta tocarlo ahora.

### 6. Bajo (hoy, poco probable) · El arrastre puede quedarse «enganchado»
**Archivo:** `js/14-metronomo.js`, `bindSlider` (l. 309 a 316).

**Problema:** si `setPointerCapture` falla (el error se ignora) y sueltas fuera del deslizador, no llega `pointerup`. `metro.arrastrando` sigue en `true`: el péndulo se queda recto mientras suena, y con ratón basta con pasar por encima para cambiar el tempo. Antes ya pasaba con la variable local; ahora además congela el péndulo.

**Corrección:** escuchar también `lostpointercapture`, como ya se hace en `js/99-arranque.js:72`.

```js
s.addEventListener('lostpointercapture', soltar);
```

### Accesibilidad del deslizador invertido · sin hallazgo
Que ↑ y RePág suban las ppm sigue la norma APG y lo que espera un lector de pantalla. VoiceOver en iOS manda flechas hacia arriba y a la derecha para subir el valor, y las dos están asignadas. Inicio (30) y Fin (250) coinciden con la pesa arriba y abajo. Que con el teclado la pesa baje al pulsar ↑ es un compromiso razonable y ya está documentado. `aria-valuetext` sigue diciendo el valor y su nombre. «Reducir movimiento» se consulta en directo en cada fotograma.

---

## Pruebas que faltan para dar MT-06 por demostrado
1. Tocar la pesa girada no cambia el tempo (hallazgo 1).
2. Un cambio de tempo grande en marcha no hace saltar el péndulo, y llega al extremo cuando suena el pulso siguiente (hallazgo 3).
3. Cambiar de compás en marcha no pierde pulsos del péndulo (hallazgo 3).
4. Compás compuesto: en 6/8 con subdivisión 3, extremos solo en cada negra con puntillo, a `60/bpm`. Hoy solo se prueba 4/4 con corcheas.
5. Un pulso saltado porque el navegador va con retraso: el péndulo no salta y llega al siguiente golpe que suena.
6. Girar el móvil con el área oculta y volver (hallazgo 2). En la comprobación visual, añadir el camino «arranca en vertical, cambia de área, gira y vuelve», que es el que pide el criterio «en ninguna disposición».
7. Comprobar en el iPhone, en la Sesión 2, que el movimiento es fluido y va a tiempo. Por eso la fila sigue «Verificado parcialmente».

**Resumen:** sin críticos. Hay que corregir el alto (hallazgo 1, unas 8 líneas y una prueba). Los dos medios conviene arreglarlos en la misma ronda porque son baratos, y el 2 afecta a la letra del criterio. Lo demás se anota en la matriz.

---

## Respuesta (ronda 1, 22/10/2026)

Sin críticos. El alto y los dos medios, corregidos; no hace falta ronda 2. Banco: 168 de 168. Las pruebas nuevas fallan con la versión anterior a la ronda: tocar la pesa la llevaba a 103 ppm, el giro con el área oculta dejaba el péndulo a 30° y el cambio de tempo lo hacía saltar unos 30°.

| # | Nivel | Qué se hizo |
|---|---|---|
| 1 | Alto | **Corregido** como se propone: el toque se proyecta sobre la varilla con el ángulo del momento. Prueba nueva: tocar la pesa inclinada 30° deja el tempo en 80 ±1. |
| 2 | Medio | **Corregido.** `amplitudPendulo()` devuelve `null` con el área oculta; la amplitud se mide al pintarla con el área a la vista; `resize` la marca para medir de nuevo; el péndulo no se pinta oculto. Prueba nueva en el banco y, en Chromium, el recorrido «vertical, otra área, girar, volver»: 30° y luego 12,7°, sin salirse. |
| 3 | Medio | **Corregido** con `proximoPulso()`; `setCompas` marca los pulsos programados con −1 (cuentan para el péndulo, no encienden puntos). Pruebas nuevas: sin salto al pasar de 120 a 30 ppm, extremo en el pulso siguiente, el pulso del cambio de compás cuenta, y 6/8 con corcheas. |
| 4 | Bajo | **Corregido:** la consulta de «reducir movimiento» se crea una vez y `.ms-rod` tiene capa propia (`will-change`). |
| 5 | Bajo | **Anotado** en MT-06 y en la lista de la Sesión 2: fluidez en el iPhone y desfase con auriculares; `getOutputTimestamp()` solo si se nota. |
| 6 | Bajo | **Corregido:** `lostpointercapture` también suelta la pesa; lo comprueba el banco. |
| Pruebas | — | Hechas la 1, 2, 3, 4 y 6. La 5 (un pulso saltado) la cubre `u` acotado a 1 y `proximoPulso()`; la 7 es de la Sesión 2. |
