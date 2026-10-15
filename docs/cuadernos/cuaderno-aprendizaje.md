# Cuaderno de aprendizaje — Programación y desarrollo

> Recopilatorio personal de teoría y conceptos clave aprendidos en las conversaciones con Claude. Sirve como referencia rápida y memoria persistente entre sesiones.

---

## Cómo usar este documento

- **Formato:** Markdown (`.md`). Se lee perfectamente como texto plano, pero abierto en VS Code o GitHub se ve con títulos, negritas y bloques de código resaltados.
- **Actualización:** cuando aprendamos algo nuevo, Claude te dará el fragmento exacto a añadir al final. Tú pegas y guardas. Así ahorramos cuota frente a regenerar el archivo entero.
- **En proyectos de Claude:** si lo subes al proyecto, Claude lo puede leer en cada conversación nueva. No lo puede modificar él directamente; las actualizaciones siempre son manuales.

---

## 1. Tipos de aplicaciones

Cuando se habla de "una app", suele ser una de estas cuatro cosas:

### 1.1 Aplicación web (web app)

- **Qué es:** un programa que vive en un servidor y al que accedes desde el navegador (Chrome, Safari, Firefox). No se instala.
- **Ejemplos:** Gmail, Google Docs, Notion (en navegador), Trello.
- **Lenguajes:**
  - **Frontend** (lo que ves): HTML + CSS + JavaScript. Siempre estos tres.
  - **Backend** (servidor): puede ser cualquier lenguaje — Python, Node.js, Java, Go, PHP, Ruby...
- **Ventajas:** funciona en cualquier dispositivo con navegador, sin instalación. Actualizas el servidor y todos los usuarios ven la nueva versión al instante.
- **Desventajas:** suele necesitar conexión a internet, y tiene acceso limitado al hardware del dispositivo.

### 1.2 Aplicación nativa (native app)

- **Qué es:** programa instalado directamente en el sistema operativo, escrito específicamente para esa plataforma.
- **Ejemplos:** WhatsApp en iPhone, Photoshop en Windows, Final Cut en Mac.
- **Lenguajes por plataforma:**
  - **iOS:** Swift (moderno) u Objective-C (antiguo).
  - **Android:** Kotlin (moderno) o Java (antiguo).
  - **Windows:** C# con .NET, o C++.
  - **macOS:** Swift.
  - **Linux:** C, C++, Python, Rust...
- **Ventajas:** máximo rendimiento, acceso total al hardware (cámara, GPS, sensores), funciona sin internet.
- **Desventajas:** desarrollas un código distinto para cada plataforma. Distribución por tiendas (App Store, Play Store) con sus normas y comisiones.

### 1.3 Aplicación híbrida

- **Qué es:** una web app empaquetada para parecer nativa. Por dentro es HTML+CSS+JS, pero se instala como app normal.
- **Ejemplos:** muchas apps de bancos, partes de Instagram, Discord en escritorio.
- **Tecnologías más usadas:** React Native, Flutter, Ionic, Cordova, Electron (este último para escritorio).
- **Ventajas:** un solo código para iOS, Android y web. Desarrollo más rápido.
- **Desventajas:** algo más lenta que la nativa, no siempre se ve 100% como una app del sistema.

### 1.4 PWA (Progressive Web App)

- **Qué es:** una web app que, además, se puede "instalar" en el móvil como si fuera una app, funciona sin conexión y se comporta como aplicación.
- **Tu app de trastes es prácticamente una PWA**: tiene manifest, icono, modo standalone.
- **Lenguajes:** HTML + CSS + JavaScript (lo mismo que una web app).
- **Ventajas:** un solo código, sin pasar por tiendas, instalable, ligera.
- **Desventajas:** acceso limitado a hardware (mejorando año a año), no aparece en tiendas oficiales.

### Resumen — cuándo usar cada una

- **Web app:** la mayoría de casos. Especialmente si el usuario va a estar conectado y trabajando con datos en la nube.
- **PWA:** cuando quieres algo "instalable" sin complicarte con tiendas. Ideal para herramientas personales como la app de trastes.
- **Híbrida:** si necesitas estar en tiendas y acceder a más hardware, pero quieres un solo código.
- **Nativa:** solo si necesitas máximo rendimiento o acceso profundo (juegos AAA, edición de vídeo, sensores avanzados).

---

## 2. Las tres piezas de cualquier web o PWA

Aunque hagas algo simple, siempre son estas tres cosas trabajando juntas:

### HTML — La estructura

- Define **qué hay** en la página: títulos, párrafos, botones, imágenes, contenedores.
- Es el esqueleto.
- Ejemplo: `<button>Pulsa aquí</button>` define un botón.

### CSS — El estilo

- Define **cómo se ve** lo que hay: colores, tamaños, posiciones, fuentes, animaciones.
- Es la piel y la ropa.
- Ejemplo: `button { background: red; color: white; }` pone todos los botones en rojo con texto blanco.

### JavaScript — El comportamiento

- Define **qué pasa**: al pulsar, al cargar, al deslizar, cálculos, sonido, lógica.
- Es el sistema nervioso.
- Ejemplo: `button.addEventListener('click', () => alert('Hola'))` muestra un aviso al pulsar el botón.

