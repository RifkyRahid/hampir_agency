'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Loader2, AlertCircle, ExternalLink, UploadCloud } from 'lucide-react'
import { createPortfolio, updatePortfolio, deletePortfolio } from '@/app/admin/portfolio/actions'
import { uploadImage } from '@/app/admin/upload'

type Portfolio = {
  id: string
  title: string
  slug: string
  description: string
  imageUrl: string
  gallery: string[]
  link: string | null
  category: string
  year: string | null
  challenge: string | null
  solution: string | null
  result: string | null
  client: string | null
  team: string | null
  serviceId: string | null
  serviceTitle: string | null
  createdAt: string
}

type ServiceOption = { id: string; title: string }
const categories = ['Web', 'Design', 'Video']
const inputClass =
  'w-full rounded-xl border border-border/70 bg-background/40 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-all duration-300 focus:border-primary focus:shadow-[0_0_0_1px_hsl(var(--primary)),0_0_18px_-4px_hsl(var(--primary))]'

export default function PortfolioManager({
  portfolios,
  services,
}: {
  portfolios: Portfolio[]
  services: ServiceOption[]
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Portfolio | null>(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [cover, setCover] = useState('')
  const [gallery, setGallery] = useState<string[]>([])
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)

  function openNew() {
    setEditing(null); setError(''); setCover(''); setGallery([]); setOpen(true)
  }
  function openEdit(p: Portfolio) {
    setEditing(p); setError(''); setCover(p.imageUrl || ''); setGallery(p.gallery || []); setOpen(true)
  }

  async function onCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingCover(true); setError('')
    const fd = new FormData(); fd.append('file', file)
    const res = await uploadImage(fd)
    setUploadingCover(false)
    if (res.error) { setError(res.error); return }
    if (res.url) setCover(res.url)
  }

  async function onGalleryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploadingGallery(true); setError('')
    for (const file of files) {
      const fd = new FormData(); fd.append('file', file)
      const res = await uploadImage(fd)
      if (res.error) { setError(res.error); continue }
      if (res.url) setGallery((g) => [...g, res.url as string])
    }
    setUploadingGallery(false)
    e.target.value = ''
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    if (!cover) { setError('Please upload a cover image.'); return }
    setPending(true)
    const fd = new FormData(e.currentTarget)
    fd.set('imageUrl', cover)
    fd.set('gallery', JSON.stringify(gallery))
    const res = editing ? await updatePortfolio(editing.id, fd) : await createPortfolio(fd)
    setPending(false)
    if (res?.error) { setError(res.error); return }
    setOpen(false); router.refresh()
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this portfolio item?')) return
    setDeletingId(id)
    const res = await deletePortfolio(id)
    setDeletingId(null)
    if (res?.error) window.alert(res.error); else router.refresh()
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Portfolio</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your case studies and past work.</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_0_24px_-6px_hsl(var(--primary))] transition-transform hover:scale-[1.03]">
          <Plus className="h-4 w-4" /> New Portfolio
        </button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-border/60 bg-card/40 backdrop-blur-xl">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border/60 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-6 py-4 font-medium">Project</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Case Study</th>
              <th className="px-6 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {portfolios.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">No portfolio items yet. Click “New Portfolio” to add one.</td></tr>
            )}
            {portfolios.map((p) => (
              <tr key={p.id} className="transition-colors hover:bg-background/30">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-background/40">
                      {p.imageUrl && (p.imageUrl.startsWith('/uploads') || p.imageUrl.startsWith('http')) ? (
                        <Image src={p.imageUrl} alt={p.title} fill sizes="64px" className="object-cover" />
                      ) : null}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{p.title}</p>
                      <p className="mt-0.5 font-mono text-xs text-muted-foreground">/{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4"><span className="rounded-full border border-border/60 bg-background/40 px-2.5 py-1 text-xs font-medium text-primary/80">{p.category}</span></td>
                <td className="px-6 py-4">
                  <a href={`/portfolio/${p.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">View <ExternalLink className="h-3.5 w-3.5" /></a>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(p)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-background/40 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(p.id)} disabled={deletingId === p.id} className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-background/40 text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive disabled:opacity-50">{deletingId === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 16 }} transition={{ type: 'spring', stiffness: 300, damping: 26 }} className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-border/60 bg-card/95 p-6 backdrop-blur-xl sm:p-8">
              <button onClick={() => setOpen(false)} className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">{editing ? 'Edit Portfolio' : 'New Portfolio'}</h2>

              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2"><label className="text-sm font-medium text-foreground">Title</label><input name="title" defaultValue={editing?.title || ''} placeholder="Project title" className={inputClass} /></div>
                  <div className="flex flex-col gap-2"><label className="text-sm font-medium text-foreground">Slug (optional)</label><input name="slug" defaultValue={editing?.slug || ''} placeholder="auto-from-title" className={inputClass} /></div>
                </div>
                <div className="flex flex-col gap-2"><label className="text-sm font-medium text-foreground">Short description / Overview</label><textarea name="description" rows={2} defaultValue={editing?.description || ''} placeholder="One-line overview" className={`${inputClass} resize-none`} /></div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="flex flex-col gap-2"><label className="text-sm font-medium text-foreground">Category</label><select name="category" defaultValue={editing?.category || 'Web'} className={inputClass}>{categories.map((c) => (<option key={c} value={c} className="bg-card">{c}</option>))}</select></div>
                  <div className="flex flex-col gap-2"><label className="text-sm font-medium text-foreground">Year</label><input name="year" defaultValue={editing?.year || ''} placeholder="2025" className={inputClass} /></div>
                  <div className="flex flex-col gap-2"><label className="text-sm font-medium text-foreground">Related Service</label><select name="serviceId" defaultValue={editing?.serviceId || ''} className={inputClass}><option value="" className="bg-card">None</option>{services.map((s) => (<option key={s.id} value={s.id} className="bg-card">{s.title}</option>))}</select></div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2"><label className="text-sm font-medium text-foreground">Client (optional)</label><input name="client" defaultValue={editing?.client || ''} placeholder="Client name" className={inputClass} /></div>
                  <div className="flex flex-col gap-2"><label className="text-sm font-medium text-foreground">Team / Disciplines</label><input name="team" defaultValue={editing?.team || ''} placeholder="Design, Frontend, Video" className={inputClass} /></div>
                </div>
                <div className="flex flex-col gap-2"><label className="text-sm font-medium text-foreground">Challenge</label><textarea name="challenge" rows={3} defaultValue={editing?.challenge || ''} placeholder="What was the problem to solve?" className={`${inputClass} resize-none`} /></div>
                <div className="flex flex-col gap-2"><label className="text-sm font-medium text-foreground">Solution / Process</label><textarea name="solution" rows={3} defaultValue={editing?.solution || ''} placeholder="How did HAMPIR approach it?" className={`${inputClass} resize-none`} /></div>
                <div className="flex flex-col gap-2"><label className="text-sm font-medium text-foreground">Result / Outcome</label><textarea name="result" rows={3} defaultValue={editing?.result || ''} placeholder="The final result" className={`${inputClass} resize-none`} /></div>
                <div className="flex flex-col gap-2"><label className="text-sm font-medium text-foreground">Project Link (optional)</label><input name="link" defaultValue={editing?.link || ''} placeholder="https://..." className={inputClass} /></div>

                {/* Cover upload */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground">Cover Image</label>
                  <div className="flex items-center gap-4">
                    <div className="relative h-24 w-36 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-background/40">
                      {cover ? <Image src={cover} alt="cover" fill sizes="144px" className="object-cover" /> : <span className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">No image</span>}
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border/70 bg-background/40 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/50">
                      {uploadingCover ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />} Upload
                      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onCoverChange} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Gallery upload */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground">Gallery Images</label>
                  <div className="flex flex-wrap gap-2">
                    {gallery.map((g, i) => (
                      <div key={i} className="relative h-20 w-28 overflow-hidden rounded-lg border border-border/60">
                        <Image src={g} alt={`g${i}`} fill sizes="112px" className="object-cover" />
                        <button type="button" onClick={() => setGallery((arr) => arr.filter((_, j) => j !== i))} className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-md bg-background/80 text-muted-foreground hover:text-destructive"><X className="h-3.5 w-3.5" /></button>
                      </div>
                    ))}
                    <label className="flex h-20 w-28 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border/70 bg-background/40 text-xs text-muted-foreground transition-colors hover:border-primary/50">
                      {uploadingGallery ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />} Add
                      <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={onGalleryChange} className="hidden" />
                    </label>
                  </div>
                </div>

                {error && (<div className="flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"><AlertCircle className="h-4 w-4 shrink-0" />{error}</div>)}

                <div className="mt-2 flex justify-end gap-3">
                  <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-border/70 bg-background/40 px-5 py-2.5 text-sm font-medium text-foreground">Cancel</button>
                  <button type="submit" disabled={pending} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-70">{pending && <Loader2 className="h-4 w-4 animate-spin" />}{editing ? 'Save Changes' : 'Create Portfolio'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
