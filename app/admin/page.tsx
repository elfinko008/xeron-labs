'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { RefreshCw, CheckCircle, XCircle, Shield, Users, Zap, DollarSign, Activity } from 'lucide-react'
import { PLATFORM_META, PLATFORM_ORDER, type PlatformKey } from '@/lib/platform-router'

interface AdminData {
  totalMRR: number
  totalUsers: number
  totalGenerations: number
  platformStats: {
    platform: string
    users_today: number
    generations: number
    credits_used: number
    revenue_eur: number
  }[]
  recentSignups: {
    email: string
    plan: string
    active_platform: string
    created_at: string
  }[]
  socialRequests: {
    id: string
    user_id: string
    email: string
    platforms: string
    usernames: string
    status: string
  }[]
  health: {
    supabase: boolean
    anthropic: boolean
    gemini: boolean
    stripe: boolean
  }
}

export default function AdminPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [authError, setAuthError] = useState('')
  const [data, setData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  const fetchData = useCallback(async (pwd: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { 'x-admin-secret': pwd },
      })
      if (res.status === 401) { setAuthError('Wrong password'); setAuthenticated(false); return }
      if (!res.ok) throw new Error('Failed to fetch')
      const json = await res.json()
      setData(json)
      setLastRefresh(new Date())
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleLogin = () => {
    setAuthError('')
    fetchData(password).then(() => {
      if (!authError) setAuthenticated(true)
    })
  }

  // Auto-refresh every 60s
  useEffect(() => {
    if (!authenticated) return
    const interval = setInterval(() => fetchData(password), 60000)
    return () => clearInterval(interval)
  }, [authenticated, password, fetchData])

  const handleApprove = async (requestId: string) => {
    await fetch('/api/admin/social/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': password },
      body: JSON.stringify({ requestId }),
    })
    fetchData(password)
  }

  if (!authenticated) {
    return (
      <div style={{ minHeight: '100vh', background: '#020B18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'rgba(7,24,40,0.90)', border: '0.5px solid rgba(0,128,255,0.20)', borderRadius: 20, padding: 40, width: 360 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <Shield size={24} color="#66B2FF" />
            <div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 700, color: '#F0F4FF', fontSize: 18 }}>Admin Access</div>
              <div style={{ fontSize: 12, color: '#506080' }}>XERON Engine Dashboard</div>
            </div>
          </div>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleLogin() }}
            placeholder="Admin password"
            style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'rgba(14,45,74,0.50)', border: '0.5px solid rgba(100,150,220,0.20)', color: '#F0F4FF', fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 12 }}
          />
          {authError && <div style={{ color: '#F87171', fontSize: 12, marginBottom: 8 }}>{authError}</div>}
          <button className="btn-primary" onClick={handleLogin} style={{ width: '100%', justifyContent: 'center' }}>
            <Shield size={15} /> Enter
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#020B18', color: '#F0F4FF', padding: 24, fontFamily: "'DM Sans',sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 28, fontWeight: 800, background: 'linear-gradient(135deg,#F0F4FF,#66B2FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            XERON Admin
          </h1>
          <div style={{ fontSize: 12, color: '#506080', marginTop: 2 }}>
            {lastRefresh ? `Last updated: ${lastRefresh.toLocaleTimeString()}` : 'Loading...'}
          </div>
        </div>
        <button
          onClick={() => fetchData(password)}
          className="btn-ghost"
          style={{ padding: '8px 16px', fontSize: 13 }}
          disabled={loading}
        >
          <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          Refresh
        </button>
      </div>

      {!data ? (
        <div style={{ textAlign: 'center', padding: 80, color: '#506080' }}>Loading admin data...</div>
      ) : (
        <>
          {/* Section 1: Revenue Overview */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 16, fontWeight: 600, color: '#A0B0D0', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Revenue Overview
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
              {[
                { icon: <DollarSign size={20} />, label: 'Est. MRR', value: `€${data.totalMRR.toFixed(2)}`, color: '#E0A820' },
                { icon: <Users size={20} />, label: 'Total Users', value: data.totalUsers.toLocaleString(), color: '#66B2FF' },
                { icon: <Zap size={20} />, label: 'Generations', value: data.totalGenerations.toLocaleString(), color: '#4ADE80' },
                { icon: <Activity size={20} />, label: 'Platforms', value: '5', color: '#F9A8D4' },
              ].map(stat => (
                <div key={stat.label} style={{ background: 'rgba(7,24,40,0.80)', border: '0.5px solid rgba(100,150,220,0.15)', borderRadius: 16, padding: '20px 24px' }}>
                  <div style={{ color: stat.color, marginBottom: 8 }}>{stat.icon}</div>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: '#506080', marginTop: 2 }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Platform chart */}
            {data.platformStats.length > 0 && (
              <div style={{ background: 'rgba(7,24,40,0.80)', border: '0.5px solid rgba(100,150,220,0.15)', borderRadius: 16, padding: 24 }}>
                <div style={{ fontWeight: 600, marginBottom: 16, color: '#A0B0D0', fontSize: 13 }}>Revenue by Platform (EUR)</div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={data.platformStats} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,150,220,0.08)" />
                    <XAxis dataKey="platform" tick={{ fill: '#506080', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#506080', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ background: 'rgba(7,24,40,0.95)', border: '0.5px solid rgba(0,128,255,0.20)', borderRadius: 10, color: '#F0F4FF' }}
                      formatter={(v: number | string | undefined) => {
                        const num = typeof v === 'number' ? v : parseFloat(String(v ?? 0))
                        return [`€${num.toFixed(2)}`, 'Revenue']
                      }}
                    />
                    <Bar dataKey="revenue_eur" fill="#0080FF" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>

          {/* Section 2: Platform Stats Table */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 16, fontWeight: 600, color: '#A0B0D0', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Platform Stats (Today)
            </h2>
            <div style={{ background: 'rgba(7,24,40,0.80)', border: '0.5px solid rgba(100,150,220,0.15)', borderRadius: 16, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'rgba(14,45,74,0.40)' }}>
                    {['Platform', 'Users Today', 'Generations', 'Credits Used', 'Revenue'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#506080', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PLATFORM_ORDER.map(p => {
                    const stat = data.platformStats.find(s => s.platform === p)
                    const pm = PLATFORM_META[p]
                    return (
                      <tr key={p} style={{ borderTop: '0.5px solid rgba(100,150,220,0.08)' }}>
                        <td style={{ padding: '12px 16px' }}><span style={{ marginRight: 8 }}>{pm.emoji}</span>{p}</td>
                        <td style={{ padding: '12px 16px', color: '#66B2FF' }}>{stat?.users_today ?? 0}</td>
                        <td style={{ padding: '12px 16px', color: '#4ADE80' }}>{stat?.generations ?? 0}</td>
                        <td style={{ padding: '12px 16px', color: '#E0A820' }}>{stat?.credits_used ?? 0}</td>
                        <td style={{ padding: '12px 16px', color: '#F0F4FF' }}>€{(stat?.revenue_eur ?? 0).toFixed(2)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3: Recent Signups */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 16, fontWeight: 600, color: '#A0B0D0', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Recent Signups
            </h2>
            <div style={{ background: 'rgba(7,24,40,0.80)', border: '0.5px solid rgba(100,150,220,0.15)', borderRadius: 16, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'rgba(14,45,74,0.40)' }}>
                    {['Email', 'Plan', 'Platform', 'Joined'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#506080', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.recentSignups.map((u, i) => (
                    <tr key={i} style={{ borderTop: '0.5px solid rgba(100,150,220,0.08)' }}>
                      <td style={{ padding: '12px 16px', color: '#A0B0D0' }}>{u.email}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: u.plan === 'pro' || u.plan === 'enterprise' ? 'rgba(224,168,32,0.12)' : 'rgba(100,150,220,0.10)', color: u.plan === 'pro' || u.plan === 'enterprise' ? '#E0A820' : '#66B2FF', fontWeight: 600, textTransform: 'uppercase' }}>
                          {u.plan}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#A0B0D0' }}>{PLATFORM_META[u.active_platform as PlatformKey]?.emoji ?? '?'} {u.active_platform}</td>
                      <td style={{ padding: '12px 16px', color: '#506080' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {data.recentSignups.length === 0 && (
                    <tr><td colSpan={4} style={{ padding: '24px 16px', textAlign: 'center', color: '#506080' }}>No recent signups</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 4: System Health */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 16, fontWeight: 600, color: '#A0B0D0', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              System Health
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
              {Object.entries(data.health).map(([service, ok]) => (
                <div key={service} style={{ background: 'rgba(7,24,40,0.80)', border: `0.5px solid ${ok ? 'rgba(74,222,128,0.20)' : 'rgba(248,113,113,0.20)'}`, borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  {ok ? <CheckCircle size={16} color="#4ADE80" /> : <XCircle size={16} color="#F87171" />}
                  <div>
                    <div style={{ fontSize: 13, color: '#F0F4FF', fontWeight: 600, textTransform: 'capitalize' }}>{service}</div>
                    <div style={{ fontSize: 11, color: ok ? '#4ADE80' : '#F87171' }}>{ok ? 'Operational' : 'Down'}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 5: Social Credit Requests */}
          {data.socialRequests.length > 0 && (
            <section style={{ marginBottom: 32 }}>
              <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 16, fontWeight: 600, color: '#A0B0D0', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Pending Social Credit Requests ({data.socialRequests.length})
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {data.socialRequests.map(req => (
                  <div key={req.id} style={{ background: 'rgba(7,24,40,0.80)', border: '0.5px solid rgba(224,168,32,0.15)', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#F0F4FF', fontSize: 13, fontWeight: 600 }}>{req.email}</div>
                      <div style={{ color: '#506080', fontSize: 12, marginTop: 3 }}>Platforms: {req.platforms} · Usernames: {req.usernames}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn-primary" style={{ padding: '7px 16px', fontSize: 12 }} onClick={() => handleApprove(req.id)}>
                        <CheckCircle size={13} /> Approve
                      </button>
                      <button className="btn-ghost" style={{ padding: '7px 16px', fontSize: 12 }}>
                        <XCircle size={13} /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
