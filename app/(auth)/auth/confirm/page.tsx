'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function ConfirmPage() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        router.push('/dashboard')
      }
    })
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-modal p-10 text-center max-w-sm w-full">
        <div className="animate-pulse-slow w-10 h-10 rounded-full mx-auto mb-4"
             style={{ background: 'rgba(233,69,96,0.3)' }} />
        <h2 className="font-display text-xl mb-2">Account wird aktiviert...</h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Du wirst automatisch weitergeleitet.
        </p>
      </div>
    </div>
  )
}
