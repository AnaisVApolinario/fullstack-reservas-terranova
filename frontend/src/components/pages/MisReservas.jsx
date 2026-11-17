import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Ticket } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ReservationSummary } from "../organisms/ReservationSummary";
import { API_BASE_URL } from "../../constants/endpoints";

export const MisReservas = () => {
  const { user } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [mostrarAntiguas, setMostrarAntiguas] = useState(false);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${API_BASE_URL}/reservas/usuario/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setReservas(data);
      } catch (error) {
        console.error("Error al cargar reservas:", error);
      }
    };

    if (user?.id) {
      fetchReservas();
    }
  }, [user?.id]);

  const hoy = new Date();

  const reservasFiltradas = reservas
    .filter((r) => r.estado === "CONFIRMADA")
    .filter((r) => {
      const fechaFin = new Date(r.fechaFin);
      return mostrarAntiguas ? fechaFin < hoy : fechaFin >= hoy;
    })
    .sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio));

  const tab = (activo, texto) => (
    <button
      type="button"
      role="tab"
      aria-selected={activo}
      onClick={() => setMostrarAntiguas(texto === "Pasadas")}
      className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
        activo ? "bg-ink text-white" : "text-ink hover:bg-brand-soft"
        }`}
    >
      {texto}
    </button>
  );

  return (
    <main className="page-shell w-full max-w-7xl pt-28 min-h-[60vh]">
      <Link to="/" className="back-link">
        <ArrowLeft size={18} /> Volver al inicio
      </Link>

      <div className="mt-4 mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-ink">Mis reservas</h1>
          <p className="mt-1 text-muted">
            {mostrarAntiguas ? "Tus viajes anteriores." : "Tus próximos tours."}
          </p>
        </div>
        <div role="tablist" className="inline-flex rounded-full border border-line bg-white p-1">
          {tab(!mostrarAntiguas, "Vigentes")}
          {tab(mostrarAntiguas, "Pasadas")}
        </div>
      </div>

      {reservasFiltradas.length === 0 ? (
        <div className="empty-state">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-soft text-brand-deep">
            <Ticket size={28} />
          </span>
          <p className="mt-4 font-display text-xl font-bold text-ink">
            No tienes reservas {mostrarAntiguas ? "pasadas" : "vigentes"}
          </p>
          <p className="mt-2">
            {mostrarAntiguas ? "Cuando termines un tour, aparecerá aquí." : "Elige tu próximo destino y reserva en minutos."}
          </p>
          {!mostrarAntiguas && <Link to="/" className="btn btn-primary mt-6">Explorar tours</Link>}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reservasFiltradas.map((reserva) => (
            <ReservationSummary
              key={reserva.id}
              tour={reserva.tour}
              guests={reserva.numPersonas}
              startDate={reserva.fechaInicio}
              endDate={reserva.fechaFin}
              isCompact={true}
            />
          ))}
        </div>
      )}
    </main>
  );
};
