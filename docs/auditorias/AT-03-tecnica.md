# AT-03 — Auditoría técnica · CP-2

**Fecha:** 19/10/2026 · **Commit:** `b38d48e` (main, 0.2.2) · **Alcance:** `v0.1.5..HEAD` (7 commits), modo ligero

**Veredicto:** apto con observaciones. No hay hallazgos críticos ni altos. El reproductor sigue el diseño recomendado en AT-02. Lo que falta es que el banco ejecute el grafo de audio y que el iPhone confirme el desbloqueo.

## Hallazgos

| # | Severidad | Archivo y zona | Problema | Corrección propuesta |
|---|---|---|---|---|
| 1 | Medio · hoy | `tests/dom-minimo.js` (no simula `AudioContext`) y `sinErrores` (banco, l. 15) | Ninguna prueba ejecuta el grafo de audio. Sin contexto, `playSample` devuelve `false` y `playSynth` sale sin hacer nada. Las voces, el robo de voz, la envolvente, `start(t, offset)`, `wakeAudio` y `unlockAudio` (el núcleo de F2.2) no tienen cobertura, y `sinErrores` filtra justo los errores de `AudioContext`. | Un `AudioContext` falso de unas 30 líneas que anote `start`, `stop`, `playbackRate`, las rampas y `resume`, inyectado con `A.ev(...)`. |
| 2 | Medio · hoy en Windows | Banco l. 246-249; `generar-autonomo.py` (`write_text`) | No hay `.gitattributes`. Git para Windows hace la copia de trabajo con CRLF por defecto. Entonces detrás de `FIN` viene `\r\n`: el corte `FIN + '\n'` deja un `\n` suelto y «autónomo al día» falla aunque el autónomo esté al día. Además, en Windows `write_text` escribe CRLF. | `.gitattributes` con `text eol=lf`. En el generador, `write_bytes`. En la prueba, cortar con `\r?\n`. |
| 3 | Bajo · hoy | `#set-reset` | Al restablecer desde Acústica, bajo el selector (que ya marca Clásica) sigue el texto «Guitarra acústica de cuerdas de acero». Además se ignora el `false` de `loadSamples`: si la carga falla, suena la acústica con la interfaz en Clásica. | Reutilizar `setTimbre`, que ya trata el aviso, el fallo y las cargas obsoletas. |
| 4 | Bajo · hoy | Banco l. 194-217 | El nombre dice «suenan en su frecuencia», pero la prueba no hace sonar nada: compara `hz_medida × rate`, que cuadra por construcción. Lo útil es la cobertura y el transporte. El tope de 19 es el mismo para los dos timbres. | Renombrarla y poner un tope por timbre: `{nylon: 11, acoustic: 19}`. |
| 5 | Bajo · al crecer | Banco l. 242-256 | «Autónomo al día» compara el HTML y los ids, pero no el audio. | Que el generador guarde el `sha256` del original y la prueba compare las huellas de cada bloque y la versión. |
| 6 | Bajo · al crecer | Banco l. 167-174 | La prueba de «sin descargas» no detecta direcciones sin protocolo (`//cdn…`). Hoy no hay ninguna. | Añadir `/["'(=]\s*\/\/[a-z0-9]/i`. |
| 7 | Bajo · al crecer | Banco, 14 `sleep` | AT-02 #8 sigue abierto: el paso a `mock.timers` no se hizo; el banco tarda 8 s. | La misma que en AT-02. |
| 8 | Bajo · al crecer | `generar-autonomo.py`, `LIMITE` | Quedan 40 KB de margen. Una grabación aguda más para la acústica de 4,5 s ocupa unos 97 KB en base64 y pasa del límite. | Recortar a 4,2 s, o subir el límite y justificarlo en la matriz. |

## El reproductor

