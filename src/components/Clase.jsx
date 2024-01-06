import { useState, useEffect } from "react";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useParams } from "react-router-dom";
import { EtiquetaAsignatura, EtiquetaGalardones } from "./Etiqueta";
import "../css/clase.css";
import { BotonCrear } from "./Botones";
import HorarioClase from "./HorarioClase";

const Clase = () => {
  const idClase = useParams().id;
  const [clase, setClase] = useState(undefined);
  const [profesor, setProfesor] = useState({});

  useEffect(() => {
    fetch("http://localhost:3001/clase/" + idClase)
      .then((response) => response.json())
      .then((data) => {
        setClase(data);
        return fetch("http://localhost:3001/usuario/" + data.idProfesor);
      })
      .then((response) => response.json())
      .then((data) => setProfesor(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [idClase]);

  const manejarInfoDocente = () => {
    window.location.href =
      "http://localhost:3000/docente/" + profesor.idPublico;
  };

  if (!clase) return <p>Cargando...</p>;
  return (
    <div>
      <Container className={"mt-5 mb-5"}>
        <div>
          <h1>{clase.nombre}</h1>
          <hr></hr>
        </div>
        <Row>
          <Col sm={12} lg={8} className="mb-5">
            <Container id="datos-clase" fluid className="contenedor-fluid">
              <div className="mb-2">
                <h3>Detalles</h3>
                <p>{clase.descripcion}</p>
              </div>
              <div className="mb-2">
                <h3>Precio</h3>
                <label className="etiqueta-precio">
                  {clase.precio ? clase.precio + " €/h" : "Negociable"}
                </label>
              </div>
              <Container className="contenedor-fluid">
                <h3>Asignaturas</h3>
                {clase.asignaturas ? (
                  clase.asignaturas.map((asignatura) => (
                    <EtiquetaAsignatura texto={asignatura} key={asignatura} />
                  ))
                ) : (
                  <p>Cargando asignaturas...</p>
                )}
              </Container>
            </Container>
          </Col>
          <Col sm={12} lg={4} className="mb-5">
            <Container id="datos-profesor" fluid className="contenedor-fluid-2">
              <h3>Docente</h3>
              <label>{profesor.nombre}</label>

              <div className="mt-2">
                <h5>Educación</h5>
                {profesor.educacion ? (
                  profesor.educacion.map((edu) => (
                    <EtiquetaGalardones texto={edu} key={edu} />
                  ))
                ) : (
                  <p>Cargando educación...</p>
                )}
              </div>

              <div className="mt-2">
                <h5>Experiencia</h5>

                {profesor.experiencia ? (
                  profesor.experiencia.map((exp) => (
                    <EtiquetaGalardones texto={exp} key={exp} />
                  ))
                ) : (
                  <p>Cargando experiencia...</p>
                )}
              </div>

              <div className="mt-2">
                <h5>Más información</h5>
                <BotonCrear
                  texto="Ver perfil"
                  onClick={() => manejarInfoDocente}></BotonCrear>
              </div>
            </Container>
          </Col>
          {clase !== undefined && (
            <Col>
              <HorarioClase
                turnos={clase.turnos}
                key={clase.idPublico}
                idClase={clase.idPublico}
                idProfesor={clase.idProfesor}
              />
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default Clase;
