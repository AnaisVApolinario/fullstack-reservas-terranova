import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileContainer } from "../organisms/ProfileContainer";
import { ArrowLeft } from "lucide-react";
import { API_BASE_URL } from "../../constants/endpoints";

export default function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("No hay token disponible. Inicia sesión.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/usuarios/perfil`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("No se pudo obtener el perfil del usuario.");
        }

        const data = await response.json();
        // Formateamos los datos para que coincidan con ProfileContainer
        setUserData({
          name: data.nombre,
          lastName: data.apellido,
          email: data.email,
        });
      } catch (err) {
        console.error("❌ Error al obtener perfil:", err.message);
        setError("No se pudo cargar la información del perfil.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <main className="mx-auto w-full max-w-3xl px-5 pt-28 min-h-[60vh]">
      <button className="back-link" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Volver atrás
      </button>
      <h1 className="mt-4 mb-8 text-4xl font-extrabold text-ink">Mi perfil</h1>

      {loading ? (
        <p className="text-muted">Cargando perfil...</p>
      ) : error ? (
        <p role="alert" className="rounded-xl bg-danger-soft px-4 py-3 font-medium text-danger">{error}</p>
      ) : (
        <ProfileContainer user={userData} />
      )}
    </main>
  );
}
