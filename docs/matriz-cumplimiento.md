# Trasteando — Matriz de cumplimiento de requisitos

**Versión:** 1.3 · **Fecha:** 19 de octubre de 2026 · **Base:** `requisitos.md` v1.5 · app `0.2.0` · `roadmap.md` v3.3  
**Cliente:** Pablo Díaz Guerra · **Proveedor:** chat de Desarrollo · **Verificación independiente:** auditores

> Versión en texto de `matriz-cumplimiento.xlsx`, para que los chats auditores puedan leerla. El texto de cada requisito está en `requisitos.md`; aquí va cómo se demuestra que se cumple.

**Métodos:** I inspección · A análisis · D demostración · T prueba. **Regla de cierre:** una etapa se cierra cuando todos sus requisitos están en *Cumple* y *Verificado*.

**Cambios en la 1.3:** S-08 verificado con la 0.2.0; evidencias nuevas en S-01, S-07 y S-08.

**Cambios en la 1.2:** PL-04 nuevo (adaptabilidad entre sistemas, evidencia en `docs/compatibilidad.md`).

**Cambios en la 1.1:** S-08 nuevo, verificado parcialmente hasta que la app use sus propias muestras (F2.2). Criterios revisados en CP-1: S-01, S-08, G-03, G-06 y A-02-CA. S-07 y G-06 pasan a *Cumple parcialmente* con `CREDITOS.md`. Las evidencias del banco apuntan a `tests/` (`node --test`). Nueva comprobación F1.1 #15.

| Total | Cumple | Cumple parcialmente | No cumple | No aplica | Verificados | Verificados parcialmente |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 92 | 59 | 13 | 18 | 2 | 1 | 17 |

