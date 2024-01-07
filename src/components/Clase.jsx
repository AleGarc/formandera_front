import { useState, useEffect } from "react";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useParams } from "react-router-dom";
import { EtiquetaAsignatura, EtiquetaGalardones } from "./Etiqueta";
import "../css/clase.css";
import { BotonCancelar, BotonCrear, BotonPeticion } from "./Botones";
import HorarioClase from "./HorarioClase";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { FormularioModificarClase } from "./Formularios";
import Alerta from "./Alerta";
import Modal from "react-bootstrap/Modal";
import Valoracion from "./Valoracion";

const Clase = () => {
  const idClase = useParams().id;
  const [clase, setClase] = useState(undefined);
  const [profesor, setProfesor] = useState({});
  const [errorClase, setErrorClase] = useState(false);

  //Efecto para obtener la clase y el profesor de la clase.
  useEffect(() => {
    fetch("http://localhost:3001/clase/" + idClase)
      .then((response) => {
        if (response.status === 404) {
          setErrorClase(true);
          throw new Error("Error en la petición");
        } else return response.json();
      })
      .then((data) => {
        setClase(data);
        return fetch("http://localhost:3001/usuario/" + data.idProfesor);
      })
      .then((response) => response.json())
      .then((data) => setProfesor(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [idClase, errorClase]);

  //Para manejar la redirección al perfil del docente.
  const manejarInfoDocente = () => {
    window.location.href =
      "http://localhost:3000/docente/" + profesor.idPublico;
  };

  //Para obtener el token decodificado del usuario.
  //Comprobamos si el usuario es el docente de la clase.
  const token = Cookies.get("token");
  let tokenDecodificado = undefined;
  let docenteDeClase = false;
  if (token) {
    tokenDecodificado = jwtDecode(token);
    docenteDeClase =
      profesor.idPublico === tokenDecodificado.idPublico &&
      tokenDecodificado.role === "docente";
  }

  //Para manejar la modificación de la clase.
  const [modificando, setModificando] = useState(false);

  const manejarModificandoClase = () => {
    setModificando(true);
    setRespuesta(false);
  };

  //Para manejo de errores mostrando alerta. (Modificación de clase)
  const [isRespuesta, setRespuesta] = useState(false);

  //Si el método recibe null se habrá cancelado el proceso. En caso contrario
  //se hace una petición PATCH para modificar la clase.
  const manejarModificarClase = (datos) => {
    if (datos === null) {
      setModificando(false);
      return;
    } else {
      fetch("http://localhost:3001/clase/" + idClase, {
        method: "PATCH",
        body: JSON.stringify(datos),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (
            response.status === 400 ||
            response.status === 404 ||
            response.status === 401
          ) {
            setRespuesta({
              tipo: "danger",
              mensaje:
                "Hubo un error durante su petición. Inténtelo de nuevo más tarde.",
            });
            throw new Error("Error en la petición");
          } else return response.json();
        })
        .then((datos) => {
          setRespuesta({
            tipo: "success",
            mensaje: "Clase modificada con éxito.",
          });

          //Finalizamos el estado de modificación y actualizamos la clase.
          setModificando(false);
          setClase(datos);
        })
        .catch((error) => {
          setRespuesta({
            tipo: "danger",
            mensaje:
              "Hubo un error durante su petición. Inténtelo de nuevo más tarde.",
          });
          console.error(error);
        });
    }
  };

  //Para manejar el borrado de la clase.
  const [errorBorrado, setErrorBorrado] = useState(false);

  //Si existe almenos un alumno inscrito en los turnos
  //de la clase no se podrá borrar.
  const manejarBorrarClase = async () => {
    setErrorBorrado(false);

    const claseRecuperada = await fetch(
      "http://localhost:3001/clase/" + idClase
    )
      .then((response) => response.json())
      .then((clase) => {
        return clase;
      })
      .catch((error) => console.error("Hubo un error en la peticion", error));

    const exitenInscritos = claseRecuperada.turnos.find(
      (turno) => turno.idAlumnos.length > 0
    );
    if (exitenInscritos) {
      setErrorBorrado({
        tipo: "danger",
        mensaje:
          "No se puede borrar la clase porque hay alumnos inscritos en ella.",
      });
    } else {
      handleShow();
    }
  };

  //Confirmación por popup del borrado. Petición DELETE.
  //Si la petición es correcta se redirige al home.
  const manejarBorradoConfirmado = () => {
    fetch("http://localhost:3001/clase/" + idClase, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (response.status === 404) {
          throw new Error("Error en la petición");
        } else window.location.href = "http://localhost:3000/home";
      })
      .catch((error) => {
        setErrorBorrado({
          tipo: "danger",
          mensaje:
            "Hubo un error durante su petición. Inténtelo de nuevo más tarde.",
        });
        console.error(error);
      });
  };

  //Estados y funciones para manejar el popup de confirmación de borrado.
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  if (!clase && !errorClase) return <p>Cargando...</p>;
  return (
    <div>
      {!errorClase && (
        <Container className={"mt-5 mb-5"}>
          <div>
            <h1>{clase.nombre}</h1>
            <hr></hr>
          </div>
          {/*Popup de confirmación de borrado */}
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Borrar clase</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              ¿Estás seguro que quieres borrar tu clase? Esta acción es
              permanente.
            </Modal.Body>
            <Modal.Footer>
              <div style={{ display: "flex", gap: "10px" }}>
                <BotonCancelar texto="Cancelar" onClick={handleClose} />
                <BotonPeticion
                  texto="Continuar"
                  onClick={manejarBorradoConfirmado}
                />
              </div>
            </Modal.Footer>
          </Modal>

          {/* Datos de la clase*/}
          <Row>
            <Col sm={12} lg={8} className="mb-5">
              <Container id="datos-clase" fluid className="contenedor-fluid">
                {/* Descripción */}
                <div className="mb-5">
                  <div className="descripcion-clase">{clase.descripcion}</div>
                </div>
                <div className="detalles-clase">
                  <Row className="mb-3 ">
                    <Col sm={12} md={6}>
                      <h3>Precio</h3>
                      <label className="etiqueta-precio">
                        {clase.precio ? clase.precio + " €/h" : "Negociable"}
                      </label>
                    </Col>
                    <Col sm={12} md={6}>
                      <h3>Ubicación</h3>
                      <label className="etiqueta-precio">
                        {clase.ubicacion}
                      </label>
                    </Col>
                  </Row>
                  {/* Mostrado de asignaturas mediante etiquetas */}
                  <Container className="contenedor-fluid">
                    <h3>Asignaturas</h3>
                    {clase.asignaturas ? (
                      clase.asignaturas.map((asignatura) => (
                        <EtiquetaAsignatura
                          texto={asignatura}
                          key={asignatura}
                        />
                      ))
                    ) : (
                      <p>Cargando asignaturas...</p>
                    )}
                  </Container>
                </div>
              </Container>
            </Col>
            {/* Información del docente */}
            <Col sm={12} lg={4} className="mb-5">
              <Container
                id="datos-profesor"
                fluid
                className="contenedor-fluid-2">
                <h3>Docente</h3>
                <label>{profesor.nombre}</label>

                <div className="mt-2">
                  <h5>Educación</h5>
                  {/* Mostrado de educación con etiquetas */}
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
                  {/* Mostrado de experiencia con etiquetas */}
                  {profesor.experiencia ? (
                    profesor.experiencia.map((exp) => (
                      <EtiquetaGalardones texto={exp} key={exp} />
                    ))
                  ) : (
                    <p>Cargando experiencia...</p>
                  )}
                </div>

                {/* Botón para ver el perfil del docente*/}
                <div className="mt-2">
                  <h5>Más información</h5>
                  <BotonCrear
                    texto="Ver perfil"
                    onClick={() => manejarInfoDocente()}></BotonCrear>
                </div>
              </Container>

              {/* Si el usuario es el docente de esta clase se muestran todas las acciones*/}
              {docenteDeClase && (
                <Container
                  id="datos-profesor"
                  fluid
                  className="contenedor-fluid-3 mt-3">
                  <h3>Acciones</h3>
                  <hr></hr>
                  <div className="mb-2">
                    <BotonCrear
                      texto="Modificar clase"
                      onClick={manejarModificandoClase}
                    />
                  </div>
                  <BotonCancelar
                    texto="Borrar clase"
                    onClick={() => manejarBorrarClase()}
                  />
                  {/*Si no se pudo borrar la clase se muestra una alerta. */}
                  {errorBorrado && (
                    <div className="mt-3">
                      <Alerta
                        tipo={errorBorrado.tipo}
                        mensaje={errorBorrado.mensaje}></Alerta>
                    </div>
                  )}
                </Container>
              )}
            </Col>
          </Row>
          {/* Alerta con el mensaje de error durante el proceso de modificación*/}
          {isRespuesta && (
            <Alerta
              tipo={isRespuesta.tipo}
              mensaje={isRespuesta.mensaje}></Alerta>
          )}
          {/* Formulario de modificación */}
          {modificando && (
            <div className="modificar-clase mb-5">
              <FormularioModificarClase
                clase={clase}
                onCompletado={manejarModificarClase}
              />
            </div>
          )}
          {/* Horario de la clase */}
          {clase !== undefined && (
            <Row>
              <HorarioClase
                turnos={clase.turnos}
                key={clase.idPublico}
                idClase={clase.idPublico}
                idProfesor={clase.idProfesor}
              />
            </Row>
          )}
          {/* Valoración de la clase */}
          <Valoracion idClase={clase.idPublico} />
        </Container>
      )}

      {/* En caso de introducir por url el id de una clase inexistente se muestra error*/}
      {errorClase && (
        <Container
          style={{
            height: "700px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <h1>La clase buscada no ha sido encontrada</h1>
        </Container>
      )}
    </div>
  );
};

export default Clase;
