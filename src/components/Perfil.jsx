import { useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import { useParams } from "react-router-dom";
import { BotonCancelar, BotonCrear, BotonPeticion } from "./Botones";
import Modal from "react-bootstrap/Modal";
import { EtiquetaAsignatura, EtiquetaGalardones } from "./Etiqueta";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Alerta from "./Alerta";
import FormularioAlumno from "./Formularios/FormularioAlumno";
import FormularioDocente from "./Formularios/FormularioDocente";
import FormularioModificarClase from "./Formularios/FormularioModificarClase";
import FormularioModificarUsuario from "./Formularios/FormularioModificarUsuario";
import "../css/perfil.css";
import { API_KEY } from "../javascript/api";
import { NAV_KEY } from "../javascript/api";

const Perfil = () => {
  const [usuario, setUsuario] = useState({});

  //Para controlar si el usuario buscado existe o no.
  const [errorUsuario, setErrorUsuario] = useState(false);

  //Estado para el control de datos del usuario según su rol.
  const [docente, setDocente] = useState(false);
  const idUsuario = useParams().id;

  //Petición GET para obtener los datos del usuario.
  useEffect(() => {
    fetch(`${API_KEY}/usuario/${idUsuario}`)
      .then((res) => {
        if (res.status === 404) {
          setErrorUsuario(true);
          throw new Error("Usuario no encontrado");
        } else return res.json();
      })
      .then((data) => {
        setUsuario(data);
        if (data.role === "docente") setDocente(true);
      })
      .catch((err) => {
        setErrorUsuario(true);
        console.log(err);
      });
  }, [idUsuario]);

  //Obtención del token decodificado y si el usuario identificado
  // es el mismo que el usuario buscado.
  const token = Cookies.get("token");
  let tokenDecodificado = undefined;
  let usuarioIdentificado = false;
  if (token) {
    tokenDecodificado = jwtDecode(token);
    usuarioIdentificado = usuario.idPublico === tokenDecodificado.idPublico;
  }

  //Para manejo de errores mostrando alerta.
  const [isRespuesta, setRespuesta] = useState(false);

  //Función para manejar la creación de una clase.
  const [isCreandoClase, setCreandoClase] = useState(false);
  const manejarCreadoClase = (datos) => {
    if (datos === null) {
      setCreandoClase(false);
      setRespuesta(false);
      return;
    } else {
      const clase = {
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        ubicacion: datos.ubicacion,
        precio: datos.precio,
        idProfesor: usuario.idPublico,
        asignaturas: datos.asignaturas,
      };

      fetch(API_KEY + "/clase", {
        method: "POST",
        body: JSON.stringify(clase),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.status === 409) {
            setRespuesta({
              tipo: "danger",
              mensaje: "Usted ya tiene una clase creada.",
            });
            throw new Error("Error en la petición");
          } else if (response.status === 201) {
            return response.json();
          }
        })
        .then((datos) => {
          //Si la clase ha sido creada satisfactoriamente, se actualiza el usuario
          //para almacenar el id de la clase creada.
          const usuarioActualizado = usuario;
          usuarioActualizado.clase = datos.idPublico;
          fetch(API_KEY + "/usuario/" + usuario.idPublico, {
            method: "PATCH",
            body: JSON.stringify(usuarioActualizado),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
            .then((response) => {
              if (response.status === 404) {
                throw new Error("Error en la petición");
              } else if (response.status === 401) {
                throw new Error("Error en la petición");
              } else return response.json();
            })
            .then((user) => {
              //Una vez finalizado, se redirecciona a la página de la clase creada.
              window.location.href = NAV_KEY + "/clase/" + user.clase;
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  //Función para manejar la modificación de los datos del usuario.
  const [modificando, setModificando] = useState(false);
  const [errorUsuarioModificacion, setErrorUsuarioModificacion] = useState("");

  //Establecimiento del estado de modificación a true para mostrar
  //el formulario de modificación.
  const manejarModificando = () => {
    setModificando(true);
    setErrorUsuarioModificacion(false);
  };

  //Recuperación de los datos del formulario de modificación y petición PATCH.
  const manejarModificado = (datos) => {
    if (datos === null) {
      setModificando(false);
      setErrorUsuarioModificacion(false);
      return;
    } else {
      fetch(API_KEY + "/usuario/" + usuario.idPublico, {
        method: "PATCH",
        body: JSON.stringify(datos),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then(async (response) => {
          if (response.status === 404) {
            setErrorUsuarioModificacion("Error en la petición");
            throw new Error("Error en la petición");
          } else if (response.status === 401) {
            setErrorUsuarioModificacion("Error en la petición");
            throw new Error("Error en la petición");
          } else if (response.status === 409) {
            const respuesta = await response.json();
            console.log();
            setErrorUsuarioModificacion(respuesta.message);
            throw new Error("Error en la petición");
          } else return response.json();
        })
        .then((user) => {
          //Si la modificación ha sido satisfactoria, se actualiza el usuario
          setUsuario(user);
          setModificando(false);
          setErrorUsuarioModificacion(false);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  //Confirmación por popup del borrado. Petición DELETE.
  //Si la petición es correcta se redirige a la página de logout.
  const manejarBorradoConfirmado = () => {
    fetch(API_KEY + "/usuario/" + usuario.idPublico, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (response.status === 404) {
          throw new Error("Error en la petición");
        } else window.location.href = NAV_KEY + "/logout";
      })
      .catch((error) => {
        console.error(error);
      });
  };

  //Función para manejar la redirección a la página de la clase del docente.
  const manejarVerClase = () => {
    if (usuario.role === "docente")
      window.location.href = NAV_KEY + "/clase/" + usuario.clase;
    else {
      setErrorUsuarioModificacion("No tienes una clase creada");
    }
  };

  //Estado para manejar la modificación de datos extra del docente.
  const [modificandoDocente, setModificandoDocente] = useState(false);

  //Estado para manejar la modificación de datos extra del alumno.
  const [modificandoAlumno, setModificandoAlumno] = useState(false);

  //La modificaciones extra se realiza en dos formularios distintos
  //pero comparten los dos mismos manejadores.

  //Establecimiento del estado de modificación a true para mostrar
  //el formulario de modificación.
  const manejarModificadoExtra = () => {
    if (docente) {
      setModificandoDocente(true);
    } else {
      setModificandoAlumno(true);
    }
  };

  //Recuperación de los datos del formulario de modificación y petición PATCH.
  const manejarModificadoExtraCompletado = (datos) => {
    if (datos === null) {
      setModificandoDocente(false);
      setModificandoAlumno(false);
      return;
    } else {
      setModificandoDocente(false);
      setModificandoAlumno(false);
      fetch(API_KEY + "/usuario/" + usuario.idPublico, {
        method: "PATCH",
        body: JSON.stringify(datos),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.status === 404) {
            setErrorUsuarioModificacion("Error en la petición");
            throw new Error("Error en la petición");
          } else if (response.status === 401) {
            setErrorUsuarioModificacion("Error en la petición");
            throw new Error("Error en la petición");
          } else return response.json();
        })
        .then((user) => {
          setUsuario(user);
        });
    }
  };

  //Estados y funciones para manejar el popup de confirmación de borrado.
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      {!errorUsuario && usuario && (
        <Container className={"mt-5 mb-5"}>
          <Row>
            <Col sm={12} md={8}>
              <h1>{usuario.nombre}</h1>
            </Col>
            {/* Si el usuario identificado es el mismo que el buscado, se muestran*/}
            {/* Las opciones de modificado y borrado*/}
            {usuarioIdentificado && (
              <Col sm={12} md={2}>
                <BotonCrear texto="Modificar" onClick={manejarModificando} />
              </Col>
            )}
            {usuarioIdentificado && (
              <Col sm={12} md={2}>
                <BotonCancelar texto="Borrar" onClick={handleShow} />
              </Col>
            )}
            <hr></hr>
          </Row>
          {/* Si se está modificando los datos básicos se muestra el formulario */}
          {modificando && (
            <div className="datos-usuario mb-4">
              <FormularioModificarUsuario
                usuario={usuario}
                onCompletado={manejarModificado}
              />
            </div>
          )}

          {/* Si se está modificando los datos extra del docente se muestra el formulario*/}
          {modificandoDocente && (
            <div className="datos-usuario mb-4">
              <FormularioDocente
                docente={usuario}
                onCompletado={manejarModificadoExtraCompletado}
              />
            </div>
          )}

          {/* Si se está modificando los datos extra del alumno se muestra el formulario*/}
          {modificandoAlumno && (
            <div className="datos-usuario mb-4">
              <FormularioAlumno
                alumno={usuario}
                onCompletado={manejarModificadoExtraCompletado}
              />
            </div>
          )}

          {/* Si ocurre un error durante la modificación se muestra el mensaje de error*/}
          {errorUsuarioModificacion && (
            <Alerta tipo={"danger"} mensaje={errorUsuarioModificacion}></Alerta>
          )}

          {/*Popup de confirmación de borrado */}
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Borrar usuario</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              ¿Estás seguro que quieres borrar tu usuario? Esta acción es
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

          {/* Datos básicos del usuario*/}
          <Row>
            <Col sm={12} lg={8} className="mb-5">
              <Container id="datos-usuario" fluid className="datos-usuario">
                <div className="mb-3">
                  <h3>Nombre de usuario</h3>
                  <p>{usuario.username}</p>
                </div>
                {/* Biografía */}
                {usuario.biografia && (
                  <div className="mb-3">
                    <h3>Biografía</h3>
                    <div className="biografia-usuario">{usuario.biografia}</div>
                  </div>
                )}
              </Container>

              {/* Si el usuario identificado es el mismo que el buscado*/}
              {/* y además es un docente con clase, se muestra el botón para ver la clase.*/}
              {usuarioIdentificado && docente && usuario.clase && (
                <div
                  className="mt-3
                ">
                  <BotonCrear
                    texto="Ver tu clase"
                    onClick={() => manejarVerClase()}
                  />
                </div>
              )}
            </Col>
            {/* Información extra del docente */}
            {docente ? (
              <Col sm={12} lg={4} className="mb-5">
                <Container
                  id="datos-profesor"
                  fluid
                  className="contenedor-fluid-2">
                  <div className="mb-4">
                    <h3>Formación</h3>
                    <hr />
                    {/* Mostrado de educación con etiquetas */}
                    {usuario.educacion.length > 0 ? (
                      usuario.educacion.map((edu) => (
                        <EtiquetaGalardones texto={edu} key={edu} />
                      ))
                    ) : (
                      <p>Ninguna</p>
                    )}
                  </div>
                  <h3>Experiencia</h3>
                  <hr />

                  {/* Mostrado de experiencia con etiquetas */}
                  {usuario.experiencia.length > 0 ? (
                    usuario.experiencia.map((exp) => (
                      <EtiquetaGalardones texto={exp} key={exp} />
                    ))
                  ) : (
                    <p>Ninguna</p>
                  )}
                </Container>
                {/*Asignaturas del docente */}
                <Container
                  id="datos-profesor"
                  fluid
                  className="contenedor-fluid-2 mt-3">
                  <h3>Asignaturas</h3>
                  <hr></hr>
                  {usuario.asignaturas.length > 0 ? (
                    usuario.asignaturas.map((asignatura) => (
                      <EtiquetaAsignatura texto={asignatura} key={asignatura} />
                    ))
                  ) : (
                    <p>Ninguna</p>
                  )}
                </Container>
                {/* Si el usuario identificado es el mismo, se permite modificar*/}
                {/* los datos extra.*/}
                {usuarioIdentificado && (
                  <div className="mt-3">
                    <BotonCrear
                      texto="Modificar"
                      onClick={() => manejarModificadoExtra()}
                    />
                  </div>
                )}
              </Col>
            ) : (
              <Col sm={12} lg={4} className="mb-5">
                {/* Información extra del alumno */}
                <Container
                  id="datos-alumno"
                  fluid
                  className="contenedor-fluid-2">
                  <div className="mb-4">
                    <h3>Curso académico</h3>
                    <hr />
                    {usuario.curso_academico ? (
                      <EtiquetaGalardones
                        texto={usuario.curso_academico}
                        key={usuario.curso_academico}
                      />
                    ) : (
                      <p>No especificado</p>
                    )}
                  </div>
                </Container>

                {/* Si el usuario es el mismo, se permite modificar */}
                {usuarioIdentificado && (
                  <div className="mt-3">
                    <BotonCrear
                      texto="Modificar"
                      onClick={() => manejarModificadoExtra()}
                    />
                  </div>
                )}
              </Col>
            )}
          </Row>

          {/* Alerta con el mensaje de error durante el proceso de modificación*/}
          {isRespuesta && (
            <Alerta
              tipo={isRespuesta.tipo}
              mensaje={isRespuesta.mensaje}></Alerta>
          )}
          {/* Cuadro de diálogo cuando el docente no tiene una clase.  */}
          {docente &&
            !usuario.clase &&
            usuarioIdentificado &&
            !isCreandoClase && (
              <Container className="no-clase-usuario">
                <h3 className="rotulo-1">Aún no has creado tu clase</h3>
                <h3 className="rotulo-2">¡Empieza a enseñar!</h3>
                <div style={{ width: "250px" }} className="mt-3">
                  <BotonCrear
                    texto="Crear clase"
                    onClick={() => setCreandoClase(true)}
                  />
                </div>
              </Container>
            )}

          {/* Formulario de creación de clase */}
          {docente &&
            !usuario.clase &&
            usuarioIdentificado &&
            isCreandoClase && (
              <div className="modificar-clase">
                <FormularioModificarClase
                  clase={{}}
                  nuevo={true}
                  onCompletado={manejarCreadoClase}
                />
              </div>
            )}
        </Container>
      )}
      {/* Si no se encuentra el usuario buscado se muestra*/}
      {errorUsuario && (
        <Container
          style={{
            height: "700px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <h1>El usuario buscado no ha sido encontrado</h1>
        </Container>
      )}
    </div>
  );
};

export default Perfil;
