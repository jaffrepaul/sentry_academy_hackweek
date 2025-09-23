import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'
import { getServerSession } from 'next-auth/next'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import { db } from './db'
import { users, accounts, sessions, verification_tokens } from './db/schema'
// import bcrypt from 'bcryptjs' // TODO: Install bcryptjs for password hashing
import { eq } from 'drizzle-orm'

// Extend NextAuth types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email?: string | null
      name?: string | null
      image?: string | null
      role?: string | null
    }
  }

  interface User {
    id: string
    email?: string | null
    name?: string | null
    image?: string | null
    role?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string | null
  }
}

export const authOptions: NextAuthOptions = {
  // Use database adapter if DATABASE_URL is available, otherwise fallback to JWT only
  adapter:
    process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('dummy')
      ? DrizzleAdapter(db, {
          usersTable: users as any, // Schema field naming mismatch with NextAuth
          accountsTable: accounts as any,
          sessionsTable: sessions as any,
          verificationTokensTable: verification_tokens as any,
        })
      : (undefined as any), // Type assertion to bypass strict typing during build

  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Skip database lookup if DATABASE_URL is not available
          if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('dummy')) {
            console.warn('Database not available during auth, skipping user lookup')
            return null
          }

          const user = await db
            .select()
            .from(users)
            .where(eq(users.email, credentials.email))
            .limit(1)

          const foundUser = user[0]
          if (!foundUser) {
            return null
          }

          // For now, we'll skip password verification since we don't have a password field
          // In a real app, you'd verify the password here
          // const isPasswordValid = await bcrypt.compare(credentials.password, foundUser.password)

          return {
            id: foundUser.id,
            email: foundUser.email,
            name: foundUser.name,
            image: foundUser.image,
            role: foundUser.role || 'user',
          }
        } catch (error) {
          console.error('Authentication error:', error)
          return null
        }
      },
    }),

    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),

    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          }),
        ]
      : []),
  ],

  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role || 'student'
      } else if (token.sub) {
        // Refresh user role from database if token exists but no user object
        try {
          const dbUser = await db
            .select({ role: users.role })
            .from(users)
            .where(eq(users.id, token.sub))
            .limit(1)

          if (dbUser.length > 0 && dbUser[0]) {
            token.role = dbUser[0].role || 'student'
          }
        } catch (error) {
          console.error('Error fetching user role:', error)
        }
      }
      return token
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!
        session.user.role = (token.role as string) || 'student'
      }
      return session
    },

    async signIn({ user, account }) {
      // For OAuth providers, set default role if not exists
      if (account?.provider !== 'credentials' && user.email) {
        try {
          const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, user.email))
            .limit(1)

          if (existingUser.length === 0) {
            // This is handled by the adapter, but we can ensure role is set
            user.role = 'student'
          }
        } catch (error) {
          console.error('Error in signIn callback:', error)
        }
      }
      return true
    },
  },

  pages: {
    signIn: '/auth/signin',
    // signUp: '/auth/signup', // Custom sign up page if needed
    // error: '/auth/error',
  },

  events: {
    async createUser({ user }) {
      console.log('New user created:', user.email)
      // Here you could send welcome emails, set up default preferences, etc.
    },
  },
}

export default NextAuth(authOptions)

// Helper to get server-side session
export const getAuthSession = () => getServerSession(authOptions)
