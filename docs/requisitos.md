# Trasteando — Especificación de Requisitos

**Proyecto:** Trasteando (working title; alternativa: *Trasting*)
**Tipo:** Aplicación web progresiva (PWA), desplegada en GitHub Pages
**Repositorio:** github.com/pdigue/guitarra
**Versión del documento:** 1.0
**Última actualización:** 14 de septiembre de 2026

---

## 1. Objetivos del producto

| ID | Objetivo | Descripción |
|----|----------|-------------|
| **O-01** | Aprendizaje del mástil | Que el usuario aprenda a identificar las notas en cualquier posición del diapasón de la guitarra, mediante exploración libre y mediante juegos de refuerzo. |
| **O-02** | Lectura musical | Que el usuario asocie cada posición del mástil con su representación en el pentagrama. |
| **O-03** | Escalas | Que el usuario aprenda y practique escalas sobre el mástil, entendiendo su estructura interválica. |
| **O-04** | Afinador multiafinación | Ofrecer un afinador gratuito que soporte la afinación estándar, afinaciones alternativas comunes y afinaciones personalizadas (la mayoría de afinadores online son de pago o solo estándar). |

---

## 2. Leyenda

**Prioridad:** `Alta` (imprescindible) · `Media` (importante, no bloqueante) · `Baja` (deseable)
**Fase:** versión del roadmap en la que se implementa (ver sección 14)
**Estado:** `Pendiente` · `Parcial` (existe algo en el HTML actual) · `Cumplido` · `En revisión`

---

## 3. Requisitos generales y de producto

| ID | Requisito | Prioridad | Fase | Estado | Notas de desarrollo |
|----|-----------|-----------|------|--------|---------------------|
| **G-01** | La aplicación se llamará *Trasteando* (alternativa a decidir: *Trasting*). El nombre aparecerá en el splash, en el título de la pestaña y en el manifiesto PWA. | Alta | V1 | Pendiente | Decisión de naming pendiente. Afecta a `<title>`, manifest y nombre del icono. |
| **G-02** | La app se estructura en tres áreas principales: **Aprendizaje** (mástil), **Escalas** y **Afinador**, accesibles desde una navegación principal. | Alta | V1 | Parcial | El HTML actual tiene navegación por modos pero sin Escalas ni Afinador. |
| **G-03** | La app debe funcionar sin conexión una vez cargada (al menos el modo libre y el juego). | Media | V5 | Pendiente | Requiere Service Worker + cacheo de los samples de audio. |
| **G-04** | La app debe ser instalable en el móvil como PWA (icono en pantalla de inicio, pantalla completa). | Alta | V1 | Parcial | El manifiesto ya existe en el HTML actual. Falta verificar en dispositivo real. |

---

## 4. Nomenclatura y notación

| ID | Requisito | Prioridad | Fase | Estado | Notas de desarrollo |
|----|-----------|-----------|------|--------|---------------------|
| **N-01** | El usuario podrá alternar entre nomenclatura **clásica/latina** (Do, Re, Mi…) y **anglosajona** (C, D, E…). | Alta | V1 | Cumplido | Ya implementado en el HTML actual. |
| **N-02** | El cambio de nomenclatura estará disponible en el **menú de configuración**. | Alta | V1 | Pendiente | Requiere crear el menú de configuración como tal. |
| **N-03** | El cambio de nomenclatura estará **además** accesible directamente desde la interfaz principal, sin entrar en el menú. | Alta | V1 | Cumplido | Ya existe botón directo en la barra superior. |
| **N-04** | La nomenclatura seleccionada se aplicará de forma consistente en todos los modos: mástil, juego, escalas, afinador y pentagrama. | Alta | V1 | Parcial | Verificar consistencia al añadir nuevos módulos. |
| **N-05** | La nomenclatura seleccionada persistirá entre sesiones. | Media | V2 | Pendiente | `localStorage`. |

---

## 5. Diapasón — contenido y comportamiento

