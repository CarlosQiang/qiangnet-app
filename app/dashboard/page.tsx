"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { Users, Server, Activity, Shield, Clock, AlertTriangle, CheckCircle, XCircle, Settings } from "lucide-react"
import { dashboardApi } from "@/lib/api"
import { useApi } from "@/hooks/useApi"
import type { DashboardStats } from "@/lib/types"

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)

  const { data: statsData, loading, execute: fetchStats } = useApi(dashboardApi.getStats)

  useEffect(() => {
    fetchStats()
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (statsData) {
      setStats(statsData)
    }
  }, [statsData])

  const getSystemHealthColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-500"
      case "limited":
        return "text-yellow-500"
      case "offline":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const getSystemHealthIcon = (status: string) => {
    switch (status) {
      case "online":
        return CheckCircle
      case "limited":
        return AlertTriangle
      case "offline":
        return XCircle
      default:
        return Settings
    }
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (days > 0) return `${days}d ${hours}h ${minutes}m`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

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
          <h1 className="text-4xl font-bold mb-4">Bienvenido, {user?.full_name || user?.username}</h1>
          <p className="text-muted-foreground text-lg">Panel de control de tu servidor doméstico</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
        >
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios Totales</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{stats?.total_users || 0}</div>
              <p className="text-xs text-muted-foreground">{stats?.active_users || 0} activos</p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aplicaciones</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_applications || 0}</div>
              <p className="text-xs text-muted-foreground">{stats?.active_applications || 0} activas</p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estado del Sistema</CardTitle>
              {stats?.system_health &&
                (() => {
                  const HealthIcon = getSystemHealthIcon(stats.system_health.network_status)
                  return (
                    <HealthIcon className={`h-4 w-4 ${getSystemHealthColor(stats.system_health.network_status)}`} />
                  )
                })()}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {stats?.system_health?.network_status || "Desconocido"}
              </div>
              <p className="text-xs text-muted-foreground">
                Uptime: {stats?.system_health ? formatUptime(stats.system_health.uptime) : "N/A"}
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Actividad</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.recent_activity?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Eventos recientes</p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
          {/* System Health */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Estado del Sistema
                </CardTitle>
                <CardDescription>Métricas en tiempo real del servidor</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {stats?.system_health ? (
                  <>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">CPU</span>
                          <span className="text-sm text-muted-foreground">{stats.system_health.cpu_usage}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${stats.system_health.cpu_usage}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Memoria</span>
                          <span className="text-sm text-muted-foreground">{stats.system_health.memory_usage}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${stats.system_health.memory_usage}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Disco</span>
                          <span className="text-sm text-muted-foreground">{stats.system_health.disk_usage}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${stats.system_health.disk_usage}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <span>Último backup:</span>
                        <span className="text-muted-foreground">
                          {stats.system_health.last_backup
                            ? new Date(stats.system_health.last_backup).toLocaleDateString()
                            : "Nunca"}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Settings className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No hay datos del sistema disponibles</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Actividad Reciente
                </CardTitle>
                <CardDescription>Últimas acciones en el sistema</CardDescription>
              </CardHeader>
              <CardContent>
                {stats?.recent_activity && stats.recent_activity.length > 0 ? (
                  <div className="space-y-4">
                    {stats.recent_activity.slice(0, 5).map((activity, index) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="h-2 w-2 bg-primary rounded-full mt-2" />
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">
                            {activity.user_email} • {activity.resource}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No hay actividad reciente</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        {user?.role === "admin" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8"
          >
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Acciones Rápidas de Administrador
                </CardTitle>
                <CardDescription>Gestiona tu servidor desde aquí</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <a href="/admin/users" className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <Users className="h-6 w-6 mb-2 text-primary" />
                    <h3 className="font-medium">Gestionar Usuarios</h3>
                    <p className="text-sm text-muted-foreground">Aprobar, bloquear y gestionar usuarios</p>
                  </a>

                  <a href="/admin/applications" className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <Server className="h-6 w-6 mb-2 text-primary" />
                    <h3 className="font-medium">Gestionar Aplicaciones</h3>
                    <p className="text-sm text-muted-foreground">Añadir y configurar aplicaciones</p>
                  </a>

                  <a href="/admin/settings" className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <Settings className="h-6 w-6 mb-2 text-primary" />
                    <h3 className="font-medium">Configuración</h3>
                    <p className="text-sm text-muted-foreground">Personalizar el sistema</p>
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
