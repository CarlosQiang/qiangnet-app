"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { Badge } from "@/components/ui/Badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { User, Shield, Save, Camera, Key, Bell } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const profileSchema = z.object({
  full_name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  bio: z.string().max(500, "La biografía no puede exceder 500 caracteres").optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    if (user) {
      reset({
        full_name: user.full_name,
        bio: user.profile?.bio || "",
        phone: user.profile?.phone || "",
        location: user.profile?.location || "",
        website: user.profile?.website || "",
      })
    }
  }, [user, reset])

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true)
      await updateProfile(data)
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">Mi Perfil</h1>
          <p className="text-muted-foreground text-lg">Gestiona tu información personal y configuración</p>
        </motion.div>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.profile?.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback className="text-2xl">
                      {user.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button size="icon" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full">
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-2xl font-bold">{user.full_name}</h2>
                  <p className="text-muted-foreground">@{user.username}</p>
                  <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
                  <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                    <Badge variant="outline">
                      <Shield className="h-3 w-3 mr-1" />
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                    <Badge variant={user.status === "active" ? "success" : "secondary"}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </Badge>
                    {user.is_approved && <Badge variant="success">Aprobado</Badge>}
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <p className="text-sm text-muted-foreground">Miembro desde</p>
                  <p className="font-medium">{new Date(user.created_at).toLocaleDateString()}</p>
                  {user.last_login && (
                    <>
                      <p className="text-sm text-muted-foreground mt-2">Último acceso</p>
                      <p className="font-medium">{new Date(user.last_login).toLocaleDateString()}</p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Perfil</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                <span className="hidden sm:inline">Seguridad</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Preferencias</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                  <CardDescription>Actualiza tu información personal y biografía</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Nombre Completo</label>
                        <Input
                          {...register("full_name")}
                          error={errors.full_name?.message}
                          placeholder="Tu nombre completo"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Teléfono</label>
                        <Input {...register("phone")} error={errors.phone?.message} placeholder="+1 234 567 8900" />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Biografía</label>
                      <Textarea
                        {...register("bio")}
                        error={errors.bio?.message}
                        placeholder="Cuéntanos sobre ti..."
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Ubicación</label>
                        <Input {...register("location")} error={errors.location?.message} placeholder="Ciudad, País" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Sitio Web</label>
                        <Input
                          {...register("website")}
                          error={errors.website?.message}
                          placeholder="https://tu-sitio.com"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" loading={isLoading} className="btn-glow">
                        <Save className="h-4 w-4 mr-2" />
                        Guardar Cambios
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle>Cambiar Contraseña</CardTitle>
                  <CardDescription>Actualiza tu contraseña para mantener tu cuenta segura</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Contraseña Actual</label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Nueva Contraseña</label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Confirmar Nueva Contraseña</label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div className="flex justify-end">
                    <Button className="btn-glow">
                      <Key className="h-4 w-4 mr-2" />
                      Actualizar Contraseña
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardHeader>
                  <CardTitle>Sesiones Activas</CardTitle>
                  <CardDescription>Gestiona tus sesiones activas en diferentes dispositivos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Navegador Actual</p>
                        <p className="text-sm text-muted-foreground">Chrome en Windows • Activo ahora</p>
                      </div>
                      <Badge variant="success">Actual</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Móvil</p>
                        <p className="text-sm text-muted-foreground">Safari en iPhone • Hace 2 horas</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Cerrar Sesión
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6">
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle>Notificaciones</CardTitle>
                  <CardDescription>Configura cómo y cuándo recibir notificaciones</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notificaciones por Email</p>
                      <p className="text-sm text-muted-foreground">Recibir actualizaciones importantes por email</p>
                    </div>
                    <input type="checkbox" className="h-4 w-4" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notificaciones del Sistema</p>
                      <p className="text-sm text-muted-foreground">Alertas sobre el estado del servidor</p>
                    </div>
                    <input type="checkbox" className="h-4 w-4" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Actualizaciones de Aplicaciones</p>
                      <p className="text-sm text-muted-foreground">Notificar cuando hay nuevas aplicaciones</p>
                    </div>
                    <input type="checkbox" className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardHeader>
                  <CardTitle>Privacidad</CardTitle>
                  <CardDescription>Controla la visibilidad de tu información</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Perfil Público</p>
                      <p className="text-sm text-muted-foreground">Permitir que otros usuarios vean tu perfil</p>
                    </div>
                    <input type="checkbox" className="h-4 w-4" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Mostrar Estado Online</p>
                      <p className="text-sm text-muted-foreground">Mostrar cuando estás conectado</p>
                    </div>
                    <input type="checkbox" className="h-4 w-4" defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
