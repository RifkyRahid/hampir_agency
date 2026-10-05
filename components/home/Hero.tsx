'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/get-dictionary'
import { Container } from '@/components/ui/Container'

export default function Hero({
  locale,
  dict,
}: {
  locale: Locale
  dict: Dictionary['home']['hero']
}) {
  return (
    <section className="relative pt-20 pb-20 sm:pt-28 sm:pb-24 border-b border-border bg-gradient-to-b from-surface/40 to-background">
      <Container size="default" className="text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1 text-xs font-semibold text-accent shadow-xs"
        >
          <span>{dict.eyebrow}</span>
        </motion.div>

        {/* H1 Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 text-4xl sm:text-6xl lg:text-7xl font-semibold leading-[1.08] tracking-tight text-foreground"
        >
          {dict.title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 max-w-2xl mx-auto text-base sm:text-xl text-muted-foreground leading-relaxed"
        >
          {dict.description}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            href={`/${locale}/contact`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
          >
            {dict.startProject}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            href={`/${locale}/portfolio`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-7 py-3 text-sm font-semibold text-foreground hover:bg-surface hover:text-primary transition-colors"
          >
            {dict.viewWork}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </Container>
    </section>
  )
}

