# Trasteando — Estado para retomar

**Actualizado:** 17/11/2026, con la app en la `0.6.16` · lo mantiene la conversación que trabaja.
**Documentos:** requisitos v2.13 · matriz v2.13 · roadmap v4.11 (baseline 0.6.2; lo anterior, en `docs/historico/`)

> **Al empezar:** compara este archivo (GitHub) con `claude/ESTADO.md` del proyecto; si difieren, avisa a Pablo (manda GitHub). Las reglas están en `CLAUDE.md`. **Al terminar:** déjalo al día y acaba con «ESTADO actualizado: versión X, siguiente paso Y». Propón tú el cambio de conversación al cerrar el bloque.

## 1. Dónde estamos
- **Ramas:** `main` = `0.6.15` (el 17/11 se fusionaron el #26 y el #27). `auto/F5.8-decisiones` (PR #29) = `0.6.16`, y arrastra el ESTADO del #28 (el #28 se puede cerrar sin fusionar, o fusionarlo antes). `archivo/hasta-0.6.2` (472ff7a): salvavidas, no se borra nunca.
- **Web de pruebas:** https://pdigue.github.io/guitarra/ (rama `pruebas`, con la `0.6.16`).
- **Bloque F5.8 #11, tus decisiones del 17/11: cerrado, a falta de tu aprobación** (PR #29, `0.6.16`, banco 242 de 242). **Partitura, tema de fábrica** (también en el `<html>`, la barra del sistema y el manifiesto: en Android el arranque sale color papel); `00-aspecto.js` pone tema, esquema y color de la barra antes de pintar. **Afinador, siempre en Micrófono** al abrir (De oído vale en la sesión; se borra `tunerPick`). **Metrónomo en horizontal en dos bloques**: barra a la izquierda con 30° (se acorta con `cqw` si la columna es estrecha; de 195 a 342 px), el resto a la derecha como en vertical, letras algo menores; se desplaza si no cabe. Requisitos y matriz v2.13 (G-04, A-02, MT-01, MT-06, V-10), roadmap v4.11, interfaz v1.24, compatibilidad v1.18 (`cqw`). Auditorías AT-24 y AR-25 sin críticos; altos corregidos (la lista de modificados de requisitos salía mal: prueba nueva) o resueltos con tu captura (la hora se lee sobre Partitura en el iPhone instalado). Informe IT-14.
- **Hecho y fusionado desde el 15/11** (detalle en CHANGELOG): F5.8 #5 Escalas (`0.6.4`), #6 Acordes (`0.6.6`), #7 Metrónomo (`0.6.7`), #9 pistas (`0.6.11`), #10 controles a la vista (`0.6.12` y `0.6.13`); F6.2 Service Worker (`0.6.8`), F6.3 instalable (`0.6.9`), F6.4 privacidad, licencia y créditos (`0.6.14` y `0.6.15`). Antes: #1 péndulo (`0.6.1`), #2 afinador (`0.6.2`), #3 y #4 aspecto (`0.6.3`).
- **Siguiente:** F6 hecha a falta de su cierre (CP-6, auditoría a fondo antes de publicar). F5.9 (cierre de F5, etiqueta `v0.5.x`), cuando hayas probado F5.8 en el móvil. Propuestas (#8), en espera.

## 2. Pendiente de Pablo (no bloquea)
**Decisiones**
1. **Contacto de privacidad:** decidido un correo dedicado (17/11); falta que lo crees y me des la dirección, para ponerla en `privacidad.html` antes de F7.1 (AR-24 #5).
2. Metrónomo con el teclado (AR-14 #8): ¿↑ sube el tempo (como ahora, provisional) o sube la pesa?
3. Metrónomo, tras tu prueba (AR-19): si con Bluetooth la luz va adelantada, ¿un ajuste manual de retraso?; si hay huecos, ¿adelanto de 0,5 s?
4. Propuestas de #8 (afinador cromático, Adivinar por niveles, reto inverso, rasgueo, arpegio y favoritos): cuáles, cuando quieras.

**GitHub (el agente no puede: 403)**
5. Proteger `main` (Settings → Rules: PR obligatorio, sin *force push* ni borrado); desactivar los *issues*; crear la etiqueta `v0.4.x` tras la prueba de V-09. Y, solo con tu «sí», el agente borra las ramas `auto/…` ya fusionadas (unas 30).

**Pruebas en el móvil** (todas sobre la web de pruebas, ya con la `0.6.16`; se juntarán en una lista única)
6. Afinador con la guitarra y pantalla encendida (V-09 M0, M2b, M5, M8b) y la prueba de 10 minutos (V-09).
7. Temas y Adivinar en el iPhone y un iPad; mástil acotado en tableta (AR-16 #7). Con la `0.6.16`: si sigues viendo Madera, es lo guardado (Ajustes › Aspecto o «Restablecer»).
8. Escalas (`0.6.4`): posiciones, «Escuchar», «Todas» y Practicar. Acordes (`0.6.6`) en iPhone, iPad y ordenador.
9. Metrónomo: un minuto a 120 y otro a 250 ppm, con altavoz y con Bluetooth, en Metrónomo y sonando en Libre; y en horizontal, la barra a la izquierda con el mismo giro que en vertical (`0.6.16`).
10. Sin conexión (`0.6.8`): abrir con red, modo avión, cerrar y volver a abrir, también desde el icono. Instalar (`0.6.9`): icono nuevo y sin barras; si ya estaba, borrarlo y volver a añadirlo.
11. Pistas y controles (`0.6.11` y `0.6.12`): vertical y horizontal, los dos idiomas, fallo con las dos pistas y una nota en 4 cuerdas o más; «Restablecer» y contar trastes en horizontal (11 en tu Pro Max).
12. F6.4: leer `LICENSE` y `privacidad.html` (no soy abogado); Ajustes → Acerca de → «Política de privacidad», volver, y lo mismo en modo avión.
13. Afinador (`0.6.16`): elegir De oído, cerrar la app del todo y abrirla: debe salir Micrófono.

## 3. Cómo se trabaja
- **Banco:** `node --test` en verde (unos 2 min). Las pruebas que arrancan la app se pasan dos veces (varios archivos y autónomo, `tests/autonomo.test.js`); un archivo nuevo que arranque la app se añade allí. Sueltas: `node --test-name-pattern="texto" tests/banco.test.js`. `tests/documentos.test.js`: baseline y versiones.
- **Autónomo:** tras tocar `js/`, `css/` o `index.html`, `python3 herramientas/generar-autonomo.py`.
- **Navegador** (solo lo que toque lo cambiado; salida a /tmp): `comprobar-disposicion.js <salida>`, `comprobar-accesibilidad.js`, `comprobar-en-navegador.js <repo absoluto> index.html <salida>`, `comprobar-autonomo.js dist/trasteando.html <salida>`, `comprobar-afinador.js <salida>`. Scripts sueltos con Playwright: `NODE_PATH=/opt/npm-tools/node_modules`.
- **Requisitos y matriz:** se cambian en `herramientas/documentos/generar-requisitos.py` (y `generar-matriz.py` para criterios) y se regeneran (órdenes en su cabecera). Cada versión del documento va a `CAMBIOS` con la lista de ID que cambian; las versiones de los documentos, en `DOC_V`, `APP_V`, `ROADMAP_V` y `MATRIZ_V`.
- **Versión:** `APP_VERSION` en `js/01-teoria.js`, `VERSION` en `sw.js` y los `?v=` de `index.html`; en cada versión, CHANGELOG y ESTADO.
- **Git:** PR y fusiones con `gh api repos/pdigue/guitarra/pulls …` (sin GraphQL). Tras cada PR, `git push origin HEAD:pruebas`; si no avanza (tras fusionar en `main` va por otra línea), sin forzar: `git fetch --depth=30 origin +refs/heads/pruebas:refs/remotes/origin/pruebas`, un commit con `git commit-tree HEAD^{tree} -p origin/pruebas -p HEAD` y subirlo a `pruebas`.
- **Trampas:** no usar `pkill -f "node --test"` ni `rev`. Arrays de la app: `JSON.parse(A.ev('JSON.stringify(...)'))`. Un metrónomo arrancado en una prueba se para en `t.after`.

## 4. Decisiones recientes
- **17/11 · Barrido de puntos abiertos (F5.8 #11):** contacto de privacidad, un correo dedicado; pantalla de la app instalada, como ahora (`standalone`); Partitura de fábrica (y el arranque de Android, color papel); sin aviso de «lista sin conexión»; afinador siempre en Micrófono; sin «Populares» en Acordes; metrónomo en horizontal en dos bloques, con tus fotos (barra a la izquierda, mismo giro, letras algo menores).
- **17/11:** fusionados el #26 (F5.8 #10) y el #27 (F6.4), a petición tuya en la misma conversación.
- **17/11 · F6.4:** el aviso para girar, fuera siempre (no solo con pistas); y sin decir que en horizontal se ven más trastes (AR-24 #13: «el usuario ya probará y se dará cuenta»); la política, en la misma ventana (AT-23 A1).
- **17/11 · Respuestas a AR-23 y F6.4:** V-12 sí; con pistas, sin aviso para girar; zoom de inicio con trastes de 40 px o más (en el 15 Pro, 9); pistas algo más pequeñas (26 px, `0.6.13`); lo de F6.4, en §2. Idea para después de la 1.0: cuentas de usuario y ranking con amigos (roadmap §6).
- **16/11 · F5.8 #10:** J-14 nuevo (AR-22 #5: «ok, crea el J-14»); al fallar, solo «¡Prueba otra vez!» / «Try again!»; hecho como bloque aparte de F6.4, con su rama y su PR.
- **16/11:** fusionados el #24 (F6.3) y el #25 (F5.8 #9), a petición tuya en la misma conversación.
- **16/11 · Pistas (F5.8 #9):** en una sola línea en los dos idiomas, sin bajar de 20 px, quitándole mástil al horizontal de Adivinar (panel de 204 px); frase del reto corta: «Pulsa ▶, escucha y encuéntrala».
- **16/11 · F6.3:** un único dibujo para todos los iconos (`iconos/icono.svg`), con 6 cuerdas en vez de 5; el autónomo, sin manifiesto (desde el disco no se instala).
- **16/11:** fusionado el #23 (F6.2), a petición tuya en la misma conversación.
- **16/11 · Arranque:** el mensaje para abrir conversación pide también conectar el repositorio con permiso de escritura (§5).
- **16/11 · F6.2:** la rama vieja se pone al día fusionando `main` dentro (no se reescribe: no hace falta *force push*); versión `0.6.8`.
- **16/11:** fusionado el #22 sin la prueba en el móvil (las pruebas no bloquean; lo que salga, en una versión siguiente). Propuestas (#8) en espera; siguiente bloque, F6.2.
- **15/11 · Metrónomo (F5.8 #7):** 300 ms programados por adelantado y rehacer lo apuntado al cambiar algo (en vez de esperar a que se agote); lo que se ve, con lo que se oye.
- **15/11 · Acordes (F5.8 #6):** el mástil de la app acotado a los trastes 0 a 5 y grande (no un diagrama de cancionero), sin pentagrama; elegir por nota y tipo, sin buscador ni listado. Aceptada la anchura de los trastes en el ordenador, sin tope (AR-18 #3).
- **15/11 · Fusiones:** #18, #19, #20 y #21 a `main` (cada PR, cambiado antes a `main` como destino), para no alargar la cadena de ramas.
- **15/11 · Escalas (F5.8 #5):** 3 notas por cuerda (2 en pentatónicas), la 1 en la tónica, «Escuchar» a ritmo fijo; recuperar «Todas» y una Práctica sencilla. Aprobada la nota tocada en pequeño (AR-16 #8).
- **15/11 · Cambio de paradigma para gastar menos:** baseline 0.6.2 (requisitos y matriz v2.0, roadmap v4.0, CHANGELOG desde la 0.6.0, histórico aparte); auditoría técnica ligera una vez por bloque y de requisitos solo si cambian; documentos de cierre al cerrar el bloque; en claude.ai solo ESTADO y CLAUDE; una conversación por bloque.
- **12/11:** antes de seguir con las fases, sus comentarios (#2 a #8); F6.2 en pausa. Aspecto: temas elegibles. Escalas: las 4, mejor presentadas. Pantalla encendida: sí (G-13).
- **22/10:** péndulo con la pesa arriba más lenta; F5 queda abierta (F5.8 y F5.9).

## 5. Para abrir la siguiente conversación
Dentro del proyecto «APP GUITARRA»: **«Lee ESTADO y sigue. Conecta el repositorio con permiso de escritura.»** (decisión del 16/11: sin pedirlo así, el control de la sesión puede negar la escritura). Detrás, lo que quieras ese día: «fusiona el #29» (lleva también el ESTADO del #28), comentarios o peticiones. **Siguiente paso:** el ESTADO vigente está en `auto/F5.8-decisiones`; después, CP-6 (cierre de F6), la lista única de pruebas en el móvil, F5.9 cuando hayas probado, o las propuestas de #8.
