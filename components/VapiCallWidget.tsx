'use client'
import { useState, useEffect, useRef } from 'react'

type CallStatus = 'idle' | 'connecting' | 'active' | 'ended' | 'error'

interface TranscriptLine {
  role: 'assistant' | 'user'
  text: string
  ts: number
}

interface FormData {
  name: string
  phone: string
  interest: string
  location: string
  publicKey: string
  assistantId: string
}

const PRODUCTS = [
  'L-shaped corner sofa in grey (AED 3,200)',
  'L-shaped corner sofa with chaise (AED 5,200)',
  '3+2 Sofa Set in beige (AED 4,200)',
  '3+2 Sofa Set in grey velvet (AED 4,600)',
  'King Bedroom Set — walnut (AED 7,200)',
  'King Bedroom Set — white lacquer (AED 6,800)',
  '8-seater Walnut Dining Table (AED 5,400)',
  '6-seater Marble Dining Set (AED 4,800)',
  'Sliding Wardrobe 3-door mirror (AED 3,800)',
  'Oak TV Unit & Media Console (AED 2,100)',
]

const LOCATIONS = ['Dubai — JVC', 'Dubai — Marina', 'Dubai — Downtown', 'Dubai — Mirdif', 'Sharjah', 'Abu Dhabi', 'Ajman']

function buildSystemPrompt(form: FormData): string {
  return `You are a warm, professional AI sales agent for Al Huzaifa Furniture — a premium furniture store in the UAE with showrooms in Dubai and Sharjah.

You are currently on a call with ${form.name || 'a customer'}, who is interested in: ${form.interest || 'furniture'}.
Their location: ${form.location || 'UAE'}.

Your goals for this call:
1. Greet them warmly and confirm their interest
2. Provide accurate pricing and product details
3. Confirm free delivery to their emirate (3–5 business days)
4. Mention the 0% installment option (3, 6, or 12 months via UAE bank cards)
5. Ask about preferred delivery slot
6. Offer to send a WhatsApp confirmation
7. Close warmly — thank them and set next steps

Keep responses concise and conversational. Speak in English. Be helpful, not pushy.`
}

