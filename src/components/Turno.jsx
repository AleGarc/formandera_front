import Row from "react-bootstrap/esm/Row";
import "../css/horario.css";
import "../css/clase.css";
import Col from "react-bootstrap/esm/Col";
import { BotonCancelar, BotonCrear, BotonPeticion } from "./Botones";
import { useState } from "react";

const Turno = (props) => {
  const turno = props.turno;
  const apuntado = turno.idAlumnos.includes(props.idPublico);
  const [isMostrarAsistentes, setMostrarAsistentes] = useState(false);
  const [asistentes, setAsistentes] = useState([]);

  const manejarAsistentes = () => {
    setAsistentes([]);
    setMostrarAsistentes(true);
    turno.idAlumnos.map((idAlumno) => {
      fetch("http://localhost:3001/usuario/" + idAlumno)
        .then((response) => response.json())
        .then((data) => {
          setAsistentes((asistentesAnteriores) => [
            ...asistentesAnteriores,
            data,
          ]);
        });
    });
  };

  const manejarExpulsion = (idAlumno) => {
    console.log(idAlumno);
  };

  return (
    <div className="turno">
      <Row>
        <h3>{turno.asignatura}</h3>
        <hr />
        <Col
          md={12}
          lg={4}
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "5px",
          }}
          className="mb-3">
          <h5>
            {turno.dia} de {turno.horaInicio} a {turno.horaFin}
          </h5>
        </Col>
        <Col
          md={12}
          lg={4}
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "5px",
          }}
          className="mb-3">
          {props.role === "alumno" && (
            <h5>
              Plazas cubiertas {turno.idAlumnos.length} de {turno.alumnosMax}{" "}
            </h5>
          )}
          {props.role === "docente" && turno.idAlumnos.length > 0 && (
            <div style={{ display: "flex", width: "200px", height: "60px" }}>
              <BotonCrear texto="Ver asistentes" onClick={manejarAsistentes} />
            </div>
          )}
          {props.role === "docente" && turno.idAlumnos.length === 0 && (
            <div>
              <h5>No hay asistentes</h5>
              <h5>{turno.alumnosMax} alumnos máximo</h5>
            </div>
          )}
        </Col>
        <Col md={12} lg={4} className="mb-3">
          {props.role === "alumno" && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
              }}>
              <h5 style={{ paddingTop: "5px" }}>Acciones disponibles</h5>

              <div>
                {apuntado ? (
                  <BotonCancelar texto="Desapuntarse" />
                ) : (
                  <BotonPeticion texto="Apuntarse" />
                )}
              </div>
            </div>
          )}
          {props.role === "docente" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}>
              <h5>Acciones disponibles</h5>
              <div style={{ gap: "20px" }}>
                <BotonCrear texto="Modificar" />
                <BotonCancelar texto="Borrar" />
              </div>
            </div>
          )}
        </Col>
      </Row>
      {isMostrarAsistentes && (
        <Row>
          <div style={{ padding: "30px" }}>
            <h3>
              Asistentes: {turno.idAlumnos.length} / {turno.alumnosMax}
            </h3>
            <hr></hr>
            {asistentes.map((asistente) => (
              <div style={{ display: "flex", gap: "20px" }}>
                <div className="contenedor-asistente" key={asistente.idPublico}>
                  {asistente.nombre}
                </div>
                <div style={{ display: "flex", gap: "5px" }}>
                  <BotonCrear
                    texto="Perfil"
                    onClick={() => {
                      window.location.href = "/usuario/" + asistente.idPublico;
                    }}
                  />
                  <BotonCancelar
                    texto="Expulsar"
                    onClick={() => manejarExpulsion(asistente.idPublico)}
                  />
                </div>
              </div>
            ))}
          </div>
        </Row>
      )}
    </div>
  );
};

export default Turno;
