import { ArrowLeft, Users, Map } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ITEMS_MENU_ADMIN } from "../../constants";
import { ToursTable } from "../organisms/ToursTable";
import { useTours } from "../../hooks/useTour";
import { UsersTable } from "../organisms/UsersTable";
import { TourEditForm } from "../organisms/TourEditForm";

const ICONOS = { Usuarios: Users, Tours: Map };

export default function AdminPanel() {
  const [selected, setSelected] = useState("Usuarios");
  const [tourToEdit, setTourToEdit] = useState(null); // Estado para el tour en edición
  const navigate = useNavigate();
  const { tours } = useTours();

  return (
    <main className="mx-auto w-full max-w-7xl px-5 pt-28 pb-8">
      <button className="back-link" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Volver atrás
      </button>
      <h1 className="mt-4 mb-8 text-4xl font-extrabold text-ink">Panel de administración</h1>

      <div className="grid items-start gap-6 md:grid-cols-[14rem_1fr]">
        <nav aria-label="Secciones" className="surface p-2 flex md:flex-col gap-1">
          {ITEMS_MENU_ADMIN.map((item) => {
            const Icon = ICONOS[item];
            const activo = selected === item;
            return (
              <button
                key={item}
                aria-current={activo ? "page" : undefined}
                className={`flex flex-1 md:flex-none items-center justify-center md:justify-start gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
                  activo ? "bg-ink text-white" : "text-ink hover:bg-brand-soft"
                  }`}
                onClick={() => {
                  setSelected(item);
                  setTourToEdit(null); // Ocultar el formulario si cambiamos de menú
                }}
              >
                {Icon && <Icon size={18} />} {item}
              </button>
            );
          })}
        </nav>

        <div className="min-w-0">
          {selected === "Usuarios" && <UsersTable />}
          {selected === "Tours" && !tourToEdit && (
            <ToursTable tours={tours} onEdit={(tour) => setTourToEdit(tour)} />
          )}

          {tourToEdit && <TourEditForm tour={tourToEdit} onClose={() => setTourToEdit(null)} />}
        </div>
      </div>
    </main>
  );
}
