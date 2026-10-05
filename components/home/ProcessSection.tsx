'use client'

import { motion } from 'framer-motion'
import type { Dictionary } from '@/lib/i18n/get-dictionary'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'

export default function ProcessSection({ dict }: { dict: Dictionary['home']['process'] }) {
  const steps = [
    { title: dict.step1Title, desc: dict.step1Desc },
    { title: dict.step2Title, desc: dict.step2Desc },
    { title: dict.step3Title, desc: dict.step3Desc },
    { title: dict.step4Title, desc: dict.step4Desc },
  ]

  return (
    <section className="py-20 sm:py-28 border-b border-border bg-surface/30">
      <Container size="wide">
        <SectionHeader
          eyebrow={dict.eyebrow}
          title={dict.title}
          description={dict.description}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 sm:p-7"
            >
              <div>
                <span className="text-2xl font-serif font-bold text-accent">
                  0{idx + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}

