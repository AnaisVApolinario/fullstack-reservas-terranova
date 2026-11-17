import { BookingForm } from "../molecules/BookingForm";

export const HeroHome = ({ activeCategory }) => {
  return (
    <section>
      <div className="relative bg-ink pt-[72px] overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage: `url("/bannerHome.jpg")`,
            backgroundPosition: "center 70%",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/70 to-ink/10"
        />
        <div className="relative mx-auto max-w-7xl px-5 pt-16 pb-36 md:pt-24 md:pb-44">
          <h1 className="max-w-2xl font-display font-extrabold text-white text-[2.5rem] leading-[1.05] sm:text-6xl">
            ¿Listo/a para tu próxima aventura en Latinoamérica?
          </h1>
          <p className="mt-5 max-w-lg text-lg text-white/85 leading-relaxed">
            Elige un destino y tus fechas. Te mostramos solo los tours con cupo.
          </p>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-5 -mt-24 md:-mt-28">
        <BookingForm activeCategory={activeCategory} />
      </div>
    </section>
  );
};
