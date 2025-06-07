import { LoadingSpinner } from "@/components/ui/LoadingSpinner"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Cargando QiangNet</h2>
          <p className="text-muted-foreground">Preparando tu experiencia...</p>
        </div>
      </div>
    </div>
  )
}
