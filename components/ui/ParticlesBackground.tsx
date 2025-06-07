"use client"
import { useEffect, useRef, useState, useCallback } from "react"
import { useTheme } from "@/contexts/ThemeContext"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  opacity: number
  opacityDirection: number
  size: number
  baseX: number
  baseY: number
  angle: number
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

interface ParticlesBackgroundProps {
  config?: Partial<ParticlesConfig>
  className?: string
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

export function ParticlesBackground({ config = {}, className = "" }: ParticlesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0, isMoving: false })
  const { resolvedTheme } = useTheme()
  const timeRef = useRef(0)

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isVisible, setIsVisible] = useState(true)

  const finalConfig = { ...defaultConfig, ...config }

  // Ajustar colores según el tema
  const getThemeAwareColor = useCallback(
    (color: string) => {
      if (resolvedTheme === "dark") {
        return color
      } else {
        if (color === "#3b82f6") return "#93c5fd"
        if (color === "#ffffff") return "#64748b"
        return color
      }
    },
    [resolvedTheme],
  )

  // Inicializar partículas con movimiento ultra lento
  const initParticles = useCallback(() => {
    if (!finalConfig.enabled) return

    const particles: Particle[] = []
    for (let i = 0; i < finalConfig.count; i++) {
      const x = Math.random() * dimensions.width
      const y = Math.random() * dimensions.height
      particles.push({
        x,
        y,
        baseX: x,
        baseY: y,
        vx: (Math.random() - 0.5) * finalConfig.speed * 0.1, // 10 veces más lento
        vy: (Math.random() - 0.5) * finalConfig.speed * 0.1,
        opacity: Math.random() * finalConfig.opacity * 0.5 + 0.05,
        opacityDirection: Math.random() > 0.5 ? 1 : -1,
        size: Math.random() * finalConfig.size * 0.6 + 0.3,
        angle: Math.random() * Math.PI * 2,
      })
    }
    particlesRef.current = particles
  }, [dimensions])

  // Dibujar partícula según la forma
  const drawParticle = useCallback(
    (ctx: CanvasRenderingContext2D, particle: Particle) => {
      const color = getThemeAwareColor(finalConfig.color)
      const alpha = Math.floor(particle.opacity * 255)
        .toString(16)
        .padStart(2, "0")
      ctx.fillStyle = `${color}${alpha}`

      ctx.beginPath()
      switch (finalConfig.shape) {
        case "circle":
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          break
        case "square":
          ctx.rect(particle.x - particle.size, particle.y - particle.size, particle.size * 2, particle.size * 2)
          break
        case "triangle":
          ctx.moveTo(particle.x, particle.y - particle.size)
          ctx.lineTo(particle.x - particle.size, particle.y + particle.size)
          ctx.lineTo(particle.x + particle.size, particle.y + particle.size)
          ctx.closePath()
          break
      }
      ctx.fill()
    },
    [finalConfig.shape, finalConfig.color, getThemeAwareColor],
  )

  // Dibujar conexiones entre partículas
  const drawConnections = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (!finalConfig.connections) return

      const color = getThemeAwareColor(finalConfig.color)

      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const particle1 = particlesRef.current[i]
          const particle2 = particlesRef.current[j]

          const dx = particle1.x - particle2.x
          const dy = particle1.y - particle2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < finalConfig.connectionDistance) {
            const opacity = (1 - distance / finalConfig.connectionDistance) * finalConfig.connectionOpacity
            const alpha = Math.floor(opacity * 255)
              .toString(16)
              .padStart(2, "0")
            ctx.strokeStyle = `${color}${alpha}`
            ctx.lineWidth = 0.3 // Líneas ultra finas
            ctx.beginPath()
            ctx.moveTo(particle1.x, particle1.y)
            ctx.lineTo(particle2.x, particle2.y)
            ctx.stroke()
          }
        }
      }
    },
    [finalConfig.connections, finalConfig.connectionDistance, finalConfig.connectionOpacity, getThemeAwareColor],
  )

  // Actualizar posición de partículas ULTRA LENTO
  const updateParticles = useCallback(() => {
    timeRef.current += 0.001 // Tiempo ultra lento como caracol

    particlesRef.current.forEach((particle, index) => {
      // Movimiento según el tipo de animación - ULTRA LENTO
      switch (finalConfig.animation) {
        case "float":
          // Movimiento flotante extremadamente suave
          particle.angle += 0.0005 // Rotación ultra lenta
          particle.x = particle.baseX + Math.sin(particle.angle + index * 0.05) * 8 // Amplitud menor
          particle.y = particle.baseY + Math.cos(particle.angle + index * 0.05) * 6

          // Deriva ultra lenta de la posición base
          particle.baseX += particle.vx * 0.05 // 20 veces más lento
          particle.baseY += particle.vy * 0.05
          break

        case "bounce":
          particle.x += particle.vx * 0.1 // Ultra lento
          particle.y += particle.vy * 0.1
          if (particle.x <= 0 || particle.x >= dimensions.width) {
            particle.vx *= -0.9
            particle.x = Math.max(0, Math.min(dimensions.width, particle.x))
          }
          if (particle.y <= 0 || particle.y >= dimensions.height) {
            particle.vy *= -0.9
            particle.y = Math.max(0, Math.min(dimensions.height, particle.y))
          }
          break

        case "spiral":
          const centerX = dimensions.width / 2
          const centerY = dimensions.height / 2
          const distance = Math.sqrt((particle.x - centerX) ** 2 + (particle.y - centerY) ** 2)
          particle.angle += 0.0002 // Espiral ultra lenta
          particle.x = centerX + Math.cos(particle.angle) * (distance + Math.sin(timeRef.current + index) * 2)
          particle.y = centerY + Math.sin(particle.angle) * (distance + Math.cos(timeRef.current + index) * 2)
          break
      }

      // Wrap around edges para animación float
      if (finalConfig.animation === "float") {
        if (particle.baseX < -30) {
          particle.baseX = dimensions.width + 30
          particle.x = particle.baseX
        }
        if (particle.baseX > dimensions.width + 30) {
          particle.baseX = -30
          particle.x = particle.baseX
        }
        if (particle.baseY < -30) {
          particle.baseY = dimensions.height + 30
          particle.y = particle.baseY
        }
        if (particle.baseY > dimensions.height + 30) {
          particle.baseY = -30
          particle.y = particle.baseY
        }
      }

      // Animación de opacidad ultra suave
      particle.opacity += particle.opacityDirection * 0.0005 // Cambio ultra gradual
      if (particle.opacity <= 0.02 || particle.opacity >= finalConfig.opacity * 0.6) {
        particle.opacityDirection *= -1
      }

      // Interacción con el mouse ultra sutil
      if (finalConfig.mouseInteraction && mouseRef.current.isMoving) {
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < finalConfig.mouseDistance) {
          const force = (finalConfig.mouseDistance - distance) / finalConfig.mouseDistance
          const pushX = (dx / distance) * force * 0.005 // Fuerza ultra suave
          const pushY = (dy / distance) * force * 0.005

          particle.x += pushX
          particle.y += pushY
          particle.baseX += pushX * 0.02
          particle.baseY += pushY * 0.02
        }
      }
    })
    , [dimensions, timeRef]
  )
