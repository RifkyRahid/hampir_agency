import Link from 'next/link'
import Image from 'next/image'
import { Github, Twitter, Instagram, Linkedin, Mail, MessageCircle, MapPin } from 'lucide-react'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/get-dictionary'
import { Container } from '@/components/ui/Container'

export default function Footer({
  locale,
  dict,
  navDict,
  settings,
}: {
  locale: Locale
  dict: Dictionary['footer']
  navDict: Dictionary['nav']
  settings: {
    footerLogoUrl?: string | null
    email: string
    whatsapp: string
    address?: string | null
    instagram?: string | null
    linkedin?: string | null
    github?: string | null
    twitter?: string | null
  }
}) {
  const footerLinks = [
    { label: navDict.home, href: `/${locale}` },
    { label: navDict.services, href: `/${locale}/services` },
    { label: navDict.portfolio, href: `/${locale}/portfolio` },
    { label: navDict.about, href: `/${locale}/about` },
    { label: navDict.contact, href: `/${locale}/contact` },
  ]

  const socials = [
    { icon: Instagram, href: settings.instagram || 'https://instagram.com/hampiragency', label: 'Instagram' },
    { icon: Linkedin, href: settings.linkedin || 'https://linkedin.com/company/hampiragency', label: 'LinkedIn' },
    { icon: Github, href: settings.github || 'https://github.com/hampiragency', label: 'GitHub' },
    { icon: Twitter, href: settings.twitter || '#', label: 'Twitter' },
  ].filter((s) => s.href !== '#')

  return (
    <footer className="mt-28 border-t border-border bg-surface/50 text-foreground transition-colors">
      <Container size="wide" className="py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 lg:gap-16">
          {/* Brand info */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <Link href={`/${locale}`} className="inline-block">
              {settings.footerLogoUrl ? (
                <span className="relative block h-8 w-[140px]">
                  <Image
                    src={settings.footerLogoUrl}
                    alt="Hampir.Agency"
                    fill
                    sizes="140px"
                    className="object-contain object-left"
                  />
                </span>
              ) : (
                <span className="text-xl font-serif font-bold tracking-tight text-foreground">
                  Hampir<span className="text-primary font-sans font-bold">.</span>Agency
                </span>
              )}
            </Link>
            <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
              {dict.tagline}
            </p>
            <div className="flex items-center gap-3 pt-2">
              {socials.map((s) => {
                const Icon = s.icon
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              {dict.navigation}
            </h3>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              {dict.contact}
            </h3>
            <a
              href={`mailto:${settings.email}`}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="h-4 w-4 text-primary shrink-0" />
              <span>{settings.email}</span>
            </a>
            <a
              href={`https://wa.me/${settings.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <MessageCircle className="h-4 w-4 text-primary shrink-0" />
              <span>+{settings.whatsapp} (WhatsApp)</span>
            </a>
            {settings.address && (
              <p className="inline-flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Hampir.Agency. {dict.rights}
          </p>
          <p className="font-mono text-xs">
            1.0456° N, 104.0305° E · {dict.cityNote}
          </p>
        </div>
      </Container>
    </footer>
  )
}

