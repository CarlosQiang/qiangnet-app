#!/bin/bash

echo "🔧 SOLUCIONANDO PROBLEMAS COMUNES DE DESPLIEGUE"
echo "==============================================="

# Crear directorios faltantes
echo "📁 Creando directorios necesarios..."
mkdir -p nginx/ssl
mkdir -p logs
mkdir -p public/images
mkdir -p scripts

# Generar certificados SSL si no existen
if [ ! -f "nginx/ssl/qiangnet.crt" ]; then
    echo "🔐 Generando certificados SSL..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout nginx/ssl/qiangnet.key \
        -out nginx/ssl/qiangnet.crt \
        -subj "/C=ES/ST=Madrid/L=Madrid/O=QiangNet/CN=localhost"
    
    openssl dhparam -out nginx/ssl/dhparam.pem 2048
    echo "✅ Certificados SSL generados"
fi

# Configurar permisos
echo "🔒 Configurando permisos..."
chmod 600 nginx/ssl/qiangnet.key
chmod 644 nginx/ssl/qiangnet.crt
chmod 644 nginx/ssl/dhparam.pem

# Limpiar caché de Docker
echo "🧹 Limpiando caché de Docker..."
docker system prune -f

# Verificar y crear .env si no existe
if [ ! -f ".env" ]; then
    echo "⚙️ Creando archivo .env..."
    cp .env.example .env
    echo "✅ Archivo .env creado desde .env.example"
fi

# Verificar node_modules
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

echo "✅ Problemas comunes solucionados"
