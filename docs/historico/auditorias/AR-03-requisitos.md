# AR-03 — Auditoría de requisitos · CP-2

**Fecha:** 19/10/2026 · **Auditor:** auditor de requisitos (subagente, solo lectura, modo ligero) · **Base:** `main` en `b38d48e` (`v0.1.5..HEAD`, 7 commits), app `0.2.2`, `requisitos.md` v1.7, `roadmap.md` v3.5, `matriz-cumplimiento.md` v1.5, `compatibilidad.md`, `CREDITOS.md`, `CHANGELOG.md`, V-02 a V-04 · `node --test`: 20/20 en verde.

**Veredicto:** apto para seguir a F3, con reservas. El sonido cumple y está bien medido, pero antes de cerrar F3 hay que decidir cómo se resuelve el iPhone, y la licencia del nylon no puede esperar a F7 porque el repositorio ya es público.

## Hallazgos

| # | Severidad | IDs | Hallazgo | Propuesta |
|---|---|---|---|---|
| 1 | Alto | G-07, PL-03, G-03 | **iOS.** El archivo autónomo aún no se ha probado en el iPhone (es F2.5, en la Sesión 1). G-07 ya lo da por inviable, mientras PL-03 dice «a confirmar». Además, G-07 no distingue plataformas, así que en el iPhone nunca podría cumplirse. La alternativa sensata es la web en `https` instalada en la pantalla de inicio. Pero el roadmap (§8) promete que antes de la Sesión 1 se podrá usar «sin conexión», y eso necesita el Service Worker (G-03), que llega en F6.2. El despliegue de pruebas no tiene etapa en el roadmap ni en el plan de bloques. Abrir el archivo con el navegador de una app de terceros no es buena opción para un cliente principiante y choca con PL-04. | Limitar G-07 a Windows y Android, y anotar que en el iPhone la autonomía llega por G-03. Criterio de F2.5 en iPhone: «el archivo no se ejecuta (confirmado); la web en `https` abre, suena y se instala». **Decisión del cliente:** adelantar un Service Worker mínimo a F3 para probar sin conexión en la Sesión 1, o aceptar que eso llega en F6.2 y corregir §8. Dar al despliegue de pruebas una etapa propia y descartar la app de terceros. |
| 2 | Medio | S-07, G-09, X-01 | **Licencia del nylon.** Dejarla para «antes de publicar (F7)» ya no protege nada: la API de GitHub confirma que `pdigue/guitarra` es **público**, y en él están `samples/` y `dist/trasteando.html`. El despliegue de pruebas también será público. Es el segundo aplazamiento (iba antes de F2.3, ahora antes de F7) de una tarea que `CREDITOS.md` estima en «unos minutos», y sigue sin responsable. El riesgo es bajo (el sonido comprobado es CC BY 4.0 y la edición de Brosowsky, CC BY 3.0), pero la condición está en el sitio equivocado. | Hacerla antes del despliegue de pruebas y, como tarde, al cerrar F3. Si el agente no puede entrar en Freesound, que la haga el cliente. Anotarla en roadmap §9 con fecha. Si algún sonido no es CC BY, sustituir esa grabación. |
| 3 | Medio | S-01, PL-04 | **Calidad del sonido.** El criterio de S-01 (que suene una grabación y no el sintetizador Karplus-Strong) es de sí o no: no mide la calidad. El de F2.4 para la acústica («la menor que permitan sus muestras») se cumple siempre, aunque su traste 24 transporte 14 semitonos (19 en afinaciones extremas). El cliente escuchó la 0.2.0, pero no la 0.2.1 (grabaciones recortadas a 4,5 s y a 128 kbps) ni la 0.2.2 (nueva grabación de La♯5). Esa escucha no se registró en ninguna parte: V-02 dejaba tres puntos pendientes (calidad al oído, interruptor de silencio y retraso del primer toque), la matriz tiene S-01 en *Pendiente* y `compatibilidad.md` sigue diciendo «se confirma en el iPhone». | Registrar la escucha del 19/10 en una V-05 breve (dispositivo, versión de iOS y los tres puntos) y llevarla a la matriz y a compatibilidad. En la Sesión 1, escucha guiada: trastes 15 a 24 de la 1ª cuerda en la acústica, y una nota larga en `index.html` frente a `dist/`. El cliente decide si acepta el agudo de la acústica como limitación conocida (anotada en S-01) o si se buscan grabaciones agudas. |
| 4 | Medio | G-07, G-08 | **Peso.** 1,46 MB es aceptable: abre en 0,3–0,6 s. Pero el límite de 1,5 MB no tiene justificación escrita y deja solo 40 KB de margen (2,7 %). `index.html` ya pesa 75 KB, y F3, F5 y F6.4 añadirán código, así que la prueba del banco fallará pronto. La salida fácil sería bajar la calidad del audio sin que nadie lo escuche. Lo que nota el usuario (abrir en ≤ 3 s en Windows) solo se ha medido en Linux. | Separar dos límites: uno para el audio (≤ 1,45 MB; cambiar su calidad exige que el cliente lo escuche) y otro para el archivo completo, justificado (p. ej. 2 MB). El criterio principal pasa a ser abrir en ≤ 3 s en Windows, medido en la Sesión 1. Anotar en G-07 el motivo del límite. |
| 5 | Bajo | S-08 | **La nueva redacción de S-08 es medible y suficiente.** La matriz fija dos umbrales: cada grabación, a menos de 50 cents de la nota que tiene asignada, y cada nota, a ±5 cents una vez corregida. El banco da ±0,5 cents y V-02 a V-04, menos de 1. Punto débil: la corrección y su verificación usan la misma herramienta (`medir-afinacion.py`). Si esta tuviera un error sistemático, se anularía y no se vería. Los −10 cents de La♯5 dependen solo de ella. | Una comprobación independiente en la Sesión 1: un afinador externo (app o de pinza) sobre Mi2, Mi4 y Mi6 en cada timbre. |
| 6 | Bajo | X-01, G-07, S-07, F2.1 | **Documentos desactualizados.** X-01 sigue en 🟡 («sin subir») en requisitos y matriz, aunque los PR #1 a #5 están fusionados en GitHub. G-07 dice «16 grabaciones, 1,42 MB»: ahora son 17 y 1,46 MB. F2.1 sigue en 🔨, pero el roadmap dice «F2.1 a F2.4 hechas». La tabla de riesgos aún dice «apta también para tiendas». `CREDITOS.md` pone «Última revisión 14/10», pero recoge cambios del 19/10. `compatibilidad.md` cambió sin subir de la v1.0. | Corregirlo en la próxima revisión. X-01 pasa a *Cumple*, lo que cambia los recuentos de §1 y de la matriz. Cerrar F2.1 llevando la revisión de licencia a donde indica el hallazgo 2. |

