# Trasteando — Estado para retomar

**Actualizado:** 22/10/2026, con la app en la `0.5.6` · **Lo mantiene:** la conversación que trabaja, sin que Pablo tenga que vigilarlo.

> **Para la conversación que lee esto**
> 1. **Al empezar:** este es el original (`docs/ESTADO.md`, en GitHub) o su copia en el proyecto de claude.ai (`claude/ESTADO.md`). Lee los dos y compáralos: deben ser idénticos. Si difieren, díselo a Pablo antes de seguir; manda el de GitHub. Lee también `CLAUDE.md` del repositorio: son las reglas.
> 2. **Mientras trabajas:** actualiza este archivo en cada versión nueva de la app (en el mismo commit que sube `APP_VERSION`; una prueba del banco falla si no), tras cada fusión en `main` o decisión de Pablo, y cuando cambien sus pendientes. Cada vez, sube la misma versión al proyecto como `claude/ESTADO.md`.
> 3. **Al terminar:** déjalo al día y acaba tu último mensaje con la línea «ESTADO actualizado: versión X, siguiente paso Y».
> 4. **Propón tú el cambio de conversación** (Pablo no tiene que pedirlo) al cerrar una etapa, tras un par de días o si la conversación se ha resumido sola por larga: avísale, deja esto al día y recuérdale el mensaje de arranque de la sección 5. Si cambia la forma de trabajar, dale el texto nuevo de las instrucciones del proyecto.
>
> Con este archivo y `CLAUDE.md` basta para seguir; el resto de documentos se leen solo cuando la tarea los necesita, y por partes.

## 1. Dónde estamos

- **App:** `0.5.6`, ya en `main` (22/10). Rama de trabajo: `auto/CP-5-correcciones` (contiene la de F5.8, que aún no tiene trabajo propio).
- **Web de pruebas:** https://pdigue.github.io/guitarra/ (rama `pruebas`, con la `0.5.6`).
- **Fase F5 · Escalas, metrónomo y acordes:**
  - Hechas F5.1 a F5.7: escalas, ♯/♭ por nota, reintentar por defecto, metrónomo y acordes.
  - **F5.8 · saneamiento** (cómo se ve Adivinar y una vuelta a Escalas): aparcada hasta que Pablo dé sus comentarios de uso. Decisión suya del 22/10: no bloquea y se adelanta CP-5.
  - **CP-5 en curso** (22/10): auditorías a fondo AR-12 (requisitos) y AT-11 (técnica) lanzadas en paralelo sobre toda F5. El límite de uso de Pablo las cortó; se retoman, con SendMessage a los mismos auditores, cuando se restablece. Antes de lanzarlas: banco 80 de 80 y las cuatro comprobaciones de Chromium en verde.
  - Después, F5.9 (cierre con la etiqueta `v0.5.x`) y F6 (preparación para distribución).
