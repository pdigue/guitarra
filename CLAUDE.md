# Trasteando — reglas del proyecto

PWA para aprender el mástil de la guitarra, practicar escalas y acordes, afinar y
tocar con metrónomo.
Cliente: Pablo Díaz Guerra. Está aprendiendo a programar: explica, no solo hagas.
Idioma: español en todo (código comentado, commits, informes y respuestas).

## Al empezar cada conversación
0. Conecta el repositorio **con permiso de escritura** (Pablo lo pide en el
   mensaje de arranque). Si se niega, díselo a Pablo antes de trabajar: sin él
   no se puede subir la rama ni abrir el PR.
1. Lee **docs/ESTADO.md** del repositorio (en la rama que diga el propio ESTADO o
   el mensaje de Pablo): dice dónde estamos, qué está pendiente y cómo se trabaja.
2. Compáralo con su copia en el proyecto de claude.ai, **claude/ESTADO.md**.
   Deben ser idénticas. Si difieren, díselo a Pablo antes de seguir: manda la
   del repositorio, salvo que él diga otra cosa.
3. Con este archivo y ESTADO.md basta para seguir; los demás documentos se leen
   solo cuando la tarea los necesita, y por partes (con grep o por secciones).

## Bloques de trabajo (desde el 15/11)
Un **bloque** es una etapa del roadmap o un comentario de Pablo (p. ej. F5.8 #5):
una conversación, una rama `auto/F<fase>.<etapa>-<tema>`, un PR. Puede tener
varias versiones de la app.

## Documentos que mandan
- docs/ESTADO.md — memoria entre conversaciones (unas 60 líneas, solo lo vivo).
- docs/requisitos.md y docs/matriz-cumplimiento.md — qué debe hacer el producto y
  cómo se demuestra. Se **generan** con herramientas/documentos/ (no se editan a
  mano); desde la v2.0 son el *baseline 0.6.2*.
- docs/roadmap.md — lo que queda y en qué orden (las fases hechas, una línea).
- docs/interfaz.md, docs/compatibilidad.md, docs/automatizacion.md.
- CHANGELOG.md (solo desde la 0.6.0) y CREDITOS.md.
- docs/historico/ — todo lo anterior al 15/11, íntegro: requisitos v1.27, matriz
  v1.25, roadmap v3.26, CHANGELOG hasta la 0.5.7, auditorías, verificaciones e
  informes. Solo se lee si hace falta; no se toca. La rama `archivo/hasta-0.6.2`
  guarda el estado de entonces y **no se borra nunca**.

## Decisiones vigentes
- Audio (S-07): las muestras de samples/, con licencia verificada y atribución.
- Móvil de referencia: iPhone. Sin Android de pruebas: simulador de Chrome.
- Web de pruebas en GitHub Pages (rama `pruebas`), sin anunciar; la publicación
  oficial es F7.1.
- Agudo de la acústica (hasta 14 semitonos de transporte): limitación aceptada.

## Reglas
1. Nunca trabajes en main. Una rama por bloque.
2. Un bloque está hecho cuando sus requisitos cumplen su criterio y `node --test`
   está en verde.
3. **Auditorías** (15/11). Los auditores de .claude/agents/ son de solo lectura;
   sus informes van a docs/auditorias/ (AT-nn, AR-nn).
   - Técnica (auditor-tecnico), **ligera, una vez por bloque**: entrada, el diff
     del bloque; como mucho 10 lecturas de archivos.
   - De requisitos (auditor-requisitos): **solo si cambian requisitos**, con la
     misma entrada y el mismo límite.
   - **A fondo** (los dos, en paralelo), al cerrar cada fase (punto de control CP-n).
   - **Una ronda**, salvo que haya críticos. Corrige lo crítico y lo alto; anota
     el resto en la matriz.
4. Todo cambio en requisitos.md va a su control de cambios, con la lista de ID
   que cambian (lo exige el banco), y se avisa a Pablo de cada uno.
5. Versión de la app: 0.<fase>.<corrección>. **En cada versión**, solo
   APP_VERSION, CHANGELOG.md y ESTADO.md (y requisitos y matriz si cambian).
   **Al cerrar el bloque**: roadmap, interfaz, compatibilidad y el informe
   didáctico, de **una página**, en docs/iteraciones/IT-nn.md (qué se hizo, por
   qué y qué concepto ilustra, para un principiante).
6. Commits en español, en infinitivo y con IDs: «F5.8 #3: temas elegibles (C-08)».
7. En el navegador, solo las comprobaciones que toquen lo cambiado. Capturas solo
   si cambia algo visual, y **combinadas en una imagen**.
8. Para y pregunta en las paradas de docs/automatizacion.md §3. No publiques, no
   fusiones en main, no pagues, no borres historial sin aprobación explícita.
9. Cero dependencias nuevas sin justificarlo en el informe. La app y el banco no
   instalan nada; las herramientas de herramientas/ pueden necesitar Python, y lo
   dicen en su cabecera.
10. Diseña para Windows, Android e iPhone a la vez (PL-04): solo estándares web,
    detecta capacidades y no sistemas, y anota cada capacidad nueva con su
    alternativa en docs/compatibilidad.md. El iPhone marca el mínimo.
11. Fusiones: Pablo las aprueba con palabras explícitas («fusiona el #N»). Un
    «ok» o «sigue» no basta.

## Cuándo se actualiza ESTADO.md
- En cada versión, en el mismo commit que sube APP_VERSION (el banco lo exige:
  la línea «Actualizado» cita la versión, y la línea «Documentos» las de
  requisitos, matriz y roadmap).
- Tras cada fusión en main, decisión de Pablo o cambio de pendientes.
Cada vez: commit y push, y la misma versión al proyecto como claude/ESTADO.md
(y CLAUDE.md como claude/CLAUDE.md si cambió). **En el proyecto de claude.ai solo
están esos dos**; todo lo demás vive en GitHub.

## Cambio de conversación (lo propone el agente, no Pablo)
Al cerrar un bloque, pasados un par de días o si la conversación se ha resumido
sola por larga:
1. «Conviene pasar a una conversación nueva».
2. Deja ESTADO al día (repositorio y proyecto) con el banco en verde.
3. Si cambió la forma de trabajar, da el texto nuevo completo de las
   instrucciones del proyecto: Pablo lo pega; el agente no puede editarlas.
4. Recuerda el mensaje de arranque («Lee ESTADO y sigue. Conecta el repositorio
   con permiso de escritura.») y qué puede añadir Pablo.
5. Termina con «ESTADO actualizado: versión X, siguiente paso Y».

## Ahorro de uso
Pablo tiene un límite de uso, y lo caro es la longitud de la conversación.
- Lee por partes (grep, secciones). No vuelques diffs, registros ni documentos.
- Auditorías, las de la regla 3, ni más ni menos.
- El histórico no se relee salvo para una duda concreta.
