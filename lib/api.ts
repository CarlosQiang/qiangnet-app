import type { ApiResponse, LoginCredentials, RegisterData, User, Application } from "@/lib/types"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

// Función auxiliar para manejar errores de API
const handleApiError = (error: any) => {
  console.error("API Error:", error)
  if (error.response?.data?.message) {
    throw new Error(error.response.data.message)
  } else if (error.message) {
    throw new Error(error.message)
  } else {
    throw new Error("Error desconocido en la comunicación con el servidor")
  }
}

// Función para realizar peticiones a la API
async function apiRequest<T>(
  endpoint: string,
  method = "GET",
  data?: any,
  headers: Record<string, string> = {},
): Promise<T> {
  try {
    // Obtener token de autenticación si existe
    const token = localStorage.getItem("auth_token")
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    // Configurar la petición
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      credentials: "include",
    }

    // Añadir body si es necesario
    if (data) {
      options.body = JSON.stringify(data)
    }

    // Realizar la petición
    const response = await fetch(`${API_URL}${endpoint}`, options)
    const responseData = await response.json()

    // Comprobar si la respuesta es exitosa
    if (!response.ok) {
      throw {
        response: {
          data: responseData,
          status: response.status,
        },
      }
    }

    return responseData as T
  } catch (error) {
    handleApiError(error)
    throw error
  }
}