**En tu archivo de la guitarra los tres conviven en un solo `.html`**, separados por etiquetas:
- `<style>...</style>` para CSS.
- `<script>...</script>` para JS.

Para apps pequeñas, este formato "todo en uno" es el más cómodo.

---

## 3. Editores y entornos de desarrollo

### Spyder

- **Para:** Python científico (análisis de datos, gráficos, cálculo).
- **NO usar para:** web (HTML, CSS, JS).
- **Viene con:** Anaconda, normalmente.

### VS Code (Visual Studio Code)

- **Para:** prácticamente todo. Python, web, Markdown, JSON, cualquier lenguaje.
- **Coste:** gratis.
- **Por qué es el estándar actual:** ligero, rápido, miles de extensiones, integra terminal y Git.
- **Descarga:** [code.visualstudio.com](https://code.visualstudio.com)

### Confusión habitual

- **Visual Studio** (sin "Code"): producto diferente, más pesado, orientado a .NET y C++ en Windows. **No confundir con VS Code.**
- **PyCharm:** especializado en Python, alternativa pro a Spyder.
- **WebStorm:** especializado en JavaScript, alternativa pro a VS Code para web.
- **Sublime Text, Atom:** editores históricos, hoy menos usados.

### Recomendación

- Si haces **Python científico:** Spyder o PyCharm.
- Si haces **web o variedad:** VS Code.
- **Pueden convivir sin problema** en el mismo ordenador. No necesitas reinstalar nada.

---

## 4. Flujo de trabajo para una app web simple

1. Abrir VS Code.
2. Crear archivo `nombre.html`.
3. Escribir o pegar código.
4. Guardar (Ctrl+S).
5. Doble clic en el archivo desde el explorador → se abre en el navegador.
6. Para ver cambios automáticamente al guardar: instalar la extensión **Live Server** en VS Code, clic derecho sobre el archivo → "Open with Live Server".
7. Para depurar: en el navegador pulsar **F12** → consola con errores, inspector de elementos, y herramientas de red.
8. Para probar en el móvil:
   - Pasar el archivo por AirDrop / Telegram / email y abrirlo en Safari o Chrome.
   - O subirlo a **GitHub Pages** / **Netlify Drop** (gratis, te dan URL pública).

---

## 5. Estrategias para ahorrar cuota con Claude

Por orden de mayor a menor ahorro:

1. **Pedir solo fragmentos** del código, no el archivo completo. "Modifica solo la función X" en lugar de "rehazme todo el archivo".
2. **Pedir explicaciones teóricas** cuando se quiera entender (gasta muy poco).
3. **Pedir diffs:** "qué líneas cambio y por qué". Aplicarlas manualmente en VS Code con buscar y reemplazar.
4. **Agrupar cambios** en un mensaje. Cinco cosas a la vez en lugar de cinco mensajes.
5. **Hacer cosas triviales sin Claude:** cambiar un color, un texto, un tamaño.
6. **Usar la consola del navegador (F12)** para experimentar con JavaScript sin gastar conmigo.
7. **Mantener este documento por fragmentos**, no regenerándolo entero cada vez.

---

## 6. Archivos en proyectos de Claude

- Si subes archivos al proyecto, Claude **puede leerlos** en cada conversación nueva (acceso de solo lectura).
- Claude **no puede modificar** archivos del proyecto directamente desde el chat.
- **Flujo recomendado:**
  1. Claude te genera el fragmento a añadir o cambiar.
  2. Tú abres el archivo en VS Code.
  3. Pegas o reemplazas según indique.
  4. Guardas.
  5. Si está en un proyecto de Claude, opcionalmente reemplazas el archivo en el proyecto para futuras consultas.

---

## 7. Recursos para aprender por tu cuenta

- **MDN Web Docs** ([developer.mozilla.org](https://developer.mozilla.org)) — referencia oficial, en español, gratis. La biblia de HTML/CSS/JS.
- **freeCodeCamp** ([freecodecamp.org](https://www.freecodecamp.org)) — cursos guiados gratuitos, muy prácticos.
- **JavaScript.info** ([javascript.info](https://javascript.info)) — explica JavaScript a fondo desde cero, también en español.
- **CSS-Tricks** ([css-tricks.com](https://css-tricks.com)) — para profundizar en CSS.

---

## 8. Glosario rápido

- **Frontend:** lo que ve el usuario, lo que se ejecuta en su navegador.
- **Backend:** servidor, base de datos, lógica que el usuario no ve.
- **Framework:** "kit" de herramientas que da estructura para construir más rápido (React, Vue, Django, Flask...).
- **Librería:** código reutilizable que importas para no escribirlo tú (Tone.js, jQuery, Lodash).
- **API:** "enchufe" que permite que dos programas se comuniquen.
- **DOM:** representación en memoria de la página HTML que JavaScript puede manipular.
- **Repositorio (repo):** carpeta de proyecto versionada con Git, normalmente alojada en GitHub.

---

*Última actualización: 29 de junio de 2026*
