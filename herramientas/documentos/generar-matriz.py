# Matriz de cumplimiento de requisitos (cliente ↔ proveedor), estilo ingeniería
# de sistemas. Lee los mismos datos que requisitos.md y añade, por requisito:
# origen, método de verificación (I/A/D/T), criterio de aceptación, declaración
# del proveedor, evidencia, estado de verificación y quién verifica.
import json, sys, re, math
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.formatting.rule import FormulaRule
from openpyxl.utils import get_column_letter

# Genera docs/matriz-cumplimiento.xlsx y .md a partir de requisitos.json (lo
# escribe generar-requisitos.py). Necesita openpyxl. Uso en su cabecera.
REQS, OUT_XLSX, OUT_MD = sys.argv[1], sys.argv[2], sys.argv[3]
data = json.load(open(REQS, encoding='utf-8'))
CATN = dict(data['cats'])
VER = data['versiones']   # las escribe generar-requisitos.py: una sola fuente para las versiones
# Control de cambios desde la 2.0 (lo anterior, en docs/historico/matriz-cumplimiento.md)
CC = [
 ['2.10','17/11/2026','v2.10','0.6.13','Tus respuestas del 17/11: V-12 nuevo (controles a la vista en toda la app), con comprobar-disposicion como evidencia; J-14, pistas de 26 px; V-01, aprobado lo de esconder el aviso con pistas.'],
 ['2.9','16/11/2026','v2.9','0.6.12','Tu comentario y tu respuesta del 16/11: J-14 nuevo (las pistas se leen enteras y ningún control queda fuera de la pantalla), con el criterio que tenía J-06 y lo de la 0.6.12; verificado parcialmente hasta tu prueba. J-06, criterio de origen (validado en la Sesión 1, E04). V-01 y V-04, criterio y evidencia, y G-05, evidencia (comprobar-disposicion con zonas seguras y estados, 81 pantallas en los dos idiomas). Con AR-23 y AT-22.'],
 ['2.8','16/11/2026','v2.8','0.6.11','Tu decisión del 16/11: J-06, criterio (en una sola línea en los dos idiomas, de 20 px o más) y evidencia (comprobar-pistas, 126 de 126, todas en una línea).'],
 ['2.7','16/11/2026','v2.7','0.6.10','Tu comentario del 16/11: J-06, criterio (la respuesta, entera en iPhone e iPad en vertical y en horizontal, nunca menor de 20 px, la nota que tocas; ya no 21 px por tener más de 7 caracteres) y evidencia nuevos (banco y comprobar-pistas en Chromium, 126 de 126); verificado parcialmente hasta tu prueba. PL-04, evidencia (compatibilidad v1.15) (AR-22 #4).'],
 ['2.6','16/11/2026','v2.6','0.6.9','F6.3: G-04, método (banco y Chromium; en F7.2, el cliente), criterio (instalable en localhost; en F7.2, desde la web publicada en el iPhone y en Android) y evidencia nuevos (banco del manifiesto y los iconos; comprobar-instalable en Chromium, 12 de 12); verificado parcialmente: falta desde la web publicada (F7.2); el criterio de F7.2, del cliente (AR-21 #4). PL-04, evidencia (compatibilidad v1.14) (AR-21 #3).'],
 ['2.5','16/11/2026','v2.5','0.6.8','F6.2: G-03, criterio (carga completa; en F7.2, también el iPhone instalado y tras días sin abrirla) y evidencia nuevos (banco del Service Worker y comprobación sin conexión en Chromium, 9 de 9); verificado parcialmente: falta desde la web publicada (F7.2). PL-04, evidencia (compatibilidad v1.13).'],
 ['2.4','15/11/2026','v2.4','0.6.7','F5.8 #7: MT-04, criterio y evidencia nuevos, y MT-06, evidencia (el péndulo, con lo que se oye) (300 ms por adelantado, 60 s a 250 ppm con tirones sin perder golpes, cambios y Parar sobre lo ya programado, la luz cuando se oye; medición en Chromium con herramientas/medir-metronomo.js); parcial hasta tu prueba en el iPhone.'],
 ['2.3','15/11/2026','v2.3','0.6.5','F5.8 #6: AC-07 (el acorde en grande, trastes 0 a 5) nuevo, verificado parcialmente hasta tu prueba; AC-01 pasa a la elección por nota y tipo (criterio y evidencia nuevos, parcial hasta tu prueba); AC-03 y AC-06 retirados (No aplica); V-01 y P-03, ni el aviso para girar ni el pentagrama salen en Acordes. Con las auditorías AR-18 y AT-17: lo pendiente, en las notas de AC-01 y AC-07.'],
 ['2.2','15/11/2026','v2.2','0.6.4','F5.8 #5: E-07 (posiciones), E-08 (Escuchar), E-09 (tocar la escala) y E-10 (Todas) nuevos, verificados parcialmente hasta tu prueba; E-05 retirado (No aplica); E-05b pasa a la Práctica nueva, en F5.8; criterios de E-03, E-05b y E-06; evidencias de E-02, E-04 y P-03. Con AR-17 y AT-16.'],
 ['2.1','15/11/2026','v2.1','0.6.3','V-10 y V-11 nuevos (temas, tableta y ordenador), verificados parcialmente hasta tu prueba; criterios medibles de J-01 y J-06 (J-06, verificado parcialmente hasta tu prueba) y de C-02 y PL-03 con la 0.6.3; evidencias de G-05 y V-04. Con AR-16 y AT-15.'],
 ['2.0','15/11/2026','v2.0','0.6.2','Baseline 0.6.2: mismos ID, métodos, criterios, evidencias y estados de verificación que la 1.25; el comentario de cada requisito, en lo vigente. Historial 1.0 a 1.25 en docs/historico/.'],
]

def plain(s):
    s = re.sub(r'\*\*([^*]+)\*\*', r'\1', s or '')
    s = re.sub(r'`([^`]+)`', r'\1', s)
    s = re.sub(r'\*([^*]+)\*', r'\1', s)
    return s.strip()

