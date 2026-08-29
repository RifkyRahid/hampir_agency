'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Hexagon, Loader2, LogIn, AlertCircle } from 'lucide-react'
import { loginAction } from '../actions'

const inputClass =
  'w-full rounded-2xl border border-border/70 bg-background/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-all duration-300 focus:border-primary focus:shadow-[0_0_0_1px_hsl(var(--primary)),0_0_22px_-4px_hsl(var(--primary))]'

export default function AdminLoginPage() {
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setPending(true)
    const formData = new FormData(e.currentTarget)
    const result = await loginAction(formData)
    if (result?.error) {
      setError(result.error)
      setPending(false)
      return
    }
    if (result?.success) {
      // Full navigation so the HTTP-only cookie is sent and middleware passes
      window.location.assign('/admin')
      return
    }
    setPending(false)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[140px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="relative w-full max-w-md rounded-3xl border border-border/60 bg-card/50 p-8 backdrop-blur-xl"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/30">
            <Hexagon className="h-6 w-6" strokeWidth={2.2} />
          </span>
          <h1 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
            HampirAgency<span className="text-primary">.</span>Admin
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to manage your agency content
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="admin@hampir.agency"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className={inputClass}
            />
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
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_28px_-6px_hsl(var(--primary))] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* <p className="mt-6 text-center text-xs text-muted-foreground">
          Demo credentials: <span className="font-mono text-primary/80">admin@hampir.agency</span>{' '}
          / <span className="font-mono text-primary/80">admin123</span>
        </p> */}
      </motion.div>
    </div>
  )
}
