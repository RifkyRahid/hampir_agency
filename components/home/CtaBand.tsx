import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/get-dictionary'
import { Container } from '@/components/ui/Container'

export default function CtaBand({
  locale,
  dict,
}: {
  locale: Locale
  dict: Dictionary['home']['cta']
}) {
  return (
    <section className="py-20 sm:py-24 bg-primary text-primary-foreground">
      <Container size="default" className="text-center">
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white">
          {dict.title}
        </h2>
        <p className="mt-5 max-w-xl mx-auto text-base sm:text-lg text-white/85 leading-relaxed">
          {dict.description}
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-primary hover:bg-white/90 transition-colors shadow-md"
          >
            {dict.button}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  )
}

