'use client'
import { useState } from 'react'
import TopBar from '@/components/TopBar'
import MetricCard from '@/components/MetricCard'
import StatusBadge from '@/components/StatusBadge'
import SourceBadge from '@/components/SourceBadge'
import LeadsBarChart from '@/components/LeadsBarChart'
import {
  LEADS,
  getDashboardMetrics,
  getLeadsPerDay,
  getPipelineBreakdown,
  getAdSpendByChannel,
  getLeadsBySource,
  formatTimeAgo,
} from '@/lib/mock-data'

const DATE_RANGES = [
  { label: '7D',  days: 7  },
  { label: '14D', days: 14 },
  { label: '30D', days: 30 },
]

export default function DashboardPage() {
  const [range, setRange] = useState(7)
  const metrics    = getDashboardMetrics()
  const pipeline   = getPipelineBreakdown()
  const adSpend    = getAdSpendByChannel()
  const bySource   = getLeadsBySource()
  const chartData  = getLeadsPerDay(range)
  const recentLeads = [...LEADS]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 8)

  const totalSpend = adSpend.reduce((s, c) => s + c.spend, 0)
  const maxSource  = Math.max(...bySource.map(s => s.count))
  const maxStage   = Math.max(...pipeline.map(p => p.count))

  return (
    <>
      <TopBar title="Dashboard" subtitle="Overview of your lead pipeline" />
      <div className="p-6 space-y-5">

        {/* ── Row 1: KPI cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Total leads this month"
            value={metrics.totalLeads}
            delta="12%" deltaUp
            accent="bg-brand-purple/10 text-brand-purple"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>}
          />
          <MetricCard
            label="WhatsApp chats answered"
            value={metrics.whatsappAnswered}
            delta="8%" deltaUp
            accent="bg-emerald-50 text-emerald-600"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>}
          />
          <MetricCard
            label="Voice calls made"
            value={metrics.callsMade}
            delta="5%" deltaUp
            accent="bg-blue-50 text-blue-600"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>}
          />
          <MetricCard
            label="Qualified leads"
            value={metrics.qualifiedLeads}
            delta="3%" deltaUp
            accent="bg-amber-50 text-amber-600"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>}
          />
        </div>

        {/* ── Row 2: Pipeline + Ad Spend + Source breakdown ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Pipeline funnel */}
          <div className="bg-white rounded-xl border border-brand-border shadow-card p-5">
            <h3 className="text-sm font-semibold text-brand-black mb-1">Lead Pipeline</h3>
            <p className="text-xs text-brand-muted mb-4">Current stage breakdown</p>
            <div className="space-y-3">
              {pipeline.map(p => (
                <div key={p.stage}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-brand-subtext">{p.stage}</span>
                    <span className="text-xs font-bold text-brand-black">{p.count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-brand-gray overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.round(p.count / maxStage * 100)}%`, backgroundColor: p.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-brand-border flex items-center justify-between">
              <span className="text-xs text-brand-muted">Conversion rate</span>
              <span className="text-sm font-bold text-emerald-600">
                {Math.round(metrics.qualifiedLeads / Math.max(metrics.totalLeads, 1) * 100)}%
              </span>
            </div>
          </div>

          {/* Ad spend */}
          <div className="bg-white rounded-xl border border-brand-border shadow-card p-5">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-brand-black">Ad Spend by Channel</h3>
              <span className="text-xs text-brand-muted">This month</span>
            </div>
            <p className="text-xs text-brand-muted mb-4">AED {totalSpend.toLocaleString()} total</p>
            <div className="space-y-3">
              {adSpend.map(ch => {
                const cpl = ch.leads > 0 ? Math.round(ch.spend / ch.leads) : 0
                return (
                  <div key={ch.source} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: ch.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-medium text-brand-subtext">{ch.label}</span>
                        <span className="text-xs font-bold text-brand-black">
                          {ch.spend > 0 ? `AED ${ch.spend.toLocaleString()}` : 'Organic'}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-brand-gray overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${totalSpend > 0 && ch.spend > 0 ? Math.round(ch.spend / totalSpend * 100) : 5}%`, backgroundColor: ch.color, opacity: 0.8 }}
                        />
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 w-16">
                      <p className="text-[10px] text-brand-muted">{ch.leads} leads</p>
                      {cpl > 0 && <p className="text-[10px] font-semibold text-brand-subtext">AED {cpl}/lead</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Lead source breakdown */}
          <div className="bg-white rounded-xl border border-brand-border shadow-card p-5">
            <h3 className="text-sm font-semibold text-brand-black mb-1">Leads by Source</h3>
            <p className="text-xs text-brand-muted mb-4">Where your leads are coming from</p>
            <div className="space-y-3">
              {bySource.map(s => (
                <div key={s.source}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                      <span className="text-xs font-medium text-brand-subtext">{s.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-brand-muted">{Math.round(s.count / LEADS.length * 100)}%</span>
                      <span className="text-xs font-bold text-brand-black w-5 text-right">{s.count}</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-brand-gray overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.round(s.count / maxSource * 100)}%`, backgroundColor: s.color, opacity: 0.75 }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-brand-border">
              <p className="text-xs text-brand-muted">Best performing source</p>
              <p className="text-sm font-bold text-brand-black mt-0.5">
                {bySource.sort((a, b) => b.count - a.count)[0]?.label}
                <span className="text-xs font-normal text-brand-muted ml-1">
                  · {bySource.sort((a, b) => b.count - a.count)[0]?.count} leads
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* ── Row 3: Chart + Recent leads ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Bar chart with date toggle */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-brand-border shadow-card p-5">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-brand-black">Leads Over Time</h3>
              <div className="flex items-center gap-1 bg-brand-gray rounded-lg p-0.5">
                {DATE_RANGES.map(r => (
                  <button
                    key={r.days}
                    onClick={() => setRange(r.days)}
                    className={`text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
                      range === r.days
                        ? 'bg-white text-brand-black shadow-sm'
                        : 'text-brand-muted hover:text-brand-subtext'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs text-brand-muted mb-4">Daily lead capture volume</p>
            <LeadsBarChart data={chartData} />
          </div>

          {/* Recent leads */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-brand-border shadow-card">
            <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
              <h3 className="text-sm font-semibold text-brand-black">Recent Leads</h3>
              <a href="/leads" className="text-xs text-brand-purple hover:text-brand-purplehov font-medium transition-colors">View all →</a>
            </div>
            <div className="divide-y divide-brand-border">
              {recentLeads.map(lead => (
                <a
                  key={lead.id}
                  href={`/leads/${lead.id}`}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-brand-gray/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-purple/10 flex items-center justify-center text-xs font-semibold text-brand-purple flex-shrink-0">
                    {lead.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-black truncate">{lead.name}</p>
                    <p className="text-xs text-brand-muted truncate">{lead.interest.split('(')[0].trim()}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <SourceBadge source={lead.source} />
                    <StatusBadge status={lead.status} showDot />
                  </div>
                  <span className="text-xs text-brand-muted flex-shrink-0 hidden sm:block">{formatTimeAgo(lead.created_at)}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
