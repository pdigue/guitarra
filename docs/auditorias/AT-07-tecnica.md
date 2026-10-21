# AT-07 · Auditoría técnica (CP-4)

**Fecha:** 21/10/2026 · **Alcance:** F4.1 (módulos y ensamblado), F4.2 (detector y su banco) y F4.3 (afinador por micrófono) · **Auditor:** de solo lectura, ronda muy ligera.

**Sin hallazgos críticos ni altos.** Verificado sin defecto: el ensamblado es la app de antes línea a línea; el orden de carga se prueba archivo a archivo; funciona con doble clic y en Pages; el doble clic en «Activar» y salir mientras se pide permiso están cubiertos; el micrófono se apaga en todos los caminos; la sesión de audio se restaura; YIN acierta con fundamental débil y a 32, 44,1 y 48 kHz.

| # | Severidad | Hallazgo | Resolución |
|---|---|---|---|
| 1 | Medio | A 96 kHz, con 2048 valores, el Mi grave salía 267 cents alto | El trozo crece con la tarjeta (4096 a 96 kHz); si no abarca dos periodos, el detector calla. Prueba a 96 kHz |
| 2 | Medio | En «Auto», si se oye la octava de la 6ª, elegía la 4ª | Si la mitad cae en una cuerda y lo detectado no, se toma la mitad. Prueba nueva |
| 3 | Medio | Con 13 archivos, la caché podía mezclar dos versiones | `?v=0.4.0` en cada dirección; prueba que coincide con la versión |
| 4 | Medio/Bajo | Errores no anunciados; foco perdido; «triángulo negro»; «Afinada» parpadeando; botones solo con número | `role="status"`, foco a «Detener»/«Activar», símbolo oculto al lector, margen de ±7 para dejar de estar afinada, `aria-label` en las cuerdas |
| 5 | Bajo | «Afinada» se decidía con el valor sin redondear | Se decide con el número que se ve |
| 6 | Bajo | Si el sistema corta el micrófono, la pantalla seguía «en vivo» | Se apaga y lo dice; «Reactivar sonido» apaga antes el micrófono |
| 7 | Bajo | `paleta.py --app` buscaba la paleta en `index.html` | Lee `js/01-teoria.js` |
| 8 | Bajo | La parábola podía usar un valor no calculado en τ máximo | Limitada a τ < τ máximo |
| 9 | Bajo | Sin límite si el hilo no contesta nunca | A 1 s sin respuesta pasa al hilo principal |
| 10 | Bajo | Título de la latencia; espera justa en una prueba | Título matizado; espera ampliada |
