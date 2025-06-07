"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { Search, Grid, List, ExternalLink, Lock, Play, Pause, Settings, Star, Clock } from "lucide-react"
import { applicationsApi } from "@/lib/api"
import { useApi } from "@/hooks/useApi"
import type { Application } from "@/lib/types"

export default function ApplicationsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [applications, setApplications] = useState<Application[]>([])

  const { data: appsData, loading, execute: fetchApplications } = useApi(applicationsApi.getAll)

  useEffect(() => {
    fetchApplications()
  }, [])

  useEffect(() => {
    if (appsData) {
      setApplications(appsData)
    }
  }, [appsData])

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || app.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = [
    { id: "all", name: "Todas", count: applications.length },
    { id: "media", name: "Media", count: applications.filter((app) => app.category === "media").length },
    {
      id: "productivity",
      name: "Productividad",
      count: applications.filter((app) => app.category === "productivity").length,
    },
    {
      id: "development",
      name: "Desarrollo",
      count: applications.filter((app) => app.category === "development").length,
    },
    { id: "system", name: "Sistema", count: applications.filter((app) => app.category === "system").length },
    { id: "gaming", name: "Gaming", count: applications.filter((app) => app.category === "gaming").length },
    { id: "other", name: "Otros", count: applications.filter((app) => app.category === "other").length },
  ]

  const getCategoryColor = (category: string) => {
    const colors = {
      media: "bg-purple-500",
      productivity: "bg-blue-500",
      development: "bg-green-500",
      system: "bg-red-500",
      gaming: "bg-yellow-500",
      other: "bg-gray-500",
    }
    return colors[category as keyof typeof colors] || "bg-gray-500"
  }

  const getStatusColor = (status: string) => {
    const colors = {
      active: "success",
      inactive: "secondary",
      maintenance: "warning",
    }
    return colors[status as keyof typeof colors] || "secondary"
  }

  const canAccessApplication = (app: Application) => {
    if (!user) return false
    if (user.role === "admin") return true

    const roleHierarchy = { guest: 0, user: 1, moderator: 2, admin: 3 }
    const userLevel = roleHierarchy[user.role as keyof typeof roleHierarchy] || 0
    const requiredLevel = roleHierarchy[app.required_role as keyof typeof roleHierarchy] || 0

    return userLevel >= requiredLevel
  }

  const handleApplicationAccess = (app: Application) => {
    if (!canAccessApplication(app)) {
      alert("No tienes permisos para acceder a esta aplicación")
      return
    }

    if (app.status !== "active") {
      alert("Esta aplicación no está disponible en este momento")
      return
    }

    window.open(app.url, "_blank")
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
          <h1 className="text-4xl font-bold mb-4">Aplicaciones</h1>
          <p className="text-muted-foreground text-lg">
            Accede a todas tus aplicaciones self-hosted desde un solo lugar
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          <div className="flex flex-col sm:flex-row lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar aplicaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                {category.name}
                <Badge variant="secondary" className="text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Applications Grid/List */}
        {filteredApplications.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No se encontraron aplicaciones</p>
              <p className="text-sm">Intenta cambiar los filtros de búsqueda</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                : "space-y-4"
            }
          >
            {filteredApplications.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {viewMode === "grid" ? (
                  <Card className="card-hover group relative overflow-hidden">
                    {app.is_featured && (
                      <div className="absolute top-2 right-2 z-10">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      </div>
                    )}

                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                            {app.icon ? (
                              <img src={app.icon || "/placeholder.svg"} alt={app.name} className="h-8 w-8" />
                            ) : (
                              <Settings className="h-6 w-6 text-primary" />
                            )}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{app.name}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <div className={`h-2 w-2 rounded-full ${getCategoryColor(app.category)}`} />
                              <span className="text-xs text-muted-foreground capitalize">{app.category}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <CardDescription className="line-clamp-2">{app.description}</CardDescription>

                      <div className="flex items-center justify-between">
                        <Badge variant={getStatusColor(app.status) as any}>
                          {app.status === "active" && <Play className="h-3 w-3 mr-1" />}
                          {app.status === "inactive" && <Pause className="h-3 w-3 mr-1" />}
                          {app.status === "maintenance" && <Clock className="h-3 w-3 mr-1" />}
                          {app.status === "active"
                            ? "Activo"
                            : app.status === "inactive"
                              ? "Inactivo"
                              : "Mantenimiento"}
                        </Badge>

                        {!canAccessApplication(app) && <Lock className="h-4 w-4 text-muted-foreground" />}
                      </div>

                      <Button
                        className="w-full"
                        onClick={() => handleApplicationAccess(app)}
                        disabled={!canAccessApplication(app) || app.status !== "active"}
                        variant={canAccessApplication(app) && app.status === "active" ? "default" : "outline"}
                      >
                        {canAccessApplication(app) ? (
                          <>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Abrir
                          </>
                        ) : (
                          <>
                            <Lock className="h-4 w-4 mr-2" />
                            Sin acceso
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="card-hover">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                            {app.icon ? (
                              <img src={app.icon || "/placeholder.svg"} alt={app.name} className="h-6 w-6" />
                            ) : (
                              <Settings className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{app.name}</h3>
                              {app.is_featured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1">{app.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Badge variant={getStatusColor(app.status) as any}>
                            {app.status === "active"
                              ? "Activo"
                              : app.status === "inactive"
                                ? "Inactivo"
                                : "Mantenimiento"}
                          </Badge>

                          <Button
                            size="sm"
                            onClick={() => handleApplicationAccess(app)}
                            disabled={!canAccessApplication(app) || app.status !== "active"}
                            variant={canAccessApplication(app) && app.status === "active" ? "default" : "outline"}
                          >
                            {canAccessApplication(app) ? (
                              <>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Abrir
                              </>
                            ) : (
                              <>
                                <Lock className="h-4 w-4 mr-2" />
                                Sin acceso
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
