# Trasteando — Especificación de Requisitos

**Versión del documento:** 1.3 · **Fecha:** 14 de octubre de 2026  
**Válido para:** app `0.1.3` · `roadmap.md` v3.1 · `matriz-cumplimiento` v1.1 · fase en curso **F1 → F2**, en modo acelerado  
**Repositorio:** github.com/pdigue/guitarra, carpeta `docs/` · **Gestiona:** chat de Desarrollo  
**Tipo de producto:** aplicación web progresiva (PWA), desarrollada en local y publicada al final del roadmap

---

## 1. Estado de un vistazo

| Total | ✅ Implementados | 🟡 Parciales | ⬜ Pendientes | ✅ Validados |
|:---:|:---:|:---:|:---:|:---:|
| 91 | 59 | 12 | 20 | 1 |

> Un requisito implementado no cuenta como cumplido hasta superar su prueba. El primero validado es **S-08**, demostrado por medición y por el banco automático. La validación en dispositivo llega con la sesión de pruebas en el iPhone y el ordenador (F1.1, F2.5 y F3.3 juntas, al cerrar F3).

| Fase | Objetivo | Requisitos | Implementados |
|------|----------|:---:|-----------|
| **F1** | Base local verificada | 59 | `▰▰▰▰▰▰▰▰▰▰` 58/59 |
| **F2** | Sonido propio y archivo autónomo | 8 | `▰▰▱▱▱▱▱▱▱▱` 2/8 |
| **F3** | Interfaz y adaptación | 3 | `▱▱▱▱▱▱▱▱▱▱` 0/3 |
| **F4** | Afinador por micrófono | 7 | `▱▱▱▱▱▱▱▱▱▱` 0/7 |
| **F5** | Escalas | 7 | `▱▱▱▱▱▱▱▱▱▱` 0/7 |
| **F6** | Preparación para distribución | 5 | `▱▱▱▱▱▱▱▱▱▱` 0/5 |
| **F7** | Publicación y lanzamiento | 7 | `▱▱▱▱▱▱▱▱▱▱` 0/7 |
| **Posterior** | Fuera del alcance actual | 2 | `▱▱▱▱▱▱▱▱▱▱` 0/2 |

*Un requisito puede aparecer en dos fases si se implementa en una y se valida o completa en otra.*

---

## 2. Control de cambios

| Versión | Fecha | App | Roadmap | Resumen | Origen |
|---|---|:---:|:---:|---|---|
| **1.3** | 14/10/2026 | 0.1.3 | 3.1 | Tres decisiones cerradas: audio (opción A), móvil de referencia (iPhone) y modo acelerado. 1 nuevo y 5 modificados: 91 en total. | Iteración 0 y medición de F2.1 |
| 1.2 | 14/10/2026 | 0.1.2 | 3.0 | Fases F1–F7. Columnas *Validado*, *Etapa* y *Desde*. Sección de plataformas. 9 nuevos y 12 modificados: 90 en total. | Tu aprobación del 14/10 y revisión de código |
| 1.1 | 15/09/2026 | 0.1.1 | 2.0 | Reconciliación de estados. 11 nuevos (S-07, V-09, J-11, G-05, G-06, A-02-CA, E-02b, E-05b, X-01 a X-03): 81 en total. Seis decisiones cerradas. | Auditoría de requisitos AR-01 |
| 1.0 | 14/09/2026 | 0.1.0 | — | Primera versión: 70 requisitos en 11 categorías. | Tu listado inicial |

### Detalle de la versión 1.3

**Requisito nuevo 🆕** — S-08. Al medir la afinación de cada muestra en F2.1 apareció un archivo un semitono alto que la app usaba desde la 0.1.0. La afinación de las muestras pasa a ser un requisito medible, en lugar de suponerse.

**Requisitos modificados ✏️** — G-06, PL-03, S-01, S-07, X-01

- **S-01:** las muestras ya están en el proyecto y la 0.1.3 corrige el registro agudo de nylon.
- **S-07:** pasa a parcial. Opción A decidida, licencias verificadas y archivos en `samples/`; falta que la app los use.
- **G-06:** pasa a parcial con `CREDITOS.md`.
- **PL-03:** el iPhone es el móvil de referencia; cómo se prueba hasta publicar.
- **X-01:** repositorio reorganizado en local, pendiente de subir.

**Decisiones cerradas:** audio S-07 → opción A · móvil de referencia → iPhone · pista de automatización → modo acelerado por bloques. Ver sección 20.

