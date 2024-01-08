import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import Clase from "./Clase";
import Perfil from "./Perfil";
import Logout from "./Logout";

function Aplicacion() {
  return (
    <div className="Aplicacion">
      <Routes>
        <Route path="/" element={<h1>Inicio</h1>} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/clase/:id" element={<Clase />} />
        <Route path="/usuario/:id" element={<Perfil />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </div>
  );
}
export default Aplicacion;
