import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2 } from 'lucide-react'
import { isValidLocale, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/get-dictionary'
import { getPortfolioBySlug, getPortfolioNav } from '@/lib/data'
import { Container } from '@/components/ui/Container'
import { VideoEmbed } from '@/components/portfolio/VideoEmbed'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params
  if (!isValidLocale(rawLocale)) return {}

  const project = await getPortfolioBySlug(slug, rawLocale as Locale)
  if (!project) return {}

  return {
    title: `${project.title} — Studi Kasus`,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: [{ url: project.coverUrl, width: 1600, height: 900, alt: project.title }],
    },
  }
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: rawLocale, slug } = await params
  if (!isValidLocale(rawLocale)) notFound()

  const locale = rawLocale as Locale
  const dict = await getDictionary(locale)
  const project = await getPortfolioBySlug(slug, locale)
  if (!project) notFound()

  const nav = await getPortfolioNav(locale)
  const currentIndex = nav.findIndex((n) => n.slug === slug)
  const nextProject = nav.length > 1 ? nav[(currentIndex + 1) % nav.length] : null

  const teamMembers = (project.teamNote || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  const sections = [
    { label: dict.caseStudy.challenge, content: project.challenge },
    { label: dict.caseStudy.solution, content: project.solution },
    { label: dict.caseStudy.result, content: project.result },
  ].filter((s) => s.content)

  return (
    <article className="py-12 sm:py-16">
      {/* Top Navigation */}
      <Container size="wide">
        <Link
          href={`/${locale}/portfolio`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{dict.caseStudy.back}</span>
        </Link>

        {/* Header */}
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 text-xs font-mono font-semibold uppercase tracking-wider text-accent mb-4">
            <span>{project.categoryName}</span>
            {project.year && (
              <>
                <span className="text-border">/</span>
                <span className="text-muted-foreground">{project.year}</span>
              </>
            )}
          </div>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-foreground">
            {project.title}
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-muted-foreground leading-relaxed">
            {project.summary}
          </p>
        </div>

        {/* Hero Media: Video Embed or Cover Image (16:9) */}
        {project.videoUrl ? (
          <div className="mt-10">
            <VideoEmbed
              url={project.videoUrl}
              title={project.title}
              poster={project.coverUrl}
            />
          </div>
        ) : (
          <div className="mt-10 relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border bg-surface">
            <Image
              src={project.coverUrl}
              alt={project.title}
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
          </div>
        )}

        {/* Content Layout: Meta Sidebar + Story */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Sticky Meta Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
              {project.client && (
                <div>
                  <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    {dict.caseStudy.client}
                  </h2>
                  <p className="mt-1 font-semibold text-foreground text-sm">
                    {project.client}
                  </p>
                </div>
              )}

              <div>
                <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  {dict.caseStudy.discipline}
                </h2>
                <p className="mt-1 font-semibold text-foreground text-sm">
                  {project.serviceTitle || project.categoryName}
                </p>
              </div>

              {teamMembers.length > 0 && (
                <div>
                  <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                    {dict.caseStudy.team}
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {teamMembers.map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {project.link && (
                <div className="pt-2">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    <span>{dict.caseStudy.visitProject}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              )}
            </div>
          </aside>

          {/* Story Sections */}
          <div className="lg:col-span-8 space-y-12">
            {sections.map((sec, idx) => (
              <section key={idx} className="border-b border-border pb-10 last:border-b-0">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent mb-3">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {sec.label}
                </span>
                <p className="mt-2 text-base sm:text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                  {sec.content}
                </p>
              </section>
            ))}

            {/* Gallery (if any) */}
            {project.gallery.length > 0 && (
              <div className="pt-6">
                <h2 className="text-xl font-semibold tracking-tight text-foreground mb-6">
                  {dict.caseStudy.gallery}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.gallery.map((img, i) => (
                    <div
                      key={i}
                      className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border bg-surface"
                    >
                      <Image
                        src={img}
                        alt={`${project.title} detail ${i + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Circular Next Project Bar */}
        {nextProject && (
          <div className="mt-20 pt-10 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href={`/${locale}/portfolio`}
              className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{dict.caseStudy.back}</span>
            </Link>

            <Link
              href={`/${locale}/portfolio/${nextProject.slug}`}
              className="group text-center sm:text-right"
            >
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground block mb-1">
                {dict.caseStudy.nextProject}
              </span>
              <span className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors inline-flex items-center gap-2">
                <span>{nextProject.title}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        )}
      </Container>
    </article>
  )
}

