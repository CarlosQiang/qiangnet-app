export interface User {
  id: string
  email: string
  username: string
  full_name: string
  role: UserRole
  status: UserStatus
  is_approved: boolean
  is_whitelisted: boolean
  last_login: string | null
  created_at: string
  updated_at: string
  profile?: UserProfile
}

export interface UserProfile {
  id: string
  user_id: string
  avatar_url?: string
  bio?: string
  phone?: string
  location?: string
  website?: string
  preferences: Record<string, any>
  created_at: string
  updated_at: string
}

export type UserRole = "admin" | "moderator" | "user" | "guest"
export type UserStatus = "active" | "inactive" | "suspended" | "pending"

export interface AuthResponse {
  success: boolean
  message: string
  user?: User
  token?: string
  refreshToken?: string
}

export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

export interface RegisterData {
  email: string
  username: string
  password: string
  full_name: string
  terms_accepted: boolean
}

export interface Application {
  id: string
  name: string
  description: string
  icon: string
  url: string
  category: ApplicationCategory
  status: ApplicationStatus
  required_role: UserRole
  is_featured: boolean
  order_index: number
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export type ApplicationCategory = "system" | "media" | "productivity" | "development" | "gaming" | "other"
export type ApplicationStatus = "active" | "inactive" | "maintenance"

export interface DashboardStats {
  total_users: number
  active_users: number
  total_applications: number
  active_applications: number
  system_health: SystemHealth
  recent_activity: ActivityLog[]
}

export interface SystemHealth {
  cpu_usage: number
  memory_usage: number
  disk_usage: number
  network_status: "online" | "offline" | "limited"
  uptime: number
  last_backup: string | null
}

export interface ActivityLog {
  id: string
  user_id: string
  user_email: string
  action: string
  resource: string
  details: Record<string, any>
  ip_address: string
  user_agent: string
  created_at: string
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
  errors?: Record<string, string[]>
  pagination?: PaginationInfo
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  total_pages: number
  has_next: boolean
  has_prev: boolean
}

export interface ApiError {
  message: string
  status: number
  code?: string
  details?: any
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: NotificationType
  is_read: boolean
  action_url?: string
  metadata: Record<string, any>
  created_at: string
}

export type NotificationType = "info" | "success" | "warning" | "error" | "system"

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  updateProfile: (data: Partial<UserProfile>) => Promise<void>
}

export interface ThemeContextType {
  theme: "light" | "dark" | "system"
  setTheme: (theme: "light" | "dark" | "system") => void
  resolvedTheme: "light" | "dark"
}
