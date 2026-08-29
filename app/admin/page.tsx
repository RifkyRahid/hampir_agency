import { Package, FolderKanban, Mail, TrendingUp, Clock } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Stat = {
  label: string
  value: number
  hint: string
  icon: LucideIcon
  span: string
}

// Mock numbers — will be replaced with Prisma counts later
const stats: Stat[] = [
  {
    label: 'Total Services',
    value: 4,
    hint: 'Active service offerings',
    icon: Package,
    span: 'md:col-span-1',
  },
  {
    label: 'Total Portfolios',
    value: 4,
    hint: 'Published case studies',
    icon: FolderKanban,
    span: 'md:col-span-1',
  },
  {
    label: 'Unread Messages',
    value: 3,
    hint: 'Awaiting your reply',
    icon: Mail,
    span: 'md:col-span-1',
  },
]

const recent = [
  { title: 'Mecca Madina Auto Syariah', type: 'Portfolio', date: 'Jun 12, 2025' },
  { title: 'Web & App Development', type: 'Service', date: 'Jun 10, 2025' },
  { title: 'New message from a visitor', type: 'Message', date: 'Jun 09, 2025' },
]

export default function AdminDashboard() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back — here&apos;s an overview of your agency content.
        </p>
      </div>

      {/* Stat Cards (Bento) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className={`group relative overflow-hidden rounded-3xl border border-border/60 bg-card/40 p-6 backdrop-blur-xl ${stat.span}`}
            >
              <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-primary/10 blur-3xl transition-opacity duration-500 group-hover:opacity-90" />
              <div className="relative flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/25">
                  <Icon className="h-5 w-5" />
                </span>
                <TrendingUp className="h-4 w-4 text-primary/60" />
              </div>
              <p className="relative mt-5 text-4xl font-semibold tracking-tight text-foreground">
                {stat.value}
              </p>
              <p className="relative mt-1 text-sm font-medium text-foreground">
                {stat.label}
              </p>
              <p className="relative mt-0.5 text-xs text-muted-foreground">
                {stat.hint}
              </p>
            </div>
          )
        })}
      </div>

      {/* Recent activity */}
      <div className="mt-8 overflow-hidden rounded-3xl border border-border/60 bg-card/40 backdrop-blur-xl">
        <div className="flex items-center gap-2 border-b border-border/60 px-6 py-4">
          <Clock className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">
            Recent activity
          </h2>
        </div>
        <div className="divide-y divide-border/60">
          {recent.map((row, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-6 py-4 text-sm"
            >
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-border/60 bg-background/40 px-2.5 py-1 text-xs text-primary/80">
                  {row.type}
                </span>
                <span className="text-foreground">{row.title}</span>
              </div>
              <span className="text-xs text-muted-foreground">{row.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
