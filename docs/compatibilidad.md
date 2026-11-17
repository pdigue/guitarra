# Trasteando — Compatibilidad entre sistemas operativos

**Versión:** 1.18 · **Fecha:** 17 de noviembre de 2026 · **Requisito:** PL-04 · **Gestiona:** chat de Desarrollo

La app se diseña para funcionar igual en **Windows, Android e iPhone**. Este documento lista cada capacidad del navegador que usa o usará, cómo se comporta en cada sistema y qué hace la app donde falta. Se revisa en cada etapa que añada una capacidad nueva.

## Reglas de diseño

1. **Solo estándares web**, sin código específico de un sistema. Navegadores de referencia: Chrome y Edge en Windows, Chrome en Android y Safari en iPhone (iOS 16.4 o posterior).
2. **Se detecta la capacidad, no el sistema.** Se pregunta «¿existe `navigator.vibrate`?», nunca «¿es un iPhone?». Así un sistema que añada la capacidad la aprovecha sin tocar el código.
3. **Toda capacidad que no es universal tiene alternativa.** Si falta, la app sigue funcionando y se explica dónde haga falta.
4. **El iPhone marca el mínimo**: es el móvil de referencia y el más restrictivo. Lo que funciona allí suele funcionar en los demás.
5. **Sin Android de pruebas por ahora** (decisión del 15/10): se valida con el simulador de dispositivos de Chrome (F12) como evidencia parcial, y en un Android real en cuanto haya uno, como tarde en F7.2.

## Capacidades

