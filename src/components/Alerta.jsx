import Alert from "react-bootstrap/Alert";

function Alerta(props) {
  return (
    <div className="mt-3">
      <Alert variant={props.tipo}>
        <p>{props.mensaje}</p>
      </Alert>
    </div>
  );
}

export default Alerta;
