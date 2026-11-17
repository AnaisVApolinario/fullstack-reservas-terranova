import { CheckCircle } from "lucide-react";
/* eslint-disable react/prop-types */
export const ModalConfirm = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/55 backdrop-blur-sm p-4 fade-in">
      <div role="dialog" aria-modal="true" className="bg-white p-8 rounded-[1.75rem] shadow-[var(--shadow-lift)] text-center w-full max-w-sm">
        <span className="mx-auto grid place-items-center h-16 w-16 rounded-full bg-brand-soft text-brand-deep">
          <CheckCircle size={32} />
        </span>
        <p className="mt-4 text-ink font-medium">{message}</p>
        <button onClick={onClose} className="btn btn-primary mt-6 px-8">
          Entendido
        </button>
      </div>
    </div>
  );
};
