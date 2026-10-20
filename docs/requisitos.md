# Trasteando — Especificación de Requisitos

**Versión del documento:** 1.15 · **Fecha:** 20 de octubre de 2026  
**Válido para:** app `0.3.3` · `roadmap.md` v3.13 · `matriz-cumplimiento` v1.13 · fase en curso **F3**, en modo acelerado  
**Repositorio:** github.com/pdigue/guitarra, carpeta `docs/` · **Gestiona:** chat de Desarrollo  
**Tipo de producto:** aplicación web progresiva (PWA), desarrollada en local y publicada al final del roadmap

---

## 1. Estado de un vistazo

| Total | ✅ Implementados | 🟡 Parciales | ⬜ Pendientes | ✅ Validados |
|:---:|:---:|:---:|:---:|:---:|
| 95 | 66 | 8 | 21 | 43 |

> Un requisito implementado no cuenta como cumplido hasta superar su prueba. El primero validado fue **S-08**, en la 0.2.0. La Sesión 1 (20/10, en tu iPhone y tu PC) validó 40 de golpe; los de sonido en el iPhone esperan a la Sesión 2.

| Fase | Objetivo | Requisitos | Implementados |
|------|----------|:---:|-----------|
| **F1** | Base local verificada | 59 | `▰▰▰▰▰▰▰▰▰▰` 59/59 |
| **F2** | Sonido propio y archivo autónomo | 9 | `▰▰▰▰▱▱▱▱▱▱` 4/9 |
| **F3** | Interfaz y adaptación | 6 | `▰▰▰▰▰▰▰▰▱▱` 5/6 |
| **F4** | Afinador por micrófono | 7 | `▱▱▱▱▱▱▱▱▱▱` 0/7 |
| **F5** | Escalas | 7 | `▱▱▱▱▱▱▱▱▱▱` 0/7 |
| **F6** | Preparación para distribución | 5 | `▱▱▱▱▱▱▱▱▱▱` 0/5 |
| **F7** | Publicación y lanzamiento | 9 | `▱▱▱▱▱▱▱▱▱▱` 0/9 |
| **Posterior** | Fuera del alcance actual | 4 | `▱▱▱▱▱▱▱▱▱▱` 0/4 |

*Un requisito puede aparecer en dos fases si se implementa en una y se valida o completa en otra.*

---

## 2. Control de cambios

| Versión | Fecha | App | Roadmap | Resumen | Origen |
|---|---|:---:|:---:|---|---|
| **1.15** | 20/10/2026 | 0.3.3 | 3.13 | Sesión 1: 40 requisitos validados en tu iPhone y tu PC; correcciones de la 0.3.3. 2 nuevos (C-08, S-09) y 5 modificados: 95 en total. | Sesión 1 (`V-08`) |
| 1.14 | 20/10/2026 | 0.3.2 | 3.12 | Zoom: «+» enseña más trastes y se pueden pedir trastes de hasta 28 px con el dedo. 0 nuevos y 2 modificados: 93 en total. | Tu comentario del 20/10 |
| 1.13 | 20/10/2026 | 0.3.1 | 3.11 | Etapa F3.4: G-05 implementado y paleta decidida. 0 nuevos y 2 modificados: 93 en total. | Tu decisión del 20/10, AR-06 y AT-05 |
| 1.12 | 20/10/2026 | 0.3.0 | 3.10 | Etapa F3.2: V-01 y C-07 implementados. 0 nuevos y 8 modificados: 93 en total. | Etapa F3.2, AR-05 y AT-04 |
| 1.11 | 20/10/2026 | 0.2.3 | 3.9 | Interfaz aprobada (F3.1): C-06 validado. 1 nuevo (C-07) y 8 modificados: 93 en total. | Tu aprobación de `interfaz.md` |
| 1.10 | 20/10/2026 | 0.2.3 | 3.8 | Licencia del pack de nylon completa: S-07 implementado y validado. 0 nuevos y 1 modificado: 92 en total. | Tu comprobación en Freesound |
| 1.9 | 20/10/2026 | 0.2.3 | 3.7 | Dos decisiones cerradas y licencia de nylon comprobada en tres sonidos. 0 nuevos y 3 modificados: 92 en total. | Tus decisiones del 20/10 |
| 1.8 | 19/10/2026 | 0.2.3 | 3.6 | Auditoría CP-2. 0 nuevos y 4 modificados: 92 en total. Dos decisiones nuevas. | AR-03 y AT-03 |
| 1.7 | 19/10/2026 | 0.2.2 | 3.5 | S-08 reformulado con tu aprobación; registro agudo de nylon (F2.4). 0 nuevos y 2 modificados: 92 en total. | Etapa F2.4 |
| 1.6 | 19/10/2026 | 0.2.1 | 3.4 | Archivo autónomo (F2.3): G-07 implementado. 0 nuevos y 3 modificados: 92 en total. | Etapa F2.3 |
| 1.5 | 19/10/2026 | 0.2.0 | 3.3 | Reproductor propio (F2.2): S-08 validado, la app ya no descarga nada de fuera. 0 nuevos y 4 modificados: 92 en total. | Etapa F2.2 |
| 1.4 | 15/10/2026 | 0.1.4 | 3.2 | Dos decisiones cerradas: despliegue de pruebas y Android. 1 nuevo (PL-04) y 2 modificados: 92 en total. | Tus decisiones del 15/10 |
| 1.3 | 15/10/2026 | 0.1.4 | 3.1 | Tres decisiones cerradas: audio (opción A), móvil de referencia (iPhone) y modo acelerado. 1 nuevo (S-08) y 6 modificados: 91 en total. | Iteración 0, medición de F2.1 y auditoría CP-1 |
| 1.2 | 14/10/2026 | 0.1.2 | 3.0 | Fases F1–F7. Columnas *Validado*, *Etapa* y *Desde*. Sección de plataformas. 9 nuevos y 12 modificados: 90 en total. | Tu aprobación del 14/10 y revisión de código |
| 1.1 | 15/09/2026 | 0.1.1 | 2.0 | Reconciliación de estados. 11 nuevos (S-07, V-09, J-11, G-05, G-06, A-02-CA, E-02b, E-05b, X-01 a X-03): 81 en total. Seis decisiones cerradas. | Auditoría de requisitos AR-01 |
| 1.0 | 14/09/2026 | 0.1.0 | — | Primera versión: 70 requisitos en 11 categorías. | Tu listado inicial |

### Detalle de la versión 1.15

