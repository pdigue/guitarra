# Trasteando — Especificación de Requisitos

**Proyecto:** Trasteando
**Tipo:** Aplicación web progresiva (PWA), desplegada en GitHub Pages
**Repositorio:** github.com/pdigue/guitarra
**Versión del documento:** 1.1
**Última actualización:** 15 de septiembre de 2026
**Cambios en esta versión:** reconciliación de estados tras la auditoría de requisitos del 15/09. Nuevo modelo de estado en dos columnas. Nuevos requisitos S-07, V-09, J-11, G-05, G-06 y bloque X. Decisiones abiertas 1, 2, 3, 5, 6 y 7 cerradas. Roadmap simplificado de cinco versiones a cuatro.

---

## 1. Objetivos del producto

| ID | Objetivo | Descripción |
|----|----------|-------------|
| **O-01** | Aprendizaje del mástil | Que el usuario aprenda a identificar las notas en cualquier posición del diapasón, mediante exploración libre y juegos de refuerzo. |
| **O-02** | Lectura musical | Que el usuario asocie cada posición del mástil con su representación en el pentagrama. |
| **O-03** | Escalas | Que el usuario aprenda y practique escalas sobre el mástil, entendiendo su estructura interválica. |
| **O-04** | Afinador multiafinación | Ofrecer un afinador gratuito con afinación estándar, alternativas comunes y personalizadas. |

---

## 2. Cómo leer este documento

**Prioridad:** `Alta` (imprescindible) · `Media` (importante, no bloqueante) · `Baja` (deseable)

**Fase:** versión del roadmap en la que se entrega (ver sección 15)

**Implementado:** existe y funciona en el código fuente actual. `Sí` · `Parcial` · `No`

**Publicado:** existe y funciona en la URL pública que usa el usuario final. `Sí` · `No`

Esta separación existe porque un requisito implementado pero no desplegado no aporta valor a nadie. Mientras la columna Publicado siga en `No` de forma generalizada, la prioridad del proyecto es desplegar, no añadir funcionalidad.

> **Estado global a 15/09/2026:** la V1 está implementada en local pero **no publicada**. Ninguna funcionalidad nueva llega todavía al usuario final.

---

## 3. Requisitos generales y de producto

| ID | Requisito | Prioridad | Fase | Implementado | Publicado | Notas |
|----|-----------|-----------|------|--------------|-----------|-------|
| **G-01** | La aplicación se llama *Trasteando*. El nombre aparece en la pantalla de entrada, el título de la pestaña y el manifiesto PWA. | Alta | V1 | Sí | No | Naming cerrado: se descarta *Trasting*. |
| **G-02** | La app se estructura en áreas accesibles desde una navegación principal: Libre, Adivinar, Afinador y Escalas. | Alta | V1 | Sí | No | Escalas presente pero deshabilitada hasta V3. |
| **G-03** | La app funciona sin conexión una vez cargada. | Media | V4 | No | No | Requiere Service Worker. **Depende de S-07**: cachear audio de terceros es frágil, autoalojarlo lo hace trivial. |
| **G-04** | La app es instalable en el móvil como PWA. | Alta | V1 | Parcial | No | Manifiesto presente. Falta verificar la instalación en un dispositivo real. |
| **G-05** | *(nuevo)* La interfaz cumple unos mínimos de accesibilidad: foco de teclado visible, respeto a `prefers-reduced-motion`, contraste suficiente y etiquetas accesibles en los controles solo-icono. | Media | V2 | Parcial | No | El código ya respeta `prefers-reduced-motion` y usa `:focus-visible` y `aria-label` en varios controles. Falta auditoría completa. Se fija ahora porque reformar accesibilidad más tarde sale caro. |
| **G-06** | *(nuevo)* El proyecto documenta sus dependencias externas y la licencia de cada recurso de terceros que distribuye. | Media | V1 | No | No | Incluye Tone.js (MIT) y los samples de audio (ver S-07). |

---

## 4. Nomenclatura y notación

