"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Switch } from "@/components/ui/Switch"
import { ColorPicker } from "@/components/ui/ColorPicker"
import { Select } from "@/components/ui/Select"
import { Settings, Palette, Globe, Shield, Mail, Database, Save, RotateCcw, Download } from "lucide-react"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: "QiangNet",
    siteDescription: "Sistema de gestión de servidor doméstico",
    siteUrl: "https://mi-servidor.com",
    adminEmail: "admin@qiangnet.local",

    // Appearance
    primaryColor: "#3b82f6",
    secondaryColor: "#64748b",
    logoUrl: "",
    faviconUrl: "",

    // Security
    enableRegistration: true,
    requireEmailVerification: false,
    enableTwoFactor: false,
    sessionTimeout: 24,
    maxLoginAttempts: 5,

    // Features
    enableNotifications: true,
    enableAnalytics: false,
    enableBackups: true,
    backupFrequency: "daily",

    // Email
    smtpHost: "",
    smtpPort: 587,
    smtpUser: "",
    smtpPassword: "",
    smtpSecure: true,
  })

  const handleSave = () => {
    console.log("Saving settings:", settings)
    // Aquí iría la lógica para guardar la configuración
  }

  const handleReset = () => {
    // Resetear a valores por defecto
    console.log("Resetting settings")
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "qiangnet-settings.json"
    link.click()
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
                <Settings className="h-10 w-10 text-primary" />
                Configuración del Sistema
              </h1>
              <p className="text-muted-foreground text-lg">Personaliza y configura tu servidor QiangNet</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button onClick={handleSave} className="btn-glow">
                <Save className="h-4 w-4 mr-2" />
                Guardar Cambios
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* General Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Configuración General
                </CardTitle>
                <CardDescription>Información básica del sitio</CardDescription>
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
                    placeholder="Descripción del sitio"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">URL del Sitio</label>
                  <Input
                    value={settings.siteUrl}
                    onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                    placeholder="https://mi-servidor.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email del Administrador</label>
                  <Input
                    type="email"
                    value={settings.adminEmail}
                    onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                    placeholder="admin@qiangnet.local"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Appearance Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Apariencia
                </CardTitle>
                <CardDescription>Personaliza el aspecto visual</CardDescription>
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
              </CardContent>
            </Card>
          </motion.div>

          {/* Security Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Seguridad
                </CardTitle>
                <CardDescription>Configuración de seguridad y acceso</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Permitir Registro</label>
                    <p className="text-xs text-muted-foreground">Permitir que nuevos usuarios se registren</p>
                  </div>
                  <Switch
                    checked={settings.enableRegistration}
                    onCheckedChange={(checked) => setSettings({ ...settings, enableRegistration: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Verificación de Email</label>
                    <p className="text-xs text-muted-foreground">Requerir verificación de email</p>
                  </div>
                  <Switch
                    checked={settings.requireEmailVerification}
                    onCheckedChange={(checked) => setSettings({ ...settings, requireEmailVerification: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Autenticación de Dos Factores</label>
                    <p className="text-xs text-muted-foreground">Habilitar 2FA para administradores</p>
                  </div>
                  <Switch
                    checked={settings.enableTwoFactor}
                    onCheckedChange={(checked) => setSettings({ ...settings, enableTwoFactor: checked })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Tiempo de Sesión (horas)</label>
                  <Input
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) =>
                      setSettings({ ...settings, sessionTimeout: Number.parseInt(e.target.value) || 24 })
                    }
                    min="1"
                    max="168"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Máximo Intentos de Login</label>
                  <Input
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) =>
                      setSettings({ ...settings, maxLoginAttempts: Number.parseInt(e.target.value) || 5 })
                    }
                    min="3"
                    max="10"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Features Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Características
                </CardTitle>
                <CardDescription>Habilitar o deshabilitar funciones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Notificaciones</label>
                    <p className="text-xs text-muted-foreground">Sistema de notificaciones</p>
                  </div>
                  <Switch
                    checked={settings.enableNotifications}
                    onCheckedChange={(checked) => setSettings({ ...settings, enableNotifications: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Analytics</label>
                    <p className="text-xs text-muted-foreground">Recopilar estadísticas de uso</p>
                  </div>
                  <Switch
                    checked={settings.enableAnalytics}
                    onCheckedChange={(checked) => setSettings({ ...settings, enableAnalytics: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Backups Automáticos</label>
                    <p className="text-xs text-muted-foreground">Realizar backups automáticos</p>
                  </div>
                  <Switch
                    checked={settings.enableBackups}
                    onCheckedChange={(checked) => setSettings({ ...settings, enableBackups: checked })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Frecuencia de Backup</label>
                  <Select
                    value={settings.backupFrequency}
                    onChange={(e) => setSettings({ ...settings, backupFrequency: e.target.value })}
                  >
                    <option value="hourly">Cada hora</option>
                    <option value="daily">Diario</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensual</option>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Email Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8"
        >
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Configuración de Email
              </CardTitle>
              <CardDescription>Configurar servidor SMTP para notificaciones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Servidor SMTP</label>
                  <Input
                    value={settings.smtpHost}
                    onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Puerto</label>
                  <Input
                    type="number"
                    value={settings.smtpPort}
                    onChange={(e) => setSettings({ ...settings, smtpPort: Number.parseInt(e.target.value) || 587 })}
                    placeholder="587"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Usuario</label>
                  <Input
                    value={settings.smtpUser}
                    onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
                    placeholder="usuario@gmail.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Contraseña</label>
                  <Input
                    type="password"
                    value={settings.smtpPassword}
                    onChange={(e) => setSettings({ ...settings, smtpPassword: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.smtpSecure}
                    onCheckedChange={(checked) => setSettings({ ...settings, smtpSecure: checked })}
                  />
                  <label className="text-sm font-medium">Conexión segura (TLS/SSL)</label>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 flex justify-end gap-4"
        >
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Resetear
          </Button>
          <Button onClick={handleSave} className="btn-glow">
            <Save className="h-4 w-4 mr-2" />
            Guardar Configuración
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
