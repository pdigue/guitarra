"""Mide en qué nota suena de verdad cada muestra de audio de samples/.

Uso, desde la carpeta del proyecto:
    python herramientas/medir-afinacion.py

Necesita Python 3 con numpy, y ffmpeg instalado. Es una herramienta de
desarrollo: la app y el banco de pruebas no la necesitan. Escribe
samples/afinacion.json, que el banco lee para comprobar que la app solo usa
muestras afinadas (requisito S-08).

Cómo mide: decodifica cada archivo a números con ffmpeg, toma unos 0,7 s de
sonido justo después del ataque y calcula su espectro (qué frecuencias tiene y
con qué fuerza). Una cuerda no suena solo en su nota: suena también al doble,
al triple... (los armónicos). Multiplicar el espectro por versiones suyas
comprimidas a la mitad, a un tercio y a un cuarto hace que destaque la
frecuencia que es base de todos ellos: la nota. Es el «producto armónico del
espectro». El resultado se expresa en cents: 100 cents son un semitono.
"""
import hashlib
import json
import pathlib
import subprocess
import sys

import numpy as np

RAIZ = pathlib.Path(__file__).resolve().parent.parent
MUESTRAS = RAIZ / 'samples'
NOTAS = {'C': 0, 'Cs': 1, 'D': 2, 'Ds': 3, 'E': 4, 'F': 5, 'Fs': 6,
         'G': 7, 'Gs': 8, 'A': 9, 'As': 10, 'B': 11}
SR = 44100


def midi_de(nombre):
    """'Fs3' -> 66. La octava 4 empieza en el Do central (MIDI 60)."""
    return 12 * (int(nombre[-1]) + 1) + NOTAS[nombre[:-1]]


def decodificar(ruta):
    crudo = subprocess.run(
        ['ffmpeg', '-v', 'error', '-i', str(ruta), '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'],
        capture_output=True, check=True).stdout
    return np.frombuffer(crudo, dtype=np.float32)


def fundamental(x, fmin=50, fmax=1400):
    ataque = int(np.argmax(np.abs(x) > 0.1 * np.max(np.abs(x))))
    inicio = ataque + int(0.08 * SR)
    trozo = x[inicio:inicio + 2 ** 15]
    trozo = trozo * np.hanning(len(trozo))
    n = 2 ** 18
    espectro = np.abs(np.fft.rfft(trozo, n))
    producto = espectro.copy()
    for h in (2, 3, 4):
        comprimido = espectro[::h]
        producto[:len(comprimido)] *= comprimido
    freqs = np.fft.rfftfreq(n, 1 / SR)
    lo, hi = np.searchsorted(freqs, fmin), np.searchsorted(freqs, fmax)
    k = lo + int(np.argmax(producto[lo:hi]))
    a, b, c = np.log(producto[k - 1:k + 2] + 1e-30)
    ajuste = 0.5 * (a - c) / (a - 2 * b + c)   # interpolación parabólica
    return (k + ajuste) * SR / n


def main():
    resultado = {}
    for carpeta in sorted(p for p in MUESTRAS.iterdir() if p.is_dir()):
        filas = {}
        for ruta in sorted(carpeta.glob('*.mp3'), key=lambda p: midi_de(p.stem)):
            x = decodificar(ruta)
            midi = midi_de(ruta.stem)
            esperada = 440 * 2 ** ((midi - 69) / 12)
            medida = fundamental(x)
            cents = 1200 * np.log2(medida / esperada)
            filas[ruta.name] = {
                'nota': ruta.stem, 'midi': midi,
                'hz_esperada': round(esperada, 2), 'hz_medida': round(float(medida), 2),
                'cents': round(float(cents), 1),
                'pico_dbfs': round(float(20 * np.log10(np.max(np.abs(x)) + 1e-12)), 1),
                'segundos': round(len(x) / SR, 2),
                'bytes': ruta.stat().st_size,
                'sha256': hashlib.sha256(ruta.read_bytes()).hexdigest(),
            }
            f = filas[ruta.name]
            print(f"{carpeta.name:9s} {f['nota']:4s} {f['hz_medida']:8.2f} Hz  {f['cents']:+6.1f} cents")
        resultado[carpeta.name] = filas
    salida = MUESTRAS / 'afinacion.json'
    salida.write_text(json.dumps(resultado, indent=1, ensure_ascii=False) + '\n', encoding='utf-8')
    print('Escrito', salida.relative_to(RAIZ))


if __name__ == '__main__':
    sys.exit(main())
