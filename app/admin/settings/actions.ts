'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'

export type ActionResult = { success?: boolean; error?: string }

function revalidateAll() {
  revalidatePath('/admin/settings')
  revalidatePath('/id')
  revalidatePath('/en')
  revalidatePath('/id/contact')
  revalidatePath('/en/contact')
  revalidatePath('/', 'layout')
}

export async function saveSiteSettings(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin()

    const headerLogoUrl = String(formData.get('headerLogoUrl') || '').trim() || null
    const footerLogoUrl = String(formData.get('footerLogoUrl') || '').trim() || null
    const email = String(formData.get('email') || '').trim() || 'hampiragency@gmail.com'
    const whatsapp = String(formData.get('whatsapp') || '').trim() || '6281234567890'
    const address = String(formData.get('address') || '').trim() || null
    const instagram = String(formData.get('instagram') || '').trim() || null
    const linkedin = String(formData.get('linkedin') || '').trim() || null
    const github = String(formData.get('github') || '').trim() || null

    await prisma.siteSettings.upsert({
      where: { id: 'singleton' },
      update: {
        headerLogoUrl,
        footerLogoUrl,
        email,
        whatsapp,
        address,
        instagram,
        linkedin,
        github,
      },
      create: {
        id: 'singleton',
        headerLogoUrl,
        footerLogoUrl,
        email,
        whatsapp,
        address,
        instagram,
        linkedin,
        github,
      },
    })

    revalidateAll()
    return { success: true }
  } catch (e: any) {
    console.error('saveSiteSettings error:', e)
    return { error: e.message || 'Gagal menyimpan pengaturan website.' }
  }
}

