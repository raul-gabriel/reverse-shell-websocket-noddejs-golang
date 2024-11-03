import React, { useContext, useState } from 'react';
import { PanelContext } from '../context/PanelContext';
import ModalTab from '../components/Home/ModalTab';
import ModalArchivosCarpeta from '../components/Home/ModalArchivosCarpeta';

const Home = () => {
    const { clientes, setidVictima } = useContext(PanelContext);

    const [show, setShow] = useState(false);


    const abrirModal = (id) => {
        setidVictima(id)
        setShow(true);
    };
    const handleClose = () => setShow(false);

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Lista de víctimas</h2> <ModalArchivosCarpeta/><br />
            <div className="table-responsive">
                <table className="table table-hover table-striped table-bordered">
                    <thead className="thead-dark">
                        <tr>
                            <th>ID Cliente</th>
                            <th>IP Local</th>
                            <th>IP Pública</th>
                            <th>Nombre</th>
                            <th>Sistema Operativo</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes && Object.keys(clientes).length > 0 ? (
                            Object.keys(clientes).map((clienteId) => (
                                <tr key={clienteId}>
                                    <td>{clienteId}</td>
                                    <td>{clientes[clienteId].datos.ipLocal}</td>
                                    <td>{clientes[clienteId].datos.ipPublica}</td>
                                    <td>{clientes[clienteId].datos.nombre}</td>
                                    <td>{clientes[clienteId].datos.sistema_operativo}</td>
                                    <td>
                                        <button className="btn btn-primary btn-sm" onClick={() => abrirModal(clienteId)}>
                                            Abrir
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center">
                                    No hay clientes disponibles
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <ModalTab modalShow={show} cerrarModal={handleClose} />
        </div>

    );
};

export default Home;
