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
    try {
      // En un entorno real, esto se conectaría a tu backend
      // Por ahora, simulamos una respuesta exitosa con datos de prueba

      // Simulación de verificación de credenciales
      if (credentials.email === "admin@qiangnet.local" && credentials.password === "Admin123!") {
        const mockUser: User = {
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

        return {
          success: true,
          message: "Inicio de sesión exitoso",
          user: mockUser,
          token: "mock-jwt-token-for-testing",
          refreshToken: "mock-refresh-token-for-testing",
        }
      } else if (credentials.email === "user@qiangnet.local" && credentials.password === "User123!") {
        const mockUser: User = {
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

        return {
          success: true,
          message: "Inicio de sesión exitoso",
          user: mockUser,
          token: "mock-jwt-token-for-user",
          refreshToken: "mock-refresh-token-for-user",
        }
      }

      // Si las credenciales no coinciden
      throw new Error("Credenciales inválidas")

      // En un entorno real, usaríamos:
      // return await apiRequest<ApiResponse>("/auth/login", "POST", credentials)
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  // Registrar nuevo usuario
  register: async (data: RegisterData): Promise<ApiResponse> => {
    try {
      // Simulación de registro exitoso
      return {
        success: true,
        message: "Usuario registrado correctamente",
      }

      // En un entorno real:
      // return await apiRequest<ApiResponse>("/auth/register", "POST", data)
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  // Cerrar sesión
  logout: async (): Promise<ApiResponse> => {
    try {
      // Simulación de cierre de sesión exitoso
      return {
        success: true,
        message: "Sesión cerrada correctamente",
      }

      // En un entorno real:
      // return await apiRequest<ApiResponse>("/auth/logout", "POST")
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  // Obtener datos del usuario actual
  me: async (): Promise<User> => {
    try {
      // Simulación de obtención de datos del usuario
      const token = localStorage.getItem("auth_token")

      // Verificar si es el token de admin o usuario
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

      // En un entorno real:
      // return await apiRequest<User>("/auth/me", "GET")
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  // Refrescar token
  refreshToken: async (refreshToken: string): Promise<ApiResponse> => {
    try {
      // Simulación de refresco de token exitoso
      return {
        success: true,
        message: "Token refrescado correctamente",
        token: "new-mock-jwt-token",
      }

      // En un entorno real:
      // return await apiRequest<ApiResponse>("/auth/refresh", "POST", { refreshToken })
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },
}

// API de aplicaciones
export const applicationsApi = {
  // Obtener todas las aplicaciones
  getAll: async (): Promise<Application[]> => {
    try {
      // Simulación de obtención de aplicaciones
      return [
        {
          id: "1",
          name: "Plex Media Server",
          description: "Servidor multimedia para organizar y transmitir tu colección de películas, series y música.",
          icon: "/placeholder.svg?height=64&width=64",
          url: "http://plex.local:32400",
          category: "media",
          status: "active",
          required_role: "user",
          is_featured: true,
          order_index: 1,
          metadata: {},
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
        },
        {
          id: "2",
          name: "Nextcloud",
          description: "Plataforma de productividad y almacenamiento en la nube de código abierto.",
          icon: "/placeholder.svg?height=64&width=64",
          url: "http://nextcloud.local",
          category: "productivity",
          status: "active",
          required_role: "user",
          is_featured: true,
          order_index: 2,
          metadata: {},
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
        },
        {
          id: "3",
          name: "Home Assistant",
          description: "Plataforma de automatización del hogar de código abierto.",
          icon: "/placeholder.svg?height=64&width=64",
          url: "http://homeassistant.local:8123",
          category: "system",
          status: "active",
          required_role: "user",
          is_featured: true,
          order_index: 3,
          metadata: {},
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
        },
        {
          id: "4",
          name: "Portainer",
          description: "Gestión de contenedores Docker a través de una interfaz web.",
          icon: "/placeholder.svg?height=64&width=64",
          url: "http://portainer.local:9000",
          category: "development",
          status: "active",
          required_role: "admin",
          is_featured: false,
          order_index: 4,
          metadata: {},
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
        },
        {
          id: "5",
          name: "Jellyfin",
          description: "Servidor multimedia de código abierto.",
          icon: "/placeholder.svg?height=64&width=64",
          url: "http://jellyfin.local:8096",
          category: "media",
          status: "active",
          required_role: "user",
          is_featured: false,
          order_index: 5,
          metadata: {},
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
        },
        {
          id: "6",
          name: "Grafana",
          description: "Plataforma de análisis y monitorización.",
          icon: "/placeholder.svg?height=64&width=64",
          url: "http://grafana.local:3000",
          category: "development",
          status: "active",
          required_role: "admin",
          is_featured: false,
          order_index: 6,
          metadata: {},
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
        },
        {
          id: "7",
          name: "Minecraft Server",
          description: "Servidor de Minecraft para jugar con amigos.",
          icon: "/placeholder.svg?height=64&width=64",
          url: "http://minecraft.local:25565",
          category: "gaming",
          status: "active",
          required_role: "user",
          is_featured: false,
          order_index: 7,
          metadata: {},
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
        },
        {
          id: "8",
          name: "Transmission",
          description: "Cliente BitTorrent ligero y multiplataforma.",
          icon: "/placeholder.svg?height=64&width=64",
          url: "http://transmission.local:9091",
          category: "media",
          status: "maintenance",
          required_role: "user",
          is_featured: false,
          order_index: 8,
          metadata: {},
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
        },
        {
          id: "9",
          name: "Pi-hole",
          description: "Bloqueador de anuncios y rastreadores a nivel de red.",
          icon: "/placeholder.svg?height=64&width=64",
          url: "http://pihole.local/admin",
          category: "system",
          status: "active",
          required_role: "admin",
          is_featured: false,
          order_index: 9,
          metadata: {},
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
        },
        {
          id: "10",
          name: "Bitwarden",
          description: "Gestor de contraseñas de código abierto.",
          icon: "/placeholder.svg?height=64&width=64",
          url: "http://bitwarden.local",
          category: "productivity",
          status: "inactive",
          required_role: "guest",
          is_featured: false,
          order_index: 10,
          metadata: {},
          created_at: "2023-01-01T00:00:00Z",
          updated_at: "2023-01-01T00:00:00Z",
        },
      ]

      // En un entorno real:
      // return await apiRequest<Application[]>("/applications", "GET")
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  // Obtener una aplicación por ID
  getById: async (id: string): Promise<Application> => {
    try {
      // Simulación de obtención de una aplicación por ID
      const apps = await applicationsApi.getAll()
      const app = apps.find((app) => app.id === id)

      if (!app) {
        throw new Error("Aplicación no encontrada")
      }

      return app

      // En un entorno real:
      // return await apiRequest<Application>(`/applications/${id}`, "GET")
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  // Crear una nueva aplicación
  create: async (data: Partial<Application>): Promise<Application> => {
    try {
      // Simulación de creación de una aplicación
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

      // En un entorno real:
      // return await apiRequest<Application>("/applications", "POST", data)
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  // Actualizar una aplicación
  update: async (id: string, data: Partial<Application>): Promise<Application> => {
    try {
      // Simulación de actualización de una aplicación
      const app = await applicationsApi.getById(id)

      return {
        ...app,
        ...data,
        updated_at: new Date().toISOString(),
      }

      // En un entorno real:
      // return await apiRequest<Application>(`/applications/${id}`, "PUT", data)
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  // Eliminar una aplicación
  delete: async (id: string): Promise<ApiResponse> => {
    try {
      // Simulación de eliminación de una aplicación
      return {
        success: true,
        message: "Aplicación eliminada correctamente",
      }

      // En un entorno real:
      // return await apiRequest<ApiResponse>(`/applications/${id}`, "DELETE")
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },
}

// API de administración
export const adminApi = {
  // Obtener estadísticas del dashboard
  getDashboardStats: async () => {
    try {
      // Simulación de estadísticas del dashboard
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
          uptime: 1209600, // 14 días en segundos
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
          {
            id: "2",
            user_id: "2",
            user_email: "user@qiangnet.local",
            action: "application_access",
            resource: "applications",
            details: { application_id: "1", application_name: "Plex Media Server" },
            ip_address: "192.168.1.101",
            user_agent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
            created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hora antes
          },
        ],
      }

      // En un entorno real:
      // return await apiRequest("/admin/dashboard", "GET")
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  // Obtener usuarios
  getUsers: async () => {
    try {
      // Simulación de obtención de usuarios
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
          last_login: new Date(Date.now() - 86400000).toISOString(), // 1 día antes
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
        {
          id: "3",
          email: "moderator@qiangnet.local",
          username: "moderator",
          full_name: "Moderador",
          role: "moderator",
          status: "active",
          is_approved: true,
          is_whitelisted: true,
          last_login: new Date(Date.now() - 172800000).toISOString(), // 2 días antes
          created_at: "2023-02-01T00:00:00Z",
          updated_at: "2023-02-01T00:00:00Z",
          profile: {
            id: "3",
            user_id: "3",
            avatar_url: "/placeholder.svg?height=200&width=200",
            bio: "Moderador del sistema",
            preferences: {},
            created_at: "2023-02-01T00:00:00Z",
            updated_at: "2023-02-01T00:00:00Z",
          },
        },
        {
          id: "4",
          email: "pending@qiangnet.local",
          username: "pending",
          full_name: "Usuario Pendiente",
          role: "user",
          status: "pending",
          is_approved: false,
          is_whitelisted: false,
          last_login: null,
          created_at: new Date(Date.now() - 86400000).toISOString(), // 1 día antes
          updated_at: new Date(Date.now() - 86400000).toISOString(), // 1 día antes
          profile: {
            id: "4",
            user_id: "4",
            avatar_url: null,
            bio: "",
            preferences: {},
            created_at: new Date(Date.now() - 86400000).toISOString(), // 1 día antes
            updated_at: new Date(Date.now() - 86400000).toISOString(), // 1 día antes
          },
        },
        {
          id: "5",
          email: "inactive@qiangnet.local",
          username: "inactive",
          full_name: "Usuario Inactivo",
          role: "user",
          status: "inactive",
          is_approved: true,
          is_whitelisted: true,
          last_login: new Date(Date.now() - 2592000000).toISOString(), // 30 días antes
          created_at: "2023-01-10T00:00:00Z",
          updated_at: "2023-01-10T00:00:00Z",
          profile: {
            id: "5",
            user_id: "5",
            avatar_url: null,
            bio: "",
            preferences: {},
            created_at: "2023-01-10T00:00:00Z",
            updated_at: "2023-01-10T00:00:00Z",
          },
        },
      ]

      // En un entorno real:
      // return await apiRequest("/admin/users", "GET")
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  // Aprobar usuario
  approveUser: async (userId: string) => {
    try {
      // Simulación de aprobación de usuario
      return {
        success: true,
        message: "Usuario aprobado correctamente",
      }

      // En un entorno real:
      // return await apiRequest(`/admin/users/${userId}/approve`, "POST")
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  // Bloquear usuario
  blockUser: async (userId: string, reason: string) => {
    try {
      // Simulación de bloqueo de usuario
      return {
        success: true,
        message: "Usuario bloqueado correctamente",
      }

      // En un entorno real:
      // return await apiRequest(`/admin/users/${userId}/block`, "POST", { reason })
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },

  // Obtener logs del sistema
  getLogs: async () => {
    try {
      // Simulación de obtención de logs
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
        {
          id: "2",
          timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutos antes
          level: "warning",
          action: "failed_login_attempt",
          user_email: "user@example.com",
          ip_address: "192.168.1.101",
          user_agent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
          details: { reason: "invalid_password", attempts: 3 },
        },
        {
          id: "3",
          timestamp: new Date(Date.now() - 600000).toISOString(), // 10 minutos antes
          level: "error",
          action: "application_error",
          user_email: "user@example.com",
          ip_address: "192.168.1.102",
          user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
          details: { error: "Database connection failed", stack: "..." },
        },
      ]

      // En un entorno real:
      // return await apiRequest("/admin/logs", "GET")
    } catch (error) {
      handleApiError(error)
      throw error
    }
  },
}