\
  // Loop de animación ultra optimizado
  const animate = useCallback(() => {
    if (!canvasRef.current || !finalConfig.enabled) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Limpiar canvas con fade ultra sutil
    if (finalConfig.background === "transparent") {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    } else {
      ctx.fillStyle = "rgba(0, 0, 0, 0.005)" // Fade ultra sutil
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // Fondo personalizado
    if (finalConfig.background === "gradient") {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, finalConfig.backgroundColor + "10")
      gradient.addColorStop(1, finalConfig.backgroundColor + "02")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    } else if (finalConfig.background === "solid") {
      ctx.fillStyle = finalConfig.backgroundColor + "05"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // Actualizar y dibujar partículas
    updateParticles()
    drawConnections(ctx)

    particlesRef.current.forEach((particle) => {
      drawParticle(ctx, particle)
    })

    animationRef.current = requestAnimationFrame(animate)
  }, [finalConfig, updateParticles, drawConnections, drawParticle])

  // Manejar redimensionamiento
  const handleResize = useCallback(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width
    canvas.height = rect.height

    setDimensions({ width: rect.width, height: rect.height })
  }, [])

  // Manejar movimiento del mouse
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    mouseRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      isMoving: true,
    }

    // Reset mouse movement flag
    setTimeout(() => {
      mouseRef.current.isMoving = false
    }, 500) // Tiempo más largo para efecto ultra suave
  }, [])

  // Intersection Observer para optimización
  useEffect(() => {
    if (!canvasRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 },
    )

    observer.observe(canvasRef.current)

    return () => observer.disconnect()
  }, [])

  // Configurar canvas y eventos
  useEffect(() => {
    if (!canvasRef.current || !finalConfig.enabled) return

    handleResize()
    initParticles()

    const canvas = canvasRef.current

    // Event listeners
    window.addEventListener("resize", handleResize)
    if (finalConfig.mouseInteraction) {
      canvas.addEventListener("mousemove", handleMouseMove)
    }

    return () => {
      window.removeEventListener("resize", handleResize)
      canvas.removeEventListener("mousemove", handleMouseMove)
    }
  }, [finalConfig, handleResize, handleMouseMove])

  // Iniciar/parar animación
  useEffect(() => {
    if (finalConfig.enabled && isVisible) {
      animate()
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [finalConfig.enabled, isVisible, animate])

  if (!finalConfig.enabled) return null

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  )
}
\
export default ParticlesBackground
