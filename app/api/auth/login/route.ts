import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { verifyPassword, generateToken, createAuditLog } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña son requeridos" }, { status: 400 })
    }

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    })

    if (!user) {
      await createAuditLog("LOGIN_FAILED", undefined, { email, reason: "User not found" })
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    // Verificar contraseña
    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      await createAuditLog("LOGIN_FAILED", user.id, { reason: "Invalid password" })
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    // Verificar si está bloqueado
    if (user.blocked) {
      await createAuditLog("LOGIN_BLOCKED", user.id, { reason: "User blocked" })
      return NextResponse.json({ error: "Cuenta bloqueada" }, { status: 403 })
    }

    // Verificar si está aprobado
    if (!user.approved) {
      await createAuditLog("LOGIN_PENDING", user.id, { reason: "User not approved" })
      return NextResponse.json({ error: "Cuenta pendiente de aprobación" }, { status: 403 })
    }

    // Generar token
    const roles = user.roles.map((ur) => ur.role.name)
    const token = generateToken({
      userId: user.id,
      email: user.email,
      roles,
    })

    // Guardar sesión
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
      },
    })

    // Log exitoso
    await createAuditLog("LOGIN_SUCCESS", user.id)

    // Configurar cookie
    const response = NextResponse.json({
      message: "Login exitoso",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles,
      },
    })

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 horas
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
