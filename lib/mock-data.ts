import type { Lead, WhatsappEvent, CallEvent, Client, TimelineEvent } from './types'

export const CLIENT: Client = {
  id: 'client-001',
  name: 'Forma Design Studio',
  logo_url: '',
  created_at: '2024-01-01T00:00:00Z',
}

function daysAgo(n: number, hourOffset = 0): string {
  const d = new Date('2026-05-20T12:00:00Z')
  d.setDate(d.getDate() - n)
  d.setHours(d.getHours() - hourOffset)
  return d.toISOString()
}

const TRANSCRIPTS: Record<string, string> = {
  villa_full: `[10:15 AM] Bot → Customer: Hello! Welcome to Forma Design Studio. How can we help bring your vision to life? 🏡
[10:16 AM] Customer → Bot: Hi, I have a 5BR villa in Emirates Hills and I want a complete interior redesign
[10:17 AM] Bot → Customer: Exciting! A full villa transformation is our speciality. Our bespoke design packages for 5-bedroom villas typically start from AED 45,000, covering concept design, material selection, 3D visualisations, and project management.
[10:18 AM] Customer → Bot: What's included exactly?
[10:19 AM] Bot → Customer: Our full package includes: initial consultation & mood board, space planning, 3D renders per room, material & finish schedule, furniture sourcing, and on-site supervision. All tailored to your personal style.
[10:21 AM] Customer → Bot: I prefer a modern Arabic aesthetic — clean lines with warm textures
[10:22 AM] Bot → Customer: A beautiful direction! We often pair warm limestone, brushed brass fixtures, and deep jewel tones for that look. Our lead designer Nadia has done several stunning Emirates Hills projects in that style.
[10:24 AM] Customer → Bot: Can I see some portfolio examples?
[10:25 AM] Bot → Customer: Absolutely! I'll have our team send you our portfolio PDF and arrange a complimentary 30-min consultation with Nadia. What days work for you this week?
[10:26 AM] Customer → Bot: Thursday or Friday afternoon
[10:27 AM] Bot → Customer: Confirmed! Our team will contact you to schedule Thursday or Friday. Looking forward to working with you! ✨`,

  apartment_2br: `[02:30 PM] Bot → Customer: Hi there! Thanks for reaching out to Forma Design Studio.
[02:31 PM] Customer → Bot: Hello, I just moved into a 2BR apartment in Downtown Dubai and need help with the design
[02:32 PM] Bot → Customer: Congratulations on your new place! A 2-bedroom apartment in Downtown is a dream canvas. Our Apartment Design Package starts from AED 18,000 and includes full concept to completion.
[02:33 PM] Customer → Bot: Does that include the furniture or just the design?
[02:34 PM] Bot → Customer: The package covers design services — concept, 3D visuals, material board, and sourcing recommendations. We also offer a furniture sourcing add-on where we procure pieces on your behalf, usually 10–15% of furniture budget.
[02:36 PM] Customer → Bot: What style do you recommend for Downtown?
[02:37 PM] Bot → Customer: For Downtown apartments, contemporary minimalism works beautifully — open layouts, neutral bases with bold accent pieces, lots of natural light maximisation. Very popular right now is the warm minimalist look — think Japandi meets Dubai luxury.
[02:39 PM] Customer → Bot: I love that! How long would a project like this take?
[02:40 PM] Bot → Customer: Typically 6–8 weeks from concept approval to handover. We've delivered Downtown apartments in as little as 5 weeks. Can I connect you with our project team to discuss your timeline?
[02:41 PM] Customer → Bot: Yes please
[02:42 PM] Bot → Customer: Connecting you now! Expect a call within the hour 🎉`,

  living_room: `[11:00 AM] Bot → Customer: Good morning! How can Forma Design Studio help you today?
[11:01 AM] Customer → Bot: I want to redesign my living room — it feels very outdated
[11:02 AM] Bot → Customer: We love a good living room transformation! Our Living Room Makeover package is AED 8,500 and covers a full redesign concept, 3D visualisation, furniture layout plan, and a curated decor shopping list.
[11:03 AM] Customer → Bot: Can you work with existing furniture or do I need to buy everything new?
[11:04 AM] Bot → Customer: Absolutely — we work with what you have! We often reupholster, repaint, or restyle existing pieces. Many clients are surprised how much we can transform a space without full replacement.
[11:06 AM] Customer → Bot: That's reassuring. What information do you need from me to get started?
[11:07 AM] Bot → Customer: Just room dimensions, a few photos of the current space, and your style preferences. We'll do the rest! I can send you a quick intake form right now.
[11:08 AM] Customer → Bot: Send it over
[11:09 AM] Bot → Customer: Sent! Once we receive it, a designer will review and schedule your complimentary discovery call within 24 hours 📐`,

  home_office: `[04:45 PM] Bot → Customer: Hello! Welcome to Forma Design Studio.
[04:46 PM] Customer → Bot: Hi I need a home office design — currently using a spare room and it's a mess
[04:47 PM] Bot → Customer: You're not alone! A well-designed home office dramatically improves focus and productivity. Our Home Office Design Package is AED 5,500 — includes space planning, built-in storage design, lighting plan, and a style concept.
[04:48 PM] Customer → Bot: I work in finance so I need it to look professional for video calls
[04:49 PM → Customer: What background looks best on camera?
[04:49 AM] Bot → Customer: Great consideration! We design specifically for camera backgrounds — typically a combination of textured wall treatment, curated bookshelf or artwork, and warm task lighting. Creates a polished, professional look on screen.
[04:51 AM] Customer → Bot: Perfect. My room is about 3x4 metres
[04:52 AM] Bot → Customer: That's a great size for a dedicated home office! We can fit a full executive desk setup, built-in shelving, and a small seating area in that footprint. Shall I arrange a virtual consultation?
[04:53 AM] Customer → Bot: Yes, tomorrow works
[04:54 AM] Bot → Customer: Booked! Our designer will confirm the time shortly. Looking forward to creating your perfect workspace 💼`,

  kitchen_dining: `[12:20 PM] Bot → Customer: Hi! Forma Design Studio here — how can we help?
[12:21 PM] Customer → Bot: I want to redesign my kitchen and dining area together as an open plan
[12:22 PM] Bot → Customer: A kitchen-dining redesign is one of the most impactful transformations for a home. Our Kitchen & Dining package starts at AED 12,000 and covers space planning, cabinet design, material selection, lighting, and 3D visualisation.
[12:23 PM] Customer → Bot: We have a separate kitchen now but want to open it up
[12:24 PM] Bot → Customer: Open-plan kitchen-dining is a wonderful choice! We handle all the architectural coordination — we work alongside your contractor and ensure the design is practical and beautiful. Island or breakfast bar?
[12:25 PM] Customer → Bot: Island definitely
[12:26 PM] Bot → Customer: Classic choice! We can design a statement island with waterfall countertops, pendant lighting above, and bar seating on one side. Very popular in Jumeirah villas right now.
[12:28 PM] Customer → Bot: I like marble — is it practical?
[12:29 PM] Bot → Customer: We love marble! For kitchens we often recommend a sealed Calacatta or a high-quality sintered stone like Dekton — looks identical but far more durable and heat-resistant. Best of both worlds.
[12:30 PM] Customer → Bot: That makes sense. Can someone call me to discuss the project?
[12:31 PM] Bot → Customer: Of course! Connecting you with our kitchen specialist now 🎨`,

  commercial: `[09:30 AM] Bot → Customer: Good morning! Welcome to Forma Design Studio.
[09:31 AM] Customer → Bot: Hi, I'm opening a new law firm office in DIFC and need a full interior design
[09:32 AM] Bot → Customer: Congratulations on the new office! DIFC is a prestigious address — your office design needs to match. Our Commercial Office Design packages start from AED 30,000 for fit-out design, including space planning, branding integration, materials, lighting, and contractor coordination.
[09:33 AM] Customer → Bot: We need a reception area, 8 private offices, a boardroom, and a client lounge
[09:34 AM] Bot → Customer: Perfect brief! For law firms we design around gravitas and confidentiality — private acoustic offices, a commanding boardroom, and a client lounge that exudes calm and trust. Dark woods, leather, and subtle brass accents are on-trend for legal environments.
[09:36 AM] Customer → Bot: We want it to feel modern but authoritative
[09:37 AM] Bot → Customer: Exactly the right instinct. Think deep navy or charcoal feature walls, bespoke joinery, concealed lighting, and a signature reception wall with the firm name backlit. We've done three DIFC law offices this year.
[09:38 AM] Customer → Bot: Do you manage the fit-out contractors too?
[09:39 AM] Bot → Customer: Yes — we offer full project management including tendering contractors, site supervision, and snagging. You focus on your business, we deliver the space. Shall I send our commercial portfolio?
[09:40 AM] Customer → Bot: Please do and arrange a meeting
[09:41 AM] Bot → Customer: Portfolio sent and meeting requested! Our commercial team will be in touch within 2 hours 🏢`,

  no_reply: `[10:00 AM] Bot → Customer: Hi! You enquired about our interior design services through our Instagram. We'd love to help transform your space ✨
[-- No response after 4 hours --]
[02:00 PM] Bot → Customer: Just following up! Whether it's a full villa redesign or a single room refresh, we have packages starting from AED 1,500. Our team is here to guide you.
[-- No response after 24 hours --]
[Next day 10:00 AM] Bot → Customer: Hi, one final follow-up from Forma Design Studio. If you'd like a complimentary 15-min design consultation, reply any time — no commitment needed 🏡
[-- No response --]`,
}

