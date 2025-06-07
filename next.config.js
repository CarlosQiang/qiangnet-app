/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  // Optimizaciones de performance
  swcMinify: true,
  compress: true,

  // Configuración de imágenes
  images: {
    domains: ["localhost", "127.0.0.1", "api"],
    unoptimized: false,
    formats: ["image/webp", "image/avif"],
  },

  // Variables de entorno
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "QiangNet",
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
    NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT || "development",
  },

  // Headers de seguridad
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ]
  },

  // Redirects
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/admin/dashboard",
        permanent: false,
      },
    ]
  },

  // Configuración de webpack
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimizaciones adicionales
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = "all"
    }

    return config
  },

  // Configuración experimental
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  // Configuración de TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },

  // Configuración de ESLint
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Configuración de PWA (opcional)
  ...(process.env.NEXT_PUBLIC_ENABLE_PWA === "true" && {
    pwa: {
      dest: "public",
      register: true,
      skipWaiting: true,
    },
  }),
}

module.exports = nextConfig
