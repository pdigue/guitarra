# Créditos y licencias

Todo lo que Trasteando usa y no hemos creado nosotros, de dónde sale y con qué
licencia. Lo exige el requisito **G-06** y, para el audio, **S-07**.

**Última revisión:** 19/10/2026

---

## Resumen

| Recurso | Autor | Licencia | Cómo lo usamos |
|---|---|---|---|
| Muestras de guitarra clásica (nylon) | quartertone, en Freesound; editadas por Nicholaus P. Brosowsky | CC BY 4.0 el original · CC BY 3.0 la edición | Copia exacta en `samples/nylon/` |
| Muestras de guitarra acústica (acero) | University of Iowa Electronic Music Studios; editadas por Nicholaus P. Brosowsky | Uso sin restricciones el original · CC BY 3.0 la edición | Copia exacta en `samples/acoustic/` |
| Tone.js 14.8.49 | Yotam Mann y colaboradores | MIT | Usado hasta la 0.1.5. Desde la 0.2.0 la app tiene su propio reproductor y no lo carga |

**CC BY** permite copiar, modificar y distribuir, también con fines comerciales,
con una condición: citar al autor, la obra, la licencia y si se hicieron cambios.
Esa cita es el texto de atribución de abajo. **MIT** solo pide conservar el aviso
de copyright y la licencia junto al código.

## Texto de atribución

Este es el texto que acompaña a la app cuando se distribuya. Antes de publicar
(F6.4) aparecerá también dentro de la app, en Ajustes.

> Sonido de guitarra clásica: «ClassicalGuitar-multisampled», de quartertone
> (freesound.org), licencia CC BY 4.0. Sonido de guitarra acústica: University
> of Iowa Electronic Music Studios. Ambos editados por Nicholaus P. Brosowsky en
> *tonejs-instruments* (github.com/nbrosowsky/tonejs-instruments), licencia
> CC BY 3.0 (creativecommons.org/licenses/by/3.0). Trasteando los usa sin
> modificar, salvo en el archivo autónomo, donde van recortados a 4,5 s con un
> fundido final y recodificados a 128 kbps.

---

## Procedencia y verificación

Las muestras se copiaron del repositorio *tonejs-instruments*, commit
`622c2f1` del 7 de mayo de 2022, el mismo del que la app las descargaba hasta
ahora. Se copian byte a byte: la huella `sha256` de cada archivo identifica la
versión exacta y permite comprobar que nadie la ha cambiado.

| Comprobación | Fuente | Resultado | Fecha |
|---|---|---|---|
| Licencia de la edición de Brosowsky | `LICENSE.md` del repositorio: «SAMPLES RELEASED UNDER CC-BY 3.0» | ✅ | 14/10/2026 |
| Origen de cada instrumento | `sample-source-info.txt`: «guitar ac - Iowa», «guitar ny - Freesound - 11573__quartertone__classicalguitar-multisampled» | ✅ | 14/10/2026 |
| Licencia del original acústico | theremin.music.uiowa.edu/MIS.html: «may be downloaded and used for any projects, without restrictions» | ✅ | 14/10/2026 |
| Licencia del original de nylon | Freesound, sonidos 183089 (14/10), 183078 y 183083 (20/10) del pack 11573, de cuerdas distintas: los tres «Attribution 4.0» | 🟡 comprobado en tres sonidos del pack | 20/10/2026 |
| Que todos los sonidos del pack 11573 tienen la misma licencia | Freesound asigna la licencia sonido a sonido | ⬜ pendiente: la lista completa solo se ve en la búsqueda de Freesound, cerrada a los agentes; la revisa el cliente en su navegador (filtro «License» del pack) | — |

## Archivos

Afinación medida con `herramientas/medir-afinacion.py`; el detalle está en
`samples/afinacion.json`. 100 cents son un semitono; por debajo de 5 no se
distingue de oído.

