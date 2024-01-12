import { useEffect, useState } from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { valorEstrellas } from "../javascript/transformaciones";
import { BotonCancelar, BotonCrear, BotonPeticion } from "./Botones";
import FormularioComentario from "./Formularios/FormularioComentario";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

import Modal from "react-bootstrap/Modal";

// Componente que representa una opinión
const Opinion = ({
  nombre,
  calificacion,
  mensaje,
  autor,
  onClick,
  onBorrado,
}) => {
  //Si la opinión es del autor, se le añade un estilo diferente
  const estiloOpinion = autor ? "opinion-autor" : "opinion";

  return (
    <div className={estiloOpinion}>
      <Row>
        {/* Nombre del autor */}
        <Col xs={12} lg={8} className="columna-opinion">
          <div
            style={{
              display: "flex",
              gap: "30px",
              alignItems: "center",
              wordBreak: "break-word",
            }}>
            <h4>{nombre}</h4>
          </div>
        </Col>
        {/* Calificación con estrellas */}
        <Col
          xs={12}
          lg={4}
          className="columna-opinion"
          style={{ display: "flex", justifyContent: "end" }}>
          <div id="calificacion">{valorEstrellas(calificacion)}</div>
        </Col>
        {/* Acciones disponibles si es el autor de la opinión*/}
        <Col
          xs={12}
          lg={12}
          className="columna-opinion"
          style={{ display: "flex", justifyContent: "initial" }}>
          {autor && (
            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{ display: "inline" }}>
                <BotonCrear texto="Modificar" onClick={onClick} />
              </div>
              <div style={{ display: "inline" }}>
                <BotonCancelar texto="Borrar" onClick={onBorrado} />
              </div>
            </div>
          )}
        </Col>
      </Row>
      <hr></hr>
      {/* Mensaje de la opinión*/}
      <div style={{ whiteSpace: "pre-line", wordWrap: "break-word" }}>
        {mensaje}
      </div>
    </div>
  );
};