- **Carreras:** `loadSamples` sube el contador antes del atajo y descarta las cargas viejas en las dos salidas; `setTimbre` descarta `'stale'` y los cambios de `state.timbre`. Cierra AT-02 #1, con prueba. Si una grabación falla, falla el timbre entero y se avisa: correcto.
- **Voces:** como máximo 8; la más antigua se apaga en unos 50 ms y `onended` la libera. Que el robo de voz no suene a chasquido hay que oírlo en el iPhone.
- **Envolvente:** entrada de 3 ms y salida a −35 dB al llegar a `stop`. Las grabaciones agudas acaban en silencio (−75 a −152 dB en los últimos 50 ms).
- **`offset`:** absorbe también el retardo que añade el codificador MP3 a las copias del autónomo.
- **iOS:** contexto creado y desbloqueado en el clic, antes del primer `await`; `audioSession = 'playback'` si existe; `wakeAudio` cubre `interrupted`. A verificar en la Sesión 1: el reto que suena por temporizador tras una llamada. Con `'playback'` la app corta la música de otras apps; conviene que el cliente lo sepa.
- **Memoria:** solo el timbre activo; unos 5,6 MB (nylon) y 6,6 MB (acústica) con el autónomo. Aceptable.

## Arranque con el audio incrustado

`atob` y la copia a bytes tardan 19 y 23 ms en Node; las decodificaciones van en paralelo fuera del hilo principal. El generador comprueba que la afinación no cambie más de 0,5 cents: las 17 grabaciones salen idénticas a una décima de cent. No es un riesgo.

## Dependencias externas

Ninguna. La única dirección `http` es el espacio de nombres de SVG. Banco: 20 de 20, en 8 s.

## Pruebas que faltan

1. Con un `AudioContext` falso: `start(t, offset)`, `playbackRate` y envolvente; robo de voz y liberación.
2. `wakeAudio` con `interrupted`, `suspended` y `closed`.
3. `unlockAudio` antes del primer `await` y con `audioSession`.
4. Fallo de carga con `setTimbre` y en el arranque.
5. Restablecer desde Acústica.
6. Huellas de cada bloque del autónomo y versión.
7. En el iPhone, en la Sesión 1: interruptor de silencio, primer reto tras una llamada o un bloqueo, robo de voz tocando deprisa y tiempo hasta tener el sonido.

## Estado de AT-02

| # | Estado |
|---|---|
| 1 | Resuelto, con prueba |
| 2 | Resuelto |
| 3 | Corregido en el código; falta confirmarlo en el iPhone |
| 4 | Resuelto; la prueba solo cubre `soundStart` |
| 5, 6 | Resueltos, con prueba |
| 7 | Parcial: nylon ≤ 6 en estándar y +11 como máximo; acústica +14 y +19 |
| 8 | Abierto (hallazgo 7) |

---

## Respuesta del chat de Desarrollo · 19/10/2026

| # | Decisión | Qué se hizo (0.2.3) |
|---|---|---|
| 1 | ✅ Corregido | Contexto de audio simulado en el banco y tres pruebas: arranque sin silencio, velocidad y envolvente; 8 voces y liberación; reanudar el audio interrumpido y no el cerrado. Las pruebas 3 y 4 de la lista quedan para cuando se toque el arranque. |
| 2 | ✅ Corregido | `.gitattributes` con `eol=lf`, el generador escribe bytes y la prueba tolera `\r\n`. |
| 3 | ✅ Corregido | Restablecer pasa por `setTimbre`, con prueba que falla con la 0.2.2. |
| 4 | ✅ Corregido | Prueba renombrada y tope de transporte por timbre. |
| 5 | ✅ Corregido | El informe del generador guarda las huellas; la prueba las compara y comprueba la versión. |
| 6 | ✅ Corregido | Búsqueda de direcciones sin protocolo. |
| 7 | ⏩ Aplazado | `mock.timers` cuando F3 cambie los tiempos de la interfaz. |
| 8 | ✅ Resuelto con AR-03 #4 | Dos límites: audio ≤ 1,45 MB (hoy 1,38) y archivo ≤ 2 MB (hoy 1,46). |
| iOS | ✅ Anotado | La interrupción de la música de otras apps, en `compatibilidad.md`; las comprobaciones del iPhone, en la lista de la Sesión 1. |