const SUMMARIES: Record<string, string> = {
  qualified_villa: 'Client enquired about a full 5BR villa redesign in Emirates Hills. Interested in modern Arabic aesthetic — warm textures, brushed brass, jewel tones. Bot confirmed package scope (AED 45,000+) and requested portfolio. Conversation handed to lead designer Nadia. Call completed — client confirmed Thursday/Friday availability for consultation. Recommended next action: send portfolio and book design consultation.',
  qualified_apartment: 'Client moving into a 2BR Downtown Dubai apartment. Expressed strong interest in warm minimalist / Japandi-meets-Dubai aesthetic. Bot explained full design package (AED 18,000) including furniture sourcing add-on. Client approved and requested project team contact. Call made and answered. Recommended next action: send onboarding form and timeline.',
  qualified_living: 'Client wants to refresh an outdated living room. Keen on working with existing furniture where possible. Bot sent intake form. Client engaged and ready to proceed with Living Room Makeover package (AED 8,500). Recommended next action: review intake form and book discovery call.',
  qualified_commercial: 'Client opening a law firm in DIFC — requires reception, 8 offices, boardroom, and client lounge. Strong interest in commercial package (AED 30,000+). Bot sent commercial portfolio. Client requested meeting with commercial team. Recommended next action: schedule in-person meeting at DIFC office.',
  qualified_kitchen: 'Client wants to open up kitchen and dining into an open-plan space. Interested in island with waterfall countertop and sintered stone worktops. Package: AED 12,000. Conversation handed to kitchen specialist. Recommended next action: conduct site visit and present initial concept.',
  contacted_office: 'Client needs a home office design for a 3×4m room — finance professional needing a camera-ready background. Interested in Home Office Package (AED 5,500). Virtual consultation booked for next day. Recommended next action: confirm virtual consultation time and send style questionnaire.',
  contacted_bedroom: 'Client wants a master bedroom redesign for a villa in Arabian Ranches. Interested in a luxury hotel-style look. Bot discussed material and colour direction. Client comparing quotes from 2 studios. Recommended next action: send comparison sheet and offer to do a complimentary mood board.',
  contacted_colourconsult: 'Client moving into a new apartment and unsure about colour scheme. Enquired about Colour Consultation package (AED 1,500). Interested but wants to see sample work first. Recommended next action: send colour project portfolio and follow up in 48 hours.',
  contacted_spaceplanning: 'Client has a tricky open-plan layout and needs professional space planning before buying furniture. Interested in Space Planning Consultation (AED 3,500). Call attempted — not answered. Recommended next action: retry call and send a brief intro video on our process.',
  new_lead: 'New lead via Instagram. Interest expressed in interior design services. WhatsApp message sent with studio introduction and service overview. Awaiting customer reply. Recommended next action: follow up in 3 hours with portfolio highlights.',
  cold_no_reply: 'Lead captured via Instagram ad. WhatsApp message sent — no response after 3 follow-up attempts over 7 days. Call attempted — not answered twice. Marked as cold. Recommended next action: re-engage with promotional offer or before/after case study in 30 days.',
}