// Componente que representa la valoración de una clase
const Valoracion = ({ idClase }) => {
  //Estado y efecto para obtener la valoración de la clase
  const [valoracion, setValoracion] = useState(null);
  const [isComentarios, setIsComentarios] = useState(false);
  useEffect(() => {
    fetch("http://localhost:3001/valoracion/" + idClase)
      .then((res) => res.json())
      .then((res) => {
        setValoracion(res);
        if (res.comentarios.length > 0) {
          setIsComentarios(true);
        }
      })
      .catch((err) => console.log(err));
  }, [idClase]);

  //Obtener el token del usuario
  const token = Cookies.get("token");
  let tokenDecodificado = undefined;
  if (token) tokenDecodificado = jwtDecode(token);

  //Estados para controlar el formulario de nuevo comentario y el de modificación
  const [isCreandoComentario, setIsCreandoComentario] = useState(false);
  const [isModificandoComentario, setIsModificandoComentario] = useState(false);

  //Función que se ejecuta cuando se envía el formulario de nuevo comentario.
  //Si se recibe null, se cierra el formulario.
  const manejarNuevoComentario = (data) => {
    if (data === null) setIsCreandoComentario(false);
    else {
      const comentario = {
        idAutor: tokenDecodificado.idPublico,
        nombreAutor: data.nombre,
        calificacion: Number(data.calificacion),
        mensaje: data.mensaje,
      };
      fetch("http://localhost:3001/valoracion/" + idClase + "/comentarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(comentario),
      })
        .then((res) => {
          if (res.status === 404) {
            throw new Error("No se ha encontrado la clase.");
          } else if (res.status === 409) {
            throw new Error("Ya has comentado esta clase.");
          } else return res.json();
        })
        .then((datos) => {
          //Se actualiza la valoración y la variable de control de comentarios
          setValoracion(datos);
          setIsComentarios(true);
          //Se cierra el formulario
          setIsCreandoComentario(false);

          // Se añade el comentario a la lista del usuario
          fetch(
            "http://localhost:3001/usuario/" +
              tokenDecodificado.idPublico +
              "/comentarios",
            {
              method: "POST",
              body: JSON.stringify({ idComentario: idClase }),
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          )
            .then((res) => {
              if (res.status === 404)
                throw new Error("No se ha encontrado el usuario.");
              else if (res.status === 409)
                throw new Error("Ya has comentado esta clase.");
              else return;
            })
            .catch((err) => console.log(err));
        })

        .catch((err) => console.log(err));
    }
  };

  //Estado para controlar el comentario que se está modificando
  const [comentario, setComentario] = useState(null);

  const manejarModificarComentario = (comentario) => {
    setIsModificandoComentario(true);
    setComentario(comentario);
  };

  //Función que se ejecuta cuando se envía el formulario de modificación de comentario.
  //Si se recibe null, se cierra el formulario.
  const manejarComentarioModificado = (data) => {
    if (data === null) setIsModificandoComentario(false);
    else {
      const comentario = {
        idAutor: tokenDecodificado.idPublico,
        nombreAutor: data.nombre,
        calificacion: Number(data.calificacion),
        mensaje: data.mensaje,
      };

      fetch(
        "http://localhost:3001/valoracion/" +
          idClase +
          "/comentarios/" +
          tokenDecodificado.idPublico,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(comentario),
        }
      )
        .then((res) => {
          if (res.status === 404) {
            throw new Error("No se ha encontrado la clase.");
          } else {
            return res.json();
          }
        })
        .then((datos) => {
          setValoracion(datos);
          setIsModificandoComentario(false);
        })
        .catch((err) => console.log(err));
    }
  };

  //Estado y funciones para controlar el popup de confirmación de borrado
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //Selección de comentario a borrar y mostrar pop-up
  const manejarBorrado = (comentario) => {
    setComentario(comentario);
    handleShow();
  };

  //Función que se ejecuta cuando se confirma el borrado de un comentario
  const manejarBorradoConfirmado = () => {
    fetch(
      "http://localhost:3001/valoracion/" +
        idClase +
        "/comentarios/" +
        comentario.idAutor,
      { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
    )
      .then((res) => {
        if (res.status === 404) {
          throw new Error("No se ha encontrado la clase.");
        } else {
          return res.json();
        }
      })
      .then((datos) => {
        //Se actualiza la valoración y la variable de control de comentarios
        setValoracion(datos);
        if (datos.comentarios.length === 0) {
          setIsComentarios(false);
        }
        handleClose();

        fetch(
          "http://localhost:3001/usuario/" +
            tokenDecodificado.idPublico +
            "/comentarios/" +
            idClase,
          { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
        )
          .then((res) => {
            if (res.status === 404)
              throw new Error("No se ha encontrado el usuario.");
            else return;
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  if (!valoracion) return <p>Cargando...</p>;
  return (
    <div className="envoltorio-valoracion mt-5">
      {/* pop-up de confirmación de borrado */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Borrar comentario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro que quieres borrar tu comentario? Esta acción es
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
      <Row>
        <Col xs={12} md={6}>
          <div style={{ display: "flex", gap: "30px" }}>
            <h3>Opiniones</h3>
            {/* Si el usuario está logeado, se tiene comentarios y no existe*/}
            {/* uno del usuario se muestra el botón de creación */}
            {token &&
              valoracion.comentarios.length > 0 &&
              !valoracion.comentarios.some(
                (comentario) =>
                  comentario.idAutor === tokenDecodificado.idPublico
              ) && (
                <div style={{ width: "150px" }}>
                  <BotonCrear
                    texto="Opinar"
                    onClick={() => setIsCreandoComentario(true)}
                  />
                </div>
              )}
          </div>
        </Col>
        {/* Si existen comentarios se muestra la calificación*/}
        {/* Se muestra tanto por valor numérico como por estrellas*/}
        {isComentarios && (
          <Col
            xs={12}
            md={6}
            style={{
              display: "flex",
              justifyContent: "end",
            }}>
            <div id="calificacion" className="calificacion">
              {valoracion.puntuacion.toFixed(2)} / 5
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "10px",
              }}
              id="estrellas-calificacion">
              {valorEstrellas(valoracion.puntuacion)}
            </div>
          </Col>
        )}
      </Row>
      <Row>
        {/* Si existen comentarios se muestran*/}
        {isComentarios ? (
          <Col
            sm={12}
            md={isModificandoComentario || isCreandoComentario ? 6 : 12}>
            <div className="valoracion mt-2">
              {/* Ordenamos los comentarios para posicionar (si existe) el del usuario*/}
              {/* logeado al principio*/}
              {valoracion.comentarios
                .sort((a, b) => {
                  if (tokenDecodificado === undefined) return 0;
                  if (a.idAutor === tokenDecodificado.idPublico) return -1;
                  if (b.idAutor === tokenDecodificado.idPublico) return 1;
                  return 0;
                })
                .map((comentario, index) => {
                  return (
                    <Opinion
                      nombre={comentario.nombreAutor}
                      calificacion={comentario.calificacion}
                      mensaje={comentario.mensaje}
                      key={index}
                      autor={
                        tokenDecodificado
                          ? comentario.idAutor === tokenDecodificado.idPublico
                          : false
                      }
                      onClick={() => manejarModificarComentario(comentario)}
                      onBorrado={() => manejarBorrado(comentario)}
                    />
                  );
                })}
            </div>
          </Col>
        ) : (
          <div>
            {/* Si no existen comentarios se muestra este panel informativo*/}
            {!isCreandoComentario && (
              <Col sm={12}>
                <div className="valoracion-sin-comentarios mt-2">
                  <div className="etiqueta-sin-comentarios">
                    <h3>No existen opiniones de esta clase.</h3>
                    <h5 style={{ fontWeight: "normal" }}>
                      ¡Se el primero en comentar!
                    </h5>
                    {token && (
                      <div style={{ width: "200px" }}>
                        <BotonCrear
                          texto="Opinar"
                          onClick={() => setIsCreandoComentario(true)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Col>
            )}
          </div>
        )}
        {/* Si se está creando o modificando un comentario se muestra el formulario*/}
        {(isCreandoComentario || isModificandoComentario) && (
          <Col
            sm={12}
            md={
              isModificandoComentario || (isCreandoComentario && isComentarios)
                ? 6
                : 12
            }>
            <div className="nuevo-comentario mt-2">
              <FormularioComentario
                nombre={tokenDecodificado.nombre}
                nuevo={isCreandoComentario}
                comentario={comentario}
                onCompletado={
                  isCreandoComentario
                    ? manejarNuevoComentario
                    : manejarComentarioModificado
                }
              />
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default Valoracion;
