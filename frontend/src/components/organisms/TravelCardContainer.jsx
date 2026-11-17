import { useNavigate } from "react-router-dom";
import TravelCard from "./TravelCard";

/* eslint-disable react/prop-types */
export const TravelCardContainer = ({ tours }) => {
  const navigate = useNavigate();

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full">
      {tours.map((place, index) => (
        <TravelCard
          key={`${index}-card`}
          imagenes={place.imagenes[0]?.urlImagen}
          titulo={place.titulo}
          pais={place.pais}
          precio={place.precio}
          duracion={place.duracion}
          categoria={place.categoriaTours?.nombre}
          tour={place} 
          onDetail={() => navigate(`/detalle/${place.id}`)}
        />
      ))}
    </div>
  );
};
