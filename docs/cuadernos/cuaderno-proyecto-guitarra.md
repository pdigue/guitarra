# Cuaderno de bitácora — Proyecto app de guitarra

> Recopilatorio de toda la teoría, decisiones y aprendizajes específicos de este proyecto: la app web para aprender las notas del mástil de la guitarra. Documento de referencia y estudio, se irá ampliando a medida que avancemos.

---

## Índice

1. Contexto y objetivo del proyecto
2. Entorno de desarrollo
3. Las tres piezas de la web (HTML, CSS, JavaScript)
4. Protocolos `file://` vs `http://` — por qué necesitamos servidor
5. Estructura de carpetas y convenciones de nombres
6. Git y GitHub — el mundo del control de versiones
7. Los tres estados de Git
8. Comandos de Git de referencia
9. GitHub Pages — publicar la app en internet
10. PWA (Progressive Web App)
11. Sonido en la web — cómo suena la guitarra
12. Analogías clave para recordar
13. Diario de fases

---

## 1. Contexto y objetivo del proyecto

**Qué se está construyendo:** una aplicación web para el móvil que muestra el mástil de una guitarra (6 cuerdas, 24 trastes) y permite tocar cualquier posición para escuchar la nota, ver su nombre y verla en el pentagrama. Objetivo pedagógico: aprender a identificar las notas del mástil.

**Modalidades previstas:**
- Modo libre (el actual): tocas cualquier traste, oyes la nota.
- Modo "Nota en cuerda": la app te dice una nota y una cuerda; tienes que localizar cualquier traste donde esté esa nota en esa cuerda.
- Modo "Adivinar sonido": suena una nota aleatoria; tienes que localizar cualquier posición del mástil donde esté.

**Decisiones tecnológicas de partida:**
- App web (no nativa) para que funcione en cualquier dispositivo sin instalar.
- Instalable como PWA en el móvil (icono en pantalla de inicio, pantalla completa).
- Todo en un solo archivo HTML por simplicidad.
- Publicación en GitHub Pages para acceso desde cualquier sitio.

---

## 2. Entorno de desarrollo

### VS Code