| ID | Requisito | Prioridad | Fase | Estado | Notas de desarrollo |
|----|-----------|-----------|------|--------|---------------------|
| **D-01** | La pantalla principal muestra un **diagrama del mástil** de guitarra de 6 cuerdas. | Alta | V1 | Cumplido | — |
| **D-02** | Cada cuerda muestra, al inicio (izquierda), la **nota de la cuerda al aire**. | Alta | V1 | Cumplido | Debe actualizarse dinámicamente si se cambia la afinación (ver A-08). |
| **D-03** | Cada traste muestra su **número**, alineado exactamente sobre la franja donde se pulsa (no desplazado). | Alta | V1 | **Parcial — con defecto conocido** | Bug identificado: en la versión publicada el número aparece decalado una posición. Corregido en `index_v2.html` (pendiente de integrar). |
| **D-04** | La numeración de trastes se podrá **mostrar u ocultar** mediante una opción. | Media | V2 | Pendiente | Toggle en configuración y/o acceso rápido. |
| **D-05** | Al pulsar una posición del mástil, se emite el **sonido de esa nota**. | Alta | V1 | Cumplido | — |
| **D-06** | Al pulsar una posición, aparece el **nombre de la nota** (en la nomenclatura activa) sobre el traste pulsado. | Alta | V1 | Cumplido | — |
| **D-07** | El mástil mostrará los marcadores de posición habituales de una guitarra (trastes 3, 5, 7, 9, 12, 15, 17, 19, 21, 24). | Media | V1 | Cumplido | — |

---

## 6. Sonido

| ID | Requisito | Prioridad | Fase | Estado | Notas de desarrollo |
|----|-----------|-----------|------|--------|---------------------|
| **S-01** | El sonido emitido debe corresponder a una guitarra real, no a un sintetizador genérico. | Alta | V1 | Cumplido | Implementado con Tone.js + samples reales (`guitar-nylon`). |
| **S-02** | El usuario podrá elegir el timbre entre **guitarra clásica (nylon)** y **guitarra acústica (acero)**. | Alta | V2 | Pendiente | Ambos sample packs existen en el mismo repositorio (`guitar-nylon` / `guitar-acoustic`). Cambio de timbre = recargar el Sampler con otra `baseUrl`. Coste: nueva descarga (~1-2 MB) al cambiar. |
| **S-03** | La selección de timbre estará disponible en el **menú de configuración**. | Alta | V2 | Pendiente | — |
| **S-04** | Si los samples no pueden cargarse, la app debe seguir sonando mediante síntesis (degradación elegante). | Media | V1 | Cumplido | Fallback Karplus-Strong ya implementado. |
| **S-05** | El primer sonido requiere una interacción explícita del usuario (pantalla de entrada). | Alta | V1 | Cumplido | Restricción de los navegadores (autoplay policy), no evitable. |
| **S-06** | El timbre seleccionado persistirá entre sesiones. | Media | V2 | Pendiente | `localStorage`. |

---

## 7. Pentagrama

| ID | Requisito | Prioridad | Fase | Estado | Notas de desarrollo |
|----|-----------|-----------|------|--------|---------------------|
| **P-01** | Al pulsar cualquier nota en el mástil, esa nota se representa en un **pentagrama** en pantalla. | Alta | V1 | Cumplido | Clave de sol con octavación (8 abajo), como es convención en guitarra. |
| **P-02** | El pentagrama se podrá **mostrar u ocultar** desde el menú de configuración. | Alta | V1 | Cumplido | Ya existe el botón; falta moverlo/duplicarlo en el menú de configuración. |
| **P-03** | El pentagrama estará disponible en todos los modos de aprendizaje (libre, juego, escalas). | Media | V2 | Parcial | Verificar al añadir nuevos modos. |
| **P-04** | En el afinador, al seleccionar una afinación se mostrará un pentagrama indicando las notas asignadas a cada cuerda. | Media | V3 | Pendiente | Requiere renderizar 6 notas simultáneas, no una sola. Extensión del renderizador actual. |

---

## 8. Modo Libre

| ID | Requisito | Prioridad | Fase | Estado | Notas de desarrollo |
|----|-----------|-----------|------|--------|---------------------|
| **L-01** | El modo por defecto al abrir la app es el **diapasón libre**: mástil completo, exploración sin restricciones. | Alta | V1 | Cumplido | — |
| **L-02** | En modo libre se muestran los nombres de todas las notas del mástil (o al menos de la pulsada). | Alta | V1 | Cumplido | Revisar si se quieren todas visibles siempre o solo la pulsada. **Decisión pendiente.** |
| **L-03** | Opción **"Mostrar iguales"**: al pulsar una nota, se señalan de forma discreta las demás posiciones que producen **exactamente la misma nota** (mismo pitch, no todas las notas del mismo nombre). | Media | V2 | Pendiente | Distinción importante: mismo MIDI, no misma clase de nota. Marcado visual secundario (menos prominente que la nota pulsada). |

---

## 9. Modo Juego (Guess)

