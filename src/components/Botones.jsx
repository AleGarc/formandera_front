import { useState } from "react";

export function BotonPeticion(props) {
  const [isCargando, setCargando] = useState(false);

  const handleClick = async () => {
    const datos = props.onClick();
    console.log(datos);
    setCargando(true);
    try {
      const respuesta = await fetch("http://localhost:3001/clases", {
        method: "POST",
        body: JSON.stringify(datos),
        headers: { "Content-Type": "application/json" },
      });
      const texto = await respuesta.text();
      console.log(texto);
      props.onRespuesta("success", "Horario creado con éxito.");
    } catch (error) {
      props.onRespuesta(
        "danger",
        "Hubo un error durante su petición. Inténtelo de nuevo más tarde."
      );
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div>
      <button
        className="btn-crear"
        disabled={isCargando}
        onClick={!isCargando ? handleClick : null}>
        {isCargando ? "Procesando..." : `${props.texto}`}
      </button>
    </div>
  );
}

export function BotonCancelar(props) {
  return (
    <div>
      <button className="btn-cancelar" onClick={props.onClick}>
        {props.texto}
      </button>
    </div>
  );
}
