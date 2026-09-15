# Trasteando — Roadmap de ejecución

**Versión:** 2.0
**Fecha:** 15 de septiembre de 2026
**Documentos relacionados:** `requisitos.md` · `auditoria-requisitos-trasteando.md` · `auditoria-tecnica-01.md`
**Gestionado por:** chat de Desarrollo

> **Cambio principal respecto a la v1.0:** el proyecto se desarrolla **en local de principio a fin**. La publicación en web pública y la valoración de tiendas de aplicaciones se trasladan a la última fase. Las fases intermedias producen una app usable en ordenador y móvil sin depender de internet ni de servicios externos.

---

## 1. Cómo está organizado este documento

El proyecto avanza en **siete fases (F1–F7)**. Cada fase se divide en **etapas** con la forma `F2.3`, y cada etapa declara cuatro cosas:

- **Qué se hace** — el trabajo concreto.
- **Requisitos que cierra** — los IDs de `requisitos.md` que pasan a cumplidos.
- **Cómo se valida** — la prueba que demuestra que está hecho. Sin prueba, la etapa no está terminada.
- **Aprendizaje** — el concepto técnico que se explica al abordarla, porque este proyecto también es un vehículo de formación.

Entre fases hay **checkpoints de auditoría** (`CP-n`): el estado se congela, se pasa a los chats auditores y no se avanza hasta haber leído sus informes y decidido qué se acepta.

**Estados de una etapa:** `Pendiente` · `En curso` · `Hecha` · `Validada` · `Descartada`

---

## 2. Concepto clave: los tres modos de ejecución

Esta distinción gobierna todo el roadmap. No es un detalle: determina qué funcionalidad es posible en cada momento.

| Modo | Cómo se abre | Qué permite | Qué NO permite |
|------|--------------|-------------|----------------|
| **`file://`** | Doble clic sobre el archivo | Todo lo que esté contenido en el propio archivo | Descargar recursos externos (ni siquiera de la carpeta de al lado), micrófono, funcionamiento offline gestionado |
| **`http://localhost`** | Live Server en el ordenador | Absolutamente todo, igual que si estuviera publicado | Nada; pero solo existe mientras el ordenador esté encendido |
| **`https://`** | Publicado en internet | Todo, desde cualquier dispositivo y sin el ordenador | — |

**Consecuencias que condicionan el roadmap:**

1. Para que un archivo funcione **realmente autónomo** (doble clic, móvil, sin internet), el audio debe ir **dentro** del propio HTML. Esto se resuelve en F2.
2. El **afinador por micrófono exige contexto seguro**. Funciona en `localhost` y en `https`, nunca en `file://`. Por eso F4 se desarrolla y se usa con Live Server, y no llega al móvil de forma autónoma hasta F7.
3. El **funcionamiento offline gestionado** (Service Worker) también exige contexto seguro, por eso vive en F6.

**Git y GitHub no son lo mismo.** El historial de versiones es local y no requiere internet. Tener el código en GitHub tampoco publica nada: la app solo se vuelve pública al activar GitHub Pages, que es F7. Durante F1–F6 el repositorio funciona como respaldo privado.

---

## 3. Panorama general

| Fase | Objetivo | Modo de ejecución | Etapas | Checkpoint |
|------|----------|-------------------|--------|------------|
| **F1** | Base local sólida y verificada | Live Server | F1.1 – F1.4 | — |
| **F2** | Sonido propio de calidad, archivo autónomo | `file://` ✅ | F2.1 – F2.4 | CP-1 |
| **F3** | Interfaz y adaptación a ordenador y móvil | `file://` ✅ | F3.1 – F3.4 | CP-2 |
| **F4** | Afinador por micrófono | Live Server | F4.1 – F4.4 | CP-3 |
| **F5** | Escalas | `file://` ✅ | F5.1 – F5.5 | CP-4 |
| **F6** | Preparación para distribución | Live Server | F6.1 – F6.3 | — |
| **F7** | Publicación | `https://` | F7.1 – F7.5 | CP-5 |

La columna «Modo de ejecución» indica dónde se desarrolla. ✅ señala las fases que producen un archivo que puedes llevarte al móvil y abrir sin nada más.

---

# F1 — Base local sólida

**Objetivo.** Verificar que las dieciséis correcciones de la auditoría técnica funcionan, y recuperar el control de versiones para no volver a perder trabajo.

