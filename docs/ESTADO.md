# Trasteando — Estado para retomar

**Actualizado:** 22/10/2026, con la app en la `0.6.1` · **Lo mantiene:** la conversación que trabaja, sin que Pablo tenga que vigilarlo.

> **Para la conversación que lee esto**
> 1. **Al empezar:** este es el original (`docs/ESTADO.md`, en GitHub) o su copia en el proyecto de claude.ai (`claude/ESTADO.md`). Lee los dos y compáralos: deben ser idénticos. Si difieren, díselo a Pablo antes de seguir; manda el de GitHub. Lee también `CLAUDE.md` del repositorio: son las reglas.
> 2. **Mientras trabajas:** actualiza este archivo en cada versión nueva de la app (en el mismo commit que sube `APP_VERSION`; una prueba del banco falla si no), tras cada fusión en `main` o decisión de Pablo, y cuando cambien sus pendientes. Cada vez, sube la misma versión al proyecto como `claude/ESTADO.md`.
> 3. **Al terminar:** déjalo al día y acaba tu último mensaje con la línea «ESTADO actualizado: versión X, siguiente paso Y».
> 4. **Propón tú el cambio de conversación** (Pablo no tiene que pedirlo) al cerrar una etapa, tras un par de días o si la conversación se ha resumido sola por larga: avísale, deja esto al día y recuérdale el mensaje de arranque de la sección 5. Si cambia la forma de trabajar, dale el texto nuevo de las instrucciones del proyecto.
>
> Con este archivo y `CLAUDE.md` basta para seguir; el resto de documentos se leen solo cuando la tarea los necesita, y por partes.

## 1. Dónde estamos

