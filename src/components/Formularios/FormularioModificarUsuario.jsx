import { useState } from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Form from "react-bootstrap/Form";
import { BotonCancelar, BotonPeticion } from "../Botones";
import Alerta from "../Alerta";

//Formulario para la modificación de un usuario
function FormularioModificarUsuario({ usuario, onCompletado }) {
  //Estados para controlar los datos del comentario
  const [nombre, setNombre] = useState(usuario.nombre);
  const [username, setUsername] = useState(usuario.username);
  const [usernameUsuario] = useState(usuario.username);
  const [email, setEmail] = useState(usuario.email);
  const [emailUsuario] = useState(usuario.email);
  const [biografia, setBiografia] = useState(usuario.biografia ?? "");

  //Estado para controlar el mensaje de error
  const [errorModificacion, setErrorModificacion] = useState("");

  const validarEmailRegex = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  //Comprobación de parámetros y llamada a la función de completado
  const manejarFormulario = async () => {
    setErrorModificacion("");
    if (nombre === "") {
      setErrorModificacion("El nombre no puede estar vacío.");
      return;
    }
    if (username === "") {
      setErrorModificacion("El nombre de usuario no puede estar vacío.");
      return;
    }

    if (email === "") {
      setErrorModificacion("El correo electrónico no puede estar vacío.");
      return;
    }
    if (!validarEmailRegex(email)) {
      setErrorModificacion("El correo electrónico no es válido. example@um.es");
      return;
    }

    const data = {
      nombre,
      username,
      email,
      biografia,
    };

    onCompletado(data);
  };

  return (
    <Row>
      <h3>Modificar usuario</h3>

      <hr />
      <Col md={12} lg={6} className="mb-3">
        <label>Nombre</label>
        <input
          type="text"
          value={nombre}
          maxLength={100}
          onChange={(e) => setNombre(e.target.value)}
        />

        <div className="mb-2">
          <label>Nombre de usuario</label>
          <input
            type="text"
            value={username}
            maxLength={100}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-2">
          <label>Correo electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </Col>
      <Col md={12} lg={6} className="mb-3">
        <label>Biografía</label>
        <Form.Control
          style={{ border: "1px solid gray" }}
          as="textarea"
          rows={10}
          value={biografia}
          maxLength={800}
          onChange={(e) => setBiografia(e.target.value)}
        />
      </Col>

      {/* Mostrado de alerta con error de modificación*/}
      <Col xs={12}>
        {errorModificacion && (
          <Alerta tipo="danger" mensaje={errorModificacion}></Alerta>
        )}
        <div style={{ display: "flex", gap: "10px", justifyContent: "end" }}>
          <div>
            <BotonCancelar
              texto="Cancelar"
              onClick={() => onCompletado(null)}
            />
          </div>
          <BotonPeticion
            texto="Modificar usuario"
            onClick={() => manejarFormulario()}
          />
        </div>
      </Col>
    </Row>
  );
}

export default FormularioModificarUsuario;
