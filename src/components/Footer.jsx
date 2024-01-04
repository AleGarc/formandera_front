import React from "react";

import "../css/footer.css";

function Footer() {
  return (
    <footer className="page-footer">
      <div className="container">
        <div className="row">
          <div
            className="col-lg-4 col-md-4 col-sm-12 mb-3"
            style={{
              justifyItems: "center",
              display: "grid",
            }}>
            <h6 className="text-uppercase font-weight-bold links">
              Enlaces útiles
            </h6>
            <div>
              <a className="links" href="/">
                Términos y condiciones
              </a>
            </div>
            <div>
              <a className="links" href="/">
                Politica de privacidad
              </a>
            </div>
            <div>
              <a className="links" href="/">
                Preguntas frecuentes
              </a>
            </div>
            <div>
              <a className="links" href="/">
                Contáctanos
              </a>
            </div>
          </div>
          <div
            className="col-lg-4 col-md-4 col-sm-12 mb-3"
            style={{
              justifyItems: "center",
              display: "grid",
            }}>
            <h6 className="text-uppercase font-weight-bold links">
              Siguenos en las redes sociales
            </h6>
            <div>
              <a className="links" href="/">
                Facebook: @formandera
              </a>
            </div>
            <div>
              <a className="links" href="/">
                Instagram: @formandera
              </a>
            </div>
            <div>
              <a className="links" href="/">
                Twitter: @formandera
              </a>
            </div>
          </div>
          <div
            className="col-lg-4 col-md-4 col-sm-12 mb-3"
            style={{
              justifyItems: "center",
              display: "grid",
            }}>
            <h6 className="text-uppercase font-weight-bold links">Contacto</h6>
            <p className="links">
              Dirección: Calle Principal 123, Ciudad, País
              <br />
              Teléfono: +1234567890 <br />
              Correo electrónico: info@formandera.com
            </p>
          </div>
        </div>
        <div className="footer-copyright text-center">
          © 2024 Copyright: garciacanoalejandro@gmail.com
        </div>
      </div>
    </footer>
  );
}

export default Footer;
