# Trasteando — Compatibilidad entre sistemas operativos

**Versión:** 1.7 · **Fecha:** 21 de octubre de 2026 · **Requisito:** PL-04 · **Gestiona:** chat de Desarrollo

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
| Instalar como app | Icono en la pantalla de inicio (G-04) | ✅ Edge, Chrome | ✅ | ✅ «Añadir a pantalla de inicio» | — |
| Icono de la app instalada | Que se vea el icono propio | ✅ | ✅ | ⚠️ exige PNG; hoy es SVG | Iconos PNG en F6.3 |
| Service Worker | Funcionar sin conexión desde la web (G-03) | ✅ | ✅ | ✅ | Solo con `https` o `localhost` |
| Micrófono (`getUserMedia`) | Afinador por micrófono (A-02, 0.4.0) | ✅ | ✅ | ✅ | Solo con `https` o `localhost`. Sin él (archivo, sin `https`, sin permiso) el modo Micrófono dice por qué y De oído sigue. En la app instalada del iPhone, a verificar con la web de pruebas |
| Sesión de audio «play-and-record» (`navigator.audioSession`) | Que el iPhone deje grabar mientras la app está en «playback» (0.4.0) | — | — | ✅ Safari 16.4+ | Se pone al encender el micrófono y se devuelve a «playback» al apagarlo; donde no existe, se omite |
| Analizador de audio (`AnalyserNode`) | Leer el sonido del micrófono (0.4.0) | ✅ | ✅ | ✅ | Parte de Web Audio |
| Hilo aparte (`Worker` desde un `Blob`) | Calcular la nota sin frenar la interfaz (0.4.0) | ✅ | ✅ | ✅ | Si no se puede crear, el detector va en el hilo principal: el mismo resultado, compartiendo tiempo con la interfaz |
| Bloquear la orientación | Forzar horizontal | ⚠️ | ⚠️ | ❌ | No se fuerza: desde la 0.3.0 un aviso discreto sugiere girar (V-01) |
| Tipo de puntero (`matchMedia('(pointer: coarse)')`) | Saber si se toca con el dedo: botones y trastes de 40 px, aviso para girar (0.3.0) | ✅ | ✅ | ✅ | Sin `matchMedia` se trata como ratón: la app funciona, con trastes de 34 px y sin el aviso |
| Historial (`history.pushState` y `popstate`) | Botón o gesto «atrás» dentro de la app (C-07, 0.3.0) | ✅ | ✅ | ✅ (la app instalada no tiene botón atrás) | Sin él, «atrás» hace lo de siempre: salir de la app |
| CSS `grid` y `display: contents` | Disposición en vertical, en horizontal y amplia (F3.2) | ✅ | ✅ | ✅ Safari 11.1+ | Todos los navegadores de referencia lo tienen |
| CSS `position: sticky` | Zoom siempre a la vista en el panel horizontal (0.3.0) | ✅ | ✅ | ✅ | Si faltara, el zoom se alcanza desplazando el panel |
| CSS `:has()` | Cursor de mano en las filas de Ajustes con interruptor (0.3.1) | ✅ | ✅ | ✅ Safari 15.4+ | Sin él, la fila funciona igual; solo no cambia el cursor |
| `scrollIntoView` con opciones | Que la casilla con el foco del teclado se vea (0.3.1) | ✅ | ✅ | ✅ | Sin opciones, el navegador desplaza igualmente al dar el foco |
| Golpes programados en el reloj de audio (`OscillatorNode`, `currentTime`) | Metrónomo exacto (MT-04, 0.5.4) | ✅ | ✅ | ✅ | Parte de Web Audio. Si el audio se rehace (iOS), el metrónomo se para en vez de sonar a destiempo |
| Ventana modal nativa (`<dialog>` y `showModal()`) | Ventana de compás del metrónomo: foco atrapado, Escape e inerte el resto (0.5.4) | ✅ | ✅ | ✅ Safari 15.4+ | Sin `showModal`, la ventana se enseña igual por encima; Escape y «atrás» la cierran desde la app |
| Captura del puntero (`setPointerCapture`) | Arrastrar la barra del tempo aunque el dedo se salga (0.5.4) | ✅ | ✅ | ✅ | Protegida: sin ella, la barra responde mientras el dedo siga encima |
| CSS `accent-color` y unidad `dvh` | Casilla del acento en ámbar; ventana que cabe con la barra del navegador (0.5.4) | ✅ | ✅ | ✅ Safari 15.4+ | Sin ellos, la casilla sale en el color del sistema y la ventana usa `vh` |
| Pantalla completa | Ocultar las barras del navegador | ✅ | ✅ | ❌ en Safari | La app instalada ya abre a pantalla completa |

✅ funciona · ⚠️ con matices · ❌ no disponible · — no aplica

## Control de cambios

| Versión | Fecha | Cambios |
|---|---|---|
| **1.7** | 21/10/2026 | Metrónomo (F5.6, 0.5.4): reloj de audio con osciladores, `<dialog>`, captura del puntero, `accent-color` y `dvh`; `:has()` también para centrar un solo punto. |
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
