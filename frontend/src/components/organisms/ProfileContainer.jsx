/* eslint-disable react/prop-types */
export const ProfileContainer = ({ user }) => {
  const iniciales = `${user.name?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();
  const filas = [
    ["Nombre", user.name],
    ["Apellido", user.lastName],
    ["Correo electrónico", user.email],
  ];

  return (
    <div className="surface overflow-hidden">
      <div className="flex items-center gap-5 bg-ink px-6 py-8">
        {user.avatar ? (
          <img src={user.avatar} alt="Foto de perfil" className="h-20 w-20 rounded-full object-cover" />
        ) : (
          <span className="grid h-20 w-20 place-items-center rounded-full bg-sun font-display text-3xl font-extrabold text-ink">
            {iniciales}
          </span>
        )}
        <div>
          <h2 className="text-2xl font-extrabold text-white">{user.name} {user.lastName}</h2>
          <p className="text-white/75">{user.email}</p>
        </div>
      </div>
      <dl className="divide-y divide-line px-6">
        {filas.map(([k, v]) => (
          <div key={k} className="flex flex-wrap items-center justify-between gap-2 py-4">
            <dt className="text-sm font-semibold text-muted">{k}</dt>
            <dd className="font-medium text-ink">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};
