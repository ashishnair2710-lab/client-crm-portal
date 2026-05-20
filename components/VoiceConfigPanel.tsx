'use client'
import { useState, useEffect } from 'react'

export default function VoiceConfigPanel() {
  const [open, setOpen] = useState(false)
  const [saved, setSaved] = useState(false)
  const [config, setConfig] = useState({
    publicKey: '',
    phoneNumberId: '',
    assistantId: '',
  })

  useEffect(() => {
    const key = localStorage.getItem('vapi_public_key') || ''
    const phone = localStorage.getItem('vapi_phone_number_id') || ''
    const asst = localStorage.getItem('vapi_assistant_id') || ''
    setConfig({ publicKey: key, phoneNumberId: phone, assistantId: asst })
    if (key) setSaved(true)
  }, [])

  function save() {
    localStorage.setItem('vapi_public_key', config.publicKey.trim())
    localStorage.setItem('vapi_phone_number_id', config.phoneNumberId.trim())
    if (config.assistantId) localStorage.setItem('vapi_assistant_id', config.assistantId.trim())
    setSaved(true)
    setOpen(false)
  }

  function clear() {
    localStorage.removeItem('vapi_public_key')
    localStorage.removeItem('vapi_phone_number_id')
    localStorage.removeItem('vapi_assistant_id')
    setConfig({ publicKey: '', phoneNumberId: '', assistantId: '' })
    setSaved(false)
  }

  return (
    <div className="bg-white rounded-xl border border-brand-border shadow-card overflow-hidden mb-6">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-brand-gray/30 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
            </svg>
          </div>
          <div>
            <span className="text-sm font-semibold text-brand-black">Voice Call Integration</span>
            <p className="text-xs text-brand-muted">Connect your AI calling account to sync live data</p>
          </div>
          {saved && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ml-1">Connected</span>
          )}
        </div>
        <svg className={`w-4 h-4 text-brand-muted transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      {open && (
        <div className="border-t border-brand-border px-5 py-5 bg-brand-gray/20 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-brand-subtext mb-1.5">
                API Key <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={config.publicKey}
                onChange={e => setConfig(c => ({ ...c, publicKey: e.target.value }))}
                placeholder="Enter your Voice API Key"
                className="w-full px-3 py-2 text-sm border border-brand-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple"
              />
              <p className="text-xs text-brand-muted mt-1">Your public API key from the voice calling dashboard</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-subtext mb-1.5">
                Phone Number ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={config.phoneNumberId}
                onChange={e => setConfig(c => ({ ...c, phoneNumberId: e.target.value }))}
                placeholder="phnum_xxxxxxxxxxxxxxxx"
                className="w-full px-3 py-2 text-sm border border-brand-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple"
              />
              <p className="text-xs text-brand-muted mt-1">The outbound phone number assigned to your account</p>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-brand-subtext mb-1.5">
                Agent ID <span className="text-brand-muted font-normal">(optional — leave blank to use default agent)</span>
              </label>
              <input
                type="text"
                value={config.assistantId}
                onChange={e => setConfig(c => ({ ...c, assistantId: e.target.value }))}
                placeholder="Leave blank to use default agent"
                className="w-full px-3 py-2 text-sm border border-brand-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <p className="text-xs text-brand-muted">Credentials are stored locally in your browser only.</p>
            <div className="flex items-center gap-2">
              {(config.publicKey || config.phoneNumberId) && (
                <button onClick={clear} className="text-xs px-3 py-1.5 rounded-lg border border-brand-border text-brand-muted hover:bg-brand-gray transition-colors">
                  Clear
                </button>
              )}
              <button
                onClick={save}
                disabled={!config.publicKey.trim() || !config.phoneNumberId.trim()}
                className="text-xs px-4 py-1.5 rounded-lg bg-brand-purple text-white font-semibold hover:bg-brand-purplehov transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Save configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