| ID | Requisito | Prioridad | Fase | Implementado | Publicado | Notas |
|----|-----------|-----------|------|--------------|-----------|-------|
| **N-01** | Alternancia entre nomenclatura latina (Do, Re, Mi…) y anglosajona (C, D, E…). | Alta | V1 | Sí | No | — |
| **N-02** | El cambio de nomenclatura está en el menú de configuración. | Alta | V1 | Sí | No | — |
| **N-03** | El cambio de nomenclatura está **además** en la interfaz principal, sin abrir el menú. | Alta | V1 | Sí | No | Chip en la barra de acceso rápido. |
| **N-04** | La nomenclatura se aplica de forma consistente en mástil, juego, afinador y pentagrama. | Alta | V1 | Sí | No | Verificar de nuevo al añadir Escalas. |
| **N-05** | La nomenclatura persiste entre sesiones. | Media | V1 | Sí | No | `localStorage`. |

---

## 5. Diapasón

| ID | Requisito | Prioridad | Fase | Implementado | Publicado | Notas |
|----|-----------|-----------|------|--------------|-----------|-------|
| **D-01** | Diagrama del mástil de 6 cuerdas. | Alta | V1 | Sí | No | — |
| **D-02** | Cada cuerda muestra a la izquierda su nota al aire, derivada de la afinación activa. | Alta | V1 | Sí | No | Se actualiza automáticamente al cambiar de afinación (ver A-10). |
| **D-03** | Cada traste muestra su número alineado exactamente sobre la franja donde se pulsa. | Alta | V1 | Sí | No | Corregido: la fila de números comparte las mismas variables de ancho (`--label-w`, `--nut-w`, `--fret-w`) que las celdas del mástil. |
| **D-04** | La numeración de trastes se puede mostrar u ocultar. | Media | V1 | Sí | No | Ver V-09: al ocultarla se pierde la referencia de posición. |
| **D-05** | Al pulsar una posición suena esa nota. | Alta | V1 | Sí | No | — |
| **D-06** | Al pulsar una posición aparece el nombre de la nota en la nomenclatura activa. | Alta | V1 | Sí | No | — |
| **D-07** | Marcadores de posición en los trastes habituales (3, 5, 7, 9, 12, 15, 17, 19, 21, 24). | Media | V1 | Sí | No | — |

---

## 6. Sonido

| ID | Requisito | Prioridad | Fase | Implementado | Publicado | Notas |
|----|-----------|-----------|------|--------------|-----------|-------|
| **S-01** | El sonido corresponde a una guitarra real, no a un sintetizador genérico. | Alta | V1 | Sí | No | Tone.js + samples. **Su fiabilidad depende hoy de un tercero: ver S-07.** |
| **S-02** | El usuario elige entre guitarra clásica (nylon) y acústica (acero). | Alta | V1 | Sí | No | Cambiar de timbre descarga un set de muestras nuevo, con aviso en pantalla. |
| **S-03** | La selección de timbre está en el menú de configuración. | Alta | V1 | Sí | No | — |
| **S-04** | Si los samples no cargan, la app sigue sonando por síntesis. | Media | V1 | Sí | No | Karplus-Strong con filtros que imitan la caja de resonancia. |
| **S-05** | El primer sonido requiere una interacción explícita del usuario. | Alta | V1 | Sí | No | Impuesto por la política de autoplay de los navegadores. |
| **S-06** | El timbre persiste entre sesiones. | Media | V1 | Sí | No | — |
| **S-07** | *(nuevo)* Los samples de audio se alojan en el repositorio propio, con licencia verificada y documentada. | **Alta** | **V1** | No | No | Ver análisis en la sección 16. No bloquea el despliegue inicial de V1, pero sí la publicación en tiendas (V4), y facilita mucho G-03. |

---

## 7. Pentagrama

| ID | Requisito | Prioridad | Fase | Implementado | Publicado | Notas |
|----|-----------|-----------|------|--------------|-----------|-------|
| **P-01** | Al pulsar una nota en el mástil, se representa en el pentagrama. | Alta | V1 | Sí | No | Clave de sol octavada, convención de guitarra. |
| **P-02** | El pentagrama se puede mostrar u ocultar. | Alta | V1 | Sí | No | Disponible en configuración y en acceso rápido. |
| **P-03** | El pentagrama está disponible en todos los modos de aprendizaje. | Media | V1 | Parcial | No | Libre y Adivinar sí. Escalas pendiente (V3). |
| **P-04** | En el afinador, la afinación seleccionada se muestra como seis notas en un pentagrama. | Media | V1 | Sí | No | — |

