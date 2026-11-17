/* eslint-disable react/prop-types */
import { Heart, MapPin, Clock } from "lucide-react";
import { useFavorites } from "../../hooks/useFavorites";


const TravelCard = ({ imagenes, pais, titulo, precio, duracion, categoria, tour, onDetail }) => {
  const { esFavorito, toggleFavorito } = useFavorites();
  const fav = tour ? esFavorito(tour.id) : false;
  return (
    <article
      role="link"
      tabIndex={0}
      aria-label={`Ver tour: ${titulo}`}
      onClick={onDetail}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onDetail?.())}
      className="group cursor-pointer bg-white rounded-[1.5rem] overflow-hidden shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] focus-visible:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-soft">
        <img
          src={imagenes}
          alt={titulo}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {tour && (
          <button
            type="button"
            aria-pressed={fav}
            aria-label={fav ? "Quitar de favoritos" : "Guardar en favoritos"}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorito(tour);
            }}
            onKeyDown={(e) => e.stopPropagation()}
           className={`absolute top-3 right-3 grid h-10 w-10 place-items-center rounded-full shadow-md transition-all hover:scale-110 active:scale-95 ${
              fav ? "bg-white text-danger" : "bg-white/95 text-ink hover:text-danger"
              }`}
          >
            <Heart size={20} className={fav ? "fill-current" : ""} />
          </button>
        )}
        {categoria && (
          <span className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-ink shadow-sm">
            {categoria}
          </span>
        )}
        {duracion && (
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-ink/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            <Clock size={13} /> {duracion} {Number(duracion) === 1 ? "día" : "días"}
          </span>
        )}
      </div>

      <div className="p-5">
        <p className="flex items-center gap-1.5 text-sm font-medium text-muted">
          <MapPin size={15} className="text-brand-deep" /> {pais}
        </p>
        <h3 className="mt-1.5 text-xl font-bold leading-snug text-ink">
          {titulo}
        </h3>
        <p className="mt-4 flex items-baseline gap-1.5">
          <span className="font-display text-2xl font-extrabold text-brand-deep">
            USD {precio}
          </span>
          <span className="text-sm text-muted">por persona</span>
        </p>
      </div>
    </article>
  );
};

export default TravelCard;
