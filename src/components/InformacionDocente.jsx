import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import logo_formandera from "../images/formandera-logo.webp";

const InformacionDocente = () => {
  return (
    <Row>
      <div
        style={{ display: "flex", justifyContent: "center" }}
        className=" mt-5">
        <h2>¿Buscas más alumnos?</h2>
      </div>
      <Col
        xs={12}
        className="mt-3 mb-5"
        style={{ display: "flex", justifyContent: "center" }}>
        <img
          style={{ width: "300px" }}
          src={logo_formandera}
          alt="logo-formandera"
        />
      </Col>
      <Col xs={12} md={6}>
        <div className="seccion">
          <h5 className="titulo-parrafo ">
            Destaca tus Clases Particulares y Aumenta tu Visibilidad
          </h5>
          <hr className="separador-parrafo "></hr>
          <div className="parrafo">
            Formandera es la plataforma perfecta para docentes que desean
            expandir su alcance y atraer a más alumnos a sus clases
            particulares. Aprovecha nuestras funciones diseñadas para destacar
            tus habilidades y captar la atención de posibles estudiantes.
          </div>
        </div>
      </Col>
      <Col xs={12} md={6}>
        <div className="seccion">
          <h5 className="titulo-parrafo ">
            Perfil Personalizado y Profesional
          </h5>
          <hr style={{ width: "70%" }}></hr>
          <div className="parrafo">
            Crea un perfil único que muestre tu experiencia, habilidades y
            pasión por la enseñanza. Agrega detalles sobre tus métodos de
            enseñanza, áreas de especialización y logros académicos para que los
            estudiantes tengan una visión completa de lo que ofreces.
          </div>
        </div>
      </Col>
      <Col xs={12} md={6}>
        <div className="seccion">
          <h5 className="titulo-parrafo ">Galería de Clases Atractiva</h5>
          <hr className="separador-parrafo "></hr>
          <div className="parrafo">
            Presenta tus clases de manera atractiva mediante una galería visual
            que destaque los aspectos más emocionantes y valiosos de tu
            contenido educativo. Las imágenes y descripciones detalladas
            captarán la atención de los estudiantes interesados.
          </div>
        </div>
      </Col>
      <Col xs={12} md={6}>
        <div className="seccion">
          <h5 className="titulo-parrafo ">
            Horarios Flexibles y Fáciles de Gestionar
          </h5>
          <hr className="separador-parrafo "></hr>
          <div className="parrafo">
            Define tus propios horarios de clases particulares de manera
            flexible. Formandera facilita la gestión de turnos, permitiéndote
            adaptar tu disponibilidad y proporcionar opciones que se ajusten a
            las necesidades de los alumnos.
          </div>
        </div>
      </Col>
      <Col xs={12} md={6}>
        <div className="seccion">
          <h5 className="titulo-parrafo ">Reseñas y Testimonios</h5>
          <hr className="separador-parrafo "></hr>
          <div className="parrafo">
            Construye tu reputación a través de reseñas y testimonios de
            estudiantes satisfechos. Las experiencias positivas compartidas por
            otros pueden ser la clave para ganarte la confianza de nuevos
            alumnos.
          </div>
        </div>
      </Col>
      <Col xs={12} md={6}>
        <div className="seccion">
          <h5 className="titulo-parrafo ">Promoción en Redes Sociales</h5>
          <hr className="separador-parrafo "></hr>
          <div className="parrafo">
            Formandera te ayuda a promocionar tus clases particulares en las
            redes sociales de manera automatizada. Alcanza a una audiencia más
            amplia y genera interés entre posibles estudiantes.
          </div>
        </div>
      </Col>

      <Col xs={12}>
        <div className="seccion">
          <h5 className="titulo-parrafo ">
            Notificaciones Instantáneas de Interés
          </h5>
          <hr className="separador-parrafo "></hr>
          <div className="parrafo">
            Recibe notificaciones instantáneas cuando un estudiante expresa
            interés en tus clases. Mantente al tanto de las solicitudes y
            comunícate de manera eficiente para convertir posibles alumnos en
            estudiantes comprometidos. Formandera no solo es una plataforma, es
            tu aliado para construir una exitosa carrera educativa. ¡Únete a
            nosotros y haz que tu experiencia de enseñanza brille en la
            comunidad educativa!
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default InformacionDocente;
