# AT-15 · Auditoría técnica ligera · F5.8 #3 y #4 (`0.6.3`, `auto/F5.8-aspecto`)

**Fecha:** 15/11/2026 · **Auditor:** auditor-tecnico (solo lectura) · **Alcance:** lo cambiado en el bloque, como mucho 10 lecturas, una ronda (regla 3, 15/11).

**Resultado:** sin críticos; 1 alto, 2 medios y 4 bajos. Bien: no hay bucle entre `syncUI`, `aplicarTema` y el repintado; la especificidad de los temas es correcta; sin `matchMedia` la app sigue funcionando (PL-04).

| # | Severidad | Hallazgo | Respuesta |
|---|---|---|---|
| 1 | Alto | Al cambiar de tema solo se repintaban el pentagrama de Escalas y el de `showOnStaff`; los de Acordes y del Afinador se quedaban con la tinta anterior (notas pastel sobre papel claro) | **Corregido:** `syncUI` repinta Escalas, Acordes (`refreshChords`), el de una nota y el del Afinador (`renderTunerStaff`). Una prueba cambia de tema con una nota escrita, ida y vuelta |
| 2 | Medio | `var(--text)` dentro de atributos del SVG: Safari podría no aceptarlo | **Corregido:** `tintaNota` devuelve `currentColor`, y el CSS pone `.staff-svg { color:var(--text) }` |
| 3 | Medio | El tema se aplicaba tras construir el mástil: un instante de Madera al abrir con otro tema | **Corregido:** un script mínimo en el `<head>` pone `data-theme` antes de pintar |
| 4 | Bajo | `getComputedStyle` en cada `syncUI` | **Corregido:** solo cuando el tema cambia |
| 5 | Bajo | Las reglas «más limpio» van al final del CSS, fuera de todo `@media`, y pueden anular ajustes anteriores | Anotado en V-10: subirlas junto a cada componente cuando se toque |
| 6 | Bajo | `.board` no redefinía `--muted` ni `--faint` | **Corregido** |
| 7 | Bajo | `110` escrito a mano en `defaultVisibleFrets`; el valor nuevo no llega a quien ya tiene un zoom guardado | Constante `BOARD_PAD_X`; lo segundo, anotado en V-04 |
| — | Pruebas | Faltan: cambio de tema en Escalas y Acordes, `theme-color`, la rama `addListener`, la pista larga sin desbordar en el navegador, la plica en Safari | La ida y vuelta de tema está cubierta; el resto queda anotado en V-10 y para tu prueba en el iPhone |