**Riesgos:** el de la licencia del audio queda resuelto en lo esencial, el de la dependencia de terceros pasa a mitigado y se añade el de muestras mal etiquetadas, ya resuelto. Ver sección 19.

**Erratas:** la versión 1.2 remitía a las secciones 16 y 17 para riesgos y decisiones; son la 19 y la 20.

**Valorado y descartado:** convertir en requisito las pruebas con el iPhone por WiFi. Es un método de verificación, no una propiedad del producto; queda en el roadmap y en la matriz.

### Detalle de la versión 1.2

**Cambios de modelo**

- La columna *Publicado* pasa a llamarse **Validado**. El desarrollo es local hasta F7, así que la segunda casilla indica si el requisito ha superado su prueba. La publicación tiene requisitos propios (X-02, X-03).
- Nuevas columnas **Etapa** (vínculo con el roadmap) y **Desde** (versión de la app en que quedó implementado).
- Las versiones V1–V4 se sustituyen por las fases **F1–F7** del roadmap v3.0.
- Nueva sección de **plataformas** y matriz de capacidades por modo de ejecución.

**Requisitos nuevos** — G-07, G-08, G-09, G-10, G-11, PL-01, PL-02, PL-03, J-12

**Requisitos modificados** — G-03, G-04, G-05, D-04, S-07, J-10, A-02, V-09, C-02, X-01, X-02, X-03

**Decisiones:** se abren cinco nuevas (paleta, tiendas, licencia del código, pista de automatización y móvil de referencia). Ver sección 20.

**Riesgos:** cuatro nuevos (iPhone y archivos locales, micrófono por WiFi, App Store y webs empaquetadas, verificación de Android con la web en subcarpeta).

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

---

## 5. Requisitos generales y de producto

