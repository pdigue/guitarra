"use strict";
// 00-aspecto.js · Pone el tema guardado en <html> antes de pintar nada (F5.8 #3, AT-15 #3).
// Va en el <head>: si esperara a syncUI(), la página saldría un instante con
// el tema de fábrica aunque hubieras elegido otro. syncUI() lo completa después
// (data-scheme, la barra del sistema). Si algo falla, se queda el de fábrica,
// Partitura, que ya trae <html data-theme="partitura"> (decisión del 17/11).
(function(){   // dentro de una función: no deja variables sueltas para los demás archivos
try {
  // El tema, su esquema (claro u oscuro) y el color de la barra del sistema, los
  // tres antes de pintar: si solo se pusiera el tema, «Automático» en oscuro
  // saldría un instante con la paleta clara (AT-24 M1). Un valor desconocido,
  // como en sanitize() de 02-estado.js, vuelve al de fábrica.
  var guardado = JSON.parse(localStorage.getItem('trasteando.v1') || '{}') || {};
  var tema = ['madera','auto','partitura'].indexOf(guardado.theme) >= 0 ? guardado.theme : 'partitura';
  var oscuro = tema === 'madera' || (tema === 'auto' && !!window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches);
  var html = document.documentElement;
  html.setAttribute('data-theme', tema);
  html.setAttribute('data-scheme', oscuro ? 'dark' : 'light');
  // La hoja de estilos ya está cargada (va antes en <head>): el fondo sale de ella.
  var meta = document.querySelector('meta[name="theme-color"]');
  var fondo = window.getComputedStyle ? getComputedStyle(html).getPropertyValue('--bg').trim() : '';
  if (meta && fondo) meta.setAttribute('content', fondo);
} catch (e) {}
})();
