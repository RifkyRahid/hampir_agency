import { prisma } from '@/lib/prisma'
import TeamManager from '@/components/admin/TeamManager'

export const dynamic = 'force-dynamic'

export default async function AdminTeamPage() {
  const members = await prisma.teamMember.findMany({
    orderBy: { order: 'asc' },
  })

  return <TeamManager members={members} />
}

