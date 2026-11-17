import { Trash2 } from "lucide-react";
/* eslint-disable react/prop-types */
export const ModalConfirmDelete = ({ showModal, onConfirm, tourName }) => {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/55 backdrop-blur-sm p-4 fade-in"
      onClick={showModal}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        className="bg-white p-8 rounded-[1.75rem] shadow-[var(--shadow-lift)] text-center w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="mx-auto grid place-items-center h-16 w-16 rounded-full bg-danger-soft text-danger">
          <Trash2 size={28} />
        </span>
        <h2 className="text-xl font-bold text-ink mt-4">
          ¿Eliminar este tour?
        </h2>
        <p className="text-muted mt-2">Esta acción no se puede deshacer.</p>
        {tourName && (
          <p className="mt-4 rounded-xl bg-primary px-4 py-3 text-ink font-semibold">
            “{tourName}”
          </p>
        )}

        <div className="flex gap-3 mt-6">
          <button className="btn btn-ghost flex-1" onClick={showModal}>
            Cancelar
          </button>
          <button className="btn btn-danger flex-1" onClick={onConfirm}>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};
