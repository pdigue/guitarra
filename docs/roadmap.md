# Trasteando — Roadmap de ejecución

**Versión:** 1.0
**Fecha:** 15 de septiembre de 2026
**Documentos relacionados:** `requisitos.md` v1.1 · `auditoria-requisitos-trasteando.md` · `auditoria-tecnica-01.md`
**Gestionado por:** chat de Desarrollo

---

## Cómo está organizado este documento

El proyecto avanza en **cuatro versiones (V1–V4)**. Cada versión se divide en **etapas** numeradas con la forma `V1.3`, y cada etapa declara cuatro cosas:

- **Qué se hace** — el trabajo concreto.
- **Requisitos que cierra** — los IDs de `requisitos.md` que pasan a estar cumplidos.
- **Cómo se valida** — la prueba que demuestra que está hecho. Si no hay forma de comprobarlo, la etapa no está terminada.
- **Aprendizaje** — el concepto técnico que se explica al abordarla, porque este proyecto también es un vehículo de formación.

Entre etapas hay **checkpoints de auditoría** marcados como `CP-n`. Un checkpoint no es una reunión: es un momento en que se congela el estado, se pasa a los chats auditores y no se avanza hasta haber leído sus informes y decidido qué se acepta.

### Estados posibles de una etapa

`Pendiente` · `En curso` · `Hecha` · `Validada` (probada y aceptada) · `Descartada`

### Regla de oro del proyecto

**Nada se considera terminado hasta que está publicado y probado en un dispositivo real.** El documento de requisitos distingue entre implementado y publicado precisamente por esto.

---

## Panorama general

| Versión | Objetivo | Etapas | Checkpoints |
|---------|----------|--------|-------------|
| **V1** | Que la app exista de verdad: núcleo completo, publicado y usable en el móvil | V1.1 – V1.8 | CP-1, CP-2 |
| **V2** | Afinador por micrófono y pulido de experiencia | V2.1 – V2.7 | CP-3, CP-4 |
| **V3** | Escalas | V3.1 – V3.5 | CP-5 |
| **V4** | Offline y distribución | V4.1 – V4.4 | CP-6 |

---

# V1 — Núcleo publicado

**Objetivo de la versión:** convertir las cuarenta y tantas funcionalidades ya implementadas en algo que existe para el usuario. Al terminar V1, la columna *Publicado* de `requisitos.md` deja de ser `No`.

**Criterio de cierre de V1:** la app está instalada como icono en un móvil real, suena, y funciona sin que el ordenador esté encendido.

---

### V1.1 — Validar en local las correcciones críticas

**Estado:** Pendiente

**Qué se hace.** Probar en Live Server la versión con las dieciséis correcciones aplicadas tras la auditoría técnica. No se toca código salvo que algo falle.

**Lista de comprobación:**

| Comprobación | Origen | Cómo se prueba |
|---|---|---|
| Al abrir Afinador, el mástil desaparece | AUD-01 | Cambiar de pestaña y mirar |
| La nota suena sin retardo perceptible | AUD-03 | Pulsar repetidamente; debe sentirse instantáneo |
| El pentagrama dibuja notas agudas con marca 8va | AUD-05 | Pulsar 1ª cuerda traste 12 y traste 24 |
| El pentagrama dibuja graves con 8vb | AUD-05 | Afinación personalizada, bajar la 6ª al mínimo |
| Restablecer recarga el timbre correcto | AUD-08.1 | Poner acústica, restablecer, escuchar |
| Cambiar nomenclatura tras 3 s actualiza el lector | AUD-08.3 | Pulsar nota, esperar, cambiar a C D E |
| El zoom no salta de tramo | AUD-13 | Ir al traste 15, hacer zoom, comprobar que sigue ahí |
| La etiqueta de zoom dice la verdad | AUD-12 | En móvil vertical, pulsar − hasta el tope |

**Cómo se valida.** Todas las filas marcadas. Las que dependen de táctil se posponen a V1.6.

**Aprendizaje.** Cómo usar las herramientas de desarrollo del navegador (F12): consola para errores, pestaña de red para ver qué se descarga, y simulador de dispositivo para probar tamaños de pantalla sin tener el móvil delante.

---

### V1.2 — Reaprender Git y subir la versión corregida

**Estado:** Pendiente

