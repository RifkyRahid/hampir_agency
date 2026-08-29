'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2, Mail, MailOpen, Check } from 'lucide-react'
import { markAsRead, deleteMessage } from '@/app/admin/messages/actions'

type Message = {
  id: string
  name: string
  email: string
  message: string
  isRead: boolean
  createdAt: string
}

export default function MessagesManager({
  messages,
}: {
  messages: Message[]
}) {
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
    if (!window.confirm('Delete this message?')) return
    setBusyId(id)
    const res = await deleteMessage(id)
    setBusyId(null)
    if (res?.error) window.alert(res.error)
    else router.refresh()
  }

  const unreadCount = messages.filter((m) => !m.isRead).length

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Messages
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {messages.length} total · {unreadCount} unread
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="rounded-3xl border border-border/60 bg-card/40 p-12 text-center text-muted-foreground backdrop-blur-xl">
          No messages yet. Submissions from the public Contact form will appear here.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`relative overflow-hidden rounded-3xl border bg-card/40 p-6 backdrop-blur-xl transition-colors ${
                m.isRead ? 'border-border/60' : 'border-primary/40'
              }`}
            >
              {!m.isRead && (
                <span className="absolute right-6 top-6 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary ring-1 ring-primary/25">
                  Unread
                </span>
              )}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/25">
                  {m.isRead ? (
                    <MailOpen className="h-5 w-5" />
                  ) : (
                    <Mail className="h-5 w-5" />
                  )}
                </span>
                <div>
                  <p className="font-medium text-foreground">{m.name}</p>
                  <a
                    href={`mailto:${m.email}`}
                    className="text-sm text-primary/80 hover:underline"
                  >
                    {m.email}
                  </a>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {m.message}
              </p>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {new Date(m.createdAt).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleRead(m)}
                    disabled={busyId === m.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/40 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary disabled:opacity-50"
                  >
                    {busyId === m.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Check className="h-3.5 w-3.5" />
                    )}
                    {m.isRead ? 'Mark Unread' : 'Mark Read'}
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    disabled={busyId === m.id}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 bg-background/40 text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
