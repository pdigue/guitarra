"""Diseña y comprueba la paleta de colores por nota (F3.4, G-05).

Uso, desde la carpeta del proyecto:
    python herramientas/paleta.py            comprueba la paleta propuesta
    python herramientas/paleta.py --app      comprueba la que usa index.html

Solo necesita Python 3, sin paquetes. Es una herramienta de desarrollo.

Criterios (decisión del cliente del 20/10: «que las notas se distingan bien y
los semitonos sean colores derivados»):
1. Contraste ≥ 4,5:1 de cada color con el texto oscuro de los puntos del
   mástil y con el fondo oscuro de la app, donde el color se usa como texto.
2. Las 7 notas naturales, bien separadas entre sí con visión normal y con los
   tres daltonismos más comunes (simulación de Machado et al., 2009).
3. Cada sostenido es su nota natural, más clara y suave: se parece más a ella
   que a cualquier otra natural.

La distancia entre colores se mide en OKLab (× 100): por debajo de 3 cuesta
distinguirlos lado a lado; por encima de 10 se distinguen sin esfuerzo.

Umbrales (criterio de G-05 en la matriz, AR-06 #3): las 7 naturales, a 7,5 o
más entre sí con visión normal y con cada simulación; las 12 notas, a 8 o más
con visión normal. Entre sostenidos y naturales no emparentadas la separación
baja con daltonismo: lo compensa que el nombre de la nota siempre está escrito.
"""
import math
import re
import sys
import pathlib

NOMBRES = ['Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si']
NATURALES = [0, 2, 4, 5, 7, 9, 11]
TEXTO_OSCURO = '#160f07'   # texto de los puntos del mástil
FONDO = '#140e09'          # fondo de la app (--bg)
MIN_NATURALES = 7.5        # separación mínima entre naturales, en toda visión
MIN_DOCE_NORMAL = 8.0      # separación mínima entre las 12, con visión normal

# Paleta propuesta: notas naturales en OKLCH (luminosidad, croma, tono en
# grados). Los tonos se reparten por el círculo y las luminosidades varían,
# porque la luminosidad la distingue también quien confunde colores.
NATURAL_LCH = {           # croma 0,20 pedido; se recorta a lo que cabe en sRGB
    0:  (0.84, 0.20, 49),     # Do  · melocotón, como en tu imagen
    2:  (0.75, 0.20, 136),    # Re  · verde
    4:  (0.92, 0.20, 101),    # Mi  · amarillo
    5:  (0.71, 0.20, 280),    # Fa  · lila azulado
    7:  (0.69, 0.20, 337),    # Sol · rosa fucsia
    9:  (0.64, 0.20, 22),     # La  · rojo
    11: (0.84, 0.20, 198),    # Si  · celeste
}
# Los valores salen de una búsqueda que maximiza la separación entre notas con
# visión normal y con daltonismo, sin romper los criterios 1 y 3.
SUBIR_L, FACTOR_C = 0.08, 0.80   # el sostenido: más claro y algo más suave


def oklch_a_hex(L, C, h):
    """Color OKLCH en hexadecimal. Si se sale de lo que una pantalla puede
    mostrar (sRGB), se le quita croma poco a poco hasta que cabe."""
    while True:
        try:
            return _oklch_a_hex(L, C, h)
        except ValueError:
            C -= 0.005
            if C <= 0:
                raise


def _oklch_a_hex(L, C, h):
    a, b = C * math.cos(math.radians(h)), C * math.sin(math.radians(h))
    l_, m_, s_ = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3, \
                 (L - 0.1055613458 * a - 0.0638541728 * b) ** 3, \
                 (L - 0.0894841775 * a - 1.2914855480 * b) ** 3
    lin = (4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
           -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
           -0.0041960863 * l_ - 0.7034186147 * m_ + 1.7076147010 * s_)
    if any(c < -1e-4 or c > 1 + 1e-4 for c in lin):
        raise ValueError(f'fuera de sRGB: L={L} C={C} h={h}')
    srgb = [12.92 * c if c <= 0.0031308 else 1.055 * c ** (1 / 2.4) - 0.055 for c in lin]
    return '#' + ''.join(f'{round(min(1, max(0, c)) * 255):02x}' for c in srgb)


def paleta_propuesta():
    p = {}
    for pc, (L, C, h) in NATURAL_LCH.items():
        p[pc] = oklch_a_hex(L, C, h)
        if pc + 1 not in NATURAL_LCH and pc + 1 < 12:
            p[pc + 1] = oklch_a_hex(min(0.96, L + SUBIR_L), C * FACTOR_C, h)
    return [p[i] for i in range(12)]


