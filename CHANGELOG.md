# Registro de cambios — Trasteando

Todas las versiones de la app, de la más reciente a la más antigua.

**Pauta de versiones:** `0.‹fase›.‹corrección›` mientras se desarrolla —la `0.1.x` corresponde a la fase F1 del roadmap, la `0.2.x` a la F2…— y `1.0.0` en el lanzamiento (F7). Cada entrada cita los requisitos de `requisitos.md` que la motivan, para poder seguir el hilo en ambos sentidos. Formato inspirado en *Keep a Changelog*.

| Versión | Fecha | Etapa | Dónde está |
|---|---|---|---|
| **0.3.3** | 20/10/2026 | F3.3 · correcciones de la Sesión 1 | Rama `auto/F3.3-sesion1` |
| 0.3.2 | 20/10/2026 | F3 · tu comentario sobre el zoom | Rama `auto/F3.2-zoom` |
| 0.3.1 | 20/10/2026 | F3.4 | `main`, fusionada el 20/10 (PR #9) |
| 0.3.0 | 20/10/2026 | F3.2 | `main`, fusionada el 20/10 (PR #8) |
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

## [0.3.3] — 20/10/2026 · Correcciones de la Sesión 1

### Corregido
- **S-01 · PL-04** · *Sonido en el iPhone* (C07, C08 y D03). Con el iPhone bloqueado seguía sonando la corrección de un fallo, y a veces, al volver, el sonido se quedaba mudo hasta cerrar la app. Ahora, al ocultar la app se cortan las notas, se cancela lo que iba a sonar y se pausa el audio; al volver se reanuda y, si iOS no lo suelta, el siguiente toque crea un audio nuevo. Es un fallo conocido de Safari en las apps de pantalla de inicio (WebKit 291892), así que además **Ajustes enseña el estado del sonido y tiene «Reactivar sonido»**. Se confirma en la Sesión 2.
- **General** · *Icono de la pestaña* (A16): el navegador pedía `favicon.ico` y daba un 404 en la consola. Ahora la página declara su icono.
- **S-02** · Elegir guitarra ya no hace sonar una nota de muestra (A14).

### Cambiado
- **J-01** · Adivinar empieza con ▶: al entrar no suena nada hasta que lo pulsas, y ▶ aparece resaltado. Antes de ▶ puedes tocar el mástil sin que cuente (E06).
- **J-01** · En Adivinar, la lectura grande y el pentagrama muestran la **nota buscada**: «?» hasta que aciertas o fallas, o la nota si tienes la pista de nombre. Antes mostraban la última que pulsaste e inducían a error (E06).
- **J-10** · Al fallar, la corrección llega a los 1,2 s (antes 0,65) y el reto siguiente 3 s después, para que puedas comparar las dos notas. El fallo se rellena en rojo con ✗ y las posiciones correctas en verde con ✓ (A09).
- **J-08 · C-05** · «Restablecer todos los ajustes» conserva tu récord. Para borrarlo hay un botón propio, «Borrar el récord de racha» (A14). No hacen falta usuarios: el récord vive en tu navegador.

### Verificado
- Banco: 39 de 39. Las 6 pruebas nuevas fallan con la 0.3.2 y pasan con la 0.3.3. `comprobar-disposicion.js` (14 pantallas), `comprobar-accesibilidad.js`, las 15 comprobaciones de F1.1 y el archivo autónomo, bien.

---

## [0.3.2] — 20/10/2026 · Zoom: «+» enseña más trastes

### Cambiado
- **V-04** · «+» enseña más trastes y «−» menos, al revés que antes, y en ese orden de izquierda a derecha (tu comentario del 20/10).
- **V-04 · G-05** · Con el dedo puedes pedir más trastes, que se estrechan hasta 28 px. En el iPhone con Safari caben hasta 11 en vertical (antes 7) y 15 en horizontal (antes 10). La vista por defecto sigue con trastes de 40 px o más; en horizontal empieza en 10. Con ratón no cambia nada.

### Verificado
- Banco: 35 de 35, con la prueba del zoom ampliada (anchos, orden de los botones y que «+» sume trastes). `comprobar-disposicion.js` y las 15 comprobaciones de F1.1 siguen bien. Se audita en CP-3.

---

## [0.3.1] — 20/10/2026 · Etapa F3.4: accesibilidad y paleta

### Cambiado
- **G-05** · **Paleta nueva por nota**, elegida con tu criterio del 20/10: las 7 notas naturales bien distintas y cada sostenido, un tono más claro de su natural. Parte de tu imagen (Do melocotón, Re verde, Mi amarillo, Fa lila, Sol rosa, La rojo, Si celeste), pero separa los tres tonos cálidos que allí se parecían. Contraste mínimo de 5,1:1 (antes 2,7:1). Con tritanopía, las naturales pasan de 2,8 a 7,8 de separación.
- **G-05** · Los grises de texto suben a 4,5:1 sobre todos los fondos. El más tenue estaba en 2,5:1.
- **G-05** · Con «Ver todas las notas» y «Señalar posiciones iguales», los puntos secundarios llevan contorno en el color de la nota en vez de ser semitransparentes: su nombre se lee. La nota pulsada sigue rellena.

### Añadido
- **G-05** · El mástil se maneja con teclado. Es un único punto del tabulador; dentro, las flechas mueven, Inicio y Fin van al primer y al último traste a la vista, e Intro o Espacio tocan la nota. Cada casilla se anuncia («Re4, 2ª cuerda, traste 3»). En Adivinar no se anuncia la nota, porque sería la respuesta (J-12).
- **G-05** · En Ajustes, tocar cualquier parte de una fila con interruptor lo cambia. La hoja se cierra deslizando el asa hacia abajo.
- `herramientas/paleta.py`: genera la paleta y comprueba contraste, separación con tres tipos de daltonismo y que cada sostenido sea de la familia de su natural.
- `herramientas/comprobar-accesibilidad.js`: recorre la app solo con teclado, mide el contraste de cada texto visible y comprueba el modo de movimiento reducido.

### Corregido tras AR-06 y AT-05
- **J-12 · G-05** · En Adivinar, un lector de pantalla podía leer la nota de las casillas sin foco. Ahora ninguna casilla la anuncia, y el texto de los puntos no se lee.
- **L-03** · Con «Ver todas las notas», las posiciones del mismo sonido llevan además un anillo claro por fuera.
- El asa de Ajustes termina el gesto aunque se suelte fuera y no rebota al cerrar. Mantener pulsado Intro no repite la nota. La casilla con foco no queda bajo el nombre de la cuerda.
- `paleta.py` tiene umbrales escritos y falla por debajo de ellos.

### Verificado
- Auditorías AR-06 y AT-05: 11 hallazgos, ninguno crítico ni alto; todos corregidos.
- Banco: 35 de 35. Cinco pruebas nuevas: la paleta, los grises, el mástil con teclado, la fila y el asa de Ajustes, y que en Adivinar ninguna casilla anuncie su nota. Las cuatro primeras fallan con la 0.3.0.
- `comprobar-accesibilidad.js`: «Todo correcto». Con la 0.3.0 encontraba 205 textos por debajo del contraste y un mástil al que no se llegaba con el teclado (V-07).
- `comprobar-disposicion.js` y las 15 comprobaciones de F1.1 siguen bien. `dist/trasteando.html` regenerado: 1,48 MB.

---

## [0.3.0] — 20/10/2026 · Etapa F3.2: disposición en horizontal

Primera versión de la fase F3. Aplica la interfaz aprobada (`docs/interfaz.md` v1.0).

### Cambiado
- **V-01 · PL-04** · Móvil en horizontal: pestañas en un raíl a la izquierda, el mástil con todo el alto y los controles en un panel a la derecha. Cada cuerda pasa de 29 a 53 px en el iPhone con Safari, y mide 42 px en un Android de 280 px de alto. El zoom se queda siempre a la vista, abajo del panel.
- **C-03** · Adivinar: las pistas (Nombre, Cuerda) pasan a la tarjeta del reto. En horizontal, el chip del pentagrama muestra la clave de sol dibujada.
- **C-04** · En pantallas amplias (ordenador, tableta) las cuatro áreas pasan a la cabecera como pestañas. Ajustes se abre como panel lateral en horizontal y en pantallas amplias.
- **G-05** · Con el dedo, todo botón, desplegable e interruptor mide al menos 40 × 40 px, también en Ajustes. La cejuela (traste 0) pasa a 40 px.
- **G-05 · C-01** · Ajustes es un diálogo: mientras está abierto, el resto de la página no responde, y al cerrarlo el foco vuelve al botón que lo abrió. La navegación va detrás de la cabecera en el código, para que el tabulador la recorra donde se ve.
- En vertical, si falta alto (Adivinar con el pentagrama), el pentagrama encoge antes que el mástil, pero no baja de 60 px. Desde 660 px de alto cada cuerda conserva 40 px; en pantallas más bajas, como el iPhone SE, manda que la barra de pestañas no se salga.
- En horizontal, el Afinador coloca las seis cuerdas en dos filas de tres y su pentagrama cabe entero.

### Añadido
- **V-01** · Aviso discreto para girar el móvil, solo con el dedo, en vertical y en pantallas de menos de 600 px, nunca en el Afinador. Si lo cierras, no vuelve; «Restablecer» lo recupera.
- **V-04** · Con el dedo, un traste nunca mide menos de 40 px: en el iPhone en vertical caben como mucho 7 a la vez, y en horizontal, de 10 a 12 según el ancho. Lo guardado no se pisa: al girar el móvil vuelve el zoom elegido (V-08).
- **C-07** · El botón o gesto «atrás» cierra Ajustes o vuelve al área anterior. Cada área tiene su dirección (`#libre`, `#adivinar`…). Al abrir la app se entra siempre en Libre. Tras recargar, un «atrás» que dejaría la misma área se salta.
- `herramientas/comprobar-disposicion.js`: mide la disposición en Chromium en 14 pantallas de referencia, dos de ellas con Ajustes abierto, y guarda capturas.

### Verificado
- Auditorías AR-05 y AT-04: 14 hallazgos, uno alto en cada una (el mismo: en el iPhone SE la barra de pestañas se salía de la pantalla). Todos corregidos antes de fusionar, salvo el gesto de bajar para cerrar Ajustes, que pasa a F3.4.
- Banco: 30 de 30. Seis pruebas nuevas: estructura de la interfaz, aviso para girar, límite de 40 px con el dedo y tres del botón «atrás», con un historial simulado que avisa como el de verdad. Las cuatro primeras fallan con la 0.2.3.
- `comprobar-disposicion.js`: «Todo correcto» en las 14 pantallas (V-06). Las 15 comprobaciones de F1.1 siguen bien en Chromium.
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
