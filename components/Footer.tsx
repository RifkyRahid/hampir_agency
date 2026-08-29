import Link from 'next/link'
import Image from 'next/image'
import { Hexagon, Github, Twitter, Instagram, Linkedin } from 'lucide-react'

const footerLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const socials = [
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
]

export default function Footer({ footerLogo }: { footerLogo?: string | null }) {
  return (
    <footer className="relative mt-24 border-t border-border/60">
      <div className="container flex flex-col gap-8 py-12 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            {footerLogo ? (
              <span className="relative block h-8 w-[130px]"><Image src={footerLogo} alt="Logo" fill sizes="130px" className="object-contain object-left" /></span>
            ) : (
              <>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/30"><Hexagon className="h-4 w-4" strokeWidth={2.2} /></span>
                <span className="text-base font-semibold tracking-tight text-foreground">HAMPIR <span className="text-primary">.</span>AGENCY</span>
              </>
            )}
          </Link>
          <p className="max-w-xs text-sm text-muted-foreground">A premium full-service digital agency crafting pixel-perfect experiences.</p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {footerLinks.map((link) => (<Link key={link.href} href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{link.label}</Link>))}
        </nav>

        <div className="flex items-center gap-3">
          {socials.map((s) => (<a key={s.label} href={s.href} aria-label={s.label} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-card/40 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"><s.icon className="h-4 w-4" /></a>))}
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="container flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted-foreground md:flex-row">
          <p>&copy; {new Date().getFullYear()} Hampir.Agency. All rights reserved.</p>
          <p className="font-mono text-primary/70">1.0456° N, 104.0305° E</p>
        </div>
      </div>
    </footer>
  )
}
