'use server'

import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

// Extended session type for server actions
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export interface CreateUserData {
  email: string
  name?: string
  role?: 'student' | 'instructor' | 'admin'
}

export interface UpdateUserData {
  name?: string
  role?: 'student' | 'instructor' | 'admin'
}

// Get current authenticated user
export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return null
    }

    // Check if database is available
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('dummy')) {
      console.warn('Database not available, returning session user data only')
      return {
        id: session.user.id || '',
        email: session.user.email,
        name: session.user.name,
        role: session.user.role || 'student',
        created_at: new Date(),
        updated_at: new Date(),
      }
    }

    const [user] = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1)

    return user || null
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Create a new user account
export async function createUser(userData: CreateUserData): Promise<{
  success: boolean
  user?: typeof users.$inferSelect
  error?: string
}> {
  try {
    // Check if user already exists
    const existing = await db.select().from(users).where(eq(users.email, userData.email)).limit(1)

    if (existing.length > 0) {
      return {
        success: false,
        error: 'User already exists with this email',
      }
    }

    // Create new user - generate ID
    const userId = crypto.randomUUID()
    const [newUser] = await db
      .insert(users)
      .values({
        id: userId,
        email: userData.email,
        name: userData.name || null,
        role: userData.role || 'student',
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning()

    if (!newUser) {
      return {
        success: false,
        error: 'Failed to create user',
      }
    }

    revalidatePath('/admin')

    return {
      success: true,
      user: newUser,
    }
  } catch (error) {
    console.error('Error creating user:', error)
    return {
      success: false,
      error: 'Failed to create user account',
    }
  }
}

// Update user profile
export async function updateUserProfile(
  userId: string,
  updates: UpdateUserData
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return { success: false, error: 'Not authenticated' }
    }

    // Check if user exists and has permission to update
    const [existingUser] = await db.select().from(users).where(eq(users.id, userId)).limit(1)

    if (!existingUser) {
      return { success: false, error: 'User not found' }
    }

    // Check permissions - users can update their own profile, admins can update any
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return { success: false, error: 'Not authenticated' }
    }

    const canUpdate = currentUser.id === userId || currentUser.role === 'admin'
    if (!canUpdate) {
      return { success: false, error: 'Permission denied' }
    }

    // Update user
    await db
      .update(users)
      .set({
        ...updates,
        updated_at: new Date(),
      })
      .where(eq(users.id, userId))

    revalidatePath('/profile')
    revalidatePath('/admin')

    return { success: true }
  } catch (error) {
    console.error('Error updating user profile:', error)
    return {
      success: false,
      error: 'Failed to update profile',
    }
  }
}

// Change user role (admin only)
export async function changeUserRole(
  userId: string,
  newRole: 'student' | 'instructor' | 'admin'
): Promise<{ success: boolean; error?: string }> {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== 'admin') {
      return { success: false, error: 'Permission denied - admin required' }
    }

    await db
      .update(users)
      .set({
        role: newRole,
        updated_at: new Date(),
      })
      .where(eq(users.id, userId))

    revalidatePath('/admin')

    return { success: true }
  } catch (error) {
    console.error('Error changing user role:', error)
    return {
      success: false,
      error: 'Failed to change user role',
    }
  }
}

// Delete user account (admin only or self-delete)
export async function deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return { success: false, error: 'Not authenticated' }
    }

    // Check permissions
    const canDelete = currentUser.id === userId || currentUser.role === 'admin'
    if (!canDelete) {
      return { success: false, error: 'Permission denied' }
    }

    await db.delete(users).where(eq(users.id, userId))

    revalidatePath('/admin')

    // If user deleted their own account, sign them out
    if (currentUser.id === userId) {
      redirect('/auth/signin')
    }

    return { success: true }
  } catch (error) {
    console.error('Error deleting user:', error)
    return {
      success: false,
      error: 'Failed to delete user account',
    }
  }
}

// Get all users (admin only)
export async function getAllUsers(limit: number = 50, offset: number = 0) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== 'admin') {
      return []
    }

    return await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })
      .from(users)
      .limit(limit)
      .offset(offset)
      .orderBy(users.created_at)
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

// Check if user has specific permission
export async function checkUserPermission(
  action: 'create_course' | 'edit_course' | 'delete_course' | 'manage_users' | 'view_analytics'
): Promise<boolean> {
  try {
    // If database is not available, deny all permissions for safety
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('dummy')) {
      console.warn('Database not available, denying permission check')
      return false
    }

    const currentUser = await getCurrentUser()
    if (!currentUser) return false

    switch (action) {
      case 'create_course':
      case 'edit_course':
        return ['instructor', 'admin'].includes(currentUser.role || '')

      case 'delete_course':
      case 'manage_users':
      case 'view_analytics':
        return currentUser.role === 'admin'

      default:
        return false
    }
  } catch (error) {
    console.error('Error checking user permission:', error)
    return false
  }
}

// Get user role for a specific user
export async function getUserRole(userId?: string): Promise<string | null> {
  try {
    let user

    if (userId) {
      ;[user] = await db
        .select({ role: users.role })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1)
    } else {
      user = await getCurrentUser()
    }

    return user?.role || null
  } catch (error) {
    console.error('Error getting user role:', error)
    return null
  }
}

// Sign out user
export async function signOutUser(): Promise<{ success: boolean }> {
  try {
    // This will be handled by NextAuth signOut function on client side
    // This server action is mainly for cleanup if needed

    revalidatePath('/')
    redirect('/auth/signin')
  } catch (error) {
    console.error('Error signing out user:', error)
    return { success: false }
  }
}

// Update user last login time
export async function updateLastLogin(email: string): Promise<void> {
  try {
    await db
      .update(users)
      .set({
        updated_at: new Date(),
      })
      .where(eq(users.email, email))
  } catch (error) {
    console.error('Error updating last login:', error)
  }
}
