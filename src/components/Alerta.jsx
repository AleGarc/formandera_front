import Alert from "react-bootstrap/Alert";

function Alerta(props) {
  return (
    <Alert variant={props.tipo}>
      <p>{props.mensaje}</p>
    </Alert>
  );
}

export default Alerta;
