# Trasteando — Roadmap de ejecución

**Versión:** 4.10 · **Fecha:** 17 de noviembre de 2026
**Se actualiza:** al cerrar cada bloque (regla 5 de `CLAUDE.md`). Las versiones vigentes de la app y de los demás documentos están en `docs/ESTADO.md`.

> **Baseline 0.6.2** (tu decisión del 15/11): las fases hechas ocupan una línea; el detalle es solo para lo que queda. El roadmap completo hasta la v3.26, con la teoría de cada etapa, la pista T, el gobierno y los métodos de validación, está en `docs/historico/roadmap.md` (rama `archivo/hasta-0.6.2`).

---

## 1. Estado de un vistazo

📍 **Estás aquí:** F6 (F6.2 a F6.4 hechas; F6.4 a falta de tu aprobación), con F5.8 a falta de tu prueba en el móvil. `main` tiene la `0.6.13`; `auto/F6.4-privacidad`, la `0.6.14`.

**Leyenda:** ⬜ pendiente · ⏳ en curso · 🔨 hecha, sin tu prueba · ✅ validada · 📅 en una sesión contigo · ⏸ en pausa

| Fase | Qué dejó | Estado |
|---|---|:---:|
| **F1** · Base local · `0.1.x` | Mástil, Libre, Adivinar, afinador de referencia, Ajustes; banco de pruebas; etiqueta `v0.1.5` | ✅ |
| **F2** · Sonido propio · `0.2.x` | Grabaciones propias con licencia (S-07), afinación medida (S-08), archivo autónomo; etiqueta `v0.2.3` | ✅ |
| **F3** · Interfaz · `0.3.x` | `interfaz.md` aprobada, horizontal, accesibilidad, Sesión 1 (35 validados); etiqueta `v0.3.3` | ✅ |
| **F4** · Micrófono · `0.4.x` | Afinador por micrófono (YIN en un hilo), idioma; F4.3 espera tu prueba de 10 minutos con la guitarra | 🔨 |
| **F5** · Escalas, metrónomo y acordes · `0.5.x` | F5.1 a F5.7 y CP-5 hechos; F5.2 a F5.4, F5.6 y F5.7 esperan la Sesión 2; **F5.8 y F5.9, abajo** | ⏳ |
| **F6** · Preparación · `0.6.x` | F6.1 hecha (`0.6.0`, el autónomo pasa el banco); F6.2 hecha (`0.6.8`, sin conexión desde la web); F6.3 hecha (`0.6.9`, instalable); F6.4 hecha (`0.6.14`, privacidad, licencia y créditos) | 🔨 |
| **F7** · Publicación · `1.0.0` | **Abajo** | ⬜ |

**Sesión 2, con la guitarra** (antes de CP-6): escalas, metrónomo, acordes, afinador (V-09), el sonido en el iPhone (S-01) y el autónomo con doble clic en Windows (G-08).

---

## 2. Lo que queda de F5

### F5.8 · Saneamiento con tus comentarios (⏳)

Un bloque de trabajo por comentario, cada uno en su conversación (regla de `CLAUDE.md`). Lo nuevo entra como requisito nuevo, y se te avisa de cada cambio en requisitos.

