'use server'

import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

const contactSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(100),
  email: z.string().email('Format email tidak valid'),
  phone: z.string().max(30).optional(),
  interest: z.string().max(100).optional(),
  message: z.string().min(5, 'Pesan minimal 5 karakter').max(3000),
  locale: z.string().default('id'),
  honeypot: z.string().max(0, 'Spam detected').optional(),
})

export type ContactActionResult = {
  success?: boolean
  error?: string
  fieldErrors?: Record<string, string>
}

export async function submitContactMessage(formData: FormData): Promise<ContactActionResult> {
  try {
    const raw = {
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      phone: String(formData.get('phone') || '').trim() || undefined,
      interest: String(formData.get('interest') || '').trim() || undefined,
      message: String(formData.get('message') || '').trim(),
      locale: String(formData.get('locale') || 'id').trim(),
      honeypot: String(formData.get('company_fax') || ''), // honeypot field
    }

    const parsed = contactSchema.safeParse(raw)
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      for (const err of parsed.error.errors) {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message
        }
      }
      return { fieldErrors }
    }

    // Save message to database
    await prisma.contactMessage.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        interest: parsed.data.interest,
        message: parsed.data.message,
        locale: parsed.data.locale,
      },
    })

    revalidatePath('/admin/messages')
    revalidatePath('/admin')
    return { success: true }
  } catch (e) {
    console.error('submitContactMessage error:', e)
    return { error: 'Terjadi kendala saat mengirim pesan. Silakan coba kembali.' }
  }
}

