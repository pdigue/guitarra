# AT-14 · Auditoría técnica (F5.8 #2, ligera)

**Fecha:** 12/11/2026 · **Alcance:** solo lo que cambia la entrega F5.8 #2 (app `0.6.2`): `js/11-afinador-micro.js` (seguir la nota, filtros, modo por defecto), `js/10-tono.js` (ajustes por trozo), `js/03-audio.js` (pantalla encendida), sus llamadas en `js/14-metronomo.js`, `js/02-estado.js` y `js/99-arranque.js`, y las pruebas nuevas de `tests/tono.test.js` y `tests/banco.test.js`. Solo lectura: el auditor no ejecuta el banco. No revisó el CSS ni `compatibilidad.md`.

**Resultado: sin hallazgos críticos ni altos.** 4 medios y 9 bajos. Una ronda.

**Sin problema:** `nivel` indefinido (se salta el cálculo del ruido); los filtros se desconectan al parar, también si falla su creación; quien tenía guardado «De oído» sin elegirlo abre en Micrófono sin escuchar; el coste de analizar 4096 valores 20 veces por segundo es holgado en un hilo aparte (medido: 5 ms por trozo en la máquina de desarrollo); las carreras del cerrojo de pantalla (parar mientras se pide, dos motivos, doble suelta) están resueltas.

**Hallazgos y qué se hizo con cada uno:**

| # | Gravedad | Hallazgo | Resolución |
|---|---|---|---|
| 1 | Medio | El plegado de octava aceptaba también lecturas claras: en Drop D (6ª Re2, 4ª Re3) la 4ª se quedaba como «6ª · Re2». Choca con A-04. | **Corregido:** solo se pliega una octava que llega floja; clara, es otra cuerda y pasa a candidata. Prueba nueva y paso M5 de V-09. |
| 2 | Medio | Un trozo de silencio total dejaba el ruido estimado en casi cero durante unos 10 s, y el filtro de ruido no filtraba. | **Corregido:** suelo `MIC.RUIDO_MINIMO`. Prueba nueva. |
| 3 | Medio | `setMicString` vaciaba las lecturas con la nota «enganchada»: se comparaba con un centro vacío (NaN) y se perdía la nota. | **Corregido:** elegir cuerda repinta lo último medido con la cuerda nueva, y `seguirNota` no sigue nada sin lecturas. Pruebas nuevas. |
| 4 | Medio | El aviso «la pantalla se apagará» dependía de que la capacidad existiera, no de conseguirla. | **Corregido** (`pantallaSeApagara`, `despierta.negado`). Prueba nueva. |
| 5 | Bajo | «Dos lecturas seguidas» no exigía que fueran seguidas. | **Corregido:** una candidata de hace más de tres trozos no cuenta. Prueba nueva. |
| 6 | Bajo | Con el hilo saturado, la lectura que llega se juzga con el nivel del trozo siguiente. | **Anotado** (A-02): solo ocurre si el detector va con retraso; comentario en `micTick` sobre calcular el nivel antes de pasar el trozo. |
| 7 | Bajo | En Node no hay Worker: el banco no vería un nivel calculado tras transferir el trozo. | **Anotado** (A-02), con el comentario en el código como guarda. |
| 8 | Bajo | Se atenuaba a los 100 ms sin lectura: posible parpadeo al borde del ruido. | **Corregido:** 200 ms. A mirar en el iPhone. |
| 9 | Bajo | Con dos cuerdas sonando, la nueva solo releva si llega clara. | **Anotado** (A-02) como límite de un detector de una sola nota. |
| 10 | Bajo | Si el sistema suelta el cerrojo con la app a la vista, no se volvía a pedir. | **Corregido.** Prueba nueva. |
| 11 | Bajo | Una variable local `despierta` en `startMetro` tapaba a la global. | **Corregido:** `reanudado`. |
| 12 | Bajo | «Restablecer» con el micrófono escuchando no lo apagaba ni devolvía la cuerda a «Auto». | **Corregido.** Prueba nueva. |
| 13 | Bajo | Comentario de cabecera con «2048» y `mic.ultimaHz` sin declarar. | **Corregido.** |

**Pruebas que el auditor echó en falta:**
- Las 12 grabaciones reales con ruido por el camino entero del afinador: **añadida** (primera lectura en 165 ms como mucho; ya asentada la cuerda, peor lectura a 3,4 cents).
- Octava entre cuerdas, silencio total al arrancar, candidatas no seguidas, cambio de cuerda a mano, «Restablecer», cerrojo negado y cerrojo soltado por el sistema: **añadidas**.
- Giro de clavija rápido (100 cents por segundo), ruido que sube de golpe, zumbido periódico de 100 Hz y el camino sin filtros: **anotadas** en A-02, para una etapa posterior.
- Solo en el iPhone (V-09): que los filtros entreguen datos al analizador en Safari, el cerrojo en la web y en la app instalada, y los minutos de G-13.
