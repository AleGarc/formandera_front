import React, { useState } from "react";
import Alerta from "./Alerta";

export const FormularioTurno = (props) => {
  const asignaturas = [
    "Matemáticas",
    "Lengua",
    "Inglés",
    "Física y Química",
    "Historia",
    "Geografía",
    "Biología",
  ];

  const [formData, setFormData] = useState({
    asignatura: "",
    horaInicio: "",
    horaFin: "",
    alumnosMax: 1,
  });

  const manejarCambio = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //Comprobar que hay una diferencia de almenos 30 minutos entre las fechas
  // y que la de fin es posterior a la de inicio.
  function checkHoras(horaInicio, horaFin) {
    const fecha1 = new Date(`2000-01-01T${horaInicio}`);
    const fecha2 = new Date(`2000-01-01T${horaFin}`);

    const diferenciaEnMs = Math.abs(fecha2 - fecha1);
    const diferenciaEnMinutos = diferenciaEnMs / (1000 * 60);

    if (fecha2 <= fecha1) {
      return "La segunda hora debe ser posterior a la primera.";
    }

    if (diferenciaEnMinutos < 30) {
      return "La diferencia entre las horas debe ser de al menos 30 minutos.";
    }

    return null;
  }

  const manejarEnvio = (e) => {
    e.preventDefault();
    let error = checkHoras(formData.horaInicio, formData.horaFin);
    if (error == null) {
      let error = props.checkOtrosTurnos(formData.horaInicio, formData.horaFin);
      error == null ? props.manejarForm(formData) : setFallo(error);
    } else setFallo(error);
  };

  const [fallo, setFallo] = useState("");

  return (
    <div className="formularioTurno">
      <form onSubmit={manejarEnvio}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h3>Nuevo turno</h3>
        </div>
        <div className="mb-1">
          <label>Asignatura:</label>
          <br />
          <select
            name="asignatura"
            value={formData.asignatura}
            onChange={manejarCambio}
            required>
            <option value="">Selecciona una asignatura</option>
            {asignaturas.map((asignatura) => (
              <option key={asignatura} value={asignatura}>
                {asignatura}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-1" style={{ width: "50%" }}>
          <label>Hora de inicio:</label>
          <input
            type="time"
            name="horaInicio"
            value={formData.horaInicio}
            onChange={manejarCambio}
            required
          />
        </div>
        <div className="mb-1" style={{ width: "50%" }}>
          <label>Hora de fin:</label>
          <input
            name="horaFin"
            type="time"
            value={formData.horaFin}
            onChange={manejarCambio}
            required
          />
        </div>
        <div className="mb-3">
          <label>Número de alumnos máximo:</label>
          <div style={{ width: "50%" }}>
            <input
              name="alumnosMax"
              type="number"
              min={1}
              max={30}
              value={formData.alumnosMax}
              onChange={manejarCambio}
              required
            />
          </div>
        </div>
        {!fallo == "" && <Alerta tipo="danger" mensaje={fallo}></Alerta>}
        <button className="btn-crear" type="submit">
          Crear turno
        </button>
      </form>
    </div>
  );
};
