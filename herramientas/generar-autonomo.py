"""Genera dist/trasteando.html: la app con su audio dentro (etapa F2.3).

Uso, desde la carpeta del proyecto:
    python herramientas/generar-autonomo.py

Necesita Python 3 con numpy, y ffmpeg. Es una herramienta de desarrollo: el
resultado es un único archivo que funciona con doble clic y sin conexión.

Qué hace:
1. Lee de index.html qué grabaciones usa la app (SAMPLE_MAPS).
2. Recorta cada una a 4,5 s con un fundido final de 0,3 s y la recodifica a
   128 kbps. La nota más larga de la app, la del afinador, dura 3 s más 1,2 de
   apagado: no se pierde nada audible y el archivo pesa la mitad.
3. Mide la afinación de cada grabación recortada y comprueba que no ha
   cambiado más de 0,5 cents (S-08).
4. Mete cada una en la página en base64 (texto que representa bytes), entre
   dos marcas, sin tocar nada más de index.html.
5. Comprueba dos límites (F2.3, revisados en CP-2): el audio no pasa de
   1,45 MB, y bajar su calidad exige que el cliente lo escuche; el archivo
   entero no pasa de 2 MB, para dejar sitio al código de las fases siguientes.
"""
import base64
import hashlib
import importlib.util
import json
import pathlib
import re
import subprocess
import sys
import tempfile

import numpy as np

RAIZ = pathlib.Path(__file__).resolve().parent.parent
SALIDA = RAIZ / 'dist' / 'trasteando.html'
INFORME = RAIZ / 'dist' / 'autonomo.json'
LIMITE_AUDIO = 1_450_000      # bytes del audio incrustado
LIMITE = 2_000_000            # bytes del archivo completo
DURACION, FUNDIDO, KBPS = 4.5, 0.3, 128
INICIO = '<!-- AUDIO INCRUSTADO: inicio. Generado por herramientas/generar-autonomo.py; no editar a mano. -->'
FIN = '<!-- AUDIO INCRUSTADO: fin -->'

spec = importlib.util.spec_from_file_location('medir', RAIZ / 'herramientas' / 'medir-afinacion.py')
medir = importlib.util.module_from_spec(spec)
spec.loader.exec_module(medir)


def grabaciones(html):
    """[(timbre, nota, archivo)] tal como los declara SAMPLE_MAPS."""
    bloque = re.search(r'const SAMPLE_MAPS = \{(.*?)\n\};', html, re.S).group(1)
    lista = []
    for timbre, cuerpo in re.findall(r'(nylon|acoustic):\s*\{(.*?)\}', bloque, re.S):
        for nota, archivo in re.findall(r"(\w+):\['([^']+)'", cuerpo):
            lista.append((timbre, nota, archivo))
    return lista


def main():
    html = (RAIZ / 'index.html').read_text(encoding='utf-8')
    version = re.search(r"APP_VERSION = '([^']+)'", html).group(1)
    medida = json.loads((RAIZ / 'samples' / 'afinacion.json').read_text(encoding='utf-8'))
    bloques, informe, fallos = [], [], []
    with tempfile.TemporaryDirectory() as tmp:
        for timbre, nota, archivo in grabaciones(html):
            origen = RAIZ / 'samples' / timbre / archivo
            destino = pathlib.Path(tmp) / f'{timbre}-{archivo}'
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(origen), '-t', str(DURACION),
                            '-af', f'afade=t=out:st={DURACION - FUNDIDO}:d={FUNDIDO}',
                            '-ac', '1', '-ar', '44100', '-b:a', f'{KBPS}k', str(destino)], check=True)
            datos = destino.read_bytes()
            x = medir.decodificar(destino)
            cents = 1200 * np.log2(medir.fundamental(x) / (440 * 2 ** ((medir.midi_de(nota) - 69) / 12)))
            antes = medida[timbre][archivo]['cents']
            if abs(cents - antes) > 0.5:
                fallos.append(f'{timbre}/{archivo}: {antes:+.1f} → {cents:+.1f} cents')
            informe.append({'timbre': timbre, 'nota': nota, 'archivo': archivo, 'bytes': len(datos),
                            'segundos': round(len(x) / medir.SR, 2), 'cents_original': antes,
                            'cents_recortada': round(float(cents), 1),
                            'sha256': hashlib.sha256(datos).hexdigest(),
                            'sha256_original': hashlib.sha256(origen.read_bytes()).hexdigest()})
            bloques.append(f'<script type="application/octet-stream" id="audio-{timbre}-{nota}">'
                           f'{base64.b64encode(datos).decode()}</script>')
    marca = '<script>\n"use strict";'
    assert html.count(marca) == 1, 'no se encuentra el código de la app en index.html'
    pagina = html.replace(marca, INICIO + '\n' + '\n'.join(bloques) + '\n' + FIN + '\n' + marca)
    SALIDA.parent.mkdir(exist_ok=True)
    # Bytes y saltos de línea \n también en Windows: así el banco puede comparar
    # el autónomo con index.html (AT-03 #2).
    SALIDA.write_bytes(pagina.encode('utf-8'))
    audio = sum(len(b) for b in bloques)
    peso = SALIDA.stat().st_size
    INFORME.write_bytes((json.dumps({'version': version, 'bytes': peso, 'limite': LIMITE,
                                     'bytes_audio': audio, 'limite_audio': LIMITE_AUDIO,
                                     'muestras': informe}, indent=1, ensure_ascii=False) + '\n').encode('utf-8'))
    for r in informe:
        print(f"{r['timbre']:9s} {r['nota']:3s} {r['bytes']/1024:6.0f} KB  {r['segundos']:4.2f} s  "
              f"{r['cents_original']:+5.1f} → {r['cents_recortada']:+5.1f} cents")
    print(f'dist/trasteando.html: app {version}, {peso/1e6:.2f} MB (límite {LIMITE/1e6:.1f} MB); '
          f'audio {audio/1e6:.2f} MB (límite {LIMITE_AUDIO/1e6:.2f} MB)')
    if fallos:
        print('La afinación cambió al recortar:', *fallos, sep='\n  ')
    if peso > LIMITE or audio > LIMITE_AUDIO:
        print('Pasa del límite de peso.')
    return 1 if fallos or peso > LIMITE or audio > LIMITE_AUDIO else 0


if __name__ == '__main__':
    sys.exit(main())
