import React, { useState } from "react";
import "../css/Horario.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { BotonPeticion, BotonCancelar } from "./Botones";
import Alert from "react-bootstrap/Alert";
import Alerta from "./Alerta";

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

  function basurilla() {
    let turnos = [];
    for (let i = 0; i < 70; i++) {
      const newTurno = {
        day: diasSemana[i % 7],
        asignatura: asignaturas[i % 7],
        horaInicio: "08:00",
        horaFin: "09:00",
      };

      turnos.push(newTurno);
    }
    return turnos;
  }

  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [formData, setFormData] = useState({
    asignatura: "",
    horaInicio: "",
    horaFin: "",
  });
  const [turnos, setTurnos] = useState(basurilla());
  const [isCreandoTurno, setCreandoTurno] = useState(false);

  const manejarCancelar = () => {
    setDiaSeleccionado(null);
    setCreandoTurno(false);
  };

  const manejarDayButtonClick = (day) => {
    setDiaSeleccionado(day);
    setFormData({ asignatura: "", horaInicio: "", horaFin: "" });
    setCreandoTurno(true);
  };

  const manejarFormSubmit = (e) => {
    e.preventDefault();

    if (formData.asignatura && formData.horaInicio && formData.horaFin) {
      const newTurno = {
        day: diaSeleccionado,
        asignatura: formData.asignatura,
        horaInicio: formData.horaInicio,
        horaFin: formData.horaFin,
      };

      setTurnos([...turnos, newTurno]);
      setDiaSeleccionado(null);
      setCreandoTurno(false);
    }
  };

  const manejarBorrarTurno = (index) => {
    const turnosActualizados = turnos.filter((_, i) => i !== index);
    setTurnos(turnosActualizados);
  };

  const [isRespuesta, setRespuesta] = useState(false);

  const manejarRespuesta = (tipo, mensaje) => {
    setRespuesta({ tipo, mensaje });
  };

  const manejarDatos = () => {
    let datos = {
      nombre: "Horario 1",
      descripcion: "Horario de prueba",
      id_profesor: 1,
      asignaturas: asignaturas,
      turnos: turnos,
    };
    return datos;
  };

  return (
    <Container className="week-grid">
      <Row>
        <h1 style={{ paddingRight: "10px" }}>Horario</h1>
        {diasSemana.map((day) => (
          <Col className="mb-3">
            <Container>
              <Row>
                <div key={day}>
                  <Col sm={12}>
                    <label>{day}</label>
                  </Col>
                  <Col sm={12}>
                    {isCreandoTurno && diaSeleccionado === day && (
                      <BotonCancelar
                        texto={"Canelar"}
                        onClick={manejarCancelar}></BotonCancelar>
                    )}
                    {!isCreandoTurno && (
                      <button onClick={() => manejarDayButtonClick(day)}>
                        Nuevo turno
                      </button>
                    )}
                  </Col>
                  <Col sm={12}>
                    {diaSeleccionado === day && (
                      <form onSubmit={manejarFormSubmit}>
                        <label>
                          Asignatura:
                          <select
                            value={formData.asignatura}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                asignatura: e.target.value,
                              })
                            }>
                            <option value="">Selecciona una asignatura</option>
                            {asignaturas.map((asignatura) => (
                              <option key={asignatura} value={asignatura}>
                                {asignatura}
                              </option>
                            ))}
                          </select>
                        </label>
                        <br />
                        <label>
                          Hora de inicio:
                          <input
                            type="time"
                            value={formData.horaInicio}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                horaInicio: e.target.value,
                              })
                            }
                          />
                        </label>
                        <br />
                        <label>
                          Hora de fin:
                          <input
                            type="time"
                            value={formData.horaFin}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                horaFin: e.target.value,
                              })
                            }
                          />
                        </label>
                        <br />
                        <button type="submit">Crear turno</button>
                      </form>
                    )}

                    {turnos.map(
                      (card, index) =>
                        card.day === day && (
                          <div key={index} className="card">
                            <div className="mb-3">
                              <label
                                style={{
                                  fontWeight: "bold",
                                  paddingRight: "5px",
                                }}>
                                Asignatura:
                              </label>
                              <label>{card.asignatura}</label>
                              <div>
                                <label
                                  style={{
                                    fontWeight: "bold",
                                    paddingRight: "5px",
                                  }}>
                                  Hora de inicio:
                                </label>
                                <label>{card.horaInicio}</label>
                              </div>
                              <div>
                                <label
                                  style={{
                                    fontWeight: "bold",
                                    paddingRight: "5px",
                                  }}>
                                  Hora de fin:
                                </label>
                                <label>{card.horaFin}</label>
                              </div>
                            </div>
                            <button onClick={() => manejarBorrarTurno(index)}>
                              Eliminar
                            </button>
                          </div>
                        )
                    )}
                  </Col>
                </div>
              </Row>
            </Container>
          </Col>
        ))}
        <div style={{ display: "flex", justifyContent: "right" }}>
          <BotonPeticion
            texto="Crear horario"
            onRespuesta={manejarRespuesta}
            onClick={manejarDatos}></BotonPeticion>
        </div>
        {isRespuesta && (
          <Alerta
            tipo={isRespuesta.tipo}
            mensaje={isRespuesta.mensaje}></Alerta>
        )}
      </Row>
    </Container>
  );
};

export default Horario;
