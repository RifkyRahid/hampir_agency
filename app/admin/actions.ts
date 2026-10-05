'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { createSessionToken, SESSION_COOKIE } from '@/lib/auth'

export type LoginResult = { error?: string; success?: boolean }

export async function loginAction(formData: FormData): Promise<LoginResult> {
  const email = String(formData.get('email') || '').trim().toLowerCase()
  const password = String(formData.get('password') || '')

  if (!email || !password) {
    return { error: 'Email dan kata sandi wajib diisi.' }
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return { error: 'Kredensial tidak valid. Silakan coba kembali.' }
    }

    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      return { error: 'Kredensial tidak valid. Silakan coba kembali.' }
    }

    const token = await createSessionToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    })

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return { success: true }
  } catch (e) {
    console.error('loginAction error:', e)
    return { error: 'Terjadi kendala saat memproses login.' }
  }
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  redirect('/admin/login')
}