| ID | Etapa | Método | Criterio de aceptación | Declaración | Evidencia | Verificación | Origen |
|---|---|:---:|---|---|---|---|---|
| **G-01** | F1.1 | I | El nombre «Trasteando» aparece en la pantalla de entrada, en la pestaña del navegador y en el manifiesto. | Cumple | F1.1 #14 | Pendiente | Cliente · listado 14/09 |
| **G-02** | F1.1 | D | La barra inferior muestra Libre, Adivinar, Afinador y Escalas; cada destino activo abre su vista y Escalas aparece deshabilitada. | Cumple | F1.1 #1 y #14 | Pendiente | Cliente · listado 14/09 |
| **G-03** | F6.2 · F7.2 | T | F6.2: tras una primera carga en localhost y sin red, la app abre y suena. F7.2: lo mismo desde la web publicada. | No cumple | — | Pendiente | Cliente · listado 14/09 |
| **G-04** | F6.3 · F7.2 | D | Desde la web publicada, el navegador ofrece instalarla y abre a pantalla completa desde el icono. | Cumple parcialmente | — | Pendiente | Cliente · listado 14/09 |
| **G-05** | F3.4 | I+T | Todo control es alcanzable con teclado y muestra el foco; contrastes ≥ 4,5:1 medidos; el movimiento se reduce con prefers-reduced-motion. | Cumple parcialmente | — | Pendiente | Desarrollo · v1.1 |
| **G-06** | F2.1 · F6.4 | I | CREDITOS.md lista cada recurso de terceros con su origen y su licencia, y la app muestra el texto de atribución en Ajustes. | Cumple parcialmente | CREDITOS.md (F2.1). Falta mostrarlo en la app (F6.4) | Verificado parcialmente | Desarrollo · v1.1 |
| **G-07** | F2.3 · F2.5 | T | Con el ordenador en modo avión, abrir el archivo con doble clic: suenan las muestras reales y funcionan Libre, Adivinar y el afinador por referencia. | Cumple parcialmente | — | Pendiente | Cliente · 15/09 |
| **G-08** | F4.1 · F6.1 | T | El archivo autónomo generado y la web publicada superan el mismo banco de pruebas. | Cumple parcialmente | — | Pendiente | Cliente · 15/09 |
| **G-09** | F7.4 | I | Ficha enviada a revisión en al menos una tienda, o decisión documentada de no hacerlo. | No cumple | — | Pendiente | Cliente · 14/10 |
| **G-10** | F1.3 | I | Ajustes muestra la versión; CHANGELOG.md tiene una entrada por versión; existe la etiqueta de Git de cada cierre de fase. | Cumple | Banco (node --test) · CHANGELOG.md · F1.1 #12 | Verificado parcialmente | Cliente · 14/10 |
| **G-11** | F6.4 | I | La política de privacidad está publicada y la app no envía ninguna petición con datos del usuario (pestaña Red). | No cumple | — | Pendiente | Desarrollo · v1.2 |
| **PL-01** | F2.5 · F7.2 | D | La lista de F1.1 se supera en Chrome, Edge y Firefox en Windows, y la app se instala como PWA desde Edge. | Cumple parcialmente | — | Pendiente | Cliente · 14/10 |
| **PL-02** | F2.5 · F7.2 | D | La lista de comprobación se supera en Chrome para Android, en web y con la PWA instalada. | Cumple parcialmente | — | Pendiente | Cliente · 14/10 |
| **PL-03** | F2.5 · F7.2 | D | La lista de comprobación se supera en Safari para iOS, en web y desde la pantalla de inicio. | Cumple parcialmente | — | Pendiente | Cliente · 14/10 |
| **PL-04** | F2.2 · F3.2 · F7.2 | I+T | Cada capacidad del navegador que usa la app figura en docs/compatibilidad.md con su comportamiento en Windows, Android e iPhone y su alternativa; el banco arranca la app sin vibración ni audio y funciona. | Cumple parcialmente | docs/compatibilidad.md · Banco (node --test) | Verificado parcialmente | Cliente · 14/10 |
| **N-01** | F1.1 | D | El chip de nomenclatura alterna todos los nombres entre Do-Re-Mi y C-D-E. | Cumple | F1.1 #6 | Pendiente | Cliente · listado 14/09 |
| **N-02** | F1.1 | D | El selector de Ajustes produce el mismo cambio que el chip. | Cumple | F1.1 #14 | Pendiente | Cliente · listado 14/09 |
| **N-03** | F1.1 | D | El chip está visible en la barra de acceso rápido sin abrir ningún menú. | Cumple | F1.1 #14 | Pendiente | Cliente · listado 14/09 |
| **N-04** | F1.1 | D | Tras cambiar la nomenclatura, mástil, cuerdas, lector de nota, pistas y afinador usan la nueva. | Cumple | F1.1 #6 | Pendiente | Cliente · listado 14/09 |
| **N-05** | F1.1 | D | Tras recargar la página se mantiene la nomenclatura elegida. | Cumple | F1.1 #13 | Pendiente | Cliente · listado 14/09 |
| **D-01** | F1.1 | I | Se dibujan 6 cuerdas con 25 posiciones cada una: cejuela y 24 trastes. | Cumple | Banco (node --test): 150 celdas | Verificado parcialmente | Cliente · listado 14/09 |
| **D-02** | F1.1 | D | La etiqueta de cada cuerda coincide con la afinación activa y cambia al cambiarla. | Cumple | Banco (node --test): Drop D | Verificado parcialmente | Cliente · listado 14/09 |
| **D-03** | F1.1 | I | Cada número de traste queda centrado sobre su franja con cualquier nivel de zoom. | Cumple | F1.1 #7 | Pendiente | Cliente · listado 14/09 |
| **D-04** | F1.3 | T | Los modos Todos, Guía y No muestran todos los números, solo los de trastes con marca, o ninguno. | Cumple | Banco (node --test) · F1.1 #11 | Verificado parcialmente | Cliente · listado 14/09 |
| **D-05** | F1.1 | D | Pulsar una posición reproduce su nota sin retardo perceptible. | Cumple | F1.1 #2 | Pendiente | Cliente · listado 14/09 |
| **D-06** | F1.1 | D | Al pulsar aparece el nombre de la nota sobre la posición. | Cumple | F1.1 #14 | Pendiente | Cliente · listado 14/09 |
| **D-07** | F1.1 | I | Marcas simples en los trastes 3, 5, 7, 9, 15, 17, 19 y 21, y dobles en 12 y 24. | Cumple | F1.1 #14 | Pendiente | Cliente · listado 14/09 |
| **S-01** | F1.1 · F2.2 · F2.4 | D | Al pulsar cualquier posición suena una muestra grabada, no el sintetizador Karplus-Strong. | Cumple | F1.1 #14 y #15 | Pendiente | Cliente · listado 14/09 |
| **S-02** | F1.1 | D | Elegir Acústica cambia el timbre audible y elegir Clásica lo devuelve. | Cumple | F1.1 #5 | Pendiente | Cliente · listado 14/09 |
| **S-03** | F1.1 | I | El selector de timbre está en Ajustes. | Cumple | F1.1 #14 | Pendiente | Cliente · listado 14/09 |
| **S-04** | F1.1 | T | Sin conexión, la app suena con el sintetizador y lo avisa en la pantalla de entrada. | Cumple | — | Pendiente | Cliente · listado 14/09 |
| **S-05** | F1.1 | D | No suena nada antes de pulsar «Empezar». | Cumple | F1.1 #14 | Pendiente | Cliente · listado 14/09 |
| **S-06** | F1.1 | D | Tras recargar se mantiene el timbre elegido. | Cumple | F1.1 #13 | Pendiente | Cliente · listado 14/09 |
| **S-07** | F2.1 · F2.3 | I | Ninguna petición de audio sale del dominio propio, y CREDITOS.md documenta origen y licencia. | Cumple parcialmente | CREDITOS.md y samples/ (F2.1) · Banco (node --test): ninguna dirección externa (0.2.0) | Verificado parcialmente | AR-01 |
| **S-08** | F2.1 · F2.2 · F2.4 | T | Medida con herramientas/medir-afinacion.py, cada muestra que usa la app suena a ±5 cents de la nota a la que está asignada; el banco lo comprueba contra la frecuencia medida y la huella sha256 de cada archivo. | Cumple | samples/afinacion.json · Banco (node --test): muestras y todas las notas · V-02: 22 notas grabadas en el navegador, a menos de 1 cent | Verificado | Desarrollo · medición F2.1 |
| **P-01** | F1.1 | A | Toda posición del mástil, en cualquier afinación permitida, se dibuja dentro del pentagrama. | Cumple | Análisis 15/09: ninguna nota fuera en todo el rango · F1.1 #3 y #4 | Verificado parcialmente | Cliente · listado 14/09 |
| **P-02** | F1.1 | D | El pentagrama se oculta y se muestra desde el chip y desde Ajustes. | Cumple | F1.1 #14 | Pendiente | Cliente · listado 14/09 |
| **P-03** | F5.3 | D | El pentagrama funciona en Libre, Adivinar y Escalas. | Cumple parcialmente | — | Pendiente | Cliente · listado 14/09 |
| **P-04** | F1.1 | D | El afinador muestra en un pentagrama las seis notas de la afinación activa. | Cumple | F1.1 #14 | Pendiente | Cliente · listado 14/09 |
| **L-01** | F1.1 | D | Al abrir la app se muestra el modo Libre. | Cumple | F1.1 #14 | Pendiente | Cliente · listado 14/09 |
| **L-02** | F1.1 | D | Con «Ver todas las notas» se ven todos los nombres; sin él, solo el de la nota pulsada. | Cumple | Banco (node --test) · F1.1 #10 | Verificado parcialmente | Cliente · listado 14/09 |
| **L-03** | F1.1 | D | Al pulsar una nota se señalan las demás posiciones con el mismo sonido exacto y ninguna de otra octava. | Cumple | F1.1 #14 | Pendiente | Cliente · listado 14/09 |
| **J-01** | F1.1 | D | Al entrar en Adivinar suena una nota y el botón ▶ la repite. | Cumple | F1.1 #14 | Pendiente | Cliente · listado 14/09 |
| **J-02** | F1.1 | T | Cualquier posición con el mismo sonido cuenta como acierto. | Cumple | Banco (node --test): acierto | Verificado parcialmente | Cliente · listado 14/09 |
| **J-03** | F1.1 | D | Tras acertar se señalan las demás posiciones válidas. | Cumple | F1.1 #14 | Pendiente | Cliente · listado 14/09 |
| **J-04** | F1.1 | D | La pista «Nombre» muestra el nombre y la octava de la nota que suena. | Cumple | F1.1 #14 | Pendiente | Cliente · listado 14/09 |
| **J-05** | F1.1 | D | La pista «Cuerda» lista las cuerdas donde puede estar la nota. | Cumple | F1.1 #14 | Pendiente | Cliente · listado 14/09 |
| **J-06** | F1.1 | D | Las dos pistas se activan con chips visibles en Adivinar, sin abrir Ajustes. | Cumple | F1.1 #14 | Pendiente | Cliente · listado 14/09 |
| **J-07** | F1.1 | T | La racha sube con cada acierto y vuelve a 0 con cada fallo. | Cumple | Banco (node --test): acierto y fallo | Verificado parcialmente | Cliente · listado 14/09 |
| **J-08** | F1.1 | T | El récord persiste tras recargar la página. | Cumple | Banco (node --test): récord guardado · F1.1 #13 | Verificado parcialmente | Cliente · listado 14/09 |
| **J-09** | F1.1 | D | Acierto y fallo se distinguen al instante por color y destello. | Cumple | F1.1 #9 | Pendiente | Cliente · listado 14/09 |
| **J-10** | F1.3 | T | Tras un fallo se iluminan todas las posiciones correctas, suena la nota buscada y llega un reto nuevo limpio. | Cumple | Banco (node --test): 7 comprobaciones · F1.1 #9 | Verificado parcialmente | Cliente · listado 14/09 |
| **J-11** | F4.4 | I | La decisión queda anotada en requisitos.md. | No cumple | — | Pendiente | Desarrollo · v1.1 |
| **J-12** | F1.3 | T | Con «Ver todas las notas» activo, Adivinar no muestra los nombres. | Cumple | Banco (node --test) · F1.1 #10 | Verificado parcialmente | Revisión de código 0.1.2 |
| **E-01** | F5.2 | D | Se puede elegir tónica y tipo de escala entre el catálogo aprobado. | No cumple | — | Pendiente | Cliente · listado 14/09 |
| **E-02** | F5.2 | T | Para cada tónica y tipo, las posiciones generadas coinciden con una referencia externa en afinación estándar. | No cumple | — | Pendiente | Cliente · listado 14/09 |
| **E-02b** | Posterior | N/A | Fuera del alcance actual. | No aplica | — | No aplica | AR-01 |
| **E-03** | F5.3 | D | Mostrar ilumina únicamente las notas de la escala. | No cumple | — | Pendiente | Cliente · listado 14/09 |
| **E-04** | F5.3 | D | Cada nota iluminada muestra su nombre y el intervalo T o ST respecto al grado anterior. | No cumple | — | Pendiente | Cliente · listado 14/09 |
| **E-05** | F5.4 | T | En Práctica, una nota ajena marca error e ilumina las correctas; una nota de la escala no marca error. | No cumple | — | Pendiente | Cliente · listado 14/09 |
| **E-05b** | Posterior | N/A | Fuera del alcance actual. | No aplica | — | No aplica | AR-01 |
| **E-06** | F5.3 | D | El guiado avanza nota a nota por la escala. | No cumple | — | Pendiente | Cliente · listado 14/09 |
| **A-01** | F1.1 | D | Pulsar cada cuerda en el afinador reproduce su nota de referencia. | Cumple | F1.1 #14 | Pendiente | Cliente · listado 14/09 |
| **A-02** | F4.3 | D | Con una guitarra real, el afinador indica subir o bajar hasta dejarla afinada, en estándar y en una alternativa. | No cumple | — | Pendiente | Cliente · listado 14/09 |
| **A-02-CA** | F4.2 | T | Banco de pruebas: error ≤ ±2 cents y latencia < 300 ms sobre muestras desafinadas una cantidad conocida, tomando como referencia su frecuencia medida en samples/afinacion.json. | No cumple | — | Pendiente | AR-01 |
| **A-03** | F4.3 | D | La aguja indica la desviación en cents y marca «afinado» dentro de ±5 cents. | No cumple | — | Pendiente | Cliente · listado 14/09 |
| **A-04** | F4.3 | T | Con la cuerda a menos de un semitono de su nota, el afinador identifica la cuerda correcta. | No cumple | — | Pendiente | Cliente · listado 14/09 |
| **A-05** | F4.3 | D | Con una cuerda fijada a mano, el afinador la usa como referencia aunque esté muy desafinada. | No cumple | — | Pendiente | Cliente · listado 14/09 |
| **A-06** | F1.1 | I | La afinación estándar es E2 A2 D3 G3 B3 E4. | Cumple | F1.1 #14 | Pendiente | Cliente · listado 14/09 |
| **A-07** | F1.1 | I | Existen Drop D, medio tono abajo, Open G, Open D y DADGAD con sus notas correctas. | Cumple | F1.1 #14 | Pendiente | Cliente · listado 14/09 |
| **A-08** | F1.1 | D | Los botones +/− mueven la cuerda un semitono y pasan a Personalizada sin alterar los presets. | Cumple | F1.1 #4 | Pendiente | Cliente · listado 14/09 |
| **A-09** | F1.1 | D | El pentagrama del afinador refleja la afinación seleccionada. | Cumple | F1.1 #14 | Pendiente | Cliente · listado 14/09 |
| **A-10** | F1.1 | T | Al cambiar de afinación, el mástil y los retos se rehacen con las nuevas notas. | Cumple | Banco (node --test): Drop D | Verificado parcialmente | Cliente · listado 14/09 |
| **A-11** | F1.1 | D | Tras recargar se mantiene la afinación, incluida la personalizada. | Cumple | F1.1 #13 | Pendiente | Cliente · listado 14/09 |
| **V-01** | F3.2 | D | En un móvil apaisado cada cuerda mide al menos 40 px, y en vertical aparece el aviso para girar. | Cumple parcialmente | — | Pendiente | Cliente · listado 14/09 |
| **V-02** | F1.1 | D | El afinador se usa con comodidad en vertical y en horizontal. | Cumple | F1.1 #14 | Pendiente | Cliente · listado 14/09 |
| **V-03** | F1.1 | D | En una pantalla de 1280 px se ven los 24 trastes sin desplazarse. | Cumple | F1.1 #14 | Pendiente | Cliente · listado 14/09 |
| **V-04** | F1.1 | D | El zoom cambia los trastes visibles entre 3 y el máximo que cabe, y la etiqueta dice la cifra real. | Cumple | F1.1 #7 y #8 | Pendiente | Cliente · listado 14/09 |
| **V-05** | F1.1 | D | Con el mástil más ancho que la pantalla se puede desplazar hasta el traste 24. | Cumple | F1.1 #14 | Pendiente | Cliente · listado 14/09 |
| **V-06** | F1.1 | D | Desplazarse no cambia el ancho de los trastes. | Cumple | F1.1 #7 | Pendiente | Cliente · listado 14/09 |
| **V-07** | F1.1 | D | Al redimensionar la ventana el mástil se reajusta sin perder el tramo visible. | Cumple | F1.1 #7 | Pendiente | Cliente · listado 14/09 |
| **V-08** | F1.1 | D | El zoom se mantiene tras recargar y tras girar el móvil. | Cumple | F1.1 #13 | Pendiente | Cliente · listado 14/09 |
| **V-09** | F1.3 | T | El modo Guía mantiene visibles solo los números de los trastes con marca. | Cumple | Banco (node --test) · F1.1 #11 | Verificado parcialmente | AR-01 |
| **C-01** | F1.1 | D | El botón de Ajustes abre el panel desde cualquier pantalla y Escape lo cierra. | Cumple | F1.1 #14 | Pendiente | Cliente · listado 14/09 |
| **C-02** | F1.1 | I | El panel contiene todos los ajustes listados y la versión de la app. | Cumple | F1.1 #12 | Pendiente | Cliente · listado 14/09 |
| **C-03** | F1.1 | D | Nomenclatura, pentagrama y pistas tienen chips de acceso rápido. | Cumple | F1.1 #14 | Pendiente | Cliente · listado 14/09 |
| **C-04** | F1.1 | D | La barra inferior lleva a cada área con un toque. | Cumple | F1.1 #14 | Pendiente | Cliente · listado 14/09 |
| **C-05** | F1.1 | T | Todos los ajustes persisten tras recargar, y unos ajustes corruptos o antiguos no rompen la app. | Cumple | Banco (node --test): migración · F1.1 #13 | Verificado parcialmente | Cliente · listado 14/09 |
| **C-06** | F3.1 | I | interfaz.md aprobado por el cliente y revisado por el auditor de requisitos. | No cumple | — | Pendiente | Cliente · listado 14/09 |
| **X-01** | F1.2 · F1.4 | I | GitHub muestra la última versión y la etiqueta de cierre de fase. | Cumple parcialmente | Rama local auto/F1-iteracion-0, sin subir | Pendiente | Desarrollo · v1.1 |
| **X-02** | F7.1 | D | La URL pública carga la app desde un dispositivo ajeno al proyecto. | No cumple | — | Pendiente | Desarrollo · v1.1 |
| **X-03** | F7.2 | D | La app instalada desde la web funciona en un Android, un iPhone y un Windows reales. | No cumple | — | Pendiente | Desarrollo · v1.1 |

*Gestionada por el chat de Desarrollo. Los auditores la leen y proponen cambios a criterios, métodos o evidencias en sus informes.*
