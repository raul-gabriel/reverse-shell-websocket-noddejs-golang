import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const ComandosModal = () => {
    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const comandos = [
        { name: 'cd', description: 'Cambiar de directorio Uso: cd <ruta_del_directorio>' },
        { name: 'cd ..', description: 'Retroceder directorio' },
        { name: 'ls', description: 'Lista los archivos y directorios.' },
        { name: 'pwd', description: 'Ubicacion del directorio actual.' },
        { name: 'screenshot', description: 'Captura la pantalla actual.' },
        { name: 'set-file', description: 'Envia un archivo. Uso: set-file <nombre_del_archivo>' },
        { name: 'get-file', description: 'Recupera un archivo. Uso: get-file <nombre_del_archivo>' },
        { name: 'start', description: 'Ejecuta cualquier comando en segundo plano.Uso: estart notepad,start archivo.exe,etc ' },
        { name: 'comand', description: 'Ejecuta comando con resultado .Uso: comand ipconfig , etc ' },
    ];

    return (
        <div>
            <Link className="nav-link" onClick={handleShow} style={{ cursor: 'pointer' }}>
                Comandos
            </Link>

            {show && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Comandos Disponibles</h5>
                                <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <ul className="list-group">
                                    {comandos.map((comando, index) => (
                                        <li key={index} className="list-group-item">
                                            <strong>{comando.name}</strong>: {comando.description}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleClose}>
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {show && <div className="modal-backdrop fade show" onClick={handleClose}></div>}
        </div>
    );
};

export default ComandosModal;
