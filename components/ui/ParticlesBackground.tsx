"use client"
import { useEffect, useRef } from "react"
import { useTheme } from "@/contexts/ThemeContext"
import { useParticles } from "@/contexts/ParticlesContext"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
}

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

const defaultConfig: ParticlesConfig = {
  enabled: true,
  count: 30, // Menos partículas para mejor rendimiento
  color: "#3b82f6",
  size: 1.5, // Más pequeñas
  speed: 0.02, // EXTREMADAMENTE lento como caracol
  opacity: 0.25, // Muy transparentes
  connections: true,
  connectionDistance: 60, // Distancia menor
  connectionOpacity: 0.05, // Conexiones casi invisibles
  mouseInteraction: true,
  mouseDistance: 80,
  clickEffect: false,
  shape: "circle",
  animation: "float",
  background: "transparent",
  backgroundColor: "#000000",
}

export function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const particlesRef = useRef<Particle[]>([])
  const { resolvedTheme } = useTheme()
  const { config } = useParticles()

  useEffect(() => {
    if (!config.enabled) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticles = () => {
      particlesRef.current = []
      for (let i = 0; i < config.count; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * config.speed * 0.1, // Velocidad mucho más lenta
          vy: (Math.random() - 0.5) * config.speed * 0.1,
          size: Math.random() * config.size + 1,
          opacity: Math.random() * config.opacity,
        })
      }
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle, i) => {
        // Actualizar posición
        particle.x += particle.vx
        particle.y += particle.vy

        // Rebotar en los bordes
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        // Mantener dentro del canvas
        particle.x = Math.max(0, Math.min(canvas.width, particle.x))
        particle.y = Math.max(0, Math.min(canvas.height, particle.y))

        // Dibujar partícula
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `${config.color}${Math.floor(particle.opacity * 255)
          .toString(16)
          .padStart(2, "0")}`
        ctx.fill()

        // Dibujar conexiones si está habilitado
        if (config.connections) {
          particlesRef.current.slice(i + 1).forEach((otherParticle) => {
            const dx = particle.x - otherParticle.x
            const dy = particle.y - otherParticle.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < 100) {
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(otherParticle.x, otherParticle.y)
              ctx.strokeStyle = `${config.color}${Math.floor((1 - distance / 100) * config.opacity * 100)
                .toString(16)
                .padStart(2, "0")}`
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          })
        }
      })

      animationRef.current = requestAnimationFrame(drawParticles)
    }

    resizeCanvas()
    createParticles()
    drawParticles()

    window.addEventListener("resize", () => {
      resizeCanvas()
      createParticles()
    })

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [config])

  if (!config.enabled) return null

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ background: "transparent" }} />
  )
}
