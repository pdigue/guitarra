# Informe V-09 · Afinador por micrófono (F4.1 a F4.3)

**Fecha:** 21/10/2026 · **App:** `0.4.0` · **Requisitos:** A-02, A-02-CA, A-03, A-04, A-05, G-08, PL-04

## 1. Comprobaciones automáticas

| Qué | Herramienta | Resultado |
|---|---|---|
| Precisión frente a la frecuencia medida: 12 grabaciones (6 cuerdas × 2 timbres), cada una a 7 desafinaciones de −45 a +40 cents | `tests/tono.test.js` | Peor error **1,86 cents** (límite 2) |
| Precisión trozo a trozo (lo que cambia la clavija, en cada instante) | `tests/tono.test.js` | Peor error **1,01 cents** |
| Latencia: del ataque a la aguja en su nota, con un trozo cada 50 ms | `tests/tono.test.js` | **168 ms** como mucho, más hasta 3 ms de cálculo (límite 300) |
| Silencio y ruido no dan nota; tonos sintéticos de 61 a 440 Hz | `tests/tono.test.js` | ±1 cent |
| Sin `Worker`, el detector va en el hilo principal | `tests/tono.test.js` | Mismo resultado |
| No escucha hasta pulsar «Activar»; La2 −12 cents → «Sube un poco»; +3 → «Afinada»; Si3 −80 → 2ª cuerda; Fa4 → 1ª; silencio → reposo; se apaga al salir | `tests/banco.test.js` | Cumple |
| Cuerda elegida a mano manda (La2 sonando con la 6ª elegida → +500 cents), sin confundir la octava; se apaga al ocultar la app | `tests/banco.test.js` | Cumple |
| Sin permiso explica cómo darlo; como archivo dice por qué y desactiva el botón; De oído sigue | `tests/banco.test.js` | Cumple |
| Cadena completa en Chromium, con una grabación real de la 5ª cuerda 12 cents baja como micrófono | `herramientas/comprobar-afinador.js` | «**La2 · −11 cents · 5ª cuerda · ▲ Sube un poco**» en vertical y en horizontal, detector en su hilo, controles de 40 px, todo a la vista, sin errores. (−11 y no −12 porque esa grabación suena 0,8 cents alta) |
| La app en módulos funciona igual | Banco completo, `comprobar-disposicion.js`, `comprobar-accesibilidad.js`, `comprobar-en-navegador.js`, `comprobar-autonomo.js` | Todo correcto |

Capturas: `capturas-afinador/afinador-micro-vertical.png`, `…-horizontal.png` y `…-archivo.png`.

## 2. Lo que falta: tu comprobación con la guitarra (10 minutos)

En el iPhone, con Safari, en **https://pdigue.github.io/guitarra/**, o en el PC con Chrome o Edge. Ten a mano tu afinador de siempre para comparar.

| # | Haz | Resultado esperado |
|---|---|---|
| M1 | Afinador → **Micrófono** → «Activar el micrófono» → Permitir | La aguja en reposo y «Toca una cuerda» |
| M2 | Toca la 5ª cuerda al aire | «La2 · … · 5ª cuerda»; la orden coincide con tu afinador (a 3 cents o menos) |
| M3 | Afina las 6 cuerdas con la app, en «Auto», hasta ver «✓ Afinada» en cada una | Tu afinador confirma cada cuerda a ±5 cents |
| M4 | Afloja la 6ª cerca de un semitono, elige **6** a mano y vuelve a afinarla | «Mi2 · unos −100 cents · ▲ Sube», y te lleva hasta «✓ Afinada» |
| M5 | Cambia la afinación a **Drop D** y afina la 6ª en «Auto» | «Re2 · 6ª cuerda» y «✓ Afinada» al llegar. Vuelve a Estándar al terminar |
| M6 | Bloquea el móvil y desbloquéalo | El micrófono se ha apagado: vuelve el botón «Activar» y el indicador de micrófono del sistema desaparece |
| M7 | Ve a **Libre** y toca unas notas | Suenan como siempre, por el altavoz |
| M8 | Lo que te haya resultado incómodo | Si la aguja tiembla, tarda o se equivoca de cuerda |
