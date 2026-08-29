'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Hexagon } from 'lucide-react'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

function Logo({ headerLogo }: { headerLogo?: string | null }) {
  if (headerLogo) {
    return (
      <span className="relative block h-9 w-[140px]">
        <Image src={headerLogo} alt="Logo" fill sizes="140px" className="object-contain object-left" priority />
      </span>
    )
  }
  return (
    <>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/30 transition-all group-hover:bg-primary/20 group-hover:ring-primary/50">
        <Hexagon className="h-5 w-5" strokeWidth={2.2} />
      </span>
      <span className="text-lg font-semibold tracking-tight text-foreground">Nexa<span className="text-primary">.</span>Studio</span>
    </>
  )
}

export default function Navbar({ headerLogo }: { headerLogo?: string | null }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/50 backdrop-blur-xl">
      <nav className="container flex h-16 items-center justify-between">
        <Link href="/" className="group flex items-center gap-2.5">
          <Logo headerLogo={headerLogo} />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href
            return (
              <Link key={link.href} href={link.href} className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                {active && (<motion.span layoutId="nav-active-pill" className="absolute inset-0 -z-10 rounded-full bg-card/70 ring-1 ring-border/70" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />)}
                {link.label}
              </Link>
            )
          })}
        </div>

        <div className="hidden md:block">
          <Link href="/contact" className="inline-flex items-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-[0_0_20px_-4px_hsl(var(--primary))] transition-transform hover:scale-[1.03]">Let&apos;s Talk</Link>
        </div>

        <button type="button" aria-label="Toggle menu" onClick={() => setOpen((v) => !v)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-card/40 text-foreground md:hidden">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: 'easeInOut' }} className="overflow-hidden border-t border-border/60 bg-background/80 backdrop-blur-xl md:hidden">
            <div className="container flex flex-col gap-1 py-4">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${pathname === link.href ? 'bg-card/70 text-foreground' : 'text-muted-foreground hover:bg-card/50 hover:text-foreground'}`}>{link.label}</Link>
              ))}
              <Link href="/contact" onClick={() => setOpen(false)} className="mt-2 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Let&apos;s Talk</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
