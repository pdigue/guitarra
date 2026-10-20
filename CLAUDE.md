# Trasteando — reglas del proyecto

PWA para aprender el mástil de la guitarra, practicar escalas y afinar.
Cliente: Pablo Díaz Guerra. Está aprendiendo a programar: explica, no solo hagas.
Idioma: español en todo (código comentado, commits, informes y respuestas).

## Documentos que mandan
- docs/compatibilidad.md — qué capacidades usa la app y qué hace donde faltan.
- docs/requisitos.md — qué debe hacer el producto. Fuente de verdad del alcance.
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
