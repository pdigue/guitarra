# Registro de cambios — Trasteando

Todas las versiones de la app, de la más reciente a la más antigua.

**Pauta de versiones:** `0.‹fase›.‹corrección›` mientras se desarrolla —la `0.1.x` corresponde a la fase F1 del roadmap, la `0.2.x` a la F2…— y `1.0.0` en el lanzamiento (F7). Cada entrada cita los requisitos de `requisitos.md` que la motivan, para poder seguir el hilo en ambos sentidos. Formato inspirado en *Keep a Changelog*.

| Versión | Fecha | Etapa | Dónde está |
|---|---|---|---|
| **0.1.4** | 15/10/2026 | F1 · auditoría CP-1 | Rama `auto/F1-iteracion-0` · pendiente de subir a GitHub |
| 0.1.3 | 14/10/2026 | F1 · hallazgo de F2.1 | Rama `auto/F1-iteracion-0` · superada |
| 0.1.2 | 14/10/2026 | F1.3 | Rama `auto/F1-iteracion-0` · superada |
| 0.1.1 | 15/09/2026 | F1 · auditoría AT-01 | Superada |
| 0.1.0 | 14/09/2026 | Núcleo | Superada |
| 0.0.2 | — | — | Propuesta de Fable 5, no integrada |
| 0.0.1 | 02/07/2026 | — | GitHub, commit `18ba661` |

---

## [Sin publicar]

Nada todavía.

---

## [0.1.4] — 15/10/2026 · Auditoría técnica CP-1 (AT-02)

### Corregido
- **S-02** · Con la guitarra clásica cargada, elegir Acústica y volver a Clásica antes de que terminase la descarga dejaba sonando la acústica, aunque Ajustes dijera «Clásica». Toda elección invalida ahora las descargas anteriores. El CHANGELOG de la 0.1.1 lo daba por corregido, pero solo en un sentido.
- **J-01** · Salir de Adivinar y volver en menos de un tercio de segundo hacía sonar el reto dos veces.
- **J-07** · Tocar la pestaña Adivinar estando ya en ella ponía la racha a 0.
- En el iPhone, el audio podía quedarse mudo tras una llamada, al bloquear la pantalla o al cambiar de app. Ahora se reanuda en cada pulsación. Se confirma en la Sesión 1.

### Verificado
- Banco: 15 pruebas en verde y 1 pendiente a propósito (la app aún descarga el audio de fuera; se cierra en F2.2). Las tres nuevas fallan con la 0.1.3 y pasan con la 0.1.4.
- La prueba de afinación compara ahora con la frecuencia medida de cada muestra, no con el nombre del archivo.

---

## [0.1.3] — 14/10/2026 · Hallazgo de la etapa F2.1

### Corregido
- **S-01 · S-08** · En el timbre de guitarra clásica, todas las notas desde el Do5 hacia arriba sonaban medio tono altas: desde el traste 8 de la 1ª cuerda, el 13 de la 2ª, el 17 de la 3ª y el 22 de la 4ª. La muestra que el repositorio de origen llama `D5.mp3` suena en realidad en Re♯5, y el sampler la usaba para todo ese registro. Ahora se usa `E5.mp3`, medida y afinada. Afectaba también a la nota que suena en Adivinar.

### Cambiado
- Cada timbre tiene su propia lista de muestras (`SAMPLE_MAPS`), en lugar de compartir una.

### Verificado
- Medición de la afinación de las 16 muestras en uso: todas a menos de 5 cents de su nota (`samples/afinacion.json`).
- Banco automático: 12 pruebas en verde con `node --test`. La nueva comprueba que las muestras asignadas están medidas y afinadas.

---

## [0.1.2] — 14/10/2026 · Etapa F1.3

### Añadido
- **J-10** · Al fallar en Adivinar se iluminan todas las posiciones correctas y se vuelve a oír la nota buscada justo después de la pulsada, para aprender por contraste. Después llega el reto siguiente.
- **D-04 · V-09** · La numeración de trastes tiene tres modos: *Todos*, *Guía* (solo los trastes con marca: 3, 5, 7, 9, 12…) y *No*.
- **G-10** · La versión de la app aparece al final de Ajustes.
- **G-05** · Los selectores de Ajustes anuncian la opción activa a los lectores de pantalla, y el texto del reto se lee en voz alta cuando cambia.

