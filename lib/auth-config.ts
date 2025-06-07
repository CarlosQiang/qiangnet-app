// Configuración de autenticación
export const authConfig = {
  google: {
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
    redirectUri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || "http://localhost:3000/auth/google/callback",
  },
  jwt: {
    expiresIn: "24h",
    refreshExpiresIn: "7d",
  },
  routes: {
    login: "/login",
    register: "/register",
    dashboard: "/dashboard",
    services: "/services",
    admin: "/admin",
    unauthorized: "/unauthorized",
  },
}

// Configuración de roles y permisos
export const rolePermissions = {
  admin: {
    canAccessAdmin: true,
    canManageUsers: true,
    canManageApplications: true,
    canViewAllServices: true,
    canModifySettings: true,
    canViewLogs: true,
    canManageBackups: true,
  },
  moderator: {
    canAccessAdmin: false,
    canManageUsers: true,
    canManageApplications: false,
    canViewAllServices: true,
    canModifySettings: false,
    canViewLogs: true,
    canManageBackups: false,
  },
  user: {
    canAccessAdmin: false,
    canManageUsers: false,
    canManageApplications: false,
    canViewAllServices: false,
    canModifySettings: false,
    canViewLogs: false,
    canManageBackups: false,
  },
  guest: {
    canAccessAdmin: false,
    canManageUsers: false,
    canManageApplications: false,
    canViewAllServices: false,
    canModifySettings: false,
    canViewLogs: false,
    canManageBackups: false,
  },
}

export const hasPermission = (userRole: string, permission: keyof typeof rolePermissions.admin): boolean => {
  const permissions = rolePermissions[userRole as keyof typeof rolePermissions]
  return permissions ? permissions[permission] : false
}
