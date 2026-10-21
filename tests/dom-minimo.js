// DOM mínimo para probar la app sin navegador y sin instalar nada.
//
// Por qué existe: las pruebas tienen que poder ejecutarse en cualquier sitio
// con `node --test`, incluido un agente en la nube sin acceso a
// paquetes externos. Esto no imita un navegador entero: implementa solo lo que
// usa index.html (elementos, clases, atributos, eventos con burbujeo y
// selectores sencillos). No sirve para medir nada visual.
'use strict';
const fs = require('fs');
const vm = require('vm');

function camelToData(k){ return 'data-' + k.replace(/[A-Z]/g, m => '-' + m.toLowerCase()); }
const foco = { el: null };   // qué elemento tiene el foco (document.activeElement)

class El {
  constructor(tag){
    this.tagName = tag.toUpperCase(); this.children = []; this.parentNode = null;
    this.attrs = new Map(); this._cls = new Set(); this._text = ''; this._html = '';
    this.listeners = {}; this.scrollLeft = 0; this.clientWidth = 0; this.offsetWidth = 0;
    const self = this;
    this.classList = {
      add: (...n) => n.forEach(x => self._cls.add(x)),
      remove: (...n) => n.forEach(x => self._cls.delete(x)),
      toggle: (n, f) => { const on = f === undefined ? !self._cls.has(n) : !!f;
        on ? self._cls.add(n) : self._cls.delete(n); return on; },
      contains: n => self._cls.has(n)
    };
    const props = {};
    this.style = { setProperty: (k, v) => { props[k] = String(v); }, getPropertyValue: k => props[k] || '' };
    this.dataset = new Proxy({}, {
      get: (_, k) => typeof k === 'string' ? (self.getAttribute(camelToData(k)) ?? undefined) : undefined,
      set: (_, k, v) => { self.setAttribute(camelToData(k), String(v)); return true; }
    });
  }
  get id(){ return this.getAttribute('id') || ''; }
  get className(){ return [...this._cls].join(' '); }
  set className(v){ this._cls = new Set(String(v).split(/\s+/).filter(Boolean)); }
  get hidden(){ return this.attrs.has('hidden'); }
  set hidden(v){ v ? this.attrs.set('hidden', '') : this.attrs.delete('hidden'); }
  setAttribute(k, v){ if (k === 'class') this.className = v; else this.attrs.set(k, String(v)); }
  getAttribute(k){ return k === 'class' ? this.className : (this.attrs.has(k) ? this.attrs.get(k) : null); }
  appendChild(c){ c.parentNode = this; this.children.push(c); return c; }
  get textContent(){ return this._text + this.children.map(c => c.textContent).join(''); }
  set textContent(v){ this.children = []; this._html = ''; this._text = String(v); }
  get innerHTML(){ return this._html || this._text; }
  set innerHTML(v){ this.children = []; this._text = ''; this._html = String(v); }
  focus(){ foco.el = this; }
  addEventListener(t, f){ (this.listeners[t] ||= []).push(f); }
  dispatchEvent(ev){
    ev.target ||= this; ev.preventDefault ||= () => {};
    for (let n = this; n; n = n.parentNode){ ev.currentTarget = n; (n.listeners[ev.type] || []).forEach(f => f(ev)); }
  }
  click(){ this.dispatchEvent({ type: 'click' }); }
  *descendants(){ for (const c of this.children){ yield c; yield* c.descendants(); } }
  querySelectorAll(sel){ return [...this.descendants()].filter(e => matches(e, sel, this)); }
  querySelector(sel){ return this.querySelectorAll(sel)[0] || null; }
  closest(sel){ for (let n = this; n && n.tagName; n = n.parentNode) if (matches(n, sel, null)) return n; return null; }
}

