import Col from "react-bootstrap/esm/Col";
import { BotonCancelar, BotonCrear, BotonPeticion } from "../Botones";
import { EtiquetaGalardonesModificando } from "../Etiqueta";
import { MultiSelect } from "react-multi-select-component";
import Alerta from "../Alerta";
import Row from "react-bootstrap/esm/Row";
import { useState } from "react";

//Formulario para la modificación de un usuario
const FormularioDocente = ({ docente, onCompletado }) => {
  const asignaturasArray = [
    { label: "Matemáticas", value: "Matemáticas" },
    { label: "Física", value: "Física" },
    { label: "Química", value: "Química" },
    { label: "Historia", value: "Historia" },
    { label: "Literatura", value: "Literatura" },
    { label: "Inglés", value: "Inglés" },
    { label: "Arte", value: "Arte" },
    { label: "Música", value: "Música" },
    { label: "Programación", value: "Programación" },
    { label: "Biología", value: "Biología" },
    { label: "Geografía", value: "Geografía" },
  ];

  //Mapeo de las asignaturas de la clase a etiquetas del selector

  const transformarAsignaturaSelect = (asignaturas) => {
    const asignaturasEstablecidas = asignaturas.map((asignatura) => {
      return { label: asignatura, value: asignatura };
    });
    return asignaturasEstablecidas;
  };

  //Mapeo de las asignaturas seleccionadas en el selector a un array de strings

  const transformarSelectAsignatura = (asignaturasSelect) => {
    const asignaturasElegidas = asignaturasSelect.map((asignatura) => {
      return asignatura.value;
    });
    return asignaturasElegidas;
  };

  //Estados para controlar los datos del docente

  const [asignaturas, setAsignaturas] = useState(
    transformarAsignaturaSelect(docente.asignaturas ?? [])
  );
  const [educacion, setEducacion] = useState(docente.educacion ?? "");
  const [experiencia, setExperiencia] = useState(docente.experiencia ?? "");

  //Estado para controlar el mensaje de error
  const [errorModificacion, setErrorModificacion] = useState("");

  //Función para crear una nueva asignatura en el selector
  const manejarNuevaAsignatura = (asignatura) => ({
    label: asignatura,
    value: asignatura,
  });

  const [inputEducacion, setInputEducacion] = useState("");

  const agregarEducacion = () => {
    if (inputEducacion === "") {
      setErrorModificacion("La educación no puede estar vacía.");
      return;
    }
    setErrorModificacion("");
    if (educacion.includes(inputEducacion)) {
      setErrorModificacion("Ya has añadido esa educación.");
    } else {
      setEducacion([...educacion, inputEducacion]);
      setInputEducacion("");
    }
  };

  const [inputExperiencia, setInputExperiencia] = useState("");

  const agregarExperiencia = () => {
    if (inputExperiencia === "") {
      setErrorModificacion("La experiencia no puede estar vacía.");
      return;
    }
    setErrorModificacion("");
    if (experiencia.includes(inputExperiencia)) {
      setErrorModificacion("Ya has añadido esa experiencia.");
    } else {
      setExperiencia([...experiencia, inputExperiencia]);
      setInputExperiencia("");
    }
  };

  const borrarEducacion = (_educacion) => {
    const educacionNueva = educacion.filter((edu) => edu !== _educacion);
    setEducacion(educacionNueva);
  };

  const borrarExperiencia = (_experiencia) => {
    const experienciaNueva = experiencia.filter((exp) => exp !== _experiencia);
    setExperiencia(experienciaNueva);
  };

  //Comprobación de parámetros y llamada a la función de completado
  const manejarFormulario = async () => {
    setErrorModificacion("");
    if (asignaturas.length === 0) {
      setErrorModificacion("Las asignaturas no pueden estar vacías.");
      return;
    }

    const data = {
      educacion,
      experiencia,
      asignaturas: transformarSelectAsignatura(asignaturas),
    };

    onCompletado(data);
  };

  return (
    <Row>
      <h3>Detalles del docente</h3>

      <hr />
      <Col md={12} lg={12} className="mb-3">
        <label>Educación</label>
        {educacion ? (
          educacion.map((edu) => {
            return (
              <EtiquetaGalardonesModificando
                texto={edu}
                key={edu}
                onClick={() => borrarEducacion(edu)}
              />
            );
          })
        ) : (
          <p>Sin educación</p>
        )}
        <div className="mt-3">
          <label>Añadir educación</label>
          <input
            type="text"
            value={inputEducacion}
            onChange={(e) => setInputEducacion(e.target.value)}
          />
          <div>
            <BotonCrear texto="Añadir" onClick={agregarEducacion} />
          </div>
        </div>
      </Col>
      <hr></hr>
      <Col md={12} lg={12} className="mb-3">
        <label>Experiencia</label>
        {experiencia ? (
          experiencia.map((exp) => (
            <EtiquetaGalardonesModificando
              texto={exp}
              key={exp}
              onClick={() => borrarExperiencia(exp)}
            />
          ))
        ) : (
          <p>Sin experiencia</p>
        )}
        <div className="mt-3">
          <label>Añadir experiencia</label>
          <input
            type="text"
            value={inputExperiencia}
            onChange={(e) => setInputExperiencia(e.target.value)}
          />
          <div>
            <BotonCrear texto="Añadir" onClick={agregarExperiencia} />
          </div>
        </div>
      </Col>
      <hr></hr>
      <Col xs={12} className="mb-3">
        <div className="mb-3">
          <label>Asignaturas {"(Escribe para crear nueva)"}</label>
          <MultiSelect
            options={asignaturasArray}
            value={asignaturas}
            onChange={setAsignaturas}
            labelledBy={"Select"}
            isCreatable={true}
            onCreateOption={manejarNuevaAsignatura}
          />
        </div>
      </Col>

      {/* Mostrado de alerta con error de modificación*/}
      <Col xs={12}>
        {errorModificacion && (
          <Alerta tipo="danger" mensaje={errorModificacion}></Alerta>
        )}
        <div style={{ display: "flex", gap: "10px", justifyContent: "end" }}>
          <div>
            <BotonCancelar
              texto="Cancelar"
              onClick={() => onCompletado(null)}
            />
          </div>
          <BotonPeticion
            texto="Modificar"
            onClick={() => manejarFormulario()}
          />
        </div>
      </Col>
    </Row>
  );
};

export default FormularioDocente;
