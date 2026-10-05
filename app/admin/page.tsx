import Link from 'next/link'
import { Package, FolderKanban, Mail, Users, ArrowUpRight, Clock, Plus } from 'lucide-react'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const [
    serviceCount,
    portfolioCount,
    unreadCount,
    teamCount,
    recentPortfolios,
    recentMessages,
  ] = await Promise.all([
    prisma.service.count({ where: { isActive: true } }),
    prisma.portfolio.count({ where: { isPublished: true } }),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.teamMember.count({ where: { isActive: true } }),
    prisma.portfolio.findMany({
      orderBy: { createdAt: 'desc' },
      take: 4,
      select: { id: true, titleId: true, slug: true, createdAt: true },
    }),
    prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: 4,
      select: { id: true, name: true, email: true, createdAt: true, isRead: true },
    }),
  ])

  const stats = [
    {
      label: 'Layanan Aktif',
      value: serviceCount,
      hint: 'Tampil di website publik',
      icon: Package,
      href: '/admin/services',
    },
    {
      label: 'Portofolio Terbit',
      value: portfolioCount,
      hint: 'Studi kasus terpublikasi',
      icon: FolderKanban,
      href: '/admin/portfolio',
    },
    {
      label: 'Pesan Belum Dibaca',
      value: unreadCount,
      hint: 'Menunggu respon tim',
      icon: Mail,
      href: '/admin/messages',
      alert: unreadCount > 0,
    },
    {
      label: 'Anggota Tim',
      value: teamCount,
      hint: 'Profil tim yang aktif',
      icon: Users,
      href: '/admin/team',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-foreground">
            Ringkasan Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Selamat datang di panel pengelola konten resmi Hampir.Agency.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/portfolio"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Portofolio Baru</span>
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    stat.alert ? 'bg-destructive/10 text-destructive' : 'bg-primary-soft text-primary'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="mt-4 text-3xl font-serif font-bold text-foreground">
                {stat.value}
              </p>
              <p className="mt-0.5 text-xs font-semibold text-foreground">
                {stat.label}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {stat.hint}
              </p>
            </Link>
          )
        })}
      </div>

      {/* Two Column Activity: Recent Portfolios & Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Portfolios */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface/40">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground">
              <FolderKanban className="h-4 w-4 text-primary" />
              <span>Portofolio Terbaru</span>
            </div>
            <Link href="/admin/portfolio" className="text-xs text-primary font-medium hover:underline">
              Semua
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentPortfolios.length === 0 ? (
              <p className="p-6 text-xs text-muted-foreground text-center">Belum ada portofolio</p>
            ) : (
              recentPortfolios.map((p) => (
                <div key={p.id} className="p-4 px-6 flex items-center justify-between hover:bg-surface/30 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{p.titleId}</p>
                    <p className="text-xs font-mono text-muted-foreground">/{p.slug}</p>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {new Date(p.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface/40">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground">
              <Mail className="h-4 w-4 text-primary" />
              <span>Pesan Masuk Terbaru</span>
            </div>
            <Link href="/admin/messages" className="text-xs text-primary font-medium hover:underline">
              Semua
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentMessages.length === 0 ? (
              <p className="p-6 text-xs text-muted-foreground text-center">Belum ada pesan</p>
            ) : (
              recentMessages.map((m) => (
                <div key={m.id} className="p-4 px-6 flex items-center justify-between hover:bg-surface/30 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{m.name}</p>
                      {!m.isRead && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                          Baru
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{m.email}</p>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {new Date(m.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

