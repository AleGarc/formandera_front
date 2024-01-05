import React, { useState } from "react";
import { FormularioLogin, FormularioRegistro } from "./Formularios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [isRegistrado, setRegistrado] = useState(true);

  const manejarCambioRegistro = (registrado) => {
    setRegistrado(registrado);
  };

  const manejarLogin = async (datos) => {
    try {
      const respuesta = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        body: JSON.stringify(datos),
        headers: { "Content-Type": "application/json" },
      });
      if (respuesta.status === 200) {
        const objToken = await respuesta.json();
        const tokenDecodificado = jwtDecode(objToken.access_token);
        const tiempoExpiracion = tokenDecodificado.exp - tokenDecodificado.iat;

        // Obtén la zona horaria local del navegador en minutos
        const zonaHorariaLocal = new Date().getTimezoneOffset();

        // Ajusta el tiempo de expiración según la zona horaria local
        const tiempoExpiracionAjustado =
          tiempoExpiracion - zonaHorariaLocal * 60;

        // Crear una cookie utilizando el tiempo de expiración ajustado
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
  const manejarRegistro = async (datos) => {
    try {
      const respuesta = await fetch("http://localhost:3001/usuario", {
        method: "POST",
        body: JSON.stringify(datos),
        headers: { "Content-Type": "application/json" },
      });
      if (respuesta.status === 201) {
        const credenciales = {
          email: datos.email,
          password: datos.password,
        };
        await manejarLogin(credenciales);
        return "";
      } else if (respuesta.status === 409)
        return "El correo ya está registrado.";
      else
        return "Hubo un error durante su petición. Inténtelo de nuevo más tarde.";
    } catch (error) {
      return "Hubo un error durante su petición. Inténtelo de nuevo más tarde.";
    }
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