**Validados en la Sesión 1 ✅** — G-01, G-02, G-05, G-07, G-10, L-01, L-02, L-03, S-02, S-03, P-01, P-04, N-01, N-03, N-04, V-01, V-04, V-05, V-06, V-07, V-09, D-04, D-05, D-06, A-08, J-01, J-02, J-03, J-04, J-05, J-06, J-07, J-08, J-09, J-10, J-12, C-01, C-04, C-05, C-07. Con S-07, S-08 y C-06, ya son 43 los validados.

**Requisitos nuevos 🆕** — S-09, C-08
- **C-08:** menú «Personalización» (estilos de nota y de traste, interior claro, temas de color). Para una actualización posterior.
- **S-09:** un timbre más parecido a tu guitarra. Para una actualización posterior.

**Requisitos modificados ✏️** — S-01, S-02, J-01, J-08, J-10
- **J-01:** Adivinar empieza con ▶ y la lectura grande muestra la nota buscada.
- **J-08:** restablecer los ajustes conserva el récord; se borra aparte.
- **J-10:** más tiempo antes de la corrección, y relleno con ✓ o ✗.
- **S-01:** sonido en el iPhone: se pausa al bloquear y se reactiva al volver. Queda pendiente de la Sesión 2.
- **S-02:** elegir guitarra ya no hace sonar una nota.

**Siguen sin validar, con motivo:** S-01 (mudo en el iPhone), PL-01, PL-03 y G-04 (parciales hasta publicar, F7.2), A-01 y A-06 (afinar de oído, E05, lo dejaste para más adelante).

### Detalle de la versión 1.14

**Requisitos modificados** — V-04, G-05
- **V-04:** «+» enseña más trastes y «−» menos. Con el dedo, la vista por defecto sigue con trastes de 40 px, pero puedes pedir más trastes, de hasta 28 px.
- **G-05:** la regla de 40 × 40 px admite esa excepción: los trastes más estrechos solo aparecen si tú los pides.

### Detalle de la versión 1.13

**Requisitos modificados** — G-05, L-03
- **G-05:** implementado en la 0.3.1: teclado, contraste, movimiento reducido, tamaños táctiles y paleta. Su criterio en la matriz añade los umbrales de la paleta.
- **L-03:** las posiciones del mismo sonido llevan contorno y, con «Ver todas las notas», un anillo exterior.

**Decisión cerrada:** paleta por nota (F3.4). Ver sección 20.

### Detalle de la versión 1.12

**Requisitos modificados** — G-05, PL-04, V-01, V-04, C-01, C-03, C-04, C-07
- **V-01:** implementado en la 0.3.0: 52,8 px por cuerda en horizontal en el iPhone con Safari y aviso para girar. Falta validarlo en tu iPhone.
- **V-04:** implementado entero: con el dedo, trastes de al menos 40 px. Lo que se ajusta es lo que se muestra; el zoom guardado se conserva (V-08).
- **C-07:** implementado en la 0.3.0. Falta la prueba a mano en Windows y Android.
- **G-05:** controles de 40 px también en Ajustes y Ajustes como diálogo. **Nueva excepción:** en vertical, por debajo de 660 px de alto, la navegación manda sobre los 40 px por cuerda (AR-05).
- **C-01, C-03, C-04 y PL-04:** notas al día con la 0.3.0.

### Detalle de la versión 1.11

**Requisito nuevo 🆕** — C-07: el botón o gesto «atrás» del sistema cierra Ajustes o vuelve al área anterior, sin bloquear la salida desde la primera área. Etapa F3.2, prioridad media.

**Requisitos modificados** — G-05, V-01, V-04, C-01, C-02, C-03, C-04, C-06
- **C-06:** implementado y validado con `interfaz.md` v1.0: revisada por el auditor (AR-04) y aprobada por ti.
- **V-01:** criterio concreto del aviso para girar y de los 40 px por cuerda en horizontal, exigidos con un alto útil de 268 px o más.
- **V-04:** en pantallas táctiles, trastes de al menos 40 px (como mucho 8 a la vista en el iPhone en vertical). Pasa a parcial hasta F3.2.
- **G-05:** el criterio incluye controles y casillas de al menos 40 × 40 px en pantallas táctiles.
- **C-01, C-02, C-03 y C-04:** solo las notas, para describir la interfaz aprobada.

**Decisión cerrada:** especificación de interfaz (C-06). Ver sección 20.

### Detalle de la versión 1.10

**Requisitos modificados** — S-07
- **S-07:** pasa a implementado y validado. Los 161 sonidos del pack de nylon tienen licencia CC BY («Attribution»), con dos filtros de control a 0. Era lo único que faltaba.

**Riesgos:** la licencia del audio pasa a resuelta.

### Detalle de la versión 1.9

**Requisitos modificados** — G-03, S-01, S-07
- **G-03:** el Service Worker se queda en F6.2. En la Sesión 1 el iPhone usa la web con conexión.
- **S-01:** el agudo de la acústica (hasta 14 semitonos de transporte) queda aceptado como limitación conocida.
- **S-07:** licencia «Attribution 4.0» comprobada en tres sonidos del pack de nylon; falta la vista del pack entero.

**Decisiones cerradas:** Service Worker → F6.2 · agudo de la acústica → aceptado. Ver sección 20.

### Detalle de la versión 1.8

**Requisitos modificados** — G-07, S-01, S-07, X-01
- **G-07:** se limita a Windows y Android; en iPhone la autonomía llega por G-03. Límites de peso revisados: audio ≤ 1,45 MB y archivo ≤ 2 MB.
- **X-01:** cumple. Todo está en GitHub, cada versión entra por pull request aprobado y F1 se cerró con `v0.1.5`.
- **S-07:** la licencia del pack de nylon se revisa lo antes posible, como tarde al cerrar F3, porque el repositorio ya es público.
- **S-01:** tu escucha del 19/10 queda registrada (V-05); el agudo de la acústica, como limitación conocida pendiente de tu decisión.

**Decisiones nuevas:** Service Worker antes de la Sesión 1 o en F6.2; aceptar o no el agudo de la acústica. Ver sección 20.

### Detalle de la versión 1.7

**Requisitos modificados** — S-01, S-08
- **S-08:** nueva redacción, aprobada por ti el 19/10. Exige ±5 cents a la nota que suena, una vez corregida la grabación, y que cada grabación sea su nota y esté medida. Antes lo exigía a la grabación sin corregir, lo que impedía usar las agudas de nylon, que se desvían 9 y 10 cents.
- **S-01:** nylon con La♯5; transporte máximo de 6 semitonos en afinación estándar (14 en la acústica).

### Detalle de la versión 1.6

