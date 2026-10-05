'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'

export type ActionResult = { success?: boolean; error?: string }

function revalidateAll() {
  revalidatePath('/admin/categories')
  revalidatePath('/admin/portfolio')
  revalidatePath('/id/portfolio')
  revalidatePath('/en/portfolio')
}

export async function createCategory(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin()

    const nameId = String(formData.get('nameId') || '').trim()
    const nameEn = String(formData.get('nameEn') || '').trim() || null
    const slug =
      String(formData.get('slug') || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') ||
      nameId
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')

    const order = parseInt(String(formData.get('order') || '0'), 10) || 0

    if (!nameId) {
      return { error: 'Nama Kategori (ID) wajib diisi.' }
    }

    await prisma.portfolioCategory.create({
      data: { slug, nameId, nameEn, order },
    })

    revalidateAll()
    return { success: true }
  } catch (e: any) {
    console.error('createCategory error:', e)
    return { error: e.message || 'Gagal menambahkan kategori.' }
  }
}

export async function updateCategory(id: string, formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin()

    const nameId = String(formData.get('nameId') || '').trim()
    const nameEn = String(formData.get('nameEn') || '').trim() || null
    const slug = String(formData.get('slug') || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
    const order = parseInt(String(formData.get('order') || '0'), 10) || 0

    if (!nameId) {
      return { error: 'Nama Kategori (ID) wajib diisi.' }
    }

    await prisma.portfolioCategory.update({
      where: { id },
      data: { slug, nameId, nameEn, order },
    })

    revalidateAll()
    return { success: true }
  } catch (e: any) {
    console.error('updateCategory error:', e)
    return { error: e.message || 'Gagal memperbarui kategori.' }
  }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  try {
    await requireAdmin()

    const inUse = await prisma.portfolio.count({ where: { categoryId: id } })
    if (inUse > 0) {
      return {
        error: `Tidak dapat menghapus kategori ini karena masih digunakan oleh ${inUse} proyek portofolio.`,
      }
    }

    await prisma.portfolioCategory.delete({ where: { id } })
    revalidateAll()
    return { success: true }
  } catch (e: any) {
    console.error('deleteCategory error:', e)
    return { error: e.message || 'Gagal menghapus kategori.' }
  }
}

