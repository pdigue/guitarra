# Trasteando — Estado para retomar

**Actualizado:** 15/11/2026, con la app en la `0.6.4` · lo mantiene la conversación que trabaja.
**Documentos:** requisitos v2.2 · matriz v2.2 · roadmap v4.2 (baseline 0.6.2; lo anterior, en `docs/historico/`)

> **Al empezar:** compara este archivo (GitHub) con `claude/ESTADO.md` del proyecto; si difieren, avisa a Pablo (manda GitHub). Las reglas están en `CLAUDE.md`. **Al terminar:** déjalo al día y acaba con «ESTADO actualizado: versión X, siguiente paso Y». Propón tú el cambio de conversación al cerrar el bloque.

## 1. Dónde estamos
- **Ramas:** `main` = `0.6.0`. `auto/F5.8-saneamiento` = `0.6.2` (PR #18: péndulo #1 y afinador #2, espera «fusiona el #18»). `auto/F5.8-aspecto` = `0.6.3` (PR #19, contra la anterior: baseline y F5.8 #3 y #4). `auto/F5.8-escalas` = `0.6.4` (PR #20, contra la anterior: F5.8 #5). `archivo/hasta-0.6.2` (472ff7a): salvavidas, no se borra nunca.
- **Web de pruebas:** https://pdigue.github.io/guitarra/ (rama `pruebas`, con la `0.6.4`).
- **Bloque F5.8 #5, Escalas: cerrado** (`0.6.4`, PR #20): una posición cada vez (E-07: 3 notas por cuerda en mayor y menor, 7 posiciones; 2 en las pentatónicas, 5 cajas; ◀ ▶ y la vista va sola), «Escuchar» (E-08), sin modo Práctica (E-05 pasa a «tocar la posición»); E-03, E-04, E-06 y P-03 adaptados. Auditorías ligeras AT-16 y AR-17. Falta la prueba de Pablo.
- **Después, una conversación por bloque:** Acordes (#6), metrónomo (#7: pulso irregular y desfase; sospechosos, 100 ms programados y `outputLatency`), propuestas (#8), F5.9 (cierre, etiqueta `v0.5.x`) y retomar F6.2 (`auto/F6.2-service-worker`, `7692bc5`: código hecho, faltan documentos, auditoría y PR).
- **Hecho en F5.8:** #1 péndulo (MT-06, `0.6.1`); #2 afinador que sigue la nota y abre en Micrófono, y pantalla encendida (A-02, A-03, G-13, `0.6.2`). #3 y #4 aspecto: temas (V-10), tableta (V-11), pistas grandes en Adivinar (J-01, J-06), `0.6.3`. Todos, a falta de la prueba de Pablo.

## 2. Pendiente de Pablo (no bloquea)
1. Probar la `0.6.2` en el iPhone: V-09 pasos M0, M2b, M5 y M8b (afinador con la guitarra; pantalla encendida con bloqueo a 30 s). Y la prueba de 10 minutos con la guitarra (V-09); después, crear la etiqueta `v0.4.x` en GitHub (el agente no puede: 403).
2. Decir qué propuestas de #8 aprueba (afinador cromático, Adivinar por niveles, reto inverso, rasgueo, arpegio y favoritos).
3. Péndulo (AR-14 #2, #8): 13° en horizontal o varilla más corta; con el teclado, ↑ sube el tempo o la pesa.
4. Afinador (AR-15 #8): si elige De oído se recuerda; ¿prefiere que abra siempre en Micrófono?
5. Git: proteger `main` en GitHub (Settings → Rules: PR obligatorio, sin *force push* ni borrado); y, solo con su «sí», borrar las 19 ramas `auto/…` ya fusionadas.
6. Pegar el texto nuevo de las instrucciones del proyecto (dado el 15/11).
7. Probar la `0.6.3` en el iPhone (temas, Adivinar) y en un iPad, y confirmar el mástil acotado en tableta (AR-16 #7; de momento se da por bueno). La nota tocada en pequeño en Adivinar: aprobada el 15/11.
8. Probar Escalas (`0.6.4`) en el iPhone: posiciones, «Escuchar» (una nota cada 380 ms: ¿rápido o lento?) y si echa de menos ver todo el mástil.

## 3. Cómo se trabaja
- **Banco:** `node --test` en verde (unos 2 min). Las pruebas que arrancan la app se pasan dos veces (varios archivos y autónomo, `tests/autonomo.test.js`); un archivo nuevo que arranque la app se añade allí. Sueltas: `node --test-name-pattern="texto" tests/banco.test.js`. `tests/documentos.test.js`: baseline y versiones.
- **Autónomo:** tras tocar `js/`, `css/` o `index.html`, `python3 herramientas/generar-autonomo.py`.
- **Navegador** (solo lo que toque lo cambiado; salida a /tmp): `comprobar-disposicion.js <salida>`, `comprobar-accesibilidad.js`, `comprobar-en-navegador.js <repo absoluto> index.html <salida>`, `comprobar-autonomo.js dist/trasteando.html <salida>`, `comprobar-afinador.js <salida>`. Scripts sueltos con Playwright: `NODE_PATH=/opt/npm-tools/node_modules`.
- **Requisitos y matriz:** se cambian en `herramientas/documentos/generar-requisitos.py` (y `generar-matriz.py` para criterios) y se regeneran (órdenes en su cabecera). Cada versión del documento va a `CAMBIOS` con la lista de ID que cambian; las versiones de los documentos, en `DOC_V`, `APP_V`, `ROADMAP_V` y `MATRIZ_V`.
- **Versión:** `APP_VERSION` en `js/01-teoria.js` y los `?v=` de `index.html`; en cada versión, CHANGELOG y ESTADO.
- **Git:** PR y fusiones con `gh api repos/pdigue/guitarra/pulls …` (sin GraphQL). Tras cada PR, `git push origin HEAD:pruebas`.
- **Trampas:** no usar `pkill -f "node --test"` ni `rev`. Arrays de la app: `JSON.parse(A.ev('JSON.stringify(...)'))`. Un metrónomo arrancado en una prueba se para en `t.after`.

## 4. Decisiones recientes
- **15/11 · Escalas (F5.8 #5):** posiciones de 3 notas por cuerda (2 en pentatónicas), calculadas con alturas; sin Práctica. Aprobada la nota tocada en pequeño (AR-16 #8).
- **15/11 · Cambio de paradigma para gastar menos:** baseline 0.6.2 (requisitos y matriz v2.0, roadmap v4.0, CHANGELOG desde la 0.6.0, histórico aparte); auditoría técnica ligera una vez por bloque y de requisitos solo si cambian; documentos de cierre al cerrar el bloque; en claude.ai solo ESTADO y CLAUDE; una conversación por bloque.
- **12/11:** antes de seguir con las fases, sus comentarios (#2 a #8); F6.2 en pausa. Aspecto: temas elegibles. Escalas: las 4, mejor presentadas. Pantalla encendida: sí (G-13).
- **22/10:** péndulo con la pesa arriba más lenta; F5 queda abierta (F5.8 y F5.9).

## 5. Para abrir la siguiente conversación
Dentro del proyecto «APP GUITARRA»: **«Lee ESTADO y sigue.»** Detrás, lo que quiera Pablo ese día (aprobaciones como «fusiona el #18», comentarios, peticiones). **Siguiente paso:** F5.8 #6, Acordes, en una conversación nueva (rama nueva desde `auto/F5.8-escalas`).
