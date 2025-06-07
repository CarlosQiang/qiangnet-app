"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Eye, EyeOff, UserPlus, ArrowLeft, CheckCircle } from "lucide-react"
import { validatePassword } from "@/lib/utils"

const registerSchema = z
  .object({
    full_name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    username: z.string().min(3, "El usuario debe tener al menos 3 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string(),
    terms_accepted: z.boolean().refine((val) => val === true, "Debes aceptar los términos y condiciones"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { register: registerUser } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const password = watch("password")
  const passwordValidation = password ? validatePassword(password) : { isValid: false, errors: [] }

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true)
      await registerUser({
        full_name: data.full_name,
        username: data.username,
        email: data.email,
        password: data.password,
        terms_accepted: data.terms_accepted,
      })
      router.push("/login")
    } catch (error) {
      // Error handling is done in the AuthContext
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">Q</span>
                </div>
                <span className="font-bold text-xl gradient-text">QiangNet</span>
              </div>
              <div></div>
            </div>
            <div className="text-center space-y-2">
              <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
              <CardDescription>Completa el formulario para crear tu cuenta</CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="full_name" className="text-sm font-medium">
                  Nombre Completo
                </label>
                <Input
                  id="full_name"
                  type="text"
                  placeholder="Juan Pérez"
                  {...register("full_name")}
                  error={errors.full_name?.message}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Usuario
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="juanperez"
                  {...register("username")}
                  error={errors.username?.message}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="juan@email.com"
                  {...register("email")}
                  error={errors.email?.message}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Contraseña
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    error={errors.password?.message}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>

                {password && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Requisitos de contraseña:</p>
                    <div className="space-y-1">
                      <div
                        className={`flex items-center text-xs ${password.length >= 8 ? "text-green-600" : "text-muted-foreground"}`}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Al menos 8 caracteres
                      </div>
                      <div
                        className={`flex items-center text-xs ${/[A-Z]/.test(password) ? "text-green-600" : "text-muted-foreground"}`}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Una letra mayúscula
                      </div>
                      <div
                        className={`flex items-center text-xs ${/[a-z]/.test(password) ? "text-green-600" : "text-muted-foreground"}`}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Una letra minúscula
                      </div>
                      <div
                        className={`flex items-center text-xs ${/\d/.test(password) ? "text-green-600" : "text-muted-foreground"}`}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Un número
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                    error={errors.confirmPassword?.message}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <input
                  id="terms_accepted"
                  type="checkbox"
                  {...register("terms_accepted")}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mt-0.5"
                />
                <label htmlFor="terms_accepted" className="text-sm text-muted-foreground">
                  Acepto los{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    términos y condiciones
                  </Link>{" "}
                  y la{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    política de privacidad
                  </Link>
                </label>
              </div>
              {errors.terms_accepted && <p className="text-sm text-destructive">{errors.terms_accepted.message}</p>}

              <Button
                type="submit"
                className="w-full btn-glow"
                loading={isLoading}
                disabled={isLoading || !passwordValidation.isValid}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Crear Cuenta
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                ¿Ya tienes una cuenta?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
