import ServicesSections from '@/components/public/ServicesSections'
import { getActiveServices } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function ServicesPage() {
  const services = await getActiveServices()
  return <ServicesSections dbServices={services} />
}
