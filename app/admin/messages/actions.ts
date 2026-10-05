'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'

export type ActionResult = { success?: boolean; error?: string }

export async function markAsRead(id: string, isRead: boolean): Promise<ActionResult> {
  try {
    await requireAdmin()
    await prisma.contactMessage.update({
      where: { id },
      data: { isRead },
    })
    revalidatePath('/admin/messages')
    revalidatePath('/admin')
    return { success: true }
  } catch (e: any) {
    console.error('markAsRead error:', e)
    return { error: e.message || 'Gagal mengubah status pesan.' }
  }
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  try {
    await requireAdmin()
    await prisma.contactMessage.delete({ where: { id } })
    revalidatePath('/admin/messages')
    revalidatePath('/admin')
    return { success: true }
  } catch (e: any) {
    console.error('deleteMessage error:', e)
    return { error: e.message || 'Gagal menghapus pesan.' }
  }
}

