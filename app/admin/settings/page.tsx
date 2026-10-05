import { prisma } from '@/lib/prisma'
import SettingsManager from '@/components/admin/SettingsManager'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: 'singleton' },
  })

  return (
    <SettingsManager
      settings={{
        headerLogoUrl: settings?.headerLogoUrl || null,
        footerLogoUrl: settings?.footerLogoUrl || null,
        email: settings?.email || 'hampiragency@gmail.com',
        whatsapp: settings?.whatsapp || '6281234567890',
        address: settings?.address || 'Batam, Kepulauan Riau, Indonesia',
        instagram: settings?.instagram || '',
        linkedin: settings?.linkedin || '',
        github: settings?.github || '',
      }}
    />
  )
}

