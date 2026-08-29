import { prisma } from '@/lib/prisma'
import ServicesManager from '@/components/admin/ServicesManager'

export const dynamic = 'force-dynamic'

async function getServices() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return services.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      icon: s.icon,
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
