import './globals.css'
import type { Metadata } from 'next'
import { Inter, Fraunces } from 'next/font/google'
import { Providers } from './providers'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
})

export const metadata: Metadata = {
  title: 'Hampir.Agency — Agensi Digital Full-Service Batam',
  description:
    'Pengembangan web & aplikasi, desain grafis, foto & video, serta operasional data untuk bisnis modern.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning className={`${inter.variable} ${fraunces.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);',
          }}
        />
      </head>
      <body className="font-sans bg-background text-foreground antialiased min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

