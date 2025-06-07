"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Switch } from "@/components/ui/Switch"
import { ColorPicker } from "@/components/ui/ColorPicker"
import { Select } from "@/components/ui/Select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { Slider } from "@/components/ui/Slider"
import { useParticles } from "@/contexts/ParticlesContext"
import {
  Sparkles,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Palette,
  Settings,
  Zap,
  MousePointer,
  Shapes,
  Play,
  Pause,
} from "lucide-react"

export default function ParticlesPage() {
  const { config, updateConfig, resetConfig, presets, applyPreset } = useParticles()
  const [previewEnabled, setPreviewEnabled] = useState(true)

  const handleSave = () => {
    // La configuración ya se guarda automáticamente en el context
    console.log("Particles configuration saved:", config)
  }

  const togglePreview = () => {
    setPreviewEnabled(!previewEnabled)
    updateConfig({ enabled: !previewEnabled })
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
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Sparkles className="h-10 w-10 text-primary" />
                Efectos de Partículas
              </h1>
              <p className="text-muted-foreground text-lg">
                Configura las animaciones de fondo para darle vida a tu aplicación
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={togglePreview}>
                {previewEnabled ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {previewEnabled ? "Ocultar" : "Mostrar"}
              </Button>
              <Button variant="outline" onClick={resetConfig}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Resetear
              </Button>
              <Button onClick={handleSave} className="btn-glow">
                <Save className="h-4 w-4 mr-2" />
                Guardar
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6"
        >
          <Card className={`border-2 ${config.enabled ? "border-green-500" : "border-red-500"}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {config.enabled ? (
                    <Play className="h-5 w-5 text-green-500" />
                  ) : (
                    <Pause className="h-5 w-5 text-red-500" />
                  )}
                  <div>
                    <h3 className="font-semibold">Estado: {config.enabled ? "Activo" : "Desactivado"}</h3>
                    <p className="text-sm text-muted-foreground">
                      {config.enabled
                        ? `${config.count} partículas en movimiento`
                        : "Las partículas están desactivadas"}
                    </p>
                  </div>
                </div>
                <Switch checked={config.enabled} onCheckedChange={(checked) => updateConfig({ enabled: checked })} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Básico</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Apariencia</span>
            </TabsTrigger>
            <TabsTrigger value="animation" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Animación</span>
            </TabsTrigger>
            <TabsTrigger value="interaction" className="flex items-center gap-2">
              <MousePointer className="h-4 w-4" />
              <span className="hidden sm:inline">Interacción</span>
            </TabsTrigger>
            <TabsTrigger value="presets" className="flex items-center gap-2">
              <Shapes className="h-4 w-4" />
              <span className="hidden sm:inline">Presets</span>
            </TabsTrigger>
          </TabsList>

          {/* Basic Tab */}
          <TabsContent value="basic">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración General</CardTitle>
                  <CardDescription>Controles básicos de las partículas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Activar Partículas</label>
                      <p className="text-xs text-muted-foreground">Mostrar/ocultar el efecto</p>
                    </div>
                    <Switch
                      checked={config.enabled}
                      onCheckedChange={(checked) => updateConfig({ enabled: checked })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Cantidad de Partículas: {config.count}</label>
                    <Slider
                      value={[config.count]}
                      onValueChange={([value]) => updateConfig({ count: value })}
                      min={10}
                      max={200}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>10</span>
                      <span>200</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Tamaño: {config.size}px</label>
                    <Slider
                      value={[config.size]}
                      onValueChange={([value]) => updateConfig({ size: value })}
                      min={1}
                      max={10}
                      step={0.5}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Velocidad: {config.speed.toFixed(1)}</label>
                    <Slider
                      value={[config.speed]}
                      onValueChange={([value]) => updateConfig({ speed: value })}
                      min={0.1}
                      max={3}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Opacidad: {Math.round(config.opacity * 100)}%
                    </label>
                    <Slider
                      value={[config.opacity]}
                      onValueChange={([value]) => updateConfig({ opacity: value })}
                      min={0.1}
                      max={1}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Vista Previa en Tiempo Real</CardTitle>
                  <CardDescription>Observa los cambios al instante</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative h-64 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Sparkles className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm opacity-75">Vista previa de partículas</p>
                        <p className="text-xs opacity-50 mt-1">
                          {config.enabled ? `${config.count} partículas activas` : "Desactivado"}
                        </p>
                      </div>
                    </div>
                    {/* Aquí se renderizarían las partículas en miniatura */}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Colores y Formas</CardTitle>
                  <CardDescription>Personaliza la apariencia visual</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Color de Partículas</label>
                    <ColorPicker value={config.color} onChange={(color) => updateConfig({ color })} />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Forma de Partículas</label>
                    <Select value={config.shape} onChange={(e) => updateConfig({ shape: e.target.value as any })}>
                      <option value="circle">Círculo</option>
                      <option value="square">Cuadrado</option>
                      <option value="triangle">Triángulo</option>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Tipo de Fondo</label>
                    <Select
                      value={config.background}
                      onChange={(e) => updateConfig({ background: e.target.value as any })}
                    >
                      <option value="transparent">Transparente</option>
                      <option value="gradient">Degradado</option>
                      <option value="solid">Sólido</option>
                    </Select>
                  </div>

                  {config.background !== "transparent" && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Color de Fondo</label>
                      <ColorPicker
                        value={config.backgroundColor}
                        onChange={(color) => updateConfig({ backgroundColor: color })}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Conexiones</CardTitle>
                  <CardDescription>Configurar líneas entre partículas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Mostrar Conexiones</label>
                      <p className="text-xs text-muted-foreground">Líneas entre partículas cercanas</p>
                    </div>
                    <Switch
                      checked={config.connections}
                      onCheckedChange={(checked) => updateConfig({ connections: checked })}
                    />
                  </div>

                  {config.connections && (
                    <>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Distancia de Conexión: {config.connectionDistance}px
                        </label>
                        <Slider
                          value={[config.connectionDistance]}
                          onValueChange={([value]) => updateConfig({ connectionDistance: value })}
                          min={50}
                          max={300}
                          step={10}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Opacidad de Conexiones: {Math.round(config.connectionOpacity * 100)}%
                        </label>
                        <Slider
                          value={[config.connectionOpacity]}
                          onValueChange={([value]) => updateConfig({ connectionOpacity: value })}
                          min={0.1}
                          max={1}
                          step={0.1}
                          className="w-full"
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Animation Tab */}
          <TabsContent value="animation">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Animación</CardTitle>
                <CardDescription>Controla cómo se mueven las partículas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Tipo de Animación</label>
                  <Select value={config.animation} onChange={(e) => updateConfig({ animation: e.target.value as any })}>
                    <option value="float">Flotante (Suave)</option>
                    <option value="bounce">Rebote (Dinámico)</option>
                    <option value="spiral">Espiral (Hipnótico)</option>
                  </Select>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {config.animation === "float" && "Las partículas flotan suavemente por la pantalla"}
                    {config.animation === "bounce" && "Las partículas rebotan en los bordes"}
                    {config.animation === "spiral" && "Las partículas se mueven en espiral desde el centro"}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 border rounded-lg text-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-2 animate-pulse"></div>
                    <h4 className="font-medium">Flotante</h4>
                    <p className="text-xs text-muted-foreground">Movimiento suave y continuo</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="w-12 h-12 bg-green-500 rounded mx-auto mb-2 animate-bounce"></div>
                    <h4 className="font-medium">Rebote</h4>
                    <p className="text-xs text-muted-foreground">Rebota en los bordes</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="w-12 h-12 bg-purple-500 rounded-full mx-auto mb-2 animate-spin"></div>
                    <h4 className="font-medium">Espiral</h4>
                    <p className="text-xs text-muted-foreground">Movimiento circular</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Interaction Tab */}
          <TabsContent value="interaction">
            <Card>
              <CardHeader>
                <CardTitle>Interactividad</CardTitle>
                <CardDescription>Configurar la respuesta a las acciones del usuario</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Interacción con Mouse</label>
                    <p className="text-xs text-muted-foreground">Las partículas reaccionan al movimiento del mouse</p>
                  </div>
                  <Switch
                    checked={config.mouseInteraction}
                    onCheckedChange={(checked) => updateConfig({ mouseInteraction: checked })}
                  />
                </div>

                {config.mouseInteraction && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Distancia de Interacción: {config.mouseDistance}px
                    </label>
                    <Slider
                      value={[config.mouseDistance]}
                      onValueChange={([value]) => updateConfig({ mouseDistance: value })}
                      min={50}
                      max={300}
                      step={10}
                      className="w-full"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Efecto de Click</label>
                    <p className="text-xs text-muted-foreground">Crear partículas al hacer click</p>
                  </div>
                  <Switch
                    checked={config.clickEffect}
                    onCheckedChange={(checked) => updateConfig({ clickEffect: checked })}
                  />
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">💡 Consejos de Interactividad</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• La interacción con mouse puede afectar el rendimiento en dispositivos lentos</li>
                    <li>• El efecto de click añade partículas temporales</li>
                    <li>• Desactiva las interacciones para mejor rendimiento en móviles</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Presets Tab */}
          <TabsContent value="presets">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configuraciones Predefinidas</CardTitle>
                  <CardDescription>Aplica estilos profesionales con un solo click</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(presets).map(([name, preset]) => (
                      <div
                        key={name}
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => applyPreset(name)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium capitalize">{name}</h4>
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.color }}></div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">
                          {name === "default" && "Configuración equilibrada para uso general"}
                          {name === "minimal" && "Pocas partículas, sin conexiones"}
                          {name === "network" && "Efecto de red tecnológica"}
                          {name === "galaxy" && "Espiral cósmica con fondo degradado"}
                          {name === "matrix" && "Estilo Matrix con partículas verdes"}
                          {name === "ocean" && "Suave como las olas del océano"}
                        </p>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{preset.count} partículas</span>
                          <span className="capitalize">{preset.animation}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Configuración Personalizada</CardTitle>
                  <CardDescription>Tu configuración actual</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Partículas:</span>
                        <span className="ml-2 font-medium">{config.count}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Forma:</span>
                        <span className="ml-2 font-medium capitalize">{config.shape}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Animación:</span>
                        <span className="ml-2 font-medium capitalize">{config.animation}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Conexiones:</span>
                        <span className="ml-2 font-medium">{config.connections ? "Sí" : "No"}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex justify-end gap-4 pt-6 border-t"
        >
          <Button variant="outline" onClick={resetConfig}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Configuración por Defecto
          </Button>
          <Button onClick={handleSave} className="btn-glow">
            <Save className="h-4 w-4 mr-2" />
            Aplicar Cambios
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