| ID | Requisito | Prior. | Etapa | Impl. | Valid. | Desde | Notas |
|----|-----------|--------|-------|:-----:|:------:|:-----:|-------|
| **G-01** | La aplicación se llama *Trasteando*. El nombre aparece en la pantalla de entrada, el título de la pestaña y el manifiesto PWA. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | Naming cerrado: se descarta *Trasting*. |
| **G-02** | La app se organiza en áreas accesibles desde una navegación principal: Libre, Adivinar, Afinador y Escalas. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | Escalas visible pero deshabilitada hasta F5. |
| **G-03** | La app funciona sin conexión una vez cargada **desde la web**. | Media | F6.2 | ⬜ | ⬜ | — | Service Worker. Depende de S-07. En modo archivo (G-07) la autonomía se consigue de otra forma: el audio va dentro del archivo. |
| **G-04** | La app es instalable como PWA (icono en la pantalla de inicio, pantalla completa). | Alta | F6.3 · F7.2 | 🟡 | ⬜ | 0.1.0 | Manifiesto incrustado como `data:` URL. Falta un archivo de manifiesto propio con iconos PNG (F6.3) y verificarla instalada desde la web publicada (F7.2): instalar solo es posible desde `https`. |
| **G-05** | La interfaz cumple unos mínimos de accesibilidad: foco de teclado visible, respeto a `prefers-reduced-motion`, contraste suficiente y etiquetas accesibles en los controles solo-icono. | Media | F3.4 | 🟡 | ⬜ | 0.1.1 | Hecho: foco visible, movimiento reducido, interruptores con `role="switch"` (0.1.1), `aria-pressed` en los selectores y aviso del reto para lectores de pantalla (0.1.2). Falta: recorrer el mástil con teclado y auditar el contraste. |
| **G-06** ✏️ | El proyecto documenta sus dependencias externas y la licencia de cada recurso de terceros que distribuye. | Media | F2.1 · F6.4 | 🟡 | ⬜ | — | `CREDITOS.md` (F2.1): origen, licencia, huella `sha256` y texto de atribución de cada muestra de audio, y Tone.js (MIT). Falta mostrar los créditos dentro de la app y elegir la licencia del propio código (F6.4). |
| **G-07** | **Modo archivo autónomo:** la app funciona completa —salvo el afinador por micrófono— abriendo el archivo directamente (`file://`), sin servidor y sin conexión. | Alta | F2.3 · F2.5 | 🟡 | ⬜ | 0.1.0 | Hoy funciona sin conexión pero con sonido sintetizado, porque los samples se descargan de internet. Se completa al incrustar el audio en el archivo (F2.3). En iPhone puede no ser viable: ver PL-03. |
| **G-08** | El proyecto conserva **dos formas de distribución** equivalentes: el archivo autónomo (para llevárselo) y la web publicada (para instalarla como PWA). | Media | F4.1 · F6.1 | 🟡 | ⬜ | 0.1.0 | Hoy se cumple de forma trivial: todo es un único archivo. Se vuelve exigente al pasar a módulos (F4.1), que no funcionan con `file://`; F6.1 genera el archivo autónomo a partir de ellos. |
| **G-09** | La app podrá distribuirse por **tiendas oficiales** —Google Play, Microsoft Store y, si compensa, App Store— empaquetando la PWA publicada. | Media | F7.4 | ⬜ | ⬜ | — | Decisión de producto en F7.4. Exige S-07 con licencia limpia, G-11 y la web publicada (X-02). Cuentas, costes y archivos necesarios: roadmap, *Inventario de lanzamiento*. |
| **G-10** | **Control de versiones de la app:** cada versión tiene número propio con la pauta `0.‹fase›.‹corrección›` —`1.0.0` en el lanzamiento—, se registra en `CHANGELOG.md` y se muestra en Ajustes. | Alta | F1.3 | ✅ | ⬜ | 0.1.2 | Vincula cada versión con su fase del roadmap. Cada fase cerrada se marca además con una etiqueta de Git (F1.4). |
| **G-11** | **Privacidad:** la app no recoge ni envía datos personales; el sonido del micrófono se analiza solo en el dispositivo. Una política de privacidad pública lo declara. | Alta | F6.4 | ⬜ | ⬜ | — | Las tiendas exigen política de privacidad, y el micrófono la hace necesaria también por transparencia. Hoy la app ya no envía nada: solo guarda ajustes en el propio navegador. |

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
| **PL-01** | **Windows:** la app funciona en Chrome, Edge y Firefox actuales —en modo archivo, local y web— e instalada como PWA desde Edge o Chrome. | Alta | F2.5 · F7.2 | 🟡 | ⬜ | 0.1.0 | Es la plataforma de desarrollo y la mejor cubierta. Tienda: Microsoft Store (F7.4). |
| **PL-02** | **Android:** la app funciona en Chrome —en web e instalada como PWA— y, si es viable, en modo archivo. | Alta | F2.5 · F7.2 | 🟡 | ⬜ | 0.1.0 | Modo archivo: abrir el HTML descargado con Chrome; a verificar en F2.5. Tienda: Google Play empaquetando la PWA (F7.4). |
| **PL-03** ✏️ | **iPhone y iPad:** la app funciona en Safari —en web e instalada con «Añadir a pantalla de inicio». | Alta | F2.5 · F7.2 | 🟡 | ⬜ | 0.1.0 | Modo archivo probablemente inviable: la vista previa de la app Archivos no ejecuta JavaScript (a confirmar en F2.5). Alternativas: el navegador integrado de una app de terceros o un despliegue de pruebas. Tienda: App Store exige un Mac con Xcode y la cuenta de desarrollador de Apple (F7.4). **Móvil de referencia del proyecto desde el 14/10.** Hasta publicar, se prueba con la app servida desde el ordenador por WiFi (Live Server): funciona todo salvo el micrófono y la instalación. |

---

## 7. Nomenclatura y notación

| ID | Requisito | Prior. | Etapa | Impl. | Valid. | Desde | Notas |
|----|-----------|--------|-------|:-----:|:------:|:-----:|-------|
| **N-01** | Alternancia entre nomenclatura latina (Do, Re, Mi…) y anglosajona (C, D, E…). | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | — |
| **N-02** | El cambio de nomenclatura está en el menú de configuración. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | — |
| **N-03** | El cambio de nomenclatura está **además** en la interfaz principal, sin abrir el menú. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | Chip en la barra de acceso rápido. |
| **N-04** | La nomenclatura se aplica de forma consistente en mástil, juego, afinador y pentagrama. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | Verificar de nuevo al añadir Escalas (F5). |
| **N-05** | La nomenclatura persiste entre sesiones. | Media | F1.1 | ✅ | ⬜ | 0.1.0 | `localStorage`. |

---

## 8. Diapasón

