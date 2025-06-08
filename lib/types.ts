// Tipos de datos principales
export interface User {
  id: string
  email: string
  username: string
  full_name: string
  role: "admin" | "moderator" | "user" | "guest"
  status: "active" | "inactive" | "suspended" | "pending"
  is_approved?: boolean
  is_whitelisted?: boolean
  last_login?: string
  created_at: string
  updated_at?: string
  profile?: UserProfile
}

export interface UserProfile {
  id: string
  user_id: string
  avatar_url?: string
  bio?: string
  preferences: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Application {
  id: string
  name: string
  description: string
  url: string
  icon: string
  category: "media" | "productivity" | "development" | "gaming" | "utility" | "other"
  status: "active" | "inactive" | "maintenance"
  required_role?: string
  is_featured?: boolean
  order_index?: number
  metadata?: Record<string, any>
  created_at?: string
  updated_at?: string
}

export interface LoginCredentials {
  email: string
  password: string
  remember_me?: boolean
}

export interface RegisterData {
  email: string
  username: string
  full_name: string
  password: string
  confirm_password: string
  terms_accepted: boolean
}

export interface ApiResponse {
  success: boolean
  message: string
  data?: any
  user?: User
  token?: string
  refreshToken?: string
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<string>
  updateProfile: (data: Partial<User>) => Promise<void>
}

export interface SystemHealth {
  cpu_usage: number
  memory_usage: number
  disk_usage: number
  network_status: "online" | "offline" | "degraded"
  uptime: number
  last_backup: string
}

export interface ActivityLog {
  id: string
  user_id?: string
  user_email?: string
  action: string
  resource: string
  details: Record<string, any>
  ip_address: string
  user_agent: string
  created_at: string
}

export interface ParticlesConfig {
  enabled: boolean
  count: number
  speed: number
  size: number
  color: string
  opacity: number
  connections: boolean
}
