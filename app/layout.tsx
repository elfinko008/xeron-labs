import type { Metadata } from 'next'
import './globals.css'
import { SplashScreenWrapper } from '@/components/SplashScreen'
import { LanguageProvider } from '@/lib/language-context'

export const metadata: Metadata = {
  title: 'XERON Engine — AI Roblox Game Builder',
  description: 'Build Roblox games with AI. Describe your game, XERON builds it.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              const theme = localStorage.getItem('theme') || 'dark';
              if (theme === 'light') document.documentElement.setAttribute('data-theme', 'light');
            } catch(e) {}
          `
        }} />
      </head>
      <body>
        <LanguageProvider>
          <SplashScreenWrapper />
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
