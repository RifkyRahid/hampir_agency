import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'

const AUTH_SECRET = process.env.AUTH_SECRET || 'hampir-agency-default-secure-secret-key-32chars!'
const key = new TextEncoder().encode(AUTH_SECRET)
export const SESSION_COOKIE = 'admin_session'

export type SessionPayload = {
  sub: string
  email: string
  role: string
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key)
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] })
    return payload as unknown as SessionPayload
  } catch (e) {
    return null
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null
  return verifySessionToken(token)
}

export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    throw new Error('Unauthorized: Admin access required')
  }
  return session
}

