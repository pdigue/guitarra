# AR-06 — Auditoría de requisitos · Etapa F3.4

**Fecha:** 20/10/2026 · **Auditor:** auditor de requisitos (subagente, solo lectura, muy ligera) · **Base:** rama `auto/F3.4-accesibilidad` en `1a41e0f`, app `0.3.1` · Banco 34/34, `comprobar-accesibilidad.js` «Todo correcto», `paleta.py` sin fallos.

**Veredicto:** apta con cambios. No hay nada bloqueante. La decisión del cliente del 20/10 sobre la paleta se cumple.

**Estado propuesto de G-05:** cumple; verificado parcialmente hasta probar con el dedo en el iPhone la fila de los interruptores y el asa (Sesión 1).

## Hallazgos

| # | Gravedad | Dónde | Hallazgo | Propuesta del auditor |
|---|---|---|---|---|
| 1 | Media | J-12, G-05 | En Adivinar solo la casilla con foco tenía una etiqueta sin la nota. El nombre del punto seguía expuesto a un lector de pantalla (`opacity:0` no lo oculta), y las casillas visitadas en Libre conservaban su etiqueta con la nota. Con VoiceOver se veía la respuesta. | Marcar el punto con `aria-hidden` y etiquetar todas las casillas al cambiar de área y de nomenclatura; prueba en el banco. |
| 2 | Media | L-03 frente a `interfaz.md` §10 | Con «Ver todas las notas», las posiciones del mismo sonido se veían igual que las demás. | Distinguirlas, por ejemplo con un anillo exterior, y anotarlo en §10. |
| 3 | Baja | Criterio de F3.4, `paleta.py` | El «simulador de daltonismo» no tenía umbral escrito. | Fijar umbrales en la matriz y que `paleta.py` falle por debajo. |
| 4 | Baja | Asa de Ajustes | Sin captura del puntero: con ratón, soltar fuera del asa dejaba el arrastre a medias. | `setPointerCapture`. |
| 5 | Baja | `herramientas/__pycache__` | Archivos `.pyc` en el repositorio y sin `.gitignore`. | Quitarlos y añadir `.gitignore`. |

## Respuesta del chat de Desarrollo · 20/10/2026

Todo resuelto en la `0.3.1`.

| # | Respuesta |
|---|---|
| 1 | ✅ El punto lleva `aria-hidden="true"` y las 150 casillas tienen su etiqueta, que se rehace al cambiar de área, de nomenclatura o de afinación. Prueba nueva en el banco: tras visitar casillas en Libre, en Adivinar ninguna etiqueta dice una nota. Coincide con AT-05 #1. |
| 2 | ✅ Con «Ver todas las notas», las posiciones del mismo sonido llevan además un anillo claro por fuera y su tamaño completo. Anotado en `interfaz.md` §10. |
| 3 | ✅ Umbrales en `paleta.py` y en el criterio de G-05: las 7 naturales a 7,5 o más con visión normal y con las tres simulaciones; las 12 a 8 o más con visión normal. Queda por escrito que entre sostenidos y naturales no emparentadas la separación baja con daltonismo y que lo compensa el nombre escrito. Hoy: naturales a 7,8 como mínimo y las 12 a 8,8. |
| 4 | ✅ `setPointerCapture`, filtro por puntero y `lostpointercapture` (con AT-05 #2). |
| 5 | ✅ `.gitignore` con `__pycache__/`; los `.pyc` salen del repositorio. |