# id: (método, criterio de aceptación, evidencia, origen)
C20='Cliente · 20/10 (interfaz.md v1.0)'; C16='Cliente · 16/11 (AR-22 #5)'; CL='Cliente · listado 14/09'; C21='Cliente · 21/10'; C22='Cliente · 22/10 (F5.8 #1)'; C12='Cliente · 12/11 (AR-12 #2, F5.8)'; AR='AR-01'; DV='Desarrollo · v1.1'; C15='Cliente · 15/09'; C14='Cliente · 14/10'; D12='Desarrollo · v1.2'; RC='Revisión de código 0.1.2'
C12b='Cliente · 12/11 (F5.8 #3)'; B='Banco (node --test)'; MF='Desarrollo · medición F2.1'
V = {
 'G-01':('I','El nombre «Trasteando» aparece en la pantalla de entrada, en la pestaña del navegador y en el manifiesto; en horizontal, arriba del panel.','F1.1 #14 · 0.5.2: comprobar-disposicion, título visible en horizontal',CL),
 'G-02':('D','La navegación muestra las seis áreas (Libre, Adivinar, Afinador, Escalas, Acordes y Metrónomo) y cada destino abre su vista.','F1.1 #1 y #14 · 0.5.5: comprobar-disposicion, seis pestañas en todas las pantallas',CL),
 'G-03':('T','F6.2: tras una primera carga completa (Service Worker activo) en localhost y sin red, la app abre y suena. F7.2: lo mismo desde la web publicada, y en el iPhone desde Safari y desde la app instalada, también tras varios días sin abrirla.',B+': sw.test.js (precarga igual a lo que carga index.html más las 17 grabaciones; sin red, todo sale de la copia; versión nueva, caché nueva) y cuándo se registra (web sí; autónomo y file:// no) · herramientas/comprobar-sin-conexion.js en Chromium, 0.6.8: 9 de 9 (36 de 36 archivos guardados; sin red abre, se cargan las grabaciones de los dos timbres y se tocan notas sin error, y se recorren las seis áreas sin un fallo; una versión nueva sustituye a la vieja; una página de otra versión no pisa la copia)',CL),
 'G-04':('T','F6.3: en localhost, con el manifiesto propio y sus iconos PNG (192, 512 y «maskable»), Chrome la da por instalable, sin motivos en contra; el iPhone tiene su icono PNG de 180 px. F7.2: desde la web publicada, el navegador ofrece instalarla (en el iPhone, «Añadir a pantalla de inicio») y desde el icono abre a pantalla completa, con su nombre y su icono, en el iPhone y en Android (lo valida el cliente, con X-03; AR-21 #4).',B+': instalar.test.js (lo que pide el manifiesto; cada icono existe y mide lo que dice; la página enlaza el manifiesto y el icono del iPhone, de 180 px y sin transparencia; el autónomo no los lleva) y sw.test.js (sin red, el manifiesto y los iconos salen de la copia) · herramientas/comprobar-instalable.js en Chromium, 0.6.9, servida en /guitarra/ como la web de pruebas: 13 de 13 (identidad de la app, su carpeta; Page.getInstallabilityErrors sin motivos; manifiesto sin errores; iconos de 192, 512 y «maskable», de su tamaño; consola limpia; la 0.6.8 falla 3)',CL),
 'G-05':('I+T','Todo control es alcanzable con teclado y muestra el foco; contrastes ≥ 4,5:1 medidos; el movimiento se reduce con prefers-reduced-motion; en pantallas táctiles, todo control y toda casilla del mástil mide al menos 40 × 40 px en la vista por defecto, salvo las cuerdas en vertical con menos de 660 px de alto y los trastes que el usuario estreche con «+» (hasta 28 px). Paleta por nota: las 7 naturales a ≥ 7,5 (OKLab × 100) entre sí con visión normal y con protanopía, deuteranopía y tritanopía simuladas, y las 12 a ≥ 8 con visión normal; el nombre de la nota siempre escrito.','V-07: comprobar-accesibilidad.js (teclado, contraste, movimiento) · paleta.py · V-06: 40 × 40 px · '+B+': teclado, etiquetas, paleta, grises, fila y asa · 0.6.3: comprobar-accesibilidad en Madera, Automático (oscuro y claro) y Partitura · 0.6.12: comprobar-disposicion, Android a 780 × 280 con el raíl desplazable, Ajustes a la vista',C20),
 'G-06':('I','CREDITOS.md lista cada recurso de terceros con su origen y su licencia, y la app muestra el texto de atribución en Ajustes.','CREDITOS.md (F2.1). Falta mostrarlo en la app (F6.4)',DV),
 'G-07':('T','En Windows (y Android cuando lo haya), con el ordenador en modo avión, dist/trasteando.html abre con doble clic en ≤ 3 s, suenan las grabaciones y funcionan Libre, Adivinar y el afinador por referencia. Audio ≤ 1,45 MB y archivo ≤ 2 MB.','V-03 y V-04: desde disco y sin conexión en Chromium, abre en 0,3 s y suena a menos de 1 cent · '+B+': autónomo al día, con su audio, huellas y límites',C15),
 'G-08':('T','El archivo autónomo generado y la web publicada superan el mismo banco de pruebas.',B+' en dos pasadas: banco.test.js y escalas.test.js contra la app de varios archivos y contra el autónomo (autonomo.test.js), que además lee de dentro sus 17 grabaciones (huellas sha256) sin descargar nada; una sola vez, lo que lee el repositorio o compara las formas · el autónomo es exactamente la app ensamblada más su audio · comprobar-autonomo (Chromium, file:// y sin conexión: 0,15 s, ninguna conexión, error con módulo y línea exactos) · comprobar-en-navegador · CHANGELOG 0.6.0 · IT-04 · AR-13 y AT-12',C15),
 'G-09':('I','Ficha enviada a revisión en al menos una tienda, o decisión documentada de no hacerlo.','—',C14),
 'G-10':('I','Ajustes muestra la versión; CHANGELOG.md tiene una entrada por versión; existe la etiqueta de Git de cada cierre de fase.',B+' · CHANGELOG.md · F1.1 #12 · etiquetas v0.1.5, v0.2.3 y v0.3.3 (21/10)',C14),
 'G-12':('D','En Ajustes, Español / English cambia todos los textos de la app; la elección se guarda; la primera vez sigue al navegador.',B+': mismas claves en las dos lenguas, cambio y vuelta, primera vez según el navegador · comprobar-disposicion.js con IDIOMA=en-US',CL),
 'G-13':('D','Con el bloqueo automático del iPhone en 30 s: con el metrónomo sonando 5 minutos, o el afinador escuchando 2, sin tocar la pantalla, no se bloquea y sigue; al parar, se bloquea solo en ese plazo (V-09, M8b; en Safari y, desde iOS 18.4, en la app instalada). Donde no hay Wake Lock, o el sistema lo niega, funciona igual y el metrónomo lo avisa.',B+': se pide al empezar y se suelta al parar (metrónomo y micrófono); aviso sin la capacidad y cuando el sistema la niega; se vuelve a pedir si el sistema la suelta',C12),
 'G-11':('I','La política de privacidad está publicada y la app no envía ninguna petición con datos del usuario (pestaña Red).','—',D12),
 'PL-01':('D','La lista de F1.1 se supera en Chrome, Edge y Firefox en Windows, y la app se instala como PWA desde Edge.','—',C14),
 'PL-02':('D','La lista de comprobación se supera en Chrome para Android, en web y con la PWA instalada.','—',C14),
 'PL-04':('I+T','Cada capacidad del navegador que usa la app figura en docs/compatibilidad.md con su comportamiento en Windows, Android e iPhone y su alternativa; el banco arranca la app sin vibración ni audio y funciona.','docs/compatibilidad.md v1.15 · '+B+': sin matchMedia ni history; el Service Worker se registra solo donde existe (sw.test.js y banco.test.js)',C14),
 'PL-03':('D','La lista de comprobación se supera en Safari para iOS y iPadOS, en web y desde la pantalla de inicio.','—',C14),
 'N-01':('D','El chip de nomenclatura alterna todos los nombres entre Do-Re-Mi y C-D-E.','F1.1 #6',CL),
 'N-02':('D','El selector de Ajustes produce el mismo cambio que el chip.','F1.1 #14',CL),
 'N-03':('D','El chip está visible en la barra de acceso rápido sin abrir ningún menú.','F1.1 #14',CL),
 'N-04':('D','Tras cambiar la nomenclatura, mástil, cuerdas, lector de nota, pistas y afinador usan la nueva.','F1.1 #6',CL),
 'N-06':('T','Elegido ♭ para una tecla negra, todas sus notas se escriben así en mástil, lectura, pentagrama y Afinador; las demás no cambian; en una escala manda la escala, también en el lector grande y el de pantalla.',B+': Sol♭ en todo el mástil, Fa♯ en Sol mayor, botones según la nomenclatura; Si♭ en Fa mayor (AT-09)',C21),
 'N-05':('D','Tras recargar la página se mantiene la nomenclatura elegida.','F1.1 #13',CL),
 'D-01':('I','Se dibujan 6 cuerdas con 25 posiciones cada una: cejuela y 24 trastes.',B+': 150 celdas',CL),
 'D-02':('D','La etiqueta de cada cuerda coincide con la afinación activa y cambia al cambiarla.',B+': Drop D',CL),
 'D-03':('I','Cada número de traste queda centrado sobre su franja con cualquier nivel de zoom.','F1.1 #7',CL),
 'D-04':('T','Los modos Todos, Guía y No muestran todos los números, solo los de trastes con marca, o ninguno.',B+' · F1.1 #11',CL),
 'D-05':('D','Pulsar una posición reproduce su nota sin retardo perceptible.','F1.1 #2',CL),
 'D-06':('D','Al pulsar aparece el nombre de la nota sobre la posición.','F1.1 #14',CL),
 'D-07':('I','Marcas simples en los trastes 3, 5, 7, 9, 15, 17, 19 y 21, y dobles en 12 y 24.','F1.1 #14',CL),
 'S-01':('D','Al pulsar cualquier posición suena una muestra grabada, no el sintetizador Karplus-Strong.','F1.1 #14 y #15 · V-05: escucha del cliente en su iPhone (0.2.0, 19/10) · Sesión 1 (informe V-08): suena en el PC y el iPhone, pero en el iPhone se quedó mudo en C08 y D03; 0.3.3 con recuperación; pendiente de la Sesión 2',CL),
 'S-02':('D','Elegir Acústica cambia el timbre audible y elegir Clásica lo devuelve, sin hacer sonar ninguna nota al elegir.','F1.1 #5 · '+B+': cambiar de guitarra no suena · Sesión 1: A14',CL),
 'S-03':('I','El selector de timbre está en Ajustes.','F1.1 #14',CL),
 'S-04':('T','Sin conexión, la app suena con el sintetizador y lo avisa en la pantalla de entrada.','—',CL),
 'S-05':('D','No suena nada antes de pulsar «Empezar».','F1.1 #14',CL),
 'S-06':('D','Tras recargar se mantiene el timbre elegido.','F1.1 #13',CL),
 'S-07':('I','Ninguna petición de audio sale del dominio propio, y CREDITOS.md documenta origen y licencia.','CREDITOS.md y samples/ (F2.1) · '+B+': ninguna dirección externa (0.2.0) · licencia de los 161 sonidos del pack de nylon: CC BY, con filtros de control a 0 (20/10)',AR),
 'S-08':('T','Cada nota posible, en los dos timbres, suena a ±5 cents de su frecuencia una vez aplicada la corrección de su grabación; cada grabación es la nota asignada (a menos de 50 cents) y su desviación coincide con samples/afinacion.json.','samples/afinacion.json · '+B+': grabaciones y todas las notas (±0,5 cents) · V-02, V-03 y V-04: notas grabadas en el navegador, a menos de 1 cent',MF),
 'P-01':('A','Toda posición del mástil, en cualquier afinación permitida, se dibuja dentro del pentagrama.','Análisis 15/09: ninguna nota fuera en todo el rango · F1.1 #3 y #4 · 0.5.2: pentagrama de una nota de 152 px de alto en el iPhone en horizontal (comprobar-disposicion)',CL),
 'P-02':('D','El pentagrama se oculta y se muestra desde el chip y desde Ajustes.','F1.1 #14',CL),
 'P-03':('D','El pentagrama funciona en Libre, Adivinar y Escalas (en Acordes no se ve desde la 0.6.5).',B+': en Escalas, 8 notas de la posición alrededor del paso actual (0.6.4)',CL),
 'P-04':('D','El afinador muestra en un pentagrama las seis notas de la afinación activa.','F1.1 #14',CL),
 'L-01':('D','Al abrir la app se muestra el modo Libre.','F1.1 #14',CL),
 'L-02':('D','Con «Ver todas las notas» se ven todos los nombres; sin él, solo el de la nota pulsada.',B+' · F1.1 #10',CL),
 'L-03':('D','Al pulsar una nota se señalan las demás posiciones con el mismo sonido exacto y ninguna de otra octava.','F1.1 #14',CL),
 'J-01':('D','En Adivinar nada suena hasta pulsar ▶ (resaltado); antes de ▶ el mástil suena pero no puntúa; después cada reto suena solo y ▶ lo repite. La lectura y el pentagrama muestran la nota que tocas (0.4.1), la lectura, en Adivinar, a 20 px (24 en tableta) en el gris secundario, con 4,5:1 o más, desde la 0.6.3 (F5.8 #4); la buscada, solo con la pista de nombre o al responder.','F1.1 #14 · '+B+': ▶, y lectura de la nota tocada con las pistas aparte · Sesión 1: C07 y E04',CL),
 'J-02':('T','Cualquier posición con el mismo sonido cuenta como acierto.',B+': acierto',CL),
 'J-03':('D','Tras acertar se señalan las demás posiciones válidas.','F1.1 #14',CL),
 'J-04':('D','La pista «Nombre» muestra el nombre y la octava de la nota que suena.','F1.1 #14',CL),
 'J-05':('D','La pista «Cuerda» lista las cuerdas donde puede estar la nota.','F1.1 #14',CL),
 'J-06':('D','Las dos pistas se activan con chips visibles en Adivinar, sin abrir Ajustes, y enseñan su respuesta; cómo se ve, en J-14.','F1.1 #14 · '+B+': pistas desde los chips, también antes de ▶',CL),
 'J-14':('D','(1) Pistas: en 393 × 852, 375 × 667 y 820 × 1180, en vertical y en horizontal, en español y en inglés, con Mi3, Do#4 y Mi4 (3, 5 y 6 cuerdas), también tras un fallo y tras girar sin recargar: cada respuesta, entera (sin «…»), de 20 px o más y en una línea; las cuerdas, número con su ordinal pequeño (11 px o más); en horizontal, ▶ de 40 px o más sin la racha encima. (2) Controles: en las pantallas de comprobar-disposicion —iPhone con Safari (390 × 664, 375 × 553, 750 × 342), iPhone 15 Pro y Pro Max instalados con sus zonas seguras en las dos orientaciones, Android simulado (780 × 280, 360 × 560) e iPad (820 × 1180, 1133 × 670)—, en Adivinar tras un fallo con las dos pistas, en español y en inglés: ningún control fuera de la pantalla, bajo una zona segura ni recortado por una caja; lo que queda por debajo en el raíl o el panel, que se desplazan, cuenta como a la vista. (3) Al fallar, el aviso es «✗ ¡Prueba otra vez!» y el lector de pantalla no lee la ✗.','F1.1 #14 · '+B+': pistas grandes, también antes de ▶; cuerdas en números con su ordinal, en los dos idiomas; CSS sin «…» y con text-size-adjust (0.6.10); el aviso para girar se esconde con pistas y vuelve al apagarlas o cambiar de área; ya no se usa la clave del aviso largo (0.6.12) · comprobar-pistas, 0.6.12: 126 de 126 · comprobar-disposicion, 0.6.12: 81 pantallas en español y en inglés, todo correcto (con la 0.6.11, 14 fallos, entre ellos «Ver la respuesta» fuera del panel en el Pro Max). Solo Chromium: falta Safari, en tu iPhone (AT-22 A1)',C16),
 'J-07':('T','La racha sube con cada acierto y vuelve a 0 con cada fallo.',B+': acierto y fallo',CL),
 'J-08':('T','El récord de cada afinación persiste tras recargar y tras «Restablecer todos los ajustes»; solo «Borrar los récords de racha» los pone a cero.',B+': récords por afinación guardados y restablecer · F1.1 #13 · Sesión 1: A15',CL),
 'J-09':('D','Acierto y fallo se distinguen al instante por color y destello.','F1.1 #9',CL),
 'J-10':('T','Tras un fallo se marca la pulsada (relleno rojo y ✗); a los 1,2 s suena la nota buscada y se iluminan todas sus posiciones (relleno verde y ✓); 3 s después llega un reto nuevo limpio.',B+': 8 comprobaciones · F1.1 #9 · Sesión 1: A09',CL),
 'J-11':('T','Cada afinación guarda su récord; el récord único de antes pasa a Estándar; cambiar de afinación empieza la racha.',B+': récord por afinación, migración y cambio de afinación',DV),
 'J-13':('T','Por defecto, «Reintentar»: un fallo rompe la racha pero el reto sigue; «Ver la respuesta» la enseña y suena; acertar tras fallar no suma. Con «Ver respuesta», como J-10.',B+': modo reintentar, ajuste guardado y valor por defecto; dos fallos seguidos no dejan casillas rojas (AT-09)',C21),
 'J-12':('T','Con «Ver todas las notas» activo, Adivinar no muestra los nombres.',B+' · F1.1 #10',RC),
 'E-01':('D','Se puede elegir tónica y tipo de escala entre el catálogo aprobado (mayor, menor natural, pentatónicas mayor y menor; 21/10).',B+': selectores de tónica y tipo',CL),
 'E-02':('T','Para cada tónica y tipo, las posiciones generadas coinciden con una referencia externa en afinación estándar.','tests/escalas.test.js: las 24 mayores y menores con siete letras, sin mezclar ♯ y ♭ ni dobles alteraciones, y 16 de ellas nota a nota frente al libro; pentatónicas dentro de su escala; casillas por clase de altura',CL),
 'V-10':('T','Ajustes › Aspecto ofrece Madera, Automático y Partitura; Madera es el de fábrica; la elección se guarda y un valor desconocido vuelve a Madera; Automático sigue al dispositivo, también si cambia con la app abierta, y es oscuro si el navegador no sabe decirlo; en un tema claro el pentagrama y la nota usan la tinta del texto, también tras cambiar de tema con una nota escrita; en los cuatro aspectos (Madera, Automático oscuro y claro, Partitura) todo texto pasa comprobar-accesibilidad con los umbrales de G-05; y el cliente aprueba el aspecto en su iPhone.',B+': temas, Automático (con y sin matchMedia), tinta al cambiar de tema · comprobar-accesibilidad con TEMA y ESQUEMA en los cuatro aspectos · elección del cliente el 15/11 (Madera de fábrica)',C12b),
 'V-11':('D','Con área útil de 700 × 600 px o más: cuerdas de 40 a 80 px con el dedo (30 a 80 con ratón), el mástil a lo sumo de 420 px de alto con el dedo y 380 con ratón; el pentagrama, hasta 230 px; pestañas en la cabecera desde 1100 px de ancho y en su fila por debajo, sin pisar el nombre ni Ajustes; nada se sale de la pantalla. Pantallas: iPad 820 × 1180, 744 × 1133, 1180 × 820, 1024 × 768 y 1133 × 670 (iPad mini en horizontal con las barras de Safari) con el dedo; ordenador 1440 × 900 y 1280 × 620 con ratón.','comprobar-disposicion: las pantallas de tableta y ordenador del criterio (con Adivinar, Libre, Metrónomo, Acordes y Ajustes), en español e inglés',C12b),
 'V-12':('D','En las pantallas de comprobar-disposicion (iPhone con Safari y el SE, iPhone 15 Pro y Pro Max instalados con sus zonas seguras en las dos orientaciones, Android simulado, iPad y ordenador) y sus estados (cada área; Ajustes; la ventana del compás; Adivinar con pistas y tras un fallo; Escalas practicando), en español y en inglés: ningún control fuera de la pantalla, bajo una zona segura ni recortado por una caja; lo que queda por debajo en el raíl, el panel o una hoja que se desplazan cuenta como a la vista.','comprobar-disposicion.js, 0.6.13: 81 pantallas en español y en inglés, todo correcto (con la 0.6.11, 14 fallos). Solo Chromium: falta Safari, en tu iPhone',C16),
 'C-08':('N/A','Fuera del alcance actual.','—',CL),
 'S-09':('N/A','Fuera del alcance actual.','—',CL),
 'E-02b':('N/A','Fuera del alcance actual.','—',AR),
 'E-03':('D','Se ilumina solo una posición de la escala (en afinación estándar, 18 casillas en la mayor y la menor y 12 en las pentatónicas), con su nombre escrito y la tónica con anillo.',B+': las 18 casillas de Do mayor con sus 7 notas, las 12 de la caja 1 de La pentatónica menor y el Si♭ de Fa mayor (0.6.4)',CL),
 'E-04':('D','Las notas de la escala muestran su nombre y la línea de notas indica el intervalo T, ST o T½ respecto al grado anterior.',B+': «Do T Re T Mi ST Fa…», la pentatónica menor y el grado del paso resaltado (0.6.4)',CL),
 'E-05':('N/A','Retirado en la 0.6.4 (F5.8 #5): lo sustituyen E-09 y E-05b.','—',CL),
 'E-05b':('D','Con «Practicar», las casillas de la posición no dicen su nota; solo avanza la siguiente en orden de grave a agudo; un fallo se marca en rojo sin avanzar, con aviso propio si es la misma nota en otra cuerda; completa, la primera vuelve a empezar; otra posición empieza de cero.',B+': caja 1 de La pentatónica menor entera, un salto, la nota en otra cuerda, repetir y cambiar de posición (0.6.4)',C12),
 'E-09':('D','Al pulsar una casilla de la posición, suena y pasa a ser el paso actual (texto e intervalos la siguen); una de fuera suena y no cambia el paso.',B+': la última casilla de la caja 1 de La pentatónica menor y una de fuera (0.6.4)',C12),
 'E-06':('D','El guiado avanza nota a nota por la posición, de su nota más grave a la más aguda, y resalta solo esa casilla.',B+': 18 pasos en Do mayor que suenan y se resaltan, con su intervalo (0.6.4)',CL),
 'E-07':('D','Mayor y menor tienen 7 posiciones de 3 notas por cuerda y las pentatónicas 5 de 2; la 1 empieza en la tónica y las demás siguen hacia el cuerpo; ◀ ▶ las recorre; al llegar se ve la 1; la vista del mástil va a la posición.',B+': posiciones 1 a 7 de Do mayor (la abierta, 0,1,3 | 0,2,3…), la caja 1 de La pentatónica menor (trastes 5 a 8) la vista que va a la caja 2 y un barrido de las 7 afinaciones, 4 escalas y 12 tónicas: 7 o 5 posiciones, la 1 en la tónica, trastes dentro del mástil y saltos de 1 a 3 semitonos (0.6.4)',C12),
 'E-08':('D','«Escuchar» toca la posición subiendo y bajando sin repetir la nota de arriba, resaltando cada una; otro toque la para; se calla al cambiar de tónica, de tipo o de afinación, al ocultar la app y al salir de Escalas.',B+': 23 notas en La pentatónica menor y las seis formas de pararla (0.6.4)',C12),
 'E-10':('D','«Todas» enseña el resto de las casillas de la escala, apagadas, sin dejar de destacar la posición; está apagado al entrar y su botón solo se ve en Escalas.',B+': Do mayor con «Todas», solo notas de la escala, y fuera de Escalas (0.6.4)',C12),
 'A-01':('D','Pulsar cada cuerda en el afinador reproduce su nota de referencia.','F1.1 #14',CL),
 'A-02':('D','Con una guitarra real, el afinador indica subir o bajar hasta dejarla afinada, en estándar y en una alternativa. Sigue la nota mientras se apaga (al menos 3 s con una cuerda sintética de 6 s a volumen de móvil y con ruido), sin lecturas a más de 6 cents, y el ruido solo no mueve la aguja. Con las 12 grabaciones reales y ruido: primera lectura en menos de 300 ms y, ya asentada la cuerda, a menos de 5 cents de su medida. Abre en Micrófono donde se puede usar, sin escuchar hasta «Activar». Tu prueba (V-09, M0, M2b y M5): pulsas una vez la 5ª y la aguja la sigue al menos 3 s sin saltar de cuerda; en Drop D, la 4ª releva a la 6ª.','comprobar-afinador.js (Chromium, grabación real 12 cents baja → «La2 · −11 cents · Sube un poco»; hilo aparte; se apaga al salir) · '+B+': flujo del permiso, modo por defecto y su recuerdo · tono.test.js: nota que se apaga, ruido, giro de clavija, relevo de cuerda (también a la octava) y las 12 grabaciones con ruido',CL),
 'A-02-CA':('T','Banco de pruebas: error ≤ ±2 cents y latencia < 300 ms sobre muestras desafinadas una cantidad conocida, tomando como referencia su frecuencia medida en samples/afinacion.json.','tests/tono.test.js: 12 grabaciones reales de −45 a +40 cents; peor error 1,84 cents frente a su medida y 0,62 trozo a trozo; aguja en su nota en ≤ 195 ms + unos 5 ms de cálculo (trozos de 4096 valores, desde la 0.6.2)',AR),
 'A-03':('D','La aguja indica la desviación en cents y marca «afinado» dentro de ±5 cents. Al callar la nota, lo último medido sigue 2,5 s a la vista, atenuado y con el rótulo «Última lectura», y luego vuelve a reposo.',B+': «Sube un poco» a −12, «Afinada» a +3, «Última lectura» al segundo de callar y en reposo a los 3 s · comprobar-afinador.js',CL),
 'A-04':('T','Con la cuerda a menos de un semitono de su nota, el afinador identifica la cuerda correcta.',B+': las 6 cuerdas a −90 y +90 cents, y la 6ª en Drop D',CL),
 'A-05':('D','Con una cuerda fijada a mano, el afinador la usa como referencia aunque esté muy desafinada.',B+': 6ª elegida con un La2 sonando → +500 cents, y sin confundir la octava',CL),
 'A-06':('I','La afinación estándar es E2 A2 D3 G3 B3 E4.','F1.1 #14',CL),
 'A-07':('I','Existen Drop D, medio tono abajo, Open G, Open D y DADGAD con sus notas correctas.','F1.1 #14',CL),
 'A-08':('D','Los botones +/− mueven la cuerda un semitono y pasan a Personalizada sin alterar los presets.','F1.1 #4',CL),
 'A-09':('D','El pentagrama del afinador refleja la afinación seleccionada.','F1.1 #14',CL),
 'A-10':('T','Al cambiar de afinación, el mástil y los retos se rehacen con las nuevas notas.',B+': Drop D',CL),
 'A-11':('D','Tras recargar se mantiene la afinación, incluida la personalizada.','F1.1 #13',CL),
 'V-01':('D','En horizontal, con un alto útil de 268 px o más, cada cuerda mide al menos 40 px (iPhone en Safari e instalada; simulador de Android). En vertical, en pantallas táctiles de menos de 600 px de ancho y en Libre, Adivinar y Escalas, aparece el aviso para girar; nunca en el Afinador, el Metrónomo ni Acordes (desde la 0.6.5); cerrado, no vuelve y «Restablecer» lo recupera; en Adivinar, no mientras haya pistas encendidas (0.6.12).','V-06: comprobar-disposicion.js en 14 pantallas: 52,8 / 60,8 / 42,5 px · '+B+': aviso para girar · 0.6.12: comprobar-disposicion, Adivinar tras un fallo con pistas, sin aviso y con las pestañas a la vista (390 × 664)',C20),
 'V-02':('D','El afinador se usa con comodidad en vertical y en horizontal.','F1.1 #14',CL),
 'V-03':('D','En una pantalla de 1280 px se ven los 24 trastes sin desplazarse.','F1.1 #14',CL),
 'V-04':('D','El zoom cambia los trastes visibles entre 3 y el máximo que cabe, y la etiqueta dice la cifra real; «+» enseña más trastes y «−» menos. Con pointer: coarse, la vista por defecto usa trastes de al menos 40 px y el usuario puede pedir más trastes, de hasta 28 px; si el zoom guardado pide más de los que caben, se muestran los que caben y lo guardado se conserva (V-08).','F1.1 #7 y #8 · V-06 · '+B+': 40 px por defecto, 28 con «+», orden de los botones · 0.6.3: comprobar-disposicion, iPad 1024 × 768 con el dedo a 41,5 px por traste · 0.6.12: en el móvil en horizontal, con las zonas seguras, iPhone 15 Pro instalado, 9 trastes de 42,7 px en Adivinar, y Pro Max, 11 de 42,2 px',C20),
 'V-05':('D','Con el mástil más ancho que la pantalla se puede desplazar hasta el traste 24.','F1.1 #14',CL),
 'V-06':('D','Desplazarse no cambia el ancho de los trastes.','F1.1 #7',CL),
 'V-07':('D','Al redimensionar la ventana el mástil se reajusta sin perder el tramo visible.','F1.1 #7',CL),
 'V-08':('D','El zoom se mantiene tras recargar y tras girar el móvil.','F1.1 #13',CL),
 'V-09':('T','El modo Guía mantiene visibles solo los números de los trastes con marca.',B+' · F1.1 #11',AR),
 'C-01':('D','El botón de Ajustes abre el panel desde cualquier pantalla y Escape lo cierra.','F1.1 #14',CL),
 'C-02':('I','El panel contiene todos los ajustes listados, el idioma (0.4.2), el tema (0.6.3) y la versión de la app.','F1.1 #12 · '+B+': grupos Idioma y Aspecto',CL),
 'C-03':('D','Nomenclatura, pentagrama y pistas tienen chips de acceso rápido.','F1.1 #14',CL),
 'C-04':('D','La navegación (barra inferior, raíl o pestañas en la cabecera, según la disposición) lleva a cada área con un toque.','F1.1 #14 · 0.5.5: comprobar-disposicion, seis pestañas sin salirse ni pisar el nombre',C20),
 'C-05':('T','Todos los ajustes persisten tras recargar, y unos ajustes corruptos o antiguos no rompen la app.',B+': migración · F1.1 #13',CL),
 'C-06':('I','interfaz.md aprobado por el cliente y revisado por el auditor de requisitos.','interfaz.md v1.0 · AR-04 · aprobación del cliente el 20/10',CL),
 'C-07':('D','Con un paso anterior en la sesión, «atrás» cierra Ajustes o vuelve al área anterior; desde la primera área actúa el sistema; al abrir o recargar se entra en Libre. Prueba manual en Windows y en el simulador de Android de Chrome.',B+': historial simulado con popstate (3 pruebas)',C20),
 'X-01':('I','GitHub muestra la última versión en main, entrada por pull request aprobado, y la etiqueta de cierre de fase.','PR #1 a #5 fusionados · etiqueta v0.1.5',DV),
 'X-02':('D','La URL pública carga la app desde un dispositivo ajeno al proyecto.','—',DV),
 'MT-01':('D','Tempo de 30 a 250 con la barra vertical (también con el teclado), con − y + y marcando a ritmo, con su nombre italiano; arranca y para con un toque; en vertical y en horizontal sin aviso de girar.',B+': barra con teclado, − y +, «Marcar» (media y reinicio tras 2 s), límites, nombre del tempo, Empezar y Parar · comprobar-disposicion: cinco pantallas',C21),
 'MT-02':('T','Los doce compases dan su número de pulsos (6/8, 9/8 y 12/8: 2, 3 y 4) y un punto por pulso; con acento, el primer pulso suena más agudo y fuerte, y sin él todos iguales.',B+': puntos por compás, golpes con y sin acento, ventana que se abre y se cierra, datos guardados y validados',C21),
 'MT-03':('T','Cada figura reparte el pulso en 1, 2, 3 o 4 golpes iguales, más suaves que el pulso; cambiarla sonando empieza en el próximo pulso, sin mover el pulso.',B+': separación de las corcheas, volumen menor, cambio sonando',C21),
 'MT-04':('T','Los golpes programados a 30, 120 y 250 ppm se separan exactamente 60/tempo s (±1 ms) y nunca se programan más de 300 ms por adelantado; 60 s a 250 ppm con tirones de hasta 0,25 s no pierden ni mueven ningún golpe (el banco prueba hasta 0,27 s); Parar y los cambios en marcha retiran lo apuntado sin repetir ni adelantar golpes; la luz del pulso se enciende cuando se oye (con 0,2 s de latencia declarada, 0,2 s después); al ocultar la app se para.',B+': separación a 30, 120 y 250 ppm; 60 s a 250 ppm con tirones; Parar, tempo, acento, compás y figura con golpes ya apuntados, y dos cambios seguidos; la luz con latencia declarada y con getOutputTimestamp; parada al ocultar · herramientas/medir-metronomo.js en Chromium (0.6.7: 0 de 64 perdidos; 0.6.6: 10 de 63; la latencia de Chromium sin altavoz no es la de un móvil)',C21),
 'MT-05':('D','El metrónomo tiene su pestaña; en marcha, sigue sonando en las demás áreas y su pestaña late con el pulso; al escuchar con el micrófono se para y lo dice; tempo, compás, figura y acento se recuerdan.',B+': sigue en Libre y en el Afinador hasta escuchar con el micrófono, pestaña que late, parada con el micrófono y aviso, datos guardados',C21),
 'MT-06':('D','Pesa arriba, 30 ppm, y abajo, 250. Sonando, la barra llega a un extremo en cada pulso, alternando los lados (hasta 30° a cada lado, sin salirse de la pantalla en ninguna disposición), y pasa por el centro entre dos; la subdivisión no la mueve. Recta parada, al arrastrarla y con «reducir movimiento». En el instante de cada pulso está en su extremo (±0,2° en el banco). Tocar la pesa donde se ve, aunque esté inclinada, no cambia el tempo. Con el teclado, ↑ sube el tempo.',B+': extremos alternos en cada pulso, centro a medio camino, la subdivisión no cuenta (4/4 en corcheas y 6/8), recta al arrastrar, al parar, al perder el dedo y con «reducir movimiento», pesa arriba = 30 ppm y abajo = 250, tocar la pesa inclinada no la mueve, amplitud que cabe y que se mide de nuevo tras girar en otra área, sin salto al cambiar de tempo en marcha, cambiar de compás no pierde pulsos; las pruebas fallan con la versión anterior · Chromium: ±30° en iPhone vertical y ordenador, ±12,7° en horizontal, y 12,7° al volver tras girar en otra área, nunca fuera de la pantalla · comprobar-disposicion: ocho pantallas del metrónomo · AR-14 y AT-13; con latencia de salida, llega al extremo cuando se oye el pulso (F5.8 #7)',C22),
 'AC-01':('T','Arriba, dos filas de botones (las 7 notas y los 7 tipos) con las que se llega a los 30 acordes y a ninguno más; un tipo inexistente se apaga y no hace nada; al cambiar de nota se conserva el tipo si existe; debajo, el mástil; cada digitación suena solo a notas del acorde, con la raíz, la nota que define el tipo (la tercera, o la cuarta en sus4) y la séptima si la lleva (la quinta se puede omitir), y con la raíz o el bajo indicado como nota más grave.',B+': las 30 digitaciones, una a una; botones, apagados y conservar el tipo (F5.8 #6) · comprobar-disposicion: botones y mástil a la vez en nueve pantallas, ninguno de menos de 40 px con el dedo',C21),
 'AC-02':('D','Cada dedo tiene su número y su color, iguales en todos los acordes (Okabe-Ito); círculo ≥ 3:1 contra el mástil y número ≥ 4,5:1 contra el círculo; ○ y ✕ junto al nombre de la cuerda; cejilla como barra; el lector de pantalla dice el dedo.',B+': La menor y Fa dibujados, contraste de los cuatro colores · comprobar-accesibilidad: Acordes con Fa',C21),
 'AC-03':('N/A','Retirado en la 0.6.5 (F5.8 #6): en Acordes no se ve el pentagrama; las notas siguen junto al nombre.','—',C21),
 'AC-04':('T','El acorde suena rasgueado de grave a agudo al elegirlo y con «Tocar»; cada cuerda se puede tocar suelta.',B+': orden del rasgueo · cada casilla suena suelta como en todo el mástil (F1.1 #2)',C21),
 'AC-05':('T','Con otra afinación, Acordes avisa, no dibuja las digitaciones y «Pasar a estándar» las recupera.',B+': Drop D y vuelta a la estándar',C21),
 'AC-06':('N/A','Retirado en la 0.6.5 (F5.8 #6): lo sustituye la elección por nota y tipo (AC-01).','—',C21),
 'AC-07':('D','En Acordes se ven los trastes 0 a 5 y ninguno más, a todo el ancho y sin desplazamiento; sin pentagrama, zoom ni aviso para girar; el zoom guardado no cambia y vuelve al salir.',B+': 1200 px / 5 = 240 px por traste y vuelta a 12 trastes al salir; ninguna digitación pasa del 5; el teclado no pasa del 5 y el foco vuelve al 0 al entrar · comprobar-disposicion: nueve pantallas, aviso oculto',C12),
 'X-03':('D','La app instalada desde la web funciona en un Android, un iPhone y un Windows reales.','—',DV),
}
BENCH = {'G-10','D-01','D-02','D-04','J-02','J-07','J-08','J-10','J-12','A-10','V-09','C-05','L-02'}
PARTIAL = {'G-03','G-04','V-01','V-04','C-07','G-05','G-06','PL-04','G-07','S-01','X-01',
           'E-01','E-02','E-03','E-04','E-05b','E-06','E-07','E-08','E-09','E-10','P-03','MT-01','MT-04','MT-05','MT-06','AC-01','AC-02','AC-07','G-13','V-10','V-11','J-14','V-12'}   # F5: banco hecho, falta tu prueba (CP-5, AR-12 #1)   # con evidencia, pero sin cumplir aún todo el criterio
