import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ModalSobreNosotros from './ModalSobreNosotros';
import ComandosModal from './ComandosModal';



const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Eliminar el estado cifrado de sessionStorage
    sessionStorage.removeItem('authToken');

    // Redirigir al login
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
            <Link className="navbar-brand" to="/panel">Mi Panel</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <Link className="nav-link" to="/panel/lista">Lista</Link>
                    </li>
                    <li className="nav-item">
                        <ComandosModal/>
                    </li>
                    
                    <li className="nav-item">
                        <ModalSobreNosotros/>
                    </li>
                   
                </ul>
                <button className="btn btn-danger" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
        </div>
    </nav>
);
};

export default Navbar;
