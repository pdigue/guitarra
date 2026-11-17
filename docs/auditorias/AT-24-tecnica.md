# AT-24 · Auditoría técnica ligera · F5.8 #11 (0.6.16)

**Alcance:** el diff `be940be..db1f597` (rama `auto/F5.8-decisiones`), una ronda y 9 lecturas parciales: `css/trasteando.css`, `index.html`, `js/00-aspecto.js`, `js/02-estado.js`, `manifest.webmanifest`, `sw.js` y `js/11-afinador-micro.js`. Banco: 237 de 237. `comprobar-disposicion` con `SOLO=metronomo`: correcto en español e inglés.

**Veredicto:** sin críticos. Un alto, pendiente de comprobar en un iPhone de verdad: la barra de estado con el tema claro.

## Alto
**A1 · Barra de estado del iPhone instalado sobre Partitura** (`index.html:9`). Con `black-translucent` y `viewport-fit=cover`, iOS pone la hora y la batería encima del contenido. Si salen en blanco, sobre el papel (`#f5efe3`) no se leerían, y ahora le pasaría a todo el que instale la app. En Chromium no se puede ver. Si no se lee, cambiar a `default`.

## Medio
**M1 · Parpadeo de Automático y Madera al abrir** (`js/00-aspecto.js`, `index.html`). `index.html` trae `data-scheme="light"` y `00-aspecto.js` solo cambia `data-theme`. Así, Automático en oscuro sale un instante claro, `theme-color` queda en papel para Madera y un tema desconocido no se valida. Arreglo: resolver tema, esquema y color de la barra antes de pintar.

**M2 · Quien ya usaba la app sigue en Madera** (`js/02-estado.js`). `save()` guarda el estado entero, y no se distingue «elegí Madera» de «heredé Madera». Hoy: dejarlo escrito. A futuro: guardar solo lo que difiere de los valores de fábrica.

**M3 · El metrónomo en horizontal no se puede desplazar si algo no cabe** (`css/trasteando.css`). Arreglo: `overflow-y:auto` en `#metro`.

## Bajo
- **B1** · Las consultas de contenedor (`cqw`) solo están medidas en Chromium: falta comprobarlas en WebKit (iPhone) y anotarlas en compatibilidad.
- **B2** · `tunerMode` se sigue guardando aunque ya no sirva.
- **B3** · Tamaños táctiles en horizontal: −, + y Empezar están bien. Los puntos son solo indicadores.
- **B4** · `#f5efe3` está repetido en el CSS, `index.html` y el manifiesto: falta una prueba de que cuadran.

## Pruebas que faltan (propuestas)
Que el color de fábrica sea el mismo en todas partes; `00-aspecto.js` con `localStorage` y `matchMedia` falsos; las migraciones de `sanitize()`; la ejecución completa de `comprobar-disposicion`; y en el iPhone, la barra de estado y los 30° en WebKit.

---

## Qué se ha hecho (0.6.16)
- **A1 → bajo, comprobado:** en tu captura del 17/11, con Partitura y la app instalada, la hora y la batería salen **oscuras** y se leen. Anotado en G-04; no se cambia la etiqueta.
- **M1, corregido:** `00-aspecto.js` pone el tema validado, el esquema (con `matchMedia`) y el color de la barra (`--bg`) antes de pintar. Prueba nueva en el banco, con un entorno falso (`vm`): sin nada guardado, Madera, Automático en oscuro y en claro, y un valor desconocido.
- **M2, anotado:** en V-10, el CHANGELOG y ESTADO (para ver Partitura: Ajustes › Aspecto o «Restablecer»). Guardar solo lo que difiere de fábrica, a futuro.
- **M3, corregido:** `#metro` en horizontal con `overflow-y:auto` y `overscroll-behavior:contain`.
- **B1:** fila nueva en compatibilidad 1.18. La prueba en el iPhone está en ESTADO §2.
- **B4, corregido:** prueba nueva en el banco de que el `--bg` de Partitura coincide con `theme-color` y con el manifiesto.
- **B2 y B3:** anotados (sin cambio).
