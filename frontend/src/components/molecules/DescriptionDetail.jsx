/* eslint-disable react/prop-types */
export const DescriptionDetail = ({ description, subtitle = "" }) => {
  return (
   <section className="w-full">
      <h2 className="text-2xl font-extrabold text-ink">Sobre este tour</h2>
      {subtitle && <h3 className="mt-1 text-sm text-muted">{subtitle}</h3>}
      <p className="mt-3 max-w-prose text-[1.05rem] leading-8 text-default/90">{description}</p>
    </section>
  );
};