**Requisitos modificados** — G-07, G-08, S-07
- **G-07:** implementado en la 0.2.1 con `dist/trasteando.html`, la app con el audio dentro. Se cierra el retroceso de la 0.2.0. Falta probarlo en cada plataforma (F2.5).
- **G-08:** las dos formas de distribución existen ya de verdad, y el banco vigila que el autónomo esté al día.
- **S-07:** la revisión de la licencia del pack de nylon, que estaba prevista antes de F2.3 y sigue pendiente, pasa a ser condición antes de publicar (F7).

### Detalle de la versión 1.5

**Requisitos modificados** — G-07, S-01, S-07, S-08
- **S-08:** validado. Es el primer requisito que supera su prueba: la app usa sus grabaciones medidas y corrige su desviación.
- **S-01:** suena con el reproductor propio; las 22 notas grabadas en el navegador, a menos de 1 cent.
- **S-07:** la app ya no descarga audio de fuera. Sigue parcial hasta meter el audio en el archivo (F2.3) y revisar la licencia del pack de nylon.
- **G-07:** retroceso temporal anotado: con doble clic suena el sintetizador hasta F2.3.

### Detalle de la versión 1.4

**Requisito nuevo** — PL-04: adaptabilidad entre sistemas operativos, a petición tuya. Su evidencia es `docs/compatibilidad.md`.

**Requisitos modificados** — PL-02, X-02
- **PL-02:** sin Android de pruebas por ahora; mantiene la prioridad Alta y se valida con el simulador de Chrome hasta tener uno.
- **X-02:** se añade un despliegue de pruebas, sin anunciar, antes de la Sesión 1. La publicación oficial sigue en F7.1.

**Decisiones cerradas:** despliegue de pruebas en `https` → sí, antes de la Sesión 1 · Android de pruebas → ninguno por ahora.

### Detalle de la versión 1.3

**Requisito nuevo** — S-08. Al medir la afinación de cada muestra en F2.1 apareció un archivo un semitono alto que la app usaba desde la 0.1.0. La afinación de las muestras pasa a ser un requisito medible, en lugar de suponerse. Tras CP-1 se redacta según la nota asignada, no el nombre del archivo, y queda sin validar hasta que la app use sus propias muestras.

**Requisitos modificados** — S-01, S-07, G-06, G-03, PL-03, X-01

- **S-01:** las muestras ya están en el proyecto y la 0.1.3 corrige el registro agudo de nylon.
- **S-07:** pasa a parcial. Opción A decidida, licencias verificadas y archivos en `samples/`; falta que la app los use.
- **G-06:** pasa a parcial con `CREDITOS.md`.
- **PL-03:** el iPhone es el móvil de referencia; cómo se prueba hasta publicar.
- **X-01:** repositorio reorganizado en local, pendiente de subir. Subirlo pasa a ser parada antes de F2.2.
- **G-03** (CP-1): se valida en dos pasos, en `localhost` (F6.2) y desde la web (F7.2).
- **G-06** y **PL-03** (CP-1): redacción. G-06 pide también mostrar los créditos en la app; PL-03 cierra un inciso.

**Decisiones cerradas:** audio S-07 → opción A · móvil de referencia → iPhone · pista de automatización → modo acelerado por bloques. **Abiertas por CP-1:** despliegue de pruebas en `https` y Android de pruebas, cerradas en la 1.4.

**Riesgos:** el de la licencia del audio queda resuelto en lo esencial, el de la dependencia de terceros pasa a mitigado y se añade el de muestras mal etiquetadas, ya resuelto. Ver sección 19.

**Erratas:** la versión 1.2 remitía a las secciones 16 y 17 para riesgos y decisiones; son la 19 y la 20.

