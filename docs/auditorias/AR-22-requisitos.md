# AR-22 · Auditoría de requisitos ligera · F5.8 #9 (0.6.10)

**Fecha:** 16/11/2026 · **Entrada:** diff de requisitos, generador de la matriz, interfaz, compatibilidad, roadmap y CHANGELOG · **Lecturas:** 8 de 10.

Sin críticos.

## Hallazgos
1. **Alto · J-06 frente a J-01 y tu #4:** con un mínimo de 13 px (la menor medida, 15), lo que buscas podía verse más pequeño que la nota que tocas (20 px), justo lo que pediste evitar en el #4. Y el ordinal, sin mínimo, podía quedar en unos 8 px. Propuesta: nunca menor que la nota tocada; si no cabe, dos líneas; ordinal de 11 px o más. **Decide Pablo:** ¿dos líneas grandes o una pequeña?
2. **Medio:** el criterio no nombra los tamaños de pantalla ni las notas medidas, ni la regla de las dos líneas.
3. **Medio:** en horizontal no se mide que el pentagrama, la racha y ▶ (40 px, G-05) sigan a la vista.
4. **Medio:** `text-size-adjust` afecta a todas las áreas, y PL-04 seguía citando compatibilidad v1.14.
5. **Medio:** el alcance de J-06 crece (de «se activan sin abrir el menú» a «se leen enteras»), y la parte validada en la Sesión 1 queda atada a la nueva. Propuesta: un requisito propio. **Decide Pablo.**
6. **Medio:** falta el comentario 9 en la tabla de comentarios de F5.8 del roadmap.
7. **Bajo:** J-07, la racha cambia de sitio en horizontal; no consta.
8. **Bajo:** las notas de J-06 seguían pidiendo probar la 0.6.3.
9. **Bajo:** J-05, cambia el formato de las cuerdas; basta una nota.

## Respuesta (16/11/2026)
- **Corregidos:** #1 (mínimo 20 px, el de la nota tocada; dos líneas si no cabe; ordinal de 11 px o más), #2 (el criterio nombra 393×852, 375×667 y 820×1180, Mi3, Do#4 y Mi4, el fallo, el giro y las dos líneas), #3 en parte (▶ de 40 px sin la racha encima, medido; el pentagrama ya quedaba en parte tapado antes), #4 (PL-04 cita la v1.15, en el control de cambios de la matriz), #6, #7 (CHANGELOG) y #8 (lo que hay que probar, en las notas de J-06).
- **Para Pablo:** la pregunta de #1 (en horizontal, con 5 o 6 cuerdas, hoy van dos líneas a 20 px y el pentagrama baja unos 20 px) y #5.
- **#9:** anotado aquí; J-05 no cambia.
