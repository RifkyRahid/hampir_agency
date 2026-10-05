'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Code2, Palette, Camera, Database, Home, ArrowUpRight, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/get-dictionary'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'

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

export default function BentoServices({
  services,
  locale,
  dict,
}: {
  services: Array<{
    id: string
    slug: string
    title: string
    description: string
    features: string[]
    icon: string | null
  }>
  locale: Locale
  dict: Dictionary['home']['services']
}) {
  const spans = ['md:col-span-2', 'md:col-span-1', 'md:col-span-1', 'md:col-span-2']

  return (
    <section className="py-20 sm:py-28 border-b border-border bg-surface/30">
      <Container size="wide">
        <SectionHeader
          eyebrow={dict.eyebrow}
          title={dict.title}
          description={dict.description}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {services.map((service, index) => {
            const Icon = getIcon(service.icon)
            const spanClass = spans[index % spans.length]

            return (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`group flex flex-col justify-between rounded-2xl border border-border bg-card p-7 sm:p-8 hover:border-primary/40 hover:shadow-md transition-all ${spanClass}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-6 w-6" strokeWidth={1.8} />
                    </span>
                    <span className="text-xs font-mono text-muted-foreground group-hover:text-primary transition-colors">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>

                  {service.features.length > 0 && (
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {service.features.slice(0, 3).map((f) => (
                        <li
                          key={f}
                          className="rounded-md border border-border/80 bg-surface px-2.5 py-1 text-xs text-muted-foreground"
                        >
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mt-8 pt-4 border-t border-border/60 flex items-center justify-between">
                  <Link
                    href={`/${locale}/services#${service.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:underline"
                  >
                    <span>{dict.viewAll}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </motion.article>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

