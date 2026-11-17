/* eslint-disable react/prop-types */
const img = "w-full h-full object-cover";
const fill = "absolute inset-0 h-full w-full object-cover";
const tile = "relative overflow-hidden rounded-[1.75rem] bg-brand-soft";

export const ImageGallery = ({ images = [], type = "consult" }) => {
  if (!images.length) return null;

  // Vista compacta (reservas): una sola imagen
  if (type !== "consult") {
    return (
      <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-brand-soft">
        <img className={img} src={images[0]?.urlImagen} alt="Imagen del tour" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* móvil: carrusel */}
      <div className="flex gap-3 overflow-x-auto touch-pan-x [&::-webkit-scrollbar]:hidden snap-x snap-mandatory md:hidden">
        {images.map((im, index) => (
          <img
            key={index + "mobile"}
            className="h-60 w-[85%] shrink-0 snap-start object-cover rounded-2xl"
            src={im.urlImagen}
            alt={`Imagen ${index + 1}`}
          />
        ))}
      </div>
      <div className="hidden md:block">
        {images.length === 1 && (
          <div className={`h-[26rem] ${tile}`}>
            <img className={fill} src={images[0].urlImagen} alt="Imagen 1" />
          </div>
        )}
        {images.length === 2 && (
          <div className="grid h-[26rem] grid-cols-2 grid-rows-[minmax(0,1fr)] gap-3">
            {images.map((im, index) => (
              <div key={index + "imgCard"} className={tile}>
                <img className={fill} src={im.urlImagen} alt={`Imagen ${index + 1}`} />
              </div>
            ))}
          </div>
        )}
        {images.length >= 3 && (
          <div className="grid h-[26rem] grid-cols-[2fr_1fr] grid-rows-[minmax(0,1fr)] gap-3">
            <div className={tile}>
              <img className={fill} src={images[0].urlImagen} alt="Imagen 1" />
            </div>
            <div className="grid grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-3">
              {images.slice(1, 3).map((im, index) => (
                <div key={index + "imagCards"} className={tile}>
                  <img className={fill} src={im.urlImagen} alt={`Imagen ${index + 2}`} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
