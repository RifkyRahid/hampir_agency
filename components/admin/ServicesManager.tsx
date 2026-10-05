'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, X, Loader2, AlertCircle, Search } from 'lucide-react'
import { createService, updateService, deleteService } from '@/app/admin/services/actions'

type Service = {
  id: string
  slug: string
  titleId: string
  titleEn: string | null
  descriptionId: string
  descriptionEn: string | null
  featuresId: string[]
  featuresEn: string[]
  icon: string | null
  order: number
  isActive: boolean
  createdAt: string
}

const inputClass =
  'w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20'

export default function ServicesManager({ services }: { services: Service[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'id' | 'en'>('id')
  const [search, setSearch] = useState('')

  function openNew() {
    setEditing(null)
    setError('')
    setActiveTab('id')
    setOpen(true)
  }

  function openEdit(s: Service) {
    setEditing(s)
    setError('')
    setActiveTab('id')
    setOpen(true)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setPending(true)
    const fd = new FormData(e.currentTarget)
    const res = editing ? await updateService(editing.id, fd) : await createService(fd)
    setPending(false)
    if (res?.error) {
      setError(res.error)
      return
    }
    setOpen(false)
    router.refresh()
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Hapus layanan "${name}"? Tindakan ini tidak dapat dibatalkan.`)) return
    setDeletingId(id)
    const res = await deleteService(id)
    setDeletingId(null)
    if (res?.error) window.alert(res.error)
    else router.refresh()
  }

  const filtered = services.filter((s) =>
    s.titleId.toLowerCase().includes(search.toLowerCase()) ||
    (s.titleEn && s.titleEn.toLowerCase().includes(search.toLowerCase())) ||
    s.slug.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {/* Top Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold tracking-tight text-foreground">
            Kelola Layanan
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            {services.length} layanan terdaftar · Otomatis tampil di halaman Beranda & Layanan.
          </p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Tambah Layanan</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="mb-4 max-w-sm relative">
        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama atau slug layanan..."
          className="w-full rounded-xl border border-border bg-card pl-9 pr-3.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-surface/50 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3">Layanan</th>
              <th className="px-5 py-3">Urutan</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-muted-foreground">
                  Tidak ada data layanan ditemukan.
                </td>
              </tr>
            )}
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-surface/30 transition-colors">
                <td className="px-5 py-3.5">
                  <p className="font-semibold text-foreground text-sm">{s.titleId}</p>
                  <p className="text-[11px] text-muted-foreground">EN: {s.titleEn || '—'}</p>
                  <p className="font-mono text-[10px] text-accent mt-0.5">/{s.slug}</p>
                </td>
                <td className="px-5 py-3.5 font-mono text-muted-foreground">
                  {s.order}
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      s.isActive
                        ? 'bg-primary-soft text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {s.isActive ? 'Aktif' : 'Nonaktif'}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => openEdit(s)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                      title="Ubah"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(s.id, s.titleId)}
                      disabled={deletingId === s.id}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground hover:text-destructive hover:border-destructive/50 transition-colors disabled:opacity-50"
                      title="Hapus"
                    >
                      {deletingId === s.id ? (
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

      {/* Modal CRUD */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-foreground/30 backdrop-blur-xs"
          />
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            <h2 className="text-lg font-serif font-bold text-foreground">
              {editing ? 'Ubah Layanan' : 'Tambah Layanan Baru'}
            </h2>

            {/* Language Tabs */}
            <div className="flex items-center gap-2 mt-4 border-b border-border pb-2">
              <button
                type="button"
                onClick={() => setActiveTab('id')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  activeTab === 'id'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                🇮🇩 Bahasa Indonesia
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('en')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  activeTab === 'en'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                🇬🇧 English
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Tab ID */}
              <div className={activeTab === 'id' ? 'space-y-3' : 'hidden'}>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Judul Layanan (ID) *
                  </label>
                  <input
                    name="titleId"
                    defaultValue={editing?.titleId || ''}
                    required
                    placeholder="Contoh: Pengembangan Web & Aplikasi"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Deskripsi Layanan (ID) *
                  </label>
                  <textarea
                    name="descriptionId"
                    defaultValue={editing?.descriptionId || ''}
                    required
                    rows={3}
                    placeholder="Ringkasan cakupan layanan..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Daftar Fitur / Deliverables (ID)
                  </label>
                  <textarea
                    name="featuresId"
                    defaultValue={editing?.featuresId?.join('\n') || ''}
                    rows={4}
                    placeholder="Tulis satu fitur per baris..."
                    className={`${inputClass} font-mono`}
                  />
                  <span className="text-[10px] text-muted-foreground">
                    Satu fitur per baris (akan otomatis dijadikan poin ceklis).
                  </span>
                </div>
              </div>

              {/* Tab EN */}
              <div className={activeTab === 'en' ? 'space-y-3' : 'hidden'}>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Service Title (EN)
                  </label>
                  <input
                    name="titleEn"
                    defaultValue={editing?.titleEn || ''}
                    placeholder="e.g. Web & App Engineering"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Service Description (EN)
                  </label>
                  <textarea
                    name="descriptionEn"
                    defaultValue={editing?.descriptionEn || ''}
                    rows={3}
                    placeholder="Summary of service capabilities..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Features / Deliverables (EN)
                  </label>
                  <textarea
                    name="featuresEn"
                    defaultValue={editing?.featuresEn?.join('\n') || ''}
                    rows={4}
                    placeholder="One feature per line..."
                    className={`${inputClass} font-mono`}
                  />
                </div>
              </div>

              {/* Shared Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-border">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Slug URL
                  </label>
                  <input
                    name="slug"
                    defaultValue={editing?.slug || ''}
                    placeholder="auto-dari-judul"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Ikon Lucide
                  </label>
                  <input
                    name="icon"
                    defaultValue={editing?.icon || 'code'}
                    placeholder="code, palette, camera, database"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Urutan Tampil
                  </label>
                  <input
                    name="order"
                    type="number"
                    defaultValue={editing?.order ?? 0}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  defaultChecked={editing ? editing.isActive : true}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="isActive" className="text-xs font-medium text-foreground cursor-pointer">
                  Aktifkan (Tampil di website publik)
                </label>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
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
                  <span>{editing ? 'Simpan Perubahan' : 'Buat Layanan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