---

## 8. Modo Libre

| ID | Requisito | Prioridad | Fase | Implementado | Publicado | Notas |
|----|-----------|-----------|------|--------------|-----------|-------|
| **L-01** | El modo por defecto al abrir la app es el diapasón libre. | Alta | V1 | Sí | No | — |
| **L-02** | El usuario decide si ve el nombre de todas las notas del mástil o solo de la que pulsa. | Alta | V1 | Sí | No | **Decisión cerrada:** no es binario fijo, es un ajuste. Por defecto solo la pulsada, para no convertir el mástil en una chuleta permanente. |
| **L-03** | Al pulsar una nota se señalan discretamente las demás posiciones que producen **exactamente la misma nota** (mismo pitch, no misma clase de nota). | Media | V1 | Sí | No | Señal deliberadamente más tenue que la nota pulsada. |

---

## 9. Modo Adivinar

| ID | Requisito | Prioridad | Fase | Implementado | Publicado | Notas |
|----|-----------|-----------|------|--------------|-----------|-------|
| **J-01** | Reproduce una nota aleatoria y el usuario busca su posición en el mástil. | Alta | V1 | Sí | No | Con botón para repetir el sonido. |
| **J-02** | Se acepta como acierto cualquier posición que produzca esa nota exacta. | Alta | V1 | Sí | No | — |
| **J-03** | Tras acertar se señalan las demás posiciones válidas. | Media | V1 | Sí | No | Reutiliza la lógica de L-03. |
| **J-04** | Pista opcional: nombre de la nota que suena. | Alta | V1 | Sí | No | — |
| **J-05** | Pista opcional: cuerda o cuerdas donde puede encontrarse. | Alta | V1 | Sí | No | — |
| **J-06** | Las pistas se activan desde la propia interfaz, sin abrir el menú. | Alta | V1 | Sí | No | Chips en la barra de acceso rápido, visibles solo en este modo. Con ambas pistas activas el ejercicio equivale a "busca esta nota en esta cuerda"; sin ninguna, a "adivina de oído". |
| **J-07** | Contador de racha visible durante el juego. | Alta | V1 | Sí | No | — |
| **J-08** | El récord de racha más larga persiste entre sesiones. | Alta | V1 | Sí | No | `localStorage`. No funciona en previsualizaciones de artefactos; probar en local o en la URL publicada. |
| **J-09** | Feedback visual inmediato de acierto y de error. | Alta | V1 | Sí | No | Color en la posición pulsada más destello en la barra del reto. |
| **J-10** | Al fallar se indica cuál era la posición correcta. | Media | V1 | **No** | No | **Decisión cerrada:** el fallo rompe la racha siempre, sin margen. Falta implementar la revelación de la respuesta correcta tras fallar. |
| **J-11** | *(nuevo)* Definir si el récord es único o independiente por afinación. | Media | V2 | No | No | Hoy es único y global, de modo que una racha en DADGAD compite con una en estándar aunque la dificultad no sea comparable. **Decisión abierta.** |

---

## 10. Escalas

| ID | Requisito | Prioridad | Fase | Implementado | Publicado | Notas |
|----|-----------|-----------|------|--------------|-----------|-------|
| **E-01** | Selección de escala a practicar (tónica + tipo). | Alta | V3 | No | No | Catálogo inicial por definir. |
| **E-02** | El generador de escalas opera **únicamente en afinación estándar** en la primera entrega. | Alta | V3 | No | No | **Alcance acotado.** Extenderlo a las otras seis afinaciones pasa a E-02b. |
| **E-02b** | Soporte de escalas en afinaciones alternativas y variantes de digitación (por ejemplo, escala en octavas). | Media | Posterior | No | No | Fuera del alcance de V3. |
| **E-03** | Submodo Mostrar: la app ilumina las notas que componen la escala. | Alta | V3 | No | No | — |
| **E-04** | En Mostrar se indica el nombre de cada nota y la separación interválica respecto a la anterior. | Alta | V3 | No | No | Etiquetas tipo `T — T — ST — T — T — T — ST`. |
| **E-05** | Submodo Práctica: valida **únicamente la pertenencia** de la nota a la escala. Al pulsar una ajena, marca error e ilumina las correctas. | Alta | V3 | No | No | **Alcance acotado.** No valida orden ni digitación. |
| **E-05b** | Validación del orden de la escala y de patrones de digitación concretos. | Media | Posterior | No | No | Fuera del alcance de V3. |
| **E-06** | Guiado nota a nota en el submodo Mostrar. | Media | V3 | No | No | — |

