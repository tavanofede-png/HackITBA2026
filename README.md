# Vaultix DApp

Vaultix es una aplicación descentralizada (DApp) diseñada para gestionar bóvedas criptográficas seguras (Crypto Vaults). Permite a los usuarios asegurar sus activos digitales y, al mismo tiempo, establecer lógicas de recuperación y herencia descentralizadas mediante la designación de "Guardianes" (Guardians) y "Herederos" (Heirs).

## 🗂️ Estructura del Proyecto

El proyecto está dividido en tres componentes principales:

- **`/contracts`**: Contiene los Smart Contracts en Solidity que definen la lógica core de Vaultix, la creación de bóvedas y los roles (Owner, Guardian, Heir).
- **`/server`**: Un backend liviano en Node.js/Express. Se encarga de guardar y proveer la metadata de las bóvedas (como direcciones de billeteras y correos electrónicos) utilizando una base de datos local basada en JSON (`database.json`).
- **`/frontend`**: Interfaz de usuario web construida con HTML, CSS, y JavaScript puro. Se conecta mediante `ethers.js` a tu billetera MetaMask para interactuar directamente con los contratos y el servidor.

---

## 🚀 Cómo inicializar el proyecto localmente

Sigue estos pasos para hacer correr el proyecto en tu computadora tras haberlo clonado.

### 1. Clonar el repositorio

Abre tu terminal y ejecuta:

```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_DIRECTORIO>
```

### 2. Configurar e Iniciar el Backend (Server)

El servidor de Node.js se debe ejecutar para manejar la metadata de la base de datos local.

1. Abre una terminal y navega a la carpeta `/server`:
   ```bash
   cd server
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. (Opcional) Puedes crear un archivo `.env` tomando como referencia el archivo `.env.example` en caso de requerir un puerto específico. Por defecto, utilizará el puerto `3001`.
4. Inicia el servidor:
   ```bash
   npm start
   # o bien, si deseas usar modo desarrollador con recarga automática:
   npm run dev
   ```
   *Deberías ver en la consola el mensaje:* `Server listening on port 3001`

### 3. Ejecutar el Frontend

Dado que el frontend utiliza archivos estáticos y módulos ES6 de Javascript, debe ser servido a través de un servidor HTTP local (no puedes simplemente abrir el archivo `index.html` en el navegador dando doble clic, ya que tirará errores de CORS).

1. Ingresa a la carpeta `/frontend`.
2. Utiliza alguna de las siguientes herramientas para servir la carpeta:
   - **Con VS Code:** Instala la extensión **Live Server**, haz clic derecho sobre el archivo `index.html` y selecciona *"Open with Live Server"*.
   - **Con Node.js (serve):**
     ```bash
     npx serve .
     ```
   - **Con Python:**
     ```bash
     python -m http.server 8000
     ```
3. Abre la URL local generada (por ejemplo, `http://localhost:8000` o `http://127.0.0.1:5500`) en tu navegador web.

### 4. Conectar MetaMask

Para interactuar con la plataforma, asegúrate de:
- Tener instalada la extensión de **MetaMask** en tu navegador.
- Estar conectado a la red donde se hayan desplegado los contratos (ej. *Localhost 8545*, *Sepolia*, etc).
- Si realizaste cambios en los Smart Contracts, asegúrate de compilarlos, desplegarlos e importar el nuevo ABI / Contract Addresses en los archivos del frontend (`/frontend/abi.js` u otros).

---

¡Listo! Ya tienes tanto el backend como el frontend levantados para interactuar con tu StrongBox localmente en tu PC.