| Bloque | Qué se hace | Requisitos | Estado |
|---|---|---|:---:|
| **#3 y #4** · Aspecto | Temas elegibles en Ajustes › Aspecto (Madera de fábrica, Automático y Partitura), disposición propia para tableta y ordenador, y en Adivinar las pistas en grande con la nota tocada pequeña | V-10, V-11 (nuevos) · J-01, J-06, C-02 | 🔨 `0.6.3`, PR #19 · a falta de tu prueba en el iPhone y el iPad |
| **#5** · Escalas | Las 4 escalas, una posición cada vez (3 notas por cuerda; 2 en las pentatónicas; la 1 en la tónica), tocar y escuchar, «Todas» y una Práctica nueva en orden | E-07 a E-10 (nuevos) · E-05 (retirado) · E-01, E-02, E-02b, E-03, E-04, E-05b, E-06, P-03 | 🔨 `0.6.4`, PR #20 · a falta de tu prueba |
| **#6** · Acordes | Menos a la vista; el dibujo como protagonista: se elige con dos filas, la nota y el tipo, y el mástil enseña en grande los trastes 0 a 5 | AC-07 (nuevo) · AC-03 y AC-06 (retirados) · AC-01 | 🔨 `0.6.6`, fusionado (PR #21) · a falta de tu prueba |
| **#7** · Metrónomo | Medido y corregido: 300 ms programados por adelantado (no se pierden golpes con tirones de hasta 0,25 s), los cambios y Parar rehacen lo ya apuntado, y la luz y el péndulo van con lo que se oye (latencia de salida descontada) | MT-04 | 🔨 `0.6.7`, PR #22 · a falta de tu prueba |
| **#9** · Pistas (16/11) | Que las pistas de Adivinar se lean enteras: la respuesta se mide y se ajusta (sin «…»), las cuerdas en números con el ordinal pequeño, en horizontal apiladas; el iPhone ya no agranda el texto al girarlo | J-06 | 🔨 `0.6.10`, PR #25 · a falta de tu prueba |
| **#10** · Controles a la vista (16/11) | «Ver la respuesta» ya no se sale en horizontal; en vertical, con pistas, las pestañas no se salen; zoom de inicio con las zonas seguras; raíl desplazable; aviso de fallo, «✗ ¡Prueba otra vez!» | J-14 (nuevo) · J-06, V-01, V-04, G-05 | 🔨 `0.6.12` y `0.6.13` (V-12, pistas de 26 px), PR #26 · a falta de tu prueba |
| **#8** · Propuestas | Las que apruebes (afinador cromático, Adivinar por niveles, reto inverso, rasgueo, arpegio y favoritos) | nuevos | ⬜ espera tu «sí» |

