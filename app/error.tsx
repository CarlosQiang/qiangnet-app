"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-8 max-w-2xl mx-auto"
        >
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="h-24 w-24 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4"
          >
            <h1 className="text-4xl lg:text-5xl font-bold">¡Oops! Algo salió mal</h1>
            <p className="text-xl text-muted-foreground max-w-lg mx-auto">
              Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado y está trabajando para solucionarlo.
            </p>
            {process.env.NODE_ENV === "development" && (
              <details className="text-left bg-muted p-4 rounded-lg mt-4">
                <summary className="cursor-pointer font-medium">Detalles del error (desarrollo)</summary>
                <pre className="mt-2 text-sm overflow-auto">{error.message}</pre>
              </details>
            )}
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" className="btn-glow" onClick={reset}>
              <RefreshCw className="mr-2 h-5 w-5" />
              Intentar de Nuevo
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/">
                <Home className="mr-2 h-5 w-5" />
                Ir al Inicio
              </a>
            </Button>
          </motion.div>

          {/* Help */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="pt-8 border-t"
          >
            <p className="text-sm text-muted-foreground">
              Si el problema persiste, contacta al administrador del sistema.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
