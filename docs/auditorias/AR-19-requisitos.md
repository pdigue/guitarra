# AR-19 · Auditoría de requisitos ligera · F5.8 #7 Metrónomo (0.6.7)

**Fecha:** 15/11/2026 · **Bloque:** F5.8 #7, rama `auto/F5.8-metronomo` (PR #22) · **Entrada:** el diff del bloque (generadores de requisitos v2.4 y matriz v2.4, `js/14-metronomo.js`, `herramientas/medir-metronomo.js`, `tests/banco.test.js`), con búsquedas en requisitos, matriz, roadmap, compatibilidad, CHANGELOG y ESTADO. 8 lecturas de 10.

**Veredicto: nada bloquea.** El cambio responde a lo que notabas (12/11 #7): el pulso irregular eran golpes perdidos (solo 100 ms programados) y el desfase, la latencia de salida sin descontar. Las dos causas están medidas (10 de 63 golpes perdidos antes y 0 de 64 ahora, en Chromium) y corregidas. Cuadran el control de cambios (la 2.4 lista MT-04 en requisitos y matriz), el estado de MT-04 («sin validar» y «verificado parcialmente» hasta tu prueba), las versiones (0.6.7, 4.4, 2.4, compatibilidad 1.12), los pendientes anteriores (AT-11 #2, #5 y #6 y AR-12 #3, resueltos) y PL-04 (la capacidad nueva tiene su alternativa).

## Crítico / Alto
Ninguno.

## Medio
1. **MT-04: «en el acto» no se puede medir y choca con MT-03.** El compás y la figura cambian desde el próximo pulso, y un golpe a punto de sonar no se retira. *Propuesta:* «desde el primer golpe que aún no ha empezado (compás y figura, desde el próximo pulso, como en MT-03)».
2. **MT-04: «descontando la latencia de salida» promete lo que la app no controla.** Solo puede descontar la que el navegador mida o declare. *Propuesta:* decirlo así, como ya hace el criterio.
3. **Matriz, MT-04: faltan compás y figura con el pulso ya apuntado.** Hay prueba con golpes apuntados para tempo, acento y Parar, no para compás ni figura. *Propuesta:* una prueba de `setCompas` y `setSubdivision` con el pulso siguiente ya programado, y citarla en la evidencia.

## Bajo
4. **0,25 s frente a 0,27 s:** requisito, CHANGELOG y roadmap dicen 0,25; criterio y prueba, 0,27. *Propuesta:* «hasta 0,25 s (el banco prueba hasta 0,27)».
5. **MT-06 no está en el control de cambios,** aunque el péndulo también usa lo que se oye. *Propuesta:* listarlo en la 2.4 y añadir la prueba a su evidencia.
6. **La nota de MT-04 ya no cita AT-11 #2 y #5.** *Propuesta:* añadirlos junto a «0,3 s por adelantado».
7. **Solo hay medición real en Chromium; tu iPhone usa WebKit.** *Propuesta:* pasar la herramienta también con el WebKit de Playwright como evidencia intermedia, y decir que el retraso de la luz en Chromium sin altavoz no demuestra la latencia de un móvil.
8. **Tu prueba no tiene criterio de aprobado.** *Propuesta:* un minuto a 120 y a 250 ppm, con el altavoz y con Bluetooth, en el Metrónomo y también en Libre (MT-05): ningún hueco, y la luz con el clic.

## Decisiones tuyas
- Si con auriculares Bluetooth la luz sigue adelantada (porque Safari no declare esa latencia), ¿un ajuste manual de retraso en Ajustes? Alcance nuevo: solo si tu prueba lo pide.
- Un tirón de más de 0,25 s sigue saltándose un golpe, a propósito, para que no suene a destiempo. Si aún notas huecos, se puede subir el adelanto a 0,5 s, a cambio de más golpes que retirar en cada cambio.

## Respuesta (15/11/2026)
- **1, 2, 4 y 6, hechos** en el texto y la nota de MT-04 y en el criterio de la matriz.
- **3, hecho:** prueba nueva con `setCompas` y `setSubdivision` con el pulso ya programado (la misma que cubre AT-18 A1), citada en la evidencia.
- **5, hecho:** MT-06 en la 2.4, con la prueba de la luz (que ahora comprueba también el péndulo en su extremo cuando se oye) en su evidencia.
- **7:** anotado en las notas de MT-04 (medir con WebKit); la evidencia ya dice que la latencia de Chromium sin altavoz no es la de un móvil.
- **8, hecho:** el criterio de aprobado, en el pendiente 10 de ESTADO.
- **Decisiones:** en ESTADO, para después de tu prueba.
