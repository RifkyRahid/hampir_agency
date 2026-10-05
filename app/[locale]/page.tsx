import { notFound } from 'next/navigation'
import { isValidLocale, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/get-dictionary'
import { getActiveServices, getFeaturedPortfolios } from '@/lib/data'
import Hero from '@/components/home/Hero'
import TrustStrip from '@/components/home/TrustStrip'
import BentoServices from '@/components/home/BentoServices'
import FeaturedWork from '@/components/home/FeaturedWork'
import ProcessSection from '@/components/home/ProcessSection'
import CtaBand from '@/components/home/CtaBand'

export const dynamic = 'force-dynamic'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: rawLocale } = await params
  if (!isValidLocale(rawLocale)) notFound()

  const locale = rawLocale as Locale
  const dict = await getDictionary(locale)
  const [services, featuredProjects] = await Promise.all([
    getActiveServices(locale),
    getFeaturedPortfolios(locale),
  ])

  return (
    <>
      <Hero locale={locale} dict={dict.home.hero} />
      <TrustStrip dict={dict.home.trust} />
      <BentoServices services={services} locale={locale} dict={dict.home.services} />
      {featuredProjects.length > 0 && (
        <FeaturedWork projects={featuredProjects} locale={locale} dict={dict.home.featured} />
      )}
      <ProcessSection dict={dict.home.process} />
      <CtaBand locale={locale} dict={dict.home.cta} />
    </>
  )
}

