import TopBar from '@/components/TopBar'
import WhatsappConfigPanel from '@/components/WhatsappConfigPanel'
import VoiceConfigPanel from '@/components/VoiceConfigPanel'

export default function SettingsPage() {
  return (
    <>
      <TopBar title="Settings" subtitle="Account and integrations configuration" />
      <div className="p-6 max-w-3xl space-y-8">

        {/* Integrations section */}
        <div>
          <h2 className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-3">Integrations</h2>
          <div className="space-y-4">
            <WhatsappConfigPanel />
            <VoiceConfigPanel />
          </div>
        </div>

        {/* Account section */}
        <div>
          <h2 className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-3">Account</h2>
          <div className="bg-white rounded-xl border border-brand-border shadow-card p-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-brand-purple/10 flex items-center justify-center text-sm font-bold text-brand-purple flex-shrink-0">A</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-brand-black">Demo Account</p>
                <p className="text-xs text-brand-muted">demo@client.com</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-brand-purple/10 text-brand-purple border border-brand-purple/20 font-medium">Demo</span>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
