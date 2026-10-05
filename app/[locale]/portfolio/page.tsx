import { notFound } from 'next/navigation'
import { isValidLocale, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/get-dictionary'
import { getPublicPortfolios, getCategories } from '@/lib/data'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import PortfolioGallery from '@/components/portfolio/PortfolioGallery'
import CtaBand from '@/components/home/CtaBand'

export const dynamic = 'force-dynamic'

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: rawLocale } = await params
  if (!isValidLocale(rawLocale)) notFound()

  const locale = rawLocale as Locale
  const dict = await getDictionary(locale)
  const [portfolios, categories] = await Promise.all([
    getPublicPortfolios(locale),
    getCategories(locale),
  ])

  return (
    <>
      {/* Header */}
      <section className="pt-20 pb-16 sm:pt-24 sm:pb-20 border-b border-border bg-gradient-to-b from-surface/40 to-background">
        <Container size="default" className="text-center">
          <SectionHeader
            eyebrow={dict.portfolio.eyebrow}
            title={dict.portfolio.title}
            description={dict.portfolio.description}
            className="mb-0"
          />
        </Container>
      </section>

      {/* Gallery Section */}
      <section className="py-16 sm:py-24">
        <Container size="wide">
          <PortfolioGallery
            projects={portfolios}
            categories={categories}
            locale={locale}
            dict={dict.portfolio}
          />
        </Container>
      </section>

      <CtaBand locale={locale} dict={dict.home.cta} />
    </>
  )
}

