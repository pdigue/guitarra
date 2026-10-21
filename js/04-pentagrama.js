"use strict";

// 04-pentagrama.js · Pentagrama: dibuja en SVG la nota que suena.
// Se carga como <script> clásico, en el orden de index.html: lo declarado aquí
// (const, let, function) lo ven los archivos que vienen después.

/* ============================================================
   4. PENTAGRAMA
   ============================================================ */

const STAFF_TOP = 44, STAFF_BOTTOM = 84;
const GAP = (STAFF_BOTTOM - STAFF_TOP) / 4;
const SVG_NS = 'http://www.w3.org/2000/svg';

/* Clave de sol dibujada como trazado. El carácter Unicode U+1D11E depende de
   las fuentes del sistema y en muchos Android sale como un cuadro vacío. */
const CLEF_PATH = 'M11.4 45.6c-3.1 0-5.6-2.6-5.6-5.9 0-2.8 1.7-5 3.6-7.1'
  + ' .5-.6 1.1-1.2 1.7-1.8-.3-1.6-.5-3.1-.5-4.6 0-4.7 1.7-8.6 4.2-11.3'
  + ' .4-.4 1-.4 1.3.1 1.6 2.3 2.5 5 2.5 7.7 0 4.1-2.2 7.5-4.7 10.2'
  + ' .2 1.2.5 2.5.8 3.9.6-.1 1.2-.2 1.8-.2 4.1 0 7.2 3 7.2 7 0 3.6-2.5'
  + ' 6.4-5.8 7-.1 0-.2 0-.3.1.1.8.2 1.6.2 2.3 0 4.3-2.7 7-6.3 7-2.9 0-5.2-1.9-5.2-4.5'
  + ' 0-2 1.5-3.5 3.4-3.5 1.7 0 3.1 1.4 3.1 3.1 0 1.8-1.4 3.1-3.1 3.1-.3 0-.6 0-.9-.1'
  + ' .7 1 1.9 1.6 3.2 1.6 2.6 0 4.5-2.1 4.5-5.4 0-.7-.1-1.4-.2-2.2'
  + ' -.9.2-1.8.3-2.7.3zm2.9-1.9c2.5-.5 4.4-2.7 4.4-5.4 0-3-2.3-5.2-5.3-5.2'
  + ' -.4 0-.9 0-1.3.1 .8 3.6 1.7 7 2.2 10.5zm-1.8-.2c-.5-3.4-1.3-6.8-2.1-10.3'
  + ' -1.7 1.7-2.9 3.7-2.9 6 0 2.4 2.1 4.3 5 4.3zm2.2-15.4c2-2.2 3.3-4.7 3.3-7.4'
  + ' 0-1.8-.5-3.4-1.4-4.6-1.9 2-3.1 5-3.1 8.4 0 1.2.1 2.4.3 3.6z';

function el(tag, attrs){
  const n = document.createElementNS(SVG_NS, tag);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  return n;
}

/** Altura vertical de una nota en el pentagrama (clave de sol octavada). */
function staffY(midi){
  const written = midi + 12;                   // la guitarra suena una octava más grave
  const oct = Math.floor(written/12) - 1;
  const steps = {0:0,1:0,2:1,3:1,4:2,5:3,6:3,7:4,8:4,9:5,10:5,11:6}[written%12];
  const pos = oct*7 + steps;
  const e4  = 4*7 + 2;                         // Mi de la primera línea
  return STAFF_BOTTOM - (pos - e4) * GAP/2;
}
/** Altura de una nota ESCRITA (F5.1): la da su letra, no su sonido. Si♭3 va
 *  en la línea del Si aunque suene como La♯3, que iría en el espacio del La. */
function staffYEscrita(n, midi){
  const written = midi + 12;
  const pos = octavaEscrita(n, written) * 7 + n.letra;
  return STAFF_BOTTOM - (pos - (4*7 + 2)) * GAP/2;
}
function isSharp(midi){ return [1,3,6,8,10].includes(((midi%12)+12)%12); }