---

## 11. Afinador

| ID | Requisito | Prioridad | Fase | Implementado | Publicado | Notas |
|----|-----------|-----------|------|--------------|-----------|-------|
| **A-01** | Afinador por referencia: la app reproduce la nota de cada cuerda para afinar de oído. | Alta | V1 | Sí | No | Este es el MVP real del afinador. |
| **A-02** | Afinador por micrófono: capta la cuerda e indica si subir o bajar. | Alta | V2 | No | No | `getUserMedia` + detección de pitch. Exige contexto seguro: funciona en HTTPS y en `localhost`, **no con `file://`**. |
| **A-02-CA** | *(nuevo)* Criterios de aceptación de A-02: precisión de detección ±2 cents en silencio razonable, latencia menor de 300 ms, y funcionamiento con ruido de fondo explícitamente fuera de la primera entrega. | Alta | V2 | No | No | La precisión de detección debe ser mejor que el umbral de "afinado" de A-03, o el indicador no sería fiable dentro de su propio margen. |
| **A-03** | Indicador visual de desviación en cents, con umbral de afinado en ±5 cents. | Alta | V2 | No | No | — |
| **A-04** | Detección automática de cuerda por proximidad a la nota detectada. | Alta | V2 | No | No | Limitación asumida: con una cuerda muy desafinada puede acertar la cuerda equivocada. |
| **A-05** | Selección manual de cuerda, que prevalece sobre A-04. | Alta | V2 | No | No | Resuelve la limitación anterior. |
| **A-06** | Afinación estándar (E A D G B E). | Alta | V1 | Sí | No | — |
| **A-07** | Cinco afinaciones alternativas predefinidas. | Alta | V1 | Sí | No | **Decisión cerrada:** Drop D, medio tono abajo, Open G, Open D y DADGAD. |
| **A-08** | Afinación personalizada ajustando cada cuerda por semitonos. | Alta | V1 | Sí | No | Cualquier ajuste convierte la afinación en personalizada sin alterar los presets. |
| **A-09** | Al seleccionar una afinación se muestran sus notas en un pentagrama. | Media | V1 | Sí | No | Ver P-04. |
| **A-10** | La afinación activa se aplica también a los modos de aprendizaje. | Alta | V1 | Sí | No | Resuelto en origen: ninguna nota está escrita a mano, todas derivan de la afinación activa, y la propagación ocurre en un único punto del código. |
| **A-11** | La afinación persiste entre sesiones. | Media | V1 | Sí | No | — |

---

## 12. Visualización

| ID | Requisito | Prioridad | Fase | Implementado | Publicado | Notas |
|----|-----------|-----------|------|--------------|-----------|-------|
| **V-01** | En móvil se **sugiere** la orientación horizontal con un aviso discreto; **no se fuerza** con bloqueo de orientación. | Alta | V2 | Parcial | No | **Decisión cerrada.** El bloqueo tiene mal soporte en iOS. El comportamiento actual (menos trastes visibles en vertical) es la solución adoptada, no un parche. Falta el aviso. |
| **V-02** | El afinador funciona en vertical y en horizontal. | Alta | V1 | Sí | No | Su contenido es compacto y no requiere apaisado. |
| **V-03** | En escritorio el mástil aprovecha el ancho disponible. | Alta | V1 | Sí | No | Arranca mostrando el mástil completo en pantallas anchas. |
| **V-04** | Control de zoom que determina qué porción del mástil se ve. | Alta | V1 | Sí | No | Se expresa como número de trastes a la vista, de 3 a 24. |
| **V-05** | Cuando el mástil no cabe, el usuario se desplaza lateralmente. | Alta | V1 | Sí | No | — |
| **V-06** | El ancho de traste no cambia al desplazarse: el zoom fija el tamaño y el scroll mueve la ventana. | Alta | V1 | Sí | No | — |
| **V-07** | El mástil se readapta al redimensionar la ventana. | Alta | V1 | Sí | No | — |
| **V-08** | El nivel de zoom persiste entre sesiones. | Baja | V1 | Sí | No | — |
| **V-09** | *(nuevo)* Si el usuario oculta la numeración de trastes (D-04) y el mástil no cabe entero, debe conservar alguna referencia de en qué tramo del mástil está. | Media | V2 | No | No | Con la numeración activa el problema no existe: la fila de números se desplaza junto al mástil. Solución mínima propuesta: al ocultarla, mantener visibles solo los números de los trastes con marcador (3, 5, 7, 9, 12…). Se descarta el minimapa por desproporcionado. |