- **App:** `0.6.1`, en la rama `auto/F5.8-saneamiento` (PR en §1, «PR abiertos»), que sale de `main` (`0.6.0`, desde el 22/10 con los PR #16 y #17). La rama `auto/F6.2-service-worker` solo lleva la actualización de ESTADO tras esas fusiones, y está contenida en la de F5.8.
- **Web de pruebas:** https://pdigue.github.io/guitarra/ (rama `pruebas`, igual que `main`, con la `0.6.0`).
- **Fase F5 · Escalas, metrónomo y acordes:**
  - Hechas F5.1 a F5.7: escalas, ♯/♭ por nota, reintentar por defecto, metrónomo y acordes. Desde la v3.22 del roadmap, F5.2, F5.3, F5.6 y F5.7 están en 🔨 (como F5.4) hasta las pruebas de Pablo.
  - **F5.8 · saneamiento** (cómo se ve Adivinar y una vuelta a Escalas), **en curso comentario a comentario** (regla de AR-12 #6: cada comentario con su número; lo nuevo, como requisito nuevo):
    - **#1 hecho** (22/10, `0.6.1`): la barra del metrónomo es un **péndulo** (MT-06, nuevo). Con la pesa arriba va más lento, como en uno mecánico (decisión de Pablo); sonando, llega a un extremo en cada pulso, hasta 30° a cada lado (unos 13° con el iPhone en horizontal, para no salirse); recto parado, al arrastrarlo y con «reducir movimiento». El ángulo sale del reloj de audio. Verificado parcialmente hasta la Sesión 2.
    - Esperan más comentarios suyos (Adivinar, Escalas).
  - **CP-5 hecho** (22/10, `0.5.7`): auditorías a fondo AR-12 y AT-11, sin críticos. Tres altos: el metrónomo no arrancaba con el audio en pausa en el iPhone (corregido); dos varas para verificar (corregido, una sola: lo que espera la prueba de Pablo queda *verificado parcialmente*); y el bloqueo automático del iPhone para el metrónomo (**decisión de Pablo**, ver §2). Los medios y bajos, en el comentario de cada requisito de la matriz; casi todos encajan en F5.8.
  - **F5 queda abierta** (decisión de Pablo, 22/10), como F4 con F4.3: F5.8 y F5.9 (cierre con la etiqueta `v0.5.x`) esperan sus comentarios.
- **Fase F6 · Preparación para distribución** (en curso): F6.1 archivo autónomo (G-08), F6.2 Service Worker (G-03), F6.3 manifiesto e iconos (G-04) y F6.4 documentación pública y legal (G-06, G-11; la licencia del código la decide Pablo).
  - **F6.1 hecha** (22/10, `0.6.0`): las pruebas que arrancan la app (`banco.test.js` y `escalas.test.js`) se pasan dos veces, contra la app de varios archivos y contra el autónomo (`tests/autonomo.test.js`); el autónomo lee de dentro sus 17 grabaciones sin descargar nada; cada módulo incrustado lleva su nombre (`//# sourceURL`), un error dice el módulo y la línea exactos, y el ensamblador se niega a incrustar uno con `</script` o `<!--`. G-08 cumple y queda validado por el banco. Auditorías ligeras AR-13 y AT-12: sin críticos ni altos, una ronda; anotado en G-08 reconfirmarlo contra la web publicada en F7.1 y abrir el autónomo con doble clic en Windows en la Sesión 2.
- **PR abiertos:** F5.8 #1 (`0.6.1`), contra `main` (número en el mensaje de cierre y aquí en cuanto exista).
- **Fusionados** el 22/10, con su aprobación:
  - «Fusiona el #14 y el #15»: **#14**, metrónomo (`0.5.4`), y **#15**, acordes y correcciones de AT-10 y AR-11 (`0.5.5` y `0.5.6`), con su base cambiada antes a `main`;
  - «fusiona 16 y 17»: **#16**, CP-5 (`0.5.7`), y **#17**, F6.1 (`0.6.0`), con su base cambiada antes a `main`. El banco pasó 156 de 156 sobre el resultado de la fusión antes de hacerla.
- **Documentos:**
  - requisitos v1.26 (110 requisitos, 53 validados), matriz v1.24, roadmap v3.24;
  - interfaz v1.14, compatibilidad v1.7, IT-03 (F5, con F5.8) e IT-04 (F6, crece con cada etapa);
  - últimas auditorías: AR-13 y AT-12 (F6.1, ligeras); a fondo, AR-12 y AT-11 (CP-5).

## 2. Pendiente de Pablo (no bloquea)

1. **Decidir AR-12 #2** (no bloquea; el 22/10 prefirió avanzar sin decidirlo aún): si nadie toca la pantalla, el iPhone se bloquea solo y el metrónomo se para. Propuesta: mantener la pantalla encendida mientras suena, con Screen Wake Lock (detectando si existe) y, donde falte, un aviso para quitar el bloqueo automático; anotado en `compatibilidad.md` y con criterio de 5 minutos sin tocar la pantalla. Es una capacidad nueva: sin su «sí», no se hace.
2. Sus comentarios de uso para F5.8 (no bloquean: F5 queda abierta mientras tanto).
3. La prueba de 10 minutos con la guitarra (protocolo en `docs/verificaciones/V-09-F4-afinador.md`). Después, crear la etiqueta `v0.4.x` en la web de GitHub: el agente no puede crear etiquetas ni releases (error 403).
4. Revisión de git del 22/10 (todo sano; copia completa en un *bundle*, enviada a Pablo y restaurada con el banco en 80 de 80). Quedan dos decisiones suyas:
   - **Proteger `main`** en GitHub (Settings → Rules): exigir pull request e impedir *force push* y borrado, sin pedir aprobaciones (no puede aprobar sus propios PR). `docs/automatizacion.md` cuenta con esa protección, pero no está activa. Lo hace él en la web.
   - **Borrar las 19 ramas `auto/…` ya fusionadas** (de `auto/F1-iteracion-0` a `auto/F5.7-acordes`, más `auto/CP-5-correcciones` y `auto/F6.1-autonomo`; `auto/F5.8-saneamiento` se queda para F5.8). No se pierde nada: todos sus commits están en `main` (y los anteriores al 22/10, también en el *bundle*). Solo con su «sí» explícito.

## 3. Cómo se trabaja (lo práctico)

**Comprobaciones:**
- **Banco:** `node --test`, que debe dar 162 de 162 (unos 2 minutos). Cada prueba usa `tests/dom-minimo.js`. Desde la `0.6.0` se pasa dos veces: primero cada archivo contra la app de varios archivos, y luego `tests/autonomo.test.js` repite `banco.test.js` y `escalas.test.js` contra el autónomo, con «[autónomo]» delante de cada nombre. `test` y `unaVez` vienen de `tests/dom-minimo.js`: lo que lee el repositorio o compara las dos formas usa `unaVez` y solo corre en la primera pasada. Un archivo de pruebas nuevo que arranque la app tiene que añadirse a `autonomo.test.js` (una prueba lo vigila).
- **Pruebas sueltas:** `node --test-name-pattern="texto" tests/banco.test.js` (o `tests/autonomo.test.js` para la del autónomo).
- **Archivo autónomo:** tras cada cambio en `js/`, `css/` o `index.html`, regenerarlo con `python3 herramientas/generar-autonomo.py`. Si no, falla «el archivo autónomo está al día». Si un módulo contiene `</script`, el generador se para y lo dice.
- **En Chromium**, con la salida siempre en la carpeta temporal de la conversación (`comprobar-autonomo.js` comprueba también que un error dentro del autónomo dice su módulo y su línea):
  - `node herramientas/comprobar-disposicion.js <salida>` (con `IDIOMA=en-US`, en inglés);
  - `node herramientas/comprobar-accesibilidad.js`;
  - `node herramientas/comprobar-en-navegador.js <repo> index.html <salida>`, con `<repo>` como ruta **absoluta** (con `.` su servidor da 404 y falla esperando `#gate-btn`);
  - `node herramientas/comprobar-autonomo.js dist/trasteando.html <salida>`.

**Requisitos y matriz:** se **generan**, no se editan a mano. La fuente es `herramientas/documentos/generar-requisitos.py`; las instrucciones están en su cabecera.

**Versiones:**
- `APP_VERSION` está en `js/01-teoria.js`, y los `?v=` de `index.html` deben coincidir con ella.
- Cada versión lleva su entrada en `CHANGELOG.md`.

**Git:**
- Una rama por etapa (`auto/F6.x-tema`).
- Los PR y las fusiones se hacen con la API REST: `gh api repos/pdigue/guitarra/pulls ...`. GraphQL no está disponible.
- Tras cada PR, `git push origin HEAD:pruebas`.

**Proyecto de claude.ai:** tras cada etapa, subir allí los documentos cambiados. Para `index.html`, subir la versión ensamblada: `node herramientas/ensamblar.js > .index-ensamblado.html`, subirla y borrarla.

**Trampas conocidas:**
- No usar `pkill -f "node --test"`: mata la propia terminal. Tampoco `rev`, que la cuelga.
- En el banco, al comparar arrays que vienen de la app, pasarlos por `JSON.parse(A.ev('JSON.stringify(...)'))`: son de otro contexto y `deepEqual` los da por distintos.
- Una prueba que arranca el metrónomo debe pararlo en `t.after`. Si no, el banco no termina.

## 4. Decisiones recientes (21/10 y 22/10)

- **22/10 · F5.8 #1, el péndulo del metrónomo:** Pablo lo pidió; eligió que la pesa arriba vaya más lenta, como en uno mecánico, y hacerlo en la misma conversación aunque fuera larga.
- **22/10 · Fusionados #16 y #17** («fusiona 16 y 17»): `main` tiene la `0.6.0`. Pablo hará después sus comentarios y comprobaciones pendientes.
- **22/10 · F5.8 aparcada** hasta sus comentarios de uso; no bloquea y CP-5 se adelanta. F5.9 (cierre) espera a F5.8.
- **22/10 · Avanzar a F6** sin decidir aún la pantalla encendida (AR-12 #2) ni dar los comentarios de F5.8: F5 queda abierta, como F4.
- **22/10 · Auditorías en dos niveles:** ligeras tras cada etapa y a fondo al cerrar cada fase (regla 3 de `CLAUDE.md`).

- **Metrónomo:** un área propia, al estilo de la app de referencia. Tiene un solo acento, en el primer tiempo.
- **Acordes:** a un lado el listado (populares y 30 acordes) con buscador; al otro, el acorde en el mástil, con dedos de color y número.
- **Adivinar:** al fallar, por defecto se sigue intentando.
- **Seis pestañas:** Libre, Adivinar, Afinador, Escalas, Acordes y Metrónomo.
- **Etapa nueva F5.8:** saneamiento con comentarios de uso, antes del cierre (aparcada el 22/10, ver arriba).

El resto está en `CLAUDE.md` («Decisiones vigentes») y en la sección «Decisiones abiertas» de `requisitos.md`.

## 5. Para abrir la siguiente conversación

Siempre el mismo mensaje, dentro del proyecto «Aprendizaje guitarra»:

> Lee ESTADO y sigue.

Detrás, Pablo puede añadir lo que quiera ese día: aprobaciones («Fusiona el #18»), comentarios de uso o una petición nueva. **Siguiente paso ahora:** los demás comentarios de Pablo para F5.8 (en la misma rama, `auto/F5.8-saneamiento`, con su número cada uno) y, si no hay, F6.2 · Service Worker para usar la app sin conexión desde la web (G-03), en la rama `auto/F6.2-service-worker` puesta al día desde la de F5.8 (o desde `main` si ya está fusionada). Es una capacidad nueva: va a `compatibilidad.md` con su alternativa. Pendientes de Pablo, sin bloquear: la pantalla encendida (AR-12 #2), los comentarios de F5.8 y la prueba de 10 minutos con la guitarra.