**Comentarios de F5.8** (AR-14 #5). La lista se cierra cuando lo digas o al empezar F5.9. Cada fila guarda tu comentario tal cual, qué aprobaste antes de programar y qué solo se te explicó.

| # | Tu comentario | Qué aprobaste (22/10) | Qué se te explicó, sin aprobar aún | Requisito | Versión | Estado |
|---|---|---|---|---|---|---|
| 1 | «Quiero que la barra del metronomo se mueva como hace un metronomo, oscilando de lado a lado e un rango acorde a un metronomo» | La pesa arriba, más lenta, como en uno mecánico; hacerlo ya | Hasta 30° a cada lado, un extremo en cada pulso, recta al arrastrarla y con «reducir movimiento». **Por decidir:** unos 13° en horizontal o una varilla más corta allí (AR-14 #2), y si ↑ sube el tempo o la pesa (AR-14 #8) | MT-06 (nuevo) | `0.6.1` | 🔨 hecho, a falta de tu prueba |
| 2 | «El afinador creo que solamente coge como un pico del sonido y no se queda (…) de forma un poquito más constante como hacen los afinadores de otras aplicaciones (…) que mantenga un poco más la escucha y marque si está o no en rango (…) por defecto aparezca la parte de micrófono, no de por oído» | Abrir en Micrófono; la pantalla encendida mientras escucha o suena («Sí», 12/11) | Cómo sigue la nota: filtro, ruido de fondo y lectura sostenida 2,5 s | A-02, A-02-CA, A-03 (mod.) · G-13 (nuevo) | `0.6.2` | 🔨 hecho, a falta de tu prueba |
| 3 | «coge referencias de aplicaciones actuales para que el looking de la app sea más limpio (…) estética un poco Apple (…) tanto en ordenador como en móvil, como también en iPad, que me he dado cuenta que no está preparado» | Temas elegibles en Ajustes (12/11). **15/11:** Madera de fábrica y los tres elegibles en Ajustes | Base visual por fichas de color y disposición propia para tableta (700 × 700 px o más) | V-10 y V-11 (nuevos) · C-02, C-08, PL-03, G-05 (mod.) | `0.6.3` | 🔨 hecho, a falta de tu prueba |
| 4 | «en la parte de adivinar, las pistas deberían salir en grande, aprovechando toda la franja (…) si tocamos una nota que es incorrecta, aparece el nombre de la misma (…) al ser este nombre mucho más grande que las pistas, se confunde un poco qué tenemos que buscar y cuál es la que hemos tocado» | — (12/11: recibido); hecho como se te propuso | Cada pista encendida ocupa su parte de la franja, en grande; la nota tocada, pequeña y en gris | J-01 y J-06 (mod.) | `0.6.3` | 🔨 hecho, a falta de tu prueba |
| 5 | «La parte de escala no me gustaba nada como es. Quiero simplificarla (…) menos escalas (…) no haya tanto de práctica, sino (…) ir pudiendo tocar las notas de la escala e ir escuchando la propia escala (…) No es agradable entrar ahí y ver el traste de la guitarra lleno de notas» | Se quedan las 4 escalas, mejor presentadas (12/11). **15/11:** 3 notas por cuerda, la 1 en la tónica, «Escuchar» a ritmo fijo, y recuperar «Todas» y una Práctica sencilla | Una posición cada vez en vez de todo el mástil, «Escuchar», «Todas» y Practicar en orden | E-07 a E-10 (nuevos) · E-05 (retirado) · E-05b y otros (mod.) | `0.6.4` | 🔨 hecho, a falta de tu prueba |
| 6 | «En cuanto a la parte de acordes, es igual, parece confuso y engorroso. Simplifícalo y mejora el looking» | **15/11:** el mástil acotado y grande, y elegir por nota y tipo (tus respuestas) | Sin pentagrama ni buscador en Acordes; las notas del acorde siguen junto al nombre | AC-07 (nuevo), AC-01; AC-03 y AC-06 retirados | `0.6.5` | 🔨 hecho, a falta de tu prueba |
| 7 | «el metrónomo no termina de funcionar del todo bien. Analízalo» | La pantalla encendida («Sí», 12/11): hecha en la `0.6.2` (G-13) | Lo que notas (12/11): a veces el pulso suena irregular y lo que se ve no va con el sonido; «no siempre, es una sensación: comprueba». **15/11, analizado:** se perdían golpes cuando el móvil se entretenía más de unos 75 ms (solo había 100 ms programados), y la luz se encendía con el sonido calculado, no con el que sale (la latencia del altavoz o de los auriculares Bluetooth). Medido en Chromium: 10 de 63 golpes perdidos con tirones; ahora, 0 | MT-04 | `0.6.7` | 🔨 hecho, a falta de tu prueba |
| 8 | «propongas nuevas mejoras de cara a implementarlas. Quiero ver un cambio claro a mejor en la app, tanto en funcionamiento como en contenido, como en looking, en un corto plazo» | — (12/11: recibido) | Lista de propuestas enviada el 12/11; cada una que apruebes entra como requisito nuevo | — | — | ⬜ recibido el 12/11 |
| 9 | «Antes, no se ven las cuerdas de pista, incluso peor en horizontal, adaptalos, mas pequeño o solo numero y los st etc pequeños etc no lo se. Optimiza los tamaños» (16/11, con capturas). Y después: «Mejor en una linea pero que sea una linea en ambos idiomas, dale mas espacio al margen con las pistas recortando un poco los trastes… algo conciso [para la frase]» | Números grandes con el ordinal pequeño; la respuesta se mide y se ajusta, sin «…»; en una sola línea en los dos idiomas, nunca menor que la nota que tocas (20 px); en horizontal, en Adivinar, panel de 204 px a costa de un poco de mástil; la frase, «Pulsa ▶, escucha y encuéntrala» | En horizontal, las pistas apiladas y la racha junto a ▶; «Ver la respuesta» en la fila de debajo; el iPhone ya no agranda el texto al girar | J-06 | `0.6.10`, `0.6.11` | 🔨 hecho, a falta de tu prueba |
| 10 | «Ademas de lo anterior ojo que e muestra la respuesta se sale de la pantalla. Revisa que todos los posibles controles quedan bien en todas las circunstancias / Tambien resuce el qording de cuando falla, tey it again es suficiente, o try again! Directamente» (16/11, con captura). Y sobre AR-22 #5: «ok crea el j14» | J-14 nuevo; el aviso de fallo, corto | Con las pistas, el aviso para girar se esconde en vertical; el zoom de inicio descuenta las zonas seguras | J-14 · J-06, V-01, V-04, G-05 | `0.6.12` | 🔨 hecho, a falta de tu prueba |

### F5.9 · Cierre (⬜)
Auditoría a fondo de lo que cambió en F5.8 y etiqueta `v0.5.x` en el commit que cierre la fase, aunque la app sea `0.6.n` (G-10).

---

## 3. Lo que queda de F6 · `0.6.x`

| Etapa | Qué se hace | Requisitos | Cómo se valida | Estado |
|---|---|---|---|:---:|
| **F6.2** | Service Worker para funcionar sin conexión desde la web | G-03 | Cargar, modo avión y seguir usándola (`herramientas/comprobar-sin-conexion.js`) | 🔨 parte de F6.2 (`localhost`, `0.6.8`): 9 de 9 en Chromium; G-03 se cierra en F7.2 (web publicada e iPhone instalado) |
| **F6.3** | Manifiesto propio e iconos | G-04 | Chrome no pone motivos en contra (`Page.getInstallabilityErrors`) y el manifiesto trae iconos de 192, 512 y «maskable» (`herramientas/comprobar-instalable.js`); antes decía «Lighthouse la da por instalable» (AR-21 #2) | 🔨 parte de F6.3 (`localhost`, `0.6.9`): Chrome la da por instalable, con la consulta que usaba Lighthouse más el criterio clásico de iconos, porque desde 2024 Chrome instala casi cualquier página y Lighthouse 12 retiró esa prueba (`herramientas/comprobar-instalable.js`, 13 de 13); G-04 se cierra en F7.2 (instalada desde la web publicada, en el iPhone y en Android) |
| **F6.4** | README, licencia del código, créditos en la app y privacidad | G-06, G-11 | Los cuatro existen y son coherentes | 🔨 `0.6.14`: `LICENSE` (todos los derechos reservados), `privacidad.html` (español e inglés, sin contacto), Ajustes → Acerca de y README; la política, pública en F7.1 |

### 🚦 CP-6 · Puerta de lanzamiento
Auditoría a fondo del producto completo, **antes** de publicar, contra el inventario de la sección 5. Salida: sí, no, o sí con condiciones.

---

## 4. F7 · Publicación y lanzamiento · `1.0.0`

En esta fase no se añade funcionalidad.

| Etapa | Qué se hace | Requisitos | Cómo se valida |
|---|---|---|---|
| **F7.1** | Activar GitHub Pages (oficial) | X-02 | La URL carga desde un dispositivo ajeno; G-08 reconfirmado contra ella |
| **F7.2** | Instalarla y usarla en Android, iPhone y Windows | G-03, G-04, PL-01 a PL-04, X-03 | Afinar una guitarra con el móvil y el ordenador apagado; en el iPhone, sin conexión desde Safari y desde la app instalada, también tras varios días sin abrirla |
| **F7.3** | Optimizar la carga | — | Lighthouse: usable en menos de 3 s en conexión móvil lenta |
| **F7.4** | Decidir tiendas y empaquetar | G-09 | Documento de decisión y, si se aprueba, ficha enviada |
| **F7.5** | Lanzar la `1.0.0` y retrospectiva | — | Etiqueta `v1.0.0` y lecciones aprendidas |

---

## 5. Inventario de lanzamiento

**Falta:** publicar `privacidad.html` con la app (F7.1) · comprobar que *Trasteando* no choca con una marca · fichas de tienda y capturas (F7.4) · `.well-known/assetlinks.json` en la raíz del dominio, para Android (F7.4) · un Mac con Xcode, solo si hay App Store.

| Cuenta | Coste | Notas |
|---|---|---|
| GitHub con GitHub Pages | Gratis | Ya la tienes |
| Microsoft Store (Partner Center) | Gratis para particulares desde septiembre de 2025 | — |
| Google Play Console | Cuota única de alta (25 USD según la ayuda de Google; confirmar al registrarse) | Las cuentas personales nuevas deben hacer una prueba cerrada con al menos 12 personas durante 14 días antes de publicar |
| Apple Developer Program | 99 USD al año | Revisión de Apple; riesgo de rechazo si la app no aporta más que una web |
| Dominio propio | Opcional, del orden de 10–15 € al año | Alternativa gratuita para Android: repositorio de usuario `pdigue.github.io` |

**Fuentes de las cuotas:** [Microsoft Store: registro gratuito para particulares](https://blogs.windows.com/windowsdeveloper/2025/09/10/free-developer-registration-for-individual-developers-on-microsoft-store/) · [Windows Central: Apple sigue cobrando 99 USD al año](https://www.windowscentral.com/microsoft/windows-11/microsoft-store-drops-fees-for-individual-developers-apple-still-charges-usd99-per-year/) · [Ayuda de Google Play: requisitos de prueba para cuentas personales](https://support.google.com/googleplay/android-developer/answer/14151465) · [Ayuda de Google Play: alta en Play Console](https://support.google.com/googleplay/android-developer/answer/6112435)

---

## 6. Decisiones pendientes y riesgos vivos

| Decisión | Bloquea | Plazo |
|---|---|---|
| ~~Licencia del código~~ | F6.4 | Decidida el 17/11: todos los derechos reservados; repositorio público (la web de pruebas de GitHub es gratis solo así); *issues* desactivados; privacidad sin contacto hasta F7 |
| Tiendas y orden | F7.4 | Antes de F7.4 |
| Péndulo: 13° en horizontal o varilla más corta; ↑ sube el tempo o la pesa (AR-14 #2, #8) | — | Cuando quieras |
| Propuestas de F5.8 #8 | F5.8 #8 | Cuando quieras |
| **Idea para después de la 1.0 (17/11):** cuentas de usuario (correo o Google), preferencias y récords guardados en la nube y ranking con amigos. Necesita un servidor con base de datos y política de privacidad con contacto; si se hace, también repositorio privado y un hospedaje que publique desde él | — | Después de F7 |

| Riesgo | Señal de alarma | Plan |
|---|---|---|
| El pulso del metrónomo se nota irregular (F5.8 #7) | Golpes desiguales o desfase con lo que se ve, sobre todo en el iPhone | Hecho en la `0.6.7`: 300 ms programados y la latencia descontada; queda confirmarlo en el iPhone, también con auriculares Bluetooth |
| Un tema baja el contraste | Textos por debajo de 4,5:1 | `comprobar-accesibilidad.js` con `TEMA` y `ESQUEMA` en los cuatro aspectos (G-05, V-10) |
| App Store rechaza la app | Rechazo por funcionalidad mínima | Empezar por Google Play y Microsoft Store |

---

## 7. Control de cambios del roadmap

El historial hasta la v3.26 está en `docs/historico/roadmap.md`.

| Versión | Fecha | Cambio |
|---|---|---|
| **4.10** | 17/11/2026 | F6.4 hecha (`0.6.14`): `LICENSE`, `privacidad.html`, créditos en Ajustes → Acerca de y README; sin aviso para girar (V-01). Fusionado el #26 (F5.8 #10). |
| 4.9 | 16/11/2026 | Tu comentario del 16/11 (F5.8 #10): ningún control fuera de la pantalla, en la `0.6.12`; J-14 nuevo. F6.2, F6.3 y F5.8 #9, fusionadas. |
| 4.8 | 16/11/2026 | Tu decisión del 16/11 (F5.8 #9): las pistas en una línea, el panel de Adivinar más ancho en horizontal y la frase del reto más corta, en la `0.6.11`. |
| 4.7 | 16/11/2026 | Tu comentario del 16/11 (F5.8 #9, pistas de Adivinar): hecho en la `0.6.10`. |
| 4.6 | 16/11/2026 | F6.3 hecha (`0.6.9`): manifiesto propio (`manifest.webmanifest`) e iconos PNG (192, 512, «maskable» y el del iPhone, de 180), comprobada instalable en `localhost` (13 de 13 en Chromium); G-04 queda parcial hasta la web publicada (F7.2). «Estás aquí», al día. |
| 4.5 | 16/11/2026 | F6.2 hecha (`0.6.8`): la app funciona sin conexión desde la web con un Service Worker (`sw.js`), comprobada en `localhost` (9 de 9 en Chromium); G-03 queda parcial hasta la web publicada (F7.2). |
| 4.4 | 15/11/2026 | F5.8 #7 hecho (`0.6.7`, PR #22): el metrónomo ya no pierde golpes con tirones y lo que se ve va con lo que se oye (MT-04); #6 fusionado (PR #21). |
| 4.3 | 15/11/2026 | F5.8 #6 hecho (`0.6.5`, PR #21): Acordes, elegidos por nota y tipo y dibujados en grande en los trastes 0 a 5 (tus respuestas del 15/11). |
| 4.2 | 15/11/2026 | F5.8 #5 hecho (`0.6.4`, PR #20): Escalas por posiciones, con «Escuchar», «Todas» y una Práctica nueva en orden (tus respuestas del 15/11). |
| 4.1 | 15/11/2026 | F5.8 #3 y #4 hechos (`0.6.3`, PR #19): temas (Madera de fábrica, tu decisión del 15/11), tableta y ordenador, y pistas grandes en Adivinar. |
| 4.0 | 15/11/2026 | Baseline 0.6.2: fases hechas en una línea; detalle solo de F5.8 #3 a #8, F5.9, F6.2 a F6.4 y F7; la tabla de comentarios de F5.8 se conserva tal cual. |
