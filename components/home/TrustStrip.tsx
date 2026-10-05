import { Users, Layers, MapPin, Clock } from 'lucide-react'
import type { Dictionary } from '@/lib/i18n/get-dictionary'
import { Container } from '@/components/ui/Container'

export default function TrustStrip({ dict }: { dict: Dictionary['home']['trust'] }) {
  const items = [
    { icon: Users, label: dict.experts },
    { icon: Layers, label: dict.fullService },
    { icon: MapPin, label: dict.location },
    { icon: Clock, label: dict.response },
  ]

  return (
    <section className="border-b border-border bg-card py-7 transition-colors">
      <Container size="wide">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {items.map((item, idx) => {
            const Icon = item.icon
            return (
              <div key={idx} className="flex items-center justify-center gap-3 px-3 py-2 text-center sm:text-left">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold tracking-tight text-foreground">
                  {item.label}
                </span>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

