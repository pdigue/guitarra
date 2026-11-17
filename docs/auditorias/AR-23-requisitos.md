# AR-23 · Auditoría de requisitos ligera · F5.8 #10 (0.6.12)

**Entrada:** el resumen del diff y 10 lecturas (requisitos.md §1-2, §5 y §12-20; matriz J-01 a J-14 y V-01 a V-06; roadmap §1-2; CHANGELOG [0.6.12]). No se leyó código. **Sin críticos.**

## Altos
1. **J-14 no se puede verificar tal como está escrito.** «En cualquier pantalla, orientación e idioma», pero la matriz prueba una lista cerrada; «una línea», «≥ 20 px» y «entera» pueden ser incompatibles en pantallas estrechas, sin plan B ni ancho mínimo; «fuera de la pantalla» no dice si cuenta lo que se alcanza desplazando. Propuesta: «las pantallas de referencia de la matriz» (con Android e iPad), el plan B por debajo, y definir el término.
2. **Lo pedido era más amplio que J-14.** Pablo pidió «todos los controles en todas las circunstancias»; J-14 solo cubre Adivinar con pistas. Propuesta: un requisito general (V-12, o ampliar C-04/G-05) cuyo criterio sea comprobar-disposicion con su lista de estados. **Decide Pablo.**

## Medios
3. J-13/J-10: comprobar que «✗ ¡Prueba otra vez!» solo sale en modo Reintentar (si no, sube a alto).
4. V-04/J-01: con 9 trastes en el 15 Pro instalado, Adivinar (retos hasta el 12) obliga a desplazarse más. **Decide Pablo:** aceptar, menos de 40 px solo en Adivinar, o estrechar el panel.
5. V-04 y V-01 cambian de comportamiento: verificación parcial para lo de la 0.6.12; «Restablecer y girar» en el guion de prueba.
6. V-01: esconder el aviso para girar con pistas no lo aprobó Pablo, y quita la sugerencia cuando más ayudaría. **Decide Pablo.**
7. G-05 no está en la trazabilidad (control de cambios, roadmap, matriz) aunque el CHANGELOG lo cita por el raíl desplazable.
8. El criterio de J-14 es una crónica de versiones: mejor casos numerados, y el historial en las notas.
9. Circunstancias sin comprobar: Android simulado con pistas; iPad en Split View; ventana pequeña en el ordenador; letra grande o zoom al 200 %; teclado de Safari; rachas de 3 cifras; «Re♭4»; antes de pulsar ▶; ventana de compás y Ajustes en horizontal bajo. Anotarlas como cubiertas o «fuera, aceptado».

## Bajos
10. J-06: evidencia duplicada (Sesión 1, E04). Volver a «Validado» está bien.
11. J-14 «desde 0.6.10», pero lo de los controles es de la 0.6.12: aclararlo.
12. El comentario de Pablo, recortado en el roadmap y reescrito en el CHANGELOG: tal cual (AR-14 #5).
13. Texto corto del fallo: aceptable (la frase del reto ya dice que ▶ repite); que el lector de pantalla no lea «✗» (aria-hidden).
