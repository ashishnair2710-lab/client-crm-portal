/**
 * ─────────────────────────────────────────────────────────────
 *  CLIENT CONFIG  —  change this file to rebrand the portal
 * ─────────────────────────────────────────────────────────────
 *
 *  For each new client deployment:
 *  1. Fork / duplicate this repo
 *  2. Edit ONLY this file
 *  3. Push → Vercel auto-deploys a fully rebranded portal
 *
 *  For brand colours, also update tailwind.config.js → brand.purple
 * ─────────────────────────────────────────────────────────────
 */

const CLIENT_CONFIG = {

  // ── Identity ──────────────────────────────────────────────
  name:       'Forma Design Studio',   // shown in sidebar, topbar, login, page title
  initials:   'F',                     // avatar letter in sidebar + topbar
  industry:   'Interior Design',       // shown as subtitle on login page
  website:    'formadesign.ae',        // not rendered yet — for future use

  // ── Demo login credentials ────────────────────────────────
  demoEmail:    'demo@client.com',
  demoPassword: 'demo123',

  // ── AI Voice Agent (Demo Call page) ──────────────────────
  agent: {
    name:        'Forma Design Consultant',
    description: 'a bespoke interior design studio in the UAE with projects across Dubai, Abu Dhabi, and Sharjah',
    greeting:    "I'd love to learn more about your project — could you tell me a little about the space you're looking to transform?",
    services: [
      'Full Villa Interior Design — 4–5BR (AED 40,000+)',
      'Full Apartment Design — 2BR (AED 18,000)',
      'Full Apartment Design — 1BR (AED 12,000)',
      'Living Room Makeover (AED 8,500)',
      'Master Bedroom Redesign (AED 7,500)',
      'Kitchen & Dining Open Plan Redesign (AED 12,000)',
      'Home Office Design Package (AED 5,500)',
      'Commercial Office Design (AED 30,000+)',
      'Space Planning Consultation (AED 3,500)',
      'Colour & Materials Consultation (AED 1,500)',
    ],
    locations: [
      'Dubai — Downtown',
      'Dubai — Palm Jumeirah',
      'Dubai — JVC',
      'Dubai — Marina',
      'Dubai — Business Bay',
      'Dubai — Arabian Ranches',
      'Sharjah',
      'Abu Dhabi',
      'Ajman',
    ],
    systemPrompt: (name: string, interest: string, location: string) =>
      `You are a warm, professional AI design consultant for Forma Design Studio — a bespoke interior design studio in the UAE with projects across Dubai, Abu Dhabi, and Sharjah.

You are currently on a call with ${name || 'a client'}, who is enquiring about: ${interest || 'interior design services'}.
Their location: ${location || 'UAE'}.

Your goals for this call:
1. Greet them warmly and confirm what they're looking for
2. Ask 1–2 qualifying questions about their space (size, style preferences, timeline)
3. Recommend the most suitable service package with pricing
4. Mention that all projects include a complimentary initial consultation and 3D visualisations
5. Explain the typical project timeline (6–10 weeks from concept to completion)
6. Offer to send our portfolio and book a discovery call with a lead designer
7. Close warmly — confirm next steps

Key facts:
- Services range from AED 1,500 (consultation) to AED 55,000+ (full villa)
- All packages include concept design, 3D renders, material selection, and project management
- We work across residential and commercial spaces
- Styles we specialise in: modern Arabic, Japandi, contemporary luxury, minimalist

Keep responses concise and conversational. Speak in English. Be helpful and consultative, not pushy.`,
  },

}

export default CLIENT_CONFIG
