import React, { useState } from "react";
import "../css/header.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function Header() {
  //Extraemos la cookie para ver si tiene acceso al componente.
  // Si no está el token guardado redirigimos al índice.
  //const [cookie] = useCookies(["token"]);
  /*   const express = "http://localhost:3000";
  const pasarela = "http://localhost:8090"; */
  /*  if (Object.keys(cookie).length === 0)
    window.location.href = "http://localhost:3000"; */
  const home = "http://localhost:3000";

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
            <Nav.Link className="btn-navegacion" href="#deets">
              Perfil
            </Nav.Link>
            <Nav.Link
              className="btn-navegacion logout"
              eventKey={2}
              href={home + "/login"}>
              Iniciar sesión
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
