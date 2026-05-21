'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import CLIENT_CONFIG from '@/lib/client-config'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    await new Promise(r => setTimeout(r, 700))

    if (email === CLIENT_CONFIG.demoEmail && password === CLIENT_CONFIG.demoPassword) {
      document.cookie = 'crm_session=demo; Max-Age=86400; path=/'
      router.push('/dashboard')
    } else {
      setError(`Invalid credentials. Use ${CLIENT_CONFIG.demoEmail} / ${CLIENT_CONFIG.demoPassword}`)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-gray flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-purple shadow-glow mb-4">
            <span className="text-lg font-bold text-white">{CLIENT_CONFIG.initials}</span>
          </div>
          <h1 className="text-xl font-bold text-brand-black">{CLIENT_CONFIG.name}</h1>
          <p className="text-sm text-brand-muted mt-1">{CLIENT_CONFIG.industry} · Client Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-brand-border shadow-card p-6">
          <h2 className="text-base font-semibold text-brand-black mb-5">Sign in to your account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-brand-subtext mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={CLIENT_CONFIG.demoEmail}
                required
                className="w-full px-3 py-2.5 text-sm border border-brand-border rounded-lg bg-white text-brand-black placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-brand-subtext mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3 py-2.5 text-sm border border-brand-border rounded-lg bg-white text-brand-black placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple transition-colors"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-brand-purple hover:bg-brand-purplehov text-white text-sm font-semibold rounded-lg shadow-glow transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              )}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-4 p-3 rounded-lg bg-brand-gray border border-brand-border">
            <p className="text-xs text-brand-muted font-medium mb-1">Demo credentials</p>
            <p className="text-xs text-brand-subtext font-mono">{CLIENT_CONFIG.demoEmail}</p>
            <p className="text-xs text-brand-subtext font-mono">{CLIENT_CONFIG.demoPassword}</p>
          </div>
        </div>

        <p className="text-center text-xs text-brand-muted mt-6">
          Powered by <span className="text-brand-purple font-medium">AI Lead Intelligence</span>
        </p>
      </div>
    </div>
  )
}
