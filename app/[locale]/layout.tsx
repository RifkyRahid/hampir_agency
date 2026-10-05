import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { isValidLocale, locales, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/get-dictionary'
import { getSettings } from '@/lib/data'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isValidLocale(locale)) return {}

  const dict = await getDictionary(locale)
  const isEn = locale === 'en'

  return {
    title: {
      default: isEn
        ? 'Hampir.Agency — Full-Service Digital Agency Batam'
        : 'Hampir.Agency — Agensi Digital Full-Service Batam',
      template: '%s | Hampir.Agency',
    },
    description: dict.home.hero.description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        id: '/id',
        en: '/en',
        'x-default': '/id',
      },
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: rawLocale } = await params
  if (!isValidLocale(rawLocale)) {
    notFound()
  }

  const locale = rawLocale as Locale
  const dict = await getDictionary(locale)
  const settings = await getSettings(locale)

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors">
      <Navbar
        locale={locale}
        dict={dict.nav}
        headerLogoUrl={settings.headerLogoUrl}
      />
      <main className="flex-1">{children}</main>
      <Footer
        locale={locale}
        dict={dict.footer}
        navDict={dict.nav}
        settings={settings}
      />
    </div>
  )
}

