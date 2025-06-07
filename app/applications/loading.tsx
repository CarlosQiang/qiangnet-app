import { LoadingSpinner } from "@/components/ui/LoadingSpinner"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground">Cargando aplicaciones...</p>
      </div>
    </div>
  )
}