**Auditoría CP-1:** los informes AR-02 y AT-02 están en `docs/auditorias/`, con la respuesta a cada hallazgo.

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
| **G-01** | La aplicación se llama *Trasteando*. El nombre aparece en la pantalla de entrada, el título de la pestaña y el manifiesto PWA. | Alta | F1.1 | ✅ | ✅ | 0.1.0 | Naming cerrado: se descarta *Trasting*. **Validado en la Sesión 1** (20/10, `V-08`): A01. |
| **G-02** | La app se organiza en áreas accesibles desde una navegación principal: Libre, Adivinar, Afinador y Escalas. | Alta | F1.1 | ✅ | ✅ | 0.1.0 | Escalas visible pero deshabilitada hasta F5. **Validado en la Sesión 1** (20/10, `V-08`): A12. |
| **G-03** | La app funciona sin conexión una vez cargada **desde la web**. | Media | F6.2 · F7.2 | ⬜ | ⬜ | — | Service Worker en F6.2, decidido el 20/10: en la Sesión 1 el iPhone no prueba la app sin conexión. Depende de S-07. Se valida en dos pasos: en `localhost` en F6.2 y desde la web publicada en F7.2 (CP-1). En modo archivo (G-07) la autonomía se consigue de otra forma: el audio va dentro del archivo. |
| **G-04** | La app es instalable como PWA (icono en la pantalla de inicio, pantalla completa). | Alta | F6.3 · F7.2 | 🟡 | ⬜ | 0.1.0 | Manifiesto incrustado como `data:` URL. Falta un archivo de manifiesto propio con iconos PNG (F6.3) y verificarla instalada desde la web publicada (F7.2): instalar solo es posible desde `https`. |
| **G-05** | La interfaz cumple unos mínimos de accesibilidad: foco de teclado visible, respeto a `prefers-reduced-motion`, contraste suficiente y etiquetas accesibles en los controles solo-icono. | Media | F3.4 | ✅ | ✅ | 0.1.1 | **Hecho en la 0.3.1** (F3.4, V-07). Con el teclado se llega a todo y el foco se ve; el mástil es una cuadrícula (`role="grid"`) que se recorre con las flechas y se toca con Intro; en Adivinar ninguna casilla anuncia su nota (J-12). Todos los textos a 4,5:1 o más, medidos en Chromium sobre su fondo real (con la 0.3.0 había 205 por debajo). Con «reducir movimiento» nada se anima. Con el dedo, controles y casillas de 40 × 40 px, también en Ajustes (salvo si pides más trastes con «+», que pueden estrecharse hasta 28 px); la fila entera cambia su interruptor, y el asa cierra Ajustes deslizando. **Paleta por nota** con tu criterio del 20/10: 7 naturales bien separadas, también con daltonismo, y sostenidos derivados (`herramientas/paleta.py`). **Excepción** (AR-05): en vertical, por debajo de 660 px de alto, la navegación manda sobre los 40 px por cuerda. **Validado en la Sesión 1** (20/10, `V-08`): A18, C05 y C06. |
| **G-06** | El proyecto documenta sus dependencias externas y la licencia de cada recurso de terceros que distribuye, y la app muestra los créditos. | Media | F2.1 · F6.4 | 🟡 | ⬜ | — | `CREDITOS.md` (F2.1): origen, licencia, huella `sha256` y texto de atribución de cada muestra de audio, y Tone.js (MIT). Falta mostrar los créditos dentro de la app y elegir la licencia del propio código (F6.4). |
| **G-07** | **Modo archivo autónomo** en Windows y Android: la app funciona completa —salvo el afinador por micrófono— abriendo el archivo directamente (`file://`), sin servidor y sin conexión. En iPhone, donde no se pueden abrir páginas desde Archivos, la autonomía llega por G-03. | Alta | F2.3 · F2.5 | ✅ | ✅ | 0.2.1 | `dist/trasteando.html`: la app con sus 17 grabaciones dentro (1,46 MB). Límites revisados en CP-2: el audio no pasa de 1,45 MB, y bajar su calidad exige tu escucha; el archivo entero no pasa de 2 MB, para dejar sitio al código de F3 a F6. Lo que cuenta para ti es que abra en ≤ 3 s en Windows: en Chromium tarda 0,3 s, y en tu PC se mide en la Sesión 1 (F2.5). Redacción limitada a Windows y Android tras AR-03. **Validado en la Sesión 1** (20/10, `V-08`): B02, B03, B04 y C09. |
| **G-08** | El proyecto conserva **dos formas de distribución** equivalentes: el archivo autónomo (para llevárselo) y la web publicada (para instalarla como PWA). | Media | F4.1 · F6.1 | 🟡 | ⬜ | 0.1.0 | Desde la 0.2.1 hay dos formas reales: `index.html` para servir (Live Server y web) y `dist/trasteando.html`, generado a partir de él con `herramientas/generar-autonomo.py`. El banco comprueba que el autónomo está al día con `index.html`. Se vuelve más exigente al pasar a módulos (F4.1); F6.1 generará el archivo autónomo a partir de ellos. |
| **G-09** | La app podrá distribuirse por **tiendas oficiales** —Google Play, Microsoft Store y, si compensa, App Store— empaquetando la PWA publicada. | Media | F7.4 | ⬜ | ⬜ | — | Decisión de producto en F7.4. Exige S-07 con licencia limpia, G-11 y la web publicada (X-02). Cuentas, costes y archivos necesarios: roadmap, *Inventario de lanzamiento*. |
| **G-10** | **Control de versiones de la app:** cada versión tiene número propio con la pauta `0.‹fase›.‹corrección›` —`1.0.0` en el lanzamiento—, se registra en `CHANGELOG.md` y se muestra en Ajustes. | Alta | F1.3 | ✅ | ✅ | 0.1.2 | Vincula cada versión con su fase del roadmap. Cada fase cerrada se marca además con una etiqueta de Git (F1.4). **Validado en la Sesión 1** (20/10, `V-08`): A02. |
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
| **PL-02** | **Android:** la app funciona en Chrome —en web e instalada como PWA— y, si es viable, en modo archivo. | Alta | F2.5 · F7.2 | 🟡 | ⬜ | 0.1.0 | Modo archivo: abrir el HTML descargado con Chrome; a verificar en F2.5. Tienda: Google Play empaquetando la PWA (F7.4). **Sin Android de pruebas por ahora** (decisión del 15/10): mantiene la prioridad Alta, se valida con el simulador de dispositivos de Chrome como evidencia parcial y en un Android real en cuanto haya uno, como tarde en F7.2. |
| **PL-03** | **iPhone y iPad:** la app funciona en Safari, en web e instalada con «Añadir a pantalla de inicio». | Alta | F2.5 · F7.2 | 🟡 | ⬜ | 0.1.0 | Modo archivo probablemente inviable: la vista previa de la app Archivos no ejecuta JavaScript (a confirmar en F2.5). Alternativas: el navegador integrado de una app de terceros o un despliegue de pruebas. Tienda: App Store exige un Mac con Xcode y la cuenta de desarrollador de Apple (F7.4). **Móvil de referencia del proyecto desde el 14/10.** Hasta publicar, se prueba con la app servida desde el ordenador por WiFi (Live Server): funciona todo salvo el micrófono y la instalación. |
| **PL-04** | **Adaptabilidad entre sistemas:** la app solo usa estándares web; detecta cada capacidad en lugar del sistema, y toda capacidad que no esté en Windows, Android e iPhone tiene alternativa, de modo que la app sigue funcionando donde falta. | Alta | F2.2 · F3.2 · F7.2 | 🟡 | ⬜ | 0.1.4 | Decisión del 15/10. Inventario de capacidades, comportamiento por sistema y alternativas en `docs/compatibilidad.md`, que se revisa en cada etapa que añade una capacidad. Hoy ya se cumple para la vibración (se omite donde no existe) y para el audio interrumpido de iOS (0.1.4). En F3.2 (0.3.0) se añaden el tipo de puntero, el historial, `grid` y `display: contents`, y `position: sticky`, cada uno con su alternativa (`compatibilidad.md` v1.2), y el banco arranca la app sin ellos. |

---

## 7. Nomenclatura y notación

| ID | Requisito | Prior. | Etapa | Impl. | Valid. | Desde | Notas |
|----|-----------|--------|-------|:-----:|:------:|:-----:|-------|
| **N-01** | Alternancia entre nomenclatura latina (Do, Re, Mi…) y anglosajona (C, D, E…). | Alta | F1.1 | ✅ | ✅ | 0.1.0 **Validado en la Sesión 1** (20/10, `V-08`): A06. | — |
| **N-02** | El cambio de nomenclatura está en el menú de configuración. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | — |
| **N-03** | El cambio de nomenclatura está **además** en la interfaz principal, sin abrir el menú. | Alta | F1.1 | ✅ | ✅ | 0.1.0 | Chip en la barra de acceso rápido. **Validado en la Sesión 1** (20/10, `V-08`): A06. |
| **N-04** | La nomenclatura se aplica de forma consistente en mástil, juego, afinador y pentagrama. | Alta | F1.1 | ✅ | ✅ | 0.1.0 | Verificar de nuevo al añadir Escalas (F5). **Validado en la Sesión 1** (20/10, `V-08`): A06. |
| **N-05** | La nomenclatura persiste entre sesiones. | Media | F1.1 | ✅ | ⬜ | 0.1.0 | `localStorage`. |

---

## 8. Diapasón

