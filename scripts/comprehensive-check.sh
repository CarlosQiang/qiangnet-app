#!/bin/bash

echo "🔍 VERIFICACIÓN EXHAUSTIVA PRE-DESPLIEGUE QIANGNET"
echo "=================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para verificar archivos
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅ $1 - EXISTE${NC}"
        return 0
    else
        echo -e "${RED}❌ $1 - FALTANTE${NC}"
        return 1
    fi
}

# Función para verificar directorios
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅ $1/ - EXISTE${NC}"
        return 0
    else
        echo -e "${RED}❌ $1/ - FALTANTE${NC}"
        return 1
    fi
}

# Contador de errores
errors=0

echo "📁 VERIFICANDO ESTRUCTURA DE ARCHIVOS"
echo "====================================="

# Archivos de configuración críticos
config_files=(
    "package.json"
    "next.config.js"
    "tailwind.config.ts"
    "tsconfig.json"
    "postcss.config.js"
    "Dockerfile"
    "docker-compose.yml"
    ".env.example"
    ".gitignore"
)

for file in "${config_files[@]}"; do
    if ! check_file "$file"; then
        ((errors++))
    fi
done

# Directorios críticos
critical_dirs=(
    "app"
    "components"
    "components/ui"
    "lib"
    "contexts"
    "hooks"
    "public"
    "nginx"
    "scripts"
)

echo ""
echo "📂 VERIFICANDO DIRECTORIOS CRÍTICOS"
echo "==================================="

for dir in "${critical_dirs[@]}"; do
    if ! check_dir "$dir"; then
        ((errors++))
    fi
done

# Archivos de la aplicación
echo ""
echo "📄 VERIFICANDO ARCHIVOS DE LA APLICACIÓN"
echo "========================================"

app_files=(
    "app/layout.tsx"
    "app/page.tsx"
    "app/login/page.tsx"
    "app/dashboard/page.tsx"
    "app/admin/page.tsx"
    "app/globals.css"
    "lib/utils.ts"
    "lib/types.ts"
    "lib/api.ts"
    "components/ui/Button.tsx"
    "components/ui/Card.tsx"
    "components/ui/Input.tsx"
)

for file in "${app_files[@]}"; do
    if ! check_file "$file"; then
        ((errors++))
    fi
done

# Verificar configuración de Docker
echo ""
echo "🐳 VERIFICANDO CONFIGURACIÓN DOCKER"
echo "==================================="

if command -v docker &> /dev/null; then
    echo -e "${GREEN}✅ Docker instalado - $(docker --version)${NC}"
else
    echo -e "${RED}❌ Docker NO instalado${NC}"
    ((errors++))
fi

if command -v docker-compose &> /dev/null; then
    echo -e "${GREEN}✅ Docker Compose instalado - $(docker-compose --version)${NC}"
else
    echo -e "${RED}❌ Docker Compose NO instalado${NC}"
    ((errors++))
fi

# Verificar sintaxis de docker-compose.yml
if [ -f "docker-compose.yml" ]; then
    if docker-compose config > /dev/null 2>&1; then
        echo -e "${GREEN}✅ docker-compose.yml - SINTAXIS VÁLIDA${NC}"
    else
        echo -e "${RED}❌ docker-compose.yml - SINTAXIS INVÁLIDA${NC}"
        ((errors++))
    fi
fi

# Verificar package.json
echo ""
echo "📦 VERIFICANDO DEPENDENCIAS"
echo "==========================="

if [ -f "package.json" ]; then
    # Verificar dependencias críticas
    critical_deps=("next" "react" "react-dom" "tailwindcss" "typescript")
    
    for dep in "${critical_deps[@]}"; do
        if grep -q "\"$dep\"" package.json; then
            echo -e "${GREEN}✅ $dep - PRESENTE${NC}"
        else
            echo -e "${RED}❌ $dep - FALTANTE${NC}"
            ((errors++))
        fi
    done
    
    # Verificar scripts
    if grep -q "\"build\"" package.json; then
        echo -e "${GREEN}✅ Script build - PRESENTE${NC}"
    else
        echo -e "${RED}❌ Script build - FALTANTE${NC}"
        ((errors++))
    fi
fi

# Verificar configuración de NGINX
echo ""
echo "🌐 VERIFICANDO CONFIGURACIÓN NGINX"
echo "=================================="

if check_file "nginx/nginx.conf"; then
    # Verificar sintaxis básica
    if grep -q "server {" nginx/nginx.conf && grep -q "location /" nginx/nginx.conf; then
        echo -e "${GREEN}✅ nginx.conf - CONFIGURACIÓN BÁSICA VÁLIDA${NC}"
    else
        echo -e "${RED}❌ nginx.conf - CONFIGURACIÓN INCOMPLETA${NC}"
        ((errors++))
    fi
fi

# Verificar scripts de base de datos
echo ""
echo "🗄️ VERIFICANDO SCRIPTS DE BASE DE DATOS"
echo "======================================="

if check_file "scripts/init-db.sql"; then
    if grep -q "CREATE TABLE" scripts/init-db.sql; then
        echo -e "${GREEN}✅ init-db.sql - CONTIENE TABLAS${NC}"
    else
        echo -e "${YELLOW}⚠️ init-db.sql - NO CONTIENE TABLAS${NC}"
    fi
