import { useEffect } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, children, wide = false }) => {
  // Cierra con la tecla Esc
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-ink/55 backdrop-blur-sm p-0 sm:p-4 fade-in"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${wide ? "sm:max-w-2xl" : "sm:max-w-md"} max-h-[92vh] overflow-y-auto bg-white rounded-t-[1.75rem] sm:rounded-[1.75rem] shadow-[var(--shadow-lift)]`}
      >
        <button
          type="button"
          aria-label="Cerrar"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 h-9 w-9 grid place-items-center rounded-full text-muted hover:bg-brand-soft hover:text-ink transition-colors"
        >
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  wide: PropTypes.bool,
};

export default Modal;
