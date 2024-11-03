import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import configuracion from '../app/Configuracion';
import CryptoJS from 'crypto-js'; // Librería para cifrar

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const data = { usuario, password };

    try {
      const response = await fetch(`${configuracion.urlApi}auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        const encryptedAuth = CryptoJS.AES.encrypt('authenticated', configuracion.SECRET_KEY).toString();
        sessionStorage.setItem('authToken', encryptedAuth);
        navigate('/panel/lista');
      } else {
        setError(result.message || 'Error en la autenticación');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <h1 className="text-center mb-4">Login</h1>
          <form onSubmit={handleLogin}>
            <div className="form-group mb-3">
              <label htmlFor="usuario">Usuario</label>
              <input
                type="text"
                className="form-control"
                id="usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <button type="submit" className="btn btn-primary w-100">
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