- **PR abiertos:** ninguno. El 22/10, con su aprobación («Fusiona el #14 y el #15»), se fusionaron en `main`:
  - **#14**, metrónomo (`0.5.4`);
  - **#15**, acordes y correcciones de AT-10 y AR-11 (`0.5.5` y `0.5.6`), con su base cambiada antes a `main`.
- **Documentos:**
  - requisitos v1.23 (109 requisitos, 57 validados), matriz v1.21, roadmap v3.21;
  - interfaz v1.13, compatibilidad v1.7, IT-03;
  - últimas auditorías: AR-11 y AT-10.

## 2. Pendiente de Pablo (no bloquea)

1. Sus comentarios de uso para F5.8.
2. La prueba de 10 minutos con la guitarra (protocolo en `docs/verificaciones/V-09-F4-afinador.md`). Después, crear la etiqueta `v0.4.x` en la web de GitHub: el agente no puede crear etiquetas ni releases (error 403).
3. Revisión de git del 22/10 (todo sano; copia completa en un *bundle*, enviada a Pablo y restaurada con el banco en 80 de 80). Quedan dos decisiones suyas:
   - **Proteger `main`** en GitHub (Settings → Rules): exigir pull request e impedir *force push* y borrado, sin pedir aprobaciones (no puede aprobar sus propios PR). `docs/automatizacion.md` cuenta con esa protección, pero no está activa. Lo hace él en la web.
   - **Borrar las 17 ramas `auto/…` ya fusionadas** (de `auto/F1-iteracion-0` a `auto/F5.7-acordes`). No se pierde nada: todos sus commits están en `main` y en el *bundle*. Solo con su «sí» explícito.

## 3. Cómo se trabaja (lo práctico)

**Comprobaciones:**
- **Banco:** `node --test`, que debe dar 80 de 80. Cada prueba usa `tests/dom-minimo.js`.
- **Pruebas sueltas:** `node --test-name-pattern="texto" tests/banco.test.js`.
- **Archivo autónomo:** tras cada cambio en `js/`, `css/` o `index.html`, regenerarlo con `python3 herramientas/generar-autonomo.py`. Si no, falla la prueba 19.
- **En Chromium**, con la salida siempre en la carpeta temporal de la conversación:
  - `node herramientas/comprobar-disposicion.js <salida>` (con `IDIOMA=en-US`, en inglés);
  - `node herramientas/comprobar-accesibilidad.js`;
  - `node herramientas/comprobar-en-navegador.js <repo> index.html <salida>`, con `<repo>` como ruta **absoluta** (con `.` su servidor da 404 y falla esperando `#gate-btn`);
  - `node herramientas/comprobar-autonomo.js dist/trasteando.html <salida>`.

**Requisitos y matriz:** se **generan**, no se editan a mano. La fuente es `herramientas/documentos/generar-requisitos.py`; las instrucciones están en su cabecera.

**Versiones:**
- `APP_VERSION` está en `js/01-teoria.js`, y los `?v=` de `index.html` deben coincidir con ella.
- Cada versión lleva su entrada en `CHANGELOG.md`.

**Git:**
- Una rama por etapa (`auto/F5.x-tema`).
- Los PR y las fusiones se hacen con la API REST: `gh api repos/pdigue/guitarra/pulls ...`. GraphQL no está disponible.
- Tras cada PR, `git push origin HEAD:pruebas`.

**Proyecto de claude.ai:** tras cada etapa, subir allí los documentos cambiados. Para `index.html`, subir la versión ensamblada: `node herramientas/ensamblar.js > .index-ensamblado.html`, subirla y borrarla.

**Trampas conocidas:**
- No usar `pkill -f "node --test"`: mata la propia terminal. Tampoco `rev`, que la cuelga.
- En el banco, al comparar arrays que vienen de la app, pasarlos por `JSON.parse(A.ev('JSON.stringify(...)'))`: son de otro contexto y `deepEqual` los da por distintos.
- Una prueba que arranca el metrónomo debe pararlo en `t.after`. Si no, el banco no termina.

## 4. Decisiones recientes (21/10)

- **Metrónomo:** un área propia, al estilo de la app de referencia. Tiene un solo acento, en el primer tiempo.
- **Acordes:** a un lado el listado (populares y 30 acordes) con buscador; al otro, el acorde en el mástil, con dedos de color y número.
- **Adivinar:** al fallar, por defecto se sigue intentando.
- **Seis pestañas:** Libre, Adivinar, Afinador, Escalas, Acordes y Metrónomo.
- **Etapa nueva F5.8:** saneamiento con comentarios de uso, antes del cierre.

El resto está en `CLAUDE.md` («Decisiones vigentes») y en la sección «Decisiones abiertas» de `requisitos.md`.

## 5. Para abrir la siguiente conversación

Siempre el mismo mensaje, dentro del proyecto «Aprendizaje guitarra»:

> Lee ESTADO y sigue.

Detrás, Pablo puede añadir lo que quiera ese día: aprobaciones («Fusiona el #16»), comentarios de uso o una petición nueva. **Siguiente paso ahora:** terminar CP-5 en la rama `auto/CP-5-correcciones` (informes AR-12 y AT-11, corregir lo crítico y alto, PR). F5.8 espera los comentarios de uso de Pablo.

