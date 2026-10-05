import { prisma } from '@/lib/prisma'
import ServicesManager from '@/components/admin/ServicesManager'

export const dynamic = 'force-dynamic'

async function getServices() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: 'asc' },
    })
    return services.map((s) => ({
      id: s.id,
      slug: s.slug,
      titleId: s.titleId,
      titleEn: s.titleEn,
      descriptionId: s.descriptionId,
      descriptionEn: s.descriptionEn,
      featuresId: s.featuresId,
      featuresEn: s.featuresEn,
      icon: s.icon,
      order: s.order,
      isActive: s.isActive,
      createdAt: s.createdAt.toISOString(),
    }))
  } catch (e) {
    console.error('getServices error:', e)
    return []
  }
}

export default async function AdminServicesPage() {
  const services = await getServices()
  return <ServicesManager services={services} />
}

