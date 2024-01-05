import "../css/etiqueta.css";

export const EtiquetaAsignatura = (props) => {
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
    Literatura: "rgba(128, 0, 128, 0.5)", // Púrpura
    Inglés: "rgba(0, 128, 128, 0.5)", // Verde azulado
    Arte: "rgba(255, 165, 0, 0.5)", // Naranja
    Música: "rgba(255, 99, 71, 0.5)", // Rosa claro
    Programación: "rgba(0, 128, 0, 0.5)", // Verde oscuro
    Biología: "rgba(0,255,0,0.5)", // Rojo coral
    Geografía: "rgba(255,120,51,0.5)",
    default: "rgba(65, 65, 158, 0.3)",
  };

  return (
    <div className="etiqueta" style={{ background: manejarColor(props.texto) }}>
      <label style={{ margin: "0px" }}>{props.texto}</label>
    </div>
  );
};

export const EtiquetaGalardones = (props) => {
  return (
    <div className="etiqueta-galardones">
      <label style={{ margin: "0px" }}>{props.texto}</label>
    </div>
  );
};
