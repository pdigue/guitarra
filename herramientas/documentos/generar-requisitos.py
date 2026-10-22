# Genera docs/requisitos.md v1.25 y herramientas/documentos/requisitos.json (lo
# que lee generar-matriz.py) desde una única fuente: este archivo. Así el
# documento y la matriz no pueden contarse cosas distintas.
#
# IMPORTANTE: requisitos.md NO se edita a mano. Se cambia aquí y se regenera:
#   python3 herramientas/documentos/generar-requisitos.py docs/requisitos.md herramientas/documentos/requisitos.json
#   python3 herramientas/documentos/generar-matriz.py herramientas/documentos/requisitos.json docs/matriz-cumplimiento.xlsx docs/matriz-cumplimiento.md
# Necesita Python 3; generar-matriz.py, además, openpyxl (pip install openpyxl).
#
# Banderas de cada versión: flag='nuevo' o flag='mod' marcan los requisitos que
# cambian en la versión en curso. Al empezar una versión nueva, se quitan las
# del anterior (quedan descritas en su «Detalle de la versión»).
import json, sys, os

OUT_MD, OUT_JSON = sys.argv[1], sys.argv[2]

# impl: si | parcial | no      valid: si | no      flag: '' | nuevo | mod
R = []
def req(cat, id, text, prio, etapa, impl, desde='', notas='', valid='no', flag=''):
    R.append(dict(cat=cat, id=id, text=text, prio=prio, etapa=etapa, impl=impl,
                  valid=valid, desde=desde, notas=notas, flag=flag))

# ---------- Generales ----------
C='G'
req(C,'G-01','La aplicación se llama *Trasteando*. El nombre aparece en la pantalla de entrada, el título de la pestaña y el manifiesto PWA.','Alta','F1.1','si','0.1.0','Naming cerrado: se descarta *Trasting*. **Validado en la Sesión 1** (20/10, informe `V-08`): A01. **Desde la 0.5.2**, el nombre es más nítido y en horizontal, donde no hay cabecera, va arriba del panel (tu comentario del 21/10).',valid='si')
req(C,'G-02','La app se organiza en áreas accesibles desde una navegación principal: Libre, Adivinar, Afinador, Escalas, Acordes y Metrónomo.','Alta','F1.1','si','0.1.0','Escalas, habilitada desde la 0.5.0. Metrónomo, área propia desde la 0.5.4, y Acordes desde la 0.5.5 (tu decisión del 21/10). **Validado en la Sesión 1** (20/10, informe `V-08`): A12. Pendiente (CP-5): un registro de áreas, para que añadir una no obligue a tocar cuatro o cinco sitios (AT-11 #4).',valid='si')
req(C,'G-03','La app funciona sin conexión una vez cargada **desde la web**.','Media','F6.2 · F7.2','no','','Service Worker en F6.2, decidido el 20/10: en la Sesión 1 el iPhone no prueba la app sin conexión. Depende de S-07. Se valida en dos pasos: en `localhost` en F6.2 y desde la web publicada en F7.2 (CP-1). En modo archivo (G-07) la autonomía se consigue de otra forma: el audio va dentro del archivo.')
req(C,'G-04','La app es instalable como PWA (icono en la pantalla de inicio, pantalla completa).','Alta','F6.3 · F7.2','parcial','0.1.0','Manifiesto incrustado como `data:` URL. Falta un archivo de manifiesto propio con iconos PNG (F6.3) y verificarla instalada desde la web publicada (F7.2): instalar solo es posible desde `https`.')
req(C,'G-05','La interfaz cumple unos mínimos de accesibilidad: foco de teclado visible, respeto a `prefers-reduced-motion`, contraste suficiente y etiquetas accesibles en los controles solo-icono.','Media','F3.4','si','0.1.1','**Hecho en la 0.3.1** (F3.4, V-07). Con el teclado se llega a todo y el foco se ve; el mástil es una cuadrícula (`role="grid"`) que se recorre con las flechas y se toca con Intro; en Adivinar ninguna casilla anuncia su nota (J-12). Todos los textos a 4,5:1 o más, medidos en Chromium sobre su fondo real (con la 0.3.0 había 205 por debajo). Con «reducir movimiento» nada se anima. Con el dedo, controles y casillas de 40 × 40 px, también en Ajustes (salvo si pides más trastes con «+», que pueden estrecharse hasta 28 px); la fila entera cambia su interruptor, y el asa cierra Ajustes deslizando. **Paleta por nota** con tu criterio del 20/10: 7 naturales bien separadas, también con daltonismo, y sostenidos derivados (`herramientas/paleta.py`). **Excepción** (AR-05): en vertical, por debajo de 660 px de alto, la navegación manda sobre los 40 px por cuerda. **Validado en la Sesión 1** (20/10, informe `V-08`): A18, C05 y C06.',valid='si')
req(C,'G-06','El proyecto documenta sus dependencias externas y la licencia de cada recurso de terceros que distribuye, y la app muestra los créditos.','Media','F2.1 · F6.4','parcial','','`CREDITOS.md` (F2.1): origen, licencia, huella `sha256` y texto de atribución de cada muestra de audio, y Tone.js (MIT). Falta mostrar los créditos dentro de la app y elegir la licencia del propio código (F6.4).')
req(C,'G-07','**Modo archivo autónomo** en Windows y Android: la app funciona completa —salvo el afinador por micrófono— abriendo el archivo directamente (`file://`), sin servidor y sin conexión. En iPhone, donde no se pueden abrir páginas desde Archivos, la autonomía llega por G-03.','Alta','F2.3 · F2.5','si','0.2.1','`dist/trasteando.html`: la app con sus 17 grabaciones dentro (1,46 MB). Límites revisados en CP-2: el audio no pasa de 1,45 MB, y bajar su calidad exige tu escucha; el archivo entero no pasa de 2 MB, para dejar sitio al código de F3 a F6. Lo que cuenta para ti es que abra en ≤ 3 s en Windows: en Chromium tarda 0,3 s, y en tu PC se mide en la Sesión 1 (F2.5). Redacción limitada a Windows y Android tras AR-03. **Validado en la Sesión 1** (20/10, informe `V-08`): B02, B03, B04 y C09.',valid='si')
req(C,'G-08','El proyecto conserva **dos formas de distribución** equivalentes: el archivo autónomo (para llevárselo) y la web publicada (para instalarla como PWA).','Media','F4.1 · F6.1','si','0.1.0','Desde la 0.2.1 hay dos formas reales: `index.html` para servir (Live Server y web) y `dist/trasteando.html`, generado a partir de él con `herramientas/generar-autonomo.py`. **Desde la 0.4.0** (F4.1), la app vive en varios archivos (`css/` y `js/`, uno por tema), y el generador los une con `herramientas/ensamblar.js`; el banco comprueba que el resultado es exactamente la app más su audio. **Hecho en la 0.6.0** (F6.1) y validado por el banco: las pruebas que arrancan la app (`banco.test.js` y `escalas.test.js`) se pasan dos veces, contra la app de varios archivos (la que sirve la web) y contra el autónomo (`tests/autonomo.test.js`); solo van una vez las que leen el repositorio o comparan las dos formas, y las del detector de tono, que no usan la página. El autónomo lee de dentro sus 17 grabaciones, las generadas, sin descargar nada; cada módulo incrustado lleva su nombre (`//# sourceURL`), y un error dice el módulo y la línea exactos; el ensamblador se niega a incrustar uno que rompería la página. En Chromium, abierto desde el disco y sin conexión, abre en 0,15 s sin ningún intento de conexión. Instalarla como PWA es G-04 (F6.3). Pendiente (AR-13): se reconfirma contra la web publicada en F7.1, como G-03 (#2), y en la Sesión 2 se abre el autónomo con doble clic en Windows, en modo avión (#3).',valid='si',flag='mod')
req(C,'G-09','La app podrá distribuirse por **tiendas oficiales** —Google Play, Microsoft Store y, si compensa, App Store— empaquetando la PWA publicada.','Media','F7.4','no','','Decisión de producto en F7.4. Exige S-07 con licencia limpia, G-11 y la web publicada (X-02). Cuentas, costes y archivos necesarios: roadmap, *Inventario de lanzamiento*.')
req(C,'G-10','**Control de versiones de la app:** cada versión tiene número propio con la pauta `0.‹fase›.‹corrección›` —`1.0.0` en el lanzamiento—, se registra en `CHANGELOG.md` y se muestra en Ajustes.','Alta','F1.3','si','0.1.2','Vincula cada versión con su fase del roadmap. Cada fase cerrada se marca además con una etiqueta de Git (F1.4). **Validado el 21/10:** la Sesión 1 (A02) vio la versión en Ajustes, CHANGELOG tiene cada versión y existen las etiquetas `v0.1.5`, `v0.2.3` y `v0.3.3` de los cierres de F1, F2 y F3 (las creaste tú en GitHub).',valid='si')
req(C,'G-11','**Privacidad:** la app no recoge ni envía datos personales; el sonido del micrófono se analiza solo en el dispositivo. Una política de privacidad pública lo declara.','Alta','F6.4','no','','Las tiendas exigen política de privacidad, y el micrófono la hace necesaria también por transparencia. Hoy la app ya no envía nada: solo guarda ajustes en el propio navegador.')
req(C,'G-12','**Idioma de la interfaz:** la app está en español y en inglés, y se cambia en Ajustes. La primera vez sigue el idioma del navegador; la elección se guarda.','Media','F4.5','si','0.4.2','Tu petición del 21/10. **Hecho en la 0.4.2:** Ajustes › «Idioma · Language» (Español / English), cada idioma nombrado en su lengua. Todos los textos tienen clave y versión en las dos lenguas (el banco lo comprueba); los nombres de las notas siguen su propio ajuste (Do Re Mi o C D E), aunque quien estrena la app en inglés empieza con C D E. Restablecer no cambia el idioma. Falta que veas la app en inglés y digas si algo suena raro.')

# ---------- Plataformas ----------
C='PL'
req(C,'PL-01','**Windows:** la app funciona en Chrome, Edge y Firefox actuales —en modo archivo, local y web— e instalada como PWA desde Edge o Chrome.','Alta','F2.5 · F7.2','parcial','0.1.0','Es la plataforma de desarrollo y la mejor cubierta. Tienda: Microsoft Store (F7.4).')
req(C,'PL-02','**Android:** la app funciona en Chrome —en web e instalada como PWA— y, si es viable, en modo archivo.','Alta','F2.5 · F7.2','parcial','0.1.0','Modo archivo: abrir el HTML descargado con Chrome; a verificar en F2.5. Tienda: Google Play empaquetando la PWA (F7.4). **Sin Android de pruebas por ahora** (decisión del 15/10): mantiene la prioridad Alta, se valida con el simulador de dispositivos de Chrome como evidencia parcial y en un Android real en cuanto haya uno, como tarde en F7.2.')
req(C,'PL-03','**iPhone y iPad:** la app funciona en Safari, en web e instalada con «Añadir a pantalla de inicio».','Alta','F2.5 · F7.2','parcial','0.1.0','Modo archivo probablemente inviable: la vista previa de la app Archivos no ejecuta JavaScript (a confirmar en F2.5). Alternativas: el navegador integrado de una app de terceros o un despliegue de pruebas. Tienda: App Store exige un Mac con Xcode y la cuenta de desarrollador de Apple (F7.4). **Móvil de referencia del proyecto desde el 14/10.** Hasta publicar, se prueba con la app servida desde el ordenador por WiFi (Live Server): funciona todo salvo el micrófono y la instalación.')
req(C,'PL-04','**Adaptabilidad entre sistemas:** la app solo usa estándares web; detecta cada capacidad en lugar del sistema, y toda capacidad que no esté en Windows, Android e iPhone tiene alternativa, de modo que la app sigue funcionando donde falta.','Alta','F2.2 · F3.2 · F7.2','parcial','0.1.4','Decisión del 15/10. Inventario de capacidades, comportamiento por sistema y alternativas en `docs/compatibilidad.md`, que se revisa en cada etapa que añade una capacidad. Hoy ya se cumple para la vibración (se omite donde no existe) y para el audio interrumpido de iOS (0.1.4). En F3.2 (0.3.0) se añaden el tipo de puntero, el historial, `grid` y `display: contents`, y `position: sticky`, cada uno con su alternativa (`compatibilidad.md` v1.2), y el banco arranca la app sin ellos. **Desde la 0.3.3:** `visibilitychange` y `suspend()`/`close()` del audio, con su alternativa en `compatibilidad.md` v1.4. **Desde la 0.4.0:** hilo aparte (`Worker`), con el detector en el principal si falta, y micrófono (`getUserMedia`), con el motivo y De oído si falta (`compatibilidad.md` v1.5).')

