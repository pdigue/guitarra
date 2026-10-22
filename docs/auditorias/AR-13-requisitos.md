# AR-13 · Auditoría de requisitos (F6.1, ligera)

**Fecha:** 22/10/2026 · **Alcance:** solo lo que cambió en la etapa F6.1 (`0.6.0`). Revisé G-08 en requisitos v1.25, matriz v1.23 y roadmap v3.23, además de IT-04, CHANGELOG 0.6.0, ESTADO, `tests/autonomo.test.js`, `tests/banco.test.js` y `herramientas/ensamblar.js`. No volví a pasar el banco: es una auditoría de solo lectura.

**Cuadra:**
- **Una sola vara:** G-08 se demuestra con el banco (método T) y no depende de ninguna prueba de Pablo (método D). Darlo por validado con el banco es coherente con la regla. G-07, que sí validó Pablo, sigue como estaba.
- **Recuentos:**
  - En requisitos: 94 implementados, 6 parciales y 9 pendientes, que suman 109. Hay 53 validados.
  - En la matriz: 94 cumplen, 6 parcialmente, 5 no cumplen y 4 no aplican. Hay 53 verificados y 19 verificados parcialmente. G-08 salió de la lista de parciales en `generar-matriz.py`.
  - Las dos cuentas encajan con un solo cambio de estado, el de G-08.
- **Versiones:** cada documento cita bien a los demás: requisitos 1.25, matriz 1.23, roadmap 3.23 y app 0.6.0. La fase en curso es F6, con F5 abierta, y lo dicen igual requisitos, roadmap, ESTADO e IT-04.
- **Las 150 pruebas:** 71 en la primera pasada de `banco.test.js`, 68 en la segunda (67 repetidas más la prueba propia del autónomo), 5 de `escalas.test.js` y 6 de `tono.test.js`. Coincide con lo que dicen CHANGELOG y ESTADO.
- **Cambios en requisitos:** el cambio de G-08 está en el control de cambios v1.25, con su detalle, y en IT-04 §3. Cumple la regla 4.
- **Alcance:** no crece. `//# sourceURL` y el guardián del ensamblador son herramientas de construcción al servicio de G-08. No hay dependencias nuevas (`crypto` viene con Node) ni cambios para el usuario.
- **Medible:** el criterio se puede medir con el banco. El único matiz es «web publicada» (hallazgo 2).

**Hallazgos:**

1. **Medio · G-08: «el banco entero» no es exacto.**
   - **Problema:** la segunda pasada, contra el autónomo, solo repite `banco.test.js`.
     - `tests/escalas.test.js` (5 pruebas) arranca la app con `APP_HTML` pero no se pasa contra el autónomo, y esa exclusión no se justifica en ningún sitio.
     - `tests/tono.test.js` (6 pruebas) tampoco se pasa. Parece cargar el módulo del detector directamente con `vm`, así que bastaría con una vez.
     - A esto se suman las 4 pruebas marcadas con `unaVez`.
     - Sin embargo, la nota de G-08, la matriz, CHANGELOG, IT-04 y ESTADO dicen «el banco entero se pasa dos veces». El criterio pide «el mismo banco».
   - **Propuesta:** pasar también `escalas.test.js` contra el autónomo. Por ejemplo, con un `require` desde `autonomo.test.js` y el prefijo «[autónomo]», como ya se hace con `banco.test.js`. Después, decir en la evidencia de G-08 qué pruebas van una sola vez y por qué. Si no se hace, hay que cambiar «entero» por «el banco de la app (`banco.test.js`)».

2. **Medio · G-08: el criterio habla de la «web publicada», pero se prueba otra cosa.**
   - **Problema:** la web publicada no existe hasta F7.1. Lo que se prueba es la app de varios archivos, leída del disco por el DOM simulado del banco. Validarlo ahora es defendible, porque la web de pruebas sirve esos mismos archivos estáticos, pero el contrato y la evidencia no dicen lo mismo.
   - **Propuesta:** precisar el criterio en la matriz: «El archivo autónomo generado y la app de varios archivos que sirve la web superan el mismo banco de pruebas». Anotarlo en el control de cambios de la matriz y en IT-04, y avisar a Pablo. Si se prefiere no tocar el texto, añadir al comentario de G-08 «se reconfirma contra la web publicada en F7.1», como ya se hace con G-03 en dos pasos.

3. **Bajo · G-08 y G-07: el «doble clic» se comprobó en Chromium, no en Windows.**
   - **Problema:** la validación de F6.1 en el roadmap pide «funciona con doble clic y sin conexión». Se comprobó en Chromium con `file://`, que es equivalente. El doble clic real en Windows es de la Sesión 1, con la 0.3.x, y desde entonces el autónomo ha crecido con F4, F5 y F6. No rompe la regla de una sola vara (G-08 es T), pero es una regresión posible de G-07.
   - **Propuesta:** incluir en el protocolo de la Sesión 2 un paso que abra el autónomo 0.6.x con doble clic en Windows, en modo avión.

4. **Bajo · ESTADO: el número del PR va en una sección que no le toca, y la web de pruebas se da por actualizada antes de que exista el PR.**
   - **Problema:** ESTADO dice que el número del PR de F6.1 irá «en §5 cuando exista», pero §5 es la sección para abrir la siguiente conversación. Además, ya da la web de pruebas con la 0.6.0 cuando el PR aún no existe, y el propio ESTADO dice que se sube a `pruebas` tras cada PR.
   - **Propuesta:** al crear el PR, poner su número en §1 («PR abiertos») y en §2, confirmar la subida a `pruebas` y dejar idéntica la copia `claude/ESTADO.md`.

5. **Bajo · G-08: la evidencia cita herramientas pero no su resultado.**
   - **Problema:** la evidencia de la matriz nombra `comprobar-autonomo` y `comprobar-en-navegador`, pero no remite al resultado medido (0,3 s y ninguna conexión), que solo aparece en CHANGELOG y en la nota del requisito.
   - **Propuesta:** citar «CHANGELOG 0.6.0 · IT-04» en la evidencia, o dejar un V-10 breve como los anteriores.

Nada bloqueante: G-08 puede quedar validado. Los hallazgos 1 y 2 conviene corregirlos en esta etapa o anotarlos en el comentario de G-08 en la matriz.

---

## Respuesta (ronda 1, 22/10/2026)

Sin críticos ni altos. No hace falta ronda 2.

| # | Nivel | Qué se hizo |
|---|---|---|
| 1 | Medio | **Corregido.** `escalas.test.js` entra en la segunda pasada, con «[autónomo]». `tono.test.js` no, y `autonomo.test.js` explica por qué: carga el detector sin la página. Una prueba nueva (`unaVez`) falla si un archivo de pruebas que arranca la app no se pasa contra el autónomo (AT-12 #1). La evidencia de G-08 dice qué va una sola vez. |
| 2 | Medio | **Anotado** en el comentario de G-08, sin cambiar el criterio: se reconfirma contra la web publicada en F7.1, como G-03. Cambiar el texto del criterio es cambiar el contrato, y eso le toca a Pablo. |
| 3 | Bajo | **Anotado** en G-08 y en la lista de la Sesión 2 del roadmap: abrir el autónomo 0.6.x con doble clic en Windows, en modo avión. |
| 4 | Bajo | **Corregido** al abrir el PR: su número en §1 y §2 de ESTADO, y la web de pruebas actualizada después. |
| 5 | Bajo | **Corregido:** la evidencia de G-08 remite a CHANGELOG 0.6.0, IT-04, AR-13 y AT-12. |
