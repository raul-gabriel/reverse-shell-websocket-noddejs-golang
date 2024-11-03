import { useContext } from "react";
import { PanelContext } from "../../context/PanelContext";

export default function TabCaptura() {
    const { enviarComando, descargarImagen, capturaBase64 } = useContext(PanelContext);

    const handleCapturaClick = (e) => {
        e.preventDefault();
        enviarComando('screenshot');
    };

    const handleDescargarClick = (e) => {
        e.preventDefault();
        descargarImagen();
    };

    return (
        <>
            <button className="btn btn-danger" onClick={handleCapturaClick}>
                Capturar
            </button>

            {capturaBase64 ? (
                <div>
                    <img
                        src={`data:image/png;base64,${capturaBase64}`}
                        alt="Captura de pantalla"
                        style={{ maxWidth: "100%", height: "auto" }}
                    />
                    <br /><br />
                    <button className="btn btn-success" type="button" onClick={handleDescargarClick}>
                        Descargar Imagen
                    </button>
                </div>
            ) : (
                <p>No hay captura de pantalla disponible.</p>
            )}
        </>
    );
}
