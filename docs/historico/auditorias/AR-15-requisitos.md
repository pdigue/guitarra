# AR-15 · Auditoría de requisitos (F5.8 #2, ligera)

**Fecha:** 12/11/2026 · **Alcance:** solo lo que cambia la entrega F5.8 #2 (app `0.6.2`): el afinador que sigue la nota y abre en Micrófono (A-02, A-02-CA, A-03) y la pantalla encendida (G-13, nuevo). Revisé requisitos v1.27 (cabecera, control de cambios y detalle), matriz v1.25, roadmap v3.26 (cabecera y «Estás aquí»), compatibilidad v1.8, IT-03, CHANGELOG, ESTADO y, en el código, `js/11-afinador-micro.js`, `js/03-audio.js`, `js/00-idioma.js` y `tests/tono.test.js`. No leí la tabla de comentarios del roadmap, `interfaz.md`, el CSS ni el final de `tests/banco.test.js`.

**Resultado: sin hallazgos críticos ni altos.** 7 medios y 8 bajos. Una ronda.

**Cuadra:**
- **El comentario #2 de Pablo**, en sus tres partes: seguir la nota, mantener la lectura (2,5 s) y abrir en Micrófono. Filtros, trozo de 4096 y media recortada son el «cómo», y están contados en CHANGELOG e IT-03.
- **Trazabilidad:** la 1.27 está en el control de cambios, en su detalle y en «Cambios en requisitos» de IT-03.
- **Umbrales:** la matriz y `tests/tono.test.js` coinciden (3 s, 6 cents, el ruido solo no da lecturas; 2,5 s en `MIC.SOSTEN_MS`).
- **Cifras:** 111 requisitos (96 + 6 + 9), 53 validados, 21 verificados parcialmente.
- **Una sola vara:** A-02 y A-03 siguen pendientes de la prueba de Pablo; G-13, verificado parcialmente.

**Hallazgos y qué se hizo con cada uno:**

| # | Gravedad | Hallazgo | Resolución |
|---|---|---|---|
| 1 | Medio | La cabecera del roadmap v3.26 seguía con fecha del 22/10 y las versiones de la `0.6.1`. | **Corregido.** |
| 2 | Medio | ESTADO describía el PR #18 solo como el péndulo (`0.6.1`); ya lleva también la `0.6.2`. Pablo aprobaría más de lo que decía la línea. | **Corregido** en ESTADO y en el título y el texto del PR; dicho a Pablo en el mensaje de cierre. |
| 3 | Medio | A-02-CA: la evidencia de la matriz seguía con las cifras del trozo de 2048 (1,86 cents, 168 ms). | **Corregido:** 1,84 cents, 0,62 trozo a trozo y 195 ms, las que imprime hoy el banco. |
| 4 | Medio | A-02 no tenía criterio medible para la prueba de Pablo con la guitarra. | **Corregido:** pasos M0, M2b y M5 en V-09, citados en el criterio de la matriz. |
| 5 | Medio | El criterio de G-13 no fijaba el bloqueo automático ni dónde se prueba. | **Corregido:** bloqueo en 30 s, Safari y app instalada, y anotar la versión de iOS (V-09, M8b). |
| 6 | Medio | Si el sistema niega la pantalla encendida, no había aviso (también AT-14 #4). | **Corregido:** el metrónomo da el mismo aviso; prueba nueva en el banco. |
| 7 | Medio | «Sostenida» era solo una atenuación: se podía girar la clavija creyendo que la lectura iba en directo. | **Corregido:** rótulo «Última lectura» a pleno contraste; solo se atenúan la aguja, la nota grande y la orden. |
| 8 | Bajo | «Si eliges tú un modo, se recuerda» no lo pidió Pablo. | **Pregunta a Pablo** en el mensaje de cierre y en ESTADO §2; «Restablecer» borra la elección (probado). |
| 9 | Bajo | El CHANGELOG atribuía «1,3 a 3 veces» a las grabaciones de la app; la prueba usa una cuerda sintética. | **Corregido:** cifras del banco, y la medición con grabaciones enteras dicha como «suelta, no está en el banco». Añadida una prueba con las 12 grabaciones reales y ruido. |
| 10 | Bajo | El origen de G-13 en la matriz decía «listado 14/09». | **Corregido:** «Cliente · 12/11 (AR-12 #2, F5.8)». |
| 11 | Bajo | El roadmap (CP-5) seguía dando la pantalla encendida por pendiente. | **Corregido.** |
| 12 | Bajo | IT-03: fila 1.27 antes que la 1.26 y «Qué viene» desfasado. | **Corregido.** |
| 13 | Bajo | `metro.noLock` hablaba en primera persona y no decía qué se para. | **Corregido** en español y en inglés. |
| 14 | Bajo | Sin Wake Lock, el afinador se apaga al bloquearse y vuelve a la presentación sin decir por qué. | **Corregido:** «El micrófono se apagó al ocultarse la app…». |
| 15 | Bajo | Compatibilidad daba ✅ al Wake Lock en iPhone sin prueba; PL-04 citaba compatibilidad v1.5; un comentario del código decía 2048. | **Corregido** los tres. |
