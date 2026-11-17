/* eslint-disable react/prop-types */
import { useState } from "react";
import PropTypes from "prop-types";
import Modal from "../atoms/Modal";
import { InputField } from "../atoms/InputField";
import { useAuth } from "../../context/AuthContext";
import { AlertCircle } from "lucide-react";
import logo from "../../assets/logo.png";

const Login = ({ isOpen, onClose, openRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      onClose();
      setEmail("");
      setPassword("");
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form className="flex flex-col gap-4 p-8 pt-10" onSubmit={handleSubmit}>
        <div className="text-center mb-2">
          <img src={logo} alt="" className="h-14 w-auto mx-auto" />
          <h2 className="mt-4 text-3xl font-extrabold text-ink">Qué bueno verte</h2>
          <p className="mt-1 text-muted">Inicia sesión para reservar tu próximo tour.</p>
        </div>
        <InputField
          label="Correo electrónico"
          placeholder="tu@correo.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          required
        />
        <InputField
          label="Contraseña"
          placeholder="Tu contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        {errorMessage && (
          <p role="alert" className="flex items-center gap-2 rounded-xl bg-danger-soft px-3.5 py-2.5 text-sm font-medium text-danger">
            <AlertCircle size={16} className="shrink-0" /> {errorMessage}
          </p>
        )}

        <button className="btn btn-primary btn-block !py-3.5 mt-1" type="submit">
          Iniciar sesión
        </button>
        <p className="text-center text-sm text-muted">
          ¿No tienes cuenta?{" "}
          <button
            type="button"
            onClick={openRegister}
            className="font-semibold text-brand-deep hover:underline"
          >
            Crea una gratis
          </button>
        </p>
      </form>
    </Modal>
  );
};

Login.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Login;