// API de autenticación
export const authApi = {
  // Iniciar sesión
  login: async (credentials: LoginCredentials): Promise<ApiResponse> => {
    if (credentials.email === "admin@qiangnet.local" && credentials.password === "Admin123!") {
      const mockUser: User = {
        id: "1",
        email: "admin@qiangnet.local",
        username: "admin",
        full_name: "Administrador",
        role: "admin",
        status: "active",
        created_at: new Date().toISOString(),
      }

      return {
        success: true,
        message: "Inicio de sesión exitoso",
        user: mockUser,
        token: "mock-jwt-token",
      }
    }

    throw new Error("Credenciales inválidas")
  },

  register: async (data: RegisterData): Promise<ApiResponse> => {
    try {
      return {
        success: true,
        message: "Usuario registrado correctamente",
      }
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  logout: async (): Promise<ApiResponse> => {
    return {
      success: true,
      message: "Sesión cerrada correctamente",
    }
  },

  me: async (): Promise<User> => {
    try {
      const token = localStorage.getItem("auth_token")

      if (token === "mock-jwt-token-for-testing") {
        return {
          id: "1",
          email: "admin@qiangnet.local",
          username: "admin",
          full_name: "Administrador",
          role: "admin",
          status: "active",
          is_approved: true,
          is_whitelisted: true,
          last_login: new Date().toISOString(),
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
          profile: {
            id: "1",
            user_id: "1",
            avatar_url: "/placeholder.svg?height=200&width=200",
            bio: "Administrador del sistema",
            preferences: {},
            created_at: "2023-01-01T00:00:00Z",
            updated_at: "2023-01-01T00:00:00Z",
          },
        }
      } else if (token === "mock-jwt-token-for-user") {
        return {
          id: "2",
          email: "user@qiangnet.local",
          username: "user",
          full_name: "Usuario Normal",
          role: "user",
          status: "active",
          is_approved: true,
          is_whitelisted: true,
          last_login: new Date().toISOString(),
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
          profile: {
            id: "2",
            user_id: "2",
            avatar_url: "/placeholder.svg?height=200&width=200",
            bio: "Usuario del sistema",
            preferences: {},
            created_at: "2023-01-01T00:00:00Z",
            updated_at: "2023-01-01T00:00:00Z",
          },
        }
      }

      throw new Error("Token inválido")
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  refreshToken: async (refreshToken: string): Promise<ApiResponse> => {
    try {
      return {
        success: true,
        message: "Token refrescado correctamente",
        token: "new-mock-jwt-token",
      }
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },
}

// API de aplicaciones
export const applicationsApi = {
  getAll: async (): Promise<Application[]> => {
    return [
      {
        id: "1",
        name: "Plex Media Server",
        description: "Servidor multimedia",
        url: "http://plex.local:32400",
        icon: "/placeholder.svg?height=64&width=64",
        category: "media",
        status: "active",
      },
    ]
  },

  getById: async (id: string): Promise<Application> => {
    try {
      const apps = await applicationsApi.getAll()
      const app = apps.find((app) => app.id === id)

      if (!app) {
        throw new Error("Aplicación no encontrada")
      }

      return app
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  create: async (data: Partial<Application>): Promise<Application> => {
    try {
      return {
        id: Math.random().toString(36).substring(7),
        name: data.name || "Nueva Aplicación",
        description: data.description || "Descripción de la nueva aplicación",
        icon: data.icon || "/placeholder.svg?height=64&width=64",
        url: data.url || "http://app.local",
        category: data.category || "other",
        status: data.status || "inactive",
        required_role: data.required_role || "user",
        is_featured: data.is_featured || false,
        order_index: data.order_index || 0,
        metadata: data.metadata || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  update: async (id: string, data: Partial<Application>): Promise<Application> => {
    try {
      const app = await applicationsApi.getById(id)

      return {
        ...app,
        ...data,
        updated_at: new Date().toISOString(),
      }
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  delete: async (id: string): Promise<ApiResponse> => {
    try {
      return {
        success: true,
        message: "Aplicación eliminada correctamente",
      }
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },
}

// API de dashboard
export const dashboardApi = {
  getStats: async () => {
    try {
      return {
        total_users: 15,
        active_users: 8,
        total_applications: 10,
        active_applications: 7,
        system_health: {
          cpu_usage: 23,
          memory_usage: 67,
          disk_usage: 45,
          network_status: "online",
          uptime: 1209600,
          last_backup: "2023-06-01T00:00:00Z",
        },
        recent_activity: [
          {
            id: "1",
            user_id: "1",
            user_email: "admin@qiangnet.local",
            action: "user_login",
            resource: "auth",
            details: { success: true, method: "password" },
            ip_address: "192.168.1.100",
            user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            created_at: new Date().toISOString(),
          },
        ],
      }
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },
}

// API de administración
export const adminApi = {
  getUsers: async () => {
    try {
      return [
        {
          id: "1",
          email: "admin@qiangnet.local",
          username: "admin",
          full_name: "Administrador",
          role: "admin",
          status: "active",
          is_approved: true,
          is_whitelisted: true,
          last_login: new Date().toISOString(),
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
          profile: {
            id: "1",
            user_id: "1",
            avatar_url: "/placeholder.svg?height=200&width=200",
            bio: "Administrador del sistema",
            preferences: {},
            created_at: "2023-01-01T00:00:00Z",
            updated_at: "2023-01-01T00:00:00Z",
          },
        },
        {
          id: "2",
          email: "user@qiangnet.local",
          username: "user",
          full_name: "Usuario Normal",
          role: "user",
          status: "active",
          is_approved: true,
          is_whitelisted: true,
          last_login: new Date(Date.now() - 86400000).toISOString(),
          created_at: "2023-01-15T00:00:00Z",
          updated_at: "2023-01-15T00:00:00Z",
          profile: {
            id: "2",
            user_id: "2",
            avatar_url: "/placeholder.svg?height=200&width=200",
            bio: "Usuario del sistema",
            preferences: {},
            created_at: "2023-01-15T00:00:00Z",
            updated_at: "2023-01-15T00:00:00Z",
          },
        },
      ]
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  approveUser: async (userId: string) => {
    try {
      return {
        success: true,
        message: "Usuario aprobado correctamente",
      }
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  blockUser: async (userId: string, reason: string) => {
    try {
      return {
        success: true,
        message: "Usuario bloqueado correctamente",
      }
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  getLogs: async () => {
    try {
      return [
        {
          id: "1",
          timestamp: new Date().toISOString(),
          level: "info",
          action: "user_login",
          user_email: "admin@qiangnet.local",
          ip_address: "192.168.1.100",
          user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          details: { success: true, method: "password" },
        },
      ]
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },
}