| ID | Requisito | Prioridad | Fase | Estado | Notas de desarrollo |
|----|-----------|-----------|------|--------|---------------------|
| **J-01** | El modo juego reproduce una **nota aleatoria** y el usuario debe pulsar su posición en el mástil. | Alta | V2 | Pendiente | Base ya implementada en `index_v2.html` (sin integrar). |
| **J-02** | Se considera acierto **cualquier posición** del mástil que produzca esa nota exacta. | Alta | V2 | Pendiente | — |
| **J-03** | Tras acertar, se señalan discretamente las **demás posiciones válidas** para reforzar el aprendizaje. | Media | V2 | Pendiente | Reutiliza la lógica de L-03. |
| **J-04** | **Pista opcional 1:** mostrar el nombre de la nota que suena. | Alta | V2 | Pendiente | — |
| **J-05** | **Pista opcional 2:** mostrar la cuerda o cuerdas en las que puede encontrarse la nota. | Alta | V2 | Pendiente | — |
| **J-06** | Las pistas se activan/desactivan **desde la propia interfaz del diapasón** (checkbox o desplegable), sin entrar en el menú de configuración. | Alta | V2 | Pendiente | Requisito de UX explícito: acceso inmediato. |
| **J-07** | Contador de **racha** de aciertos consecutivos, visible durante el juego. | Alta | V2 | Pendiente | — |
| **J-08** | El **récord** de racha más larga se almacena de forma persistente (sobrevive al cierre de la app o del navegador). | Alta | V2 | Pendiente | `localStorage`. **Nota:** no funciona en previsualizaciones de artefactos de Claude; sí en GitHub Pages y en local. |
| **J-09** | Feedback visual claro e inmediato de acierto y de error. | Alta | V2 | Pendiente | — |
| **J-10** | Al fallar, indicar cuál era la posición correcta. | Media | V2 | Pendiente | **Decisión pendiente:** ¿el fallo rompe la racha siempre, o hay margen? |

---

## 10. Escalas

| ID | Requisito | Prioridad | Fase | Estado | Notas de desarrollo |
|----|-----------|-----------|------|--------|---------------------|
| **E-01** | Menú desplegable para seleccionar una **escala** a practicar (tónica + tipo de escala). | Alta | V4 | Pendiente | Definir catálogo inicial: mayor, menor natural, pentatónica mayor/menor, blues. **Decisión pendiente.** |
| **E-02** | Soporte para variantes de digitación, por ejemplo **escala en octavas**. | Media | V4 | Pendiente | Ejemplo citado: escala de Sol en octavas. |
| **E-03** | **Submodo "Mostrar":** la app ilumina las notas que componen la escala sobre el mástil. | Alta | V4 | Pendiente | — |
| **E-04** | En el submodo Mostrar, se indica sobre cada traste el nombre de la nota y la **separación interválica** respecto a la anterior (tono / semitono). | Alta | V4 | Pendiente | Etiquetas tipo `T — T — ST — T — T — T — ST`. |
| **E-05** | **Submodo "Práctica libre":** el usuario recorre la escala sin ayuda; si pulsa una nota que no pertenece a la escala, se marca error y se ilumina la nota correcta. | Alta | V4 | Pendiente | **Decisión pendiente:** ¿se valida el orden de la escala o solo la pertenencia a ella? |
| **E-06** | Guiado nota a nota en el submodo Mostrar, para recorrer la escala progresivamente. | Media | V4 | Pendiente | — |

---

## 11. Afinador

