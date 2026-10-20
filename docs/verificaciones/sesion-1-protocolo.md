# Sesión 1 — Protocolo de pruebas

**App:** `0.3.2` · **Web de pruebas:** https://pdigue.github.io/guitarra/ · **Archivo autónomo:** https://github.com/pdigue/guitarra/blob/pruebas/dist/trasteando.html

Cada prueba dice qué haces y el resultado esperado, que es su criterio de cumplimiento. Los resultados se marcan en la página interactiva de la Sesión 1 y se pasan después a `V-08`.

**Necesitas:** el iPhone, tu ordenador con Windows (Chrome o Edge), la guitarra afinada y una app de afinador cualquiera. Unos 75 minutos.

## A. Ordenador · la web · 25 min

Windows, en Chrome o Edge, con conexión. Repasa la lista de F1.1 y lo nuevo de F3.

| # | Prueba | Qué haces | Resultado esperado | Requisitos |
|---|---|---|---|---|
| A01 | Abrir la app | Abre https://pdigue.github.io/guitarra/ y pulsa «Empezar». | Se ve el mástil en Libre. No aparece el aviso de «guitarra sintetizada». | G-01, L-01 |
| A02 | Versión | Abre Ajustes (⚙) y baja hasta el final. | Pone «Trasteando 0.3.2». | G-10 |
| A03 | Respuesta inmediata | Pulsa varias notas del mástil, a distintos ritmos. | Cada nota suena en el momento de pulsar, sin retraso que notes. | S-03 |
| A04 | Afinación del agudo | Guitarra clásica. 1ª cuerda, trastes 7, 8 y 12. Compáralas con tu guitarra afinada. | Suenan Si, Do y Mi, iguales que en tu guitarra. El traste 8 no salta medio tono. | S-01, S-08 |
| A05 | Pentagrama arriba del todo | 1ª cuerda: pulsa el traste 12 y luego el 24 (desplaza el mástil hasta él). | Las dos notas salen en el pentagrama; la del 24 con la marca «8va». | P-01 |
| A06 | Cambiar la nomenclatura | Pulsa una nota, espera 3 segundos y pulsa el chip «Do Re Mi». | Pasa a «C D E» y el nombre grande de la nota cambia (por ejemplo, Mi → E). Vuelve a pulsarlo para dejarlo en Do Re Mi. | N-01, N-03, N-04 |
| A07 | El zoom conserva la vista | Desplaza el mástil hasta el traste 15 y pulsa «−» y «+». | La vista sigue centrada en el traste 15. | V-04, V-06 |
| A08 | Más trastes con «+» | Estrecha la ventana a media pantalla y pulsa «+» hasta que no deje más. | «+» enseña más trastes y «−» menos. La etiqueta dice los trastes que caben de verdad, y al llegar al tope «+» se apaga. | V-04, V-05, V-07 |
| A09 | Fallar en Adivinar | Ve a Adivinar, escucha el reto y pulsa a propósito una posición equivocada. | Sale el fallo en rojo, se iluminan en verde todas las posiciones correctas y suena la nota buscada. | J-09, J-10 |
| A10 | Ver todas las notas | Ajustes → «Ver todas las notas». Mira Libre y luego Adivinar. | En Libre se leen todos los nombres, con contorno de color. En Adivinar no se ve ninguno. Apágalo al terminar. | L-02, J-12 |
| A11 | Numeración «Guía» | Ajustes → Números de traste → «Guía». | Solo se ven los números 3, 5, 7, 9, 12, 15, 17, 19, 21 y 24. | D-04, V-09 |
| A12 | El mástil se va en el Afinador | Pulsa la pestaña Afinador y luego vuelve a Libre. | En el Afinador no hay mástil; al volver a Libre, el mástil está como lo dejaste. | G-02 |
| A13 | La 6ª cuerda al mínimo | En el Afinador, pulsa «−» en la 6ª cuerda hasta que no baje más. | La nota del pentagrama sale con la marca «8vb». La afinación pasa a «Personalizada». | A-08, P-04 |
| A14 | Restablecer desde la acústica | Ajustes → Guitarra: Acústica. Pulsa una nota. Luego «Restablecer todos los ajustes» y acepta. | Vuelve a sonar la clásica, Ajustes dice «Clásica» y la afinación vuelve a estándar. | S-02, C-05 |
| A15 | Lo guardado sobrevive a recargar | Acierta un par de retos en Adivinar (récord 1 o más). Pon los números en «Guía». Recarga la página (F5). | El récord y la numeración siguen como los dejaste. | J-08, C-05 |
| A16 | Sin errores en la consola | Pulsa F12 y abre la pestaña «Consola». Recorre Libre, Adivinar, Afinador y Ajustes. | No aparece ningún error en rojo. Cierra F12 al terminar. | General |
| A17 | Botón «atrás» | Ve a Adivinar y luego al Afinador. Pulsa el botón «atrás» del ratón (o Alt + ←) dos veces. Después abre Ajustes y pulsa «atrás» otra vez. | Vuelve a Adivinar y luego a Libre, sin salir de la app. Con Ajustes abierto, «atrás» lo cierra y te deja en la misma área. | C-07 |
| A18 | Solo con teclado | Recarga. Pulsa Tab hasta llegar al mástil, muévete con las flechas y pulsa Intro. | Cada cosa que recibe el foco se marca. En el mástil, un recuadro discontinuo se mueve con las flechas, e Intro toca la nota. Con Tab sales del mástil de una vez. | G-05 |
| A19 | Pestañas arriba | Con la ventana grande, mira dónde están las áreas y abre Ajustes. | Libre, Adivinar, Afinador y Escalas están arriba, como pestañas. Ajustes se abre como panel a la derecha. | C-04, C-01 |

