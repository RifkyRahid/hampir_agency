'use client'

import { motion } from 'framer-motion'
import {
  Code2,
  Palette,
  Camera,
  Database,
  Home,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type DbService = {
  id: string
  title: string
  description: string
  icon: string | null
}

type Display = {
  title: string
  description: string
  icon: LucideIcon
  span: string
  tag?: string
}

const iconMap: Record<string, LucideIcon> = {
  code: Code2,
  palette: Palette,
  camera: Camera,
  database: Database,
  home: Home,
}
function pickIcon(key: string | null): LucideIcon {
  return iconMap[(key || '').toLowerCase()] || Sparkles
}
const spans = ['md:col-span-2', 'md:col-span-1', 'md:col-span-1', 'md:col-span-2']

// Fallback mock data (used when the database is empty / unavailable)
const mock: Display[] = [
  {
    title: 'Web & App Development',
    description:
      'High-performance, pixel-perfect websites and applications built with modern frameworks and clean, scalable code.',
    icon: Code2,
    span: 'md:col-span-2',
    tag: 'UI/UX · Frontend · Fullstack',
  },
  {
    title: 'Graphic Design',
    description:
      'Bold brand identities, striking visuals, and marketing collateral that leave a lasting impression.',
    icon: Palette,
    span: 'md:col-span-1',
    tag: 'Branding · Marketing',
  },
  {
    title: 'Photo & Video',
    description:
      'Cinematic videography and crisp photography that tell your story with premium production quality.',
    icon: Camera,
    span: 'md:col-span-1',
    tag: 'Production',
  },
  {
    title: 'Data Entry & Ops',
    description:
      'Accurate, organized data management and back-office operations that keep everything running smoothly.',
    icon: Database,
    span: 'md:col-span-2',
    tag: 'Operations',
  },
]

const gridVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] },
  },
}

export default function BentoServices({
  dbServices,
}: {
  dbServices?: DbService[]
}) {
  const services: Display[] =
    dbServices && dbServices.length > 0
      ? dbServices.map((s, i) => ({
          title: s.title,
          description: s.description,
          icon: pickIcon(s.icon),
          span: spans[i % spans.length],
        }))
      : mock

  return (
    <section className="container py-20 sm:py-28">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <span className="text-sm font-medium text-primary">What we do</span>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          A full-service toolkit
        </h2>
        <p className="mt-4 text-muted-foreground">
          Everything your brand needs to stand out — under one roof.
        </p>
      </div>

      <motion.div
        variants={gridVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-[240px]"
      >
        {services.map((service, i) => {
          const Icon = service.icon
          return (
            <motion.article
              key={`${service.title}-${i}`}
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/60 bg-card/40 p-6 backdrop-blur-xl ${service.span}`}
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-transparent transition-all duration-500 group-hover:ring-primary/30" />

              <div className="relative flex items-start justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/25 transition-colors group-hover:bg-primary/20">
                  <Icon className="h-6 w-6" strokeWidth={2} />
                </span>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
              </div>

              <div className="relative">
                <h3 className="text-xl font-semibold tracking-tight text-foreground">
                  {service.title}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
                {service.tag && (
                  <p className="mt-4 font-mono text-xs uppercase tracking-wider text-primary/70">
                    {service.tag}
                  </p>
                )}
              </div>
            </motion.article>
          )
        })}
      </motion.div>
    </section>
  )
}
