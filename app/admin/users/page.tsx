"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Badge } from "@/components/ui/Badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar"
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"
import { Modal } from "@/components/ui/Modal"
import { Search, UserPlus, Check, X, Shield, Edit, Eye, Mail, Calendar } from "lucide-react"
import { adminApi } from "@/lib/api"
import { useApi } from "@/hooks/useApi"
import type { User } from "@/lib/types"

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const { data: usersData, loading, execute: fetchUsers } = useApi(adminApi.getUsers)

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (usersData) {
      setUsers(usersData)
    }
  }, [usersData])

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === "all" || user.role === selectedRole
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleApproveUser = async (userId: string) => {
    try {
      setActionLoading(userId)
      await adminApi.approveUser(userId)
      await fetchUsers()
    } catch (error) {
      console.error("Error approving user:", error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleBlockUser = async (userId: string) => {
    try {
      setActionLoading(userId)
      await adminApi.blockUser(userId, "Blocked by admin")
      await fetchUsers()
    } catch (error) {
      console.error("Error blocking user:", error)
    } finally {
      setActionLoading(null)
    }
  }

  const getRoleColor = (role: string) => {
    const colors = {
      admin: "destructive",
      moderator: "warning",
      user: "default",
      guest: "secondary",
    }
    return colors[role as keyof typeof colors] || "secondary"
  }

  const getStatusColor = (status: string) => {
    const colors = {
      active: "success",
      inactive: "secondary",
      suspended: "destructive",
      pending: "warning",
    }
    return colors[status as keyof typeof colors] || "secondary"
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">Gestión de Usuarios</h1>
              <p className="text-muted-foreground text-lg">Administra usuarios, roles y permisos</p>
            </div>
            <Button className="btn-glow">
              <UserPlus className="h-4 w-4 mr-2" />
              Nuevo Usuario
            </Button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Buscar usuarios..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                    <option value="all">Todos los roles</option>
                    <option value="admin">Administrador</option>
                    <option value="moderator">Moderador</option>
                    <option value="user">Usuario</option>
                    <option value="guest">Invitado</option>
                  </Select>
                  <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                    <option value="all">Todos los estados</option>
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                    <option value="suspended">Suspendido</option>
                    <option value="pending">Pendiente</option>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Usuarios ({filteredUsers.length})</CardTitle>
              <CardDescription>Lista de todos los usuarios del sistema</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="p-4 font-medium">Usuario</th>
                      <th className="p-4 font-medium hidden sm:table-cell">Email</th>
                      <th className="p-4 font-medium">Rol</th>
                      <th className="p-4 font-medium">Estado</th>
                      <th className="p-4 font-medium hidden lg:table-cell">Último acceso</th>
                      <th className="p-4 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="border-b hover:bg-muted/50 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                              <AvatarImage src={user.profile?.avatar_url || "/placeholder.svg"} />
                              <AvatarFallback>
                                {user.full_name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm sm:text-base">{user.full_name}</div>
                              <div className="text-xs sm:text-sm text-muted-foreground">@{user.username}</div>
                              <div className="sm:hidden text-xs text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 hidden sm:table-cell">
                          <div className="text-sm">{user.email}</div>
                        </td>
                        <td className="p-4">
                          <Badge variant={getRoleColor(user.role) as any} className="text-xs">
                            {user.role === "admin" && <Shield className="h-3 w-3 mr-1" />}
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge variant={getStatusColor(user.status) as any} className="text-xs">
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="p-4 hidden lg:table-cell">
                          <div className="text-sm text-muted-foreground">
                            {user.last_login ? new Date(user.last_login).toLocaleDateString() : "Nunca"}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            {user.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleApproveUser(user.id)}
                                  disabled={actionLoading === user.id}
                                  className="text-green-600 hover:text-green-700 h-8 w-8 p-0"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleBlockUser(user.id)}
                                  disabled={actionLoading === user.id}
                                  className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedUser(user)
                                setShowUserModal(true)
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* User Details Modal */}
        <Modal isOpen={showUserModal} onClose={() => setShowUserModal(false)} title="Detalles del Usuario" size="lg">
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.profile?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="text-lg">
                    {selectedUser.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedUser.full_name}</h3>
                  <p className="text-muted-foreground">@{selectedUser.username}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={getRoleColor(selectedUser.role) as any}>{selectedUser.role}</Badge>
                    <Badge variant={getStatusColor(selectedUser.status) as any}>{selectedUser.status}</Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedUser.email}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Fecha de registro</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(selectedUser.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Último acceso</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {selectedUser.last_login ? new Date(selectedUser.last_login).toLocaleDateString() : "Nunca"}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Aprobado</label>
                  <div className="flex items-center gap-2 mt-1">
                    {selectedUser.is_approved ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                    <span>{selectedUser.is_approved ? "Sí" : "No"}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowUserModal(false)}>
                  Cerrar
                </Button>
                <Button>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Usuario
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  )
}
