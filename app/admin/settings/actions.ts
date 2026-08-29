'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export type ActionResult = { success?: boolean; error?: string }

export async function saveLogo(
  kind: 'header' | 'footer',
  url: string | null
): Promise<ActionResult> {
  try {
    const data = kind === 'header' ? { headerLogo: url } : { footerLogo: url }
    await prisma.siteSettings.upsert({
      where: { id: 'singleton' },
      update: data,
      create: { id: 'singleton', ...data },
    })
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (e) {
    console.error('saveLogo error:', e)
    return { error: 'Failed to save logo. Is the database connected?' }
  }
}
