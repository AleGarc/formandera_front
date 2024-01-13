import React, { useState, useEffect } from "react";
import "../css/horario.css";
import "../css/fonts.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { BotonCrear, BotonTurno } from "./Botones";
import Alerta from "./Alerta";
import FormularioModificarTurno from "./Formularios/FormularioModificarTurno";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Turno from "./Turno";
import { checkOtrosTurnos } from "../javascript/validaciones";
import { API_KEY } from "../javascript/api";

const HorarioClase = (props) => {
  const [turnos, setTurnos] = useState(props.turnos);

  const diasSemana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  //Para manejo de errores mostrando alerta.
  const [isRespuesta, setRespuesta] = useState(false);

  const manejarRespuesta = (tipo, mensaje) => {
    setRespuesta({ tipo, mensaje });
  };

  //Puesto que el horario contiene siete columnas no es divisible
  // por el sistema de breakpoints de bootstrap. Se obtendrá
  // el ancho de la pantalla para establecer el número de columnas.
  const [anchoPantalla, setAnchoPantalla] = useState(window.innerWidth);

  //Punto apartir del cual se establecerá el número de columnas.
  // Este valor es empírico.
  const breakpoint = 1620;

  // Función para obtener y actualizar el ancho de la pantalla.
  useEffect(() => {
    const actualizarAnchoPantalla = () => {
      setAnchoPantalla(window.innerWidth);
    };

    window.addEventListener("resize", actualizarAnchoPantalla);

    // Limpieza del event listener cuando el componente se desmonta.
    return () => {
      window.removeEventListener("resize", actualizarAnchoPantalla);
    };
  }, []);

  //Para lograr que el formulario de creación tenga el dia seleccionado.
  const [diaSeleccionado, setDiaSeleccionado] = useState(undefined);
  const manejarCreando = (dia) => {
    setDiaSeleccionado(dia);
    setCreando(true);
  };

  //Para mostrar el turno seleccionado.
  const [turno, setTurno] = useState(undefined);

  //Para obtener el token decodificado del usuario.
  //Comprobamos si el usuario es el docente de la clase.
  const token = Cookies.get("token");
  let tokenDecodificado = undefined;
  let docenteDeClase = false;
  if (token) {
    tokenDecodificado = jwtDecode(token);
    docenteDeClase =
      props.idProfesor === tokenDecodificado.idPublico &&
      tokenDecodificado.role === "docente";
  }

  //Para manejar la creación de un turno mostrando el panel de creación.
  //Si se cancela la creación, recibe un null y se oculta el panel.
  const [isCreando, setCreando] = useState(false);
  const manejarCrearTurno = (data) => {
    if (data === null) {
      setCreando(false);
      return;
    }
    setRespuesta(false);
    //Comprobación de que no se solapan turnos.
    const respuesta = checkOtrosTurnos(turnos, data);
    if (respuesta != null) manejarRespuesta("danger", respuesta);
    else {
      fetch(API_KEY + "/clase/" + props.idClase + "/turnos", {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.status === 400 || response.status === 404) {
            manejarRespuesta(
              "danger",
              "Hubo un error durante su petición. Inténtelo de nuevo más tarde."
            );
            throw new Error("Error en la petición");
          } else return response.json();
        })
        .then((data) => {
          setTurnos(data.turnos);
          setCreando(false);
        })
        .catch((error) => {
          manejarRespuesta(
            "danger",
            "Hubo un error durante su petición. Inténtelo de nuevo más tarde."
          );
          console.error(error);
        });
    }
  };

  return (
    <div className="week-grid">
      <Row style={{ width: "100%" }}>
        {/*Titulo */}
        <div
          id="divisor-titulo-horario"
          className="mb-3"
          style={{ display: "flex", justifyContent: "center" }}>
          <h1 className="titulo">Horario</h1>
        </div>
        {/* Generación de columnas para cada dia de la semana*/}
        {/*Si se alcanza el breakpoint, el horario se dispone de forma responsive */}
        {diasSemana.map((day) => (
          <Col
            sm={anchoPantalla < breakpoint ? 12 : 0}
            md={anchoPantalla < breakpoint ? 6 : 0}
            lg={anchoPantalla < breakpoint ? 4 : 0}
            xl={anchoPantalla < breakpoint ? 4 : 0}
            xxl={anchoPantalla < breakpoint ? 3 : 0}
            className="mb-3 columna-dia"
            key={props.idClase + day}>
            <Container>
              <div id="divisor-dia" className="pb-3" key={day}>
                <div
                  id="divisor-etiqueta-dia"
                  style={{ display: "flex", justifyContent: "center" }}
                  className="mt-3 etiqueta-dia">
                  <label>{day}</label>
                </div>
                {/* Si se trata del docente de la clase se pueden crear nuevos turnos */}
                {docenteDeClase && (
                  <div
                    id="divisor-boton-crear-turno"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}>
                    <BotonCrear
                      texto="Crear turno"
                      onClick={() => manejarCreando(day)}
                    />
                  </div>
                )}
                {/*Se crean botones con información y disparador para cada turno */}
                <div className="mt-3">
                  {turnos.map(
                    (turno, index) =>
                      turno.dia === day && (
                        <BotonTurno
                          texto={`${turno.asignatura}: ${turno.horaInicio} - ${turno.horaFin}`}
                          asignatura={
                            turno.asignatura ? turno.asignatura : "Variado"
                          }
                          key={turno.idPublico + index}
                          onClick={() => {
                            setTurno(turno);
                          }}
                        />
                      )
                  )}
                </div>
              </div>
            </Container>
          </Col>
        ))}
        {/* La alerta que muestra los errores de las peticiones*/}
        {isRespuesta && (
          <Alerta
            tipo={isRespuesta.tipo}
            mensaje={isRespuesta.mensaje}></Alerta>
        )}
        {/*Si se pulsa crear turno se muestra el formulario asociado */}
        {isCreando && (
          <div className="turno mb-3">
            <FormularioModificarTurno
              turno={{ dia: diaSeleccionado }}
              nuevo={true}
              onCompletado={manejarCrearTurno}
            />
          </div>
        )}
        {/*Si se selecciona un turno se muestra su información */}
        {turno !== undefined && (
          <Turno
            turno={turno}
            key={turno.idPublico}
            idClase={props.idClase}
            role={docenteDeClase ? "docente" : "alumno"}
            idUsuario={tokenDecodificado ? tokenDecodificado.idPublico : ""}
          />
        )}
      </Row>
    </div>
  );
};

export default HorarioClase;
