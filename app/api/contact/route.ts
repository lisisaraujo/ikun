import { NextResponse } from 'next/server'
import { SITE_EMAIL, SITE_NAME } from '@/constants/site'

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

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify({
        sender: { name, email },
        to: [{ email: SITE_EMAIL, name: SITE_NAME }],
        replyTo: { email, name },
        subject: `Contact form — ${name}`,
        textContent: message,
        htmlContent: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p><p>${message.replace(/\n/g, '<br>')}</p>`,
      }),
    })

    if (!res.ok) {
      throw new Error(`Brevo error: ${res.status}`)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact]', err)
    return NextResponse.json({ message: 'Failed to send message. Please email us directly.' }, { status: 500 })
  }
}
