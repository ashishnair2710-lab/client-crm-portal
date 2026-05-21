/**
 * WhatChimp / WhatsApp Cloud API Incoming Webhook
 * Receives incoming messages, delivery receipts, and conversation events.
 * Setup: Meta Business → WhatsApp → Configuration → Webhook → /api/webhooks/whatschimp
 *
 * Key events:
 *   messages        → customer replied → update whatsapp_status = 'replied'
 *   statuses        → delivery/read receipts → update follow_up_sent timestamp
 */

import { NextRequest, NextResponse } from 'next/server'

// Meta sends GET to verify the webhook
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mode      = searchParams.get('hub.mode')
  const token     = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  }
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const entry  = body?.entry?.[0]
    const change = entry?.changes?.[0]
    const value  = change?.value

    if (!value) return NextResponse.json({ ok: true })

    // ── Incoming message from customer ────────────────────────────────────────
    if (value.messages?.length > 0) {
      for (const msg of value.messages) {
        const from = msg.from   // customer phone (E.164 without +)
        const text = msg.type === 'text' ? msg.text?.body : '[media]'

        console.log(`[WhatsApp Webhook] Message from ${from}: ${text}`)

        // TODO: look up lead by phone, update whatsapp_status = 'replied'
        // await supabase.from('leads')
        //   .update({ whatsapp_status: 'replied', updated_at: new Date().toISOString() })
        //   .eq('phone', `+${from}`)
      }
    }

    // ── Delivery / read receipts ───────────────────────────────────────────────
    if (value.statuses?.length > 0) {
      for (const status of value.statuses) {
        const { id: messageId, status: deliveryStatus, recipient_id } = status

        if (deliveryStatus === 'delivered' || deliveryStatus === 'read') {
          console.log(`[WhatsApp Webhook] Message ${messageId} to ${recipient_id}: ${deliveryStatus}`)

          // TODO: update follow_up_sent = true, follow_up_at = timestamp
          // await supabase.from('leads')
          //   .update({ follow_up_sent: true, follow_up_at: new Date().toISOString() })
          //   .eq('phone', `+${recipient_id}`)
        }
      }
    }

    return NextResponse.json({ ok: true })

  } catch (err) {
    console.error('[WhatsApp Webhook] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
