# AT-19 · Auditoría técnica ligera · F6.2 Service Worker (0.6.8)

**Fecha:** 16/11/2026 · **Auditor:** técnico (solo lectura) · **Rama:** `auto/F6.2-service-worker`
**Entrada:** diff del bloque contra `main` (`sw.js`, `js/99-arranque.js`, `tests/sw.test.js`, `tests/banco.test.js`, `herramientas/comprobar-sin-conexion.js`, `index.html`, CHANGELOG, roadmap, ESTADO). Banco `node --test` en verde (220 pruebas, 8 de `sw.test.js`); Chromium, `comprobar-sin-conexion.js`: 9 de 9.
**Lecturas usadas:** 6 de 10.

**Nada bloqueante:** no hay críticos ni altos. El criterio de G-03 para F6.2 (localhost, sin red abre y suena) queda demostrado.

**Lo que está bien:** el alcance se calcula a partir de `self.location` (funciona bajo `/guitarra/`); `waitUntil` dentro del evento; `addAll` atómico; `cache: 'reload'` salta la caché de 10 minutos de GitHub Pages; `updateViaCache: 'none'`; la precarga se contrasta en el banco con `index.html` y `SAMPLE_MAPS`; se detecta la capacidad, no el sistema (PL-04); las grabaciones se piden con `fetch()` (`js/03-audio.js:74`), así que hoy no hay peticiones Range.

## Medio

**M1 · `sw.js`, `paginaRedPrimero`: la copia de la página puede quedar de otra versión que sus archivos.** La página que llega de la red se guarda en la caché en marcha sin mirar su versión. (a) Red lenta tras publicar: pasados 3 s se muestra la copia vieja y la red deja luego la página nueva (`?v=0.6.9`) en `trasteando-0.6.8`, cuyos archivos no están; si el SW nuevo no llega a instalarse, la siguiente apertura sin red da la página nueva sin su código y la app no arranca. (b) La navegación no lleva `cache: 'reload'`: la caché HTTP de GitHub Pages puede devolver un `index.html` anterior y pisar la copia buena. Corrección: guardar la página solo si es de esta versión (`?v=` + VERSION). Prueba que falta: «una página de otra versión no sustituye a la copia».

**M2 · `docs/compatibilidad.md:33`: el Service Worker figura como ✅ en el iPhone, sin matices (PL-04).** Safari borra lo guardado por un sitio (también las cachés del SW) si no se usa en 7 días desde una pestaña; y la app añadida a la pantalla de inicio tiene un almacenamiento aparte: hay que abrirla una vez con red desde el icono. Corrección: anotarlo en la tabla y en el criterio de F7.2 (probar desde el icono, con modo avión). Opcional: `navigator.storage?.persist?.()`.

## Bajo

- **B1 · `recursoCachePrimero`: respuestas parciales.** `r.ok` es cierto para un 206, que `cache.put` rechaza sin `.catch` ni `waitUntil`. Hoy no pasa (no hay Range); lo será si algún día se usa `<audio>`. Corrección: dejar a la red las peticiones con `range` y guardar solo `status === 200 && type === 'basic'`, con `waitUntil` y `.catch`.
- **B2 · Pestañas viejas tras `skipWaiting` y `clients.claim`.** Hoy solo piden grabaciones (sin `?v=`): funciona. Si algo con `?v=` se cargase tarde, pediría el `?v=` viejo. Corrección: guardar solo si no lleva `?v=` o lleva el de esta versión.
- **B3 · `paginaRedPrimero`: un 404 o 500 de la red se entrega aunque haya copia** (puede pasar mientras GitHub Pages publica).
- **B4 · El plazo de 3 s no se cancela cuando gana la red:** una lectura de caché de más por navegación (`clearTimeout`).
- **B5 · Primera visita: doble descarga de grabaciones** (hasta 2,1 MB de más, una vez). Aceptable; una línea en `compatibilidad.md` o en la privacidad (F6.4).
- **B6 · Pruebas débiles o que faltan:** en `comprobar-sin-conexion.js` los dos «suena» se anotan sin condición (solo los respalda `samplerReady`); su servidor no imita a GitHub Pages (`max-age=600`, Range), lo cubre F7.2; en `banco.test.js` no se prueba el registro con `readyState === 'complete'`; en `sw.test.js` faltan M1, B2 y B3.

## Resumen
0 críticos · 0 altos · 2 medios (M1, código; M2, documentación iPhone) · 6 bajos. Conviene corregir M1 antes de publicar (F7.2). Lo bajo puede ir a la matriz.
