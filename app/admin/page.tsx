"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { hasPermission } from "@/lib/auth-config"
import {
  Users,
  Server,
  Settings,
  Shield,
  Palette,
  Database,
  Activity,
  FileText,
  ArrowRight,
  BarChart3,
  Globe,
  Lock,
  DatabaseBackupIcon as Backup,
  Bell,
} from "lucide-react"

export default function AdminPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || !hasPermission(user.role, "canAccessAdmin"))) {
      router.push("/unauthorized")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user || !hasPermission(user.role, "canAccessAdmin")) {
    return null
  }

  const adminSections = [
    {
      title: "Gestión de Usuarios",
      description: "Administrar usuarios, roles y permisos del sistema",
      icon: Users,
      href: "/admin/users",
      color: "bg-blue-500",
      permission: "canManageUsers",
    },
    {
      title: "Gestión de Aplicaciones",
      description: "Configurar aplicaciones y servicios disponibles",
      icon: Server,
      href: "/admin/applications",
      color: "bg-green-500",
      permission: "canManageApplications",
    },
    {
      title: "Personalización",
      description: "Personalizar colores, temas y apariencia general",
      icon: Palette,
      href: "/admin/customization",
      color: "bg-pink-500",
      permission: "canModifySettings",
    },
    {
      title: "Configuración del Sistema",
      description: "Ajustes generales, email, seguridad y más",
      icon: Settings,
      href: "/admin/settings",
      color: "bg-purple-500",
      permission: "canModifySettings",
    },
    {
      title: "Gestión de Contenido",
      description: "Editar páginas, textos y contenido del sitio",
      icon: FileText,
      href: "/admin/content",
      color: "bg-indigo-500",
      permission: "canModifySettings",
    },
    {
      title: "Analytics y Reportes",
      description: "Estadísticas de uso y reportes del sistema",
      icon: BarChart3,
      href: "/admin/analytics",
      color: "bg-cyan-500",
      permission: "canViewLogs",
    },
    {
      title: "Configuración de Red",
      description: "DNS, dominios, SSL y configuración de red",
      icon: Globe,
      href: "/admin/network",
      color: "bg-teal-500",
      permission: "canModifySettings",
    },
    {
      title: "Seguridad Avanzada",
      description: "Firewall, autenticación 2FA y políticas de seguridad",
      icon: Shield,
      href: "/admin/security",
      color: "bg-red-500",
      permission: "canModifySettings",
    },
    {
      title: "Base de Datos",
      description: "Backups, restauración y mantenimiento de BD",
      icon: Database,
      href: "/admin/database",
      color: "bg-orange-500",
      permission: "canManageBackups",
    },
    {
      title: "Logs y Monitoreo",
      description: "Logs del sistema, monitoreo y auditoría",
      icon: Activity,
      href: "/admin/logs",
      color: "bg-yellow-500",
      permission: "canViewLogs",
    },
    {
      title: "Backups y Restauración",
      description: "Gestión de copias de seguridad automáticas",
      icon: Backup,
      href: "/admin/backups",
      color: "bg-emerald-500",
      permission: "canManageBackups",
    },
    {
      title: "Notificaciones",
      description: "Configurar alertas, emails y notificaciones",
      icon: Bell,
      href: "/admin/notifications",
      color: "bg-violet-500",
      permission: "canModifySettings",
    },
  ]

  // Filtrar secciones según permisos del usuario
  const availableSections = adminSections.filter((section) => hasPermission(user.role, section.permission as any))

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <Shield className="h-10 w-10 text-primary" />
            Panel de Administración
          </h1>
          <p className="text-muted-foreground text-lg">
            Control total sobre tu servidor doméstico QiangNet. Personaliza, configura y gestiona todo desde aquí.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">
              Conectado como <strong>{user.full_name}</strong> ({user.role})
            </span>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="card-hover">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Usuarios Totales</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="card-hover">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Servicios Activos</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <Server className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="card-hover">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Uptime</p>
                  <p className="text-2xl font-bold">99.9%</p>
                </div>
                <Activity className="h-8 w-8 text-cyan-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="card-hover">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Último Backup</p>
                  <p className="text-2xl font-bold">Hoy</p>
                </div>
                <Database className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Admin Sections Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {availableSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="card-hover group cursor-pointer h-full" onClick={() => router.push(section.href)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`h-12 w-12 rounded-lg ${section.color} flex items-center justify-center`}>
                      <section.icon className="h-6 w-6 text-white" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{section.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Acciones Rápidas de Administrador
              </CardTitle>
              <CardDescription>Las tareas más comunes al alcance de un clic</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => router.push("/admin/users")}
                >
                  <Users className="h-6 w-6 mb-2 text-primary" />
                  <h3 className="font-medium">Gestionar Usuarios</h3>
                  <p className="text-sm text-muted-foreground">Aprobar, bloquear y gestionar usuarios</p>
                </div>

                <div
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => router.push("/admin/customization")}
                >
                  <Palette className="h-6 w-6 mb-2 text-primary" />
                  <h3 className="font-medium">Personalizar Apariencia</h3>
                  <p className="text-sm text-muted-foreground">Cambiar colores, logos y temas</p>
                </div>

                <div
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => router.push("/admin/applications")}
                >
                  <Server className="h-6 w-6 mb-2 text-primary" />
                  <h3 className="font-medium">Añadir Servicios</h3>
                  <p className="text-sm text-muted-foreground">Configurar nuevas aplicaciones</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">¿Necesitas ayuda?</h3>
                  <p className="text-muted-foreground mb-4">
                    QiangNet está diseñado para ser fácil de usar, pero si necesitas ayuda, tenemos recursos
                    disponibles.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm hover:bg-primary/20 transition-colors">
                      📖 Documentación
                    </button>
                    <button className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm hover:bg-primary/20 transition-colors">
                      🎥 Video Tutoriales
                    </button>
                    <button className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm hover:bg-primary/20 transition-colors">
                      💬 Soporte
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
