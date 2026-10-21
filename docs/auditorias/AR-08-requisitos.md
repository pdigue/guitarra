# AR-08 · Auditoría de requisitos (CP-4)

**Fecha:** 21/10/2026 · **Alcance:** documentos de la 0.4.0 (requisitos v1.16, matriz v1.14, roadmap v3.14, compatibilidad v1.5, IT-02, V-09) e `interfaz.md` §6 · **Auditor:** de solo lectura, ronda muy ligera.

**Cuadra:** 95 requisitos, 0 nuevos, 8 modificados y 41 validados; A-02-CA y A-04 verificados por el banco (método T), A-02, A-03 y A-05 pendientes de tu comprobación (método D); etiquetas `v0.1.5`, `v0.2.3` y `v0.3.3` existentes; cifras iguales en todos los documentos.

| # | Severidad | Hallazgo | Resolución |
|---|---|---|---|
| 1 | Alto | La comprobación se pide en la web de pruebas, que aún no tenía la 0.4.0 | La rama `pruebas` se actualiza con el PR, como con cada versión desde el 19/10; V-09 dice cómo comprobar que es la 0.4.0 |
| 2 | Medio | El roadmap y `automatizacion.md` aún llevaban F4.3 a la Sesión 2 y «solo en el ordenador» | Unificado: 10 minutos al terminar F4.3 (web de pruebas o `localhost`); la Sesión 2 solo repite lo pendiente |
| 3 | Medio | Cabecera de requisitos: «fase en curso F3» | F4 |
| 4 | Medio | A-04 verificado con solo dos casos, uno a +100 cents justos | Prueba nueva: las 6 cuerdas a ±90 cents y la 6ª en Drop D |
| 5 | Medio | La evidencia de G-10 no citaba las etiquetas | Citadas en la matriz; CHANGELOG cita `v0.2.3` y `v0.3.3` |
| 6 | Medio | `interfaz.md` no recogía cómo quedó el afinador | `interfaz.md` v1.6: órdenes, sin micrófono, permiso, horizontal… |
| 7 | Bajo | V-09 sin columna de requisitos; tolerancia de M2 incoherente; sin la app instalada | Columna añadida, «espera un segundo» y ±5, paso opcional M8 |
| 8 | Bajo | PL-04 decía dos capacidades y son cuatro; evidencias de PL-04 y G-08 desfasadas; riesgo de F4.1 sin cerrar | Corregidos |
| 9 | Bajo | `CREDITOS.md` no mencionaba los recortes WAV del banco | Añadidos |
| 10 | Bajo | Se regeneraron capturas de V-06, ya cerrada | Restauradas |
| 11 | Bajo | «por mi parte» en el roadmap; A-02-CA y A-04 verificados antes de AT-07 | Texto neutro; AT-07 no los cuestiona (sus hallazgos se corrigen y el banco sigue en verde) |