type RawLead = [
  string, // name
  string, // phone
  string, // email
  Lead['source'],
  Lead['status'],
  Lead['whatsapp_status'],
  Lead['call_status'],
  string, // interest / service
  string, // location
  number, // days ago
  string, // summary key
  string, // transcript key
]

const RAW: RawLead[] = [
  // QUALIFIED leads (15)
  ['Ahmed Al Rashidi',     '+971501234567', 'ahmed.rashidi@gmail.com',      'meta_ad', 'qualified', 'handed_off', 'answered',     'Full Villa Interior Design — 5BR Emirates Hills (AED 45,000+)',   'Emirates Hills',        2,  'qualified_villa',       'villa_full'],
  ['Mohammed Al Mansoori', '+971502345678', 'moh.mansoori@hotmail.com',     'meta_ad', 'qualified', 'handed_off', 'answered',     'Full Apartment Design — 2BR Downtown Dubai (AED 18,000)',         'Downtown Dubai',        3,  'qualified_apartment',   'apartment_2br'],
  ['Fatima Al Zaabi',      '+971503456789', 'fatima.zaabi@gmail.com',       'google',  'qualified', 'replied',    'answered',     'Living Room Makeover (AED 8,500)',                                 'Jumeirah Park',         4,  'qualified_living',      'living_room'],
  ['Salem Al Nuaimi',      '+971504567890', 'salem.nuaimi@gmail.com',       'website', 'qualified', 'handed_off', 'answered',     'Commercial Office Design — DIFC Law Firm (AED 30,000+)',          'DIFC, Dubai',           1,  'qualified_commercial',  'commercial'],
  ['Khalid Al Shamsi',     '+971505678901', 'khalid.shamsi@yahoo.com',      'meta_ad', 'qualified', 'replied',    'answered',     'Kitchen & Dining Open Plan Redesign (AED 12,000)',                'Jumeirah Village Circle',5, 'qualified_kitchen',     'kitchen_dining'],
  ['Mariam Al Kaabi',      '+971506789012', 'mariam.kaabi@gmail.com',       'google',  'qualified', 'handed_off', 'answered',     'Full Villa Interior Design — 4BR Palm Jumeirah (AED 42,000+)',   'Palm Jumeirah',         6,  'qualified_villa',       'villa_full'],
  ['Vikram Sharma',        '+971507890123', 'vikram.sharma@gmail.com',      'meta_ad', 'qualified', 'replied',    'callback',     'Full Apartment Design — 3BR Dubai Marina (AED 24,000)',           'Dubai Marina',          7,  'qualified_apartment',   'apartment_2br'],
  ['Latifa Al Qassimi',    '+971508901234', 'latifa.qassimi@gmail.com',     'tiktok',  'qualified', 'handed_off', 'answered',     'Living Room & Dining Makeover (AED 13,500)',                      'Al Barsha',             3,  'qualified_living',      'living_room'],
  ['Rashid Al Khoury',     '+971509012345', 'rashid.khoury@hotmail.com',    'website', 'qualified', 'replied',    'answered',     'Commercial Office Design — Business Bay (AED 35,000+)',          'Business Bay',          8,  'qualified_commercial',  'commercial'],
  ['Priya Menon',          '+971510123456', 'priya.menon@gmail.com',        'google',  'qualified', 'handed_off', 'answered',     'Kitchen & Dining Redesign (AED 12,000)',                          'Mirdif, Dubai',         9,  'qualified_kitchen',     'kitchen_dining'],
  ['Jassim Al Zarooni',    '+971511234567', 'jassim.zarooni@gmail.com',     'meta_ad', 'qualified', 'replied',    'answered',     'Full Villa Design — 6BR Meadows (AED 55,000+)',                   'The Meadows',           10, 'qualified_villa',       'villa_full'],
  ['Hessa Al Muhairy',     '+971512345678', 'hessa.muhairy@gmail.com',      'meta_ad', 'qualified', 'handed_off', 'callback',     'Full Apartment Design — 1BR Dubai Hills (AED 12,000)',            'Dubai Hills Estate',    11, 'qualified_apartment',   'apartment_2br'],
  ['Rajesh Kumar',         '+971513456789', 'rajesh.kumar@gmail.com',       'website', 'qualified', 'replied',    'answered',     'Home Office Design Package (AED 5,500)',                          'Jumeirah Lakes Towers', 12, 'contacted_office',      'home_office'],
  ['Reem Al Breiki',       '+971514567890', 'reem.breiki@yahoo.com',        'tiktok',  'qualified', 'handed_off', 'answered',     'Master Bedroom Redesign — Luxury (AED 9,500)',                    'Arabian Ranches',       6,  'qualified_living',      'living_room'],
  ['Sultan Al Ketbi',      '+971515678901', 'sultan.ketbi@gmail.com',       'meta_ad', 'qualified', 'replied',    'answered',     'Kitchen & Dining — Open Plan (AED 14,000)',                       'Sharjah',               4,  'qualified_kitchen',     'kitchen_dining'],

  // CONTACTED leads (15)
  ['Omar Al Dhaheri',      '+971516789012', 'omar.dhaheri@gmail.com',       'meta_ad', 'contacted', 'replied',    'callback',     'Full Villa Design — 5BR Mirdif (AED 40,000+)',                    'Mirdif, Dubai',         13, 'qualified_villa',       'villa_full'],
  ['Noura Al Blooshi',     '+971517890123', 'noura.blooshi@hotmail.com',    'meta_ad', 'contacted', 'replied',    'not_answered', 'Master Bedroom Redesign (AED 7,500)',                             'Sharjah',               14, 'contacted_bedroom',     'living_room'],
  ['Aisha Al Ketbi',       '+971518901234', 'aisha.ketbi@gmail.com',        'website', 'contacted', 'replied',    'callback',     'Home Office Design Package (AED 5,500)',                          'Al Barsha, Dubai',      5,  'contacted_office',      'home_office'],
  ['Tariq Al Ameri',       '+971519012345', 'tariq.ameri@gmail.com',        'meta_ad', 'contacted', 'sent',       'queued',       'Living Room Makeover (AED 8,500)',                                'Ajman',                 15, 'new_lead',              'living_room'],
  ['Hassan Al Suwaidi',    '+971520123456', 'hassan.suwaidi@gmail.com',     'google',  'contacted', 'replied',    'not_answered', 'Kitchen & Dining Redesign (AED 12,000)',                          'Abu Dhabi',             16, 'qualified_kitchen',     'kitchen_dining'],
  ['Meera Al Qubaisi',     '+971521234567', 'meera.qubaisi@yahoo.com',      'meta_ad', 'contacted', 'replied',    'callback',     'Full Apartment Design — 2BR (AED 18,000)',                        'Downtown Dubai',        7,  'qualified_apartment',   'apartment_2br'],
  ['Ali Hassan',           '+971522345678', 'ali.hassan99@gmail.com',       'meta_ad', 'contacted', 'replied',    'not_answered', 'Colour & Materials Consultation (AED 1,500)',                     'Dubai Sports City',     17, 'contacted_colourconsult','living_room'],
  ['Sana Malik',           '+971523456789', 'sana.malik@gmail.com',         'tiktok',  'contacted', 'replied',    'callback',     'Space Planning Consultation (AED 3,500)',                         'Sharjah',               9,  'contacted_spaceplanning','living_room'],
  ['Yusuf Al Mazrouei',    '+971524567890', 'yusuf.mazrouei@gmail.com',     'website', 'contacted', 'sent',       'queued',       'Commercial Office Design (AED 30,000+)',                          'Abu Dhabi',             18, 'new_lead',              'commercial'],
  ['Shamsa Al Remeithi',   '+971525678901', 'shamsa.remeithi@hotmail.com',  'meta_ad', 'contacted', 'replied',    'not_answered', 'Master Bedroom Redesign (AED 7,500)',                             'Dubai Deira',           8,  'contacted_bedroom',     'living_room'],
  ['John Mathew',          '+971526789012', 'john.mathew@gmail.com',        'google',  'contacted', 'replied',    'callback',     'Full Apartment Design — 2BR JBR (AED 19,500)',                    'JBR, Dubai',            19, 'qualified_apartment',   'apartment_2br'],
  ['Bilal Ahmed',          '+971527890123', 'bilal.ahmed@gmail.com',        'meta_ad', 'contacted', 'replied',    'not_answered', 'Living Room Makeover (AED 8,500)',                                'Abu Dhabi',             10, 'qualified_living',      'living_room'],
  ['Khawla Al Neyadi',     '+971528901234', 'khawla.neyadi@yahoo.com',      'meta_ad', 'contacted', 'sent',       'queued',       'Kitchen & Dining Redesign (AED 12,000)',                          'JVC, Dubai',            20, 'new_lead',              'kitchen_dining'],
  ['Moza Al Khateri',      '+971529012345', 'moza.khateri@gmail.com',       'website', 'contacted', 'replied',    'not_answered', 'Colour & Materials Consultation (AED 1,500)',                     'Sharjah',               11, 'contacted_colourconsult','living_room'],
  ['Imran Siddiqui',       '+971530123456', 'imran.siddiqui@gmail.com',     'tiktok',  'contacted', 'replied',    'callback',     'Home Office Design Package (AED 5,500)',                          'Ajman',                 13, 'contacted_office',      'home_office'],

  // NEW leads (10)
  ['Abdullah Al Hameli',   '+971531234567', 'abd.hameli@gmail.com',         'meta_ad', 'new',       'sent',       'queued',       'Full Villa Interior Design — 4BR (AED 38,000+)',                  'The Springs',           1,  'new_lead',              'villa_full'],
  ['Saeed Al Mansouri',    '+971532345678', 'saeed.mansouri@hotmail.com',   'meta_ad', 'new',       'sent',       'queued',       'Living Room Makeover (AED 8,500)',                                'Dubai Sports City',     0,  'new_lead',              'living_room'],
  ['Deepa Nair',           '+971533456789', 'deepa.nair@gmail.com',         'google',  'new',       'sent',       'queued',       'Full Apartment Design — 2BR (AED 18,000)',                        'Abu Dhabi',             1,  'new_lead',              'apartment_2br'],
  ['Zayed Al Falasi',      '+971534567890', 'zayed.falasi@gmail.com',       'meta_ad', 'new',       'sent',       'queued',       'Master Bedroom Redesign (AED 7,500)',                             'Sharjah',               2,  'new_lead',              'living_room'],
  ['Maria Jose',           '+971535678901', 'maria.jose@gmail.com',         'tiktok',  'new',       'sent',       'queued',       'Kitchen & Dining Open Plan (AED 12,000)',                         'JBR, Dubai',            0,  'new_lead',              'kitchen_dining'],
  ['Hamdan Al Merri',      '+971536789012', 'hamdan.merri@gmail.com',       'meta_ad', 'new',       'sent',       'queued',       'Commercial Office Design (AED 30,000+)',                          'Business Bay',          1,  'new_lead',              'commercial'],
  ['Obaid Al Tunaiji',     '+971537890123', 'obaid.tunaiji@yahoo.com',      'meta_ad', 'new',       'sent',       'queued',       'Space Planning Consultation (AED 3,500)',                         'Al Barsha',             2,  'new_lead',              'living_room'],
  ['Sara Al Matrooshi',    '+971538901234', 'sara.matrooshi@gmail.com',     'website', 'new',       'sent',       'queued',       'Full Villa Design — 5BR Arabian Ranches (AED 43,000+)',           'Arabian Ranches',       0,  'new_lead',              'villa_full'],
  ['Khalfan Al Mazrouei',  '+971539012345', 'khalfan.mazrouei@gmail.com',   'meta_ad', 'new',       'sent',       'queued',       'Home Office Design Package (AED 5,500)',                          'Dubai Deira',           1,  'new_lead',              'home_office'],
  ['Amna Al Hosani',       '+971540123456', 'amna.hosani@hotmail.com',      'meta_ad', 'new',       'sent',       'queued',       'Colour & Materials Consultation (AED 1,500)',                     'Ajman',                 0,  'new_lead',              'living_room'],

  // COLD leads (10)
  ['Hind Al Hajri',        '+971541234567', 'hind.hajri@gmail.com',         'meta_ad', 'cold',      'no_reply',   'not_answered', 'Living Room Makeover (AED 8,500)',                                'Sharjah',               22, 'cold_no_reply',         'no_reply'],
  ['Mansour Al Sabah',     '+971542345678', 'mansour.sabah@hotmail.com',    'meta_ad', 'cold',      'no_reply',   'not_answered', 'Full Villa Design (AED 45,000+)',                                 'JVC, Dubai',            24, 'cold_no_reply',         'no_reply'],
  ['Sheikha Al Mulla',     '+971543456789', 'sheikha.mulla@gmail.com',      'website', 'cold',      'no_reply',   'not_answered', 'Kitchen & Dining Redesign (AED 12,000)',                          'Abu Dhabi',             25, 'cold_no_reply',         'no_reply'],
  ['Zainab Hussain',       '+971544567890', 'zainab.hussain@gmail.com',     'meta_ad', 'cold',      'no_reply',   'not_answered', 'Full Apartment Design (AED 18,000)',                              'Dubai Sports City',     26, 'cold_no_reply',         'no_reply'],
  ['Faisal Al Ghamdi',     '+971545678901', 'faisal.ghamdi@yahoo.com',      'meta_ad', 'cold',      'no_reply',   'not_answered', 'Master Bedroom Redesign (AED 7,500)',                             'Sharjah',               27, 'cold_no_reply',         'no_reply'],
  ['Nadia Al Sheikh',      '+971546789012', 'nadia.sheikh@gmail.com',       'google',  'cold',      'no_reply',   'not_answered', 'Home Office Design Package (AED 5,500)',                          'Downtown Dubai',        28, 'cold_no_reply',         'no_reply'],
  ['Layla Al Sayed',       '+971547890123', 'layla.sayed@gmail.com',        'meta_ad', 'cold',      'no_reply',   'not_answered', 'Space Planning Consultation (AED 3,500)',                         'Ajman',                 29, 'cold_no_reply',         'no_reply'],
  ['Waleed Al Nasser',     '+971548901234', 'waleed.nasser@hotmail.com',    'meta_ad', 'cold',      'no_reply',   'not_answered', 'Commercial Office Design (AED 30,000+)',                          'JBR, Dubai',            30, 'cold_no_reply',         'no_reply'],
  ['Dina El Masry',        '+971549012345', 'dina.masry@gmail.com',         'tiktok',  'cold',      'no_reply',   'not_answered', 'Full Villa Design — 4BR (AED 40,000+)',                           'Dubai Deira',           23, 'cold_no_reply',         'no_reply'],
  ['Yousif Al Zaabi',      '+971550123456', 'yousif.zaabi@gmail.com',       'website', 'cold',      'no_reply',   'not_answered', 'Kitchen & Dining Redesign (AED 12,000)',                          'Sharjah',               21, 'cold_no_reply',         'no_reply'],
]

