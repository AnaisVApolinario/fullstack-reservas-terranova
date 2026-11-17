import { CategoryFilter } from "../atoms/CategoryFilter";
import { LayoutGrid } from 'lucide-react';

/* eslint-disable react/prop-types */
export const Categories = ({ categories, onCategoryClick, activeCategory }) => {
  return (
    <div
      role="group"
      aria-label="Filtrar por categoría"
      className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden scrollbar-none -mx-1 px-1 py-1"
    >
      <div className="flex gap-3 md:justify-center min-w-max">
        <CategoryFilter
          key="all-categories"
          icon={<LayoutGrid size={18} />}
          categoryName="Todas"
          isActive={activeCategory === "all"}
          onClick={() => onCategoryClick("all")}
        />

        {categories.map((category, index) => (
          <CategoryFilter
            key={`${index}-cat`}
            image={category.urlIcono}
            categoryName={category.nombre}
            isActive={activeCategory === category.nombre}
            onClick={() => onCategoryClick(category.nombre)}
          />
        ))}
      </div>
    </div>
  );
};
