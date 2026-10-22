"use strict";

// 01-teoria.js · Teoría musical: notas, nomenclaturas, afinaciones y colores. También la versión de la app.
// Se carga como <script> clásico, en el orden de index.html: lo declarado aquí
// (const, let, function) lo ven los archivos que vienen después.

/* Versión de la app. Sigue la pauta 0.<fase del roadmap>.<corrección> hasta el
   lanzamiento, que será la 1.0.0. Cada cambio queda descrito en CHANGELOG.md. */
const APP_VERSION = '0.5.6';

/* ============================================================
   1. TEORÍA MUSICAL — datos base
   ============================================================ */

// Las 12 notas del sistema temperado, en las dos nomenclaturas.
const ANGLO = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const LATIN = ['Do','Do#','Re','Re#','Mi','Fa','Fa#','Sol','Sol#','La','La#','Si'];

// Un color por nota. Ayuda a reconocer patrones en el mástil de un vistazo.
// Paleta por nota (F3.4, decisión del 20/10): las 7 naturales bien distintas,
// también con daltonismo, y cada sostenido un tono más claro de su natural.
// La genera y la comprueba herramientas/paleta.py: no la edites a mano.
const COLORS = ['#feb893','#ffddcb','#6ec933','#96de71','#fee73f','#9095fd',
                '#adb3fd','#e561c8','#f389d9','#ed4952','#f97676','#1be6eb'];

const NUM_FRETS = 24;
const MIN_FRET_W = 34;   // ancho mínimo de un traste con ratón
const MIN_TOUCH = 40;    // lado mínimo de lo que se toca con el dedo (G-05, V-04)
const MIN_TOUCH_ZOOM = 28;  // con «+» se pueden ver más trastes, más estrechos (20/10)

/** ¿El puntero principal es un dedo? Se pregunta por la capacidad, no por el
 *  sistema (PL-04): un portátil táctil con ratón dice que no, un móvil que sí. */
function coarsePointer(){
  return typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;
}
/** Ancho cómodo de un traste: 40 px con el dedo, 34 con ratón. Es el que usa
 *  la vista por defecto (G-05). */
function minFretW(){ return coarsePointer() ? MIN_TOUCH : MIN_FRET_W; }
/** Ancho mínimo si tú pides más trastes con «+»: 28 px con el dedo, que se
 *  aciertan con algo más de cuidado; con ratón no cambia (V-04, 20/10). */
function zoomFloorW(){ return coarsePointer() ? MIN_TOUCH_ZOOM : MIN_FRET_W; }
const MAX_FRET_W = 110;

// Afinaciones. Cada una es un array de 6 notas MIDI, de la cuerda más grave
// a la más aguda. Todo el mástil se deriva de aquí: no hay ninguna nota
// escrita a mano en el resto del código.
const TUNINGS = [
  { id:'standard', get name(){ return t('tun.standard'); }, get short(){ return t('tun.standard.s'); }, midi:[40,45,50,55,59,64] },
  { id:'dropd',    name:'Drop D (D A D G B E)', short:'Drop D',   midi:[38,45,50,55,59,64] },
  { id:'halfstep', get name(){ return t('tun.halfstep'); }, get short(){ return t('tun.halfstep.s'); },        midi:[39,44,49,54,58,63] },
  { id:'openg',    name:'Open G (D G D G B D)', short:'Open G',    midi:[38,43,50,55,59,62] },
  { id:'opend',    name:'Open D (D A D F# A D)', short:'Open D',   midi:[38,45,50,54,57,62] },
  { id:'dadgad',   name:'DADGAD', short:'DADGAD',                  midi:[38,45,50,55,57,62] },
  { id:'custom', get name(){ return t('tun.custom'); }, get short(){ return t('tun.custom.s'); },           midi:[40,45,50,55,59,64] }
];

// Grosor visual de cada cuerda, de la más grave a la más aguda.
const THICKNESS = [3.4, 2.8, 2.2, 1.7, 1.3, 1.0];