DECL = {'si':'Cumple','parcial':'Cumple parcialmente','no':'No cumple'}
WHO = {'I':'Auditor de requisitos','A':'Auditor técnico','D':'Cliente','T':'Banco automático + auditor técnico','I+T':'Auditor técnico','N/A':'—'}

S1 = {'G-01': 'A01', 'G-02': 'A12', 'G-05': 'A18, C05 y C06', 'G-07': 'B02, B03, B04 y C09', 'L-01': 'A01', 'L-02': 'A10', 'L-03': 'E03', 'S-03': 'A14', 'P-01': 'A05', 'P-04': 'A13', 'N-01': 'A06', 'N-03': 'A06', 'N-04': 'A06', 'V-01': 'C02, C03 y D03', 'V-04': 'A07, A08 y C04', 'V-05': 'A08', 'V-06': 'A07', 'V-07': 'A08', 'V-09': 'A11', 'D-04': 'A11', 'D-05': 'A03 y E03', 'D-06': 'E03', 'A-08': 'A13', 'J-02': 'E04', 'J-03': 'E04', 'J-04': 'E04', 'J-05': 'E04', 'J-06': 'E04', 'J-07': 'E04', 'J-09': 'A09 y E04', 'J-12': 'A10', 'C-01': 'A19 y C05', 'C-04': 'A19', 'C-05': 'A14 y A15', 'C-07': 'A17'}   # prueba de la Sesión 1 que valida cada requisito (informe V-08)
rows = []
missing = [r['id'] for r in data['reqs'] if r['id'] not in V]
assert not missing, missing
for r in data['reqs']:
    m, crit, ev, orig = V[r['id']]
    etapas = [e.strip() for e in r['etapa'].split('·')]
    fases = []
    for e in etapas:
        f = e.split('.')[0] if e.startswith('F') else e
        if f not in fases: fases.append(f)
    decl = 'No aplica' if m == 'N/A' else DECL[r['impl']]
    if m == 'N/A': ver = 'No aplica'
    elif r['valid'] == 'si': ver = 'Verificado'
    elif r['id'] in BENCH or r['id'] in PARTIAL or r['id'] == 'P-01': ver = 'Verificado parcialmente'
    else: ver = 'Pendiente'
    who = WHO[m]
    if r['cat'] == 'PL' or r['id'] in ('X-03','A-02','A-05','F'): who = 'Cliente'
    rows.append(dict(id=r['id'], cat=CATN[r['cat']], req=plain(r['text']), prio=r['prio'], orig=orig,
        fase=' · '.join(fases), etapa=r['etapa'], met=m, crit=crit, decl=decl, ver_app=r['desde'] or '—',
        ev=ev + (' · Sesión 1: ' + S1[r['id']] if r['id'] in S1 and r['valid'] == 'si' else ''), verif=ver, who=who, com=plain(r['notas']), flag={'nuevo':'Nuevo','mod':'Modificado','':''}[r['flag']]))

