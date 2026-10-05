'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  ExternalLink,
  Star,
  CheckCircle,
  EyeOff,
  Video,
} from 'lucide-react'
import { createPortfolio, updatePortfolio, deletePortfolio } from '@/app/admin/portfolio/actions'
import ImageField from '@/components/admin/ImageField'
import { uploadImage } from '@/app/admin/upload'

type PortfolioItem = {
  id: string
  slug: string
  titleId: string
  titleEn: string | null
  summaryId: string
  summaryEn: string | null
  coverUrl: string
  gallery: string[]
  client: string | null
  year: string | null
  link: string | null
  videoUrl: string | null
  challengeId: string | null
  challengeEn: string | null
  solutionId: string | null
  solutionEn: string | null
  resultId: string | null
  resultEn: string | null
  featured: boolean
  isPublished: boolean
  order: number
  categoryId: string
  categoryName?: string
  serviceId: string | null
  serviceTitle?: string | null
  createdAt: string
}

type CategoryOption = { id: string; nameId: string }
type ServiceOption = { id: string; titleId: string }

const inputClass =
  'w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20'

export default function PortfolioManager({
  portfolios,
  categories,
  services,
}: {
  portfolios: PortfolioItem[]
  categories: CategoryOption[]
  services: ServiceOption[]
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<PortfolioItem | null>(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [langTab, setLangTab] = useState<'id' | 'en'>('id')

  // Media state
  const [coverUrl, setCoverUrl] = useState('')
  const [gallery, setGallery] = useState<string[]>([])
  const [uploadingGallery, setUploadingGallery] = useState(false)

  function openNew() {
    setEditing(null)
    setError('')
    setCoverUrl('')
    setGallery([])
    setLangTab('id')
    setOpen(true)
  }

  function openEdit(p: PortfolioItem) {
    setEditing(p)
    setError('')
    setCoverUrl(p.coverUrl || '')
    setGallery(p.gallery || [])
    setLangTab('id')
    setOpen(true)
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploadingGallery(true)
    for (const f of files) {
      const fd = new FormData()
      fd.append('file', f)
      fd.append('kind', 'portfolio-gallery')
      const res = await uploadImage(fd)
      if (res.url) {
        setGallery((prev) => [...prev, res.url as string])
      }
    }
    setUploadingGallery(false)
    e.target.value = ''
  }

  function removeGalleryImage(index: number) {
    setGallery((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    if (!coverUrl) {
      setError('Foto sampul proyek wajib diunggah.')
      return
    }

    setPending(true)
    const fd = new FormData(e.currentTarget)
    fd.set('coverUrl', coverUrl)
    fd.set('gallery', JSON.stringify(gallery))

    const res = editing ? await updatePortfolio(editing.id, fd) : await createPortfolio(fd)
    setPending(false)

    if (res?.error) {
      setError(res.error)
      return
    }

    setOpen(false)
    router.refresh()
  }

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Hapus proyek portofolio "${title}"?`)) return
    setDeletingId(id)
    const res = await deletePortfolio(id)
    setDeletingId(null)
    if (res?.error) window.alert(res.error)
    else router.refresh()
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold tracking-tight text-foreground">
            Portofolio Proyek
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Kelola studi kasus dan proyek yang ditampilkan pada website.
          </p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Tambah Proyek</span>
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-surface/50 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3">Proyek</th>
              <th className="px-5 py-3">Kategori</th>
              <th className="px-5 py-3">Klien & Tahun</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {portfolios.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-muted-foreground">
                  Belum ada portofolio. Klik tombol "Tambah Proyek" di atas.
                </td>
              </tr>
            )}
            {portfolios.map((p) => (
              <tr key={p.id} className="hover:bg-surface/30 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-surface">
                      {p.coverUrl && (
                        <Image
                          src={p.coverUrl}
                          alt={p.titleId}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground text-sm">{p.titleId}</p>
                        {p.featured && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                            <Star className="h-2.5 w-2.5 fill-current" /> Unggulan
                          </span>
                        )}
                        {p.videoUrl && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:text-blue-300">
                            <Video className="h-2.5 w-2.5" /> Video
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-[11px] text-muted-foreground">/{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                    {p.categoryName || '—'}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-muted-foreground">
                  <p className="text-foreground">{p.client || '—'}</p>
                  <p className="text-[11px]">{p.year || '—'}</p>
                </td>
                <td className="px-5 py-3.5">
                  {p.isPublished ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="h-3 w-3" /> Publik
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
                      <EyeOff className="h-3 w-3" /> Draf
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <a
                      href={`/id/portfolio/${p.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground hover:text-foreground transition-colors"
                      title="Lihat Proyek"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <button
                      onClick={() => openEdit(p)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                      title="Ubah"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.titleId)}
                      disabled={deletingId === p.id}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground hover:text-destructive hover:border-destructive/50 transition-colors disabled:opacity-50"
                      title="Hapus"
                    >
                      {deletingId === p.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Dialog */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-foreground/30 backdrop-blur-xs"
          />
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            <h2 className="text-lg font-serif font-bold text-foreground">
              {editing ? 'Ubah Proyek Portofolio' : 'Tambah Proyek Portofolio'}
            </h2>

            {/* Language Switch Tabs */}
            <div className="mt-4 flex border-b border-border">
              <button
                type="button"
                onClick={() => setLangTab('id')}
                className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
                  langTab === 'id'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                🇮🇩 Bahasa Indonesia (Wajib)
              </button>
              <button
                type="button"
                onClick={() => setLangTab('en')}
                className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
                  langTab === 'en'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                🇬🇧 English (Opsional)
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Cover Image Upload with Specs Note */}
              <ImageField
                label="Foto Sampul Proyek (Cover)"
                kind="portfolio-cover"
                value={coverUrl}
                onChange={setCoverUrl}
              />

              {/* ID Content Tab */}
              <div className={langTab === 'id' ? 'space-y-3' : 'hidden'}>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Judul Proyek (ID) *
                  </label>
                  <input
                    name="titleId"
                    defaultValue={editing?.titleId || ''}
                    required
                    placeholder="Contoh: Modern Web App Redesign"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Ringkasan Singkat (ID) *
                  </label>
                  <textarea
                    name="summaryId"
                    rows={2}
                    defaultValue={editing?.summaryId || ''}
                    required
                    placeholder="Deskripsi singkat proyek untuk kartu portofolio..."
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Tantangan / Problem (ID)
                  </label>
                  <textarea
                    name="challengeId"
                    rows={2}
                    defaultValue={editing?.challengeId || ''}
                    placeholder="Apa tantangan utama yang dihadapi klien?"
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Solusi / Pendekatan (ID)
                  </label>
                  <textarea
                    name="solutionId"
                    rows={2}
                    defaultValue={editing?.solutionId || ''}
                    placeholder="Bagaimana Hampir Agency mengeksekusi solusinya?"
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Hasil / Dampak (ID)
                  </label>
                  <textarea
                    name="resultId"
                    rows={2}
                    defaultValue={editing?.resultId || ''}
                    placeholder="Hasil terukur (cth: kenaikan konversi 45%)..."
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>

              {/* EN Content Tab */}
              <div className={langTab === 'en' ? 'space-y-3' : 'hidden'}>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Project Title (EN)
                  </label>
                  <input
                    name="titleEn"
                    defaultValue={editing?.titleEn || ''}
                    placeholder="e.g. Modern Web App Redesign"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Summary (EN)
                  </label>
                  <textarea
                    name="summaryEn"
                    rows={2}
                    defaultValue={editing?.summaryEn || ''}
                    placeholder="Brief project summary for cards..."
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Challenge (EN)
                  </label>
                  <textarea
                    name="challengeEn"
                    rows={2}
                    defaultValue={editing?.challengeEn || ''}
                    placeholder="What was the core problem?"
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Solution (EN)
                  </label>
                  <textarea
                    name="solutionEn"
                    rows={2}
                    defaultValue={editing?.solutionEn || ''}
                    placeholder="How did Hampir Agency deliver the solution?"
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Result (EN)
                  </label>
                  <textarea
                    name="resultEn"
                    rows={2}
                    defaultValue={editing?.resultEn || ''}
                    placeholder="Measurable results..."
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>

              {/* General Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-border">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Kategori *
                  </label>
                  <select
                    name="categoryId"
                    defaultValue={editing?.categoryId || categories[0]?.id || ''}
                    required
                    className={inputClass}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nameId}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Layanan Terkait
                  </label>
                  <select
                    name="serviceId"
                    defaultValue={editing?.serviceId || ''}
                    className={inputClass}
                  >
                    <option value="">— Tidak Terikat Layanan —</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.titleId}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Slug URL (Opsional)
                  </label>
                  <input
                    name="slug"
                    defaultValue={editing?.slug || ''}
                    placeholder="auto-dari-judul"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Klien</label>
                  <input
                    name="client"
                    defaultValue={editing?.client || ''}
                    placeholder="Contoh: PT Batam Tech"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Tahun</label>
                  <input
                    name="year"
                    defaultValue={editing?.year || '2025'}
                    placeholder="2025"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Tautan Proyek Live (Website)
                  </label>
                  <input
                    name="link"
                    defaultValue={editing?.link || ''}
                    placeholder="https://..."
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Tautan Video Showcase (YouTube / Vimeo / MP4)
                  </label>
                  <input
                    name="videoUrl"
                    defaultValue={editing?.videoUrl || ''}
                    placeholder="https://www.youtube.com/watch?v=... atau https://vimeo.com/..."
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Gallery Images */}
              <div className="pt-2 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-foreground">
                    Galeri Gambar Tambahan (16:9 / 4:3, maks 2MB per foto)
                  </label>
                  <label className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-foreground hover:bg-surface/80">
                    {uploadingGallery ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Plus className="h-3 w-3" />
                    )}
                    <span>Tambah Foto</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={handleGalleryUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex flex-wrap gap-2">
                  {gallery.length === 0 && (
                    <p className="text-xs text-muted-foreground italic">Belum ada foto galeri.</p>
                  )}
                  {gallery.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative h-20 w-32 overflow-hidden rounded-xl border border-border bg-surface"
                    >
                      <Image
                        src={url}
                        alt={`Galeri ${idx + 1}`}
                        fill
                        sizes="128px"
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(idx)}
                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-md bg-foreground/80 text-background hover:bg-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status and Order */}
              <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-border">
                <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-foreground">
                  <input
                    type="checkbox"
                    name="featured"
                    defaultChecked={editing ? editing.featured : false}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span>Tampilkan sebagai Proyek Unggulan (Featured)</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-foreground">
                  <input
                    type="checkbox"
                    name="isPublished"
                    value="true"
                    defaultChecked={editing ? editing.isPublished : true}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span>Publikasikan (Aktif)</span>
                </label>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-semibold text-foreground">Urutan:</label>
                  <input
                    name="order"
                    type="number"
                    defaultValue={editing?.order ?? 0}
                    className="w-16 rounded-xl border border-border bg-card px-2 py-1 text-xs text-foreground"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-foreground hover:bg-surface"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-70 cursor-pointer"
                >
                  {pending && <Loader2 className="h-3 w-3 animate-spin" />}
                  <span>{editing ? 'Simpan Perubahan' : 'Buat Proyek'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