export const LEADS: Lead[] = RAW.map((row, i) => {
  const [name, phone, email, source, status, whatsapp_status, call_status, interest, , daysAgoVal, summaryKey, transcriptKey] = row
  const created = daysAgo(daysAgoVal, i % 8)
  const followUpSent = whatsapp_status === 'replied' || whatsapp_status === 'handed_off'
  return {
    id: `lead-${String(i + 1).padStart(3, '0')}`,
    client_id: 'client-001',
    name,
    phone,
    email,
    source,
    status,
    whatsapp_status,
    call_status,
    ai_summary: SUMMARIES[summaryKey] ?? SUMMARIES['new_lead'],
    transcript: TRANSCRIPTS[transcriptKey] ?? TRANSCRIPTS['living_room'],
    interest,
    follow_up_sent: followUpSent,
    follow_up_at: followUpSent ? daysAgo(daysAgoVal - 1, (i % 6) + 2) : undefined,
    created_at: created,
    updated_at: daysAgo(daysAgoVal - 1, i % 6),
  }
})

export const WHATSAPP_EVENTS: WhatsappEvent[] = LEADS.flatMap((lead, i) => {
  if (lead.whatsapp_status === 'no_reply') return []
  const base: WhatsappEvent[] = [
    { id: `wa-${lead.id}-1`, lead_id: lead.id, client_id: 'client-001', event_type: 'message_sent', created_at: lead.created_at },
    { id: `wa-${lead.id}-2`, lead_id: lead.id, client_id: 'client-001', event_type: 'bot_replied', created_at: lead.updated_at },
  ]
  if (lead.whatsapp_status === 'replied' || lead.whatsapp_status === 'handed_off') {
    base.push({ id: `wa-${lead.id}-3`, lead_id: lead.id, client_id: 'client-001', event_type: 'message_received', created_at: daysAgo(0, i % 12) })
  }
  if (lead.whatsapp_status === 'handed_off') {
    base.push({ id: `wa-${lead.id}-4`, lead_id: lead.id, client_id: 'client-001', event_type: 'agent_assigned', created_at: daysAgo(0, (i % 12) + 1) })
  }
  return base
})

