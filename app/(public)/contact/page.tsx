'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Mail,
  MessageCircle,
  MapPin,
  Send,
  ArrowUpRight,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { createMessage } from './actions'

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

const inputClass =
  'w-full rounded-2xl border border-border/70 bg-background/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-all duration-300 focus:border-primary focus:shadow-[0_0_0_1px_hsl(var(--primary)),0_0_22px_-4px_hsl(var(--primary))]'

export default function ContactPage() {
  const [pending, setPending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setPending(true)
    const form = e.currentTarget
    const formData = new FormData(form)
    const res = await createMessage(formData)
    setPending(false)
    if (res?.error) {
      setError(res.error)
      return
    }
    form.reset()
    setSent(true)
  }

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[10%] top-[10%] h-[360px] w-[360px] rounded-full bg-primary/15 blur-[130px]" />
        <div className="absolute right-[8%] bottom-[10%] h-[320px] w-[320px] rounded-full bg-accent/15 blur-[130px]" />
      </div>

      <div className="container grid min-h-[calc(100vh-4rem)] grid-cols-1 items-center gap-12 py-20 md:grid-cols-2 md:gap-16">
        {/* Left — Info */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="flex flex-col"
        >
          <motion.span
            variants={fadeUp}
            className="mb-6 inline-flex w-fit items-center rounded-full border border-border/70 bg-card/50 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur-md"
          >
            Get in touch
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="max-w-md text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl"
          >
            Let&apos;s build something{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              great
            </span>
            .
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-md text-base text-muted-foreground"
          >
            Have a project in mind? Drop us a line and our team will get back to
            you within 24 hours.
          </motion.p>

          <motion.a
            variants={fadeUp}
            href="mailto:hello@nexa.studio"
            className="group mt-8 flex w-fit items-center gap-3 text-lg font-medium text-foreground transition-colors hover:text-primary"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/25">
              <Mail className="h-5 w-5" />
            </span>
            hello@nexa.studio
          </motion.a>

          <motion.a
            variants={fadeUp}
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_28px_-6px_hsl(var(--primary))] transition-transform hover:scale-[1.03]"
          >
            <MessageCircle className="h-4 w-4" />
            Direct WhatsApp
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </motion.a>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex items-center gap-2 font-mono text-sm"
          >
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-primary/80 [text-shadow:0_0_12px_hsl(var(--primary)/0.6)]">
              1.0456° N, 104.0305° E
            </span>
            <span className="text-muted-foreground">· Batam, Indonesia</span>
          </motion.div>
        </motion.div>

        {/* Right — Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="relative rounded-3xl border border-border/60 bg-card/40 p-6 backdrop-blur-xl sm:p-8"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

          {sent ? (
            <div className="relative flex flex-col items-center justify-center gap-4 py-16 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/25">
                <CheckCircle2 className="h-7 w-7" />
              </span>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Message sent!
              </h2>
              <p className="max-w-xs text-sm text-muted-foreground">
                Thanks for reaching out. Our team will get back to you shortly.
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-2 rounded-full border border-border/70 bg-background/40 px-5 py-2.5 text-sm font-medium text-foreground"
              >
                Send another
              </button>
            </div>
          ) : (
            <>
              <h2 className="relative text-xl font-semibold tracking-tight text-foreground">
                Send us a message
              </h2>
              <p className="relative mt-1 text-sm text-muted-foreground">
                We&apos;d love to hear about your project.
              </p>

              <form
                onSubmit={handleSubmit}
                className="relative mt-6 flex flex-col gap-4"
              >
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">
                    Name
                  </label>
                  <input id="name" name="name" type="text" placeholder="Your name" className={inputClass} />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <input id="email" name="email" type="email" placeholder="you@example.com" className={inputClass} />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-sm font-medium text-foreground">
                    Message
                  </label>
                  <textarea id="message" name="message" rows={4} placeholder="Tell us about your project..." className={`${inputClass} resize-none`} />
                </div>

                {error && (
                  <div className="flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={pending}
                  className="group mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_28px_-6px_hsl(var(--primary))] transition-transform hover:scale-[1.02] disabled:opacity-70"
                >
                  {pending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  )}
                  {pending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </section>
  )
}
