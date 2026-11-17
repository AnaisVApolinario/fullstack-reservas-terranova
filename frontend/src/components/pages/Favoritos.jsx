import { Link } from "react-router-dom";
import { ArrowLeft, Heart } from "lucide-react";
import { useFavorites } from "../../hooks/useFavorites";
import { TravelCardContainer } from "../organisms/TravelCardContainer";

export default function Favoritos() {
  const { favoritos } = useFavorites();

  return (
    <main className="page-shell w-full pt-28 min-h-[60vh]">
      <Link to="/" className="back-link">
        <ArrowLeft size={18} /> Volver al inicio
      </Link>
      <div className="mt-4 mb-8">
        <h1 className="text-4xl font-extrabold text-ink">Mis favoritos</h1>
        <p className="mt-1 text-muted">
          Los tours que guardaste con el corazón, para decidir con calma.
        </p>
      </div>

      {favoritos.length > 0 ? (
        <TravelCardContainer tours={favoritos} />
      ) : (
        <div className="empty-state">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-soft text-brand-deep">
            <Heart size={28} />
          </span>
          <p className="mt-4 font-display text-xl font-bold text-ink">Aún no tienes favoritos</p>
          <p className="mt-2">Toca el corazón de un tour para guardarlo aquí.</p>
          <Link to="/" className="btn btn-primary mt-6">Explorar tours</Link>
        </div>
      )}
    </main>
  );
}
