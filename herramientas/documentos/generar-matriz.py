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

def plain(s):
    s = re.sub(r'\*\*([^*]+)\*\*', r'\1', s or '')
    s = re.sub(r'`([^`]+)`', r'\1', s)
    s = re.sub(r'\*([^*]+)\*', r'\1', s)
    return s.strip()

# id: (método, criterio de aceptación, evidencia, origen)
C20='Cliente · 20/10 (interfaz.md v1.0)'; CL='Cliente · listado 14/09'; C21='Cliente · 21/10'; AR='AR-01'; DV='Desarrollo · v1.1'; C15='Cliente · 15/09'; C14='Cliente · 14/10'; D12='Desarrollo · v1.2'; RC='Revisión de código 0.1.2'
B='Banco (node --test)'; MF='Desarrollo · medición F2.1'
V = {
 'G-01':('I','El nombre «Trasteando» aparece en la pantalla de entrada, en la pestaña del navegador y en el manifiesto; en horizontal, arriba del panel.','F1.1 #14 · 0.5.2: comprobar-disposicion, título visible en horizontal',CL),
 'G-02':('D','La navegación muestra las seis áreas (Libre, Adivinar, Afinador, Escalas, Acordes y Metrónomo) y cada destino abre su vista.','F1.1 #1 y #14 · 0.5.5: comprobar-disposicion, seis pestañas en todas las pantallas',CL),
 'G-03':('T','F6.2: tras una primera carga en localhost y sin red, la app abre y suena. F7.2: lo mismo desde la web publicada.','—',CL),
 'G-04':('D','Desde la web publicada, el navegador ofrece instalarla y abre a pantalla completa desde el icono.','—',CL),
 'G-05':('I+T','Todo control es alcanzable con teclado y muestra el foco; contrastes ≥ 4,5:1 medidos; el movimiento se reduce con prefers-reduced-motion; en pantallas táctiles, todo control y toda casilla del mástil mide al menos 40 × 40 px en la vista por defecto, salvo las cuerdas en vertical con menos de 660 px de alto y los trastes que el usuario estreche con «+» (hasta 28 px). Paleta por nota: las 7 naturales a ≥ 7,5 (OKLab × 100) entre sí con visión normal y con protanopía, deuteranopía y tritanopía simuladas, y las 12 a ≥ 8 con visión normal; el nombre de la nota siempre escrito.','V-07: comprobar-accesibilidad.js (teclado, contraste, movimiento) · paleta.py · V-06: 40 × 40 px · '+B+': teclado, etiquetas, paleta, grises, fila y asa',C20),
 'G-06':('I','CREDITOS.md lista cada recurso de terceros con su origen y su licencia, y la app muestra el texto de atribución en Ajustes.','CREDITOS.md (F2.1). Falta mostrarlo en la app (F6.4)',DV),
 'G-07':('T','En Windows (y Android cuando lo haya), con el ordenador en modo avión, dist/trasteando.html abre con doble clic en ≤ 3 s, suenan las grabaciones y funcionan Libre, Adivinar y el afinador por referencia. Audio ≤ 1,45 MB y archivo ≤ 2 MB.','V-03 y V-04: desde disco y sin conexión en Chromium, abre en 0,3 s y suena a menos de 1 cent · '+B+': autónomo al día, con su audio, huellas y límites',C15),
 'G-08':('T','El archivo autónomo generado y la web publicada superan el mismo banco de pruebas.',B+' en dos pasadas: banco.test.js y escalas.test.js contra la app de varios archivos y contra el autónomo (autonomo.test.js), que además lee de dentro sus 17 grabaciones (huellas sha256) sin descargar nada; una sola vez, lo que lee el repositorio o compara las formas · el autónomo es exactamente la app ensamblada más su audio · comprobar-autonomo (Chromium, file:// y sin conexión: 0,15 s, ninguna conexión, error con módulo y línea exactos) · comprobar-en-navegador · CHANGELOG 0.6.0 · IT-04 · AR-13 y AT-12',C15),
 'G-09':('I','Ficha enviada a revisión en al menos una tienda, o decisión documentada de no hacerlo.','—',C14),
 'G-10':('I','Ajustes muestra la versión; CHANGELOG.md tiene una entrada por versión; existe la etiqueta de Git de cada cierre de fase.',B+' · CHANGELOG.md · F1.1 #12 · etiquetas v0.1.5, v0.2.3 y v0.3.3 (21/10)',C14),
 'G-12':('D','En Ajustes, Español / English cambia todos los textos de la app; la elección se guarda; la primera vez sigue al navegador.',B+': mismas claves en las dos lenguas, cambio y vuelta, primera vez según el navegador · comprobar-disposicion.js con IDIOMA=en-US',CL),
 'G-11':('I','La política de privacidad está publicada y la app no envía ninguna petición con datos del usuario (pestaña Red).','—',D12),
 'PL-01':('D','La lista de F1.1 se supera en Chrome, Edge y Firefox en Windows, y la app se instala como PWA desde Edge.','—',C14),
 'PL-02':('D','La lista de comprobación se supera en Chrome para Android, en web y con la PWA instalada.','—',C14),
 'PL-04':('I+T','Cada capacidad del navegador que usa la app figura en docs/compatibilidad.md con su comportamiento en Windows, Android e iPhone y su alternativa; el banco arranca la app sin vibración ni audio y funciona.','docs/compatibilidad.md v1.5 · '+B+': sin matchMedia ni history',C14),
 'PL-03':('D','La lista de comprobación se supera en Safari para iOS, en web y desde la pantalla de inicio.','—',C14),
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
 'P-03':('D','El pentagrama funciona en Libre, Adivinar y Escalas.',B+': la escala escrita en el pentagrama (8 notas en Mostrar; las encontradas en Práctica)',CL),
 'P-04':('D','El afinador muestra en un pentagrama las seis notas de la afinación activa.','F1.1 #14',CL),
 'L-01':('D','Al abrir la app se muestra el modo Libre.','F1.1 #14',CL),
 'L-02':('D','Con «Ver todas las notas» se ven todos los nombres; sin él, solo el de la nota pulsada.',B+' · F1.1 #10',CL),
 'L-03':('D','Al pulsar una nota se señalan las demás posiciones con el mismo sonido exacto y ninguna de otra octava.','F1.1 #14',CL),
 'J-01':('D','En Adivinar nada suena hasta pulsar ▶ (resaltado); antes de ▶ el mástil suena pero no puntúa; después cada reto suena solo y ▶ lo repite. La lectura grande y el pentagrama muestran la nota que tocas (0.4.1); la buscada, solo con la pista de nombre o al responder.','F1.1 #14 · '+B+': ▶, y lectura de la nota tocada con las pistas aparte · Sesión 1: C07 y E04',CL),
 'J-02':('T','Cualquier posición con el mismo sonido cuenta como acierto.',B+': acierto',CL),
 'J-03':('D','Tras acertar se señalan las demás posiciones válidas.','F1.1 #14',CL),
 'J-04':('D','La pista «Nombre» muestra el nombre y la octava de la nota que suena.','F1.1 #14',CL),
 'J-05':('D','La pista «Cuerda» lista las cuerdas donde puede estar la nota.','F1.1 #14',CL),
 'J-06':('D','Las dos pistas se activan con chips visibles en Adivinar, sin abrir Ajustes; encendidas, enseñan su respuesta en grande (0.4.1).','F1.1 #14 · '+B+': pistas grandes, también antes de ▶',CL),
 'J-07':('T','La racha sube con cada acierto y vuelve a 0 con cada fallo.',B+': acierto y fallo',CL),
 'J-08':('T','El récord de cada afinación persiste tras recargar y tras «Restablecer todos los ajustes»; solo «Borrar los récords de racha» los pone a cero.',B+': récords por afinación guardados y restablecer · F1.1 #13 · Sesión 1: A15',CL),
 'J-09':('D','Acierto y fallo se distinguen al instante por color y destello.','F1.1 #9',CL),
 'J-10':('T','Tras un fallo se marca la pulsada (relleno rojo y ✗); a los 1,2 s suena la nota buscada y se iluminan todas sus posiciones (relleno verde y ✓); 3 s después llega un reto nuevo limpio.',B+': 8 comprobaciones · F1.1 #9 · Sesión 1: A09',CL),
 'J-11':('T','Cada afinación guarda su récord; el récord único de antes pasa a Estándar; cambiar de afinación empieza la racha.',B+': récord por afinación, migración y cambio de afinación',DV),
 'J-13':('T','Por defecto, «Reintentar»: un fallo rompe la racha pero el reto sigue; «Ver la respuesta» la enseña y suena; acertar tras fallar no suma. Con «Ver respuesta», como J-10.',B+': modo reintentar, ajuste guardado y valor por defecto; dos fallos seguidos no dejan casillas rojas (AT-09)',C21),
 'J-12':('T','Con «Ver todas las notas» activo, Adivinar no muestra los nombres.',B+' · F1.1 #10',RC),
 'E-01':('D','Se puede elegir tónica y tipo de escala entre el catálogo aprobado (mayor, menor natural, pentatónicas mayor y menor; 21/10).',B+': selectores de tónica y tipo',CL),
 'E-02':('T','Para cada tónica y tipo, las posiciones generadas coinciden con una referencia externa en afinación estándar.','tests/escalas.test.js: las 24 mayores y menores con siete letras, sin mezclar ♯ y ♭ ni dobles alteraciones, y 16 de ellas nota a nota frente al libro; pentatónicas dentro de su escala; casillas por clase de altura',CL),
 'C-08':('N/A','Fuera del alcance actual.','—',CL),
 'S-09':('N/A','Fuera del alcance actual.','—',CL),
 'E-02b':('N/A','Fuera del alcance actual.','—',AR),
 'E-03':('D','Mostrar ilumina únicamente las notas de la escala, con su nombre escrito y la tónica con anillo.',B+': casillas de Do mayor y de Fa mayor (Si♭)',CL),
 'E-04':('D','Las notas de la escala muestran su nombre y la línea de notas indica el intervalo T, ST o T½ respecto al grado anterior.',B+': «Do T Re T Mi ST Fa…» y la pentatónica menor',CL),
 'E-05':('T','En Práctica, una nota ajena marca error e ilumina las correctas; una nota de la escala no marca error.',B+': conteo de notas distintas, fallo, revelado y reinicio; reinicio al cambiar de afinación (AT-09)',CL),
 'E-05b':('N/A','Fuera del alcance actual.','—',AR),
 'E-06':('D','El guiado avanza nota a nota por la escala.',B+': pasos que suenan y se resaltan, de la tónica grave a su octava',CL),
 'A-01':('D','Pulsar cada cuerda en el afinador reproduce su nota de referencia.','F1.1 #14',CL),
 'A-02':('D','Con una guitarra real, el afinador indica subir o bajar hasta dejarla afinada, en estándar y en una alternativa.','comprobar-afinador.js (Chromium, grabación real 12 cents baja → «La2 · −11 cents · Sube un poco»; hilo aparte; se apaga al salir) · '+B+': flujo del permiso',CL),
 'A-02-CA':('T','Banco de pruebas: error ≤ ±2 cents y latencia < 300 ms sobre muestras desafinadas una cantidad conocida, tomando como referencia su frecuencia medida en samples/afinacion.json.','tests/tono.test.js: 12 grabaciones reales de −45 a +40 cents; peor error 1,86 cents frente a su medida y 1,01 trozo a trozo; aguja en su nota en ≤ 168 ms + 3 ms de cálculo',AR),
 'A-03':('D','La aguja indica la desviación en cents y marca «afinado» dentro de ±5 cents.',B+': «Sube un poco» a −12, «Afinada» a +3 · comprobar-afinador.js',CL),
 'A-04':('T','Con la cuerda a menos de un semitono de su nota, el afinador identifica la cuerda correcta.',B+': las 6 cuerdas a −90 y +90 cents, y la 6ª en Drop D',CL),
 'A-05':('D','Con una cuerda fijada a mano, el afinador la usa como referencia aunque esté muy desafinada.',B+': 6ª elegida con un La2 sonando → +500 cents, y sin confundir la octava',CL),
 'A-06':('I','La afinación estándar es E2 A2 D3 G3 B3 E4.','F1.1 #14',CL),
 'A-07':('I','Existen Drop D, medio tono abajo, Open G, Open D y DADGAD con sus notas correctas.','F1.1 #14',CL),
 'A-08':('D','Los botones +/− mueven la cuerda un semitono y pasan a Personalizada sin alterar los presets.','F1.1 #4',CL),
 'A-09':('D','El pentagrama del afinador refleja la afinación seleccionada.','F1.1 #14',CL),
 'A-10':('T','Al cambiar de afinación, el mástil y los retos se rehacen con las nuevas notas.',B+': Drop D',CL),
 'A-11':('D','Tras recargar se mantiene la afinación, incluida la personalizada.','F1.1 #13',CL),
 'V-01':('D','En horizontal, con un alto útil de 268 px o más, cada cuerda mide al menos 40 px (iPhone en Safari e instalada; simulador de Android). En vertical, en pantallas táctiles de menos de 600 px de ancho y en Libre, Adivinar, Escalas y Acordes, aparece el aviso para girar; nunca en el Afinador ni en el Metrónomo; cerrado, no vuelve y «Restablecer» lo recupera.','V-06: comprobar-disposicion.js en 14 pantallas: 52,8 / 60,8 / 42,5 px · '+B+': aviso para girar',C20),
 'V-02':('D','El afinador se usa con comodidad en vertical y en horizontal.','F1.1 #14',CL),
 'V-03':('D','En una pantalla de 1280 px se ven los 24 trastes sin desplazarse.','F1.1 #14',CL),
 'V-04':('D','El zoom cambia los trastes visibles entre 3 y el máximo que cabe, y la etiqueta dice la cifra real; «+» enseña más trastes y «−» menos. Con pointer: coarse, la vista por defecto usa trastes de al menos 40 px y el usuario puede pedir más trastes, de hasta 28 px; si el zoom guardado pide más de los que caben, se muestran los que caben y lo guardado se conserva (V-08).','F1.1 #7 y #8 · V-06 · '+B+': 40 px por defecto, 28 con «+», orden de los botones',C20),
 'V-05':('D','Con el mástil más ancho que la pantalla se puede desplazar hasta el traste 24.','F1.1 #14',CL),
 'V-06':('D','Desplazarse no cambia el ancho de los trastes.','F1.1 #7',CL),
 'V-07':('D','Al redimensionar la ventana el mástil se reajusta sin perder el tramo visible.','F1.1 #7',CL),
 'V-08':('D','El zoom se mantiene tras recargar y tras girar el móvil.','F1.1 #13',CL),
 'V-09':('T','El modo Guía mantiene visibles solo los números de los trastes con marca.',B+' · F1.1 #11',AR),
 'C-01':('D','El botón de Ajustes abre el panel desde cualquier pantalla y Escape lo cierra.','F1.1 #14',CL),
 'C-02':('I','El panel contiene todos los ajustes listados, el idioma (0.4.2) y la versión de la app.','F1.1 #12 · '+B+': grupo Idioma',CL),
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
 'MT-04':('T','Los golpes programados a 30, 120 y 250 ppm se separan exactamente 60/tempo s (±1 ms), nunca se programan más de 100 ms por adelantado y el punto del pulso se ilumina; al ocultar la app se para.',B+': separación a 30, 120 y 250 ppm, cambio de tempo sonando sin adelantar ni repetir, parada al ocultar',C21),
 'MT-05':('D','El metrónomo tiene su pestaña; en marcha, sigue sonando en las demás áreas y su pestaña late con el pulso; al escuchar con el micrófono se para y lo dice; tempo, compás, figura y acento se recuerdan.',B+': sigue en Libre y en el Afinador hasta escuchar con el micrófono, pestaña que late, parada con el micrófono y aviso, datos guardados',C21),
 'AC-01':('T','A un lado el listado (populares arriba, los 30 acordes debajo) y al otro el mástil; cada digitación suena solo a notas del acorde, con la raíz, la nota que define el tipo (la tercera, o la cuarta en sus4) y la séptima si la lleva (la quinta se puede omitir), y con la raíz o el bajo indicado como nota más grave.',B+': las 30 digitaciones, una a una; populares y listado · comprobar-disposicion: listado y mástil a la vez en seis pantallas',C21),
 'AC-02':('D','Cada dedo tiene su número y su color, iguales en todos los acordes (Okabe-Ito); círculo ≥ 3:1 contra el mástil y número ≥ 4,5:1 contra el círculo; ○ y ✕ junto al nombre de la cuerda; cejilla como barra; el lector de pantalla dice el dedo.',B+': La menor y Fa dibujados, contraste de los cuatro colores · comprobar-accesibilidad: Acordes con Fa',C21),
 'AC-03':('D','El pentagrama escribe las notas del acorde apiladas, escritas como manda el acorde, y se oculta con su ajuste; en el móvil en vertical se aparta y vuelve al girarlo.',B+': cinco notas de La menor; B7 con Re♯ · el ajuste de pentagrama de siempre (F1.1) · comprobar-disposicion: seis pantallas',C21),
 'AC-04':('T','El acorde suena rasgueado de grave a agudo al elegirlo y con «Tocar»; cada cuerda se puede tocar suelta.',B+': orden del rasgueo · cada casilla suena suelta como en todo el mástil (F1.1 #2)',C21),
 'AC-05':('T','Con otra afinación, Acordes avisa, no dibuja las digitaciones y «Pasar a estándar» las recupera.',B+': Drop D y vuelta a la estándar',C21),
 'AC-06':('T','El buscador deja los acordes que empiezan por lo escrito, sin distinguir mayúsculas y en las dos nomenclaturas; una letra sola, solo en la inglesa.',B+': G, g, Sol, D, Am, f# y vacío',C21),
 'X-03':('D','La app instalada desde la web funciona en un Android, un iPhone y un Windows reales.','—',DV),
}
BENCH = {'G-10','D-01','D-02','D-04','J-02','J-07','J-08','J-10','J-12','A-10','V-09','C-05','L-02'}
PARTIAL = {'V-01','V-04','C-07','G-05','G-06','PL-04','G-07','S-01','X-01',
           'E-01','E-02','E-03','E-04','E-06','P-03','MT-01','MT-05','AC-02','AC-03'}   # F5: banco hecho, falta tu prueba (CP-5, AR-12 #1)   # con evidencia, pero sin cumplir aún todo el criterio
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
        ('Comentario del cliente',32,None),('Cambio en v1.23',12,'flag')]
