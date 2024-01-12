import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import Clase from "./Clase";
import Perfil from "./Perfil";
import Logout from "./Logout";
import Buscador from "./Buscador";
import BuscadorDocente from "./BuscadorDocente";
import Inicio from "./Inicio";
import NotFound from "./NotFound";

function Aplicacion() {
  return (
    <div className="Aplicacion">
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/clases" element={<Buscador />} />
        <Route path="/docentes" element={<BuscadorDocente />} />
        <Route path="/clase/:id" element={<Clase />} />
        <Route path="/usuario/:id" element={<Perfil />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
export default Aplicacion;
