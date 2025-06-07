# QiangNet - Secure Network Management Platform

Una plataforma avanzada de gestión de redes seguras con seguridad de nivel empresarial.

## 🚀 Características Principales

- **Autenticación Segura**: Sistema de autenticación robusto con JWT
- **Panel de Administración**: Gestión completa de usuarios y aplicaciones
- **Sistema de Partículas**: Efectos visuales personalizables para una experiencia única
- **Responsive Design**: Optimizado para todos los dispositivos
- **Tema Oscuro/Claro**: Soporte completo para ambos temas
- **Seguridad Avanzada**: Middleware de seguridad y protección CSRF

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Autenticación**: JWT, NextAuth.js
- **Base de Datos**: PostgreSQL (configuración incluida)
- **Despliegue**: Docker, Docker Compose, Nginx

## 📦 Instalación

### Desarrollo Local

1. **Clonar el repositorio**
\`\`\`bash
git clone <repository-url>
cd qiangnet-secure-app
\`\`\`

2. **Instalar dependencias**
\`\`\`bash
npm install
\`\`\`

3. **Configurar variables de entorno**
\`\`\`bash
cp .env.example .env.local
\`\`\`

Edita `.env.local` con tus configuraciones:
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME=QiangNet
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_ENVIRONMENT=development
JWT_SECRET=tu_jwt_secret_muy_seguro
\`\`\`

4. **Ejecutar en desarrollo**
\`\`\`bash
npm run dev
\`\`\`

### Despliegue con Docker

1. **Construir y ejecutar con Docker Compose**
\`\`\`bash
docker-compose up -d
\`\`\`

2. **Verificar el estado**
\`\`\`bash
docker-compose ps
\`\`\`

La aplicación estará disponible en `http://localhost:3000`

## 🎨 Sistema de Partículas

La aplicación incluye un sistema de partículas completamente personalizable:

- **6 Presets Profesionales**: Default, Minimal, Zen, Meditation, Calm, Peaceful
- **Configuración Avanzada**: Control total sobre velocidad, opacidad, conexiones
- **Optimización de Rendimiento**: Intersection Observer y animaciones optimizadas
- **Responsive**: Adaptado para móviles y escritorio

### Configurar Partículas

Accede a `/admin/particles` para configurar:
- Cantidad y tamaño de partículas
- Colores y formas
- Tipos de animación
- Interactividad con mouse
- Efectos de fondo

## 🔐 Seguridad

- **Middleware de Autenticación**: Protección de rutas sensibles
- **Headers de Seguridad**: X-Frame-Options, CSP, HSTS
- **Validación de Entrada**: Sanitización de datos
- **Rate Limiting**: Protección contra ataques de fuerza bruta

## 📱 Características de UI/UX

- **Diseño Responsive**: Optimizado para móviles, tablets y escritorio
- **Tema Adaptativo**: Soporte para tema oscuro/claro automático
- **Animaciones Suaves**: Transiciones fluidas con Framer Motion
- **Accesibilidad**: Cumple con estándares WCAG 2.1

## 🚀 Scripts Disponibles

\`\`\`bash
# Desarrollo
npm run dev

# Construcción
npm run build

# Producción
npm start

# Linting
npm run lint

# Formateo
npm run format
\`\`\`

## 📊 Estructura del Proyecto

\`\`\`
qiangnet-secure-app/
├── app/                    # App Router de Next.js
│   ├── admin/             # Panel de administración
│   ├── api/               # API Routes
│   ├── dashboard/         # Dashboard principal
│   └── ...
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes de UI
│   └── layout/           # Componentes de layout
├── contexts/             # Contextos de React
├── hooks/                # Custom hooks
├── lib/                  # Utilidades y configuraciones
├── public/               # Archivos estáticos
└── styles/               # Estilos globales
\`\`\`

## 🔧 Configuración de Producción

### Variables de Entorno de Producción

\`\`\`env
NEXT_PUBLIC_API_URL=https://tu-dominio.com/api
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_ENABLE_PWA=true
DATABASE_URL=postgresql://user:password@localhost:5432/qiangnet
JWT_SECRET=tu_jwt_secret_super_seguro
\`\`\`

### Nginx (incluido en Docker)

La configuración de Nginx está optimizada para:
- Compresión gzip
- Cache de archivos estáticos
- Proxy reverso para la aplicación
- Headers de seguridad

## 🐛 Solución de Problemas

### Problemas Comunes

1. **Error de conexión a base de datos**
   - Verificar que PostgreSQL esté ejecutándose
   - Comprobar las credenciales en `.env`

2. **Partículas muy lentas/rápidas**
   - Ajustar la configuración en `/admin/particles`
   - Verificar el rendimiento del dispositivo

3. **Problemas de autenticación**
   - Verificar JWT_SECRET en variables de entorno
   - Limpiar localStorage del navegador

## 📈 Rendimiento

- **Lighthouse Score**: 95+ en todas las métricas
- **Core Web Vitals**: Optimizado para LCP, FID, CLS
- **Bundle Size**: Optimizado con tree-shaking
- **Lazy Loading**: Componentes y rutas cargadas bajo demanda

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico:
- Email: support@qiangnet.com
- Documentación: [docs.qiangnet.com](https://docs.qiangnet.com)
- Issues: [GitHub Issues](https://github.com/qiangnet/issues)

---

**QiangNet Team** - Construyendo el futuro de la gestión de redes seguras 🚀
