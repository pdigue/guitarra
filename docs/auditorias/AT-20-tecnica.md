# AT-20 · Auditoría técnica ligera · F6.3 (0.6.9)

**Fecha:** 16/11/2026 · **Auditor:** técnico (solo lectura)
**Entrada:** el diff del bloque (sin `dist/` ni documentos generados). Banco: 227 de 227; Chromium: comprobar-instalable 12 de 12 y comprobar-sin-conexion 9 de 9 (41 archivos).
**Lecturas usadas:** 5 de 10 (instrucciones, diff, `sw.js`, grep de `theme-color` en `js/`, grep de los enlaces en `dist/trasteando.html`), y una consulta a MDN sobre el campo `id` del manifiesto.

**Nada bloqueante**; corregir el n.º 1 antes de que nadie instale la app desde la web de pruebas.

## Lo que está bien (comprobado)
- **sw.js:** `install` usa `cache: 'reload'` con toda la precarga: el manifiesto y los iconos (sin `?v=`) no se toman de la copia de 10 minutos de GitHub Pages en una versión nueva, y `activate` borra la caché vieja. `esRecurso` está anclado a `BASE`, quita la `?` y exige el nombre exacto del manifiesto (lo demuestra la prueba `.bak`).
- **Tema claro:** `js/09-navegacion.js` ya cambia `meta[name=theme-color]`; el `theme_color` fijo del manifiesto solo afecta a la pantalla de arranque de Android, y está documentado.
- **ensamblar.js:** `leer()` normaliza CRLF; la expresión no puede comerse otra línea; `dist/trasteando.html` no tiene ninguno de los dos enlaces.
- **Icono «maskable»:** lo más alejado del centro está a 55,7 de 90, dentro de la zona segura (72).

## Hallazgos
1. **Alto · `manifest.webmanifest`, `tests/instalar.test.js`: `"id": "./"` apunta a la raíz del dominio.** Un `id` relativo se resuelve con el *origen* de `start_url`: en GitHub Pages saldría `https://pdigue.github.io/`, la identidad de cualquier app del dominio. Y el `id` no se puede cambiar sin que las instalaciones previas cuenten como otra app. La prueba daba por bueno el valor erróneo. Propuesta: `"id": "/guitarra/"` o quitarlo (vale `start_url`), y comprobar la identidad en Chromium.
2. **Bajo · nada comprueba que los PNG estén al día con `iconos/icono.svg`.** Propuesta: una huella (sha256) del SVG que escribe el generador y compara el banco.
3. **Bajo · `RE_INSTALAR` depende del formato exacto de la línea** (sangría, otros atributos). Propuesta: `/^[ \t]*<link rel="(?:manifest|apple-touch-icon)"[^>]*>\n/gm`.
4. **Bajo · la zona segura del «maskable» solo está calculada en un comentario.** A futuro, calcularla en una prueba desde las coordenadas del SVG.
5. **Bajo · iPhone (para F7.2):** comprobar la barra de estado de la app instalada sobre el fondo oscuro y anotarlo en `compatibilidad.md`.

## Respuesta (16/11/2026)
- **#1, corregido:** confirmado en Chromium (`Page.getAppManifest`): con `"id": "./"`, Chrome daba `http://localhost:…/`. Se quita `id`: la identidad pasa a ser `start_url`, `…/guitarra/`, que vale también si un día se publica en la raíz de otro dominio. La prueba exige que no haya `id` y `comprobar-instalable.js` comprueba la identidad que calcula Chrome (13 de 13).
- **#3, corregido** con la expresión propuesta.
- **#2, #4 y #5:** anotados en G-04 (requisitos y matriz v2.6).