**Qué se hace.** Retomar Git desde los fundamentos y hacer el primer ciclo completo de trabajo: comprobar estado, preparar cambios, confirmarlos y subirlos.

**Requisitos que cierra:** X-01.

**Cómo se valida.** `git log --oneline` muestra el commit nuevo, y el archivo actualizado se ve en `github.com/pdigue/guitarra`.

**Aprendizaje.** Qué es un repositorio y qué hay dentro de `.git`. Los tres estados de un archivo (directorio de trabajo, área de preparación, repositorio) y por qué existe el intermedio. Los comandos de consulta (`status`, `log`, `diff`, `remote -v`), que no cambian nada y son la forma segura de orientarse. Los comandos de escritura (`add`, `commit`, `push`) y qué hace cada uno exactamente. Cómo escribir un mensaje de commit útil.

---

### V1.3 — Publicar con GitHub Pages

**Estado:** Pendiente

**Qué se hace.** Activar GitHub Pages sobre la rama `main` y obtener la URL pública.

**Requisitos que cierra:** X-02. Al completarse, toda la columna *Publicado* de los requisitos ya implementados pasa a `Sí`.

**Cómo se valida.** `https://pdigue.github.io/guitarra/` carga desde un navegador ajeno al proyecto, con sonido real de guitarra.

**Aprendizaje.** Qué es el alojamiento estático y en qué se diferencia de un servidor con backend. Por qué una app como esta no necesita servidor propio ni tiene coste recurrente. Qué significa HTTPS y por qué el afinador por micrófono de V2 lo va a necesitar. Cómo funciona la caché del navegador y por qué a veces hay que forzar la recarga.

---

### V1.4 — Autoalojar los samples de audio

**Estado:** Pendiente · **Decisión previa requerida** (`requisitos.md` §17.9)

**Qué se hace.** Dejar de depender de `nbrosowsky.github.io`. Elegir entre las opciones A, B o C del análisis de S-07, descargar los archivos de audio, verificar su licencia, colocarlos en `samples/nylon/` y `samples/acoustic/` dentro del repositorio y apuntar el código ahí.

**Requisitos que cierra:** S-07, G-06.

**Cómo se valida.** En la pestaña de red del navegador, todas las peticiones de audio apuntan a `pdigue.github.io` y ninguna a un dominio ajeno. La app sigue sonando igual. Existe un archivo `CREDITOS.md` que documenta el origen y la licencia de cada recurso.

**Aprendizaje.** Qué es un CDN y cuándo conviene o no depender de uno. Qué son las licencias de contenido (dominio público, CC0, CC-BY) y por qué importan si algún día publicas en una tienda de aplicaciones. Cómo se organizan carpetas de recursos en un proyecto web y qué son las rutas relativas.

---

### V1.5 — Convertir el proyecto en una PWA instalable de verdad

**Estado:** Pendiente

**Qué se hace.** Sustituir el manifiesto incrustado como `data:` URL por un archivo `manifest.webmanifest` real, y generar los iconos PNG de 192 y 512 píxeles más la versión adaptable y la de iOS.

**Requisitos que cierra:** G-04.

**Cómo se valida.** Chrome ofrece instalar la app en Android. En iOS, "Añadir a pantalla de inicio" usa el icono correcto y no una captura de pantalla. La auditoría Lighthouse del navegador da la PWA como instalable.

**Aprendizaje.** Qué es una PWA y en qué se diferencia de una app nativa y de una híbrida. Qué declara un manifiesto y por qué cada campo importa. Por qué las rutas deben ser relativas cuando el sitio se sirve bajo una subcarpeta como `/guitarra/`. Qué es Lighthouse y cómo se usa para auditar una web.

---

### V1.6 — Prueba en dispositivo real

**Estado:** Pendiente

**Qué se hace.** Instalar la app en el móvil y usarla como usuario, no como desarrollador. Sesión de al menos quince minutos de uso real, con la guitarra delante.

**Requisitos que cierra:** X-03, y confirma G-04.

**Lista de comprobación específica de táctil:**

| Comprobación | Origen |
|---|---|
| Desplazar el mástil no rompe la racha en Adivinar | AUD-02 |
| Los objetivos táctiles son cómodos en vertical | V-04 |
| El sonido no va con retardo al pulsar | AUD-03 |
| La app abre a pantalla completa desde el icono | G-04 |
| El récord sobrevive a cerrar y reabrir la app | J-08 |
| Girar el móvil no pierde el zoom elegido | V-08, AUD-08.4 |
| El afinador por referencia sirve para afinar de verdad | A-01 |

