# AT-04 — Auditoría técnica · Etapa F3.2

**Fecha:** 20/10/2026 · **Auditor:** auditor técnico (subagente, solo lectura, modo ligero) · **Base:** rama `auto/F3.2-horizontal` en `d955f96`, app `0.3.0` · `node --test`: 28/28 · `comprobar-disposicion.js`: 10/10, más pruebas propias con Playwright frente a `main`.

**Veredicto:** apta con cambios. Hay un defecto alto, una regresión frente a `main` en el móvil más pequeño, que se corrige antes de fusionar.

**Sin defecto:** `pushState` y `replaceState` funcionan sobre `file://`. «Restablecer» cierra Ajustes con `back()` y se queda en el área. `[hidden]` gana a `display: contents` y `display: flex`. El panel es un `div` genérico, así que `display: contents` no le quita semántica. `--nut-w` y `NUT_W` coinciden.

## Hallazgos

| # | Gravedad | Dónde | Hallazgo | Propuesta del auditor |
|---|---|---|---|---|
| 1 | Alta | Mínimo del mástil en vertical | iPhone SE con Safari (375 × 553) y 360 × 560, en Adivinar con el aviso: la barra de pestañas acaba en y = 597, fuera de la pantalla y sin forma de alcanzarla. El pentagrama encoge a 1 px. Es el mismo caso que AR-05 #1. | No mostrar el aviso cuando no cabe, o sacarlo del flujo; añadir las dos pantallas a la herramienta. |
| 2 | Media | `openSheet`, `goTo` | Ajustes parece modal, pero el resto de la página no es inerte: con el tabulador se llega a las pestañas y se cambia de área por detrás, y queda un paso huérfano en el historial. | Hacer inerte el resto de la página con el panel abierto; `role="dialog"` y `aria-modal`. |
| 3 | Baja | `openSheet` | Si se abre Ajustes desde el raíl, se gira el móvil y se cierra, el foco va a un botón oculto y se pierde. | Devolver el foco al primer botón de Ajustes visible. |
| 4 | Baja | `<nav>` | El orden del foco no sigue al visual: en pantallas amplias las pestañas se ven arriba pero eran lo último del DOM. | Mover la navegación detrás de la cabecera; en vertical, `order` la mantiene abajo. |
| 5 | Baja | `hideSettings` | Dos cierres seguidos antes de que llegue `popstate` retroceden dos pasos. | Una bandera mientras hay un `back()` pendiente. |
| 6 | Baja | Prueba del botón «atrás» | El historial simulado no lanzaba `popstate`, así que la prueba no demostraba que no se acumulan pasos. | Un historial simulado con pila que avise con `popstate`; probar el doble cierre y el cambio de área con Ajustes abierto. |

## Respuesta del chat de Desarrollo · 20/10/2026

Todo resuelto en la `0.3.0` antes de fusionar.

| # | Respuesta |
|---|---|
| 1 | ✅ Resuelto como AR-05 #1. La navegación nunca se sale: el mínimo de 40 px por cuerda en vertical se exige desde 660 px de alto, y por debajo el pentagrama se queda en 64 px. La herramienta incluye 375 × 553 y 360 × 560. |
| 2 | ✅ Con Ajustes abierto, todo lo demás queda `inert` (Safari 15.5+, Chrome 102+). Ajustes lleva `role="dialog"`, `aria-modal="true"` y `aria-labelledby`. Lo prueba el banco. |
| 3 | ✅ El foco vuelve al botón que abrió Ajustes o, si ya no se ve, al otro. |
| 4 | ✅ La navegación va justo después de la cabecera en el DOM. En vertical se sigue dibujando abajo. |
| 5 | ✅ Bandera `closingSheet`. La prueba toca dos veces seguidas el fondo y comprueba que solo se retrocede un paso. |
| 6 | ✅ El historial simulado tiene pila y lanza `popstate` como el navegador. Tres pruebas: navegación y Ajustes, recarga en otra área, y sin `history`. |
