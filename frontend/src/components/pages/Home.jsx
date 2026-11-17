import { useEffect, useState } from "react";
import { useCategory } from "../../hooks/useCategory";
import { getToursApi } from "../../apis/tour";
import { Categories } from "../molecules/Categories";
import { HeroHome } from "../organisms/HeroHome";
import { TravelCardContainer } from "../organisms/TravelCardContainer";
import { useNavigate } from "react-router-dom";
import { BookingForm } from "../molecules/BookingForm";

export default function Home() {
  const { categoryData } = useCategory();
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTours = async () => {
      const data = await getToursApi();
      setTours(data);
      setFilteredTours(getRandomTours(data, 9));
    };

    fetchTours();
  }, []);

  const getRandomTours = (toursArray, max) => {
    const shuffled = [...toursArray].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, max);
  };

  const handleCategoryClick = (categoryName) => {
    if (categoryName === activeCategory || categoryName === "all") {
      setActiveCategory("all");
      setFilteredTours(getRandomTours(tours, 9));
    } else {
      setActiveCategory(categoryName);
      const filtered = tours.filter(
        (tour) => tour.categoriaTours?.nombre === categoryName
      );
      setFilteredTours(getRandomTours(filtered, 9));
    }
  };

  // función que redirige a resultados incluyendo categoría
  const handleSearch = (formData) => {
    const queryParams = new URLSearchParams({
      pais: formData.pais,
      fechaInicio: formData.fechaInicio.toISOString().split("T")[0],
      fechaFin: formData.fechaFin.toISOString().split("T")[0],
      ...(activeCategory !== "all" && { categoria: activeCategory }),
    });

    navigate(`/resultados?${queryParams.toString()}`);
  };

  const sinDatos = tours.length === 0;

  return (
    <div className="flex flex-col w-full">
      <HeroHome activeCategory={activeCategory} />

      <main className="mx-auto w-full max-w-7xl px-5 mt-14">
        <Categories
          categories={categoryData}
          onCategoryClick={handleCategoryClick}
          activeCategory={activeCategory}
        />

        <div className="mt-12 mb-6 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-3xl font-extrabold text-ink">
              {activeCategory === "all" ? "Tours para ti" : activeCategory}
            </h2>
            <p className="mt-1 text-muted">
              {activeCategory === "all"
                ? "Una selección distinta cada vez que entras."
                : "Tours de esta categoría."}
            </p>
          </div>
          {!sinDatos && (
            <p className="text-sm font-semibold text-muted">
              {filteredTours.length} {filteredTours.length === 1 ? "tour" : "tours"}
            </p>
          )}
        </div>

        {filteredTours.length > 0 ? (
          <TravelCardContainer tours={filteredTours} />
        ) : (
          <div className="empty-state">
            <p className="font-display text-xl font-bold text-ink">
              {sinDatos ? "Aún no hay tours para mostrar" : "No hay tours en esta categoría"}
            </p>
            <p className="mt-2">
              {sinDatos
                ? "Si acabas de levantar el proyecto, espera unos segundos y recarga la página."
                : "Prueba con otra categoría o vuelve a “Todas”."}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
