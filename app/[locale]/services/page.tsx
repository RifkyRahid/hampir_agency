import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Check, ArrowUpRight, Code2, Palette, Camera, Database, Home, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { isValidLocale, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/get-dictionary'
import { getActiveServices } from '@/lib/data'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import CtaBand from '@/components/home/CtaBand'

export const dynamic = 'force-dynamic'

const iconMap: Record<string, LucideIcon> = {
  code: Code2,
  palette: Palette,
  camera: Camera,
  database: Database,
  home: Home,
}

function getIcon(key: string | null): LucideIcon {
  return iconMap[(key || '').toLowerCase()] || Sparkles
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: rawLocale } = await params
  if (!isValidLocale(rawLocale)) notFound()

  const locale = rawLocale as Locale
  const dict = await getDictionary(locale)
  const services = await getActiveServices(locale)

  return (
    <>
      {/* Header */}
      <section className="pt-20 pb-16 sm:pt-24 sm:pb-20 border-b border-border bg-gradient-to-b from-surface/40 to-background">
        <Container size="default" className="text-center">
          <SectionHeader
            eyebrow={dict.services.eyebrow}
            title={dict.services.title}
            description={dict.services.description}
            className="mb-0"
          />
        </Container>
      </section>

      {/* Services List (Alternating Rows) */}
      <section className="py-20 sm:py-28">
        <Container size="wide" className="flex flex-col gap-20 sm:gap-28">
          {services.map((service, index) => {
            const Icon = getIcon(service.icon)
            const isReversed = index % 2 === 1

            return (
              <div
                key={service.id}
                id={service.slug}
                className={`flex flex-col md:flex-row items-center gap-10 md:gap-16 scroll-mt-24 ${
                  isReversed ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Details side */}
                <div className="flex-1">
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
                    0{index + 1} · {service.slug}
                  </span>
                  <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
                    {service.title}
                  </h2>
                  <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>

                  {service.features.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                        {dict.services.deliverables}
                      </h3>
                      <ul className="flex flex-col gap-3">
                        {service.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-center gap-3 text-sm text-foreground font-medium"
                          >
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                              <Check className="h-3 w-3" />
                            </span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-8">
                    <Link
                      href={`/${locale}/contact?service=${service.slug}`}
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
                    >
                      <span>{dict.services.startProject}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Visual side */}
                <div className="flex-1 w-full">
                  <div className="relative aspect-[4/3] w-full rounded-2xl border border-border bg-surface flex flex-col items-center justify-center p-8 text-center">
                    <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-card text-primary border border-border shadow-sm mb-4">
                      <Icon className="h-10 w-10" strokeWidth={1.8} />
                    </span>
                    <span className="text-lg font-serif font-semibold text-foreground">
                      {service.title}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </Container>
      </section>

      <CtaBand locale={locale} dict={dict.home.cta} />
    </>
  )
}