| ID | Requisito | Prior. | Etapa | Impl. | Valid. | Desde | Notas |
|----|-----------|--------|-------|:-----:|:------:|:-----:|-------|
| **D-01** | Diagrama del mástil de 6 cuerdas. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | — |
| **D-02** | Cada cuerda muestra a la izquierda su nota al aire, derivada de la afinación activa. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | Se actualiza sola al cambiar de afinación (A-10). |
| **D-03** | Cada traste muestra su número alineado exactamente sobre la franja donde se pulsa. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | La fila de números comparte las mismas variables de ancho (`--label-w`, `--nut-w`, `--fret-w`) que las celdas. |
| **D-04** | La numeración de trastes tiene **tres modos**: todos, guía (solo los trastes con marca) y ninguno. | Media | F1.3 | ✅ | ✅ | 0.1.2 | Sustituye al interruptor de la 0.1.1; quien lo tuviera apagado pasa automáticamente a «ninguno». **Validado en la Sesión 1** (20/10, `V-08`): A11. |
| **D-05** | Al pulsar una posición suena esa nota. | Alta | F1.1 | ✅ | ✅ | 0.1.0 **Validado en la Sesión 1** (20/10, `V-08`): E03. | — |
| **D-06** | Al pulsar una posición aparece el nombre de la nota en la nomenclatura activa. | Alta | F1.1 | ✅ | ✅ | 0.1.0 **Validado en la Sesión 1** (20/10, `V-08`): E03. | — |
| **D-07** | Marcadores de posición en los trastes habituales (3, 5, 7, 9, 12, 15, 17, 19, 21, 24). | Media | F1.1 | ✅ | ⬜ | 0.1.0 | — |

---

## 9. Sonido

| ID | Requisito | Prior. | Etapa | Impl. | Valid. | Desde | Notas |
|----|-----------|--------|-------|:-----:|:------:|:-----:|-------|
| **S-01** ✏️ | El sonido corresponde a una guitarra real, no a un sintetizador genérico. | Alta | F1.1 · F2.2 · F2.4 | ✅ | ⬜ | 0.1.0 | Reproductor propio con las grabaciones de `samples/` desde la 0.2.0. Desde la 0.2.2 la guitarra clásica tiene también la grabación de La♯5: en afinación estándar ninguna nota se transporta más de 6 semitonos, y el traste 24 suena menos artificial. La acústica no tiene grabaciones por encima del Re5 y llega a 14: **limitación conocida, aceptada por ti el 20/10**; se comprueba de oído en la Sesión 1 (trastes 15 a 24 de la 1ª cuerda). Escuchada por ti en el iPhone con la 0.2.0 el 19/10 (V-05). La 0.1.3 corrigió el registro agudo de nylon, que sonaba medio tono alto. **Sesión 1 (20/10, `V-08`):** suena bien en el PC y en el iPhone, pero en el iPhone el sonido se quedó mudo dos veces (C08 y D03) y solo volvió cerrando la app; además seguía sonando con la pantalla bloqueada (C07). Es un fallo conocido de Safari en las apps de pantalla de inicio (WebKit 291892). **Desde la 0.3.3**, al ocultar la app se corta el sonido y se pausa el audio; al volver se reanuda, y si iOS no lo suelta se crea un audio nuevo; Ajustes enseña el estado del sonido y tiene «Reactivar sonido». Se valida cuando la Sesión 2 confirme que no vuelve a quedarse mudo. |
| **S-02** ✏️ | El usuario elige entre guitarra clásica (nylon) y acústica (acero). | Alta | F1.1 | ✅ | ✅ | 0.1.0 | Cambiar de timbre descarga otro set de muestras, con aviso. Desde 0.1.2, dos cambios seguidos ya no muestran el mensaje de la carga descartada. **Desde la 0.3.3** (Sesión 1, A14), elegir guitarra ya no hace sonar una nota de muestra. **Validado en la Sesión 1** (20/10, `V-08`): A14. |
| **S-03** | La selección de timbre está en el menú de configuración. | Alta | F1.1 | ✅ | ✅ | 0.1.0 **Validado en la Sesión 1** (20/10, `V-08`): A03. | — |
| **S-04** | Si los samples no cargan, la app sigue sonando por síntesis. | Media | F1.1 | ✅ | ⬜ | 0.1.0 | Karplus-Strong con filtros que imitan la caja de resonancia. Desde 0.1.1 cada nota se calcula una sola vez y se reutiliza. |
| **S-05** | El primer sonido requiere una interacción explícita del usuario. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | Lo impone la política de reproducción automática de los navegadores. |
| **S-06** | El timbre persiste entre sesiones. | Media | F1.1 | ✅ | ⬜ | 0.1.0 | — |
| **S-07** | Los samples de audio se alojan en el propio proyecto, con licencia verificada y documentada. | Alta | F2.1 · F2.3 | ✅ | ✅ | 0.2.3 | **Opción A, decidida el 14/10.** Hecho: licencias verificadas y los 16 archivos en `samples/`, con `CREDITOS.md` (F2.1); desde la 0.2.0 la app los usa y no descarga nada de otros servidores (F2.2). Desde la 0.2.1 van también dentro del archivo autónomo (F2.3). **El 20/10 se completó la licencia del pack de nylon:** en la búsqueda de Freesound, el pack tiene 161 sonidos y el filtro de licencia «Attribution» (CC BY) devuelve los 161; dos filtros de control («Attribution 4.0» y «Creative Commons 0») devuelven 0, lo que prueba que el filtro se aplica. Tres sonidos revisados uno a uno (183078, 183083 y 183089) son «Attribution 4.0». La búsqueda la hiciste tú en tu iPhone, porque está cerrada a los agentes. **Validado por inspección:** ninguna petición de audio sale del dominio propio (banco) y `CREDITOS.md` documenta origen y licencia de los 17 archivos. |
| **S-08** | Cada nota suena a menos de **5 cents** de su frecuencia, una vez corregida la desviación medida de su grabación. Cada grabación que usa la app es la nota a la que está asignada y tiene su desviación medida. | Alta | F2.1 · F2.2 · F2.4 | ✅ | ✅ | 0.1.3 | **Reformulado el 19/10, con tu aprobación:** antes exigía ±5 cents a la grabación sin corregir; desde la 0.2.0 la app corrige cada grabación con su medida, así que lo que importa y se comprueba es la nota que suena. Origen: el `D5.mp3` de nylon sonaba en Re♯5. Validado: el banco comprueba todas las notas posibles (±0,5 cents) y la grabación en el navegador lo confirma (V-02, V-03, V-04). |
| **S-09** 🆕 | El timbre se parece más al de una guitarra real: grabaciones de más calidad o más notas grabadas por cuerda. | Baja | Posterior | ⬜ | ⬜ | — | Tu comentario de la Sesión 1 (E03 y E04): suena «diferente» a tu guitarra. Exige buscar otro banco de grabaciones con licencia libre (S-07), medirlo (S-08) y que lo escuches. |