### Corregido
- **J-12** · «Ver todas las notas» ya no se aplica en Adivinar: mostraba la solución.
- Cambiar de afinación mientras se revelaba un fallo podía iluminar la respuesta del reto nuevo.
- Dos cambios de timbre seguidos mostraban el mensaje de la carga descartada.
- El panel de Ajustes, cerrado, recibía el foco del teclado desde el arranque.

### Migración
- Quien tuviera apagado «Números de traste» en la 0.1.1 pasa automáticamente al modo *No*. El récord y el resto de ajustes se conservan.

### Verificado
- Banco de 28 comprobaciones automáticas: arranque, migración de ajustes, numeración, Adivinar (acierto, fallo, revelación, arrastre), cambio de afinación durante una revelación y restablecer. Resultado: 28/28. Durante la prueba apareció y se corrigió un fallo en la migración de ajustes. Desde el 14/10 forma parte del repositorio como `tests/banco.test.js`.

---

## [0.1.1] — 15/09/2026 · Auditoría técnica AT-01

### Corregido
- Al abrir el Afinador, el mástil seguía en pantalla y ambos se repartían el espacio (AUD-01).
- En el móvil, desplazar el mástil contaba como pulsación y rompía la racha de Adivinar (AUD-02).
- Cada nota sonaba con unos 100 ms de retardo, y había dos contextos de audio en lugar de uno (AUD-03).
- Las notas agudas —desde el traste 11 de la primera cuerda— se salían del pentagrama. Ahora se escriben transportadas con 8va, 15ma u 8vb, como en notación musical (AUD-05).
- La clave de sol dependía de las fuentes del sistema y en algunos Android salía como un cuadro vacío. Ahora es un trazado propio.
- Unos ajustes guardados corruptos o de una versión anterior podían dejar la app en un estado imposible. Ahora se validan campo a campo al leerlos.
- Restablecer dejaba sonando el timbre anterior y mantenía un reto que podía no existir en la afinación restablecida.
- Cambiar de nomenclatura pasados unos segundos no actualizaba el nombre de la nota mostrada.
- Girar el móvil pisaba el zoom elegido.
- La etiqueta de zoom prometía más trastes de los que cabían en pantalla.
- Hacer zoom saltaba a otro tramo del mástil.
- El texto blanco sobre los puntos de color claro era casi ilegible.
- Los interruptores de Ajustes no se podían usar con teclado ni con lector de pantalla.
- El panel de Ajustes se cierra con Escape y el foco ya no se escapa detrás.
- El sintetizador de respaldo recalculaba cada nota en cada pulsación.
- Dos cambios de timbre rápidos podían dejar instalado el equivocado.

### Cambiado
- Los retos de Adivinar se limitan por defecto a los 12 primeros trastes.
- Se vuelve a permitir ampliar la página con dos dedos.

---

## [0.1.0] — 14/09/2026 · Núcleo «Trasteando»

### Añadido
- Nueva identidad: *Trasteando*, con icono y pantalla de entrada.
- Modo Adivinar unificado: suena una nota y se busca en el mástil, con pistas de nombre y de cuerda desde la barra superior, racha y récord guardado.
- Afinador por referencia: afinación estándar, cinco alternativas y personalizada por semitonos. La afinación activa se aplica a todo el mástil.
- Menú de Ajustes con persistencia: nomenclatura, pentagrama, timbre clásica o acústica, numeración, ver todas las notas, señalar iguales y afinación.
- Zoom por número de trastes visibles y desplazamiento lateral.

### Corregido
- La numeración de trastes aparecía desplazada una posición respecto a su franja.

---

## [0.0.2] — Propuesta de Fable 5 (no integrada)

- Tres modos de práctica separados. Sus ideas pasaron a la 0.1.0; el archivo nunca llegó al repositorio.

---

## [0.0.1] — 02/07/2026 · Versión inicial

- Mástil libre con sonido real de guitarra clásica, nomenclatura conmutable y pentagrama. Es la versión que está hoy en GitHub (commit `18ba661`).
