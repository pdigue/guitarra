# AT-21 · Auditoría técnica ligera · F5.8 #9 (0.6.10)

**Fecha:** 16/11/2026 · **Entrada:** el diff del bloque (banco 229 de 229; comprobar-pistas 48 de 48) · **Lecturas:** 8 de 10.

Sin críticos. Accesibilidad, sin hallazgos: las pistas son botones y su nombre se forma con todo su contenido («Cuerdas 4ª 5ª»); `<small>` no añade rol; `text-size-adjust` no impide ampliar con los dedos.

## Hallazgos
1. **Alto · `renderChallenge`:** `renderClues()` encajaba antes de que apareciera «Ver la respuesta» (J-13), que estrecha las pistas; sin «…», el texto se cortaba sin que se notara. Mover el `hidden` antes y volver a encajar ante cualquier cambio de ancho.
2. **Medio · `encajar()`:** dos pasadas por pintado; bucle de 1 en 1 (hasta 31 vueltas en tableta); `resize` sin agrupar; no ve cambios de ancho que no vengan de la ventana. Propuesta: una pasada, primer cálculo por regla de tres, `ResizeObserver` con `requestAnimationFrame`.
3. **Bajo:** en dos líneas se queda en el mínimo aunque cupiera más grande.
4. **Bajo:** `ord(n).slice(n.length)` da por hecho que el número va delante.
5. **Bajo:** `html[lang="es"]` falla con `es-ES`; mejor `:lang(es)`.
6. **Bajo:** nada comprueba que en horizontal la racha no pise a ▶.
7. **Bajo:** la prueba del CSS dependía de los espacios exactos.
- **Pruebas que faltan:** `encajar()` solo se ejercita en Chromium (el banco no calcula la página); en comprobar-pistas, girar sin recargar, un fallo con «Ver la respuesta», iPad, un caso en dos líneas y la racha frente a ▶.

## Respuesta (16/11/2026)
- **Corregidos:** #1 (el `hidden` va antes, y un `ResizeObserver`, o `resize` donde no exista, vuelve a encajar una vez por fotograma), #2 (una pasada, regla de tres y luego de 1 en 1), #5, #6 y #7.
- **Pruebas añadidas** a comprobar-pistas: iPad en vertical y en horizontal, tras un fallo, girar sin recargar y ▶ de 40 px o más sin la racha encima: 126 de 126. La evidencia de J-06 dice que `encajar()` solo se demuestra en Chromium.
- **#3 y #4:** anotados (con el mínimo en 20 px, #3 no se da hoy).
