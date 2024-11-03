import { useContext, useState } from "react";
import { PanelContext } from "../../context/PanelContext";

export default function TabCarpetaArchivos() {
    const { listaAchivos, eliminarArchivo, subirArchivo, urlServidor } = useContext(PanelContext); // asegúrate de que subirArchivo esté correctamente
    const [archivo, setArchivo] = useState(null);
    const [mensaje, setMensaje] = useState('');
    const [archivos, setArchivos] = useState(listaAchivos);

    const handleArchivoSeleccionado = (e) => {
        setArchivo(e.target.files[0]);
    };

    const handleSubirArchivo = async () => {
        if (!archivo) return alert('Selecciona un archivo para subir');

        try {
            const resultado = await subirArchivo(archivo); // subirArchivo debe estar correctamente en el contexto
            setMensaje(resultado);
            setArchivos([...archivos, { nombre: archivo.name }]); // Actualiza la lista de archivos
            setArchivo(null);
            document.querySelector('input[type="file"]').value = ''; // Limpia el input de archivo
        } catch (error) {
            setMensaje('Error al subir el archivo');
        }
    };

    const handleEliminarArchivo = async (nombreArchivo) => {
        const confirmacion = window.confirm(`¿Estás seguro de que deseas eliminar el archivo: ${nombreArchivo}?`);
    
        if (!confirmacion) return;
    
        try {
            // Recibe el resultado correctamente
            const resultado = await eliminarArchivo(nombreArchivo);
            
            // Usa el mensaje del resultado para mostrar en la UI
            setMensaje(resultado.message);
    
            // Filtra el archivo eliminado de la lista de archivos
            setArchivos(archivos.filter((archivo) => archivo.nombre !== nombreArchivo)); // Actualiza la lista sin recargar
        } catch (error) {
            // Muestra un mensaje de error si ocurre un problema
            setMensaje(`Error: ${error.message}`);
        }
    };

    const handleDescargarArchivo = (nombreArchivo) => {
        //window.open(`${urlServidor}download/${nombreArchivo}`, '_blank');
        window.location.href =` ${urlServidor}download/${nombreArchivo}`;
    };

    return (
       <>
        <p>{urlServidor}download/nombreArchivo.txt</p>
        <div className="container mt-4">
            <div className="form-group">
                <input
                    type="file"
                    className="form-control"
                    onChange={handleArchivoSeleccionado}
                />
                <button
                    className="btn btn-success mt-2"
                    onClick={handleSubirArchivo}
                >
                    Subir Archivo
                </button>
                {mensaje && (
                    <div className="mt-3">
                        <p>{mensaje}</p>
                    </div>
                )}
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead className="thead-dark">
                        <tr>
                            <th>Nombre del Archivo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {archivos && archivos.length > 0 ? (
                            archivos.map((archivo, index) => (
                                <tr key={index}>
                                    <td>{archivo.nombre}</td>
                                    <td>
                                        <button
                                            className="btn btn-primary btn-sm mr-2"
                                            onClick={() => handleDescargarArchivo(archivo.nombre)}
                                        >
                                            Descargar
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleEliminarArchivo(archivo.nombre)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2" className="text-center">
                                    No hay archivos disponibles
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
       </>
    );
}
