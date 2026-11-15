# Trasteando — Especificación de Requisitos

**Versión del documento:** 2.1 · **Fecha:** 15 de noviembre de 2026  
**Válido para:** app `0.6.3` · `roadmap.md` v4.0 · `matriz-cumplimiento` v2.1 · fase en curso **F6** (F5 sigue abierta)  
**Repositorio:** github.com/pdigue/guitarra, carpeta `docs/` · **Gestiona:** chat de Desarrollo  
**Tipo de producto:** aplicación web progresiva (PWA), desarrollada en local y publicada al final del roadmap

---

## 1. Estado de un vistazo

| Total | ✅ Implementados | 🟡 Parciales | ⬜ Pendientes | ✅ Validados |
|:---:|:---:|:---:|:---:|:---:|
| 113 | 98 | 6 | 9 | 53 |

> Un requisito implementado no cuenta como cumplido hasta superar su prueba. El primero validado fue **S-08**, en la 0.2.0. La Sesión 1 (20/10, en tu iPhone y tu PC) validó 35 de golpe; lo que cambió la 0.3.3 y el sonido en el iPhone esperan a la Sesión 2.

| Fase | Objetivo | Requisitos | Implementados |
|------|----------|:---:|-----------|
| **F1** | Base local verificada | 59 | `▰▰▰▰▰▰▰▰▰▰` 59/59 |
| **F2** | Sonido propio y archivo autónomo | 9 | `▰▰▰▰▱▱▱▱▱▱` 4/9 |
| **F3** | Interfaz y adaptación | 6 | `▰▰▰▰▰▰▰▰▱▱` 5/6 |
| **F4** | Afinador por micrófono | 8 | `▰▰▰▰▰▰▰▰▰▰` 8/8 |
| **F5** | Escalas, metrónomo y acordes | 24 | `▰▰▰▰▰▰▰▰▰▰` 24/24 |
| **F6** | Preparación para distribución | 5 | `▰▰▱▱▱▱▱▱▱▱` 1/5 |
| **F7** | Publicación y lanzamiento | 9 | `▱▱▱▱▱▱▱▱▱▱` 0/9 |
| **Posterior** | Fuera del alcance actual | 4 | `▱▱▱▱▱▱▱▱▱▱` 0/4 |

*Un requisito puede aparecer en dos fases si se implementa en una y se valida o completa en otra.*

---

## 2. Control de cambios

El historial de la 1.0 a la 1.27, con el detalle de cada versión, está en `docs/historico/requisitos.md` (rama `archivo/hasta-0.6.2`). Esta serie empieza en la 2.0.

| Versión | Fecha | App | Roadmap | Resumen | Origen |
|---|---|:---:|:---:|---|---|
| **2.1** | 15/11/2026 | 0.6.3 | 4.0 | F5.8 #3 y #4: temas elegibles (V-10) y disposición para tableta y ordenador (V-11); en Adivinar, las pistas en grande y la nota tocada en pequeño (J-01, J-06); el grupo Aspecto en Ajustes (C-02); notas de C-08, PL-03 y G-05. 2 nuevos y 6 modificados: 113 en total. | Tus comentarios F5.8 #3 y #4 |
| 2.0 | 15/11/2026 | 0.6.2 | 4.0 | Baseline 0.6.2: mismos ID, textos, criterios, estados e implementación; cada nota se queda en lo vigente y lo pendiente de tu prueba. Corregido: en 13 requisitos la columna *Desde* llevaba la nota de la Sesión 1, que pasa a *Notas*. 111 en total. | Tu decisión del 15/11 |

**En la 2.1:** nuevos 🆕 V-10, V-11 · modificados ✏️ G-05, PL-03, J-01, J-06, C-02, C-08.

---

## 3. Cómo leer este documento

| Columna | Significado |
|---|---|
| **Prior.** | `Alta` imprescindible · `Media` importante, no bloqueante · `Baja` deseable |
| **Etapa** | Etapa del roadmap que lo implementa o lo valida (por ejemplo `F2.3`). `·` separa dos etapas |
| **Impl.** | ✅ implementado · 🟡 parcial · ⬜ pendiente |
| **Valid.** | ✅ superó su prueba · ⬜ sin validar |
| **Desde** | Versión de la app en que se implementó (ver `CHANGELOG.md`) |
| Marcas | 🆕 nuevo en esta versión del documento · ✏️ modificado en esta versión |

**Versiones de la app:** `0.‹fase›.‹corrección›`. La `0.1.x` corresponde a F1, la `0.2.x` a F2… y el lanzamiento será la `1.0.0`.

---

## 4. Objetivos del producto

| ID | Objetivo | Descripción |
|----|----------|-------------|
| **O-01** | Aprendizaje del mástil | Que el usuario aprenda a identificar las notas en cualquier posición del diapasón, mediante exploración libre y juegos de refuerzo. |
| **O-02** | Lectura musical | Que el usuario asocie cada posición del mástil con su representación en el pentagrama. |
| **O-03** | Escalas | Que el usuario aprenda y practique escalas sobre el mástil, entendiendo su estructura interválica. |
| **O-04** | Afinador multiafinación | Ofrecer un afinador gratuito con afinación estándar, alternativas comunes y personalizadas. |
| **O-05** | Ritmo y acordes | Que el usuario practique a tempo con un metrónomo y consulte cómo se tocan los acordes más habituales, con qué dedo va cada nota (tu petición del 21/10). |

---

## 5. Requisitos generales y de producto