**Estado al terminar.** La app funciona correctamente en el ordenador con Live Server, y cada cambio queda registrado en el historial.

---

### F1.1 — Verificar las correcciones críticas

**Estado:** Pendiente

**Qué se hace.** Probar en Live Server la versión corregida. No se toca código salvo que algo falle.

| Comprobación | Origen | Cómo se prueba |
|---|---|---|
| Al abrir Afinador, el mástil desaparece | AUD-01 | Cambiar de pestaña |
| La nota suena sin retardo perceptible | AUD-03 | Pulsar repetidamente |
| El pentagrama dibuja agudos con marca 8va | AUD-05 | 1ª cuerda, trastes 12 y 24 |
| El pentagrama dibuja graves con 8vb | AUD-05 | Bajar la 6ª cuerda al mínimo |
| Restablecer recarga el timbre correcto | AUD-08 | Poner acústica, restablecer, escuchar |
| Cambiar nomenclatura tras 3 s actualiza el lector | AUD-08 | Pulsar nota, esperar, cambiar a C D E |
| El zoom no salta de tramo | AUD-13 | Ir al traste 15 y hacer zoom |
| La etiqueta de zoom dice la verdad | AUD-12 | Ventana estrecha, pulsar − hasta el tope |

**Cómo se valida.** Todas las filas marcadas. Lo que dependa de táctil se pospone a F3.

**Aprendizaje.** Las herramientas de desarrollo del navegador: consola de errores, pestaña de red, simulador de dispositivos. Por qué `localhost` y `file://` se comportan distinto.

---

### F1.2 — Recuperar Git y el control de versiones

**Estado:** Pendiente

**Qué se hace.** Retomar Git desde los fundamentos y hacer el ciclo completo: consultar estado, preparar cambios, confirmarlos y respaldarlos.

**Requisitos que cierra:** X-01.

**Cómo se valida.** `git log --oneline` muestra el commit nuevo, y el repositorio remoto refleja el cambio.

**Aprendizaje.** Qué es un repositorio y qué contiene la carpeta `.git`. Los tres estados de un archivo y por qué existe el intermedio. Comandos de consulta (`status`, `log`, `diff`, `remote -v`) frente a comandos de escritura (`add`, `commit`, `push`). Cómo escribir un mensaje de commit útil. **Por qué tener código en GitHub no es publicar la app.**

---

### F1.3 — Revelar la respuesta correcta al fallar

**Estado:** Pendiente

**Qué se hace.** Completar el único requisito funcional del núcleo que quedó sin implementar: al fallar en modo Adivinar, mostrar dónde estaba la nota.

**Requisitos que cierra:** J-10.

**Cómo se valida.** Fallar a propósito y comprobar que se iluminan las posiciones correctas antes del siguiente reto.

**Aprendizaje.** Cómo se diseña el refuerzo en una herramienta de aprendizaje: un error debe enseñar, no solo penalizar.

---

### F1.4 — Cierre de F1

**Qué se hace.** Reconciliar `requisitos.md`, etiquetar la versión en Git, actualizar cuadernos de aprendizaje.

**Aprendizaje.** Qué son las etiquetas en Git y por qué se marcan las versiones.

---

# F2 — Sonido propio y archivo autónomo

**Objetivo.** Eliminar toda dependencia externa de audio y conseguir que el archivo funcione por sí solo en cualquier dispositivo, incluido el móvil abriéndolo directamente.

**Por qué esta fase va aquí.** Es lo que convierte el proyecto en algo que puedes llevarte contigo. Además resuelve un riesgo abierto: hoy el sonido depende del GitHub Pages personal de otra persona.

**Decisión previa requerida:** opción de autoalojamiento del audio (`requisitos.md`, análisis de S-07).

---

### F2.1 — Elegir y verificar la fuente de audio

**Estado:** Pendiente

**Qué se hace.** Decidir entre las opciones del análisis de S-07: reutilizar los samples actuales verificando su licencia, sustituirlos por una librería de licencia inequívoca, o grabar samples propios. Descargar los archivos y documentar su procedencia.

**Requisitos que cierra:** parte de S-07, y G-06.

**Cómo se valida.** Existe un `CREDITOS.md` con el origen y la licencia de cada archivo. Los archivos suenan correctamente al reproducirlos sueltos.

