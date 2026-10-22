# AR-14 · Auditoría de requisitos (F5.8 #1, ligera)

**Fecha:** 22/10/2026 · **Alcance:** solo lo que cambia la entrega F5.8 #1 (app `0.6.1`). Revisé MT-06 en requisitos v1.26 y matriz v1.24, la sección 7b de interfaz v1.14, la fila de F5.8 del roadmap v3.24, IT-03, CHANGELOG, ESTADO, y en el código `js/14-metronomo.js`, `css/trasteando.css` e `index.html`. Lo hice sobre el diff de la entrega, en 11 lecturas.

**Cuadra:**
- **Recuentos.** Requisitos: 110 = 95 + 6 + 9. Matriz: 110 = 95 + 6 + 5 + 4. Verificados parcialmente pasan de 19 a 20. F5 queda en 21/21 y siguen 53 validados.
- **Versiones.** Las referencias cruzadas coinciden en los cinco documentos (`0.6.1`, req. 1.26, matriz 1.24, roadmap 3.24, interfaz 1.14), también en CHANGELOG y ESTADO.
- **Dirección de la pesa.** Cambiarla no contradice nada aprobado: la decidió Pablo y queda en interfaz 1.14 y en el control de cambios.
- **Requisito nuevo.** Se respeta la regla de AR-12 #6: MT-06 es nuevo y su origen está anotado.
- **Método.** «Verificado parcialmente» con método D sigue la regla de «una sola vara» de CP-5.

**Hallazgos:**

