'use client'
import { useState, useEffect } from 'react'
import TopBar from '@/components/TopBar'
import MetricCard from '@/components/MetricCard'
import StatusBadge from '@/components/StatusBadge'
import SourceBadge from '@/components/SourceBadge'
import { LEADS, getWhatsappMetrics, getChatsPerDay, formatTimeAgo } from '@/lib/mock-data'
import WhatsappLineChart from '@/components/WhatsappLineChart'

function FollowUpBadge({ sent, at }: { sent: boolean; at?: string }) {
  if (sent) {
    return (
      <div className="flex flex-col gap-0.5">
        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
          </svg>
          Sent
        </span>
        {at && <span className="text-[10px] text-brand-muted">{formatTimeAgo(at)}</span>}
      </div>
    )
  }
  return <span className="text-xs text-brand-muted">—</span>
}

export default function WhatsappReportPage() {
  const metrics = getWhatsappMetrics()
  const chartData = getChatsPerDay(30)
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  const recentConvos = [...LEADS]
    .filter(l => l.whatsapp_status !== 'no_reply')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 15)

  const outcomeLabel: Record<string, string> = {
    replied: 'AI resolved',
    handed_off: 'Handed to agent',
    sent: 'Awaiting reply',
    no_reply: 'No reply',
  }

  useEffect(() => {
    const stored = localStorage.getItem('wc_config')
    if (stored) {
      try {
        const cfg = JSON.parse(stored)
        setIsConnected(!!(cfg.accessToken && cfg.phoneNumberId && cfg.wabaId))
      } catch {}
    }
    const ts = localStorage.getItem('wc_last_sync')
    if (ts) setLastSync(ts)
  }, [])

  async function handleSync() {
    setSyncing(true)
    // Simulate sync delay — replace with real WhatChimp webhook data fetch when live
    await new Promise(r => setTimeout(r, 1800))
    const ts = new Date().toISOString()
    localStorage.setItem('wc_last_sync', ts)
    setLastSync(ts)
    setSyncing(false)
  }

  return (
    <>
      <TopBar title="WhatsApp Report" subtitle="AI conversation performance over the last 30 days" />
      <div className="p-6 space-y-6">

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <MetricCard
            label="Chats initiated"
            value={metrics.initiated}
            accent="bg-brand-purple/10 text-brand-purple"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>}
          />
          <MetricCard
            label="AI answered"
            value={metrics.aiAnswered}
            delta="76%"
            deltaUp
            accent="bg-emerald-50 text-emerald-600"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
          />
          <MetricCard
            label="Handed to human"
            value={metrics.handedToHuman}
            accent="bg-violet-50 text-violet-600"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>}
          />
          <MetricCard
            label="No reply"
            value={metrics.noReply}
            accent="bg-gray-100 text-gray-500"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>}
          />
          <MetricCard
            label="Response rate"
            value={`${metrics.responseRate}%`}
            delta="5%"
            deltaUp
            accent="bg-amber-50 text-amber-600"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>}
          />
        </div>

        {/* Chart */}
        <div className="bg-white rounded-xl border border-brand-border shadow-card p-5">
          <h3 className="text-sm font-semibold text-brand-black mb-1">Chats Initiated — Last 30 Days</h3>
          <p className="text-xs text-brand-muted mb-4">WhatsApp conversations started by AI bot</p>
          <WhatsappLineChart data={chartData} />
        </div>

        {/* Recent conversations table */}
        <div className="bg-white rounded-xl border border-brand-border shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
            <h3 className="text-sm font-semibold text-brand-black">Recent Conversations</h3>
            {isConnected ? (
              <button
                onClick={handleSync}
                disabled={syncing}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-brand-border text-brand-subtext hover:bg-brand-gray transition-colors disabled:opacity-50"
              >
                <svg className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                {syncing ? 'Syncing…' : lastSync ? `Synced ${formatTimeAgo(lastSync)}` : 'Sync from WhatsApp'}
              </button>
            ) : (
              <a href="/settings" className="text-xs text-brand-purple hover:underline">
                Connect WhatsApp in Settings →
              </a>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-brand-gray/60 border-b border-brand-border">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide">Customer</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide hidden md:table-cell">Interest</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide">Source</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide">Outcome</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide">Follow Up</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-brand-muted uppercase tracking-wide hidden sm:table-cell">When</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border">
                {recentConvos.map(lead => (
                  <tr key={lead.id} className="hover:bg-brand-gray/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center text-xs font-semibold text-emerald-700 flex-shrink-0">
                          {lead.name.charAt(0)}
                        </div>
                        <span className="font-medium text-brand-black">{lead.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-brand-muted text-xs hidden md:table-cell max-w-[180px] truncate">{lead.interest.split('(')[0].trim()}</td>
                    <td className="px-4 py-3"><SourceBadge source={lead.source} /></td>
                    <td className="px-4 py-3">
                      <StatusBadge status={lead.whatsapp_status} />
                    </td>
                    <td className="px-4 py-3">
                      <FollowUpBadge sent={lead.follow_up_sent} at={lead.follow_up_at} />
                    </td>
                    <td className="px-4 py-3 text-brand-muted text-xs hidden sm:table-cell">{formatTimeAgo(lead.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
