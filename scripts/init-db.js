const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

async function main() {
  console.log("🚀 Inicializando base de datos...")

  // Crear rol de administrador
  const adminRole = await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: {
      name: "admin",
      description: "Administrador del sistema",
      permissions: ["*"], // Acceso total
    },
  })

  // Crear rol de usuario
  const userRole = await prisma.role.upsert({
    where: { name: "user" },
    update: {},
    create: {
      name: "user",
      description: "Usuario estándar",
      permissions: ["dashboard", "jellyfin", "nextcloud"],
    },
  })

  // Crear usuario administrador
  const adminEmail = process.env.ADMIN_EMAIL || "admin@qiangnet.dev"
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123"
  const hashedPassword = await bcrypt.hash(adminPassword, 12)

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Administrador",
      password: hashedPassword,
      approved: true,
    },
  })

  // Asignar rol de admin
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  })

  // Crear configuración por defecto
  await prisma.appSettings.upsert({
    where: { id: "1" },
    update: {},
    create: {
      id: "1",
      logoUrl: "",
      bgImage: "",
      siteName: "QiangNet",
      theme: {
        primary: "#3b82f6",
        secondary: "#1f2937",
        background: "#ffffff",
        text: "#111827",
      },
    },
  })

  console.log("✅ Base de datos inicializada")
  console.log(`👤 Admin creado: ${adminEmail} / ${adminPassword}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
