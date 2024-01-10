import React, { useEffect, useState } from "react";
import "../css/header.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { NAV_KEY } from "../javascript/api";

function Header() {
  const tokenCookie = Cookies.get("token");

  const [token, setToken] = useState();
  useEffect(() => {
    setToken(tokenCookie);
  }, [tokenCookie]);

  const tokenDecodificado = token ? jwtDecode(token) : undefined;

  return (
    <Navbar collapseOnSelect expand="lg" className="navbar">
      <Container>
        <Navbar.Brand
          className="navbar-brand"
          href={tokenCookie ? NAV_KEY + "/home" : NAV_KEY}>
          Formandera
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link className="btn-navegacion" href={NAV_KEY + "/clases"}>
              Clases
            </Nav.Link>
            <Nav.Link className="btn-navegacion" href={NAV_KEY + "/docentes"}>
              Docentes
            </Nav.Link>
          </Nav>
          <Nav>
            {token !== undefined && (
              <Nav.Link
                className="btn-navegacion"
                href={NAV_KEY + "/usuario/" + tokenDecodificado.idPublico}>
                Perfil
              </Nav.Link>
            )}
            {token !== undefined && (
              <Nav.Link
                className="btn-navegacion"
                eventKey={2}
                href={NAV_KEY + "/logout"}>
                Cerrar sesión
              </Nav.Link>
            )}

            {token === undefined && (
              <Nav.Link
                className="btn-navegacion"
                eventKey={2}
                href={NAV_KEY + "/login"}>
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
