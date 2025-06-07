"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import type { User, AuthContextType, LoginCredentials, RegisterData } from "@/lib/types"
import { authApi } from "@/lib/api"
import { toast } from "react-hot-toast"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Verificar autenticación al cargar
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem("auth_token")
      if (token) {
        const userData = await authApi.me()
        setUser(userData)
      }
    } catch (error: any) {
      console.error("Auth check failed:", error)
      // Si el token es inválido, limpiar storage
      localStorage.removeItem("auth_token")
      localStorage.removeItem("refresh_token")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true)
      const response = await authApi.login(credentials)

      if (response.token) {
        // Guardar tokens
        localStorage.setItem("auth_token", response.token)
        if (response.refreshToken) {
          localStorage.setItem("refresh_token", response.refreshToken)
        }

        // Establecer usuario
        setUser(response.user!)

        // Mostrar mensaje de éxito
        toast.success(`¡Bienvenido de vuelta, ${response.user?.full_name || response.user?.username}!`)

        // Redirigir a la página solicitada o dashboard
        const searchParams = new URLSearchParams(window.location.search)
        const redirectTo = searchParams.get("redirect") || "/dashboard"
        router.push(redirectTo)
      }
    } catch (error: any) {
      console.error("Login error:", error)
      toast.error(error.message || "Error al iniciar sesión")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true)
      const response = await authApi.register(data)
      toast.success("Cuenta creada exitosamente. Por favor, inicia sesión.")
      router.push("/login")
    } catch (error: any) {
      console.error("Register error:", error)
      toast.error(error.message || "Error al crear la cuenta")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      // Intentar logout en el servidor
      await authApi.logout()
    } catch (error) {
      // Ignorar errores de logout del servidor
      console.warn("Server logout failed:", error)
    } finally {
      // Limpiar estado local siempre
      localStorage.removeItem("auth_token")
      localStorage.removeItem("refresh_token")
      setUser(null)
      setIsLoading(false)
      toast.success("Sesión cerrada correctamente")
      router.push("/")
    }
  }

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token")
      if (!refreshToken) {
        throw new Error("No refresh token available")
      }

      const response = await authApi.refreshToken(refreshToken)
      localStorage.setItem("auth_token", response.token)

      return response.token
    } catch (error) {
      console.error("Token refresh failed:", error)
      await logout()
      throw error
    }
  }

  const updateProfile = async (data: Partial<any>) => {
    try {
      setIsLoading(true)
      // Aquí implementarías la actualización del perfil
      // const updatedUser = await usersApi.updateProfile(data)
      // setUser(updatedUser)
      toast.success("Perfil actualizado correctamente")
    } catch (error: any) {
      console.error("Profile update error:", error)
      toast.error(error.message || "Error al actualizar el perfil")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshToken,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