# ---------- Nomenclatura ----------
C='N'
req(C,'N-01','Alternancia entre nomenclatura latina (Do, Re, Mi…) y anglosajona (C, D, E…).','Alta','F1.1','si','0.1.0 **Validado en la Sesión 1** (20/10, informe `V-08`): A06.',valid='si')
req(C,'N-02','El cambio de nomenclatura está en el menú de configuración.','Alta','F1.1','si','0.1.0')
req(C,'N-03','El cambio de nomenclatura está **además** en la interfaz principal, sin abrir el menú.','Alta','F1.1','si','0.1.0','Chip en la barra de acceso rápido. **Validado en la Sesión 1** (20/10, informe `V-08`): A06.',valid='si')
req(C,'N-04','La nomenclatura se aplica de forma consistente en mástil, juego, afinador y pentagrama.','Alta','F1.1','si','0.1.0','Verificar de nuevo al añadir Escalas (F5). **Validado en la Sesión 1** (20/10, informe `V-08`): A06. **Desde la 0.5.0**, también Escalas: tónicas, nombres escritos e intervalos siguen la nomenclatura.',valid='si')
req(C,'N-05','La nomenclatura persiste entre sesiones.','Media','F1.1','si','0.1.0','`localStorage`.')
req(C,'N-06','Cada nota alterada (las cinco teclas negras) se escribe con sostenido o con bemol según elijas en Ajustes, igual en toda la app; dentro de una escala manda la escala.','Media','F5.5','si','0.5.2','Tu comentario del 21/10. **Hecho en la 0.5.2:** Ajustes › Notación › Notas alteradas (Do♯ o Re♭, Re♯ o Mi♭, Fa♯ o Sol♭, Sol♯ o La♭, La♯ o Si♭); se usan los signos ♯ y ♭, también en el pentagrama. Validado por el banco. **Desde la 0.5.3**, también el pentagrama del Afinador; y en Escalas, el lector grande y el lector de pantalla escriben como la escala (AT-09). Pendiente (CP-5): quitar `LATIN` y los campos `anglo` y `latin` de `noteInfo()`, que ya no se usan y se saltarían N-06 (AT-11 #10).',valid='si')

# ---------- Diapasón ----------
C='D'
req(C,'D-01','Diagrama del mástil de 6 cuerdas.','Alta','F1.1','si','0.1.0')
req(C,'D-02','Cada cuerda muestra a la izquierda su nota al aire, derivada de la afinación activa.','Alta','F1.1','si','0.1.0','Se actualiza sola al cambiar de afinación (A-10).')
req(C,'D-03','Cada traste muestra su número alineado exactamente sobre la franja donde se pulsa.','Alta','F1.1','si','0.1.0','La fila de números comparte las mismas variables de ancho (`--label-w`, `--nut-w`, `--fret-w`) que las celdas.')
req(C,'D-04','La numeración de trastes tiene **tres modos**: todos, guía (solo los trastes con marca) y ninguno.','Media','F1.3','si','0.1.2','Sustituye al interruptor de la 0.1.1; quien lo tuviera apagado pasa automáticamente a «ninguno». **Validado en la Sesión 1** (20/10, informe `V-08`): A11.',valid='si')
req(C,'D-05','Al pulsar una posición suena esa nota.','Alta','F1.1','si','0.1.0 **Validado en la Sesión 1** (20/10, informe `V-08`): A03 y E03.',valid='si')
req(C,'D-06','Al pulsar una posición aparece el nombre de la nota en la nomenclatura activa.','Alta','F1.1','si','0.1.0 **Validado en la Sesión 1** (20/10, informe `V-08`): E03.',valid='si')
req(C,'D-07','Marcadores de posición en los trastes habituales (3, 5, 7, 9, 12, 15, 17, 19, 21, 24).','Media','F1.1','si','0.1.0')

# ---------- Sonido ----------
C='S'
req(C,'S-01','El sonido corresponde a una guitarra real, no a un sintetizador genérico.','Alta','F1.1 · F2.2 · F2.4','si','0.1.0','Reproductor propio con las grabaciones de `samples/` desde la 0.2.0. Desde la 0.2.2 la guitarra clásica tiene también la grabación de La♯5: en afinación estándar ninguna nota se transporta más de 6 semitonos, y el traste 24 suena menos artificial. La acústica no tiene grabaciones por encima del Re5 y llega a 14: **limitación conocida, aceptada por ti el 20/10**; se comprueba de oído en la Sesión 1 (trastes 15 a 24 de la 1ª cuerda). Escuchada por ti en el iPhone con la 0.2.0 el 19/10 (V-05). La 0.1.3 corrigió el registro agudo de nylon, que sonaba medio tono alto. **Sesión 1 (20/10, informe `V-08`):** suena bien en el PC y en el iPhone, pero en el iPhone el sonido se quedó mudo dos veces (C08 y D03) y solo volvió cerrando la app; además seguía sonando con la pantalla bloqueada (C07). Es un fallo conocido de Safari en las apps de pantalla de inicio (WebKit 291892). **Desde la 0.3.3**, al ocultar la app se corta el sonido y se pausa el audio; al volver se reanuda, y si iOS no lo suelta se crea un audio nuevo; Ajustes enseña el estado del sonido y tiene «Reactivar sonido». Se valida cuando la Sesión 2 confirme que no vuelve a quedarse mudo.')
req(C,'S-02','El usuario elige entre guitarra clásica (nylon) y acústica (acero).','Alta','F1.1','si','0.1.0','Cambiar de timbre descarga otro set de muestras, con aviso. Desde 0.1.2, dos cambios seguidos ya no muestran el mensaje de la carga descartada. **Desde la 0.3.3** (Sesión 1, A14), elegir guitarra ya no hace sonar una nota de muestra. **Sesión 1** (20/10, informe `V-08`): lo esencial cumplió en A14; el cambio de la 0.3.3 lo pediste tú y se confirma en la Sesión 2.')
req(C,'S-03','La selección de timbre está en el menú de configuración.','Alta','F1.1','si','0.1.0 **Validado en la Sesión 1** (20/10, informe `V-08`): A14.',valid='si')
req(C,'S-04','Si los samples no cargan, la app sigue sonando por síntesis.','Media','F1.1','si','0.1.0','Karplus-Strong con filtros que imitan la caja de resonancia. Desde 0.1.1 cada nota se calcula una sola vez y se reutiliza.')
req(C,'S-05','El primer sonido requiere una interacción explícita del usuario.','Alta','F1.1','si','0.1.0','Lo impone la política de reproducción automática de los navegadores.')
req(C,'S-06','El timbre persiste entre sesiones.','Media','F1.1','si','0.1.0')
req(C,'S-07','Los samples de audio se alojan en el propio proyecto, con licencia verificada y documentada.','Alta','F2.1 · F2.3','si','0.2.3','**Opción A, decidida el 14/10.** Hecho: licencias verificadas y los 16 archivos en `samples/`, con `CREDITOS.md` (F2.1); desde la 0.2.0 la app los usa y no descarga nada de otros servidores (F2.2). Desde la 0.2.1 van también dentro del archivo autónomo (F2.3). **El 20/10 se completó la licencia del pack de nylon:** en la búsqueda de Freesound, el pack tiene 161 sonidos y el filtro de licencia «Attribution» (CC BY) devuelve los 161; dos filtros de control («Attribution 4.0» y «Creative Commons 0») devuelven 0, lo que prueba que el filtro se aplica. Tres sonidos revisados uno a uno (183078, 183083 y 183089) son «Attribution 4.0». La búsqueda la hiciste tú en tu iPhone, porque está cerrada a los agentes. **Validado por inspección:** ninguna petición de audio sale del dominio propio (banco) y `CREDITOS.md` documenta origen y licencia de los 17 archivos.',valid='si')
req(C,'S-08','Cada nota suena a menos de **5 cents** de su frecuencia, una vez corregida la desviación medida de su grabación. Cada grabación que usa la app es la nota a la que está asignada y tiene su desviación medida.','Alta','F2.1 · F2.2 · F2.4','si','0.1.3','**Reformulado el 19/10, con tu aprobación:** antes exigía ±5 cents a la grabación sin corregir; desde la 0.2.0 la app corrige cada grabación con su medida, así que lo que importa y se comprueba es la nota que suena. Origen: el `D5.mp3` de nylon sonaba en Re♯5. Validado: el banco comprueba todas las notas posibles (±0,5 cents) y la grabación en el navegador lo confirma (V-02, V-03, V-04).',valid='si')
req(C,'S-09','El timbre se parece más al de una guitarra real: grabaciones de más calidad o más notas grabadas por cuerda.','Baja','Posterior','no','','Tu comentario de la Sesión 1 (E03 y E04): suena «diferente» a tu guitarra. Exige buscar otro banco de grabaciones con licencia libre (S-07), medirlo (S-08) y que lo escuches.')

# ---------- Pentagrama ----------
C='P'
req(C,'P-01','Al pulsar una nota en el mástil, se representa en el pentagrama.','Alta','F1.1','si','0.1.0','Clave de sol octavada. Desde 0.1.1 las notas muy agudas o graves se dibujan transportadas con 8va, 15ma u 8vb, y la clave es un trazado propio que no depende de las fuentes del sistema. **Validado en la Sesión 1** (20/10, informe `V-08`): A05. **Desde la 0.5.2**, el pentagrama de una sola nota es más corto y por eso se dibuja más grande (el doble en horizontal), y la lectura de la nota tiene un alto fijo: el mástil ya no se mueve unos píxeles según la nota (tu comentario del 21/10).',valid='si')
req(C,'P-02','El pentagrama se puede mostrar u ocultar.','Alta','F1.1','si','0.1.0','En configuración y en acceso rápido.')
req(C,'P-03','El pentagrama está disponible en todos los modos de aprendizaje.','Media','F5.3','si','0.5.0','Libre y Adivinar sí. Escalas, en F5. **Desde la 0.5.0**, en Escalas el pentagrama escribe la escala entera, con sus alteraciones (♯ y ♭ según la tonalidad).')
req(C,'P-04','En el afinador, la afinación seleccionada se muestra como seis notas en un pentagrama.','Media','F1.1','si','0.1.0 **Validado en la Sesión 1** (20/10, informe `V-08`): A13.',valid='si')

# ---------- Libre ----------
C='L'
req(C,'L-01','El modo por defecto al abrir la app es el diapasón libre.','Alta','F1.1','si','0.1.0 **Validado en la Sesión 1** (20/10, informe `V-08`): A01.',valid='si')
req(C,'L-02','El usuario decide si ve el nombre de todas las notas del mástil o solo el de la que pulsa.','Alta','F1.1','si','0.1.0','Por defecto solo la pulsada, para no convertir el mástil en una chuleta permanente. En Adivinar no se aplica (J-12). **Validado en la Sesión 1** (20/10, informe `V-08`): A10.',valid='si')
req(C,'L-03','Al pulsar una nota se señalan discretamente las demás posiciones que producen **exactamente la misma nota** (mismo sonido, no misma clase de nota).','Media','F1.1','si','0.1.0','Desde la 0.3.1 se señalan con contorno, sin relleno, y con «Ver todas las notas» llevan además un anillo claro por fuera (AR-06). Señal deliberadamente más tenue que la nota pulsada. **Validado en la Sesión 1** (20/10, informe `V-08`): E03.',valid='si')

