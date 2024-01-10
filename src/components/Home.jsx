import Container from "react-bootstrap/esm/Container";

import "../css/home.css";
import { API_KEY } from "../javascript/api";
import { NAV_KEY } from "../javascript/api";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import clase_logo from "../images/clase-logo.webp";
import turno_logo from "../images/turno-logo.webp";
import { EtiquetaAsignatura } from "./Etiqueta";
import { BotonCrear } from "./Botones";
import FormularioModificarClase from "./Formularios/FormularioModificarClase";
import Alerta from "./Alerta";
import InformacionDocente from "./InformacionDocente";
import { valorEstrellas } from "../javascript/transformaciones";

const Home = () => {
  const token = Cookies.get("token");

  const tokenDecodificado = token ? jwtDecode(token) : undefined;

  if (token === undefined) {
    window.location.href = NAV_KEY + "/";
  }

  const [usuario, setUsuario] = useState(undefined);
  const [clase, setClase] = useState(undefined);
  const [clasesApuntadas, setClasesApuntadas] = useState(undefined);
  const [comentarios, setComentarios] = useState(undefined);
  useEffect(() => {
    fetch(API_KEY + "/usuario/" + tokenDecodificado.idPublico)
      .then((response) => response.json())
      .then((_usuario) => {
        setUsuario(_usuario);
        const promesas = _usuario.comentarios.map((comentario) =>
          fetch(
            API_KEY +
              "/valoracion/" +
              comentario +
              "/autor/" +
              _usuario.idPublico
          )
            .then((response) => response.json())
            .then((datos) => {
              return { comentario: datos, idClase: comentario };
            })
        );

        Promise.all(promesas).then((datos) => {
          setComentarios(datos);
        });

        if (_usuario.role === "alumno" && _usuario.turnos.length > 0) {
          fetch(API_KEY + "/clase/turnos/" + _usuario.idPublico)
            .then((response) => {
              if (response.status === 404) {
                setClasesApuntadas([]);
              } else if (response.status === 200) return response.json();
            })
            .then((datos) => {
              setClasesApuntadas(datos);
            });
        } else if (_usuario.role === "docente") {
          if (!_usuario.clase) return;
          fetch(API_KEY + "/clase/" + _usuario.clase)
            .then((response) => response.json())
            .then((_clase) => {
              setClase(_clase);
            });
        }
      });
  }, [tokenDecodificado.idPublico]);

  const [creandoClase, setCreandoClase] = useState(false);
  const [isRespuesta, setRespuesta] = useState(false);
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

      fetch("http://localhost:3001/clase", {
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
          fetch("http://localhost:3001/usuario/" + usuario.idPublico, {
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
              window.location.href =
                "http://localhost:3000/clase/" + user.clase;
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

  return (
    <Container className={"mt-5 mb-5"}>
      <div>
        <h1>Tu sitio</h1>
        <hr></hr>
      </div>
      {tokenDecodificado && tokenDecodificado.role === "alumno" && (
        <div>
          {usuario &&
            usuario.turnos.length > 0 &&
            clasesApuntadas &&
            clasesApuntadas.length > 0 && (
              <div>
                <h3 className="mb-3">Turnos en los que estás apuntado</h3>
                <label className="subtitulo mt-3">
                  Pulsa encima de cada panel para ver la clase.
                </label>
                <div className="grid-turnos">
                  {clasesApuntadas.map((clase) => {
                    const turnos = clase.turnos.filter((turno) =>
                      usuario.turnos.includes(turno.idPublico)
                    );

                    return turnos.map((turno, index) => (
                      <a
                        key={index + clase.idPublico}
                        href={NAV_KEY + "/clase/" + clase.idPublico}
                        className="boton-turno mb-3">
                        <div>
                          <div style={{ display: "flex", gap: "5px" }}>
                            <label className="etiqueta-info-turno">Dia:</label>
                            <label>{turno.dia}</label>
                          </div>
                          <div style={{ display: "flex", gap: "5px" }}>
                            {" "}
                            <label className="etiqueta-info-turno">Hora:</label>
                            <label>{turno.horaInicio}</label>
                            <label>-</label>
                            <label>{turno.horaFin}</label>
                          </div>
                          <div style={{ display: "flex", gap: "5px" }}>
                            <label className="etiqueta-info-turno">
                              Ubicación:
                            </label>
                            <label>{clase.ubicacion}</label>
                          </div>

                          <EtiquetaAsignatura
                            texto={turno.asignatura}
                            key={index + clase.idPublico}
                          />
                        </div>
                        <img src={turno_logo} alt="logo" />
                      </a>
                    ));
                  })}
                </div>
              </div>
            )}
          {usuario && usuario.turnos.length === 0 && (
            <Container className="no-clase-usuario">
              <h3 className="rotulo-1">
                Aún no has te has apuntado a ninguna clase
              </h3>
              <h3 className="rotulo-2">¡Encuéntrala!</h3>
              <div style={{ width: "250px" }} className="mt-3">
                <BotonCrear
                  texto="Buscar clases"
                  onClick={() => (window.location.href = NAV_KEY + "/clases")}
                />
              </div>
            </Container>
          )}

          {usuario &&
            usuario.turnos.length > 0 &&
            usuario.comentarios.length === 0 && (
              <Container className="no-clase-usuario">
                <h3 className="rotulo-1">Aún no has comentado ninguna clase</h3>
                <h3 className="rotulo-2">¡Comparte tu experiencia!</h3>
                <div style={{ width: "250px" }} className="mt-3"></div>
              </Container>
            )}
        </div>
      )}

      {tokenDecodificado && tokenDecodificado.role === "docente" && (
        <div>
          <h3 className="mb-3">Tu clase particular</h3>
          {usuario && clase && (
            <div>
              <a
                href={NAV_KEY + "/clase/" + usuario.clase}
                className="boton-grande">
                <div>
                  <label className="etiqueta-titulo">{clase.nombre}</label>
                  <div className="descripcion">{clase.descripcion}</div>
                  <hr></hr>
                  {clase.asignaturas &&
                    clase.asignaturas.map((asignatura, index) => (
                      <EtiquetaAsignatura texto={asignatura} key={index} />
                    ))}
                </div>
                <img src={clase_logo} alt="logo" />
              </a>
              <label className="subtitulo mt-3">
                Pulsa encima del panel para ver tu clase.
              </label>
            </div>
          )}
          {/* Alerta con el mensaje de error durante el proceso de modificación*/}
          {isRespuesta && (
            <Alerta
              tipo={isRespuesta.tipo}
              mensaje={isRespuesta.mensaje}></Alerta>
          )}
          {usuario && !clase && !creandoClase && (
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

          {usuario && !clase && creandoClase && (
            <div className="modificar-clase">
              <FormularioModificarClase
                clase={{}}
                nuevo={true}
                onCompletado={manejarCreadoClase}
              />
            </div>
          )}
        </div>
      )}

      {/*Independientemente del rol, se muestran los comentarios */}
      {usuario && usuario.comentarios.length > 0 && comentarios && (
        <div>
          <h3 className="mb-3 mt-5">Tus comentarios</h3>
          <label className="subtitulo mt-3">
            Pulsa encima de cada panel para ver la clase.
          </label>
          <div className="grid-turnos">
            {comentarios.map((comentario, index) => (
              <a
                key={index}
                href={NAV_KEY + "/clase/" + comentario.idClase}
                className="boton-comentario mb-3">
                {valorEstrellas(comentario.comentario.calificacion)}
                <p className="comentario-mensaje mt-2">
                  {comentario.comentario.mensaje}
                </p>
              </a>
            ))}
          </div>
        </div>
      )}

      {usuario && usuario.role === "docente" && <InformacionDocente />}
      {usuario &&
        usuario.role === "alumno" &&
        usuario.comentarios.length === 0 && (
          <div style={{ height: "600px" }}></div>
        )}
    </Container>
  );
};

export default Home;
