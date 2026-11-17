# AR-25 · Auditoría de requisitos ligera · F5.8 #11 (0.6.16)

**Entrada:** requisitos v2.13 (control de cambios, V-10, A-02 y MT-06; también MT-01 y G-04), matriz v2.13, roadmap v4.11, CHANGELOG 0.6.16 e `index.html`. 10 lecturas, una ronda.

**Veredicto:** sin críticos y tres altos.

## Alto
1. **Control de cambios 2.13 mal generado.** La línea «En la 2.13» y las marcas ✏️ eran las de la 2.12. Hay que poner V-10, A-02 y MT-06 y añadir una prueba al banco.
2. **Barra de estado del iPhone con un tema claro de fábrica** (V-10, G-04). Con `black-translucent`, la hora sale blanca; la nota de G-04 aún habla del fondo oscuro. **Decisión de Pablo:** franja oscura arriba o `default`.
3. **Lo decidido el 17/11 no está en los criterios.**
   - A-02: que «De oído» no se guarda; la evidencia aún decía «su recuerdo».
   - V-10: que quien ya usaba la app conserva su tema.
   - MT-06: la disposición en dos bloques.

## Medio
4. **MT-06:** el criterio da por hecho «↑ sube el tempo», que sigue pendiente (AR-14 #8). La fila 1 del roadmap aún decía «13° o varilla más corta».
5. **MT-06:** la barra se acorta sin un mínimo. Además, las letras más pequeñas en horizontal no se pidieron (**decisión de Pablo**).
6. **G-04:** en Android, la pantalla de arranque es color papel también para quien usa un tema oscuro. La nota de G-04 decía lo contrario.
7. **A-02:** «siempre en Micrófono» para quien negó el permiso o afina siempre de oído (**decisión de Pablo**, lo segundo).
8. **V-10:** qué pasa con quien ya tenía estado guardado, y cómo ver el tema de fábrica en tu prueba.

## Bajo
9. **MT-01 y MT-06:** «igual en vertical y en horizontal» y «hasta 30°» ya no se ajustan a lo hecho.
10. **A-02:** la etapa debería ser «F4.3 · F5.8».
11. **V-10:** «sin parpadeo» no se puede medir.
12. **Roadmap:** falta la fila #11 en la tabla de F5.8.
13. **`cqw`:** anotarlo en compatibilidad (regla 10).

---

## Qué se ha hecho (0.6.16)
- **#1, corregido:** las marcas están ahora en los requisitos de este bloque (G-04, A-02, MT-01, MT-06, V-10), y en ninguno más. Prueba nueva en `tests/documentos.test.js`: la línea «En la …», las filas con ✏️ y la última fila del control de cambios tienen que coincidir.
- **#2, sin decisión pendiente:** tu captura del 17/11 (Partitura, app instalada) enseña la hora y la batería **oscuras** y legibles; iOS adapta el color. Se deja `black-translucent` y se anota en G-04.
- **#3, corregido:** los criterios de A-02, V-10 y MT-06 se han reescrito con frases comprobables, y en la evidencia de A-02 se ha quitado «su recuerdo».
- **#4, corregido:** «↑», provisional hasta AR-14 #8, y la fila 1 del roadmap, cerrada.
- **#5:** un mínimo de 180 px en el criterio de MT-06; medido, de 195 a 342 px. Las letras más pequeñas **sí las pediste** en tu mensaje del 17/11 («se podría incluso reducir un poquito el tamaño… de las letras»).
- **#6, anotado:** en G-04, como limitación aceptada (el manifiesto no puede seguir el tema guardado). `theme-color` sí sigue al tema desde el primer pintado (AT-24 M1).
- **#7:** (a) sin permiso, la pantalla de Micrófono ya explica cómo darlo y el selector «De oído» está a la vista (prueba «sin permiso se explica cómo darlo»); (b) lo decidiste tú el 17/11.
- **#8, anotado:** en V-10 y en ESTADO §2: para ver Partitura, Ajustes › Aspecto o «Restablecer».
- **#9, #10, #11 y #12, corregidos:** el texto de MT-06 (30° en las dos orientaciones), la nota de MT-01, la etapa de A-02, el criterio medible de V-10 y la fila #11 en el roadmap.
- **#13:** hecho en compatibilidad 1.18. La versión citada en la evidencia de PL-04, al cierre de F6 (CP-6).
