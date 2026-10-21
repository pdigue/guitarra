# AT-08 · Auditoría técnica (F4.4 y F4.5)

**Fecha:** 21/10/2026 · **Alcance:** código de la 0.4.1 (pistas, récord por afinación) y la 0.4.2 (idioma) · **Auditor:** de solo lectura, ronda muy ligera. Banco 55 de 55.

**Sin hallazgos críticos ni altos.** Verificado sin defecto: la migración de récords (también con valores raros), la racha al cambiar de afinación y de área, los nombres de afinación y que todas las claves de texto existen.

| # | Severidad | Hallazgo | Resolución |
|---|---|---|---|
| 1 | Medio | Una variable llamada `t` tapaba la función de los textos: si el sistema cortaba el micrófono, el aviso no salía | Renombrada (y la de `timbreText`) |
| 2 | Medio | El Afinador de oído numeraba «6ª» también en inglés | `ord()`: «6th» |
| 3 | Medio/Bajo | El texto bajo «Guitarra» en Ajustes no se traducía al estrenar en inglés | Con su clave; también el nombre accesible de ▶ |
| 4 | Bajo | Al cambiar de idioma con el micrófono encendido, la orden se quedaba en el anterior; con él apagado, se borraba el motivo | Se repinta la última lectura; el motivo se traduce |
| 5 | Bajo | Restablecer con el navegador en inglés ponía C D E aunque eligieras español | La nomenclatura por defecto sigue al idioma elegido. Prueba nueva |
| 6 | Bajo | Pistas: «NotaSol#3» sin espacio para el lector; el grupo sin nombre al ocultar «Pistas» | Espacio y `role="group"` con su rótulo |
| 7 | Bajo | Catalán, gallego o euskera en el navegador daban inglés | Dan español; se mira la primera lengua de la lista |
| — | Pruebas | Huecos: ordinal en inglés, textos fijos, restablecer, migración con récord mayor, `aria-pressed` al apagar | Añadidas |
