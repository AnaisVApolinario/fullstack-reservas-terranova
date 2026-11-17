/* eslint-disable react/prop-types */
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { CharacteristicsSection } from "../molecules/CharacteristicsSection";
import { ImageGallery } from "../molecules/ImageGallery";

const parseDateWithoutTimezone = (date) => {
  if (!date) return null;
  if (typeof date === "string") {
    const [year, month, day] = date.split("-");
    return new Date(Number(year), Number(month) - 1, Number(day));
  }
  return date; // ya es un objeto Date
};

const fmt = (d) => (d ? parseDateWithoutTimezone(d).toLocaleDateString() : "No seleccionada");

export const ReservationSummary = ({
  tour,
  guests,
  startDate,
  endDate,
  isCompact = false, // tarjeta pequeña para "Mis reservas"
}) => {
  const totalPrice = guests * tour.precio;

    const datos = (
      <ul className="space-y-3 text-sm text-ink">
        <li className="flex items-center gap-3">
          <User size={18} className="text-brand-deep" />
          <span><strong>{guests}</strong> {Number(guests) === 1 ? "persona" : "personas"}</span>
        </li>
        <li className="flex items-center gap-3">
          <Calendar size={18} className="text-brand-deep" />
          <span>{fmt(startDate)} – {fmt(endDate)}</span>
        </li>
        <li className="flex items-center gap-3">
          <Clock size={18} className="text-brand-deep" />
          <span>{tour.duracion} {Number(tour.duracion) === 1 ? "día" : "días"}</span>
        </li>
      </ul>
    );
  
    const total = (
      <div className="flex items-center justify-between border-t border-dashed border-line pt-4">
        <span className="text-sm font-semibold text-muted">Total</span>
        <span className="font-display text-2xl font-extrabold text-ink">USD {totalPrice.toFixed(2)}</span>
      </div>
    );
  
    if (isCompact) {
      return (
        <section className="surface flex h-full flex-col overflow-hidden">
          <div className="aspect-[16/10] overflow-hidden bg-brand-soft">
            <img src={tour.imagenes?.[0]?.urlImagen} alt={tour.titulo} className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-1 flex-col gap-4 p-5">
            <div>
              <p className="flex items-center gap-1.5 text-sm font-medium text-muted">
                <MapPin size={15} className="text-brand-deep" /> {tour.pais}
              </p>
              <h2 className="mt-1 text-xl font-bold text-ink">{tour.titulo}</h2>
            </div>
            {datos}
            <div className="mt-auto">{total}</div>
          </div>
        </section>
      );
    }
  
    return (
      <section className="surface overflow-hidden">
        <ImageGallery type="Reservation" images={tour.imagenes || []} />
        <div className="flex flex-col gap-5 p-6">
          <div>
            <p className="flex items-center gap-1.5 text-sm font-medium text-muted">
              <MapPin size={15} className="text-brand-deep" /> {tour.pais}
            </p>
            <h2 className="mt-1 text-2xl font-extrabold text-ink">{tour.titulo}</h2>
          </div>
          {datos}
          <CharacteristicsSection characteristics={tour.caracteristicas} small />
          {total}
        </div>
    </section>
  );
};
