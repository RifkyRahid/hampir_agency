'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

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
  revalidatePath('/portfolio')
  revalidatePath('/')
  if (slug) revalidatePath(`/portfolio/${slug}`)
}

function parsePortfolio(formData: FormData) {
  const g = (() => {
    try {
      const parsed = JSON.parse(String(formData.get('gallery') || '[]'))
      return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : []
    } catch {
      return [] as string[]
    }
  })()
  const title = String(formData.get('title') || '').trim()
  let slug = String(formData.get('slug') || '').trim()
  if (!slug) slug = slugify(title)
  else slug = slugify(slug)
  return {
    title,
    slug,
    description: String(formData.get('description') || '').trim(),
    imageUrl: String(formData.get('imageUrl') || '').trim(),
    gallery: g,
    link: String(formData.get('link') || '').trim() || null,
    category: String(formData.get('category') || '').trim(),
    year: String(formData.get('year') || '').trim() || null,
    challenge: String(formData.get('challenge') || '').trim() || null,
    solution: String(formData.get('solution') || '').trim() || null,
    result: String(formData.get('result') || '').trim() || null,
    client: String(formData.get('client') || '').trim() || null,
    team: String(formData.get('team') || '').trim() || null,
    serviceId: String(formData.get('serviceId') || '').trim() || null,
  }
}

export async function createPortfolio(formData: FormData): Promise<ActionResult> {
  try {
    const data = parsePortfolio(formData)
    if (!data.title || !data.description || !data.category || !data.imageUrl) {
      return { error: 'Title, description, category and a cover image are required.' }
    }
    const existing = await prisma.portfolio.findUnique({ where: { slug: data.slug } })
    if (existing) data.slug = `${data.slug}-${Math.random().toString(36).slice(2, 6)}`
    await prisma.portfolio.create({ data })
    revalidateAll(data.slug)
    return { success: true }
  } catch (e) {
    console.error('createPortfolio error:', e)
    return { error: 'Failed to create portfolio. Is the database connected?' }
  }
}

export async function updatePortfolio(id: string, formData: FormData): Promise<ActionResult> {
  try {
    const data = parsePortfolio(formData)
    if (!data.title || !data.description || !data.category || !data.imageUrl) {
      return { error: 'Title, description, category and a cover image are required.' }
    }
    const existing = await prisma.portfolio.findUnique({ where: { slug: data.slug } })
    if (existing && existing.id !== id) {
      data.slug = `${data.slug}-${Math.random().toString(36).slice(2, 6)}`
    }
    await prisma.portfolio.update({ where: { id }, data })
    revalidateAll(data.slug)
    return { success: true }
  } catch (e) {
    console.error('updatePortfolio error:', e)
    return { error: 'Failed to update portfolio.' }
  }
}

export async function deletePortfolio(id: string): Promise<ActionResult> {
  try {
    await prisma.portfolio.delete({ where: { id } })
    revalidateAll()
    return { success: true }
  } catch (e) {
    console.error('deletePortfolio error:', e)
    return { error: 'Failed to delete portfolio.' }
  }
}
