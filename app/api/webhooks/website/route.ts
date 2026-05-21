/**
 * Website Contact Form Webhook
 * Your website form POSTs to this endpoint on submission.
 *
 * Usage from website:
 *   fetch('https://your-portal.vercel.app/api/webhooks/website', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json', 'x-api-key': 'YOUR_SECRET' },
 *     body: JSON.stringify({ name, phone, email, interest, location })
 *   })
 *
 * Route: Website Form → VAPI voice call (if 9AM–6PM UAE), else WhatsApp holding msg
 */

import { NextRequest, NextResponse } from 'next/server'
import { routeLead, isCallHours, type InboundLead } from '@/lib/router'

export async function POST(req: NextRequest) {
  try {
    // Simple API key auth — set WEBSITE_WEBHOOK_SECRET in env vars
    const apiKey = req.headers.get('x-api-key')
    const secret = process.env.WEBSITE_WEBHOOK_SECRET
    if (secret && apiKey !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    const lead: InboundLead = {
      name:       body.name     ?? 'Unknown',
      phone:      body.phone    ?? '',
      email:      body.email    ?? undefined,
      source:     'website',
      interest:   body.interest ?? body.service ?? undefined,
      location:   body.location ?? body.city    ?? undefined,
      rawPayload: body,
    }

    if (!lead.phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 422 })
    }

    const callNow = isCallHours()
    console.log(`[Website Webhook] Lead: ${lead.name} | Phone: ${lead.phone} | Call hours: ${callNow}`)

    // TODO: save lead to Supabase before routing
    // await saveLead(lead)

    const outcome = await routeLead(lead)

    return NextResponse.json({ success: true, outcome, callHours: callNow })

  } catch (err) {
    console.error('[Website Webhook] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