Editor de código gratuito de Microsoft, estándar de facto en desarrollo web actual. Instalado desde [code.visualstudio.com](https://code.visualstudio.com).

**Qué aporta frente al Bloc de notas:**
- Resaltado de sintaxis por lenguaje (colorea etiquetas, atributos, valores).
- Autocompletado inteligente.
- Detección de errores en tiempo real.
- Panel Explorer para navegar el proyecto por carpetas (workspaces).
- Extensiones (miles de plugins).
- Terminal integrada.
- Integración con Git.

**Interfaz clave:**
- Barra vertical de iconos (izquierda): Explorer, Search, Source Control, Run and Debug, Extensions.
- Panel Explorer: árbol de archivos del workspace.
- Editor central: donde se editan los archivos.
- Terminal integrada: Ctrl+ñ para abrirla, ejecuta comandos.
- Status bar (barra inferior): errores, rama de Git, línea/columna, botón Go Live.

**Configuración inicial:**
- Idioma: inglés (recomendado por consistencia con toda la documentación).
- Sin cuenta de Copilot (evita hacer que la IA escriba todo el código antes de aprender).

### Live Server

Extensión de VS Code que monta un mini-servidor HTTP local en el ordenador. Instalada desde el panel Extensions de VS Code (autor: Ritwick Dey).

**Qué hace:**
- Sirve los archivos de la carpeta actual en `http://127.0.0.1:5500/`.
- Recarga el navegador automáticamente cuando se guardan cambios (hot reload).
- Se activa con el botón "Go Live" de la barra inferior de VS Code, o botón derecho sobre HTML → "Open with Live Server".

**Puerto 5500:** un puerto es un "número de canal" que el sistema operativo usa para distinguir programas de red. Live Server usa el 5500 por defecto.

**Firewall en Windows:** al arrancar Live Server por primera vez, Windows pregunta si permite conexiones entrantes. Para uso doméstico basta con permitir en redes privadas. En redes públicas es más seguro no permitirlo.

---

## 3. Las tres piezas de la web (HTML, CSS, JavaScript)

Todas las webs modernas se componen de tres tecnologías trabajando juntas:

### HTML — la estructura
Define **qué** elementos hay en la página: títulos, párrafos, botones, imágenes, contenedores. Es el esqueleto. Ejemplo: `<button>Pulsa aquí</button>` define un botón.

### CSS — el estilo
Define **cómo se ven** los elementos: colores, tamaños, posiciones, fuentes. Es la piel. Ejemplo: `button { background: red; color: white; }`.

### JavaScript — el comportamiento
Define **qué pasa** cuando el usuario interactúa: clics, animaciones, cálculos, sonido, lógica. Es el sistema nervioso. Ejemplo: `button.addEventListener('click', () => alert('Hola'))`.

En este proyecto los tres conviven en un solo archivo `index.html` mediante etiquetas `<style>...</style>` para el CSS y `<script>...</script>` para el JS. Es lo más cómodo para apps pequeñas.

---

## 4. Protocolos `file://` vs `http://` — por qué necesitamos servidor

Este concepto es clave. Al abrir un HTML en el navegador hay dos maneras totalmente distintas:

### `file://` — abrir con doble clic
Si haces doble clic sobre un HTML, el navegador lo carga directamente del disco. La URL comienza por `file:///`. Restricciones importantes:
- **Bloqueo CORS**: el navegador no permite cargar recursos de dominios externos por seguridad. Los samples de guitarra alojados en `nbrosowsky.github.io` fallan.
- No hay "origen" claro para muchas APIs modernas.
- No se comporta como una web real.

### `http://` — servido por Live Server
Live Server sirve tu HTML como una web real, en `http://127.0.0.1:5500/`. Aunque el servidor sea local, el navegador lo trata como una web normal:
- Los recursos externos cargan sin problema.
- Todas las APIs disponibles.
- Comportamiento idéntico a producción.

**La lección práctica:** en desarrollo web nunca abras tus HTMLs con doble clic si necesitan cargar cosas externas. Siempre con Live Server (u otro servidor local).

### CORS — política de seguridad cross-origin

CORS (Cross-Origin Resource Sharing) es una política implementada por los navegadores que regula qué recursos puede cargar una web desde qué otros dominios. Por defecto es restrictiva por seguridad. Los servidores externos como GitHub Pages declaran expresamente qué permiten mediante cabeceras HTTP, y por eso funcionan bien desde `http://` pero fallan desde `file://`.

---

## 5. Estructura de carpetas y convenciones de nombres

### Regla de oro sobre OneDrive
En Windows moderno, las carpetas Escritorio, Documentos e Imágenes suelen estar sincronizadas con OneDrive. **Los proyectos de programación no deben vivir en carpetas sincronizadas con nube**: OneDrive bloquea archivos durante la sincronización, causa problemas con Git, y añade rutas largas que revientan el límite de Windows (260 caracteres). Para respaldo remoto de código se usa Git+GitHub, no OneDrive.

### Estructura elegida
```
C:\Users\pablo\programming\
    webapps\
        guitarra\          ← proyecto actual
    python\
    experimentos\
```

Categorizar por tipo de proyecto, no por herramienta. VS Code es solo el editor y no debería aparecer en la estructura.

### Convenciones de nombres
- Solo letras minúsculas, números y guiones (`-` o `_`).
- **Nunca** espacios, acentos, ñ o caracteres especiales.
- Motivo: los espacios rompen URLs y comandos de terminal.

### La convención `index.html`
Todos los servidores web del mundo (desde los años 90) buscan automáticamente un archivo llamado `index.html` como página principal cuando alguien accede a una carpeta sin especificar archivo. Ejemplo: acceder a `http://127.0.0.1:5500/` sirve automáticamente `index.html` sin escribir el nombre.

Por eso el archivo del proyecto se renombra a `index.html` en vez de dejarlo con su nombre original.

---

## 6. Git y GitHub — el mundo del control de versiones

**Git y GitHub son cosas distintas** que trabajan juntas. Es la confusión más frecuente para principiantes.

### Git
Un **programa** que se instala en el ordenador. Sirve para llevar un historial de cambios del código. Como un "Historial de versiones" tipo Google Docs pero mucho más potente. Con Git puedes:
- Guardar "fotos" (commits) del estado del proyecto en distintos momentos.
- Volver a cualquier foto anterior si algo se rompe.
- Ver qué cambió entre dos versiones.
- Trabajar en versiones paralelas (ramas o branches).
- Sincronizar el proyecto entre ordenadores o con la nube.

Funciona **totalmente local**, sin internet. Creado en 2005 por Linus Torvalds. Es el sistema de control de versiones estándar del sector.

### GitHub
Una **web** que hospeda repositorios Git en la nube. Es a Git lo que Dropbox es a los archivos: un lugar para respaldar y compartir código. Añade:
- Interfaz visual para ver repositorios en el navegador.
- Colaboración (issues, pull requests).
- Perfil público como portfolio.
- **GitHub Pages:** hosting gratuito de webs estáticas.

Propiedad de Microsoft desde 2018. Gratis para uso personal.

**Alternativas:** GitLab, Bitbucket, Codeberg. GitHub es la más popular con diferencia.

### Cómo trabajan juntos
1. Git en local mantiene el historial de commits.
2. `git push` envía tus commits a GitHub.
3. `git pull` trae commits que están en GitHub y no en local.
4. GitHub aloja la copia remota, accesible por URL, y puede servirla como web con GitHub Pages.

### Autenticación
Cuando haces push, GitHub necesita verificar tu identidad. Métodos:
- **Personal Access Token (PAT):** código largo, tipo contraseña de un solo propósito.
- **SSH keys:** par de claves criptográficas (más pro).
- **Git Credential Manager:** herramienta que se encarga automáticamente. Al hacer push por primera vez, abre el navegador para iniciar sesión en GitHub, guarda las credenciales de forma segura, y ya nunca las pide.

---

## 7. Los tres estados de Git

Modelo mental fundamental. Cualquier archivo en un proyecto Git está en uno de tres estados:

### 1. Working directory (directorio de trabajo)
Los archivos tal como aparecen en el Explorador. Los editas con VS Code. Git los observa pero aún no sabe qué guardar.

### 2. Staging area (área de preparación)
Una zona intermedia donde marcas archivos como "listos para la próxima foto". Es como una bandeja donde apilas cosas antes de meterlas en una caja definitiva.

### 3. Repository (repositorio)
Cuando confirmas con un commit, todos los archivos del staging area pasan al repositorio como una foto permanente. Vive en la carpeta oculta `.git/` dentro del proyecto.

**Por qué esta separación:** te da control fino. Podrías haber cambiado 10 archivos y decidir que 3 van en un commit (por ejemplo, todos los del sonido) y los otros 7 en otro (los del CSS). Es organización.

### Comandos que mueven entre estados
- `git add archivo` → pasa un archivo de working directory a staging.
- `git add .` → pasa todos los cambios a staging.
- `git commit -m "mensaje"` → toma el staging y lo convierte en commit permanente.

---

## 8. Comandos de Git de referencia

### Configuración inicial (una sola vez por ordenador)
```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
git config --global --list         # ver toda la configuración
```

### Inicializar y gestionar el repositorio local
```bash
git init                            # convierte carpeta en repo Git (una vez)
git status                          # ver estado actual (¡usa mucho!)
git add archivo.html                # añadir un archivo al staging
git add .                           # añadir todo lo modificado
git commit -m "mensaje"             # crear commit con lo que esté en staging
git log                             # ver historial de commits (q para salir)
git log --oneline                   # historial compacto, un commit por línea
```

### Conectar con GitHub y sincronizar
```bash
git remote add origin URL           # asocia repo remoto (una vez)
git remote -v                       # ver remotos configurados
git branch -M main                  # renombrar rama actual a main
git push -u origin main             # primer push (recuerda la rama)
git push                            # push posteriores (más simples)
git pull                            # traer cambios del remoto
```

### Convenciones de mensajes de commit
- Cortos (menos de 50 caracteres si puedes).
- En presente o infinitivo: "Añade sonido", no "He añadido".
- Descriptivos: qué cambia y opcionalmente por qué.
- Sin acentos si estás en PowerShell (a veces da problemas de codificación).

### Sobre `--global`
Con `--global` la configuración se aplica a todos los repos del ordenador. Sin `--global` solo al repo actual (útil si tienes identidades distintas por proyecto, raro).

---

## 9. GitHub Pages — publicar la app en internet

GitHub ofrece hospedaje gratuito de webs estáticas directamente desde cualquier repositorio público. Se activa desde la configuración del repo (Settings → Pages). Elige rama (`main`) y carpeta raíz. En 1-2 minutos, GitHub genera una URL pública tipo:

```
https://TUUSUARIO.github.io/NOMBREREPO/
```

Para este proyecto será:
```
https://pdigue.github.io/guitarra/
```

**Cada vez que haces `git push` con cambios**, GitHub Pages detecta la actualización y regenera la web pública en 1-2 minutos.

**Ventajas:**
- Gratis y permanente.
- URL con nombre lógico.
- Historial de versiones incluido (heredado de Git).
- Estándar del sector.

**Limitaciones:**
- Solo webs estáticas (nada de bases de datos ni backend). Suficiente para este proyecto.
- Repositorios públicos gratis. Los privados requieren plan de pago para Pages.

---

## 10. PWA (Progressive Web App)

Una PWA es una web que además se comporta como app instalable. En el móvil, "Añadir a pantalla de inicio" crea un icono como cualquier otra app. Al pulsar, abre a pantalla completa, sin barra de navegador.

### Cómo funciona técnicamente
La web incluye una etiqueta:
```html
<link rel="manifest" href="manifest.json">
```
El `manifest.json` es un pequeño archivo JSON que declara nombre de la app, icono, colores, modo de visualización. En este proyecto va inline dentro del propio HTML como Data URL, no como archivo separado.

Los navegadores modernos leen el manifest y, al detectar que es una PWA, ofrecen la opción de instalar.

**La "instalación" no descarga nada** especial: solo guarda un acceso directo con la URL más los datos del manifest.

### Web app vs Native app vs Híbrida vs PWA
- **Web app:** solo funciona en navegador.
- **PWA:** web app instalable, se comporta como app.
- **Híbrida:** HTML+CSS+JS empaquetado en una app nativa (React Native, Flutter, Ionic).
- **Native:** desarrollada específicamente para cada plataforma (Swift para iOS, Kotlin para Android).

Para este proyecto la PWA es perfecta: un solo código, instalable, sin tiendas de apps.

---

## 11. Sonido en la web — cómo suena la guitarra

### Web Audio API
API nativa del navegador para generar y procesar sonido. Permite sintetizar sonidos desde cero. Sin librerías externas, sonaría a sintetizador básico.

### Tone.js
Librería sobre Web Audio API que facilita mucho el trabajo con audio. Incluye clases como `Sampler`, `Synth`, `Player`, etc. Se carga desde CDN (Cloudflare).

### Samples reales
El proyecto usa muestras grabadas de una guitarra clásica de nailon del repositorio público [`nbrosowsky/tonejs-instruments`](https://github.com/nbrosowsky/tonejs-instruments). Se cargan 8 notas de referencia (E2, A2, D3, G3, B3, E4, A4, D5) y para el resto de notas Tone.js hace **pitch-shift** (transposición) automáticamente. Con solo 8 muestras cubre las 144 posiciones del mástil.

### Sistema de fallback
El código intenta primero cargar los samples. Si falla (por CORS en `file://` o red), cae automáticamente a una síntesis Karplus-Strong mejorada (algoritmo clásico de simulación de cuerda pulsada, con resonancia del cuerpo de guitarra simulada por filtros EQ).

### Nota MIDI
El estándar MIDI numera todas las notas musicales. La nota Do central (C4) es MIDI 60. Cada semitono suma o resta 1. La app calcula la nota MIDI de cada posición del mástil sumando el número de traste al MIDI de la cuerda al aire.

---

## 12. Analogías clave para recordar

- **VS Code = bolígrafo inteligente:** el editor con el que escribes.
- **Live Server = escenario:** donde tu web cobra vida como página real.
- **Carpeta del proyecto = papel:** donde vive todo tu código.
- **Git = cámara + rebobinado:** hace fotos del papel y te deja volver atrás.
- **GitHub = álbum de fotos en la nube:** aloja tus fotos de Git y las hace compartibles.
- **GitHub Pages = escaparate en la calle:** convierte tu álbum en una web accesible por URL pública.
- **PWA = disfraz de app:** una web que aparenta ser una app nativa desde el icono del móvil.

Otra analogía útil para Git:

Piensa en Git como una biblioteca personal:
- El **working directory** es tu mesa de trabajo, con libros abiertos y editados.
- El **staging area** es un carrito donde vas seleccionando qué libros mandarás a la estantería.
- El **repository** es la estantería, con todas las versiones anteriores intactas.
- **GitHub** es una biblioteca gemela en la nube.

---

## 13. Diario de fases del proyecto

### Fase 1 — Instalar VS Code
- Descargado desde web oficial.
- Instalado con "Add to PATH" activado.
- Interfaz reconocida (barra iconos, explorer, editor, status bar).

### Fase 2 — Instalar Live Server
- Instalada la extensión de Ritwick Dey desde el panel Extensions.
- Verificado el botón "Go Live" en la barra inferior.

### Fase 3 — Preparar carpeta del proyecto
- Estructura: `C:\Users\pablo\programming\webapps\guitarra\`.
- Archivo `Guitarra3.html` renombrado a `index.html`.
- Comprobado el problema de `file://`: samples no cargan.

### Fase 4 — Abrir proyecto en VS Code
- Workspace de `guitarra` abierto.
- Confirmados autores como fiables.
- Familiarización con Explorer, tabs, breadcrumbs, minimap.

### Fase 5 — Arrancar Live Server
- Confirmada URL `http://127.0.0.1:5500/`.
- Verificado sonido de guitarra real desde samples de Tone.js.
- Comprobado hot reload guardando cambios.
- Firewall: elegido no permitir en redes públicas por seguridad; funciona en local sin problema.

### Fase 6 — Cuenta de GitHub e instalar Git
- Usuario GitHub: `pdigue`.
- Git 2.55.0 instalado con opciones estándar (VS Code como editor por defecto, rama `main` por defecto, credential manager activo).
- Identidad global configurada: `user.name` y `user.email`.

### Fase 7 — Subir a GitHub (en curso)
- Repositorio local inicializado con `git init`.
- Primer commit realizado.
- Repositorio remoto creado en GitHub como público.
- Conectado con `git remote add origin`.
- Push inicial realizado.

### Fase 8 — GitHub Pages (pendiente)

### Fase 9 — Instalar en móvil (pendiente)

### Fase de correcciones (pendiente)
Pendientes acumulados a resolver:
1. **Numeración de trastes decalada:** el número de cada traste no está sobre la celda donde se pulsa, sino desplazado una posición.
2. **Ancho de trastes en móvil vertical:** demasiados trastes comprimidos, hay que duplicar el ancho por traste.
3. **Adaptación al ordenador:** en pantallas grandes solo se ven los trastes que caben en la ventana. Buscar mejor aprovechamiento del espacio.

### Fase de ampliación (pendiente)
- Modo "Nota en cuerda".
- Modo "Adivinar sonido".
- Estadísticas de acierto.

---

## Estrategias para ahorrar cuota con Claude

Por orden de mayor a menor ahorro:

1. **Pedir solo fragmentos** de código, no el archivo completo.
2. **Pedir explicaciones teóricas** cuando se quiera entender (gasta muy poco).
3. **Pedir diffs:** "qué líneas cambio y por qué". Aplicarlas manualmente en VS Code.
4. **Agrupar cambios** en un mensaje.
5. **Hacer cosas triviales sin Claude:** cambiar un color, un texto, un tamaño.
6. **Usar la consola del navegador (F12)** para experimentar sin gastar tokens.
7. **Mantener este cuaderno por fragmentos,** no regenerándolo entero. Claude puede dar el fragmento a añadir al final.

---

## Recursos para profundizar

- **MDN Web Docs** ([developer.mozilla.org/es](https://developer.mozilla.org/es)) — referencia oficial, en español.
- **freeCodeCamp** ([freecodecamp.org](https://www.freecodecamp.org)) — cursos guiados gratuitos.
- **JavaScript.info** ([javascript.info](https://javascript.info)) — JavaScript a fondo, en español.
- **CSS-Tricks** ([css-tricks.com](https://css-tricks.com)) — profundizar en CSS.
- **Pro Git** ([git-scm.com/book/es](https://git-scm.com/book/es)) — el libro oficial de Git, en español, gratis.

---

*Última actualización: 2 de julio de 2026*
*Este cuaderno se irá ampliando con cada nueva fase o concepto relevante del proyecto.*
