# Registro de cambios — Trasteando

Todas las versiones de la app, de la más reciente a la más antigua.

**Pauta de versiones:** `0.‹fase›.‹corrección›` mientras se desarrolla —la `0.1.x` corresponde a la fase F1 del roadmap, la `0.2.x` a la F2…— y `1.0.0` en el lanzamiento (F7). Cada entrada cita los requisitos de `requisitos.md` que la motivan, para poder seguir el hilo en ambos sentidos. Formato inspirado en *Keep a Changelog*.

| Versión | Fecha | Etapa | Dónde está |
|---|---|---|---|
| **0.3.0** | 20/10/2026 | F3.2 | Rama `auto/F3.2-horizontal` |
| 0.2.3 | 19/10/2026 | F2 · auditoría CP-2 | `main`, fusionada el 20/10 |
| 0.2.2 | 19/10/2026 | F2.4 | `main`, aprobada el 19/10 |
| 0.2.1 | 19/10/2026 | F2.3 | `main`, aprobada el 19/10 |
| 0.2.0 | 19/10/2026 | F2.2 | `main`, aprobada tras la escucha en el iPhone |
| 0.1.5 | 15/10/2026 | F1 · verificación V-01 | `main`, etiqueta `v0.1.5` |
| 0.1.4 | 15/10/2026 | F1 · auditoría CP-1 | `main`, fusionada el 15/10 |
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

## [0.3.0] — 20/10/2026 · Etapa F3.2: disposición en horizontal

Primera versión de la fase F3. Aplica la interfaz aprobada (`docs/interfaz.md` v1.0).

### Cambiado
- **V-01 · PL-04** · Móvil en horizontal: pestañas en un raíl a la izquierda, el mástil con todo el alto y los controles en un panel a la derecha. Cada cuerda pasa de 29 a 53 px en el iPhone con Safari, y mide 42 px en un Android de 280 px de alto. El zoom se queda siempre a la vista, abajo del panel.
- **C-03** · Adivinar: las pistas (Nombre, Cuerda) pasan a la tarjeta del reto. En horizontal, el chip del pentagrama muestra la clave de sol dibujada.
- **C-04** · En pantallas amplias (ordenador, tableta) las cuatro áreas pasan a la cabecera como pestañas. Ajustes se abre como panel lateral en horizontal y en pantallas amplias.
- **G-05** · Con el dedo, los botones miden al menos 40 × 40 px: chips, zoom, repetir, Ajustes, pestañas y los de las cuerdas del afinador. La cejuela (traste 0) pasa a 40 px. Los selectores e interruptores de Ajustes quedan para F3.4.
- En vertical, si falta alto (Adivinar con el pentagrama), el pentagrama encoge antes que el mástil, y cada cuerda conserva 40 px.

### Añadido
- **V-01** · Aviso discreto para girar el móvil, solo con el dedo, en vertical y en pantallas de menos de 600 px, nunca en el Afinador. Si lo cierras, no vuelve; «Restablecer» lo recupera.
- **V-04** · Con el dedo, un traste nunca mide menos de 40 px: en el iPhone en vertical caben como mucho 7 a la vez, y en horizontal, 10. Lo guardado no se pisa: al girar el móvil vuelve el zoom elegido (V-08).
- **C-07** · El botón o gesto «atrás» cierra Ajustes o vuelve al área anterior. Cada área tiene su dirección (`#libre`, `#adivinar`…). Al abrir la app se entra siempre en Libre.
- `herramientas/comprobar-disposicion.js`: mide la disposición en Chromium en diez pantallas de referencia y guarda capturas.

### Verificado
- Banco: 28 de 28. Nuevas: estructura de la interfaz, aviso para girar, límite de 40 px con el dedo y botón «atrás». Las cuatro fallan con la 0.2.3.
- `comprobar-disposicion.js`: «Todo correcto» en las diez pantallas (V-06). Las 15 comprobaciones de F1.1 siguen bien en Chromium.
- `dist/trasteando.html` regenerado: 1,47 MB.

---

## [0.2.3] — 19/10/2026 · Auditoría CP-2 (AR-03, AT-03)

### Corregido
- **C-05 · S-02** · Restablecer desde la acústica dejaba el aviso en «Guitarra acústica» aunque el selector ya marcara la clásica, y si fallaba la carga sonaba la acústica.
- En Windows, el archivo autónomo se daba por desfasado aunque estuviera al día: Git cambiaba los saltos de línea. Ahora son iguales en todos los sistemas.

### Cambiado
- **G-07** · Límites del archivo autónomo: el audio, 1,45 MB como mucho; el archivo entero, 2 MB, para dejar sitio a las fases siguientes. Hoy: 1,38 y 1,46 MB.