## B. Ordenador · el archivo sin internet · 10 min

F2.5: el archivo autónomo con doble clic y sin conexión.

| # | Prueba | Qué haces | Resultado esperado | Requisitos |
|---|---|---|---|---|
| B01 | Descargar el archivo | Abre https://github.com/pdigue/guitarra/blob/pruebas/dist/trasteando.html y pulsa el botón de descarga (flecha hacia abajo, «Download raw file»). | Queda trasteando.html en tu carpeta de Descargas (unos 1,5 MB). | G-08 |
| B02 | Abrir sin internet | Desconecta internet (WiFi apagado o modo avión). Haz doble clic en trasteando.html y cuenta los segundos. | Abre en 3 segundos o menos. Tras «Empezar» suena la guitarra real, no un sonido de sintetizador. | G-07, PL-01 |
| B03 | Todo funciona sin conexión | Sin internet: prueba Libre, un par de retos de Adivinar y el Afinador de oído. | Todo funciona y suena igual que en la web. | G-07, PL-01 |
| B04 | Nota larga, archivo frente a web | En el Afinador, pulsa la 6ª cuerda en el archivo. Reconecta internet y haz lo mismo en la web. | Suenan igual de largas y se apagan suave, sin un corte brusco. | G-07, S-01 |

## C. iPhone · Safari · 15 min

La web en tu iPhone, en vertical y en horizontal.

| # | Prueba | Qué haces | Resultado esperado | Requisitos |
|---|---|---|---|---|
| C01 | Abrir en Safari | En el iPhone, abre https://pdigue.github.io/guitarra/ en Safari y toca «Empezar». | Suena la guitarra. Con el interruptor de silencio puesto también suena. | PL-03, S-01 |
| C02 | Aviso para girar | En vertical, en Libre, mira encima del mástil. Cierra el aviso con ✕ y recarga la página. | Aparece «Gira el móvil para ver más trastes». Cerrado, no vuelve al recargar. | V-01 |
| C03 | Horizontal | Gira el iPhone. Toca notas en todas las cuerdas y por todo el mástil. | Pestañas a la izquierda, mástil a todo el alto, controles a la derecha. Aciertas cada cuerda sin tocar la de al lado. Nada queda tapado por la muesca ni por los bordes. | V-01, PL-03 |
| C04 | Zoom en el iPhone | En horizontal, pulsa «+» varias veces y luego «−». | «+» enseña más trastes (hasta unos 15) y «−» menos. Con muchos trastes se aciertan con algo de cuidado. | V-04 |
| C05 | Ajustes con el dedo | En vertical, abre Ajustes. Toca el texto de «Señalar posiciones iguales» (no el interruptor). Luego desliza el asa de arriba hacia abajo. | Tocar el texto cambia el interruptor. Al deslizar el asa, Ajustes se cierra. | G-05, C-01 |
| C06 | Los colores de las notas | Activa «Ver todas las notas» y mira el mástil en Libre. | Distingues bien las 7 notas naturales, y cada sostenido se ve como su natural, pero más claro. Apágalo al terminar. | G-05 |
| C07 | El primer reto tras bloquear | En Adivinar, bloquea el iPhone 10 segundos, desbloquéalo y pulsa ▶. | Suena el reto. No se queda mudo. | PL-04, J-01 |
| C08 | Muchas notas deprisa | En Libre, toca 10 o más notas seguidas en 2 o 3 segundos. | Suenan todas, sin cortes raros ni bloqueos. | S-01 |
| C09 | El archivo en el iPhone | En Safari, abre https://github.com/pdigue/guitarra/blob/pruebas/dist/trasteando.html, descárgalo y ábrelo desde la app Archivos. | Lo esperado es que NO funcione: se ve en blanco o como texto. Confirmarlo cierra la duda de F2.5; en el iPhone se usa la web o la app instalada. | PL-03, G-07 |

