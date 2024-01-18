import Container from "react-bootstrap/esm/Container";
import Carousel from "react-bootstrap/Carousel";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import img_docentes from "../images/docentes.webp";
import img_libros from "../images/libros.webp";
import img_estudiantes from "../images/estudiantes.webp";
import icon_docente from "../images/docente-icon.webp";
import icon_clase from "../images/clase2-icon.webp";
import icon_estudiar from "../images/estudiar-icon.webp";
import "../css/inicio.css";
import { BotonCrear } from "./Botones";
import { NAV_KEY } from "../javascript/api";

const Inicio = () => {
  return (
    <div>
      <Container>
        <h1 className="titulo-formandera">Formandera</h1>
        <label className="subtitulo">Educación a la vuelta de la esquina</label>

        <div className="contenedor-carrusel mt-4">
          <Carousel className="carrusel mb-5">
            <Carousel.Item interval={8000}>
              <img src={img_docentes} alt="First slide" />
              <Carousel.Caption className="carrusel-caption">
                <h3>Los profesor más cualificados</h3>
                <p>Docentes con ganas de enseñarte lo que necesitas</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item interval={8000}>
              <img src={img_libros} alt="First slide" />
              <Carousel.Caption className="carrusel-caption">
                <h3>Docenas de asignaturas y disciplinas</h3>
                <p>Encuentra la clase que se adapte a tí</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item interval={8000}>
              <img src={img_estudiantes} alt="First slide" />
              <Carousel.Caption className="carrusel-caption">
                <h3>Rodéate de quien necesites</h3>
                <p>
                  Conoce a otros estudiantes que estén en tu misma situación
                </p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
          <div className="buscar-clases">
            <h3 className="rotulo-2">¡Encuentra tu próxima clase!</h3>
            <div style={{ width: "250px" }} className="mt-3">
              <BotonCrear
                texto="Buscar clases"
                onClick={() => (window.location.href = NAV_KEY + "/clases")}
              />
            </div>
          </div>
        </div>
      </Container>
      <Container fluid className="fondo">
        <Container className="contenedor-secciones">
          <h1 className="titulo-seccion-formandera mt-5 mb-5">
            ¿Por qué usar Formandera?
          </h1>
          <p className="seccion-texto">
            Desde su lanzamiento, Formandera se ha destacado por ofrecer una
            amplia variedad de opciones educativas, abarcando diversas materias
            y niveles académicos. Nuestra plataforma proporciona un entorno
            dinámico donde los estudiantes pueden encontrar profesores
            especializados que se adapten a sus necesidades específicas de
            aprendizaje. Además, hemos implementado herramientas innovadoras que
            facilitan la programación de clases, la comunicación en tiempo real
            y el seguimiento del progreso académico.
          </p>
          <p className="seccion-texto">
            Con un enfoque centrado en la calidad y la eficiencia, Formandera se
            esfuerza por asegurar que cada interacción educativa sea
            enriquecedora y significativa. La retroalimentación constante de
            nuestros usuarios y la colaboración con educadores expertos nos
            permiten mejorar continuamente la plataforma, garantizando así
            experiencias de aprendizaje excepcionales.
          </p>
          <p className="seccion-texto">
            Además de conectar a estudiantes y profesores, Formandera también se
            ha convertido en una comunidad educativa vibrante. A través de
            foros, eventos y recursos educativos compartidos, fomentamos la
            colaboración y el intercambio de conocimientos entre los miembros de
            nuestra comunidad. Esta red de apoyo adicional contribuye a la
            construcción de relaciones duraderas y al enriquecimiento mutuo en
            el viaje educativo de cada participante.
          </p>
          <p className="seccion-texto">
            En el futuro, Formandera se compromete a seguir innovando y
            expandiendo sus servicios para seguir siendo líder en la
            facilitación del aprendizaje personalizado. Con una visión clara de
            empoderar a estudiantes y profesores, aspiramos a ser la primera
            elección cuando se trata de clases particulares, contribuyendo así
            al crecimiento continuo y al éxito académico de miles de individuos
            en todo el mundo.
          </p>
        </Container>
      </Container>
      <Container fluid className="fondo">
        <Container className="contenedor-secciones">
          <h1 className="titulo-seccion-formandera">Nuestros Objetivos</h1>
          <Row className="mt-5">
            <Col xs={12} md={6} lg={4} className="mb-3">
              <div className="objetivo-formandera">
                <div className="icono">
                  <img
                    src={icon_docente}
                    alt="Icono de docente"
                    width={"60px"}
                    height={"60px"}
                  />
                </div>
                <div>
                  <h3>Docentes cualificados</h3>
                  <p>Los profesores más experimentados del sector.</p>
                </div>
              </div>
              <p className="descripcion-objetivo">
                Formandera se compromete a proporcionar a sus usuarios acceso
                exclusivo a docentes altamente cualificados y experimentados en
                sus respectivas áreas. Nuestra plataforma valora la excelencia
                académica y se esfuerza por reunir a los profesionales más
                destacados del sector educativo. Estos maestros no solo aportan
                una profunda comprensión de sus materias, sino también una
                pasión por la enseñanza que transforma cada sesión en una
                experiencia educativa enriquecedora. La calidad de la enseñanza
                es un pilar fundamental en Formandera, y nos enorgullece ofrecer
                a los estudiantes la oportunidad de aprender de los mejores.
              </p>
            </Col>
            <Col xs={12} md={6} lg={4} className="mb-3">
              <div className="objetivo-formandera">
                <div className="icono">
                  <img
                    src={icon_clase}
                    alt="Icono de clase"
                    width={"45px"}
                    height={"45px"}
                  />
                </div>
                <div>
                  <h3>Clases de calidad</h3>
                  <p>
                    Las clases particulares más recomendadas por los estudiantes
                  </p>
                </div>
              </div>
              <p className="descripcion-objetivo">
                Nos dedicamos a brindar clases particulares que son recomendadas
                de manera unánime por los estudiantes. Nos esforzamos por
                asegurar que cada sesión sea una experiencia educativa efectiva
                y positiva. Nuestros docentes se destacan por su capacidad para
                impartir conocimientos de manera clara y comprensible,
                adaptándose a las necesidades individuales de cada estudiante.
                El icono de clase en nuestra plataforma representa no solo la
                calidad de la instrucción, sino también la satisfacción de los
                estudiantes que han experimentado un crecimiento significativo
                en su aprendizaje.
              </p>
            </Col>
            <Col xs={12} md={6} lg={4} className="mb-5">
              <div className="objetivo-formandera">
                <div className="icono">
                  <img
                    src={icon_estudiar}
                    alt="Icono de estudiar"
                    width={"50px"}
                    height={"50px"}
                  />
                </div>
                <div>
                  <h3>Aprendizaje personal</h3>
                  <p>Entiende los conocimientos a tu ritmo, sin prisas.</p>
                </div>
              </div>
              <p className="descripcion-objetivo">
                Entendemos que cada estudiante es único, con ritmos y estilos de
                aprendizaje distintos. Por ello, promovemos un enfoque de
                aprendizaje personalizado que permite a los alumnos comprender
                los conocimientos a su propio ritmo, sin presiones innecesarias.
                El icono de estudiar simboliza este compromiso con un
                aprendizaje adaptado a las necesidades individuales, fomentando
                la comprensión profunda y duradera de los conceptos. Creemos en
                empoderar a los estudiantes para que tomen el control de su
                educación, facilitando un entorno donde puedan florecer y
                alcanzar su máximo potencial.
              </p>
            </Col>
          </Row>
        </Container>
      </Container>
    </div>
  );
};

export default Inicio;
