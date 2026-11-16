# AR-21 · Auditoría de requisitos ligera · F6.3 (0.6.9)

**Fecha:** 16/11/2026 · **Auditor:** de requisitos (solo lectura)
**Entrada:** diff de `requisitos.md`, del generador de la matriz, `compatibilidad.md`, `roadmap.md` y `CHANGELOG.md`.
**Lecturas:** 9 de 10.

**Veredicto:** nada bloqueante. La trazabilidad de G-04 es coherente en requisitos y matriz v2.6, roadmap v4.6, compatibilidad v1.14 y el CHANGELOG.

## Hallazgos
1. **Medio · G-04 dice «pantalla completa», pero el manifiesto usa `standalone`** (sin barra de direcciones, con la barra de estado del sistema; `fullscreen` el iPhone no lo respeta). Propuesta: «en su propia ventana, sin barra de direcciones». **Decide Pablo.**
2. **Medio · Roadmap F6.3: «Cómo se valida» seguía diciendo «Lighthouse la da por instalable»**, que ya no se puede medir (Lighthouse 12 retiró esa prueba).
3. **Medio · PL-04: la evidencia de la matriz citaba compatibilidad v1.13.**
4. **Medio · G-04: con el método T no se ve que F7.2 la valida el cliente.**
5. **Bajo · CHANGELOG:** el Service Worker que guarda el manifiesto y los iconos estaba etiquetado G-03, que no cambia.
6. **Bajo · Compatibilidad:** la fila de la caché seguía en «36 archivos (0.6.8)».
7. **Bajo · G-01:** su evidencia no cita el manifiesto, que ahora comprueba `instalar.test.js`.
8. **Bajo · Android:** la pantalla de arranque es oscura también con el tema claro (V-10). **Decide Pablo** si le molesta.
9. **Bajo · Roadmap:** F6.2 y F6.3 llevaban ✅ (validada) sin la prueba de Pablo; según la leyenda, 🔨.

Sin cambio necesario: G-03, X-03, PL-01 y `orientation: "any"` frente a V-01. El criterio partido F6.3/F7.2 es medible y suficiente para esta etapa.

## Respuesta (16/11/2026)
- **Corregidos:** #2 (el roadmap describe la comprobación real y cuenta por qué cambió), #3 (PL-04 cita la v1.14; en el control de cambios de la matriz 2.6), #4 (el criterio de F7.2 dice que lo valida el cliente, con X-03), #5 (la línea del CHANGELOG pasa a G-04), #6 (41 archivos, 0.6.9) y #9 (🔨 en F6.2 y F6.3).
- **Para Pablo:** #1 y #8, anotados en G-04 con #7.
