import { NextResponse } from 'next/server'
import { SITE_EMAIL, SITE_NAME } from '@/constants/site'

const CONTACT_RECIPIENT_EMAIL = 'ruschellisis@gmail.com'
const CONTACT_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL ?? SITE_EMAIL

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)

  const name = typeof body?.name === 'string' ? body.name.trim() : ''
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  const message = typeof body?.message === 'string' ? body.message.trim() : ''

  if (!name || !email || !message) {
    return NextResponse.json({ message: 'All fields are required' }, { status: 400 })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ message: 'Invalid email address' }, { status: 400 })
  }

  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) {
    console.error('[contact] Missing BREVO_API_KEY')
    return NextResponse.json({ message: 'Email service is not configured.' }, { status: 500 })
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender: { name: SITE_NAME, email: CONTACT_SENDER_EMAIL },
        to: [{ email: CONTACT_RECIPIENT_EMAIL, name: SITE_NAME }],
        replyTo: { email, name },
        subject: `Contact form — ${name}`,
        textContent: `From: ${name} <${email}>\n\n${message}`,
        htmlContent: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p><p>${message.replace(/\n/g, '<br>')}</p>`,
      }),
    })

    if (!res.ok) {
      const errorText = await res.text().catch(() => '')
      throw new Error(`Brevo error: ${res.status}${errorText ? ` ${errorText}` : ''}`)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact]', err)
    return NextResponse.json({ message: 'Failed to send message. Please email us directly.' }, { status: 500 })
  }
}
