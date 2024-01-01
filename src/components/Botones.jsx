import { useState } from "react";
import "../css/botones.css";

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
    <button className="btn-crear" onClick={props.onClick}>
      {props.texto}
    </button>
  );
}
