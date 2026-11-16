# Trasteando — Estado para retomar

**Actualizado:** 15/11/2026, con la app en la `0.6.7` · lo mantiene la conversación que trabaja.
**Documentos:** requisitos v2.4 · matriz v2.4 · roadmap v4.4 (baseline 0.6.2; lo anterior, en `docs/historico/`)

> **Al empezar:** compara este archivo (GitHub) con `claude/ESTADO.md` del proyecto; si difieren, avisa a Pablo (manda GitHub). Las reglas están en `CLAUDE.md`. **Al terminar:** déjalo al día y acaba con «ESTADO actualizado: versión X, siguiente paso Y». Propón tú el cambio de conversación al cerrar el bloque.

## 1. Dónde estamos
- **Ramas:** `main` = `0.6.6` (`552b659`: el 15/11 se fusionaron los PR #18 a #21). `auto/F5.8-metronomo` = `0.6.7`, PR #22 abierto contra `main`, a falta de tu «fusiona el #22». `archivo/hasta-0.6.2` (472ff7a): salvavidas, no se borra nunca.
- **Web de pruebas:** https://pdigue.github.io/guitarra/ (rama `pruebas`, con la `0.6.7`).
- **Bloque F5.8 #7, Metrónomo: cerrado** (`0.6.7`, PR #22): se perdían golpes (solo 100 ms programados: un tirón de más de ~75 ms hacía saltar el siguiente) y la luz iba con el sonido calculado, no con el que sale. Ahora, 300 ms programados; los cambios y Parar retiran y rehacen lo apuntado; la luz y el péndulo, con `getOutputTimestamp()` o las latencias declaradas; osciladores soltados al acabar. MT-04 cambia (vuelve a «sin validar»). Medido: en el banco, 60 s a 250 ppm con tirones; en Chromium (`herramientas/medir-metronomo.js`), 10 de 63 golpes perdidos antes y 0 de 64 ahora. Auditorías ligeras AT-18 (un alto, corregido: dos cambios seguidos podían dejarlo mudo) y AR-19 (sin críticos ni altos; corregidos los medios). Falta tu prueba.
- **Bloque F5.8 #6, Acordes: cerrado y fusionado** (`0.6.6`, PR #21): se elige con dos filas, nota y tipo, con lo inexistente apagado y el bajo que dice su nota (AC-01); el mástil enseña en grande los trastes 0 a 5, sin pentagrama, zoom ni aviso para girar (AC-07); retirados AC-03 (pentagrama) y AC-06 (buscador); V-01 y P-03, precisados. Auditorías ligeras AT-17 y AR-18, sin críticos ni altos; corregidos el foco de teclado y la prueba del traste 5. `0.6.6`: arranca también en un marco aislado (la vista previa del chat dejaba el mástil vacío). Falta tu prueba.
- **Bloque F5.8 #5, Escalas: cerrado y fusionado** (`0.6.4`, PR #20): una posición cada vez (E-07: 3 notas por cuerda, 2 en pentatónicas; la 1 en la tónica), «Escuchar» (E-08), tocar la escala (E-09), «Todas» (E-10) y Practicar en orden (E-05b); E-05 retirado (estado nuevo en el generador). Auditorías ligeras AT-16 y AR-17, sin críticos; lo alto de AR-17 eran decisiones de Pablo, respondidas el 15/11. Falta la prueba de Pablo.
- **Después, una conversación por bloque:** propuestas (#8, cuando digas cuáles), F5.9 (cierre, etiqueta `v0.5.x`) y retomar F6.2 (`auto/F6.2-service-worker`, `7692bc5`: código hecho, faltan documentos, auditoría y PR).
- **Hecho en F5.8:** #1 péndulo (MT-06, `0.6.1`); #2 afinador que sigue la nota y abre en Micrófono, y pantalla encendida (A-02, A-03, G-13, `0.6.2`). #3 y #4 aspecto: temas (V-10), tableta (V-11), pistas grandes en Adivinar (J-01, J-06), `0.6.3`. Todos, a falta de la prueba de Pablo.

## 2. Pendiente de Pablo (no bloquea)
1. Probar la `0.6.2` en el iPhone: V-09 pasos M0, M2b, M5 y M8b (afinador con la guitarra; pantalla encendida con bloqueo a 30 s). Y la prueba de 10 minutos con la guitarra (V-09); después, crear la etiqueta `v0.4.x` en GitHub (el agente no puede: 403).
2. Decir qué propuestas de #8 aprueba (afinador cromático, Adivinar por niveles, reto inverso, rasgueo, arpegio y favoritos).
3. Péndulo (AR-14 #2, #8): 13° en horizontal o varilla más corta; con el teclado, ↑ sube el tempo o la pesa.
4. Afinador (AR-15 #8): si elige De oído se recuerda; ¿prefiere que abra siempre en Micrófono?
5. Git: proteger `main` en GitHub (Settings → Rules: PR obligatorio, sin *force push* ni borrado); y, solo con su «sí», borrar las 22 ramas `auto/…` ya fusionadas (las 19 de antes, más `saneamiento`, `aspecto` y `escalas`).
6. Pegar el texto nuevo de las instrucciones del proyecto (dado el 15/11).
7. Probar la `0.6.3` en el iPhone (temas, Adivinar) y en un iPad, y confirmar el mástil acotado en tableta (AR-16 #7; de momento se da por bueno). La nota tocada en pequeño en Adivinar: aprobada el 15/11.
8. Probar Escalas (`0.6.4`) en el iPhone: posiciones, «Escuchar» (380 ms por nota), «Todas» y Practicar.
9. Probar Acordes (`0.6.6`) en el iPhone, el iPad y el ordenador; decir si echa de menos los «Populares» (AR-18 #4).
10. Probar el metrónomo (`0.6.7`) en el iPhone: un minuto a 120 y otro a 250 ppm, con el altavoz y con auriculares Bluetooth, en Metrónomo y también sonando en Libre. Superada si no hay ningún hueco y la luz y el péndulo van con el clic. Después, decidir (AR-19): si con Bluetooth la luz sigue adelantada, ¿un ajuste manual de retraso?; si aún hay huecos, ¿subir el adelanto a 0,5 s? Y aprobar el PR #22 con «fusiona el #22».

## 3. Cómo se trabaja
- **Banco:** `node --test` en verde (unos 2 min). Las pruebas que arrancan la app se pasan dos veces (varios archivos y autónomo, `tests/autonomo.test.js`); un archivo nuevo que arranque la app se añade allí. Sueltas: `node --test-name-pattern="texto" tests/banco.test.js`. `tests/documentos.test.js`: baseline y versiones.
- **Autónomo:** tras tocar `js/`, `css/` o `index.html`, `python3 herramientas/generar-autonomo.py`.
- **Navegador** (solo lo que toque lo cambiado; salida a /tmp): `comprobar-disposicion.js <salida>`, `comprobar-accesibilidad.js`, `comprobar-en-navegador.js <repo absoluto> index.html <salida>`, `comprobar-autonomo.js dist/trasteando.html <salida>`, `comprobar-afinador.js <salida>`. Scripts sueltos con Playwright: `NODE_PATH=/opt/npm-tools/node_modules`.
- **Requisitos y matriz:** se cambian en `herramientas/documentos/generar-requisitos.py` (y `generar-matriz.py` para criterios) y se regeneran (órdenes en su cabecera). Cada versión del documento va a `CAMBIOS` con la lista de ID que cambian; las versiones de los documentos, en `DOC_V`, `APP_V`, `ROADMAP_V` y `MATRIZ_V`.
- **Versión:** `APP_VERSION` en `js/01-teoria.js` y los `?v=` de `index.html`; en cada versión, CHANGELOG y ESTADO.
- **Git:** PR y fusiones con `gh api repos/pdigue/guitarra/pulls …` (sin GraphQL). Tras cada PR, `git push origin HEAD:pruebas`; si no avanza (tras fusionar en `main` va por otra línea), sin forzar: `git fetch --depth=30 origin +refs/heads/pruebas:refs/remotes/origin/pruebas`, un commit con `git commit-tree HEAD^{tree} -p origin/pruebas -p HEAD` y subirlo a `pruebas`.
- **Trampas:** no usar `pkill -f "node --test"` ni `rev`. Arrays de la app: `JSON.parse(A.ev('JSON.stringify(...)'))`. Un metrónomo arrancado en una prueba se para en `t.after`.

## 4. Decisiones recientes
- **15/11 · Metrónomo (F5.8 #7):** 300 ms programados por adelantado y rehacer lo apuntado al cambiar algo (en vez de esperar a que se agote); lo que se ve, con lo que se oye.
- **15/11 · Acordes (F5.8 #6):** el mástil de la app acotado a los trastes 0 a 5 y grande (no un diagrama de cancionero), sin pentagrama; elegir por nota y tipo, sin buscador ni listado. Aceptada la anchura de los trastes en el ordenador, sin tope (AR-18 #3).
- **15/11 · Fusiones:** #18, #19 y #20 a `main` (cada PR, cambiado antes a `main` como destino), para no alargar la cadena de ramas.
- **15/11 · Escalas (F5.8 #5):** 3 notas por cuerda (2 en pentatónicas), la 1 en la tónica, «Escuchar» a ritmo fijo; recuperar «Todas» y una Práctica sencilla. Aprobada la nota tocada en pequeño (AR-16 #8).
- **15/11 · Cambio de paradigma para gastar menos:** baseline 0.6.2 (requisitos y matriz v2.0, roadmap v4.0, CHANGELOG desde la 0.6.0, histórico aparte); auditoría técnica ligera una vez por bloque y de requisitos solo si cambian; documentos de cierre al cerrar el bloque; en claude.ai solo ESTADO y CLAUDE; una conversación por bloque.
- **12/11:** antes de seguir con las fases, sus comentarios (#2 a #8); F6.2 en pausa. Aspecto: temas elegibles. Escalas: las 4, mejor presentadas. Pantalla encendida: sí (G-13).
- **22/10:** péndulo con la pesa arriba más lenta; F5 queda abierta (F5.8 y F5.9).

## 5. Para abrir la siguiente conversación
Dentro del proyecto «APP GUITARRA»: **«Lee ESTADO y sigue.»** Detrás, lo que quiera Pablo ese día (aprobaciones como «fusiona el #18», comentarios, peticiones). **Siguiente paso:** tras tu «fusiona el #22», F5.8 #8, las propuestas que apruebes (o retomar F6.2 si prefieres), en una conversación nueva y en una rama creada desde `main`.
