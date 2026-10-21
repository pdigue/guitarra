# AT-10 · Auditoría técnica (F5.6 metrónomo y F5.7 acordes)

**Fecha:** 21/10/2026 · **Alcance:** código de la 0.5.4 y la 0.5.5 · **Auditor:** de solo lectura, ronda ligera. Banco 78 de 78. El auditor no pudo ejecutar sus pruebas (se cayó el clasificador de permisos) y siguió cada caso leyendo el código. La prueba nueva del banco reproduce y comprueba los hallazgos 1, 2, 3, 5 y 7.

**Música correcta:**
- **Acordes:** las 30 digitaciones son las estándar y sus notas se escriben bien (B7 con Re♯; Gm, Fm y C7 con bemoles). Los bajos de C/G y G/B son correctos.
- **Metrónomo:** los compases compuestos tienen dos, tres o cuatro pulsos de negra con puntillo. El programador no se desvía, y no deja temporizadores colgados.

**Sin hallazgos críticos ni altos.** Todo se corrige en la `0.5.6`.

| # | Severidad | Hallazgo | Resolución |
|---|---|---|---|
| 1 | Medio | Cambiar de compás sonando desplazaba el pulso si el siguiente golpe era una subdivisión | El compás nuevo empieza en el próximo pulso |
| 2 | Medio | Tras un bloqueo del navegador, los golpes atrasados sonaban de golpe | Se saltan |
| 3 | Medio | Elegir figura rehacía los botones y se perdía el foco | Se crean una vez; solo cambian dibujo y etiquetas |
| 4 | Bajo | En 3/8, 5/8 y 7/8 el pulso es la corchea, pero las figuras eran las de la negra | Figuras derivadas del pulso; dosillo y cuatrillo en los compuestos |
| 5 | Bajo | El aviso del metrónomo no cambiaba de idioma ni se borraba al restablecer | Se guarda la clave; Restablecer lo borra |
| 6 | Bajo | Con el audio rehecho o en pausa por el sistema, el metrónomo seguía «en marcha» sin sonar | Se para y lo dice |
| 7 | Bajo | Restablecer no limpiaba el buscador de acordes | Lo limpia |
| 8 | Bajo | Alteraciones cercanas se pisaban en el pentagrama del acorde | Dos columnas |
| 9 | Bajo | `aria-pressed` y texto a la vez en Empezar/Parar; sin `aria-haspopup` en el compás; `tapPuntero` atascado con `pointercancel` | Corregidos |
