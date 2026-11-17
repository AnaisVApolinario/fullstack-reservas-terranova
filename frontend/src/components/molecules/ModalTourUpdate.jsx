import React from "react";
import { TourEditForm } from "../organisms/TourEditForm"; // ✅ Importación corregida

/* eslint-disable react/prop-types */
export const ModalTourUpdate = ({ showModal, tour }) => {
  if (!tour) {
    return null; // No renderiza el modal si no hay tour seleccionado
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/55 backdrop-blur-sm p-4 fade-in"
      onClick={showModal}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-y-auto rounded-[1.75rem] bg-white px-6 pb-6 pt-14 shadow-[var(--shadow-lift)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          aria-label="Cerrar"
          className="absolute top-4 right-4 grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-brand-soft hover:text-ink"
          onClick={showModal}
        >
          ✕
        </button>
        <div className="w-full overflow-y-auto flex-1">
               <TourEditForm tour={tour} onClose={showModal} /> {/* ✅ Ahora pasa la función onClose */}
        </div>
      </div>
    </div>
  );
};