# ------------------------------------------------------------------ Excel
wb = Workbook()
F = 'Arial'
ws = wb.active; ws.title = 'Matriz'
dark = PatternFill('solid', fgColor='2A1D13'); amber = PatternFill('solid', fgColor='F3D9B5')
edit = PatternFill('solid', fgColor='FFF7CC')
thin = Side(style='thin', color='D9CFC0'); border = Border(bottom=thin, right=thin)
COLS = [('ID',10,'id'),('Categoría',16,'cat'),('Requisito',46,'req'),('Prioridad',10,'prio'),('Origen',18,'orig'),
        ('Fase',9,'fase'),('Etapa',13,'etapa'),('Método',9,'met'),('Criterio de aceptación',48,'crit'),
        ('Declaración del proveedor',20,'decl'),('Desde versión',10,'ver_app'),('Evidencia',34,'ev'),
        ('Estado de verificación',21,'verif'),('Verifica',20,'who'),('Comentario del proveedor',44,'com'),
        ('Comentario del cliente',32,None),('Cambio en v' + VER['matriz'],12,'flag')]
ws['A1'] = 'Trasteando — Matriz de cumplimiento de requisitos'
ws['A1'].font = Font(name=F, size=14, bold=True, color='2A1D13')
ws['A2'] = 'Versión ' + VER['matriz'] + '. Base: requisitos.md v' + VER['doc'] + ' · app ' + VER['app'] + ' · roadmap ' + VER['roadmap'] + ' · emitida el 15/10/2026. Cliente: Pablo Díaz Guerra. Proveedor: chat de Desarrollo. Verificación independiente: auditores de requisitos y técnico.'
ws['A2'].font = Font(name=F, size=9, color='6A5947')
HR = 4
for c, (h, w, _) in enumerate(COLS, 1):
    cell = ws.cell(row=HR, column=c, value=h)
    cell.font = Font(name=F, size=10, bold=True, color='FFFFFF'); cell.fill = dark
    cell.alignment = Alignment(wrap_text=True, vertical='center')
    ws.column_dimensions[get_column_letter(c)].width = w
