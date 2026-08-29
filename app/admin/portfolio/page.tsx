import { prisma } from '@/lib/prisma'
import PortfolioManager from '@/components/admin/PortfolioManager'

export const dynamic = 'force-dynamic'

async function getData() {
  try {
    const [portfolios, services] = await Promise.all([
      prisma.portfolio.findMany({
        orderBy: { createdAt: 'desc' },
        include: { service: { select: { title: true } } },
      }),
      prisma.service.findMany({ orderBy: { title: 'asc' }, select: { id: true, title: true } }),
    ])
    return {
      portfolios: portfolios.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
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
        serviceId: p.serviceId,
        serviceTitle: p.service?.title ?? null,
        createdAt: p.createdAt.toISOString(),
      })),
      services,
    }
  } catch (e) {
    console.error('getData (portfolio) error:', e)
    return { portfolios: [], services: [] as { id: string; title: string }[] }
  }
}

export default async function AdminPortfolioPage() {
  const { portfolios, services } = await getData()
  return <PortfolioManager portfolios={portfolios} services={services} />
}
