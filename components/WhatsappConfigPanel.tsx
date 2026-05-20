'use client'
import { useState, useEffect } from 'react'

export default function WhatsappConfigPanel() {
  const [open, setOpen] = useState(false)
  const [saved, setSaved] = useState(false)
  const [config, setConfig] = useState({
    accessToken: '',
    phoneNumberId: '',
    wabaId: '',
    webhookToken: '',
  })

  useEffect(() => {
    const stored = localStorage.getItem('wc_config')
    if (stored) {
      try { setConfig(JSON.parse(stored)); setSaved(true) } catch {}
    }
  }, [])

  function save() {
    localStorage.setItem('wc_config', JSON.stringify(config))
    setSaved(true)
    setOpen(false)
  }

  function clear() {
    localStorage.removeItem('wc_config')
    setConfig({ accessToken: '', phoneNumberId: '', wabaId: '', webhookToken: '' })
    setSaved(false)
  }

  const anyFilled = Object.values(config).some(v => v.trim())

  return (
    <div className="bg-white rounded-xl border border-brand-border shadow-card overflow-hidden mb-6">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-brand-gray/30 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          {/* WhatsApp icon */}
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
          <div>
            <span className="text-sm font-semibold text-brand-black">WhatsApp Integration</span>
            <p className="text-xs text-brand-muted">Connect your messaging account to sync live data</p>
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
                Access Token <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={config.accessToken}
                onChange={e => setConfig(c => ({ ...c, accessToken: e.target.value }))}
                placeholder="EAAxxxxxxxxxxxxxxx"
                className="w-full px-3 py-2 text-sm border border-brand-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple"
              />
              <p className="text-xs text-brand-muted mt-1">From your Meta Business dashboard → System Users</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-subtext mb-1.5">
                Phone Number ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={config.phoneNumberId}
                onChange={e => setConfig(c => ({ ...c, phoneNumberId: e.target.value }))}
                placeholder="1234567890123456"
                className="w-full px-3 py-2 text-sm border border-brand-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple"
              />
              <p className="text-xs text-brand-muted mt-1">Found in Meta → WhatsApp → Phone numbers</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-subtext mb-1.5">
                Business Account ID (WABA) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={config.wabaId}
                onChange={e => setConfig(c => ({ ...c, wabaId: e.target.value }))}
                placeholder="9876543210987654"
                className="w-full px-3 py-2 text-sm border border-brand-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple"
              />
              <p className="text-xs text-brand-muted mt-1">WhatsApp Business Account ID from Meta</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-brand-subtext mb-1.5">
                Webhook Verify Token <span className="text-brand-muted font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={config.webhookToken}
                onChange={e => setConfig(c => ({ ...c, webhookToken: e.target.value }))}
                placeholder="your_custom_verify_token"
                className="w-full px-3 py-2 text-sm border border-brand-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-purple/30 focus:border-brand-purple"
              />
              <p className="text-xs text-brand-muted mt-1">Custom token set during webhook registration</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <p className="text-xs text-brand-muted">Credentials are stored locally in your browser only.</p>
            <div className="flex items-center gap-2">
              {anyFilled && (
                <button onClick={clear} className="text-xs px-3 py-1.5 rounded-lg border border-brand-border text-brand-muted hover:bg-brand-gray transition-colors">
                  Clear
                </button>
              )}
              <button
                onClick={save}
                disabled={!config.accessToken.trim() || !config.phoneNumberId.trim() || !config.wabaId.trim()}
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