ws.row_dimensions[HR].height = 30
WRAP = {'req','crit','ev','com','orig','etapa','who','decl','verif','cat'}
for i, r in enumerate(rows):
    rr = HR + 1 + i
    lines = 1
    for c, (h, w, key) in enumerate(COLS, 1):
        val = r[key] if key else None
        cell = ws.cell(row=rr, column=c, value=val)
        cell.font = Font(name=F, size=9, bold=(key == 'id'))
        cell.alignment = Alignment(wrap_text=True, vertical='top')
        cell.border = border
        if key is None: cell.fill = edit
        if key in WRAP and val:
            lines = max(lines, math.ceil(len(str(val)) / max(1, (w - 2) * 1.05)))
    ws.row_dimensions[rr].height = min(15 * lines + 3, 120)
last = HR + len(rows)
ws.freeze_panes = 'B5'
ws.auto_filter.ref = 'A%d:%s%d' % (HR, get_column_letter(len(COLS)), last)
def col(key): return get_column_letter([k for _,_,k in COLS].index(key) + 1)
cD, cV, cM, cF = col('decl'), col('verif'), col('met'), col('fase')
dv1 = DataValidation(type='list', formula1='"Cumple,Cumple parcialmente,No cumple,No aplica"', allow_blank=False)
dv2 = DataValidation(type='list', formula1='"Verificado,Verificado parcialmente,Pendiente,No aplica"', allow_blank=False)
dv3 = DataValidation(type='list', formula1='"I,A,D,T,I+T,N/A"', allow_blank=False)
for dv, c in ((dv1, cD), (dv2, cV), (dv3, cM)):
    dv.error = 'Elige un valor de la lista. Están descritos en la hoja Leyenda.'; dv.errorTitle = 'Valor no válido'
    ws.add_data_validation(dv); dv.add('%s%d:%s%d' % (c, HR + 1, c, last))