---

## 13. Configuración y navegación

| ID | Requisito | Prioridad | Fase | Implementado | Publicado | Notas |
|----|-----------|-----------|------|--------------|-----------|-------|
| **C-01** | Menú de configuración accesible desde cualquier pantalla. | Alta | V1 | Sí | No | Panel deslizante desde la cabecera. |
| **C-02** | El menú contiene nomenclatura, pentagrama, timbre, numeración de trastes, ver todas las notas, señalar iguales y afinación activa. | Alta | V1 | Sí | No | — |
| **C-03** | Los ajustes frecuentes tienen acceso rápido sin abrir el menú. | Alta | V1 | Sí | No | Nomenclatura, pentagrama y las dos pistas del juego. |
| **C-04** | Navegación principal clara entre las áreas de la app. | Alta | V1 | Sí | No | Barra inferior con cuatro destinos. |
| **C-05** | Todos los ajustes persisten entre sesiones. | Media | V1 | Sí | No | Un único objeto de estado serializado. |
| **C-06** | Especificación detallada de la interfaz: estructura de menús, jerarquía de controles y flujos de navegación. | Alta | V2 | No | No | **Sin especificar.** Requiere sesión dedicada. La V1 resuelve la navegación de forma razonable, pero sin criterio documentado para crecer. |

---

## 14. Despliegue

| ID | Requisito | Prioridad | Fase | Implementado | Publicado | Notas |
|----|-----------|-----------|------|--------------|-----------|-------|
| **X-01** | El código de la V1 está en el repositorio remoto. | Alta | V1 | Parcial | — | El repositorio existe con la versión antigua. Falta subir la V1. |
| **X-02** | GitHub Pages está activo y sirve la app en una URL pública. | Alta | V1 | No | — | Es el paso que convierte todas las columnas "Publicado" en `Sí`. |
| **X-03** | La app está verificada en un móvil real, instalada desde la pantalla de inicio. | Alta | V1 | No | — | Cierra G-04. |

---

## 15. Roadmap

Se simplifica de cinco versiones a cuatro. La antigua V2 (juego y control del usuario) y la antigua V3 (afinador por referencia) ya están implementadas y se absorben en V1.

### V1 — Núcleo *(implementado, sin publicar)*
Mástil libre, sonido real con dos timbres, nomenclatura conmutable, pentagrama, modo Adivinar completo con pistas y récord, zoom y adaptación de pantalla, menú de configuración con persistencia, y afinador por referencia con siete afinaciones y propagación al mástil.

**Para cerrar V1 falta:** publicar (X-01, X-02, X-03), autoalojar los samples (S-07), revelar la posición correcta al fallar (J-10) y documentar las licencias de terceros (G-06).

### V2 — Afinador por micrófono y pulido
Detección de pitch con criterios de aceptación medibles, indicador en cents, detección y selección de cuerda. Además: aviso de orientación (V-01), referencia de posición al ocultar números (V-09), decisión sobre el récord por afinación (J-11), auditoría de accesibilidad (G-05) y especificación de interfaz (C-06).

Va sola porque es la única pieza que introduce tecnología nueva en el proyecto.

