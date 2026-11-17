# AR-24 · Auditoría de requisitos ligera · F6.4 (0.6.14)

**Entrada:** el diff del bloque (con generar-requisitos.py y generar-matriz.py), la cabecera y las filas G-01 a G-06 de la matriz, AC-01 a AC-07 en generar-requisitos.py y AR-23 (formato): 9 lecturas. No se leyeron interfaz.md ni CREDITOS.md enteros. **Sin críticos.**

## Altos
1. **G-06: la atribución no cumple del todo CC BY y el requisito se declara «Cumple».** El texto (Acerca de y CREDITOS.md) trae autor, obra, cambios y la dirección de la CC BY 3.0. Para la CC BY 4.0 de quartertone falta la dirección de la licencia (§3(a)(1)(C)) y la de la obra en freesound (§3(a)(1)(A)(v), «si es razonablemente posible»: en la web lo es). La guitarra acústica no tiene título de obra. El banco solo busca palabras sueltas. Propuesta: añadir `creativecommons.org/licenses/by/4.0` y la dirección del sonido en freesound, igual en Acerca de y en CREDITOS.md, y una prueba que compare los dos textos. Con eso, G-06 puede pasar a «Verificado».

## Medios
2. **V-01: el criterio no se puede medir.** «En vertical, la app funciona igual» no dice qué se comprueba. Propuesta: «En vertical, en las seis áreas, no existe aviso para girar y se cumple V-12 (comprobar-disposicion)». Y el texto nuevo, que Pablo aún no ha visto en el móvil, conserva «Validado en la Sesión 1»: añadir «validar en vertical» a su prueba.
3. **Quitar el aviso deja textos desfasados.** AC-07 sigue diciendo «sin pentagrama, zoom ni aviso para girar»: quitarlo y poner AC-07 en la lista de cambios de la v2.11. interfaz.md §7 describe el aviso: actualizarlo al cerrar el bloque (regla 5). V-04 y G-05 no se ven afectados.
4. **Roadmap F6.4: «Los cuatro existen y son coherentes» no es medible.** Los cuatro existen. «Coherentes» podría ser: (a) Acerca de y CREDITOS.md dicen la misma atribución (prueba del #1); (b) LICENSE, README y Acerca de dicen «todos los derechos reservados, salvo las grabaciones»; (c) el resumen de Acerca de no promete nada que privacidad.html no diga. Hoy (b) y (c) se cumplen a mano; (a), a medias.
5. **Contacto de privacidad para tiendas (G-09, F7.4). Decide Pablo.** «Sin contacto hasta F7» basta para la web, pero Google Play pide un contacto de privacidad en la política, y la App Store, una dirección de soporte; Microsoft Store pide política por usar el micrófono. Con los *issues* desactivados no queda canal. Al empaquetar, la política tendrá que nombrar la tienda. Propuesta: «contacto de privacidad (correo dedicado o formulario)» a *Decisiones abiertas*, con G-11 y G-09, plazo «antes de F7.1».
6. **Acerca de, cómo se lee.** Los créditos, unos 450 caracteres a 11,5 px en gris tenue, con direcciones largas: lo más pequeño de Ajustes, sin contraste medido en los tres temas (G-05, 4,5:1). Propuesta: 12,5 o 13 px, medir con comprobar-accesibilidad en Madera, Automático y Partitura y citarlo. Opcional: plegarlos (`<details>`). La ubicación, al final de Ajustes y en los dos idiomas, es correcta.

## Bajos
7. **G-11, qué es «publicada».** El autónomo enlaza a la web de pruebas (`PRIVACIDAD_WEB`), «sin anunciar». Definir «publicada» como la dirección definitiva de F7.1 y añadir al inventario de lanzamiento «revisar `PRIVACIDAD_WEB` en ensamblar.js».
8. **El enlace abre otra ventana (`target="_blank"`).** En el iPhone instalada se abre una hoja de Safari, y «← Volver» (`./`) carga allí otra copia de la app; desde el autónomo lleva a la web. Abrirla en la misma ventana (funciona sin red con el Service Worker) o que «Volver» use el historial.
9. **«archivo autónomo» es jerga** para el usuario (Acerca de, en los dos idiomas): «la versión descargable» / «the downloadable version».
10. **«Se apaga al salir del afinador»** (la política) no lo vigila ninguna prueba nueva: comprobarlo en la prueba «privacidad».
11. **README:** «en desarrollo local» ya no es exacto (repositorio público y web de pruebas).
12. **J-14 (notas):** añadir que desde la 0.6.14 no hay aviso para girar, para que la prueba de Pablo no lo busque.
13. **Sin el aviso, nadie dice que en horizontal se ven más trastes** (en vertical, Adivinar llega al traste 12 desplazándose). Propuesta: anotarlo en V-01 como efecto de la decisión del 17/11 (decide Pablo si le importa).

No hay alcance añadido sin decisión: lo de más (la política sin red, el enlace a la parte inglesa, la prueba de que el código no envía datos) es pequeño y va en la línea de G-11.
