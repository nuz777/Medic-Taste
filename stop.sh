#!/usr/bin/env bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

DIR="$(cd "$(dirname "$0")" && pwd)"
PID_DIR="$DIR/.pids"

echo ""

kill_process() {
    local name="$1"
    local pid_file="$PID_DIR/$name.pid"
    if [ -f "$pid_file" ]; then
        local pid
        pid=$(cat "$pid_file")
        if kill -0 "$pid" 2>/dev/null; then
            echo -e "${YELLOW}Deteniendo${NC} $name (PID $pid)..."
            kill "$pid" 2>/dev/null
            # Esperar hasta 5 segundos
            for i in $(seq 1 10); do
                if ! kill -0 "$pid" 2>/dev/null; then
                    break
                fi
                sleep 0.5
            done
            # Forzar si sigue vivo
            if kill -0 "$pid" 2>/dev/null; then
                kill -9 "$pid" 2>/dev/null
            fi
            echo -e "${GREEN}  $name detenido${NC}"
        else
            echo -e "  $name ya no estaba corriendo"
        fi
        rm -f "$pid_file"
    else
        echo -e "  $name no tenía PID registrado"
    fi
}

kill_process "backend"
kill_process "frontend"

# También matar cualquier proceso Python http.server en puerto 8080 y node en 3000
for port in 3000 8080; do
    pids=$(lsof -ti :"$port" 2>/dev/null || true)
    if [ -n "$pids" ]; then
        echo "$pids" | xargs kill 2>/dev/null || true
    fi
done

echo ""
echo -e "${GREEN}Todo detenido.${NC}"
echo ""
