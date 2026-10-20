# Trasteando — Compatibilidad entre sistemas operativos

**Versión:** 1.2 · **Fecha:** 20 de octubre de 2026 · **Requisito:** PL-04 · **Gestiona:** chat de Desarrollo

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
| Reanudar el audio tras una interrupción | Volver a sonar tras una llamada o un bloqueo | ✅ | ✅ | ⚠️ iOS lo deja en `interrupted` | `wakeAudio()` lo reanuda en cada nota (0.1.4) |
| Sonar con el interruptor de silencio puesto | Que suene el iPhone en silencio | — | — | ⚠️ Web Audio se calla | Desde la 0.2.0, `navigator.audioSession.type = 'playback'` si existe (Safari 16.4+). **Confirmado por el cliente en su iPhone el 19/10 (V-05).** Efecto: al sonar, la app interrumpe la música de otras apps |
| Leer las grabaciones del proyecto (`fetch`) | Cargar el audio | ✅ local y web | ✅ local y web | ✅ local y web | Con doble clic (`file://`) no se puede: por eso `dist/trasteando.html` lleva el audio dentro (0.2.1) |
| Eventos de puntero | Pulsar y arrastrar el mástil | ✅ | ✅ | ✅ | — |
| `localStorage` | Guardar ajustes y récord | ✅ | ✅ | ✅ | Si falla, la app funciona sin guardar |
| Vibración | Respuesta al fallar en Adivinar | — | ✅ | ❌ | Se omite; el color y el destello bastan (J-09) |
| Atributo `inert` | Que el panel cerrado no reciba el foco | ✅ | ✅ | ✅ | — |
| Abrir el archivo con doble clic (`file://`) | Modo archivo autónomo (G-07) | ✅ con `dist/trasteando.html` (0.2.1) | ⚠️ a verificar | ❌ la app Archivos no ejecuta JavaScript | En iPhone, la web o la app instalada |
| Instalar como app | Icono en la pantalla de inicio (G-04) | ✅ Edge, Chrome | ✅ | ✅ «Añadir a pantalla de inicio» | — |
| Icono de la app instalada | Que se vea el icono propio | ✅ | ✅ | ⚠️ exige PNG; hoy es SVG | Iconos PNG en F6.3 |
| Service Worker | Funcionar sin conexión desde la web (G-03) | ✅ | ✅ | ✅ | Solo con `https` o `localhost` |
| Micrófono | Afinador (A-02) | ✅ | ✅ | ✅ | Solo con `https` o `localhost`; en la app instalada de iPhone, a verificar en el despliegue de pruebas |
| Bloquear la orientación | Forzar horizontal | ⚠️ | ⚠️ | ❌ | No se fuerza: desde la 0.3.0 un aviso discreto sugiere girar (V-01) |
| Tipo de puntero (`matchMedia('(pointer: coarse)')`) | Saber si se toca con el dedo: botones y trastes de 40 px, aviso para girar (0.3.0) | ✅ | ✅ | ✅ | Sin `matchMedia` se trata como ratón: la app funciona, con trastes de 34 px y sin el aviso |
| Historial (`history.pushState` y `popstate`) | Botón o gesto «atrás» dentro de la app (C-07, 0.3.0) | ✅ | ✅ | ✅ (la app instalada no tiene botón atrás) | Sin él, «atrás» hace lo de siempre: salir de la app |
| CSS `grid` y `display: contents` | Disposición en vertical, en horizontal y amplia (F3.2) | ✅ | ✅ | ✅ Safari 11.1+ | Todos los navegadores de referencia lo tienen |
| CSS `position: sticky` | Zoom siempre a la vista en el panel horizontal (0.3.0) | ✅ | ✅ | ✅ | Si faltara, el zoom se alcanza desplazando el panel |
| Pantalla completa | Ocultar las barras del navegador | ✅ | ✅ | ❌ en Safari | La app instalada ya abre a pantalla completa |

✅ funciona · ⚠️ con matices · ❌ no disponible · — no aplica

## Control de cambios

| Versión | Fecha | Cambios |
|---|---|---|
| **1.2** | 20/10/2026 | Tipo de puntero, historial, `grid` y `display: contents`, y `position: sticky` (F3.2, 0.3.0). |
| 1.1 | 19/10/2026 | Lectura de grabaciones (`fetch`) y archivo autónomo (0.2.0 y 0.2.1). Interruptor de silencio confirmado en el iPhone y su efecto sobre otras apps (CP-2). |
| 1.0 | 15/10/2026 | Primera versión (PL-04). |

## Cómo se verifica

- **Inspección** en cada etapa: cada capacidad nueva entra en esta tabla con su alternativa.
- **Banco automático**: las pruebas arrancan la app sin vibración ni audio, como el caso más pobre, y la app debe funcionar.
- **Despliegue de pruebas** en `https` (decisión del 15/10): iPhone con la app instalada, modo sin conexión y, desde F4, micrófono.
- **Dispositivo real**: Sesión 1 (Windows e iPhone), Sesión 2 y F7.2. Android, cuando haya uno disponible.
