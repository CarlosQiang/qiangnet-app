import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { AlertTriangle } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[calc(100vh-16rem)]">
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center mb-6">
          <AlertTriangle className="h-8 w-8 text-amber-600" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Acceso no autorizado</h1>
        <p className="text-muted-foreground mb-8">
          No tienes permisos suficientes para acceder a esta página. Si crees que esto es un error, contacta con el
          administrador del sistema.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/">
            <Button>Volver al inicio</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline">Iniciar sesión con otra cuenta</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
