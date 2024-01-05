import Container from "react-bootstrap/esm/Container";
import { CartaClases } from "./Carta";
import "../css/home.css";

const Home = () => {
  return (
    <Container className={"mt-5"} style={{ height: "700px" }}>
      <div>
        <h1>Tu sitio</h1>
        <hr></hr>
      </div>
      <h3>Tus clases particulares</h3>
      <div className="grid-container">
        <CartaClases />
        <CartaClases />
        <CartaClases />
        <CartaClases />
        <CartaClases />
        <CartaClases />
        <CartaClases />
      </div>
    </Container>
  );
};

export default Home;
