import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import "../css/buscador.css";
import { BotonCrear, BotonPeticion } from "./Botones";
import { useState } from "react";

import { BsStarFill } from "react-icons/bs";

import { API_KEY } from "../javascript/api";
import { NAV_KEY } from "../javascript/api";
import { EtiquetaAsignatura } from "./Etiqueta";
import { MultiSelect } from "react-multi-select-component";

const Resultado = ({ clase }) => {
  return (
    <div className="resultado" key={clase.idPublico}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h4 className="nombre-clase">{clase.nombre}</h4>

        {clase.num_comentarios !== 0 ? (
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <h4 style={{ margin: "0px" }} className="calificacion">
              {clase.calificacion}
            </h4>
            <BsStarFill
              className="estrella"
              key={clase.idPublico + "estrella"}
            />
          </div>
        ) : (
          <h4 style={{ margin: "0px" }} className="no-calificacion">
            N/A
          </h4>
        )}
      </div>
      <hr />

      <Row>
        <Col xs={12} sm={12} md={6} lg={9} className="mb-3">
          <label className="etiqueta-datos-clase">Descripción:</label>
          <div className="etiqueta-descripcion-clase">{clase.descripcion}</div>
        </Col>
        <Col xs={12} sm={12} md={6} lg={3} className="mb-3">
          <div className="contenedor-datos-individuales mb-1">
            <label className="etiqueta-datos-clase">Precio:</label>
            <label className="valor-datos-clase">
              {clase.precio !== 0 ? clase.precio + "€/h" : "Negociable"}
            </label>
          </div>
          <div className="contenedor-datos-individuales mb-1">
            <label className="etiqueta-datos-clase">Ubicación:</label>
            <label className="valor-datos-clase">{clase.ubicacion}</label>
          </div>
        </Col>
      </Row>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <label style={{ marginRight: "10px" }} className="etiqueta-datos-clase">
          Asignaturas:
        </label>
        {clase.asignaturas.map((asignatura) => (
          <EtiquetaAsignatura
            texto={asignatura}
            key={clase.idPublico + asignatura}
          />
        ))}
      </div>
      <div className="mt-3">
        <BotonCrear
          key={clase.idPublico + "boton"}
          texto="Ver clase"
          onClick={() =>
            (window.location.href = NAV_KEY + "/clase/" + clase.idPublico)
          }
        />
      </div>
    </div>
  );
};

const Buscador = () => {
  const [isFiltrando, setIsFiltrando] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [precioMin, setPrecioMin] = useState(0);
  const [precioMax, setPrecioMax] = useState(100);

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
    let nuevaQuery = "?keyword=" + keyword;
    if (isFiltrando) {
      nuevaQuery =
        nuevaQuery + "&precioMin=" + precioMin + "&precioMax=" + precioMax;
      if (asignaturas.length !== 0) {
        nuevaQuery =
          nuevaQuery +
          "&asignaturas=" +
          transformarSelectAsignatura(asignaturas);
      }
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

    fetch(API_KEY + "/clase/" + nuevaQuery)
      .then((res) => res.json())
      .then((datos) => {
        const promesas = datos.data.map((clase) =>
          fetch(API_KEY + "/valoracion/" + clase.idPublico)
            .then((res) => res.json())
            .then((val) => {
              clase.calificacion = val.calificacion;
              clase.num_comentarios = val.comentarios.length;
            })
        );
        Promise.all(promesas).then(() => {
          if (datos.data.length < take) setFinPaginacion(true);
          if (paginando) {
            const nuevosResultados = [...resultados, ...datos.data];
            setResultados(nuevosResultados);
          } else setResultados(datos.data);
          if (primeraBusqueda) {
            setPrimeraBusqueda(false);
          }
        });
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
          <h1>Buscar clases</h1>
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
              <div className="mb-3">
                <label>Precio mínimo: {precioMin}€/h</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={precioMin}
                  style={{
                    marginBottom: "3px",
                    accentColor: "rgb(35, 34, 47)",
                  }}
                  onChange={(e) => {
                    if (e.target.value <= precioMax)
                      setPrecioMin(e.target.value);
                  }}
                />
              </div>
              <div className="mb-3">
                <label>Precio máximo: {precioMax}€/h</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={precioMax}
                  style={{
                    marginBottom: "3px",
                    accentColor: "rgb(35, 34, 47)",
                  }}
                  onChange={(e) => {
                    if (e.target.value >= precioMin)
                      setPrecioMax(e.target.value);
                  }}
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
                placeholder="Matemáticas en Murcia"
                style={{ marginBottom: "0px" }}
                onChange={(e) => setKeyword(e.target.value)}></input>
              <BotonPeticion texto="Buscar" onClick={manejarBusqueda} />
            </div>
          </div>
          <div className="contenedor-resultados">
            {resultados.map((resultado, index) => (
              <Resultado clase={resultado} key={index} />
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

export default Buscador;
