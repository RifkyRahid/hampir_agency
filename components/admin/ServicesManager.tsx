'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Loader2, AlertCircle } from 'lucide-react'
import {
  createService,
  updateService,
  deleteService,
} from '@/app/admin/services/actions'

type Service = {
  id: string
  title: string
  description: string
  icon: string | null
  isActive: boolean
  createdAt: string
}

const inputClass =
  'w-full rounded-xl border border-border/70 bg-background/40 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-all duration-300 focus:border-primary focus:shadow-[0_0_0_1px_hsl(var(--primary)),0_0_18px_-4px_hsl(var(--primary))]'

export default function ServicesManager({
  services,
}: {
  services: Service[]
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  function openNew() {
    setEditing(null)
    setError('')
    setOpen(true)
  }

  function openEdit(s: Service) {
    setEditing(s)
    setError('')
    setOpen(true)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setPending(true)
    const fd = new FormData(e.currentTarget)
    const res = editing
      ? await updateService(editing.id, fd)
      : await createService(fd)
    setPending(false)
    if (res?.error) {
      setError(res.error)
      return
    }
    setOpen(false)
    router.refresh()
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this service? This cannot be undone.')) return
    setDeletingId(id)
    const res = await deleteService(id)
    setDeletingId(null)
    if (res?.error) window.alert(res.error)
    else router.refresh()
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Services
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the services your agency offers.
          </p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_0_24px_-6px_hsl(var(--primary))] transition-transform hover:scale-[1.03]"
        >
          <Plus className="h-4 w-4" />
          New Service
        </button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-border/60 bg-card/40 backdrop-blur-xl">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border/60 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-6 py-4 font-medium">Title</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Created At</th>
              <th className="px-6 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {services.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-muted-foreground"
                >
                  No services yet. Click “New Service” to add one.
                </td>
              </tr>
            )}
            {services.map((s) => (
              <tr key={s.id} className="transition-colors hover:bg-background/30">
                <td className="px-6 py-4">
                  <p className="font-medium text-foreground">{s.title}</p>
                  <p className="mt-0.5 line-clamp-1 max-w-md text-xs text-muted-foreground">
                    {s.description}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                      s.isActive
                        ? 'bg-primary/10 text-primary ring-1 ring-primary/25'
                        : 'bg-muted text-muted-foreground ring-1 ring-border/60'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        s.isActive ? 'bg-primary' : 'bg-muted-foreground'
                      }`}
                    />
                    {s.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {new Date(s.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEdit(s)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-background/40 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      disabled={deletingId === s.id}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-background/40 text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive disabled:opacity-50"
                    >
                      {deletingId === s.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              className="relative w-full max-w-lg rounded-3xl border border-border/60 bg-card/95 p-6 backdrop-blur-xl sm:p-8"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                {editing ? 'Edit Service' : 'New Service'}
              </h2>

              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground">Title</label>
                  <input
                    name="title"
                    defaultValue={editing?.title || ''}
                    placeholder="e.g. Web & App Development"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    defaultValue={editing?.description || ''}
                    placeholder="Short description of the service"
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-foreground">
                    Icon (identifier / URL)
                  </label>
                  <input
                    name="icon"
                    defaultValue={editing?.icon || ''}
                    placeholder="e.g. code, palette, or an SVG URL"
                    className={inputClass}
                  />
                </div>
                <label className="flex items-center gap-3 text-sm text-foreground">
                  <input
                    type="checkbox"
                    name="isActive"
                    defaultChecked={editing ? editing.isActive : true}
                    className="h-4 w-4 rounded border-border bg-background/40 accent-[hsl(var(--primary))]"
                  />
                  Active (visible on the public site)
                </label>

                {error && (
                  <div className="flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                  </div>
                )}

                <div className="mt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-full border border-border/70 bg-background/40 px-5 py-2.5 text-sm font-medium text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={pending}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-70"
                  >
                    {pending && <Loader2 className="h-4 w-4 animate-spin" />}
                    {editing ? 'Save Changes' : 'Create Service'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
