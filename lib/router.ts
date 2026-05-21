/**
 * Lead Routing Engine
 * Decides whether a new lead gets a WhatsApp message or a VAPI voice call
 * based on source and current time in UAE.
 */

import CLIENT_CONFIG from './client-config'
import { triggerVapiCall } from './vapi-client'
import { sendWhatsAppMessage } from './whatschimp-client'

export interface InboundLead {
  name:     string
  phone:    string
  email?:   string
  source:   'meta_ad' | 'google' | 'website' | 'tiktok'
  interest?: string
  location?: string
  rawPayload?: Record<string, unknown>
}

export type RouteOutcome =
  | { channel: 'voice';     status: 'called' | 'queued'; callId?: string }
  | { channel: 'whatsapp';  status: 'sent' | 'failed';   messageId?: string }

/** Returns true if current UAE time is within calling hours */
export function isCallHours(): boolean {
  const { start, end, timezone } = CLIENT_CONFIG.routing.callHours
  const hour = parseInt(
    new Intl.DateTimeFormat('en-US', { timeZone: timezone, hour: 'numeric', hour12: false }).format(new Date()),
    10
  )
  return hour >= start && hour < end
}

/** Core routing function — call after saving lead to DB */
export async function routeLead(lead: InboundLead): Promise<RouteOutcome> {
  const assignedChannel = CLIENT_CONFIG.routing.rules[lead.source] ?? 'whatsapp'

  // ── Voice path ──────────────────────────────────────────────────────────────
  if (assignedChannel === 'voice') {
    if (isCallHours()) {
      // Fire VAPI outbound call now
      const result = await triggerVapiCall(lead)
      return { channel: 'voice', status: 'called', callId: result.callId }
    } else {
      // Outside hours → send WhatsApp holding message, queue call for 9 AM
      await sendWhatsAppMessage({
        phone:   lead.phone,
        message: buildHoldingMessage(lead),
      })
      // TODO: persist to a queue table and trigger at next call-hours window
      return { channel: 'voice', status: 'queued' }
    }
  }

  // ── WhatsApp path ────────────────────────────────────────────────────────────
  const result = await sendWhatsAppMessage({
    phone:   lead.phone,
    message: buildWhatsAppIntro(lead),
  })
  return { channel: 'whatsapp', status: result.success ? 'sent' : 'failed', messageId: result.messageId }
}

// ── Message templates ──────────────────────────────────────────────────────────

function buildWhatsAppIntro(lead: InboundLead): string {
  const name     = lead.name?.split(' ')[0] || 'there'
  const interest = lead.interest ? ` regarding ${lead.interest.split('(')[0].trim()}` : ''
  return `Hi ${name}! 👋 Thanks for your interest in ${CLIENT_CONFIG.name}${interest}.\n\nI'm your AI design assistant — I'd love to help you explore options and answer any questions. What are you looking to transform? 🏡`
}

function buildHoldingMessage(lead: InboundLead): string {
  const name = lead.name?.split(' ')[0] || 'there'
  const { start } = CLIENT_CONFIG.routing.callHours
  const startLabel = start >= 12 ? `${start - 12} PM` : `${start} AM`
  return `Hi ${name}! Thanks for reaching out to ${CLIENT_CONFIG.name} ✨\n\nOur team is currently outside calling hours. One of our AI consultants will call you tomorrow from ${startLabel}.\n\nIn the meantime, feel free to browse our portfolio or reply here with any questions!`
}
