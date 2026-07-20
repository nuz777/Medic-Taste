# backend/config/

Configuración de conexión a servicios externos.

- `db.js` → crea el cliente de conexión a Turso (usando `@libsql/client`) leyendo credenciales desde `.env`.

Si más adelante agregas otro servicio (ej. almacenamiento de imágenes en la nube), su configuración también va aquí.
