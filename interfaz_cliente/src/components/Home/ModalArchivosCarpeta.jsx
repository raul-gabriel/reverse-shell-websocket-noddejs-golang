import React, { useState } from 'react';
import TabCarpetaArchivos from './TabCarpetaArchivos';

function ModalArchivosCarpeta() {
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    return (
        <div>
            <button type="button" className="btn btn-success" onClick={handleShow}>
                Carpeta de Archivos
            </button>
            {show && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Carpeta de archivos</h5>
                                <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <TabCarpetaArchivos/>
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
}

export default ModalArchivosCarpeta;
