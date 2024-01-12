import Container from "react-bootstrap/esm/Container";

const NotFound = () => {
  return (
    <Container style={{ height: "700px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "200px",
        }}>
        <h1>404</h1>
        <h2>Página no encontrada</h2>
        <p>Lo que buscabas no se ha encontrado.</p>
      </div>
    </Container>
  );
};

export default NotFound;