---

## 10. Pentagrama

| ID | Requisito | Prior. | Etapa | Impl. | Valid. | Desde | Notas |
|----|-----------|--------|-------|:-----:|:------:|:-----:|-------|
| **P-01** | Al pulsar una nota en el mástil, se representa en el pentagrama. | Alta | F1.1 | ✅ | ✅ | 0.1.0 | Clave de sol octavada. Desde 0.1.1 las notas muy agudas o graves se dibujan transportadas con 8va, 15ma u 8vb, y la clave es un trazado propio que no depende de las fuentes del sistema. **Validado en la Sesión 1** (20/10, `V-08`): A05. |
| **P-02** | El pentagrama se puede mostrar u ocultar. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | En configuración y en acceso rápido. |
| **P-03** | El pentagrama está disponible en todos los modos de aprendizaje. | Media | F5.3 | 🟡 | ⬜ | 0.1.0 | Libre y Adivinar sí. Escalas, en F5. |
| **P-04** | En el afinador, la afinación seleccionada se muestra como seis notas en un pentagrama. | Media | F1.1 | ✅ | ✅ | 0.1.0 **Validado en la Sesión 1** (20/10, `V-08`): A13. | — |

---

## 11. Modo Libre

| ID | Requisito | Prior. | Etapa | Impl. | Valid. | Desde | Notas |
|----|-----------|--------|-------|:-----:|:------:|:-----:|-------|
| **L-01** | El modo por defecto al abrir la app es el diapasón libre. | Alta | F1.1 | ✅ | ✅ | 0.1.0 **Validado en la Sesión 1** (20/10, `V-08`): A01. | — |
| **L-02** | El usuario decide si ve el nombre de todas las notas del mástil o solo el de la que pulsa. | Alta | F1.1 | ✅ | ✅ | 0.1.0 | Por defecto solo la pulsada, para no convertir el mástil en una chuleta permanente. En Adivinar no se aplica (J-12). **Validado en la Sesión 1** (20/10, `V-08`): A10. |
| **L-03** | Al pulsar una nota se señalan discretamente las demás posiciones que producen **exactamente la misma nota** (mismo sonido, no misma clase de nota). | Media | F1.1 | ✅ | ✅ | 0.1.0 | Desde la 0.3.1 se señalan con contorno, sin relleno, y con «Ver todas las notas» llevan además un anillo claro por fuera (AR-06). Señal deliberadamente más tenue que la nota pulsada. **Validado en la Sesión 1** (20/10, `V-08`): E03. |

---

## 12. Modo Adivinar

| ID | Requisito | Prior. | Etapa | Impl. | Valid. | Desde | Notas |
|----|-----------|--------|-------|:-----:|:------:|:-----:|-------|
| **J-01** ✏️ | Suena una nota aleatoria y el usuario busca su posición en el mástil. | Alta | F1.1 | ✅ | ✅ | 0.1.0 | Con botón para repetir el sonido. Desde 0.1.1 los retos se limitan a los 12 primeros trastes por defecto, y desplazar el mástil ya no cuenta como pulsación. **Desde la 0.3.3** (Sesión 1, E06), al entrar en Adivinar no suena nada hasta pulsar ▶, que aparece resaltado; antes de ▶ se puede tocar el mástil sin que puntúe. Después cada reto suena solo, y ▶ lo repite. La lectura grande y el pentagrama muestran la nota buscada («?» hasta acertar o fallar), no la pulsada. **Validado en la Sesión 1** (20/10, `V-08`): C07 y E04. |
| **J-02** | Se acepta como acierto cualquier posición que produzca esa nota exacta. | Alta | F1.1 | ✅ | ✅ | 0.1.0 **Validado en la Sesión 1** (20/10, `V-08`): E04. | — |
| **J-03** | Tras acertar se señalan las demás posiciones válidas. | Media | F1.1 | ✅ | ✅ | 0.1.0 | Reutiliza la lógica de L-03. **Validado en la Sesión 1** (20/10, `V-08`): E04. |
| **J-04** | Pista opcional: nombre de la nota que suena. | Alta | F1.1 | ✅ | ✅ | 0.1.0 **Validado en la Sesión 1** (20/10, `V-08`): E04. | — |
| **J-05** | Pista opcional: cuerda o cuerdas donde puede encontrarse. | Alta | F1.1 | ✅ | ✅ | 0.1.0 **Validado en la Sesión 1** (20/10, `V-08`): E04. | — |
| **J-06** | Las pistas se activan desde la propia interfaz, sin abrir el menú. | Alta | F1.1 | ✅ | ✅ | 0.1.0 | Con las dos pistas activas equivale a «busca esta nota en esta cuerda»; sin ninguna, a «adivina de oído». **Validado en la Sesión 1** (20/10, `V-08`): E04. |
| **J-07** | Contador de racha visible durante el juego. | Alta | F1.1 | ✅ | ✅ | 0.1.0 **Validado en la Sesión 1** (20/10, `V-08`): E04. | — |
| **J-08** ✏️ | El récord de racha más larga persiste entre sesiones. | Alta | F1.1 | ✅ | ✅ | 0.1.0 | `localStorage`. No funciona en las previsualizaciones de artefactos; probar en local o en la web. **Desde la 0.3.3** (Sesión 1, A14), «Restablecer todos los ajustes» conserva el récord, que se borra con su propio botón en Ajustes. No hacen falta usuarios: el récord es tuyo y vive en este navegador. **Validado en la Sesión 1** (20/10, `V-08`): A15. |
| **J-09** | Feedback visual inmediato de acierto y de error. | Alta | F1.1 | ✅ | ✅ | 0.1.0 | Color en la posición pulsada y destello en la barra del reto. **Validado en la Sesión 1** (20/10, `V-08`): A09 y E04. |
| **J-10** ✏️ | Al fallar se indica cuál era la posición correcta. | Media | F1.3 | ✅ | ✅ | 0.1.2 | El fallo rompe la racha siempre. Se iluminan todas las posiciones correctas y se vuelve a oír la nota buscada justo después de la pulsada, para aprender por contraste; luego llega el reto siguiente. **Desde la 0.3.3** (Sesión 1, A09), la corrección llega a los 1,2 s (antes 0,65) y el reto siguiente 3 s después, para poder comparar las dos notas; el fallo se rellena en rojo con ✗ y las posiciones correctas en verde con ✓, de modo que no dependa solo del color. **Validado en la Sesión 1** (20/10, `V-08`): A09. |
| **J-11** | Definir si el récord es único o independiente por afinación. | Media | F4.4 | ⬜ | ⬜ | — | Hoy es único y global: una racha en DADGAD compite con una en estándar aunque la dificultad no sea comparable. |
| **J-12** | Los ajustes que revelan la respuesta —ver todas las notas— no se aplican en Adivinar. | Alta | F1.3 | ✅ | ✅ | 0.1.2 | Encontrado al revisar el código: con «ver todas las notas» activo, el juego mostraba la solución. **Validado en la Sesión 1** (20/10, `V-08`): A10. |

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
| **A-08** | Afinación personalizada ajustando cada cuerda por semitonos. | Alta | F1.1 | ✅ | ✅ | 0.1.0 | Cualquier ajuste convierte la afinación en personalizada sin alterar los presets. **Validado en la Sesión 1** (20/10, `V-08`): A13. |
| **A-09** | Al seleccionar una afinación se muestran sus notas en un pentagrama. | Media | F1.1 | ✅ | ⬜ | 0.1.0 | Ver P-04. |
| **A-10** | La afinación activa se aplica también a los modos de aprendizaje. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | Ninguna nota está escrita a mano: todas derivan de la afinación activa, y la propagación ocurre en un único punto del código. |
| **A-11** | La afinación persiste entre sesiones. | Media | F1.1 | ✅ | ⬜ | 0.1.0 | — |

