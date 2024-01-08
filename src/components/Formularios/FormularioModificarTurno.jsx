import { useEffect, useMemo, useState } from "react";
import { checkHoras } from "../../javascript/validaciones";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Alerta from "../Alerta";
import { BotonCancelar, BotonPeticion } from "../Botones";

//Formulario de creación y modificado de un turno
const FormularioModificarTurno = (props) => {
  //El mensaje de advertencia indica que la dependencia asignaturas en el
  //array de dependencias del useEffect cambia en cada renderizado, lo
  //cual podría llevar a efectos inesperados. Para solucionar esto,
  //puedes utilizar useMemo para calcular asignaturas solo cuando
  //cambie la dependencia que lo afecta. Aquí tienes cómo podrías hacerlo:
  const asignaturas = useMemo(
    () => [
      "Matemáticas",
      "Física",
      "Química",
      "Historia",
      "Literatura",
      "Inglés",
      "Arte",
      "Música",
      "Programación",
      "Biología",
      "Geografía",
      "Variado",
      "Otro",
    ],
    []
  );

  //Control de si se introduce una asignatura nueva. Cuando
  //se selecciona la asignatura "Otro", se muestra un campo nuevo
  const [otraAsignatura, setOtraAsignatura] = useState("");
  const [mostrarOtraAsignatura, setMostrarOtraAsignatura] = useState(false);

  //Efecto para establecimiento de la asignatura acorde al turno
  //teniendo en cuenta el uso de la asignatura "Otro".
  useEffect(() => {
    if (props.turno.asignatura === undefined) {
      setAsignatura("Matemáticas");
      setMostrarOtraAsignatura(false);
    } else if (!asignaturas.includes(props.turno.asignatura)) {
      setOtraAsignatura(props.turno.asignatura);
      setAsignatura("Otro");
      setMostrarOtraAsignatura(true);
    } else {
      setAsignatura(props.turno.asignatura);
    }
    setDia(props.turno.dia);
  }, [props.turno, asignaturas]);

  //Estados para controlar los datos del turno
  const [asignatura, setAsignatura] = useState(
    props.turno.asignatura ?? "Matemáticas"
  );
  const [dia, setDia] = useState(props.turno.dia ?? "Lunes");
  const [horaInicio, setHoraInicio] = useState(props.turno.horaInicio ?? "");
  const [horaFin, setHoraFin] = useState(props.turno.horaFin ?? "");
  const [alumnosMax, setAlumnosMax] = useState(props.turno.alumnosMax ?? 1);

  //Estado para controlar el mensaje de error
  const [errorModificacion, setErrorModificacion] = useState("");

  //Función para controlar el cambio de asignatura
  const seleccionarAsignatura = (e) => {
    setAsignatura(e.target.value);
    if (e.target.value === "Otro") {
      setMostrarOtraAsignatura(true);
    } else setMostrarOtraAsignatura(false);
  };

  //Función para controlar el envío del formulario
  //control de parámetros y llamada a la función de completado
  const manejarFormulario = () => {
    setErrorModificacion("");
    if (asignatura === "") {
      setErrorModificacion("La asignatura no puede estar vacía.");
      return;
    }
    if (dia === "") {
      setErrorModificacion("El día no puede estar vacío.");
      return;
    }
    if (horaInicio === "") {
      setErrorModificacion("La hora de inicio no puede estar vacía.");
      return;
    }
    if (horaFin === "") {
      setErrorModificacion("La hora de fin no puede estar vacía.");
      return;
    }
    if (alumnosMax === "") {
      setErrorModificacion("El número de alumnos no puede estar vacío.");
      return;
    }
    if (props.nuevo === false && alumnosMax < props.turno.idAlumnos.length) {
      setErrorModificacion(
        "El número de alumnos no puede ser menor que el número de alumnos ya apuntados."
      );
      return;
    }
    if (alumnosMax < 1 || alumnosMax > 30) {
      setErrorModificacion(
        "El número de alumnos debe estar entre 1 y 30, ambos incluidos."
      );
      return;
    }
    if (asignatura === "Otro" && otraAsignatura === "") {
      setErrorModificacion("La asignatura no puede estar vacía.");
      return;
    }

    const alumnosMaximos = Number(alumnosMax);

    //Comprobación de que la hora de inicio es anterior a la de fin y
    //que hay una diferencia de al menos 30 minutos entre ambas.
    const resultado = checkHoras(horaInicio, horaFin);
    if (resultado !== null) {
      setErrorModificacion(resultado);
    } else {
      const data = {
        asignatura: asignatura === "Otro" ? otraAsignatura : asignatura,
        dia,
        horaInicio,
        horaFin,
        alumnosMax: alumnosMaximos,
      };

      props.onCompletado(data);
    }
  };

  return (
    <Row>
      {props.nuevo === true ? <h3>Nuevo turno</h3> : <h3>Modificar turno</h3>}
      <hr />
      {/* Selector de asignaturas */}
      <Col md={12} lg={6} className="mb-3">
        <label>Asignatura</label>
        <select
          id="selectAsignaturas"
          className="select-formulario-modificar-turno "
          value={asignatura}
          onChange={(e) => seleccionarAsignatura(e)}>
          <option value="" disabled>
            Selecciona una asignatura
          </option>
          {asignaturas.map((asignatura, index) => (
            <option key={index} value={asignatura}>
              {asignatura}
            </option>
          ))}
        </select>
      </Col>
      {/* Selector de día */}
      <Col md={12} lg={6} className="mb-3">
        <label>Día</label>
        <select
          className="select-formulario-modificar-turno "
          value={dia}
          onChange={(e) => setDia(e.target.value)}>
          <option value="Lunes">Lunes</option>
          <option value="Martes">Martes</option>
          <option value="Miércoles">Miércoles</option>
          <option value="Jueves">Jueves</option>
          <option value="Viernes">Viernes</option>
          <option value="Sábado">Sábado</option>
          <option value="Domingo">Domingo</option>
        </select>
      </Col>
      {/* Campo para introducir una nueva asignatura*/}
      {mostrarOtraAsignatura && (
        <Col md={12} lg={6} className="mb-3">
          <label>Otra asignatura</label>
          <input
            type="text"
            value={otraAsignatura}
            onChange={(e) => setOtraAsignatura(e.target.value)}
          />
        </Col>
      )}
      {/* Campo de hora de inicio */}
      <Col md={12} lg={6} className="mb-3">
        <label>Hora inicio</label>
        <input
          type="time"
          value={horaInicio}
          onChange={(e) => setHoraInicio(e.target.value)}
        />
      </Col>
      {/* Campo de hora de fin */}
      <Col md={12} lg={6} className="mb-3">
        <label>Hora fin</label>
        <input
          type="time"
          value={horaFin}
          onChange={(e) => setHoraFin(e.target.value)}
        />
      </Col>
      {/* Campo de número de alumnos */}
      <Col md={12} lg={6} className="mb-3">
        <label>Alumnos máximos</label>
        <input
          type="number"
          value={alumnosMax}
          onChange={(e) => setAlumnosMax(e.target.value)}
        />
      </Col>
      {/* Mostrado de alerta con el error de modificación / creación*/}
      <Col xs={12}>
        {errorModificacion && (
          <Alerta tipo="danger" mensaje={errorModificacion}></Alerta>
        )}
        <div style={{ display: "flex", gap: "10px", justifyContent: "end" }}>
          <div>
            <BotonCancelar
              texto="Cancelar"
              onClick={() => props.onCompletado(null)}
            />
          </div>
          <BotonPeticion
            texto={props.nuevo === true ? "Crear turno" : "Modificar turno"}
            onClick={() => manejarFormulario()}
          />
        </div>
      </Col>
    </Row>
  );
};

export default FormularioModificarTurno;
