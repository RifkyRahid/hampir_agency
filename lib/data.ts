import { prisma } from '@/lib/prisma'
import type { Locale } from '@/lib/i18n/config'

function pick<T extends Record<string, any>>(obj: T, key: string, locale: Locale): string {
  if (locale === 'en' && obj[`${key}En`]) {
    return obj[`${key}En`]
  }
  return obj[`${key}Id`] || obj[`${key}En`] || ''
}

function pickList<T extends Record<string, any>>(obj: T, key: string, locale: Locale): string[] {
  if (locale === 'en' && Array.isArray(obj[`${key}En`]) && obj[`${key}En`].length > 0) {
    return obj[`${key}En`]
  }
  return Array.isArray(obj[`${key}Id`]) ? obj[`${key}Id`] : []
}

export async function getActiveServices(locale: Locale = 'id') {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })
    return services.map((s) => ({
      id: s.id,
      slug: s.slug,
      title: pick(s, 'title', locale),
      description: pick(s, 'description', locale),
      features: pickList(s, 'features', locale),
      icon: s.icon,
    }))
  } catch (e) {
    console.error('getActiveServices error:', e)
    return []
  }
}

export async function getCategories(locale: Locale = 'id') {
  try {
    const categories = await prisma.portfolioCategory.findMany({
      orderBy: { order: 'asc' },
    })
    return categories.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: pick(c, 'name', locale),
    }))
  } catch (e) {
    console.error('getCategories error:', e)
    return []
  }
}

export async function getPublicPortfolios(locale: Locale = 'id', categorySlug?: string) {
  try {
    const where: any = { isPublished: true }
    if (categorySlug && categorySlug !== 'all') {
      where.category = { slug: categorySlug }
    }

    const portfolios = await prisma.portfolio.findMany({
      where,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      include: {
        category: true,
        service: true,
      },
    })

    return portfolios.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: pick(p, 'title', locale),
      summary: pick(p, 'summary', locale),
      coverUrl: p.coverUrl,
      videoUrl: p.videoUrl,
      year: p.year,
      client: p.client,
      teamNote: p.teamNote,
      categoryName: pick(p.category, 'name', locale),
      categorySlug: p.category.slug,
      serviceTitle: p.service ? pick(p.service, 'title', locale) : null,
    }))
  } catch (e) {
    console.error('getPublicPortfolios error:', e)
    return []
  }
}

export async function getFeaturedPortfolios(locale: Locale = 'id') {
  try {
    const portfolios = await prisma.portfolio.findMany({
      where: { isPublished: true, featured: true },
      orderBy: { order: 'asc' },
      take: 4,
      include: {
        category: true,
      },
    })

    return portfolios.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: pick(p, 'title', locale),
      summary: pick(p, 'summary', locale),
      coverUrl: p.coverUrl,
      year: p.year,
      categoryName: pick(p.category, 'name', locale),
      categorySlug: p.category.slug,
    }))
  } catch (e) {
    console.error('getFeaturedPortfolios error:', e)
    return []
  }
}

export async function getPortfolioBySlug(slug: string, locale: Locale = 'id') {
  try {
    const p = await prisma.portfolio.findUnique({
      where: { slug },
      include: {
        category: true,
        service: true,
      },
    })
    if (!p) return null

    return {
      id: p.id,
      slug: p.slug,
      title: pick(p, 'title', locale),
      summary: pick(p, 'summary', locale),
      challenge: pick(p, 'challenge', locale),
      solution: pick(p, 'solution', locale),
      result: pick(p, 'result', locale),
      coverUrl: p.coverUrl,
      videoUrl: p.videoUrl,
      gallery: p.gallery || [],
      link: p.link,
      client: p.client,
      year: p.year,
      teamNote: p.teamNote,
      categoryName: pick(p.category, 'name', locale),
      categorySlug: p.category.slug,
      serviceTitle: p.service ? pick(p.service, 'title', locale) : null,
    }
  } catch (e) {
    console.error('getPortfolioBySlug error:', e)
    return null
  }
}

export async function getPortfolioNav(locale: Locale = 'id') {
  try {
    const items = await prisma.portfolio.findMany({
      where: { isPublished: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      select: { slug: true, titleId: true, titleEn: true },
    })
    return items.map((p) => ({
      slug: p.slug,
      title: pick(p, 'title', locale),
    }))
  } catch (e) {
    console.error('getPortfolioNav error:', e)
    return []
  }
}

export async function getTeamMembers(locale: Locale = 'id') {
  try {
    const team = await prisma.teamMember.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    })
    return team.map((t) => ({
      id: t.id,
      name: t.name,
      role: pick(t, 'role', locale),
      bio: pick(t, 'bio', locale),
      skills: t.skills,
      photoUrl: t.photoUrl,
    }))
  } catch (e) {
    console.error('getTeamMembers error:', e)
    return []
  }
}

export async function getSettings(locale: Locale = 'id') {
  try {
    const s = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } })
    let stats: Array<{ value: string; label: string }> = []
    if (s?.statsJson && Array.isArray(s.statsJson)) {
      stats = (s.statsJson as any[]).map((item) => ({
        value: item.value,
        label: locale === 'en' ? item.labelEn || item.labelId : item.labelId,
      }))
    }

    return {
      headerLogoUrl: s?.headerLogoUrl ?? null,
      footerLogoUrl: s?.footerLogoUrl ?? null,
      email: s?.email ?? 'hampiragency@gmail.com',
      whatsapp: s?.whatsapp ?? '6281234567890',
      address: s?.address ?? 'Batam, Indonesia',
      latitude: s?.latitude ?? 1.0456,
      longitude: s?.longitude ?? 104.0305,
      instagram: s?.instagram ?? null,
      linkedin: s?.linkedin ?? null,
      github: s?.github ?? null,
      twitter: s?.twitter ?? null,
      stats,
    }
  } catch (e) {
    console.error('getSettings error:', e)
    return {
      headerLogoUrl: null,
      footerLogoUrl: null,
      email: 'hampiragency@gmail.com',
      whatsapp: '6281234567890',
      address: 'Batam, Indonesia',
      latitude: 1.0456,
      longitude: 104.0305,
      instagram: null,
      linkedin: null,
      github: null,
      twitter: null,
      stats: [],
    }
  }
}