---

## 15. Visualización

| ID | Requisito | Prior. | Etapa | Impl. | Valid. | Desde | Notas |
|----|-----------|--------|-------|:-----:|:------:|:-----:|-------|
| **V-01** | En móvil se **sugiere** la orientación horizontal con un aviso discreto; no se fuerza. | Alta | F3.2 | ✅ | ✅ | 0.3.0 | **Hecho en la 0.3.0** según `interfaz.md` §7. En horizontal, raíl, mástil a todo el alto y panel: medido en Chromium, 52,8 px por cuerda en el iPhone con Safari (antes 28,8), 60,8 con la app instalada y 42,5 en un Android de 280 px de alto (V-06). El aviso para girar sale solo con el dedo, en vertical y en pantallas de menos de 600 px de ancho, en Libre y Adivinar (y Escalas desde F5), nunca en el Afinador; cerrado no vuelve y «Restablecer» lo recupera. El bloqueo de orientación tiene mal soporte en iOS, así que no se fuerza. **Validado en la Sesión 1** (20/10, `V-08`): C02, C03 y D03. |
| **V-02** | El afinador funciona en vertical y en horizontal. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | — |
| **V-03** | En escritorio el mástil aprovecha el ancho disponible. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | Arranca mostrando el mástil completo en pantallas anchas. |
| **V-04** | Control de zoom que determina qué porción del mástil se ve. | Alta | F1.1 · F3.2 | ✅ | ✅ | 0.1.0 | De 3 a 24 trastes a la vista. Desde 0.1.1 la etiqueta indica los trastes que caben de verdad, y el zoom conserva el tramo que estabas mirando. **Desde la 0.3.0**, con el dedo la vista por defecto usa trastes de 40 px o más (34 con ratón), y la cejuela mide 40. **Desde la 0.3.2** (tu comentario del 20/10), «+» enseña más trastes y «−» menos, y con el dedo puedes pedir trastes de hasta 28 px: en el iPhone con Safari, hasta 11 a la vista en vertical y 15 en horizontal. Si el zoom guardado pide más, se muestran los que caben y la etiqueta lo dice, pero lo guardado se conserva para que al girar vuelva (V-08). **Validado en la Sesión 1** (20/10, `V-08`): A07, A08 y C04. |
| **V-05** | Cuando el mástil no cabe, el usuario se desplaza lateralmente. | Alta | F1.1 | ✅ | ✅ | 0.1.0 **Validado en la Sesión 1** (20/10, `V-08`): A08. | — |
| **V-06** | El ancho de traste no cambia al desplazarse: el zoom fija el tamaño y el desplazamiento mueve la ventana. | Alta | F1.1 | ✅ | ✅ | 0.1.0 **Validado en la Sesión 1** (20/10, `V-08`): A07. | — |
| **V-07** | El mástil se readapta al redimensionar la ventana. | Alta | F1.1 | ✅ | ✅ | 0.1.0 **Validado en la Sesión 1** (20/10, `V-08`): A08. | — |
| **V-08** | El nivel de zoom persiste entre sesiones. | Baja | F1.1 | ✅ | ⬜ | 0.1.0 | Desde 0.1.1 girar el móvil ya no pisa el zoom elegido. |
| **V-09** | Al ocultar la numeración se puede conservar una **referencia de tramo**: el modo «Guía» deja solo los números de los trastes con marca. | Media | F1.3 | ✅ | ✅ | 0.1.2 | Sin números, los trastes 5 y 17 llevan la misma marca y se confunden. Se descartó el minimapa por desproporcionado. **Validado en la Sesión 1** (20/10, `V-08`): A11. |

---

## 16. Configuración y navegación

