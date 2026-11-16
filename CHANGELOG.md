# Registro de cambios — Trasteando

Todas las versiones de la app, de la más reciente a la más antigua.

**Pauta de versiones:** `0.‹fase›.‹corrección›` mientras se desarrolla —la `0.1.x` corresponde a la fase F1 del roadmap, la `0.2.x` a la F2…— y `1.0.0` en el lanzamiento (F7). Cada entrada cita los requisitos de `requisitos.md` que la motivan, para poder seguir el hilo en ambos sentidos. Formato inspirado en *Keep a Changelog*.

Las versiones anteriores a la 0.6.0, de la 0.0.1 a la 0.5.7, están en `docs/historico/CHANGELOG.md` (rama `archivo/hasta-0.6.2`).

| Versión | Fecha | Etapa | Dónde está |
|---|---|---|---|
| **0.6.12** | 16/11/2026 | F5.8 · #10, ningún control fuera de la pantalla | `auto/F5.8-respuesta` (PR #26) |
| 0.6.11 | 16/11/2026 | F5.8 · #9, pistas en una línea y frase del reto más corta | `main`, fusionada el 16/11 (PR #25) |
| 0.6.10 | 16/11/2026 | F5.8 · #9, las pistas de Adivinar se leen enteras | `main`, fusionada el 16/11 (PR #25) |
| 0.6.9 | 16/11/2026 | F6.3 · instalable: manifiesto e iconos | `main`, fusionada el 16/11 (PR #24) |
| 0.6.8 | 16/11/2026 | F6.2 · sin conexión desde la web (Service Worker) | `main`, fusionada el 16/11 (PR #23) |
| 0.6.7 | 15/11/2026 | F5.8 · #7, el metrónomo sin huecos y a la par | `main`, fusionada el 16/11 (PR #22) |
| 0.6.6 | 15/11/2026 | F5.8 · #6, arranca también en un marco aislado | `main`, fusionada el 15/11 (PR #21) |
| 0.6.5 | 15/11/2026 | F5.8 · #6, Acordes más sencillo | `main`, fusionada el 15/11 (PR #21) |
| 0.6.4 | 15/11/2026 | F5.8 · #5, Escalas por posiciones | `main`, fusionada el 15/11 (PR #20) |
| 0.6.3 | 15/11/2026 | F5.8 · #3 y #4, temas, iPad y Adivinar | `main`, fusionada el 15/11 (PR #19) |
| 0.6.2 | 12/11/2026 | F5.8 · #2, el afinador sigue la nota; pantalla encendida | `main`, fusionada el 15/11 (PR #18) |
| 0.6.1 | 22/10/2026 | F5.8 · #1, el péndulo del metrónomo | `main`, fusionada el 15/11 (PR #18) |
| 0.6.0 | 22/10/2026 | F6.1 · el archivo autónomo, probado como la app | `main`, fusionada el 22/10 (PR #17) |

---

## [Sin publicar]

Nada todavía.

---

## [0.6.12] — 16/11/2026 · F5.8 · Ningún control fuera de la pantalla

Tu comentario del 16/11, con una captura del iPhone en horizontal, tal cual: «Ademas de lo anterior ojo que e muestra la respuesta se sale de la pantalla. Revisa que todos los posibles controles quedan bien en todas las circunstancias / Tambien resuce el qording de cuando falla, tey it again es suficiente, o try again! Directamente». Y tu respuesta a AR-22 #5: «ok crea el j14».

### Corregido
- **J-14** · En horizontal, tras un fallo con las pistas encendidas, **«Ver la respuesta» se salía del panel** por la derecha. Las pistas van en columna, y el botón tenía `flex-basis: 100%` con saltos permitidos: en una columna, ese 100 % es el **alto**, y Safari lo mandaba a una segunda columna. Ahora va siempre debajo.
- **J-14 · V-01** · En vertical, con las dos pistas encendidas (y más tras un fallo), **las pestañas se salían por abajo** en un iPhone con Safari (390 × 664): sobraban 10 px, y 57 tras un fallo. Ahora, mientras hay pistas, se esconde el aviso para girar (vuelve al apagarlas) y las cajas de pista miden 48 px en vez de 58.
- **V-04** · En el móvil en horizontal, el zoom de inicio no descontaba las **zonas seguras** (la isla y la barra de inicio): en un iPhone 15 Pro instalado salían 10 trastes de 38 px, y el Pro Max (932 px de ancho) caía en la regla de tableta, con 17 de 28 px. Ahora son los que caben a 40 px: 9 y 11. A quien ya tenía un zoom guardado no le cambia (como tú, con 12).
- **G-05** · En un Android en horizontal con las barras de Chrome (280 px de alto), el botón de Ajustes del raíl quedaba cortado: 7 botones de 40 px no caben. Ahora el raíl se desplaza, como el panel, y el contorno de foco de las pestañas va por dentro.
- **J-14** · En un iPad mini en horizontal con Safari (1133 × 670), con pistas y sobre todo tras un fallo, el mástil y el zoom se salían por abajo (ya pasaba en la 0.6.11; lo encontró la auditoría AT-22). En tableta, «Ver la respuesta» va ahora en la misma fila que las pistas, y las cajas miden 72 px en vez de 84.

### Cambiado
- **J-14** · Al fallar, el aviso es solo **«✗ ¡Prueba otra vez!»** («✗ Try again!»); el lector de pantalla no lee la ✗, que diría «multiplicación».
- **Requisitos y matriz v2.9:** J-14, nuevo (las pistas se leen enteras y, con ellas, ningún control queda fuera), con lo que tenía J-06 desde la 0.6.10, en qué pantallas se comprueba y qué cuenta como «a la vista»; J-06 vuelve a «se activan sin abrir el menú» (validado en la Sesión 1); V-01, V-04 y G-05, sus notas.

### Comprobado
- `herramientas/comprobar-disposicion.js`, ampliada: simula las **zonas seguras** del iPhone instalado (15 Pro y Pro Max, en las dos orientaciones), prepara estados (Adivinar tras un fallo con las dos pistas, Escalas practicando) y mira que **ningún control** quede fuera de la pantalla, bajo una zona segura o recortado por una caja (antes no miraba dentro del panel). 81 pantallas (con Android simulado e iPad tras un fallo), en español y en inglés: todo correcto (con la 0.6.11, 14 fallos).
- `herramientas/comprobar-pistas.js`: 126 de 126. Banco: 234 de 234, con pruebas nuevas del aviso para girar con pistas, del zoom de inicio con zonas seguras (11 en el Pro Max, 9 en el 15 Pro, 10 con Safari) y de que el zoom cuadra con el css.
- Auditorías ligeras AT-22 y AR-23, sin críticos: corregidos los altos (la herramienta vigila también Android e iPad y J-14 dice en qué pantallas se comprueba; que el detector sí ve el fallo se demostró con la 0.6.11) y casi todos los medios; lo que queda, en la matriz (J-14).

---

## [0.6.11] — 16/11/2026 · F5.8 · Pistas en una línea y frase del reto más corta

Tu decisión del 16/11, tras ver las dos opciones: «mejor en una línea, pero que sea una línea en ambos idiomas; dale más espacio al margen con las pistas recortando un poco los trastes… algo conciso [para la frase]».

### Cambiado
- **J-06** · **Las pistas, en una sola línea** en español y en inglés, nunca por debajo de 20 px. Para que quepan:
  - en horizontal, en Adivinar, el panel de la derecha pasa de 176 a **204 px**, a costa de un poco de mástil (en el iPhone grande, de unos 610 a 585 px; en el SE, de 427 a 399; y sin bajar de 40 px por traste, el mínimo para el dedo). En las demás áreas sigue igual;
  - con las dos pistas encendidas, la de la nota ocupa lo que necesita (como mínimo, el 30 %) y el resto es para las cuerdas;
  - «Ver la respuesta», que aparece tras un fallo, va en la fila de debajo: en la misma fila dejaba a cada pista con unos 80 px.
- **La frase del reto, más corta:** «Pulsa ▶, escucha y encuéntrala» (antes, «Pulsa ▶ para oír la nota» y, debajo, «y búscala en el mástil»); durante el reto, «Escucha y encuéntrala». En inglés, «Press ▶, listen and find it» y «Listen and find it». Cabe en una línea en vertical y en dos como mucho en el panel de horizontal.
- `herramientas/comprobar-pistas.js` exige ahora una sola línea: 126 de 126; la más pequeña, 22 px (6 cuerdas en inglés, en horizontal). `comprobar-disposicion.js`: todo correcto (cada traste, 40 px o más).

---

## [0.6.10] — 16/11/2026 · F5.8 · Las pistas de Adivinar se leen enteras

Tu comentario del 16/11, con capturas del iPhone: «no se ven las cuerdas de pista, incluso peor en horizontal… optimiza los tamaños».

### Corregido
- **J-06** · **Las cuerdas ya no se cortan.** El tamaño se elegía por el número de letras (21 px si pasaba de 7), y con 4 o más cuerdas en inglés no cabía: «1st 2nd 3rd 4t…». Ahora se **mide**: la respuesta empieza en 30 px (44 en tableta) y baja de 1 en 1 hasta caber entera; nunca por debajo de 20 px, el tamaño de la nota que tocas, para que lo que buscas no se vea más pequeño que lo que tocas (si no cabe, en dos líneas). Nada se corta con «…». Se vuelve a medir al girar, al cambiar la ventana y cuando aparece «Ver la respuesta» (`ResizeObserver`).
- **J-06** · **Las cuerdas, en números con el ordinal pequeño:** «1ª 2ª 3ª» y, en inglés, «1st 2nd 3rd» con «st», «nd»… pequeños y arriba. Es lo que menos informa, y así el número se ve grande.
- **J-06** · **En horizontal** el panel mide unos 140 px: la nota se quedaba en «F…» y las cuerdas, en blanco (el recuadro se quedaba sin ancho). Ahora las dos pistas van una encima de la otra, con todo el ancho; para que el pentagrama siga a la vista, la racha se pone al lado de ▶, y no en una fila propia debajo.
- **El texto gigante tras girar el iPhone** (tu tercera captura): Safari agranda por su cuenta el texto que cree pequeño al pasar a horizontal, y al volver no siempre lo deshace. Con `text-size-adjust: 100%` los tamaños son siempre los del CSS.
- Banco: dos pruebas nuevas (las cuerdas en números con su ordinal, en español y en inglés; el CSS sin «…» y con `text-size-adjust`). En Chromium, `herramientas/comprobar-pistas.js`: 126 de 126 (iPhone grande y SE e iPad, vertical y horizontal, español e inglés, notas en 3 a 6 cuerdas, tras un fallo y tras girar; ▶ libre de la racha).
- **J-07** · En horizontal, la racha va al lado de ▶ (antes, en una fila propia debajo).

### Pendiente
- Tu prueba en el iPhone, en vertical y en horizontal.

---

## [0.6.9] — 16/11/2026 · F6.3 · La app se puede instalar: manifiesto e iconos

Roadmap F6.3 (G-04): que el navegador ofrezca instalarla y quede como un icono más en el móvil.

### Añadido
- **G-04** · **Manifiesto propio (`manifest.webmanifest`).** Un archivo JSON que le dice al navegador cómo se llama la app, cómo se abre (a pantalla completa, sin barra de direcciones), sus colores y sus iconos. Antes iba incrustado en la página (`data:`) y sin iconos, y Chrome no la daba por instalable. Las direcciones son relativas (`./`), para que funcione también en `/guitarra/`, la web de pruebas.
- **G-04** · **Iconos PNG** en `iconos/`: 192 y 512 px (los que exige Chrome), uno «maskable» de 512 (a sangre, para que Android lo recorte en círculo o en gota sin cortar el dibujo) y el del iPhone, `apple-touch-icon.png`, de 180 px y sin transparencia (el iPhone no usa los del manifiesto ni acepta SVG: hasta ahora, al añadirla a la pantalla de inicio, salía una captura en vez del icono).
- Un solo dibujo, `iconos/icono.svg`, del que salen todos con `herramientas/generar-iconos.js`. El dibujo, ahora con **6 cuerdas** (tenía 5).
- **G-04** · El Service Worker guarda también el manifiesto y los iconos: instalada y sin red, no pierde su icono.
- El archivo autónomo no los lleva: desde el disco no se instala, y el navegador anotaría un error al no encontrarlos.
- Sin `id` en el manifiesto (AT-20 #1): uno relativo se calcula desde la raíz del dominio, y la app tendría la identidad de todo `pdigue.github.io`; sin él, su identidad es su carpeta, `/guitarra/`. Comprobado con lo que entiende Chrome.
- Banco: `tests/instalar.test.js` (5 pruebas) y una más en `tests/sw.test.js`. En Chromium, `herramientas/comprobar-instalable.js`: 13 de 13 (Chrome no pone ningún motivo en contra y el manifiesto trae los iconos de 192, 512 y «maskable»; con la 0.6.8 fallan 3: desde 2024 Chrome deja instalar casi cualquier página, así que preguntarle solo a él ya no basta).

### Pendiente
- Instalarla desde la web publicada, en el iPhone y en Android (F7.2).

---

## [0.6.8] — 16/11/2026 · F6.2 · La app funciona sin conexión desde la web

Roadmap F6.2 (G-03): abrirla una vez con red y, después, usarla en modo avión.

### Añadido
- **G-03** · **Service Worker (`sw.js`).** Un programa pequeño que el navegador guarda aparte y que se pone en medio de cada petición de la app. La primera vez que se abre con red guarda la página, el estilo, el código y las 17 grabaciones (36 archivos); sin red, contesta él con esas copias.
- **G-03** · **Siempre la última versión.** La página se pide primero a la red (si no hay, o tarda más de 3 s, se usa la copia); lo demás sale de la copia, porque cada versión lleva su `?v=`. Al llegar una versión nueva se guarda entera y se borran las copias de la anterior.
- **G-03, PL-04** · Se registra solo donde existe (`https` o `localhost`), nunca con doble clic ni en el archivo autónomo, que ya lleva el audio dentro (G-07). Si el navegador no lo tiene, la app funciona igual, solo que con conexión.
- Banco: `tests/sw.test.js` (8 pruebas: la precarga es justo lo que carga `index.html` más las grabaciones, sin red todo sale de la copia, versiones…) y cuándo se registra. En Chromium, `herramientas/comprobar-sin-conexion.js`: 9 de 9.

### Corregido tras las auditorías AT-19 y AR-20
- **G-03** · Una página de **otra versión** que llega de la red (la nueva que tarda tras publicar, o una vieja de la caché de 10 minutos de GitHub Pages) se enseña, pero ya no sustituye a la copia guardada: sin red se abriría una página que pide archivos que no están, y la app no arrancaría (AT-19 M1). Con su prueba.
- **PL-04** · `docs/compatibilidad.md` v1.13: el Service Worker, en uso, con el aviso del iPhone (Safari borra lo guardado por un sitio que no se usa en unos 7 días, salvo la app instalada), y una fila para su caché (AT-19 M2, AR-20 #1). El criterio de F7.2 pide probarlo en el iPhone desde Safari y desde la app instalada, también tras días sin abrirla (AR-20 #2).

### Pendiente
- Comprobarlo desde la web publicada y en el iPhone (F7.2). Lo bajo de las auditorías, anotado en G-03.

---

## [0.6.7] — 15/11/2026 · F5.8 · El metrónomo, sin huecos y con lo que se ve a la par de lo que se oye

Tu comentario del 12/11 #7: «el metrónomo no termina de funcionar del todo bien. Analízalo». Lo que notabas: a veces el pulso suena irregular y lo que se ve no va con el sonido.

### Corregido
- **MT-04** · **Ya no se pierden golpes.** Solo había 100 ms de golpes programados por adelantado: si el móvil se entretenía más de unos 75 ms, el golpe siguiente ya había pasado y se saltaba, y eso se oía como un pulso irregular. Ahora se programan 300 ms, que aguantan tirones de hasta 0,25 s. Medido en Chromium con tirones de 200 ms: antes se perdían 10 de 63 golpes; ahora, ninguno.
- **MT-04** · **Los cambios siguen siendo inmediatos.** Con más golpes apuntados, un cambio de tempo, compás, figura o acento (o Parar) tardaría en notarse: los golpes que aún no han sonado se retiran y se vuelven a apuntar con lo nuevo. Parar ya no deja escapar ningún golpe.
- **MT-04, MT-06** · **La luz y el péndulo van con lo que se oye.** Se calculaban con el sonido que el navegador *prepara*, que sale por el altavoz un poco después (0,15 a 0,25 s con auriculares Bluetooth). Ahora se pregunta al navegador qué está sonando (`getOutputTimestamp()` o las latencias que declare) y la luz espera a ese momento.
- Los osciladores de cada golpe se sueltan al acabar (AT-11 #6).

### Corregido tras las auditorías AT-18 y AR-19
- Dos cambios seguidos muy rápidos (el compás o la figura y, enseguida, el tempo o el acento) podían dejar el metrónomo mudo durante minutos aunque dijera «sonando»: al retirar golpes ya no se vuelve a uno contado desde el arranque anterior.
- Un golpe que vaya a sonar en menos de 30 ms ya no se retira (antes, 10 ms): en algunos móviles podía cortarse a medias.
- MT-04 dice ya lo que se puede medir: los cambios, desde el primer golpe que aún no ha empezado (compás y figura, desde el próximo pulso), y la latencia, la que mida o declare el navegador. El péndulo (MT-06), en el control de cambios.

### Añadido
- `herramientas/medir-metronomo.js`: mide en un Chromium real golpes perdidos, intervalos y el retraso de la luz, bajo tirones; acepta otra raíz para comparar con una versión anterior.

---

## [0.6.6] — 15/11/2026 · F5.8 · La app arranca también en un marco aislado

Lo viste al abrir el archivo autónomo en la vista previa del chat: el mástil salía vacío.

### Corregido
- **C-07, PL-04** · En un marco aislado (la vista previa de un chat, un `iframe` con *sandbox*) el historial del navegador existe pero no se deja usar, y el error cortaba el arranque antes de dibujar el mástil. Ahora la app prueba el historial una vez al empezar y, si falla, sigue sin él: todo funciona salvo el botón «atrás» del sistema, como en un navegador que no lo tuviera.

---

## [0.6.5] — 15/11/2026 · F5.8 · Acordes más sencillo, con el dibujo como protagonista

Tu comentario del 12/11 #6: «En cuanto a la parte de acordes, es igual, parece confuso y engorroso. Simplifícalo y mejora el looking». Tus respuestas del 15/11: el mástil acotado y grande, y elegir por nota y tipo.

### Añadido
- **AC-07** · **El acorde en grande.** En Acordes, el mástil enseña solo los trastes 0 a 5 (donde caben las 30 digitaciones), estirados a todo el ancho; sin zoom ni desplazamiento. Los dedos, más grandes. Al salir vuelve tu zoom.

### Cambiado
- **AC-01** · **Se elige con dos filas de botones:** la nota (Do … Si) y el tipo (Mayor, menor, 7, m7, maj7, sus4 y el bajo, que dice su nota: /Sol con Do, /Si con Sol). Un tipo que no existe para esa nota se apaga; al cambiar de nota se conserva el tipo si existe (de Lam a Mim) y, si no, se pasa al mayor.
- En Acordes ya no salen el aviso para girar el móvil ni el botón «Pentagrama». En el móvil en horizontal, el nombre y «Tocar» van arriba de la columna.

### Retirado
- **AC-03** · El pentagrama del acorde: en Acordes manda el dibujo. Las notas siguen escritas junto al nombre (B7: Si · Re♯ · Fa♯ · La).
- **AC-06** · El buscador y el listado de populares y de 30: con las dos filas, cualquier acorde está a dos toques.

### Corregido tras las auditorías AR-18 y AT-17
- Con el teclado, el foco ya no se va a los trastes ocultos (más allá del 5).
- Una prueba avisa si algún día entra un acorde que pase del traste 5.
- V-01 y P-03 dicen ya que en Acordes no salen el aviso para girar ni el pentagrama.

---

## [0.6.4] — 15/11/2026 · F5.8 · Escalas, una posición cada vez

Tu comentario del 12/11 #5: «la parte de escala no me gustaba nada (…) que no haya tanto de práctica, sino ir pudiendo tocar las notas de la escala e ir escuchando la propia escala (…) No es agradable entrar ahí y ver el traste de la guitarra lleno de notas».

### Añadido
- **E-07** · **Una posición cada vez.** La escala ya no llena el mástil: se reparte en posiciones de 3 notas por cuerda en la mayor y la menor (7) y de 2 en las pentatónicas (las 5 «cajas» de siempre). La **posición 1 es la de la tónica**, como en los libros; ◀ ▶ las recorre hacia el cuerpo («Posición 1 de 7 · trastes 8 a 13») y la vista del mástil va sola a la posición.
- **E-08** · **Escuchar:** un botón toca la posición entera, subiendo y bajando, con cada nota resaltada; otro toque la para.
- **E-09** · **Tocar la escala:** al tocar una casilla de la posición, suena y el paso a paso salta a ella.
- **E-10** · **Todas:** un botón (arriba, junto a «Do Re Mi») enseña la escala también en el resto del mástil, más pequeña y apagada. Apagado de fábrica.
- **E-05b** · **Practicar:** las casillas de la posición se quedan sin nombre ni color y hay que tocarlas en orden, de grave a agudo; las buenas quedan en verde, y un fallo se marca en rojo (con aviso propio si es la misma nota en otra cuerda).

### Cambiado
- **E-05** · **Se retira la Práctica de antes** (contar las notas de la escala que encontrabas por todo el mástil). La sustituyen E-09 y la Práctica nueva (E-05b).
- **E-03** · Solo se ven las casillas de la posición (18, o 12 en las pentatónicas), con su nombre y la tónica con anillo; el resto del mástil queda limpio.
- **E-06** · El paso a paso recorre la posición de su nota más grave a la más aguda y resalta esa casilla, no todas las que suenan igual.
- **E-04** · En la línea «Do T Re T Mi…» se resalta el grado del paso actual.
- **P-03** · El pentagrama escribe 8 notas seguidas de la posición alrededor del paso (la posición entera no cabe).

### Corregido tras las auditorías AR-17 y AT-16
- «Escuchar» se para al ocultar la app (si no, sus notas se acumulaban y sonaban juntas al volver).
- El lector de pantalla ya no repite «Posición 1 de 7…» en cada nota de «Escuchar».
- Al cambiar de afinación estando en Escalas, la vista va a la posición.
- Con una afinación personalizada muy abierta, las posiciones no se salen del mástil.
- Cuando ◀ o ▶ llega al final, el foco del teclado pasa al otro botón.
- E-05 no cambia de significado: se retira y su sustituto lleva ID nuevo (E-09).

### Para el desarrollo
- `posicionesEscala()` en `js/13-escalas.js` calcula las posiciones con alturas (vale en cualquier afinación: en Drop D la 6.ª se queda con 4 notas). `reiniciarEscala()` sustituye a `resetScalePractice()`; `state.scaleMode` desaparece (se borra al cargar).
- Requisitos y matriz v2.2 (con un estado nuevo, «retirado», en el generador); roadmap v4.2.

---

## [0.6.3] — 15/11/2026 · F5.8 · Temas, iPad y Adivinar

Tus comentarios del 12/11 #3 («un *looking* más limpio, estética un poco Apple (…) también en iPad, que no está preparado») y #4 («las pistas deberían salir en grande (…) se confunde qué tenemos que buscar y cuál es la que hemos tocado»).

### Añadido
- **V-10** · **Temas elegibles** en Ajustes › Aspecto: *Madera* (el de siempre, más limpio y de fábrica), *Automático* (claro u oscuro, como el dispositivo, con los grises y el naranja del sistema de Apple) y *Partitura* (papel, tinta y rojo de imprenta, la propuesta nueva). El mástil es oscuro en todos, para que los colores de las notas se lean igual. En un tema claro, la nota leída, las pistas y el pentagrama se escriben con la tinta del texto, porque los colores pastel no se leen sobre papel.
- **V-11** · **Disposición propia para tableta y ordenador** (área útil de 700 × 600 px o más, también un iPad mini en horizontal con las barras de Safari): el mástil ya no se estira (en un iPad en vertical las cuerdas medían 150 px; ahora 67), se centra, y lo que sobra va al pentagrama y a la lectura, que crecen; textos y botones más grandes; las pestañas son un control segmentado, en su propia fila si no caben junto al nombre.

### Cambiado
- **J-06** · En Adivinar, cada pista encendida **ocupa su parte de la franja**, con la respuesta en grande (30 px en el móvil, 44 en tableta); una respuesta larga («1ª 2ª 3ª 4ª») se reduce para caber entera.
- **J-01** · La nota que tocas se lee **en pequeño y apagada**, junto al pentagrama, para que no compita con la que buscas.
- **C-02** · Ajustes tiene el grupo **Aspecto**.
- **V-10** · Más limpio en todos los temas: chips sin borde, tarjetas redondeadas, sin degradados de fondo ni líneas de separación de más.
- **C-04** · En tableta y ordenador, las pestañas son un control segmentado: en la cabecera desde 1100 px de ancho y, por debajo, en su propia fila.

### Corregido
- **V-04** · En un iPad en horizontal (1024 px), el mástil de inicio enseñaba los 24 trastes a 38 px; con el dedo ahora enseña los que caben a 40 (22).

### Corregido tras las auditorías AR-16 y AT-15
- Al cambiar de tema, también se reescriben los pentagramas de Acordes y del Afinador (antes podían quedar notas pastel sobre papel claro).
- El tema guardado se aplica antes de pintar la página (sin un instante de Madera al abrir).
- La tinta del pentagrama en los temas claros ya no usa `var()` dentro de los atributos del SVG, que Safari podría no aceptar.
- En ventanas de ordenador bajas (1280 × 720), Acordes cabe entero.
- **J-06** vuelve a «sin validar» hasta que lo pruebes: cambió justo lo que validó la Sesión 1.

### Para el desarrollo
- Fichas de color por tema en `css/trasteando.css`; `aplicarTema()` en `js/09-navegacion.js` pone `data-theme` y `data-scheme` en `<html>`.
- `js/00-aspecto.js`, en el `<head>`: pone el tema guardado antes de pintar.
- `comprobar-accesibilidad.js` admite `TEMA` y `ESQUEMA`; `comprobar-disposicion.js` mide seis pantallas de tableta y ordenador y comprueba que las pestañas no pisan nada.
- Baseline 0.6.2 (15/11): requisitos y matriz v2.0 y v2.1, roadmap v4.0, histórico en `docs/historico/`, y `tests/documentos.test.js`.

---

## [0.6.2] — 12/11/2026 · F5.8 · El afinador sigue la nota, y la pantalla no se apaga

Tus comentarios del 12/11, primera entrega (#2): «el afinador solamente coge como un pico del sonido», «que mantenga un poco más la escucha» y «por defecto aparezca la parte de micrófono». Y tu «sí» a mantener la pantalla encendida.

### Cambiado
- **A-02** · El afinador **sigue la nota mientras se apaga**. Antes solo aceptaba lecturas muy claras, y una cuerda solo suena así en el instante de pulsarla. Ahora:
  - filtra el sonido antes de analizarlo (fuera lo de menos de 60 Hz y lo de más de 1200 Hz), y analiza trozos el doble de largos (85 ms);
  - para *empezar* a seguir una nota pide lo mismo que antes (dos lecturas claras que coincidan), así un golpe o una voz no mueven la aguja;
  - una vez enganchada, le basta mucha menos claridad mientras la lectura siga cerca de las últimas (20 cents) y suene 4 veces por encima del ruido de fondo, que mide todo el rato;
  - la aguja promedia las 7 últimas lecturas quitando las extremas.
  En el banco, a volumen de micrófono de móvil y con ruido: una cuerda sintética de 6 s se sigue de 3,5 a 3,7 s (antes, 2,6 s); con las 12 grabaciones reales, la primera lectura llega en 165 ms como mucho y, ya asentada la cuerda, ninguna se va más de 3,4 cents. En una medición suelta con las grabaciones enteras de la app (3 s; no está en el banco), cada cuerda se sigue entre 1,5 y 3 veces más tiempo.
- **A-03** · Cuando la nota deja de oírse, **lo último medido se queda 2,5 s a la vista**, atenuado y con el rótulo «Última lectura», para que dé tiempo a mirar y girar la clavija. Luego la aguja vuelve a reposo.
- **A-02** · El afinador **abre en Micrófono** donde se puede usar (en la web con `https`), sin escuchar hasta que pulsas «Activar el micrófono». Donde no se puede (el archivo con doble clic), abre en De oído. Si eliges tú un modo, se recuerda.
- **A-02-CA** · Con el trozo más largo, el detector sigue dentro de su criterio: ±1,84 cents y 195 ms.

### Añadido
- **G-13** (nuevo) · **La pantalla no se apaga** mientras suena el metrónomo o escucha el afinador (Screen Wake Lock). Al parar, el móvil vuelve a bloquearse como siempre. Donde el navegador no lo permite, o el sistema lo niega, todo funciona igual y el metrónomo lo avisa. Si el micrófono se apaga al ocultarse la app, el afinador lo dice al volver.

### Auditorías ligeras (AR-15 y AT-14)
Sin críticos ni altos; una ronda. Corregido, entre otros: una octava clara ya no se pliega a la cuerda anterior (en Drop D, la 4ª releva a la 6ª); un instante de silencio total no deja en cero el ruido de fondo; elegir cuerda con una nota sonando repinta la lectura en vez de perderla; el aviso del metrónomo sale también si el sistema niega la pantalla encendida; «Restablecer» apaga el micrófono y vuelve a «Auto».

### Pruebas
- Banco: 178 de 178. Nuevas: la nota que se apaga, el ruido solo, el giro de clavija, el relevo de cuerda (también a la octava) y las 12 grabaciones reales con ruido (`tests/tono.test.js`); el modo por defecto y su recuerdo, la lectura sostenida y la pantalla encendida (`tests/banco.test.js`).
- Chromium, con una grabación real como micrófono: «La2 · −11 cents · ▲ Sube un poco», en vertical y horizontal.

---

## [0.6.1] — 22/10/2026 · F5.8 · El metrónomo, con péndulo

Tu primer comentario de uso para F5.8 (#1): que la barra del metrónomo se mueva como la de uno de verdad.

### Cambiado
- **MT-06** (nuevo) · La barra del tempo es un **péndulo**. Mientras suena, oscila sobre su pie y llega a un extremo en cada pulso, alternando izquierda y derecha, hasta 30° a cada lado; entre dos pulsos pasa por el centro. Se mueve como un péndulo de verdad: rápido en el centro y lento al llegar a los extremos.
- **La pesa arriba va más lenta**, como en un metrónomo mecánico (tu decisión del 22/10). Antes, arriba era más rápido. Las flechas del teclado no cambian: ↑ sigue subiendo el tempo, como en cualquier deslizador.
- El ángulo sale del **reloj de audio**, el mismo que programa los golpes: el péndulo va con el sonido aunque el navegador vaya a tirones. Las subdivisiones no lo mueven, solo los pulsos.
- Se queda **recto** parado, mientras lo arrastras (para ver dónde dejas la pesa) y con «reducir movimiento» activado en el sistema (G-05).
- **Nunca se sale de la pantalla:** si no cabe, se abre menos. Con el iPhone en horizontal, unos 13°; para dejarle sitio, la columna de la barra es más ancha en esa disposición. Si giras el móvil con el metrónomo sonando en otra área, al volver se abre lo que cabe.
- **Tocar la pesa donde la ves**, aunque esté inclinada, no cambia el tempo: solo arrastrarla.
- **El dibujo de la barra:** ya no tiene el relleno ámbar (con la pesa arriba = lento, ya no indicaba «más»); la varilla es gris y lleva un pie ámbar abajo, sobre el que gira.

### Comprobado
- Banco: 168 de 168. Seis pruebas nuevas (también contra el autónomo), que fallan con la versión anterior.
- Chromium: ±30° en el iPhone en vertical y en el ordenador, ±12,7° en horizontal (también al volver tras girar en otra área), nunca fuera de la pantalla y sin errores; quieto con «reducir movimiento». Disposición: el metrónomo cabe entero en las ocho pantallas; accesibilidad, todo correcto.

### Auditorías ligeras (AR-14 y AT-13)
- Sin críticos; una sola ronda. Corregidos los dos altos: tocar la pesa inclinada cambiaba el tempo hasta 30 ppm, y girar el móvil en otra área dejaba el péndulo demasiado abierto al volver. También: sin saltos al cambiar mucho el tempo en marcha, cambiar de compás no le hace perder pulsos, menos trabajo en cada fotograma y el arrastre no se queda enganchado.
- **Dos decisiones tuyas** (AR-14 #2 y #8): el ángulo en horizontal y la dirección de las flechas del teclado. Anotado en MT-06 lo que se mira en la Sesión 2.

### Documentos
- Requisitos v1.26 (110: MT-06 nuevo; MT-01 y G-10 anotados), matriz v1.24, interfaz v1.14 y roadmap v3.24 (F5.8 en curso, con la tabla de tus comentarios).

---

## [0.6.0] — 22/10/2026 · F6.1 · El archivo autónomo, probado como la app

La app se ve y se comporta igual que en la 0.5.7. Lo que cambia es cómo se construye y se comprueba el archivo autónomo (`dist/trasteando.html`), el que se abre con doble clic.

### Añadido
- **G-08** · El banco de pruebas se pasa **dos veces**: contra la app de varios archivos (`index.html` con `css/` y `js/`) y contra el archivo autónomo (`tests/autonomo.test.js`). En la segunda pasada, cada prueba lleva delante «[autónomo]». Hasta ahora el banco solo comprobaba que el autónomo era una copia exacta; ahora comprueba también que esa copia funciona. Se repiten los dos archivos que arrancan la app (`banco.test.js` y `escalas.test.js`); las pruebas que leen archivos del repositorio o comparan las dos formas, y las del detector de tono, que no usan la página, se pasan una sola vez. Una prueba vigila que ningún archivo de pruebas nuevo que arranque la app se quede fuera de la segunda pasada. En total, 156 pruebas.
- **G-07, G-08** · Una prueba propia del autónomo: la app lee de dentro de la página sus 17 grabaciones, exactamente las generadas (mismas huellas sha256), y no intenta descargar ninguna.
- Cada módulo incrustado en el autónomo termina con su nombre (`//# sourceURL=js/…`), un estándar de las herramientas de desarrollo. Un error dentro del autónomo dice ahora «js/03-audio.js, línea 100», y no una línea perdida de `trasteando.html`. El código va pegado a `<script>`: un salto de línea ahí contaría como primera línea del módulo y el navegador daría cada línea con una de más (AT-12 #2).
- El ensamblador se niega a construir el autónomo si un módulo contiene `</script` o `<!--` (o una hoja de estilo `</style`): como archivo suelto funciona, pero incrustado rompería la página. Lo dice con el archivo y la línea, y no toca el autónomo que ya había. El banco tiene una prueba para ello.

### Corregido (en el banco, no en la app)
- Con una página de un solo archivo, el banco solo ejecutaba su **primer** bloque de código, herencia de antes de la 0.4.0. Con el autónomo actual, que trae 16, la app ni arrancaba en el banco. Ahora ejecuta los 16, uno a uno y con su nombre, como hace el navegador.
- El DOM simulado del banco conserva los bloques de audio incrustado, para que la app los encuentre como en el navegador.

### Comprobado en Chromium
- El autónomo, abierto desde el disco y sin conexión: abre en 0,15 s, sonido listo en 0,19 s, ningún intento de conexión ni error.
- `comprobar-autonomo.js` comprueba además que un error dentro del autónomo dice el módulo y la línea exactos (`js/03-audio.js:100`).

### Auditorías ligeras (AR-13 y AT-12)
- Sin críticos ni altos; una sola ronda. Corregidos: las escalas, también contra el autónomo (AR-13 #1, AT-12 #1); la línea de más en el navegador (AT-12 #2); `<!--` (AT-12 #3); `test.skip` y `.todo` en las dos pasadas (AT-12 #4); la prueba del ensamblador (AT-12 #5); la evidencia de G-08 (AR-13 #5).
- Anotados en G-08: se reconfirma contra la web publicada en F7.1 (AR-13 #2), y en la Sesión 2 se abre el autónomo con doble clic en Windows, en modo avión (AR-13 #3).