| Capacidad | Para qué | Windows | Android | iPhone | Si falta |
|---|---|:---:|:---:|:---:|---|
| Web Audio | Todo el sonido | ✅ | ✅ | ✅ | Sin alternativa: es la base |
| Reanudar el audio tras una interrupción | Volver a sonar tras una llamada o un bloqueo | ✅ | ✅ | ⚠️ iOS lo deja en `interrupted` | `wakeAudio()` lo reanuda en cada nota (0.1.4). **Sesión 1 (20/10):** en la app instalada, a veces el audio se queda mudo aunque diga «activo» y solo vuelve cerrando la app (fallo de Safari, WebKit 291892). Desde la 0.3.3, si al volver no se reanuda, el siguiente toque crea un audio nuevo, y Ajustes tiene «Reactivar sonido» |
| Sonar con el interruptor de silencio puesto | Que suene el iPhone en silencio | — | — | ⚠️ Web Audio se calla | Desde la 0.2.0, `navigator.audioSession.type = 'playback'` si existe (Safari 16.4+). **Confirmado por el cliente en su iPhone el 19/10 (V-05).** Efecto: al sonar, la app interrumpe la música de otras apps |
| Leer las grabaciones del proyecto (`fetch`) | Cargar el audio | ✅ local y web | ✅ local y web | ✅ local y web | Con doble clic (`file://`) no se puede: por eso `dist/trasteando.html` lleva el audio dentro (0.2.1) |
| Saber si la página está oculta (`visibilitychange`, `document.hidden`) | Callar y pausar el audio al bloquear o cambiar de app (0.3.3) | ✅ | ✅ | ✅ | Sin él, el sonido programado sonaría con la pantalla apagada, como en la 0.3.2 |
| Pausar y cerrar el audio (`AudioContext.suspend()` y `close()`) | Pausar al ocultar y rehacer el audio si iOS lo deja atascado (0.3.3) | ✅ | ✅ | ✅ | Cada llamada va protegida: si falla, la app sigue con el audio que tenga |
| Idioma del navegador (`navigator.language`) | Elegir español o inglés la primera vez (G-12, 0.4.2) | ✅ | ✅ | ✅ | Sin él, español; en Ajustes se cambia |
| Eventos de puntero | Pulsar y arrastrar el mástil | ✅ | ✅ | ✅ | — |
| `localStorage` | Guardar ajustes y récord | ✅ | ✅ | ✅ | Si falla, la app funciona sin guardar |
| Vibración | Respuesta al fallar en Adivinar | — | ✅ | ❌ | Se omite; el color y el destello bastan (J-09) |
| Atributo `inert` | Que el panel cerrado no reciba el foco | ✅ | ✅ | ✅ | — |
| Abrir el archivo con doble clic (`file://`) | Modo archivo autónomo (G-07) | ✅ con `dist/trasteando.html` (0.2.1) | ⚠️ a verificar | ❌ la app Archivos no ejecuta JavaScript | En iPhone, la web o la app instalada |
| Instalar como app (manifiesto web, `manifest.webmanifest`) | Icono en la pantalla de inicio y abrir a pantalla completa (G-04, manifiesto propio desde la 0.6.9) | ✅ Edge, Chrome; ❌ Firefox | ✅ Chrome lo ofrece | ✅ Safari: Compartir → «Añadir a pantalla de inicio» (toma del manifiesto el nombre y la pantalla completa, no el icono) | Solo con `https` o `localhost` y el Service Worker. Sin instalar, la app funciona igual en el navegador. El autónomo no lleva el manifiesto: desde el disco no se instala. En Android, la pantalla de arranque usa el fondo oscuro del manifiesto también con el tema claro (V-10) |
| Icono de la app instalada | Que se vea el icono propio | ✅ PNG de 192 y 512 | ✅ y el «maskable», que Android recorta a su forma | ✅ `apple-touch-icon` PNG de 180 px, sin transparencia (no acepta SVG) (0.6.9) | Si no encuentra el icono, el sistema pone una captura de la página. El Service Worker los guarda, para que instalada y sin red no lo pierda |
| Service Worker | Funcionar sin conexión desde la web (G-03, en uso desde la 0.6.8) | ✅ | ✅ | ⚠️ Safari borra lo guardado por un sitio que no se usa en unos 7 días, salvo la app añadida a la pantalla de inicio, que guarda aparte (hay que abrirla una vez con red desde el icono); en modo privado no se conserva | Solo con `https` o `localhost`; se registra solo si existe y nunca en el autónomo ni con `file://`. Sin él, o con la copia borrada, la app funciona igual con conexión. En el iPhone, sin conexión de forma fiable, instalada (G-04) |
| Caché del Service Worker (Cache Storage) | Guardar los 41 archivos de la app (0.6.9: 36 más el manifiesto y 4 iconos) | ✅ | ✅ | ⚠️ la misma regla de los 7 días | Si no cabe o falla un archivo, no se instala (todo o nada) y la app sigue pidiendo a la red |
| Micrófono (`getUserMedia`) | Afinador por micrófono (A-02, 0.4.0) | ✅ | ✅ | ✅ | Solo con `https` o `localhost`. Sin él (archivo, sin `https`, sin permiso) el modo Micrófono dice por qué y De oído sigue. En la app instalada del iPhone, a verificar con la web de pruebas |
| Sesión de audio «play-and-record» (`navigator.audioSession`) | Que el iPhone deje grabar mientras la app está en «playback» (0.4.0) | — | — | ✅ Safari 16.4+ | Se pone al encender el micrófono y se devuelve a «playback» al apagarlo; donde no existe, se omite |
| Analizador de audio (`AnalyserNode`) | Leer el sonido del micrófono (0.4.0) | ✅ | ✅ | ✅ | Parte de Web Audio |
| Hilo aparte (`Worker` desde un `Blob`) | Calcular la nota sin frenar la interfaz (0.4.0) | ✅ | ✅ | ✅ | Si no se puede crear, el detector va en el hilo principal: el mismo resultado, compartiendo tiempo con la interfaz |
| Bloquear la orientación | Forzar horizontal | ⚠️ | ⚠️ | ❌ | No se fuerza ni se sugiere: desde la 0.6.14, sin aviso para girar (V-01; de la 0.3.0 a la 0.6.13 lo había) |
| Tipo de puntero (`matchMedia('(pointer: coarse)')`) | Saber si se toca con el dedo: botones y trastes de 40 px (0.3.0; hasta la 0.6.13, también el aviso para girar) | ✅ | ✅ | ✅ | Sin `matchMedia` se trata como ratón: la app funciona, con trastes de 34 px y sin el aviso |
| Historial (`history.pushState` y `popstate`) | Botón o gesto «atrás» dentro de la app (C-07, 0.3.0) | ✅ | ✅ | ✅ (la app instalada no tiene botón atrás) | Sin él, «atrás» hace lo de siempre: salir de la app |
| CSS `grid` y `display: contents` | Disposición en vertical, en horizontal y amplia (F3.2) | ✅ | ✅ | ✅ Safari 11.1+ | Todos los navegadores de referencia lo tienen |
| CSS `position: sticky` | Zoom siempre a la vista en el panel horizontal (0.3.0) | ✅ | ✅ | ✅ | Si faltara, el zoom se alcanza desplazando el panel |
| CSS `:has()` | Cursor de mano en las filas de Ajustes con interruptor (0.3.1); centrar el punto único del metrónomo en 1/4 (0.5.4) | ✅ | ✅ | ✅ Safari 15.4+ | Sin él, la fila funciona igual; solo no cambia el cursor |
| Consultas de contenedor (`container-type`, unidad `cqw`) | Que la barra del metrónomo en horizontal se acorte lo justo para abrirse 30°, como en vertical (MT-06, 0.6.16) | ✅ | ✅ | ✅ Safari 16+ | Sin ellas, la barra ocupa todo el alto y se abre algo menos (lo calcula `amplitudPendulo()`), como hasta la 0.6.15 |
| `scrollIntoView` con opciones | Que la casilla con el foco del teclado se vea (0.3.1) | ✅ | ✅ | ✅ | Sin opciones, el navegador desplaza igualmente al dar el foco |
| Golpes programados en el reloj de audio (`OscillatorNode`, `currentTime`) | Metrónomo exacto (MT-04, 0.5.4) | ✅ | ✅ | ✅ | Parte de Web Audio. Si el audio se rehace (iOS), el metrónomo se para en vez de sonar a destiempo |
| Saber qué se oye ahora (`getOutputTimestamp()`; si no, `outputLatency` y `baseLatency`) | Que la luz y el péndulo del metrónomo vayan con el clic que se oye, no con el que se calcula (MT-04, 0.6.7) | ✅ | ✅ | ⚠️ `getOutputTimestamp` y `baseLatency` desde Safari 14.1; con auriculares Bluetooth, por confirmar en tu prueba | Se detecta qué hay: medida del navegador, latencias declaradas o, sin nada, el reloj de audio como antes (como mucho, 0,5 s de corrección) |
| Ventana modal nativa (`<dialog>` y `showModal()`) | Ventana de compás del metrónomo: foco atrapado, Escape e inerte el resto (0.5.4) | ✅ | ✅ | ✅ Safari 15.4+ | Sin `showModal`, la ventana se enseña igual por encima; Escape y «atrás» la cierran desde la app |
| Captura del puntero (`setPointerCapture`) | Arrastrar la barra del tempo aunque el dedo se salga (0.5.4) | ✅ | ✅ | ✅ | Protegida: sin ella, la barra responde mientras el dedo siga encima |
| CSS `accent-color` y unidad `dvh` | Casilla del acento en ámbar; ventana que cabe con la barra del navegador (0.5.4) | ✅ | ✅ | ✅ Safari 15.4+ | Sin ellos, la casilla sale en el color del sistema y la ventana usa `vh` |
| Mantener la pantalla encendida (Screen Wake Lock, `navigator.wakeLock`) | Que el móvil no se bloquee solo mientras suena el metrónomo o escucha el afinador (G-13, 0.6.2) | ✅ Chrome, Edge; Firefox 126+ | ✅ | Safari 16.4+ (en la app instalada, desde iOS 18.4). **A verificar** en tu iPhone (V-09, M8b) | Se detecta: sin ella, todo funciona igual y el metrónomo avisa de que, si la pantalla se apaga, se para. El sistema puede negarla (batería baja): se sigue sin ella y el metrónomo da el mismo aviso |
| Filtros de audio (`BiquadFilterNode`) | Limpiar el sonido del micrófono antes de analizarlo: fuera graves de menos de 60 Hz y agudos de más de 1200 Hz (A-02, 0.6.2) | ✅ | ✅ | ✅ | Parte de Web Audio. Si faltara `createBiquadFilter`, se analiza sin filtrar, como antes |
| Modo claro u oscuro del sistema (`matchMedia('(prefers-color-scheme: dark)')` y su evento `change`) | El tema «Automático» (V-10, 0.6.3): elegir claro u oscuro y seguir el cambio con la app abierta | ✅ | ✅ | ✅ (el evento, con `addListener` en Safari anterior a 14) | Sin `matchMedia`, «Automático» es oscuro; Madera y Partitura no lo necesitan |
| `color-scheme` y `meta theme-color` | Que los controles nativos y la barra del navegador vayan con el tema (0.6.3) | ✅ | ✅ | ✅ | Se ignoran: la app se ve igual, solo la barra del sistema no cambia de color |
| Tamaño de texto fijo (`text-size-adjust`) | Que el iPhone no agrande el texto por su cuenta al girar la pantalla (0.6.10) | — | ✅ | ✅ Safari, con `-webkit-` | Sin él, el texto puede salir más grande de lo previsto tras girar el móvil; la app sigue funcionando |
| Zonas seguras (`env(safe-area-inset-*)`), también para el zoom de inicio | En el iPhone instalado, la isla y la barra de inicio se descuentan del ancho del mástil al elegir cuántos trastes se ven (0.6.12) | — | ✅ | ✅ | Sin zonas seguras valen 0: se cuentan los trastes con todo el ancho, como en Windows y Android |
| Desplazamiento contenido (`overscroll-behavior`) | El raíl de pestañas se desplaza en pantallas muy bajas (280 px) sin arrastrar la página (0.6.12) | ✅ | ✅ | ✅ Safari 16 | Sin él, al llegar al final del raíl puede moverse la página; la app sigue igual. En una ventana de escritorio de menos de 520 px de alto, la barra de desplazamiento clásica estrecha el raíl: aceptado (AT-22 B2) |
| Medir el texto (`scrollWidth`, `clientWidth`) | Que la respuesta de una pista quepa entera, bajando su tamaño (J-06, 0.6.10) | ✅ | ✅ | ✅ | Estándar en todos; si el recuadro está oculto, se mide al verse |
| Avisar de cambios de tamaño (`ResizeObserver`) | Volver a encajar las pistas al girar, al cambiar la ventana o al aparecer «Ver la respuesta» (J-06, 0.6.10; AT-21) | ✅ | ✅ | ✅ desde Safari 13.1 | Sin él, se vuelve a encajar con el aviso de la ventana (`resize`) |
| Abrir otra página en una pestaña nueva (`<a target="_blank" rel="noopener">`) | La política de privacidad desde Ajustes → Acerca de (G-11, 0.6.14) | ✅ pestaña nueva; instalada, en el navegador | ✅ pestaña nueva; instalada, en una pestaña de Chrome sobre la app | ⚠️ a verificar: instalada, Safari la abre en una vista propia, encima de la app | Si se abre en la misma ventana, la política tiene «← Volver a Trasteando». `privacidad.html` no carga nada de fuera y el Service Worker la guarda: también sin red. En el autónomo, el enlace va a la web |
| `max()` en CSS | Que el ordinal de las cuerdas no baje de 11 px (0.6.10) | ✅ | ✅ | ✅ desde Safari 11.1 | Sin él, el ordinal es la mitad del número |
| Pantalla completa | Ocultar las barras del navegador | ✅ | ✅ | ❌ en Safari | La app instalada ya abre a pantalla completa |

