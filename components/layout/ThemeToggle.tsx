'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground ${className}`}>
        <Sun className="h-4 w-4" />
      </span>
    )
  }

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      aria-label={isDark ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-surface hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${className}`}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}