// Trastes con marcador de posición en una guitarra real.
const MARKERS_SINGLE = [3,5,7,9,15,17,19,21];
const MARKERS_DOUBLE = [12,24];

/** Convierte un número MIDI en todos los datos que necesitamos de esa nota. */
function noteInfo(midi){
  const pc = ((midi % 12) + 12) % 12;          // pitch class: 0..11
  return {
    midi,
    pc,
    anglo: ANGLO[pc],
    latin: LATIN[pc],
    octave: Math.floor(midi/12) - 1,
    color: COLORS[pc],
    freq: 440 * Math.pow(2,(midi-69)/12)
  };
}
/** Nombre en la nomenclatura activa. */
/** Nombre de una nota del mástil: «Fa♯» o «Sol♭» según lo elegido para esa
 *  tecla negra en Ajustes (comentario del 21/10); siempre igual para la misma. */
function noteName(midi){
  return nombreEscrito(escrituraPreferida(midi));
}
/** Nombre científico (C4, F#3...), el que usan los nombres de archivo de las muestras. */
function sciName(midi){
  return ANGLO[((midi%12)+12)%12] + (Math.floor(midi/12)-1);
}

/* ============================================================
   1b. NOTAS ESCRITAS Y ESCALAS (F5.1 y F5.2)
   ============================================================ */

/* Hasta aquí una nota era un sonido: el MIDI 70 se llama siempre «La#». Para
   escribir escalas no basta. Si♭ y La♯ suenan igual, pero en Fa mayor la
   cuarta nota es Si♭: cada escala mayor o menor usa las siete letras, una vez
   cada una (Fa Sol La Si♭ Do Re Mi). Con La♯ habría dos «La» y ningún «Si».
   Por eso una nota escrita es una LETRA (Do…Si) más una ALTERACIÓN (♭, ♯…),
   y la letra la decide la escala, no el sonido. */

const LETRAS_ANGLO = ['C','D','E','F','G','A','B'];
const LETRAS_LATIN = ['Do','Re','Mi','Fa','Sol','La','Si'];
const PC_LETRA = [0, 2, 4, 5, 7, 9, 11];          // semitonos de Do a cada letra
const ALTERACION = { '-2':'𝄫', '-1':'♭', '0':'', '1':'♯', '2':'𝄪' };

/** Clase de altura (0 = Do … 11 = Si) de una nota escrita { letra, alt }. */
function pcEscrita(n){ return ((PC_LETRA[n.letra] + n.alt) % 12 + 12) % 12; }

/** La nota escrita con esa letra que suena como la clase de altura pc. */
function escribir(pc, letra){
  let alt = ((pc - PC_LETRA[letra]) % 12 + 12) % 12;
  if (alt > 6) alt -= 12;                          // −1 es ♭, no «+11»
  return { letra, alt };
}

/** «Si♭» o «B♭», según la nomenclatura elegida. */
function nombreEscrito(n){
  return (state.notation === 'latin' ? LETRAS_LATIN : LETRAS_ANGLO)[n.letra] + ALTERACION[n.alt];
}

/* Las cinco teclas negras: Do♯/Re♭ (1), Re♯/Mi♭ (3), Fa♯/Sol♭ (6), Sol♯/La♭ (8)
   y La♯/Si♭ (10). Fuera de las escalas, cada una se escribe siempre igual, con
   ♯ o con ♭ según Ajustes; dentro de una escala manda la escala (Si♭ en Fa mayor). */
const NEGRAS = [1, 3, 6, 8, 10];
/** La nota escrita que la app usa para un sonido, según tus preferencias. */
function escrituraPreferida(midi){
  const pc = ((midi % 12) + 12) % 12;
  if (!NEGRAS.includes(pc)) return escribir(pc, PC_LETRA.indexOf(pc));
  const bemol = typeof state !== 'undefined' && state.accidentals && state.accidentals[pc] === 'flat';
  return escribir(pc, bemol ? PC_LETRA.indexOf(pc + 1) : PC_LETRA.indexOf(pc - 1));
}

