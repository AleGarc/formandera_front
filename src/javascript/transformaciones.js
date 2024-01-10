import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";

//Conversión de valor numérico a representación por estrellas
export const valorEstrellas = (valor) => {
  const estrellas = [];

  // Redondear el valor a la mitad más cercana
  const valorRedondeado = Math.round(valor * 2) / 2;

  // Generar estrellas llenas, medias y vacías según el valor
  for (let i = 1; i <= 5; i++) {
    if (i <= valorRedondeado) {
      estrellas.push(<BsStarFill key={i} className="estrella" />);
    } else if (i - 0.5 === valorRedondeado) {
      estrellas.push(<BsStarHalf key={i} className="estrella" />);
    } else {
      estrellas.push(<BsStar key={i} className="estrella" />);
    }
  }

  return <div>{estrellas}</div>;
};