# ---------- Adivinar ----------
C='J'
req(C,'J-01','Suena una nota aleatoria y el usuario busca su posición en el mástil.','Alta','F1.1','si','0.1.0','Con botón para repetir el sonido. Desde 0.1.1 los retos se limitan a los 12 primeros trastes por defecto, y desplazar el mástil ya no cuenta como pulsación. **Desde la 0.3.3** (Sesión 1, E06), al entrar en Adivinar no suena nada hasta pulsar ▶, que aparece resaltado; antes de ▶ se puede tocar el mástil sin que puntúe. Después cada reto suena solo, y ▶ lo repite. **Desde la 0.4.1** (tu comentario del 21/10), la lectura grande y el pentagrama vuelven a mostrar la nota que tocas; la buscada solo se ve con la pista de nombre, que sale aparte y grande en su botón (J-06), o al responder. **Sesión 1** (20/10, informe `V-08`): lo esencial cumplió en C07 y E04; el cambio de la 0.3.3 lo pediste tú y se confirma en la Sesión 2.')
req(C,'J-02','Se acepta como acierto cualquier posición que produzca esa nota exacta.','Alta','F1.1','si','0.1.0 **Validado en la Sesión 1** (20/10, informe `V-08`): E04.',valid='si')
req(C,'J-03','Tras acertar se señalan las demás posiciones válidas.','Media','F1.1','si','0.1.0','Reutiliza la lógica de L-03. **Validado en la Sesión 1** (20/10, informe `V-08`): E04.',valid='si')
req(C,'J-04','Pista opcional: nombre de la nota que suena.','Alta','F1.1','si','0.1.0 **Validado en la Sesión 1** (20/10, informe `V-08`): E04.',valid='si')
req(C,'J-05','Pista opcional: cuerda o cuerdas donde puede encontrarse.','Alta','F1.1','si','0.1.0 **Validado en la Sesión 1** (20/10, informe `V-08`): E04.',valid='si')
req(C,'J-06','Las pistas se activan desde la propia interfaz, sin abrir el menú.','Alta','F1.1','si','0.1.0','Con las dos pistas activas equivale a «busca esta nota en esta cuerda»; sin ninguna, a «adivina de oído». **Validado en la Sesión 1** (20/10, informe `V-08`): E04. **Desde la 0.4.1** (tu comentario del 21/10): encendida, cada pista enseña su respuesta dentro de su botón, en grande y con borde discontinuo de «pista» («NOTA Sol♯3», «CUERDAS 3ª 4ª»), para no confundirla con la nota que tocas. Se ve también antes de pulsar ▶ (antes no salía). Lo esencial ya estaba validado; el aspecto nuevo lo verás en la próxima prueba.',valid='si')
req(C,'J-07','Contador de racha visible durante el juego.','Alta','F1.1','si','0.1.0 **Validado en la Sesión 1** (20/10, informe `V-08`): E04.',valid='si')
req(C,'J-08','El récord de racha más larga persiste entre sesiones.','Alta','F1.1','si','0.1.0','`localStorage`. No funciona en las previsualizaciones de artefactos; probar en local o en la web. **Desde la 0.3.3** (Sesión 1, A14), «Restablecer todos los ajustes» conserva el récord, que se borra con su propio botón en Ajustes. No hacen falta usuarios: el récord es tuyo y vive en este navegador. **Sesión 1** (20/10, informe `V-08`): lo esencial cumplió en A15; el cambio de la 0.3.3 lo pediste tú y se confirma en la Sesión 2. **Desde la 0.4.1**, un récord por afinación (J-11); «Borrar los récords de racha» los borra todos.')
req(C,'J-09','Feedback visual inmediato de acierto y de error.','Alta','F1.1','si','0.1.0','Color en la posición pulsada y destello en la barra del reto. **Validado en la Sesión 1** (20/10, informe `V-08`): A09 y E04.',valid='si')
req(C,'J-10','Al fallar se indica cuál era la posición correcta.','Media','F1.3','si','0.1.2','El fallo rompe la racha siempre. Se iluminan todas las posiciones correctas y se vuelve a oír la nota buscada justo después de la pulsada, para aprender por contraste; luego llega el reto siguiente. **Desde la 0.3.3** (Sesión 1, A09), la corrección llega a los 1,2 s (antes 0,65) y el reto siguiente 3 s después, para poder comparar las dos notas; el fallo se rellena en rojo con ✗ y las posiciones correctas en verde con ✓, de modo que no dependa solo del color. **Sesión 1** (20/10, informe `V-08`): lo esencial cumplió en A09; el cambio de la 0.3.3 lo pediste tú y se confirma en la Sesión 2. Pendiente (CP-5): condicionarlo a «Al fallar: Ver la respuesta», que desde la 0.5.3 ya no es lo de fábrica, y describirlo así en `interfaz.md` A2 (AR-12 #7).')
req(C,'J-11','Cada afinación tiene su propio récord de racha.','Media','F4.4','si','0.4.1','**Decidido el 21/10** (tu elección entre récord único o por afinación): por afinación, porque una racha en DADGAD no es comparable con una en estándar. Desde la 0.4.1, el récord que tenías pasa a Estándar; cambiar de afinación empieza la racha de nuevo y enseña el récord de esa afinación («Récord 7 · Estándar»). Validado por el banco.',valid='si')
req(C,'J-12','Los ajustes que revelan la respuesta —ver todas las notas— no se aplican en Adivinar.','Alta','F1.3','si','0.1.2','Encontrado al revisar el código: con «ver todas las notas» activo, el juego mostraba la solución. **Validado en la Sesión 1** (20/10, informe `V-08`): A10.',valid='si')
req(C,'J-13','Al fallar en Adivinar, por defecto sigues intentándolo hasta que aciertes o pidas «Ver la respuesta»; en Ajustes puedes elegir que la respuesta se enseñe nada más fallar. Acertar tras fallar pasa al reto siguiente sin sumar a la racha.','Media','F5.5','si','0.5.1','Tu petición del 21/10. **Hecho en la 0.5.1:** Ajustes › Adivinar › «Al fallar»: Ver respuesta | Reintentar. El fallo rompe la racha en los dos casos (J-10). Validado por el banco. **Desde la 0.5.3**, seguir intentando es lo de fábrica (tu decisión del 21/10).',valid='si')

# ---------- Escalas ----------
C='E'
req(C,'E-01','Selección de escala a practicar (tónica + tipo).','Alta','F5.2','si','0.5.0','**Catálogo decidido el 21/10** (tu elección): mayor, menor natural, pentatónica mayor y pentatónica menor, en las 12 tónicas. **Hecho en la 0.5.0:** Escalas › tónica y tipo; la tónica se escribe según el tipo (Re♭ mayor, Do♯ menor). Falta que lo veas.')
req(C,'E-02','El generador de escalas opera **solo en afinación estándar** en la primera entrega.','Alta','F5.2','si','0.5.0','Alcance acotado. Las demás afinaciones pasan a E-02b. **Hecho en la 0.5.0** (banco `tests/escalas.test.js`): las 24 mayores y menores con siete letras distintas, sin mezclar ♯ y ♭ ni dobles alteraciones, y 16 de ellas comparadas nota a nota con el libro; las pentatónicas, dentro de su escala. Verificado parcialmente hasta tener la tabla de referencia completa (CP-5, AR-12 #4 y ronda 2). Las casillas salen de la clase de altura de cada nota, así que también funcionan en las demás afinaciones; lo que sigue fuera (E-02b) son las digitaciones. Pendiente (CP-5): comparar nota a nota las 48 escalas con una tabla de referencia (hoy, 16 más reglas generales) y comprobar las 48 en el mástil (AR-12 #4, AT-11); que una alteración fuera de ±2 dé error y no «Doundefined» (AT-11 #9). Alcance: funciona en todas las afinaciones aunque el texto diga solo estándar; lo confirmas tú (AR-12 #9).')
req(C,'E-02b','Escalas en afinaciones alternativas y variantes de digitación (por ejemplo, escala en octavas).','Media','Posterior','no','','Fuera del alcance de F5.')
req(C,'E-03','Submodo Mostrar: la app ilumina las notas que componen la escala.','Alta','F5.3','si','0.5.0','**Hecho en la 0.5.0:** el mástil enseña solo las notas de la escala, con su nombre escrito (Si♭ en Fa mayor, no La#) y la tónica con anillo. Falta que lo veas.')
req(C,'E-04','En Mostrar se indica el nombre de cada nota y su separación interválica respecto a la anterior.','Alta','F5.3','si','0.5.0','Etiquetas tipo `T — T — ST — T — T — T — ST`. **Hecho en la 0.5.0:** encima del paso a paso, «Do T Re T Mi ST Fa…»; en las pentatónicas aparece también T½ (tono y medio). Los intervalos van en esa línea y no en cada casilla, donde no caben. Falta que lo veas. Pendiente (CP-5): T, ST y T½ no se traducen al inglés, y «T½» puede leerse como medio tono (AR-12 #8).')
req(C,'E-05','Submodo Práctica: valida **solo la pertenencia** de la nota a la escala; al pulsar una ajena, marca error e ilumina las correctas.','Alta','F5.4','si','0.5.0','Alcance acotado: no valida orden ni digitación. **Hecho y validado en la 0.5.0** (banco): cada nota distinta cuenta una vez («3 de 7»); una ajena se marca en rojo y se enseñan un momento las buenas; el pentagrama solo escribe las que ya has encontrado. Falta probarlo con la guitarra (Sesión 2). **Desde la 0.5.3**, el progreso empieza de nuevo al cambiar de afinación: cada casilla suena ya a otra nota (AT-09).',valid='si')
req(C,'E-05b','Validación del orden de la escala y de patrones de digitación concretos.','Media','Posterior','no','','Fuera del alcance de F5.')
req(C,'E-06','Guiado nota a nota en el submodo Mostrar.','Media','F5.3','si','0.5.0','**Hecho en la 0.5.0:** ◀ ▶ recorre la escala desde la tónica más grave del mástil hasta su octava; cada paso suena, se resalta en el mástil y en el pentagrama, y se explica («Mi, un tono sobre Re»). Falta que lo veas. Pendiente (CP-5): con una afinación muy grave (36 o menos) el pentagrama cambia de octava a mitad de escala; hace falta un solo desplazamiento por pentagrama (AT-09 #10, AT-11 #3).')

# ---------- Afinador ----------
C='A'
req(C,'A-01','Afinador por referencia: la app reproduce la nota de cada cuerda para afinar de oído.','Alta','F1.1','si','0.1.0','El MVP real del afinador.')
req(C,'A-02','Afinador por micrófono: capta la cuerda e indica si subir o bajar.','Alta','F4.3','si','0.4.0','Exige contexto seguro: funciona en `https` y en `localhost`, no abriendo el archivo (`file://`). **Hecho en la 0.4.0** (F4.3): Afinador › Micrófono › «Activar el micrófono»; se apaga al salir del Afinador o al ocultar la app, y el sonido se analiza solo en el dispositivo. En Chromium, con una grabación real de la 5ª cuerda 12 cents baja como micrófono, dice «La2 · −11 cents · ▲ Sube un poco» (`herramientas/comprobar-afinador.js`). En el iPhone se prueba en la web de pruebas, que es `https`. **Falta tu comprobación con la guitarra** (10 minutos).')
req(C,'A-02-CA','Criterios de aceptación de A-02: precisión de detección ±2 cents en silencio razonable, latencia menor de 300 ms; el ruido de fondo queda fuera de la primera entrega.','Alta','F4.2','si','0.4.0','La precisión de detección debe ser mejor que el umbral de «afinado» de A-03. **Hecho y validado en la 0.4.0** (F4.2, banco `tests/tono.test.js`): método YIN en un hilo aparte. Con las 12 grabaciones de cuerdas al aire de la app, desafinadas de −45 a +40 cents: peor error 1,86 cents frente a su frecuencia medida y 1,01 cents trozo a trozo; la aguja sale en su nota en 168 ms como mucho (más hasta 3 ms de cálculo). Nota: al pulsarla, una cuerda real suena unos cents alta y se asienta en unos 0,3 s; la aguja lo refleja, y eso es la cuerda, no el detector.',valid='si')
req(C,'A-03','Indicador de desviación en cents, con umbral de afinado en ±5 cents.','Alta','F4.3','si','0.4.0','**Hecho en la 0.4.0:** aguja de −50 a +50 cents con la franja verde de ±5, los cents en número y la orden «▲ Sube (un poco)», «▼ Baja (un poco)» o «✓ Afinada». Falta tu comprobación con la guitarra.')
req(C,'A-04','Detección automática de cuerda por proximidad a la nota detectada.','Alta','F4.3','si','0.4.0','Limitación asumida: con una cuerda muy desafinada puede elegir la equivocada. **Hecho y validado en la 0.4.0** (banco): con «Auto», la cuerda de nota más cercana en la afinación activa. Cada una de las 6 cuerdas, 90 cents baja o alta, se identifica bien, y con Drop D también la 6ª (Re2).',valid='si')
req(C,'A-05','Selección manual de cuerda, que prevalece sobre A-04.','Alta','F4.3','si','0.4.0','Resuelve la limitación anterior. **Hecho en la 0.4.0:** botones Auto · 6 … 1. Con una cuerda elegida, el afinador la usa aunque suene otra nota, y un salto de octava del detector no se confunde con «baja 12 semitonos». Falta tu comprobación con la guitarra.')
req(C,'A-06','Afinación estándar (E A D G B E).','Alta','F1.1','si','0.1.0')
req(C,'A-07','Cinco afinaciones alternativas predefinidas: Drop D, medio tono abajo, Open G, Open D y DADGAD.','Alta','F1.1','si','0.1.0')
req(C,'A-08','Afinación personalizada ajustando cada cuerda por semitonos.','Alta','F1.1','si','0.1.0','Cualquier ajuste convierte la afinación en personalizada sin alterar los presets. **Validado en la Sesión 1** (20/10, informe `V-08`): A13.',valid='si')
req(C,'A-09','Al seleccionar una afinación se muestran sus notas en un pentagrama.','Media','F1.1','si','0.1.0','Ver P-04.')
req(C,'A-10','La afinación activa se aplica también a los modos de aprendizaje.','Alta','F1.1','si','0.1.0','Ninguna nota está escrita a mano: todas derivan de la afinación activa, y la propagación ocurre en un único punto del código.')
req(C,'A-11','La afinación persiste entre sesiones.','Media','F1.1','si','0.1.0')

