# AR-02 — Auditoría de requisitos · CP-1

**Fecha:** 15/10/2026 · **Auditor:** auditor de requisitos (subagente, solo lectura) · **Base:** rama `auto/F1-iteracion-0` (`18ba661..8da85c5`, 11 commits), app `0.1.3`, `requisitos.md` v1.3, `roadmap.md` v3.1, `matriz-cumplimiento.md` v1.1, `CHANGELOG.md`, `CREDITOS.md` · `node --test`: 12/12 en verde.

**Veredicto:** apto para seguir con reservas. Los documentos cuadran entre sí, pero antes de F2.2 hay que subir el repositorio (X-01), y antes de la Sesión 2 hay que planificar cómo se prueba el iPhone en `https`.

## Hallazgos

| # | Severidad | IDs | Hallazgo | Propuesta |
|---|---|---|---|---|
| 1 | Alto | X-01 | Los 11 commits posteriores a `18ba661` solo están en la rama local; `origin/main` sigue en 0.0.1. Eso incluye la app 0.1.3, `samples/`, `tests/`, `herramientas/` y los documentos de esta versión. El modo acelerado va a construir F2 y F3 encima sin copia de seguridad. | Convertir X-01 en parada bloqueante antes de F2.2: vincular GitHub y subir la rama, con *pull request* sin fusionar. Precisar el criterio: «GitHub muestra la rama de trabajo con su último commit». Hoy «la última versión» puede referirse a `main` o a la rama. |
| 2 | Alto | PL-03, A-02, G-03, G-04 | Por trabajar en local, el micrófono, la instalación y el funcionamiento sin conexión en el iPhone (el móvil de referencia) solo se prueban en F7.2, cuando la app ya es pública (X-02). La Sesión 2 se hace en el ordenador. Si el afinador falla en Safari (afecta a O-04), se descubriría con la app ya publicada. Además, G-03 está asignado a F6.2, pero su criterio pide «una primera carga desde la web», que no existe hasta F7.1. | Antes de la Sesión 2, hacer un despliegue de pruebas en `https` sin anunciar, con parada de aprobación (los riesgos de PL-03 ya lo contemplan como alternativa). Hacer la Sesión 2 también con el iPhone. Para G-03: criterio en `localhost` en F6.2 y en la web en F7.2, con Etapa `F6.2 · F7.2`. |
| 3 | Medio | S-01…S-06, A-02…A-05 | Agrupar las pruebas en dos sesiones deja sin escuchar dos cambios de riesgo. El reproductor propio de F2.2, que sustituye todo el motor de audio, no se escucha hasta cerrar F3. En el iPhone, el desbloqueo del audio y el interruptor de silencio son fallos típicos. El afinador de F4.3 no se prueba hasta cerrar F6, dos fases después. | Añadir dos comprobaciones cortas que no exigen publicar: 5 minutos en el iPhone por WiFi tras F2.2 (pulsar notas, cambiar de timbre, interruptor de silencio) y 10 minutos con la guitarra en `localhost` tras F4.3. Las dos sesiones grandes se mantienen como están. |
| 4 | Medio | S-08, A-02-CA | S-08 figura como único requisito validado, pero el banco no demuestra la segunda mitad de su criterio («la app solo usa muestras… idénticas a las del repositorio»). El banco compara `SAMPLE_MAPS` y los archivos de `samples/` con `afinacion.json`, mientras que la 0.1.3 sigue descargando el audio de `SAMPLE_BASE` (nbrosowsky.github.io). Aparte, varias muestras se desvían hasta ±2,8 cents, más que los ±2 cents que exige A-02-CA. | Dejar S-08 en *Verificado parcialmente* hasta F2.2 (Validados pasa de 1 a 0 en §1 y en la matriz). Otra opción: que la prueba compruebe además que `SAMPLE_BASE` es local; hoy fallaría. En A-02-CA, tomar como referencia la `hz_medida` de `afinacion.json`, no la nota nominal. |
| 5 | Medio | S-01, S-07, G-07 (F2.2–F2.4) | Hay criterios de F2 que no se pueden medir. F2.2 pide que «suene igual o mejor; menos retardo». F2.4 pide recorrer la cuerda «sin saltos de calidad». F2.3 no fija un peso máximo, aunque las 16 muestras ya ocupan 2,1 MB (unos 2,8 MB en base64). El criterio de S-01 en la matriz («en la pestaña Red se ven descargadas») no se actualizó al modificar el requisito y choca con F2.2 y F2.3. | **F2.2:** el banco recorre todas las notas del mástil en los dos timbres y comprueba que muestra más transposición dan la frecuencia teórica con ±5 cents; además, retardo de la pulsación a `start()` ≤ N ms. Lo de «suena igual» se decide con una escucha comparada del cliente en la comprobación corta. **F2.4:** transposición máxima ≤ 3 semitonos (hoy llega a +12, del E5 al E6). **F2.3:** fijar un peso máximo y una apertura ≤ 3 s en Windows. **S-01:** «al pulsar cualquier posición suena una muestra, no Karplus-Strong». |
| 6 | Medio | PL-02, G-09 | PL-02 tiene prioridad Alta y Google Play es la primera tienda prevista, pero ninguna sesión incluye un Android. F2.5 lo deja en «si hay uno a mano» y F7.2 lo da por supuesto. | Decidir ahora con qué Android se prueba (uno prestado para F7.2, o el emulador anotado como evidencia). Si no habrá ninguno, bajar PL-02 a Media o cambiar el orden de las tiendas. |
| 7 | Bajo | S-08, G-06, PL-03, S-07 | Redacción de los requisitos nuevos y modificados. **S-08:** mete el método (`medir-afinacion.py`) en el texto del requisito y habla de «la nota que indica su nombre», cuando lo que importa es la nota a la que la app la asigna. **G-06:** el texto no dice «dentro de la app», pero las notas lo dan como pendiente. **PL-03:** tiene un inciso sin cerrar («—en web e instalada…») y sus notas mezclan decisión, método de prueba y tienda. **S-07:** dice «licencias verificadas» cuando del pack de nylon solo se ha comprobado un sonido, y el riesgo la declara «apta también para tiendas». | **S-08:** «Cada muestra que usa la app suena en la nota a la que está asignada, ±5 cents»; el método pasa a la matriz. **G-06:** añadir «y los muestra dentro de la app»; si no, el 🟡 sobra. **PL-03:** cerrar el inciso y llevar «móvil de referencia» a §6. **S-07:** poner responsable y fecha a la revisión del pack 11573, antes de F2.3. |
| 8 | Bajo | — | Desfases menores. La cabecera del roadmap v3.1 cita `automatizacion.md` v1.0, pero la vigente es la 1.1. El cierre de F1 habla de «~58 requisitos», y requisitos §1 cuenta 59. | Corregirlo en la próxima revisión, sin subir versión. |

