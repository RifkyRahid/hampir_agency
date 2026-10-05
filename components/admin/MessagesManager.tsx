'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2, Mail, MailOpen, Check, Phone, MessageSquare } from 'lucide-react'
import { markAsRead, deleteMessage } from '@/app/admin/messages/actions'

type Message = {
  id: string
  name: string
  email: string
  phone: string | null
  interest: string | null
  message: string
  locale: string
  isRead: boolean
  createdAt: string
}

export default function MessagesManager({ messages }: { messages: Message[] }) {
  const router = useRouter()
  const [busyId, setBusyId] = useState<string | null>(null)

  async function toggleRead(m: Message) {
    setBusyId(m.id)
    const res = await markAsRead(m.id, !m.isRead)
    setBusyId(null)
    if (res?.error) window.alert(res.error)
    else router.refresh()
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Hapus pesan ini secara permanen?')) return
    setBusyId(id)
    const res = await deleteMessage(id)
    setBusyId(null)
    if (res?.error) window.alert(res.error)
    else router.refresh()
  }

  const unreadCount = messages.filter((m) => !m.isRead).length

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold tracking-tight text-foreground">
          Pesan Masuk (Kontak)
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          {messages.length} total pesan · {unreadCount} belum dibaca
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center text-xs text-muted-foreground">
          Belum ada pesan masuk dari formulir kontak publik.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`relative overflow-hidden rounded-2xl border p-5 transition-colors ${
                m.isRead ? 'border-border bg-card' : 'border-primary/40 bg-primary/[0.02]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                      m.isRead
                        ? 'border-border bg-surface text-muted-foreground'
                        : 'border-primary/20 bg-primary/10 text-primary'
                    }`}
                  >
                    {m.isRead ? <MailOpen className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-foreground text-sm">{m.name}</p>
                      <span className="rounded-md bg-surface px-2 py-0.5 text-[10px] font-mono font-medium uppercase text-muted-foreground border border-border">
                        {m.locale}
                      </span>
                      {m.interest && (
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                          {m.interest}
                        </span>
                      )}
                      {!m.isRead && (
                        <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                          Baru
                        </span>
                      )}
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <a href={`mailto:${m.email}`} className="text-primary hover:underline">
                        {m.email}
                      </a>
                      {m.phone && (
                        <a
                          href={`https://wa.me/${m.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline"
                        >
                          <Phone className="h-3 w-3" />
                          <span>{m.phone}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => toggleRead(m)}
                    disabled={busyId === m.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold text-foreground hover:bg-surface/80 transition-colors disabled:opacity-50"
                  >
                    {busyId === m.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Check className="h-3 w-3" />
                    )}
                    <span>{m.isRead ? 'Tandai Belum Dibaca' : 'Tandai Sudah Dibaca'}</span>
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    disabled={busyId === m.id}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground hover:text-destructive hover:border-destructive/50 transition-colors disabled:opacity-50"
                    title="Hapus"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-3 rounded-xl bg-surface/50 border border-border/50 p-3.5 text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed">
                {m.message}
              </div>

              <div className="mt-2.5 text-[11px] text-muted-foreground">
                Diterima:{' '}
                {new Date(m.createdAt).toLocaleString('id-ID', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

