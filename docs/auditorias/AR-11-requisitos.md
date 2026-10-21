# AR-11 · Auditoría de requisitos (F5.6 metrónomo y F5.7 acordes)

**Fecha:** 21/10/2026 · **Alcance:** documentos de la 0.5.4 y la 0.5.5 (requisitos v1.22, matriz v1.20, roadmap v3.20, interfaz v1.12, compatibilidad v1.7, IT-03, CHANGELOG) · **Auditor:** de solo lectura, ronda ligera.

**Cuadra:**
- **Recuentos:** 109 requisitos, 93 implementados, 7 parciales y 9 pendientes, con 57 validados. Coinciden en requisitos, matriz `.md` y `.xlsx`.
- **Coherencia entre documentos:** versiones cruzadas, filas de control de cambios y F5.8 y F5.9 iguales en todos.
- **Criterios:** los del metrónomo (acento único, doce compases, figuras) y los de los acordes (populares, 30, buscador, Okabe-Ito) reflejan tu guía.

**Sin hallazgos altos.** Todo se corrige en requisitos v1.23, matriz v1.21, interfaz v1.13 y roadmap v3.21.

| # | Severidad | Hallazgo | Resolución |
|---|---|---|---|
| 1 | Medio | El aviso para girar decía «Libre, Adivinar y Escalas; nunca en el Afinador» en cuatro sitios | Libre, Adivinar, Escalas y Acordes; nunca en el Afinador ni en el Metrónomo |
| 2 | Medio | La interfaz conservaba restos de la propuesta («cuatro áreas», «cuatro hoy») y §8 sin las seis pestañas | Seis áreas, en presente, en §4, §7 y §8 |
| 3 | Medio | MT-05 decía «acentos y subdivisión» | «figura y acento en el primer tiempo» |
| 4 | Medio | El criterio de AC-01 exigía tercera y séptima también a Dsus4 y a las tríadas | La nota que define el tipo, y la séptima si la lleva |
| 5 | Medio | G-02 y C-04 verificados solo con pruebas de cuatro pestañas | Texto con las seis áreas y evidencia de `comprobar-disposicion` (0.5.5) |
| 6 | Bajo | Cabecera «Cambio en v1.19» en el `.xlsx`; nota de la 1.20 sin G-02 ni C-04 | Corregidas |
| 7 | Bajo | Cláusulas sin evidencia en MT-01, MT-05, AC-01, AC-03 y AC-04 | Evidencias completadas; AC-04 pasa a método T |
| 8 | Bajo | AC-06 pedía comparar el buscador «con tu guitarra» | Quitado |
| 9 | Bajo | Roadmap: «las cuatro pestañas» y la Sesión 2 sin F5.6 ni F5.7 | Corregidos |
| 10 | Bajo | «1 nuevos»; recuentos de validados que faltaban en el detalle de la 1.20 y la 1.21 | Singular correcto; recuentos repuestos |
| 11 | Bajo | `:has()` sin su segundo uso en compatibilidad | Añadido |
| 12 | Bajo | IT-03 y CHANGELOG daban cifras distintas de pantallas de la ventana de compás | Tres en los dos |
| 13 | Bajo | Faltaba «Cambios en la 1.17» en la matriz `.md` | Repuesto |
