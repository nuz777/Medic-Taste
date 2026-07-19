# Medic-Taste — Planificador de Menús Semanales

Planificador nutricional que genera menús semanales con recetas balanceadas.

## Requisitos

- **Node.js** (v18+)
- **MySQL** (v8+)
- **Python 3** (para servir el frontend e inicializar la base de datos)

## Setup rápido

```bash
# 1. Clonar el repo
git clone <repo-url>
cd Medic-Taste

# 2. Inicializar la base de datos (schema + seed automático)
python scripts/init_db.py

# 3. Configurar credenciales en backend/.env (si es necesario)
# Editar DB_USER, DB_PASSWORD, DB_NAME según tu MySQL

# 4. Instalar dependencias del backend
cd backend && npm install
```

## Inicializar base de datos en un computador nuevo

Ejecuta el script de Python para crear la base de datos, las tablas y cargar todos los datos de recetas e ingredientes:

```bash
python scripts/init_db.py
```

Este script:
- Crea la base de datos `medic_taste` si no existe
- Ejecuta el `schema.sql` (creación de tablas)
- Carga el `seed.sql` (ingredientes y recetas base)
- Carga el `seed_mas_recetas.sql` (recetas adicionales)
- Carga los scripts de corrección de ingredientes faltantes

Opciones:
```bash
# Especificar usuario y contraseña de MySQL
python scripts/init_db.py --user root --password 1234

# Solo crear schema sin datos
python scripts/init_db.py --schema-only

# Forzar recreación (borrar y crear de cero)
python scripts/init_db.py --force
```

## Iniciar

```bash
# Terminal 1 — Backend (API en puerto 3000)
cd backend && npm start

# Terminal 2 — Frontend (en puerto 8080)
cd frontend && python3 -m http.server 8080
```

Abrir [http://localhost:8080](http://localhost:8080)

## Ver usuarios registrados

```bash
mysql -u root -p medic_taste -e "SELECT id, name, email, created_at FROM users;"
```

## Detener todo

```bash
# Detener backend
pkill -f "node server.js"

# Detener MySQL
sudo systemctl stop mysql
```

## Estructura

```
Medic-Taste/
├── frontend/     → HTML, CSS, JS vanilla
├── backend/      → API REST con Node/Express
├── database/     → Scripts SQL (schema + seed)
└── scripts/      → Scripts de automatización (Python)
```