export const CALL_EVENTS: CallEvent[] = LEADS.flatMap((lead, i) => {
  if (lead.call_status === 'queued') return []
  const base: CallEvent[] = [
    { id: `call-${lead.id}-1`, lead_id: lead.id, client_id: 'client-001', event_type: 'call_started', duration_seconds: 0, outcome: lead.call_status === 'answered' ? 'answered' : lead.call_status === 'callback' ? 'callback' : 'not_answered', created_at: lead.updated_at },
  ]
  if (lead.call_status === 'answered' || lead.call_status === 'callback') {
    const dur = 90 + (i % 8) * 45
    base.push({ id: `call-${lead.id}-2`, lead_id: lead.id, client_id: 'client-001', event_type: 'call_ended', duration_seconds: dur, outcome: 'answered', created_at: daysAgo(0, i % 10) })
  }
  return base
})

// ─── Metric helpers ──────────────────────────────────────────────────────────

export function getDashboardMetrics() {
  const thisMonth = LEADS.filter(l => new Date(l.created_at) > daysAgoDate(30))
  return {
    totalLeads: thisMonth.length,
    whatsappAnswered: thisMonth.filter(l => l.whatsapp_status !== 'no_reply').length,
    callsMade: thisMonth.filter(l => l.call_status !== 'queued').length,
    qualifiedLeads: thisMonth.filter(l => l.status === 'qualified').length,
  }
}

