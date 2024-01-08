import Cookies from "js-cookie";
import { useEffect } from "react";
import Container from "react-bootstrap/esm/Container";

//Componente sencillo para realizar el logout de la aplicación
//Se elimina la cookie y se redirige a la página de inicio
const Logout = () => {
  useEffect(() => {
    Cookies.remove("token");
    window.location.href = "http://localhost:3000";
  });

  return (
    <Container
      style={{
        height: "700px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <h1>Cerrando sesión</h1>
    </Container>
  );
};

export default Logout;