**Cómo se valida.** Todas las filas marcadas y una nota escrita de lo que resulte incómodo, que alimenta C-06 en V2.

**Aprendizaje.** Por qué probar en dispositivo real es irreemplazable. Diferencias entre eventos de puntero, de ratón y de tacto. Qué es la latencia percibida y por qué 100 ms importan en una app musical.

---

## 🔍 CP-1 — Checkpoint tras la publicación

**Cuándo:** al terminar V1.6.

**Qué se congela:** la URL pública funcionando y el código en GitHub.

**Al auditor de requisitos:** contrastar la app publicada contra `requisitos.md`. Ahora puede probarla, no solo leer el código. Se le pide verificar los requisitos de experiencia de usuario, que son los que peor se auditan leyendo.

**Al auditor técnico:** revisar el código publicado, verificar que las dieciséis correcciones están bien aplicadas y auditar el rendimiento de carga real (tamaño descargado, tiempo hasta que se puede interactuar).

**Salida esperada:** dos informes. El de desarrollo decide qué se acepta, qué se rechaza con motivo y qué se aplaza, y actualiza `requisitos.md`.

---

### V1.7 — Revelar la respuesta correcta al fallar

**Estado:** Pendiente

**Qué se hace.** Completar el único requisito funcional de V1 que quedó sin implementar: al fallar en modo Adivinar, mostrar dónde estaba la nota.

**Requisitos que cierra:** J-10.

**Cómo se valida.** Fallar a propósito y comprobar que se iluminan las posiciones correctas antes de pasar al siguiente reto.

**Aprendizaje.** Cómo se diseña el refuerzo en una herramienta de aprendizaje: un error debe enseñar algo, no solo penalizar.

---

### V1.8 — Cierre de V1

**Estado:** Pendiente

**Qué se hace.** Reconciliar `requisitos.md`, etiquetar la versión en Git y actualizar los cuadernos de aprendizaje con toda la teoría acumulada.

**Cómo se valida.** Existe una etiqueta `v1.0` en el repositorio. `requisitos.md` no tiene ningún `Implementado: Sí` con `Publicado: No`.

**Aprendizaje.** Qué son las etiquetas en Git y por qué se marcan las versiones. Cómo se lleva un registro de cambios.

---

# V2 — Afinador por micrófono y pulido

**Objetivo de la versión:** cerrar el segundo gran objetivo del producto (O-04) y resolver la deuda de experiencia que dejó V1.

**Por qué el micrófono va solo:** es la única pieza del proyecto que introduce tecnología nueva. Mezclarla con otro trabajo haría imposible saber qué rompió qué.

---

### V2.1 — Especificar la interfaz y la navegación

**Estado:** Pendiente · **Bloquea a V2.2 y a todo V3**

**Qué se hace.** La sesión de diseño que lleva pendiente desde el principio: describir pantalla a pantalla la estructura de menús, la jerarquía de controles y los flujos de navegación. Incluye decidir el layout apaisado para móvil, que hoy no existe.

**Requisitos que cierra:** C-06. Desbloquea V-01 y AUD-04.

**Cómo se valida.** Existe un documento `interfaz.md` con una descripción de cada pantalla y sus transiciones, revisado por el auditor de requisitos en su faceta de experiencia de usuario.

**Aprendizaje.** Qué es un wireframe y por qué dibujar antes de programar ahorra tiempo. Jerarquía visual y arquitectura de información. Por qué una app con muchos ajustes necesita distinguir entre lo frecuente y lo ocasional.

---

### V2.2 — Layout apaisado y aviso de orientación

**Estado:** Pendiente · Depende de V2.1

**Qué se hace.** Implementar un layout alternativo para pantallas bajas en horizontal, donde hoy el mástil se queda con unos 70 píxeles de altura para seis cuerdas. Añadir el aviso discreto que sugiere girar el móvil.

**Requisitos que cierra:** V-01, y resuelve AUD-04.

**Cómo se valida.** En un móvil apaisado, cada cuerda tiene al menos 40 píxeles de altura y los puntos de nota son cómodos de pulsar.

**Aprendizaje.** Diseño responsive de verdad: media queries, unidades relativas, y por qué a veces hace falta un layout distinto en lugar de estirar el mismo.