**Aprendizaje.** Qué es un CDN y cuándo conviene o no depender de uno. Licencias de contenido: dominio público, CC0, CC-BY, y por qué importan de cara a F7. Qué es la frecuencia de muestreo y cómo afecta al peso y a la calidad.

---

### F2.2 — Sampler propio sin Tone.js

**Estado:** Pendiente

**Qué se hace.** Sustituir Tone.js por un reproductor de muestras propio, de unas cincuenta líneas, usando Web Audio directamente. Carga los samples, los decodifica y ajusta el tono para las notas intermedias.

**Requisitos que cierra:** consolida S-01, S-04. Resuelve AUD-07.

**Cómo se valida.** La app suena igual o mejor que antes, sin ninguna referencia a un dominio externo. El retardo al pulsar es menor que con Tone.js.

**Aprendizaje.** Qué es la Web Audio API y cómo se construye un grafo de audio. Qué significa decodificar audio y qué es un buffer. Cómo se transporta una nota cambiando la velocidad de reproducción, y por qué eso degrada el sonido si el salto es grande. Por qué reducir dependencias mejora el control sobre el producto.

---

### F2.3 — Incrustar el audio en el archivo

**Estado:** Pendiente

**Qué se hace.** Codificar los samples dentro del propio HTML para que no haya que descargar nada. El resultado es un archivo único de unos tres megas que funciona en cualquier sitio.

**Requisitos que cierra:** completa S-07. Habilita el uso en móvil sin servidor.

**Cómo se valida.** **La prueba definitiva de esta fase:** copiar el archivo al móvil, abrirlo con doble clic sin conexión a internet, y comprobar que suena la guitarra real.

**Aprendizaje.** Qué es la codificación en base64 y por qué un archivo binario puede vivir dentro de un archivo de texto. El compromiso entre autonomía y peso. Por qué esta técnica es adecuada para una herramienta personal y no para una web de gran alcance.

---

### F2.4 — Calidad del registro agudo

**Estado:** Pendiente

**Qué se hace.** La nota más aguda del mástil está a catorce semitonos de la muestra más cercana, lo que suena metálico. Añadir muestras intermedias para reducir la distancia máxima de transporte.

**Requisitos que cierra:** consolida S-01.

**Cómo se valida.** Recorrer la 1ª cuerda del traste 0 al 24 y comprobar que no hay ningún salto de calidad audible.

**Aprendizaje.** Por qué un sampler necesita varias muestras repartidas por el registro. Qué es el aliasing y por qué transportar mucho degrada el sonido.

---

## 🔍 CP-1 — Checkpoint del sonido y la autonomía

**Qué se congela:** el archivo autónomo funcionando en ordenador y móvil.

**Al auditor técnico:** revisar el sampler propio, la gestión de memoria al incrustar audio y el rendimiento de arranque. Verificar que no queda ninguna dependencia externa en tiempo de ejecución.

**Al auditor de requisitos:** valorar la calidad del sonido frente a O-01 y S-01, y si el peso del archivo es aceptable para el uso previsto.

---

# F3 — Interfaz y adaptación a ambos dispositivos

**Objetivo.** Que la app sea igual de cómoda en un ordenador y en un móvil, en ambas orientaciones. Hoy en móvil horizontal el mástil se queda con unos setenta píxeles de altura para seis cuerdas.

---

### F3.1 — Especificar la interfaz y la navegación

**Estado:** Pendiente · **Bloquea al resto de F3 y a toda F5**

**Qué se hace.** La sesión de diseño pendiente desde el principio del proyecto: describir pantalla a pantalla la estructura de menús, la jerarquía de controles y los flujos de navegación, para ordenador y para móvil en ambas orientaciones.

**Requisitos que cierra:** C-06. Desbloquea V-01.

**Cómo se valida.** Existe un `interfaz.md` con cada pantalla y sus transiciones, revisado por el auditor de requisitos en su faceta de experiencia de usuario.

**Aprendizaje.** Qué es un wireframe y por qué dibujar antes de programar ahorra tiempo. Jerarquía visual y arquitectura de información. Cómo distinguir ajustes frecuentes de ocasionales.

---

### F3.2 — Layout apaisado y aviso de orientación

**Estado:** Pendiente · Depende de F3.1

