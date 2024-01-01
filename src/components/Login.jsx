import React, { useState } from "react";
import { FormularioLogin, FormularioRegistro } from "./Formularios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isRegistrado, setRegistrado] = useState(true);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform login logic here
  };

  const manejarCambioRegistro = (registrado) => {
    setRegistrado(registrado);
  };

  return (
    <div>
      {isRegistrado && <FormularioLogin onRegistrado={manejarCambioRegistro} />}
      {!isRegistrado && (
        <FormularioRegistro onRegistrado={manejarCambioRegistro} />
      )}
    </div>
  );
};

export default Login;
