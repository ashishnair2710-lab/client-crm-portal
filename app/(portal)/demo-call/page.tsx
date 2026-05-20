import TopBar from '@/components/TopBar'
import VapiCallWidget from '@/components/VapiCallWidget'

export default function DemoCallPage() {
  return (
    <>
      <TopBar title="Demo Call" subtitle="Simulate an AI voice call with a lead" />
      <div className="p-6 max-w-3xl">

        {/* Header */}
        <div className="bg-white rounded-xl border border-brand-border shadow-card p-5 mb-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-purple flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-brand-black mb-1">AI Voice Call Demo</h2>
              <p className="text-xs text-brand-muted leading-relaxed">
                Simulate a live AI voice call the way a real lead would experience it. Fill in dummy lead data, connect your VAPI key, and press <strong>Start Demo Call</strong> — the AI agent will speak through your browser using WebRTC (no phone needed).
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {['Browser mic + speakers', 'Live transcript', 'AI-powered agent', 'Natural voice'].map(tag => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-brand-purple/10 text-brand-purple border border-brand-purple/20 font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { step: '1', title: 'Add API key', desc: 'Paste your AI voice API key to enable the call engine' },
            { step: '2', title: 'Fill lead data', desc: 'Choose a product and customer name for context' },
            { step: '3', title: 'Start call', desc: 'AI agent speaks back through your browser in real time' },
          ].map(s => (
            <div key={s.step} className="bg-white rounded-xl border border-brand-border shadow-card p-4">
              <div className="w-6 h-6 rounded-full bg-brand-purple text-white text-xs font-bold flex items-center justify-center mb-2">{s.step}</div>
              <p className="text-xs font-semibold text-brand-black mb-1">{s.title}</p>
              <p className="text-xs text-brand-muted leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        <VapiCallWidget />
      </div>
    </>
  )
}
