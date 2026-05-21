/**
 * VAPI Call Events Webhook
 * VAPI sends events here during and after each call.
 * Setup: VAPI Dashboard → Settings → Server URL → /api/webhooks/vapi
 *
 * Key events:
 *   call-started    → update lead status to 'calling'
 *   call-ended      → save duration, outcome, transcript summary to DB
 *   transcript      → live transcript chunks (optional)
 */

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { message } = body

    if (!message) return NextResponse.json({ ok: true })

    const callId = message.call?.id
    const type   = message.type

    console.log(`[VAPI Webhook] Event: ${type} | Call: ${callId}`)

    switch (type) {

      case 'call-started':
        // TODO: update lead.call_status = 'calling' in Supabase
        break

      case 'end-of-call-report': {
        const summary     = message.analysis?.summary ?? ''
        const transcript  = message.artifact?.transcript ?? ''
        const duration    = message.durationSeconds ?? 0
        const endedReason = message.endedReason ?? ''
        const outcome     = resolveOutcome(endedReason, duration)

        console.log(`[VAPI Webhook] Call ended | Duration: ${duration}s | Outcome: ${outcome}`)
        console.log(`[VAPI Webhook] Summary: ${summary}`)

        // TODO: save to Supabase
        // await supabase.from('leads').update({
        //   call_status: outcome,
        //   ai_summary:  summary,
        //   transcript:  transcript,
        // }).eq('vapi_call_id', callId)
        break
      }

      case 'hang':
        // TODO: mark call as 'not_answered'
        break
    }

    return NextResponse.json({ ok: true })

  } catch (err) {
    console.error('[VAPI Webhook] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

function resolveOutcome(reason: string, duration: number): string {
  if (duration === 0)           return 'not_answered'
  if (reason === 'voicemail')   return 'not_answered'
  if (duration > 0 && duration < 15) return 'not_answered'
  if (reason === 'customer-ended-call') return 'answered'
  return 'answered'
}
