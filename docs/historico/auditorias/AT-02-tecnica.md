# AT-02 — Auditoría técnica · CP-1

**Fecha:** 15/10/2026 · **Rama:** `auto/F1-iteracion-0` · **Commit:** `8da85c5` (el código es el de `8888416`, app 0.1.3) · **Banco:** `node --test` da 12/12 en verde, con 7,5 s de reloj y 0,6 s de CPU.

**Veredicto:** se puede pasar a F2.2 después de corregir un hallazgo alto (la carrera de timbre, reproducida). La 0.1.3 es correcta, pero la prueba 12 promete más de lo que comprueba.

## Hallazgos

| # | Severidad | Archivo y zona | Problema | Corrección propuesta |
|---|---|---|---|---|
| 1 | **Alto** · hoy | `index.html`, `loadSampler` (l. 677-703) y `setTimbre` (l. 1462-1482) | Con nylon cargado, si se pulsa Acústica y se vuelve a Nylon antes de que acabe la descarga, `loadSampler('nylon')` sale por el atajo sin incrementar `samplerRequest`. La carga acústica sigue contando como la última y acaba instalada. Lo reproduje con Tone simulado: el botón y `state.timbre` dicen nylon, suena la acústica y el aviso dice «acústica». La rama de error tiene el mismo hueco. El CHANGELOG 0.1.1 lo da por corregido. | Fragmento 1 |
| 2 | Medio · hoy | `tests/banco.test.js`, prueba 12 | No comprueba lo que dice su nombre. La app descarga de `SAMPLE_BASE` (nbrosowsky.github.io), no de `samples/`, y el sha256 solo compara los archivos locales con el JSON. `m.nota === nota` es tautológico porque la herramienta copia `nota` del nombre del archivo. Lo único que vale es `abs(cents) ≤ 5`. Con la lista antigua falla por «no está medido», no por los cents. | Renombrarla hoy. Que la herramienta escriba `nota_medida` (el MIDI más cercano a `hz_medida`) y comparar esa. En F2.2, `SAMPLE_BASE='samples/'` y una prueba de cero URLs externas. |
| 3 | Medio · hoy (verificar en la Sesión 1) | `playMidi`/`playSynth` (l. 705-725) | Nada reanuda el contexto si iOS lo deja en `interrupted` (llamada, bloqueo, cambio de app). `playMidi` no mira el estado y `playSynth` solo trata `'suspended'`. No hay `visibilitychange`. | `if (ctx.state !== 'running') ctx.resume()` en cada `pointerdown` |
| 4 | Medio · hoy | `samples/*.mp3` | Silencio inicial medido con `silencedetect` a −40 dB: 27 ms en E2 y E5 de nylon, 49 y 52 ms en E2 y D5 de acústica. Es retardo puro en cada toque, del mismo orden que el que quitó AUD-03. | En F2.2, `start(t, offset)` con el inicio calculado al decodificar |
| 5 | Bajo · hoy | `newChallenge`, l. 1176 | `setTimeout(playChallenge, 320)` no se guarda en ninguna variable. Ir de Adivinar a Libre y volver a Adivinar en menos de 320 ms hace sonar el reto dos veces (reproducido). | Guardarlo en `playTimer` y limpiarlo en `newChallenge` y `setScreen` |
| 6 | Bajo · hoy | Pestañas (l. 1525) → `setScreen` (l. 1383) | Tocar la pestaña Adivinar estando ya en ella pone la racha a 0 sin haber fallado. | `if (next === screen) return;` |
| 7 | Bajo · al crecer | `SAMPLE_MAPS`, registro agudo | `E5.mp3` de nylon dura 1,51 s. En el traste 24 de la 1ª se transporta +12 semitonos y queda en 0,76 s. Con afinación personalizada (69 + 24) se llega a +17 en nylon y +19 en acústica. | Ya está previsto en F2.4. Falta una prueba del transporte máximo. |
| 8 | Bajo · al crecer | Banco, `sleep` | Las esperas copian las constantes de la app (320, 650, 2300 y 1500 ms) con márgenes de 150 y 350 ms. El orden de los temporizadores de Node casi descarta falsos fallos, pero cualquier ajuste de tiempos rompe pruebas, y el banco tarda 7,5 s. | `mock.timers` de `node:test` (Node 22) activado antes de `boot`, y `tick()` en lugar de `sleep` |

**Fragmento 1**
```js
async function loadSampler(timbre){
  if (typeof Tone === 'undefined') return false;
  const req = ++samplerRequest;          // toda elección invalida las anteriores
  if (samplerReady && samplerTimbre === timbre) return true;
  …
  } catch(e){
    if (next) { try { next.dispose(); } catch(e2){} }
    if (req !== samplerRequest) return 'stale';
    …
}
// en setTimbre, tras el await:
if (ok === 'stale' || state.timbre !== timbre) return;
```

