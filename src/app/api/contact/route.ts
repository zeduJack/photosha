import { Resend } from 'resend'
import { render } from '@react-email/components'
import { AutoResponseEmail } from '@/emails/auto-response'
import type { ContactFormData } from '@/types/contact'
import type { NextRequest } from 'next/server'

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return false

  const res = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token }),
    }
  )
  const data = await res.json()
  return data.success === true
}

export async function POST(request: NextRequest) {
  let body: ContactFormData & { locale?: string }

  try {
    body = await request.json()
  } catch {
    return Response.json({ success: false, error: 'invalid_body' }, { status: 400 })
  }

  const { name, email, sessionType, approximateDate, message, turnstileToken, locale } = body

  // Basic validation
  if (!name?.trim() || !email?.trim() || !sessionType || !message?.trim()) {
    return Response.json({ success: false, error: 'missing_fields' }, { status: 400 })
  }

  // Turnstile verification
  const turnstileOk = turnstileToken
    ? await verifyTurnstile(turnstileToken)
    : false

  if (!turnstileOk) {
    return Response.json({ success: false, error: 'turnstile_failed' }, { status: 403 })
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'noreply@photosha.ch'
  const shaEmail  = process.env.SHA_EMAIL ?? 'sha@photosha.ch'
  const loc = (locale === 'en' ? 'en' : 'de') as 'de' | 'en'

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)

    // 1. Notification email to Sha
    await resend.emails.send({
      from: fromEmail,
      to: shaEmail,
      replyTo: email,
      subject: `Neue Anfrage von ${name} — ${sessionType}`,
      text: [
        `Name: ${name}`,
        `E-Mail: ${email}`,
        `Session-Typ: ${sessionType}`,
        approximateDate ? `Datum: ${approximateDate}` : '',
        `Nachricht:\n${message}`,
      ]
        .filter(Boolean)
        .join('\n'),
    })

    // 2. Auto-response to visitor
    const html = await render(AutoResponseEmail({ firstName: name, locale: loc }))
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: loc === 'de' ? 'Deine Anfrage bei Sha — Fotografin' : 'Your enquiry to Sha — Photographer',
      html,
      text:
        loc === 'de'
          ? `Liebe/r ${name.split(' ')[0]},\n\nVielen Dank für deine Anfrage! Ich melde mich innerhalb von 24 Stunden.\n\nHerzliche Grüsse\nSha`
          : `Dear ${name.split(' ')[0]},\n\nThank you for your enquiry! I'll reply within 24 hours.\n\nWarm regards,\nSha`,
    })

    return Response.json({ success: true })
  } catch (err) {
    console.error('[contact] email error:', err)
    return Response.json({ success: false, error: 'send_failed' }, { status: 500 })
  }
}