function drawStaffBase(svg, x1, x2){
  svg.innerHTML = '';
  for (let i=0;i<5;i++){
    const y = STAFF_TOP + i*GAP;
    svg.appendChild(el('line',{x1:x1,x2:x2,y1:y,y2:y,class:'staff-line'}));
  }
  // La clave se dibuja a escala y se coloca de modo que su espiral quede
  // sobre la segunda línea, que es donde va el Sol.
  const clef = el('path',{ d:CLEF_PATH, fill:'#e8a45c',
    transform:'translate(4,'+(STAFF_TOP-16)+') scale(1.15)' });
  svg.appendChild(clef);
  const eight = el('text',{x:16,y:STAFF_BOTTOM+20,fill:'#e8a45c',
    'font-size':11,'font-family':'Georgia, serif','font-style':'italic'});
  eight.textContent = '8';
  svg.appendChild(eight);
}

/**
 * La guitarra abarca más registro del que cabe en un pentagrama sin volverse
 * ilegible. Cuando una nota se aleja demasiado, se dibuja transportada una o
 * dos octavas y se marca con 8va / 15ma / 8vb, que es la convención de la
 * notación musical para exactamente este problema.
 */
function fitOctave(midi){
  let shift = 0;
  while (staffY(midi - shift) < STAFF_TOP - 3*GAP && shift < 24)  shift += 12;
  while (staffY(midi - shift) > STAFF_BOTTOM + 4*GAP && shift > -12) shift -= 12;
  const mark = shift === 12 ? '8va' : shift === 24 ? '15ma' : shift === -12 ? '8vb' : '';
  return { drawMidi: midi - shift, mark };
}

/** Dibuja una nota con sus líneas adicionales, su plica y su marca de octava. */
function drawNote(svg, realMidi, x, color, withStem, esc){
  const { drawMidi, mark } = fitOctave(realMidi);
  const midi = drawMidi;
  // Con nota escrita (escalas), su letra y su alteración; si no, la de siempre.
  const y = esc ? staffYEscrita(esc, midi) : staffY(midi);
  if (mark){
    const m = el('text',{x:x+13,y:y-6,fill:color,'font-size':11,
      'font-family':'Georgia, serif','font-style':'italic'});
    m.textContent = mark;
    svg.appendChild(m);
  }
  // líneas adicionales por encima
  for (let ly = STAFF_TOP - GAP; ly >= y - GAP/4; ly -= GAP)
    svg.appendChild(el('line',{x1:x-10,x2:x+10,y1:ly,y2:ly,class:'ledger-line'}));
  // líneas adicionales por debajo
  for (let ly = STAFF_BOTTOM + GAP; ly <= y + GAP/4; ly += GAP)
    svg.appendChild(el('line',{x1:x-10,x2:x+10,y1:ly,y2:ly,class:'ledger-line'}));
  const alt = esc ? ALTERACION[esc.alt] : (isSharp(midi) ? '\u266F' : '');
  if (alt){
    const s = el('text',{x:x-14,y:y+3,fill:color,'font-size':16,'font-family':'Georgia, serif','text-anchor':'middle'});
    s.textContent = alt;
    svg.appendChild(s);
  }
  svg.appendChild(el('ellipse',{cx:x,cy:y,rx:6,ry:4.5,fill:color,
    transform:'rotate(-20 '+x+' '+y+')'}));
  if (withStem){
    const up = y > (STAFF_TOP+STAFF_BOTTOM)/2;
    svg.appendChild(el('line',{
      x1: up ? x+5 : x-5, x2: up ? x+5 : x-5,
      y1: y, y2: up ? y-26 : y+26,
      stroke: color, 'stroke-width': 1.5
    }));
  }
}

function showOnStaff(midi, color){
  const svg = document.getElementById('staff');
  drawStaffBase(svg, 38, 320);
  drawNote(svg, midi, 185, color, true);
}
function clearStaff(){
  drawStaffBase(document.getElementById('staff'), 38, 320);
}
