import type { Metadata } from 'next'
import './globals.css'
import { SplashScreen } from '@/components/SplashScreen'
import { CookieBanner } from '@/components/shared/CookieBanner'
import { LuxuryCursor } from '@/components/effects/LuxuryCursor'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/components/AuthProvider'

export const metadata: Metadata = {
  title: 'XERON Engine — Multi-Platform AI Game Builder',
  description: 'Build games with AI for Roblox, Unity, Godot, Unreal, and Mobile. Describe your game, XERON builds it. Professional games, zero code needed.',
  keywords: ['roblox', 'unity', 'godot', 'unreal engine', 'ai game builder', 'game development', 'ai code generator', 'lua', 'csharp', 'gdscript'],
  icons: { icon: '/logo.png', apple: '/logo.png' },
  openGraph: {
    title: 'XERON Engine — Multi-Platform AI Game Builder',
    description: 'Build games with AI for Roblox, Unity, Godot, Unreal, and Mobile. One AI, every engine.',
    url: 'https://www.xeron-labs.com',
    siteName: 'XERON Engine',
    type: 'website',
    images: [{ url: '/logo.png', width: 400, height: 400 }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300&family=Tenor+Sans&family=DM+Sans:wght@300;400;500;600&family=Bebas+Neue&family=JetBrains+Mono:wght@400;500&family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300&family=Tenor+Sans&family=DM+Sans:wght@300;400;500;600&family=Bebas+Neue&family=JetBrains+Mono:wght@400;500&family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" />
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
          <LuxuryCursor />
          <CookieBanner />
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'rgba(3,3,12,0.95)',
                color: '#F0EDE8',
                border: '0.5px solid rgba(212,146,15,0.25)',
                borderRadius: '16px',
                backdropFilter: 'blur(20px)',
                fontFamily: "'Tenor Sans', sans-serif",
                letterSpacing: '0.04em',
              },
              success: {
                iconTheme: { primary: '#E8A820', secondary: '#060300' },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
