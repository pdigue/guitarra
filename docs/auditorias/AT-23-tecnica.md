# AT-23 · Auditoría técnica ligera · F6.4 (0.6.14)

**Entrada:** el diff del bloque (4 lecturas por partes); además, sw.js, 09-navegacion.js, 99-arranque.js y AT-22 (formato): 8 lecturas. Banco: 236 de 236. Chromium: disposición, accesibilidad y sin conexión, todo correcto. **Sin críticos.** El aviso para girar está quitado del todo (sin restos en HTML, CSS ni JS; `sanitize` descarta `rotateHintClosed`). La excepción de S-07 sigue estricta: la dirección de la política solo se admite como el `<a id="about-privacy">` del autónomo.

## Crítico
Ninguno.

## Alto
- **A1.** En el iPhone con la app instalada, `target="_blank"` saca `privacidad.html` de la app: la abre en una hoja de Safari, con su propio almacenamiento y sin el Service Worker de la app. Sin red, la política no abre (contra lo de «también sin red» de G-11 y el CHANGELOG), y «← Volver a Trasteando» arranca otra copia de la app sin los ajustes del usuario. Falta confirmarlo en el iPhone. Propuesta: en la web, misma ventana (la página trae su «Volver»); solo el autónomo abre otra pestaña (lo pone `ensamblar.js`). En el banco, `target` solo en el autónomo, y adaptar el recuento de S-07.

## Medios
- **M1.** Atribución CC BY 4.0 incompleta: la 4.0 exige la dirección o el texto de la licencia, y solo aparece la de la 3.0 (venía de CREDITOS.md; ahora se ve en la app). Añadir `creativecommons.org/licenses/by/4.0` en `about.credits` (es y en) y en CREDITOS.md, y exigir en la prueba `licenses/by/4.0` y `licenses/by/3.0`.
- **M2.** La política no dice exactamente lo que hace el código: «Restablecer todos los ajustes» los devuelve a los de fábrica, conserva el idioma y no borra la clave `trasteando.v1`. Redactar: vuelven a los de fábrica (el idioma se conserva); los récords, con «Borrar los récords de racha»; para borrarlo todo, los datos del sitio en el navegador (en el iPhone instalada, eliminándola). Igual en inglés.
- **M3.** Faltan pruebas para demostrar G-11 y G-06: (1) en `comprobar-sin-conexion.js`, abrir sin red `privacidad.html` y `#en` y comprobar el `<h1>`; (2) en la prueba «dice lo que hace la app», leer también `sw.js` (sus dos `fetch`, solo bajo `BASE`), prohibir además `EventSource|navigator.share|new Image(` y, en `privacidad.html`, cualquier `src=`; (3) que `comprobar-accesibilidad.js` mida el contraste de `.about a` y `.about-small` (11,5 px con `--muted`) en Madera, Automático claro y Partitura.

## Bajos
- **B1.** Futuro: `privacidad.html` se sirve de la copia y sin `?v=`. Hoy está bien (la copia se rehace con cada versión y `install` usa `cache:'reload'`), pero si la política cambia sin subir APP_VERSION (el contacto, en F7), la app instalada enseñaría la anterior. Con la red primero para esa página se evita.
- **B2.** `privacidad.html` no declara icono: el navegador pide `/favicon.ico` en la raíz de pdigue.github.io y recibe un 404 (como en la Sesión 1, A16). Permitir un `<link rel="icon" href="data:…">` en la prueba.
- **B3.** Código muerto en `comprobar-disposicion.js`: la 6.ª columna de `PANTALLAS` ya es siempre `false` y `out.aviso` repite 81 veces la misma comprobación. Menores: `.board-area{order:6}` deja un hueco en el 5; sobra una línea en blanco en index.html.
- **B4.** En la pasada de varios archivos, la comprobación de S-07 compara 0 con 0 y depende de que `id` vaya antes que `href`: mejor una expresión regular `<a\b[^>]*href="PRIVACIDAD_WEB"`.
- **B5.** Los créditos viven en tres sitios: CREDITOS.md, `TEXTOS` y el texto de reserva de index.html, más corto, que no cumple CC BY si no corre el JS. Texto de reserva completo, y una prueba que compare `about.credits` con el texto de atribución de CREDITOS.md.
