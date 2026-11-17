/* eslint-disable react/prop-types */
export const CharacteristicsSection = ({ characteristics, small = false }) => {
  if (!characteristics || !Array.isArray(characteristics)) {
    return null;
  }

  return (
    <section className="w-full">
      <h2 className={small ? "text-base font-bold text-ink" : "text-2xl font-extrabold text-ink"}>¿Qué incluye?</h2>
      <ul className={`mt-4 grid gap-3 ${small ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2 md:grid-cols-4"}`}>
        {characteristics.map((item, index) => (
          <li
            key={`${index}-charac`}
            className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft">
              <img src={item.urlIcono} className="h-7 w-7" alt="" />
            </span>
            <span className="text-sm font-semibold text-ink leading-tight">{item.descripcion}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};