# ---------- Metrónomo ----------
C='MT'
req(C,'MT-01','**Metrónomo:** tempo de 30 a 250 pulsos por minuto con una barra vertical, − y + y «Marcar» (tocando a ritmo), con su nombre italiano (Lento, Andante, Allegro…); arranca y para con un toque.','Media','F5.6','si','0.5.4','Tu petición del 21/10 y tu guía con la app que nos enseñaste: lo más directo. Se usa igual en vertical y en horizontal: como el Afinador, no pide girar el móvil. La barra se mueve también con las flechas del teclado. **Hecho en la 0.5.4** y validado por el banco; falta que lo uses con la guitarra (Sesión 2). Verificado parcialmente: lo sostiene el banco hasta que lo compruebes tú (Sesión 2), igual que las escalas (CP-5, AR-12 #1). Pendiente (CP-5): mostrar qué figura cuenta el tempo («♩. = 80» en 6/8) y citar en el criterio los tramos de los nombres italianos (AR-12 #11).')
req(C,'MT-02','Compás elegible entre 1/4, 2/4, 3/4, 4/4, 5/4, 6/4, 3/8, 5/8, 6/8, 7/8, 9/8 y 12/8, en una ventana que se abre al tocar el compás; un punto por pulso (en 6/8, 9/8 y 12/8 el pulso es la negra con puntillo: dos, tres o cuatro puntos), y acento en el primer tiempo, que se puede quitar.','Media','F5.6','si','0.5.4','Tu decisión del 21/10: como la app de referencia, un solo acento (el del primer tiempo) en vez de acentos en cada tiempo. Por defecto, con acento. **Hecho en la 0.5.4** y validado por el banco; falta que lo uses con la guitarra (Sesión 2).',valid='si')
req(C,'MT-03','Subdivisión elegible con figuras en la misma ventana: solo el pulso, dos, tres o cuatro golpes por pulso; la subdivisión suena más suave que el pulso.','Media','F5.6','si','0.5.4','Tu petición del 21/10 («ritmos»). En los compases compuestos, tres golpes por pulso son las corcheas. **Hecho en la 0.5.4** y validado por el banco; falta que lo uses con la guitarra (Sesión 2).',valid='si')
req(C,'MT-04','Cada golpe se programa con el reloj de audio, con menos de 1 ms de desviación frente al tempo, y la pantalla marca el tiempo en curso. Se para al ocultar la app.','Media','F5.6','si','0.5.4','Con un temporizador normal el pulso «se arrastra»: el reloj de audio es exacto. Lo de pararse sigue la regla del sonido en segundo plano (Sesión 1, C07). **Hecho en la 0.5.4** y validado por el banco; falta que lo uses con la guitarra (Sesión 2). **En la 0.5.7** (CP-5, AT-11 #1), arranca aunque el iPhone haya dejado el audio en pausa (tras una llamada o Siri): espera a que despierte. Pendiente (CP-5): medir el pulso en Chromium con audio real, 60 s a 250 ppm cambiando de área (AR-12 #3); al parar pueden sonar los golpes ya programados, hasta 100 ms (AT-11 #2); el dibujo no descuenta la latencia de salida (AT-11 #5); desconectar los osciladores al acabar (AT-11 #6). Ronda 2 de AT-11: tras Siri, si el audio sigue en pausa, «Vuelve a pulsar» se repite sin rehacer el audio (medio); durante la espera el botón no cambia (bajo); Empezar, Parar y Empezar en menos de 400 ms puede anular el tercero (bajo). Decisión tuya pendiente: mantener la pantalla encendida mientras suena (AR-12 #2).',valid='si')
req(C,'MT-05','El metrónomo es un **área propia**, con su pestaña en la navegación principal. Sigue sonando al pasar a Libre, Adivinar, Escalas o Acordes hasta que lo pares, y su pestaña late con el pulso mientras suena. Recuerda el último tempo, compás, figura y acento en el primer tiempo.','Media','F5.6','si','0.5.4','Tu decisión del 21/10: función propia, no un chip del acceso rápido. Al escuchar con el micrófono en el Afinador, el metrónomo se para y lo dice: su clic confundiría al detector. Distribución: `interfaz.md` §7b, aprobada el 21/10. **Hecho en la 0.5.4** y validado por el banco; falta que lo uses con la guitarra (Sesión 2). Verificado parcialmente: lo sostiene el banco hasta que lo compruebes tú (Sesión 2), igual que las escalas (CP-5, AR-12 #1).')

# ---------- Acordes ----------
C='AC'
req(C,'AC-01','**Librería de acordes**, un área propia: a un lado, el listado de nombres, con una sección de **populares** arriba y debajo los **30 acordes** más habituales; al otro, el acorde dibujado en el mástil.','Media','F5.7','si','0.5.5','Tu petición del 21/10 («ya iremos ampliando»). Populares: C, G, D, A, E, Am, Em, Dm y F. Los 30: mayores, menores, 7, m7 y maj7 de uso común, Dsus4, C/G y G/B, en posición abierta o con las cejillas más habituales. En vertical el listado va arriba y el mástil abajo; en horizontal, el listado a la derecha. **Hecho en la 0.5.5** y validado por el banco; falta que lo compares con tu guitarra (Sesión 2). Pendiente (CP-5): contrastar los 30 con la tablatura y los dedos de un método citado; probar la cejilla y dibujar los 30 en el mástil (AR-12 #4, AT-11); raíz con alteración para F♯m, B♭ o D/F♯ (AT-11 #8); rasgueo con el reloj de audio (AT-11 #7).',valid='si')
req(C,'AC-02','En el mástil, cada nota del acorde lleva un círculo del color de su dedo (1 índice, 2 medio, 3 anular, 4 meñique; el mismo color en todos los acordes) con el número del dedo dentro. Junto al nombre de cada cuerda, ○ si suena al aire y ✕ si no suena; la cejilla, como una barra que une sus cuerdas.','Media','F5.7','si','0.5.5','Tu petición del 21/10: número y color a la vez, con el color constante entre acordes. Colores de la paleta Okabe-Ito, que se distinguen también con daltonismo; en Acordes no se ven los colores de nota, así que no se confunden con ellos. Cada círculo contrasta al menos 3:1 con el mástil y su número al menos 4,5:1 con el círculo (G-05). El lector de pantalla dice el dedo de cada casilla. **Hecho en la 0.5.5** y validado por el banco; falta que lo compares con tu guitarra (Sesión 2). Verificado parcialmente: lo sostiene el banco hasta que lo compruebes tú (Sesión 2), igual que las escalas (CP-5, AR-12 #1).')
req(C,'AC-03','El pentagrama escribe el acorde con sus notas apiladas, escritas como manda el acorde (B7: Re♯); se oculta con el ajuste de pentagrama de siempre.','Baja','F5.7','si','0.5.5','En el móvil en vertical el pentagrama se aparta para que el listado y el mástil quepan; se ve al girar el móvil y en pantallas amplias. **Hecho en la 0.5.5** y validado por el banco; falta que lo compares con tu guitarra (Sesión 2). Verificado parcialmente: lo sostiene el banco hasta que lo compruebes tú (Sesión 2), igual que las escalas (CP-5, AR-12 #1).')
req(C,'AC-04','El acorde suena rasgueado, de grave a agudo, al elegirlo y con «Tocar»; cada cuerda se puede tocar suelta.','Media','F5.7','si','0.5.5','35 ms entre cuerda y cuerda. **Hecho en la 0.5.5** y validado por el banco; falta que lo compares con tu guitarra (Sesión 2).',valid='si')
req(C,'AC-05','Las digitaciones son para la afinación estándar en la primera entrega: con otra afinación activa, Acordes lo avisa, no las dibuja y ofrece pasar a la estándar.','Media','F5.7','si','0.5.5','Las digitaciones dependen de la afinación; las demás, para después. **Hecho en la 0.5.5** y validado por el banco; falta que lo compares con tu guitarra (Sesión 2).',valid='si')
req(C,'AC-06','Un **buscador** filtra el listado por cómo empieza el nombre: «G» deja G, Gm, G7, G/B…; vale en las dos nomenclaturas («Sol» encuentra lo mismo) y sin distinguir mayúsculas.','Media','F5.7','si','0.5.5','Tu petición del 21/10. Una sola letra solo se busca en la nomenclatura inglesa, para que «D» no traiga también los Do; # y b valen por ♯ y ♭. **Hecho en la 0.5.5** y validado por el banco.',valid='si')

# ---------- Visualización ----------
C='V'
req(C,'V-01','En móvil se **sugiere** la orientación horizontal con un aviso discreto; no se fuerza.','Alta','F3.2','si','0.3.0','**Hecho en la 0.3.0** según `interfaz.md` §7. En horizontal, raíl, mástil a todo el alto y panel: medido en Chromium, 52,8 px por cuerda en el iPhone con Safari (antes 28,8), 60,8 con la app instalada y 42,5 en un Android de 280 px de alto (V-06). El aviso para girar sale solo con el dedo, en vertical y en pantallas de menos de 600 px de ancho, en Libre y Adivinar (y Escalas desde F5), en Libre, Adivinar, Escalas y Acordes; nunca en el Afinador ni en el Metrónomo; cerrado no vuelve y «Restablecer» lo recupera. El bloqueo de orientación tiene mal soporte en iOS, así que no se fuerza. **Validado en la Sesión 1** (20/10, informe `V-08`): C02, C03 y D03.',valid='si')
req(C,'V-02','El afinador funciona en vertical y en horizontal.','Alta','F1.1','si','0.1.0')
req(C,'V-03','En escritorio el mástil aprovecha el ancho disponible.','Alta','F1.1','si','0.1.0','Arranca mostrando el mástil completo en pantallas anchas.')
req(C,'V-04','Control de zoom que determina qué porción del mástil se ve.','Alta','F1.1 · F3.2','si','0.1.0','De 3 a 24 trastes a la vista. Desde 0.1.1 la etiqueta indica los trastes que caben de verdad, y el zoom conserva el tramo que estabas mirando. **Desde la 0.3.0**, con el dedo la vista por defecto usa trastes de 40 px o más (34 con ratón), y la cejuela mide 40. **Desde la 0.3.2** (tu comentario del 20/10), «+» enseña más trastes y «−» menos, y con el dedo puedes pedir trastes de hasta 28 px: en el iPhone con Safari, hasta 11 a la vista en vertical y 15 en horizontal. Si el zoom guardado pide más, se muestran los que caben y la etiqueta lo dice, pero lo guardado se conserva para que al girar vuelva (V-08). **Validado en la Sesión 1** (20/10, informe `V-08`): A07, A08 y C04.',valid='si')
req(C,'V-05','Cuando el mástil no cabe, el usuario se desplaza lateralmente.','Alta','F1.1','si','0.1.0 **Validado en la Sesión 1** (20/10, informe `V-08`): A08.',valid='si')
req(C,'V-06','El ancho de traste no cambia al desplazarse: el zoom fija el tamaño y el desplazamiento mueve la ventana.','Alta','F1.1','si','0.1.0 **Validado en la Sesión 1** (20/10, informe `V-08`): A07.',valid='si')
req(C,'V-07','El mástil se readapta al redimensionar la ventana.','Alta','F1.1','si','0.1.0 **Validado en la Sesión 1** (20/10, informe `V-08`): A08.',valid='si')
req(C,'V-08','El nivel de zoom persiste entre sesiones.','Baja','F1.1','si','0.1.0','Desde 0.1.1 girar el móvil ya no pisa el zoom elegido.')
req(C,'V-09','Al ocultar la numeración se puede conservar una **referencia de tramo**: el modo «Guía» deja solo los números de los trastes con marca.','Media','F1.3','si','0.1.2','Sin números, los trastes 5 y 17 llevan la misma marca y se confunden. Se descartó el minimapa por desproporcionado. **Validado en la Sesión 1** (20/10, informe `V-08`): A11.',valid='si')

