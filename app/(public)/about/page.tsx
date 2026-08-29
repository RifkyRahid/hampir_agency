'use client'

import { motion } from 'framer-motion'
import { Users, Layers, MapPin } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Stat = { icon: LucideIcon; value: string; label: string }
type Member = { name: string; role: string; skills: string[]; initials: string }

const stats: Stat[] = [
  { icon: Users, value: '4', label: 'Core Experts' },
  { icon: Layers, value: 'Full-Service', label: 'Agency' },
  { icon: MapPin, value: 'Batam', label: 'Based' },
]

// Mock data — to be replaced with Prisma-backed content later
const team: Member[] = [
  {
    name: 'Rifky Rahid',
    role: 'Web Developer / UI·UX',
    skills: ['Next.js', 'TypeScript', 'PostgreSQL'],
    initials: 'RR',
  },
  {
    name: 'Anisa Putri',
    role: 'Graphic Designer / Digital Marketing',
    skills: ['Figma', 'Branding', 'Meta Ads'],
    initials: 'AP',
  },
  {
    name: 'Bagas Pratama',
    role: 'Videographer / Photographer',
    skills: ['Premiere Pro', 'Lightroom', 'Cinematography'],
    initials: 'BP',
  },
  {
    name: 'Dewi Lestari',
    role: 'Data Entry / Ops',
    skills: ['Notion', 'Google Sheets', 'QA'],
    initials: 'DL',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] },
  },
}

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
}

export default function AboutPage() {
  return (
    <>
      {/* Hero Statement */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/2 h-[440px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[140px]" />
          <div className="absolute right-[15%] top-[15%] h-[220px] w-[220px] rounded-full bg-accent/15 blur-[110px]" />
        </div>
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="container flex min-h-[62vh] flex-col items-center justify-center py-24 text-center"
        >
          <motion.span
            variants={fadeUp}
            className="mb-6 inline-flex items-center rounded-full border border-border/70 bg-card/50 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur-md"
          >
            About Hampir.Agency
          </motion.span>
          <motion.h1
            variants={fadeUp}
            className="max-w-4xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-6xl md:text-7xl"
          >
            We build digital experiences that{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              matter
            </span>
            .
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-xl text-balance text-base text-muted-foreground sm:text-lg"
          >
            A tight-knit team of four turning ambitious ideas into pixel-perfect
            products — from code to camera.
          </motion.p>
        </motion.div>
      </section>

      {/* Impact Bar */}
      <section className="container -mt-6 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 divide-y divide-border/60 overflow-hidden rounded-3xl border border-border/60 bg-card/40 backdrop-blur-xl sm:grid-cols-3 sm:divide-x sm:divide-y-0"
        >
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="flex items-center justify-center gap-4 px-6 py-8"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/25">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="text-left">
                  <p className="text-xl font-semibold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            )
          })}
        </motion.div>
      </section>

      {/* Meet The Team */}
      <section className="container py-20 sm:py-28">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-sm font-medium text-primary">Meet the team</span>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Four experts, one vision
          </h2>
          <p className="mt-4 text-muted-foreground">
            The people behind every pixel, frame, and line of code.
          </p>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2"
        >
          {team.map((member) => (
            <motion.article
              key={member.name}
              variants={fadeUp}
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="group relative flex items-center gap-5 overflow-hidden rounded-3xl border border-border/60 bg-card/40 p-6 backdrop-blur-xl"
            >
              <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-primary/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

              {/* Grayscale portrait placeholder → color on hover */}
              <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-muted to-secondary text-2xl font-semibold text-muted-foreground ring-1 ring-border/70 grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:from-primary/30 group-hover:to-accent/30 group-hover:text-primary group-hover:ring-primary/40">
                {member.initials}
              </div>

              <div className="relative min-w-0">
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  {member.name}
                </h3>
                <p className="mt-0.5 text-sm text-primary/80">{member.role}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {member.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-border/60 bg-background/40 px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>
    </>
  )
}
