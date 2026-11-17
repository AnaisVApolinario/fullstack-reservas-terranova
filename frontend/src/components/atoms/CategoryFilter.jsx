/* eslint-disable react/prop-types */
export const CategoryFilter = ({ image, icon, categoryName, onClick, isActive }) => {
  const activeClass = isActive
    ? "border-2 border-[var(--color-secondary)] bg-gray-100"
    : "hover:bg-gray-200";

  return (
   <button
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      className={`group shrink-0 inline-flex items-center gap-2.5 rounded-full border-[1.5px] pl-1.5 pr-4 py-1.5 text-sm font-semibold transition-all ${
        isActive
          ? "bg-ink text-white border-ink shadow-[var(--shadow-card)]"
          : "bg-white text-ink border-line hover:border-ink"
      }`}
    >
<span
        className={`grid place-items-center h-9 w-9 rounded-full overflow-hidden ${
          isActive ? "bg-white/15 text-white" : "bg-brand-soft text-brand-deep"
        }`}
      >
        {image ? (
          <img src={image} alt="" className="h-full w-full object-cover" />
        ) : (
          icon
        )}
      </span>
        {categoryName}
     </button>
  );
};