# ---------- Configuración ----------
C='C'
req(C,'C-01','Menú de configuración accesible desde cualquier pantalla.','Alta','F1.1','si','0.1.0','Hoja que sube desde abajo en vertical; panel lateral en horizontal y en pantallas amplias, con un segundo botón en el raíl (0.3.0). Es un diálogo: mientras está abierto, el resto de la página no responde (AT-04). **Validado en la Sesión 1** (20/10, informe `V-08`): A19 y C05.',valid='si')
req(C,'C-02','El menú contiene nomenclatura, pentagrama, timbre, numeración de trastes (tres modos), ver todas las notas, señalar iguales y afinación activa, y muestra la versión de la app.','Alta','F1.1','si','0.1.0','Ampliado en 0.1.2 con la numeración en tres modos y la versión (G-10). En F6.4 se añade el grupo «Acerca de», con los créditos (G-06) y la privacidad (G-11) (`interfaz.md` v1.0, aprobada el 20/10). **Desde la 0.4.2**, Ajustes empieza con el grupo «Idioma · Language» (G-12). Tiene también «Al fallar» en Adivinar (J-13, 0.5.1) y «Notas alteradas», ♯ o ♭ por tecla negra (N-06, 0.5.2).')
req(C,'C-03','Los ajustes frecuentes tienen acceso rápido sin abrir el menú.','Alta','F1.1','si','0.1.0','Nomenclatura y pentagrama en chips bajo la cabecera, o en el panel en horizontal, donde el pentagrama se rotula con la clave de sol; las dos pistas del juego, en la tarjeta del reto (0.3.0).')
req(C,'C-04','Navegación principal clara entre las áreas de la app.','Alta','F1.1','si','0.1.0','Barra inferior con un destino por área en vertical (seis desde la 0.5.5, con Metrónomo y Acordes; en el raíl, pestañas de 44 px; entre 600 y 959 px, las pestañas se alinean a la derecha), raíl a la izquierda en horizontal y pestañas en la cabecera en pantallas amplias (0.3.0). En pantallas bajas la barra nunca se sale (AR-05). **Validado en la Sesión 1** (20/10, informe `V-08`): A19.',valid='si')
req(C,'C-05','Todos los ajustes persisten entre sesiones.','Media','F1.1','si','0.1.0','Un único objeto de estado, validado campo a campo al leerlo (0.1.1). **Validado en la Sesión 1** (20/10, informe `V-08`): A14 y A15.',valid='si')
req(C,'C-06','Especificación detallada de la interfaz: estructura de menús, jerarquía de controles y flujos de navegación.','Alta','F3.1','si','0.2.3','`docs/interfaz.md` v1.0, aprobada por ti el 20/10 tras la auditoría AR-04 (10 hallazgos resueltos). Bocetos al tamaño real de cada pantalla en `docs/interfaz/`, comprobados por `herramientas/capturar-wireframes.js`. Los cambios posteriores suben su versión.',valid='si')
req(C,'C-07','**Botón «atrás» del sistema:** mientras haya un paso anterior en la sesión, el botón o gesto «atrás» cierra Ajustes o vuelve al área anterior; desde la primera área actúa el sistema. Al abrir la app se entra en Libre.','Media','F3.2','si','0.3.0','**Hecho en la 0.3.0** con el historial del navegador (`history`): cada área tiene su dirección (`#libre`, `#adivinar`…). Un paso que deja la misma área, como tras recargar, se salta. El banco lo prueba con un historial simulado que avisa como el de verdad. Falta la prueba a mano en Windows y en el simulador de Android (Sesión 1). En el iPhone instalado no hay botón atrás. **Validado en la Sesión 1** (20/10, informe `V-08`): A17.',valid='si')
req(C,'C-08','Menú **Personalización** dentro de Ajustes: estilos de nota en el mástil (círculo de color o solo el nombre, más grande o en negrita), estilo del traste y del mástil, interior claro para «Ver todas las notas» y temas de color de la app.','Media','Posterior','no','','Tus comentarios de la Sesión 1 (A10, C06 y E06), para una actualización posterior. La paleta por nota de G-05 se mantiene como punto de partida.')

# ---------- Despliegue ----------
C='X'
req(C,'X-01','El código y la documentación están **respaldados** en el repositorio remoto (GitHub). Respaldar no es publicar.','Alta','F1.2 · F1.4','si','0.1.4','Desde el 15/10 todo el proyecto está en `pdigue/guitarra`; cada versión entra por *pull request* aprobado (del #1 al #5) y F1 se cerró con la etiqueta `v0.1.5`. El repositorio es público.')
req(C,'X-02','La app está **publicada** en una URL pública (GitHub Pages).','Alta','F7.1','no','','Antes en V1; pasa a la última fase por decisión del 15/09: desarrollo local de principio a fin. **Despliegue de pruebas** (decisión del 15/10): antes de la Sesión 1 se publica una versión de pruebas en GitHub Pages, sin anunciar, para probar en el iPhone con `https` la instalación, el modo sin conexión y el micrófono. X-02 sigue siendo la publicación oficial.')
req(C,'X-03','La app está verificada en móviles reales, instalada como icono desde la web publicada.','Alta','F7.2','no','','Cierra G-04 y PL-01 a PL-03 en su modo web.')

CATS = [
 ('G','Requisitos generales y de producto'),('PL','Plataformas'),('N','Nomenclatura y notación'),
 ('D','Diapasón'),('S','Sonido'),('P','Pentagrama'),('L','Modo Libre'),('J','Modo Adivinar'),
 ('E','Escalas'),('MT','Metrónomo'),('AC','Acordes'),('A','Afinador'),('V','Visualización'),('C','Configuración y navegación'),('X','Respaldo y publicación')]

ICON_I = {'si':'✅','parcial':'🟡','no':'⬜'}
ICON_V = {'si':'✅','no':'⬜'}
FLAG = {'nuevo':' 🆕','mod':' ✏️','':''}

def row(r):
    return '| **{id}**{f} | {t} | {p} | {e} | {i} | {v} | {d} | {n} |'.format(
        id=r['id'], f=FLAG[r['flag']], t=r['text'], p=r['prio'], e=r['etapa'],
        i=ICON_I[r['impl']], v=ICON_V[r['valid']], d=r['desde'] or '—', n=r['notas'] or '—')

HEAD = '| ID | Requisito | Prior. | Etapa | Impl. | Valid. | Desde | Notas |\n|----|-----------|--------|-------|:-----:|:------:|:-----:|-------|'

# --- Resumen ---
from collections import Counter, defaultdict
tot = len(R)
ci = Counter(r['impl'] for r in R)
nuevos = [r['id'] for r in R if r['flag']=='nuevo']
mods   = [r['id'] for r in R if r['flag']=='mod']
cuenta = lambda n, uno, varios: '{} {}'.format(n, uno if n == 1 else varios)

phase_of = lambda e: e.split('.')[0] if e.startswith('F') else e
by_phase = defaultdict(list)
for r in R:
    for e in [x.strip() for x in r['etapa'].split('·')]:
        by_phase[phase_of(e)].append(r)
PH = ['F1','F2','F3','F4','F5','F6','F7','Posterior']
PH_NAME = {'F1':'Base local verificada','F2':'Sonido propio y archivo autónomo','F3':'Interfaz y adaptación',
           'F4':'Afinador por micrófono','F5':'Escalas, metrónomo y acordes','F6':'Preparación para distribución',
           'F7':'Publicación y lanzamiento','Posterior':'Fuera del alcance actual'}

def bar(done, total, n=10):
    if total == 0: return ''
    k = round(n*done/total)
    return '▰'*k + '▱'*(n-k)

L = []
w = L.append
w('# Trasteando — Especificación de Requisitos\n')
w('**Versión del documento:** 1.25 · **Fecha:** 22 de octubre de 2026  ')
w('**Válido para:** app `0.6.0` · `roadmap.md` v3.23 · `matriz-cumplimiento` v1.23 · fase en curso **F6** (F5 sigue abierta), en modo acelerado  ')
w('**Repositorio:** github.com/pdigue/guitarra, carpeta `docs/` · **Gestiona:** chat de Desarrollo  ')
w('**Tipo de producto:** aplicación web progresiva (PWA), desarrollada en local y publicada al final del roadmap\n')
w('---\n')
w('## 1. Estado de un vistazo\n')
w('| Total | ✅ Implementados | 🟡 Parciales | ⬜ Pendientes | ✅ Validados |')
w('|:---:|:---:|:---:|:---:|:---:|')
w('| {} | {} | {} | {} | {} |\n'.format(tot, ci['si'], ci['parcial'], ci['no'], sum(r['valid']=='si' for r in R)))
w('> Un requisito implementado no cuenta como cumplido hasta superar su prueba. El primero validado fue **S-08**, en la 0.2.0. La Sesión 1 (20/10, en tu iPhone y tu PC) validó 35 de golpe; lo que cambió la 0.3.3 y el sonido en el iPhone esperan a la Sesión 2.\n')
w('| Fase | Objetivo | Requisitos | Implementados |')
w('|------|----------|:---:|-----------|')
for ph in PH:
    rs = {r['id']: r for r in by_phase[ph]}.values()
    rs = list(rs)
    if not rs: continue
    d = sum(r['impl']=='si' for r in rs)
    w('| **{}** | {} | {} | `{}` {}/{} |'.format(ph, PH_NAME[ph], len(rs), bar(d, len(rs)), d, len(rs)))
w('\n*Un requisito puede aparecer en dos fases si se implementa en una y se valida o completa en otra.*\n')
w('---\n')

