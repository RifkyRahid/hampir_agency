'use client'

import { usePathname, useRouter } from 'next/navigation'
import type { Locale } from '@/lib/i18n/config'

export function LocaleSwitcher({
  currentLocale,
  className = '',
}: {
  currentLocale: Locale
  className?: string
}) {
  const pathname = usePathname()
  const router = useRouter()

  function switchLocale(nextLocale: Locale) {
    if (nextLocale === currentLocale) return

    // Pathname starts with /{currentLocale}/... or is /{currentLocale}
    const segments = pathname.split('/')
    if (segments[1] === currentLocale) {
      segments[1] = nextLocale
    } else {
      segments.splice(1, 0, nextLocale)
    }
    const nextPath = segments.join('/') || `/${nextLocale}`
    router.push(nextPath)
  }

  return (
    <div
      className={`inline-flex items-center rounded-lg border border-border bg-card p-0.5 text-xs font-medium text-muted-foreground ${className}`}
      role="group"
      aria-label="Pilih bahasa / Select language"
    >
      <button
        type="button"
        onClick={() => switchLocale('id')}
        className={`px-2 py-1 rounded-md transition-colors ${
          currentLocale === 'id'
            ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
            : 'hover:text-foreground'
        }`}
      >
        ID
      </button>
      <button
        type="button"
        onClick={() => switchLocale('en')}
        className={`px-2 py-1 rounded-md transition-colors ${
          currentLocale === 'en'
            ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
            : 'hover:text-foreground'
        }`}
      >
        EN
      </button>
    </div>
  )
}

