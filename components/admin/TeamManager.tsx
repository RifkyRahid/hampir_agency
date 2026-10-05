'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Plus, Pencil, Trash2, X, Loader2, AlertCircle, CheckCircle, EyeOff, User } from 'lucide-react'
import { createTeamMember, updateTeamMember, deleteTeamMember } from '@/app/admin/team/actions'
import ImageField from '@/components/admin/ImageField'

type TeamMember = {
  id: string
  name: string
  roleId: string
  roleEn: string | null
  bioId: string | null
  bioEn: string | null
  photoUrl: string | null
  skills: string[]
  order: number
  isActive: boolean
}

const inputClass =
  'w-full rounded-xl border border-border bg-card px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20'

export default function TeamManager({ members }: { members: TeamMember[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<TeamMember | null>(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [langTab, setLangTab] = useState<'id' | 'en'>('id')
  const [photoUrl, setPhotoUrl] = useState('')

  function openNew() {
    setEditing(null)
    setError('')
    setPhotoUrl('')
    setLangTab('id')
    setOpen(true)
  }

  function openEdit(m: TeamMember) {
    setEditing(m)
    setError('')
    setPhotoUrl(m.photoUrl || '')
    setLangTab('id')
    setOpen(true)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setPending(true)
    const fd = new FormData(e.currentTarget)
    fd.set('photoUrl', photoUrl)

    const res = editing ? await updateTeamMember(editing.id, fd) : await createTeamMember(fd)
    setPending(false)

    if (res?.error) {
      setError(res.error)
      return
    }

    setOpen(false)
    router.refresh()
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Hapus anggota tim "${name}"?`)) return
    setDeletingId(id)
    const res = await deleteTeamMember(id)
    setDeletingId(null)
    if (res?.error) window.alert(res.error)
    else router.refresh()
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold tracking-tight text-foreground">
            Anggota Tim
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Kelola profil tim kreator & developer yang tampil di halaman Tentang Kami.
          </p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Tambah Anggota</span>
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-surface/50 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3">Profil</th>
              <th className="px-5 py-3">Peran / Jabatan</th>
              <th className="px-5 py-3">Keahlian</th>
              <th className="px-5 py-3">Urutan</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {members.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">
                  Belum ada data tim. Klik tombol "Tambah Anggota" di atas.
                </td>
              </tr>
            )}
            {members.map((m) => (
              <tr key={m.id} className="hover:bg-surface/30 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-surface flex items-center justify-center">
                      {m.photoUrl ? (
                        <Image
                          src={m.photoUrl}
                          alt={m.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{m.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <p className="font-medium text-foreground">{m.roleId}</p>
                  <p className="text-[11px] text-muted-foreground">EN: {m.roleEn || '—'}</p>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex flex-wrap gap-1">
                    {m.skills.slice(0, 3).map((s, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-surface px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                      >
                        {s}
                      </span>
                    ))}
                    {m.skills.length > 3 && (
                      <span className="text-[10px] text-muted-foreground self-center">
                        +{m.skills.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3.5 font-mono text-muted-foreground">{m.order}</td>
                <td className="px-5 py-3.5">
                  {m.isActive ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="h-3 w-3" /> Aktif
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
                      <EyeOff className="h-3 w-3" /> Nonaktif
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => openEdit(m)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                      title="Ubah"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(m.id, m.name)}
                      disabled={deletingId === m.id}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground hover:text-destructive hover:border-destructive/50 transition-colors disabled:opacity-50"
                      title="Hapus"
                    >
                      {deletingId === m.id ? (
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
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            <h2 className="text-lg font-serif font-bold text-foreground">
              {editing ? 'Ubah Profil Tim' : 'Tambah Anggota Tim'}
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
                🇮🇩 Bahasa Indonesia
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
                🇬🇧 English
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Photo Upload with specs */}
              <ImageField
                label="Foto Profil Anggota Tim"
                kind="team-photo"
                value={photoUrl}
                onChange={setPhotoUrl}
              />

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Nama Lengkap *
                </label>
                <input
                  name="name"
                  defaultValue={editing?.name || ''}
                  required
                  placeholder="Contoh: Rifky Pratama"
                  className={inputClass}
                />
              </div>

              {/* ID Content Tab */}
              <div className={langTab === 'id' ? 'space-y-3' : 'hidden'}>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Peran / Jabatan (ID) *
                  </label>
                  <input
                    name="roleId"
                    defaultValue={editing?.roleId || ''}
                    required
                    placeholder="Contoh: Lead Technical Architect"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Biografi Singkat (ID)
                  </label>
                  <textarea
                    name="bioId"
                    rows={2}
                    defaultValue={editing?.bioId || ''}
                    placeholder="Deskripsi singkat pengalaman atau fokus kerja..."
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>

              {/* EN Content Tab */}
              <div className={langTab === 'en' ? 'space-y-3' : 'hidden'}>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Role / Position (EN)
                  </label>
                  <input
                    name="roleEn"
                    defaultValue={editing?.roleEn || ''}
                    placeholder="e.g. Lead Technical Architect"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Short Bio (EN)
                  </label>
                  <textarea
                    name="bioEn"
                    rows={2}
                    defaultValue={editing?.bioEn || ''}
                    placeholder="Brief bio or focus area..."
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Keahlian / Skills (pisahkan dengan koma)
                </label>
                <input
                  name="skills"
                  defaultValue={editing?.skills.join(', ') || ''}
                  placeholder="Next.js, TypeScript, UI/UX, Cloud"
                  className={inputClass}
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-foreground">
                  <input
                    type="checkbox"
                    name="isActive"
                    value="true"
                    defaultChecked={editing ? editing.isActive : true}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span>Tampilkan di Halaman Publik (Aktif)</span>
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
                  <span>{editing ? 'Simpan' : 'Tambah'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

