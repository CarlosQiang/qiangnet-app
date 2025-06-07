import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { authApi } from "@/lib/api"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const response = await authApi.login({
            email: credentials.email,
            password: credentials.password,
          })

          if (response.success && response.user) {
            // Guardar token en cookies
            return {
              id: response.user.id,
              name: response.user.full_name,
              email: response.user.email,
              image: response.user.profile?.avatar_url,
              role: response.user.role,
              token: response.token,
            }
          }
          return null
        } catch (error) {
          console.error("Error en autenticación:", error)
          return null
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role
        token.accessToken = user.token
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role
        session.accessToken = token.accessToken
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
    signOut: "/",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 horas
  },
  secret: process.env.JWT_SECRET,
})

export { handler as GET, handler as POST }