fi

# Verificar configuración de Next.js
echo ""
echo "⚛️ VERIFICANDO CONFIGURACIÓN NEXT.JS"
echo "===================================="

if [ -f "next.config.js" ]; then
    if grep -q "output.*standalone" next.config.js; then
        echo -e "${GREEN}✅ next.config.js - CONFIGURADO PARA DOCKER${NC}"
    else
        echo -e "${YELLOW}⚠️ next.config.js - FALTA CONFIGURACIÓN DOCKER${NC}"
    fi
fi

# Verificar TypeScript
echo ""
echo "📝 VERIFICANDO CONFIGURACIÓN TYPESCRIPT"
echo "======================================="

if [ -f "tsconfig.json" ]; then
    if node -e "JSON.parse(require('fs').readFileSync('tsconfig.json', 'utf8'))" 2>/dev/null; then
        echo -e "${GREEN}✅ tsconfig.json - JSON VÁLIDO${NC}"
    else
        echo -e "${RED}❌ tsconfig.json - JSON INVÁLIDO${NC}"
        ((errors++))
    fi
fi

# Verificar variables de entorno
echo ""
echo "🔧 VERIFICANDO VARIABLES DE ENTORNO"
echo "==================================="

if [ -f ".env.example" ]; then
    required_vars=("NEXT_PUBLIC_API_URL" "JWT_SECRET" "DB_PASSWORD")
    
    for var in "${required_vars[@]}"; do
        if grep -q "$var" .env.example; then
            echo -e "${GREEN}✅ $var - DEFINIDA EN EJEMPLO${NC}"
        else
            echo -e "${RED}❌ $var - FALTANTE EN EJEMPLO${NC}"
            ((errors++))
        fi
    done
fi

# Verificar puertos
echo ""
echo "🔌 VERIFICANDO CONFIGURACIÓN DE PUERTOS"
echo "======================================="

if [ -f "docker-compose.yml" ]; then
    if grep -q "3000:3000" docker-compose.yml; then
        echo -e "${GREEN}✅ Puerto 3000 (Frontend) - CONFIGURADO${NC}"
    else
        echo -e "${RED}❌ Puerto 3000 (Frontend) - NO CONFIGURADO${NC}"
        ((errors++))
    fi
    
    if grep -q "3001:3001" docker-compose.yml; then
        echo -e "${GREEN}✅ Puerto 3001 (API) - CONFIGURADO${NC}"
    else
        echo -e "${RED}❌ Puerto 3001 (API) - NO CONFIGURADO${NC}"
        ((errors++))
    fi
    
    if grep -q "5432:5432" docker-compose.yml; then
        echo -e "${GREEN}✅ Puerto 5432 (PostgreSQL) - CONFIGURADO${NC}"
    else
        echo -e "${RED}❌ Puerto 5432 (PostgreSQL) - NO CONFIGURADO${NC}"
        ((errors++))
    fi
fi

# Verificar healthchecks
echo ""
echo "🏥 VERIFICANDO HEALTHCHECKS"
echo "==========================="

if [ -f "docker-compose.yml" ]; then
    if grep -q "healthcheck:" docker-compose.yml; then
        echo -e "${GREEN}✅ Healthchecks - CONFIGURADOS${NC}"
    else
        echo -e "${YELLOW}⚠️ Healthchecks - NO CONFIGURADOS${NC}"
    fi
fi

# Verificar seguridad
echo ""
echo "🔒 VERIFICANDO CONFIGURACIÓN DE SEGURIDAD"
echo "========================================="

security_checks=0

if [ -f "Dockerfile" ]; then
    if grep -q "USER.*nextjs" Dockerfile; then
        echo -e "${GREEN}✅ Usuario no-root en Dockerfile${NC}"
        ((security_checks++))
    fi
fi

if [ -f "nginx/nginx.conf" ]; then
    if grep -q "X-Frame-Options" nginx/nginx.conf; then
        echo -e "${GREEN}✅ Headers de seguridad en NGINX${NC}"
        ((security_checks++))
    fi
fi

if [ -f "next.config.js" ]; then
    if grep -q "headers" next.config.js; then
        echo -e "${GREEN}✅ Headers de seguridad en Next.js${NC}"
        ((security_checks++))
    fi
fi

echo -e "${GREEN}✅ Verificaciones de seguridad pasadas: $security_checks/3${NC}"

# Resumen final
echo ""
echo "📊 RESUMEN DE VERIFICACIÓN"
echo "========================="

if [ $errors -eq 0 ]; then
    echo -e "${GREEN}🎉 VERIFICACIÓN COMPLETADA SIN ERRORES${NC}"
    echo -e "${GREEN}✅ LA APLICACIÓN ESTÁ LISTA PARA DESPLIEGUE${NC}"
    exit 0
else
    echo -e "${RED}❌ SE ENCONTRARON $errors ERRORES${NC}"
    echo -e "${RED}🚫 CORRIGE LOS ERRORES ANTES DEL DESPLIEGUE${NC}"
    exit 1
fi