**Qué se hace.** Layout alternativo para pantallas bajas en horizontal. Aviso discreto que sugiere girar el móvil, sin forzarlo.

**Requisitos que cierra:** V-01. Resuelve AUD-04.

**Cómo se valida.** En un móvil apaisado real, cada cuerda tiene al menos cuarenta píxeles de altura y los puntos son cómodos de pulsar.

**Aprendizaje.** Diseño responsive de verdad: media queries, unidades relativas, y cuándo hace falta un layout distinto en lugar de estirar el mismo.

---

### F3.3 — Prueba táctil en dispositivo real

**Estado:** Pendiente

**Qué se hace.** Sesión de uso real de al menos quince minutos con la guitarra delante, en el móvil, usando el archivo autónomo de F2.

| Comprobación | Origen |
|---|---|
| Desplazar el mástil no rompe la racha en Adivinar | AUD-02 |
| Los objetivos táctiles son cómodos en ambas orientaciones | V-01, V-04 |
| El sonido no va con retardo | AUD-03 |
| El récord sobrevive a cerrar y reabrir | J-08 |
| Girar el móvil no pierde el zoom elegido | V-08 |
| El afinador por referencia sirve para afinar de verdad | A-01 |

**Cómo se valida.** Todas las filas marcadas, más una nota escrita de lo que resulte incómodo.

**Aprendizaje.** Por qué probar en dispositivo real es irreemplazable. Eventos de puntero frente a ratón y tacto. Qué es la latencia percibida.

---

### F3.4 — Accesibilidad y paleta de colores

**Estado:** Pendiente · **Decisión previa requerida** (paleta de referencia)

**Qué se hace.** Navegación del mástil por teclado, anuncios para lectores de pantalla, y resolver la paleta por nota, que hoy tiene varios pares casi indistinguibles.

**Requisitos que cierra:** G-05. Resuelve AUD-09, AUD-10.

**Cómo se valida.** Recorrer la app entera solo con teclado. Verificar contrastes con herramienta automática. Comprobar con un simulador de daltonismo que dos notas de trastes contiguos se distinguen.

**Aprendizaje.** Qué es la accesibilidad web y por qué no es un extra. Roles y atributos ARIA. Qué significa el contraste 4,5:1. Por qué el color no debe ser nunca el único portador de información.

---

## 🔍 CP-2 — Checkpoint de interfaz

**Al auditor de requisitos:** contrastar la interfaz contra `interfaz.md` y contra los objetivos de aprendizaje. Es el checkpoint donde más peso tiene su faceta de experiencia de usuario.

**Al auditor técnico:** revisar el layout responsive, la accesibilidad y el rendimiento en dispositivos modestos.

---

# F4 — Afinador por micrófono

**Objetivo.** Cerrar O-04, el segundo gran objetivo del producto.

> **Restricción de esta fase.** El micrófono exige contexto seguro. Se desarrolla y se usa con **Live Server en el ordenador**. En el móvil no estará disponible de forma autónoma hasta F7, o conectando el móvil al Live Server del ordenador por WiFi. Es una limitación del navegador, no del código.

**Por qué va sola.** Es la única pieza del proyecto que introduce tecnología nueva. Mezclarla con otro trabajo haría imposible saber qué rompió qué.

---

### F4.1 — Reestructurar el proyecto en módulos

**Estado:** Pendiente

**Qué se hace.** Pasar del archivo único a módulos separados: teoría musical, motor de audio, estado, interfaz y modos. Introducir un almacén de estado con suscripciones que elimine la propagación manual, origen de seis bugs en la auditoría.

**Requisitos que cierra:** ninguno directamente. Resuelve AUD-19, AUD-20, AUD-21.

**Cómo se valida.** La app funciona igual que antes. Existen pruebas automáticas de las funciones de teoría musical que pasan con `node --test`.

**Aprendizaje.** Qué son los módulos y cómo se importan. Por qué separar lógica pura de código que toca la pantalla. Qué es el estado de una aplicación y por qué propagarlo a mano genera errores. Qué es una prueba automática y por qué las funciones puras son las fáciles de probar.

> **Nota sobre autonomía.** Los módulos no funcionan con `file://`. Durante F4 el desarrollo es con Live Server. En F6 se reconstruye un archivo autónomo a partir de los módulos, de modo que se conserven las dos formas de uso.

---

