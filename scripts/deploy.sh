#!/bin/bash

echo "🚀 INICIANDO DESPLIEGUE QIANGNET"
echo "==============================="

# Verificar prerrequisitos
echo "🔍 Verificando prerrequisitos..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado"
    exit 1
fi

# Crear directorios necesarios
echo "📁 Creando directorios..."
mkdir -p nginx/ssl
mkdir -p logs

# Generar certificados SSL si no existen
if [ ! -f "nginx/ssl/qiangnet.crt" ]; then
    echo "🔐 Generando certificados SSL..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout nginx/ssl/qiangnet.key \
        -out nginx/ssl/qiangnet.crt \
        -subj "/C=ES/ST=Madrid/L=Madrid/O=QiangNet/CN=localhost"
    
    openssl dhparam -out nginx/ssl/dhparam.pem 2048
fi

# Configurar variables de entorno
if [ ! -f ".env" ]; then
    echo "⚙️ Configurando variables de entorno..."
    cp .env.example .env
    echo "✏️ Por favor, edita el archivo .env con tus configuraciones"
    read -p "Presiona Enter cuando hayas terminado..."
fi

# Limpiar contenedores anteriores
echo "🧹 Limpiando contenedores anteriores..."
docker-compose down -v

# Construir y levantar servicios
echo "🏗️ Construyendo y levantando servicios..."
docker-compose up -d --build

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 30

# Verificar estado de los servicios
echo "🔍 Verificando estado de los servicios..."
docker-compose ps

# Verificar conectividad
echo "🌐 Verificando conectividad..."
if curl -f http://localhost/health > /dev/null 2>&1; then
    echo "✅ Frontend funcionando correctamente"
else
    echo "❌ Error en el frontend"
fi

if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "✅ API funcionando correctamente"
else
    echo "❌ Error en la API"
fi

echo ""
echo "🎉 DESPLIEGUE COMPLETADO"
echo "======================="
echo "Frontend: http://localhost"
echo "API: http://localhost:3001/api"
echo "Admin: http://localhost/admin"
echo ""
echo "Credenciales por defecto:"
echo "Usuario: admin@qiangnet.local"
echo "Contraseña: Admin123!"