function daysAgoDate(n: number) {
  const d = new Date('2026-05-20T12:00:00Z')
  d.setDate(d.getDate() - n)
  return d
}

export function getLeadsPerDay(days: number) {
  return Array.from({ length: days }, (_, i) => {
    const date = daysAgoDate(days - 1 - i)
    const label = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
    const count = LEADS.filter(l => {
      const d = new Date(l.created_at)
      return d.toDateString() === date.toDateString()
    }).length
    return { date: label, leads: count }
  })
}

export function getPipelineBreakdown() {
  return [
    { stage: 'New',       count: LEADS.filter(l => l.status === 'new').length,       color: '#6B5FE4' },
    { stage: 'Contacted', count: LEADS.filter(l => l.status === 'contacted').length, color: '#818CF8' },
    { stage: 'Qualified', count: LEADS.filter(l => l.status === 'qualified').length, color: '#10B981' },
    { stage: 'Cold',      count: LEADS.filter(l => l.status === 'cold').length,      color: '#D1D5DB' },
  ]
}

export function getAdSpendByChannel() {
  return [
    { source: 'meta_ad', label: 'Meta Ads',  spend: 4200, leads: LEADS.filter(l => l.source === 'meta_ad').length,  color: '#1877F2' },
    { source: 'google',  label: 'Google',    spend: 2800, leads: LEADS.filter(l => l.source === 'google').length,   color: '#EA4335' },
    { source: 'tiktok',  label: 'TikTok',    spend: 1500, leads: LEADS.filter(l => l.source === 'tiktok').length,   color: '#000000' },
    { source: 'website', label: 'Organic',   spend: 0,    leads: LEADS.filter(l => l.source === 'website').length,  color: '#10B981' },
  ]
}