### Verificado
- Banco: 24 de 24. Nuevas, con un contexto de audio simulado: cada nota arranca sin silencio, a su velocidad y con su envolvente; con más de 8 notas se apaga la más antigua; el audio interrumpido se reanuda. También el restablecer, y las huellas del audio incrustado.

---

## [0.2.2] — 19/10/2026 · Etapa F2.4: registro agudo

### Cambiado
- **S-01 · S-08** · La guitarra clásica tiene una grabación más, La♯5, para las notas agudas. En afinación estándar ninguna nota se transporta ya más de 6 semitonos: el traste 24 de la 1ª cuerda pasa de +12 a +6 y suena menos artificial. La grabación se desvía 10 cents y la app lo corrige al reproducirla.
- La acústica no tiene grabaciones por encima del Re5 en la fuente elegida: su traste 24 sigue transportando 14 semitonos.
- `dist/trasteando.html` regenerado: 1,46 MB.

### Verificado
- Banco: 20 de 20. Comprueba ahora que cada grabación es la nota asignada, que todas las notas suenan a ±0,5 cents tras la corrección y los límites de transporte de cada timbre.
- Archivo autónomo desde disco y sin conexión: abre en 0,3 s; cuerdas al aire y trastes 12 y 24 de la 1ª, a menos de 1 cent (V-04).

---

## [0.2.1] — 19/10/2026 · Etapa F2.3: archivo autónomo

### Añadido
- **G-07 · G-08** · `dist/trasteando.html`: la app con sus 16 grabaciones dentro. Con doble clic y sin conexión suena la guitarra real. Pesa 1,42 MB: cada grabación va recortada a 4,5 s con un fundido final y a 128 kbps, sin cambiar su afinación. Lo genera `herramientas/generar-autonomo.py` a partir de `index.html`; el banco avisa si se queda desfasado.
- La app usa el audio de dentro de la página cuando lo tiene, y si no, lo descarga de `samples/`.

### Corregido
- El retroceso de la 0.2.0: para usarla con doble clic, abre `dist/trasteando.html`. `index.html` sigue siendo la versión para Live Server y la web.

### Verificado
- Banco: 20 de 20. Nuevas: con el audio dentro no se descarga nada, y el autónomo está al día, pesa 1,5 MB o menos y no contiene direcciones externas.
- En Chromium, desde disco y sin conexión: abre en 0,6 s, el sonido está listo en 0,5 s, ningún intento de conexión, y las notas grabadas suenan a menos de 1 cent (V-03).

---

## [0.2.0] — 19/10/2026 · Etapa F2.2: reproductor propio

### Cambiado
- **S-01 · S-07** · La app suena con un reproductor propio y sus grabaciones de `samples/`. Ya no usa Tone.js ni descarga nada de otros servidores.
- **S-08** · Cada nota corrige la pequeña desviación medida de su grabación. Grabadas en el navegador, las 22 notas comprobadas (cuerdas al aire y 1ª cuerda hasta el traste 24, en los dos timbres) suenan a menos de 1 cent; antes, hasta 4,5.
- Se salta el silencio con el que empiezan algunas grabaciones, de hasta 52 ms: la nota arranca antes.
- **PL-04** · En Safari 16.4 o posterior la app pide sonar aunque el interruptor de silencio del iPhone esté puesto. Se confirma en tu iPhone.
- Solo el timbre activo ocupa memoria; como mucho suenan 8 notas a la vez.

### Retroceso temporal
- **G-07** · Al abrir la app con doble clic suena el sintetizador: los navegadores no dejan a una página local leer otros archivos, y antes las grabaciones llegaban de internet. Con Live Server y en la web suena la guitarra. Se arregla en F2.3, al meter el audio en el propio archivo.

### Verificado
- Banco: 18 de 18. Nuevas: ninguna dirección externa, todas las notas posibles en su frecuencia (±0,5 cents) en los dos timbres, y el silencio inicial se salta.
- En navegador: las 15 comprobaciones de F1.1, móvil en vertical y apaisado, y 22 notas grabadas y medidas (V-02).

---

## [0.1.5] — 15/10/2026 · Verificación en navegador (V-01)

### Corregido
- **V-01 · PL-04** · Con el móvil en horizontal, al mástil le quedaban 3 píxeles por cuerda en un iPhone 13 y ninguno en un iPhone SE: no se podía usar. Arreglo provisional hasta el diseño apaisado de F3.2: en pantallas bajas y apaisadas, las pestañas pasan a una columna a la izquierda, la cabecera comparte fila con los atajos y el pentagrama encoge.

### Verificado
- En Chromium, alto de cada cuerda en horizontal: iPhone 13, 29 px en Libre y 21 en Adivinar; iPhone SE, 25 y 17; Pixel 7, 32 y 24; iPad Mini, 68 y 59. En vertical no cambia nada (iPhone 13: 51 px). Sin errores en la consola.
- Banco automático: 15 en verde y 1 pendiente.

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
