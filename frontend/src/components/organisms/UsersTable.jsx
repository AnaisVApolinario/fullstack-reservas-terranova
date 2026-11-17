import { ArrowUpDown, CircleAlert, Search } from "lucide-react";
import Modal from "../atoms/Modal";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export const UsersTable = () => {
  const { user, listarUsuarios, cambiarRolUsuario } = useAuth();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [sortByName, setSortByName] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const usuarios = await listarUsuarios();
      setUsers(usuarios);
    };

    fetchUsers();
  }, []);

  const toggleSort = () => {
    setSortByName((prev) => !prev);
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (!sortByName) return 0; // no aplicar orden si está en modo ID (default)
    const fullNameA = `${a.nombre} ${a.apellido}`.toLowerCase();
    const fullNameB = `${b.nombre} ${b.apellido}`.toLowerCase();
    return fullNameA.localeCompare(fullNameB);
  });

  const filteredUsers = sortedUsers.filter(
    (u) =>
      u.nombre.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleChange = (userToModify, role) => {
    if (userToModify.id === user.id) {
      console.warn("⚠️ No puedes cambiar tu propio rol.");
      return;
    }

    setSelectedUser(userToModify);
    setNewRole(role);
    setShowModal(true);
  };

  const confirmRoleChange = async () => {
    if (!selectedUser) return;

    const response = await cambiarRolUsuario(selectedUser.id);

    if (response.success) {
      const updatedUsers = await listarUsuarios();
      setUsers(updatedUsers);
    }

    setSelectedUser(null);
    setShowModal(false);
  };

  return (
    <>
      <div className="min-w-0">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold text-ink">Usuarios</h2>
            <p className="text-sm text-muted">{users.length} registrados</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="search"
                aria-label="Buscar usuario"
                placeholder="Buscar usuario"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="field !h-11 !w-64 !pl-10"
              />
            </div>
            <button className="btn btn-ghost hidden md:inline-flex" onClick={toggleSort}>
              <ArrowUpDown size={16} /> {sortByName ? "Ordenar por ID" : "Ordenar por nombre"}
            </button>
          </div>
        </div>

        <div className="surface overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-brand-soft/60 text-xs font-bold text-brand-deep">
                <th className="px-5 py-3.5">ID</th>
                <th className="px-5 py-3.5">Usuario</th>
                <th className="px-5 py-3.5">Rol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-primary/60">
                    <td className="px-5 py-3.5 text-muted">{usuario.id}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-soft text-xs font-extrabold text-brand-deep">
                          {`${usuario.nombre?.[0] ?? ""}${usuario.apellido?.[0] ?? ""}`.toUpperCase()}
                        </span>
                        <div className="leading-tight">
                          <p className="font-semibold text-ink">{usuario.nombre} {usuario.apellido}</p>
                          <p className="text-xs text-muted">{usuario.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <select
                        aria-label={`Rol de ${usuario.nombre}`}
                        className={`rounded-full border-0 px-3 py-1.5 text-xs font-bold ${
                          usuario.usuarioRole === "ROLE_ADMIN" ? "bg-sun-soft text-[#8a5a10]" : "bg-brand-soft text-brand-deep"
                          } disabled:opacity-70`}
                        value={usuario.usuarioRole}
                        disabled={usuario.id === user.id}
                        onChange={(e) => handleRoleChange(usuario, e.target.value)}
                      >
                        <option value="ROLE_USER">Usuario</option>
                        <option value="ROLE_ADMIN">Administrador</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-5 py-10 text-center text-muted">
                    No se encontraron usuarios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={!!(showModal && selectedUser)} onClose={() => setShowModal(false)}>
        {selectedUser && (
          <div className="flex flex-col items-center p-8 pt-10 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-sun-soft text-sun">
              <CircleAlert size={32} />
            </span>
            <h3 className="mt-4 text-2xl font-extrabold text-ink">Cambiar rol</h3>
            <p className="mt-2 text-muted">
              {`¿Seguro que quieres cambiar el rol de ${selectedUser.nombre} a ${
                newRole === "ROLE_ADMIN" ? "Administrador" : "Usuario"
                }?`}
            </p>
            <div className="mt-6 flex w-full gap-3">
              <button className="btn btn-ghost flex-1" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button className="btn btn-primary flex-1" onClick={confirmRoleChange}>
                Confirmar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
