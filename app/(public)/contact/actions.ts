'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export type ContactResult = { success?: boolean; error?: string }

export async function createMessage(
  formData: FormData
): Promise<ContactResult> {
  try {
    const name = String(formData.get('name') || '').trim()
    const email = String(formData.get('email') || '').trim()
    const message = String(formData.get('message') || '').trim()

    if (!name || !email || !message) {
      return { error: 'Please fill in your name, email and message.' }
    }

    await prisma.contactMessage.create({
      data: { name, email, message },
    })
    revalidatePath('/admin/messages')
    revalidatePath('/admin')
    return { success: true }
  } catch (e) {
    console.error('createMessage error:', e)
    return { error: 'Something went wrong. Please try again shortly.' }
  }
}
