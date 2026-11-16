# AR-18 · Auditoría de requisitos ligera · F5.8 #6 Acordes (0.6.5)

**Entrada:** diff del bloque, con los generadores de requisitos v2.3 y matriz v2.3, roadmap 4.3, CHANGELOG, código y banco. 3 lecturas de 10.

**Veredicto: no hay nada que bloquee.** El cambio sigue tu elección del 15/11: dos filas para elegir nota y tipo, el mástil de los trastes 0 a 5 a todo el ancho, y fuera el pentagrama y el buscador. Requisito, criterio, prueba y control de cambios cuadran: AC-01 modificado y en parcial; AC-07 nuevo y en parcial; AC-03 y AC-06 retirados sin reutilizar su ID (N/A en la matriz); 117 + 1 = 118; versiones 0.6.5, 4.3 y 2.3.

## Crítico / Alto
Ninguno.

## Medio
1. **Nada comprobaba que las digitaciones caben en los trastes 0 a 5.** **Corregido:** prueba en el banco y evidencia en la matriz.
2. **P-03 y V-01 podían contradecir lo nuevo.** **Corregido:** V-01 (nota y criterio) ya no nombra Acordes; P-03 dice que en Acordes no se ve el pentagrama. Los dos, en el control de cambios 2.3.
3. **En pantallas anchas los trastes quedan muy alargados** (unos 240 px en un ordenador de 1280 px). **Decisión tuya:** míralo en tu prueba; si no te gusta, un tope de ancho por traste (unos 120 px) con el mástil centrado. Anotado en AC-07.

## Bajo
4. **Se pierden los «Populares»** que pediste el 21/10. **Decisión tuya:** confírmalo en tu prueba.
5. **40 o 44 px:** el criterio pide 40 (G-05); el CSS usa 44 en horizontal para dar margen. Aclarado en el comentario del CSS.
6. **«/bajo» no es claro para un principiante.** **Corregido:** el botón dice su nota (/Sol con Do, /Si con Sol); con otra nota, «/bajo» apagado.
7. **De Do a Lam suenan dos rasgueos** (La y Lam), y de Dsus4 a Mi se pasa al mayor sin aviso. Anotado en AC-01; si te molesta en tu prueba, que solo suene al elegir el tipo.
8. **«Mayor» con mayúscula y «menor» con minúscula:** sigue la convención M/m. Sin cambio.
9. **AC-07 cita C12** (tu comentario del 12/11) y no C21: es correcto, no es errata.
10. **Trazabilidad:** la negrita del roadmap pasa a la 4.3 y las filas quedan en orden; las filas 2.3 citan AR-18 y AT-17. **Corregido.**
