'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export type ActionResult = { success?: boolean; error?: string }

export async function markAsRead(
  id: string,
  isRead: boolean
): Promise<ActionResult> {
  try {
    await prisma.contactMessage.update({
      where: { id },
      data: { isRead },
    })
    revalidatePath('/admin/messages')
    revalidatePath('/admin')
    return { success: true }
  } catch (e) {
    console.error('markAsRead error:', e)
    return { error: 'Failed to update message.' }
  }
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  try {
    await prisma.contactMessage.delete({ where: { id } })
    revalidatePath('/admin/messages')
    revalidatePath('/admin')
    return { success: true }
  } catch (e) {
    console.error('deleteMessage error:', e)
    return { error: 'Failed to delete message.' }
  }
}
