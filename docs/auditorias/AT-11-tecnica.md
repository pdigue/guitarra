# AT-11 · Auditoría técnica (CP-5: toda la fase F5)

**Fecha:** 22/10/2026 · **Alcance:** a fondo, el código de F5 de la 0.4.2 a la 0.5.6 (`js/13-escalas.js`, `js/14-metronomo.js`, `js/15-acordes.js` y los módulos que tocan, `index.html`, CSS, banco y herramientas), con atención a la corrección musical y a la precisión del pulso · **Partida:** banco 80 de 80 y las cuatro comprobaciones de Chromium en verde · **Auditor:** de solo lectura, en paralelo con AR-12

**Cuadra:**
- **Escritura de escalas:** las tablas de tónicas son correctas; a mano, Fa♯ mayor y Re♯ menor con Mi♯, Sol♯ menor, Si♭ menor, Re♭ mayor y Re♯ pentatónica menor. Sol♭ no se ofrece, por diseño. El código ya admite 𝄫 y 𝄪.
- **Mástil y pentagrama:** la pertenencia va por la nota sin octava (vale en cualquier afinación); la altura del pentagrama, por la letra (Mi♯4 en la línea de Mi). N-06 solo afecta a lo que no es de la escala.
- **Acordes:** las 30 digitaciones, una a una, suenan solo a notas de su acorde, con el bajo correcto y los dedos y cejillas coherentes (Cm x35543, B7 x21202, G/B y C/G con su bajo).
- **Metrónomo:** cada golpe en inicio + n × intervalo sobre el reloj de audio, 100 ms por adelantado, sin deriva; tempo, compás y figura cambian sin mover el pulso; se salta lo atrasado; se para al ocultar, al rehacer el audio y con el micrófono; libera temporizadores; las figuras de 3/8 y 6/8 son correctas.

**Sin críticos. Un alto, corregido en la 0.5.7.**

| # | Severidad | Archivo | Problema | Resolución |
|---|---|---|---|---|
| 1 | Alto | `js/14-metronomo.js` | Con el audio en pausa (iPhone tras una llamada o Siri), `resume()` no cambia el estado en el acto; `metroProgramar()` lo veía parado y paraba el metrónomo: «Se paró: el sistema detuvo el sonido». El banco no lo veía: su `resume()` era instantáneo | **Corregido.** `startMetro` pide `resume()` dentro del toque y espera a que despierte (400 ms como mucho); si no despierta, avisa; volver a pulsar cancela la espera. Prueba nueva con un `resume()` lento, comprobada fallando con el código anterior |
| 2 | Medio | `js/14-metronomo.js` | Parar no cancela los golpes ya programados (hasta 100 ms): a veces suena un clic de más | Anotado en MT-04 (junto con el #6, mismo cambio) |
| 3 | Medio | `js/13-escalas.js`, `js/04-pentagrama.js` | Con la cuerda más grave en Do♯2 o menos, la octava se decide nota a nota: la escala parece bajar (AT-09 #10, abierto) | Anotado en E-06 |
| 4 | Medio (al crecer) | `js/09-navegacion.js`, `js/05-mastil.js`, `js/13-escalas.js` | Cada área nueva obliga a tocar cuatro o cinco sitios | Anotado en G-02: un registro de áreas |
| 5 | Bajo (sospecha) | `js/14-metronomo.js` | La luz del pulso no descuenta la latencia de salida (AirPods) | Anotado en MT-04 |
| 6 | Bajo (sospecha) | `js/14-metronomo.js` | Osciladores sin desconectar al terminar | Anotado en MT-04 |
| 7 | Bajo (al crecer) | `js/15-acordes.js` | El rasgueo usa `setTimeout` en vez del reloj de audio | Anotado en AC-01 |
| 8 | Bajo (al crecer) | `js/15-acordes.js` | Raíz y bajo solo con letras naturales: no admite F♯m, B♭ ni D/F♯ | Anotado en AC-01 |
| 9 | Bajo (al crecer) | `js/01-teoria.js` | Una alteración fuera de ±2 escribiría «Doundefined» | Anotado en E-02 |
| 10 | Bajo | `js/01-teoria.js` | `LATIN` y los campos `anglo` y `latin` ya no se usan y se saltarían N-06 | Anotado en N-06 |

**Pruebas que faltan** (anotadas en su requisito): las 48 escalas en el mástil (E-02); el pentagrama con afinación muy grave (E-06); la cejilla y los 30 acordes dibujados (AC-01); que tras Parar no quede ningún golpe por sonar y 1000 golpes sin deriva con cambios de tempo (MT-04). En el iPhone, en la Sesión 2: diez minutos a 250 ppm con semicorcheas y volver tras una llamada y pulsar Empezar.
