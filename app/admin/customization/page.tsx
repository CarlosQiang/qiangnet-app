"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Switch } from "@/components/ui/Switch"
import { ColorPicker } from "@/components/ui/ColorPicker"
import { Select } from "@/components/ui/Select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import {
  Palette,
  Save,
  RotateCcw,
  Eye,
  Upload,
  Download,
  Brush,
  Layout,
  Type,
  ImageIcon,
  Monitor,
  Sparkles,
} from "lucide-react"

export default function CustomizationPage() {
  const [settings, setSettings] = useState({
    // Branding
    siteName: "QiangNet",
    siteDescription: "Sistema de gestión de servidor doméstico",
    logoUrl: "",
    faviconUrl: "",

    // Colors
    primaryColor: "#3b82f6",
    secondaryColor: "#64748b",
    accentColor: "#10b981",
    backgroundColor: "#ffffff",
    textColor: "#1f2937",

    // Typography
    fontFamily: "Inter",
    fontSize: "16",
    headingFont: "Inter",

    // Layout
    sidebarPosition: "left",
    headerStyle: "modern",
    cardStyle: "elevated",
    borderRadius: "8",

    // Theme
    defaultTheme: "light",
    allowThemeSwitch: true,

    // Homepage
    heroTitle: "Tu Servidor Doméstico, Simplificado",
    heroSubtitle: "Gestiona todas tus aplicaciones self-hosted desde una interfaz moderna, segura y fácil de usar.",
    showStats: true,
    showFeatures: true,

    // Dashboard
    dashboardLayout: "grid",
    showWelcomeMessage: true,
    showQuickActions: true,

    // Services Page
    defaultView: "grid",
    showCategories: true,
    allowFavorites: true,

    // Advanced
    customCSS: "",
    customJS: "",
  })

  const [previewMode, setPreviewMode] = useState(false)

  const handleSave = () => {
    localStorage.setItem("qiangnet_customization", JSON.stringify(settings))
    // Aquí enviarías los settings al backend
    console.log("Saving customization settings:", settings)

    // Aplicar cambios inmediatamente
    applyCustomization()
  }

  const handleReset = () => {
    // Resetear a valores por defecto
    setSettings({
      siteName: "QiangNet",
      siteDescription: "Sistema de gestión de servidor doméstico",
      logoUrl: "",
      faviconUrl: "",
      primaryColor: "#3b82f6",
      secondaryColor: "#64748b",
      accentColor: "#10b981",
      backgroundColor: "#ffffff",
      textColor: "#1f2937",
      fontFamily: "Inter",
      fontSize: "16",
      headingFont: "Inter",
      sidebarPosition: "left",
      headerStyle: "modern",
      cardStyle: "elevated",
      borderRadius: "8",
      defaultTheme: "light",
      allowThemeSwitch: true,
      heroTitle: "Tu Servidor Doméstico, Simplificado",
      heroSubtitle: "Gestiona todas tus aplicaciones self-hosted desde una interfaz moderna, segura y fácil de usar.",
      showStats: true,
      showFeatures: true,
      dashboardLayout: "grid",
      showWelcomeMessage: true,
      showQuickActions: true,
      defaultView: "grid",
      showCategories: true,
      allowFavorites: true,
      customCSS: "",
      customJS: "",
    })
  }

  const applyCustomization = () => {
    // Aplicar colores CSS
    const root = document.documentElement
    root.style.setProperty("--primary", settings.primaryColor)
    root.style.setProperty("--secondary", settings.secondaryColor)
    root.style.setProperty("--accent", settings.accentColor)

    // Aplicar fuente
    document.body.style.fontFamily = settings.fontFamily
    document.body.style.fontSize = `${settings.fontSize}px`

    // Aplicar CSS personalizado
    let customStyleElement = document.getElementById("custom-styles")
    if (!customStyleElement) {
      customStyleElement = document.createElement("style")
      customStyleElement.id = "custom-styles"
      document.head.appendChild(customStyleElement)
    }
    customStyleElement.textContent = settings.customCSS
  }

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "qiangnet-customization.json"
    link.click()
  }

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string)
          setSettings(imported)
        } catch (error) {
          console.error("Error importing settings:", error)
        }
      }
      reader.readAsText(file)
    }
  }

  useEffect(() => {
    // Cargar configuración guardada
    const saved = localStorage.getItem("qiangnet_customization")
    if (saved) {
      try {
        setSettings(JSON.parse(saved))
      } catch (error) {
        console.error("Error loading saved customization:", error)
      }
    }
  }, [])

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
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Palette className="h-10 w-10 text-primary" />
                Personalización
              </h1>
              <p className="text-muted-foreground text-lg">Personaliza la apariencia y comportamiento de QiangNet</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
                <Eye className="h-4 w-4 mr-2" />
                {previewMode ? "Salir Vista Previa" : "Vista Previa"}
              </Button>
              <Button variant="outline" onClick={exportSettings}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <label className="cursor-pointer">
                <Button variant="outline" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Importar
                  </span>
                </Button>
                <input type="file" accept=".json" onChange={importSettings} className="hidden" />
              </label>
              <Button onClick={handleSave} className="btn-glow">
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </Button>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="branding" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
            <TabsTrigger value="branding" className="flex items-center gap-2">
              <Brush className="h-4 w-4" />
              <span className="hidden sm:inline">Marca</span>
            </TabsTrigger>
            <TabsTrigger value="colors" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Colores</span>
            </TabsTrigger>
            <TabsTrigger value="typography" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              <span className="hidden sm:inline">Tipografía</span>
            </TabsTrigger>
            <TabsTrigger value="layout" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              <span className="hidden sm:inline">Layout</span>
            </TabsTrigger>
            <TabsTrigger value="pages" className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              <span className="hidden sm:inline">Páginas</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Avanzado</span>
            </TabsTrigger>
            <TabsTrigger value="particles" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Partículas</span>
            </TabsTrigger>
          </TabsList>

          {/* Branding Tab */}
          <TabsContent value="branding">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información de la Marca</CardTitle>
                  <CardDescription>Configura el nombre y descripción de tu sitio</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Nombre del Sitio</label>
                    <Input
                      value={settings.siteName}
                      onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                      placeholder="QiangNet"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Descripción</label>
                    <Textarea
                      value={settings.siteDescription}
                      onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                      placeholder="Descripción de tu sitio"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Logos e Iconos</CardTitle>
                  <CardDescription>Personaliza el logo y favicon</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">URL del Logo</label>
                    <Input
                      value={settings.logoUrl}
                      onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                      placeholder="https://ejemplo.com/logo.png"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">URL del Favicon</label>
                    <Input
                      value={settings.faviconUrl}
                      onChange={(e) => setSettings({ ...settings, faviconUrl: e.target.value })}
                      placeholder="https://ejemplo.com/favicon.ico"
                    />
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      💡 <strong>Tip:</strong> Usa imágenes en formato PNG para el logo y ICO para el favicon. Tamaños
                      recomendados: Logo 200x50px, Favicon 32x32px.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Colors Tab */}
          <TabsContent value="colors">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Colores Principales</CardTitle>
                  <CardDescription>Define la paleta de colores de tu aplicación</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Color Primario</label>
                    <ColorPicker
                      value={settings.primaryColor}
                      onChange={(color) => setSettings({ ...settings, primaryColor: color })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Color Secundario</label>
                    <ColorPicker
                      value={settings.secondaryColor}
                      onChange={(color) => setSettings({ ...settings, secondaryColor: color })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Color de Acento</label>
                    <ColorPicker
                      value={settings.accentColor}
                      onChange={(color) => setSettings({ ...settings, accentColor: color })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vista Previa de Colores</CardTitle>
                  <CardDescription>Visualiza cómo se verán los colores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg" style={{ backgroundColor: settings.primaryColor, color: "white" }}>
                      <h3 className="font-semibold">Color Primario</h3>
                      <p className="text-sm opacity-90">Botones principales y enlaces</p>
                    </div>
                    <div
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: settings.secondaryColor, color: "white" }}
                    >
                      <h3 className="font-semibold">Color Secundario</h3>
                      <p className="text-sm opacity-90">Elementos secundarios</p>
                    </div>
                    <div className="p-4 rounded-lg" style={{ backgroundColor: settings.accentColor, color: "white" }}>
                      <h3 className="font-semibold">Color de Acento</h3>
                      <p className="text-sm opacity-90">Destacados y notificaciones</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Typography Tab */}
          <TabsContent value="typography">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Tipografía</CardTitle>
                <CardDescription>Personaliza las fuentes y tamaños de texto</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Fuente Principal</label>
                    <Select
                      value={settings.fontFamily}
                      onChange={(e) => setSettings({ ...settings, fontFamily: e.target.value })}
                    >
                      <option value="Inter">Inter</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Open Sans">Open Sans</option>
                      <option value="Lato">Lato</option>
                      <option value="Poppins">Poppins</option>
                      <option value="Montserrat">Montserrat</option>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tamaño Base (px)</label>
                    <Input
                      type="number"
                      value={settings.fontSize}
                      onChange={(e) => setSettings({ ...settings, fontSize: e.target.value })}
                      min="12"
                      max="24"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Fuente de Títulos</label>
                    <Select
                      value={settings.headingFont}
                      onChange={(e) => setSettings({ ...settings, headingFont: e.target.value })}
                    >
                      <option value="Inter">Inter</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Playfair Display">Playfair Display</option>
                      <option value="Merriweather">Merriweather</option>
                      <option value="Oswald">Oswald</option>
                    </Select>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: settings.headingFont }}>
                    Vista Previa de Tipografía
                  </h3>
                  <p style={{ fontFamily: settings.fontFamily, fontSize: `${settings.fontSize}px` }}>
                    Este es un ejemplo de cómo se verá el texto con la configuración actual. Puedes ajustar la fuente y
                    el tamaño según tus preferencias.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Layout Tab */}
          <TabsContent value="layout">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración de Layout</CardTitle>
                  <CardDescription>Personaliza la disposición de elementos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Estilo de Header</label>
                    <Select
                      value={settings.headerStyle}
                      onChange={(e) => setSettings({ ...settings, headerStyle: e.target.value })}
                    >
                      <option value="modern">Moderno</option>
                      <option value="classic">Clásico</option>
                      <option value="minimal">Minimalista</option>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Estilo de Cards</label>
                    <Select
                      value={settings.cardStyle}
                      onChange={(e) => setSettings({ ...settings, cardStyle: e.target.value })}
                    >
                      <option value="elevated">Elevado (sombra)</option>
                      <option value="outlined">Contorno</option>
                      <option value="flat">Plano</option>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Radio de Bordes (px)</label>
                    <Input
                      type="number"
                      value={settings.borderRadius}
                      onChange={(e) => setSettings({ ...settings, borderRadius: e.target.value })}
                      min="0"
                      max="20"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Configuración de Tema</CardTitle>
                  <CardDescription>Opciones de tema y apariencia</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tema por Defecto</label>
                    <Select
                      value={settings.defaultTheme}
                      onChange={(e) => setSettings({ ...settings, defaultTheme: e.target.value })}
                    >
                      <option value="light">Claro</option>
                      <option value="dark">Oscuro</option>
                      <option value="system">Sistema</option>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Permitir Cambio de Tema</label>
                      <p className="text-xs text-muted-foreground">Los usuarios pueden cambiar entre temas</p>
                    </div>
                    <Switch
                      checked={settings.allowThemeSwitch}
                      onCheckedChange={(checked) => setSettings({ ...settings, allowThemeSwitch: checked })}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Pages Tab */}
          <TabsContent value="pages">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Página de Inicio</CardTitle>
                  <CardDescription>Personaliza el contenido de la página principal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Título Principal</label>
                    <Input
                      value={settings.heroTitle}
                      onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                      placeholder="Tu Servidor Doméstico, Simplificado"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subtítulo</label>
                    <Textarea
                      value={settings.heroSubtitle}
                      onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                      placeholder="Descripción de tu servicio"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Mostrar Estadísticas</label>
                        <p className="text-xs text-muted-foreground">Sección de números</p>
                      </div>
                      <Switch
                        checked={settings.showStats}
                        onCheckedChange={(checked) => setSettings({ ...settings, showStats: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Mostrar Características</label>
                        <p className="text-xs text-muted-foreground">Sección de features</p>
                      </div>
                      <Switch
                        checked={settings.showFeatures}
                        onCheckedChange={(checked) => setSettings({ ...settings, showFeatures: checked })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Dashboard</CardTitle>
                  <CardDescription>Configuración del panel de control</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Layout del Dashboard</label>
                    <Select
                      value={settings.dashboardLayout}
                      onChange={(e) => setSettings({ ...settings, dashboardLayout: e.target.value })}
                    >
                      <option value="grid">Cuadrícula</option>
                      <option value="list">Lista</option>
                      <option value="compact">Compacto</option>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Mensaje de Bienvenida</label>
                        <p className="text-xs text-muted-foreground">Saludo personalizado</p>
                      </div>
                      <Switch
                        checked={settings.showWelcomeMessage}
                        onCheckedChange={(checked) => setSettings({ ...settings, showWelcomeMessage: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Acciones Rápidas</label>
                        <p className="text-xs text-muted-foreground">Botones de acceso directo</p>
                      </div>
                      <Switch
                        checked={settings.showQuickActions}
                        onCheckedChange={(checked) => setSettings({ ...settings, showQuickActions: checked })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Página de Servicios</CardTitle>
                  <CardDescription>Configuración de la vista de servicios</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Vista por Defecto</label>
                    <Select
                      value={settings.defaultView}
                      onChange={(e) => setSettings({ ...settings, defaultView: e.target.value })}
                    >
                      <option value="grid">Cuadrícula</option>
                      <option value="list">Lista</option>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Mostrar Categorías</label>
                        <p className="text-xs text-muted-foreground">Filtros de categoría</p>
                      </div>
                      <Switch
                        checked={settings.showCategories}
                        onCheckedChange={(checked) => setSettings({ ...settings, showCategories: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">Permitir Favoritos</label>
                        <p className="text-xs text-muted-foreground">Marcar servicios favoritos</p>
                      </div>
                      <Switch
                        checked={settings.allowFavorites}
                        onCheckedChange={(checked) => setSettings({ ...settings, allowFavorites: checked })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>CSS Personalizado</CardTitle>
                  <CardDescription>Añade estilos CSS personalizados (solo para usuarios avanzados)</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={settings.customCSS}
                    onChange={(e) => setSettings({ ...settings, customCSS: e.target.value })}
                    placeholder="/* Tu CSS personalizado aquí */
.custom-button {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  border: none;
  border-radius: 25px;
}"
                    rows={10}
                    className="font-mono text-sm"
                  />
                  <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      ⚠️ <strong>Advertencia:</strong> El CSS personalizado puede afectar la apariencia de la aplicación.
                      Úsalo solo si tienes conocimientos de CSS.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>JavaScript Personalizado</CardTitle>
                  <CardDescription>
                    Añade funcionalidad JavaScript personalizada (solo para usuarios avanzados)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={settings.customJS}
                    onChange={(e) => setSettings({ ...settings, customJS: e.target.value })}
                    placeholder="// Tu JavaScript personalizado aquí
console.log('QiangNet personalizado cargado');

// Ejemplo: Cambiar el título de la página
document.title = 'Mi Servidor Personalizado';"
                    rows={10}
                    className="font-mono text-sm"
                  />
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">
                      🚨 <strong>Peligro:</strong> El JavaScript personalizado puede romper la funcionalidad de la
                      aplicación. Úsalo solo si eres un desarrollador experimentado.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Particles Tab */}
          <TabsContent value="particles">
            <Card>
              <CardHeader>
                <CardTitle>Efectos de Partículas</CardTitle>
                <CardDescription>Configuración rápida de animaciones de fondo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Activar Partículas</label>
                    <p className="text-xs text-muted-foreground">Mostrar animaciones de fondo</p>
                  </div>
                  <Switch
                    checked={settings.particlesEnabled || false}
                    onCheckedChange={(checked) => setSettings({ ...settings, particlesEnabled: checked })}
                  />
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Tip:</strong> Para configuración avanzada de partículas, visita la sección dedicada en el
                    panel de administración.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2" asChild>
                    <a href="/admin/particles">Configuración Avanzada</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex justify-end gap-4 pt-6 border-t"
        >
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Resetear Todo
          </Button>
          <Button onClick={handleSave} className="btn-glow">
            <Save className="h-4 w-4 mr-2" />
            Guardar Cambios
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