| ID | Requisito | Prior. | Etapa | Impl. | Valid. | Desde | Notas |
|----|-----------|--------|-------|:-----:|:------:|:-----:|-------|
| **G-01** | La aplicación se llama *Trasteando*. El nombre aparece en la pantalla de entrada, el título de la pestaña y el manifiesto PWA. | Alta | F1.1 | ✅ | ✅ | 0.1.0 | Nombre «Trasteando» (se descartó *Trasting*); en horizontal va arriba del panel. Validado en la Sesión 1 (A01). |
| **G-02** | La app se organiza en áreas accesibles desde una navegación principal: Libre, Adivinar, Afinador, Escalas, Acordes y Metrónomo. | Alta | F1.1 | ✅ | ✅ | 0.1.0 | Seis áreas desde la 0.5.5. Validado en la Sesión 1 (A12). Pendiente: un registro de áreas, para que añadir una no obligue a tocar cinco sitios (AT-11 #4). |
| **G-03** | La app funciona sin conexión una vez cargada **desde la web**. | Media | F6.2 · F7.2 | ⬜ | ⬜ | — | Service Worker en F6.2 (en pausa en `auto/F6.2-service-worker`); se valida en `localhost` (F6.2) y desde la web publicada (F7.2). En modo archivo, el audio va dentro (G-07). |
| **G-04** | La app es instalable como PWA (icono en la pantalla de inicio, pantalla completa). | Alta | F6.3 · F7.2 | 🟡 | ⬜ | 0.1.0 | Hoy, manifiesto incrustado (`data:`). Falta el manifiesto con iconos PNG (F6.3) y probarla instalada desde `https` (F7.2). |
| **G-05** ✏️ | La interfaz cumple unos mínimos de accesibilidad: foco de teclado visible, respeto a `prefers-reduced-motion`, contraste suficiente y etiquetas accesibles en los controles solo-icono. | Media | F3.4 | ✅ | ✅ | 0.1.1 | Teclado completo con foco visible y el mástil como cuadrícula; textos a 4,5:1 o más; nada se anima con «reducir movimiento»; táctil de 40 px (28 px si se pide con «+»); paleta por nota apta para daltonismo. Desde la 0.6.3 los contrastes se miden en cada tema (V-10). Excepción: en vertical por debajo de 660 px de alto. Validado en la Sesión 1 (A18, C05, C06). |
| **G-06** | El proyecto documenta sus dependencias externas y la licencia de cada recurso de terceros que distribuye, y la app muestra los créditos. | Media | F2.1 · F6.4 | 🟡 | ⬜ | — | `CREDITOS.md` con origen, licencia y huella de cada muestra. Falta mostrar los créditos en la app y elegir la licencia del código (F6.4, decisión tuya). |
| **G-07** | **Modo archivo autónomo** en Windows y Android: la app funciona completa —salvo el afinador por micrófono— abriendo el archivo directamente (`file://`), sin servidor y sin conexión. En iPhone, donde no se pueden abrir páginas desde Archivos, la autonomía llega por G-03. | Alta | F2.3 · F2.5 | ✅ | ✅ | 0.2.1 | `dist/trasteando.html` con las 17 grabaciones dentro: audio ≤ 1,45 MB y archivo ≤ 2 MB; abre en 0,3 s en Chromium. Validado en la Sesión 1 (B02 a B04, C09). |
| **G-08** | El proyecto conserva **dos formas de distribución** equivalentes: el archivo autónomo (para llevárselo) y la web publicada (para instalarla como PWA). | Media | F4.1 · F6.1 | ✅ | ✅ | 0.1.0 | Dos formas: `index.html` (varios archivos) y `dist/trasteando.html` (autónomo, generado); desde la 0.6.0 el banco pasa las pruebas de la app contra las dos. Pendiente (AR-13): reconfirmarlo contra la web publicada (F7.1) y abrir el autónomo con doble clic en Windows, en modo avión (Sesión 2). |
| **G-09** | La app podrá distribuirse por **tiendas oficiales** —Google Play, Microsoft Store y, si compensa, App Store— empaquetando la PWA publicada. | Media | F7.4 | ⬜ | ⬜ | — | Decisión de producto en F7.4; exige S-07, G-11 y la web publicada. Cuentas y costes: roadmap, *Inventario de lanzamiento*. |
| **G-10** | **Control de versiones de la app:** cada versión tiene número propio con la pauta `0.‹fase›.‹corrección›` —`1.0.0` en el lanzamiento—, se registra en `CHANGELOG.md` y se muestra en Ajustes. | Alta | F1.3 | ✅ | ✅ | 0.1.2 | Cada fase cerrada lleva su etiqueta de Git (`v0.1.5`, `v0.2.3`, `v0.3.3`). Una fase reabierta numera con la fase más alta en `main`, y su etiqueta (`v0.5.x`) va en el commit que la cierra. Validado el 21/10. |
| **G-11** | **Privacidad:** la app no recoge ni envía datos personales; el sonido del micrófono se analiza solo en el dispositivo. Una política de privacidad pública lo declara. | Alta | F6.4 | ⬜ | ⬜ | — | Hoy la app no envía nada: solo guarda ajustes en el navegador. Falta la política pública (F6.4). |
| **G-12** | **Idioma de la interfaz:** la app está en español y en inglés, y se cambia en Ajustes. La primera vez sigue el idioma del navegador; la elección se guarda. | Media | F4.5 | ✅ | ⬜ | 0.4.2 | Ajustes › «Idioma · Language»; todos los textos en las dos lenguas (banco). Falta que veas la app en inglés. |
| **G-13** | **Pantalla encendida mientras se usa:** mientras suena el metrónomo o escucha el afinador, el dispositivo no apaga la pantalla ni se bloquea solo; al parar, vuelve a hacerlo como siempre. | Media | F5.8 | ✅ | ⬜ | 0.6.2 | Screen Wake Lock, detectado (PL-04): se pide al empezar y se suelta al parar; si falta o se niega, todo sigue y el metrónomo lo avisa. Falta tu prueba en el iPhone con el bloqueo automático en 30 s (V-09, M8b). |

---

## 6. Plataformas

### Matriz de capacidades por modo de ejecución

| Capacidad | Archivo (`file://`) | Local (`localhost`) | Web (`https`) |
|---|:---:|:---:|:---:|
| Mástil, Adivinar y afinador por referencia | ✅ | ✅ | ✅ |
| Sonido real de guitarra | 🟡 con conexión hasta F2 · ✅ desde F2.3 | ✅ | ✅ |
| Guardar ajustes y récord | ✅ | ✅ | ✅ |
| Afinador por micrófono | ❌ | ✅ solo en el propio ordenador | ✅ |
| Funcionar sin conexión gestionado (Service Worker) | — no lo necesita si lleva el audio dentro | ✅ para pruebas | ✅ |
| Instalar como app | ❌ | 🟡 solo para pruebas | ✅ |

> Un móvil conectado por WiFi al Live Server del ordenador (`http://192.168…`) **no** es contexto seguro: funciona todo salvo el micrófono y la instalación.

### Requisitos de plataforma

| ID | Requisito | Prior. | Etapa | Impl. | Valid. | Desde | Notas |
|----|-----------|--------|-------|:-----:|:------:|:-----:|-------|
| **PL-01** | **Windows:** la app funciona en Chrome, Edge y Firefox actuales —en modo archivo, local y web— e instalada como PWA desde Edge o Chrome. | Alta | F2.5 · F7.2 | 🟡 | ⬜ | 0.1.0 | Plataforma de desarrollo, la mejor cubierta. Tienda: Microsoft Store (F7.4). |
| **PL-02** | **Android:** la app funciona en Chrome —en web e instalada como PWA— y, si es viable, en modo archivo. | Alta | F2.5 · F7.2 | 🟡 | ⬜ | 0.1.0 | Sin Android de pruebas: se valida con el simulador de Chrome (parcial) y en uno real como tarde en F7.2. Tienda: Google Play (F7.4). |
| **PL-03** ✏️ | **iPhone y iPad:** la app funciona en Safari, en web e instalada con «Añadir a pantalla de inicio». | Alta | F2.5 · F7.2 | 🟡 | ⬜ | 0.1.0 | Móvil de referencia del proyecto. Se prueba en la web de pruebas (`https`); el modo archivo no es viable en el iPhone. Disposición propia para iPad desde la 0.6.3 (V-11). Tienda: App Store, que exige Mac con Xcode y cuenta de Apple (F7.4). |
| **PL-04** | **Adaptabilidad entre sistemas:** la app solo usa estándares web; detecta cada capacidad en lugar del sistema, y toda capacidad que no esté en Windows, Android e iPhone tiene alternativa, de modo que la app sigue funcionando donde falta. | Alta | F2.2 · F3.2 · F7.2 | 🟡 | ⬜ | 0.1.4 | Solo estándares y detección de capacidades; inventario y alternativas en `docs/compatibilidad.md`, revisado en cada etapa que añade una capacidad. El banco arranca la app sin las opcionales. |

---

## 7. Nomenclatura y notación

| ID | Requisito | Prior. | Etapa | Impl. | Valid. | Desde | Notas |
|----|-----------|--------|-------|:-----:|:------:|:-----:|-------|
| **N-01** | Alternancia entre nomenclatura latina (Do, Re, Mi…) y anglosajona (C, D, E…). | Alta | F1.1 | ✅ | ✅ | 0.1.0 | Validado en la Sesión 1 (A06). |
| **N-02** | El cambio de nomenclatura está en el menú de configuración. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | — |
| **N-03** | El cambio de nomenclatura está **además** en la interfaz principal, sin abrir el menú. | Alta | F1.1 | ✅ | ✅ | 0.1.0 | Chip en la barra de acceso rápido. Validado en la Sesión 1 (A06). |
| **N-04** | La nomenclatura se aplica de forma consistente en mástil, juego, afinador y pentagrama. | Alta | F1.1 | ✅ | ✅ | 0.1.0 | Incluye Escalas (tónicas, nombres e intervalos). Validado en la Sesión 1 (A06). |
| **N-05** | La nomenclatura persiste entre sesiones. | Media | F1.1 | ✅ | ⬜ | 0.1.0 | `localStorage`. |
| **N-06** | Cada nota alterada (las cinco teclas negras) se escribe con sostenido o con bemol según elijas en Ajustes, igual en toda la app; dentro de una escala manda la escala. | Media | F5.5 | ✅ | ✅ | 0.5.2 | Ajustes › Notación › Notas alteradas; ♯ y ♭ en toda la app; en Escalas manda la escala. Validado por el banco. Pendiente: quitar `LATIN` y los campos `anglo` y `latin` de `noteInfo()`, sin uso (AT-11 #10). |

---

## 8. Diapasón

| ID | Requisito | Prior. | Etapa | Impl. | Valid. | Desde | Notas |
|----|-----------|--------|-------|:-----:|:------:|:-----:|-------|
| **D-01** | Diagrama del mástil de 6 cuerdas. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | — |
| **D-02** | Cada cuerda muestra a la izquierda su nota al aire, derivada de la afinación activa. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | Se actualiza al cambiar de afinación (A-10). |
| **D-03** | Cada traste muestra su número alineado exactamente sobre la franja donde se pulsa. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | Números y celdas comparten las variables `--label-w`, `--nut-w` y `--fret-w`. |
| **D-04** | La numeración de trastes tiene **tres modos**: todos, guía (solo los trastes con marca) y ninguno. | Media | F1.3 | ✅ | ✅ | 0.1.2 | Validado en la Sesión 1 (A11). |
| **D-05** | Al pulsar una posición suena esa nota. | Alta | F1.1 | ✅ | ✅ | 0.1.0 | Validado en la Sesión 1 (A03, E03). |
| **D-06** | Al pulsar una posición aparece el nombre de la nota en la nomenclatura activa. | Alta | F1.1 | ✅ | ✅ | 0.1.0 | Validado en la Sesión 1 (E03). |
| **D-07** | Marcadores de posición en los trastes habituales (3, 5, 7, 9, 12, 15, 17, 19, 21, 24). | Media | F1.1 | ✅ | ⬜ | 0.1.0 | — |

---

## 9. Sonido

| ID | Requisito | Prior. | Etapa | Impl. | Valid. | Desde | Notas |
|----|-----------|--------|-------|:-----:|:------:|:-----:|-------|
| **S-01** | El sonido corresponde a una guitarra real, no a un sintetizador genérico. | Alta | F1.1 · F2.2 · F2.4 | ✅ | ⬜ | 0.1.0 | Grabaciones de `samples/`; en estándar ninguna nota se transporta más de 6 semitonos (la acústica, hasta 14 por encima del Re5: limitación aceptada el 20/10). Al ocultar la app el audio se pausa y se rehace si iOS lo deja mudo; Ajustes tiene «Reactivar sonido». Se valida si la Sesión 2 confirma que no vuelve a quedarse mudo. |
| **S-02** | El usuario elige entre guitarra clásica (nylon) y acústica (acero). | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | Cambiar de timbre descarga el otro juego de muestras, con aviso y sin hacer sonar una nota (0.3.3, se confirma en la Sesión 2). |
| **S-03** | La selección de timbre está en el menú de configuración. | Alta | F1.1 | ✅ | ✅ | 0.1.0 | Validado en la Sesión 1 (A14). |
| **S-04** | Si los samples no cargan, la app sigue sonando por síntesis. | Media | F1.1 | ✅ | ⬜ | 0.1.0 | Karplus-Strong con filtros de caja; cada nota se calcula una vez. |
| **S-05** | El primer sonido requiere una interacción explícita del usuario. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | Lo impone la reproducción automática de los navegadores. |
| **S-06** | El timbre persiste entre sesiones. | Media | F1.1 | ✅ | ⬜ | 0.1.0 | — |
| **S-07** | Los samples de audio se alojan en el propio proyecto, con licencia verificada y documentada. | Alta | F2.1 · F2.3 | ✅ | ✅ | 0.2.3 | Opción A (14/10): 17 grabaciones en `samples/`, licencia CC BY verificada y atribución en `CREDITOS.md`; ninguna petición de audio sale del dominio propio (banco). |
| **S-08** | Cada nota suena a menos de **5 cents** de su frecuencia, una vez corregida la desviación medida de su grabación. Cada grabación que usa la app es la nota a la que está asignada y tiene su desviación medida. | Alta | F2.1 · F2.2 · F2.4 | ✅ | ✅ | 0.1.3 | La app corrige cada grabación con su medida; el banco comprueba todas las notas posibles a ±0,5 cents (V-02 a V-04). |
| **S-09** | El timbre se parece más al de una guitarra real: grabaciones de más calidad o más notas grabadas por cuerda. | Baja | Posterior | ⬜ | ⬜ | — | Tu comentario de la Sesión 1: suena distinto a tu guitarra. Exige otro banco de grabaciones con licencia libre (S-07), medirlo (S-08) y tu escucha. |

---

## 10. Pentagrama

| ID | Requisito | Prior. | Etapa | Impl. | Valid. | Desde | Notas |
|----|-----------|--------|-------|:-----:|:------:|:-----:|-------|
| **P-01** | Al pulsar una nota en el mástil, se representa en el pentagrama. | Alta | F1.1 | ✅ | ✅ | 0.1.0 | Clave de sol octavada con trazado propio; 8va, 15ma u 8vb en los extremos; la lectura tiene alto fijo. Validado en la Sesión 1 (A05). |
| **P-02** | El pentagrama se puede mostrar u ocultar. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | En Ajustes y en el acceso rápido. |
| **P-03** | El pentagrama está disponible en todos los modos de aprendizaje. | Media | F5.3 | ✅ | ⬜ | 0.5.0 | Libre, Adivinar y Escalas (la escala entera, con sus alteraciones). |
| **P-04** | En el afinador, la afinación seleccionada se muestra como seis notas en un pentagrama. | Media | F1.1 | ✅ | ✅ | 0.1.0 | Validado en la Sesión 1 (A13). |

---

## 11. Modo Libre

| ID | Requisito | Prior. | Etapa | Impl. | Valid. | Desde | Notas |
|----|-----------|--------|-------|:-----:|:------:|:-----:|-------|
| **L-01** | El modo por defecto al abrir la app es el diapasón libre. | Alta | F1.1 | ✅ | ✅ | 0.1.0 | Validado en la Sesión 1 (A01). |
| **L-02** | El usuario decide si ve el nombre de todas las notas del mástil o solo el de la que pulsa. | Alta | F1.1 | ✅ | ✅ | 0.1.0 | Por defecto, solo la pulsada; en Adivinar no se aplica (J-12). Validado en la Sesión 1 (A10). |
| **L-03** | Al pulsar una nota se señalan discretamente las demás posiciones que producen **exactamente la misma nota** (mismo sonido, no misma clase de nota). | Media | F1.1 | ✅ | ✅ | 0.1.0 | Contorno sin relleno, más tenue que la pulsada; con «Ver todas las notas», anillo claro. Validado en la Sesión 1 (E03). |

---

## 12. Modo Adivinar

| ID | Requisito | Prior. | Etapa | Impl. | Valid. | Desde | Notas |
|----|-----------|--------|-------|:-----:|:------:|:-----:|-------|
| **J-01** ✏️ | Suena una nota aleatoria y el usuario busca su posición en el mástil. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | Retos en los 12 primeros trastes; no suena nada hasta pulsar ▶, que después repite. La nota que tocas se lee en pequeño desde la 0.6.3 (F5.8 #4), para no competir con la buscada; la buscada, solo con la pista de nombre (J-06) o al responder. Lo de la 0.3.3 se confirma en la Sesión 2. |
| **J-02** | Se acepta como acierto cualquier posición que produzca esa nota exacta. | Alta | F1.1 | ✅ | ✅ | 0.1.0 | Validado en la Sesión 1 (E04). |
| **J-03** | Tras acertar se señalan las demás posiciones válidas. | Media | F1.1 | ✅ | ✅ | 0.1.0 | Reutiliza L-03. Validado en la Sesión 1 (E04). |
| **J-04** | Pista opcional: nombre de la nota que suena. | Alta | F1.1 | ✅ | ✅ | 0.1.0 | Validado en la Sesión 1 (E04). |
| **J-05** | Pista opcional: cuerda o cuerdas donde puede encontrarse. | Alta | F1.1 | ✅ | ✅ | 0.1.0 | Validado en la Sesión 1 (E04). |
| **J-06** ✏️ | Las pistas se activan desde la propia interfaz, sin abrir el menú. | Alta | F1.1 | ✅ | ✅ | 0.1.0 | Las dos pistas son «esta nota en esta cuerda»; ninguna, «de oído». Encendida, cada pista ocupa su parte de la franja, con la respuesta en grande y borde discontinuo (0.6.3, F5.8 #4). Validado en la Sesión 1 (E04). |
| **J-07** | Contador de racha visible durante el juego. | Alta | F1.1 | ✅ | ✅ | 0.1.0 | Validado en la Sesión 1 (E04). |
| **J-08** | El récord de racha más larga persiste entre sesiones. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | `localStorage`, un récord por afinación (J-11); «Restablecer» lo conserva y se borra con su propio botón. Lo de la 0.3.3 se confirma en la Sesión 2. |
| **J-09** | Feedback visual inmediato de acierto y de error. | Alta | F1.1 | ✅ | ✅ | 0.1.0 | Color en la posición pulsada y destello en la barra del reto. Validado en la Sesión 1 (A09, E04). |
| **J-10** | Al fallar se indica cuál era la posición correcta. | Media | F1.3 | ✅ | ⬜ | 0.1.2 | El fallo rompe la racha. Con «Al fallar: Ver la respuesta», a 1,2 s se marcan las correctas (verde ✓, el fallo en rojo ✗), suena la buscada y a 3 s llega el reto siguiente; se confirma en la Sesión 2. Pendiente: describirlo así en el criterio y en `interfaz.md` A2 (AR-12 #7). |
| **J-11** | Cada afinación tiene su propio récord de racha. | Media | F4.4 | ✅ | ✅ | 0.4.1 | Decidido el 21/10: por afinación (una racha en DADGAD no se compara con una en estándar). Validado por el banco. |
| **J-12** | Los ajustes que revelan la respuesta —ver todas las notas— no se aplican en Adivinar. | Alta | F1.3 | ✅ | ✅ | 0.1.2 | Con «ver todas las notas», el juego enseñaba la solución. Validado en la Sesión 1 (A10). |
| **J-13** | Al fallar en Adivinar, por defecto sigues intentándolo hasta que aciertes o pidas «Ver la respuesta»; en Ajustes puedes elegir que la respuesta se enseñe nada más fallar. Acertar tras fallar pasa al reto siguiente sin sumar a la racha. | Media | F5.5 | ✅ | ✅ | 0.5.1 | Ajustes › Adivinar › «Al fallar»: Ver respuesta o Reintentar (de fábrica desde la 0.5.3). Validado por el banco. |

---

## 13. Escalas

| ID | Requisito | Prior. | Etapa | Impl. | Valid. | Desde | Notas |
|----|-----------|--------|-------|:-----:|:------:|:-----:|-------|
| **E-01** | Selección de escala a practicar (tónica + tipo). | Alta | F5.2 | ✅ | ⬜ | 0.5.0 | Mayor, menor natural y las dos pentatónicas, en las 12 tónicas, con la tónica escrita según el tipo. Falta que lo veas. F5.8 #5 (decidido): se quedan las 4, mejor presentadas. |
| **E-02** | El generador de escalas opera **solo en afinación estándar** en la primera entrega. | Alta | F5.2 | ✅ | ⬜ | 0.5.0 | Las 24 mayores y menores, con siete letras distintas, y 16 comparadas con el libro (banco). Pendiente: las 48 contra una tabla de referencia y en el mástil (AR-12 #4); error claro con una alteración fuera de ±2 (AT-11 #9); confirmar que vale en otras afinaciones (AR-12 #9). |
| **E-02b** | Escalas en afinaciones alternativas y variantes de digitación (por ejemplo, escala en octavas). | Media | Posterior | ⬜ | ⬜ | — | Fuera del alcance de F5. |
| **E-03** | Submodo Mostrar: la app ilumina las notas que componen la escala. | Alta | F5.3 | ✅ | ⬜ | 0.5.0 | Solo las notas de la escala, con su nombre escrito y la tónica con anillo. Falta que lo veas. |
| **E-04** | En Mostrar se indica el nombre de cada nota y su separación interválica respecto a la anterior. | Alta | F5.3 | ✅ | ⬜ | 0.5.0 | Línea «Do T Re T Mi ST Fa…» sobre el paso a paso; T½ en las pentatónicas. Falta que lo veas. Pendiente: T, ST y T½ en inglés, y que T½ no se lea como medio tono (AR-12 #8). |
| **E-05** | Submodo Práctica: valida **solo la pertenencia** de la nota a la escala; al pulsar una ajena, marca error e ilumina las correctas. | Alta | F5.4 | ✅ | ✅ | 0.5.0 | Cada nota distinta cuenta una vez; una ajena, en rojo; empieza de nuevo al cambiar de afinación. Validado por el banco; falta con la guitarra (Sesión 2). |
| **E-05b** | Validación del orden de la escala y de patrones de digitación concretos. | Media | Posterior | ⬜ | ⬜ | — | Fuera del alcance de F5. |
| **E-06** | Guiado nota a nota en el submodo Mostrar. | Media | F5.3 | ✅ | ⬜ | 0.5.0 | ◀ ▶ de la tónica más grave a su octava, con sonido, resalte y explicación. Falta que lo veas. Pendiente: con afinaciones muy graves el pentagrama cambia de octava a mitad (AT-11 #3). |

---

## 14. Metrónomo

| ID | Requisito | Prior. | Etapa | Impl. | Valid. | Desde | Notas |
|----|-----------|--------|-------|:-----:|:------:|:-----:|-------|
| **MT-01** | **Metrónomo:** tempo de 30 a 250 pulsos por minuto con una barra vertical, − y + y «Marcar» (tocando a ritmo), con su nombre italiano (Lento, Andante, Allegro…); arranca y para con un toque. | Media | F5.6 | ✅ | ⬜ | 0.5.4 | Área propia, igual en vertical y en horizontal; la barra es un péndulo (MT-06). Validado por el banco; falta con la guitarra (Sesión 2). Pendiente: mostrar la figura del tempo («♩. = 80» en 6/8) y citar los tramos de los nombres italianos (AR-12 #11). |
| **MT-02** | Compás elegible entre 1/4, 2/4, 3/4, 4/4, 5/4, 6/4, 3/8, 5/8, 6/8, 7/8, 9/8 y 12/8, en una ventana que se abre al tocar el compás; un punto por pulso (en 6/8, 9/8 y 12/8 el pulso es la negra con puntillo: dos, tres o cuatro puntos), y acento en el primer tiempo, que se puede quitar. | Media | F5.6 | ✅ | ✅ | 0.5.4 | Un solo acento, en el primer tiempo, activo por defecto. Validado por el banco; falta con la guitarra (Sesión 2). |
| **MT-03** | Subdivisión elegible con figuras en la misma ventana: solo el pulso, dos, tres o cuatro golpes por pulso; la subdivisión suena más suave que el pulso. | Media | F5.6 | ✅ | ✅ | 0.5.4 | En los compuestos, tres golpes por pulso son las corcheas. Validado por el banco; falta con la guitarra (Sesión 2). |
| **MT-04** | Cada golpe se programa con el reloj de audio, con menos de 1 ms de desviación frente al tempo, y la pantalla marca el tiempo en curso. Se para al ocultar la app. | Media | F5.6 | ✅ | ✅ | 0.5.4 | Reloj de audio; arranca aunque el iPhone deje el audio en pausa (0.5.7). F5.8 #7: notas a veces el pulso irregular y desfase con lo que se ve; sospechosos, solo 100 ms programados por adelantado y la latencia de salida sin descontar (AT-11 #2, #5). Pendiente también: medir 60 s a 250 ppm (AR-12 #3) y desconectar los osciladores (AT-11 #6). |
| **MT-05** | El metrónomo es un **área propia**, con su pestaña en la navegación principal. Sigue sonando al pasar a Libre, Adivinar, Escalas o Acordes hasta que lo pares, y su pestaña late con el pulso mientras suena. Recuerda el último tempo, compás, figura y acento en el primer tiempo. | Media | F5.6 | ✅ | ⬜ | 0.5.4 | Pestaña propia (`interfaz.md` §7b); se para al escuchar con el micrófono, porque su clic confundiría al detector. Validado por el banco; falta con la guitarra (Sesión 2). |
| **MT-06** | La barra del tempo es un **péndulo**, como la de un metrónomo mecánico: la pesa marca el tempo, arriba más lento y abajo más rápido; mientras suena, la barra oscila sobre su pie y llega a un extremo en cada pulso, alternando los lados, hasta 30° a cada lado sin salirse de la pantalla. Se queda recta parada, mientras se arrastra y con «reducir movimiento». Tocar la pesa donde se ve, aunque esté inclinada, no cambia el tempo; solo arrastrarla. | Baja | F5.8 | ✅ | ⬜ | 0.6.1 | Péndulo: la pesa arriba va más lenta; el ángulo sale del reloj de audio y llega a un extremo en cada pulso (30°, unos 13° en el iPhone en horizontal); recto con «reducir movimiento». Pendiente de tu decisión (AR-14 #2, #8): 13° en horizontal o varilla más corta, y si ↑ sube el tempo o la pesa. Falta tu prueba (Sesión 2). |

---

## 15. Acordes

| ID | Requisito | Prior. | Etapa | Impl. | Valid. | Desde | Notas |
|----|-----------|--------|-------|:-----:|:------:|:-----:|-------|
| **AC-01** | **Librería de acordes**, un área propia: a un lado, el listado de nombres, con una sección de **populares** arriba y debajo los **30 acordes** más habituales; al otro, el acorde dibujado en el mástil. | Media | F5.7 | ✅ | ✅ | 0.5.5 | Populares (C, G, D, A, E, Am, Em, Dm, F) y 30 de uso común. Falta compararlos con tu guitarra (Sesión 2). Pendiente: contrastarlos con un método citado (AR-12 #4); raíz alterada (F♯m, B♭, D/F♯; AT-11 #8); rasgueo con el reloj de audio (AT-11 #7). |
| **AC-02** | En el mástil, cada nota del acorde lleva un círculo del color de su dedo (1 índice, 2 medio, 3 anular, 4 meñique; el mismo color en todos los acordes) con el número del dedo dentro. Junto al nombre de cada cuerda, ○ si suena al aire y ✕ si no suena; la cejilla, como una barra que une sus cuerdas. | Media | F5.7 | ✅ | ⬜ | 0.5.5 | Número y color por dedo (Okabe-Ito, apto para daltonismo), constante entre acordes; círculo a 3:1 y número a 4,5:1. Falta compararlo con tu guitarra (Sesión 2). |
| **AC-03** | El pentagrama escribe el acorde con sus notas apiladas, escritas como manda el acorde (B7: Re♯); se oculta con el ajuste de pentagrama de siempre. | Baja | F5.7 | ✅ | ⬜ | 0.5.5 | En el móvil en vertical el pentagrama se aparta; se ve al girar o en pantallas amplias. Falta compararlo con tu guitarra (Sesión 2). |
| **AC-04** | El acorde suena rasgueado, de grave a agudo, al elegirlo y con «Tocar»; cada cuerda se puede tocar suelta. | Media | F5.7 | ✅ | ✅ | 0.5.5 | 35 ms entre cuerdas. Validado por el banco; falta con la guitarra (Sesión 2). |
| **AC-05** | Las digitaciones son para la afinación estándar en la primera entrega: con otra afinación activa, Acordes lo avisa, no las dibuja y ofrece pasar a la estándar. | Media | F5.7 | ✅ | ✅ | 0.5.5 | Las demás afinaciones, para después. Validado por el banco; falta con la guitarra (Sesión 2). |
| **AC-06** | Un **buscador** filtra el listado por cómo empieza el nombre: «G» deja G, Gm, G7, G/B…; vale en las dos nomenclaturas («Sol» encuentra lo mismo) y sin distinguir mayúsculas. | Media | F5.7 | ✅ | ✅ | 0.5.5 | Una sola letra busca en inglés («D» no trae los Do); # y b valen por ♯ y ♭. Validado por el banco. |

---

## 16. Afinador

| ID | Requisito | Prior. | Etapa | Impl. | Valid. | Desde | Notas |
|----|-----------|--------|-------|:-----:|:------:|:-----:|-------|
| **A-01** | Afinador por referencia: la app reproduce la nota de cada cuerda para afinar de oído. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | El MVP real del afinador. |
| **A-02** | Afinador por micrófono: capta la cuerda e indica si subir o bajar. | Alta | F4.3 | ✅ | ⬜ | 0.4.0 | Exige `https` o `localhost`. Abre en Micrófono donde se puede (si eliges De oído, se recuerda) y se apaga al salir o al ocultar la app. Desde la 0.6.2 sigue la nota mientras se apaga (filtro de 60 a 1200 Hz, enganche con histéresis, ruido de fondo medido; banco `tono.test.js`). Anotado (AT-14 #6, #7): dos cuerdas a la vez y el retraso del hilo. Pregunta abierta (AR-15 #8): ¿abrir siempre en Micrófono? Falta tu prueba con la guitarra (V-09). |
| **A-02-CA** | Criterios de aceptación de A-02: precisión de detección ±2 cents en silencio razonable, latencia menor de 300 ms; el ruido de fondo queda fuera de la primera entrega. | Alta | F4.2 | ✅ | ✅ | 0.4.0 | YIN en un hilo aparte, con trozos de 85 ms: peor error 1,84 cents con las 12 grabaciones desafinadas de −45 a +40 cents, y la aguja en 195 ms como mucho (banco). |
| **A-03** | Indicador de desviación en cents, con umbral de afinado en ±5 cents. | Alta | F4.3 | ✅ | ⬜ | 0.4.0 | Aguja de ±50 cents con franja verde de ±5, cents en número y «▲ Sube», «▼ Baja» o «✓ Afinada»; lo último medido se queda 2,5 s atenuado («Última lectura»). Falta tu prueba con la guitarra. |
| **A-04** | Detección automática de cuerda por proximidad a la nota detectada. | Alta | F4.3 | ✅ | ✅ | 0.4.0 | Con «Auto», la cuerda más cercana de la afinación activa; muy desafinada puede elegir mal (por eso A-05). Validado por el banco. |
| **A-05** | Selección manual de cuerda, que prevalece sobre A-04. | Alta | F4.3 | ✅ | ⬜ | 0.4.0 | Botones Auto · 6 … 1; un salto de octava no se lee como 12 semitonos. Falta tu prueba con la guitarra. |
| **A-06** | Afinación estándar (E A D G B E). | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | — |
| **A-07** | Cinco afinaciones alternativas predefinidas: Drop D, medio tono abajo, Open G, Open D y DADGAD. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | — |
| **A-08** | Afinación personalizada ajustando cada cuerda por semitonos. | Alta | F1.1 | ✅ | ✅ | 0.1.0 | Cualquier ajuste crea una afinación personalizada sin tocar los presets. Validado en la Sesión 1 (A13). |
| **A-09** | Al seleccionar una afinación se muestran sus notas en un pentagrama. | Media | F1.1 | ✅ | ⬜ | 0.1.0 | Ver P-04. |
| **A-10** | La afinación activa se aplica también a los modos de aprendizaje. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | Todas las notas derivan de la afinación activa, propagada desde un único punto. |
| **A-11** | La afinación persiste entre sesiones. | Media | F1.1 | ✅ | ⬜ | 0.1.0 | — |

---

## 17. Visualización

| ID | Requisito | Prior. | Etapa | Impl. | Valid. | Desde | Notas |
|----|-----------|--------|-------|:-----:|:------:|:-----:|-------|
| **V-01** | En móvil se **sugiere** la orientación horizontal con un aviso discreto; no se fuerza. | Alta | F3.2 | ✅ | ✅ | 0.3.0 | En horizontal, raíl, mástil a todo el alto y panel (52,8 px por cuerda en el iPhone). Aviso para girar solo con el dedo, en vertical y con menos de 600 px de ancho, en Libre, Adivinar, Escalas y Acordes. Validado en la Sesión 1 (C02, C03, D03). |
| **V-02** | El afinador funciona en vertical y en horizontal. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | — |
| **V-03** | En escritorio el mástil aprovecha el ancho disponible. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | Arranca con el mástil completo en pantallas anchas. |
| **V-04** | Control de zoom que determina qué porción del mástil se ve. | Alta | F1.1 · F3.2 | ✅ | ✅ | 0.1.0 | De 3 a 24 trastes; por defecto de 40 px con el dedo (34 con ratón), hasta 28 px si se pide con «+»; lo guardado se conserva al girar. Validado en la Sesión 1 (A07, A08, C04). |
| **V-05** | Cuando el mástil no cabe, el usuario se desplaza lateralmente. | Alta | F1.1 | ✅ | ✅ | 0.1.0 | Validado en la Sesión 1 (A08). |
| **V-06** | El ancho de traste no cambia al desplazarse: el zoom fija el tamaño y el desplazamiento mueve la ventana. | Alta | F1.1 | ✅ | ✅ | 0.1.0 | Validado en la Sesión 1 (A07). |
| **V-07** | El mástil se readapta al redimensionar la ventana. | Alta | F1.1 | ✅ | ✅ | 0.1.0 | Validado en la Sesión 1 (A08). |
| **V-08** | El nivel de zoom persiste entre sesiones. | Baja | F1.1 | ✅ | ⬜ | 0.1.0 | Girar el móvil no pisa el zoom elegido. |
| **V-09** | Al ocultar la numeración se puede conservar una **referencia de tramo**: el modo «Guía» deja solo los números de los trastes con marca. | Media | F1.3 | ✅ | ✅ | 0.1.2 | Sin números, los trastes 5 y 17 se confunden; se descartó el minimapa. Validado en la Sesión 1 (A11). |
| **V-10** 🆕 | **Temas elegibles:** en Ajustes › Aspecto se elige el tema de la app: *Madera* (de fábrica), *Automático* (claro u oscuro, como el dispositivo) y *Partitura*. La elección se guarda; el mástil es oscuro en todos, y todos cumplen los contrastes de G-05. | Media | F5.8 | ✅ | ⬜ | 0.6.3 | Tu comentario F5.8 #3 (12/11) y parte de C-08. Comprobado con el banco y con `comprobar-accesibilidad.js` en los cuatro aspectos (Madera, Automático oscuro y claro, Partitura). Falta que elijas con las capturas y lo veas en el iPhone. |
| **V-11** 🆕 | **Disposición para tableta y ordenador:** en pantallas de al menos 700 × 700 px (el iPad en las dos orientaciones, el ordenador), el mástil tiene un alto acotado y centrado, el pentagrama y la lectura crecen, textos y botones son mayores y las pestañas forman un control segmentado, en su propia fila si no caben junto al nombre. | Media | F5.8 | ✅ | ⬜ | 0.6.3 | Tu comentario F5.8 #3: el iPad «no está preparado» (cuerdas de 150 px en vertical). `comprobar-disposicion.js` mide cinco pantallas de iPad y una de ordenador: cuerdas de 44 a 67 px, nada se sale y las pestañas no pisan nada; con el dedo en horizontal, el mástil de inicio respeta los 40 px por traste (antes, 38 a 1024 px). Falta tu prueba en un iPad. |

---

## 18. Configuración y navegación

| ID | Requisito | Prior. | Etapa | Impl. | Valid. | Desde | Notas |
|----|-----------|--------|-------|:-----:|:------:|:-----:|-------|
| **C-01** | Menú de configuración accesible desde cualquier pantalla. | Alta | F1.1 | ✅ | ✅ | 0.1.0 | Hoja desde abajo en vertical; panel lateral en horizontal y en pantallas amplias; es un diálogo (AT-04). Validado en la Sesión 1 (A19, C05). |
| **C-02** ✏️ | El menú contiene nomenclatura, pentagrama, timbre, numeración de trastes (tres modos), ver todas las notas, señalar iguales y afinación activa, y muestra la versión de la app. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | Grupos: idioma, aspecto (tema, V-10, 0.6.3), notación (con ♯ o ♭ por nota), Adivinar («Al fallar»), numeración y versión. En F6.4, «Acerca de» con créditos y privacidad. |
| **C-03** | Los ajustes frecuentes tienen acceso rápido sin abrir el menú. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | Nomenclatura y pentagrama en chips bajo la cabecera (en el panel, en horizontal); las pistas del juego, en la tarjeta del reto. |
| **C-04** | Navegación principal clara entre las áreas de la app. | Alta | F1.1 | ✅ | ✅ | 0.1.0 | Barra inferior con seis destinos en vertical, raíl en horizontal y pestañas en la cabecera en pantallas amplias; en pantallas bajas nunca se sale. Validado en la Sesión 1 (A19). |
| **C-05** | Todos los ajustes persisten entre sesiones. | Media | F1.1 | ✅ | ✅ | 0.1.0 | Un único objeto de estado, validado campo a campo. Validado en la Sesión 1 (A14, A15). |
| **C-06** | Especificación detallada de la interfaz: estructura de menús, jerarquía de controles y flujos de navegación. | Alta | F3.1 | ✅ | ✅ | 0.2.3 | `docs/interfaz.md`, aprobada el 20/10 (AR-04), con bocetos en `docs/interfaz/`. Cada cambio sube su versión. |
| **C-07** | **Botón «atrás» del sistema:** mientras haya un paso anterior en la sesión, el botón o gesto «atrás» cierra Ajustes o vuelve al área anterior; desde la primera área actúa el sistema. Al abrir la app se entra en Libre. | Media | F3.2 | ✅ | ✅ | 0.3.0 | Cada área con su dirección (`#libre`…); en el iPhone instalado no hay botón atrás. Validado en la Sesión 1 (A17). |
| **C-08** ✏️ | Menú **Personalización** dentro de Ajustes: estilos de nota en el mástil (círculo de color o solo el nombre, más grande o en negrita), estilo del traste y del mástil, interior claro para «Ver todas las notas» y temas de color de la app. | Media | Posterior | ⬜ | ⬜ | — | Tus comentarios de la Sesión 1 (A10, C06, E06). Los temas de color ya están (V-10, 0.6.3); el resto sigue para después; la paleta por nota de G-05 sigue de punto de partida. |

---

## 19. Respaldo y publicación

| ID | Requisito | Prior. | Etapa | Impl. | Valid. | Desde | Notas |
|----|-----------|--------|-------|:-----:|:------:|:-----:|-------|
| **X-01** | El código y la documentación están **respaldados** en el repositorio remoto (GitHub). Respaldar no es publicar. | Alta | F1.2 · F1.4 | ✅ | ⬜ | 0.1.4 | Todo en `pdigue/guitarra`, público; cada versión entra por PR aprobado y cada fase cerrada lleva su etiqueta. |
| **X-02** | La app está **publicada** en una URL pública (GitHub Pages). | Alta | F7.1 | ⬜ | ⬜ | — | Publicación oficial en F7. Mientras, web de pruebas en GitHub Pages, sin anunciar (rama `pruebas`). |
| **X-03** | La app está verificada en móviles reales, instalada como icono desde la web publicada. | Alta | F7.2 | ⬜ | ⬜ | — | Cierra G-04 y PL-01 a PL-03 en su modo web. |

---

## 20. Matriz de trazabilidad por etapa

Qué requisitos cierra o valida cada etapa del roadmap. Es la misma información que la columna *Etapa*, ordenada al revés.

| Etapa | Requisitos |
|---|---|
| **F1.1** | G-01, G-02, N-01, N-02, N-03, N-04, N-05, D-01, D-02, D-03, D-05, D-06, D-07, S-01, S-02, S-03, S-04, S-05, S-06, P-01, P-02, P-04, L-01, L-02, L-03, J-01, J-02, J-03, J-04, J-05, J-06, J-07, J-08, J-09, A-01, A-06, A-07, A-08, A-09, A-10, A-11, V-02, V-03, V-04, V-05, V-06, V-07, V-08, C-01, C-02, C-03, C-04, C-05 |
| **F1.2** | X-01 |
| **F1.3** | G-10, D-04, J-10, J-12, V-09 |
| **F1.4** | X-01 |
| **F2.1** | G-06, S-07, S-08 |
| **F2.2** | PL-04, S-01, S-08 |
| **F2.3** | G-07, S-07 |
| **F2.4** | S-01, S-08 |
| **F2.5** | G-07, PL-01, PL-02, PL-03 |
| **F3.1** | C-06 |
| **F3.2** | PL-04, V-01, V-04, C-07 |
| **F3.4** | G-05 |
| **F4.1** | G-08 |
| **F4.2** | A-02-CA |
| **F4.3** | A-02, A-03, A-04, A-05 |
| **F4.4** | J-11 |
| **F4.5** | G-12 |
| **F5.2** | E-01, E-02 |
| **F5.3** | P-03, E-03, E-04, E-06 |
| **F5.4** | E-05 |
| **F5.5** | N-06, J-13 |
| **F5.6** | MT-01, MT-02, MT-03, MT-04, MT-05 |
| **F5.7** | AC-01, AC-02, AC-03, AC-04, AC-05, AC-06 |
| **F5.8** | G-13, MT-06, V-10, V-11 |
| **F6.1** | G-08 |
| **F6.2** | G-03 |
| **F6.3** | G-04 |
| **F6.4** | G-06, G-11 |
| **F7.1** | X-02 |
| **F7.2** | G-03, G-04, PL-01, PL-02, PL-03, PL-04, X-03 |
| **F7.4** | G-09 |
| **Posterior** | S-09, E-02b, E-05b, C-08 |

---

## 21. Riesgos

| Riesgo | Impacto | Estado | Mitigación |
|--------|---------|--------|------------|
| **Dependencia de samples de terceros.** El audio se carga del repositorio personal de otra persona, sin versión fijada; si cambia, la app deja de sonar sin que toquemos nada. | Alto | Mitigado → F2.2 | Las muestras ya están en `samples/` (F2.1). La app deja de descargarlas en F2.2. |
| **Licencia del audio sin verificar.** Hay referencias contradictorias sobre si esos samples son de dominio público o CC-BY. | Medio | ✅ Resuelto | Verificado en F2.1 y completado el 20/10: los 161 sonidos del pack de nylon son CC BY, y la edición de Brosowsky, CC BY 3.0. Apta para tiendas con atribución. Detalle en `CREDITOS.md`. |
| **Muestras mal etiquetadas.** Un archivo que dice ser una nota y suena en otra enseña una nota equivocada sin que nadie lo note. | Alto | Resuelto | Pasó con el `D5.mp3` de nylon (0.1.2). S-08: cada muestra se mide antes de usarse y el banco lo vigila. |
| **iPhone no ejecuta archivos HTML locales.** La vista previa de la app Archivos no ejecuta JavaScript, así que el modo archivo autónomo probablemente no sirve en iOS. | Medio | Abierto → F2.5 | Confirmarlo en el dispositivo. Alternativas: navegador integrado de una app de terceros, o un despliegue de pruebas sin anunciar. |
| **El micrófono no funciona por WiFi.** Desde el móvil contra el Live Server del ordenador (`http://192.168…`) no hay contexto seguro. | Medio | Conocido | A-02 en el móvil llega con la publicación (F7.2). Hasta entonces, el afinador por micrófono se usa en el ordenador. |
| **App Store puede rechazar una web empaquetada.** Apple exige que la app aporte algo más que una web (funcionalidad mínima). | Medio | Abierto → F7.4 | Llegar con funcionamiento sin conexión, audio y afinador propios. Decidir App Store con datos; empezar por Google Play y Microsoft Store. |
| **Verificación de Android con la web en subcarpeta.** Para empaquetar en Google Play, el archivo de verificación de dominio debe estar en la raíz (`pdigue.github.io/.well-known/`), no en `/guitarra/`. | Bajo | Abierto → F7.4 | Crear el repositorio de usuario `pdigue.github.io` o usar un dominio propio. |
| La detección de tono es el componente más complejo del proyecto. | Alto | Mitigado | A-01 ya entrega el valor de «afinador» sin micrófono. A-02 va aislado en F4 con criterios de aceptación cerrados. |
| La afinación como estado global afecta a todo el cálculo de notas. | Alto | Resuelto | Diseñado así desde el origen. |
| El alcance de Escalas podía dispararse. | Medio | Resuelto | E-02 y E-05 acotados; lo demás en E-02b y E-05b. |
| Documento y código desincronizados. | Medio | Resuelto | Columnas *Etapa* y *Desde*, y reconciliación en cada cierre de fase. Desde el 14/10 el chat de Desarrollo escribe directamente en el proyecto. |
| `localStorage` no funciona en previsualizaciones de artefactos. | Bajo | Conocido | Probar la persistencia en local o en la web. |

### Análisis de S-07: opciones para el audio

| Opción | Esfuerzo | Resultado |
|---|---|---|
| **A.** Alojar los samples actuales tras verificar su licencia pieza por pieza. | Bajo | **Elegida el 14/10.** La verificación salió limpia: CC BY con atribución. |
| **B.** Sustituirlos por samples de licencia inequívoca (CC0 o dominio público confirmado) y alojarlos. | Medio | Audio real y sin ambigüedad legal, sin grabar nada. Descartada al salir limpia la A. |
| **C.** Grabar samples propios de nylon y de acero. | Alto | Cero dependencias y timbre propio, pero es un proyecto en sí mismo. Mejora futura. |
| **D.** Usar el sintetizador como motor principal. | Nulo | Contradice S-01. |

---

## 22. Decisiones abiertas

| # | Decisión | Afecta a | Plazo |
|---|---|---|---|
| 1 | Licencia del código (MIT u otra) | G-06 | Antes de F6.4 |
| 2 | Tiendas: cuáles y en qué orden | G-09 | Antes de F7.4 |

**Cerradas el 21/10:** metrónomo → área propia con su pestaña, no un chip (MT-05), con un solo acento en el primer tiempo (MT-02) · seis pestañas → aprobadas (`interfaz.md` §7b) · Adivinar al fallar → seguir intentando por defecto (J-13) · récord → uno por afinación (J-11) · idioma → español e inglés, elegible en Ajustes (G-12) · catálogo de escalas → mayor, menor natural y pentatónicas mayor y menor (E-01).
**Cerradas el 20/10:** Service Worker → en F6.2, sin adelantarlo a la Sesión 1 · agudo de la acústica → aceptado como limitación conocida · C-06, especificación de interfaz → aprobada (`interfaz.md` v1.0) · paleta por nota → la elige el agente con tu criterio: naturales bien distintas y sostenidos derivados (F3.4).

**Cerradas el 15/10:** despliegue de pruebas en `https`, sin anunciar → sí, antes de la Sesión 1 · Android de pruebas → ninguno por ahora; diseño pensado para todos los sistemas (PL-04).

**Cerradas el 14/10:** S-07 → opción A, licencia verificada · móvil de referencia → iPhone · automatización → modo acelerado por bloques (F1–F3, sesión con el móvil, F4–F6, sesión con la guitarra, F7).

**Cerradas antes:** nombre (*Trasteando*) · L-02 (ajuste del usuario) · J-10 (el fallo rompe la racha) · E-05 (solo pertenencia) · A-07 (cinco afinaciones) · V-01 (sugerir, no forzar).

---

*Documento gestionado por el chat de Desarrollo. Los chats auditores lo leen y proponen cambios en sus informes; no lo modifican. Cada cambio se anota en la sección 2 y se avisa al usuario.*
