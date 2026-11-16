# AR-16 · Auditoría ligera de requisitos · F5.8 #3 y #4 (`0.6.3`, `auto/F5.8-aspecto`)

**Fecha:** 15/11/2026 · **Auditor:** auditor-requisitos (solo lectura) · **Alcance:** lo cambiado en el bloque (requisitos v2.1, matriz, CHANGELOG, roadmap e `interfaz.md`), como mucho 10 lecturas, una ronda.

**Resultado:** sin críticos; 3 altos, 6 medios y 6 bajos.

| # | Severidad | Hallazgo | Respuesta |
|---|---|---|---|
| 1 | Alto | El umbral de 700 × 700 se medía con la pantalla entera: un iPad mini en horizontal con Safari (unos 670 px útiles) o una ventana de 1280 × 720 se quedaban fuera | **Corregido:** área útil de 700 × 600. Se miden también 1133 × 670 y 1280 × 620; en esta última, Acordes cabe entero tras ajustarlo |
| 2 | Alto | J-06 seguía validado por la Sesión 1, aunque cambió justo lo que criticaste | **Corregido:** sin validar y verificado parcialmente hasta tu prueba |
| 3 | Alto | Lo principal del #3, el «aspecto limpio», no tenía requisito | **Corregido:** V-10 lo incluye en su texto y su criterio pide que apruebes el aspecto en tu iPhone; el CHANGELOG lo cita |
| 4 | Medio | Los criterios de J-01 y J-06 no se podían medir | **Corregido:** con cifras (ancho de la franja, 30 y 44 px, 20 y 24 px y 4,5:1) |
| 5 | Medio | V-10 admitía 3:1 en texto grande y G-05 pide 4,5:1 | V-10 remite a los umbrales de G-05. La diferencia entre el criterio de G-05 y la herramienta (3:1 en texto grande desde F3.4) queda anotada para el cierre de F5 |
| 6 | Medio | Al criterio de V-11 le faltaban cifras | **Corregido:** mástil de 420 y 380 px, pentagrama de 230 px, pestañas desde 1100 px y la lista de pantallas |
| 7 | Medio | V-11 contradice el principio «el mástil manda» | Excepción escrita en `interfaz.md` §2; **pendiente de tu aprobación** |
| 8 | Medio | La solución del #4 y la disposición del #3 se programaron como se te propusieron, sin aprobación explícita | **Pendiente de tu aprobación** (ESTADO §2) |
| 9 | Medio | C-08 seguía nombrando los temas | **Corregido:** su texto remite a V-10 |
| 10–15 | Bajo | Nota de V-10 desfasada; una sola lista de pantallas en V-11; evidencia de V-04; F5.8 en la etapa de J-01, J-06 y C-02; versiones cruzadas con el roadmap; C-04 y PL-03 (iPad) | **Corregidos.** C-04 entra en el control de cambios de la v2.1 |
