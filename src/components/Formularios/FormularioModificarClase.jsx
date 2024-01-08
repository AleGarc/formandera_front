import { useState } from "react";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { MultiSelect } from "react-multi-select-component";
import Form from "react-bootstrap/Form";
import Alerta from "../Alerta";
import { BotonCancelar, BotonPeticion } from "../Botones";

//Formulario para la modificación de la clase
const FormularioModificarClase = (props) => {
  //Para la selección de asignaturas se utiliza un componente externo
  //que permite la selección múltiple de asignaturas
  //https://www.npmjs.com/package/react-multi-select-component

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

  //Estados para controlar los datos del usuario
  const [nombre, setNombre] = useState(props.clase.nombre ?? "");
  const [descripcion, setDescripcion] = useState(props.clase.descripcion ?? "");
  const [precio, setPrecio] = useState(props.clase.precio ?? 0);
  const [ubicacion, setUbicacion] = useState(props.clase.ubicacion ?? "");
  const [asignaturas, setAsignaturas] = useState(
    transformarAsignaturaSelect(props.clase.asignaturas ?? [])
  );

  //Estado para controlar el mensaje de error
  const [errorModificacion, setErrorModificacion] = useState("");

  //Comprobación de parámetros y llamada a la función de completado
  const manejarFormulario = () => {
    setErrorModificacion("");
    if (nombre === "") {
      setErrorModificacion("El nombre no puede estar vacío.");
      return;
    }
    if (descripcion === "") {
      setErrorModificacion("La descripción no puede estar vacía.");
      return;
    }
    if (precio === "") {
      setErrorModificacion("El precio no puede estar vacío.");
      return;
    }
    if (precio < 0) {
      setErrorModificacion("El precio no puede ser negativo.");
      return;
    }
    if (precio > 100) {
      setErrorModificacion("El precio no puede ser mayor de 100€.");
      return;
    }

    if (ubicacion === "") {
      setErrorModificacion("La ubicación no puede estar vacía.");
      return;
    }
    if (asignaturas.length === 0) {
      setErrorModificacion("Las asignaturas no pueden estar vacías.");
      return;
    }

    const precioNumero = Number(precio);

    const data = {
      nombre,
      descripcion,
      precio: precioNumero,
      ubicacion,
      asignaturas: transformarSelectAsignatura(asignaturas),
    };

    props.onCompletado(data);
  };

  //Función para crear una nueva asignatura en el selector
  const manejarNuevaAsignatura = (asignatura) => ({
    label: asignatura,
    value: asignatura,
  });
  return (
    <Row>
      {props.nuevo === true ? <h3>Nueva clase</h3> : <h3>Modificar clase</h3>}
      <hr />
      <Col md={12} lg={6} className="mb-3">
        <label>Nombre</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <label>Descripción</label>
        <Form.Control
          style={{ border: "1px solid gray" }}
          as="textarea"
          rows={10}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </Col>
      {/* Selector de asignaturas*/}
      <Col md={12} lg={6} className="mb-3">
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
        <div className="mb-2">
          <label>Precio €/h {"(Introduce cero para negociar el precio)"}</label>
          <input
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />
        </div>
        <div className="mb-2">
          <label>Ubicación</label>
          <input
            type="text"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
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
              onClick={() => props.onCompletado(null)}
            />
          </div>
          <BotonPeticion
            texto={props.nuevo === true ? "Crear clase" : "Modificar clase"}
            onClick={() => manejarFormulario()}
          />
        </div>
      </Col>
    </Row>
  );
};

export default FormularioModificarClase;
