"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Textarea } from "@/components/ui/Textarea"
import { Switch } from "@/components/ui/Switch"
import { Badge } from "@/components/ui/Badge"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { Modal } from "@/components/ui/Modal"
import { Search, Plus, Edit, Trash2, ExternalLink, Settings, Star, Play, Pause, Clock, Save, X } from "lucide-react"
import { applicationsApi } from "@/lib/api"
import { useApi } from "@/hooks/useApi"
import type { Application } from "@/lib/types"

export default function AdminApplicationsPage() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [showAppModal, setShowAppModal] = useState(false)
  const [editingApp, setEditingApp] = useState<Application | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    url: "",
    icon: "",
    category: "other" as const,
    required_role: "user" as const,
    status: "active" as const,
    is_featured: false,
    order_index: 0,
  })

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

  const handleOpenModal = (app?: Application) => {
    if (app) {
      setEditingApp(app)
      setFormData({
        name: app.name,
        description: app.description,
        url: app.url,
        icon: app.icon,
        category: app.category,
        required_role: app.required_role,
        status: app.status,
        is_featured: app.is_featured,
        order_index: app.order_index,
      })
    } else {
      setEditingApp(null)
      setFormData({
        name: "",
        description: "",
        url: "",
        icon: "",
        category: "other",
        required_role: "user",
        status: "active",
        is_featured: false,
        order_index: 0,
      })
    }
    setShowAppModal(true)
  }

  const handleSaveApplication = async () => {
    try {
      // Aquí iría la lógica para guardar/actualizar la aplicación
      console.log("Saving application:", formData)
      setShowAppModal(false)
      await fetchApplications()
    } catch (error) {
      console.error("Error saving application:", error)
    }
  }

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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Gestión de Aplicaciones</h1>
              <p className="text-muted-foreground text-lg">Configura y administra las aplicaciones del sistema</p>
            </div>
            <Button className="btn-glow" onClick={() => handleOpenModal()}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Aplicación
            </Button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
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
                <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                  <option value="all">Todas las categorías</option>
                  <option value="media">Media</option>
                  <option value="productivity">Productividad</option>
                  <option value="development">Desarrollo</option>
                  <option value="system">Sistema</option>
                  <option value="gaming">Gaming</option>
                  <option value="other">Otros</option>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Applications Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredApplications.map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="card-hover group relative overflow-hidden">
                {app.is_featured && (
                  <div className="absolute top-2 right-2 z-10">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  </div>
                )}

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
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
                      {app.status === "active" ? "Activo" : app.status === "inactive" ? "Inactivo" : "Mantenimiento"}
                    </Badge>
                    <Badge variant="outline">{app.required_role}</Badge>
                  </div>

                  <div className="text-xs text-muted-foreground">URL: {app.url}</div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => handleOpenModal(app)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => window.open(app.url, "_blank")}>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Application Modal */}
        <Modal
          isOpen={showAppModal}
          onClose={() => setShowAppModal(false)}
          title={editingApp ? "Editar Aplicación" : "Nueva Aplicación"}
          size="lg"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Nombre</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nombre de la aplicación"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">URL</label>
                <Input
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://app.ejemplo.com"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Descripción</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción de la aplicación"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Categoría</label>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                >
                  <option value="media">Media</option>
                  <option value="productivity">Productividad</option>
                  <option value="development">Desarrollo</option>
                  <option value="system">Sistema</option>
                  <option value="gaming">Gaming</option>
                  <option value="other">Otros</option>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Rol Requerido</label>
                <Select
                  value={formData.required_role}
                  onChange={(e) => setFormData({ ...formData, required_role: e.target.value as any })}
                >
                  <option value="guest">Invitado</option>
                  <option value="user">Usuario</option>
                  <option value="moderator">Moderador</option>
                  <option value="admin">Administrador</option>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Estado</label>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                  <option value="maintenance">Mantenimiento</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">URL del Icono</label>
                <Input
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="https://ejemplo.com/icon.png"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Orden</label>
                <Input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: Number.parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
              />
              <label className="text-sm font-medium">Aplicación destacada</label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAppModal(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button onClick={handleSaveApplication}>
                <Save className="h-4 w-4 mr-2" />
                {editingApp ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}
