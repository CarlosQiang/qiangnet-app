import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/AuthContext"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { ParticlesProvider } from "@/contexts/ParticlesContext"
import { ParticlesBackground } from "@/components/ui/ParticlesBackground"
import { Toaster } from "react-hot-toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "QiangNet - Servidor Doméstico",
  description: "Sistema de gestión de servidor doméstico profesional",
  keywords: ["servidor", "doméstico", "gestión", "aplicaciones", "seguridad"],
  authors: [{ name: "QiangNet Team" }],
  robots: "noindex, nofollow", // Para seguridad en producción
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <ParticlesProvider>
            <AuthProvider>
              <ParticlesBackground />
              <div className="relative z-10">{children}</div>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "hsl(var(--background))",
                    color: "hsl(var(--foreground))",
                    border: "1px solid hsl(var(--border))",
                  },
                }}
              />
            </AuthProvider>
          </ParticlesProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
