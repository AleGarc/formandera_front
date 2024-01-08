import Row from "react-bootstrap/esm/Row";
import "../css/horario.css";
import "../css/clase.css";
import Col from "react-bootstrap/esm/Col";
import { BotonCancelar, BotonCrear, BotonPeticion } from "./Botones";
import { useEffect, useState } from "react";
import Alerta from "./Alerta";
import Cookies from "js-cookie";
import FormularioModificarTurno from "./Formularios/FormularioModificarTurno";

const Turno = (props) => {
  let turno = props.turno;
  const [apuntado, setApuntado] = useState(
    turno.idAlumnos.includes(props.idUsuario)
  );

  //Gestión de asistentes
  const [isMostrarAsistentes, setMostrarAsistentes] = useState(false);
  const [asistentes, setAsistentes] = useState([]);
  const [errorAsistentes, setAsistentesError] = useState(false);

  const token = Cookies.get("token");

  // Recuperación de los datos de los alumnos con cada renderizado
  useEffect(() => {
    setAsistentes([]);
    setAsistentesError(false);
    const fetchAlumnoData = async (idAlumno) => {
      try {
        const response = await fetch(
          "http://localhost:3001/usuario/" + idAlumno
        );

        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
      } catch (error) {
        setAsistentesError(true);
      }
    };

    // Utilizamos Promise.all para esperar a que todas las promesas se resuelvan
    Promise.all(
      turno.idAlumnos.map(async (idAlumno) => {
        const data = await fetchAlumnoData(idAlumno);
        return data;
      })
    ).then((asistentesData) => {
      setAsistentes(asistentesData);
    });
  }, [turno]);

  //Expulsión de un alumno de un turno por el docente.
  const manejarExpulsion = (idAlumno) => {
    const idAlumnosRestantes = turno.idAlumnos.filter((id) => id !== idAlumno);
    const turnoModificado = turno;
    turnoModificado.idAlumnos = idAlumnosRestantes;

    //Expulsamos al alumno
    fetch(
      "http://localhost:3001/clase/" +
        props.idClase +
        "/turnos/" +
        turnoModificado.idPublico +
        "/alumnos/" +
        idAlumno,
      { method: "PATCH", headers: { Authorization: "Bearer " + token } }
    )
      .then((response) => {
        if (response.status === 404) console.log("Alumno no encontrado");
        else if (response.status === 400) {
          console.log("El alumno no estaba apuntado");
        } else return response.json();
      })
      .catch((error) => console.log(error));

    //Actualizamos el turno
    fetch(
      "http://localhost:3001/clase/" +
        props.idClase +
        "/turnos/" +
        turnoModificado.idPublico,
      {
        method: "PATCH",
        body: JSON.stringify(turnoModificado),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );

    //Actualización de la lista de asistentes
    const nuevosAsistentes = asistentes.filter(
      (alumno) => alumno.idPublico !== idAlumno
    );
    setAsistentes(nuevosAsistentes);
    if (nuevosAsistentes.length === 0) setMostrarAsistentes(false);
  };

  //Gestión de errores mostrados con la alerta
  const [errorAlerta, setErrorAlerta] = useState("");

  //Apuntado de un alumno en un turno, realizado por un alumno.
  //Si se apunta o se desapunta, se actualizará el alumno
  //para reflejar el estado de los turnos a los que está apuntado.
  const manejarApuntado = (_apuntarse) => {
    const idAlumno = props.idUsuario;
    const idClase = props.idClase;
    const datos = {
      idAlumno: idAlumno,
      apuntarse: _apuntarse,
    };
    setErrorAlerta("");
    fetch(
      "http://localhost:3001/clase/" + idClase + "/turnos/" + turno.idPublico,
      {
        method: "POST",
        body: JSON.stringify(datos),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    )
      .then((response) => {
        if (response.status === 400) {
          //En el caso de recuperar un bad request, el alumno ya estaba apuntado.
          //La otra alternativa no ocurre puesto que solo el alumno se inscribe
          //a sí mismo.
          setErrorAlerta("Ya habias sido expulsado del turno.");
        } else {
          //En el caso de que la petición sea correcta, se actualizan los asistentes
          if (_apuntarse) {
            turno.idAlumnos.push(idAlumno);
            fetch("http://localhost:3001/usuario/" + idAlumno)
              .then((res) => res.json())
              .then((usuario) => {
                usuario.turnos.push(turno.idPublico);
                fetch("http://localhost:3001/usuario/" + idAlumno, {
                  method: "PATCH",
                  body: JSON.stringify(usuario),
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                  },
                }).catch((error) => console.log(error));
              })
              .catch((error) => console.log(error));
          } else {
            const idAlumnosRestantes = turno.idAlumnos.filter(
              (id) => id !== idAlumno
            );
            turno.idAlumnos = idAlumnosRestantes;
            fetch("http://localhost:3001/usuario/" + idAlumno)
              .then((res) => res.json())
              .then((usuario) => {
                usuario.turnos = usuario.turnos.filter(
                  (id) => id !== turno.idPublico
                );
                fetch("http://localhost:3001/usuario/" + idAlumno, {
                  method: "PATCH",
                  body: JSON.stringify(usuario),
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                  },
                }).catch((error) => console.log(error));
              })
              .catch((error) => console.log(error));
          }
          setApuntado(_apuntarse);
        }
      })
      .catch((error) => console.log(error));
  };

  //Modificación de un turno, realizado por un docente.
  const [isModificando, setModificando] = useState(false);

  //Cuando se finaliza de modificar. Si el argumento es null,
  //se cancela la modificación.
  const manejarFinModificacionTurno = (datos) => {
    const idClase = props.idClase;
    const idTurno = turno.idPublico;
    setErrorAlerta("");

    if (datos === null) setModificando(false);
    else {
      fetch("http://localhost:3001/clase/" + idClase + "/turnos/" + idTurno, {
        method: "PATCH",
        body: JSON.stringify(datos),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            window.location.reload();
          } else if (response.status === 400) {
            //Si recibimos unn bad request, el turno se solapa con otro.
            setErrorAlerta("El turno no puede solaparse con los demás.");
          }
        })
        .catch((error) => console.log(error));
    }
  };

  //Borrado de un turno, realizado por un docente.
  const manejarBorradoTurno = () => {
    const idClase = props.idClase;
    const idTurno = turno.idPublico;
    fetch("http://localhost:3001/clase/" + idClase + "/turnos/" + idTurno, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        if (response.status === 204) {
          window.location.reload();
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <div style={{ padding: "0px" }}>
      {/*Alerta de error */}
      {errorAlerta !== "" && (
        <Alerta tipo="danger" mensaje={errorAlerta}></Alerta>
      )}
      <div className="envoltorio-turno">
        {/*Panel de información del turno */}
        <div id="info-turno" className="turno">
          <Row>
            <h3>{turno.asignatura}</h3>
            <hr />
            {/*Dia y horas del turno*/}
            <Col
              md={12}
              lg={4}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: "5px",
              }}
              className="mb-3">
              <h5>
                {turno.dia} de {turno.horaInicio} a {turno.horaFin}
              </h5>
            </Col>
            {/*Asistentes*/}
            <Col
              md={12}
              lg={4}
              style={{
                display: "flex",
                justifyContent: "center",
                paddingTop: "5px",
              }}
              className="mb-3">
              {/*Dependiendo del rol muestra el valor o un boton para más información de los asistentes*/}
              {props.role === "alumno" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}>
                  <h5>
                    Plazas cubiertas {turno.idAlumnos.length} de{" "}
                    {turno.alumnosMax}
                  </h5>
                  {apuntado && <h4 className="etiqueta-apuntado">Apuntado</h4>}
                </div>
              )}
              {props.role === "docente" && errorAsistentes && (
                <Alerta
                  tipo="danger"
                  mensaje="Ha habido un problema recuperando los asistentes."></Alerta>
              )}
              {props.role === "docente" &&
                turno.idAlumnos.length > 0 &&
                !errorAsistentes && (
                  <div
                    style={{ display: "flex", width: "200px", height: "60px" }}>
                    <BotonCrear
                      texto="Ver alumnos"
                      onClick={() => setMostrarAsistentes(true)}
                    />
                  </div>
                )}
              {props.role === "docente" && turno.idAlumnos.length === 0 && (
                <div>
                  <h5>No hay asistentes</h5>
                  <h5>{turno.alumnosMax} alumnos máximo</h5>
                </div>
              )}
            </Col>
            {/*Acciones disponibles sobre los turnos. Dependerá del rol.*/}
            <Col md={12} lg={4} className="mb-3">
              {props.idUsuario !== "" && props.role === "alumno" && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                  }}>
                  <h5 style={{ paddingTop: "5px" }}>Acciones disponibles</h5>

                  {/*Si está apuntado o no, mostrará cada botón*/}
                  <div>
                    {apuntado && (
                      <BotonCancelar
                        texto="Desapuntarse"
                        onClick={() => manejarApuntado(false)}
                      />
                    )}
                    {/*Si no queda espacio libre no se puede apuntar. */}
                    {!apuntado &&
                      turno.idAlumnos.length !== turno.alumnosMax && (
                        <BotonPeticion
                          texto="Apuntarse"
                          onClick={() => manejarApuntado(true)}
                        />
                      )}
                  </div>
                </div>
              )}
              {props.role === "docente" && !isModificando && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}>
                  <h5>Acciones disponibles</h5>
                  <div style={{ width: "150px" }}>
                    <BotonCrear
                      texto="Modificar"
                      onClick={() => setModificando(true)}
                    />
                    {asistentes.length === 0 && (
                      <BotonCancelar
                        texto="Borrar"
                        onClick={() => manejarBorradoTurno()}
                      />
                    )}
                  </div>
                </div>
              )}
            </Col>
            {/*Muestra los asistentes si el docente lo solicita*/}
            {isMostrarAsistentes && (
              <Row>
                <div style={{ padding: "30px" }}>
                  <h3>
                    Alumnos: {turno.idAlumnos.length} / {turno.alumnosMax}
                  </h3>
                  <hr></hr>
                  {asistentes.map((asistente) => (
                    <div
                      style={{ display: "flex", gap: "20px" }}
                      key={asistente.idPublico}>
                      <div
                        className="contenedor-asistente"
                        key={asistente.idPublico}>
                        {asistente.nombre}
                      </div>
                      {/*Ver el perfil o expulsar al alumno*/}
                      <div style={{ display: "flex", gap: "5px" }}>
                        <BotonCrear
                          texto="Perfil"
                          onClick={() => {
                            window.location.href =
                              "/usuario/" + asistente.idPublico;
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
          </Row>
        </div>
        {/*Panel de modificación del turno */}
        {isModificando && (
          <div id="modificar-turno" className="turno">
            <FormularioModificarTurno
              turno={turno}
              onCompletado={manejarFinModificacionTurno}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Turno;
