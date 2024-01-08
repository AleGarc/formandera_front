import { useState } from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Alerta from "../Alerta";
import { BotonCancelar, BotonPeticion } from "../Botones";

//Formulario para la modificación de un usuario
const FormularioAlumno = ({ alumno, onCompletado }) => {
  const [curso, setCurso] = useState(alumno.curso_academico ?? "");

  //Estado para controlar el mensaje de error
  const [errorModificacion, setErrorModificacion] = useState("");

  //Comprobación de parámetros y llamada a la función de completado
  const manejarFormulario = async () => {
    setErrorModificacion("");
    if (curso === "") {
      setErrorModificacion("El curso no puede estar vacío.");
      return;
    }

    const data = {
      curso_academico: curso,
    };

    onCompletado(data);
  };

  return (
    <Row>
      <h3>Detalles del alumno</h3>

      <hr />
      <Col md={12} lg={6} className="mb-3">
        <label>Curso académico</label>
        <input
          type="text"
          value={curso}
          maxLength={100}
          onChange={(e) => setCurso(e.target.value)}
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
              onClick={() => onCompletado(null)}
            />
          </div>
          <BotonPeticion
            texto="Modificar usuario"
            onClick={() => manejarFormulario()}
          />
        </div>
      </Col>
    </Row>
  );
};

export default FormularioAlumno;
