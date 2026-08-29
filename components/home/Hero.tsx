'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, Sparkles } from 'lucide-react'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] } },
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Glowing radial accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-15%] h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-primary/20 blur-[130px]" />
        <div className="absolute right-[8%] top-[25%] h-[280px] w-[280px] rounded-full bg-accent/20 blur-[120px]" />
        <div className="absolute left-[6%] bottom-[5%] h-[240px] w-[240px] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="container flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-24 text-center"
      >
        <motion.span
          variants={item}
          className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/50 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-md"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Premium Full-Service Digital Agency
        </motion.span>

        <motion.h1
          variants={item}
          className="mt-7 max-w-4xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl"
        >
          We craft{' '}
          <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
            pixel-perfect
          </span>{' '}
          digital experiences.
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-6 max-w-xl text-balance text-base text-muted-foreground sm:text-lg"
        >
          Web &amp; app development, brand design, photo/video production, and
          data-driven marketing — delivered by a tight-knit team of experts.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_28px_-6px_hsl(var(--primary))] transition-transform hover:scale-[1.03]"
          >
            Start a Project
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/40 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur-md transition-colors hover:border-primary/40"
          >
            View Our Work
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
