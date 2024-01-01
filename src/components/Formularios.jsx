import React, { useState } from "react";
import Alerta from "./Alerta";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "../css/formularioLogin.css";
import { BotonCancelar, BotonCrear, BotonPeticion } from "./Botones";
import logo from "../images/formandera-logo.webp";

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

export const FormularioLogin = (props) => {
  const manejarCambio = () => {
    props.onRegistrado(false);
  };

  return (
    <div className="envoltorio">
      <Container className="contenedor">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h1>Iniciar sesión</h1>
        </div>
        <div className="mt-3">
          <div className="mb-3">
            <label>Correo electrónico</label>
            <input type="email" placeholder="Introduce tu correo electrónico" />
            <label className="text-muted">
              Nunca compartiremos tu correo electrónico.
            </label>
          </div>

          <div className="mb-3">
            <label>Contraseña</label>
            <input type="password" placeholder="Contraseña" />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}>
            <BotonPeticion texto="Iniciar sesión" clase="btn-crear" />
          </div>
          <hr style={{ border: "1px solid #000" }}></hr>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
            className="mb-2">
            <label>¿No tienes cuenta?</label>
          </div>
          <BotonCrear texto="Registrarse" onClick={manejarCambio}></BotonCrear>
        </div>
      </Container>
    </div>
  );
};

export const FormularioRegistro = (props) => {
  const manejarCambio = () => {
    props.onRegistrado(true);
  };

  return (
    <div className="envoltorio">
      <Container className="contenedor">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h1>Crear una nueva cuenta</h1>
        </div>

        <div className="contenedor-registro">
          <img
            src={logo}
            alt="logo"
            width={300}
            height={300}
            style={{ paddingTop: "30px" }}
          />
          <div className="separador"></div>
          <div style={{ display: "flex" }}>
            <div className="mt-3">
              <div className="mb-3">
                <label>Nombre</label>
                <input type="text" placeholder="Introduce tu nombre completo" />
              </div>

              <div className="mb-3">
                <label>Nombre de usuario</label>
                <input
                  type="text"
                  placeholder="Introduce tu nombre de usuario"
                />
              </div>

              <div className="mb-3">
                <label>Correo electrónico</label>
                <input
                  type="email"
                  placeholder="Introduce tu correo electrónico"
                />
                <label className="text-muted">
                  Nunca compartiremos tu correo electrónico.
                </label>
              </div>

              <div className="mb-3">
                <label>Contraseña</label>
                <input type="password" placeholder="Contraseña" />
                <label className="text-muted">
                  Debe tener al menos 8 caracteres.
                </label>
              </div>

              <div className="mb-3">
                <label>Repite contraseña</label>
                <input
                  type="password"
                  placeholder="Introduce la misma contraseña"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}>
                <BotonPeticion texto="Registrarse" clase="btn-crear" />
              </div>
              <hr style={{ border: "1px solid #000" }}></hr>

              <BotonCancelar
                texto="Atrás"
                onClick={manejarCambio}></BotonCancelar>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
