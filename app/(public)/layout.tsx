import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getSettings } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSettings()
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar headerLogo={settings.headerLogo} />
      <main className="flex-1">{children}</main>
      <Footer footerLogo={settings.footerLogo} />
    </div>
  )
}
