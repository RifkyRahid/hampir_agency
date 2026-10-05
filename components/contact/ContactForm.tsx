'use client'

import { useState } from 'react'
import { Send, CheckCircle2, Loader2, AlertCircle } from 'lucide-react'
import type { Locale } from '@/lib/i18n/config'
import type { Dictionary } from '@/lib/i18n/get-dictionary'
import { submitContactMessage } from '@/app/[locale]/contact/actions'

const inputClass =
  'w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20'

export default function ContactForm({
  locale,
  dict,
  initialService,
}: {
  locale: Locale
  dict: Dictionary['contact']['form']
  initialService?: string
}) {
  const [pending, setPending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setFieldErrors({})
    setPending(true)

    const form = e.currentTarget
    const fd = new FormData(form)
    fd.set('locale', locale)

    const res = await submitContactMessage(fd)
    setPending(false)

    if (res?.fieldErrors) {
      setFieldErrors(res.fieldErrors)
      return
    }
    if (res?.error) {
      setError(res.error)
      return
    }

    form.reset()
    setSent(true)
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 sm:p-12 text-center">
        <span className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-primary-soft text-primary mb-4">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {dict.successTitle}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
          {dict.successDesc}
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-6 rounded-full border border-border bg-surface px-6 py-2.5 text-xs font-semibold text-foreground hover:bg-card transition-colors"
        >
          {dict.sendAnother}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4">
      {/* Honeypot field (hidden from real users) */}
      <input type="text" name="company_fax" className="hidden" tabIndex={-1} autoComplete="off" />

      <div>
        <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
          {dict.name} *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder={dict.namePlaceholder}
          className={inputClass}
        />
        {fieldErrors.name && (
          <p className="mt-1 text-xs text-destructive">{fieldErrors.name}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
            {dict.email} *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder={dict.emailPlaceholder}
            className={inputClass}
          />
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-destructive">{fieldErrors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
            {dict.phone}
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder={dict.phonePlaceholder}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="interest" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
          {dict.interest}
        </label>
        <input
          id="interest"
          name="interest"
          type="text"
          defaultValue={initialService || ''}
          placeholder={dict.interestPlaceholder}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
          {dict.message} *
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          placeholder={dict.messagePlaceholder}
          className={`${inputClass} resize-none`}
        />
        {fieldErrors.message && (
          <p className="mt-1 text-xs text-destructive">{fieldErrors.message}</p>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-xs text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-70 cursor-pointer"
      >
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{dict.sending}</span>
          </>
        ) : (
          <>
            <span>{dict.submit}</span>
            <Send className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  )
}

