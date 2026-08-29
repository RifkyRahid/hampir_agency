import Hero from '@/components/home/Hero'
import BentoServices from '@/components/home/BentoServices'
import { getActiveServices } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const services = await getActiveServices()
  return (
    <>
      <Hero />
      <BentoServices dbServices={services} />
    </>
  )
}