VALS = ['G-01', 'G-02', 'G-05', 'G-07', 'L-01', 'L-02', 'L-03', 'S-03', 'P-01', 'P-04', 'N-01', 'N-03', 'N-04', 'V-01', 'V-04', 'V-05', 'V-06', 'V-07', 'V-09', 'D-04', 'D-05', 'D-06', 'A-08', 'J-02', 'J-03', 'J-04', 'J-05', 'J-06', 'J-07', 'J-09', 'J-12', 'C-01', 'C-04', 'C-05', 'C-07']
news = [r['id'] for r in R if r['flag']=='nuevo']
w('## 2. Control de cambios\n')
w('| Versión | Fecha | App | Roadmap | Resumen | Origen |')
w('|---|---|:---:|:---:|---|---|')
w('| **1.25** | 22/10/2026 | 0.6.0 | 3.23 | F6.1: el archivo autónomo pasa el mismo banco que la app de varios archivos, y G-08 queda hecho y validado por el banco. {} y {}: {} en total. | Etapa F6.1 |'.format(cuenta(len(nuevos), 'nuevo', 'nuevos'), cuenta(len(mods), 'modificado', 'modificados'), tot))
w('| 1.24 | 22/10/2026 | 0.5.7 | 3.22 | Punto de control CP-5 (auditorías AR-12 y AT-11 de toda F5): una sola vara para lo que tienes que comprobar tú (E-02, MT-01, MT-05, AC-02 y AC-03 pasan a verificados parcialmente), el arranque del metrónomo con el audio en pausa (MT-04) y lo pendiente de CP-5 anotado en su requisito. 0 nuevos y 12 modificados: 109 en total. | AR-12 y AT-11 |')
w('| 1.23 | 21/10/2026 | 0.5.6 | 3.21 | Auditorías AR-11 y AT-10 de F5.6 y F5.7: textos al día con las seis áreas, el aviso para girar y el metrónomo. 0 nuevos y 4 modificados: 109 en total. | AR-11 y AT-10 |')
w('| 1.22 | 21/10/2026 | 0.5.5 | 3.20 | F5.7: la librería de acordes, con tu guía del 21/10 (listado con populares y 30 acordes, buscador, el acorde en el mástil). AC-01 a AC-05 implementados y validados por el banco; AC-06, el buscador, nuevo. 1 nuevo y 7 modificados: 109 en total. | Tu guía del 21/10 y la etapa F5.7 |')
w('| 1.21 | 21/10/2026 | 0.5.4 | 3.19 | F5.6: el metrónomo hecho, con tu guía del 21/10 (la app de referencia): MT-01 a MT-05 implementados y validados por el banco; un solo acento, en el primer tiempo (MT-02). 0 nuevos y 7 modificados: 108 en total. | Tu guía del 21/10 y la etapa F5.6 |')
w('| 1.20 | 21/10/2026 | 0.5.3 | 3.18 | Tus decisiones del 21/10: el metrónomo es un área propia con su pestaña (MT-05) y en Adivinar se sigue intentando por defecto (J-13). Correcciones de las auditorías AR-10 y AT-09. 0 nuevos y 12 modificados: 108 en total. | Tus decisiones del 21/10, AR-10 y AT-09 |')
w('| 1.19 | 21/10/2026 | 0.5.2 | 3.17 | Tus comentarios del 21/10: reintentar en Adivinar (J-13) y ♯ o ♭ por nota (N-06), hechos; metrónomo (MT-01 a MT-05) y librería de acordes (AC-01 a AC-05), planificados en F5.6 y F5.7. 12 nuevos y 2 modificados: 108 en total. | Tus comentarios del 21/10 |')
w('| 1.18 | 21/10/2026 | 0.5.0 | 3.16 | F5: escalas. E-01 (catálogo decidido) a E-06 y P-03 implementados; E-02 y E-05 validados por el banco. 0 nuevos y 8 modificados: 96 en total. | Etapas F5.1 a F5.4 y tu elección del catálogo |')
w('| 1.17 | 21/10/2026 | 0.4.2 | 3.15 | Tus comentarios del 21/10: pistas grandes en Adivinar, un récord por afinación (J-11 decidido) e idioma español o inglés. 1 nuevo (G-12) y 5 modificados: 96 en total. | Tus comentarios y decisión del 21/10 |')
w('| 1.16 | 21/10/2026 | 0.4.0 | 3.14 | F4.1 a F4.3: afinador por micrófono. A-02 a A-05 y A-02-CA implementados; A-02-CA, A-04 y G-10 validados. 0 nuevos y 8 modificados: 95 en total. | Etapas F4.1 a F4.3 y tus etiquetas |')
w('| 1.15 | 20/10/2026 | 0.3.3 | 3.13 | Sesión 1: 35 requisitos validados en tu iPhone y tu PC; correcciones de la 0.3.3. 2 nuevos (C-08, S-09) y 5 modificados: 95 en total. | Sesión 1 (`V-08`) |')
w('| 1.14 | 20/10/2026 | 0.3.2 | 3.12 | Zoom: «+» enseña más trastes y se pueden pedir trastes de hasta 28 px con el dedo. 0 nuevos y 2 modificados: 93 en total. | Tu comentario del 20/10 |')
w('| 1.13 | 20/10/2026 | 0.3.1 | 3.11 | Etapa F3.4: G-05 implementado y paleta decidida. 0 nuevos y 2 modificados: 93 en total. | Tu decisión del 20/10, AR-06 y AT-05 |')
w('| 1.12 | 20/10/2026 | 0.3.0 | 3.10 | Etapa F3.2: V-01 y C-07 implementados. 0 nuevos y 8 modificados: 93 en total. | Etapa F3.2, AR-05 y AT-04 |')
w('| 1.11 | 20/10/2026 | 0.2.3 | 3.9 | Interfaz aprobada (F3.1): C-06 validado. 1 nuevo (C-07) y 8 modificados: 93 en total. | Tu aprobación de `interfaz.md` |')
w('| 1.10 | 20/10/2026 | 0.2.3 | 3.8 | Licencia del pack de nylon completa: S-07 implementado y validado. 0 nuevos y 1 modificado: 92 en total. | Tu comprobación en Freesound |')
w('| 1.9 | 20/10/2026 | 0.2.3 | 3.7 | Dos decisiones cerradas y licencia de nylon comprobada en tres sonidos. 0 nuevos y 3 modificados: 92 en total. | Tus decisiones del 20/10 |')
w('| 1.8 | 19/10/2026 | 0.2.3 | 3.6 | Auditoría CP-2. 0 nuevos y 4 modificados: 92 en total. Dos decisiones nuevas. | AR-03 y AT-03 |')
w('| 1.7 | 19/10/2026 | 0.2.2 | 3.5 | S-08 reformulado con tu aprobación; registro agudo de nylon (F2.4). 0 nuevos y 2 modificados: 92 en total. | Etapa F2.4 |')
w('| 1.6 | 19/10/2026 | 0.2.1 | 3.4 | Archivo autónomo (F2.3): G-07 implementado. 0 nuevos y 3 modificados: 92 en total. | Etapa F2.3 |')
w('| 1.5 | 19/10/2026 | 0.2.0 | 3.3 | Reproductor propio (F2.2): S-08 validado, la app ya no descarga nada de fuera. 0 nuevos y 4 modificados: 92 en total. | Etapa F2.2 |')
w('| 1.4 | 15/10/2026 | 0.1.4 | 3.2 | Dos decisiones cerradas: despliegue de pruebas y Android. 1 nuevo (PL-04) y 2 modificados: 92 en total. | Tus decisiones del 15/10 |')
w('| 1.3 | 15/10/2026 | 0.1.4 | 3.1 | Tres decisiones cerradas: audio (opción A), móvil de referencia (iPhone) y modo acelerado. 1 nuevo (S-08) y 6 modificados: 91 en total. | Iteración 0, medición de F2.1 y auditoría CP-1 |')
w('| 1.2 | 14/10/2026 | 0.1.2 | 3.0 | Fases F1–F7. Columnas *Validado*, *Etapa* y *Desde*. Sección de plataformas. 9 nuevos y 12 modificados: 90 en total. | Tu aprobación del 14/10 y revisión de código |')
w('| 1.1 | 15/09/2026 | 0.1.1 | 2.0 | Reconciliación de estados. 11 nuevos (S-07, V-09, J-11, G-05, G-06, A-02-CA, E-02b, E-05b, X-01 a X-03): 81 en total. Seis decisiones cerradas. | Auditoría de requisitos AR-01 |')
w('| 1.0 | 14/09/2026 | 0.1.0 | — | Primera versión: 70 requisitos en 11 categorías. | Tu listado inicial |\n')
w('### Detalle de la versión 1.25\n')
w('**Requisitos modificados ✏️** — ' + ', '.join(mods))
w('- **G-08:** hecho en la 0.6.0 y validado por el banco. Las pruebas que arrancan la app se pasan dos veces, contra la app de varios archivos y contra el archivo autónomo; el autónomo lee de dentro sus grabaciones sin descargar nada, y el ensamblador nombra cada módulo y se niega a incrustar uno que rompería la página. Anotado (AR-13): se reconfirma contra la web publicada en F7.1, y en la Sesión 2 se abre el autónomo con doble clic en Windows.\n')
w('Con esto hay {} requisitos validados.\n'.format(sum(r['valid']=='si' for r in R)))
w('### Detalle de la versión 1.24\n')
w('**Requisitos modificados ✏️** — G-02, N-06, J-10, E-02, E-04, E-06, MT-01, MT-04, MT-05, AC-01, AC-02, AC-03')
w('- **MT-01, MT-05, AC-02 y AC-03:** dejan de contar como validados. Su prueba es tuya (método D) y la sostenía solo el banco; ahora están *verificados parcialmente* hasta la Sesión 2. En la matriz, E-01, E-03, E-04, E-06 y P-03, de Escalas, pasan de *pendientes* a lo mismo (AR-12 #1).')
w('- **E-02:** también deja de contar como validado. Su criterio pide comparar cada tónica con una referencia externa, y el banco compara 16 de las 24 escalas de siete notas; el resto, con reglas generales (AR-12 #4 y ronda 2).')
w('- **MT-04:** la 0.5.7 arranca el metrónomo aunque el iPhone haya dejado el audio en pausa (AT-11 #1). Anotados: el pulso con audio real, el clic de más al parar y tu decisión pendiente sobre mantener la pantalla encendida (AR-12 #2).')
w('- **E-02, E-04, E-06, J-10, AC-01, G-02 y N-06:** anotado lo que CP-5 deja para después (casi todo encaja en F5.8), cada uno con su hallazgo.\n')
w('Con esto había 52 requisitos validados.\n')
w('### Detalle de la versión 1.23\n')
w('**Requisitos modificados ✏️** — G-02, V-01, MT-05, AC-06')
w('- **G-02:** las seis áreas, por su nombre.')
w('- **V-01:** el aviso para girar sale también en Acordes y nunca en el Metrónomo.')
w('- **MT-05:** recuerda la figura y el acento (no «acentos y subdivisión»).')
w('- **AC-06:** sin la frase de la guitarra, que no aplica a un buscador.\n')
w('Con esto había 57 requisitos validados.\n')
w('### Detalle de la versión 1.22\n')
w('**Requisito nuevo** — AC-06')
w('- **AC-06:** el buscador del listado de acordes: «G» deja G, Gm, G7, G/B…, también en Do Re Mi. Hecho y validado por el banco.\n')
w('**Requisitos modificados** — G-02, AC-01, AC-02, AC-03, AC-04, AC-05, C-04')
w('- **AC-01:** el listado que pediste: populares arriba y los 30 más habituales debajo, a un lado; el acorde en el mástil, al otro.')
w('- **AC-02 a AC-05:** implementados en la 0.5.5 y validados por el banco: las 30 digitaciones suenan a su acorde, dedos con número y color, ○ y ✕, cejilla, pentagrama, rasgueo y aviso con otra afinación.')
w('- **AC-03:** en el móvil en vertical, el pentagrama se aparta para que quepan el listado y el mástil; se ve al girarlo.')
w('- **G-02 y C-04:** seis áreas desde la 0.5.5.\n')
w('Con esto había 57 requisitos validados.\n')
w('### Detalle de la versión 1.21\n')
w('**Requisitos modificados** — G-02, MT-01, MT-02, MT-03, MT-04, MT-05, C-04')
w('- **MT-01 a MT-05:** implementados en la 0.5.4 y validados por el banco (golpes con menos de 1 ms de desviación, compases, figuras, acento, «Marcar», sonar en otras áreas y pararse con el micrófono o al ocultar la app). Falta que lo uses con la guitarra.')
w('- **MT-01:** barra vertical del tempo y su nombre italiano, como en la app que nos enseñaste.')
w('- **MT-02:** doce compases en una ventana, un punto por pulso y **un solo acento**, en el primer tiempo, que se puede quitar (antes: acentos en cada tiempo). Tu decisión del 21/10.')
w('- **MT-03:** la subdivisión se elige con figuras, en la misma ventana.')
w('- **G-02 y C-04:** cinco áreas desde la 0.5.4.\n')
w('Con esto había 51 requisitos validados.\n')
w('**Decisión cerrada:** las seis pestañas (`interfaz.md` §7b), aprobadas el 21/10.\n')
w('### Detalle de la versión 1.20\n')
w('**Requisitos modificados** — G-02, N-06, J-06, J-13, E-05, MT-01, MT-05, AC-01, AC-02, AC-05, C-02, C-04')
w('- **J-13:** al fallar se sigue intentando por defecto; la respuesta, solo si pulsas «Ver la respuesta» (0.5.3). Tu decisión del 21/10.')
w('- **MT-05:** el metrónomo es un área propia, con su pestaña, y no un chip del acceso rápido. Sigue sonando en las demás áreas hasta que lo pares, salvo al escuchar con el micrófono. Tu decisión del 21/10.')
w('- **MT-01, AC-01, AC-02 y AC-05:** casos que faltaban: el metrónomo, en las dos orientaciones; Acordes, área propia; colores de los dedos y su contraste; qué pasa con otra afinación y sin digitación para una combinación (AR-10).')
w('- **Objetivo nuevo O-05:** ritmo y acordes, para las dos funciones que pediste el 21/10.')
w('- **G-02 y C-04:** la navegación suma un destino por área nueva; con seis, las pestañas miden al menos 44 px.')
w('- **C-02, J-06, E-05 y N-06:** al día con la 0.5.1 a la 0.5.3 (AR-10 y AT-09).\n')
w('Con esto había 46 requisitos validados.\n')
w('**Decisión cerrada:** metrónomo → función propia, con su pestaña. **Decisión nueva:** la distribución de las seis pestañas (`interfaz.md` §7b). Ver «Decisiones abiertas».\n')
w('### Detalle de la versión 1.19\n')
w('**Requisitos nuevos** — N-06, J-13, MT-01, MT-02, MT-03, MT-04, MT-05, AC-01, AC-02, AC-03, AC-04, AC-05')
w('- **J-13:** en Adivinar, al fallar, ver la respuesta o seguir intentando. Hecho y validado por el banco (0.5.1).')
w('- **N-06:** ♯ o ♭ para cada tecla negra, igual en toda la app. Hecho y validado por el banco (0.5.2).')
w('- **MT-01 a MT-05:** metrónomo con tempo, compás, acentos y subdivisión, usable desde cualquier área. Planificado en F5.6.')
w('- **AC-01 a AC-05:** librería de acordes con dedos numerados y de color constante, pentagrama y sonido. Planificado en F5.7.\n')
w('**Requisitos modificados** — G-01, P-01')
w('- **G-01:** el nombre, más nítido y visible en horizontal.')
w('- **P-01:** pentagrama de una nota más grande y lectura sin saltos.\n')
w('### Detalle de la versión 1.18\n')
w('**Requisitos modificados** — N-04, P-03, E-01, E-02, E-03, E-04, E-05, E-06')
w('- **E-01:** catálogo decidido (mayor, menor natural, pentatónicas mayor y menor) e implementado.')
w('- **E-02 y E-05:** implementados y validados por el banco (escritura de las 48 escalas; pertenencia en Práctica).')
w('- **E-03, E-04, E-06 y P-03:** implementados; falta que los veas.')
w('- **N-04:** Escalas sigue también la nomenclatura.\n')
w('### Detalle de la versión 1.17\n')
w('**Requisito nuevo** — G-12: la app en español o en inglés, elegible en Ajustes.\n')
w('**Requisitos modificados** — J-01, J-06, J-08, J-11, C-02')
w('- **J-01:** la lectura grande vuelve a ser la nota que tocas.')
w('- **J-06:** encendida, cada pista enseña su respuesta en grande dentro de su botón, también antes de ▶.')
w('- **J-08 y J-11:** un récord por afinación (tu decisión). J-11 queda implementado y validado.')
w('- **C-02:** Ajustes tiene el grupo de idioma.\n')
w('### Detalle de la versión 1.16\n')
w('**Requisitos modificados** — G-08, G-10, PL-04, A-02, A-02-CA, A-03, A-04, A-05')
w('- **A-02, A-03, A-05:** implementados (afinador por micrófono). Falta tu comprobación de 10 minutos con la guitarra.')
w('- **A-02-CA y A-04:** implementados y validados por el banco (precisión, latencia y cuerda automática).')
w('- **G-10:** validado: ya existen las etiquetas de los cierres de F1, F2 y F3.')
w('- **G-08:** la app pasa a varios archivos; el autónomo se ensambla a partir de ellos.')
w('- **PL-04:** cuatro capacidades nuevas (micrófono, sesión de audio para grabar en el iPhone, analizador de audio e hilo aparte), cada una con su alternativa en `compatibilidad.md` v1.5.\n')
w('### Detalle de la versión 1.15\n')
w('**Validados en la Sesión 1** — ' + ', '.join(VALS) + '. Con S-07, S-08 y C-06, eran 38.\n')
w('**Requisitos nuevos** — C-08, S-09')
w('- **C-08:** menú «Personalización» (estilos de nota y de traste, interior claro, temas de color). Para una actualización posterior.')
w('- **S-09:** un timbre más parecido a tu guitarra. Para una actualización posterior.\n')
w('**Requisitos modificados** — J-01, J-08, J-10, S-01, S-02')
w('- **J-01:** Adivinar empieza con ▶ y la lectura grande muestra la nota buscada.')
w('- **J-08:** restablecer los ajustes conserva el récord; se borra aparte.')
w('- **J-10:** más tiempo antes de la corrección, y relleno con ✓ o ✗.')
w('- **S-01:** sonido en el iPhone: se pausa al bloquear y se reactiva al volver. Queda pendiente de la Sesión 2.')
w('- **S-02:** elegir guitarra ya no hace sonar una nota.\n')
w('**Siguen sin validar, con motivo:**')
w('- **Cambiados por la 0.3.3 a petición tuya:** J-01, J-08, J-10 y S-02. Lo esencial cumplió; lo nuevo se confirma en la Sesión 2.')
w('- **S-01:** el sonido se quedó mudo en el iPhone (C08 y D03).')
w('- **G-10:** faltan las etiquetas de Git de los cierres de F2 y F3.')
w('- **A-01 y A-06:** afinar de oído (E05), lo dejaste para más adelante.')
w('- **PL-01, PL-03 y G-04:** parciales hasta publicar (F7.2).')
w('- **Sin prueba en el protocolo de la Sesión 1** (los sostienen el banco y las comprobaciones en Chromium): N-02, N-05, D-01, D-02, D-03, D-07, S-04, S-05, S-06, P-02, A-07, A-09, A-10, A-11, V-02, V-03, V-08, C-02 y C-03. Irán en una lista corta en la Sesión 2.\n')
w('### Detalle de la versión 1.14\n')
w('**Requisitos modificados** — V-04, G-05')
w('- **V-04:** «+» enseña más trastes y «−» menos. Con el dedo, la vista por defecto sigue con trastes de 40 px, pero puedes pedir más trastes, de hasta 28 px.')
w('- **G-05:** la regla de 40 × 40 px admite esa excepción: los trastes más estrechos solo aparecen si tú los pides.\n')
w('### Detalle de la versión 1.13\n')
w('**Requisitos modificados** — G-05, L-03')
w('- **G-05:** implementado en la 0.3.1: teclado, contraste, movimiento reducido, tamaños táctiles y paleta. Su criterio en la matriz añade los umbrales de la paleta.')
w('- **L-03:** las posiciones del mismo sonido llevan contorno y, con «Ver todas las notas», un anillo exterior.\n')
w('**Decisión cerrada:** paleta por nota (F3.4). Ver «Decisiones abiertas».\n')
w('### Detalle de la versión 1.12\n')
w('**Requisitos modificados** — ' + 'G-05, PL-04, V-01, V-04, C-01, C-03, C-04, C-07')
w('- **V-01:** implementado en la 0.3.0: 52,8 px por cuerda en horizontal en el iPhone con Safari y aviso para girar. Falta validarlo en tu iPhone.')
w('- **V-04:** implementado entero: con el dedo, trastes de al menos 40 px. Lo que se ajusta es lo que se muestra; el zoom guardado se conserva (V-08).')
w('- **C-07:** implementado en la 0.3.0. Falta la prueba a mano en Windows y Android.')
w('- **G-05:** controles de 40 px también en Ajustes y Ajustes como diálogo. **Nueva excepción:** en vertical, por debajo de 660 px de alto, la navegación manda sobre los 40 px por cuerda (AR-05).')
w('- **C-01, C-03, C-04 y PL-04:** notas al día con la 0.3.0.\n')
w('### Detalle de la versión 1.11\n')
w('**Requisito nuevo 🆕** — C-07: el botón o gesto «atrás» del sistema cierra Ajustes o vuelve al área anterior, sin bloquear la salida desde la primera área. Etapa F3.2, prioridad media.\n')
w('**Requisitos modificados** — G-05, V-01, V-04, C-01, C-02, C-03, C-04, C-06')
w('- **C-06:** implementado y validado con `interfaz.md` v1.0: revisada por el auditor (AR-04) y aprobada por ti.')
w('- **V-01:** criterio concreto del aviso para girar y de los 40 px por cuerda en horizontal, exigidos con un alto útil de 268 px o más.')
w('- **V-04:** en pantallas táctiles, trastes de al menos 40 px (como mucho 8 a la vista en el iPhone en vertical). Pasa a parcial hasta F3.2.')
w('- **G-05:** el criterio incluye controles y casillas de al menos 40 × 40 px en pantallas táctiles.')
w('- **C-01, C-02, C-03 y C-04:** solo las notas, para describir la interfaz aprobada.\n')
w('**Decisión cerrada:** especificación de interfaz (C-06). Ver «Decisiones abiertas».\n')
w('### Detalle de la versión 1.10\n')
w('**Requisitos modificados** — S-07')
w('- **S-07:** pasa a implementado y validado. Los 161 sonidos del pack de nylon tienen licencia CC BY («Attribution»), con dos filtros de control a 0. Era lo único que faltaba.\n')
w('**Riesgos:** la licencia del audio pasa a resuelta.\n')
w('### Detalle de la versión 1.9\n')
w('**Requisitos modificados** — G-03, S-01, S-07')
w('- **G-03:** el Service Worker se queda en F6.2. En la Sesión 1 el iPhone usa la web con conexión.')
w('- **S-01:** el agudo de la acústica (hasta 14 semitonos de transporte) queda aceptado como limitación conocida.')
w('- **S-07:** licencia «Attribution 4.0» comprobada en tres sonidos del pack de nylon; falta la vista del pack entero.\n')
w('**Decisiones cerradas:** Service Worker → F6.2 · agudo de la acústica → aceptado. Ver «Decisiones abiertas».\n')
w('### Detalle de la versión 1.8\n')
w('**Requisitos modificados** — G-07, S-01, S-07, X-01')
w('- **G-07:** se limita a Windows y Android; en iPhone la autonomía llega por G-03. Límites de peso revisados: audio ≤ 1,45 MB y archivo ≤ 2 MB.')
w('- **X-01:** cumple. Todo está en GitHub, cada versión entra por pull request aprobado y F1 se cerró con `v0.1.5`.')
w('- **S-07:** la licencia del pack de nylon se revisa lo antes posible, como tarde al cerrar F3, porque el repositorio ya es público.')
w('- **S-01:** tu escucha del 19/10 queda registrada (V-05); el agudo de la acústica, como limitación conocida pendiente de tu decisión.\n')
w('**Decisiones nuevas:** Service Worker antes de la Sesión 1 o en F6.2; aceptar o no el agudo de la acústica. Ver «Decisiones abiertas».\n')
w('### Detalle de la versión 1.7\n')
w('**Requisitos modificados** — S-01, S-08')
w('- **S-08:** nueva redacción, aprobada por ti el 19/10. Exige ±5 cents a la nota que suena, una vez corregida la grabación, y que cada grabación sea su nota y esté medida. Antes lo exigía a la grabación sin corregir, lo que impedía usar las agudas de nylon, que se desvían 9 y 10 cents.')
w('- **S-01:** nylon con La♯5; transporte máximo de 6 semitonos en afinación estándar (14 en la acústica).\n')
w('### Detalle de la versión 1.6\n')
w('**Requisitos modificados** — G-07, G-08, S-07')
w('- **G-07:** implementado en la 0.2.1 con `dist/trasteando.html`, la app con el audio dentro. Se cierra el retroceso de la 0.2.0. Falta probarlo en cada plataforma (F2.5).')
w('- **G-08:** las dos formas de distribución existen ya de verdad, y el banco vigila que el autónomo esté al día.')
w('- **S-07:** la revisión de la licencia del pack de nylon, que estaba prevista antes de F2.3 y sigue pendiente, pasa a ser condición antes de publicar (F7).\n')
w('### Detalle de la versión 1.5\n')
w('**Requisitos modificados** — G-07, S-01, S-07, S-08')
w('- **S-08:** validado. Es el primer requisito que supera su prueba: la app usa sus grabaciones medidas y corrige su desviación.')
w('- **S-01:** suena con el reproductor propio; las 22 notas grabadas en el navegador, a menos de 1 cent.')
w('- **S-07:** la app ya no descarga audio de fuera. Sigue parcial hasta meter el audio en el archivo (F2.3) y revisar la licencia del pack de nylon.')
w('- **G-07:** retroceso temporal anotado: con doble clic suena el sintetizador hasta F2.3.\n')
w('### Detalle de la versión 1.4\n')
w('**Requisito nuevo** — PL-04: adaptabilidad entre sistemas operativos, a petición tuya. Su evidencia es `docs/compatibilidad.md`.\n')
w('**Requisitos modificados** — PL-02, X-02')
w('- **PL-02:** sin Android de pruebas por ahora; mantiene la prioridad Alta y se valida con el simulador de Chrome hasta tener uno.')
w('- **X-02:** se añade un despliegue de pruebas, sin anunciar, antes de la Sesión 1. La publicación oficial sigue en F7.1.\n')
w('**Decisiones cerradas:** despliegue de pruebas en `https` → sí, antes de la Sesión 1 · Android de pruebas → ninguno por ahora.\n')
w('### Detalle de la versión 1.3\n')
w('**Requisito nuevo** — S-08. Al medir la afinación de cada muestra en F2.1 apareció un archivo un semitono alto que la app usaba desde la 0.1.0. La afinación de las muestras pasa a ser un requisito medible, en lugar de suponerse. Tras CP-1 se redacta según la nota asignada, no el nombre del archivo, y queda sin validar hasta que la app use sus propias muestras.\n')
w('**Requisitos modificados** — S-01, S-07, G-06, G-03, PL-03, X-01\n')
w('- **S-01:** las muestras ya están en el proyecto y la 0.1.3 corrige el registro agudo de nylon.')
w('- **S-07:** pasa a parcial. Opción A decidida, licencias verificadas y archivos en `samples/`; falta que la app los use.')
w('- **G-06:** pasa a parcial con `CREDITOS.md`.')
w('- **PL-03:** el iPhone es el móvil de referencia; cómo se prueba hasta publicar.')
w('- **X-01:** repositorio reorganizado en local, pendiente de subir. Subirlo pasa a ser parada antes de F2.2.')
w('- **G-03** (CP-1): se valida en dos pasos, en `localhost` (F6.2) y desde la web (F7.2).')
w('- **G-06** y **PL-03** (CP-1): redacción. G-06 pide también mostrar los créditos en la app; PL-03 cierra un inciso.\n')
w('**Decisiones cerradas:** audio S-07 → opción A · móvil de referencia → iPhone · pista de automatización → modo acelerado por bloques. **Abiertas por CP-1:** despliegue de pruebas en `https` y Android de pruebas, cerradas en la 1.4.\n')
w('**Riesgos:** el de la licencia del audio queda resuelto en lo esencial, el de la dependencia de terceros pasa a mitigado y se añade el de muestras mal etiquetadas, ya resuelto. Ver «Riesgos».\n')
w('**Erratas:** la versión 1.2 remitía a las secciones 16 y 17 para riesgos y decisiones; son la 19 y la 20.\n')
w('**Auditoría CP-1:** los informes AR-02 y AT-02 están en `docs/auditorias/`, con la respuesta a cada hallazgo.\n')
w('**Valorado y descartado:** convertir en requisito las pruebas con el iPhone por WiFi. Es un método de verificación, no una propiedad del producto; queda en el roadmap y en la matriz.\n')
w('### Detalle de la versión 1.2\n')
w('**Cambios de modelo**\n')
w('- La columna *Publicado* pasa a llamarse **Validado**. El desarrollo es local hasta F7, así que la segunda casilla indica si el requisito ha superado su prueba. La publicación tiene requisitos propios (X-02, X-03).')
w('- Nuevas columnas **Etapa** (vínculo con el roadmap) y **Desde** (versión de la app en que quedó implementado).')
w('- Las versiones V1–V4 se sustituyen por las fases **F1–F7** del roadmap v3.0.')
w('- Nueva sección de **plataformas** y matriz de capacidades por modo de ejecución.\n')
w('**Requisitos nuevos** — G-07, G-08, G-09, G-10, G-11, PL-01, PL-02, PL-03, J-12\n')
w('**Requisitos modificados** — G-03, G-04, G-05, D-04, S-07, J-10, A-02, V-09, C-02, X-01, X-02, X-03\n')
w('**Decisiones:** se abren cinco nuevas (paleta, tiendas, licencia del código, pista de automatización y móvil de referencia). Ver «Decisiones abiertas».\n')
w('**Riesgos:** cuatro nuevos (iPhone y archivos locales, micrófono por WiFi, App Store y webs empaquetadas, verificación de Android con la web en subcarpeta).\n')
w('---\n')
w('## 3. Cómo leer este documento\n')
w('| Columna | Significado |')
w('|---|---|')
w('| **Prior.** | `Alta` imprescindible · `Media` importante, no bloqueante · `Baja` deseable |')
w('| **Etapa** | Etapa del roadmap que lo implementa o lo valida (por ejemplo `F2.3`). `·` separa dos etapas |')
w('| **Impl.** | ✅ implementado · 🟡 parcial · ⬜ pendiente |')
w('| **Valid.** | ✅ superó su prueba · ⬜ sin validar |')
w('| **Desde** | Versión de la app en que se implementó (ver `CHANGELOG.md`) |')
w('| Marcas | 🆕 nuevo en esta versión del documento · ✏️ modificado en esta versión |\n')
w('**Versiones de la app:** `0.‹fase›.‹corrección›`. La `0.1.x` corresponde a F1, la `0.2.x` a F2… y el lanzamiento será la `1.0.0`.\n')
w('---\n')
w('## 4. Objetivos del producto\n')
w('| ID | Objetivo | Descripción |')
w('|----|----------|-------------|')
w('| **O-01** | Aprendizaje del mástil | Que el usuario aprenda a identificar las notas en cualquier posición del diapasón, mediante exploración libre y juegos de refuerzo. |')
w('| **O-02** | Lectura musical | Que el usuario asocie cada posición del mástil con su representación en el pentagrama. |')
w('| **O-03** | Escalas | Que el usuario aprenda y practique escalas sobre el mástil, entendiendo su estructura interválica. |')
w('| **O-04** | Afinador multiafinación | Ofrecer un afinador gratuito con afinación estándar, alternativas comunes y personalizadas. |')
w('| **O-05** | Ritmo y acordes | Que el usuario practique a tempo con un metrónomo y consulte cómo se tocan los acordes más habituales, con qué dedo va cada nota (tu petición del 21/10). |\n')
w('---\n')

