'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'

export type ActionResult = { success?: boolean; error?: string }

function revalidateAll() {
  revalidatePath('/admin/services')
  revalidatePath('/admin')
  revalidatePath('/id')
  revalidatePath('/en')
  revalidatePath('/id/services')
  revalidatePath('/en/services')
}

function parseFeatures(val: string): string[] {
  return val
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
}

export async function createService(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin()

    const titleId = String(formData.get('titleId') || '').trim()
    const titleEn = String(formData.get('titleEn') || '').trim() || null
    const slug =
      String(formData.get('slug') || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') ||
      titleId
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')

    const descriptionId = String(formData.get('descriptionId') || '').trim()
    const descriptionEn = String(formData.get('descriptionEn') || '').trim() || null
    const icon = String(formData.get('icon') || '').trim() || 'code'
    const order = parseInt(String(formData.get('order') || '0'), 10) || 0
    const isActive = formData.get('isActive') === 'on' || formData.get('isActive') === 'true'

    const featuresId = parseFeatures(String(formData.get('featuresId') || ''))
    const featuresEn = parseFeatures(String(formData.get('featuresEn') || ''))

    if (!titleId || !descriptionId) {
      return { error: 'Judul dan Deskripsi (ID) wajib diisi.' }
    }

    await prisma.service.create({
      data: {
        slug,
        titleId,
        titleEn,
        descriptionId,
        descriptionEn,
        featuresId,
        featuresEn,
        icon,
        order,
        isActive,
      },
    })

    revalidateAll()
    return { success: true }
  } catch (e: any) {
    console.error('createService error:', e)
    return { error: e.message || 'Gagal menambahkan layanan.' }
  }
}

export async function updateService(id: string, formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin()

    const titleId = String(formData.get('titleId') || '').trim()
    const titleEn = String(formData.get('titleEn') || '').trim() || null
    const slug = String(formData.get('slug') || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')

    const descriptionId = String(formData.get('descriptionId') || '').trim()
    const descriptionEn = String(formData.get('descriptionEn') || '').trim() || null
    const icon = String(formData.get('icon') || '').trim() || 'code'
    const order = parseInt(String(formData.get('order') || '0'), 10) || 0
    const isActive = formData.get('isActive') === 'on' || formData.get('isActive') === 'true'

    const featuresId = parseFeatures(String(formData.get('featuresId') || ''))
    const featuresEn = parseFeatures(String(formData.get('featuresEn') || ''))

    if (!titleId || !descriptionId) {
      return { error: 'Judul dan Deskripsi (ID) wajib diisi.' }
    }

    await prisma.service.update({
      where: { id },
      data: {
        slug,
        titleId,
        titleEn,
        descriptionId,
        descriptionEn,
        featuresId,
        featuresEn,
        icon,
        order,
        isActive,
      },
    })

    revalidateAll()
    return { success: true }
  } catch (e: any) {
    console.error('updateService error:', e)
    return { error: e.message || 'Gagal memperbarui layanan.' }
  }
}

export async function deleteService(id: string): Promise<ActionResult> {
  try {
    await requireAdmin()
    await prisma.service.delete({ where: { id } })
    revalidateAll()
    return { success: true }
  } catch (e: any) {
    console.error('deleteService error:', e)
    return { error: e.message || 'Gagal menghapus layanan.' }
  }
}

