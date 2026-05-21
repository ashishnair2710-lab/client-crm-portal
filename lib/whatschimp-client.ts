/**
 * WhatChimp / WhatsApp Cloud API Client
 * Sends outbound WhatsApp messages via the Meta WhatsApp Business Cloud API.
 * Credentials are set in environment variables (also saveable via Settings UI).
 */

interface SendMessageParams {
  phone:    string   // E.164 format, e.g. +971501234567
  message:  string
}

interface SendMessageResult {
  success:    boolean
  messageId?: string
  error?:     string
}

export async function sendWhatsAppMessage(params: SendMessageParams): Promise<SendMessageResult> {
  const accessToken   = process.env.WHATSAPP_ACCESS_TOKEN
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID

  if (!accessToken || !phoneNumberId) {
    console.warn('[WhatsApp] Missing env vars — WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID')
    // Return mock success in dev/demo mode so routing doesn't break
    return { success: true, messageId: `mock-${Date.now()}` }
  }

  // Normalise phone — remove spaces, ensure + prefix
  const to = params.phone.replace(/\s/g, '').replace(/^00/, '+')

  const body = {
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: { body: params.message, preview_url: false },
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
      {
        method:  'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      }
    )

    const data = await res.json()

    if (!res.ok) {
      return { success: false, error: data?.error?.message ?? 'Unknown error' }
    }

    return { success: true, messageId: data.messages?.[0]?.id }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Network error'
    return { success: false, error: msg }
  }
}
