#!/bin/bash

echo "🔍 VERIFICACIÓN PRE-DESPLIEGUE QIANGNET"
echo "======================================"

# Verificar archivos esenciales
echo "📁 Verificando archivos esenciales..."
files=(
    "package.json"
    "next.config.js"
    "Dockerfile"
    "docker-compose.yml"
    "tailwind.config.ts"
    "tsconfig.json"
    ".env.example"
    "nginx/nginx.conf"
    "scripts/init-db.sql"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file - OK"
    else
        echo "❌ $file - FALTANTE"
        exit 1
    fi
done

# Verificar estructura de directorios
echo ""
echo "📂 Verificando estructura de directorios..."
dirs=(
    "app"
    "components/ui"
    "lib"
    "contexts"
    "hooks"
    "public"
    "nginx"
    "scripts"
)

for dir in "${dirs[@]}"; do
    if [ -d "$dir" ]; then
        echo "✅ $dir/ - OK"
    else
        echo "❌ $dir/ - FALTANTE"
        exit 1
    fi
done

# Verificar dependencias críticas en package.json
echo ""
echo "📦 Verificando dependencias críticas..."
if grep -q "next" package.json && grep -q "react" package.json && grep -q "tailwindcss" package.json; then
    echo "✅ Dependencias críticas - OK"
else
    echo "❌ Dependencias críticas - FALTANTES"
    exit 1
fi

# Verificar configuración de Docker
echo ""
echo "🐳 Verificando configuración Docker..."
if docker --version > /dev/null 2>&1; then
    echo "✅ Docker instalado - OK"
else
    echo "❌ Docker no instalado"
    exit 1
fi

if docker-compose --version > /dev/null 2>&1; then
    echo "✅ Docker Compose instalado - OK"
else
    echo "❌ Docker Compose no instalado"
    exit 1
fi

echo ""
echo "🎉 VERIFICACIÓN COMPLETADA - TODO LISTO PARA DESPLIEGUE"