sec = 5
for code, title in CATS:
    rs = [r for r in R if r['cat']==code]
    w('## {}. {}\n'.format(sec, title)); sec += 1
    if code == 'PL':
        w('### Matriz de capacidades por modo de ejecución\n')
        w('| Capacidad | Archivo (`file://`) | Local (`localhost`) | Web (`https`) |')
        w('|---|:---:|:---:|:---:|')
        w('| Mástil, Adivinar y afinador por referencia | ✅ | ✅ | ✅ |')
        w('| Sonido real de guitarra | 🟡 con conexión hasta F2 · ✅ desde F2.3 | ✅ | ✅ |')
        w('| Guardar ajustes y récord | ✅ | ✅ | ✅ |')
        w('| Afinador por micrófono | ❌ | ✅ solo en el propio ordenador | ✅ |')
        w('| Funcionar sin conexión gestionado (Service Worker) | — no lo necesita si lleva el audio dentro | ✅ para pruebas | ✅ |')
        w('| Instalar como app | ❌ | 🟡 solo para pruebas | ✅ |\n')
        w('> Un móvil conectado por WiFi al Live Server del ordenador (`http://192.168…`) **no** es contexto seguro: funciona todo salvo el micrófono y la instalación.\n')
        w('### Requisitos de plataforma\n')
    w(HEAD)
    for r in rs: w(row(r))
    w('\n---\n')