| ID | Requisito | Prioridad | Fase | Estado | Notas de desarrollo |
|----|-----------|-----------|------|--------|---------------------|
| **A-01** | Modo **afinador por referencia**: la app reproduce la nota de cada cuerda para que el usuario afine de oído. | Alta | V3 | Pendiente | Implementación sencilla: reutiliza el motor de audio existente. Es el primer escalón del afinador. |
| **A-02** | Modo **afinador por micrófono**: la app capta el sonido de la cuerda e indica si hay que subir o bajar el tono. | Alta | V3 | Pendiente | **Complejidad media-alta.** Requiere `getUserMedia` + detección de pitch (autocorrelación o algoritmo YIN sobre Web Audio API). Necesita contexto seguro: funciona en HTTPS (GitHub Pages ✓) y en `localhost` (Live Server ✓); **no funciona abriendo el archivo con doble clic** (`file://`). Requiere permiso explícito del usuario. |
| **A-03** | Indicador visual claro de desviación: cuánto y en qué dirección (sostenido / bemol / afinado). | Alta | V3 | Pendiente | Medida estándar en *cents*. Umbral de "afinado" típico: ±5 cents. |
| **A-04** | **Detección automática de cuerda**: la app asume la cuerda cuya nota esté más próxima a la detectada. | Alta | V3 | Pendiente | Limitación conocida y asumida: con una cuerda muy desafinada puede identificar la cuerda equivocada. Comportamiento estándar del sector. |
| **A-05** | **Selección manual de cuerda**: el usuario puede fijar qué cuerda está tocando, para que el afinador la use como referencia aunque esté muy desviada. | Alta | V3 | Pendiente | Resuelve la limitación de A-04. |
| **A-06** | Soporte para **afinación estándar** (EADGBE). | Alta | V3 | Pendiente | — |
| **A-07** | Soporte para **afinaciones alternativas predefinidas**: al menos las 5 más comunes (p. ej. Drop D, Open G, Open D, DADGAD, Medio tono abajo). | Alta | V3 | Pendiente | **Decisión pendiente:** confirmar el listado exacto. |
| **A-08** | Soporte para **afinación personalizada**: el usuario ajusta cada cuerda subiendo o bajando semitonos. | Alta | V3 | Pendiente | Interfaz sugerida: controles +/- por cuerda con feedback en pentagrama. |
| **A-09** | Al seleccionar una afinación, se muestra un **pentagrama con las notas asignadas a cada cuerda**. | Media | V3 | Pendiente | Ver P-04. |
| **A-10** | La afinación activa debe poder aplicarse también a los **modos de aprendizaje**, de modo que el mástil refleje las notas reales de esa afinación. | Alta | V3 | Pendiente | Implica que la afinación es estado global de la app, no local del afinador. Afecta a D-02 y a toda la lógica de cálculo de notas. |
| **A-11** | La afinación seleccionada persistirá entre sesiones. | Media | V3 | Pendiente | `localStorage`. |

---

## 12. Visualización y adaptación de pantalla

| ID | Requisito | Prioridad | Fase | Estado | Notas de desarrollo |
|----|-----------|-----------|------|--------|---------------------|
| **V-01** | En **móvil**, los modos de mástil (libre, juego, escalas) se orientan preferentemente en **horizontal**. | Alta | V2 | Pendiente | **Decisión pendiente:** ¿forzar horizontal (bloqueo de orientación), o solo sugerirlo con un aviso? El bloqueo tiene soporte limitado en iOS. |
| **V-02** | El **afinador** debe funcionar tanto en vertical como en horizontal. | Alta | V3 | Pendiente | Su contenido es más compacto y no requiere apaisado. |
| **V-03** | En **escritorio**, el mástil se muestra apaisado por defecto, aprovechando el ancho disponible. | Alta | V2 | **Parcial — con defecto conocido** | Defecto identificado: actualmente solo se ven los trastes que caben, sin aprovechar bien el espacio. |
| **V-04** | Control de **zoom (+/−)** que determina qué porción del mástil se ve. Sustituye a un selector numérico de trastes. | Alta | V2 | Pendiente | Implementación: variable CSS `--fret-w` ajustable. A mayor zoom, menos trastes visibles y más anchos. |
| **V-05** | Cuando no cabe el mástil completo, el usuario puede **desplazarse lateralmente** (scroll / deslizar el dedo) para alcanzar el resto de trastes. | Alta | V1 | Cumplido | Ya implementado. |
| **V-06** | El ancho de traste **no cambia** al desplazarse: el zoom fija el tamaño y el scroll solo mueve la ventana de visión. | Alta | V2 | Pendiente | Aclaración explícita del usuario. |
| **V-07** | En navegador de escritorio, el mástil se **readapta automáticamente** al redimensionar la ventana. | Alta | V2 | Parcial | Existe listener de `resize`; revisar comportamiento con zoom. |
| **V-08** | El nivel de zoom seleccionado persistirá entre sesiones. | Baja | V2 | Pendiente | `localStorage`. |

---

## 13. Configuración, navegación e interfaz

