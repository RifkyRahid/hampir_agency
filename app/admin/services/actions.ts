'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export type ActionResult = { success?: boolean; error?: string }

function revalidateAll() {
  revalidatePath('/admin/services')
  revalidatePath('/services')
  revalidatePath('/')
}

export async function createService(formData: FormData): Promise<ActionResult> {
  try {
    const title = String(formData.get('title') || '').trim()
    const description = String(formData.get('description') || '').trim()
    const icon = String(formData.get('icon') || '').trim() || null
    const isActive =
      formData.get('isActive') === 'on' || formData.get('isActive') === 'true'

    if (!title || !description) {
      return { error: 'Title and description are required.' }
    }

    await prisma.service.create({
      data: { title, description, icon, isActive },
    })
    revalidateAll()
    return { success: true }
  } catch (e) {
    console.error('createService error:', e)
    return { error: 'Failed to create service. Is the database connected?' }
  }
}

export async function updateService(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    const title = String(formData.get('title') || '').trim()
    const description = String(formData.get('description') || '').trim()
    const icon = String(formData.get('icon') || '').trim() || null
    const isActive =
      formData.get('isActive') === 'on' || formData.get('isActive') === 'true'

    if (!title || !description) {
      return { error: 'Title and description are required.' }
    }

    await prisma.service.update({
      where: { id },
      data: { title, description, icon, isActive },
    })
    revalidateAll()
    return { success: true }
  } catch (e) {
    console.error('updateService error:', e)
    return { error: 'Failed to update service.' }
  }
}

export async function deleteService(id: string): Promise<ActionResult> {
  try {
    await prisma.service.delete({ where: { id } })
    revalidateAll()
    return { success: true }
  } catch (e) {
    console.error('deleteService error:', e)
    return { error: 'Failed to delete service.' }
  }
}
