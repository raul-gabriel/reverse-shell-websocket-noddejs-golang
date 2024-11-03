import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Importa Link desde react-router-dom

export default function ModalSobreNosotros() {
    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    return (
        <div>
            <Link className="nav-link" onClick={handleShow} style={{ cursor: 'pointer' }}>
                Info
            </Link>

            {show && (
                <div className="modal show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Sobre mí</h5>
                                <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
                            </div>
                            <div className="modal-body text-center">
                                <h4 className="mb-3">Desarrollado por <strong>Raul Gabriel Hacho</strong></h4>
                                <p className="lead text-muted">Cusco, Perú</p>
                                <p className="mt-4" style={{ fontStyle: 'italic' }}>
                                    Este proyecto fue desarrollado con fines educativos.
                                    <br />
                                    <span className="text-danger">No me hago responsable del mal uso que se le dé a esta herramienta.</span>
                                </p>
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
