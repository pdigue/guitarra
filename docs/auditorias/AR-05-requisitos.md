# AR-05 — Auditoría de requisitos · Etapa F3.2

**Fecha:** 20/10/2026 · **Auditor:** auditor de requisitos (subagente, solo lectura, modo ligero) · **Base:** rama `auto/F3.2-horizontal` en `d955f96`, app `0.3.0`, contra `interfaz.md` v1.0, `requisitos.md` v1.11 y `matriz-cumplimiento.md` v1.9 · `node --test`: 28/28 · `comprobar-disposicion.js`: «Todo correcto».

**Veredicto:** apta con cambios. Hay un hallazgo alto, una regresión en móviles verticales bajos. El resto se cumple y se ha medido.

**Estado propuesto:** V-01, sí (falta el iPhone real). V-04, sí (con otra redacción del criterio). C-07, sí (falta la prueba a mano). G-05, parcial hasta F3.4. PL-04, parcial hasta F7.2.

## Hallazgos

| # | Gravedad | Dónde | Hallazgo | Propuesta del auditor |
|---|---|---|---|---|
| 1 | Alta | Mínimo del mástil en vertical | En Adivinar en vertical, el mínimo de 40 px por cuerda, el reto en dos filas y el aviso necesitan 597 px de alto. En un iPhone SE con Safari (375 × 553) la barra de pestañas queda 44 px fuera de la pantalla, y en un Android de 360 × 560, 37 px. Antes de F3.2 el mástil encogía. | «La barra de navegación nunca se sale.» Ocultar el aviso para girar en pantallas bajas, o anotar una excepción como la de 268 px. Añadir las dos pantallas a la herramienta. |
| 2 | Media | Pentagrama en vertical | En pantallas bajas el pentagrama encogía hasta 1 px con su atajo encendido. | Alto mínimo legible, unos 60 px. |
| 3 | Media | `comprobar-disposicion.js` | No medía desplegables ni interruptores, ni Ajustes abierto: 11 controles de Ajustes por debajo de 40 px. | Abrir Ajustes y medir `button, select, [role=switch]`; subir esos controles a 40 px. |
| 4 | Baja | Panel en horizontal | El orden real es: atajos, reto y zoom; el boceto B2 ponía el reto primero. | Mantener el orden actual, que no cambia entre áreas, y anotarlo en `interfaz.md`. |
| 5 | Baja | Afinador en horizontal | El pentagrama quedaba medio cortado en 342 px de alto. | Ocultar el subtítulo o reducir el pentagrama. |
| 6 | Baja | C-07, al recargar | Tras recargar en Adivinar, el primer «atrás» caía en otro paso de Libre y no se notaba. | Saltar los pasos que dejan la misma área, o anotarlo como limitación. |
| 7 | Baja | `interfaz.md` v1.1 | Decía 10 trastes en horizontal; se miden de 10 a 12 según el ancho. El documento cambia y sigue marcado como aprobado. | «De 10 a 12 según el ancho», y avisar al cliente. |
| 8 | Baja | `interfaz.md` §6 y §9 | El gesto de bajar para cerrar Ajustes no está implementado ni tiene etapa. En pantallas amplias las pestañas iban al final del orden del tabulador. | Asignarlos a F3.4, o quitar el gesto del documento. |

## Respuesta del chat de Desarrollo · 20/10/2026

Todo resuelto en la `0.3.0` antes de fusionar, salvo el gesto de bajar, que pasa a F3.4.

| # | Respuesta |
|---|---|
| 1 | ✅ La navegación nunca se sale. El mínimo de 40 px por cuerda se aplica en vertical **desde 660 px de alto** (iPhone de 6,1" con Safari: 664). Por debajo, el mástil encoge y el pentagrama se queda en 64 px. El aviso para girar se mantiene, porque en esas pantallas es justo cuando más ayuda. iPhone SE en Adivinar: 22,8 px por cuerda con el aviso y la barra dentro de la pantalla. La excepción figura en G-05 (requisitos v1.12) y en `interfaz.md` v1.2. Las dos pantallas están en la herramienta. |
| 2 | ✅ El pentagrama encendido no baja de 60 px (64 en pantallas bajas), y la herramienta lo mide. |
| 3 | ✅ Los selectores, interruptores, desplegables y el botón de Restablecer miden 40 px o más. El interruptor se dibuja más pequeño, pero el botón mide 52 × 40. La herramienta abre Ajustes en vertical y en horizontal y mide `button, select, [role=switch]`. |
| 4 | ✅ Se mantiene el orden y se anota en `interfaz.md` v1.2. |
| 5 | ✅ En horizontal, el Afinador oculta la frase de ayuda y su pentagrama mide 100 px: cabe entero. |
| 6 | ✅ `popstate` salta los pasos que dejan la misma área. Lo prueba el banco. |
| 7 | ✅ «De 10 a 12 según el ancho» en `interfaz.md` v1.2. El cliente recibe el aviso con la entrega. |
| 8 | ✅ El orden del tabulador queda resuelto (AT-04 #4). El gesto de bajar pasa a F3.4 en el roadmap. |