## La 0.1.3 y el método de medida
- **La corrección es correcta.** En nylon, el Do5 usa A4 (+3) y del Do♯5 al Mi6 usan E5 (de −3 a +12), sin empates. Los 622,6 Hz medidos en el D5 retirado corresponden a Re♯5 (+1 cent).
- **El producto armónico basta para ±5 cents.** Usa ventana Hann de 0,74 s, relleno hasta 2¹⁸ (0,17 Hz por punto), interpolación parabólica y `fmin` de 50 Hz, que evita el error de octava en E2. Si hubiera un error de octava saldría como ±1200 cents, así que se ve a simple vista y no pasa en silencio.
- **Límites.** Mide en una sola ventana, que empieza 80 ms después del ataque e incluye la subida de tono inicial; además, la inarmonicidad desplaza los armónicos altos. Estimo un sesgo menor de 2 cents. No afecta al umbral, pero sí importa si F2.2 corrige por cents. Propongo medir también una segunda ventana a 500 ms y exigir que las dos coincidan en menos de 2 cents.

## F2.3 en números
Datos medidos: 16 MP3 CBR a 192 kbps, mono, 44,1 kHz; 87,9 s y **2.110.758 B** en total. El base64 multiplica el peso por 4/3.

| Opción | MP3 | Base64 | HTML resultante |
|---|---|---|---|
| Tal cual, 2 timbres | 2,11 MB | 2,81 MB | ≈ 2,88 MB |
| Solo nylon (30,0 s) | 0,72 MB | 0,96 MB | ≈ 1,03 MB |
| 2 timbres a 96 kbps | ≈ 1,06 MB | ≈ 1,41 MB | ≈ 1,48 MB |
| Recorte a 4,5 s con fundido (62,1 s), 128 kbps | ≈ 0,99 MB | ≈ 1,32 MB | ≈ 1,39 MB |
| Mismo recorte a 96 kbps | ≈ 0,74 MB | ≈ 0,99 MB | ≈ 1,06 MB |

Las estimaciones por tasa de bits son fiables: tasa × duración da el peso real con menos del 0,1 % de error. Una vez decodificado (float32 a 48 kHz), el nylon ocupa 5,8 MB y la acústica 11,1 MB, así que conviene decodificar solo el timbre activo. El recorte a 4,5 s cubre la nota más larga de la app: la del afinador, 3 s más 1,2 s de liberación.

Es viable. Recomiendo:
1. **No incrustar el audio en `index.html`.** `samples/` sigue siendo la fuente y un generador en `herramientas/` produce `dist/trasteando.html`. Con 2,8 MB de base64 en una sola línea, cada `grep` o `diff` volcaría megas y encarecería cada auditoría.
2. Poner cada muestra en `<script type="application/octet-stream" id="…">`. Así el JavaScript no tiene que analizar 2,8 MB y la función `appScript` del banco sigue funcionando.
3. Cargar las muestras con `fetch('data:audio/mpeg;base64,…')`, el mismo camino que una URL.
4. Mantener MP3. Opus y AAC no se decodifican igual en todos los navegadores.
5. En iPhone la app Archivos no ejecuta JavaScript (lo recoge el roadmap). La autonomía en el iPhone llega con el Service Worker de F6.2.

## Diseño recomendado para F2.2
- **Un solo contexto**, creado y desbloqueado de forma síncrona en el clic de la pantalla de entrada (búfer de una muestra y `resume()`), antes de cualquier `await`. `navigator.audioSession.type = 'playback'` (Safari 16.4 o posterior) para que suene con el interruptor de silencio puesto; verificar en la Sesión 1. Hallazgo 3: `resume()` en cada toque si `state !== 'running'`.
- **Carga:** `fetch → arrayBuffer → decodeAudioData`, solo del timbre activo, con el contador de peticiones comprobado después de **cada** `await` (hallazgo 1). Al decodificar se calcula `offset`: el primer punto que supera el 5 % del pico, menos 2 ms (hallazgo 4).
- **Datos:** `SAMPLE_MAPS` lleva los cents medidos (`E2: ['E2.mp3', -2.8]`), con una prueba que los compare con `afinacion.json`.

