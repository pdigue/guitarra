# Auditoría de requisitos — Trasteando

**De:** chat de Auditoría
**Para:** chat de Desarrollo
**Referencia:** `requisitos.md` v1.0 (14/09/2026), contrastado contra `index.html` actual
**Fecha del informe:** 15 de septiembre de 2026

---

## 1. [CRÍTICO] El documento está desincronizado del código — actualizar `Estado` antes de seguir planificando

Contando directamente sobre `index.html`, estos IDs están marcados `Pendiente` pero **ya implementados y funcionales**:

- **G-01** (nombre en title/manifest)
- **J-01, J-02, J-03, J-04, J-05, J-06, J-07, J-08, J-09** (modo Juego completo: nota aleatoria, validación por cualquier posición, refuerzo de posiciones válidas, ambas pistas, toggle de pistas sin menú, racha, récord persistente, feedback visual)
- **L-03** (mostrar posiciones iguales)
- **A-01, A-06, A-07, A-08, A-10, A-11** (afinador por referencia, afinaciones predefinidas, personalizada por semitonos, propagación al mástil, persistencia)
- **C-01, C-02** (menú de configuración con nomenclatura, pentagrama, timbre, numeración, afinación)
- **V-03** (mástil completo en escritorio vía `defaultVisibleFrets`)
- **D-03** — revisar: la numeración de trastes usa las mismas variables CSS (`--label-w`, `--nut-w`, `--fret-w`) en la fila de números y en la de trastes. Parece corregida, no "pendiente de integrar desde index_v2.html".

Y dos "decisiones abiertas" (sección 16) que el código ya resolvió sin que el documento lo refleje:

- **J-10**: el código ya decide que sí, un fallo rompe la racha siempre (`streak = 0`).
- **L-02**: resuelto con un toggle (`showAllNotes`), no es binario permanente.

**Acción propuesta:** sesión de reconciliación de estados sobre las secciones N, D, L, J, A, C antes de tocar el roadmap. Si no se hace, V2/V3 se van a planificar sobre trabajo que ya existe.

---

## 2. [ALTO — riesgo de producto y de licencia] Los samples de audio dependen de un CDN de terceros con licencia poco clara

`index.html` carga los samples desde:

```
https://nbrosowsky.github.io/tonejs-instruments/samples/
```

Dos problemas distintos, no uno:

**a) Disponibilidad/control.** Es un recurso externo sin versión fijada. Si el repo desaparece, cambia estructura o rota nombres de archivo, **S-01** (el requisito más básico del producto) se rompe sin que hayamos tocado nuestro código. Además, bloquea de facto **G-03** (offline vía Service Worker): cachear audio cross-origin de terceros depende de que ese servidor mande cabeceras CORS correctas, cosa que no controlamos.

**b) Licencia ambigua.** Verificado en la fuente: el README del propio repo dice que los samples "vienen de fuentes de dominio público variadas" (ver `sample-source-info.txt` en su repo), pero al menos un mirror de npm de ese mismo paquete lista los samples como **CC-BY 3.0** (requiere atribución), y catálogos de terceros lo marcan como licencia "Non-SPDX / other" — es decir, **no está claro y hay versiones contradictorias**. Para un proyecto que en V5 contempla "posible empaquetado para tiendas de aplicaciones" (roadmap sección 14), publicar con una licencia de audio sin verificar es un riesgo real, no teórico.

Como el objetivo es terminar en una app real con audio propio, esto se trata como decisión de producto, no solo técnica. Opciones, de menor a mayor esfuerzo:

| Opción | Esfuerzo | Resultado |
|---|---|---|
| **A. Autoalojar los samples actuales** en nuestro propio repo, tras verificar `sample-source-info.txt` pieza por pieza y confirmar que son realmente dominio público. | Bajo | Resuelve disponibilidad, pero solo resuelve licencia si la verificación sale limpia. |
| **B. Sustituir por una librería de samples con licencia inequívoca** (CC0 o dominio público confirmado, ej. University of Iowa Musical Instrument Samples, fuente original de la que muchos de estos derivan) y autoalojarla. | Medio | Audio "real" y legalmente tranquilo, sin grabar nada propio. |
| **C. Grabar samples propios** (guitarra nylon + acero, cubriendo el rango necesario). | Alto | Único 100% propio, cero dependencia de terceros, mejor para diferenciación de producto. |
| **D. Quedarnos con el sintetizador Karplus-Strong** (ya implementado como fallback S-04) como motor principal. | Nulo (ya existe) | No sería "sonido real de guitarra"; contradice S-01 tal como está redactado hoy. |