### F4.2 — Detector de tono

**Estado:** Pendiente

**Qué se hace.** Detección de frecuencia con algoritmo YIN o MPM sobre Web Audio, en un hilo aparte para no bloquear la interfaz. Sin interfaz todavía: solo el motor y su banco de pruebas.

**Requisitos que cierra:** parte de A-02, y A-02-CA.

**Cómo se valida.** Banco de pruebas reproducible: reproducir samples desafinados una cantidad conocida y comprobar precisión de ±2 cents y latencia menor de 300 ms. **Sin este banco, la etapa no se da por terminada.**

**Aprendizaje.** Qué es la frecuencia fundamental y por qué los armónicos de una guitarra engañan a los algoritmos ingenuos. Qué son los cents. Por qué hay que desactivar la cancelación de eco y el control automático de ganancia. Qué es un hilo de trabajo y por qué el audio no puede compartirlo con la interfaz.

---

### F4.3 — Interfaz del afinador

**Estado:** Pendiente

**Qué se hace.** Indicador de desviación, detección automática de cuerda, selección manual, gestión del permiso de micrófono.

**Requisitos que cierra:** A-02, A-03, A-04, A-05.

**Cómo se valida.** Afinar una guitarra real de principio a fin usando solo la app, en afinación estándar y en una alternativa. Probar el caso difícil: cuerda muy desafinada con selección manual.

**Aprendizaje.** Cómo se piden permisos al navegador y por qué exigen contexto seguro. Diseño de indicadores en tiempo real: suavizado e histéresis para que la aguja no tiemble.

---

### F4.4 — Cierre de F4

Reconciliación de requisitos, etiqueta de versión, cuadernos. Decidir J-11: si el récord de racha es único o por afinación.

---

## 🔍 CP-3 — Checkpoint del afinador

**Al auditor técnico:** revisar el detector, el banco de pruebas y la arquitectura modular. Verificar el comportamiento en iOS, donde activar el micrófono ha alterado históricamente el enrutado del audio.

**Al auditor de requisitos:** verificar que el afinador cumple O-04 y compararlo con afinadores comerciales.

---

# F5 — Escalas

**Objetivo.** Cerrar O-03 con alcance deliberadamente acotado.

**Excluido explícitamente:** validación del orden de las notas (E-05b) y escalas en afinaciones distintas de la estándar (E-02b).

---

### F5.1 — Modelo de deletreo de notas

**Estado:** Pendiente · **Bloquea al resto de F5**

**Qué se hace.** Cambiar la representación interna de una nota. Hoy es un número MIDI con nombre sacado de una tabla que solo tiene sostenidos, y eso es musicalmente incorrecto para escalas: Fa mayor contiene Si bemol, no La sostenido, y en el pentagrama van en posiciones distintas.

**Requisitos que cierra:** ninguno directamente. Resuelve AUD-22 y habilita E-03, E-04, P-03.

**Cómo se valida.** Pruebas automáticas: cada escala mayor y menor de las doce tónicas usa siete letras distintas sin repetir.

**Aprendizaje.** Por qué La sostenido y Si bemol no son lo mismo aunque suenen igual. Cómo representar una nota sin perder su escritura. Por qué un modelo de datos equivocado obliga a reescribir código aparentemente lejano.

---

### F5.2 — Catálogo de escalas

**Estado:** Pendiente · **Decisión previa requerida** (catálogo inicial)

**Qué se hace.** Definir e implementar el catálogo: mayor, menor natural, pentatónicas y blues como mínimo. Generador de posiciones por algoritmo, no almacenadas como datos.

**Requisitos que cierra:** E-01, E-02.

**Cómo se valida.** Contrastar las escalas generadas contra una referencia externa fiable. Pruebas automáticas de los intervalos de cada tipo.

**Aprendizaje.** Qué es una escala en términos de intervalos y por qué se puede generar con un algoritmo en lugar de escribirla a mano doce veces.

---

### F5.3 — Submodo Mostrar

**Estado:** Pendiente

**Qué se hace.** Iluminar las notas de la escala sobre el mástil, con el nombre y la separación interválica respecto al grado anterior. Guiado nota a nota.

**Requisitos que cierra:** E-03, E-04, E-06. Completa P-03.

**Cómo se valida.** Comparar con un diagrama de referencia. Comprobar que los intervalos se indican por grado de la escala, no por posición en el mástil.

