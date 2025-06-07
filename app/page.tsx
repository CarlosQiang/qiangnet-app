import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { ArrowRight, Server, Shield, Zap, Layers, Lock } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="py-20 md:py-28 relative">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
            Gestiona tu servidor doméstico con facilidad
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
            QiangNet te permite controlar y administrar todas tus aplicaciones y servicios desde un solo lugar, de forma
            segura y eficiente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="w-full sm:w-auto">
                Iniciar sesión
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Registrarse
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Características principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Server className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Panel centralizado</h3>
              <p className="text-muted-foreground">
                Accede a todas tus aplicaciones y servicios desde un único panel de control intuitivo y personalizable.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Seguridad avanzada</h3>
              <p className="text-muted-foreground">
                Protege tus aplicaciones con autenticación de múltiples factores, control de acceso y cifrado de datos.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rendimiento optimizado</h3>
              <p className="text-muted-foreground">
                Monitoriza y optimiza el rendimiento de tus servicios con estadísticas en tiempo real y alertas
                personalizadas.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Layers className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gestión de usuarios</h3>
              <p className="text-muted-foreground">
                Administra permisos y roles de usuarios para controlar quién puede acceder a cada servicio y aplicación.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Acceso seguro</h3>
              <p className="text-muted-foreground">
                Accede a tus servicios de forma segura desde cualquier lugar con conexiones cifradas y autenticación
                robusta.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalización visual</h3>
              <p className="text-muted-foreground">
                Personaliza la apariencia de tu panel con temas, fondos de partículas y opciones de visualización
                avanzadas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/20 to-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">¿Listo para empezar?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Comienza a gestionar tu servidor doméstico de forma eficiente y segura con QiangNet.
          </p>
          <Link href="/register">
            <Button size="lg">Crear una cuenta</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
