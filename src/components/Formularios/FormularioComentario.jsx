import { useState } from "react";
import Col from "react-bootstrap/esm/Col";
import { BotonCancelar, BotonCrear, BotonPeticion } from "../Botones";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/esm/Row";
import Alerta from "../Alerta";

//Formulario para la modificación y creación de un comentario
const FormularioComentario = (props) => {
  //Estados para controlar los datos del comentario
  const [nombre, setNombre] = useState(props.nombre);
  const [calificacion, setCalificacion] = useState(
    props.comentario ? props.comentario.calificacion : 0
  );
  const [mensaje, setMensaje] = useState(
    props.comentario ? props.comentario.mensaje : ""
  );

  //Estado para controlar el mensaje de error
  const [errorModificacion, setErrorModificacion] = useState("");

  //Comprobación de parámetros y llamada a la función de completado
  const manejarFormulario = () => {
    setErrorModificacion("");
    if (nombre === "") {
      setErrorModificacion("El nombre no puede estar vacío.");
      return;
    }
    if (mensaje === "") {
      setErrorModificacion("El mensaje no puede estar vacío.");
      return;
    }
    if (calificacion < 0 || calificacion > 5) {
      setErrorModificacion("La calificación debe estar entre 0 y 5.");
      return;
    }

    const data = {
      nombre,
      calificacion,
      mensaje,
    };

    props.onCompletado(data);
  };

  //Función para controlar la anonimidad del comentario
  const [isAnonimo, setIsAnonimo] = useState(false);

  const manejarAnonimidad = () => {
    if (isAnonimo) {
      setIsAnonimo(false);
      setNombre(props.nombre);
    } else {
      setIsAnonimo(true);
      setNombre("Anónimo");
    }
  };

  return (
    <Row>
      {props.nuevo === true ? (
        <h3>Nuevo comentario</h3>
      ) : (
        <h3>Modificar comentario</h3>
      )}
      <hr />
      {/* Si se selecciona ser anónimo, el input pasa a estar deshabilitado*/}
      <Col md={12} lg={6} className="mb-3">
        <label>Nombre</label>
        <div
          className="mb-2"
          style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="text"
            value={nombre}
            style={{ marginBottom: "0px" }}
            disabled={isAnonimo}
            maxLength={100}
            onChange={(e) => setNombre(e.target.value)}
          />
          <div style={{ display: "inline" }}>
            <BotonCrear texto="Anónimo" onClick={() => manejarAnonimidad()} />
          </div>
        </div>
        {/* Selección de calificación mediante un input range*/}
        <div className="mb-2">
          <label>Puntuación {calificacion}</label>
          <div
            style={{
              display: "flex",
              maxWidth: "300px",
              gap: "10px",
              alignItems: "center",
            }}>
            <label>0</label>
            <input
              type="range"
              min={0}
              max={5}
              step={0.5}
              value={calificacion}
              style={{ marginBottom: "3px", accentColor: "rgb(35, 34, 47)" }}
              onChange={(e) => setCalificacion(e.target.value)}
            />
            <label>5</label>
          </div>
        </div>
      </Col>
      {/*Mensaje del comentario */}
      <Col md={12} lg={6} className="mb-3">
        <label>Mensaje</label>
        <Form.Control
          style={{ border: "1px solid gray" }}
          as="textarea"
          rows={10}
          value={mensaje}
          maxLength={800}
          onChange={(e) => setMensaje(e.target.value)}
        />
      </Col>

      {/* Mostrado de alerta con error de modificación*/}
      <Col xs={12}>
        {errorModificacion && (
          <Alerta tipo="danger" mensaje={errorModificacion}></Alerta>
        )}
        <div style={{ display: "flex", gap: "10px", justifyContent: "end" }}>
          <div>
            <BotonCancelar
              texto="Cancelar"
              onClick={() => props.onCompletado(null)}
            />
          </div>
          <BotonPeticion
            texto={
              props.nuevo === true ? "Crear comentario" : "Modificar comentario"
            }
            onClick={() => manejarFormulario()}
          />
        </div>
      </Col>
    </Row>
  );
};

export default FormularioComentario;