| ID | Requisito | Prior. | Etapa | Impl. | Valid. | Desde | Notas |
|----|-----------|--------|-------|:-----:|:------:|:-----:|-------|
| **D-01** | Diagrama del mástil de 6 cuerdas. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | — |
| **D-02** | Cada cuerda muestra a la izquierda su nota al aire, derivada de la afinación activa. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | Se actualiza sola al cambiar de afinación (A-10). |
| **D-03** | Cada traste muestra su número alineado exactamente sobre la franja donde se pulsa. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | La fila de números comparte las mismas variables de ancho (`--label-w`, `--nut-w`, `--fret-w`) que las celdas. |
| **D-04** | La numeración de trastes tiene **tres modos**: todos, guía (solo los trastes con marca) y ninguno. | Media | F1.3 | ✅ | ⬜ | 0.1.2 | Sustituye al interruptor de la 0.1.1; quien lo tuviera apagado pasa automáticamente a «ninguno». |
| **D-05** | Al pulsar una posición suena esa nota. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | — |
| **D-06** | Al pulsar una posición aparece el nombre de la nota en la nomenclatura activa. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | — |
| **D-07** | Marcadores de posición en los trastes habituales (3, 5, 7, 9, 12, 15, 17, 19, 21, 24). | Media | F1.1 | ✅ | ⬜ | 0.1.0 | — |

---

## 9. Sonido

| ID | Requisito | Prior. | Etapa | Impl. | Valid. | Desde | Notas |
|----|-----------|--------|-------|:-----:|:------:|:-----:|-------|
| **S-01** ✏️ | El sonido corresponde a una guitarra real, no a un sintetizador genérico. | Alta | F1.1 · F2.2 · F2.4 | ✅ | ⬜ | 0.1.0 | Hoy con Tone.js y samples de un tercero, ya copiados en `samples/` (F2.1). En F2 se sustituye por un reproductor propio que los usa (S-07). La 0.1.3 corrige el registro agudo de la guitarra clásica, que sonaba medio tono alto (S-08). |
| **S-02** | El usuario elige entre guitarra clásica (nylon) y acústica (acero). | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | Cambiar de timbre descarga otro set de muestras, con aviso. Desde 0.1.2, dos cambios seguidos ya no muestran el mensaje de la carga descartada. |
| **S-03** | La selección de timbre está en el menú de configuración. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | — |
| **S-04** | Si los samples no cargan, la app sigue sonando por síntesis. | Media | F1.1 | ✅ | ⬜ | 0.1.0 | Karplus-Strong con filtros que imitan la caja de resonancia. Desde 0.1.1 cada nota se calcula una sola vez y se reutiliza. |
| **S-05** | El primer sonido requiere una interacción explícita del usuario. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | Lo impone la política de reproducción automática de los navegadores. |
| **S-06** | El timbre persiste entre sesiones. | Media | F1.1 | ✅ | ⬜ | 0.1.0 | — |
| **S-07** ✏️ | Los samples de audio se alojan en el propio proyecto, con licencia verificada y documentada. | Alta | F2.1 · F2.3 | 🟡 | ⬜ | — | **Opción A, decidida el 14/10.** Hecho en F2.1: licencias verificadas y los 16 archivos en `samples/`, con `CREDITOS.md`. Falta que la app los use en lugar de descargarlos (F2.2), meterlos en el archivo (F2.3) y confirmar que todos los sonidos del pack de nylon comparten la licencia comprobada en uno de ellos. |
| **S-08** 🆕 | Cada muestra de audio suena en la nota que indica su nombre, con una desviación máxima de **±5 cents**, medida con `herramientas/medir-afinacion.py`. | Alta | F2.1 · F2.4 | ✅ | ✅ | 0.1.3 | Origen: la medición de F2.1 encontró que el `D5.mp3` de nylon suena en Re♯5 (+101 cents); con la 0.1.2, todo el registro agudo de la guitarra clásica sonaba medio tono alto. Sostiene también la precisión del afinador por referencia (A-01). Lo demuestran `samples/afinacion.json` y una prueba del banco. F2.4 lo aplica a cada muestra nueva. |

---

## 10. Pentagrama

| ID | Requisito | Prior. | Etapa | Impl. | Valid. | Desde | Notas |
|----|-----------|--------|-------|:-----:|:------:|:-----:|-------|
| **P-01** | Al pulsar una nota en el mástil, se representa en el pentagrama. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | Clave de sol octavada. Desde 0.1.1 las notas muy agudas o graves se dibujan transportadas con 8va, 15ma u 8vb, y la clave es un trazado propio que no depende de las fuentes del sistema. |
| **P-02** | El pentagrama se puede mostrar u ocultar. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | En configuración y en acceso rápido. |
| **P-03** | El pentagrama está disponible en todos los modos de aprendizaje. | Media | F5.3 | 🟡 | ⬜ | 0.1.0 | Libre y Adivinar sí. Escalas, en F5. |
| **P-04** | En el afinador, la afinación seleccionada se muestra como seis notas en un pentagrama. | Media | F1.1 | ✅ | ⬜ | 0.1.0 | — |

