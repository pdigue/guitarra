# AT-22 · Auditoría técnica ligera · F5.8 #10 (0.6.12)

**Entrada:** el diff resumido; 10 lecturas (06-zoom.js, 07-adivinar.js, comprobar-disposicion.js, trasteando.css ×2, index.html ×2, 09-navegacion.js, banco.test.js). **Sin críticos;** el arreglo es correcto.

## Alto
- **A1.** El fallo era de WebKit; que Chromium salga limpio no prueba el arreglo en el iPhone. Comprobarlo en el iPhone o pasar la herramienta con WebKit (sin zonas seguras: el CDP solo existe en Chromium), y probar que el detector salta con la 0.6.11.

## Medios
- **M1.** `MOVIL_H_RESTO` (06-zoom.js) repite valores del CSS (raíl 64, panel 204, relleno 6 + 6): si cambia uno, el zoom de inicio bajará de 40 px sin aviso. Fichas en `:root` o, como mínimo, una prueba del banco que compare.
- **M2.** `out.cortados` solo admite desplazamiento lateral en `.board-scroll` y `.mp-sigs`; la `.quickbar` en vertical lo tiene a propósito: falso positivo en cuanto un chip quede a la derecha. Detectarlo por `overflow-x` y `scrollWidth`.
- **M3.** Dentro de una caja desplazable ya no se miran las cajas de fuera ni las zonas seguras; y `out.fuera` mide contra `innerHeight`, no contra las zonas. «Tapados» no cubre lo que se monta encima de un control (`elementFromPoint`).
- **M4.** Faltan pruebas del banco: `body.con-pistas` (se pone y se quita, también al cambiar de área), `defaultVisibleFrets()` con zonas seguras (932 × 430 → 11; 852 × 393 → 9) y que no quede `guess.tryAgain`.

## Bajos
- **B1.** `innerHeight <= 520` repite la media query: mejor `matchMedia` con la misma condición.
- **B2.** Con el raíl desplazable, el contorno de foco de las pestañas se corta a los lados (`outline-offset:-2px`); en una ventana de escritorio muy baja, la barra de desplazamiento estrecha el raíl (anotar en compatibilidad).
- **B3.** El comentario dice 48 px, pero el contenido manda: unos 53 px.
- **B4.** `.ch-hints.has-clue { flex-wrap:wrap }` sobra fuera del media.
- **B5.** VoiceOver lee «✗» como «multiplicación»: `aria-hidden` en el símbolo.
- **B6.** Esconder el aviso para girar con pistas cambia V-01: comprobar que el criterio lo admite.
