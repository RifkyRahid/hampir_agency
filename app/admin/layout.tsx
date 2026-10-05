'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Package,
  FolderKanban,
  Tags,
  Users,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { logoutAction } from './actions'
import { ThemeToggle } from '@/components/layout/ThemeToggle'

type NavItem = { label: string; href: string; icon: LucideIcon }

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Layanan', href: '/admin/services', icon: Package },
  { label: 'Portofolio', href: '/admin/portfolio', icon: FolderKanban },
  { label: 'Kategori Portofolio', href: '/admin/categories', icon: Tags },
  { label: 'Anggota Tim', href: '/admin/team', icon: Users },
  { label: 'Pesan Masuk', href: '/admin/messages', icon: Mail },
  { label: 'Pengaturan Situs', href: '/admin/settings', icon: Settings },
]

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  return (
    <div className="flex h-full flex-col justify-between p-4">
      <div>
        {/* Brand */}
        <div className="flex h-12 items-center justify-between px-2 mb-6 border-b border-border pb-3">
          <Link href="/admin" className="font-serif font-bold text-lg text-foreground tracking-tight">
            Hampir<span className="text-primary font-sans font-bold">.</span>Admin
          </Link>
          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <Link
              href="/id"
              target="_blank"
              title="Lihat Website Publik"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-primary transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={`relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-colors ${
                  active
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:bg-surface hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="pt-4 border-t border-border">
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Keluar Akun</span>
          </button>
        </form>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-background">{children}</div>
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border bg-card md:block">
        <SidebarContent />
      </aside>

      {/* Mobile Top Bar */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card px-4 md:hidden">
        <span className="font-serif font-bold text-base text-foreground">
          Hampir<span className="text-primary font-sans font-bold">.</span>Admin
        </span>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-foreground"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-xs md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 350, damping: 35 }}
              className="fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card md:hidden"
            >
              <button
                type="button"
                aria-label="Tutup Menu"
                onClick={() => setOpen(false)}
                className="absolute right-3 top-3.5 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
              <SidebarContent onNavigate={() => setOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="md:pl-64">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">{children}</div>
      </div>
    </div>
  )
}