**Aprendizaje.** La diferencia entre tono y semitono y por qué la estructura interválica define el carácter de una escala.

---

### F5.4 — Submodo Práctica

**Estado:** Pendiente

**Qué se hace.** El usuario recorre la escala sin ayuda. Al pulsar una nota ajena, error e iluminación de las correctas. Solo pertenencia, no orden.

**Requisitos que cierra:** E-05.

**Cómo se valida.** Sesión de práctica real con la guitarra, comprobando que el feedback llega a tiempo y ayuda.

---

### F5.5 — Cierre de F5

Reconciliación, etiqueta, cuadernos.

---

## 🔍 CP-4 — Checkpoint de escalas

Ambos auditores revisan el módulo. Especial atención a la corrección musical, que es donde un error pasa desapercibido más tiempo.

---

# F6 — Preparación para distribución

**Objetivo.** Dejar el proyecto listo para publicar, sin publicar todavía. Todo se verifica en local.

---

### F6.1 — Reconstruir el archivo autónomo

**Estado:** Pendiente

**Qué se hace.** Generar, a partir de los módulos de F4.1, un archivo único autónomo equivalente. Así se conservan las dos formas de uso: el proyecto modular para desarrollar y el archivo suelto para llevárselo.

**Cómo se valida.** El archivo generado funciona con doble clic en el móvil, sin conexión, con todas las funcionalidades salvo el micrófono.

**Aprendizaje.** Qué es un proceso de construcción y por qué el código que se escribe no siempre es el que se distribuye. Diferencia entre código fuente y artefacto distribuible.

---

### F6.2 — Service Worker y funcionamiento offline

**Estado:** Pendiente

**Qué se hace.** Precarga versionada de la app y caché bajo demanda de los samples, guardando solo el timbre en uso.

**Requisitos que cierra:** G-03.

**Cómo se valida.** Con Live Server: cargar la app, activar el modo avión y comprobar que sigue funcionando por completo.

**Aprendizaje.** Qué es un Service Worker y por qué es distinto del resto del código. Estrategias de caché. Por qué el versionado de la caché es imprescindible para no dejar a los usuarios con una versión antigua para siempre.

---

### F6.3 — Manifiesto e iconos

**Estado:** Pendiente

**Qué se hace.** Manifiesto real en archivo propio, iconos PNG de 192 y 512 píxeles, versión adaptable y versión para iOS.

**Requisitos que cierra:** G-04.

**Cómo se valida.** Con Live Server, el navegador ofrece instalar la app. La auditoría Lighthouse la da como instalable.

**Aprendizaje.** Qué es una PWA y en qué se diferencia de una app nativa y de una híbrida. Qué declara un manifiesto y por qué cada campo importa. Qué es Lighthouse.

---

# F7 — Publicación

**Objetivo.** Hacer la app accesible públicamente y valorar su salida a tiendas de aplicaciones.

> **Esta es la última fase por diseño.** Todo lo anterior se ha desarrollado y validado en local. Aquí no se añade funcionalidad: se distribuye lo que ya funciona.

---

### F7.1 — Publicar en web

**Estado:** Pendiente

**Qué se hace.** Activar GitHub Pages sobre el repositorio y obtener la URL pública.

**Requisitos que cierra:** X-02.

**Cómo se valida.** La URL carga desde un dispositivo ajeno al proyecto, con todas las funcionalidades.

**Aprendizaje.** Qué es el alojamiento estático y en qué se diferencia de un servidor con backend. Por qué esta app no necesita servidor propio ni tiene coste recurrente. Qué significa HTTPS. Cómo funciona la caché del navegador.

---

### F7.2 — Verificación completa en dispositivo

**Estado:** Pendiente

**Qué se hace.** Instalar la app publicada en el móvil como icono y usarla en condiciones reales. **Es aquí donde el afinador por micrófono queda disponible en el móvil por primera vez.**

**Requisitos que cierra:** X-03. Confirma G-04, y A-02 a A-05 en móvil.

**Cómo se valida.** Afinar una guitarra con el móvil, sin el ordenador encendido.

---

### F7.3 — Optimización de carga

**Estado:** Pendiente

**Qué se hace.** Revisión del peso descargado y del tiempo hasta que se puede interactuar. En la versión publicada el audio no va incrustado, sino cacheado por el Service Worker.

