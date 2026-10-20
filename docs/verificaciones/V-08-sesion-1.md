# V-08 · Resultados de la Sesión 1

**Fecha:** 20 de octubre de 2026 · **App probada:** `0.3.2` (web de pruebas y `dist/trasteando.html`) · **Quién:** Pablo, en su PC con Windows y su iPhone · **Protocolo:** `sesion-1-protocolo.md` (41 pruebas)

**Etapas que cierra:** F1.1 (lista en el navegador), F2.5 (archivo autónomo en cada plataforma) y F3.3 (uso real en el móvil, con la guitarra).

## Resumen

| | Pruebas |
|---|---|
| Cumplen | 39 |
| No cumplen | 1 (A16: icono de la pestaña) |
| Pendientes | 2 (E05, lo dejas para más adelante; E06 son tus notas) |

**Requisitos validados:** 40 (lista en `requisitos.md` v1.15). Con S-07, S-08 y C-06, ya son 43.

**Sin validar todavía, con motivo:** S-01 (el sonido se quedó mudo en el iPhone), A-01 y A-06 (afinar de oído, E05), y PL-01, PL-03 y G-04, que son parciales hasta publicar (F7.2).

## Resultados

| Prueba | Resultado | Tu nota | Qué se hace |
|---|---|---|---|
| A01 a A03, A05 a A08 | Cumple | — | — |
| A04 Afinación del agudo | Cumple | Con un afinador online, todas las notas del mástil afinadas; el timbre no es igual | S-09 (timbre), para después |
| A09 Fallar en Adivinar | Cumple | Muy poco tiempo entre tu nota y la corrección; ¿relleno rojo al fallar y verde al acertar? | **0.3.3:** corrección a 1,2 s y reto siguiente 3 s después; relleno con ✗ y ✓ |
| A10 Ver todas las notas | Cumple | El interior negro no queda limpio; probar interior claro | C-08 (personalización), para después |
| A11 a A13 | Cumple | — | — |
| A14 Restablecer desde la acústica | Cumple | Al elegir guitarra suena una nota; restablecer borra el récord | **0.3.3:** sin nota al elegir; el récord se conserva y se borra con su propio botón |
| A15 | Cumple | — | — |
| A16 Sin errores en la consola | **No cumple** | `favicon.ico` da 404 | **0.3.3:** la página declara su icono |
| A17 a A19, B01 a B04 | Cumple | — | — |
| C01 a C03 | Cumple | — | — |
| C04 Zoom en el iPhone | Cumple | Llega hasta 17 trastes | — |
| C05 | Cumple | — | — |
| C06 Los colores de las notas | Cumple | Alternativa: solo el nombre, más grande o en negrita; varias opciones de nota, traste y colores en un menú de personalización | C-08, para después |
| C07 El primer reto tras bloquear | Cumple | No se queda mudo, pero la corrección suena con el iPhone bloqueado | **0.3.3:** al ocultar la app se corta y se cancela todo |
| C08 Muchas notas deprisa | Cumple | La primera vez se quedó mudo, ni recargando; cerrar y abrir lo arregló | **0.3.3:** audio rehecho al volver si no responde, y «Reactivar sonido» en Ajustes |
| C09, D01, D02 | Cumple | — | — |
| D03 Horizontal en la app instalada | Cumple | Se volvió a quedar mudo; cerrar y abrir lo arregló | Igual que C08 |
| E01, E02 | Cumple | — | — |
| E03 y E04 (con la guitarra) | Cumple | Timbre diferente; a pulir más adelante | S-09, para después |
| E05 Afinar de oído | Pendiente | Aún no sabes hacerlo; para más adelante | A-01 y A-06 siguen sin validar |
| E06 Lo incómodo | Pendiente | El sonido de Adivinar empieza solo; la nota grande es la última pulsada y confunde | **0.3.3:** Adivinar empieza con ▶ y la lectura grande es la nota buscada |

## El sonido que se queda mudo en el iPhone

Es un fallo conocido de Safari en las apps de la pantalla de inicio ([WebKit 291892](https://bugs.webkit.org/show_bug.cgi?id=291892)): al volver de segundo plano, a veces el audio dice «activo» y no suena. Que recargar no lo arregle y cerrar la app sí apunta a eso. La 0.3.3 lo ataca por tres lados:

1. Al ocultar la app (bloquear o cambiar de app) corta las notas, cancela lo programado y pausa el audio. Así tampoco suena nada con la pantalla apagada (C07).
2. Al volver lo reanuda. Si a los 0,4 s no responde, el siguiente toque crea un audio nuevo.
3. Ajustes → Sonido enseña el estado («activo», «en pausa», «interrumpido por el sistema»…) y tiene **«Reactivar sonido»**, que crea un audio nuevo aunque diga «activo».

No se puede reproducir en el ordenador, así que **se confirma en la Sesión 2**. Si vuelve a pasar, anota qué decía «Estado del sonido» y si «Reactivar sonido» lo arregló: así sabremos qué variante del fallo es.

## Comprobación de las correcciones

Banco 39 de 39: las 6 pruebas nuevas fallan con la 0.3.2 y pasan con la 0.3.3. En Chromium: `comprobar-disposicion.js` (14 pantallas), `comprobar-accesibilidad.js` (el botón nuevo cumple 40 px y 4,5:1), las 15 comprobaciones de F1.1 y el archivo autónomo, todo bien.