**Propuesta de requisito nuevo (reemplaza la urgencia de S-02/S-03 en el roadmap):**

> **S-07** | Los samples de audio se autoalojarán en el repositorio propio del proyecto, con licencia verificada y documentada (idealmente CC0 o grabación propia), en lugar de depender de un CDN de terceros con licencia ambigua. | **Alta** | **V1** (no V5) | Pendiente | Bloqueante real para: (1) fiabilidad de S-01, (2) viabilidad de G-03 offline, (3) publicación en tiendas de apps (V5). Decisión de opción A/B/C pendiente del equipo — recomendación: B a corto plazo (rápido y limpio), C como mejora de producto a medio plazo si se quiere diferenciar el timbre.

Recomendación: mover esto a **V1** — es la base de todo lo demás, no un detalle de pulido de V5.

---

## 3. [ALTO] El módulo Escalas (E-01 a E-06) esconde un motor combinatorio, no un "menú desplegable"

Con **A-10 ya obligando a que toda nota derive de la afinación activa**, cualquier generador de escalas tiene que funcionar para 7 afinaciones, no solo estándar. Además, dos "decisiones pendientes" del propio documento (E-02 variantes de digitación, E-05 validar orden vs. pertenencia) son decisiones de **alcance**, no de detalle, y hoy V4 no tiene límite definido.

**Propuesta de acotación de alcance para V4:**

> **E-05 (aclarar):** V4 valida únicamente **pertenencia** a la escala, no orden ni digitación específica. Validación de orden/patrón pasa a **E-05b**, incremento posterior fuera del alcance inicial.
>
> **E-02 (aclarar):** V4 soporta generación de escalas únicamente en **afinación estándar**. Extender a afinaciones alternativas pasa a **E-02b**, incremento posterior.

Sin esto, V4 corre riesgo de dispararse en esfuerzo sin que nadie lo haya decidido explícitamente.

---

## 4. [MEDIO-ALTO] A-02 (afinador por micrófono) tiene prioridad "Alta" sin ningún criterio de aceptación

El propio documento (sección 15) admite que es "el componente técnicamente más complejo del proyecto", pero A-02 sigue sin cifras: ¿precisión en cents?, ¿latencia máxima?, ¿qué pasa con ruido de fondo o armónicos?

**Propuesta:**

> **A-02 (ampliar):** Añadir criterios de aceptación explícitos — precisión ±5 cents en condiciones de silencio razonable, latencia de detección <300ms, comportamiento con ruido de fondo definido como "no soportado en la primera entrega de V3".

Recomendación: bajar su prioridad efectiva para la primera entrega de V3. **A-01 (ya implementado) es el verdadero MVP de "afinador"**; A-02 puede ir como incremento V3b.

---

## 5. [MEDIO] Dos huecos de UX no documentados

**a) V-01 (orientación en móvil)** sigue como decisión abierta, pero el código ya tiene un comportamiento de facto (`defaultVisibleFrets` reduce a 5 trastes en portrait). Dado que el propio documento reconoce el mal soporte de bloqueo de orientación en iOS, propongo cerrar la decisión ya:

> **V-01 (resolver):** Se **sugiere** landscape mediante aviso discreto, no se **fuerza** con bloqueo de orientación. El comportamiento actual de reducción de trastes visibles en portrait se documenta como solución adoptada, no como parche temporal.

**b) Falta de orientación espacial al hacer zoom + scroll.** Con V-04/V-05/V-06 implementados, un usuario en zoom alto (5 trastes visibles) puede perder de vista en qué tramo del mástil está.

> **V-09 (nuevo)** | Cuando el mástil no cabe entero en pantalla, mostrar un indicador persistente del rango de trastes visible actualmente (franja superior o mini-mapa). | Media | V2 | Pendiente | Complementa V-04/V-05; evita desorientación al desplazarse con zoom activo.
