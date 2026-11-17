"use strict";

// 00-idioma.js · Los textos de la app en español y en inglés (G-12).
// Se carga como <script> clásico, en el orden de index.html: lo declarado aquí
// (const, let, function) lo ven los archivos que vienen después.

/* ============================================================
   0. IDIOMA
   ============================================================ */

/* Cada texto tiene una clave. En index.html, el atributo data-t="clave" dice
   qué texto lleva un elemento (data-t-aria, su aria-label; data-t-title, su
   title); en el código, t('clave') lo devuelve en el idioma elegido. Las
   llaves {n} se rellenan: t('zoom.n', { n: 7 }) → «7 trastes a la vista».
   Los nombres de las notas no van aquí: Do Re Mi o C D E es otro ajuste. */

const TEXTOS = {
  es: {
    'gate.sub': 'Aprende dónde vive cada nota en el mástil. Toca para cargar los sonidos de guitarra.',
    'gate.btn': 'Empezar',
    'gate.loading': 'Cargando…',
    'gate.downloading': 'Descargando las muestras de guitarra. Solo la primera vez.',
    'gate.failed': 'No se han podido cargar las muestras. Sonará una guitarra sintetizada.',
    'settings': 'Ajustes',
    'tab.free': 'Libre', 'tab.guess': 'Adivinar', 'tab.tuner': 'Afinador', 'tab.scales': 'Escalas',
    'soon': 'Próximamente',
    'staff': 'Pentagrama',
    'guess.repeat': 'Repetir sonido', 'guess.startAria': 'Empezar: oír la nota',
    // Corta, para una línea (dos como mucho en el panel de horizontal): tu petición del 16/11.
    'guess.press1': 'Pulsa ▶', 'guess.pressSr': '(Empezar)', 'guess.press2': ', escucha y encuéntrala',
    'guess.was': 'Era', 'guess.wasEnd': '(octava {n}). Mira dónde estaba.',
    'guess.listen': 'Escucha y encuéntrala',
    'guess.miss': '¡Prueba otra vez!', 'guess.giveup': 'Ver la respuesta',
    'set.accidentals': 'Notas alteradas', 'set.accidentals.sub': 'Cómo se escribe cada una: con sostenido (♯) o con bemol (♭). Dentro de una escala manda la escala',
    'set.onMiss': 'Al fallar', 'set.onMiss.sub': 'Ver dónde estaba la nota o seguir buscándola',
    'set.reveal': 'Ver respuesta', 'set.retry': 'Reintentar',
    'streak': 'Racha {n}', 'record': 'Récord {n} · {afin}',
    'record.title': 'Récord de racha en la afinación {afin} (cada afinación tiene el suyo)',
    'hints': 'Pistas', 'hint.name': 'Nombre', 'hint.note': 'Nota', 'hint.string': 'Cuerda', 'hint.strings': 'Cuerdas',
    'reader.play': 'toca', 'octave': 'octava {n}',
    'scale.tonic': 'Tónica', 'scale.typeLabel': 'Tipo de escala', 'scale.lineAria': 'Notas e intervalos',
    'scale.type.mayor': 'Mayor', 'scale.type.menor': 'Menor natural',
    'scale.type.pentaMayor': 'Pentatónica mayor', 'scale.type.pentaMenor': 'Pentatónica menor',
    'scale.name.mayor': '{t} mayor', 'scale.name.menor': '{t} menor',
    'scale.name.pentaMayor': 'la pentatónica mayor de {t}', 'scale.name.pentaMenor': 'la pentatónica menor de {t}',
    'scale.prev': 'Paso anterior', 'scale.next': 'Paso siguiente',
    'scale.step': 'Paso {i} de {total}', 'scale.stepTonic': '{n}, la tónica',
    'scale.stepUp': '{n}, {d} sobre {prev}',
    'scale.gap.T': 'un tono', 'scale.gap.ST': 'un semitono', 'scale.gap.T½': 'un tono y medio',
    'scale.stepFirst': '{n}: aquí empieza la posición', 'scale.stepUpTonic': '{n}, la tónica, {d} sobre {prev}',
    'scale.posLabel': 'Posición', 'scale.posPrev': 'Posición anterior', 'scale.posNext': 'Posición siguiente',
    'scale.pos': 'Posición {i} de {total} · trastes {a} a {b}',
    'scale.play': '▶ Escuchar', 'scale.stop': '■ Parar', 'scale.posShort': '{i}/{total}',
    'scale.playLabel': 'Escuchar la posición', 'scale.gapN': '{n} semitonos',
    'scale.all': 'Todas', 'scale.allLabel': 'Ver la escala en todo el mástil',
    'scale.practice': 'Practicar', 'scale.practiceLabel': 'Practicar la posición: tocarla en orden',
    'scale.pr.start': 'Práctica · toca la posición de grave a agudo, desde la 6.ª cuerda',
    'scale.pr.next': 'Práctica · {i} de {total} · la siguiente, más aguda',
    'scale.pr.no': '✗ Esa no · {i} de {total} · busca la siguiente de la posición, más aguda',
    'scale.pr.otherString': '✗ Suena igual, pero en otra cuerda · sigue dentro de la posición',
    'scale.pr.done': '✓ ¡Completa! Ya tocas la posición {p} de {e}. Toca la primera para repetir',
    'zoom.less': 'Ver menos trastes', 'zoom.more': 'Ver más trastes',
    'zoom.n': '{n} trastes a la vista', 'zoom.all': 'Mástil completo',
    'board': 'Mástil. Flechas para moverte, Intro o Espacio para tocar',
    'cell.open': '{o} cuerda, al aire', 'cell.fret': '{o} cuerda, traste {f}',
    'tuner.mode': 'Modo del afinador', 'tuner.ear': 'De oído', 'tuner.mic': 'Micrófono',
    'tuning': 'Afinación',
    'tuner.lead': 'Pulsa una cuerda para oír cómo debería sonar y ajústala hasta que coincida.',
    'tuner.tap': 'Pulsa para oírla', 'tuner.up': 'Subir la {o} cuerda', 'tuner.down': 'Bajar la {o} cuerda',
    'mic.string': 'Cuerda', 'mic.auto': 'Cuerda automática', 'mic.nth': '{o} cuerda',
    'mic.intro1': 'Toca una cuerda y la app te dirá si está afinada o cuánto subirla o bajarla. Para eso necesita ',
    'mic.intro2': 'escuchar con el micrófono',
    'mic.intro3': '. El sonido se analiza solo en tu dispositivo: no se graba ni se envía a ningún sitio.',
    'mic.start': 'Activar el micrófono', 'mic.stop': 'Detener el micrófono', 'mic.play': 'Toca una cuerda', 'mic.held': 'Última lectura',
    'mic.hidden': 'El micrófono se apagó al ocultarse la app. Actívalo otra vez para seguir.',
    'mic.privacy': 'Afinada en la franja verde (±5 cents). El sonido se analiza solo en tu dispositivo.',
    'mic.detail': '{c} cents · {o} cuerda',
    'mic.tuned': 'Afinada', 'mic.up': 'Sube', 'mic.upBit': 'Sube un poco', 'mic.down': 'Baja', 'mic.downBit': 'Baja un poco',
    'mic.file': 'Abierta como archivo, el navegador no deja usar el micrófono. Usa la web de la app, o afina De oído.',
    'mic.https': 'El micrófono solo funciona en una dirección segura (https). Usa la web de la app, o afina De oído.',
    'mic.nobrowser': 'Este navegador no deja usar el micrófono. Puedes afinar De oído.',
    'mic.denied': 'No hay permiso para el micrófono. En el iPhone: Ajustes › Safari › Micrófono › Permitir, o «aA» en la barra de direcciones › Ajustes del sitio web. En Chrome o Edge: el icono junto a la dirección › Micrófono › Permitir. Luego vuelve a pulsar el botón.',
    'mic.nomic': 'No se encuentra ningún micrófono en este dispositivo.',
    'mic.error': 'No se ha podido abrir el micrófono ({e}).',
    'mic.cut': 'El sistema ha cortado el micrófono. Vuelve a activarlo.',
    'mic.analyse': 'No se ha podido analizar el sonido del micrófono.',
    'set.notation': 'Notación', 'set.names': 'Nomenclatura', 'set.names.sub': 'Cómo se nombran las notas en toda la app',
    'set.staff.sub': 'Muestra en la partitura la nota que tocas',
    'set.neck': 'Mástil', 'set.fretnums': 'Números de traste',
    'set.fretnums.sub': '«Guía» deja solo los trastes con marca: 3, 5, 7, 9, 12…',
    'set.all': 'Todos', 'set.guide': 'Guía', 'set.none': 'No',
    'set.showall': 'Ver todas las notas',
    'set.showall.sub': 'Muestra el nombre de cada posición. En Adivinar se desactiva para no darte la respuesta',
    'set.equals': 'Señalar posiciones iguales', 'set.equals.sub': 'Marca dónde más suena exactamente la misma nota',
    'set.sound': 'Sonido', 'set.guitar': 'Guitarra', 'set.guitar.sub': 'Clásica de nylon o acústica de acero',
    'set.classical': 'Clásica', 'set.acoustic': 'Acústica',
    'set.audio': 'Estado del sonido', 'set.audio.wake': 'Reactivar sonido',
    'set.tuning.active': 'Afinación activa', 'set.tuning.sub': 'Se aplica al mástil y al afinador',
    'set.lang': 'Idioma', 'set.lang.sub': 'Español o inglés',
    'set.look': 'Aspecto', 'set.theme': 'Tema', 'set.theme.sub': '«Automático» sigue el modo claro u oscuro del dispositivo',
    'theme.wood': 'Madera', 'theme.auto': 'Automático', 'theme.sheet': 'Partitura',
    'set.reset': 'Restablecer todos los ajustes', 'set.clear': 'Borrar los récords de racha',
    // Acerca de (F6.4): privacidad (G-11), créditos de las grabaciones (G-06) y derechos.
    'set.about': 'Acerca de',
    'about.privacy': 'Trasteando no recoge ni envía datos personales. Tus ajustes y récords se guardan solo en este dispositivo, y el sonido del micrófono se analiza aquí mismo: no se graba ni se envía.',
    'about.privacy.link': 'Política de privacidad',
    'about.credits.title': 'Créditos del sonido',
    'about.credits': 'Guitarra clásica: «ClassicalGuitar-multisampled», de quartertone (freesound.org/people/quartertone/packs/11573), licencia CC BY 4.0 (creativecommons.org/licenses/by/4.0). Guitarra acústica: grabaciones de la University of Iowa Electronic Music Studios (theremin.music.uiowa.edu), de uso libre. Ambas, editadas por Nicholaus P. Brosowsky en tonejs-instruments (github.com/nbrosowsky/tonejs-instruments), licencia CC BY 3.0 (creativecommons.org/licenses/by/3.0). Se usan sin modificar, salvo en la versión descargable, donde van recortadas a 4,5 s, con un fundido final, y recodificadas.',
    'about.rights': '© 2026 Pablo Díaz Guerra. Todos los derechos reservados (salvo las grabaciones, con su propia licencia).',
    'confirm.clear': '¿Borrar los récords de racha de todas las afinaciones?',
    'confirm.reset': '¿Restablecer todos los ajustes? Tus récords se conservan.',
    'timbre.nylon': 'Guitarra clásica de cuerdas de nylon', 'timbre.acoustic': 'Guitarra acústica de cuerdas de acero',
    'timbre.loading': 'Cargando muestras…', 'timbre.failed': 'No se pudo cargar ese timbre. Se mantiene el anterior.',
    'timbre.synth': 'No se pudieron cargar las grabaciones: suena la guitarra sintetizada.',
    'audio.none': 'sin iniciar', 'audio.running': 'activo', 'audio.suspended': 'en pausa',
    'audio.interrupted': 'interrumpido por el sistema', 'audio.closed': 'cerrado',
    'audio.synth': ' · guitarra sintetizada', 'audio.loading': ' · cargando las grabaciones',
    'audio.rebuild': ' · se rehace al tocar',
    'tun.standard': 'Estándar (E A D G B E)', 'tun.standard.s': 'Estándar',
    'tun.halfstep': 'Medio tono abajo', 'tun.halfstep.s': 'Medio tono abajo',
    'tun.custom': 'Personalizada', 'tun.custom.s': 'Personalizada',
    // Metrónomo (F5.6, MT-01 a MT-05)
    'tab.metro': 'Metrónomo', 'metro.bpm': 'pulsos por minuto', 'metro.tempo': 'Tempo',
    'metro.slower': 'Más lento', 'metro.faster': 'Más rápido', 'metro.tap': 'Marcar',
    'metro.tapAria': 'Marcar el tempo: toca a ritmo', 'metro.tapHint': 'Sigue tocando a ritmo…',
    'metro.sig': 'Compás', 'metro.sigAria': 'Compás {c}, {f}. Cambiar compás, figura y acento',
    'metro.sigOne': 'Compás {c}', 'metro.accent': 'Acento en el primer tiempo', 'metro.ok': 'Listo',
    'metro.withAccent': 'con acento', 'metro.noAccent': 'sin acento',
    'metro.sub': 'Subdivisión', 'metro.sub.1': 'Solo el pulso', 'metro.sub.2': 'Dos por pulso (corcheas)',
    'metro.sub.3': 'Tres por pulso (tresillos)', 'metro.sub.4': 'Cuatro por pulso (semicorcheas)',
    'metro.sub.3c': 'Tres por pulso (corcheas)', 'metro.sub.2c': 'Dos por pulso (dosillo)', 'metro.sub.4c': 'Cuatro por pulso (cuatrillo)',
    'metro.sub.2e': 'Dos por pulso (semicorcheas)', 'metro.sub.3e': 'Tres por pulso (tresillo de semicorcheas)', 'metro.sub.4e': 'Cuatro por pulso (fusas)',
    'metro.stoppedAudio': 'Se paró: el sistema detuvo el sonido. Vuelve a empezar.',
    'metro.start': 'Empezar', 'metro.stop': 'Parar',
    'metro.playing': 'Sonando. Puedes ir a otra área: sigue hasta que lo pares aquí.',
    'metro.noLock': 'Este navegador no puede mantener la pantalla encendida: si se apaga, el metrónomo se para.',
    'metro.noAudio': 'El sonido aún no está listo. Vuelve a pulsar.',
    'metro.stoppedMic': 'El metrónomo se ha parado: su clic confundiría al afinador.',
    'metro.stoppedHidden': 'Se paró al salir de la app.',
    'metro.running': 'Metrónomo en marcha',
    // Acordes (F5.7; F5.8 #6: nota y tipo, AC-01)
    'tab.chords': 'Acordes', 'chord.rootsAria': 'Nota del acorde', 'chord.typesAria': 'Tipo de acorde',
    'chord.major': 'Mayor', 'chord.minor': 'menor', 'chord.bass': '/bajo', 'chord.bassAria': 'Con otra nota en el bajo',
    'chord.play': 'Tocar', 'chord.playAria': 'Tocar el acorde',
    'chord.tuning': 'Las digitaciones son para la afinación estándar.', 'chord.toStandard': 'Pasar a estándar',
    'chord.finger': 'dedo {n}', 'chord.open': 'al aire', 'chord.muted': 'no suena', 'chord.stringAria': '{o} cuerda: {e}'
  },
  en: {
    'gate.sub': 'Learn where every note lives on the fretboard. Tap to load the guitar sounds.',
    'gate.btn': 'Start',
    'gate.loading': 'Loading…',
    'gate.downloading': 'Downloading the guitar samples. Only the first time.',
    'gate.failed': 'The samples could not be loaded. A synthesized guitar will play.',
    'settings': 'Settings',
    'tab.free': 'Free', 'tab.guess': 'Guess', 'tab.tuner': 'Tuner', 'tab.scales': 'Scales',
    'soon': 'Coming soon',
    'staff': 'Staff',
    'guess.repeat': 'Play again', 'guess.startAria': 'Start: hear the note',
    'guess.press1': 'Press ▶', 'guess.pressSr': '(Start)', 'guess.press2': ', listen and find it',
    'guess.was': 'It was', 'guess.wasEnd': '(octave {n}). See where it was.',
    'guess.listen': 'Listen and find it',
    'guess.miss': 'Try again!', 'guess.giveup': 'Show the answer',
    'set.accidentals': 'Sharps and flats', 'set.accidentals.sub': 'How each one is written: with a sharp (♯) or a flat (♭). Inside a scale, the scale decides',
    'set.onMiss': 'When you miss', 'set.onMiss.sub': 'See where the note was or keep looking for it',
    'set.reveal': 'Show answer', 'set.retry': 'Try again',
    'streak': 'Streak {n}', 'record': 'Best {n} · {afin}',
    'record.title': 'Best streak in {afin} tuning (each tuning keeps its own)',
    'hints': 'Hints', 'hint.name': 'Name', 'hint.note': 'Note', 'hint.string': 'String', 'hint.strings': 'Strings',
    'reader.play': 'play', 'octave': 'octave {n}',
    'scale.tonic': 'Root', 'scale.typeLabel': 'Scale type', 'scale.lineAria': 'Notes and intervals',
    'scale.type.mayor': 'Major', 'scale.type.menor': 'Natural minor',
    'scale.type.pentaMayor': 'Major pentatonic', 'scale.type.pentaMenor': 'Minor pentatonic',
    'scale.name.mayor': '{t} major', 'scale.name.menor': '{t} minor',
    'scale.name.pentaMayor': '{t} major pentatonic', 'scale.name.pentaMenor': '{t} minor pentatonic',
    'scale.prev': 'Previous step', 'scale.next': 'Next step',
    'scale.step': 'Step {i} of {total}', 'scale.stepTonic': '{n}, the root',
    'scale.stepUp': '{n}, {d} above {prev}',
    'scale.gap.T': 'a whole tone', 'scale.gap.ST': 'a semitone', 'scale.gap.T½': 'a tone and a half',
    'scale.stepFirst': '{n}: the position starts here', 'scale.stepUpTonic': '{n}, the root, {d} above {prev}',
    'scale.posLabel': 'Position', 'scale.posPrev': 'Previous position', 'scale.posNext': 'Next position',
    'scale.pos': 'Position {i} of {total} · frets {a} to {b}',
    'scale.play': '▶ Listen', 'scale.stop': '■ Stop', 'scale.posShort': '{i}/{total}',
    'scale.playLabel': 'Listen to the position', 'scale.gapN': '{n} semitones',
    'scale.all': 'All', 'scale.allLabel': 'Show the scale on the whole neck',
    'scale.practice': 'Practice', 'scale.practiceLabel': 'Practise the position: play it in order',
    'scale.pr.start': 'Practice · play the position from low to high, from the 6th string',
    'scale.pr.next': 'Practice · {i} of {total} · the next one, higher',
    'scale.pr.no': '✗ Not that one · {i} of {total} · find the next one in the position, higher',
    'scale.pr.otherString': '✗ Same sound, but on another string · stay inside the position',
    'scale.pr.done': '✓ Done! You can play position {p} of {e}. Play the first one to repeat',
    'zoom.less': 'Show fewer frets', 'zoom.more': 'Show more frets',
    'zoom.n': '{n} frets in view', 'zoom.all': 'Whole neck',
    'board': 'Fretboard. Arrow keys to move, Enter or Space to play',
    'cell.open': '{o} string, open', 'cell.fret': '{o} string, fret {f}',
    'tuner.mode': 'Tuner mode', 'tuner.ear': 'By ear', 'tuner.mic': 'Microphone',
    'tuning': 'Tuning',
    'tuner.lead': 'Tap a string to hear how it should sound and adjust yours until they match.',
    'tuner.tap': 'Tap to hear it', 'tuner.up': 'Raise the {o} string', 'tuner.down': 'Lower the {o} string',
    'mic.string': 'String', 'mic.auto': 'Automatic string', 'mic.nth': '{o} string',
    'mic.intro1': 'Play a string and the app will tell you whether it is in tune or how far to raise or lower it. To do that it needs to ',
    'mic.intro2': 'listen through the microphone',
    'mic.intro3': '. The sound is analysed only on your device: it is never recorded or sent anywhere.',
    'mic.start': 'Turn on the microphone', 'mic.stop': 'Turn off the microphone', 'mic.play': 'Play a string', 'mic.held': 'Last reading',
    'mic.hidden': 'The microphone turned off when the app was hidden. Turn it on again to continue.',
    'mic.privacy': 'In tune within the green band (±5 cents). The sound is analysed only on your device.',
    'mic.detail': '{c} cents · {o} string',
    'mic.tuned': 'In tune', 'mic.up': 'Tune up', 'mic.upBit': 'Up a little', 'mic.down': 'Tune down', 'mic.downBit': 'Down a little',
    'mic.file': 'Opened as a file, the browser does not allow the microphone. Use the app’s website, or tune By ear.',
    'mic.https': 'The microphone only works on a secure address (https). Use the app’s website, or tune By ear.',
    'mic.nobrowser': 'This browser does not allow the microphone. You can tune By ear.',
    'mic.denied': 'There is no permission for the microphone. On iPhone: Settings › Safari › Microphone › Allow, or «aA» in the address bar › Website Settings. In Chrome or Edge: the icon next to the address › Microphone › Allow. Then press the button again.',
    'mic.nomic': 'No microphone was found on this device.',
    'mic.error': 'The microphone could not be opened ({e}).',
    'mic.cut': 'The system turned the microphone off. Turn it on again.',
    'mic.analyse': 'The microphone sound could not be analysed.',
    'set.notation': 'Notation', 'set.names': 'Note names', 'set.names.sub': 'How notes are named throughout the app',
    'set.staff.sub': 'Shows the note you play on the staff',
    'set.neck': 'Fretboard', 'set.fretnums': 'Fret numbers',
    'set.fretnums.sub': '“Guide” keeps only the marked frets: 3, 5, 7, 9, 12…',
    'set.all': 'All', 'set.guide': 'Guide', 'set.none': 'None',
    'set.showall': 'Show all notes',
    'set.showall.sub': 'Shows the name of every position. Turned off in Guess so it does not give the answer away',
    'set.equals': 'Mark identical positions', 'set.equals.sub': 'Marks where else exactly the same note sounds',
    'set.sound': 'Sound', 'set.guitar': 'Guitar', 'set.guitar.sub': 'Nylon-string classical or steel-string acoustic',
    'set.classical': 'Classical', 'set.acoustic': 'Acoustic',
    'set.audio': 'Sound status', 'set.audio.wake': 'Restart sound',
    'set.tuning.active': 'Active tuning', 'set.tuning.sub': 'Applies to the fretboard and the tuner',
    'set.lang': 'Language', 'set.lang.sub': 'Spanish or English',
    'set.look': 'Appearance', 'set.theme': 'Theme', 'set.theme.sub': '“Automatic” follows your device’s light or dark mode',
    'theme.wood': 'Wood', 'theme.auto': 'Automatic', 'theme.sheet': 'Sheet music',
    'set.reset': 'Reset all settings', 'set.clear': 'Clear best streaks',
    'set.about': 'About',
    'about.privacy': 'Trasteando does not collect or send any personal data. Your settings and records are stored only on this device, and the microphone sound is analysed right here: it is never recorded or sent.',
    'about.privacy.link': 'Privacy policy',
    'about.credits.title': 'Sound credits',
    'about.credits': 'Classical guitar: "ClassicalGuitar-multisampled" by quartertone (freesound.org/people/quartertone/packs/11573), licensed under CC BY 4.0 (creativecommons.org/licenses/by/4.0). Acoustic guitar: recordings by the University of Iowa Electronic Music Studios (theremin.music.uiowa.edu), free to use. Both edited by Nicholaus P. Brosowsky in tonejs-instruments (github.com/nbrosowsky/tonejs-instruments), licensed under CC BY 3.0 (creativecommons.org/licenses/by/3.0). Used unmodified, except in the downloadable version, where they are trimmed to 4.5 s with a fade-out and re-encoded.',
    'about.rights': '© 2026 Pablo Díaz Guerra. All rights reserved (except the recordings, which have their own licence).',
    'confirm.clear': 'Clear the best streaks of every tuning?',
    'confirm.reset': 'Reset all settings? Your best streaks are kept.',
    'timbre.nylon': 'Classical guitar with nylon strings', 'timbre.acoustic': 'Acoustic guitar with steel strings',
    'timbre.loading': 'Loading samples…', 'timbre.failed': 'That guitar could not be loaded. Keeping the previous one.',
    'timbre.synth': 'The recordings could not be loaded: the synthesized guitar is playing.',
    'audio.none': 'not started', 'audio.running': 'active', 'audio.suspended': 'paused',
    'audio.interrupted': 'interrupted by the system', 'audio.closed': 'closed',
    'audio.synth': ' · synthesized guitar', 'audio.loading': ' · loading the recordings',
    'audio.rebuild': ' · restarts on your next tap',
    'tun.standard': 'Standard (E A D G B E)', 'tun.standard.s': 'Standard',
    'tun.halfstep': 'Half step down', 'tun.halfstep.s': 'Half step down',
    'tun.custom': 'Custom', 'tun.custom.s': 'Custom',
    // Metronome (F5.6, MT-01 to MT-05)
    'tab.metro': 'Metronome', 'metro.bpm': 'beats per minute', 'metro.tempo': 'Tempo',
    'metro.slower': 'Slower', 'metro.faster': 'Faster', 'metro.tap': 'Tap',
    'metro.tapAria': 'Tap the tempo: tap in time', 'metro.tapHint': 'Keep tapping in time…',
    'metro.sig': 'Time signature', 'metro.sigAria': 'Time signature {c}, {f}. Change time signature, note value and accent',
    'metro.sigOne': 'Time signature {c}', 'metro.accent': 'Accent on the first beat', 'metro.ok': 'Done',
    'metro.withAccent': 'accented', 'metro.noAccent': 'no accent',
    'metro.sub': 'Subdivision', 'metro.sub.1': 'Beat only', 'metro.sub.2': 'Two per beat (eighths)',
    'metro.sub.3': 'Three per beat (triplets)', 'metro.sub.4': 'Four per beat (sixteenths)',
    'metro.sub.3c': 'Three per beat (eighths)', 'metro.sub.2c': 'Two per beat (duplet)', 'metro.sub.4c': 'Four per beat (quadruplet)',
    'metro.sub.2e': 'Two per beat (sixteenths)', 'metro.sub.3e': 'Three per beat (sixteenth triplet)', 'metro.sub.4e': 'Four per beat (thirty-seconds)',
    'metro.stoppedAudio': 'It stopped: the system halted the sound. Start again.',
    'metro.start': 'Start', 'metro.stop': 'Stop',
    'metro.playing': 'Playing. You can go to another area: it keeps going until you stop it here.',
    'metro.noLock': 'This browser can\'t keep the screen on: if it turns off, the metronome stops.',
    'metro.noAudio': 'Sound is not ready yet. Tap again.',
    'metro.stoppedMic': 'The metronome stopped: its click would confuse the tuner.',
    'metro.stoppedHidden': 'It stopped when you left the app.',
    'metro.running': 'Metronome running',
    // Chords (F5.7; F5.8 #6: root and type, AC-01)
    'tab.chords': 'Chords', 'chord.rootsAria': 'Chord root', 'chord.typesAria': 'Chord type',
    'chord.major': 'Major', 'chord.minor': 'minor', 'chord.bass': '/bass', 'chord.bassAria': 'With another bass note',
    'chord.play': 'Play', 'chord.playAria': 'Play the chord',
    'chord.tuning': 'These fingerings are for standard tuning.', 'chord.toStandard': 'Switch to standard',
    'chord.finger': 'finger {n}', 'chord.open': 'open', 'chord.muted': 'not played', 'chord.stringAria': '{o} string: {e}'
  }
};

