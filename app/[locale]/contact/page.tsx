import { notFound } from 'next/navigation'
import { Mail, MessageCircle, MapPin, Clock } from 'lucide-react'
import { isValidLocale, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/get-dictionary'
import { getSettings } from '@/lib/data'
import { Container } from '@/components/ui/Container'
import ContactForm from '@/components/contact/ContactForm'

export const dynamic = 'force-dynamic'

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ service?: string }>
}) {
  const { locale: rawLocale } = await params
  if (!isValidLocale(rawLocale)) notFound()

  const locale = rawLocale as Locale
  const { service } = await searchParams
  const dict = await getDictionary(locale)
  const settings = await getSettings(locale)

  return (
    <div className="py-16 sm:py-24">
      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-accent mb-3">
                {dict.contact.eyebrow}
              </span>
              <h1 className="text-4xl sm:text-5xl font-semibold leading-[1.08] tracking-tight text-foreground">
                {dict.contact.title}
              </h1>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                {dict.contact.description}
              </p>
            </div>

            {/* Direct Channels */}
            <div className="space-y-4 pt-2">
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-3.5 p-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-surface transition-all"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <span className="text-xs text-muted-foreground block font-medium">Email</span>
                  <span className="text-sm font-semibold text-foreground">{settings.email}</span>
                </div>
              </a>

              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 p-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-surface transition-all"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <MessageCircle className="h-5 w-5" />
                </span>
                <div>
                  <span className="text-xs text-muted-foreground block font-medium">WhatsApp</span>
                  <span className="text-sm font-semibold text-foreground">+{settings.whatsapp}</span>
                </div>
              </a>

              {settings.address && (
                <div className="flex items-start gap-3.5 p-4 rounded-xl border border-border bg-card">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary mt-0.5">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div>
                    <span className="text-xs text-muted-foreground block font-medium">
                      {dict.contact.locationTitle}
                    </span>
                    <span className="text-sm font-semibold text-foreground block">
                      {settings.address}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground mt-1 block">
                      1.0456° N, 104.0305° E
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 px-4 py-2 text-xs text-muted-foreground">
                <Clock className="h-4 w-4 shrink-0" />
                <span>{dict.contact.hours}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7">
            <ContactForm
              locale={locale}
              dict={dict.contact.form}
              initialService={service}
            />
          </div>
        </div>
      </Container>
    </div>
  )
}

