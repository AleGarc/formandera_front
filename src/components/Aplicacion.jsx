import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Horario from "./Horario";
import Home from "./Home";
import Clase from "./Clase";

function Aplicacion() {
  return (
    <div className="Aplicacion">
      <Routes>
        <Route path="/" element={<Horario />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/clase/:id" element={<Clase />} />
      </Routes>
    </div>
  );
}
export default Aplicacion;
