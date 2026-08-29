'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { UploadCloud, Loader2, Trash2, AlertCircle } from 'lucide-react'
import { uploadImage } from '@/app/admin/upload'
import { saveLogo } from '@/app/admin/settings/actions'

type Settings = { headerLogo: string | null; footerLogo: string | null }

function LogoField({
  kind,
  label,
  value,
  onChange,
}: {
  kind: 'header' | 'footer'
  label: string
  value: string | null
  onChange: (v: string | null) => void
}) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true); setError('')
    const fd = new FormData(); fd.append('file', file)
    const up = await uploadImage(fd)
    if (up.error || !up.url) { setError(up.error || 'Upload failed.'); setBusy(false); return }
    const res = await saveLogo(kind, up.url)
    setBusy(false)
    if (res.error) { setError(res.error); return }
    onChange(up.url)
    e.target.value = ''
  }

  async function handleRemove() {
    setBusy(true)
    await saveLogo(kind, null)
    setBusy(false)
    onChange(null)
  }

  return (
    <div className="rounded-3xl border border-border/60 bg-card/40 p-6 backdrop-blur-xl">
      <h3 className="text-sm font-semibold text-foreground">{label}</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Recommended ~400 × 120 px · SVG or transparent PNG · keep a transparent background.
      </p>
      <div className="mt-4 flex items-center gap-4">
        <div className="relative flex h-16 w-44 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-background/40 p-2">
          {value ? (
            <Image src={value} alt={label} fill sizes="176px" className="object-contain p-2" />
          ) : (
            <span className="text-xs text-muted-foreground">No logo</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border/70 bg-background/40 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/50">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />} Upload logo
            <input type="file" accept="image/svg+xml,image/png,image/webp,image/jpeg" onChange={handleFile} className="hidden" />
          </label>
          {value && (
            <button onClick={handleRemove} className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5" /> Remove
            </button>
          )}
        </div>
      </div>
      {error && (<div className="mt-3 flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"><AlertCircle className="h-4 w-4 shrink-0" />{error}</div>)}
    </div>
  )
}

export default function SettingsManager({ settings }: { settings: Settings }) {
  const router = useRouter()
  const [header, setHeader] = useState(settings.headerLogo)
  const [footer, setFooter] = useState(settings.footerLogo)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Logo & branding used across the public website.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <LogoField kind="header" label="Header / Navbar Logo" value={header} onChange={(v) => { setHeader(v); router.refresh() }} />
        <LogoField kind="footer" label="Footer Logo (optional)" value={footer} onChange={(v) => { setFooter(v); router.refresh() }} />
      </div>
    </div>
  )
}