ws['A1'] = 'Trasteando — Matriz de cumplimiento de requisitos'
ws['A1'].font = Font(name=F, size=14, bold=True, color='2A1D13')
ws['A2'] = 'Versión 1.23. Base: requisitos.md v1.25 · app 0.6.0 · roadmap 3.23 · emitida el 15/10/2026. Cliente: Pablo Díaz Guerra. Proveedor: chat de Desarrollo. Verificación independiente: auditores de requisitos y técnico.'
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
CC = [
 ['1.23','22/10/2026','v1.25','0.6.0','F6.1: G-08 cumple y queda verificado por el banco, que pasa las pruebas que arrancan la app contra la app de varios archivos y contra el archivo autónomo (AR-13 y AT-12).'],
 ['1.22','22/10/2026','v1.24','0.5.7','Punto de control CP-5 (AR-12 y AT-11): una sola vara para lo que compruebas tú. E-01, E-02, E-03, E-04, E-06, P-03, MT-01, MT-05, AC-02 y AC-03, verificados parcialmente hasta la Sesión 2; MT-04, arranque con el audio en pausa (0.5.7); lo pendiente de CP-5, en el comentario de su requisito.'],
 ['1.21','21/10/2026','v1.23','0.5.6','Auditoría AR-11: G-02, C-04 y V-01 con las seis áreas; criterio de AC-01 preciso (sus4 y tríadas); evidencias completadas en MT-01, MT-05, AC-01, AC-03 y AC-04 (método T).'],
 ['1.20','21/10/2026','v1.22','0.5.5','AC-01 a AC-05 implementados y verificados por el banco (F5.7); AC-06 nuevo, el buscador; criterios al día con tu guía del listado.'],
 ['1.19','21/10/2026','v1.21','0.5.4','MT-01 a MT-05 implementados y verificados por el banco (F5.6); criterios del metrónomo al día con tu guía: un solo acento, doce compases, figuras.'],
 ['1.18','21/10/2026','v1.20','0.5.3','J-13 por defecto «Reintentar»; MT-05, el metrónomo con su pestaña; criterios de MT-01, AC-02, G-02 y N-06 completados; evidencias nuevas de G-01, P-01, N-06 y J-13 (AR-10 y AT-09); origen de los requisitos del 21/10 corregido.'],
 ['1.17','21/10/2026','v1.19','0.5.2','J-13 y N-06 nuevos, verificados por el banco; criterios de MT-01 a MT-05 y AC-01 a AC-05 (planificados).'],
 ['1.16','21/10/2026','v1.18','0.5.0','F5: criterios y evidencias de E-01 a E-06 y P-03; E-02 y E-05 verificados por el banco; E-04 con los intervalos en la línea de notas.'],
 ['1.15','21/10/2026','v1.17','0.4.2','G-12 nuevo (idioma); J-11 con criterio de banco, verificado; criterios de J-01 (lectura de la nota tocada), J-06 (pistas grandes), J-08 (récords por afinación) y C-02 (idioma).'],
 ['1.14','21/10/2026','v1.16','0.4.0','F4.1 a F4.3: evidencias del afinador por micrófono (A-02 a A-05, A-02-CA); A-02-CA y A-04 verificados por el banco; G-10 verificado con las etiquetas de F1 a F3.'],
 ['1.13','20/10/2026','v1.15','0.3.3','Sesión 1: 35 requisitos verificados en el iPhone y el PC del cliente (informe V-08), con la prueba que los valida en la evidencia. Criterios nuevos de J-01, J-08, J-10 y S-02 (pendientes de la Sesión 2); evidencia de S-01 (mudo en el iPhone) y PL-04; C-08 y S-09 nuevos, fuera de alcance.'],
 ['1.12','20/10/2026','v1.14','0.3.2','Criterios de V-04 y G-05: «+» enseña más trastes y el usuario puede pedir trastes de hasta 28 px con el dedo (comentario del cliente del 20/10).'],
 ['1.11','20/10/2026','v1.13','0.3.1','Etapa F3.4: G-05 cumple, verificado parcialmente hasta la Sesión 1. Su criterio añade los umbrales de la paleta (AR-06 #3).'],
 ['1.10','20/10/2026','v1.12','0.3.0','Etapa F3.2: V-01 y C-07 cumplen, verificados parcialmente hasta la Sesión 1. Criterios revisados: V-04 (lo guardado se conserva) y G-05 (excepción en vertical por debajo de 660 px de alto).'],
 ['1.9','20/10/2026','v1.11','0.2.3','Interfaz aprobada: C-06 verificado; C-07 nuevo; criterios revisados de V-01 (40 px con alto útil ≥ 268 px y aviso para girar), V-04 (trastes ≥ 40 px en pantallas táctiles), G-05 (controles de 40 × 40 px) y C-04 (navegación según la disposición).'],
 ['1.8','20/10/2026','v1.10','0.2.3','S-07 cumple y queda verificado: licencia CC BY de los 161 sonidos del pack de nylon.'],
 ['1.7','20/10/2026','v1.9','0.2.3','Evidencia de S-07: licencia de nylon comprobada en tres sonidos. Criterios sin cambios.'],
 ['1.6','19/10/2026','v1.8','0.2.3','CP-2: criterio de G-07 con los límites revisados y solo Windows y Android; X-01 cumple; evidencia de S-01 con la escucha del cliente (V-05).'],
 ['1.5','19/10/2026','v1.7','0.2.2','Criterio de S-08 según su nueva redacción: nota resultante a ±5 cents tras la corrección.'],
 ['1.4','19/10/2026','v1.6','0.2.1','G-07 y G-08 verificados parcialmente con el archivo autónomo (V-03 y banco); falta la prueba en cada plataforma (F2.5).'],
 ['1.3','19/10/2026','v1.5','0.2.0','S-08 verificado: la app usa sus grabaciones medidas (F2.2). Evidencias nuevas en S-01, S-07 y S-08: banco con todas las notas y grabación en el navegador (V-02).'],
 ['1.2','15/10/2026','v1.4','0.1.4','Nuevo PL-04: adaptabilidad entre sistemas, con docs/compatibilidad.md como evidencia. PL-02 sin Android de pruebas por ahora; X-02 con despliegue de pruebas previo.'],
 ['1.1','15/10/2026','v1.3','0.1.4','Nuevo S-08: afinación medida de cada muestra, verificado parcialmente hasta F2.2. Criterios revisados en CP-1: S-01, S-08, G-03, G-06 y A-02-CA. S-07 y G-06 pasan a «Cumple parcialmente» con CREDITOS.md y samples/. Las evidencias del banco apuntan a tests/ (node --test, 12 pruebas). Nueva comprobación F1.1 #15 para oír la corrección del registro agudo.'],
 ['1.0','14/10/2026','v1.2','0.1.2','Primera emisión. 90 requisitos con origen, método de verificación, criterio de aceptación, declaración del proveedor, evidencia y estado de verificación.'],
]
for i, row_ in enumerate(CC, 2):
    for c, v in enumerate(row_, 1):
        cell = cc.cell(row=i, column=c, value=v); cell.font = Font(name=F, size=10); cell.alignment = Alignment(wrap_text=True, vertical='top')
    cc.row_dimensions[i].height = 46
