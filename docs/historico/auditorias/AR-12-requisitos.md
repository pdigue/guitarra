# AR-12 · Auditoría de requisitos (CP-5: toda la fase F5)

**Fecha:** 22/10/2026 · **Alcance:** a fondo, toda F5 de la 0.5.0 a la 0.5.6 (requisitos v1.23, matriz v1.21, roadmap v3.21, interfaz v1.13, compatibilidad v1.7, IT-03, CHANGELOG y ESTADO), con atención a la corrección musical y al pulso del metrónomo, como pide CP-5 · **Auditor:** de solo lectura, en paralelo con AT-11

**Cuadra:**
- **Recuentos:** 109 requisitos, 93 implementados, 7 parciales y 9 pendientes, con 57 validados, contados fila a fila en requisitos y matriz. F5, 20 de 20 implementados, con la misma trazabilidad en requisitos y roadmap.
- **Corrección musical, revisada a mano:** las 30 digitaciones de `js/15-acordes.js` (notas, bajo, dedos y cejillas), la tabla de tónicas y los intervalos.
- **Pulso:** el criterio de MT-04 es numérico (60/tempo ± 1 ms, como mucho 100 ms por adelantado) y se prueba a 30, 120 y 250 ppm y al cambiar tempo, figura y compás sonando.
- **AR-10 y AR-11:** todo resuelto. Las seis pestañas, medidas en es y en-US con `comprobar-disposicion`.

**Sin críticos. Dos altos:** el #1, corregido; el #2 espera tu decisión. Los medios y bajos, anotados en la matriz o corregidos.

| # | Severidad | Hallazgo | Resolución |
|---|---|---|---|
| 1 | Alto | Dos varas: E-01, E-03, E-04, E-06 y P-03 (método D) estaban «Pendiente: falta que lo veas», y MT-01, MT-05, AC-02 y AC-03 (también D) «Verificado» solo con el banco; F5.2 y F5.3 en ✅ con requisitos sin verificar, contra la regla de cierre | **Corregido.** Los nueve, *verificados parcialmente* hasta tu prueba; MT-01, MT-05, AC-02 y AC-03 dejan de contar como validados (57 → 53). F5.2, F5.3, F5.6 y F5.7 pasan a 🔨, como F5.4. La regla de cierre no cambia. Requisitos v1.24, matriz v1.22, roadmap v3.22 |
| 2 | Alto | Al tocar la guitarra nadie toca la pantalla: el iPhone se bloquea y, por MT-04, el metrónomo se para. Nada lo prevé | **Decisión tuya** (capacidad nueva). Propuesta: Screen Wake Lock mientras suena, detectando si existe, y un aviso donde falte; en `compatibilidad.md`; criterio de 5 minutos sin tocar la pantalla. Anotado en MT-04 y en ESTADO |
| 3 | Medio | El criterio de MT-04 mide la aritmética con un reloj falso: no ve los golpes que se saltan si el navegador se bloquea más de 100 ms | Anotado en MT-04: medir en Chromium con audio real, 60 s a 250 ppm cambiando de área; y 2 minutos a 120 ppm en la Sesión 2 |
| 4 | Medio | «Las 48 escalas frente al círculo de quintas» exagera: 16 se comparan nota a nota y el resto con reglas generales. En acordes no hay referencia externa | Anotado en E-02 y AC-01 (tabla de referencia completa y un método citado). El roadmap y la evidencia de la matriz ya no dicen «48»; en la ronda 2, E-02 pasa a *verificado parcialmente* (52 validados) |
| 5 | Medio | La Sesión 2 no dice qué resultado se espera de cada prueba | Anotado en el roadmap §8: protocolo antes de la Sesión 2, como el de la Sesión 1 |
| 6 | Medio | F5.8 con alcance abierto («los que salgan»); la decisión del 22/10 solo estaba en ESTADO | **Corregido** en el roadmap v3.22: F5.8 ⏸ aparcada (estado nuevo en la leyenda) y alcance cerrado, con un ID por comentario que apruebas antes de programar |
| 7 | Medio | J-10 e `interfaz.md` A2 describen solo «ver la respuesta», que ya no es lo de fábrica desde la 0.5.3 | Anotado en J-10, para F5.8 (toca a Adivinar) |
| 8 | Medio | «T», «ST» y «T½» no se traducen al inglés, y «T½» puede leerse como medio tono | Anotado en E-04, para F5.8 (toca a Escalas) |
| 9 | Bajo | Escalas funciona en todas las afinaciones aunque E-02 dice «solo estándar»; AT-09 #10 sin fila | Anotado en E-02 (lo confirmas tú) y AT-09 #10 en E-06 |
| 10 | Bajo | CHANGELOG, roadmap §1, IT-03 §4 y ESTADO §4 desfasados tras las fusiones del 22/10 | **Corregido** en la 0.5.7 |
| 11 | Bajo | El tempo no dice qué figura cuenta (en 6/8, ♩. = 80); los tramos de los nombres italianos no están en el criterio | Anotado en MT-01 |

**Ronda 2** (22/10, ligera, solo lo corregido): resuelto, sin nada bloqueante. Corregido en la misma 0.5.7: la Sesión 2 no incluía F5.2 ni F5.3 aunque sus requisitos la esperaban (ahora sí, o antes en F5.8); la evidencia de E-02 seguía diciendo «las 48 escalas»; y la redacción que daba a entender que los de Escalas ya estaban en *verificado parcialmente*.

**Orden recomendado:** CP-5 ahora sobre la 0.5.6; F5.8 detrás, con su revisión ligera si toca código; y F5.9 después. No cerrar F5 sin F5.8, salvo que decidas moverla a F6.
