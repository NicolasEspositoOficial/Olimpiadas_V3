import React from 'react';
import './formulario-de-preguntas.css';

function FormularioDePreguntasEstudiante({ preguntaActual, total, numeroActual, onSeleccionar, respuestaGuardada }) {
  
  const manejarSeleccion = (letra) => {
    onSeleccionar(letra);
  };

  if (!preguntaActual) return null;

  // Función de ayuda para renderizar el contenido del botón (Imagen + Texto)
  const renderizarOpcion = (letra, texto, imagenURL) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%' }}>
        <div style={{ fontWeight: 'bold', alignSelf: 'flex-start' }}>{letra}:</div>
        {imagenURL && (
          <img src={imagenURL} alt={`Opción ${letra}`} style={{ maxWidth: '100%', maxHeight: '120px', objectFit: 'contain', borderRadius: '5px' }} />
        )}
        {texto && <span>{texto}</span>}
      </div>
    );
  };

  return (
    <div className="contenedorPadrePregunta">
      <div className="contenedor-de-pregunta">      
        <div className="texto-de-pregunta">
          <div className="contador-de-preguntas">
            <span>{numeroActual}/{total}</span>
          </div>
          {preguntaActual.enunciado && (
              <p className="estilo-de-pregunta">{preguntaActual.enunciado}</p>
          )}
        </div>

        {preguntaActual.imagen_enunciado && (
          <div className="imagen" style={{ textAlign: 'center', margin: '15px 0' }}>
            <img 
              src={preguntaActual.imagen_enunciado} 
              alt="Pregunta" 
              className="imagen-de-pregunta" 
              style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }}
            />
          </div>
        )}

        <div className="respuestas">
          <div className="bloque-de-respuestas">
            <button 
              className={`estilo-de-respuesta ${respuestaGuardada === 'A' ? 'seleccionada' : ''}`}
              onClick={() => manejarSeleccion('A')}
            >
              {renderizarOpcion('A', preguntaActual.opcion_a, preguntaActual.imagen_a)}
            </button>
            <button 
              className={`estilo-de-respuesta ${respuestaGuardada === 'B' ? 'seleccionada' : ''}`}
              onClick={() => manejarSeleccion('B')}
            >
              {renderizarOpcion('B', preguntaActual.opcion_b, preguntaActual.imagen_b)}
            </button>
          </div>
          <div className="bloque-de-respuestas">
            <button 
              className={`estilo-de-respuesta ${respuestaGuardada === 'C' ? 'seleccionada' : ''}`}
              onClick={() => manejarSeleccion('C')}
            >
              {renderizarOpcion('C', preguntaActual.opcion_c, preguntaActual.imagen_c)}
            </button>
            <button 
              className={`estilo-de-respuesta ${respuestaGuardada === 'D' ? 'seleccionada' : ''}`}
              onClick={() => manejarSeleccion('D')}
            >
              {renderizarOpcion('D', preguntaActual.opcion_d, preguntaActual.imagen_d)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormularioDePreguntasEstudiante;