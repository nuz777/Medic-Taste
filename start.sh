#!/usr/bin/env bash
set -e

# ── Colores ──────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$DIR/backend"
FRONTEND_DIR="$DIR/frontend"
PID_DIR="$DIR/.pids"
LOG_DIR="$DIR/logs"

mkdir -p "$PID_DIR" "$LOG_DIR"

# ── Funciones auxiliares ─────────────────────────────────
info()  { echo -e "${CYAN}[INFO]${NC}  $1"; }
ok()    { echo -e "${GREEN}[OK]${NC}    $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $1"; }
fail()  { echo -e "${RED}[FAIL]${NC}  $1"; exit 1; }

is_running() {
    local pid_file="$PID_DIR/$1.pid"
    if [ -f "$pid_file" ]; then
        local pid
        pid=$(cat "$pid_file")
        if kill -0 "$pid" 2>/dev/null; then
            return 0
        fi
        rm -f "$pid_file"
    fi
    return 1
}

# ── Verificar dependencias ──────────────────────────────
echo ""
echo -e "${CYAN}══════════════════════════════════════════${NC}"
echo -e "${CYAN}       Medic-Taste — Inicio rápido       ${NC}"
echo -e "${CYAN}══════════════════════════════════════════${NC}"
echo ""

info "Verificando dependencias..."

# Node.js
if ! command -v node &>/dev/null; then
    fail "Node.js no encontrado. Instálalo desde https://nodejs.org"
fi
NODE_VER=$(node -v)
ok "Node.js $NODE_VER"

# npm
if ! command -v npm &>/dev/null; then
    fail "npm no encontrado."
fi
ok "npm $(npm -v)"

# Python3
if ! command -v python3 &>/dev/null; then
    fail "Python3 no encontrado. Instálalo desde https://python.org"
fi
ok "Python3 $(python3 --version 2>&1 | awk '{print $2}')"

# MySQL client
if ! command -v mysql &>/dev/null; then
    warn "Cliente MySQL no encontrado. El init_db.py puede fallar."
fi

echo ""

# ── Arrancar MySQL si no está corriendo ──────────────────
info "Verificando MySQL..."
MYSQL_RUNNING=false

if command -v mysql &>/dev/null; then
    if mysqladmin ping -u root --password="${DB_PASSWORD:-1234}" &>/dev/null 2>&1; then
        ok "MySQL ya está corriendo"
        MYSQL_RUNNING=true
    fi
fi

if [ "$MYSQL_RUNNING" = false ]; then
    if command -v systemctl &>/dev/null; then
        info "MySQL no está corriendo. Intentando arrancarlo..."
        if sudo systemctl start mysql 2>/dev/null; then
            # Esperar a que MySQL esté listo
            for i in $(seq 1 15); do
                if mysqladmin ping -u root --password="${DB_PASSWORD:-1234}" &>/dev/null 2>&1; then
                    ok "MySQL arrancado correctamente"
                    MYSQL_RUNNING=true
                    break
                fi
                sleep 1
            done
            if [ "$MYSQL_RUNNING" = false ]; then
                warn "MySQL no respondió. Puede que necesites arrancarlo manualmente."
            fi
        else
            warn "No se pudo arrancar MySQL con sudo. ¿Necesitas contraseña?"
            warn "Prueba manualmente: sudo systemctl start mysql"
        fi
    else
        warn "systemctl no encontrado. Arranca MySQL manualmente."
    fi
fi

echo ""

# ── Dependencias del backend ─────────────────────────────
info "Verificando dependencias del backend..."
if [ ! -d "$BACKEND_DIR/node_modules" ]; then
    info "node_modules no encontrado. Ejecutando npm install..."
    (cd "$BACKEND_DIR" && npm install --silent)
    ok "npm install completado"
else
    ok "Dependencias del backend instaladas"
fi

echo ""

# ── Inicializar base de datos ────────────────────────────
info "Verificando base de datos..."
if python3 "$DIR/scripts/init_db.py" 2>/dev/null; then
    ok "Base de datos lista"
else
    warn "init_db.py tuvo problemas (¿MySQL corriendo?). Continuando de todos modos..."
fi

echo ""

# ── Detener instancias previas ───────────────────────────
if is_running backend; then
    warn "Backend ya corriendo (PID $(cat "$PID_DIR/backend.pid")). Deteniendo..."
    kill "$(cat "$PID_DIR/backend.pid")" 2>/dev/null || true
    sleep 1
    rm -f "$PID_DIR/backend.pid"
fi

if is_running frontend; then
    warn "Frontend ya corriendo (PID $(cat "$PID_DIR/frontend.pid")). Deteniendo..."
    kill "$(cat "$PID_DIR/frontend.pid")" 2>/dev/null || true
    sleep 1
    rm -f "$PID_DIR/frontend.pid"
fi

# ── Arrancar Backend ─────────────────────────────────────
info "Arrancando backend (puerto 3000)..."
(cd "$BACKEND_DIR" && node server.js > "$LOG_DIR/backend.log" 2>&1) &
BACKEND_PID=$!
echo "$BACKEND_PID" > "$PID_DIR/backend.pid"

# Esperar a que el backend esté listo
for i in $(seq 1 15); do
    if curl -s http://localhost:3000/ >/dev/null 2>&1; then
        ok "Backend corriendo → http://localhost:3000 (PID $BACKEND_PID)"
        break
    fi
    if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
        fail "Backend falló al arrancar. Revisa logs/backend.log"
    fi
    sleep 1
done

# ── Arrancar Frontend ────────────────────────────────────
info "Arrancando frontend (puerto 8080)..."
(cd "$FRONTEND_DIR" && python3 -m http.server 8080 > "$LOG_DIR/frontend.log" 2>&1) &
FRONTEND_PID=$!
echo "$FRONTEND_PID" > "$PID_DIR/frontend.pid"
sleep 1

if kill -0 "$FRONTEND_PID" 2>/dev/null; then
    ok "Frontend corriendo → http://localhost:8080 (PID $FRONTEND_PID)"
else
    fail "Frontend falló al arrancar. Revisa logs/frontend.log"
fi

# ── Resumen ──────────────────────────────────────────────
echo ""
echo -e "${GREEN}══════════════════════════════════════════${NC}"
echo -e "${GREEN}  Todo listo. Abre en tu navegador:       ${NC}"
echo -e "${GREEN}  → http://localhost:8080                 ${NC}"
echo -e "${GREEN}══════════════════════════════════════════${NC}"
echo ""
echo -e "  Para detener todo:  ${CYAN}./stop.sh${NC}"
echo -e "  Logs:               ${CYAN}logs/backend.log${NC}  ${CYAN}logs/frontend.log${NC}"
echo ""
