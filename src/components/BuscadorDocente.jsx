import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import "../css/buscador.css";
import { BotonCrear, BotonPeticion } from "./Botones";
import { useState } from "react";

import { API_KEY } from "../javascript/api";
import { NAV_KEY } from "../javascript/api";
import { EtiquetaAsignatura, EtiquetaGalardones } from "./Etiqueta";
import { MultiSelect } from "react-multi-select-component";

const Resultado = ({ docente }) => {
  return (
    <div className="resultado" key={docente.idPublico}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h4 className="nombre-docente">{docente.nombre}</h4>
      </div>
      <hr />

      <Row>
        <Col xs={12} className="mb-3">
          <div className="contenedor-datos-individuales mb-1">
            <label className="etiqueta-datos-docente">Nombre de usuario:</label>
            <label className="valor-datos-docente">{docente.username}</label>
          </div>
        </Col>
        <Col xs={12} className="mb-3">
          <label className="etiqueta-datos-docente">Biografía:</label>
          <div className="etiqueta-descripcion-docente">
            {docente.biografia ? docente.biografia : "Sin biografía"}
          </div>
        </Col>
      </Row>
      <div style={{ display: "flex", flexWrap: "wrap" }} className="mb-3">
        <label
          style={{ marginRight: "10px" }}
          className="etiqueta-datos-docente">
          Formación:
        </label>
        {docente.educacion.length > 0 ? (
          docente.educacion.map((edu) => (
            <EtiquetaGalardones texto={edu} key={docente.idPublico + edu} />
          ))
        ) : (
          <label className="valor-datos-docente">Sin formación.</label>
        )}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap" }} className="mb-3">
        <label
          style={{ marginRight: "10px" }}
          className="etiqueta-datos-docente">
          Experiencia:
        </label>
        {docente.experiencia.length > 0 ? (
          docente.experiencia.map((exp) => (
            <EtiquetaGalardones texto={exp} key={docente.idPublico + exp} />
          ))
        ) : (
          <label className="valor-datos-docente">Sin experiencia.</label>
        )}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap" }} className="mb-3">
        <label
          style={{ marginRight: "10px" }}
          className="etiqueta-datos-docente">
          Asignaturas:
        </label>
        {docente.asignaturas.length > 0 ? (
          docente.asignaturas.map((asignatura) => (
            <EtiquetaAsignatura
              texto={asignatura}
              key={docente.idPublico + asignatura}
            />
          ))
        ) : (
          <label className="valor-datos-docente">
            Sin asignaturas establecidas.
          </label>
        )}
      </div>
      <div className="mt-3">
        <BotonCrear
          key={docente.idPublico + "boton"}
          texto="Ver docente"
          onClick={() =>
            (window.location.href = NAV_KEY + "/usuario/" + docente.idPublico)
          }
        />
      </div>
    </div>
  );
};

const BuscadorDocente = () => {
  const [isFiltrando, setIsFiltrando] = useState(false);

  const [keyword, setKeyword] = useState("");

  const take = 5;
  const [skip, setSkip] = useState(0);

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

  //Mapeo de las asignaturas del docente a etiquetas del selector

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

  const [asignaturas, setAsignaturas] = useState(
    transformarAsignaturaSelect([])
  );

  //Función para crear una nueva asignatura en el selector
  const manejarNuevaAsignatura = (asignatura) => ({
    label: asignatura,
    value: asignatura,
  });

  const [primeraBusqueda, setPrimeraBusqueda] = useState(true);
  const [resultados, setResultados] = useState([]);
  const [query, setQuery] = useState("");
  let paginando = false;
  const [finPaginacion, setFinPaginacion] = useState(false);

  function manejarPaginacion() {
    paginando = true;
    manejarBusqueda();
  }

  function manejarBusqueda() {
    let nuevaQuery = "?keyword=" + keyword + "&tipo=docente";
    if (isFiltrando && asignaturas.length !== 0) {
      nuevaQuery =
        nuevaQuery + "&asignaturas=" + transformarSelectAsignatura(asignaturas);
    }

    let incr = skip;

    if (query === nuevaQuery && paginando) {
      incr = skip + take;
      setSkip(incr);
    } else {
      setSkip(0);
      incr = 0;
      paginando = false;
      setQuery(nuevaQuery);
      setFinPaginacion(false);
    }

    nuevaQuery = nuevaQuery + "&take=" + take + "&skip=" + incr;

    fetch(API_KEY + "/usuario/" + nuevaQuery)
      .then((res) => res.json())
      .then((datos) => {
        if (datos.data.length < take) setFinPaginacion(true);
        if (paginando) {
          const nuevosResultados = [...resultados, ...datos.data];
          setResultados(nuevosResultados);
        } else setResultados(datos.data);
        if (primeraBusqueda) {
          setPrimeraBusqueda(false);
        }
      });
  }

  function onEnter(event) {
    if (event.key === "Enter") {
      manejarBusqueda();
    }
  }

  return (
    <Container className="mt-5">
      <Row>
        <div>
          <h1>Buscar docentes</h1>
          <hr></hr>
        </div>
        <Col xs={12} sm={isFiltrando ? 3 : 1} className="mb-3">
          <BotonCrear
            texto={isFiltrando ? "Ocultar filtros" : "Filtrar"}
            onClick={() => setIsFiltrando(!isFiltrando)}
          />
          {isFiltrando && (
            <div className="contenedor-filtros mt-3">
              <h3>Filtros</h3>
              <hr />
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
            </div>
          )}
        </Col>
        <Col xs={12} sm={isFiltrando ? 9 : 11} className="mb-5">
          <div className="contenedor-buscador mb-5">
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                onKeyUp={onEnter}
                value={keyword}
                placeholder="Profesor de música"
                style={{ marginBottom: "0px" }}
                onChange={(e) => setKeyword(e.target.value)}></input>
              <BotonPeticion texto="Buscar" onClick={manejarBusqueda} />
            </div>
          </div>
          <div className="contenedor-resultados-docentes">
            {resultados.map((resultado, index) => (
              <Resultado docente={resultado} key={index} />
            ))}
          </div>
          {resultados.length !== 0 && !finPaginacion && (
            <div
              className="mt-5"
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}>
              <div style={{ width: "200px" }}>
                <BotonCrear texto="Cargar más" onClick={manejarPaginacion} />
              </div>
            </div>
          )}
          {primeraBusqueda && (
            <div className="mensaje-primera-busqueda">
              <h1 style={{ color: "rgba(0,0,0,0.6)" }}>
                {" "}
                Aún no hay nada por aqui...
              </h1>
              <h5 style={{ color: "rgba(0,0,0,0.9)", fontWeight: "lighter" }}>
                No olvides usar los filtros para mayor control sobre tu búsqueda
              </h5>
            </div>
          )}
          {resultados.length === 0 && !primeraBusqueda && (
            <div className="mensaje-primera-busqueda">
              <h1 style={{ color: "rgba(0,0,0,0.6)" }}>
                {" "}
                No existen coincidencias
              </h1>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default BuscadorDocente;