1. **Alto · MT-06 (y MT-05).** El criterio «sin salirse de la pantalla en ninguna disposición» falla en un caso habitual.
   - **Qué pasa.** `amplitudPendulo()` solo se calcula al arrancar y al cambiar el tamaño de la ventana. Si eso ocurre en otra área, `#metro` está oculto (`js/09-navegacion.js:26`). Su ancho mide 0 y la función devuelve 30°.
   - **Cómo se reproduce.** Pablo arranca el metrónomo en vertical, va a Escalas o Acordes (que piden girar el móvil, y MT-05 invita a tocar allí), gira el iPhone y vuelve al Metrónomo. El péndulo oscila a ±30° donde solo caben unos 13°. Barre por encima del tempo y de «− +», y un toque sobre la varilla girada se convierte en un cambio de tempo.
   - **Otros casos.** Pasa lo mismo si el audio tarda en despertar (AT-11 #1) y Pablo cambia de área antes de que suene el primer golpe.
   - **Propuesta.** Recalcular la amplitud al entrar en el área del Metrónomo, y no guardar ningún valor medido con la caja oculta. Añadir una prueba: arrancar en vertical, cambiar de área, simular el giro, volver y comprobar que la amplitud cabe.

2. **Medio · MT-06.** El criterio no tiene mínimo y no es fiel a «un rango acorde a un metrónomo».
   - **Qué pasa.** «Hasta 30°» lo cumple también un péndulo de 1°. En horizontal, que es como Pablo usa el iPhone para tocar, se queda en 12,7°, menos de la mitad que en uno mecánico.
   - **Quién lo decidió.** Fue una decisión del agente. Se dio prioridad a una varilla larga, que da más precisión al arrastrar, frente a más vaivén. A Pablo se le explicó, pero no consta que lo aprobara.
   - **Propuesta.**
     - Fijar un mínimo medible, por ejemplo «30° si cabe y nunca menos de 20°».
     - Si no, ofrecer a Pablo la alternativa: en horizontal, una varilla más corta (unos 160 px dan unos 30°).
     - Si Pablo prefiere los 13°, anotarlo en MT-06 como limitación aceptada por él, con fecha.

3. **Medio · MT-06.** Tocar la pesa mientras oscila cambia el tempo.
   - **Qué pasa.** `sliderValor()` usa la altura del toque sobre la caja sin girar. Al endurecerse la varilla en `pointerdown`, la pesa salta a la altura donde se tocó, que es más baja que su posición real.
   - **Cuánto.** A 30° y con la pesa a media varilla, unas 15 ppm. Con la pesa arriba, a tempos lentos, unas 28 ppm. A tempo lento el péndulo pasa la mayor parte del tiempo cerca de los extremos, así que es lo normal.
   - **Propuesta.** Que el tempo solo cambie al mover el dedo, por diferencia desde donde se tocó, o proyectar el toque sobre la varilla girada. Añadir al criterio: «tocar la pesa mientras oscila no cambia el tempo; solo arrastrarla».

4. **Medio · MT-06.** La sincronía con el sonido no tiene tolerancia, y no está definido qué comprueba Pablo (método D).
   - **Qué pasa.** «Llega a un extremo en cada pulso» no dice con qué margen. Sigue abierto AT-11 #5: el dibujo no descuenta la latencia de salida del audio. Con un péndulo, ese desfase se nota mucho más que con un punto, sobre todo con auriculares Bluetooth.
   - **Propuesta.**
     - Para el banco: extremo a ±1 ms del instante programado.
     - Anotar en MT-06 que le afecta AT-11 #5.
     - Al protocolo de la Sesión 2, que está pendiente: a 60 ppm, en vertical, en horizontal y en el PC, Pablo confirma que la varilla llega al lado a la vez que el clic y que el vaivén «parece un metrónomo».

5. **Medio · F5.8 (roadmap) y regla «que apruebas antes de programar».** La «lista cerrada» no existe como documento.
   - **Qué pasa.**
     - El texto literal del comentario («un rango acorde a un metrónomo») no aparece en ningún documento.
     - Tampoco consta qué aprobó Pablo antes de programar (dirección y cuándo hacerlo) y qué solo se le explicó (30°, un extremo por pulso, recta al arrastrar, 13° en horizontal).
     - La fila del roadmap (`docs/roadmap.md:213`) y ESTADO dicen «comentario a comentario» y «esperan más comentarios», sin final: el alcance queda abierto.
   - **Propuesta.**
     - Una tabla «Comentarios de F5.8», en la fila del roadmap o en un documento V-xx, con estas columnas: #, texto literal, interpretación, qué aprobó Pablo y cuándo, requisito, versión y estado.
     - Una condición de cierre: la lista se cierra cuando Pablo lo diga, o al empezar F5.9.

6. **Medio · G-10 (y F5.9).** Choca la versión con su fase.
   - **Qué pasa.** G-10 vincula cada versión con su fase (`0.‹fase›.‹corrección›`), pero el trabajo de F5 sale como `0.6.1`. La etiqueta de cierre `v0.5.x` de F5.9 acabará en un commit cuya app es `0.6.n`.
   - **Propuesta.** Escribir la regla en la nota de G-10 y en la fila de F5.9. Por ejemplo: «una fase reabierta numera con la fase más alta que ya esté en `main`; su etiqueta de cierre se pone en el commit que la cierra, aunque la app sea 0.6.n».

7. **Bajo · MT-01.** El cambio de dirección no se ve desde MT-01.
   - **Qué pasa.** La barra de MT-01 invierte su sentido, que antes estaba aprobado en la sección 7b. Aun así, el control de cambios dice «0 modificados» y la nota de MT-01 no remite a MT-06.
   - **Propuesta.** Añadir a la nota de MT-01 «desde la 0.6.1, pesa arriba = más lento (ver MT-06)».

8. **Bajo · MT-06 (teclado).** La flecha ↑ hace bajar la pesa.
   - **Qué pasa.** ↑ sube el tempo, como cualquier deslizador, pero en pantalla la pesa baja. Es correcto según la norma de los deslizadores, pero confuso para quien usa el teclado en el PC. Lo decidió el agente, no Pablo.
   - **Propuesta.** Preguntárselo a Pablo en una línea, y poner la dirección de las flechas en el criterio para que se pueda medir.

9. **Bajo · IT-03.** La cabecera está desfasada.
   - **Qué pasa.** `docs/iteraciones/IT-03-F5.md:3` sigue diciendo «F5.8 saneamiento, aparcada hasta tus comentarios», y «Ramas» no incluye `auto/F5.8-saneamiento`.
   - **Propuesta.** Actualizar las dos cosas: F5.8 en curso, #1 hecho, y añadir la rama.

10. **Bajo · interfaz.md.** La cabecera no recoge el retoque de la sección 7b.
    - **Qué pasa.** Sigue diciendo «7b aprobada el 21/10», pero la 1.14 la retoca. Además, el CHANGELOG no cuenta que la barra ya no tiene el relleno ámbar y que se añade el pie.
    - **Propuesta.** En la cabecera, «7b retocada el 22/10 con tu decisión de la pesa; los detalles del péndulo, a falta de tu visto bueno en la web de pruebas». Una línea en CHANGELOG sobre el relleno y el pie.

11. **Bajo · proceso.** La web de pruebas sigue en la `0.6.0`, según ESTADO.
    - **Qué pasa.** Pablo solo puede juzgar su propio comentario con la `0.6.1` publicada en `pruebas`.
    - **Propuesta.** Actualizar la web de pruebas antes de pedirle la fusión y dejarlo reflejado en ESTADO. Ya puestos, añadir la prueba que falta para «pesa abajo = 250 ppm»: hoy el banco solo comprueba la de arriba.

Nada crítico. Hay que corregir el hallazgo alto (n.º 1) antes de pedir la fusión. Los medios pueden ir a la matriz, aunque el 2 y el 5 conviene preguntárselos a Pablo en el mismo mensaje del PR.

---

## Respuesta (ronda 1, 22/10/2026)

Sin críticos. El alto, corregido; no hace falta ronda 2. Banco: 168 de 168.

| # | Nivel | Qué se hizo |
|---|---|---|
| 1 | Alto | **Corregido** (también AT-13 #2): la amplitud solo se mide con el área a la vista. Prueba nueva en el banco y recorrido en Chromium (vertical, otra área, girar, volver): 30° y luego 12,7°, sin salirse. |
| 2 | Medio | **Pregunta a Pablo** en el mensaje del PR: aceptar unos 13° en horizontal o acortar allí la varilla para acercarse a 30°. Anotado en MT-06 mientras tanto. |
| 3 | Medio | **Corregido** (AT-13 #1): el toque se proyecta sobre la varilla inclinada; el criterio de MT-06 lo dice. |
| 4 | Medio | **Corregido en parte:** el criterio de MT-06 pide el extremo en el instante del pulso (el banco lo mide a ±0,2°, unos 2 ms a 60 ppm); anotado que le afecta AT-11 #5, y en la Sesión 2, a 60 ppm en vertical, en horizontal y en el PC, si la varilla llega al lado con el clic y si el vaivén parece un metrónomo. |
| 5 | Medio | **Corregido:** tabla «Comentarios de F5.8» en el roadmap, con el texto literal, lo aprobado y lo solo explicado; se cierra cuando Pablo lo diga o al empezar F5.9. |
| 6 | Medio | **Anotado** en G-10: una fase reabierta numera con la fase más alta ya en `main`, y su etiqueta de cierre va en el commit que la cierra. |
| 7 | Bajo | **Corregido:** la nota de MT-01 remite a MT-06. |
| 8 | Bajo | **Pregunta a Pablo** en el mensaje del PR; el criterio dice ya la dirección de las flechas. |
| 9 | Bajo | **Corregido:** cabecera de IT-03. |
| 10 | Bajo | **Corregido:** cabecera de `interfaz.md` y línea del CHANGELOG sobre el relleno y el pie. |
| 11 | Bajo | **Corregido:** la web de pruebas se actualiza al abrir el PR; el banco prueba también la pesa abajo con el dedo (250 ppm). |
