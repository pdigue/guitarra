"use strict";
// 00-aspecto.js · Pone el tema guardado en <html> antes de pintar nada (F5.8 #3, AT-15 #3).
// Va en el <head>: si esperara a syncUI(), la página saldría un instante con
// Madera aunque hubieras elegido otro tema. syncUI() lo completa después
// (data-scheme, la barra del sistema). Si algo falla, se queda Madera.
(function(){   // dentro de una función: no deja variables sueltas para los demás archivos
try {
  var guardado = JSON.parse(localStorage.getItem('trasteando.v1') || '{}');
  if (guardado && guardado.theme) document.documentElement.setAttribute('data-theme', guardado.theme);
} catch (e) {}
})();
