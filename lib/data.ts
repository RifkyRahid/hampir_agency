import { prisma } from '@/lib/prisma'

export async function getActiveServices() {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    })
    return services.map((s) => ({ id: s.id, title: s.title, description: s.description, icon: s.icon }))
  } catch (e) {
    console.error('getActiveServices error:', e)
    return []
  }
}

export async function getPublicPortfolios() {
  try {
    const portfolios = await prisma.portfolio.findMany({ orderBy: { createdAt: 'desc' } })
    return portfolios.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      description: p.description,
      imageUrl: p.imageUrl,
      link: p.link,
      category: p.category,
    }))
  } catch (e) {
    console.error('getPublicPortfolios error:', e)
    return []
  }
}

export async function getPortfolioBySlug(slug: string) {
  try {
    const p = await prisma.portfolio.findUnique({
      where: { slug },
      include: { service: { select: { title: true } } },
    })
    if (!p) return null
    return {
      id: p.id,
      slug: p.slug,
      title: p.title,
      description: p.description,
      imageUrl: p.imageUrl,
      gallery: p.gallery || [],
      link: p.link,
      category: p.category,
      year: p.year,
      challenge: p.challenge,
      solution: p.solution,
      result: p.result,
      client: p.client,
      team: p.team,
      serviceTitle: p.service?.title ?? null,
    }
  } catch (e) {
    console.error('getPortfolioBySlug error:', e)
    return null
  }
}

export async function getPortfolioNav() {
  try {
    return await prisma.portfolio.findMany({
      orderBy: { createdAt: 'desc' },
      select: { slug: true, title: true },
    })
  } catch (e) {
    console.error('getPortfolioNav error:', e)
    return []
  }
}

export async function getSettings() {
  try {
    const s = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } })
    return { headerLogo: s?.headerLogo ?? null, footerLogo: s?.footerLogo ?? null }
  } catch (e) {
    console.error('getSettings error:', e)
    return { headerLogo: null, footerLogo: null }
  }
}
