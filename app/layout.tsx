import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { AuthProvider } from "@/contexts/AuthContext"
import { ParticlesProvider } from "@/contexts/ParticlesContext"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import ParticlesBackground from "@/components/ui/ParticlesBackground"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "QiangNet - Secure Network Management",
  description: "Advanced secure network management platform with enterprise-grade security",
  keywords: ["network", "security", "management", "enterprise", "qiangnet"],
  authors: [{ name: "QiangNet Team" }],
  viewport: "width=device-width, initial-scale=1",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <ParticlesProvider>
              <div className="relative min-h-screen flex flex-col">
                <ParticlesBackground />
                <Navbar />
                <main className="flex-1 relative z-10">{children}</main>
                <Footer />
              </div>
            </ParticlesProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
