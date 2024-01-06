import React, { useEffect, useState, useMemo } from "react";
import Alerta from "./Alerta";
import Container from "react-bootstrap/Container";
import "../css/formularioLogin.css";
import { BotonCancelar, BotonCrear, BotonPeticion } from "./Botones";
import logo from "../images/formandera-logo.webp";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { checkHoras } from "../javascript/validaciones";

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
    if (error === null) {
      let error = props.checkOtrosTurnos(formData.horaInicio, formData.horaFin);
      error === null ? props.manejarForm(formData) : setFallo(error);
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
        {!fallo === "" && <Alerta tipo="danger" mensaje={fallo}></Alerta>}
        <button className="btn-crear" type="submit">
          Crear turno
        </button>
      </form>
    </div>
  );
};

export const FormularioLogin = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fallo, setFallo] = useState("");

  const manejarCambio = () => {
    props.onRegistrado(false);
  };

  const manejarSubmit = async () => {
    if (email === "" || password === "") return;
    setFallo("");
    const datos = { email, password };
    const resultado = await props.onSubmit(datos);
    if (resultado !== "") {
      setFallo(resultado);
    }
  };

  return (
    <div className="envoltorio">
      <Container className="contenedor">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h1>Iniciar sesión</h1>
        </div>
        <div className="mt-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}>
            <div className="mb-3">
              <label>Correo electrónico</label>
              <input
                type="email"
                placeholder="Introduce tu correo electrónico"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label className="text-muted">
                Nunca compartiremos tu correo electrónico.
              </label>
            </div>

            <div className="mb-3">
              <label>Contraseña</label>
              <input
                type="password"
                placeholder="Contraseña"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div style={{ maxWidth: "310px" }}>
              {!fallo === "" && <Alerta tipo="danger" mensaje={fallo}></Alerta>}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}>
              <BotonPeticion
                onClick={manejarSubmit}
                texto="Iniciar sesión"
                clase="btn-crear"
              />
            </div>
          </form>
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
  const [nombre, setNombre] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [role, setRole] = useState("alumno");

  const [fallo, setFallo] = useState("");

  const manejarCambio = () => {
    props.onRegistrado(true);
  };

  const manejarSubmit = async () => {
    if (
      nombre === "" ||
      username === "" ||
      email === "" ||
      password1 === "" ||
      password2 === ""
    )
      return;
    if (password1 !== password2) {
      setFallo("Las contraseñas no coinciden.");
      return;
    }

    setFallo("");
    const password = password1;
    const datos = { nombre, username, email, password, role };
    const resolucion = await props.onSubmit(datos);
    setFallo(resolucion);
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
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}>
                <div className="mb-3">
                  <label>Nombre</label>
                  <input
                    type="text"
                    placeholder="Introduce tu nombre completo"
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label>Nombre de usuario</label>
                  <input
                    type="text"
                    placeholder="Introduce tu nombre de usuario"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label>Correo electrónico</label>
                  <input
                    type="email"
                    placeholder="Introduce tu correo electrónico"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <label className="text-muted">
                    Nunca compartiremos tu correo electrónico.
                  </label>
                </div>

                <div
                  className="mb-3"
                  style={{ display: "flex", justifyContent: "space-around" }}>
                  <label htmlFor={"checkbox"} style={{ paddingTop: "10px" }}>
                    ¿Eres doncente?
                  </label>

                  <input
                    id="checkbox"
                    className="checkbox"
                    type="checkbox"
                    onChange={(e) => {
                      e.target.checked === true
                        ? setRole("docente")
                        : setRole("alumno");
                    }}
                  />
                </div>

                <div className="mb-3">
                  <label>Contraseña</label>
                  <input
                    type="password"
                    placeholder="Contraseña"
                    onChange={(e) => setPassword1(e.target.value)}
                    required
                  />
                  <label className="text-muted">
                    Debe tener al menos 8 caracteres.
                  </label>
                </div>

                <div className="mb-3">
                  <label>Repite contraseña</label>
                  <input
                    type="password"
                    placeholder="Introduce la misma contraseña"
                    onChange={(e) => setPassword2(e.target.value)}
                    required
                  />
                </div>
                <div style={{ maxWidth: "310px" }}>
                  {!fallo === "" && (
                    <Alerta tipo="danger" mensaje={fallo}></Alerta>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}>
                  <BotonPeticion
                    texto="Registrarse"
                    onClick={manejarSubmit}
                    clase="btn-crear"
                  />
                </div>
              </form>
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

export const FormularioModificarTurno = (props) => {
  //El mensaje de advertencia indica que la dependencia asignaturas en el
  //array de dependencias del useEffect cambia en cada renderizado, lo
  //cual podría llevar a efectos inesperados. Para solucionar esto,
  //puedes utilizar useMemo para calcular asignaturas solo cuando
  //cambie la dependencia que lo afecta. Aquí tienes cómo podrías hacerlo:
  const asignaturas = useMemo(
    () => [
      "Matemáticas",
      "Física",
      "Química",
      "Historia",
      "Literatura",
      "Inglés",
      "Arte",
      "Música",
      "Programación",
      "Biología",
      "Geografía",
      "Variado",
      "Otro",
    ],
    []
  );

  const [otraAsignatura, setOtraAsignatura] = useState("");
  const [mostrarOtraAsignatura, setMostrarOtraAsignatura] = useState(false);

  useEffect(() => {
    if (props.turno.asignatura === undefined) {
      setAsignatura("Matemáticas");
      setMostrarOtraAsignatura(false);
    } else if (!asignaturas.includes(props.turno.asignatura)) {
      setOtraAsignatura(props.turno.asignatura);
      setAsignatura("Otro");
      setMostrarOtraAsignatura(true);
    } else {
      setAsignatura(props.turno.asignatura);
    }
    setDia(props.turno.dia);
  }, [props.turno, asignaturas]);

  const [asignatura, setAsignatura] = useState(
    props.turno.asignatura ?? "Matemáticas"
  );
  const [dia, setDia] = useState(props.turno.dia ?? "Lunes");
  const [horaInicio, setHoraInicio] = useState(props.turno.horaInicio ?? "");
  const [horaFin, setHoraFin] = useState(props.turno.horaFin ?? "");
  const [alumnosMax, setAlumnosMax] = useState(props.turno.alumnosMax ?? 1);
  const [errorModificacion, setErrorModificacion] = useState("");

  const seleccionarAsignatura = (e) => {
    setAsignatura(e.target.value);
    if (e.target.value === "Otro") {
      setMostrarOtraAsignatura(true);
    } else setMostrarOtraAsignatura(false);
  };

  const manejarFormulario = () => {
    setErrorModificacion("");
    if (asignatura === "") {
      setErrorModificacion("La asignatura no puede estar vacía.");
      return;
    }
    if (dia === "") {
      setErrorModificacion("El día no puede estar vacío.");
      return;
    }
    if (horaInicio === "") {
      setErrorModificacion("La hora de inicio no puede estar vacía.");
      return;
    }
    if (horaFin === "") {
      setErrorModificacion("La hora de fin no puede estar vacía.");
      return;
    }
    if (alumnosMax === "") {
      setErrorModificacion("El número de alumnos no puede estar vacío.");
      return;
    }
    if (props.nuevo === false && alumnosMax < props.turno.idAlumnos.length) {
      setErrorModificacion(
        "El número de alumnos no puede ser menor que el número de alumnos ya apuntados."
      );
      return;
    }
    if (alumnosMax < 1 || alumnosMax > 30) {
      setErrorModificacion(
        "El número de alumnos debe estar entre 1 y 30, ambos incluidos."
      );
      return;
    }
    if (asignatura === "Otro" && otraAsignatura === "") {
      setErrorModificacion("La asignatura no puede estar vacía.");
      return;
    }

    const alumnosMaximos = Number(alumnosMax);
    const resultado = checkHoras(horaInicio, horaFin);
    if (resultado !== null) {
      setErrorModificacion(resultado);
    } else {
      const data = {
        asignatura: asignatura === "Otro" ? otraAsignatura : asignatura,
        dia,
        horaInicio,
        horaFin,
        alumnosMax: alumnosMaximos,
      };

      props.onCompletado(data);
    }
  };

  return (
    <Row>
      {props.nuevo === true ? <h3>Nuevo turno</h3> : <h3>Modificar turno</h3>}
      <hr />
      <Col md={12} lg={6} className="mb-3">
        <label>Asignatura</label>
        <select
          id="selectAsignaturas"
          className="select-formulario-modificar-turno "
          value={asignatura}
          onChange={(e) => seleccionarAsignatura(e)}>
          <option value="" disabled>
            Selecciona una asignatura
          </option>
          {asignaturas.map((asignatura, index) => (
            <option key={index} value={asignatura}>
              {asignatura}
            </option>
          ))}
        </select>
      </Col>
      <Col md={12} lg={6} className="mb-3">
        <label>Día</label>
        <select
          className="select-formulario-modificar-turno "
          value={dia}
          onChange={(e) => setDia(e.target.value)}>
          <option value="Lunes">Lunes</option>
          <option value="Martes">Martes</option>
          <option value="Miércoles">Miércoles</option>
          <option value="Jueves">Jueves</option>
          <option value="Viernes">Viernes</option>
          <option value="Sábado">Sábado</option>
          <option value="Domingo">Domingo</option>
        </select>
      </Col>
      {mostrarOtraAsignatura && (
        <Col md={12} lg={6} className="mb-3">
          <label>Otra asignatura</label>
          <input
            type="text"
            value={otraAsignatura}
            onChange={(e) => setOtraAsignatura(e.target.value)}
          />
        </Col>
      )}
      <Col md={12} lg={6} className="mb-3">
        <label>Hora inicio</label>
        <input
          type="time"
          value={horaInicio}
          onChange={(e) => setHoraInicio(e.target.value)}
        />
      </Col>
      <Col md={12} lg={6} className="mb-3">
        <label>Hora fin</label>
        <input
          type="time"
          value={horaFin}
          onChange={(e) => setHoraFin(e.target.value)}
        />
      </Col>
      <Col md={12} lg={6} className="mb-3">
        <label>Alumnos máximos</label>
        <input
          type="number"
          value={alumnosMax}
          onChange={(e) => setAlumnosMax(e.target.value)}
        />
      </Col>

      <Col xs={12}>
        {errorModificacion && (
          <Alerta tipo="danger" mensaje={errorModificacion}></Alerta>
        )}
        <div style={{ display: "flex", gap: "10px", justifyContent: "end" }}>
          <div>
            <BotonCancelar
              texto="Cancelar"
              onClick={() => props.onCompletado(null)}
            />
          </div>
          <BotonPeticion
            texto={props.nuevo === true ? "Crear turno" : "Modificar turno"}
            onClick={() => manejarFormulario()}
          />
        </div>
      </Col>
    </Row>
  );
};