## Estado de AR-02

| # AR-02 | Estado | Nota |
|---|---|---|
| 1 · Alto · X-01 | Resuelto | Repositorio subido y 5 PR fusionados. Falta reflejarlo en los documentos (hallazgo 6). |
| 2 · Alto · iPhone en `https` | Parcial | El despliegue de pruebas está decidido, pero no tiene etapa y el Service Worker no llega hasta F6.2 (hallazgo 1). |
| 3 · Medio · comprobaciones cortas | Parcial | La de F2.2 se hizo, pero sin registrar el resultado (hallazgo 3). La de F4.3 sigue planificada. |
| 4 · Medio · S-08 | Resuelto | Validado en la 0.2.0 y reformulado con aprobación del cliente. |
| 5 · Medio · criterios medibles | Parcial | F2.2, F2.3 y S-01 ya son medibles. La acústica en F2.4 y el límite de peso, no (hallazgos 3 y 4). |
| 6 · Medio · Android | Resuelto | Decisión del 15/10: simulador de Chrome hasta tener un Android real. |
| 7 · Bajo · redacción | Parcial | S-08, G-06 y PL-03, corregidos. La licencia del nylon no se revisó antes de F2.3, y en riesgos sigue «apta para tiendas» (hallazgos 2 y 6). |
| 8 · Bajo · desfases | Resuelto | — |

## Lo que está bien

Las mediciones son sólidas: todas las notas grabadas en el navegador quedan a menos de 1 cent, y `dist/autonomo.json` demuestra que recortar y recodificar no cambió la afinación. La atribución declara esas modificaciones, como pide CC BY.
Los recuentos cuadran entre requisitos y matriz (92 = 60 + 12 + 20), el CHANGELOG sigue versión a versión de la 0.2.0 a la 0.2.2, y la reformulación de S-08 se justificó con datos y se aprobó antes de aplicarla.

---

## Respuesta del chat de Desarrollo · 19/10/2026

| # | Decisión | Qué se hizo |
|---|---|---|
| 1 | 🟡 Aceptado en parte | G-07 se limita a Windows y Android; en iPhone, la autonomía llega por G-03. Criterio de F2.5 para el iPhone tal como se propone. El roadmap ya no promete uso sin conexión en la Sesión 1. El despliegue de pruebas queda descrito como activo desde el 19/10 (`pdigue.github.io/guitarra`, rama `pruebas`). La app de terceros se descarta. **Decisión abierta para el cliente:** Service Worker mínimo antes de la Sesión 1 o en F6.2. |
| 2 | ✅ Aceptado | La revisión de la licencia pasa a «lo antes posible, como tarde al cerrar F3», con el cliente como responsable de pegar el enlace o hacerla él. |
| 3 | ✅ Aceptado | V-05 registra la escucha del 19/10. Escucha guiada de la acústica en la Sesión 1. **Decisión abierta para el cliente:** aceptar el agudo de la acústica como limitación conocida. |
| 4 | ✅ Aceptado | Dos límites: audio ≤ 1,45 MB (bajar su calidad exige escucha) y archivo ≤ 2 MB. El criterio principal es abrir en ≤ 3 s en Windows, en la Sesión 1. Aplicado en el generador, el banco, G-07 y la matriz. |
| 5 | ✅ Aceptado | Afinador externo sobre Mi2, Mi4 y Mi6 en la lista de la Sesión 1. |
| 6 | ✅ Aceptado | X-01 cumple; G-07 al día; F2.1 cerrada (la licencia sigue como tarea aparte); riesgo corregido; fechas de `CREDITOS.md` y versión de `compatibilidad.md` al día. |
