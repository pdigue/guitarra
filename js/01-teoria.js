"use strict";

// 01-teoria.js · Teoría musical: notas, nomenclaturas, afinaciones y colores. También la versión de la app.
// Se carga como <script> clásico, en el orden de index.html: lo declarado aquí
// (const, let, function) lo ven los archivos que vienen después.

/* Versión de la app. Sigue la pauta 0.<fase del roadmap>.<corrección> hasta el
   lanzamiento, que será la 1.0.0. Cada cambio queda descrito en CHANGELOG.md. */
const APP_VERSION = '0.4.2';

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
function noteName(midi){
  const i = noteInfo(midi);
  return state.notation === 'latin' ? i.latin : i.anglo;
}
/** Nombre científico (C4, F#3...), el que usan los nombres de archivo de las muestras. */
function sciName(midi){
  return ANGLO[((midi%12)+12)%12] + (Math.floor(midi/12)-1);
}
