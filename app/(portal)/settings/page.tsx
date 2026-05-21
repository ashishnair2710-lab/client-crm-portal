import TopBar from '@/components/TopBar'
import WhatsappConfigPanel from '@/components/WhatsappConfigPanel'
import VoiceConfigPanel from '@/components/VoiceConfigPanel'
import CLIENT_CONFIG from '@/lib/client-config'

const SOURCE_ICONS: Record<string, React.ReactNode> = {
  meta_ad: (
    <svg className="w-4 h-4" fill="#1877F2" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  google: (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  ),
  website: (
    <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"/>
    </svg>
  ),
  tiktok: (
    <svg className="w-4 h-4" fill="#6B5FE4" viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.05a8.16 8.16 0 004.77 1.52V7.12a4.85 4.85 0 01-1-.43z"/>
    </svg>
  ),
}

const CHANNEL_CONFIG = {
  voice: {
    label: 'Voice Call',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: (
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
      </svg>
    ),
  },
  whatsapp: {
    label: 'WhatsApp',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: (
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
}

const SOURCE_LABELS: Record<string, string> = {
  meta_ad: 'Meta Lead Ads',
  google:  'Google Lead Forms',
  website: 'Website Contact Form',
  tiktok:  'TikTok Lead Ads',
}

const WEBHOOK_URLS: Record<string, string> = {
  meta_ad: '/api/webhooks/meta',
  google:  '/api/webhooks/google',
  website: '/api/webhooks/website',
}

export default function SettingsPage() {
  const { routing } = CLIENT_CONFIG
  const { start, end } = routing.callHours
  const fmt = (h: number) => `${h > 12 ? h - 12 : h}:00 ${h >= 12 ? 'PM' : 'AM'}`

  return (
    <>
      <TopBar title="Settings" subtitle="Integrations, routing, and account configuration" />
      <div className="p-6 max-w-3xl space-y-8">

        {/* ── Lead Routing Rules ── */}
        <div>
          <h2 className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-3">Lead Routing</h2>
          <div className="bg-white rounded-xl border border-brand-border shadow-card overflow-hidden">

            {/* Calling hours banner */}
            <div className="flex items-center gap-3 px-5 py-3 bg-amber-50 border-b border-amber-100">
              <svg className="w-4 h-4 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p className="text-xs text-amber-700">
                <span className="font-semibold">Calling hours:</span> {fmt(start)} – {fmt(end)} ({routing.callHours.timezone})
                &nbsp;·&nbsp; Outside hours: Voice leads receive a WhatsApp holding message and are queued for the next morning.
              </p>
            </div>

            {/* Routing table */}
            <div className="divide-y divide-brand-border">
              {Object.entries(routing.rules).map(([source, channel]) => {
                const ch = CHANNEL_CONFIG[channel as 'voice' | 'whatsapp']
                const webhookUrl = WEBHOOK_URLS[source]
                return (
                  <div key={source} className="flex items-center gap-4 px-5 py-4">
                    {/* Source */}
                    <div className="flex items-center gap-2.5 w-44 flex-shrink-0">
                      <div className="w-7 h-7 rounded-lg bg-brand-gray flex items-center justify-center flex-shrink-0">
                        {SOURCE_ICONS[source]}
                      </div>
                      <span className="text-sm font-medium text-brand-black">{SOURCE_LABELS[source]}</span>
                    </div>

                    {/* Arrow */}
                    <svg className="w-4 h-4 text-brand-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                    </svg>

                    {/* Channel badge */}
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${ch.color}`}>
                      {ch.icon} {ch.label}
                    </span>

                    {/* Webhook URL */}
                    {webhookUrl && (
                      <div className="ml-auto flex-1 min-w-0 hidden md:block">
                        <p className="text-[10px] text-brand-muted mb-0.5">Webhook endpoint</p>
                        <code className="text-xs text-brand-subtext bg-brand-gray px-2 py-0.5 rounded font-mono truncate block">
                          {`https://your-domain.vercel.app${webhookUrl}`}
                        </code>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="px-5 py-3 bg-brand-gray/40 border-t border-brand-border">
              <p className="text-xs text-brand-muted">
                To change routing rules, edit <code className="bg-white px-1 py-0.5 rounded border border-brand-border text-brand-subtext">lib/client-config.ts</code> → <code className="bg-white px-1 py-0.5 rounded border border-brand-border text-brand-subtext">routing.rules</code>
              </p>
            </div>
          </div>
        </div>

        {/* ── Integrations ── */}
        <div>
          <h2 className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-3">Integrations</h2>
          <div className="space-y-4">
            <WhatsappConfigPanel />
            <VoiceConfigPanel />
          </div>
        </div>

        {/* ── Account ── */}
        <div>
          <h2 className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-3">Account</h2>
          <div className="bg-white rounded-xl border border-brand-border shadow-card p-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-brand-purple/10 flex items-center justify-center text-sm font-bold text-brand-purple flex-shrink-0">
                {CLIENT_CONFIG.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-brand-black">{CLIENT_CONFIG.name}</p>
                <p className="text-xs text-brand-muted">{CLIENT_CONFIG.demoEmail}</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-brand-purple/10 text-brand-purple border border-brand-purple/20 font-medium">Demo</span>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