| Archivo | Nota | Cents | Peso | sha256 | Origen | Licencia |
|---|:---:|:---:|---:|---|---|---|
| `samples/nylon/E2.mp3` | E2 | -2,8 | 124 KB | `af94c24ff172` | quartertone (Freesound) → Brosowsky | CC BY 4.0 → CC BY 3.0 |
| `samples/nylon/A2.mp3` | A2 | +0,8 | 124 KB | `0e20a4c2cb84` | quartertone (Freesound) → Brosowsky | CC BY 4.0 → CC BY 3.0 |
| `samples/nylon/D3.mp3` | D3 | -2,4 | 124 KB | `aaeb2afa295e` | quartertone (Freesound) → Brosowsky | CC BY 4.0 → CC BY 3.0 |
| `samples/nylon/G3.mp3` | G3 | +2,6 | 75 KB | `85cbc7aeb849` | quartertone (Freesound) → Brosowsky | CC BY 4.0 → CC BY 3.0 |
| `samples/nylon/B3.mp3` | B3 | -0,6 | 75 KB | `9e4b3df9cda0` | quartertone (Freesound) → Brosowsky | CC BY 4.0 → CC BY 3.0 |
| `samples/nylon/E4.mp3` | E4 | -2,1 | 75 KB | `3f95d206021f` | quartertone (Freesound) → Brosowsky | CC BY 4.0 → CC BY 3.0 |
| `samples/nylon/A4.mp3` | A4 | -0,2 | 75 KB | `3436e55cf992` | quartertone (Freesound) → Brosowsky | CC BY 4.0 → CC BY 3.0 |
| `samples/nylon/As5.mp3` | As5 | -10,0 | 38 KB | `8b58374042aa` | quartertone (Freesound) → Brosowsky | CC BY 4.0 → CC BY 3.0 |
| `samples/nylon/E5.mp3` | E5 | -2,4 | 35 KB | `9ab5b711d43f` | quartertone (Freesound) → Brosowsky | CC BY 4.0 → CC BY 3.0 |
| `samples/acoustic/E2.mp3` | E2 | -1,9 | 254 KB | `917820984d1b` | Univ. de Iowa (MIS) → Brosowsky | Sin restricciones → CC BY 3.0 |
| `samples/acoustic/A2.mp3` | A2 | +1,0 | 270 KB | `43e339bcd75f` | Univ. de Iowa (MIS) → Brosowsky | Sin restricciones → CC BY 3.0 |
| `samples/acoustic/D3.mp3` | D3 | -2,5 | 301 KB | `861b74a32a91` | Univ. de Iowa (MIS) → Brosowsky | Sin restricciones → CC BY 3.0 |
| `samples/acoustic/G3.mp3` | G3 | -4,2 | 135 KB | `8a8ddf06e2d4` | Univ. de Iowa (MIS) → Brosowsky | Sin restricciones → CC BY 3.0 |
| `samples/acoustic/B3.mp3` | B3 | -0,5 | 118 KB | `2ab73ca750ca` | Univ. de Iowa (MIS) → Brosowsky | Sin restricciones → CC BY 3.0 |
| `samples/acoustic/E4.mp3` | E4 | +4,5 | 107 KB | `3b02f5448695` | Univ. de Iowa (MIS) → Brosowsky | Sin restricciones → CC BY 3.0 |
| `samples/acoustic/A4.mp3` | A4 | +2,8 | 95 KB | `1f8263f10e24` | Univ. de Iowa (MIS) → Brosowsky | Sin restricciones → CC BY 3.0 |
| `samples/acoustic/D5.mp3` | D5 | +1,9 | 76 KB | `c9d74d19e672` | Univ. de Iowa (MIS) → Brosowsky | Sin restricciones → CC BY 3.0 |

**Total:** 17 archivos, 2,1 MB. El As5 de nylon (F2.4) se desvía -10,0 cents; la app lo corrige al reproducirlo.

### Archivo descartado

`guitar-nylon/D5.mp3` **no se incluye**: la medición da 622,6 Hz, que es un
**Re♯5**, no un Re5 (+101 cents, un semitono entero). La app 0.1.2 lo usaba como
Re5, así que en el timbre de nylon todas las notas desde el Do5 hacia arriba
sonaban medio tono altas. La versión 0.1.3 de la app lo sustituye por `E5.mp3`,
que está afinado.
