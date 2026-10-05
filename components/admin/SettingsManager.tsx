'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle2, AlertCircle, Save } from 'lucide-react'
import { saveSiteSettings } from '@/app/admin/settings/actions'
import ImageField from '@/components/admin/ImageField'

type Settings = {
  headerLogoUrl: string | null
  footerLogoUrl: string | null
  email: string
  whatsapp: string
  address: string | null
  instagram: string | null
  linkedin: string | null
  github: string | null
}

const inputClass =
  'w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20'

export default function SettingsManager({ settings }: { settings: Settings }) {
  const router = useRouter()
  const [headerLogoUrl, setHeaderLogoUrl] = useState(settings.headerLogoUrl || '')
  const [footerLogoUrl, setFooterLogoUrl] = useState(settings.footerLogoUrl || '')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setSaved(false)
    setPending(true)

    const fd = new FormData(e.currentTarget)
    fd.set('headerLogoUrl', headerLogoUrl)
    fd.set('footerLogoUrl', footerLogoUrl)

    const res = await saveSiteSettings(fd)
    setPending(false)

    if (res?.error) {
      setError(res.error)
      return
    }

    setSaved(true)
    setTimeout(() => setSaved(false), 4000)
    router.refresh()
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold tracking-tight text-foreground">
          Pengaturan Website
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Kelola logo, identitas brand, kontak, dan tautan sosial Hampir Agency.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        {/* Brand Logos */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
          <h2 className="text-sm font-semibold text-foreground border-b border-border pb-3">
            Logo & Branding
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageField
              label="Logo Navbar / Header"
              kind="logo"
              value={headerLogoUrl}
              onChange={setHeaderLogoUrl}
            />

            <ImageField
              label="Logo Footer"
              kind="logo"
              value={footerLogoUrl}
              onChange={setFooterLogoUrl}
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-sm font-semibold text-foreground border-b border-border pb-3">
            Informasi Kontak Publik
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Alamat Email Kontak
              </label>
              <input
                name="email"
                type="email"
                defaultValue={settings.email}
                placeholder="hello@hampir.agency"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Nomor WhatsApp (dengan kode negara)
              </label>
              <input
                name="whatsapp"
                defaultValue={settings.whatsapp}
                placeholder="6281234567890"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Alamat Kantor / Studio
            </label>
            <input
              name="address"
              defaultValue={settings.address || ''}
              placeholder="Batam, Kepulauan Riau, Indonesia"
              className={inputClass}
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-sm font-semibold text-foreground border-b border-border pb-3">
            Media Sosial
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Instagram URL
              </label>
              <input
                name="instagram"
                defaultValue={settings.instagram || ''}
                placeholder="https://instagram.com/hampiragency"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                LinkedIn URL
              </label>
              <input
                name="linkedin"
                defaultValue={settings.linkedin || ''}
                placeholder="https://linkedin.com/company/hampiragency"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                GitHub URL
              </label>
              <input
                name="github"
                defaultValue={settings.github || ''}
                placeholder="https://github.com/hampiragency"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-xs text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {saved && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Pengaturan website berhasil disimpan!</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs disabled:opacity-70 cursor-pointer"
          >
            {pending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            <span>Simpan Pengaturan</span>
          </button>
        </div>
      </form>
    </div>
  )
}

