# AR-04 — Auditoría de requisitos · Propuesta de interfaz (F3.1)

**Fecha:** 20/10/2026 · **Auditor:** auditor de requisitos (subagente, solo lectura, modo ligero) · **Base:** rama `auto/F3.1-interfaz` en `ba83039`, `docs/interfaz.md` v0.1, bocetos y `herramientas/capturar-wireframes.js`, contra `requisitos.md` v1.9, `roadmap.md` v3.7 (F3 a F5) y `matriz-cumplimiento.md` (G-05, V-01, V-04 y C-06).

**Veredicto:** apta con cambios. Hay dos hallazgos altos, y los dos se resuelven en el propio documento sin rehacer el diseño.

**Cobertura:** todos los requisitos con efecto en la interfaz tienen sitio en la propuesta. Hay huecos parciales en N-03, C-03, P-02, A-04, A-07, V-04 y E-04. J-11 no necesita sitio hasta F4.4.

## Hallazgos

| # | Gravedad | Dónde | Hallazgo | Propuesta del auditor |
|---|---|---|---|---|
| 1 | Alta | §7 (B2) · N-03, C-03, P-02 | En Adivinar en horizontal, la nomenclatura y el pentagrama solo se cambian desde ⚙. Eso es un cambio de requisito no declarado. | Meter los dos botones en el raíl o en la franja, o declararlo como excepción y preguntárselo al cliente. |
| 2 | Alta | §3 y §7 · F3.2, V-01, PL-02, PL-04 | Los ≥ 40 px solo están demostrados en el iPhone (750 × 342). Un Android de 360 dp en Chrome se queda en unos 280–300 px de alto, y ahí la cuerda bajaría de 40 px. | Añadir un marco Android a los bocetos y a la comprobación, o acotar el criterio por alto útil. |
| 3 | Media | §9 · G-05 | Los bocetos no cumplían su propia regla de 40 × 40 px (⚙, −, + y ▶ de 36 px; chips de 30; desplegables de 32), y la regla no estaba en el criterio de G-05. | Subir esos controles a 40 px, volver a pasar la herramienta y declarar el cambio en G-05. |
| 4 | Media | §12 · V-04 | No define «pantalla táctil». No dice cuántos trastes se pierden en vertical ni qué pasa con un zoom ya guardado (V-08). | `(pointer: coarse)`; el zoom guardado se ajusta al límite; decir el máximo de trastes en vertical. |
| 5 | Media | §12 · C-07 | «Sin salir de la app» no se puede verificar. No dice qué pasa con la Puerta ni al recargar con `#adivinar` (L-01). Faltan etapa, prioridad y criterio. | Nueva redacción («mientras haya un paso anterior…»), F3.2, prioridad media y prueba manual. |
| 6 | Media | §6, A4 · A-04, A-07 | El modo Micrófono no muestra la afinación activa, y la detección automática de cuerda depende de ella. | Añadir la fila «Afinación» a A4. |
| 7 | Media | §7 · V-02 | Que el Afinador en horizontal «no tiene restricciones de medida» no está demostrado. | Añadir un boceto que entre en la comprobación. |
| 8 | Media | §6 A5, §7 B3 · V-04, E-04 | Escalas · Mostrar no tiene zoom. En horizontal los intervalos de E-04 desaparecen con el pentagrama apagado. La tabla de §7 no coincidía con B1. | Zoom en Escalas; nota del paso e intervalo fuera del pentagrama; corregir la tabla. |
| 9 | Baja | §12 | Quedan desfasadas las notas de C-01, C-02, C-03 y C-04. E-04 escribe «ST» y la propuesta «S». La privacidad es de F6.4, no de F7. | Listarlas en §12, unificar ST y corregir la etapa. |
| 10 | Baja | §7 · V-01 | No dice si el aviso cerrado se guarda ni si «Restablecer» lo recupera, y saldría en una ventana estrecha de Windows. | Guardarlo con los ajustes, recuperarlo con «Restablecer» y mostrarlo solo con `(pointer: coarse)`. |

**Lo que está bien:** la herramienta mide la cuerda sobre el dibujo ya pintado (`getBoundingClientRect`), así que la comprobación no es circular. «Restablecer» ya existe en la 0.2.3. Las alternativas descartadas están justificadas con los requisitos.

## Respuesta del chat de Desarrollo · 20/10/2026

Los diez hallazgos se resuelven en `interfaz.md` v0.2.

| # | Respuesta |
|---|---|
| 1 | ✅ Resuelto junto con el 2. En horizontal, los controles del área van a un **panel a la derecha**, con Do Re Mi y 𝄞 (pentagrama) en todas las áreas con mástil. N-03, C-03 y P-02 se cumplen en todas las disposiciones, así que no hay excepción que declarar. |
| 2 | ✅ Resuelto. El mástil ocupa todo el alto: la cuerda mide (alto útil − 28) / 6. Nuevo boceto B6, de Android de 360 dp en Chrome (780 × 280): **42 px**, medido por la herramienta. En el iPhone sube de 45 a **52 px**. El criterio de F3.2 se acota a «alto útil ≥ 268 px», declarado en §12. Los 280 px se confirman con el simulador de Chrome en F3.2. |
| 3 | ✅ Resuelto. Todos los controles miden 40 × 40 px. La herramienta comprueba ahora también el tamaño de los controles y de las casillas del mástil, y el cambio de G-05 está declarado en §12. |
| 4 | ✅ Resuelto. `pointer: coarse`; el zoom guardado se ajusta; como mucho 8 trastes en el iPhone en vertical y 11 en horizontal. Se le pregunta al cliente en §13. |
| 5 | ✅ Resuelto con la redacción propuesta: F3.2, prioridad media y prueba manual en Windows y en el simulador de Android. |
| 6 | ✅ Resuelto. La afinación activa está en los dos modos del Afinador (A3, A4 y B5). |
| 7 | ✅ Resuelto. Bocetos B4 (De oído) y B5 (Micrófono) a 750 × 342, dentro de la comprobación de desbordes y de tamaños. |
| 8 | ✅ Resuelto. A5 tiene zoom bajo el paso a paso. En horizontal, la nota del paso y su intervalo se ven en el panel sin depender del pentagrama. La tabla de §7 se ha rehecho por área. |
| 9 | ✅ Resuelto. Las notas de C-01 a C-04 están en §12 como ajustes de redacción, los intervalos se escriben «ST» y la privacidad está en F6.4. |
| 10 | ✅ Resuelto en §7 y en el cambio de V-01. |

No hace falta una segunda ronda: los cambios no tocan requisitos fuera de los ya revisados. Las correcciones las comprueba la herramienta («Todo correcto»).
