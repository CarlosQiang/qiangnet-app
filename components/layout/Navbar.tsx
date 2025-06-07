"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { useTheme } from "@/contexts/ThemeContext"
import { Button } from "@/components/ui/Button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import {
  Menu,
  X,
  Sun,
  Moon,
  Monitor,
  LogOut,
  User,
  Settings,
  Bell,
  ChevronDown,
  Shield,
  Home,
  LayoutDashboard,
  Grid,
  Sparkles,
} from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  // Detectar scroll para cambiar estilo de navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Cerrar menú móvil al cambiar de ruta
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Determinar si la ruta actual es la activa
  const isActive = (path: string) => {
    if (path === "/") return pathname === "/"
    return pathname.startsWith(path)
  }

  // Alternar tema
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Cerrar sesión
  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">Q</span>
            </div>
            <span className="font-bold text-xl gradient-text">QiangNet</span>
          </Link>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link href="/">
              <Button variant={isActive("/") ? "default" : "ghost"} size="sm" className="flex items-center gap-1.5">
                <Home className="h-4 w-4" />
                <span>Inicio</span>
              </Button>
            </Link>

            {isAuthenticated && (
              <>
                <Link href="/dashboard">
                  <Button
                    variant={isActive("/dashboard") ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center gap-1.5"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Button>
                </Link>

                <Link href="/services">
                  <Button
                    variant={isActive("/services") ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center gap-1.5"
                  >
                    <Grid className="h-4 w-4" />
                    <span>Servicios</span>
                  </Button>
                </Link>

                {user?.role === "admin" && (
                  <Link href="/admin">
                    <Button
                      variant={isActive("/admin") ? "default" : "ghost"}
                      size="sm"
                      className="flex items-center gap-1.5"
                    >
                      <Shield className="h-4 w-4" />
                      <span>Admin</span>
                    </Button>
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Acciones Desktop */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Botón de tema */}
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                {/* Notificaciones */}
                <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </Button>

                {/* Menú de usuario */}
                <div className="relative group">
                  <Button variant="ghost" className="flex items-center space-x-2 h-9 px-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage
                        src={user?.profile?.avatar_url || "/placeholder.svg?height=32&width=32&query=user"}
                      />
                      <AvatarFallback>
                        {user?.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{user?.username}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>

                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-card shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm hover:bg-muted transition-colors"
                      >
                        <User className="h-4 w-4 mr-2" />
                        <span>Perfil</span>
                      </Link>
                      <Link
                        href="/admin/settings"
                        className="flex items-center px-4 py-2 text-sm hover:bg-muted transition-colors"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        <span>Configuración</span>
                      </Link>
                      <Link
                        href="/admin/particles"
                        className="flex items-center px-4 py-2 text-sm hover:bg-muted transition-colors"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        <span>Partículas</span>
                      </Link>
                      <div className="border-t border-muted my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-muted transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        <span>Cerrar sesión</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Iniciar sesión
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Registrarse</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Botón de menú móvil */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden bg-background border-t"
        >
          <div className="container mx-auto px-4 py-4 space-y-4">
            <nav className="flex flex-col space-y-2">
              <Link href="/">
                <Button
                  variant={isActive("/") ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setIsOpen(false)}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Inicio
                </Button>
              </Link>

              {isAuthenticated && (
                <>
                  <Link href="/dashboard">
                    <Button
                      variant={isActive("/dashboard") ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setIsOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>

                  <Link href="/services">
                    <Button
                      variant={isActive("/services") ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setIsOpen(false)}
                    >
                      <Grid className="h-4 w-4 mr-2" />
                      Servicios
                    </Button>
                  </Link>

                  {user?.role === "admin" && (
                    <Link href="/admin">
                      <Button
                        variant={isActive("/admin") ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setIsOpen(false)}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Admin
                      </Button>
                    </Link>
                  )}
                </>
              )}
            </nav>

            <div className="border-t border-muted pt-4">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user?.profile?.avatar_url || "/placeholder.svg?height=40&width=40&query=user"}
                      />
                      <AvatarFallback>
                        {user?.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user?.full_name}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/profile" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">
                        <User className="h-4 w-4 mr-2" />
                        Perfil
                      </Button>
                    </Link>
                    <Link href="/admin/settings" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">
                        <Settings className="h-4 w-4 mr-2" />
                        Configuración
                      </Button>
                    </Link>
                  </div>

                  <Button variant="default" className="w-full" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar sesión
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Iniciar sesión
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">Registrarse</Button>
                  </Link>
                </div>
              )}

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-muted">
                <span className="text-sm">Cambiar tema</span>
                <Button variant="ghost" size="sm" onClick={toggleTheme}>
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4 mr-2" />
                  ) : theme === "light" ? (
                    <Moon className="h-4 w-4 mr-2" />
                  ) : (
                    <Monitor className="h-4 w-4 mr-2" />
                  )}
                  {theme === "dark" ? "Claro" : theme === "light" ? "Oscuro" : "Sistema"}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  )
}