```js
function pick(midi, set){   // la más cercana; a igual distancia, la de arriba (como Tone)
  return set.reduce((a, b) => { const da = Math.abs(midi-a.midi), db = Math.abs(midi-b.midi);
    return db < da || (db === da && b.midi > a.midi) ? b : a; });
}
const rate = (midi, s) => 2 ** ((midi - s.midi)/12 - s.cents/1200);
function play(midi, dur = 1.8, rel = 1.2){
  if (ctx.state !== 'running') ctx.resume();
  const s = pick(midi, samples), t = ctx.currentTime;
  const src = ctx.createBufferSource(), g = ctx.createGain();
  src.buffer = s.buffer; src.playbackRate.value = rate(midi, s);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.7, t + 0.003);
  g.gain.setTargetAtTime(0, t + dur, rel/4);          // −35 dB al terminar rel
  src.connect(g).connect(master); src.start(t, s.offset); src.stop(t + dur + rel);
}
```
- **Corregir por cents** importa en el afinador. En la acústica, E4 está a +4,5 cents y G3 a −4,2; sin corrección, quien afine de oído dejaría esas cuerdas 4 cents desviadas.
- **Polifonía:** como máximo unas 8 voces; la más antigua se corta con un fundido de 30 ms. El Karplus-Strong sigue de respaldo y comparte el mismo contexto.

## Pruebas que faltan
1. Carrera de timbre con un Tone simulado inyectado mediante `A.ev(...)`. Es como reproduje el hallazgo 1 y ocupa una docena de líneas.
2. El reto suena una sola vez, contando las llamadas a `playMidi` (hallazgo 5).
3. Ninguna URL externa en `index.html` (criterio de F2.2).
4. `pick` y `rate` para MIDI de 33 a 93: toda nota tiene muestra, el transporte está acotado y en la nota exacta `rate` vale 2^(−c/1200).
5. Migración: `{fretNums:'guide', showFretNums:false}` conserva `'guide'`. Ajustes guardados que no son un objeto (`"x"`, `[]`, `5`). `timbre` y `maxChallengeFret` inválidos.
6. Tras un acierto llega un reto nuevo a los 1500 ms y `locked` se libera.
7. Para F2.3: el sha256 de cada muestra incrustada coincide con `afinacion.json`.

## Estado de AT-01

| AUD | Estado |
|---|---|
| 01, 02, 03, 05, 11, 12, 13, 14, 16, 17, 18, 23 | Resueltos (comprobado en el código o en el banco) |
| 08 | Reabierto en parte por el hallazgo 1 |
| 07 | Abierto: Tone viene de cdnjs sin SRI y las muestras siguen siendo remotas. Se cierra con F2.2. |
| 06 | Abierto: el manifiesto es una URL `data:` sin iconos PNG |
| 04 | Parcial: existe `@media (max-height:520px)`; verificar en la Sesión 1 |
| 09, 10 | Parciales: los interruptores y el contraste están corregidos, pero el mástil no se puede usar con teclado (las celdas no tienen `tabindex`) |
| 15, 19–22 | Abiertos; están previstos para cuando la app crezca |
| 00 | Documental; le corresponde a la auditoría de requisitos |

---

## Respuesta del chat de Desarrollo · 15/10/2026

| # | Decisión | Qué se hizo |
|---|---|---|
| 1 | ✅ Corregido en 0.1.4 | Fragmento 1 aplicado tal cual, más una prueba con Tone simulado que falla con la 0.1.3. AUD-08 vuelve a cerrado. |
| 2 | ✅ Corregido | La prueba se llama ahora por lo que comprueba y calcula los cents desde `hz_medida`; la herramienta escribe `nota_medida` y `midi_medido`. Prueba pendiente visible (`test.todo`) para «ninguna dirección externa», que se cierra en F2.2. |
| 3 | ✅ Corregido en 0.1.4 | `wakeAudio()` reanuda el contexto en cada nota si no está en marcha. Se confirma en la Sesión 1. |
| 4 | ⏩ Aplazado a F2.2 | El reproductor propio calculará el `offset` al decodificar. |
| 5 | ✅ Corregido en 0.1.4 | `playTimer`, con prueba. |
| 6 | ✅ Corregido en 0.1.4 | La comprobación se hace al pulsar la pestaña, para que `setScreen` siga sirviendo para refrescar. Con prueba. |
| 7 | ⏩ F2.4 | Criterio de transposición máxima añadido a F2.4. |
| 8 | ⏩ F2.2 | Se pasará a `mock.timers` cuando el reproductor propio cambie los tiempos. |
| F2.3 | ✅ Aceptado | El roadmap fija ≤ 1,5 MB y ≤ 3 s, y un generador en `dist/`: `index.html` no lleva el audio dentro. |
| F2.2 | ✅ Aceptado | El diseño recomendado es la base de F2.2, incluida la corrección por cents medidos y la segunda ventana de medida. |