export function getLeadsBySource() {
  const sources = ['meta_ad', 'google', 'tiktok', 'website'] as const
  const labels: Record<string, string> = { meta_ad: 'Meta Ads', google: 'Google', tiktok: 'TikTok', website: 'Organic' }
  const colors: Record<string, string> = { meta_ad: '#1877F2', google: '#EA4335', tiktok: '#6B5FE4', website: '#10B981' }
  return sources.map(s => ({
    source: s,
    label: labels[s],
    count: LEADS.filter(l => l.source === s).length,
    color: colors[s],
  }))
}

export function getWhatsappMetrics() {
  const initiated = LEADS.filter(l => l.whatsapp_status !== 'no_reply').length
  const aiAnswered = LEADS.filter(l => l.whatsapp_status === 'replied').length
  const handedToHuman = LEADS.filter(l => l.whatsapp_status === 'handed_off').length
  const noReply = LEADS.filter(l => l.whatsapp_status === 'no_reply').length
  return { initiated, aiAnswered, handedToHuman, noReply, responseRate: Math.round((aiAnswered + handedToHuman) / Math.max(initiated, 1) * 100) }
}

export function getChatsPerDay(days: number) {
  return Array.from({ length: days }, (_, i) => {
    const date = daysAgoDate(days - 1 - i)
    const label = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
    const count = LEADS.filter(l => {
      const d = new Date(l.created_at)
      return d.toDateString() === date.toDateString() && l.whatsapp_status !== 'no_reply'
    }).length
    return { date: label, chats: count || Math.floor(Math.random() * 4) }
  })
}

