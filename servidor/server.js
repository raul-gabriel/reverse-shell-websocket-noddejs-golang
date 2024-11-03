const express = require('express');
const http = require('http');
const cors = require('cors');
const { WebSocketServer } = require('ws');
const path = require('path');
require('dotenv').config();

// Importar controladores
const { manejarConexionesWebSocket } = require('./controllers/websocketController');
const { setupFileRoutes } = require('./controllers/fileController');

// Inicializa Express
const app = express();
app.use(express.json());

app.use(cors({
    origin: '*',
}));

// Configurar rutas para manejo de archivos (API)
setupFileRoutes(app);  // Todas las rutas de la API están primero

// Servir los archivos estáticos desde la carpeta "public"
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// Crear el servidor HTTP y WebSocket
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Manejo de conexiones WebSocket
wss.on('connection', manejarConexionesWebSocket);

// Ruta para manejar todas las rutas de React (React Router)
app.get('*', (req, res, next) => {
    // Verifica si la solicitud no es para una ruta de la API o WebSocket
    if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/ws')) {
        return next(); // Si es una ruta de la API o WebSocket, pasa al siguiente middleware
    }
    res.sendFile(path.join(publicPath, 'index.html')); // Si no, sirve el index.html
});

// Configurar el puerto del servidor
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