---

## 11. Modo Libre

| ID | Requisito | Prior. | Etapa | Impl. | Valid. | Desde | Notas |
|----|-----------|--------|-------|:-----:|:------:|:-----:|-------|
| **L-01** | El modo por defecto al abrir la app es el diapasón libre. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | — |
| **L-02** | El usuario decide si ve el nombre de todas las notas del mástil o solo el de la que pulsa. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | Por defecto solo la pulsada, para no convertir el mástil en una chuleta permanente. En Adivinar no se aplica (J-12). |
| **L-03** | Al pulsar una nota se señalan discretamente las demás posiciones que producen **exactamente la misma nota** (mismo sonido, no misma clase de nota). | Media | F1.1 | ✅ | ⬜ | 0.1.0 | Señal deliberadamente más tenue que la nota pulsada. |

---

## 12. Modo Adivinar

| ID | Requisito | Prior. | Etapa | Impl. | Valid. | Desde | Notas |
|----|-----------|--------|-------|:-----:|:------:|:-----:|-------|
| **J-01** | Suena una nota aleatoria y el usuario busca su posición en el mástil. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | Con botón para repetir el sonido. Desde 0.1.1 los retos se limitan a los 12 primeros trastes por defecto, y desplazar el mástil ya no cuenta como pulsación. |
| **J-02** | Se acepta como acierto cualquier posición que produzca esa nota exacta. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | — |
| **J-03** | Tras acertar se señalan las demás posiciones válidas. | Media | F1.1 | ✅ | ⬜ | 0.1.0 | Reutiliza la lógica de L-03. |
| **J-04** | Pista opcional: nombre de la nota que suena. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | — |
| **J-05** | Pista opcional: cuerda o cuerdas donde puede encontrarse. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | — |
| **J-06** | Las pistas se activan desde la propia interfaz, sin abrir el menú. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | Con las dos pistas activas equivale a «busca esta nota en esta cuerda»; sin ninguna, a «adivina de oído». |
| **J-07** | Contador de racha visible durante el juego. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | — |
| **J-08** | El récord de racha más larga persiste entre sesiones. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | `localStorage`. No funciona en las previsualizaciones de artefactos; probar en local o en la web. |
| **J-09** | Feedback visual inmediato de acierto y de error. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | Color en la posición pulsada y destello en la barra del reto. |
| **J-10** | Al fallar se indica cuál era la posición correcta. | Media | F1.3 | ✅ | ⬜ | 0.1.2 | El fallo rompe la racha siempre. Se iluminan todas las posiciones correctas y se vuelve a oír la nota buscada justo después de la pulsada, para aprender por contraste; luego llega el reto siguiente. |
| **J-11** | Definir si el récord es único o independiente por afinación. | Media | F4.4 | ⬜ | ⬜ | — | Hoy es único y global: una racha en DADGAD compite con una en estándar aunque la dificultad no sea comparable. |
| **J-12** | Los ajustes que revelan la respuesta —ver todas las notas— no se aplican en Adivinar. | Alta | F1.3 | ✅ | ⬜ | 0.1.2 | Encontrado al revisar el código: con «ver todas las notas» activo, el juego mostraba la solución. |

---

## 13. Escalas

| ID | Requisito | Prior. | Etapa | Impl. | Valid. | Desde | Notas |
|----|-----------|--------|-------|:-----:|:------:|:-----:|-------|
| **E-01** | Selección de escala a practicar (tónica + tipo). | Alta | F5.2 | ⬜ | ⬜ | — | Catálogo inicial por decidir. |
| **E-02** | El generador de escalas opera **solo en afinación estándar** en la primera entrega. | Alta | F5.2 | ⬜ | ⬜ | — | Alcance acotado. Las demás afinaciones pasan a E-02b. |
| **E-02b** | Escalas en afinaciones alternativas y variantes de digitación (por ejemplo, escala en octavas). | Media | Posterior | ⬜ | ⬜ | — | Fuera del alcance de F5. |
| **E-03** | Submodo Mostrar: la app ilumina las notas que componen la escala. | Alta | F5.3 | ⬜ | ⬜ | — | — |
| **E-04** | En Mostrar se indica el nombre de cada nota y su separación interválica respecto a la anterior. | Alta | F5.3 | ⬜ | ⬜ | — | Etiquetas tipo `T — T — ST — T — T — T — ST`. |
| **E-05** | Submodo Práctica: valida **solo la pertenencia** de la nota a la escala; al pulsar una ajena, marca error e ilumina las correctas. | Alta | F5.4 | ⬜ | ⬜ | — | Alcance acotado: no valida orden ni digitación. |
| **E-05b** | Validación del orden de la escala y de patrones de digitación concretos. | Media | Posterior | ⬜ | ⬜ | — | Fuera del alcance de F5. |
| **E-06** | Guiado nota a nota en el submodo Mostrar. | Media | F5.3 | ⬜ | ⬜ | — | — |

