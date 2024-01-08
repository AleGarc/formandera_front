import { useState } from "react";
import Container from "react-bootstrap/esm/Container";
import Alerta from "../Alerta";
import { BotonCrear, BotonPeticion } from "../Botones";
import "../../css/formularioLogin.css";

const FormularioLogin = (props) => {
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
              {fallo && <Alerta tipo="danger" mensaje={fallo}></Alerta>}
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

export default FormularioLogin;
