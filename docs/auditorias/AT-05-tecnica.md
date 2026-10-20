# AT-05 — Auditoría técnica · Etapa F3.4

**Fecha:** 20/10/2026 · **Auditor:** auditor técnico (subagente, solo lectura, muy ligera) · **Base:** rama `auto/F3.4-accesibilidad` en `1a41e0f`, app `0.3.1` · `node --test`: 34/34.

**Veredicto:** apta con cambios. No hay nada crítico ni alto.

**Lo que funciona bien:**
- El roving tabindex sobrevive a `buildBoard`.
- `preventDefault` impide que Espacio y las flechas desplacen la página.
- Intro no actúa dos veces en Adivinar.
- El clic de fila en Ajustes no cambia el interruptor dos veces.
- Sin regresiones en Safari iOS 16.4+: `:has`, `:focus-visible` y `?.` están disponibles, y sin `:has` solo se pierde el cursor.

## Hallazgos

| # | Gravedad | Dónde | Hallazgo | Propuesta del auditor |
|---|---|---|---|---|
| 1 | Media | Etiquetas del mástil | En Adivinar, VoiceOver podía leer la nota de todas las casillas menos la del foco (el texto del punto y las etiquetas que quedaban de Libre). | `aria-hidden` en el punto y etiqueta en las 150 casillas. |
| 2 | Baja | Asa de Ajustes | Sin captura del puntero ni filtro por puntero en el final del gesto. | `setPointerCapture`, filtrar `pointerId` y escuchar `lostpointercapture`. |
| 3 | Baja | Asa de Ajustes | Al cerrar deslizando, la hoja volvía a subir antes de bajar: el desplazamiento se quitaba antes de cerrar. | Mantener el desplazamiento hasta que se cierre. |
| 4 | Baja | `.board-scroll` | Al moverse con el teclado, la casilla con foco podía quedar bajo el nombre de la cuerda, que va pegado. | `scroll-padding-left: var(--label-w)`. |
| 5 | Baja | Teclado del mástil | Mantener pulsado Intro o Espacio repetía la nota unas 30 veces por segundo. | Ignorar `ev.repeat`. |
| 6 | Baja | Pruebas | Inicio y Fin solo se probaban con la rama de respaldo, `focus()` no hacía nada en el DOM de prueba, y la prueba de Adivinar solo miraba la casilla con foco. | Simular el rango visible, comprobar `activeElement` y que ninguna casilla exponga la nota. |

## Respuesta del chat de Desarrollo · 20/10/2026

Todo resuelto en la `0.3.1`.

| # | Respuesta |
|---|---|
| 1 | ✅ Resuelto con AR-06 #1. |
| 2 | ✅ `setPointerCapture`, filtro por `pointerId` y `lostpointercapture`. |
| 3 | ✅ Al cerrar deslizando, la hoja sigue desde donde se soltó; `openSheet(false)` quita el desplazamiento al cerrar. |
| 4 | ✅ `scroll-padding-left: var(--label-w)` en `.board-scroll`. |
| 5 | ✅ Intro y Espacio ignoran `ev.repeat`; el banco lo comprueba. |
| 6 | ✅ El DOM de prueba recuerda qué tiene el foco (`activeElement`). La prueba simula una ventana con los trastes 0 a 3 a la vista y comprueba que Fin va al 3. Hay una prueba nueva para las etiquetas de todas las casillas en Adivinar. |
