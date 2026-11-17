import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import { useState } from "react";
import { ModalConfirmReservation } from "../molecules/ModalConfirmReservation";
import { ReservationSummary } from "../organisms/ReservationSummary";
import { useAuth } from "../../context/AuthContext";
import { postCreateReservation } from "../../apis/booking";

export default function ReservationDetail() {
  const [modal, setModal] = useState({
    isOpen: false,
    success: false,
    message: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const tour = location.state?.tour || {};
  const startDate = location.state?.startDate || "";
  const endDate = location.state?.endDate || "";
  const guests = location.state?.guests || 1;
  const { user } = useAuth();
  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const formatDateToYYYYMMDD = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const requestData = {
    tourId: tour.id,
    estado: "CONFIRMADA",
    fechaFin: formatDateToYYYYMMDD(endDate),
    fechaInicio: formatDateToYYYYMMDD(startDate),
    numPersonas: guests,
    total: guests * tour.precio,
    usuarioId: user.id,
    tourId: tour.id,
    estado: "CONFIRMADA",
    fechaFin: endDate,
    fechaInicio: startDate,
    numPersonas: guests,
    total: guests * tour.precio,
    usuarioId: user.id,
  };
  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await postCreateReservation(requestData);
      setModal({ isOpen: true, success: true, message: "Reserva confirmada con éxito" });
    } catch (error) {
      console.error("Error al crear reserva:", error.message);
      setModal({
        isOpen: true,
        success: false,
        message: error.message || "Ocurrió un error inesperado",
      });
    }
  };



  return (
    <>
      <div className="mx-auto w-full max-w-6xl px-5 pt-28">
        <button className="back-link" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Volver atrás
        </button>
        <h1 className="mt-4 mb-8 text-4xl font-extrabold text-ink">Confirma tu reserva</h1>

        <main className="grid items-start gap-8 lg:grid-cols-[1fr_26rem]">
          <ReservationSummary
            tour={tour}
            guests={guests}
            startDate={startDate}
            endDate={endDate}
          />

          <section className="surface p-6 lg:sticky lg:top-24">
            <h2 className="text-xl font-bold text-ink">Datos de contacto</h2>
            <p className="mt-1 text-sm text-muted">Usamos los datos de tu cuenta.</p>

            <form className="mt-5 flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="field-label" htmlFor="firstName">Nombre</label>
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    value={user.nombre}
                    onChange={handleChange}
                    placeholder="Nombre"
                    className="field"
                    required
                    disabled
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="lastName">Apellido</label>
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    value={user.apellido}
                    onChange={handleChange}
                    placeholder="Apellido"
                    className="field"
                    required
                    disabled
                  />
                </div>
              </div>

              <div>
                <label className="field-label" htmlFor="email">Correo electrónico</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  placeholder="Correo electrónico"
                  className="field"
                  required
                  disabled
                />
              </div>

              <button type="submit" className="btn btn-sun btn-block !py-4 text-base mt-2">
                Confirmar reserva
              </button>
              <p className="flex items-center justify-center gap-1.5 text-xs text-muted">
                <Lock size={13} /> Aún no se te cobra nada.
              </p>
            </form>
          </section>
        </main>
      </div>
      <ModalConfirmReservation
        modal={modal}
        setModal={setModal}
        tour={tour}
        endDate={endDate}
        startDate={startDate}
        guests={guests}
      />
    </>
  );
}
