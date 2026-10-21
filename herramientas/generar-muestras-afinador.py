"""Prepara las muestras con las que el banco prueba el detector de tono (F4.2).

Uso, desde la carpeta del proyecto:
    python herramientas/generar-muestras-afinador.py

Necesita Python 3 con numpy, y ffmpeg. Es una herramienta de desarrollo: el
banco de pruebas (node --test) no instala nada y no sabe leer mp3, así que
necesita el sonido ya descodificado.

Qué hace: de cada grabación de una cuerda al aire (E2, A2, D3, G3, B3 y E4, en
los dos timbres) guarda 0,9 s desde justo antes del ataque (lo que abarca su medida en afinacion.json), en WAV de 16 bits a
48 kHz (la frecuencia del iPhone), en tests/muestras-afinador/. Y un índice
con la frecuencia medida de cada una (samples/afinacion.json), que es la
referencia contra la que se mide el error del detector.
"""
import json
import pathlib
import subprocess
import wave

import numpy as np

RAIZ = pathlib.Path(__file__).resolve().parent.parent
SALIDA = RAIZ / 'tests' / 'muestras-afinador'
SR = 48000
ANTES, DURACION = 0.02, 0.9          # segundos antes del ataque y en total
CUERDAS = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4']


def decodificar(ruta):
    crudo = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(ruta), '-ac', '1', '-ar', str(SR),
                            '-f', 's16le', '-'], check=True, capture_output=True).stdout
    return np.frombuffer(crudo, dtype=np.int16).astype(np.float64) / 32768


def main():
    medida = json.loads((RAIZ / 'samples' / 'afinacion.json').read_text(encoding='utf-8'))
    SALIDA.mkdir(parents=True, exist_ok=True)
    indice = []
    for timbre in ('nylon', 'acoustic'):
        for nota in CUERDAS:
            x = decodificar(RAIZ / 'samples' / timbre / f'{nota}.mp3')
            ataque = int(np.argmax(np.abs(x) > 0.1 * np.max(np.abs(x))))
            inicio = max(0, ataque - int(ANTES * SR))
            trozo = x[inicio:inicio + int(DURACION * SR)]
            nombre = f'{timbre}-{nota}.wav'
            with wave.open(str(SALIDA / nombre), 'wb') as w:
                w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
                w.writeframes((np.clip(trozo, -1, 1) * 32767).astype('<i2').tobytes())
            fila = medida[timbre][f'{nota}.mp3']
            indice.append({'archivo': nombre, 'timbre': timbre, 'nota': nota,
                           'hz_medida': fila['hz_medida'], 'ataque_s': round((ataque - inicio) / SR, 4)})
            print(f'{nombre:18} {fila["hz_medida"]:8.2f} Hz')
    (SALIDA / 'indice.json').write_text(json.dumps({'sr': SR, 'origen': 'samples/ (ver CREDITOS.md)',
                                                    'muestras': indice}, indent=1, ensure_ascii=False) + '\n',
                                        encoding='utf-8')


if __name__ == '__main__':
    main()