export function getCallMetrics() {
  const made = LEADS.filter(l => l.call_status !== 'queued').length
  const answered = LEADS.filter(l => l.call_status === 'answered').length
  const notAnswered = LEADS.filter(l => l.call_status === 'not_answered').length
  const callbacks = LEADS.filter(l => l.call_status === 'callback').length
  const durations = CALL_EVENTS.filter(e => e.event_type === 'call_ended').map(e => e.duration_seconds)
  const avgDuration = durations.length ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0
  return { made, answered, notAnswered, callbacks, avgDuration }
}

export function getCallsPerDay(days: number) {
  return Array.from({ length: days }, (_, i) => {
    const date = daysAgoDate(days - 1 - i)
    const label = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
    const count = LEADS.filter(l => {
      const d = new Date(l.updated_at)
      return d.toDateString() === date.toDateString() && l.call_status !== 'queued'
    }).length
    return { date: label, calls: count || Math.floor(Math.random() * 3) }
  })
}

export function buildTimeline(lead: Lead): TimelineEvent[] {
  const events: TimelineEvent[] = [
    { id: 'e1', label: 'Lead captured', detail: `Source: ${lead.source.replace('_', ' ')}`, timestamp: lead.created_at, icon: 'lead' },
  ]
  if (lead.whatsapp_status !== 'no_reply') {
    events.push({ id: 'e2', label: 'WhatsApp message sent', detail: 'AI bot initiated conversation', timestamp: daysAgo(0, 10), icon: 'whatsapp' })
  }
  if (lead.whatsapp_status === 'replied' || lead.whatsapp_status === 'handed_off') {
    events.push({ id: 'e3', label: 'Customer replied', detail: 'Conversation active', timestamp: daysAgo(0, 8), icon: 'whatsapp' })
  }
  if (lead.whatsapp_status === 'handed_off') {
    events.push({ id: 'e4', label: 'Handed to designer', detail: 'Human agent assigned', timestamp: daysAgo(0, 6), icon: 'whatsapp' })
  }
  if (lead.call_status !== 'queued') {
    events.push({ id: 'e5', label: 'AI voice call placed', detail: `Outcome: ${lead.call_status.replace('_', ' ')}`, timestamp: lead.updated_at, icon: 'call' })
  }
  if (lead.status === 'qualified') {
    events.push({ id: 'e6', label: 'Lead qualified', detail: 'Ready for design consultation', timestamp: daysAgo(0, 2), icon: 'qualified' })
  }
  if (lead.status === 'cold') {
    events.push({ id: 'e7', label: 'Marked cold', detail: 'No engagement after 7 days', timestamp: daysAgo(0, 1), icon: 'cold' })
  }
  return events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
}

export function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}
