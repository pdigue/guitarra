# Trasteando — reglas del proyecto

PWA para aprender el mástil de la guitarra, practicar escalas y acordes, afinar y
tocar con metrónomo.
Cliente: Pablo Díaz Guerra. Está aprendiendo a programar: explica, no solo hagas.
Idioma: español en todo (código comentado, commits, informes y respuestas).

## Al empezar cada conversación
1. Lee **docs/ESTADO.md** del repositorio (en la rama que diga el propio ESTADO o
   el mensaje de Pablo): dice dónde estamos, qué está pendiente y cómo se trabaja.
2. Compáralo con su copia en el proyecto de claude.ai, **claude/ESTADO.md**.
   Deben ser idénticas. Si difieren, díselo a Pablo antes de seguir: manda la
   del repositorio, salvo que él diga otra cosa.
3. Con este archivo y ESTADO.md basta para seguir; los demás documentos se leen
   solo cuando la tarea los necesita, y por partes (con grep o por secciones).

## Al cerrar cada etapa o conversación
Actualiza docs/ESTADO.md, haz commit y push, y sube la misma versión al proyecto
como claude/ESTADO.md (también CLAUDE.md, como claude/CLAUDE.md, si cambió).

## Documentos que mandan
- docs/ESTADO.md — memoria entre conversaciones: estado, pendientes y comandos.
- docs/compatibilidad.md — qué capacidades usa la app y qué hace donde faltan.
- docs/requisitos.md — qué debe hacer el producto. Fuente de verdad del alcance.
  Se genera con herramientas/documentos/ (junto con la matriz): no se edita a mano.
- docs/interfaz.md — qué hay en cada pantalla y cómo se navega (C-06, aprobada).
- docs/roadmap.md — en qué orden se construye y cómo se valida cada etapa.
- docs/matriz-cumplimiento.md — criterio de aceptación de cada requisito. Es el contrato.
- docs/automatizacion.md — ciclo de iteración y paradas.
- CHANGELOG.md — qué cambió en cada versión.
- CREDITOS.md — origen y licencia de todo lo que no es nuestro.

## Decisiones vigentes
- Modo acelerado por bloques: F1–F3 sin parar salvo en las paradas, sesión con
  el móvil, F4–F6, sesión con la guitarra, F7.
- Audio (S-07): opción A, las muestras actuales alojadas en samples/ con
  licencia verificada y atribución.
- Móvil de referencia: iPhone.
- Explicaciones: un informe didáctico por fase en docs/iteraciones/.
- Despliegue de pruebas en GitHub Pages, sin anunciar, desde una rama propia,
  antes de la Sesión 1. La publicación oficial sigue en F7.1.
- Sin Android de pruebas por ahora: simulador de Chrome hasta tener uno.
- Service Worker en F6.2, no antes (20/10): en la Sesión 1 el iPhone usa la web
  con conexión.
- Agudo de la acústica (hasta 14 semitonos de transporte): limitación conocida
  aceptada (20/10).

## Reglas
1. Nunca trabajes en main. Una rama por etapa: auto/F<fase>.<etapa>-<tema>.
2. Una etapa está hecha cuando sus requisitos cumplen su criterio de aceptación
   y `node --test` está en verde.
3. Tras las pruebas, lanza auditor-requisitos y auditor-tecnico en paralelo.
   Corrige los hallazgos críticos y altos; anota los demás en la matriz.
   Máximo dos rondas de auditoría por etapa.
4. Todo cambio en requisitos.md va a su control de cambios y al informe de
   iteración, bajo «Cambios en requisitos». El cliente debe poder verlos todos.
5. Versión de la app: 0.<fase>.<corrección>. Actualiza APP_VERSION y CHANGELOG.md
   en cada entrega.
6. Commits en español, en infinitivo y con IDs: «F2.2: reproductor propio (S-01, S-04)».
7. Cada iteración deja docs/iteraciones/IT-nn.md: qué se hizo, por qué y qué
   concepto ilustra, para un principiante.
8. Para y pregunta en las paradas de docs/automatizacion.md §3. No publiques,
   no fusiones en main, no pagues, no borres historial sin aprobación explícita.
9. Cero dependencias nuevas sin justificarlo en el informe. La app y el banco de
   pruebas no instalan nada; las herramientas de herramientas/ pueden necesitar
   Python, y lo dicen en su cabecera.
10. Diseña para Windows, Android e iPhone a la vez (PL-04): solo estándares web,
    detecta capacidades y no sistemas, y anota cada capacidad nueva con su
    alternativa en docs/compatibilidad.md. El iPhone marca el mínimo.
11. Aprobación de fusiones: Pablo la da con palabras explícitas («fusiona el #N»).
    Un «ok» o «sigue» no basta para fusionar en main.

## Continuidad y ahorro de uso
Pablo tiene un límite de uso. Cada mensaje de una conversación larga vuelve a
procesar todo lo anterior, así que lo caro es la longitud de la conversación,
no los documentos en sí.
- Una conversación por etapa o por un par de días. Al cerrarla, actualiza
  docs/ESTADO.md (y súbelo al proyecto de claude.ai) para que la siguiente
  empiece desde ahí.
- Lee por partes. No vuelques diffs, registros ni documentos enteros al
  contexto si basta con un grep o con las líneas que fallan.
- Auditorías: ligeras y solo en los puntos de control (CP-n) o tras cambios de
  riesgo (audio, datos guardados, música). Cada auditor cuesta tanto como una
  conversación entera.
- Capturas de pantalla solo cuando cambie algo visual, y combinadas en una imagen.
- Los documentos del proyecto de claude.ai se suben al cerrar la etapa, no en
  cada versión.

