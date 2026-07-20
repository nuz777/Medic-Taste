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

# 2. Arrancar todo con un solo comando
./start.sh
```

Eso es todo. El script se encarga de:
- Verificar que tienes Node.js, Python3 y MySQL instalados
- Instalar dependencias del backend (`npm install`) si faltan
- Inicializar la base de datos si es necesario
- Arrancar backend (:3000) y frontend (:8080)

Abrir [http://localhost:8080](http://localhost:8080)

## Detener todo

```bash
./stop.sh
```

## Setup manual (sin scripts)

Si prefieres hacerlo paso a paso:

```bash
# 1. Inicializar la base de datos
python scripts/init_db.py

# 2. Instalar dependencias del backend
cd backend && npm install

# 3. Arrancar backend (Terminal 1)
cd backend && npm start

# 4. Arrancar frontend (Terminal 2)
cd frontend && python3 -m http.server 8080
```

## Inicializar base de datos en un computador nuevo

```bash
python scripts/init_db.py
```

Opciones:
```bash
python scripts/init_db.py --user root --password 1234
python scripts/init_db.py --schema-only
python scripts/init_db.py --force
```

## Ver usuarios registrados

```bash
mysql -u root -p medic_taste -e "SELECT id, name, email, created_at FROM users;"
```

## Estructura

```
Medic-Taste/
├── frontend/     → HTML, CSS, JS vanilla
├── backend/      → API REST con Node/Express
├── database/     → Scripts SQL (schema + seed)
└── scripts/      → Scripts de automatización (Python)
```
