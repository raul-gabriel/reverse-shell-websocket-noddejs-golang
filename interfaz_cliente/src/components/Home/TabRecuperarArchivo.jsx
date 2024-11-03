import { useContext, useState } from "react";
import { PanelContext } from "../../context/PanelContext";

export default function TabRecuperarArchivo() {
    const [nombreArchivo, setnombreArchivo] = useState();

    const { enviarComando, respuestaRecuperarArchivo } = useContext(PanelContext);


    const procesa = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            enviarComando('get-file ' + nombreArchivo)
            setnombreArchivo('');
        }
    }
    return <>
        <input
            type="text"
            className="form-control"
            placeholder="Ingresa el nombre del archivo  a recuperar (archivo.txt)"
            value={nombreArchivo}
            onChange={(e) => setnombreArchivo(e.target.value)}
            onKeyPress={procesa}
        />


        <br /><br />

        <div>
            {respuestaRecuperarArchivo && (
                <div className="alert alert-warning" role="alert">
                    <pre>
                        {respuestaRecuperarArchivo}
                    </pre>
                </div>
            )}

        </div>
    </>
};