/** El idioma activo: el elegido en Ajustes; si no hay, el del navegador. */
function lang(){
  return (typeof state !== 'undefined' && state && state.lang) || idiomaDelNavegador();
}
function idiomaDelNavegador(){
  const nav = typeof navigator !== 'undefined' ? navigator : {};
  const l = (nav.languages && nav.languages[0]) || nav.language;
  // Sin dato, español; también para catalán, gallego y euskera, más cerca del
  // español que del inglés para quien los tiene puestos (AT-08 #7).
  return l && !/^(es|ca|gl|eu)\b/i.test(l) ? 'en' : 'es';
}

/** El texto de una clave en el idioma activo, con sus {llaves} rellenas. */
function t(clave, vars){
  const s = TEXTOS[lang()][clave] ?? TEXTOS.es[clave] ?? clave;
  return vars ? s.replace(/\{(\w+)\}/g, (_, k) => vars[k]) : s;
}

/** Número de cuerda: «3ª» en español, «3rd» en inglés. */
function ord(n){
  if (lang() !== 'en') return n + 'ª';
  return n + (n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th');
}

/** Pone en su idioma todos los textos fijos de la página. */
function aplicarIdioma(){
  document.documentElement.lang = lang();
  document.querySelectorAll('[data-t]').forEach(e => { e.textContent = t(e.dataset.t); });
  document.querySelectorAll('[data-t-aria]').forEach(e => e.setAttribute('aria-label', t(e.dataset.tAria)));
  document.querySelectorAll('[data-t-title]').forEach(e => e.setAttribute('title', t(e.dataset.tTitle)));
  document.querySelectorAll('[data-t-placeholder]').forEach(e => e.setAttribute('placeholder', t(e.dataset.tPlaceholder)));
  // La política de privacidad es una sola página con las dos versiones: en
  // inglés, el enlace salta a la suya (#en). Se cambia solo lo que va tras «#»,
  // porque en el archivo autónomo el enlace es a la web, no a un archivo vecino.
  const priv = document.getElementById('about-privacy');
  if (priv) priv.setAttribute('href', priv.getAttribute('href').split('#')[0] + (lang() === 'en' ? '#en' : ''));
}
