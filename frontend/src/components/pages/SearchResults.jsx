/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Search, MapPin, CalendarDays, Compass } from "lucide-react";
import { Categories } from "../molecules/Categories";
import { PAIS } from "../../constants";
import TravelCard from "../organisms/TravelCard";
import { useSearchTour } from "../../hooks/useSearchTour";
import { useCategory } from "../../hooks/useCategory";

const parseDate = (dateString) => {
  if (!dateString) return null;
  const parts = dateString.split("-");
  return new Date(parts[0], parts[1] - 1, parts[2]);
};

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const { dataResult, searchTours, loading, setLoading } = useSearchTour();
  const { categoryData } = useCategory();

  const paisParam = queryParams.get("pais");
  const fechaInicioParam = queryParams.get("fechaInicio");
  const fechaFinParam = queryParams.get("fechaFin");
  const categoriaParam = queryParams.get("categoria"); // 👈 nueva

  const [formData, setFormData] = useState({
    pais: paisParam || "",
    fechaInicio: parseDate(fechaInicioParam),
    fechaFin: parseDate(fechaFinParam),
  });

  const [activeCategory, setActiveCategory] = useState(categoriaParam || "all");
  const [errors, setErrors] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const datePickerRef = useRef(null);

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

    setErrors("");
    setLoading(true);
    setFilteredPlaces([]);
    setShowDatePicker(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const queryParams = new URLSearchParams({
        pais: formData.pais,
        fechaInicio: formData.fechaInicio.toISOString().split("T")[0],
        fechaFin: formData.fechaFin.toISOString().split("T")[0],
        ...(activeCategory && activeCategory !== "all" && { categoria: activeCategory }),
      }).toString();


      navigate(`/resultados?${queryParams}`);
    } catch (error) {
      console.error("Error en la búsqueda:", error);
    } finally {
      setLoading(false);
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

  // Ejecuta la búsqueda cuando cambian los parámetros en la URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const pais = queryParams.get("pais");
    const fechaInicio = queryParams.get("fechaInicio");
    const fechaFin = queryParams.get("fechaFin");
    const categoria = queryParams.get("categoria");

    setActiveCategory(categoria || "all");

    if (pais && fechaInicio && fechaFin) {
      searchTours({ pais, fechaInicio, fechaFin });
    }
  }, [location.search]);

  // Filtro por categoría aplicado a los resultados obtenidos por país y fecha
  const filteredByCategory = useMemo(() => {
    return dataResult.filter((tour) =>
      activeCategory === "all"
        ? true
        : tour.categoriaTours?.nombre === activeCategory
    );
  }, [dataResult, activeCategory]);

  const rango =
    formData.fechaInicio && formData.fechaFin
      ? `${formData.fechaInicio.toLocaleDateString("es-ES")} – ${formData.fechaFin.toLocaleDateString("es-ES")}`
      : "";

  return (
    <div className="pt-[72px]">
      <div className="bg-ink">
        <div className="mx-auto max-w-5xl px-5 py-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
            {paisParam ? `Tours en ${paisParam}` : "Resultados de tu búsqueda"}
          </h1>
          <form
            onSubmit={handleSubmit}
            className="bg-white p-3 rounded-[1.5rem] shadow-[var(--shadow-lift)] grid gap-3 md:grid-cols-[1fr_1fr_auto]"
          >
            <div className="relative">
              <button
                type="button"
                className="field flex items-center gap-3"
                onClick={() => setFilteredPlaces(PAIS)}
              >
                <MapPin size={18} className="text-brand-deep shrink-0" />
                <span className={formData.pais ? "" : "text-[#8aa0a5]"}>{formData.pais || "Dónde"}</span>
              </button>
              {filteredPlaces.length > 0 && (
                <ul className="absolute z-30 mt-2 w-full max-h-56 overflow-y-auto bg-white border border-line rounded-2xl shadow-[var(--shadow-lift)] p-1.5">
                  {filteredPlaces.map((place) => (
                    <li
                      key={place}
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
              <button
                type="button"
                className="field flex items-center gap-3"
                onClick={() => setShowDatePicker(true)}
              >
                <CalendarDays size={18} className="text-brand-deep shrink-0" />
                <span className={rango ? "" : "text-[#8aa0a5]"}>{rango || "Cuándo"}</span>
              </button>
              {showDatePicker && (
                <div ref={datePickerRef} className="absolute z-30 mt-2 left-0">
                  <DatePicker
                    selected={formData.fechaInicio}
                    onChange={(update) => {
                      setFormData({
                        ...formData,
                        fechaInicio: update[0],
                        fechaFin: update[1],
                      });

                      if (update[0] && update[1]) {
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
              className="btn btn-sun h-[2.9rem] md:px-7"
              disabled={!!errors || loading}
            >
              {loading ? (
                <span className="animate-spin border-2 border-ink border-t-transparent rounded-full w-4 h-4"></span>
              ) : (
                <>
                  <Search size={18} /> Buscar
                </>
              )}
            </button>
          </form>
          {errors && <p role="alert" className="mt-3 text-sm font-medium text-sun">{errors}</p>}
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-5 pt-10">
        <Categories
          categories={categoryData}
          activeCategory={activeCategory}
          onCategoryClick={(name) =>
            setActiveCategory((prev) => (prev === name || name === "all" ? "all" : name))
          }
        />

        <p className="mt-10 mb-6 text-sm font-semibold text-muted">
          {loading
            ? "Buscando tours..."
            : `${filteredByCategory.length} ${filteredByCategory.length === 1 ? "tour disponible" : "tours disponibles"}`}
        </p>

        {filteredByCategory.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredByCategory.map((place, i) => (
              <TravelCard
                key={`${i}-resulFilterTour`}
                imagenes={place.imagenes[0].urlImagen}
                pais={place.pais}
                titulo={place.titulo}
                precio={place.precio}
                duracion={place.duracion}
                categoria={place.categoriaTours?.nombre}
                tour={place}
                onDetail={() => navigate(`/detalle/${place.id}`)}
              />
            ))}
          </div>
        )}

        {filteredByCategory.length === 0 && !loading && (
          <div className="empty-state">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-soft text-brand-deep">
              <Compass size={28} />
            </span>
            <p className="mt-4 font-display text-xl font-bold text-ink">No encontramos tours con esos filtros</p>
            <p className="mt-2">Prueba con otras fechas, otro destino o quita la categoría.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchResults;
