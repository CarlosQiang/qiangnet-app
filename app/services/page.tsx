"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { applicationsApi } from "@/lib/api"
import type { Application } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { ExternalLink, Search, Grid, List, ArrowUpDown, Star } from "lucide-react"

export default function ServicesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [filteredApps, setFilteredApps] = useState<Application[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"name" | "category">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [activeCategory, setActiveCategory] = useState<string>("all")

  // Cargar aplicaciones
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const apps = await applicationsApi.getAll()
        setApplications(apps)
        setFilteredApps(apps)
      } catch (error) {
        console.error("Error al cargar aplicaciones:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchApplications()
  }, [])

  // Filtrar y ordenar aplicaciones
  useEffect(() => {
    let result = [...applications]

    // Filtrar por búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (app) =>
          app.name.toLowerCase().includes(query) ||
          app.description?.toLowerCase().includes(query) ||
          app.category.toLowerCase().includes(query),
      )
    }

    // Filtrar por categoría
    if (activeCategory !== "all") {
      result = result.filter((app) => app.category === activeCategory)
    }

    // Filtrar por rol de usuario
    if (user) {
      result = result.filter((app) => {
        if (app.required_role === "guest") return true
        if (app.required_role === "user" && ["user", "moderator", "admin"].includes(user.role)) return true
        if (app.required_role === "moderator" && ["moderator", "admin"].includes(user.role)) return true
        if (app.required_role === "admin" && user.role === "admin") return true
        return false
      })
    }

    // Ordenar
    result.sort((a, b) => {
      // Primero ordenar por destacados
      if (a.is_featured && !b.is_featured) return -1
      if (!a.is_featured && b.is_featured) return 1

      // Luego por el criterio seleccionado
      let valA, valB
      if (sortBy === "name") {
        valA = a.name.toLowerCase()
        valB = b.name.toLowerCase()
      } else {
        valA = a.category.toLowerCase()
        valB = b.category.toLowerCase()
      }

      if (sortOrder === "asc") {
        return valA > valB ? 1 : -1
      } else {
        return valA < valB ? 1 : -1
      }
    })

    setFilteredApps(result)
  }, [applications, searchQuery, activeCategory, sortBy, sortOrder, user])

  // Obtener categorías únicas
  const categories = ["all", ...new Set(applications.map((app) => app.category))]

  // Manejar cambio de orden
  const handleSortChange = () => {
    if (sortBy === "name") {
      setSortBy("category")
    } else {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
      setSortBy("name")
    }
  }

  // Abrir aplicación
  const openApplication = (app: Application) => {
    window.open(app.url, "_blank", "noopener,noreferrer")
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-16rem)]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Servicios</h1>
          <p className="text-muted-foreground">Accede a todos tus servicios y aplicaciones desde un solo lugar.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar servicios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-64"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="h-10 w-10"
            >
              <Grid className="h-4 w-4" />
              <span className="sr-only">Vista de cuadrícula</span>
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="h-10 w-10"
            >
              <List className="h-4 w-4" />
              <span className="sr-only">Vista de lista</span>
            </Button>
            <Button variant="outline" size="icon" onClick={handleSortChange} className="h-10 w-10">
              <ArrowUpDown className="h-4 w-4" />
              <span className="sr-only">Ordenar</span>
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
        <TabsList className="mb-4 flex flex-wrap">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category === "all" ? "Todos" : category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="mt-0">
            {filteredApps.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No se encontraron servicios que coincidan con tu búsqueda.</p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredApps.map((app) => (
                  <Card key={app.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    {app.is_featured && (
                      <div className="absolute top-2 right-2">
                        <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center overflow-hidden">
                          <img
                            src={app.icon || "/placeholder.svg?height=40&width=40"}
                            alt={app.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{app.name}</CardTitle>
                          <CardDescription className="capitalize">{app.category}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground line-clamp-2">{app.description}</p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        onClick={() => openApplication(app)}
                        className="w-full"
                        variant={app.status === "active" ? "default" : "outline"}
                        disabled={app.status !== "active"}
                      >
                        {app.status === "active" ? (
                          <>
                            Abrir <ExternalLink className="ml-2 h-4 w-4" />
                          </>
                        ) : app.status === "maintenance" ? (
                          "En mantenimiento"
                        ) : (
                          "Inactivo"
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApps.map((app) => (
                  <Card key={app.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center overflow-hidden">
                          <img
                            src={app.icon || "/placeholder.svg?height=48&width=48"}
                            alt={app.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{app.name}</h3>
                            {app.is_featured && <Star className="h-4 w-4 text-amber-400 fill-amber-400" />}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-1">{app.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 ml-auto">
                        <span className="text-xs px-2 py-1 rounded-full bg-muted capitalize">{app.category}</span>
                        <Button
                          onClick={() => openApplication(app)}
                          variant={app.status === "active" ? "default" : "outline"}
                          size="sm"
                          disabled={app.status !== "active"}
                        >
                          {app.status === "active" ? (
                            <>
                              Abrir <ExternalLink className="ml-2 h-3 w-3" />
                            </>
                          ) : app.status === "maintenance" ? (
                            "En mantenimiento"
                          ) : (
                            "Inactivo"
                          )}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
