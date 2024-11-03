import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ContextPanelProvider } from '../context/PanelContext';
import CryptoJS from 'crypto-js';
import Navbar from "../components/Navbar";
import configuracion from "../app/Configuracion";

const Layout = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true); // Estado de carga

    useEffect(() => {
        const encryptedAuth = sessionStorage.getItem('authToken');

        if (!encryptedAuth) {
            navigate('/');
        } else {
            try {
                const bytes = CryptoJS.AES.decrypt(encryptedAuth, configuracion.SECRET_KEY);
                const authState = bytes.toString(CryptoJS.enc.Utf8);

                if (authState !== 'authenticated') {
                    throw new Error('No autenticado');
                }
            } catch (error) {
                navigate('/');
            }
        }

        // Una vez que se ha verificado la autenticación
        setIsLoading(false);
    }, [navigate]);

    if (isLoading) {
        // Mostrar un componente de carga mientras se valida la autenticación
        return <div>Cargando...</div>;
    }

    return (
        <>
            <Navbar />
            <ContextPanelProvider>
                <Outlet />
            </ContextPanelProvider>
        </>
    );
};

export default Layout;
