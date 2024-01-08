import { useState } from "react";
import "../css/botones.css";

// Componente botones

//El objetivo de este botón será mostrar el mensaje
//"procesando..." mientras se realiza la petición
export function BotonPeticion(props) {
  const [isCargando, setCargando] = useState(false);

  const handleClick = async () => {
    setCargando(true);
    await props.onClick();
    setCargando(false);
  };

  return (
    <button
      className={props.clase !== undefined ? props.clase : "btn-peticion"}
      disabled={isCargando}
      onClick={!isCargando ? handleClick : null}>
      {isCargando ? "Procesando..." : `${props.texto}`}
    </button>
  );
}

export function BotonCancelar(props) {
  return (
    <button type="button" className="btn-cancelar" onClick={props.onClick}>
      {props.texto}
    </button>
  );
}

export function BotonCrear(props) {
  return (
    <button type="button" className="btn-crear" onClick={props.onClick}>
      {props.texto}
    </button>
  );
}

//Botón para mostrar la información de un turno.
//toma el color de la asignatura asociada.
export function BotonTurno(props) {
  const manejarColor = (asignatura) => {
    if (color[asignatura]) {
      return color[asignatura];
    } else {
      return color["default"];
    }
  };
  const color = {
    Matemáticas: "rgba(255, 0, 0, 0.5)",
    Física: "rgba(0, 215, 60, 0.5)",
    Química: "rgba(0, 0, 255, 0.5)",
    Historia: "rgba(255, 255, 0, 0.5)",
    Literatura: "rgba(128, 0, 128, 0.5)",
    Inglés: "rgba(0, 128, 128, 0.5)",
    Arte: "rgba(255, 165, 0, 0.5)",
    Música: "rgba(255, 99, 71, 0.5)",
    Programación: "rgba(0, 128, 0, 0.5)",
    Biología: "rgba(0,255,0,0.5)",
    Geografía: "rgba(255,120,51,0.5)",
    default: "rgba(65, 65, 158, 0.5)",
  };

  return (
    <button
      className="btn-crear"
      style={{
        backgroundColor: manejarColor(props.asignatura),
        border: "1px solid black",
        color: "black",
      }}
      onClick={props.onClick}>
      {props.texto}
    </button>
  );
}
