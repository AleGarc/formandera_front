import React, { useEffect, useState } from "react";
import "../css/header.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Cookies from "js-cookie";

function Header() {
  //const [cookie] = useCookies(["token"]);

  const home = "http://localhost:3000";
  const tokenCookie = Cookies.get("token");
  const [token, setToken] = useState();
  useEffect(() => {
    setToken(tokenCookie);
  }, [tokenCookie]);

  const manejarLogout = () => {
    Cookies.remove("token");
    window.location.href = home;
  };

  return (
    <Navbar collapseOnSelect expand="lg" className="navbar">
      <Container>
        <Navbar.Brand className="navbar-brand" href={home}>
          Formandera
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link className="btn-navegacion" href={home}>
              Buscar
            </Nav.Link>
            <Nav.Link className="btn-navegacion" href="#pricing">
              Profesores
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link className="btn-navegacion" href="#deets">
              Sugerencias
            </Nav.Link>
            {token !== undefined && (
              <Nav.Link className="btn-navegacion" href="#deets">
                Perfil
              </Nav.Link>
            )}
            {token !== undefined && (
              <Nav.Link
                className="btn-navegacion logout"
                eventKey={2}
                onClick={manejarLogout}>
                Cerrar sesión
              </Nav.Link>
            )}

            {token === undefined && (
              <Nav.Link
                className="btn-navegacion logout"
                eventKey={2}
                href={home + "/login"}>
                Iniciar sesión
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
