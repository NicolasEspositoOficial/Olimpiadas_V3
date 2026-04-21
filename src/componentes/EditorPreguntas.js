import React, { useState, useEffect } from 'react';
import './EditorPreguntas.css';

const EditorPreguntas = ({ grado, alCerrar }) => {
    const [preguntas, setPreguntas] = useState([]); 
    const [preguntaSeleccionada, setPreguntaSeleccionada] = useState(null);
    const [cargando, setCargando] = useState(true);

    const cargarPreguntas = () => {
        setCargando(true);
        fetch(`/preguntas?grado=${grado}`)
            .then(res => res.json())
            .then(data => {
                setPreguntas(data);
                if (data.length > 0) {
                    setPreguntaSeleccionada(data[0]);
                } else {
                    setPreguntaSeleccionada(null);
                }
                setCargando(false);
            })
            .catch(err => {
                console.error("Error cargando preguntas:", err);
                setCargando(false);
            });
    };

    useEffect(() => {
        cargarPreguntas();
    }, [grado]);

    const nuevaPregunta = () => {
        const nueva = {
            id: null, 
            titulo: '',
            enunciado: '',
            imagen_enunciado: '',
            opcion_a: '',
            imagen_a: '',
            opcion_b: '',
            imagen_b: '',
            opcion_c: '',
            imagen_c: '',
            opcion_d: '',
            imagen_d: '',
            respuesta_correcta: 'a',
            grado: grado
        };
        setPreguntaSeleccionada(nueva);
        setPreguntas([...preguntas, { ...nueva, id: 'temp-' + Date.now() }]);
    };

    const guardarEnBD = () => {
        if (!preguntaSeleccionada.enunciado && !preguntaSeleccionada.imagen_enunciado) {
            alert("Por favor rellena al menos el enunciado o la imagen complementaria");
            return;
        }

        fetch('/guardar-pregunta', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(preguntaSeleccionada)
        })
        .then(res => res.json())
        .then(data => {
            alert("¡Pregunta guardada con éxito!");
            cargarPreguntas(); 
        })
        .catch(err => alert("Error al conectar con el servidor"));
    };

    const eliminarPregunta = () => {
        if (!preguntaSeleccionada.id || String(preguntaSeleccionada.id).includes('temp')) {
            setPreguntas(preguntas.filter(p => p.id !== preguntaSeleccionada.id));
            setPreguntaSeleccionada(null);
            return;
        }

        if (window.confirm("¿Estás seguro de eliminar esta pregunta definitivamente?")) {
            fetch(`/eliminar-pregunta/${preguntaSeleccionada.id}`, {
                method: 'DELETE'
            })
            .then(() => {
                alert("Pregunta eliminada");
                cargarPreguntas();
            })
            .catch(err => console.error(err));
        }
    };

    const manejarCambioInput = (e) => {
        const { name, value } = e.target;
        const actualizada = { ...preguntaSeleccionada, [name]: value };
        setPreguntaSeleccionada(actualizada);
        setPreguntas(preguntas.map(p => p.id === preguntaSeleccionada.id ? actualizada : p));
    };

    const cambiarCorrecta = (letra) => {
        const actualizada = { ...preguntaSeleccionada, respuesta_correcta: letra };
        setPreguntaSeleccionada(actualizada);
        setPreguntas(preguntas.map(p => p.id === preguntaSeleccionada.id ? actualizada : p));
    };

    return (
        <div className="contenedor-editor-modal">
            <div className="sidebar-editor">
                <h3 className="titulo-sidebar">Preguntas {grado}</h3>
                <button className="btn-add" onClick={nuevaPregunta} title="Nueva Pregunta">+</button>
                
                <div className="lista-preguntas-scroll">
                    {cargando ? <p>Cargando...</p> : 
                        preguntas.map((preg, index) => (
                            <button 
                                key={preg.id} 
                                onClick={() => setPreguntaSeleccionada(preg)}
                                className={`btn-pregunta-item ${preguntaSeleccionada?.id === preg.id ? 'activo' : ''}`}
                            >
                                {preg.titulo || `Pregunta ${index + 1}`}
                            </button>
                        ))
                    }
                </div>
                
                <button onClick={alCerrar} className="btn-salir">Cerrar Editor</button>
            </div>

            <div className="formulario-editor">
                {!preguntaSeleccionada ? (
                    <div className="aviso-seleccionar">
                        <p>Haz clic en <b>"+"</b> para crear una pregunta de {grado}.</p>
                    </div>
                ) : (
                    <>
                        <div className="input-group">
                            <label>Título:</label>
                            <input 
                                name="titulo"
                                type="text" 
                                className="input-texto" 
                                value={preguntaSeleccionada.titulo || ''}
                                onChange={manejarCambioInput}
                                placeholder="Ej: Suma básica"
                            />
                        </div>

                        <div className="input-group-vertical">
                            <label>Pregunta:*</label>
                            <textarea 
                                name="enunciado"
                                className="textarea-pregunta" 
                                value={preguntaSeleccionada.enunciado || ''}
                                onChange={manejarCambioInput}
                                placeholder="Escribe el problema aquí..."
                            ></textarea>
                        </div>

                        <div className="input-group-vertical">
                            <label>URL Imagen Complementaria (Opcional):</label>
                            <input 
                                name="imagen_enunciado"
                                type="text" 
                                className="input-texto" 
                                value={preguntaSeleccionada.imagen_enunciado || ''}
                                onChange={manejarCambioInput}
                                placeholder="Pega el link de la imagen de la pregunta aquí..."
                            />
                        </div>

                        <div className="seccion-respuestas">
                            <p className="label-respuestas">Respuestas* (Marca la correcta)</p>
                            <div className="grid-respuestas" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {['a', 'b', 'c', 'd'].map((letra) => (
                                    <div key={letra} className="respuesta-fila" style={{ background: '#f5f5f5', padding: '10px', borderRadius: '8px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                            <label style={{ fontWeight: 'bold' }}>{letra.toUpperCase()}</label>
                                            <input 
                                                name={`opcion_${letra}`}
                                                className="input-respuesta" 
                                                type="text" 
                                                value={preguntaSeleccionada[`opcion_${letra}`] || ''}
                                                onChange={manejarCambioInput}
                                                placeholder={`Texto de opción ${letra.toUpperCase()}`}
                                            />
                                            <input 
                                                type="radio" 
                                                name="respuesta_correcta" 
                                                className="radio-correcta"
                                                checked={preguntaSeleccionada.respuesta_correcta === letra}
                                                onChange={() => cambiarCorrecta(letra)}
                                                style={{ transform: 'scale(1.5)', marginLeft: '10px' }}
                                            />
                                        </div>
                                        <div style={{ paddingLeft: '25px' }}>
                                            <input 
                                                name={`imagen_${letra}`}
                                                className="input-respuesta" 
                                                type="text" 
                                                value={preguntaSeleccionada[`imagen_${letra}`] || ''}
                                                onChange={manejarCambioInput}
                                                placeholder={`URL Imagen opción ${letra.toUpperCase()} (Opcional)`}
                                                style={{ fontSize: '0.9em', border: '1px dashed #ccc' }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="acciones-editor" style={{ marginTop: '20px' }}>
                            <button className="btn-accion primary" onClick={guardarEnBD}>
                                Guardar en Base de Datos
                            </button>
                            <button className="btn-accion btn-eliminar" onClick={eliminarPregunta}>
                                Eliminar
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default EditorPreguntas;