---

### V2.3 — Reestructurar el proyecto en módulos

**Estado:** Pendiente

**Qué se hace.** Pasar del archivo único a una estructura de módulos: teoría musical, motor de audio, estado, interfaz y modos por separado. Introducir un almacén de estado con suscripciones que elimine la propagación manual, origen de seis bugs en la auditoría.

**Requisitos que cierra:** ninguno directamente. Resuelve AUD-19, AUD-20, AUD-21.

**Cómo se valida.** La app funciona igual que antes. Existen pruebas automáticas de las funciones de teoría musical que pasan con `node --test`.

**Aprendizaje.** Qué son los módulos ES y cómo se importan. Por qué separar lógica pura de código que toca la pantalla. Qué es el estado de una aplicación y por qué propagarlo a mano genera errores. Qué es una prueba automática y por qué las funciones puras son las fáciles de probar.

> Esta etapa no añade nada visible. Se hace ahora porque el detector de tono necesita cargarse como archivo propio y porque Escalas traerá lógica musical que no debe convivir con el dibujado del mástil.

---

### V2.4 — Detector de tono

**Estado:** Pendiente

**Qué se hace.** Implementar la detección de frecuencia con algoritmo YIN o MPM sobre Web Audio, ejecutándose en un hilo aparte para no bloquear la interfaz. Sin interfaz todavía: solo el motor y su banco de pruebas.

**Requisitos que cierra:** parte de A-02, y A-02-CA.

**Cómo se valida.** Banco de pruebas reproducible: reproducir samples de guitarra desafinados una cantidad conocida y comprobar que el detector acierta con precisión de ±2 cents y latencia menor de 300 ms. Sin este banco, la etapa no se da por terminada.

**Aprendizaje.** Qué es la frecuencia fundamental y por qué los armónicos de una guitarra engañan a los algoritmos ingenuos. Qué son los cents como medida musical. Por qué hay que desactivar la cancelación de eco y el control automático de ganancia del navegador. Qué es un hilo de trabajo y por qué el audio no puede compartirlo con la interfaz.

---

### V2.5 — Interfaz del afinador por micrófono

**Estado:** Pendiente

**Qué se hace.** Aguja o indicador de desviación, detección automática de cuerda, selección manual, y gestión del permiso de micrófono.

**Requisitos que cierra:** A-02, A-03, A-04, A-05.

**Cómo se valida.** Afinar una guitarra real de principio a fin usando solo la app, en afinación estándar y en una alternativa. Comprobar el caso difícil: una cuerda muy desafinada con selección manual activada.

**Aprendizaje.** Cómo se piden permisos al navegador y por qué exigen contexto seguro. Diseño de indicadores en tiempo real: suavizado e histéresis para que la aguja no tiemble.

---

## 🔍 CP-2 — Checkpoint del afinador

**Cuándo:** al terminar V2.5.

**Al auditor técnico:** revisar el detector de tono, el banco de pruebas y la nueva arquitectura modular. Verificar el comportamiento en iOS, donde activar el micrófono ha alterado históricamente el enrutado del audio.

**Al auditor de requisitos:** verificar que el afinador cumple O-04 y compararlo con afinadores comerciales.

---

### V2.6 — Accesibilidad y paleta

**Estado:** Pendiente · **Decisión previa requerida** (`requisitos.md` §17, paleta)

**Qué se hace.** Navegación del mástil por teclado, regiones que anuncian cambios a lectores de pantalla, y resolver la paleta de colores por nota, hoy con varios pares casi indistinguibles.

**Requisitos que cierra:** G-05. Resuelve AUD-09, AUD-10.

**Cómo se valida.** Recorrer la app entera solo con teclado. Revisar los contrastes con una herramienta automática. Comprobar que dos notas de trastes contiguos son distinguibles por alguien con daltonismo, usando un simulador.

**Aprendizaje.** Qué es la accesibilidad web y por qué no es un extra. Roles y atributos ARIA. Qué significa el contraste 4,5:1. Por qué el color nunca debe ser el único portador de información.

---

### V2.7 — Cierre de V2

**Estado:** Pendiente

Reconciliación de requisitos, etiqueta `v2.0`, actualización de cuadernos. Además, decidir J-11: si el récord de racha es único o independiente por afinación.

---

# V3 — Escalas

**Objetivo de la versión:** cerrar O-03 con un alcance deliberadamente acotado.