# --- Trazabilidad ---
w('## {}. Matriz de trazabilidad por etapa\n'.format(sec)); sec += 1
w('Qué requisitos cierra o valida cada etapa del roadmap. Es la misma información que la columna *Etapa*, ordenada al revés.\n')
by_stage = defaultdict(list)
for r in R:
    for e in [x.strip() for x in r['etapa'].split('·')]:
        by_stage[e].append(r['id'])
def skey(s):
    if s == 'Posterior': return (99, 0)
    a, b = s[1:].split('.')
    return (int(a), int(b))
w('| Etapa | Requisitos |')
w('|---|---|')
for st in sorted(by_stage, key=skey):
    w('| **{}** | {} |'.format(st, ', '.join(by_stage[st])))
w('\n---\n')

w('## {}. Riesgos\n'.format(sec)); sec += 1
w('| Riesgo | Impacto | Estado | Mitigación |')
w('|--------|---------|--------|------------|')
risks = [
 ('**Dependencia de samples de terceros.** El audio se carga del repositorio personal de otra persona, sin versión fijada; si cambia, la app deja de sonar sin que toquemos nada.','Alto','✏️ Mitigado → F2.2','Las muestras ya están en `samples/` (F2.1). La app deja de descargarlas en F2.2.'),
 ('**Licencia del audio sin verificar.** Hay referencias contradictorias sobre si esos samples son de dominio público o CC-BY.','Medio','✅ Resuelto','Verificado en F2.1 y completado el 20/10: los 161 sonidos del pack de nylon son CC BY, y la edición de Brosowsky, CC BY 3.0. Apta para tiendas con atribución. Detalle en `CREDITOS.md`.'),
 ('🆕 **Muestras mal etiquetadas.** Un archivo que dice ser una nota y suena en otra enseña una nota equivocada sin que nadie lo note.','Alto','Resuelto','Pasó con el `D5.mp3` de nylon (0.1.2). S-08: cada muestra se mide antes de usarse y el banco lo vigila.'),
 ('🆕 **iPhone no ejecuta archivos HTML locales.** La vista previa de la app Archivos no ejecuta JavaScript, así que el modo archivo autónomo probablemente no sirve en iOS.','Medio','Abierto → F2.5','Confirmarlo en el dispositivo. Alternativas: navegador integrado de una app de terceros, o un despliegue de pruebas sin anunciar.'),
 ('🆕 **El micrófono no funciona por WiFi.** Desde el móvil contra el Live Server del ordenador (`http://192.168…`) no hay contexto seguro.','Medio','Conocido','A-02 en el móvil llega con la publicación (F7.2). Hasta entonces, el afinador por micrófono se usa en el ordenador.'),
 ('🆕 **App Store puede rechazar una web empaquetada.** Apple exige que la app aporte algo más que una web (funcionalidad mínima).','Medio','Abierto → F7.4','Llegar con funcionamiento sin conexión, audio y afinador propios. Decidir App Store con datos; empezar por Google Play y Microsoft Store.'),
 ('🆕 **Verificación de Android con la web en subcarpeta.** Para empaquetar en Google Play, el archivo de verificación de dominio debe estar en la raíz (`pdigue.github.io/.well-known/`), no en `/guitarra/`.','Bajo','Abierto → F7.4','Crear el repositorio de usuario `pdigue.github.io` o usar un dominio propio.'),
 ('La detección de tono es el componente más complejo del proyecto.','Alto','Mitigado','A-01 ya entrega el valor de «afinador» sin micrófono. A-02 va aislado en F4 con criterios de aceptación cerrados.'),
 ('La afinación como estado global afecta a todo el cálculo de notas.','Alto','Resuelto','Diseñado así desde el origen.'),
 ('El alcance de Escalas podía dispararse.','Medio','Resuelto','E-02 y E-05 acotados; lo demás en E-02b y E-05b.'),
 ('Documento y código desincronizados.','Medio','Resuelto','Columnas *Etapa* y *Desde*, y reconciliación en cada cierre de fase. Desde el 14/10 el chat de Desarrollo escribe directamente en el proyecto.'),
 ('`localStorage` no funciona en previsualizaciones de artefactos.','Bajo','Conocido','Probar la persistencia en local o en la web.'),
]
for a,b,c,d in risks: w('| {} | {} | {} | {} |'.format(a,b,c,d))
w('\n### Análisis de S-07: opciones para el audio\n')
w('| Opción | Esfuerzo | Resultado |')
w('|---|---|---|')
w('| **A.** Alojar los samples actuales tras verificar su licencia pieza por pieza. | Bajo | **Elegida el 14/10.** La verificación salió limpia: CC BY con atribución. |')
w('| **B.** Sustituirlos por samples de licencia inequívoca (CC0 o dominio público confirmado) y alojarlos. | Medio | Audio real y sin ambigüedad legal, sin grabar nada. Descartada al salir limpia la A. |')
w('| **C.** Grabar samples propios de nylon y de acero. | Alto | Cero dependencias y timbre propio, pero es un proyecto en sí mismo. Mejora futura. |')
w('| **D.** Usar el sintetizador como motor principal. | Nulo | Contradice S-01. |\n')
w('---\n')

w('## {}. Decisiones abiertas\n'.format(sec)); sec += 1
w('| # | Decisión | Afecta a | Plazo |')
w('|---|---|---|---|')
dec = [
 ('Licencia del código (MIT u otra)','G-06','Antes de F6.4'),
 ('Tiendas: cuáles y en qué orden','G-09','Antes de F7.4'),
]
for i,(a,b,c) in enumerate(dec,1): w('| {} | {} | {} | {} |'.format(i,a,b,c))
w('\n**Cerradas el 21/10:** metrónomo → área propia con su pestaña, no un chip (MT-05), con un solo acento en el primer tiempo (MT-02) · seis pestañas → aprobadas (`interfaz.md` §7b) · Adivinar al fallar → seguir intentando por defecto (J-13) · récord → uno por afinación (J-11) · idioma → español e inglés, elegible en Ajustes (G-12) · catálogo de escalas → mayor, menor natural y pentatónicas mayor y menor (E-01).')
w('**Cerradas el 20/10:** Service Worker → en F6.2, sin adelantarlo a la Sesión 1 · agudo de la acústica → aceptado como limitación conocida · C-06, especificación de interfaz → aprobada (`interfaz.md` v1.0) · paleta por nota → la elige el agente con tu criterio: naturales bien distintas y sostenidos derivados (F3.4).\n')
w('**Cerradas el 15/10:** despliegue de pruebas en `https`, sin anunciar → sí, antes de la Sesión 1 · Android de pruebas → ninguno por ahora; diseño pensado para todos los sistemas (PL-04).\n')
w('**Cerradas el 14/10:** S-07 → opción A, licencia verificada · móvil de referencia → iPhone · automatización → modo acelerado por bloques (F1–F3, sesión con el móvil, F4–F6, sesión con la guitarra, F7).\n')
w('**Cerradas antes:** nombre (*Trasteando*) · L-02 (ajuste del usuario) · J-10 (el fallo rompe la racha) · E-05 (solo pertenencia) · A-07 (cinco afinaciones) · V-01 (sugerir, no forzar).\n')
w('---\n')
w('*Documento gestionado por el chat de Desarrollo. Los chats auditores lo leen y proponen cambios en sus informes; no lo modifican. Cada cambio se anota en la sección 2 y se avisa al usuario.*')

open(OUT_MD,'w',encoding='utf-8').write('\n'.join(L)+'\n')
json.dump({'reqs':R,'cats':CATS,'phase_names':PH_NAME}, open(OUT_JSON,'w',encoding='utf-8'), ensure_ascii=False)
print('requisitos v1.25:', tot, '| impl', dict(ci), '| nuevos', len(nuevos), nuevos, '| mod', len(mods), mods)
