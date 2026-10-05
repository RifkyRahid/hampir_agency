'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'

export type ActionResult = { success?: boolean; error?: string }

function slugify(s: string) {
  return (
    s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'project'
  )
}

function revalidateAll(slug?: string) {
  revalidatePath('/admin/portfolio')
  revalidatePath('/admin')
  revalidatePath('/id')
  revalidatePath('/en')
  revalidatePath('/id/portfolio')
  revalidatePath('/en/portfolio')
  if (slug) {
    revalidatePath(`/id/portfolio/${slug}`)
    revalidatePath(`/en/portfolio/${slug}`)
  }
}

function parsePortfolio(formData: FormData) {
  const gallery = (() => {
    try {
      const parsed = JSON.parse(String(formData.get('gallery') || '[]'))
      return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : []
    } catch {
      return [] as string[]
    }
  })()

  const titleId = String(formData.get('titleId') || '').trim()
  const titleEn = String(formData.get('titleEn') || '').trim() || null
  let slug = String(formData.get('slug') || '').trim()
  if (!slug) slug = slugify(titleId)
  else slug = slugify(slug)

  const summaryId = String(formData.get('summaryId') || '').trim()
  const summaryEn = String(formData.get('summaryEn') || '').trim() || null
  const coverUrl = String(formData.get('coverUrl') || '').trim()
  const categoryId = String(formData.get('categoryId') || '').trim()
  const serviceId = String(formData.get('serviceId') || '').trim() || null
  const client = String(formData.get('client') || '').trim() || null
  const year = String(formData.get('year') || '').trim() || null
  const link = String(formData.get('link') || '').trim() || null
  const videoUrl = String(formData.get('videoUrl') || '').trim() || null

  const challengeId = String(formData.get('challengeId') || '').trim() || null
  const challengeEn = String(formData.get('challengeEn') || '').trim() || null
  const solutionId = String(formData.get('solutionId') || '').trim() || null
  const solutionEn = String(formData.get('solutionEn') || '').trim() || null
  const resultId = String(formData.get('resultId') || '').trim() || null
  const resultEn = String(formData.get('resultEn') || '').trim() || null

  const featured = formData.get('featured') === 'on' || formData.get('featured') === 'true'
  const isPublished = formData.get('isPublished') !== 'false'
  const order = parseInt(String(formData.get('order') || '0'), 10) || 0

  return {
    titleId,
    titleEn,
    slug,
    summaryId,
    summaryEn,
    coverUrl,
    gallery,
    categoryId,
    serviceId,
    client,
    year,
    link,
    videoUrl,
    challengeId,
    challengeEn,
    solutionId,
    solutionEn,
    resultId,
    resultEn,
    featured,
    isPublished,
    order,
  }
}

export async function createPortfolio(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin()
    const data = parsePortfolio(formData)

    if (!data.titleId) return { error: 'Judul proyek (ID) wajib diisi.' }
    if (!data.summaryId) return { error: 'Ringkasan proyek (ID) wajib diisi.' }
    if (!data.categoryId) return { error: 'Kategori portofolio wajib dipilih.' }
    if (!data.coverUrl) return { error: 'Foto sampul (Cover) wajib diunggah.' }

    const existing = await prisma.portfolio.findUnique({ where: { slug: data.slug } })
    if (existing) {
      data.slug = `${data.slug}-${Math.random().toString(36).slice(2, 6)}`
    }

    await prisma.portfolio.create({ data })
    revalidateAll(data.slug)
    return { success: true }
  } catch (e: any) {
    console.error('createPortfolio error:', e)
    return { error: e.message || 'Gagal menambahkan proyek portofolio.' }
  }
}

export async function updatePortfolio(id: string, formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin()
    const data = parsePortfolio(formData)

    if (!data.titleId) return { error: 'Judul proyek (ID) wajib diisi.' }
    if (!data.summaryId) return { error: 'Ringkasan proyek (ID) wajib diisi.' }
    if (!data.categoryId) return { error: 'Kategori portofolio wajib dipilih.' }
    if (!data.coverUrl) return { error: 'Foto sampul (Cover) wajib diunggah.' }

    const existing = await prisma.portfolio.findUnique({ where: { slug: data.slug } })
    if (existing && existing.id !== id) {
      data.slug = `${data.slug}-${Math.random().toString(36).slice(2, 6)}`
    }

    await prisma.portfolio.update({ where: { id }, data })
    revalidateAll(data.slug)
    return { success: true }
  } catch (e: any) {
    console.error('updatePortfolio error:', e)
    return { error: e.message || 'Gagal memperbarui proyek portofolio.' }
  }
}

export async function deletePortfolio(id: string): Promise<ActionResult> {
  try {
    await requireAdmin()
    const item = await prisma.portfolio.findUnique({ where: { id }, select: { slug: true } })
    await prisma.portfolio.delete({ where: { id } })
    revalidateAll(item?.slug)
    return { success: true }
  } catch (e: any) {
    console.error('deletePortfolio error:', e)
    return { error: e.message || 'Gagal menghapus proyek portofolio.' }
  }
}