**Alcance excluido explícitamente:** validación del orden de las notas (E-05b) y escalas en afinaciones distintas de la estándar (E-02b).

---

### V3.1 — Modelo de deletreo de notas

**Estado:** Pendiente · **Bloquea al resto de V3**

**Qué se hace.** Cambiar la representación interna de una nota. Hoy es un número MIDI con un nombre sacado de una tabla que solo tiene sostenidos, y eso es musicalmente incorrecto para escalas: Fa mayor contiene Si bemol, no La sostenido, y en el pentagrama se dibujan en sitios distintos.

**Requisitos que cierra:** ninguno directamente. Resuelve AUD-22 y habilita E-03, E-04 y P-03.

**Cómo se valida.** Pruebas automáticas: cada escala mayor y menor de las doce tónicas usa siete letras distintas, sin repetir ninguna.

**Aprendizaje.** Por qué en música La sostenido y Si bemol no son lo mismo aunque suenen igual. Cómo se representa una nota de forma que la escritura no se pierda. Por qué un modelo de datos equivocado obliga a reescribir código aparentemente lejano.

---

### V3.2 — Catálogo de escalas

**Estado:** Pendiente · **Decisión previa requerida** (`requisitos.md` §17.4)

**Qué se hace.** Definir e implementar el catálogo: mayor, menor natural, pentatónicas y blues como mínimo. Generador de posiciones sobre el mástil por algoritmo, no almacenadas como datos.

**Requisitos que cierra:** E-01, E-02.

**Cómo se valida.** Contrastar las escalas generadas contra una referencia externa fiable. Pruebas automáticas de los intervalos de cada tipo de escala.

**Aprendizaje.** Qué es una escala en términos de intervalos y por qué se puede generar con un algoritmo en lugar de escribirla a mano doce veces.

---

### V3.3 — Submodo Mostrar

**Estado:** Pendiente

**Qué se hace.** Iluminar las notas de la escala sobre el mástil, con el nombre y la separación interválica respecto al grado anterior. Guiado nota a nota.

**Requisitos que cierra:** E-03, E-04, E-06. Completa P-03.

**Cómo se valida.** Comparar la escala en pantalla con un diagrama de referencia. Comprobar que los intervalos se indican por grado de la escala, no por posición en el mástil.

**Aprendizaje.** La diferencia entre tono y semitono y por qué la estructura interválica define el carácter de una escala.

---

### V3.4 — Submodo Práctica

**Estado:** Pendiente

**Qué se hace.** El usuario recorre la escala sin ayuda. Al pulsar una nota ajena, error e iluminación de las correctas. Solo pertenencia, no orden.

**Requisitos que cierra:** E-05.

**Cómo se valida.** Sesión de práctica real con la guitarra, comprobando que el feedback llega a tiempo y ayuda.

---

### V3.5 — Cierre de V3

Reconciliación, etiqueta `v3.0`, cuadernos.

## 🔍 CP-3 — Checkpoint de escalas

Ambos auditores revisan el módulo de escalas. Especial atención a la corrección musical, que es donde un error pasa desapercibido más tiempo.

---

# V4 — Offline y distribución

**Objetivo de la versión:** que la app funcione sin conexión y valorar su salida a tiendas de aplicaciones.

---

### V4.1 — Service Worker

**Estado:** Pendiente

**Qué se hace.** Precarga versionada de la app y caché bajo demanda de los samples, guardando solo el timbre que el usuario usa.

**Requisitos que cierra:** G-03.

**Cómo se valida.** Cargar la app, activar el modo avión y comprobar que sigue funcionando por completo, incluido el sonido.

**Aprendizaje.** Qué es un Service Worker y por qué es distinto del resto del código. Estrategias de caché. Por qué el versionado de la caché es imprescindible para no dejar a los usuarios con una versión antigua para siempre.

---

### V4.2 — Optimización de carga

**Estado:** Pendiente

**Qué se hace.** Carga diferida de Tone.js con verificación de integridad, o su sustitución por un sampler propio de unas cincuenta líneas. Revisión del peso total descargado.

**Requisitos que cierra:** resuelve AUD-07.

**Cómo se valida.** Medición con Lighthouse antes y después. Objetivo: interacción posible en menos de tres segundos en una conexión móvil lenta.

