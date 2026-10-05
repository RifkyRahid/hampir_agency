import { notFound } from 'next/navigation'
import Image from 'next/image'
import { isValidLocale, type Locale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/get-dictionary'
import { getTeamMembers, getSettings } from '@/lib/data'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import ProcessSection from '@/components/home/ProcessSection'
import CtaBand from '@/components/home/CtaBand'

export const dynamic = 'force-dynamic'

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: rawLocale } = await params
  if (!isValidLocale(rawLocale)) notFound()

  const locale = rawLocale as Locale
  const dict = await getDictionary(locale)
  const [team, settings] = await Promise.all([
    getTeamMembers(locale),
    getSettings(locale),
  ])

  return (
    <>
      {/* Hero Statement */}
      <section className="pt-20 pb-16 sm:pt-28 sm:pb-24 border-b border-border bg-gradient-to-b from-surface/40 to-background">
        <Container size="default" className="text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-accent mb-3">
            {dict.about.eyebrow}
          </span>
          <h1 className="text-4xl sm:text-6xl font-semibold leading-[1.08] tracking-tight text-foreground">
            {dict.about.title}
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-base sm:text-xl text-muted-foreground leading-relaxed">
            {dict.about.description}
          </p>
        </Container>
      </section>

      {/* Impact Stats Strip */}
      {settings.stats.length > 0 && (
        <section className="py-12 border-b border-border bg-card">
          <Container size="wide">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {settings.stats.map((s, idx) => (
                <div key={idx} className="p-4">
                  <span className="text-3xl sm:text-5xl font-serif font-bold text-primary block">
                    {s.value}
                  </span>
                  <span className="mt-1 text-xs sm:text-sm text-muted-foreground font-medium block">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Mission & Values */}
      <section className="py-20 sm:py-28 border-b border-border bg-background">
        <Container size="default">
          <div className="rounded-2xl border border-border bg-surface/50 p-8 sm:p-12 text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">
              {dict.about.missionTitle}
            </span>
            <p className="mt-4 text-xl sm:text-2xl font-serif font-semibold text-foreground leading-relaxed">
              &ldquo;{dict.about.missionDesc}&rdquo;
            </p>
          </div>
        </Container>
      </section>

      {/* Meet The Team (from DB) */}
      <section className="py-20 sm:py-28 border-b border-border bg-surface/30">
        <Container size="wide">
          <SectionHeader
            eyebrow={dict.about.teamTitle}
            title={dict.about.teamSubtitle}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div
                key={member.id}
                className="flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/40 hover:shadow-md transition-all"
              >
                {/* 4:5 Portrait photo */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface">
                  {member.photoUrl ? (
                    <Image
                      src={member.photoUrl}
                      alt={member.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-serif text-3xl font-bold text-muted-foreground">
                      {member.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-foreground">
                      {member.name}
                    </h3>
                    <p className="text-xs font-semibold text-primary mt-0.5">
                      {member.role}
                    </p>
                    {member.bio && (
                      <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed">
                        {member.bio}
                      </p>
                    )}
                  </div>

                  {member.skills.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-border flex flex-wrap gap-1">
                      {member.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md border border-border/80 bg-surface px-2 py-0.5 text-[11px] text-muted-foreground"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Process Section */}
      <ProcessSection dict={dict.home.process} />

      <CtaBand locale={locale} dict={dict.home.cta} />
    </>
  )
}

