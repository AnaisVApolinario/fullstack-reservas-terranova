import React from "react";
import { TourForm } from "../organisms/TourForm";
/* eslint-disable react/prop-types */
export const ModalTour = ({ showModal }) => {
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
           <TourForm action="Nuevo" onClose={showModal} />
         </div>
       </div>
     </div>
  );
};

