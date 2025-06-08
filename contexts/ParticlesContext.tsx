"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { ParticlesConfig } from "@/lib/types"

interface ParticlesContextType {
  config: ParticlesConfig
  updateConfig: (newConfig: Partial<ParticlesConfig>) => void
  resetConfig: () => void
}

const defaultConfig: ParticlesConfig = {
  enabled: true,
  count: 50,
  speed: 0.5, // Velocidad muy reducida
  size: 2,
  color: "#3b82f6",
  opacity: 0.6,
  connections: true,
}

const ParticlesContext = createContext<ParticlesContextType | undefined>(undefined)

export function ParticlesProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<ParticlesConfig>(defaultConfig)

  // Cargar configuración desde localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem("particles_config")
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig)
        setConfig({ ...defaultConfig, ...parsed })
      } catch (error) {
        console.error("Error loading particles config:", error)
      }
    }
  }, [])

  const updateConfig = (newConfig: Partial<ParticlesConfig>) => {
    const updatedConfig = { ...config, ...newConfig }
    setConfig(updatedConfig)
    localStorage.setItem("particles_config", JSON.stringify(updatedConfig))
  }

  const resetConfig = () => {
    setConfig(defaultConfig)
    localStorage.setItem("particles_config", JSON.stringify(defaultConfig))
  }

  return <ParticlesContext.Provider value={{ config, updateConfig, resetConfig }}>{children}</ParticlesContext.Provider>
}

export function useParticles() {
  const context = useContext(ParticlesContext)
  if (context === undefined) {
    throw new Error("useParticles must be used within a ParticlesProvider")
  }
  return context
}
