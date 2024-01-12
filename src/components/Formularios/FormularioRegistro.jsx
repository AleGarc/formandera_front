import { useState } from "react";
import Container from "react-bootstrap/esm/Container";
import Alerta from "../Alerta";
import { BotonCancelar, BotonPeticion } from "../Botones";
import logo from "../../images/formandera-logo.webp";

const FormularioRegistro = (props) => {
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
                  {fallo && <Alerta tipo="danger" mensaje={fallo}></Alerta>}
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

export default FormularioRegistro;
