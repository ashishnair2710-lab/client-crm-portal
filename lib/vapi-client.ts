/**
 * VAPI Outbound Call Client
 * Triggers an AI voice call to a lead via the VAPI Phone Call API.
 * Docs: https://docs.vapi.ai/api-reference/calls/create
 */

import CLIENT_CONFIG from './client-config'
import type { InboundLead } from './router'

interface VapiCallResult {
  callId:  string
  status:  string
}

export async function triggerVapiCall(lead: InboundLead): Promise<VapiCallResult> {
  const apiKey       = process.env.VAPI_PRIVATE_KEY
  const phoneNumberId = process.env.VAPI_PHONE_NUMBER_ID
  const assistantId  = process.env.VAPI_ASSISTANT_ID  // optional

  if (!apiKey || !phoneNumberId) {
    throw new Error('VAPI_PRIVATE_KEY and VAPI_PHONE_NUMBER_ID are required in environment variables')
  }

  const body: Record<string, unknown> = {
    phoneNumberId,
    customer: {
      number: lead.phone,
      name:   lead.name,
    },
  }

  if (assistantId) {
    // Use a pre-configured assistant from VAPI dashboard
    body.assistantId = assistantId
  } else {
    // Inline assistant with lead-contextual system prompt
    body.assistant = {
      name:         CLIENT_CONFIG.agent.name,
      firstMessage: `Hello ${lead.name?.split(' ')[0] || 'there'}! This is ${CLIENT_CONFIG.name} calling. I understand you were interested in our ${lead.interest?.split('(')[0].trim() ?? 'services'}. ${CLIENT_CONFIG.agent.greeting}`,
      transcriber: { provider: 'deepgram', model: 'nova-2', language: 'en-US' },
      model: {
        provider:     'openai',
        model:        'gpt-4o-mini',
        systemPrompt: CLIENT_CONFIG.agent.systemPrompt(lead.name, lead.interest ?? '', lead.location ?? ''),
      },
      voice: { provider: '11labs', voiceId: 'paula' },
    }
  }

  const res = await fetch('https://api.vapi.ai/call/phone', {
    method:  'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`VAPI call failed: ${res.status} — ${err}`)
  }

  const data = await res.json()
  return { callId: data.id, status: data.status }
}
