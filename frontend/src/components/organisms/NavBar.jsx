import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  CalendarDays,
  ChevronDown,
  Heart,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import logo from "../../assets/logo.png";
import Register from "../molecules/Register";
import Login from "../molecules/Login";
import { useAuth } from "../../context/AuthContext";
import { API_BASE_URL } from "../../constants/endpoints";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  const profileMenuRef = useRef();
  const mobileMenuRef = useRef();

  const openLogin = () => setActiveModal("login");
  const openRegister = () => setActiveModal("register");
  const closeModal = () => setActiveModal(null);

  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
    setMenuOpen(false);
    setIsAdmin(false);
    navigate("/");
  };

  const getInitials = (name, lastName) => {
    if (!name || !lastName) return "";
    return `${name[0]}${lastName[0]}`.toUpperCase();
  };

  const fetchUserRole = async () => {
    if (!user) {
      setIsAdmin(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAdmin(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/usuarios/perfil`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setIsAdmin(false);
        return;
      }

      const userData = await response.json();
      setIsAdmin(userData.usuarioRole === "ROLE_ADMIN");
    } catch (error) {
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserRole();
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuOpen &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileMenuOpen(false);
      }
      if (
        menuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileMenuOpen, menuOpen]);
  
  const menuItems = (onDone) => (
    <>
      <button
        className="nav-item"
        onClick={() => {
          onDone();
          navigate("/perfil");
        }}
      >
        <User size={18} /> Mi perfil
      </button>
      {!isAdmin && (
        <button
          className="nav-item"
          onClick={() => {
            onDone();
            navigate("/mis-reservas");
          }}
        >
          <CalendarDays size={18} /> Mis reservas
        </button>
      )}
      <button
        className="nav-item"
        onClick={() => {
          onDone();
          navigate("/favoritos");
        }}
      >
        <Heart size={18} /> Mis favoritos
      </button>
      {isAdmin && (
        <button
          className="nav-item"
          onClick={() => {
            onDone();
            navigate("/panel-administrador");
          }}
        >
          <Settings size={18} /> Administrar
        </button>
      )}
      <div className="my-1 h-px bg-line" />
      <button className="nav-item !text-danger" onClick={handleLogout}>
        <LogOut size={18} /> Cerrar sesión
      </button>
    </>
  );

  const avatar = (
    <span className="grid place-items-center h-10 w-10 rounded-full bg-brand-soft text-brand-deep font-display font-extrabold text-sm">
      {getInitials(user?.nombre, user?.apellido)}
    </span>
  );

  return (
   <>
    <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-line/80">
      <div className="mx-auto max-w-7xl h-[72px] px-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group" aria-label="Terranova, ir al inicio">
          <img src={logo} alt="" className="h-11 w-auto transition-transform group-hover:-rotate-6" />
          <span className="font-display font-extrabold text-xl tracking-tight text-ink">
            Terranova
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-3 relative">
          <Link
            to="/favoritos"
            aria-label="Mis favoritos"
            className="grid h-11 w-11 place-items-center rounded-full text-ink hover:bg-brand-soft transition-colors"
          >
            <Heart size={20} />
          </Link>
          {user ? (
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={profileMenuOpen}
              className="flex items-center gap-3 rounded-full border border-line bg-white py-1 pl-1 pr-4 hover:border-ink transition-colors"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            >
              {avatar}
              <span className="text-sm font-semibold text-ink">{user.nombre}</span>
              <ChevronDown size={16} className={`text-muted transition-transform ${profileMenuOpen ? "rotate-180" : ""}`} />
            </button>
          ) : (
            <>
              <button onClick={openLogin} className="btn btn-ghost !py-2.5">
                Iniciar sesión
              </button>
              <button onClick={openRegister} className="btn btn-primary !py-2.5">
                Crear cuenta
              </button>
            </>
          )}

          {profileMenuOpen && user && (
            <div
              ref={profileMenuRef}
              role="menu"
              className="absolute top-[calc(100%+10px)] right-0 w-56 bg-white rounded-2xl border border-line shadow-[var(--shadow-lift)] p-2 fade-in"
            >
              {menuItems(() => setProfileMenuOpen(false))}
            </div>
          )}
        </div>

        <button
          className="md:hidden h-11 w-11 grid place-items-center rounded-full border border-line bg-white text-ink"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          onClick={() => {
            setMenuOpen(!menuOpen);
            fetchUserRole();
          }}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden absolute top-[78px] right-4 left-4 bg-white rounded-2xl border border-line shadow-[var(--shadow-lift)] p-3 flex flex-col gap-1 fade-in"
        >
          {user ? (
            <>
              <div className="flex items-center gap-3 px-2 pb-3 mb-1 border-b border-line">
                {avatar}
                <div className="leading-tight">
                  <p className="font-semibold text-ink">{user.nombre} {user.apellido}</p>
                  <p className="text-xs text-muted">{user.email}</p>
                </div>
              </div>
              {menuItems(() => setMenuOpen(false))}
            </>
          ) : (
            <div className="flex flex-col gap-2 p-1">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  openLogin();
                }}
                className="btn btn-ghost"
              >
                Iniciar sesión
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  openRegister();
                }}
                className="btn btn-primary"
              >
                Crear cuenta
              </button>
            </div>
          )}
        </div>
      )}
    </header>
     {/* Fuera del <header>: su desenfoque rompería el position:fixed del modal */}
    <Register isOpen={activeModal === "register"} onClose={closeModal} />
    <Login
      isOpen={activeModal === "login"}
      onClose={closeModal}
      openRegister={openRegister}
    />
    </>
  );
};

export default Navbar;