def paleta_app():
    html = (pathlib.Path(__file__).resolve().parent.parent / 'index.html').read_text(encoding='utf-8')
    bloque = re.search(r'const COLORS = \[(.*?)\];', html, re.S).group(1)
    return re.findall(r"'(#[0-9a-fA-F]{6})'", bloque)


def lineal(hexa):
    c = [int(hexa[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    return [x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c]


def luminancia(hexa):
    r, g, b = lineal(hexa)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contraste(a, b):
    la, lb = sorted((luminancia(a), luminancia(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


def oklab(rgb_lineal):
    r, g, b = rgb_lineal
    l = (0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b) ** (1 / 3)
    m = (0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b) ** (1 / 3)
    s = (0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b) ** (1 / 3)
    return (0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
            1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
            0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s)


# Simulación de daltonismo completo (Machado, Oliveira y Fernandes, 2009),
# aplicada en RGB lineal.
VISIONES = {
    'normal': None,
    'protanopía': ((0.152286, 1.052583, -0.204868), (0.114503, 0.786281, 0.099216), (-0.003882, -0.048116, 1.051998)),
    'deuteranopía': ((0.367322, 0.860646, -0.227968), (0.280085, 0.672501, 0.047413), (-0.011820, 0.042940, 0.968881)),
    'tritanopía': ((1.255528, -0.076749, -0.178779), (-0.078411, 0.930809, 0.147602), (0.004733, 0.691367, 0.303900)),
}


def ver(hexa, matriz):
    c = lineal(hexa)
    if matriz:
        c = [max(0, min(1, sum(f[i] * c[i] for i in range(3)))) for f in matriz]
    return oklab(c)


def distancia(a, b, matriz=None):
    return 100 * math.dist(ver(a, matriz), ver(b, matriz))


def informe(pal, titulo):
    print(f'\n== {titulo} ==')
    print('  ' + '  '.join(f'{NOMBRES[i]} {pal[i]}' for i in range(12)))
    fallos = 0
    peor = min((contraste(c, TEXTO_OSCURO), NOMBRES[i]) for i, c in enumerate(pal))
    peor_f = min((contraste(c, FONDO), NOMBRES[i]) for i, c in enumerate(pal))
    print(f'  contraste mínimo con el texto oscuro: {peor[0]:.1f}:1 ({peor[1]}); con el fondo: {peor_f[0]:.1f}:1 ({peor_f[1]})')
    if peor[0] < 4.5 or peor_f[0] < 4.5:
        fallos += 1
    for vision, m in VISIONES.items():
        pares = sorted((distancia(pal[a], pal[b], m), NOMBRES[a], NOMBRES[b])
                       for i, a in enumerate(NATURALES) for b in NATURALES[i + 1:])
        d, x, y = pares[0]
        todas = sorted((distancia(pal[a], pal[b], m), NOMBRES[a], NOMBRES[b])
                       for a in range(12) for b in range(a + 1, 12))
        malo = d < MIN_NATURALES or (m is None and todas[0][0] < MIN_DOCE_NORMAL)
        fallos += malo
        print(f'  {vision:13s} naturales: par más parecido {x}–{y} a {d:4.1f}'
              f' · las 12: {todas[0][1]}–{todas[0][2]} a {todas[0][0]:4.1f}' + ('  ← por debajo del umbral' if malo else ''))
    familia = []
    for s in range(12):
        if s in NATURALES:
            continue
        cercana = min(NATURALES, key=lambda n: distancia(pal[s], pal[n]))
        familia.append(f'{NOMBRES[s]}→{NOMBRES[cercana]}')
        propia = distancia(pal[s], pal[s - 1])
        otra = min(distancia(pal[s], pal[n]) for n in NATURALES if n != s - 1)
        if cercana != s - 1 or propia < 5 or otra - propia < 4:
            fallos += 1
    print('  cada sostenido se parece más a: ' + ', '.join(familia))
    return fallos


if __name__ == '__main__':
    if '--app' in sys.argv:
        sys.exit(1 if informe(paleta_app(), 'Paleta de index.html') else 0)
    fallos = informe(paleta_propuesta(), 'Paleta propuesta')
    if [c.lower() for c in paleta_app()] == paleta_propuesta():
        print('\nindex.html ya usa esta paleta.')
    else:
        informe(paleta_app(), 'Paleta de index.html, distinta de la propuesta')
        print('\nPara usarla, en index.html:\nCOLORS = [' + ','.join(f"'{c}'" for c in paleta_propuesta()) + ']')
    sys.exit(1 if fallos else 0)
