'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Code2, Palette, Camera, Sparkles, ArrowUpRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type DbProject = {
  id: string
  slug: string
  title: string
  description: string
  imageUrl: string
  link: string | null
  category: string
}

type Display = {
  id: string
  slug: string
  title: string
  description: string
  category: string
  imageUrl: string
  tags?: string[]
  aspect: string
  icon: LucideIcon
}

function iconForCategory(category: string): LucideIcon {
  const c = category.toLowerCase()
  if (c === 'web') return Code2
  if (c === 'design') return Palette
  if (c === 'video') return Camera
  return Sparkles
}
function hasImage(url: string) {
  return !!url && (url.startsWith('/uploads') || url.startsWith('http'))
}
const aspects = ['aspect-[4/5]', 'aspect-[4/3]', 'aspect-[4/3]', 'aspect-[4/5]']

const mock: Display[] = [
  { id: 'mecca-madina', slug: 'mecca-madina', title: 'Mecca Madina Auto Syariah', description: 'Used car catalog with custom CMS & Map integrations.', category: 'Web', imageUrl: '', tags: ['Next.js', 'Nginx'], aspect: 'aspect-[4/5]', icon: Code2 },
  { id: 'ram-hrms', slug: 'ram-hrms', title: 'RAM Showroom HRMS', description: 'Internal employee management system & dashboard.', category: 'Web', imageUrl: '', tags: ['Next.js', 'PostgreSQL'], aspect: 'aspect-[4/3]', icon: Code2 },
  { id: 'fintech-rebrand', slug: 'fintech-rebrand', title: 'Fintech App Rebranding', description: 'Complete visual identity and UI overhaul.', category: 'Design', imageUrl: '', tags: ['Branding', 'UI/UX'], aspect: 'aspect-[4/3]', icon: Palette },
  { id: 'urban-lifestyle', slug: 'urban-lifestyle', title: 'Urban Lifestyle Campaign', description: 'Commercial video shoot and editing.', category: 'Video', imageUrl: '', tags: ['Production', 'Editing'], aspect: 'aspect-[4/5]', icon: Camera },
]

const filters = ['All', 'Web', 'Design', 'Video'] as const
type Filter = (typeof filters)[number]

export default function PortfolioGallery({ dbProjects }: { dbProjects?: DbProject[] }) {
  const projects: Display[] =
    dbProjects && dbProjects.length > 0
      ? dbProjects.map((p, i) => ({ id: p.id, slug: p.slug, title: p.title, description: p.description, category: p.category, imageUrl: p.imageUrl, aspect: aspects[i % aspects.length], icon: iconForCategory(p.category) }))
      : mock

  const [active, setActive] = useState<Filter>('All')
  const filtered = active === 'All' ? projects : projects.filter((p) => p.category === active)

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10"><div className="absolute left-1/2 top-0 h-[320px] w-[700px] -translate-x-1/2 rounded-full bg-primary/15 blur-[130px]" /></div>

      <div className="container pt-24 text-center sm:pt-28">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}>
          <span className="inline-flex items-center rounded-full border border-border/70 bg-card/50 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur-md">Our Work</span>
          <h1 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-6xl">Case studies & <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">selected work</span></h1>
          <p className="mx-auto mt-6 max-w-xl text-balance text-muted-foreground">A glimpse of the products, brands, and stories we&apos;ve helped bring to life.</p>
        </motion.div>

        <div className="sticky top-16 z-30 mt-10 flex flex-wrap items-center justify-center gap-2 py-4">
          {filters.map((f) => (
            <button key={f} type="button" onClick={() => setActive(f)} className={`relative rounded-full px-5 py-2 text-sm font-medium transition-colors ${active === f ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              {active === f && (<motion.span layoutId="portfolio-filter-pill" className="absolute inset-0 -z-10 rounded-full bg-primary shadow-[0_0_20px_-4px_hsl(var(--primary))]" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />)}
              {active !== f && (<span className="absolute inset-0 -z-10 rounded-full border border-border/70 bg-card/40" />)}
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="container pb-28">
        <motion.div key={active} initial="hidden" animate="show" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }} className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => {
              const Icon = project.icon
              return (
                <motion.div key={project.id} variants={{ hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] } } }} exit={{ opacity: 0, scale: 0.96 }} className="break-inside-avoid">
                  <Link href={`/portfolio/${project.slug}`} className="group relative block overflow-hidden rounded-3xl border border-border/60 bg-card/40 backdrop-blur-xl">
                    <div className={`relative w-full overflow-hidden ${project.aspect}`}>
                      {hasImage(project.imageUrl) ? (
                        <Image src={project.imageUrl} alt={project.title} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-br from-secondary via-card to-background" />
                          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl transition-opacity duration-500 group-hover:opacity-80" />
                          <div className="absolute inset-0 flex items-center justify-center"><Icon className="h-16 w-16 text-muted-foreground/30 transition-colors duration-500 group-hover:text-primary/40" strokeWidth={1.4} /></div>
                        </>
                      )}

                      <span className="absolute left-4 top-4 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-md transition-opacity duration-300 group-hover:opacity-0">{project.category}</span>

                      <div className="absolute inset-x-0 bottom-0 translate-y-full border-t border-primary/30 bg-card/80 p-5 backdrop-blur-xl transition-transform duration-500 ease-out group-hover:translate-y-0">
                        <p className="font-mono text-xs uppercase tracking-widest text-primary">{project.category}</p>
                        <h3 className="mt-1.5 flex items-center gap-1.5 text-lg font-semibold tracking-tight text-foreground">{project.title}<ArrowUpRight className="h-4 w-4 text-primary" /></h3>
                        <p className="mt-1.5 text-sm text-muted-foreground">{project.description}</p>
                        {project.tags && (<div className="mt-3 flex flex-wrap gap-1.5">{project.tags.map((tag) => (<span key={tag} className="rounded-full border border-border/60 bg-background/40 px-2.5 py-1 text-xs text-muted-foreground">{tag}</span>))}</div>)}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
