import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import PropTypes from "prop-types";
import Modal from "../atoms/Modal";
import { InputField } from "../atoms/InputField";
import { AlertCircle } from "lucide-react";
import logo from "../../assets/logo.png";

const Register = ({ isOpen, onClose }) => {
  const { register } = useAuth(); // 👈 Asegurarnos de que register viene del contexto
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const result = await register(formData);

    if (result.success) {
      onClose();
      setFormData({ nombre: "", apellido: "", email: "", password: "" });
    } else {
      setErrorMessage(result.message || "Error al registrar usuario.");
    }
  };




  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form className="flex flex-col gap-4 p-8 pt-10" onSubmit={handleSubmit}>
        <div className="text-center mb-2">
          <img src={logo} alt="" className="h-14 w-auto mx-auto" />
          <h2 className="mt-4 text-3xl font-extrabold text-ink">Crea tu cuenta</h2>
          <p className="mt-1 text-muted">Reserva tours en pocos pasos.</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <InputField
            label="Nombre"
            placeholder="Nombre"
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            autoComplete="given-name"
            required
          />
          <InputField
            label="Apellido"
            placeholder="Apellido"
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            autoComplete="family-name"
            required
          />
        </div>
        <InputField
          label="Correo electrónico"
          placeholder="tu@correo.com"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />
        <InputField
          label="Contraseña"
          placeholder="Crea una contraseña"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password"
          required
        />

        {errorMessage && (
          <p role="alert" className="flex items-center gap-2 rounded-xl bg-danger-soft px-3.5 py-2.5 text-sm font-medium text-danger">
            <AlertCircle size={16} className="shrink-0" /> {errorMessage}
          </p>
        )}

       <button className="btn btn-primary btn-block !py-3.5 mt-1" type="submit">
          Crear cuenta
        </button>
      </form>
    </Modal>
  );
};

Register.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Register;