## Estado de AR-01

| # AR-01 | Hallazgo | Estado | Nota |
|---|---|---|---|
| 1 · Crítico | Documento desincronizado del código | Resuelto | Ya existen las columnas *Etapa* y *Desde* y se reconcilia en cada cierre. Queda el criterio de S-01 (hallazgo 5). |
| 2 · Alto | Muestras de terceros con licencia dudosa | Parcial | En F2.1 se alojaron y se comprobó la licencia CC BY. La app aún las descarga de fuera (se corrige en F2.2) y falta revisar el pack de nylon. |
| 3 · Alto | Escalas como motor combinatorio | Resuelto | E-02 y E-05 acotados; E-02b y E-05b pasan a *Posterior*. |
| 4 · Medio-alto | A-02 sin criterios de aceptación | Resuelto | A-02-CA (±2 cents, < 300 ms) con prueba automática en F4.2. Ver el ajuste del hallazgo 4. |
| 5 · Medio | V-01 y orientación con zoom | Resuelto | V-01 decidido (el aviso llega en F3.2); V-09 implementado en la 0.1.2. |

## Lo que está bien

Las cifras e IDs cuadran en los cuatro documentos: 91 = 59 + 12 + 20; los recuentos por fase y la trazabilidad de §18 coinciden con la columna *Etapa*; y las marcas son exactas (1 🆕 y 5 ✏️).
S-08 es un ejemplo de buen hábito: un hallazgo convertido en requisito medible, con una prueba que se comprobó que falla con la lista de muestras antigua y con su huella `sha256` en `CREDITOS.md`.

---

## Respuesta del chat de Desarrollo · 15/10/2026

| # | Decisión | Qué se hizo |
|---|---|---|
| 1 | ✅ Aceptado | X-01: subir el repositorio es **parada antes de F2.2** (requisitos, roadmap F1.2). Mientras, el repositorio completo se entrega como archivo de copia (`git bundle`). |
| 2 | 🟡 Aceptado en parte | G-03 pasa a `F6.2 · F7.2` con criterio en dos pasos. El despliegue de pruebas en `https` es una acción de publicación: queda como **decisión abierta tuya**, con recomendación de hacerlo antes de F4.3. |
| 3 | ✅ Aceptado | Dos comprobaciones cortas en el roadmap: 5 min en el iPhone tras F2.2 y 10 min con la guitarra tras F4.3. |
| 4 | ✅ Aceptado | S-08 queda sin validar hasta F2.2 (*Verificado parcialmente*); 0 validados. La prueba compara con la frecuencia medida y hay una prueba pendiente a la vista para F2.2. A-02-CA toma como referencia la frecuencia medida. |
| 5 | 🟡 Aceptado con ajuste | Criterios medibles en F2.2, F2.3 (≤ 1,5 MB, ≤ 3 s), F4.3 y S-01. En F2.4, ≤ 3 semitonos no es alcanzable con las muestras de la opción A (no hay acústica por encima de D5): nylon ≤ 6 y acústica la menor posible, anotada. |
| 6 | ✅ Aceptado | Decisión abierta: con qué Android se prueba, antes de la Sesión 1. |
| 7 | ✅ Aceptado | Redacción de S-08, G-06, PL-03 y S-07 corregida. La revisión del pack de nylon, antes de F2.3. |
| 8 | ✅ Aceptado | Corregido. |
