import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'XERON Engine — KI-gesteuerte Roblox-Spiel-Generierung',
  description:
    'Beschreibe dein Roblox-Spiel. XERON Engine baut es automatisch — in Minuten. KI-gesteuerte SaaS-Plattform mit Roblox Studio Plugin.',
  keywords: ['Roblox', 'KI', 'Game Generator', 'Roblox Studio', 'XERON'],
  openGraph: {
    title: 'XERON Engine',
    description: 'Beschreibe dein Roblox-Spiel. Wir bauen es.',
    url: 'https://xeron-labs.com',
    siteName: 'XERON Engine',
    locale: 'de_DE',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