| ID | Requisito | Prioridad | Fase | Estado | Notas de desarrollo |
|----|-----------|-----------|------|--------|---------------------|
| **C-01** | Existirá un **menú de configuración** accesible desde cualquier pantalla. | Alta | V2 | Pendiente | — |
| **C-02** | El menú de configuración contendrá como mínimo: nomenclatura (N-02), mostrar/ocultar pentagrama (P-02), timbre de guitarra (S-03), numeración de trastes (D-04), afinación activa (A-10). | Alta | V2 | Pendiente | Lista ampliable. |
| **C-03** | Los ajustes de uso frecuente tendrán **acceso rápido desde la interfaz principal**, sin abrir el menú: nomenclatura (N-03) y pistas del juego (J-06). | Alta | V2 | Parcial | Nomenclatura ya cumplido. |
| **C-04** | Navegación principal clara entre las tres áreas: Aprendizaje, Escalas, Afinador. | Alta | V2 | Parcial | El HTML actual tiene pestañas de modo, pero no cubre las tres áreas definitivas. |
| **C-05** | Todos los ajustes del usuario persistirán entre sesiones. | Media | V2 | Pendiente | `localStorage` centralizado. |
| **C-06** | **[PENDIENTE DE DEFINIR]** Detalle de la interfaz: estructura de menús, jerarquía de botones, flujos de navegación, qué lleva a cada sitio. | Alta | V2 | **Sin especificar** | El usuario ha indicado que este bloque está pendiente de desarrollar. Requiere sesión dedicada, idealmente con wireframes o descripción pantalla a pantalla. |

---

## 14. Roadmap por versiones

La estrategia es entregar valor funcional en cada versión, empezando por lo que ya existe y añadiendo complejidad de forma incremental.

### V1 — Base funcional publicada *(casi completa)*
Mástil libre operativo, sonido real de guitarra, nomenclatura conmutable, pentagrama, numeración de trastes correcta, scroll lateral, PWA instalable.
**Bloqueantes:** corregir D-03 (numeración decalada), integrar mejoras de layout, publicar en GitHub Pages.

### V2 — Juego y control del usuario
Modo juego completo con pistas y racha persistente, "mostrar iguales", menú de configuración, selección de timbre, zoom y adaptación de pantalla, persistencia general de ajustes.

### V3 — Afinador
Afinador por referencia (A-01) primero, después afinador por micrófono (A-02). Afinaciones predefinidas y personalizadas. Propagación de la afinación al resto de la app (A-10).

### V4 — Escalas
Catálogo de escalas, submodo Mostrar con intervalos, submodo Práctica con validación de errores.

### V5 — Pulido y distribución
Funcionamiento offline (Service Worker), optimización de carga de samples, accesibilidad, posible empaquetado para tiendas de aplicaciones.

---

## 15. Riesgos y complejidades identificadas

| Riesgo | Impacto | Mitigación propuesta |
|--------|---------|----------------------|
| Detección de pitch por micrófono (A-02) es el componente técnicamente más complejo del proyecto. | Alto | Entregar primero A-01 (afinador por referencia), que da valor inmediato. Abordar A-02 como incremento aislado. |
| El micrófono exige contexto seguro (HTTPS o localhost). | Medio | Ya resuelto por diseño: GitHub Pages sirve por HTTPS. Documentar que no funcionará con `file://`. |
| Cambiar el timbre (S-02) implica descargar un nuevo set de samples. | Bajo | Precargar ambos al inicio, o avisar de la carga al cambiar. |
| La afinación como estado global (A-10) afecta a toda la lógica de cálculo de notas. | Alto | Diseñar desde ya la afinación como dato central del que derivan todas las notas, en lugar de tenerla fija. Refactor preventivo. |
| `localStorage` no funciona en previsualizaciones de artefactos de Claude. | Bajo | Probar siempre la persistencia en Live Server o GitHub Pages, nunca en la previsualización. |
| Bloqueo de orientación en móvil (V-01) tiene soporte irregular, especialmente en iOS. | Medio | Diseñar un layout que funcione aceptablemente en vertical, y sugerir horizontal sin forzarlo. |

---

## 16. Decisiones abiertas

1. **Nombre definitivo:** *Trasteando* o *Trasting*.
2. **L-02:** ¿en modo libre se muestran los nombres de todas las notas del mástil de forma permanente, o solo la pulsada?
3. **J-10:** ¿un fallo rompe la racha siempre?
4. **E-01:** catálogo inicial de escalas a soportar.
5. **E-05:** en la práctica de escalas, ¿se valida el orden de las notas o solo su pertenencia a la escala?
6. **A-07:** listado definitivo de las 5 afinaciones alternativas.
7. **V-01:** ¿se fuerza la orientación horizontal en móvil o solo se sugiere?
8. **C-06:** especificación completa de la interfaz y la navegación.

---

*Documento gestionado por el chat de Desarrollo. Los chats de auditoría pueden leerlo y proponer cambios, pero no modificarlo directamente.*