**Cómo se valida.** Medición con Lighthouse. Objetivo: interacción posible en menos de tres segundos en conexión móvil lenta.

**Aprendizaje.** Cómo se mide el rendimiento web y qué métricas importan. Por qué la versión distribuida por web y la versión autónoma tienen estrategias de carga opuestas.

---

### F7.4 — Valoración de tiendas de aplicaciones

**Estado:** Pendiente · **Decisión de producto**

**Qué se hace.** Evaluar el empaquetado de la PWA para Play Store y App Store. Solo es viable si el audio se resolvió con licencia limpia en F2.1.

**Cómo se valida.** Documento de decisión con costes, esfuerzo y requisitos de cada tienda.

**Aprendizaje.** Qué es el empaquetado de una PWA y qué herramientas existen. Qué exige cada tienda, cuánto cuesta y qué implica el proceso de revisión. Por qué la licencia del contenido importa aquí y no importaba antes.

---

### F7.5 — Cierre del proyecto base

Etiqueta final, documentación, decisión sobre continuidad.

---

## 🔍 CP-5 — Checkpoint final

Auditoría completa de ambos chats sobre el producto publicado.

---

## Anexo A — Métodos de validación

| Método | En qué consiste | Dónde se usa |
|--------|-----------------|--------------|
| **Lista de comprobación manual** | Recorrer casos concretos marcando cada uno | F1.1, F3.3 |
| **Prueba en dispositivo real** | Usar la app como usuario, con la guitarra delante | F2.3, F3.3, F4.3, F5.4, F7.2 |
| **Prueba de autonomía** | Abrir el archivo sin conexión y sin servidor | F2.3, F6.1 |
| **Prueba automática** | Funciones puras verificadas con `node --test` | F4.1, F5.1, F5.2 |
| **Banco de pruebas reproducible** | Entradas conocidas con resultado esperado | F4.2 |
| **Auditoría de herramienta** | Lighthouse, verificadores de contraste | F3.4, F6.3, F7.3 |
| **Contraste con referencia externa** | Comparar escalas y afinaciones con fuentes fiables | F5.2, F5.3 |
| **Checkpoint de auditoría** | Informe de los chats auditores sobre el estado congelado | CP-1 a CP-5 |

---

## Anexo B — Decisiones pendientes y cuándo hay que tomarlas

| Decisión | Bloquea a | Plazo |
|---|---|---|
| Opción de autoalojamiento del audio | F2.1 | Antes de F2 |
| Paleta de colores de referencia | F3.4 | Antes de F3.4 |
| Especificación de interfaz | F3.2 y toda F5 | Antes de F3.2 |
| Récord único o por afinación | F4.4 | Antes de F4.4 |
| Catálogo inicial de escalas | F5.2 | Antes de F5.2 |
| Publicar en tiendas o quedarse en web | F7.4 | Antes de F7.4 |

---

## Anexo C — Riesgos vivos

| Riesgo | Fase | Señal de alarma | Plan |
|---|---|---|---|
| El archivo autónomo resulta demasiado pesado | F2.3 | Tarda en abrir en el móvil | Reducir calidad de muestra o número de samples; medir antes de decidir |
| El detector de tono no alcanza la precisión pedida | F4.2 | El banco de pruebas falla tras dos intentos de ajuste | Entregar F4 sin micrófono; A-01 ya cubre el objetivo mínimo |
| La reestructuración en módulos rompe cosas | F4.1 | Bugs que no existían antes | Se hace justo después de un checkpoint, con versión anterior etiquetada |
| Los módulos rompen la autonomía del archivo | F4.1 | Deja de funcionar con doble clic | Asumido y planificado: F6.1 reconstruye el archivo autónomo |
| El micrófono se comporta distinto en iOS | F4.3 | El audio de salida cambia al activar el micrófono | Verificar en dispositivo real al principio de F4.2 |
| La especificación de interfaz se pospone | F3.1 | Se empieza F5 sin ella | Es bloqueante declarada |
| El alcance de escalas se dispara | F5.2–F5.4 | Aparecen digitaciones, modos o arpegios no previstos | E-02b y E-05b están fuera del alcance por escrito |

---

*Documento gestionado por el chat de Desarrollo. Se revisa al cerrar cada fase.*
