import PortfolioGallery from '@/components/public/PortfolioGallery'
import { getPublicPortfolios } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function PortfolioPage() {
  const projects = await getPublicPortfolios()
  return <PortfolioGallery dbProjects={projects} />
}