export default function VapiCallWidget() {
  const [form, setForm] = useState<FormData>({
    name: 'Ahmed Al Rashidi',
    phone: '+971 50 123 4567',
    interest: PRODUCTS[0],
    location: LOCATIONS[0],
    publicKey: '',
    assistantId: '',
  })
  const [status, setStatus] = useState<CallStatus>('idle')
  const [transcript, setTranscript] = useState<TranscriptLine[]>([])
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0)
  const [error, setError] = useState('')
  const [showConfig, setShowConfig] = useState(true)
  const vapiRef = useRef<any>(null)
  const transcriptEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem('vapi_public_key') || ''
    const savedId = localStorage.getItem('vapi_assistant_id') || ''
    setForm(f => ({ ...f, publicKey: saved, assistantId: savedId }))
  }, [])

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [transcript])

  async function startCall() {
    setError('')
    if (!form.publicKey.trim()) {
      setError('Enter your VAPI Public Key to start a call.')
      return
    }
    setStatus('connecting')
    setTranscript([])

    try {
      localStorage.setItem('vapi_public_key', form.publicKey.trim())
      if (form.assistantId) localStorage.setItem('vapi_assistant_id', form.assistantId.trim())

      const { default: Vapi } = await import('@vapi-ai/web')
      const vapi = new Vapi(form.publicKey.trim())
      vapiRef.current = vapi

      vapi.on('call-start', () => setStatus('active'))
      vapi.on('call-end', () => { setStatus('ended'); vapiRef.current = null })
      vapi.on('volume-level', (v: number) => setVolume(Math.round(v * 100)))
      vapi.on('error', (e: any) => {
        setError(e?.message || 'Call error. Check your VAPI key.')
        setStatus('error')
      })
      vapi.on('message', (msg: any) => {
        if (msg?.type === 'transcript' && msg.transcriptType === 'final') {
          setTranscript(t => [...t, { role: msg.role, text: msg.transcript, ts: Date.now() }])
        }
      })

      const callConfig: any = form.assistantId.trim()
        ? form.assistantId.trim()
        : {
            name: 'Al Huzaifa Furniture Agent',
            firstMessage: `Hello ${form.name || 'there'}! Thank you for your interest in Al Huzaifa Furniture. I see you're looking at our ${form.interest.split('(')[0].trim()}. How can I help you today?`,
            transcriber: { provider: 'deepgram', model: 'nova-2', language: 'en-US' },
            model: {
              provider: 'openai',
              model: 'gpt-4o-mini',
              systemPrompt: buildSystemPrompt(form),
            },
            voice: { provider: '11labs', voiceId: 'paula' },
          }

      await vapi.start(callConfig)
    } catch (e: any) {
      setError(e?.message || 'Failed to start call. Check your VAPI key and try again.')
      setStatus('error')
    }
  }

  function endCall() {
    vapiRef.current?.stop()
    setStatus('ended')
    setVolume(0)
  }

  function toggleMute() {
    if (!vapiRef.current) return
    const next = !isMuted
    vapiRef.current.setMuted(next)
    setIsMuted(next)
  }

  function resetCall() {
    setStatus('idle')
    setTranscript([])
    setError('')
    setIsMuted(false)
    setVolume(0)
  }

  const isLive = status === 'active'
  const isConnecting = status === 'connecting'

  return (
    <div className="space-y-5">

      {/* Config panel */}
      <div className="bg-white rounded-xl border border-brand-border shadow-card overflow-hidden">
        <button
          onClick={() => setShowConfig(o => !o)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-brand-gray/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
            </svg>
            <span className="text-sm font-semibold text-brand-black">VAPI Configuration</span>
            {form.publicKey && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Key saved</span>}
          </div>
          <svg className={`w-4 h-4 text-brand-muted transition-transform ${showConfig ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
          </svg>
        </button>

        {showConfig && (
          <div className="border-t border-brand-border px-5 py-4 space-y-4 bg-brand-gray/20">
            <div>
              <label className="block text-xs font-medium text-brand-subtext mb-1.5">
                VAPI Public Key <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={form.publicKey}
                onChange={e => setForm(f => ({ ...f, publicKey: e.target.value }))}
                placeholder="Enter your VAPI Public Key"
                className="w-full px-3 py-2 text-sm border border-brand-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple"
              />
              <p className="text-xs text-brand-muted mt-1">
                Get it from <span className="text-brand-purple font-medium">dashboard.vapi.ai → Account → API Keys</span>. Saved locally in your browser.
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-subtext mb-1.5">
                Assistant ID <span className="text-brand-muted font-normal">(optional — leave blank to use built-in prompt)</span>
              </label>
              <input
                type="text"
                value={form.assistantId}
                onChange={e => setForm(f => ({ ...f, assistantId: e.target.value }))}
                placeholder="e.g. asst_xxxxxxxxxxxxxxxx"
                className="w-full px-3 py-2 text-sm border border-brand-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple"
              />
            </div>
          </div>
        )}
      </div>

      {/* Demo lead form */}
      <div className="bg-white rounded-xl border border-brand-border shadow-card p-5">
        <h3 className="text-sm font-semibold text-brand-black mb-4">Demo Lead Data</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-brand-subtext mb-1.5">Customer Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              disabled={isLive || isConnecting}
              className="w-full px-3 py-2 text-sm border border-brand-border rounded-lg bg-white disabled:bg-brand-gray focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-brand-subtext mb-1.5">Phone (display only)</label>
            <input
              type="text"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              disabled={isLive || isConnecting}
              className="w-full px-3 py-2 text-sm border border-brand-border rounded-lg bg-white disabled:bg-brand-gray focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-brand-subtext mb-1.5">Product Interest</label>
            <select
              value={form.interest}
              onChange={e => setForm(f => ({ ...f, interest: e.target.value }))}
              disabled={isLive || isConnecting}
              className="w-full px-3 py-2 text-sm border border-brand-border rounded-lg bg-white disabled:bg-brand-gray focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple"
            >
              {PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-brand-subtext mb-1.5">Delivery Location</label>
            <select
              value={form.location}
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              disabled={isLive || isConnecting}
              className="w-full px-3 py-2 text-sm border border-brand-border rounded-lg bg-white disabled:bg-brand-gray focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple"
            >
              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Call controls */}
      <div className="bg-white rounded-xl border border-brand-border shadow-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Status indicator */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${
              isLive        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
              isConnecting  ? 'bg-amber-50 text-amber-700 border-amber-200' :
              status === 'ended' ? 'bg-gray-100 text-gray-500 border-gray-200' :
              status === 'error'  ? 'bg-red-50 text-red-600 border-red-200' :
              'bg-brand-gray text-brand-muted border-brand-border'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                isLive ? 'bg-emerald-500 animate-pulse' :
                isConnecting ? 'bg-amber-400 animate-pulse' :
                status === 'error' ? 'bg-red-500' :
                'bg-gray-300'
              }`} />
              {isLive ? 'Call active' : isConnecting ? 'Connecting…' : status === 'ended' ? 'Call ended' : status === 'error' ? 'Error' : 'Ready'}
            </div>

            {/* Volume bar */}
            {isLive && (
              <div className="flex items-center gap-1">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-100 ${volume > i * 12 ? 'bg-brand-purple' : 'bg-brand-border'}`}
                    style={{ height: `${8 + i * 2}px` }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {(status === 'ended' || status === 'error') && (
              <button onClick={resetCall} className="text-xs px-3 py-1.5 rounded-lg border border-brand-border text-brand-subtext hover:bg-brand-gray transition-colors">
                Reset
              </button>
            )}
            {isLive && (
              <button
                onClick={toggleMute}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${isMuted ? 'bg-amber-50 text-amber-700 border-amber-200' : 'border-brand-border text-brand-subtext hover:bg-brand-gray'}`}
              >
                {isMuted
                  ? <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/></svg>Unmute</>
                  : <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6v12m0 0l-3-3m3 3l3-3"/></svg>Mute</>
                }
              </button>
            )}
            {(status === 'idle' || status === 'error') && (
              <button
                onClick={startCall}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
                Start Demo Call
              </button>
            )}
            {isConnecting && (
              <button disabled className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg opacity-80 cursor-not-allowed">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Connecting…
              </button>
            )}
            {isLive && (
              <button
                onClick={endCall}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
                End Call
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 mb-4">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            {error}
          </div>
        )}

        {/* Transcript */}
        {transcript.length > 0 && (
          <div className="border border-brand-border rounded-lg overflow-hidden">
            <div className="px-4 py-2 bg-brand-gray/60 border-b border-brand-border flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              <span className="text-xs font-semibold text-brand-muted uppercase tracking-wide">Live Transcript</span>
            </div>
            <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
              {transcript.map((line, i) => (
                <div key={i} className={`flex gap-2.5 ${line.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    line.role === 'assistant' ? 'bg-brand-purple/10 text-brand-purple' : 'bg-brand-gray text-brand-subtext'
                  }`}>
                    {line.role === 'assistant' ? 'AI' : 'U'}
                  </div>
                  <div className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                    line.role === 'assistant'
                      ? 'bg-brand-purple/8 text-brand-black rounded-tl-none'
                      : 'bg-brand-gray text-brand-subtext rounded-tr-none'
                  }`}>
                    {line.text}
                  </div>
                </div>
              ))}
              <div ref={transcriptEndRef} />
            </div>
          </div>
        )}

        {status === 'idle' && transcript.length === 0 && (
          <div className="text-center py-8 text-brand-muted">
            <svg className="w-10 h-10 mx-auto mb-3 text-brand-border" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            <p className="text-sm font-medium">Fill in the demo data above and press <strong>Start Demo Call</strong></p>
            <p className="text-xs mt-1">Your browser mic will be used — the AI agent speaks back through your speakers</p>
          </div>
        )}
      </div>
    </div>
  )
}
