import { prisma } from '@/lib/prisma'
import PortfolioManager from '@/components/admin/PortfolioManager'

export const dynamic = 'force-dynamic'

export default async function AdminPortfolioPage() {
  const [portfolios, categories, services] = await Promise.all([
    prisma.portfolio.findMany({
      orderBy: { order: 'asc' },
      include: {
        category: {
          select: { id: true, nameId: true },
        },
        service: {
          select: { id: true, titleId: true },
        },
      },
    }),
    prisma.portfolioCategory.findMany({
      orderBy: { order: 'asc' },
      select: { id: true, nameId: true },
    }),
    prisma.service.findMany({
      orderBy: { order: 'asc' },
      select: { id: true, titleId: true },
    }),
  ])

  return (
    <PortfolioManager
      portfolios={portfolios.map((p) => ({
        ...p,
        categoryName: p.category.nameId,
        serviceTitle: p.service?.titleId || null,
        createdAt: p.createdAt.toISOString(),
      }))}
      categories={categories}
      services={services}
    />
  )
}