/** Octava de una nota escrita que suena en `midi`: Si♯3 es el MIDI 60, como Do4. */
function octavaEscrita(n, midi){ return Math.floor((midi - n.alt - PC_LETRA[n.letra]) / 12) - 1; }

/* Catálogo de escalas (E-01, decidido el 21/10). Cada una es un patrón de
   semitonos desde la tónica y el salto de letra de cada grado: la mayor usa
   las siete letras seguidas; las pentatónicas se saltan dos (la mayor no
   tiene 4º ni 7º grado). */
/* Compases del metrónomo (MT-02). `pulsos` son los puntos que se ven y los
   golpes principales que suenan. En los compases de 4, cada pulso es una negra.
   En 6/8, 9/8 y 12/8 (compuestos) el pulso es la negra con puntillo, que vale
   tres corcheas: 9/8 tiene tres pulsos, como en la app que nos enseñaste. En
   3/8, 5/8 y 7/8 cada corchea es un pulso. El tempo cuenta pulsos. */
const COMPASES = [
  { id:'1/4', pulsos:1 }, { id:'2/4', pulsos:2 }, { id:'3/4', pulsos:3 }, { id:'4/4', pulsos:4 },
  { id:'5/4', pulsos:5 }, { id:'6/4', pulsos:6 }, { id:'3/8', pulsos:3 }, { id:'5/8', pulsos:5 },
  { id:'6/8', pulsos:2, compuesto:true }, { id:'7/8', pulsos:7 },
  { id:'9/8', pulsos:3, compuesto:true }, { id:'12/8', pulsos:4, compuesto:true }
];
const METRO_MIN = 30, METRO_MAX = 250;         // tempo, en pulsos por minuto (MT-01)

const ESCALAS = [
  { id:'mayor',      modo:'mayor', semitonos:[0,2,4,5,7,9,11], letras:[0,1,2,3,4,5,6] },
  { id:'menor',      modo:'menor', semitonos:[0,2,3,5,7,8,10], letras:[0,1,2,3,4,5,6] },
  { id:'pentaMayor', modo:'mayor', semitonos:[0,2,4,7,9],      letras:[0,1,2,4,5] },
  { id:'pentaMenor', modo:'menor', semitonos:[0,3,5,7,10],     letras:[0,2,3,4,6] }
];

/* Cómo se escribe cada tónica: la tonalidad con menos alteraciones (Re♭
   mayor, 5 bemoles, y no Do♯ mayor, 7 sostenidos). En Fa♯ mayor y Re♯ menor
   (6 sostenidos) empatan con Sol♭ mayor y Mi♭ menor (6 bemoles): se eligen
   las de sostenidos, que son relativas entre sí. */
const TONICAS = {
  mayor: [[0,0],[1,-1],[1,0],[2,-1],[2,0],[3,0],[3,1],[4,0],[5,-1],[5,0],[6,-1],[6,0]],
  menor: [[0,0],[0,1],[1,0],[1,1],[2,0],[3,0],[3,1],[4,0],[4,1],[5,0],[6,-1],[6,0]]
};
/** La tónica escrita de una escala que empieza en la clase de altura pc. */
function tonicaEscrita(pc, modo){ const [letra, alt] = TONICAS[modo][pc]; return { letra, alt }; }

/** Las notas escritas de una escala: tónica (clase de altura) y tipo. */
function escribirEscala(pc, escala){
  const tonica = tonicaEscrita(pc, escala.modo);
  return escala.semitonos.map((s, i) => escribir((pc + s) % 12, (tonica.letra + escala.letras[i]) % 7));
}

/** Distancia de cada nota a la anterior: «T» (tono), «ST» (semitono) o, en
 *  las pentatónicas, «T½» (tono y medio). La última vuelve a la tónica. */
function intervalosEscala(escala){
  const s = escala.semitonos, out = [];
  for (let i = 0; i < s.length; i++){
    const d = ((i + 1 < s.length ? s[i + 1] : 12) - s[i]);
    out.push(d === 1 ? 'ST' : d === 2 ? 'T' : d === 3 ? 'T½' : d + 'st');
  }
  return out;
}
