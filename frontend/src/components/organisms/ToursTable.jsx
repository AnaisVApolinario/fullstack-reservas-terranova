import { EditIcon, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { ModalTour } from "../molecules/ModalTour";
import { ModalTourUpdate } from "../molecules/ModalTourUpdate";
import { useTourById, useTours } from "../../hooks/useTour";
import { ModalConfirmDelete } from "../atoms/ModalConfirmDelete";

/* eslint-disable react/prop-types */
export const ToursTable = () => {
  const { tours, getDataTours, deleteTour } = useTours();
  const [showModal, setShowModal] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const { oneTour, loading } = useTourById(selectedId); // Asegurar que hay estado de carga
  const [tourToDeleteName, setTourToDeleteName] = useState("");

  useEffect(() => {
    if (oneTour && !loading && !showModalDelete && selectedId) {
      setShowModalEdit(true);
    }
  }, [oneTour, loading, showModalDelete, selectedId]);


  const handleOpenModalEdit = (id) => {
    if (selectedId === id) {
      setSelectedId(null);
      setTimeout(() => {
        setSelectedId(id);
      }, 100);
    } else {
      setSelectedId(id);
    }

  };

  const handleCloseCreateModal = async () => {
    setShowModal(false);
    await getDataTours(); // 🔄 Recargar lista después de crear un nuevo tour
  };


  const handleOpenModalDelete = (id, name) => {
    if (!id) {
      console.error("Error: El ID del tour es inválido.");
      return;
    }

    setSelectedId(id); // ✅ Asignamos correctamente el ID
    setTourToDeleteName(name); // ✅ Guardamos el nombre
    setShowModalDelete(true); // ✅ Mostramos el modal de confirmación
  };



  const handleDeleteConfirmed = async () => {
    if (!selectedId) {
      console.error("Error: No hay un tour seleccionado para eliminar.");
      return;
    }

    try {
      await deleteTour(selectedId);
      setShowModalDelete(false);
      setSelectedId(null);
      await getDataTours(); //Recargar datos después de eliminar
    } catch (error) {
      console.error("Error eliminando el tour:", error);
    }
  };


  const handleCloseEditModal = async () => {
    setShowModalEdit(false);
    setSelectedId(null);
    await getDataTours(); // 🔄 Recargar lista después de editar
  };

  const handleCloseDeleteModal = () => {
    setShowModalDelete(false);
    setSelectedId(null); // 🔄 Evitar que el modal de edición se abra después
  };




  const handleOpenCreateTourModal = () => {
    setShowModal(true);
  };

  return (
    <>
      <div className="min-w-0">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold text-ink">Tours</h2>
            <p className="text-sm text-muted">{tours.length} publicados</p>
          </div>
          <button onClick={handleOpenCreateTourModal} className="btn btn-primary">
            <Plus size={18} /> Crear tour
          </button>
        </div>

        <div className="surface overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-brand-soft/60 text-xs font-bold text-brand-deep">
                <th className="px-5 py-3.5">ID</th>
                <th className="px-5 py-3.5">Tour</th>
                <th className="px-5 py-3.5">Categoría</th>
                <th className="px-5 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {tours.length > 0 ? (
                tours.map((tour, index) => (
                  <tr key={`tour-${index}`} className="hover:bg-primary/60">
                    <td className="px-5 py-3.5 text-muted">{tour.id}</td>
                    <td className="px-5 py-3.5 font-semibold text-ink">{tour.titulo}</td>
                    <td className="px-5 py-3.5">
                      <span className="chip">{tour.categoriaTours?.nombre || "Sin categoría"}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1">
                        <button
                          aria-label={`Editar ${tour.titulo}`}
                          className="grid h-9 w-9 place-items-center rounded-full text-ink hover:bg-brand-soft"
                          onClick={() => handleOpenModalEdit(tour.id)}
                        >
                          <EditIcon size={18} />
                        </button>
                        <button
                          aria-label={`Eliminar ${tour.titulo}`}
                          className="grid h-9 w-9 place-items-center rounded-full text-danger hover:bg-danger-soft"
                          onClick={() => handleOpenModalDelete(tour.id, tour.titulo)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-5 py-10 text-center text-muted">
                    Aún no hay tours. Crea el primero con el botón de arriba.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModalEdit && oneTour && (
        <ModalTourUpdate showModal={handleCloseEditModal} tour={oneTour} />
      )}

      {showModalDelete && (
        <ModalConfirmDelete
          showModal={handleCloseDeleteModal}
          onConfirm={handleDeleteConfirmed}
          tourName={tourToDeleteName}
        />
      )}


      {/* Verifica que el modal se renderiza */}
      {showModal && (
        <ModalTour showModal={handleCloseCreateModal} />
      )}
    </>
  );
};
