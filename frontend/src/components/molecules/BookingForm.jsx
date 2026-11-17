/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect } from "react";
import { MapPin, CalendarDays, Search, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { PAIS } from "../../constants";
import { useSearchTour } from "../../hooks/useSearchTour";

export const BookingForm = ({ activeCategory }) => {
  const navigate = useNavigate();
  const { searchTours, loading } = useSearchTour();
  const [formData, setFormData] = useState({
    pais: "",
    fechaInicio: null,
    fechaFin: null,
  });
  const [errors, setErrors] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const datePickerRef = useRef(null);
  const placesRef = useRef(null);

  const handleSelectPlace = (place) => {
    setFormData({ ...formData, pais: place });
    setFilteredPlaces([]);
  };

  const validateForm = () => {
    const { pais, fechaInicio, fechaFin } = formData;
    if (!pais || !fechaInicio || !fechaFin) {
      return "Todos los campos deben estar llenos.";
    }
    if (new Date(fechaInicio) > new Date(fechaFin)) {
      return "La fecha de inicio no puede ser mayor que la fecha de fin.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorMessage = validateForm();
    if (errorMessage) {
      setErrors(errorMessage);
      return;
    }

    const filters = {
      pais: formData.pais,
      fechaInicio: formData.fechaInicio.toISOString().split("T")[0],
      fechaFin: formData.fechaFin.toISOString().split("T")[0],
    };

    const queryParams = new URLSearchParams({
      pais: filters.pais,
      fechaInicio: filters.fechaInicio,
      fechaFin: filters.fechaFin,
      ...(activeCategory && activeCategory !== "all" && { categoria: activeCategory })

    }).toString();

    await searchTours(filters);
    navigate(`/resultados?${queryParams}`);
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

  useEffect(() => {
    const closePlaces = (e) => {
      if (placesRef.current && !placesRef.current.contains(e.target)) {
        setFilteredPlaces([]);
      }
    };
    document.addEventListener("mousedown", closePlaces);
    return () => document.removeEventListener("mousedown", closePlaces);
  }, []);

  useEffect(() => {
    if (formData.pais && formData.fechaInicio && formData.fechaFin) {
      setErrors("");
    }
  }, [formData.fechaInicio, formData.fechaFin, formData.pais]);

  const rango =
    formData.fechaInicio && formData.fechaFin
      ? `${formData.fechaInicio.toLocaleDateString()} – ${formData.fechaFin.toLocaleDateString()}`
      : "";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-[1.75rem] shadow-[var(--shadow-lift)] p-4 md:p-5"
    >
      <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
      <div className="relative" ref={placesRef}>
        <label className="field-label" htmlFor="location">Dónde</label>
        <button
          id="location"
          type="button"
          aria-haspopup="listbox"
          className="field flex items-center gap-3"
          onClick={() => setFilteredPlaces(PAIS)}
        >
          <MapPin size={18} className="text-brand-deep shrink-0" />
          <span className={formData.pais ? "text-default" : "text-[#8aa0a5]"}>
            {formData.pais || "Elige un destino"}
          </span>
        </button>
        {filteredPlaces.length > 0 && (
          <ul
            role="listbox"
            className="absolute z-30 mt-2 w-full max-h-56 overflow-y-auto bg-white border border-line rounded-2xl shadow-[var(--shadow-lift)] p-1.5"
          >
            {filteredPlaces.map((place) => (
              <li
                key={`${place}-places3`}
                role="option"
                aria-selected={formData.pais === place}
                className="px-3 py-2.5 rounded-xl cursor-pointer text-sm font-medium hover:bg-brand-soft"
                onClick={() => handleSelectPlace(place)}
              >
                {place}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="relative">
        <label className="field-label" htmlFor="dates">Cuándo</label>
        <button
          id="dates"
          type="button"
          className="field flex items-center gap-3"
          onClick={() => setShowDatePicker(true)}
        >
          <CalendarDays size={18} className="text-brand-deep shrink-0" />
          <span className={rango ? "text-default" : "text-[#8aa0a5]"}>
            {rango || "Indica las fechas"}
          </span>
        </button>
        {showDatePicker && (
          <div ref={datePickerRef} className="absolute z-30 mt-2 left-0">
            <DatePicker
              selected={formData.fechaInicio}
              onChange={(dates) => {
                const [start, end] = dates;
                setFormData({
                  ...formData,
                  fechaInicio: start,
                  fechaFin: end,
                });

                if (start && end) {
                  setShowDatePicker(false);
                }
              }}
              startDate={formData.fechaInicio}
              endDate={formData.fechaFin}
              selectsRange
              inline
              minDate={new Date()}
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-sun h-[2.9rem] md:px-8"
        disabled={!!errors || loading}
      >
        {loading ? (
          <>
            <span className="animate-spin border-2 border-ink border-t-transparent rounded-full w-4 h-4"></span>
            Buscando...
          </>
        ) : (
          <>
            <Search size={18} /> Buscar
          </>
        )}
      </button>
    </div>

      {errors && (
      <p role="alert" className="mt-3 flex items-center gap-2 rounded-xl bg-danger-soft px-3.5 py-2.5 text-sm font-medium text-danger">
        <AlertCircle size={16} /> {errors}
      </p>
    )}
    </form>
  );
};
