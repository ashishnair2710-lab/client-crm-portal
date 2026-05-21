/**
 * Meta Lead Ads Webhook
 * Meta sends lead data here when someone submits a Lead Ad form.
 * Setup: Meta Business → Leads Access → Webhooks → point to /api/webhooks/meta
 *
 * Route: Meta Ad → WhatChimp (WhatsApp)
 */

import { NextRequest, NextResponse } from 'next/server'
import { routeLead, type InboundLead } from '@/lib/router'

// Meta sends a GET to verify the webhook endpoint
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mode      = searchParams.get('hub.mode')
  const token     = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.META_WEBHOOK_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  }
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

// Meta sends a POST with lead data
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Extract lead fields from Meta's leadgen payload
    const entry    = body?.entry?.[0]
    const change   = entry?.changes?.[0]
    const leadData = change?.value

    if (!leadData) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    // Meta lead field data comes as an array of {name, values} pairs
    const fields: Record<string, string> = {}
    for (const field of leadData.field_data ?? []) {
      fields[field.name] = field.values?.[0] ?? ''
    }

    const lead: InboundLead = {
      name:       fields['full_name'] || fields['first_name'] || 'Unknown',
      phone:      fields['phone_number'] || fields['phone'] || '',
      email:      fields['email'] || undefined,
      source:     'meta_ad',
      interest:   fields['interest'] || fields['product'] || undefined,
      location:   fields['city'] || fields['location'] || undefined,
      rawPayload: body,
    }

    if (!lead.phone) {
      return NextResponse.json({ error: 'No phone number in lead' }, { status: 422 })
    }

    // TODO: save lead to Supabase here before routing
    // await saveLead(lead)

    const outcome = await routeLead(lead)

    console.log(`[Meta Webhook] Lead: ${lead.name} | Phone: ${lead.phone} | Routed: ${outcome.channel} / ${outcome.status}`)
    return NextResponse.json({ success: true, outcome })

  } catch (err) {
    console.error('[Meta Webhook] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