---

## 14. Afinador

| ID | Requisito | Prior. | Etapa | Impl. | Valid. | Desde | Notas |
|----|-----------|--------|-------|:-----:|:------:|:-----:|-------|
| **A-01** | Afinador por referencia: la app reproduce la nota de cada cuerda para afinar de oído. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | El MVP real del afinador. |
| **A-02** | Afinador por micrófono: capta la cuerda e indica si subir o bajar. | Alta | F4.3 | ⬜ | ⬜ | — | Exige contexto seguro: funciona en `https` y en `localhost`. **No funciona** con `file://` ni desde el móvil por WiFi contra el Live Server del ordenador (`http://192.168…` no es contexto seguro). En el móvil llega con la publicación (F7.2). |
| **A-02-CA** | Criterios de aceptación de A-02: precisión de detección ±2 cents en silencio razonable, latencia menor de 300 ms; el ruido de fondo queda fuera de la primera entrega. | Alta | F4.2 | ⬜ | ⬜ | — | La precisión de detección debe ser mejor que el umbral de «afinado» de A-03. |
| **A-03** | Indicador de desviación en cents, con umbral de afinado en ±5 cents. | Alta | F4.3 | ⬜ | ⬜ | — | — |
| **A-04** | Detección automática de cuerda por proximidad a la nota detectada. | Alta | F4.3 | ⬜ | ⬜ | — | Limitación asumida: con una cuerda muy desafinada puede elegir la equivocada. |
| **A-05** | Selección manual de cuerda, que prevalece sobre A-04. | Alta | F4.3 | ⬜ | ⬜ | — | Resuelve la limitación anterior. |
| **A-06** | Afinación estándar (E A D G B E). | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | — |
| **A-07** | Cinco afinaciones alternativas predefinidas: Drop D, medio tono abajo, Open G, Open D y DADGAD. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | — |
| **A-08** | Afinación personalizada ajustando cada cuerda por semitonos. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | Cualquier ajuste convierte la afinación en personalizada sin alterar los presets. |
| **A-09** | Al seleccionar una afinación se muestran sus notas en un pentagrama. | Media | F1.1 | ✅ | ⬜ | 0.1.0 | Ver P-04. |
| **A-10** | La afinación activa se aplica también a los modos de aprendizaje. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | Ninguna nota está escrita a mano: todas derivan de la afinación activa, y la propagación ocurre en un único punto del código. |
| **A-11** | La afinación persiste entre sesiones. | Media | F1.1 | ✅ | ⬜ | 0.1.0 | — |

---

## 15. Visualización

| ID | Requisito | Prior. | Etapa | Impl. | Valid. | Desde | Notas |
|----|-----------|--------|-------|:-----:|:------:|:-----:|-------|
| **V-01** | En móvil se **sugiere** la orientación horizontal con un aviso discreto; no se fuerza. | Alta | F3.2 | 🟡 | ⬜ | 0.1.0 | El bloqueo de orientación tiene mal soporte en iOS. Menos trastes visibles en vertical es la solución adoptada. Falta el aviso y un diseño apaisado que dé altura a las cuerdas. |
| **V-02** | El afinador funciona en vertical y en horizontal. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | — |
| **V-03** | En escritorio el mástil aprovecha el ancho disponible. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | Arranca mostrando el mástil completo en pantallas anchas. |
| **V-04** | Control de zoom que determina qué porción del mástil se ve. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | De 3 a 24 trastes a la vista. Desde 0.1.1 la etiqueta indica los trastes que caben de verdad, y el zoom conserva el tramo que estabas mirando. |
| **V-05** | Cuando el mástil no cabe, el usuario se desplaza lateralmente. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | — |
| **V-06** | El ancho de traste no cambia al desplazarse: el zoom fija el tamaño y el desplazamiento mueve la ventana. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | — |
| **V-07** | El mástil se readapta al redimensionar la ventana. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | — |
| **V-08** | El nivel de zoom persiste entre sesiones. | Baja | F1.1 | ✅ | ⬜ | 0.1.0 | Desde 0.1.1 girar el móvil ya no pisa el zoom elegido. |
| **V-09** | Al ocultar la numeración se puede conservar una **referencia de tramo**: el modo «Guía» deja solo los números de los trastes con marca. | Media | F1.3 | ✅ | ⬜ | 0.1.2 | Sin números, los trastes 5 y 17 llevan la misma marca y se confunden. Se descartó el minimapa por desproporcionado. |

