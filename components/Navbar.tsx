'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/get-dictionary'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { LocaleSwitcher } from '@/components/layout/LocaleSwitcher'
import { Container } from '@/components/ui/Container'

function Logo({ headerLogoUrl }: { headerLogoUrl?: string | null }) {
  if (headerLogoUrl) {
    return (
      <span className="relative block h-8 w-[140px]">
        <Image
          src={headerLogoUrl}
          alt="Hampir.Agency"
          fill
          sizes="140px"
          className="object-contain object-left"
          priority
        />
      </span>
    )
  }
  return (
    <span className="text-xl font-serif font-bold tracking-tight text-foreground">
      Hampir<span className="text-primary font-sans font-bold">.</span>Agency
    </span>
  )
}

export default function Navbar({
  locale,
  dict,
  headerLogoUrl,
}: {
  locale: Locale
  dict: Dictionary['nav']
  headerLogoUrl?: string | null
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const navLinks = [
    { label: dict.home, href: `/${locale}` },
    { label: dict.services, href: `/${locale}/services` },
    { label: dict.portfolio, href: `/${locale}/portfolio` },
    { label: dict.about, href: `/${locale}/about` },
    { label: dict.contact, href: `/${locale}/contact` },
  ]

  const isActive = (href: string) => {
    if (href === `/${locale}`) return pathname === `/${locale}`
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm transition-colors">
      <Container size="wide">
        <div className="flex h-18 items-center justify-between py-3">
          {/* Brand Logo */}
          <Link href={`/${locale}`} className="group flex items-center gap-2 focus-visible:outline-none">
            <Logo headerLogoUrl={headerLogoUrl} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    active
                      ? 'text-primary font-semibold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-surface'
                  }`}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="navbar-active-indicator"
                      className="absolute inset-x-3 -bottom-[19px] h-0.5 bg-primary"
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Actions: Theme Toggle, Locale Switcher, and Contact CTA */}
          <div className="hidden md:flex items-center gap-3">
            <LocaleSwitcher currentLocale={locale} />
            <ThemeToggle />
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4.5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {dict.letsTalk}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              type="button"
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border bg-background md:hidden"
          >
            <div className="container py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'bg-primary-soft text-primary font-semibold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-surface'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Bahasa / Language</span>
                <LocaleSwitcher currentLocale={locale} />
              </div>

              <Link
                href={`/${locale}/contact`}
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                {dict.letsTalk}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

