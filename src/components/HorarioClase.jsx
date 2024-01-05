import React, { useState, useEffect } from "react";
import "../css/horario.css";
import "../css/fonts.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {
  BotonPeticion,
  BotonCancelar,
  BotonCrear,
  BotonTurno,
} from "./Botones";
import Alerta from "./Alerta";
import Accordion from "react-bootstrap/Accordion";
import { FormularioTurno } from "./Formularios";

import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Turno from "./Turno";

const HorarioClase = (props) => {
  const turnos = props.turnos;

  const diasSemana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  /* const manejarBorrarTurno = (index) => {
    const turnosActualizados = turnos.filter((_, i) => i !== index);
    setTurnos(turnosActualizados);
  }; */

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
      asignaturas: [],
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

  const [turno, setTurno] = useState(undefined);

  const manejarMostrarTurno = (turno) => {
    setTurno(turno);
  };

  const token = Cookies.get("token");
  let tokenDecodificado = undefined;
  if (token) tokenDecodificado = jwtDecode(token);

  return (
    <div className="week-grid">
      <Row style={{ width: "100%" }}>
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
                  }}></div>

                {turnos.map(
                  (turno, index) =>
                    turno.dia === day && (
                      <BotonTurno
                        texto={
                          turno.asignatura
                            ? `${turno.asignatura}: ${turno.horaInicio} - ${turno.horaFin}`
                            : `Variado: ${turno.horaInicio} - ${turno.horaFin}`
                        }
                        asignatura={
                          turno.asignatura ? turno.asignatura : "Variado"
                        }
                        key={turno.id + index}
                        onClick={() => manejarMostrarTurno(turno)}
                      />
                    )
                )}
              </div>
            </Container>
          </Col>
        ))}
        {/*         {isRespuesta && (
          <Alerta
            tipo={isRespuesta.tipo}
            mensaje={isRespuesta.mensaje}></Alerta>
        )} */}
        {turno !== undefined && (
          <Turno
            turno={turno}
            role={tokenDecodificado ? tokenDecodificado.role : "alumno"}
            idUsuario={tokenDecodificado ? tokenDecodificado.idPublico : ""}
          />
        )}
      </Row>
    </div>
  );
};

export default HorarioClase;