---

## 16. Configuración y navegación

| ID | Requisito | Prior. | Etapa | Impl. | Valid. | Desde | Notas |
|----|-----------|--------|-------|:-----:|:------:|:-----:|-------|
| **C-01** | Menú de configuración accesible desde cualquier pantalla. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | Panel deslizante desde la cabecera. |
| **C-02** | El menú contiene nomenclatura, pentagrama, timbre, numeración de trastes (tres modos), ver todas las notas, señalar iguales y afinación activa, y muestra la versión de la app. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | Ampliado en 0.1.2 con la numeración en tres modos y la versión (G-10). |
| **C-03** | Los ajustes frecuentes tienen acceso rápido sin abrir el menú. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | Nomenclatura, pentagrama y las dos pistas del juego. |
| **C-04** | Navegación principal clara entre las áreas de la app. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | Barra inferior con cuatro destinos. |
| **C-05** | Todos los ajustes persisten entre sesiones. | Media | F1.1 | ✅ | ⬜ | 0.1.0 | Un único objeto de estado, validado campo a campo al leerlo (0.1.1). |
| **C-06** | Especificación detallada de la interfaz: estructura de menús, jerarquía de controles y flujos de navegación. | Alta | F3.1 | ⬜ | ⬜ | — | Bloqueante de F3.2 y de toda F5. Requiere sesión dedicada. |

---

## 17. Respaldo y publicación

| ID | Requisito | Prior. | Etapa | Impl. | Valid. | Desde | Notas |
|----|-----------|--------|-------|:-----:|:------:|:-----:|-------|
| **X-01** ✏️ | El código y la documentación están **respaldados** en el repositorio remoto (GitHub). Respaldar no es publicar. | Alta | F1.2 · F1.4 | 🟡 | ⬜ | 0.0.1 | El repositorio existe con la versión 0.0.1. Reorganizado en local el 14/10 (rama `auto/F1-iteracion-0`): `docs/`, `tests/`, `samples/`, `CLAUDE.md` y la app 0.1.3. Falta subirlo, para lo que hay que vincular GitHub a Claude. |
| **X-02** | La app está **publicada** en una URL pública (GitHub Pages). | Alta | F7.1 | ⬜ | ⬜ | — | Antes en V1; pasa a la última fase por decisión del 15/09: desarrollo local de principio a fin. |
| **X-03** | La app está verificada en móviles reales, instalada como icono desde la web publicada. | Alta | F7.2 | ⬜ | ⬜ | — | Cierra G-04 y PL-01 a PL-03 en su modo web. |

---

## 18. Matriz de trazabilidad por etapa

Qué requisitos cierra o valida cada etapa del roadmap. Es la misma información que la columna *Etapa*, ordenada al revés.

| Etapa | Requisitos |
|---|---|
| **F1.1** | G-01, G-02, N-01, N-02, N-03, N-04, N-05, D-01, D-02, D-03, D-05, D-06, D-07, S-01, S-02, S-03, S-04, S-05, S-06, P-01, P-02, P-04, L-01, L-02, L-03, J-01, J-02, J-03, J-04, J-05, J-06, J-07, J-08, J-09, A-01, A-06, A-07, A-08, A-09, A-10, A-11, V-02, V-03, V-04, V-05, V-06, V-07, V-08, C-01, C-02, C-03, C-04, C-05 |
| **F1.2** | X-01 |
| **F1.3** | G-10, D-04, J-10, J-12, V-09 |
| **F1.4** | X-01 |
| **F2.1** | G-06, S-07, S-08 |
| **F2.2** | S-01 |
| **F2.3** | G-07, S-07 |
| **F2.4** | S-01, S-08 |
| **F2.5** | G-07, PL-01, PL-02, PL-03 |
| **F3.1** | C-06 |
| **F3.2** | V-01 |
| **F3.4** | G-05 |
| **F4.1** | G-08 |
| **F4.2** | A-02-CA |
| **F4.3** | A-02, A-03, A-04, A-05 |
| **F4.4** | J-11 |
| **F5.2** | E-01, E-02 |
| **F5.3** | P-03, E-03, E-04, E-06 |
| **F5.4** | E-05 |
| **F6.1** | G-08 |
| **F6.2** | G-03 |
| **F6.3** | G-04 |
| **F6.4** | G-06, G-11 |
| **F7.1** | X-02 |
| **F7.2** | G-04, PL-01, PL-02, PL-03, X-03 |
| **F7.4** | G-09 |
| **Posterior** | E-02b, E-05b |

