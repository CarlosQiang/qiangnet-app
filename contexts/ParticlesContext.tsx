"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface ParticlesConfig {
  enabled: boolean
  count: number
  color: string
  size: number
  speed: number
  opacity: number
  connections: boolean
  connectionDistance: number
  connectionOpacity: number
  mouseInteraction: boolean
  mouseDistance: number
  clickEffect: boolean
  shape: "circle" | "square" | "triangle"
  animation: "float" | "bounce" | "spiral"
  background: "transparent" | "gradient" | "solid"
  backgroundColor: string
}

interface ParticlesContextType {
  config: ParticlesConfig
  updateConfig: (newConfig: Partial<ParticlesConfig>) => void
  resetConfig: () => void
  presets: Record<string, ParticlesConfig>
  applyPreset: (presetName: string) => void
}

const defaultConfig: ParticlesConfig = {
  enabled: true,
  count: 25, // Menos partículas
  color: "#3b82f6",
  size: 1.5, // Más pequeñas
  speed: 0.01, // ULTRA lento como caracol
  opacity: 0.2, // Muy transparentes
  connections: true,
  connectionDistance: 50, // Distancia menor
  connectionOpacity: 0.03, // Conexiones casi invisibles
  mouseInteraction: true,
  mouseDistance: 70,
  clickEffect: false,
  shape: "circle",
  animation: "float",
  background: "transparent",
  backgroundColor: "#000000",
}

const presets: Record<string, ParticlesConfig> = {
  default: defaultConfig,
  caracol: {
    ...defaultConfig,
    count: 15,
    speed: 0.005, // Ultra caracol
    opacity: 0.15,
    connections: false,
    mouseInteraction: false,
  },
  zen: {
    ...defaultConfig,
    count: 20,
    color: "#10b981",
    speed: 0.008,
    opacity: 0.18,
    connections: true,
    connectionDistance: 40,
    connectionOpacity: 0.02,
  },
  meditation: {
    ...defaultConfig,
    count: 18,
    color: "#8b5cf6",
    shape: "circle",
    animation: "spiral",
    speed: 0.003,
    opacity: 0.12,
    background: "gradient",
    backgroundColor: "#1e1b4b",
    connections: false,
  },
  calm: {
    ...defaultConfig,
    count: 22,
    color: "#06b6d4",
    animation: "float",
    speed: 0.006,
    opacity: 0.16,
    connections: true,
    connectionDistance: 35,
    connectionOpacity: 0.025,
  },
  peaceful: {
    ...defaultConfig,
    count: 12,
    color: "#f59e0b",
    speed: 0.002,
    opacity: 0.1,
    connections: false,
    mouseInteraction: false,
  },
}

const ParticlesContext = createContext<ParticlesContextType | undefined>(undefined)

export function ParticlesProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<ParticlesConfig>(defaultConfig)

  const updateConfig = (newConfig: Partial<ParticlesConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }))
  }

  const resetConfig = () => {
    setConfig(defaultConfig)
  }

  const applyPreset = (presetName: string) => {
    if (presets[presetName]) {
      setConfig(presets[presetName])
    }
  }

  // Cargar configuración guardada
  useEffect(() => {
    const saved = localStorage.getItem("qiangnet_particles_config")
    if (saved) {
      try {
        const parsedConfig = JSON.parse(saved)
        setConfig({ ...defaultConfig, ...parsedConfig })
      } catch (error) {
        console.error("Error loading particles config:", error)
      }
    }
  }, [])

  // Guardar configuración
  useEffect(() => {
    localStorage.setItem("qiangnet_particles_config", JSON.stringify(config))
  }, [config])

  const value: ParticlesContextType = {
    config,
    updateConfig,
    resetConfig,
    presets,
    applyPreset,
  }

  return <ParticlesContext.Provider value={value}>{children}</ParticlesContext.Provider>
}

export function useParticles() {
  const context = useContext(ParticlesContext)
  if (context === undefined) {
    throw new Error("useParticles must be used within a ParticlesProvider")
  }
  return context
}
