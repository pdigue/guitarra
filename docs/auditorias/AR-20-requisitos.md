# AR-20 · Auditoría de requisitos ligera · F6.2 Service Worker (0.6.8)

**Fecha:** 16/11/2026 · **Auditor:** requisitos (solo lectura)
**Entrada:** diff de requisitos.md y sus generadores, y diff del bloque (CHANGELOG, ESTADO, roadmap, `sw.js`, `99-arranque.js`, `comprobar-sin-conexion.js` y pruebas); consultas a `compatibilidad.md`, `requisitos.md` (G-04, G-07, G-08, PL-01 a PL-04, X-01 a X-03), la matriz y el roadmap (F6.2, F7.2).
**Lecturas usadas:** 7 de 10. **Requisito cambiado:** G-03, de ⬜ a 🟡 (requisitos v2.5, matriz v2.5, roadmap v4.5).

**Veredicto:** nada bloqueante (ni críticos ni altos). El estado declarado es honesto: el criterio separa la parte de F6.2 (`localhost`), hecha y con evidencia, de la de F7.2 (web publicada), que falta. El control de cambios cita G-03 y cuadra con roadmap 4.5, CHANGELOG 0.6.8 y ESTADO; los totales también (118 en requisitos y en la matriz).

## Medio
1. **PL-04 y `compatibilidad.md` no se actualizan aunque F6.2 añade una capacidad.** La fila del Service Worker no dice que se usa desde la 0.6.8; no hay fila para Cache Storage ni advertencia del iPhone; PL-04 no está en la lista de cambios de la v2.5 y su evidencia cita `compatibilidad.md` v1.8. *Propuesta:* compatibilidad v1.13 (fila del SW al día, fila de Cache Storage, aviso de Safari: borra lo guardado por un sitio sin usar unos 7 días si no está en la pantalla de inicio; mirar el modo privado) y PL-04 en la v2.5.
2. **En el iPhone, G-03 depende de que la app esté instalada (G-04), y el criterio de F7.2 no lo dice.** *Propuesta:* criterio de F7.2 «en el iPhone, desde Safari y desde la app instalada, también tras varios días sin abrirla»; en la nota de G-03, que en iOS depende de G-04; en ESTADO §2, una prueba temprana en la web de pruebas (con red, modo avión, volver a abrir).
3. **El roadmap marca F6.2 como ✅ con G-03 en parcial**, contra la regla de cierre de la matriz. *Propuesta:* «✅ parte de F6.2 (`localhost`); G-03 se cierra en F7.2».

## Bajo
4. **La evidencia dice más de lo que se mide:** «suenan los dos timbres», pero se comprueba que las grabaciones se cargan de la copia y que se tocan notas sin error, no que salga audio. *Propuesta:* redactarlo así.
5. **No hay señal de «lista sin conexión»:** si se pone el modo avión justo tras la primera carga, puede no abrir. *Propuesta:* criterio «tras una primera carga completa (Service Worker activo)»; un aviso en Ajustes sería alcance nuevo (decide Pablo).
6. **Una actualización con red lenta (> 3 s) muestra la versión anterior** hasta la siguiente apertura. *Propuesta:* explicarlo en las instrucciones de prueba de ESTADO §2.
7. G-08 y X-03 no necesitan cambios.
