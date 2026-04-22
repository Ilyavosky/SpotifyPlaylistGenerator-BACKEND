# Aplicación MVP para generar playlists en Spotify
**Universidad Politécnica de Chiapas**

**Integrantes:**
- Cortés Ruiz Ilya — 243710
- Hernández Muñoz Brittany Aurora — 243707
  
**Grupo 5C**

API REST desarrollada con Node.js, Express y TypeScript. Gestiona la autenticación con Spotify, la generación de recomendaciones por género, la gestión de sesiones y la exportación de playlists.

## Arquitectura

El backend sigue una arquitectura orientada a servicios (SOA) con separación explícita en capas:

```
src/
├── lib/
│   ├── db/            # Conexión a PostgreSQL (pool)
│   ├── errors/        # Clase AppError centralizada
│   └── validations/   # Schemas Zod compartidos
├── middleware/
│   ├── errorHandler.middleware.ts   # Manejo global de errores
│   └── authRefresh.middleware.ts    # Renovación automática de tokens
├── modules/
│   ├── auth/          # OAuth 2.0 con Spotify
│   ├── genres/        # Géneros disponibles
│   ├── recommendations/ # Búsqueda de tracks por género
│   ├── sessions/      # Sesiones de generación
│   ├── favorites/     # Tracks aceptados/rechazados
│   ├── playlists/     # Exportación a Spotify
│   └── albums/        # Álbumes guardados
└── routes/            # Registro de endpoints
```

Cada módulo contiene: `types.ts`, `schema.ts`, `service.ts`, `controller.ts`.

## Requisitos

- Node.js 18+
- npm
- PostgreSQL (via Docker, ver repo DATABASE)

## Instalación

```bash
git clone https://github.com/Ilyavosky/SpotifyPlaylistGenerator-BACKEND.git
cd SpotifyPlaylistGenerator-BACKEND
git checkout develop
npm install
```

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:


Las credenciales de Spotify se obtienen en [Spotify Developer Dashboard](https://developer.spotify.com/dashboard). Ojo, se debe tener una cuenta Premium de Spotify para obtener la credencial

## Ejecución

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

## Endpoints

Base URL: `http://127.0.0.1:4000/api/v1`

### Auth

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/auth/login` | Inicia el flujo OAuth con Spotify |
| GET | `/auth/callback` | Callback de Spotify, setea cookies |
| POST | `/auth/refresh` | Renueva el access token |
| POST | `/auth/logout` | Limpia cookies de sesión |
| GET | `/auth/me` | Devuelve el access token actual |

### Géneros

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/genres` | Lista géneros disponibles (cache en DB, lista estática) |

### Sesiones

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/sessions` | Crea una nueva sesión de generación |
| GET | `/sessions` | Lista todas las sesiones |
| GET | `/sessions/:id` | Obtiene una sesión por ID |
| PATCH | `/sessions/:id/export` | Marca una sesión como exportada |

**Body POST /sessions:**
```json
{
  "name": "Mi Playlist",
  "target_valence": 0.8,
  "target_energy": 0.9,
  "target_danceability": 0.7,
  "seed_genres": ["k-pop", "pop"]
}
```

### Recomendaciones

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/recommendations` | Busca tracks por género en Spotify y los guarda |

**Body:**
```json
{
  "session_id": 1,
  "target_valence": 0.8,
  "target_energy": 0.9,
  "target_danceability": 0.7,
  "seed_genres": ["k-pop", "pop"]
}
```

### Favoritos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/favorites?session_id=1` | Lista tracks aceptados de una sesión |
| PATCH | `/favorites/status` | Actualiza el status de un track |

**Body PATCH:**
```json
{
  "session_id": 1,
  "track_id": 35,
  "status": "accepted"
}
```

Status válidos: `pending`, `accepted`, `rejected`.

### Playlists

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/playlists` | Exporta los tracks aceptados a Spotify |

**Body:**
```json
{
  "session_id": 1,
  "name": "Mi Playlist Kpop"
}
```

**Response:**
```json
{
  "spotify_playlist_id": "2BHzRIzuXiNJemoOGj9mAK",
  "name": "Mi Playlist Kpop",
  "spotify_url": "https://open.spotify.com/playlist/2BHzRIzuXiNJemoOGj9mAK"
}
```

### Álbumes

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/albums?page=1&limit=10` | Lista álbumes guardados con paginación |

## Formato de errores

Todos los errores siguen el mismo formato:

```json
{
  "code": "ERROR_CODE",
  "message": "Descripción del error",
  "details": {}
}
```

| Código HTTP | Cuándo |
|-------------|--------|
| 200 | GET exitoso |
| 201 | Recurso creado |
| 400 | Request mal formada |
| 401 | Sin token de autenticación |
| 404 | Recurso no encontrado |
| 422 | Validación semántica fallida |
| 500 | Error interno |
| 502 | Error al llamar a Spotify |

## Seguridad

- Las credenciales de Spotify se almacenan únicamente en variables de entorno
- Los tokens se guardan en cookies `httpOnly` — nunca expuestos al frontend
- El `refresh_token` tiene duración de 30 días; el `access_token` de 1 hora
- El middleware `authRefresh` renueva automáticamente el token expirado
- CORS configurado para aceptar únicamente el origen del frontend
- Validación de inputs con Zod en todos los endpoints

## Declaración de uso de IA

Este proyecto fue desarrollado con asistencia de Claude (Anthropic) como herramienta de apoyo para la generación de código en las partes criticas debido a que la API de Spotify sufrió cambios drásticos, y sigue en desarrollo, muchos endpoints cambiaron y se volvió más estricta. Nuestro equipo revisó, validó, adaptó y comprende todo el código que fue diseñado con el uso de IA. Claro que en su mayoria es de autoría propia, pues investigamos la documentación de cada recurso usado.

