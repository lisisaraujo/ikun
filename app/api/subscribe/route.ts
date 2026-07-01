import { NextResponse } from 'next/server'
import { subscribeEmail } from '@/lib/brevo/client'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.trim() : null

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ message: 'Invalid email address' }, { status: 400 })
  }

  try {
    await subscribeEmail(email)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[subscribe]', err)
    return NextResponse.json({ message: 'Subscription failed. Please try again.' }, { status: 500 })
  }
}
