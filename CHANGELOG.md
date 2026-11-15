# Registro de cambios — Trasteando

Todas las versiones de la app, de la más reciente a la más antigua.

**Pauta de versiones:** `0.‹fase›.‹corrección›` mientras se desarrolla —la `0.1.x` corresponde a la fase F1 del roadmap, la `0.2.x` a la F2…— y `1.0.0` en el lanzamiento (F7). Cada entrada cita los requisitos de `requisitos.md` que la motivan, para poder seguir el hilo en ambos sentidos. Formato inspirado en *Keep a Changelog*.

Las versiones anteriores a la 0.6.0, de la 0.0.1 a la 0.5.7, están en `docs/historico/CHANGELOG.md` (rama `archivo/hasta-0.6.2`).

| Versión | Fecha | Etapa | Dónde está |
|---|---|---|---|
| **0.6.3** | 15/11/2026 | F5.8 · #3 y #4, temas, iPad y Adivinar | Rama `auto/F5.8-aspecto` |
| 0.6.2 | 12/11/2026 | F5.8 · #2, el afinador sigue la nota; pantalla encendida | Rama `auto/F5.8-saneamiento` (PR #18) |
| 0.6.1 | 22/10/2026 | F5.8 · #1, el péndulo del metrónomo | Rama `auto/F5.8-saneamiento` (PR #18) |
| 0.6.0 | 22/10/2026 | F6.1 · el archivo autónomo, probado como la app | `main`, fusionada el 22/10 (PR #17) |

---

## [Sin publicar]

Nada todavía.

---

## [0.6.3] — 15/11/2026 · F5.8 · Temas, iPad y Adivinar

Tus comentarios del 12/11 #3 («un *looking* más limpio, estética un poco Apple (…) también en iPad, que no está preparado») y #4 («las pistas deberían salir en grande (…) se confunde qué tenemos que buscar y cuál es la que hemos tocado»).

### Añadido
- **V-10** · **Temas elegibles** en Ajustes › Aspecto: *Madera* (el de siempre, más limpio y de fábrica), *Automático* (claro u oscuro, como el dispositivo, con los grises y el naranja del sistema de Apple) y *Partitura* (papel, tinta y rojo de imprenta, la propuesta nueva). El mástil es oscuro en todos, para que los colores de las notas se lean igual. En un tema claro, la nota leída, las pistas y el pentagrama se escriben con la tinta del texto, porque los colores pastel no se leen sobre papel.
- **V-11** · **Disposición propia para tableta y ordenador** (700 × 700 px o más): el mástil ya no se estira (en un iPad en vertical las cuerdas medían 150 px; ahora 67), se centra, y lo que sobra va al pentagrama y a la lectura, que crecen; textos y botones más grandes; las pestañas son un control segmentado, en su propia fila si no caben junto al nombre.

### Cambiado
- **J-06** · En Adivinar, cada pista encendida **ocupa su parte de la franja**, con la respuesta en grande (30 px en el móvil, 44 en tableta); una respuesta larga («1ª 2ª 3ª 4ª») se reduce para caber entera.
- **J-01** · La nota que tocas se lee **en pequeño y apagada**, junto al pentagrama, para que no compita con la que buscas.
- **C-02** · Ajustes tiene el grupo **Aspecto**.
- Más limpio en todos los temas: chips sin borde, tarjetas redondeadas, sin degradados de fondo ni líneas de separación de más.

### Corregido
- **V-04** · En un iPad en horizontal (1024 px), el mástil de inicio enseñaba los 24 trastes a 38 px; con el dedo ahora enseña los que caben a 40 (22).

### Para el desarrollo
- Fichas de color por tema en `css/trasteando.css`; `aplicarTema()` en `js/09-navegacion.js` pone `data-theme` y `data-scheme` en `<html>`.
- `comprobar-accesibilidad.js` admite `TEMA` y `ESQUEMA`; `comprobar-disposicion.js` mide seis pantallas de tableta y ordenador y comprueba que las pestañas no pisan nada.
- Baseline 0.6.2 (15/11): requisitos y matriz v2.0 y v2.1, roadmap v4.0, histórico en `docs/historico/`, y `tests/documentos.test.js`.

---

## [0.6.2] — 12/11/2026 · F5.8 · El afinador sigue la nota, y la pantalla no se apaga

Tus comentarios del 12/11, primera entrega (#2): «el afinador solamente coge como un pico del sonido», «que mantenga un poco más la escucha» y «por defecto aparezca la parte de micrófono». Y tu «sí» a mantener la pantalla encendida.

### Cambiado
- **A-02** · El afinador **sigue la nota mientras se apaga**. Antes solo aceptaba lecturas muy claras, y una cuerda solo suena así en el instante de pulsarla. Ahora:
  - filtra el sonido antes de analizarlo (fuera lo de menos de 60 Hz y lo de más de 1200 Hz), y analiza trozos el doble de largos (85 ms);
  - para *empezar* a seguir una nota pide lo mismo que antes (dos lecturas claras que coincidan), así un golpe o una voz no mueven la aguja;
  - una vez enganchada, le basta mucha menos claridad mientras la lectura siga cerca de las últimas (20 cents) y suene 4 veces por encima del ruido de fondo, que mide todo el rato;
  - la aguja promedia las 7 últimas lecturas quitando las extremas.
  En el banco, a volumen de micrófono de móvil y con ruido: una cuerda sintética de 6 s se sigue de 3,5 a 3,7 s (antes, 2,6 s); con las 12 grabaciones reales, la primera lectura llega en 165 ms como mucho y, ya asentada la cuerda, ninguna se va más de 3,4 cents. En una medición suelta con las grabaciones enteras de la app (3 s; no está en el banco), cada cuerda se sigue entre 1,5 y 3 veces más tiempo.
- **A-03** · Cuando la nota deja de oírse, **lo último medido se queda 2,5 s a la vista**, atenuado y con el rótulo «Última lectura», para que dé tiempo a mirar y girar la clavija. Luego la aguja vuelve a reposo.
- **A-02** · El afinador **abre en Micrófono** donde se puede usar (en la web con `https`), sin escuchar hasta que pulsas «Activar el micrófono». Donde no se puede (el archivo con doble clic), abre en De oído. Si eliges tú un modo, se recuerda.
- **A-02-CA** · Con el trozo más largo, el detector sigue dentro de su criterio: ±1,84 cents y 195 ms.

### Añadido
- **G-13** (nuevo) · **La pantalla no se apaga** mientras suena el metrónomo o escucha el afinador (Screen Wake Lock). Al parar, el móvil vuelve a bloquearse como siempre. Donde el navegador no lo permite, o el sistema lo niega, todo funciona igual y el metrónomo lo avisa. Si el micrófono se apaga al ocultarse la app, el afinador lo dice al volver.

### Auditorías ligeras (AR-15 y AT-14)
Sin críticos ni altos; una ronda. Corregido, entre otros: una octava clara ya no se pliega a la cuerda anterior (en Drop D, la 4ª releva a la 6ª); un instante de silencio total no deja en cero el ruido de fondo; elegir cuerda con una nota sonando repinta la lectura en vez de perderla; el aviso del metrónomo sale también si el sistema niega la pantalla encendida; «Restablecer» apaga el micrófono y vuelve a «Auto».

### Pruebas
- Banco: 178 de 178. Nuevas: la nota que se apaga, el ruido solo, el giro de clavija, el relevo de cuerda (también a la octava) y las 12 grabaciones reales con ruido (`tests/tono.test.js`); el modo por defecto y su recuerdo, la lectura sostenida y la pantalla encendida (`tests/banco.test.js`).
- Chromium, con una grabación real como micrófono: «La2 · −11 cents · ▲ Sube un poco», en vertical y horizontal.

---

## [0.6.1] — 22/10/2026 · F5.8 · El metrónomo, con péndulo

Tu primer comentario de uso para F5.8 (#1): que la barra del metrónomo se mueva como la de uno de verdad.

### Cambiado
- **MT-06** (nuevo) · La barra del tempo es un **péndulo**. Mientras suena, oscila sobre su pie y llega a un extremo en cada pulso, alternando izquierda y derecha, hasta 30° a cada lado; entre dos pulsos pasa por el centro. Se mueve como un péndulo de verdad: rápido en el centro y lento al llegar a los extremos.
- **La pesa arriba va más lenta**, como en un metrónomo mecánico (tu decisión del 22/10). Antes, arriba era más rápido. Las flechas del teclado no cambian: ↑ sigue subiendo el tempo, como en cualquier deslizador.
- El ángulo sale del **reloj de audio**, el mismo que programa los golpes: el péndulo va con el sonido aunque el navegador vaya a tirones. Las subdivisiones no lo mueven, solo los pulsos.
- Se queda **recto** parado, mientras lo arrastras (para ver dónde dejas la pesa) y con «reducir movimiento» activado en el sistema (G-05).
- **Nunca se sale de la pantalla:** si no cabe, se abre menos. Con el iPhone en horizontal, unos 13°; para dejarle sitio, la columna de la barra es más ancha en esa disposición. Si giras el móvil con el metrónomo sonando en otra área, al volver se abre lo que cabe.
- **Tocar la pesa donde la ves**, aunque esté inclinada, no cambia el tempo: solo arrastrarla.
- **El dibujo de la barra:** ya no tiene el relleno ámbar (con la pesa arriba = lento, ya no indicaba «más»); la varilla es gris y lleva un pie ámbar abajo, sobre el que gira.

### Comprobado
- Banco: 168 de 168. Seis pruebas nuevas (también contra el autónomo), que fallan con la versión anterior.
- Chromium: ±30° en el iPhone en vertical y en el ordenador, ±12,7° en horizontal (también al volver tras girar en otra área), nunca fuera de la pantalla y sin errores; quieto con «reducir movimiento». Disposición: el metrónomo cabe entero en las ocho pantallas; accesibilidad, todo correcto.

### Auditorías ligeras (AR-14 y AT-13)
- Sin críticos; una sola ronda. Corregidos los dos altos: tocar la pesa inclinada cambiaba el tempo hasta 30 ppm, y girar el móvil en otra área dejaba el péndulo demasiado abierto al volver. También: sin saltos al cambiar mucho el tempo en marcha, cambiar de compás no le hace perder pulsos, menos trabajo en cada fotograma y el arrastre no se queda enganchado.
- **Dos decisiones tuyas** (AR-14 #2 y #8): el ángulo en horizontal y la dirección de las flechas del teclado. Anotado en MT-06 lo que se mira en la Sesión 2.

### Documentos
- Requisitos v1.26 (110: MT-06 nuevo; MT-01 y G-10 anotados), matriz v1.24, interfaz v1.14 y roadmap v3.24 (F5.8 en curso, con la tabla de tus comentarios).

---

## [0.6.0] — 22/10/2026 · F6.1 · El archivo autónomo, probado como la app

La app se ve y se comporta igual que en la 0.5.7. Lo que cambia es cómo se construye y se comprueba el archivo autónomo (`dist/trasteando.html`), el que se abre con doble clic.

### Añadido
- **G-08** · El banco de pruebas se pasa **dos veces**: contra la app de varios archivos (`index.html` con `css/` y `js/`) y contra el archivo autónomo (`tests/autonomo.test.js`). En la segunda pasada, cada prueba lleva delante «[autónomo]». Hasta ahora el banco solo comprobaba que el autónomo era una copia exacta; ahora comprueba también que esa copia funciona. Se repiten los dos archivos que arrancan la app (`banco.test.js` y `escalas.test.js`); las pruebas que leen archivos del repositorio o comparan las dos formas, y las del detector de tono, que no usan la página, se pasan una sola vez. Una prueba vigila que ningún archivo de pruebas nuevo que arranque la app se quede fuera de la segunda pasada. En total, 156 pruebas.
- **G-07, G-08** · Una prueba propia del autónomo: la app lee de dentro de la página sus 17 grabaciones, exactamente las generadas (mismas huellas sha256), y no intenta descargar ninguna.
- Cada módulo incrustado en el autónomo termina con su nombre (`//# sourceURL=js/…`), un estándar de las herramientas de desarrollo. Un error dentro del autónomo dice ahora «js/03-audio.js, línea 100», y no una línea perdida de `trasteando.html`. El código va pegado a `<script>`: un salto de línea ahí contaría como primera línea del módulo y el navegador daría cada línea con una de más (AT-12 #2).
- El ensamblador se niega a construir el autónomo si un módulo contiene `</script` o `<!--` (o una hoja de estilo `</style`): como archivo suelto funciona, pero incrustado rompería la página. Lo dice con el archivo y la línea, y no toca el autónomo que ya había. El banco tiene una prueba para ello.

### Corregido (en el banco, no en la app)
- Con una página de un solo archivo, el banco solo ejecutaba su **primer** bloque de código, herencia de antes de la 0.4.0. Con el autónomo actual, que trae 16, la app ni arrancaba en el banco. Ahora ejecuta los 16, uno a uno y con su nombre, como hace el navegador.
- El DOM simulado del banco conserva los bloques de audio incrustado, para que la app los encuentre como en el navegador.

### Comprobado en Chromium
- El autónomo, abierto desde el disco y sin conexión: abre en 0,15 s, sonido listo en 0,19 s, ningún intento de conexión ni error.
- `comprobar-autonomo.js` comprueba además que un error dentro del autónomo dice el módulo y la línea exactos (`js/03-audio.js:100`).

### Auditorías ligeras (AR-13 y AT-12)
- Sin críticos ni altos; una sola ronda. Corregidos: las escalas, también contra el autónomo (AR-13 #1, AT-12 #1); la línea de más en el navegador (AT-12 #2); `<!--` (AT-12 #3); `test.skip` y `.todo` en las dos pasadas (AT-12 #4); la prueba del ensamblador (AT-12 #5); la evidencia de G-08 (AR-13 #5).
- Anotados en G-08: se reconfirma contra la web publicada en F7.1 (AR-13 #2), y en la Sesión 2 se abre el autónomo con doble clic en Windows, en modo avión (AR-13 #3).
