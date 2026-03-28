import type { Metadata } from 'next'
import './globals.css'
import { SplashScreen } from '@/components/SplashScreen'
import { CookieBanner } from '@/components/shared/CookieBanner'
import { CursorGlow } from '@/components/landing/CursorGlow'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/components/AuthProvider'

export const metadata: Metadata = {
  title: 'XERON Engine — AI Roblox Game Builder',
  description: 'Build Roblox games with AI. Describe your game, XERON builds it. Professional games, zero code needed.',
  keywords: ['roblox', 'ai', 'game builder', 'roblox studio', 'lua', 'no code'],
  openGraph: {
    title: 'XERON Engine — AI Roblox Game Builder',
    description: 'Build Roblox games with AI. Professional games, zero code needed.',
    url: 'https://xeron-labs.com',
    siteName: 'XERON Engine',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300&family=Tenor+Sans&family=DM+Sans:wght@300;400;500;600&family=Bebas+Neue&family=JetBrains+Mono:wght@400;500&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300&family=Tenor+Sans&family=DM+Sans:wght@300;400;500;600&family=Bebas+Neue&family=JetBrains+Mono:wght@400;500&display=swap" />
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              const theme = localStorage.getItem('xeron-theme') || 'dark';
              if (theme === 'light') document.documentElement.setAttribute('data-theme', 'light');
            } catch(e) {}
          `
        }} />
      </head>
      <body>
        <AuthProvider>
          <SplashScreen />
          <CursorGlow />
          <CookieBanner />
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'rgba(12,12,36,0.95)',
                color: '#F0F1FC',
                border: '1px solid rgba(212,160,23,0.25)',
                borderRadius: '16px',
                backdropFilter: 'blur(20px)',
                fontFamily: "'Tenor Sans', sans-serif",
              },
              success: {
                iconTheme: { primary: '#E8BC3A', secondary: '#0A0900' },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
