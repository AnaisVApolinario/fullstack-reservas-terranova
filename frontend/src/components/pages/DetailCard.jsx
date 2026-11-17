import { ArrowLeft, CheckCircle, AlertCircle, XCircle, Clock, MapPin, Heart, CalendarDays } from "lucide-react";
import { useFavorites } from "../../hooks/useFavorites";
import { DescriptionDetail } from "../molecules/DescriptionDetail";
import { useNavigate, useParams } from "react-router-dom";
import { CharacteristicsSection } from "../molecules/CharacteristicsSection";
import { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTourById } from "../../hooks/useTour";
import { useAvailability } from "../../hooks/useBooking";
import { ImageGallery } from "../molecules/ImageGallery";
import Login from "../molecules/Login";
import { useAuth } from "../../context/AuthContext";
import Register from "../molecules/Register";
/* eslint-disable react/prop-types */
const Modal = ({ isOpen, onClose, message }) => {
  let icon, title, description;

  if (message.includes("Reserva exitosa")) {
    icon = <CheckCircle className="w-12 h-12 text-green-500" />;
    title = "Reserva exitosa";
    description = "Tu reserva se ha realizado con éxito.";
  } else if (message.includes("Fecha no disponible")) {
    icon = <AlertCircle className="w-12 h-12 text-yellow-500" />;
    title = "Fecha no Disponible";
    description = "La fecha de inicio debe ser anterior a la de fin.";
  } else if (message.includes("Error en la reserva")) {
    icon = <XCircle className="w-12 h-12 text-red-500" />;
    title = "Error en la reserva";
    description =
      "Hubo un problema con el servidor al procesar la fecha. Intenta nuevamente.";
  } else {
    icon = null;
    title = "Error";
    description = message;
  }

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black/50 z-50 transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
    >
      <div
        className={`bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4 relative transition-transform duration-300 ${isOpen ? "scale-100" : "scale-90"
          }`}
      >
        <div className="flex flex-col items-center">
          {icon}
          <h2 className="text-lg font-bold text-gray-800 mt-3">{title}</h2>
          <p className="text-gray-600 mt-2 text-center">{description}</p>
        </div>
        <div className="mt-4 flex justify-center">
          <button
            className="btn btn-primary"
            onClick={onClose}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default function DetailCard() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [startDate, setStartDate] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { oneTour } = useTourById(id);
  const { dateAvailability, errorMessage } = useAvailability(id);
  const datePickerRef = useRef(null);
  const { user } = useAuth();
  const { esFavorito, toggleFavorito } = useFavorites();

  const openLogin = () => setActiveModal("login");
  const openRegister = () => {
    setActiveModal("register");
  };
  const closeModal = () => setActiveModal(null);
  const is404Error = errorMessage?.includes("404");
  const today = new Date();


  const getTourDateRange = (startDate, duration) => {
    const dates = [];
    for (let i = 0; i < duration; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };


  const blockedDates = dateAvailability
    ?.filter((date) => !date.disponible)
    ?.map((date) => {
      const [year, month, day] = date.fecha.split("-");
      return new Date(year, month - 1, day); // mes - 1 porque en JS los meses van de 0 a 11
    });

  const handleDateChange = (date) => {
    if (!date) return;

    const duration = parseInt(oneTour?.duracion, 10);
    if (isNaN(duration) || duration <= 0) return;

    const tourRange = getTourDateRange(date, duration);

    const isBlocked = tourRange.some((d) =>
      blockedDates.some(
        (b) => b.toDateString() === d.toDateString()
      )
    );

    if (isBlocked) {
      setFormError("Este rango de fechas no está disponible. Intenta con otro día de inicio.");
      setStartDate(null);
      setEndDate(null);
      return;
    }

    setFormError("");
    setStartDate(date);

    const calculatedEndDate = new Date(date);
    calculatedEndDate.setDate(calculatedEndDate.getDate() + duration - 1);
    setEndDate(calculatedEndDate);
    setShowDatePicker(false);
  };

  const handleReserve = () => {
    if (!startDate) {
      setFormError("Debes seleccionar una fecha de inicio.");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setFormError("La fecha de inicio debe ser anterior a la de fin.");
      return;
    }

    setFormError("");

    if (!user) {
      openLogin();
    } else {
      navigate("/detalle-reserva", {
        state: {
          startDate,
          endDate,
          guests,
          tour: oneTour,
          totalPrice: guests * oneTour.precio,
        },
      });
    }
  };

  const handleClickOutside = (event) => {
    if (
      datePickerRef.current &&
      !datePickerRef.current.contains(event.target)
    ) {
      setShowDatePicker(false);
    }
  };

  useEffect(() => {
    if (showDatePicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDatePicker]);

  if (!oneTour) {
    return (
      <div className="page-shell pt-32 pb-20 text-center text-muted">
        Cargando tour...
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="mx-auto w-full max-w-7xl px-5 pt-28">
        <button className="back-link" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Volver atrás
        </button>

        <header className="mt-4 mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="chip"><MapPin size={14} /> {oneTour.pais}</span>
              {oneTour.categoriaTours?.nombre && <span className="chip">{oneTour.categoriaTours.nombre}</span>}
              {oneTour.duracion && (
                <span className="chip"><Clock size={14} /> {oneTour.duracion} {Number(oneTour.duracion) === 1 ? "día" : "días"}</span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-ink leading-tight">
              {oneTour.titulo}
            </h1>
          </div>
          <button
            type="button"
            aria-pressed={esFavorito(oneTour.id)}
            onClick={() => toggleFavorito(oneTour)}
            className="btn btn-ghost"
          >
            <Heart size={18} className={esFavorito(oneTour.id) ? "fill-current text-danger" : ""} />
            {esFavorito(oneTour.id) ? "Guardado" : "Guardar"}
          </button>
        </header>

        <ImageGallery images={oneTour.imagenes} />

        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1fr_24rem]">
          <div className="flex flex-col gap-10">
            <DescriptionDetail description={oneTour.descripcion} />
            <CharacteristicsSection characteristics={oneTour.caracteristicas} />
          </div>

          <aside className="surface p-6 lg:sticky lg:top-24">
            <p className="text-sm text-muted">Desde</p>
            <p className="flex items-baseline gap-2">
              <span className="font-display text-4xl font-extrabold text-brand-deep">USD {oneTour.precio}</span>
              <span className="text-muted">por persona</span>
            </p>

            <div className="mt-6 mb-4 relative">
              <label className="field-label">Fecha de inicio</label>
              <button
                type="button"
                className="field flex items-center gap-3"
                onClick={() => setShowDatePicker(true)}
              >
                <CalendarDays size={18} className="text-brand-deep shrink-0" />
                <span className={startDate ? "" : "text-[#8aa0a5]"}>
                  {startDate ? startDate.toLocaleDateString() : "Elige un día"}
                </span>
              </button>
              {endDate && (
                <p className="mt-2 text-sm text-muted">
                  Termina el <strong className="text-ink">{endDate.toLocaleDateString()}</strong> ({oneTour.duracion} {Number(oneTour.duracion) === 1 ? "día" : "días"})
                </p>
              )}
              {formError && (
                <p role="alert" className="mt-2 rounded-xl bg-danger-soft px-3 py-2 text-sm font-medium text-danger">{formError}</p>
              )}
              {showDatePicker && (
                <div ref={datePickerRef} className="absolute z-40 mt-2 left-0">
                  <DatePicker
                    selected={startDate}
                    onChange={handleDateChange}
                    startDate={startDate}
                    endDate={endDate}
                    selectsStart
                    inline
                    minDate={today}
                    excludeDates={is404Error ? [] : blockedDates}
                  />
                </div>
              )}
            </div>

            <div className="mb-5">
              <label className="field-label" htmlFor="guests">Número de personas</label>
              <select
                id="guests"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="field"
              >
                {[...Array(5).keys()].map((i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i === 0 ? "persona" : "personas"}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between border-t border-line pt-4 mb-5">
              <span className="font-semibold text-ink">Total</span>
              <span className="font-display text-2xl font-extrabold text-ink">USD {guests * oneTour.precio}</span>
            </div>

            <button onClick={handleReserve} className="btn btn-sun btn-block !py-4 text-base">
              Reservar
            </button>
            <p className="mt-3 text-center text-xs text-muted">Aún no se te cobra nada.</p>
          </aside>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        message={modalMessage}
      />
      {!user && (
        <>
          <Login
            isOpen={activeModal === "login"}
            onClose={closeModal}
            openRegister={openRegister}
          />
          <Register isOpen={activeModal === "register"} onClose={closeModal} />
        </>
      )}
    </div>
  );
}
