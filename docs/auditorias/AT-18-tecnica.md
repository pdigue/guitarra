# AT-18 · Auditoría técnica ligera · F5.8 #7 (metrónomo, 0.6.7)

- **Fecha:** 15/11/2026 · **Rama:** `auto/F5.8-metronomo` (PR #22) · **Auditor:** auditor-tecnico (solo lectura)
- **Entrada:** el diff del bloque (`js/14-metronomo.js`, `tests/banco.test.js`, `herramientas/medir-metronomo.js` y los generadores de requisitos y matriz) y el banco (`node --test`, 208 en verde).
- **Lecturas usadas:** 3 de 10 (dos rangos de `js/14-metronomo.js` y una búsqueda con grep), además de la definición y el diff.

## Hallazgos

### Crítico
Ninguno.

### Alto
**A1 · `js/14-metronomo.js` (`metroRebobinar`): con dos cambios seguidos, un `n` caducado manda el metrónomo minutos adelante.**
`metroRebobinar(true)` (desde `setCompas` y `setSubdivision`) deja en `metro.programados` las subdivisiones anteriores al pulso, porque deben sonar. Su `n` y su `paso` se calcularon con el `metro.inicio` de antes, y justo después el cambio mueve `inicio` al pulso y pone `n = 0`. Si llega un segundo cambio (tempo, acento, otra figura, «Marcar») mientras alguna de esas subdivisiones sigue pendiente, `findIndex` la elige y `metro.n` toma el número de golpes desde el rebase anterior, relativo a un `inicio` que ya no vale. Tras dos minutos a 120 ppm con corcheas, pasar a negras y enseguida a semicorcheas haría `inicio += ~480 × intervalo`: el metrónomo calla minutos mientras dice «sonando». Regresión de este bloque; poco probable, pero grave.
*Propuesta:* no rebobinar nunca a un golpe anterior al `inicio` vigente (`p.t >= metro.inicio - 1e-9`), con una prueba de dos cambios seguidos y otra del camino `soloPulsos` con el pulso ya programado (la de `setSubdivision` existente no llega a programarlo).

### Medio
Ninguno aparte de A1.

### Bajo
- **B1 · `metroCallar`: comprobado, sin hallazgo.** La especificación de Web Audio aplica la última llamada a `stop()`; Chrome y Firefox lo cumplen, y `stop(0)` antes del `start(t)` hace que no suene y que salte `onended`. El WebKit antiguo lanzaba `InvalidStateError` con un segundo `stop()`, pero el `try` lo recoge y `g.disconnect()` lo calla igual. Sin fugas: `programados` se recorta en cada repaso y `stopMetro` la vacía.
- **B2 · `METRO_MARGEN = 0,01`.** En Android o con Bluetooth el audio se calcula a ráfagas de 10 a 40 ms: un golpe a menos de una ráfaga puede estar ya calculado y `stop(0)` lo cortaría a medias (un chasquido). *Propuesta:* 0,03 s.
- **B3 · `metroOido` y su prueba.** Con el `performance.now()` falso fijo, el término `(performance.now() − performanceTime)/1000` vale siempre 0 y no se prueba. *Propuesta:* un caso con 50 ms de diferencia. Además, `getOutputTimestamp()` manda sobre `outputLatency`; si Safari incluye ahí la latencia de unos auriculares Bluetooth, se verá en la prueba en el iPhone.
- **B4 · Rendimiento al arrastrar el tempo.** Cada `input` del deslizador retira y vuelve a crear hasta 0,3/intervalo osciladores (unos 5 por evento a 250 ppm con semicorcheas). Asumible hoy; si se nota en el iPhone, agrupar los cambios con `requestAnimationFrame`.
- **B5 · `herramientas/medir-metronomo.js`.** El comentario dice que los retirados «no cuentan», pero no se filtran (no afecta: solo hay retirados al Parar); sobran un `.filter` y la variable `inicio`. Playwright ya se usaba: no es una dependencia nueva.

## Las pruebas nuevas
- **60 s a 250 ppm con tirones:** prueba lo que dice (cuenta y separación de 1e-6 s, con tirones deterministas de hasta 0,27 s).
- **Parar, tempo y acento:** prueba lo que dice; con la 0.6.6 habría dado [0, 0,5, 1,0], y el filtro de `__golpes` comprueba que lo retirado no suena.
- **Luz:** cumple, salvo B3. Falta el camino `soloPulsos` con el pulso ya apuntado y los cambios encadenados (A1).

## Veredicto
No se puede cerrar hasta corregir A1. Lo demás no bloquea: B2 a B5 a la matriz; B1, como comprobación.

## Respuesta (15/11/2026)
- **A1, corregido:** `metroRebobinar` ya no vuelve a golpes anteriores al `inicio` vigente. Prueba nueva «cambiar compás o figura con el pulso ya apuntado… dos cambios seguidos no hacen saltar el contador»: sin la corrección, tras `setCompas` y `setTempo` seguidos no sonaba ningún golpe más; con ella, la corchea suena y el pulso sigue en su sitio. La misma prueba cubre `setCompas` y `setSubdivision` con el pulso ya programado.
- **B2, hecho:** `METRO_MARGEN = 0,03`.
- **B3, hecho:** caso con 50 ms entre la medida y ahora.
- **B5, hecho:** comentario y código limpios en la herramienta.
- **B4:** anotado en las notas de MT-04, por si se nota en el iPhone.
