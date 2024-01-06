//Comprobar que hay una diferencia de almenos 30 minutos entre las fechas
// y que la de fin es posterior a la de inicio.
export function checkHoras(horaInicio, horaFin) {
  const fecha1 = new Date(`2000-01-01T${horaInicio}`);
  const fecha2 = new Date(`2000-01-01T${horaFin}`);

  const diferenciaEnMs = Math.abs(fecha2 - fecha1);
  const diferenciaEnMinutos = diferenciaEnMs / (1000 * 60);

  if (fecha2 <= fecha1) {
    return "La segunda hora debe ser posterior a la primera.";
  }

  if (diferenciaEnMinutos < 30) {
    return "La diferencia entre las horas debe ser de al menos 30 minutos.";
  }

  return null;
}

//Comprobar que un turno no se solapa con los ya existentes.

export const checkOtrosTurnos = (turnos, turno) => {
  let error = null;
  turnos.forEach((turnoAlmacenado) => {
    if (turnoAlmacenado.dia === turno.dia) {
      if (
        (turno.horaInicio > turnoAlmacenado.horaInicio &&
          turno.horaInicio < turnoAlmacenado.horaFin) ||
        (turno.horaFin > turnoAlmacenado.horaInicio &&
          turno.horaFin < turnoAlmacenado.horaFin)
      ) {
        error = "El turno se solapa con otro ya existente.";
      } else if (
        turno.horaInicio === turnoAlmacenado.horaInicio &&
        turno.horaFin === turnoAlmacenado.horaFin
      ) {
        error = "El turno ya existe.";
      } else return null;
    }
  });
  return error;
};
