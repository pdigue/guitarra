# AT-06 · Auditoría técnica (CP-3)

**Fecha:** 20/10/2026 · **Alcance:** diff de código de la 0.3.3 (`index.html`, `tests/banco.test.js`, `comprobar-en-navegador.js`) · **Auditor:** de solo lectura, ronda muy ligera. Banco 39 de 39.

**Sin hallazgos críticos ni altos.** Verificado sin defecto: sin `AudioContext` no hay excepciones; las cargas antiguas se descartan tras rehacer el audio; Adivinar queda coherente al ocultar y volver; no hay fuga de voces.

| # | Severidad | Hallazgo | Resolución |
|---|---|---|---|
| 1 | Medio | «Estado del sonido» se quedaba desfasado | Se actualiza al cambiar el estado (`onstatechange`) y al abrir Ajustes |
| 2 | Medio | El audio se rehacía desde un temporizador, que no es un gesto; en iOS nacería en pausa | Se rehace dentro del siguiente toque (`pointerup`, `touchend` o `click`), que también reanuda el audio; prueba nueva |
| 3 | Bajo | El temporizador de 300 ms no miraba si la página estaba oculta | Lo mira |
| 4 | Bajo | Un `suspend()` aún en curso engañaba a `wakeAudio` al volver | Al volver se llama a `resume()` siempre |
| 5 | Bajo | Tras rehacer el audio, el texto del timbre podía quedarse en «Cargando…» | Se actualiza; si las grabaciones no cargan, lo dice |
| 6 | Bajo | Rehacer varias veces seguidas duplicaba cargas y retenía las grabaciones viejas | Una vez por segundo como máximo, y se liberan las viejas |
| 7 | Bajo | ▶ se leía como «triángulo» en el lector de pantalla; borrar el récord a mitad de racha; volver siempre exige ▶ | Texto oculto «(Empezar)»; lo demás se anota como decisión de diseño |
| — | Pruebas | Margen de tiempo justo en una prueba | Ampliado a 600 ms |
