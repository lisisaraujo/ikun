'use client'

import { useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

const fieldClass =
  'w-full bg-transparent border-0 border-b border-[#8B5F3C]/26 py-3 text-sm text-[#A06B43] placeholder-[#A06B43]/34 focus:outline-none focus:border-[#37C6F4] transition-colors duration-300'

const labelClass =
  'block text-[10px] font-semibold uppercase tracking-widest text-[#A06B43]/58 mb-1'

export default function ContactForm() {
  const [status, setStatus]     = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    const form = e.currentTarget
    const data = {
      name:    (form.elements.namedItem('name')    as HTMLInputElement).value,
      email:   (form.elements.namedItem('email')   as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to send message')
      setStatus('success')
      form.reset()
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (status === 'success') {
    return (
      <p className="border-b border-[#8B5F3C]/26 py-6 text-sm text-[#A06B43]">
        Thank you — your message has been sent.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <label htmlFor="name" className={labelClass}>Name</label>
        <input
          id="name" name="name" type="text" required
          className={fieldClass}
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>Email</label>
        <input
          id="email" name="email" type="email" required
          className={fieldClass}
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>Message</label>
        <textarea
          id="message" name="message" required rows={5}
          className={`${fieldClass} resize-none`}
          placeholder="Your message…"
        />
      </div>

      {status === 'error' && (
        <p className="text-red-400 text-xs">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="rounded-full bg-[#8B5F3C]/22 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#A06B43] ring-1 ring-[#8B5F3C]/30 transition-colors duration-300 hover:text-[#37C6F4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#37C6F4]/60 disabled:opacity-40"
      >
        {status === 'loading' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  )
}
