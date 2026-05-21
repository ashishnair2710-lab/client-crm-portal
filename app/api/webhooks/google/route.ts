/**
 * Google Lead Form Webhook
 * Google Ads Lead Form Extensions send lead data here on submission.
 * Setup: Google Ads → Lead Forms → Webhook → /api/webhooks/google
 *
 * Route: Google Form → VAPI voice call (if 9AM–6PM UAE), else WhatsApp holding msg
 */

import { NextRequest, NextResponse } from 'next/server'
import { routeLead, isCallHours, type InboundLead } from '@/lib/router'

export async function POST(req: NextRequest) {
  try {
    // Google sends a key header for verification
    const googleKey = req.headers.get('google-click-id') ?? ''
    const secret    = process.env.GOOGLE_WEBHOOK_SECRET
    if (secret && googleKey !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    // Google Lead Form payload structure
    const lead: InboundLead = {
      name:       `${body.user_column_data?.find((f: {column_name: string}) => f.column_name === 'FULL_NAME')?.string_value ?? 'Unknown'}`,
      phone:      body.user_column_data?.find((f: {column_name: string}) => f.column_name === 'PHONE_NUMBER')?.string_value ?? '',
      email:      body.user_column_data?.find((f: {column_name: string}) => f.column_name === 'EMAIL')?.string_value,
      source:     'google',
      interest:   body.user_column_data?.find((f: {column_name: string}) => f.column_name === 'WHAT_ARE_YOU_INTERESTED_IN')?.string_value,
      location:   body.user_column_data?.find((f: {column_name: string}) => f.column_name === 'CITY')?.string_value,
      rawPayload: body,
    }

    if (!lead.phone) {
      return NextResponse.json({ error: 'No phone number in lead' }, { status: 422 })
    }

    const callNow = isCallHours()
    console.log(`[Google Webhook] Lead: ${lead.name} | Call hours: ${callNow}`)

    // TODO: save lead to Supabase before routing
    // await saveLead(lead)

    const outcome = await routeLead(lead)

    return NextResponse.json({ success: true, outcome, callHours: callNow })

  } catch (err) {
    console.error('[Google Webhook] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
