# AT-16 · Auditoría técnica ligera · F5.8 #5 (Escalas por posiciones)

- **Fecha:** 15/11/2026 · **App:** 0.6.4 · **Rama:** auto/F5.8-escalas
- **Entrada:** el diff del bloque (css, index.html, js/00, 01, 02, 08, 09, 13, 99, tests/banco.test.js y los generadores de documentos), el banco en verde (190/190) y comprobar-disposicion y comprobar-accesibilidad sin fallos.
- **Lecturas usadas:** 10 de 10.

## Resumen
No hay nada crítico ni alto. La lógica de `posicionesEscala()` es correcta en las afinaciones de fábrica: el primer traste de cada posición es único (0–11), nunca sale un traste negativo y en Drop D funciona. El temporizador de «Escuchar» se para bien al cambiar de pantalla, de escala o de tónica, de afinación, con Restablecer y al tocar una casilla de la posición. Si cambias de idioma mientras suena, el siguiente repintado ya sale en el idioma nuevo. Del modo Práctica no queda ningún resto, salvo una función que ya no se usa (#8).

## Hallazgos

**AT-16 #1 · Medio · `js/13-escalas.js` (`conLargoYCorto` sobre `#scale-pos`, que tiene `aria-live`).** `renderScales()` vacía y vuelve a llenar `#scale-pos` en cada repintado, aunque el texto no cambie. Con «Escuchar» repinta cada 380 ms, y el lector de pantalla podría anunciar «Posición 6 de 7 · trastes 8 a 13» unas 23 veces seguidas. *Propuesta:* reescribirlo solo cuando el texto cambie.

**AT-16 #2 · Medio · `js/03-audio.js` (`onVisibility`).** Al ocultar la app se paran el metrónomo y los sonidos y se suspende el audio, pero el temporizador de «Escuchar» sigue corriendo: sus notas podrían acumularse y sonar todas a la vez al volver. *Propuesta:* parar «Escuchar» al ocultar la app.

**AT-16 #3 · Medio · `tests/banco.test.js` (huecos).** E-08 dice «se calla al salir de Escalas **o cambiar de escala**», pero solo se prueba la salida. Faltan: (a) parar al cambiar de tipo o de tónica, de afinación y con Restablecer; (b) un barrido de todas las afinaciones de fábrica, más una personalizada, con las 4 escalas y las 12 tónicas (ninguna posición vacía, trastes entre 0 y `NUM_FRETS`, alturas que suben, saltos de 1, 2 o 3 semitonos, 7 o 5 posiciones); (c) que se borra un `scaleMode` antiguo; (d) `verTrastesPosicion`.

**AT-16 #4 · Bajo · `js/13-escalas.js` (afinaciones personalizadas extremas).** En la personalizada, cada cuerda se ajusta por separado y pueden quedar en cualquier orden o muy separadas. Entonces el bucle puede seguir poniendo notas en una cuerda más allá del traste 24 (el `filter` final deja un hueco en la posición) y `nombreSalto()` llama «un tono» a un salto de 4 o más semitonos. *Propuesta:* pasar de cuerda cuando la nota supera `NUM_FRETS`, y que `nombreSalto` diga algo neutro fuera de 1, 2 y 3.

**AT-16 #5 · Bajo · coste de `renderScales`/`escucharEscala`.** En cada nota de «Escuchar» se calcula `posicionesEscala()` varias veces y se rehacen las 150 casillas, la línea de intervalos y el pentagrama. Hoy es barato. *Propuesta, si crece:* guardar el resultado por «afinación + tipo + tónica» y, mientras suena, repintar solo el paso.

**AT-16 #6 · Bajo · `#scale-play`.** El botón cambia a la vez `aria-label` («Escuchar la posición» y «Parar») y `aria-pressed`: el lector diría «Parar, pulsado». *Propuesta:* una sola señal. Además, cuando ◀ ▶ llega al extremo y se desactiva, el foco del teclado se pierde: llevarlo al botón contrario.

**AT-16 #7 · Bajo · `verTrastesPosicion`.** Al cambiar de afinación estando en Escalas se vuelve a la posición de la tónica, pero la vista no se mueve; tampoco se recoloca al girar la pantalla. *Propuesta:* llamarla también tras el cambio de afinación y en el `resize`.

**AT-16 #8 · Bajo · restos.** `nombreEscala()` ya no se usa (era de la Práctica). Si `playMidi` lanzara un error, `sc.sonando` se quedaría puesto y el botón diría «Parar»: envolver `siguiente()` en `try`/`catch`. `PAUSA_ESCALA` es un `let` en mayúsculas para que las pruebas lo cambien: un comentario que lo diga.

## Veredicto
**Nada bloqueante.** Conviene corregir antes de la prueba de Pablo el #1 y el #2 (son baratos) y las pruebas que faltan de E-08 (#3a). El resto puede ir a la matriz.

## Qué se hizo
- **#1:** `conLargoYCorto` no toca el nodo si el texto no cambia.
- **#2:** `onVisibility` para «Escuchar».
- **#3:** pruebas nuevas: las seis formas de parar «Escuchar», el barrido de 7 afinaciones (con una personalizada) × 4 escalas × 12 tónicas, `scaleMode` olvidado y `verTrastesPosicion`.
- **#4:** se pasa de cuerda si la nota supera el último traste; `textoSalto` dice «n semitonos» fuera de 1, 2 y 3.
- **#6:** `aria-label` fijo con `aria-pressed`; el foco pasa al botón contrario al llegar al extremo.
- **#7:** la vista va a la posición al cambiar de afinación. Al girar la pantalla no se recoloca: anotado.
- **#8:** `nombreEscala()` vuelve a usarse (mensaje de la Práctica); `try`/`catch` en «Escuchar»; comentario en `PAUSA_ESCALA`.
- **#5 (coste):** anotado; hoy es barato.