---

## 19. Riesgos

| Riesgo | Impacto | Estado | Mitigación |
|--------|---------|--------|------------|
| **Dependencia de samples de terceros.** El audio se carga del repositorio personal de otra persona, sin versión fijada; si cambia, la app deja de sonar sin que toquemos nada. | Alto | ✏️ Mitigado → F2.2 | Las muestras ya están en `samples/` (F2.1). La app deja de descargarlas en F2.2. |
| **Licencia del audio sin verificar.** Hay referencias contradictorias sobre si esos samples son de dominio público o CC-BY. | Medio | ✏️ Resuelto en lo esencial | Verificado en F2.1: CC BY con atribución, apta también para tiendas. Queda confirmar que todos los sonidos del pack de nylon comparten licencia. Detalle en `CREDITOS.md`. |
| 🆕 **Muestras mal etiquetadas.** Un archivo que dice ser una nota y suena en otra enseña una nota equivocada sin que nadie lo note. | Alto | Resuelto | Pasó con el `D5.mp3` de nylon (0.1.2). S-08: cada muestra se mide antes de usarse y el banco lo vigila. |
| 🆕 **iPhone no ejecuta archivos HTML locales.** La vista previa de la app Archivos no ejecuta JavaScript, así que el modo archivo autónomo probablemente no sirve en iOS. | Medio | Abierto → F2.5 | Confirmarlo en el dispositivo. Alternativas: navegador integrado de una app de terceros, o un despliegue de pruebas sin anunciar. |
| 🆕 **El micrófono no funciona por WiFi.** Desde el móvil contra el Live Server del ordenador (`http://192.168…`) no hay contexto seguro. | Medio | Conocido | A-02 en el móvil llega con la publicación (F7.2). Hasta entonces, el afinador por micrófono se usa en el ordenador. |
| 🆕 **App Store puede rechazar una web empaquetada.** Apple exige que la app aporte algo más que una web (funcionalidad mínima). | Medio | Abierto → F7.4 | Llegar con funcionamiento sin conexión, audio y afinador propios. Decidir App Store con datos; empezar por Google Play y Microsoft Store. |
| 🆕 **Verificación de Android con la web en subcarpeta.** Para empaquetar en Google Play, el archivo de verificación de dominio debe estar en la raíz (`pdigue.github.io/.well-known/`), no en `/guitarra/`. | Bajo | Abierto → F7.4 | Crear el repositorio de usuario `pdigue.github.io` o usar un dominio propio. |
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

## 20. Decisiones abiertas

| # | Decisión | Afecta a | Plazo |
|---|---|---|---|
| 1 | C-06: especificación de interfaz y navegación | C-06, V-01, F5 | Antes de F3.2 |
| 2 | Paleta de colores por nota (la de la imagen inicial o la actual) | G-05 | Antes de F3.4 |
| 3 | J-11: récord único o por afinación | J-11 | Antes de F4.4 |
| 4 | E-01: catálogo inicial de escalas | E-01, E-02 | Antes de F5.2 |
| 5 | Licencia del código (MIT u otra) | G-06 | Antes de F6.4 |
| 6 | Tiendas: cuáles y en qué orden | G-09 | Antes de F7.4 |

**Cerradas el 14/10:** S-07 → opción A, licencia verificada · móvil de referencia → iPhone · automatización → modo acelerado por bloques (F1–F3, sesión con el móvil, F4–F6, sesión con la guitarra, F7).

**Cerradas antes:** nombre (*Trasteando*) · L-02 (ajuste del usuario) · J-10 (el fallo rompe la racha) · E-05 (solo pertenencia) · A-07 (cinco afinaciones) · V-01 (sugerir, no forzar).

---

*Documento gestionado por el chat de Desarrollo. Los chats auditores lo leen y proponen cambios en sus informes; no lo modifican. Cada cambio se anota en la sección 2 y se avisa al usuario.*
