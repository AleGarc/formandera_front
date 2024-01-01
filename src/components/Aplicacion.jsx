import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Horario from "./Horario";

function Aplicacion() {
  return (
    <div className="Aplicacion">
      <Routes>
        <Route path="/" element={<Horario />} />

        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}
export default Aplicacion;