function compound(el, c){
  const toks = c.match(/([#.]?[\w-]+|\[[^\]]+\])/g) || [];
  return toks.every(t => {
    if (t[0] === '#') return el.id === t.slice(1);
    if (t[0] === '.') return el.classList.contains(t.slice(1));
    if (t[0] === '['){
      const m = t.slice(1, -1).match(/^([\w-]+)(?:="([^"]*)")?$/);
      return m[2] === undefined ? el.attrs.has(m[1]) : el.getAttribute(m[1]) === m[2];
    }
    return el.tagName === t.toUpperCase();
  });
}
function matches(el, sel, scope){
  if (!el.tagName || el.tagName === '#TEXT') return false;
  return sel.split(',').some(s => {
    const parts = s.trim().split(/\s+/);
    if (!compound(el, parts[parts.length - 1])) return false;
    let need = parts.length - 2, n = el.parentNode;
    while (need >= 0 && n && n !== scope){ if (n.tagName && compound(n, parts[need])) need--; n = n.parentNode; }
    return need < 0;
  });
}

// Analizador de HTML suficiente para el <body> de index.html.
const VOID = new Set(['meta','link','br','img','input','hr','source']);
function parseBody(src){
  const start = src.indexOf('<body>');
  const body = new El('body');
  const stack = [body];
  const re = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][\w-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>|([^<]+)/g;
  re.lastIndex = start + 6;
  let m;
  while ((m = re.exec(src))){
    if (m[0].startsWith('<!--')) continue;
    if (m[4] !== undefined){ const t = m[4].trim(); if (t){ const n = new El('#text'); n._text = t; stack[stack.length - 1].appendChild(n); } continue; }
    const closing = m[1] === '/', tag = m[2].toLowerCase(), attrs = m[3] || '';
    if (tag === 'body' && closing) break;
    if (tag === 'script' || tag === 'style'){
      if (!closing){ const end = src.indexOf('</' + tag + '>', re.lastIndex); re.lastIndex = end + tag.length + 3; }
      continue;
    }
    if (closing){
      for (let i = stack.length - 1; i > 0; i--) if (stack[i].tagName === tag.toUpperCase()){ stack.length = i; break; }
      continue;
    }
    const el = new El(tag);
    const ar = /([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g; let a;
    while ((a = ar.exec(attrs))) el.setAttribute(a[1], a[2] ?? a[3] ?? a[4] ?? '');
    stack[stack.length - 1].appendChild(el);
    if (!VOID.has(tag) && !/\/\s*$/.test(attrs)) stack.push(el);
  }
  return body;
}

// Desde la 0.4.0 el código está repartido en js/; ensamblar.js sabe leer las dos
// formas (varios archivos, o uno solo en las versiones anteriores).
const { ensamblar, scripts } = require('../herramientas/ensamblar');

/** Arranca la app en un contexto aislado. `preset` simula ajustes ya guardados;
 *  `extra` añade o sustituye capacidades del navegador (matchMedia, history…)
 *  para probar cómo responde la app a cada una (PL-04). */
function boot(htmlPath, preset, extra){
  const src = fs.readFileSync(htmlPath, 'utf8');
  const body = parseBody(src);
  foco.el = null;
  const html = new El('html'); html.appendChild(body);
  const store = new Map(preset ? [['trasteando.v1', JSON.stringify(preset)]] : []);
  const errors = [];
  const doc = {
    body, documentElement: html, listeners: {},
    get activeElement(){ return foco.el || body; },
    getElementById: id => [...html.descendants()].find(e => e.id === id) || null,
    createElement: t => new El(t), createElementNS: (_, t) => new El(t),
    querySelectorAll: s => html.querySelectorAll(s), querySelector: s => html.querySelector(s),
    addEventListener(t, f){ (this.listeners[t] ||= []).push(f); }
  };
  const ctx = {
    document: doc, navigator: {}, innerWidth: 390, innerHeight: 844,
    localStorage: { getItem: k => store.has(k) ? store.get(k) : null, setItem: (k, v) => store.set(k, String(v)) },
    getComputedStyle: el => ({ getPropertyValue: k => el.style.getPropertyValue(k) }),
    requestAnimationFrame: f => setTimeout(f, 0), cancelAnimationFrame: id => clearTimeout(id),
    setTimeout, clearTimeout, clearInterval, confirm: () => true, atob, btoa,
    // Un temporizador repetido (el del micrófono) no debe impedir que el banco
    // termine si una prueba falla antes de apagarlo.
    setInterval: (f, ms) => { const h = setInterval(f, ms); h.unref(); return h; },
    console: { log(){}, warn(){}, error: (...a) => errors.push(a.map(String).join(' ')) },
    // Los avisos de la ventana (resize, popstate…) se guardan para poder lanzarlos.
    winListeners: {},
    addEventListener(t, f){ (this.winListeners[t] ||= []).push(f); }
  };
  Object.assign(ctx, extra || {});
  ctx.window = ctx;
  vm.createContext(ctx);
  // Cada archivo se ejecuta por separado, como hace el navegador con cada
  // <script>: si uno usara al cargarse algo de un archivo posterior, fallaría aquí.
  for (const { nombre, codigo } of scripts(htmlPath)) vm.runInContext(codigo, ctx, { filename: nombre });
  const $ = id => doc.getElementById(id);
  const ev = js => vm.runInContext(js, ctx);
  const press = (cell, drag) => {
    const strings = $('strings');
    cell.dispatchEvent({ type: 'pointerdown', clientX: 10, clientY: 10, pointerId: 1 });
    if (drag) strings.dispatchEvent({ type: 'pointermove', clientX: 40, clientY: 10, pointerId: 1, target: cell });
    strings.dispatchEvent({ type: 'pointerup', clientX: drag ? 40 : 10, clientY: 10, pointerId: 1, target: cell });
  };
  const fireWin = (type, ev) => (ctx.winListeners[type] || []).forEach(f => f(Object.assign({ type }, ev)));
  return { $, ev, doc, store, errors, press, fireWin };
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
module.exports = { boot, sleep, El, fuente: ensamblar };