def fill(hex_): return PatternFill('solid', fgColor=hex_, bgColor=hex_)
for c in (cD, cV):
    rng = '%s%d:%s%d' % (c, HR + 1, c, last); top = '%s%d' % (c, HR + 1)
    ws.conditional_formatting.add(rng, FormulaRule(formula=['%s="Cumple"' % top], fill=fill('D6EFDF')))
    ws.conditional_formatting.add(rng, FormulaRule(formula=['%s="Verificado"' % top], fill=fill('D6EFDF')))
    ws.conditional_formatting.add(rng, FormulaRule(formula=['OR(%s="Cumple parcialmente",%s="Verificado parcialmente")' % (top, top)], fill=fill('F8E7C2')))
    ws.conditional_formatting.add(rng, FormulaRule(formula=['%s="No cumple"' % top], fill=fill('EDE7E1')))
    ws.conditional_formatting.add(rng, FormulaRule(formula=['%s="No aplica"' % top], fill=fill('E3E8EE')))

# ------------------------------------------------------------------ Resumen
rs = wb.create_sheet('Resumen')
rs['A1'] = 'Resumen de cumplimiento'; rs['A1'].font = Font(name=F, size=14, bold=True, color='2A1D13')
rs['A2'] = 'Todas las cifras son fórmulas sobre la hoja Matriz: cambian solas al actualizar una declaración o un estado. Un requisito asignado a dos fases cuenta en las dos; el total cuenta cada requisito una vez.'
rs['A2'].font = Font(name=F, size=9, color='6A5947')
H = ['Fase','Requisitos','Cumple','Cumple parcialmente','No cumple','No aplica','% que cumple','Verificados','Verificados parcialmente']
for c, h in enumerate(H, 1):
    cell = rs.cell(row=4, column=c, value=h); cell.font = Font(name=F, size=10, bold=True, color='FFFFFF'); cell.fill = dark
    cell.alignment = Alignment(wrap_text=True, vertical='center')
