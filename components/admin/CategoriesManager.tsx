'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, X, Loader2, AlertCircle } from 'lucide-react'
import { createCategory, updateCategory, deleteCategory } from '@/app/admin/categories/actions'

type Category = {
  id: string
  slug: string
  nameId: string
  nameEn: string | null
  order: number
  _count?: { portfolios: number }
}

const inputClass =
  'w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20'

export default function CategoriesManager({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  function openNew() {
    setEditing(null)
    setError('')
    setOpen(true)
  }

  function openEdit(c: Category) {
    setEditing(c)
    setError('')
    setOpen(true)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setPending(true)
    const fd = new FormData(e.currentTarget)
    const res = editing ? await updateCategory(editing.id, fd) : await createCategory(fd)
    setPending(false)
    if (res?.error) {
      setError(res.error)
      return
    }
    setOpen(false)
    router.refresh()
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Hapus kategori "${name}"?`)) return
    setDeletingId(id)
    const res = await deleteCategory(id)
    setDeletingId(null)
    if (res?.error) window.alert(res.error)
    else router.refresh()
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold tracking-tight text-foreground">
            Kategori Portofolio
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Daftar kategori untuk filter portofolio di website publik.
          </p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Tambah Kategori</span>
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-surface/50 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3">Nama Kategori</th>
              <th className="px-5 py-3">Slug</th>
              <th className="px-5 py-3">Urutan</th>
              <th className="px-5 py-3">Jumlah Proyek</th>
              <th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-surface/30 transition-colors">
                <td className="px-5 py-3.5">
                  <p className="font-semibold text-foreground text-sm">{c.nameId}</p>
                  <p className="text-[11px] text-muted-foreground">EN: {c.nameEn || '—'}</p>
                </td>
                <td className="px-5 py-3.5 font-mono text-accent">/{c.slug}</td>
                <td className="px-5 py-3.5 font-mono text-muted-foreground">{c.order}</td>
                <td className="px-5 py-3.5">
                  <span className="rounded-full bg-surface px-2.5 py-0.5 text-[11px] font-semibold text-foreground">
                    {c._count?.portfolios ?? 0}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => openEdit(c)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                      title="Ubah"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id, c.nameId)}
                      disabled={deletingId === c.id}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground hover:text-destructive hover:border-destructive/50 transition-colors disabled:opacity-50"
                      title="Hapus"
                    >
                      {deletingId === c.id ? (
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

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-foreground/30 backdrop-blur-xs"
          />
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            <h2 className="text-lg font-serif font-bold text-foreground">
              {editing ? 'Ubah Kategori' : 'Tambah Kategori'}
            </h2>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Nama Kategori (ID) *
                </label>
                <input
                  name="nameId"
                  defaultValue={editing?.nameId || ''}
                  required
                  placeholder="Contoh: Web & Aplikasi"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Nama Kategori (EN)
                </label>
                <input
                  name="nameEn"
                  defaultValue={editing?.nameEn || ''}
                  placeholder="e.g. Web & Applications"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Slug URL
                  </label>
                  <input
                    name="slug"
                    defaultValue={editing?.slug || ''}
                    placeholder="web"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Urutan
                  </label>
                  <input
                    name="order"
                    type="number"
                    defaultValue={editing?.order ?? 0}
                    className={inputClass}
                  />
                </div>
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
                  <span>{editing ? 'Simpan' : 'Buat'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

