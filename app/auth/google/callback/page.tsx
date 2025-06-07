"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { googleAuth } from "@/lib/google-auth"
import { authApi } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "react-hot-toast"

export default function GoogleCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const code = searchParams.get("code")
        const error = searchParams.get("error")

        if (error) {
          throw new Error("Google authentication was cancelled or failed")
        }

        if (!code) {
          throw new Error("No authorization code received from Google")
        }

        // Intercambiar código por tokens
        const tokens = await googleAuth.exchangeCodeForTokens(code)

        if (tokens.error) {
          throw new Error(tokens.error_description || "Failed to exchange code for tokens")
        }

        // Obtener información del usuario
        const userInfo = await googleAuth.getUserInfo(tokens.access_token)

        // Enviar al backend para crear/autenticar usuario
        const response = await authApi.loginWithGoogle({
          google_id: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          access_token: tokens.access_token,
        })

        // Guardar tokens
        localStorage.setItem("auth_token", response.token)
        if (response.refreshToken) {
          localStorage.setItem("refresh_token", response.refreshToken)
        }

        setStatus("success")
        toast.success(`¡Bienvenido, ${userInfo.name}!`)

        // Redirigir a servicios o dashboard
        const redirectTo = searchParams.get("state") || "/services"
        router.push(redirectTo)
      } catch (error: any) {
        console.error("Google auth error:", error)
        setStatus("error")
        toast.error(error.message || "Error al autenticar con Google")

        setTimeout(() => {
          router.push("/login")
        }, 3000)
      }
    }

    handleGoogleCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
      <div className="text-center space-y-4">
        {status === "loading" && (
          <>
            <LoadingSpinner size="lg" />
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Autenticando con Google</h2>
              <p className="text-muted-foreground">Por favor espera mientras procesamos tu información...</p>
            </div>
          </>
        )}

        {status === "success" && (
          <div className="space-y-2">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-green-600">¡Autenticación exitosa!</h2>
            <p className="text-muted-foreground">Redirigiendo...</p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-2">
            <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-red-600">Error de autenticación</h2>
            <p className="text-muted-foreground">Redirigiendo al login...</p>
          </div>
        )}
      </div>
    </div>
  )
}