widths = [16,12,11,14,12,11,13,12,14]
for c, w in enumerate(widths, 1): rs.column_dimensions[get_column_letter(c)].width = w
rs.row_dimensions[4].height = 30
NAMES = data['phase_names']
PH = ['F1','F2','F3','F4','F5','F6','F7','Posterior']
M = "Matriz!$%s$%d:$%s$%d"
rngF = M % (cF, HR+1, cF, last); rngD = M % (cD, HR+1, cD, last); rngV = M % (cV, HR+1, cV, last)
rngID = M % ('A', HR+1, 'A', last)
for i, ph in enumerate(PH):
    r = 5 + i
    rs.cell(row=r, column=1, value=ph + (' · ' + NAMES[ph] if ph in NAMES and ph != 'Posterior' else ' · fuera de alcance'))
    pat = '"*%s*"' % ph
    rs.cell(row=r, column=2, value='=COUNTIF(%s,%s)' % (rngF, pat))
    for c, v in ((3,'Cumple'),(4,'Cumple parcialmente'),(5,'No cumple'),(6,'No aplica')):
        rs.cell(row=r, column=c, value='=COUNTIFS(%s,%s,%s,"%s")' % (rngF, pat, rngD, v))
    rs.cell(row=r, column=7, value='=IFERROR(C%d/B%d,0)' % (r, r))
    rs.cell(row=r, column=8, value='=COUNTIFS(%s,%s,%s,"Verificado")' % (rngF, pat, rngV))
    rs.cell(row=r, column=9, value='=COUNTIFS(%s,%s,%s,"Verificado parcialmente")' % (rngF, pat, rngV))
