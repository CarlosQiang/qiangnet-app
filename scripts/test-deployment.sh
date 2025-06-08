#!/bin/bash

echo "🧪 PROBANDO DESPLIEGUE LOCAL"
echo "============================"

# Función para esperar que un servicio esté listo
wait_for_service() {
    local url=$1
    local name=$2
    local max_attempts=30
    local attempt=1
    
    echo "⏳ Esperando que $name esté listo..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f "$url" > /dev/null 2>&1; then
            echo "✅ $name está funcionando"
            return 0
        fi
        
        echo "Intento $attempt/$max_attempts - $name no está listo aún..."
        sleep 5
        ((attempt++))
    done
    
    echo "❌ $name no respondió después de $max_attempts intentos"
    return 1
}

# Levantar servicios
echo "🚀 Levantando servicios..."
docker-compose up -d

# Esperar a que los servicios estén listos
wait_for_service "http://localhost:5432" "PostgreSQL" &
wait_for_service "http://localhost:3001/api/health" "API Backend" &
wait_for_service "http://localhost:3000" "Frontend" &
wait_for_service "http://localhost/health" "NGINX" &

wait

# Verificar logs
echo "📋 Verificando logs de servicios..."
docker-compose logs --tail=10 postgres
docker-compose logs --tail=10 api
docker-compose logs --tail=10 frontend
docker-compose logs --tail=10 nginx

# Probar endpoints críticos
echo "🔍 Probando endpoints críticos..."

endpoints=(
    "http://localhost/"
    "http://localhost/api/health"
    "http://localhost/login"
    "http://localhost/admin"
)

for endpoint in "${endpoints[@]}"; do
    if curl -f "$endpoint" > /dev/null 2>&1; then
        echo "✅ $endpoint - FUNCIONANDO"
    else
        echo "❌ $endpoint - ERROR"
    fi
done

echo "🎉 Prueba de despliegue completada"