**Aprendizaje.** Qué significa carga diferida. Qué es la verificación de integridad de un recurso externo. Cómo se mide el rendimiento web y qué métricas importan.

---

### V4.3 — Valoración de tiendas de aplicaciones

**Estado:** Pendiente · **Decisión de producto**

**Qué se hace.** Evaluar si merece la pena empaquetar la PWA para Play Store y App Store. Solo es viable si S-07 se resolvió con licencia limpia.

**Cómo se valida.** Documento de decisión con costes y esfuerzo estimados.

**Aprendizaje.** Qué es el empaquetado de una PWA. Qué exige cada tienda y cuánto cuesta.

---

### V4.4 — Cierre del proyecto base

Etiqueta `v4.0`, documentación final, y decisión sobre continuidad.

## 🔍 CP-4 — Checkpoint final

Auditoría completa de ambos chats sobre el producto terminado.

---

## Anexo A — Métodos de validación empleados

| Método | En qué consiste | Dónde se usa |
|--------|-----------------|--------------|
| **Lista de comprobación manual** | Recorrer una lista de casos concretos marcando cada uno | V1.1, V1.6 |
| **Prueba en dispositivo real** | Usar la app como usuario, con la guitarra delante | V1.6, V2.5, V3.4 |
| **Prueba automática** | Funciones de teoría musical verificadas con `node --test` | V2.3, V3.1, V3.2 |
| **Banco de pruebas reproducible** | Entradas conocidas con resultado esperado, para el detector de tono | V2.4 |
| **Auditoría de herramienta** | Lighthouse para PWA y rendimiento, verificadores de contraste | V1.5, V2.6, V4.2 |
| **Contraste con referencia externa** | Comparar escalas y afinaciones con fuentes fiables | V3.2, V3.3 |
| **Checkpoint de auditoría** | Informe de los chats auditores sobre el estado congelado | CP-1 a CP-4 |

---

## Anexo B — Ritmo de los checkpoints

Los checkpoints se sitúan después de hitos con sustancia, no cada número fijo de etapas. El criterio es que haya algo nuevo y significativo que auditar.

| Checkpoint | Después de | Motivo |
|---|---|---|
| **CP-1** | V1.6 | Primera vez que existe una app usable de verdad |
| **CP-2** | V2.5 | El componente técnicamente más difícil del proyecto |
| **CP-3** | V3.5 | Corrección musical, donde los errores pasan desapercibidos |
| **CP-4** | V4.4 | Cierre del producto base |

Entre checkpoints se puede consultar puntualmente a un auditor si aparece una decisión de calado, sin necesidad de congelar el estado.

---

## Anexo C — Decisiones pendientes y cuándo hay que tomarlas

| Decisión | Referencia | Bloquea a | Plazo |
|---|---|---|---|
| Opción de autoalojamiento del audio (A, B o C) | §17.9 | V1.4 | Antes de V1.4 |
| Paleta de colores de referencia | AUD-10 | V2.6 | Antes de V2.6 |
| Récord único o por afinación | §17.10, J-11 | V2.7 | Antes de V2.7 |
| Catálogo inicial de escalas | §17.4 | V3.2 | Antes de V3.2 |
| Especificación de interfaz | §17.8, C-06 | V2.2 y todo V3 | Antes de V2.2 |

---

## Anexo D — Riesgos vivos del roadmap

| Riesgo | Etapa afectada | Señal de alarma | Plan |
|---|---|---|---|
| El detector de tono no alcanza la precisión pedida | V2.4 | El banco de pruebas falla tras dos intentos de ajuste | Entregar V2 sin micrófono; A-01 ya cubre el objetivo mínimo |
| La reestructuración en módulos rompe cosas | V2.3 | Bugs que no existían antes | Se hace justo después de un checkpoint, con la versión anterior etiquetada para volver |
| El micrófono se comporta distinto en iOS | V2.5 | El audio de salida cambia al activar el micrófono | Verificar en dispositivo real al principio de V2.4, no al final |
| La especificación de interfaz se pospone indefinidamente | V2.1 | Se empieza V3 sin ella | Es bloqueante declarada; no se abre V3 sin cerrarla |
| El alcance de escalas se dispara | V3.2–V3.4 | Aparecen digitaciones, modos o arpegios no previstos | E-02b y E-05b están fuera del alcance por escrito |

---

*Documento gestionado por el chat de Desarrollo. Se revisa al cerrar cada versión.*
