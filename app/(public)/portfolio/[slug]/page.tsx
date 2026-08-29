import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { getPortfolioBySlug, getPortfolioNav } from '@/lib/data'

export const dynamic = 'force-dynamic'

function hasImage(url?: string | null) {
  return !!url && (url.startsWith('/uploads') || url.startsWith('http'))
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getPortfolioBySlug(slug)
  if (!project) notFound()

  const nav = await getPortfolioNav()
  const idx = nav.findIndex((n) => n.slug === slug)
  const next = nav.length > 1 ? nav[(idx + 1) % nav.length] : null

  const team = (project.team || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  const sections = [
    { label: 'The Challenge', body: project.challenge },
    { label: 'Solution & Process', body: project.solution },
    { label: 'The Result', body: project.result },
  ].filter((s) => s.body)

  return (
    <article className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[320px] w-[700px] -translate-x-1/2 rounded-full bg-primary/10 blur-[130px]" />
      </div>

      <div className="container pt-16 sm:pt-20">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Work
        </Link>

        {/* Header */}
        <header className="mt-8 max-w-4xl">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-widest text-primary">
            <span>{project.category}</span>
            {project.year && (
              <>
                <span className="text-border">/</span>
                <span className="text-muted-foreground">{project.year}</span>
              </>
            )}
          </div>
          <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
            {project.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {project.description}
          </p>
        </header>
      </div>

      {/* Hero image */}
      <div className="container mt-12">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-border/60 bg-card/40 backdrop-blur-xl">
          {hasImage(project.imageUrl) ? (
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              sizes="(max-width: 1400px) 100vw, 1400px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[90px]" />
              <Sparkles className="relative h-16 w-16 text-primary/40" />
            </div>
          )}
        </div>
      </div>

      {/* Meta + sections */}
      <div className="container mt-16 grid grid-cols-1 gap-12 lg:grid-cols-[260px_1fr] lg:gap-16">
        {/* Meta sidebar */}
        <aside className="h-fit space-y-6 lg:sticky lg:top-24">
          {project.client && (
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Client</p>
              <p className="mt-1.5 text-foreground">{project.client}</p>
            </div>
          )}
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Discipline</p>
            <p className="mt-1.5 text-foreground">{project.serviceTitle || project.category}</p>
          </div>
          {team.length > 0 && (
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Team & Disciplines</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {team.map((t) => (
                  <span key={t} className="rounded-full border border-border/60 bg-card/40 px-2.5 py-1 text-xs text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              Visit live project <ArrowRight className="h-4 w-4" />
            </a>
          )}
        </aside>

        {/* Story */}
        <div className="max-w-2xl space-y-14">
          {sections.map((s) => (
            <section key={s.label}>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">{s.label}</h2>
              <p className="mt-4 whitespace-pre-line text-lg leading-relaxed text-muted-foreground">{s.body}</p>
            </section>
          ))}
          {sections.length === 0 && (
            <p className="text-muted-foreground">Full case study details coming soon.</p>
          )}
        </div>
      </div>

      {/* Gallery */}
      {project.gallery.filter(hasImage).length > 0 && (
        <div className="container mt-20">
          <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-primary">Project Gallery</h2>
          <div className="columns-1 gap-4 sm:columns-2 [&>*]:mb-4">
            {project.gallery.filter(hasImage).map((src, i) => (
              <div key={i} className="relative w-full overflow-hidden rounded-3xl border border-border/60">
                <Image
                  src={src}
                  alt={`${project.title} gallery ${i + 1}`}
                  width={1200}
                  height={800}
                  className="h-auto w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next project */}
      <div className="container mt-24 border-t border-border/60 py-16">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <Link href="/portfolio" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Back to Work
          </Link>
          {next && (
            <Link href={`/portfolio/${next.slug}`} className="group text-right">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Next Project</p>
              <p className="mt-1 inline-flex items-center gap-2 text-2xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-3xl">
                {next.title}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </p>
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
