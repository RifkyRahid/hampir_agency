import { prisma } from '@/lib/prisma'
import CategoriesManager from '@/components/admin/CategoriesManager'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
  const categories = await prisma.portfolioCategory.findMany({
    orderBy: { order: 'asc' },
    include: {
      _count: {
        select: { portfolios: true },
      },
    },
  })

  return <CategoriesManager categories={categories} />
}

