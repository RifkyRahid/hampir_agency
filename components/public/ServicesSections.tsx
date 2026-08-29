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
  Check,
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
  tagline: string
  description: string
  features: string[]
  icon: LucideIcon
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

const mock: Display[] = [
  {
    title: 'Web & App Development',
    tagline: 'Engineering',
    description:
      'High-performance, pixel-perfect websites and applications built with modern frameworks, clean architecture, and scalable code.',
    features: ['Next.js & TypeScript', 'Custom CMS & Dashboards', 'API & Database Design'],
    icon: Code2,
  },
  {
    title: 'Graphic Design',
    tagline: 'Brand & Marketing',
    description:
      'Bold brand identities, striking visuals, and marketing collateral that leave a lasting impression across every channel.',
    features: ['Brand Identity', 'Social Media Kits', 'Digital Marketing'],
    icon: Palette,
  },
  {
    title: 'Photo & Video',
    tagline: 'Production',
    description:
      'Cinematic videography and crisp photography that tell your story with premium production quality, from concept to final cut.',
    features: ['Commercial Video', 'Product Photography', 'Post-Production'],
    icon: Camera,
  },
  {
    title: 'Data Entry & Ops',
    tagline: 'Operations',
    description:
      'Accurate, organized data management and back-office operations that keep your business running smoothly behind the scenes.',
    features: ['Data Management', 'Process Automation', 'Quality Assurance'],
    icon: Database,
  },
]

export default function ServicesSections({
  dbServices,
}: {
  dbServices?: DbService[]
}) {
  const services: Display[] =
    dbServices && dbServices.length > 0
      ? dbServices.map((s) => ({
          title: s.title,
          tagline: 'Service',
          description: s.description,
          features: [],
          icon: pickIcon(s.icon),
        }))
      : mock

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-[360px] w-[720px] -translate-x-1/2 rounded-full bg-primary/15 blur-[130px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="container py-24 text-center sm:py-28"
        >
          <span className="inline-flex items-center rounded-full border border-border/70 bg-card/50 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur-md">
            Our Services
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-6xl">
            Everything you need,{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              under one roof
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-balance text-base text-muted-foreground sm:text-lg">
            Four core disciplines, endlessly scalable — delivered by a team that
            obsesses over every detail.
          </p>
        </motion.div>
      </section>

      <section className="container flex flex-col gap-20 pb-28 sm:gap-28">
        {services.map((service, index) => {
          const Icon = service.icon
          const reversed = index % 2 === 1
          return (
            <motion.div
              key={`${service.title}-${index}`}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.15 } },
              }}
              className={`flex flex-col items-center gap-8 md:gap-16 ${
                reversed ? 'md:flex-row-reverse' : 'md:flex-row'
              }`}
            >
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] },
                  },
                }}
                className="flex-1"
              >
                <span className="font-mono text-xs uppercase tracking-widest text-primary/70">
                  {`0${index + 1} · ${service.tagline}`}
                </span>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  {service.title}
                </h2>
                <p className="mt-4 max-w-md text-muted-foreground">
                  {service.description}
                </p>
                {service.features.length > 0 && (
                  <ul className="mt-6 flex flex-col gap-3">
                    {service.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-3 text-sm text-foreground"
                      >
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/25">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
                <a
                  href="/contact"
                  className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                >
                  Start a project
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </motion.div>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] },
                  },
                }}
                className="relative flex aspect-[4/3] w-full flex-1 items-center justify-center overflow-hidden rounded-3xl border border-border/60 bg-card/40 backdrop-blur-xl"
              >
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[80px]" />
                </div>
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.05]"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                  }}
                />
                <span className="relative flex h-28 w-28 items-center justify-center rounded-3xl bg-primary/10 text-primary ring-1 ring-primary/30">
                  <Icon className="h-14 w-14" strokeWidth={1.6} />
                </span>
              </motion.div>
            </motion.div>
          )
        })}
      </section>
    </>
  )
}
