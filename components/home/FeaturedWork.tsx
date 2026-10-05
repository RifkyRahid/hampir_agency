'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/get-dictionary'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'

export default function FeaturedWork({
  projects,
  locale,
  dict,
}: {
  projects: Array<{
    id: string
    slug: string
    title: string
    summary: string
    coverUrl: string
    year: string | null
    categoryName: string
    categorySlug: string
  }>
  locale: Locale
  dict: Dictionary['home']['featured']
}) {
  return (
    <section className="py-20 sm:py-28 border-b border-border bg-background">
      <Container size="wide">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 sm:mb-16">
          <SectionHeader
            eyebrow={dict.eyebrow}
            title={dict.title}
            description={dict.description}
            align="left"
            className="mb-0"
          />
          <Link
            href={`/${locale}/portfolio`}
            className="hidden md:inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-xs font-semibold text-foreground hover:bg-surface hover:text-primary transition-colors shrink-0"
          >
            {dict.viewAll}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, idx) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/40 hover:shadow-md transition-all"
            >
              {/* 16:9 Image container */}
              <Link href={`/${locale}/portfolio/${project.slug}`} className="block relative aspect-[16/9] w-full overflow-hidden bg-surface">
                <Image
                  src={project.coverUrl}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-103"
                />
                <span className="absolute top-4 left-4 rounded-md bg-background/90 backdrop-blur-xs px-2.5 py-1 text-xs font-medium text-foreground border border-border/80">
                  {project.categoryName}
                </span>
              </Link>

              {/* Text content */}
              <div className="p-6 sm:p-7 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span className="font-mono">{project.year || '2025'}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    <Link href={`/${locale}/portfolio/${project.slug}`}>
                      {project.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {project.summary}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                  <Link
                    href={`/${locale}/portfolio/${project.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:underline"
                  >
                    <span>Pelajari Studi Kasus</span>
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Link
            href={`/${locale}/portfolio`}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-surface transition-colors"
          >
            {dict.viewAll}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  )
}

