/* eslint-disable react/prop-types */
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  MapPin,
  User,
} from "lucide-react";
import Modal from "../atoms/Modal";
import { useNavigate } from "react-router-dom";

export const ModalConfirmReservation = ({
  modal,
  setModal,
  tour,
  guests,
  startDate,
  endDate,
}) => {
  const navigate = useNavigate();
  return (
    <Modal isOpen={modal.isOpen} onClose={() => setModal({ isOpen: false })}>
      {modal.success ? (
        <div className="p-8 pt-10 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-soft text-ok">
            <CheckCircle size={34} />
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-ink">¡Reserva confirmada!</h2>
          <p className="mt-1 text-muted">Ya tienes tu lugar. Estos son los datos:</p>
          <div className="mt-6 rounded-2xl bg-primary p-5 text-left space-y-3">
            <p className="font-display text-xl font-bold text-ink">{tour.titulo}</p>
            <p className="flex items-center gap-2.5 text-sm text-ink">
              <MapPin size={18} className="text-brand-deep" /> {tour.pais}
            </p>
            <p className="flex items-center gap-2.5 text-sm text-ink">
              <User size={18} className="text-brand-deep" /> {guests} {Number(guests) === 1 ? "persona" : "personas"}
            </p>
            <p className="flex items-center gap-2.5 text-sm text-ink">
              <Calendar size={18} className="text-brand-deep" />
              {startDate ? new Date(startDate).toLocaleDateString() : "No seleccionada"} –{" "}
              {endDate ? new Date(endDate).toLocaleDateString() : "No seleccionada"}
            </p>
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={() => navigate("/mis-reservas")} className="btn btn-ghost flex-1">
              Ver mis reservas
            </button>
            <button onClick={() => navigate("/")} className="btn btn-primary flex-1">
              Ir al inicio
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8 pt-10 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-sun-soft text-sun">
            <AlertTriangle size={32} />
          </span>
          <h2 className="mt-4 text-2xl font-extrabold text-ink">No pudimos reservar</h2>
          <p className="mt-2 text-muted">
            {modal.message || "Hubo un problema al procesar la reserva. Intenta nuevamente más tarde."}
          </p>
          <button onClick={() => setModal({ isOpen: false })} className="btn btn-primary mt-6 px-8">
            Entendido
          </button>
        </div>
      )}
    </Modal>
  );
};