## D. iPhone · app instalada · 5 min

La app en la pantalla de inicio.

| # | Prueba | Qué haces | Resultado esperado | Requisitos |
|---|---|---|---|---|
| D01 | Instalar | Abre https://pdigue.github.io/guitarra/ en Safari (no desde dentro de la app de Claude: cópialo y pégalo en Safari). Botón Compartir (cuadrado con flecha hacia arriba, abajo; si no está, toca «…») → baja hasta «Añadir a pantalla de inicio» → «Añadir». | Aparece Trasteando en la pantalla de inicio. El icono puede verse genérico: el propio llega en F6.3. | G-04, PL-03 |
| D02 | Abrir la app instalada | Ábrela desde el icono y toca «Empezar». | Se abre sin las barras de Safari, a pantalla completa, y suena. | G-04, PL-03 |
| D03 | Horizontal en la app instalada | Gira el iPhone dentro de la app instalada. | Las cuerdas son aún más altas que en Safari. Nada queda tapado por la muesca. | V-01 |

## E. Con la guitarra · 20 min

F3.3: uso real con la guitarra delante, y afinación con un afinador externo.

| # | Prueba | Qué haces | Resultado esperado | Requisitos |
|---|---|---|---|---|
| E01 | Afinación con afinador externo | Afinador en La = 440 Hz, en el iPhone, cerca del altavoz del ordenador y sin ruido. Trasteando en el ordenador. Lee el valor en el primer segundo, cuando la nota está estable.<br>Clásica:<br>1. Afinador de Trasteando → 6ª cuerda (Mi2): 82,41 Hz<br>2. Afinador → 1ª cuerda (Mi4): 329,63 Hz<br>3. Libre → 1ª cuerda, traste 24 (Mi6): 1318,51 Hz<br>Ajustes → Guitarra → Acústica, y repite:<br>4. 6ª cuerda (Mi2): 82,41 Hz<br>5. 1ª cuerda (Mi4): 329,63 Hz<br>6. 1ª cuerda, traste 24 (Mi6): 1318,51 Hz | Las seis lecturas caen en su margen (±5 cents):<br>Mi2: 82,17 – 82,65 Hz<br>Mi4: 328,68 – 330,58 Hz<br>Mi6: 1314,71 – 1322,32 Hz<br>Apunta en la nota los seis valores. | S-08 |
| E02 | Escucha del agudo de la acústica | Acústica, 1ª cuerda, trastes 15 a 24, uno a uno. Si quieres medir, el valor de cada uno y su rango válido (±5 cents):<br>15 Sol5: 783,99 Hz (781,73 – 786,26)<br>16 Sol♯5: 830,61 Hz (828,21 – 833,01)<br>17 La5: 880,00 Hz (877,46 – 882,55)<br>18 La♯5: 932,33 Hz (929,64 – 935,02)<br>19 Si5: 987,77 Hz (984,92 – 990,62)<br>20 Do6: 1046,50 Hz (1043,48 – 1049,53)<br>21 Do♯6: 1108,73 Hz (1105,53 – 1111,94)<br>22 Re6: 1174,66 Hz (1171,27 – 1178,06)<br>23 Re♯6: 1244,51 Hz (1240,92 – 1248,11)<br>24 Mi6: 1318,51 Hz (1314,71 – 1322,32) | Suenan a guitarra. Arriba algo más artificial: es la limitación aceptada el 20/10. Anota si alguna te parece inaceptable. Si mides, cada nota dentro de su rango; si alguna se sale, apunta el valor. | S-01, S-08 |
| E03 | Libre con la guitarra (5 min) | Toca una nota en tu guitarra y búscala en la app, y al revés. | La nota de la app coincide con la de tu guitarra. Anota lo incómodo. | F3.3: D-05, D-06, L-03 |
| E04 | Adivinar con la guitarra (5 min) | Haz unos 10 retos. Prueba las pistas Nombre y Cuerda. | Los retos y las pistas funcionan, y la racha y el récord cuentan bien. Anota lo incómodo. | F3.3: J-01…J-09 |
| E05 | Afinar de oído (5 min) | Desafina un poco una cuerda de tu guitarra y afínala escuchando la app. Para comprobarla con tu afinador, las cuerdas al aire son:<br>6ª Mi2: 82,41 Hz · 5ª La2: 110,00<br>4ª Re3: 146,83 · 3ª Sol3: 196,00<br>2ª Si3: 246,94 · 1ª Mi4: 329,63 | Consigues afinarla de oído con la nota de referencia. | F3.3: A-01, A-06 |
| E06 | Lo que te ha resultado incómodo | Escribe en la nota todo lo incómodo, confuso o feo que hayas visto, aunque sea pequeño. | Una lista, aunque sea corta. Con ella se corrige antes de empezar F4. | F3.3 |