✅ funciona · ⚠️ con matices · ❌ no disponible · — no aplica

## Control de cambios

| Versión | Fecha | Cambios |
|---|---|---|
| **1.18** | 17/11/2026 | F5.8 #11 (0.6.16): fila nueva, consultas de contenedor (`cqw`) para la barra del metrónomo en horizontal. |
| 1.17 | 17/11/2026 | F6.4 (0.6.14): fila nueva, abrir la política de privacidad en una pestaña nueva; sin aviso para girar (orientación y tipo de puntero). |
| 1.16 | 16/11/2026 | Tu comentario del 16/11 (0.6.12): zonas seguras en el zoom de inicio y `overscroll-behavior` en el raíl. Y `comprobar-disposicion.js` simula las zonas seguras del iPhone con Chromium (`Emulation.setSafeAreaInsetsOverride`). |
| 1.15 | 16/11/2026 | Tu comentario del 16/11 (0.6.10): `text-size-adjust`, para que el iPhone no agrande el texto al girarlo; medir el texto de las pistas para que quepa, `ResizeObserver` para volver a medir y `max()` en CSS. |
| 1.14 | 16/11/2026 | F6.3 (0.6.9, instalable): el manifiesto propio y los iconos PNG, en uso; Firefox de escritorio no instala; el iPhone toma el icono de `apple-touch-icon`; la pantalla de arranque de Android, oscura también con el tema claro. |
| 1.13 | 16/11/2026 | F6.2 (0.6.8, sin conexión desde la web): el Service Worker, en uso, con el aviso de Safari en el iPhone (AT-19 M2, AR-20 #1); fila nueva de la caché del Service Worker. |
| 1.12 | 15/11/2026 | F5.8 #7 (0.6.7, metrónomo): `getOutputTimestamp()`, `outputLatency` y `baseLatency` para que lo que se ve vaya con lo que se oye, con su alternativa. |
| 1.11 | 15/11/2026 | F5.8 #6 (0.6.5, Acordes): sin capacidades nuevas; la rejilla `grid` con `repeat(auto-fill, minmax())` y el atributo `disabled` son estándar en los tres sistemas (Safari 10.1+). |
| 1.10 | 15/11/2026 | F5.8 #5 (0.6.4, Escalas por posiciones): sin capacidades nuevas; solo temporizadores y desplazamiento del mástil, ya en uso en Acordes. |
| 1.9 | 15/11/2026 | Temas (V-10, 0.6.3, F5.8 #3): `prefers-color-scheme` con su evento `change`, `color-scheme` y `meta theme-color`. |
| 1.8 | 12/11/2026 | Screen Wake Lock (G-13) y filtros de audio para el micrófono (A-02), en la 0.6.2 (F5.8 #2). |
| 1.7 | 21/10/2026 | Metrónomo (F5.6, 0.5.4): reloj de audio con osciladores, `<dialog>`, captura del puntero, `accent-color` y `dvh`; `:has()` también para centrar un solo punto. |
| 1.6 | 21/10/2026 | Idioma del navegador (G-12, 0.4.2). |
| 1.5 | 21/10/2026 | Micrófono, sesión «play-and-record», `AnalyserNode` y `Worker` (F4, 0.4.0). |
| 1.4 | 20/10/2026 | `visibilitychange`, `suspend()` y `close()` del audio, y lo visto en el iPhone en la Sesión 1 (0.3.3). |
| 1.3 | 20/10/2026 | `:has()` y `scrollIntoView` con opciones (F3.4, 0.3.1). |
| 1.2 | 20/10/2026 | Tipo de puntero, historial, `grid` y `display: contents`, y `position: sticky` (F3.2, 0.3.0). |
| 1.1 | 19/10/2026 | Lectura de grabaciones (`fetch`) y archivo autónomo (0.2.0 y 0.2.1). Interruptor de silencio confirmado en el iPhone y su efecto sobre otras apps (CP-2). |
| 1.0 | 15/10/2026 | Primera versión (PL-04). |

## Cómo se verifica

- **Inspección** en cada etapa: cada capacidad nueva entra en esta tabla con su alternativa.
- **Banco automático**: las pruebas arrancan la app sin vibración ni audio, como el caso más pobre, y la app debe funcionar.
- **Despliegue de pruebas** en `https` (decisión del 15/10): iPhone con la app instalada, modo sin conexión y, desde F4, micrófono.
- **Dispositivo real**: Sesión 1 (Windows e iPhone), Sesión 2 y F7.2. Android, cuando haya uno disponible.
