# AT-17 · Auditoría técnica ligera · F5.8 #6 Acordes (0.6.5)

**Entrada:** diff del bloque, rama `auto/F5.8-acordes`. Banco 200/200; comprobar-disposicion (nueve pantallas de Acordes) y comprobar-accesibilidad, sin fallos. 9 lecturas de 10.

**Veredicto: no hay nada bloqueante.** Ni críticos ni altos. El cambio es pequeño y está bien acotado: `applyZoom` sale antes en Acordes sin tocar `state.visibleFrets`, y el banco lo demuestra; `setScreen` ya llama a `applyZoom` en cada cambio de área; las 7 notas tienen mayor, así que `elegirRaiz` nunca se queda sin acorde; ninguna digitación pasa del traste 5 (Cm y Gm llegan justo).

## Medio
- **M1 · Con el teclado se llegaba a los trastes ocultos** (`js/05-mastil.js`, `bindBoardKeys`). Con → el foco avanzaba hasta el traste 24 y `scrollIntoView` desplazaba el mástil (`overflow-x:hidden` no impide desplazar por programa); y el foco podía entrar en Acordes por el traste 12 si se dejó ahí en Libre. **Corregido:** en Acordes → no pasa de `TRASTES_ACORDE`, y al entrar con el foco más allá vuelve al traste 0. Con prueba en el banco.
- **M2 · Ninguna prueba protegía «hasta el traste 5».** **Corregido:** el banco comprueba que ninguna de las 30 digitaciones pasa de `TRASTES_ACORDE`.

## Bajo (anotados; sin cambio en este bloque salvo B3 y B4)
- **B1 · Dedos de tamaño fijo** (36/44 px). En ventanas bajas podrían pisarse. Ya los limita `max-height:80%` de la casilla; la comprobación de disposición a 1280 × 620 da 55,7 px por cuerda. Sin cambio.
- **B2 · El lector de pantalla sigue contando las casillas de más allá del traste 5.** Anotado en AC-07.
- **B3 · `elegirRaiz`, frágil si el catálogo crece.** **Corregido:** si una nota no tuviera mayor, toma su primer acorde; si no hay ninguno, no hace nada.
- **B4 · Comentarios desfasados** (`09-navegacion.js`, `comprobar-disposicion.js`, `refreshChords`). **Corregidos.**
- **B5 · Posible código muerto tras quitar `drawChordStaff`.** Comprobado: `STAFF_CORTO`, `staffYEscrita` y `drawStaffBase` se siguen usando en el pentagrama y en Escalas. Sin cambio.
- **B6 · Los tipos apagados (`disabled`) salen del orden del tabulador.** Aceptable por sencillez; anotado en AC-01 para F6.

## Pruebas que faltaban
1. Ninguna digitación pasa de `TRASTES_ACORDE` — **añadida**.
2. Teclado en Acordes: → desde el 5 no avanza; al entrar con el foco en el 12 va al 0 — **añadida**.
3. AC-07 por el camino real (`requestAnimationFrame` y `resize`), 4. el aviso para girar en el banco y 5. los 30 acordes eligiéndolos con clics: cubiertos hoy por comprobar-disposicion y por `acordeDe`; anotados.
