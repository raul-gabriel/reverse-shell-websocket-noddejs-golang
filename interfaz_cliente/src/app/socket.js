import { useRef } from 'react';
import configuracion from './Configuracion';

const useWebSocket = () => {
    const ws = useRef(null);

    if (!ws.current) {
        ws.current = new WebSocket(configuracion.urlServidor);
    }

    return ws.current;
};

export default useWebSocket;
