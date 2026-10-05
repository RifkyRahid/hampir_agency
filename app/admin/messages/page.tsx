import { prisma } from '@/lib/prisma'
import MessagesManager from '@/components/admin/MessagesManager'

export const dynamic = 'force-dynamic'

async function getMessages() {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return messages.map((m) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      phone: m.phone,
      interest: m.interest,
      message: m.message,
      locale: m.locale,
      isRead: m.isRead,
      createdAt: m.createdAt.toISOString(),
    }))
  } catch (e) {
    console.error('getMessages error:', e)
    return []
  }
}

export default async function AdminMessagesPage() {
  const messages = await getMessages()
  return <MessagesManager messages={messages} />
}