### V3 — Escalas
Catálogo de escalas en afinación estándar, submodo Mostrar con intervalos, submodo Práctica validando pertenencia. Alcance deliberadamente acotado: sin validación de orden ni afinaciones alternativas.

### V4 — Offline y distribución
Service Worker y cacheo de recursos, optimización de carga, posible empaquetado para tiendas de aplicaciones. Depende de que S-07 esté resuelto.

---

## 16. Riesgos

| Riesgo | Impacto | Estado | Mitigación |
|--------|---------|--------|------------|
| **Dependencia de samples de terceros.** El audio se carga de un repositorio personal ajeno, sin versión fijada. Si cambia de estructura o desaparece, S-01 se rompe sin que toquemos nuestro código. | Alto | **Abierto** | S-07: autoalojar. Ver análisis abajo. |
| **Licencia del audio sin verificar.** Existen referencias contradictorias sobre si esos samples son de dominio público o CC-BY con atribución obligatoria. | Medio | **Abierto** | Verificar antes de decidir la opción de S-07. Irrelevante para publicar una web; relevante para tiendas de aplicaciones. |
| **La detección de pitch es el componente más complejo del proyecto.** | Alto | Mitigado | A-01 ya entrega el valor de "afinador" sin micrófono. A-02 va aislado en V2 con criterios de aceptación cerrados. |
| **La afinación como estado global afecta a todo el cálculo de notas.** | Alto | **Resuelto** | Diseñado así desde el origen. Ninguna nota escrita a mano; todo deriva de la afinación activa. |
| **Escalas sin alcance definido podía dispararse en esfuerzo.** | Medio | **Resuelto** | E-02 y E-05 acotados; lo demás movido a E-02b y E-05b. |
| **Documento y código desincronizados**, con riesgo de planificar sobre trabajo ya hecho. | Medio | **Resuelto** | Modelo de estado en dos columnas y reconciliación en cada cierre de versión. |
| `localStorage` no funciona en previsualizaciones de artefactos. | Bajo | Conocido | Probar la persistencia siempre en local o en la URL publicada. |

### Análisis de S-07: opciones para el audio

| Opción | Esfuerzo | Resultado |
|--------|----------|-----------|
| **A.** Autoalojar los samples actuales tras verificar su licencia pieza por pieza. | Bajo | Resuelve la disponibilidad. Solo resuelve la licencia si la verificación sale limpia. |
| **B.** Sustituirlos por samples de licencia inequívoca (CC0 o dominio público confirmado) y autoalojarlos. | Medio | Audio real y sin ambigüedad legal, sin necesidad de grabar nada. |
| **C.** Grabar samples propios de guitarra de nylon y de acero. | Alto | Cero dependencias y timbre diferenciado, pero es un proyecto en sí mismo: instrumento, micrófono, sala silenciosa y edición nota a nota. |
| **D.** Usar el sintetizador como motor principal. | Nulo | Contradice S-01 tal como está redactado. |

**Recomendación:** opción **B**. El peso ronda los 2 MB por timbre, irrelevante para GitHub Pages. La opción C queda como mejora de producto si el proyecto crece.

---

## 17. Decisiones abiertas

1. ~~Nombre definitivo~~ — **Cerrada:** Trasteando.
2. ~~L-02: todas las notas visibles o solo la pulsada~~ — **Cerrada:** ajuste del usuario, por defecto solo la pulsada.
3. ~~J-10: si un fallo rompe la racha~~ — **Cerrada:** sí, siempre.
4. **E-01:** catálogo inicial de escalas a soportar.
5. ~~E-05: validar orden o pertenencia~~ — **Cerrada:** solo pertenencia en V3.
6. ~~A-07: listado de afinaciones alternativas~~ — **Cerrada:** Drop D, medio tono abajo, Open G, Open D y DADGAD.
7. ~~V-01: forzar o sugerir orientación~~ — **Cerrada:** sugerir.
8. **C-06:** especificación completa de interfaz y navegación.
9. **S-07:** elegir entre las opciones A, B o C para el audio.
10. **J-11:** si el récord de racha es único o independiente por afinación.

---

*Documento gestionado por el chat de Desarrollo. Los chats de auditoría lo leen y proponen cambios; no lo modifican.*
