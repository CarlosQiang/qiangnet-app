import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    let settings = await prisma.appSettings.findFirst()

    if (!settings) {
      // Crear configuración por defecto
      settings = await prisma.appSettings.create({
        data: {
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
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Settings error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()

    let settings = await prisma.appSettings.findFirst()

    if (settings) {
      settings = await prisma.appSettings.update({
        where: { id: settings.id },
        data,
      })
    } else {
      settings = await prisma.appSettings.create({
        data,
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Settings update error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
