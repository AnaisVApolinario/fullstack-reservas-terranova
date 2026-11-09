import { useCallback, useSyncExternalStore } from "react";
import { useAuth } from "../context/AuthContext";


const listeners = new Set();
const cache = new Map(); 

const leer = (key) => {
  let raw = "[]";
  try {
    raw = localStorage.getItem(key) || "[]";
  } catch {
    /* modo privado: sin persistencia */
  }
  const hit = cache.get(key);
  if (hit && hit[0] === raw) return hit[1];
  let parsed = [];
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = [];
  }
  cache.set(key, [raw, parsed]);
  return parsed;
};

const escribir = (key, lista) => {
  try {
    localStorage.setItem(key, JSON.stringify(lista));
  } catch {
    /* sin persistencia */
  }
  listeners.forEach((l) => l());
};

const subscribe = (cb) => {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
};

export const useFavorites = () => {
  const { user } = useAuth();
  const key = `terranova:favoritos:${user?.id ?? "invitado"}`;
  const favoritos = useSyncExternalStore(subscribe, () => leer(key));

  const esFavorito = useCallback(
    (id) => favoritos.some((t) => t.id === id),
    [favoritos]
  );

  const toggleFavorito = useCallback(
    (tour) => {
      const actual = leer(key);
      if (actual.some((t) => t.id === tour.id)) {
        escribir(key, actual.filter((t) => t.id !== tour.id));
      } else {
        escribir(key, [
          ...actual,
          {
            id: tour.id,
            titulo: tour.titulo,
            pais: tour.pais,
            precio: tour.precio,
            duracion: tour.duracion,
            categoriaTours: tour.categoriaTours
              ? { nombre: tour.categoriaTours.nombre }
              : null,
            imagenes: (tour.imagenes || []).slice(0, 1),
          },
        ]);
      }
    },
    [key]
  );

  return { favoritos, esFavorito, toggleFavorito };
};
