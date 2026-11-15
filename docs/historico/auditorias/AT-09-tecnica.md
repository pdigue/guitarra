# AT-09 · Auditoría técnica (F5: escalas, 0.5.1 y 0.5.2)

**Fecha:** 21/10/2026 · **Alcance:** código de la rama `auto/F5.5-ajustes-visuales` (0.5.2): notas escritas, escalas, «Al fallar», ♯/♭ por nota y ajustes visuales · **Auditor:** de solo lectura, ronda ligera. Banco 66 de 66; cada hallazgo, reproducido con `dom-minimo`.

**Música correcta,** comprobada ejecutando el código: las 48 escalas como en el círculo de quintas (siete o cinco letras distintas, sin dobles alteraciones ni mezclas; Fa♯ mayor y Re♯ menor con Mi♯), los intervalos de las pentatónicas, `octavaEscrita` en los casos límite (Si♯3, Do♭4, Mi♯4, Fa♭4), la altura de cada nota en el pentagrama y el paso a paso en todas las afinaciones predefinidas.

**Sin hallazgos críticos ni altos.** Todo lo medio y casi todo lo bajo se corrige en la `0.5.3`, con dos pruebas nuevas (banco 68 de 68).

| # | Severidad | Hallazgo | Resolución |
|---|---|---|---|
| 1 | Medio | «Restablecer» dejaba Escalas y los botones ♯/♭ con lo de antes | El manejador reinicia la práctica y repinta todo con `refreshNoteText()` |
| 2 | Medio | Al salir de Escalas, el pentagrama seguía enseñando la escala | `leaveScales` vuelve a la última nota, o lo deja vacío |
| 3 | Medio | Cambiar de afinación en Práctica mantenía casillas que ya sonaban a otra nota | La práctica se reinicia al cambiar de afinación |
| 4 | Medio | Dos fallos seguidos dejaban una casilla roja (temporizador compartido) | `marcarUnMomento`: un temporizador por casilla, en un `WeakMap` |
| 5 | Medio | En Escalas, el lector grande y el de pantalla decían La♯ donde la escala escribe Si♭ | Una sola función, `escrituraEnPantalla`, para mástil, lector y etiquetas |
| 6 | Bajo | El aviso de Práctica no cambiaba de nomenclatura | El nombre se calcula al pintar el aviso |
| 7 | Bajo | El pentagrama del Afinador ignoraba ♯/♭ | Usa tu escritura y se repinta al cambiarla |
| 8 | Bajo | Pulsar un botón ♯/♭ rehacía los botones y se perdía el foco | Solo cambian sus nombres |
| 9 | Bajo | Con el reto en pausa al volver a la app, «Ver la respuesta» seguía visible | Se oculta hasta pulsar ▶ |
| 10 | Bajo | Con afinaciones personalizadas muy graves (≤ Do2), el paso a paso puede escribir las primeras notas con 8vb | Anotado; no ocurre con las predefinidas. Se revisa en CP-5 |
| 11 | Bajo | Huecos en el banco: altura del Si♭, pentagrama estrecho, casos 1 a 4 | Cubiertos por las dos pruebas nuevas |
| 12 | Bajo | `README.md` citaba «12-arranque» | Corregido |