wb.save(OUT_XLSX)

# ------------------------------------------------------------------ Markdown para los auditores
L = []
w = L.append
w('# Trasteando — Matriz de cumplimiento de requisitos\n')
w('**Versión:** 1.23 · **Fecha:** 22 de octubre de 2026 · **Base:** `requisitos.md` v1.25 · app `0.6.0` · `roadmap.md` v3.23  ')
w('**Cliente:** Pablo Díaz Guerra · **Proveedor:** chat de Desarrollo · **Verificación independiente:** auditores\n')
w('> Versión en texto de `matriz-cumplimiento.xlsx`, para que los chats auditores puedan leerla. El texto de cada requisito está en `requisitos.md`; aquí va cómo se demuestra que se cumple.\n')
w('**Métodos:** I inspección · A análisis · D demostración · T prueba. **Regla de cierre:** una etapa se cierra cuando todos sus requisitos están en *Cumple* y *Verificado*.\n')
w('**Cambios en la 1.23:** F6.1: G-08 cumple y queda verificado por el banco, que pasa las pruebas que arrancan la app contra la app de varios archivos y contra el archivo autónomo; el autónomo lee de dentro sus grabaciones sin descargar nada. Lo pendiente de AR-13, en su comentario.\n')
w('**Cambios en la 1.22:** punto de control CP-5 (AR-12 y AT-11): una sola vara; lo que espera tu prueba con el banco ya hecho queda *verificado parcialmente* (E-01, E-02, E-03, E-04, E-06, P-03, MT-01, MT-05, AC-02 y AC-03); MT-04 con el arranque de la 0.5.7; lo pendiente de CP-5, en su comentario.\n')
w('**Cambios en la 1.21:** auditoría AR-11: seis áreas en G-02, C-04 y V-01; criterio de AC-01 y evidencias del metrónomo y los acordes completadas.\n')
w('**Cambios en la 1.20:** la librería de acordes (AC-01 a AC-06), hecha y verificada por el banco; G-02 y C-04 con seis áreas.\n')
w('**Cambios en la 1.19:** el metrónomo (MT-01 a MT-05), hecho y verificado por el banco.\n')
w('**Cambios en la 1.18:** J-13 con «Reintentar» por defecto; el metrónomo, área propia (MT-05); criterios y evidencias al día tras AR-10 y AT-09.\n')
w('**Cambios en la 1.17:** J-13 y N-06 nuevos y verificados; criterios del metrónomo y de los acordes.\n')
w('**Cambios en la 1.16:** F5: escalas; E-02 y E-05 verificados por el banco.\n')
w('**Cambios en la 1.15:** G-12 nuevo; J-11 verificado por el banco; criterios de J-01, J-06, J-08 y C-02 con la 0.4.1 y la 0.4.2.\n')
w('**Cambios en la 1.14:** evidencias del afinador por micrófono; A-02-CA, A-04 y G-10 verificados.\n')
w('**Cambios en la 1.13:** 35 requisitos verificados en la Sesión 1 (informe `V-08`), con su prueba en la evidencia; criterios de J-01, J-08, J-10 y S-02 con la 0.3.3, pendientes de la Sesión 2; evidencia de S-01 y PL-04; C-08 y S-09 nuevos, fuera de alcance.\n')
w('**Cambios en la 1.12:** criterios de V-04 y G-05 con el zoom nuevo.\n')
w('**Cambios en la 1.11:** F3.4. G-05 cumple; su criterio añade los umbrales de la paleta.\n')
w('**Cambios en la 1.10:** F3.2. V-01 y C-07 cumplen; criterios revisados de V-04 y G-05.\n')
w('**Cambios en la 1.9:** interfaz aprobada. C-06 verificado; C-07 nuevo; criterios revisados de V-01, V-04, G-05 y C-04.\n')
w('**Cambios en la 1.8:** S-07 cumple y queda verificado (licencia del pack de nylon completa).\n')
w('**Cambios en la 1.7:** evidencia nueva en S-07 (licencia de nylon en tres sonidos). Criterios sin cambios.\n')
w('**Cambios en la 1.6:** CP-2: G-07 con límites revisados; X-01 cumple; escucha del cliente en S-01.\n')
w('**Cambios en la 1.5:** criterio de S-08 según su nueva redacción.\n')
w('**Cambios en la 1.4:** G-07 y G-08 verificados parcialmente con el archivo autónomo.\n')
w('**Cambios en la 1.3:** S-08 verificado con la 0.2.0; evidencias nuevas en S-01, S-07 y S-08.\n')
w('**Cambios en la 1.2:** PL-04 nuevo (adaptabilidad entre sistemas, evidencia en `docs/compatibilidad.md`).\n')
w('**Cambios en la 1.1:** S-08 nuevo, verificado parcialmente hasta que la app use sus propias muestras (F2.2). Criterios revisados en CP-1: S-01, S-08, G-03, G-06 y A-02-CA. S-07 y G-06 pasan a *Cumple parcialmente* con `CREDITOS.md`. Las evidencias del banco apuntan a `tests/` (`node --test`). Nueva comprobación F1.1 #15.\n')
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
