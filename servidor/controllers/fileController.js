const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Configurar la carpeta de almacenamiento
const almacenamientoDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(almacenamientoDir)) {
    fs.mkdirSync(almacenamientoDir); // Crear la carpeta si no existe
}

// Configurar Multer para subir archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, almacenamientoDir); // Guardar archivos en la carpeta almacenamiento
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Guardar el archivo con su nombre original
    }
});
const upload = multer({ storage: storage });

function setupFileRoutes(app) {
    // Ruta para autenticación básica
    app.post('/api/auth', (req, res) => {
        const { usuario, password } = req.body;
        if (usuario === process.env.usuario && password === process.env.password) {
            return res.status(200).json({ message: 'Autenticación exitosa' });
        } else {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }
    });

    // Ruta para subir archivos
    app.post('/api/upload', (req, res) => {
        upload.single('archivo')(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ error: `Error de subida: ${err.message}` });
            } else if (err) {
                return res.status(500).json({ error: `Error inesperado: ${err.message}` });
            }

            const archivo = req.file;
            if (!archivo) {
                return res.status(400).json({ error: 'No se ha subido ningún archivo.' });
            }
            res.status(200).json({ message: `Archivo subido correctamente: ${archivo.originalname}` });
        });
    });
    

    // Ruta para descargar archivos
    app.get('/api/download/:nombreArchivo', (req, res) => {
        const nombreArchivo = req.params.nombreArchivo;
        const filePath = path.join(almacenamientoDir, nombreArchivo);

        if (fs.existsSync(filePath)) {
            res.download(filePath); // Esto envía el archivo para su descarga
        } else {
            res.status(404).send('Archivo no encontrado');
        }
    });

    // Ruta para listar todos los archivos en la carpeta uploads
    app.get('/api/listaArchivos', (req, res) => {
        fs.readdir(almacenamientoDir, (err, archivos) => {
            if (err) {
                return res.status(500).send('Error al listar los archivos');
            }

            // Enviar una respuesta detallada con el nombre y tamaño de cada archivo
            const archivosDetalle = archivos.map((archivo) => {
                const filePath = path.join(almacenamientoDir, archivo);
                const stats = fs.statSync(filePath);

                return {
                    nombre: archivo,
                    tamano: stats.size, // Tamaño del archivo en bytes
                    creado: stats.birthtime // Fecha de creación del archivo
                };
            });

            res.json(archivosDetalle); // Enviar los detalles de los archivos en formato JSON
        });
    });

    // Ruta para eliminar un archivo específico
    app.delete('/api/delete/:nombreArchivo', (req, res) => {
        const nombreArchivo = req.params.nombreArchivo;
        const filePath = path.join(almacenamientoDir, nombreArchivo);

        // Verificar si el archivo existe
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                // Si no existe el archivo, devolver 404 con un mensaje en formato JSON
                return res.status(404).json({
                    message: 'Archivo no encontrado',
                    archivo: nombreArchivo
                });
            }

            // Si el archivo existe, proceder a eliminarlo
            fs.unlink(filePath, (err) => {
                if (err) {
                    // Si ocurre un error al eliminar el archivo, devolver un 500
                    return res.status(500).json({
                        message: 'Error al eliminar el archivo',
                        archivo: nombreArchivo,
                        error: err.message
                    });
                }

                // Confirmar la eliminación exitosa
                res.status(200).json({
                    message: 'Archivo eliminado correctamente',
                    archivo: nombreArchivo
                });
            });
        });
    });
}

module.exports = {
    setupFileRoutes,
};
