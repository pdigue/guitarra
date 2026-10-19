# Trasteando

Aplicación web para aprender las notas del mástil de la guitarra, leerlas en el
pentagrama y afinar con varias afinaciones. Proyecto personal de Pablo Díaz
Guerra, en desarrollo local; se publicará al final del roadmap.

## Cómo abrirla

| Modo | Cómo | Qué funciona |
|---|---|---|
| Archivo | Doble clic en `dist/trasteando.html` | Todo, sin conexión, salvo el futuro afinador por micrófono |
| Local | VS Code → clic derecho en `index.html` → *Open with Live Server* | Todo |
| En el iPhone | Con Live Server encendido, abrir en Safari `http://<IP del ordenador>:5500` | Todo salvo micrófono e instalación |

## Cómo comprobar que funciona

Con [Node.js](https://nodejs.org) instalado, desde esta carpeta:

```
node --test
```

Ejecuta el banco de pruebas de `tests/`: arranca la app en un navegador
simulado y comprueba los requisitos que se pueden verificar sin pantalla.

## Qué hay en cada carpeta

```
guitarra/
├── index.html            la app entera: estructura, estilo y lógica
├── CHANGELOG.md          qué cambió en cada versión
├── CREDITOS.md           origen y licencia de lo que no es nuestro
├── CLAUDE.md             reglas para los agentes que trabajan en el proyecto
├── .claude/agents/       los dos auditores, de solo lectura
├── docs/
│   ├── requisitos.md     qué debe hacer la app
│   ├── roadmap.md        en qué orden se construye y cómo se valida
│   ├── matriz-cumplimiento.md (y .xlsx)   cómo se demuestra cada requisito
│   ├── automatizacion.md el modo acelerado con agentes
│   ├── auditorias/       informes de los auditores (AR-nn, AT-nn)
│   ├── iteraciones/      informe didáctico de cada iteración (IT-nn)
│   └── cuadernos/        cuadernos de aprendizaje
├── dist/                 trasteando.html, la app con el audio dentro (se genera)
├── samples/              muestras de audio de guitarra clásica y acústica
├── herramientas/         utilidades de desarrollo, por ejemplo medir la afinación
└── tests/                banco de pruebas automático
```

## Créditos

El sonido de guitarra procede de grabaciones con licencia Creative Commons. El
detalle y el texto de atribución están en [CREDITOS.md](CREDITOS.md).
