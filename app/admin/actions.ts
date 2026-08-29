'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@hampir.agency'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const SESSION_COOKIE = 'admin_session'

export type LoginResult = { error?: string; success?: boolean }

/**
 * Simple email/password login.
 * Static validation for now — swap to a Prisma `User` lookup once the
 * PostgreSQL database is seeded.
 *
 * Sets an HTTP-only session cookie and returns { success } so the client
 * can perform a full navigation (reliable on React 18.3 / Next 15).
 */
export async function loginAction(formData: FormData): Promise<LoginResult> {
  const email = String(formData.get('email') || '').trim().toLowerCase()
  const password = String(formData.get('password') || '')

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  if (email !== ADMIN_EMAIL.toLowerCase() || password !== ADMIN_PASSWORD) {
    return { error: 'Invalid credentials. Please try again.' }
  }

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return { success: true }
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  redirect('/admin/login')
}
