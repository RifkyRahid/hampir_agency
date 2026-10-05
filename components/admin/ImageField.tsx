'use client'

import { useState } from 'react'
import Image from 'next/image'
import { UploadCloud, Loader2, Trash2, Info, AlertCircle } from 'lucide-react'
import { imageSpecs, type ImageKind } from '@/lib/image-specs'
import { uploadImage } from '@/app/admin/upload'

export default function ImageField({
  kind,
  label,
  value,
  onChange,
  className = '',
}: {
  kind: ImageKind
  label: string
  value: string
  onChange: (url: string) => void
  className?: string
}) {
  const spec = imageSpecs[kind]
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError('')

    const fd = new FormData()
    fd.append('file', file)
    fd.append('kind', kind)

    const res = await uploadImage(fd)
    setLoading(false)

    if (res?.error) {
      setError(res.error)
      return
    }
    if (res?.url) {
      onChange(res.url)
    }
  }

  const aspectClass = {
    logo: 'aspect-[3.3/1]',
    'portfolio-cover': 'aspect-[16/9]',
    'portfolio-gallery': 'aspect-[16/10]',
    'team-photo': 'aspect-[4/5]',
    'og-image': 'aspect-[1.91/1]',
  }[kind]

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-foreground">
          {label}
        </label>
      </div>

      {/* Recommended Spec Note */}
      <div className="flex items-start gap-2 rounded-xl border border-border/80 bg-surface/70 p-3 text-xs text-muted-foreground">
        <Info className="h-4 w-4 shrink-0 text-accent mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-medium text-foreground">
            Saran Ukuran: <span className="font-mono text-primary font-semibold">{spec.recommendedSize}</span> ({spec.aspectRatio})
          </p>
          <p className="text-[11px] leading-relaxed">
            Format: {spec.allowedFormats.map((f) => f.split('/')[1].toUpperCase()).join(', ')} · Maks {spec.maxSizeMB} MB. {spec.note}
          </p>
        </div>
      </div>

      {/* Preview & Upload Area */}
      <div className="flex flex-col sm:flex-row items-start gap-4">
        {/* Aspect Ratio Preview Container */}
        <div
          className={`relative ${aspectClass} w-full sm:w-56 shrink-0 overflow-hidden rounded-xl border border-border bg-surface flex items-center justify-center`}
        >
          {value ? (
            <Image
              src={value}
              alt={label}
              fill
              sizes="224px"
              className="object-cover"
            />
          ) : (
            <span className="text-xs text-muted-foreground font-mono">Belum ada gambar</span>
          )}
        </div>

        {/* Buttons & Input */}
        <div className="flex flex-col gap-2">
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-surface hover:border-primary/50 transition-colors">
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                <span>Mengunggah...</span>
              </>
            ) : (
              <>
                <UploadCloud className="h-3.5 w-3.5 text-primary" />
                <span>{value ? 'Ganti Foto' : 'Unggah Foto'}</span>
              </>
            )}
            <input
              type="file"
              accept={spec.allowedFormats.join(',')}
              onChange={handleFile}
              disabled={loading}
              className="hidden"
            />
          </label>

          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              disabled={loading}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-destructive hover:underline pt-1"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Hapus Foto</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