tr = 5 + len(PH)
rs.cell(row=tr, column=1, value='Total del producto')
rs.cell(row=tr, column=2, value='=COUNTA(%s)' % rngID)
for c, v in ((3,'Cumple'),(4,'Cumple parcialmente'),(5,'No cumple'),(6,'No aplica')):
    rs.cell(row=tr, column=c, value='=COUNTIF(%s,"%s")' % (rngD, v))
rs.cell(row=tr, column=7, value='=IFERROR(C%d/B%d,0)' % (tr, tr))
rs.cell(row=tr, column=8, value='=COUNTIF(%s,"Verificado")' % rngV)
rs.cell(row=tr, column=9, value='=COUNTIF(%s,"Verificado parcialmente")' % rngV)
for r in range(5, tr + 1):
    for c in range(1, 10):
        cell = rs.cell(row=r, column=c); cell.font = Font(name=F, size=10, bold=(r == tr)); cell.border = border
        if c == 7: cell.number_format = '0%'
    if r == tr:
        for c in range(1, 10): rs.cell(row=r, column=c).fill = amber
mr = tr + 3
rs.cell(row=mr - 1, column=1, value='Por método de verificación').font = Font(name=F, size=11, bold=True)
for j, (code, name) in enumerate([('I','Inspección'),('A','Análisis'),('D','Demostración'),('T','Prueba'),('I+T','Inspección y prueba'),('N/A','No aplica')]):
    rs.cell(row=mr + j, column=1, value=code + ' · ' + name).font = Font(name=F, size=10)
    c2 = rs.cell(row=mr + j, column=2, value='=COUNTIF(%s,"%s")' % (M % (cM, HR+1, cM, last), code)); c2.font = Font(name=F, size=10)

# ------------------------------------------------------------------ Leyenda
lg = wb.create_sheet('Leyenda')
lg.column_dimensions['A'].width = 28; lg.column_dimensions['B'].width = 95
items = [
 ('Qué es', 'Matriz de cumplimiento de requisitos entre el cliente, que define qué debe hacer el producto, y el proveedor, que lo construye y declara su grado de cumplimiento. Los auditores verifican de forma independiente. Equivale a una matriz de verificación cruzada (VCRM) de ingeniería de sistemas.'),
 ('Roles', 'Cliente: Pablo Díaz Guerra. Proveedor: chat de Desarrollo, o el agente desarrollador en el modo acelerado. Verificación independiente: auditor de requisitos y auditor técnico.'),
 ('Qué celdas editas tú', 'La columna «Comentario del cliente», en amarillo. Las declaraciones y los estados los actualiza el proveedor en cada entrega; tú los aceptas o los discutes en tu comentario.'),
 ('Ejemplo de comentario del cliente', 'Aceptado en Chrome. Repetir en Firefox antes de marcarlo como verificado.'),
 ('Método · I', 'Inspección: se comprueba mirando el producto, el código o la documentación, sin ejecutar nada especial.'),
 ('Método · A', 'Análisis: se comprueba con un cálculo o un razonamiento sobre todos los casos, por ejemplo el rango completo del pentagrama.'),
 ('Método · D', 'Demostración: se usa la app y se observa que hace lo pedido.'),
 ('Método · T', 'Prueba: se mide con un procedimiento repetible y un resultado esperado, normalmente el banco de pruebas automático.'),
 ('Declaración del proveedor', 'Cumple · Cumple parcialmente · No cumple (aún no implementado, planificado en su etapa) · No aplica (fuera de alcance).'),
 ('Estado de verificación', 'Verificado: superó su criterio de aceptación con el método indicado. Verificado parcialmente: hay evidencia, pero falta parte del método, por ejemplo la demostración en un navegador real. Pendiente: sin evidencia todavía.'),
 ('Evidencia', '«Banco (node --test)» son las pruebas automáticas de tests/banco.test.js: arrancan la app en un navegador simulado, sin instalar nada (15 pruebas y 1 pendiente en la 0.1.4). «F1.1 #n» es la comprobación número n de la lista de F1.1 del roadmap, que se hace en la Sesión 1. samples/afinacion.json es la medición de la afinación de cada muestra.'),
 ('Regla de cierre', 'Una etapa del roadmap se cierra cuando todos sus requisitos están en «Cumple» y «Verificado». En el modo acelerado esta regla es el criterio de parada de cada iteración automática.'),
]
for i, (a, b) in enumerate(items, 1):
    lg.cell(row=i, column=1, value=a).font = Font(name=F, size=10, bold=True)
    c = lg.cell(row=i, column=2, value=b); c.font = Font(name=F, size=10); c.alignment = Alignment(wrap_text=True, vertical='top')
    lg.cell(row=i, column=1).alignment = Alignment(vertical='top')
    lg.row_dimensions[i].height = 15 * max(1, math.ceil(len(b) / 92)) + 4
lg.cell(row=4, column=2).fill = edit

# ------------------------------------------------------------------ Control de cambios
cc = wb.create_sheet('Control de cambios')
for c, (h, w) in enumerate([('Versión',10),('Fecha',12),('Requisitos',12),('App',8),('Cambios',90)], 1):
    cell = cc.cell(row=1, column=c, value=h); cell.font = Font(name=F, size=10, bold=True, color='FFFFFF'); cell.fill = dark
    cc.column_dimensions[get_column_letter(c)].width = w
for i, row_ in enumerate(CC, 2):
    for c, v in enumerate(row_, 1):
        cell = cc.cell(row=i, column=c, value=v); cell.font = Font(name=F, size=10); cell.alignment = Alignment(wrap_text=True, vertical='top')
    cc.row_dimensions[i].height = 46
wb.save(OUT_XLSX)

# ------------------------------------------------------------------ Markdown para los auditores
L = []
w = L.append
w('# Trasteando — Matriz de cumplimiento de requisitos\n')
w('**Versión:** ' + VER['matriz'] + ' · **Fecha:** ' + VER['fecha'] + ' · **Base:** `requisitos.md` v' + VER['doc'] + ' · app `' + VER['app'] + '` · `roadmap.md` v' + VER['roadmap'] + '  ')
w('**Cliente:** Pablo Díaz Guerra · **Proveedor:** chat de Desarrollo · **Verificación independiente:** auditores\n')
w('> Versión en texto de `matriz-cumplimiento.xlsx`, para que los auditores puedan leerla. El texto de cada requisito está en `requisitos.md`; aquí va cómo se demuestra que se cumple. El historial hasta la 1.25 está en `docs/historico/matriz-cumplimiento.md`.\n')
w('**Métodos:** I inspección · A análisis · D demostración · T prueba. **Regla de cierre:** una etapa se cierra cuando todos sus requisitos están en *Cumple* y *Verificado*.\n')
for c in CC: w('**Cambios en la {}** ({}): {}\n'.format(c[0], c[1], c[4]))
from collections import Counter
cd = Counter(r['decl'] for r in rows); cv = Counter(r['verif'] for r in rows)
w('| Total | Cumple | Cumple parcialmente | No cumple | No aplica | Verificados | Verificados parcialmente |')
w('|:---:|:---:|:---:|:---:|:---:|:---:|:---:|')
w('| {} | {} | {} | {} | {} | {} | {} |\n'.format(len(rows), cd['Cumple'], cd['Cumple parcialmente'], cd['No cumple'], cd['No aplica'], cv['Verificado'], cv['Verificado parcialmente']))
w('| ID | Etapa | Método | Criterio de aceptación | Declaración | Evidencia | Verificación | Origen |')
w('|---|---|:---:|---|---|---|---|---|')
for r in rows:
    w('| **{id}** | {etapa} | {met} | {crit} | {decl} | {ev} | {verif} | {orig} |'.format(**r))
w('\n*Gestionada por el chat de Desarrollo. Los auditores la leen y proponen cambios a criterios, métodos o evidencias en sus informes.*')
open(OUT_MD, 'w', encoding='utf-8').write('\n'.join(L) + '\n')
print('filas', len(rows), '| declaración', dict(cd), '| verificación', dict(cv))
