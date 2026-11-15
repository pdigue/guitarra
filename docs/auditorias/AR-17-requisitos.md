# AR-17 · Auditoría de requisitos ligera · F5.8 #5 (Escalas)

**Fecha:** 15/11/2026 · **App:** 0.6.4 · **Requisitos:** v2.2 · **Matriz:** v2.2 · **Roadmap:** v4.2
**Entrada:** el diff del bloque (generar-requisitos.py, generar-matriz.py, tests/banco.test.js); grep en requisitos.md, matriz-cumplimiento.md y roadmap.md (fila del comentario #5).
**Lecturas usadas:** 7 de 10.

## Valoración general
Los requisitos responden al comentario: menos notas a la vista (E-03, E-07), «ir tocando» (E-05) e «ir escuchando» (E-08), y se respeta la decisión del 12/11 (las 4 escalas). Los documentos generados cuadran con el generador (v2.2, 2 nuevos y 6 modificados). Hay dos cosas de más: se quita la Práctica **del todo** y se declara que las escalas funcionan en otras afinaciones. Además, el propio roadmap apunta el sistema de posiciones, «Escuchar» y la retirada de la Práctica como propuesta, sin aprobar aún.

## Hallazgos

**AR-17 #1 · Alto · E-05, E-07, E-08: decisiones del cliente sin aprobar.**
Pablo pidió que no hubiera «tanto» de práctica, no que no hubiera ninguna, y no eligió el sistema de posiciones. Hay cinco decisiones de producto tomadas por el agente:
- (a) 3 notas por cuerda en lugar de 5 posiciones tipo CAGED. Para un principiante supone aperturas de 4 o 5 trastes (0,2,4 · 1,3,5), y las posiciones 6 y 7 pasan del traste 12 («trastes 8 a 13»).
- (b) Se quita la Práctica entera.
- (c) Ya no hay forma de ver todas las notas de la escala en el mástil.
- (d) «Escuchar» va a 380 ms fijos, sin control de velocidad ni relación con el metrónomo.
- (e) La numeración va por trastes: la «caja 1» de La pentatónica menor se llama «Posición 3 de 5», y en los libros es la 1.

*Propuesta:* antes de «fusiona el #20», hacerle a Pablo estas cinco preguntas, apuntar las respuestas en el roadmap y ajustar E-05, E-07 y E-08 si alguna cambia. Mientras tanto siguen sin validar, como ya están.

**AR-17 #2 · Medio · E-05: se reutiliza el ID con el significado contrario.**
Hasta la 0.6.3, E-05 era «validar solo la pertenencia»: validado por el banco, citado en AT-09, en las decisiones cerradas, en la sección de riesgos y en la trazabilidad de F5.4. E-05b es su continuación. Con el mismo ID, el histórico (matriz v1.25) y el actual dirían cosas incompatibles.
*Propuesta:* retirar E-05 (estado «Retirado en 0.6.4 por F5.8 #5», conservando el texto antiguo) y crear **E-09 «Tocar la escala»** con el criterio actual. Si el generador no admite el estado «retirado», añadirlo.

**AR-17 #3 · Medio · E-02, E-02b, E-05b y E-07: incoherencia de alcance.**
La nota de E-07 dice que las posiciones «valen en las otras afinaciones». Eso choca con E-02 («solo en afinación estándar», con AR-12 #9 pendiente), con E-02b (afinaciones alternativas y digitaciones, Posterior) y con E-05b («patrones de digitación concretos», Posterior), y el banco solo comprueba en Drop D que no haya trastes negativos.
*Propuesta:* en E-02, anotar que las posiciones se calculan por alturas y que en otras afinaciones solo se comprueba que no haya trastes negativos; E-02b: «otras digitaciones además de las posiciones de E-07 (en octavas, CAGED) y su validación en afinaciones alternativas»; E-05b: retirarlo o reescribirlo. Añadir E-02, E-02b y E-05b a la lista de la 2.2.

**AR-17 #4 · Medio · E-07: una cláusula del criterio sin evidencia.**
«La vista del mástil va a la posición» está en el criterio, pero ninguna aserción la comprueba.
*Propuesta:* comprobarlo en el banco tras ◀ ▶ con un zoom en el que el mástil no cabe, o sacar la cláusula a «Tu prueba».

**AR-17 #5 · Medio · E-08: el criterio no cubre todo el texto.**
El requisito dice que se calla «al salir de Escalas o cambiar de escala»; el criterio y la prueba solo cubren salir.
*Propuesta:* criterio «se calla al salir de Escalas y al cambiar de escala, de posición o de afinación», y una aserción para cambiar de escala.

**AR-17 #6 · Bajo · E-03: recuentos solo válidos en estándar.**
El criterio fija 18 y 12 casillas; en Drop D el reparto cambia.
*Propuesta:* añadir «en afinación estándar» al criterio y citar las 12 casillas de la caja de La pentatónica menor.

**AR-17 #7 · Bajo · E-05: partes del texto sin comprobar.**
Que una casilla de fuera «solo suena» y que el texto sigue al paso no se comprueban.
*Propuesta:* comprobar que la casilla de fuera llama a `playMidi` y que el texto del paso cambia.

**AR-17 #8 · Bajo · Control de cambios de la matriz 2.2 inexacto.**
Dice «criterios de E-03, E-06 y P-03», pero el criterio de P-03 no cambia (solo su evidencia).
*Propuesta:* «criterios de E-03, E-05 y E-06; evidencias de E-04 y P-03».

## Veredicto
No hay nada crítico. Los requisitos son verificables y, en lo esencial, coinciden con el banco. **La fusión depende del #1**: Pablo tiene que aprobar las cinco decisiones. Conviene corregir el #2 y el #3 en este mismo bloque, porque solo tocan el generador. El #4 y el #5 se resuelven con una aserción cada uno, y del #6 al #8 se pueden anotar en la matriz.

## Qué se hizo
- **#1:** preguntadas las cinco decisiones a Pablo el 15/11. Respuestas: 3 notas por cuerda (sí), la 1 en la tónica (cambiado), «Escuchar» fijo (sí), y recuperar «Todas» (E-10, nuevo) y una Práctica sencilla (E-05b, ahora en F5.8). Anotado en el roadmap.
- **#2:** E-05 se **retira** (estado nuevo «retirado» en el generador, con su texto tachado) y «tocar la escala» es **E-09**.
- **#3:** E-02 anota el alcance de las otras afinaciones; E-02b reescrito; E-05b reescrito como la Práctica nueva. Los tres, en la lista de la 2.2.
- **#4 y #5:** aserciones nuevas (la vista va a la posición; «Escuchar» se calla al cambiar de tónica, tipo o afinación, al ocultar la app y al salir) y criterios completos.
- **#6 a #8:** criterio de E-03 «en afinación estándar»; prueba de que la casilla de fuera suena y el texto sigue al paso; control de cambios de la matriz corregido.