| ID | Requisito | Prior. | Etapa | Impl. | Valid. | Desde | Notas |
|----|-----------|--------|-------|:-----:|:------:|:-----:|-------|
| **C-01** | Menú de configuración accesible desde cualquier pantalla. | Alta | F1.1 | ✅ | ✅ | 0.1.0 | Hoja que sube desde abajo en vertical; panel lateral en horizontal y en pantallas amplias, con un segundo botón en el raíl (0.3.0). Es un diálogo: mientras está abierto, el resto de la página no responde (AT-04). **Validado en la Sesión 1** (20/10, `V-08`): A19 y C05. |
| **C-02** | El menú contiene nomenclatura, pentagrama, timbre, numeración de trastes (tres modos), ver todas las notas, señalar iguales y afinación activa, y muestra la versión de la app. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | Ampliado en 0.1.2 con la numeración en tres modos y la versión (G-10). En F6.4 se añade el grupo «Acerca de», con los créditos (G-06) y la privacidad (G-11) (`interfaz.md` v1.0, aprobada el 20/10). |
| **C-03** | Los ajustes frecuentes tienen acceso rápido sin abrir el menú. | Alta | F1.1 | ✅ | ⬜ | 0.1.0 | Nomenclatura y pentagrama en chips bajo la cabecera, o en el panel en horizontal, donde el pentagrama se rotula con la clave de sol; las dos pistas del juego, en la tarjeta del reto (0.3.0). |
| **C-04** | Navegación principal clara entre las áreas de la app. | Alta | F1.1 | ✅ | ✅ | 0.1.0 | Barra inferior con cuatro destinos en vertical, raíl a la izquierda en horizontal y pestañas en la cabecera en pantallas amplias (0.3.0). En pantallas bajas la barra nunca se sale (AR-05). **Validado en la Sesión 1** (20/10, `V-08`): A19. |
| **C-05** | Todos los ajustes persisten entre sesiones. | Media | F1.1 | ✅ | ✅ | 0.1.0 | Un único objeto de estado, validado campo a campo al leerlo (0.1.1). **Validado en la Sesión 1** (20/10, `V-08`): A14 y A15. |
| **C-06** | Especificación detallada de la interfaz: estructura de menús, jerarquía de controles y flujos de navegación. | Alta | F3.1 | ✅ | ✅ | 0.2.3 | `docs/interfaz.md` v1.0, aprobada por ti el 20/10 tras la auditoría AR-04 (10 hallazgos resueltos). Bocetos al tamaño real de cada pantalla en `docs/interfaz/`, comprobados por `herramientas/capturar-wireframes.js`. Los cambios posteriores suben su versión. |
| **C-07** | **Botón «atrás» del sistema:** mientras haya un paso anterior en la sesión, el botón o gesto «atrás» cierra Ajustes o vuelve al área anterior; desde la primera área actúa el sistema. Al abrir la app se entra en Libre. | Media | F3.2 | ✅ | ✅ | 0.3.0 | **Hecho en la 0.3.0** con el historial del navegador (`history`): cada área tiene su dirección (`#libre`, `#adivinar`…). Un paso que deja la misma área, como tras recargar, se salta. El banco lo prueba con un historial simulado que avisa como el de verdad. Falta la prueba a mano en Windows y en el simulador de Android (Sesión 1). En el iPhone instalado no hay botón atrás. **Validado en la Sesión 1** (20/10, `V-08`): A17. |
| **C-08** 🆕 | Menú **Personalización** dentro de Ajustes: estilos de nota en el mástil (círculo de color o solo el nombre, más grande o en negrita), estilo del traste y del mástil, interior claro para «Ver todas las notas» y temas de color de la app. | Media | Posterior | ⬜ | ⬜ | — | Tus comentarios de la Sesión 1 (A10, C06 y E06), para una actualización posterior. La paleta por nota de G-05 se mantiene como punto de partida. |

---

## 17. Respaldo y publicación

| ID | Requisito | Prior. | Etapa | Impl. | Valid. | Desde | Notas |
|----|-----------|--------|-------|:-----:|:------:|:-----:|-------|
| **X-01** | El código y la documentación están **respaldados** en el repositorio remoto (GitHub). Respaldar no es publicar. | Alta | F1.2 · F1.4 | ✅ | ⬜ | 0.1.4 | Desde el 15/10 todo el proyecto está en `pdigue/guitarra`; cada versión entra por *pull request* aprobado (del #1 al #5) y F1 se cerró con la etiqueta `v0.1.5`. El repositorio es público. |
| **X-02** | La app está **publicada** en una URL pública (GitHub Pages). | Alta | F7.1 | ⬜ | ⬜ | — | Antes en V1; pasa a la última fase por decisión del 15/09: desarrollo local de principio a fin. **Despliegue de pruebas** (decisión del 15/10): antes de la Sesión 1 se publica una versión de pruebas en GitHub Pages, sin anunciar, para probar en el iPhone con `https` la instalación, el modo sin conexión y el micrófono. X-02 sigue siendo la publicación oficial. |
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
| **F5.2** | E-01, E-02 |
| **F5.3** | P-03, E-03, E-04, E-06 |
| **F5.4** | E-05 |
| **F6.1** | G-08 |
| **F6.2** | G-03 |
| **F6.3** | G-04 |
| **F6.4** | G-06, G-11 |
| **F7.1** | X-02 |
| **F7.2** | G-03, G-04, PL-01, PL-02, PL-03, PL-04, X-03 |
| **F7.4** | G-09 |
| **Posterior** | S-09, E-02b, E-05b, C-08 |

---

## 19. Riesgos

| Riesgo | Impacto | Estado | Mitigación |
|--------|---------|--------|------------|
| **Dependencia de samples de terceros.** El audio se carga del repositorio personal de otra persona, sin versión fijada; si cambia, la app deja de sonar sin que toquemos nada. | Alto | ✏️ Mitigado → F2.2 | Las muestras ya están en `samples/` (F2.1). La app deja de descargarlas en F2.2. |
| **Licencia del audio sin verificar.** Hay referencias contradictorias sobre si esos samples son de dominio público o CC-BY. | Medio | ✅ Resuelto | Verificado en F2.1 y completado el 20/10: los 161 sonidos del pack de nylon son CC BY, y la edición de Brosowsky, CC BY 3.0. Apta para tiendas con atribución. Detalle en `CREDITOS.md`. |
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
| 1 | J-11: récord único o por afinación | J-11 | Antes de F4.4 |
| 2 | E-01: catálogo inicial de escalas | E-01, E-02 | Antes de F5.2 |
| 3 | Licencia del código (MIT u otra) | G-06 | Antes de F6.4 |
| 4 | Tiendas: cuáles y en qué orden | G-09 | Antes de F7.4 |

**Cerradas el 20/10:** Service Worker → en F6.2, sin adelantarlo a la Sesión 1 · agudo de la acústica → aceptado como limitación conocida · C-06, especificación de interfaz → aprobada (`interfaz.md` v1.0) · paleta por nota → la elige el agente con tu criterio: naturales bien distintas y sostenidos derivados (F3.4).

**Cerradas el 15/10:** despliegue de pruebas en `https`, sin anunciar → sí, antes de la Sesión 1 · Android de pruebas → ninguno por ahora; diseño pensado para todos los sistemas (PL-04).

**Cerradas el 14/10:** S-07 → opción A, licencia verificada · móvil de referencia → iPhone · automatización → modo acelerado por bloques (F1–F3, sesión con el móvil, F4–F6, sesión con la guitarra, F7).

**Cerradas antes:** nombre (*Trasteando*) · L-02 (ajuste del usuario) · J-10 (el fallo rompe la racha) · E-05 (solo pertenencia) · A-07 (cinco afinaciones) · V-01 (sugerir, no forzar).

---

*Documento gestionado por el chat de Desarrollo. Los chats auditores lo leen y proponen cambios en sus informes; no lo modifican. Cada cambio se anota en la sección 2 y se avisa al usuario.*
