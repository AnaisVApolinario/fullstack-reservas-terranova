# 🌴 Terranova — Plataforma de reservas de tours

Aplicación web **full stack** para explorar, buscar y reservar tours por Latinoamérica, con un panel de administración para gestionar tours y usuarios.

![Pantalla de inicio](docs/home.png)

> 🎥 **Video demo:** [ver el recorrido de 90 segundos](PEGA_AQUI_EL_LINK_DEL_VIDEO)

---

## ✨ Qué puede hacer

**Viajeros**
- Buscar tours por **país y fechas** y filtrar por **categoría** (Aventura, Cultural, Playa, Montaña, Gastronomía, Relajación).
- Ver el **detalle** de cada tour: galería de imágenes, descripción, precio, características y calendario de disponibilidad.
- **Reservar** un tour en las fechas disponibles y consultar sus reservas en *Mis reservas*.
- Registrarse, iniciar sesión y ver su perfil.

**Administradores**
- Crear, editar y eliminar tours, con carga de imágenes.
- Cambiar la categoría de un tour.
- Ver la lista de usuarios y cambiar su rol (usuario o administrador).

| Inicio | Detalle y reserva | Panel de administración |
|---|---|---|
| ![Inicio](docs/home.png) | ![Detalle](docs/detalle.png) | ![Admin](docs/admin.png) |

---

## 🧰 Tecnologías

| Capa | Tecnologías |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS 4, React Router 7, React DatePicker |
| **Backend** | Java 17, Spring Boot 3.4, Spring Security + JWT, Spring Data JPA, Swagger (springdoc) |
| **Base de datos** | MySQL 8 |
| **Infraestructura** | Docker y Docker Compose, Nginx |

### Arquitectura

```
Navegador ──► Frontend (React + Nginx) ──► API REST (Spring Boot) ──► MySQL
                    :5173                        :8081                  :3307
```

- La API usa **autenticación con JWT** y dos roles: `ROLE_USER` y `ROLE_ADMIN`.
- Las contraseñas se guardan cifradas con BCrypt.
- Las imágenes de los tours se guardan en el servidor (carpeta `uploads/`) y se sirven por la propia API.

---

## 🚀 Cómo ejecutarlo

Solo necesitas [Docker Desktop](https://www.docker.com/products/docker-desktop/) abierto.

```bash
git clone https://github.com/AnaisVApolinario/proyecto-fullstack-reservas.git
cd proyecto-fullstack-reservas
docker compose up -d --build
```

La primera vez tarda unos minutos porque descarga MySQL y compila el backend y el frontend. Cuando termine:

| Servicio | Dirección |
|---|---|
| Aplicación | http://localhost:5173 |
| API | http://localhost:8081 |
| Documentación de la API (Swagger) | http://localhost:8081/swagger-ui.html |
| Base de datos | `localhost:3307` (usuario `terranova`, base `terranova_db`) |

Para apagarlo: `docker compose down`. Para apagarlo y reiniciar la base de datos desde cero: `docker compose down -v`.

### 👤 Usuarios de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | `admin@dh.com` | `admin` |
| Usuario | `pedro@dh.com` | `user` |

También puedes crear tu propia cuenta desde *Crear Cuenta*. Son datos de prueba, solo para demostración.

> Las imágenes de ejemplo son marcadores de posición generados. Las imágenes que subas desde el panel de administración sí se guardan y se muestran.

---

## 📁 Estructura del proyecto

```
proyecto-fullstack-reservas/
├── backend/terranova/     # API REST (Spring Boot)
│   └── src/main/java/com/terranova/terranova/
│       ├── controller/    # Endpoints REST
│       ├── service/       # Lógica de negocio
│       ├── repository/    # Acceso a datos (JPA)
│       ├── entity/        # Entidades de la base de datos
│       ├── security/      # JWT, roles y configuración de seguridad
│       └── storage/       # Guardado de imágenes
├── frontend/              # Aplicación React (Vite)
│   └── src/
│       ├── components/    # Componentes de interfaz
│       ├── apis/          # Llamadas a la API
│       └── context/       # Estado de sesión
├── database/init.sql      # Tablas y datos de ejemplo
└── docker-compose.yml     # Levanta base de datos, backend y frontend
```

---

## 🔌 Endpoints principales

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/auth/login` | Iniciar sesión (devuelve un JWT) |
| `POST` | `/usuarios/registrar` | Crear cuenta |
| `GET` | `/categoriaTours` | Listar categorías |
| `GET` | `/tour` | Listar tours |
| `GET` | `/tour/buscar/pais-fechas` | Buscar por país y fechas |
| `GET` | `/disponibilidades/{tourId}` | Fechas disponibles de un tour |
| `POST` | `/reservas/crear` | Crear una reserva |
| `GET` | `/reservas/usuario/{id}` | Reservas de un usuario |
| `POST` | `/tour/agregar-con-imagenes` | Crear un tour con imágenes (admin) |
| `PUT` | `/usuarios/cambiarRol/{id}` | Cambiar el rol de un usuario (admin) |

La lista completa está en Swagger.

---

## 👥 Sobre el proyecto

Terranova nació como un proyecto grupal de [ESCRIBE AQUÍ el contexto: bootcamp, curso o universidad], desarrollado en equipo de [N] personas. Este repositorio es mi versión del proyecto, desplegable con un solo comando.

**Mi participación:** [ESCRIBE AQUÍ, con tus palabras, qué hiciste tú: por ejemplo las pantallas o funciones que construiste, la parte del backend, el panel de administración, Docker, etc.]

---

## 🔮 Posibles mejoras

- Verificación de correo electrónico al registrarse.
- Pagos en línea.