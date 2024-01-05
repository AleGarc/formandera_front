import React, { useState, useEffect } from "react";
import "../css/horario.css";
import "../css/fonts.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { BotonPeticion, BotonCancelar, BotonCrear } from "./Botones";
import Alerta from "./Alerta";
import Accordion from "react-bootstrap/Accordion";
import { FormularioTurno } from "./Formularios";

const Horario = () => {
  const asignaturas = [
    "Matemáticas",
    "Lengua",
    "Inglés",
    "Física y Química",
    "Historia",
    "Geografía",
    "Biología",
  ];

  const diasSemana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  const [diaSeleccionado, setDiaSeleccionado] = useState(null);

  const [turnos, setTurnos] = useState([]);
  const [isCreandoTurno, setCreandoTurno] = useState(false);

  const manejarCancelar = () => {
    setDiaSeleccionado(null);
    setCreandoTurno(false);
  };

  const manejarDayButtonClick = (day) => {
    setDiaSeleccionado(day);
    setCreandoTurno(true);
  };

  function insertarEnOrden(turno) {
    let i = 0;
    let nuevosTurnos = turnos;
    while (i < nuevosTurnos.length && turno.day > nuevosTurnos[i].day) {
      i++;
    }
    while (
      i < nuevosTurnos.length &&
      turno.day === nuevosTurnos[i].day &&
      turno.horaInicio > nuevosTurnos[i].horaInicio
    ) {
      i++;
    }
    nuevosTurnos.splice(i, 0, turno);
    return nuevosTurnos;
  }

  const manejarFormTurnos = (turno) => {
    if (turno.asignatura && turno.horaInicio && turno.horaFin) {
      const newTurno = {
        dia: diaSeleccionado,
        asignatura: turno.asignatura,
        horaInicio: turno.horaInicio,
        horaFin: turno.horaFin,
        alumnosMax: turno.alumnosMax,
      };
      let nuevosTurnos = insertarEnOrden(newTurno);
      setTurnos(nuevosTurnos);
      setDiaSeleccionado(null);
      setCreandoTurno(false);
    }
  };

  const checkOtrosTurnos = (horaInicio, horaFin) => {
    let error = null;
    turnos.forEach((turno) => {
      if (turno.day === diaSeleccionado) {
        if (
          (horaInicio > turno.horaInicio && horaInicio < turno.horaFin) ||
          (horaFin > turno.horaInicio && horaFin < turno.horaFin)
        ) {
          error = "El turno se solapa con otro ya existente.";
        }
      }
    });
    return error;
  };

  const manejarBorrarTurno = (index) => {
    const turnosActualizados = turnos.filter((_, i) => i !== index);
    setTurnos(turnosActualizados);
  };

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

  const manejarPeticion = async () => {
    let datos = {
      nombre: "Horario 1",
      descripcion: "Horario de prueba",
      idProfesor: "1",
      asignaturas: asignaturas,
      turnos: turnos,
    };
    try {
      const respuesta = await fetch("http://localhost:3001/clase", {
        method: "POST",
        body: JSON.stringify(datos),
        headers: { "Content-Type": "application/json" },
      });
      console.log("respuesta", respuesta.status);
      if (respuesta.status === 201)
        manejarRespuesta("success", "Horario creado con éxito.");
      else manejarRespuesta("danger", "Hubo un error durante su petición.");
    } catch (error) {
      manejarRespuesta(
        "danger",
        "Hubo un error durante su petición. Inténtelo de nuevo más tarde."
      );
      console.error(error);
    }
  };

  return (
    <div className="week-grid">
      <Row>
        <div
          id="divisor-titulo-horario"
          className="mb-3"
          style={{ display: "flex", justifyContent: "center" }}>
          <h1 className="titulo">Horario</h1>
        </div>
        {diasSemana.map((day) => (
          <Col
            sm={anchoPantalla < breakpoint ? 12 : 0}
            md={anchoPantalla < breakpoint ? 6 : 0}
            lg={anchoPantalla < breakpoint ? 4 : 0}
            xl={anchoPantalla < breakpoint ? 4 : 0}
            xxl={anchoPantalla < breakpoint ? 3 : 0}
            className="mb-3 columna-dia">
            <Container>
              <div id="divisor-dia" className="pb-3" key={day}>
                <div
                  id="divisor-etiqueta-dia"
                  style={{ display: "flex", justifyContent: "center" }}
                  className="mb-3 mt-3 etiqueta-dia">
                  <label>{day}</label>
                </div>

                <div
                  id="divisor-boton-crear-turno"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}>
                  {!isCreandoTurno && (
                    <div style={{ width: "100%" }} className="mb-3">
                      <BotonCrear
                        texto={"Nuevo turno"}
                        onClick={() => manejarDayButtonClick(day)}></BotonCrear>
                    </div>
                  )}
                </div>

                {diaSeleccionado === day && (
                  <FormularioTurno
                    manejarForm={manejarFormTurnos}
                    checkOtrosTurnos={checkOtrosTurnos}></FormularioTurno>
                )}
                {isCreandoTurno && diaSeleccionado === day && (
                  <div className="mt-2 mb-5">
                    <BotonCancelar
                      texto={"Cancelar"}
                      onClick={manejarCancelar}></BotonCancelar>
                  </div>
                )}

                {turnos.map(
                  (turno, index) =>
                    turno.day === day && (
                      <Accordion>
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>
                            {turno.horaInicio} - {turno.horaFin}
                          </Accordion.Header>
                          <Accordion.Body>
                            <div key={index} className="turno">
                              <div className="mb-3">
                                <label
                                  style={{
                                    fontWeight: "bold",
                                    paddingRight: "5px",
                                  }}>
                                  Asignatura:
                                </label>
                                <label>{turno.asignatura}</label>
                                <div>
                                  <label
                                    style={{
                                      fontWeight: "bold",
                                      paddingRight: "5px",
                                    }}>
                                    Hora de inicio:
                                  </label>
                                  <label>{turno.horaInicio}</label>
                                </div>
                                <div>
                                  <label
                                    style={{
                                      fontWeight: "bold",
                                      paddingRight: "5px",
                                    }}>
                                    Hora de fin:
                                  </label>
                                  <label>{turno.horaFin}</label>
                                </div>
                                <div>
                                  <label
                                    style={{
                                      fontWeight: "bold",
                                      paddingRight: "5px",
                                    }}>
                                    Alúmnos máximos:
                                  </label>
                                  <label>{turno.alumnosMax}</label>
                                </div>
                              </div>

                              <BotonCancelar
                                texto="Eliminar"
                                onClick={() =>
                                  manejarBorrarTurno(index)
                                }></BotonCancelar>
                            </div>
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                    )
                )}
              </div>
            </Container>
          </Col>
        ))}
        {isRespuesta && (
          <Alerta
            tipo={isRespuesta.tipo}
            mensaje={isRespuesta.mensaje}></Alerta>
        )}
        {turnos.length !== 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "right",
              padding: "0px",
            }}>
            <BotonPeticion
              texto="Crear horario"
              onClick={manejarPeticion}></BotonPeticion>
          </div>
        )}
      </Row>
    </div>
  );
};

export default Horario;
