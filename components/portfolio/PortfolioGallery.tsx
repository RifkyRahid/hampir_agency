'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Play } from 'lucide-react'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/get-dictionary'

export default function PortfolioGallery({
  projects,
  categories,
  locale,
  dict,
}: {
  projects: Array<{
    id: string
    slug: string
    title: string
    summary: string
    coverUrl: string
    videoUrl?: string | null
    year: string | null
    categoryName: string
    categorySlug: string
  }>
  categories: Array<{ id: string; slug: string; name: string }>
  locale: Locale
  dict: Dictionary['portfolio']
}) {
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const filtered =
    activeCategory === 'all'
      ? projects
      : projects.filter((p) => p.categorySlug === activeCategory)

  return (
    <div>
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={`rounded-full px-4.5 py-1.5 text-xs font-semibold transition-all ${
            activeCategory === 'all'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-surface'
          }`}
        >
          {dict.all}
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActiveCategory(c.slug)}
            className={`rounded-full px-4.5 py-1.5 text-xs font-semibold transition-all ${
              activeCategory === c.slug
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-surface'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
          {dict.empty}
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
        >
          <AnimatePresence>
            {filtered.map((project) => (
              <motion.article
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/40 hover:shadow-md transition-all"
              >
                {/* 16:9 Cover Image */}
                <Link
                  href={`/${locale}/portfolio/${project.slug}`}
                  className="block relative aspect-[16/9] w-full overflow-hidden bg-surface"
                >
                  <Image
                    src={project.coverUrl}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-103"
                  />
                  <span className="absolute top-3.5 left-3.5 rounded-md bg-background/90 backdrop-blur-xs px-2.5 py-1 text-xs font-medium text-foreground border border-border/80">
                    {project.categoryName}
                  </span>
                  {project.videoUrl && (
                    <span className="absolute top-3.5 right-3.5 flex items-center gap-1 rounded-md bg-background/90 backdrop-blur-xs px-2.5 py-1 text-xs font-medium text-foreground border border-border/80 shadow-xs">
                      <Play className="h-3 w-3 fill-primary text-primary" />
                      <span>Video</span>
                    </span>
                  )}
                </Link>

                {/* Content */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5 font-mono">
                      <span>{project.year || '2025'}</span>
                    </div>
                    <h3 className="text-xl font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
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
                      <span>{dict.viewCaseStudy}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}

