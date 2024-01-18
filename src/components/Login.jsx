import React, { useState } from "react";
import FormularioLogin from "./Formularios/FormularioLogin";
import FormularioRegistro from "./Formularios/FormularioRegistro";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { API_KEY } from "../javascript/api";

const Login = () => {
  const [isRegistrado, setRegistrado] = useState(true);

  const manejarCambioRegistro = (registrado) => {
    setRegistrado(registrado);
  };

  const manejarLogin = async (datos) => {
    try {
      const respuesta = await fetch(API_KEY + "/auth/login", {
        method: "POST",
        body: JSON.stringify(datos),
        headers: { "Content-Type": "application/json" },
      });
      if (respuesta.status === 200) {
        const objToken = await respuesta.json();
        const tokenDecodificado = jwtDecode(objToken.access_token);
        const tiempoExpiracion = tokenDecodificado.exp - tokenDecodificado.iat;

        // Ajuste de la hora de expiracion por la zona horaria.
        const zonaHorariaLocal = new Date().getTimezoneOffset();
        const tiempoExpiracionAjustado =
          tiempoExpiracion - zonaHorariaLocal * 60;

        const fechaExpiracion = new Date(
          Date.now() + tiempoExpiracionAjustado * 1000
        );

        Cookies.set("token", objToken.access_token, {
          expires: fechaExpiracion,
        });
        window.location.href = "/home";
        return "";
      } else return "El usuario o la contraseña son incorrectos.";
    } catch (error) {
      return "Hubo un error durante su petición. Inténtelo de nuevo más tarde.";
    }
  };

  //Comprobar que el username es único
  const manejarRegistro = (datos) => {
    return fetch(API_KEY + "/usuario", {
      method: "POST",
      body: JSON.stringify(datos),
      headers: { "Content-Type": "application/json" },
    }).then((respuesta) => {
      if (respuesta.status === 201) {
        const credenciales = {
          email: datos.email,
          password: datos.password,
        };
        manejarLogin(credenciales);
        return "";
      } else return respuesta.json();
    });
  };

  return (
    <div>
      {isRegistrado && (
        <FormularioLogin
          onSubmit={manejarLogin}
          onRegistrado={manejarCambioRegistro}
        />
      )}
      {!isRegistrado && (
        <FormularioRegistro
          onSubmit={manejarRegistro}
          onRegistrado={manejarCambioRegistro}
        />
      )}
    </div>
  );
};

export default Login;
