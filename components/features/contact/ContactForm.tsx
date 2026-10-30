'use client'

import { useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

const fieldClass =
  'type-small w-full border-0 border-b border-[#8B5F3C]/26 bg-transparent py-3 text-[#A06B43] placeholder-[#A06B43]/34 transition-colors duration-300 focus:border-[#37C6F4] focus:outline-none'

const labelClass =
  'type-meta mb-1 block text-[#A06B43]/58'

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
      <p className="type-small border-b border-[#8B5F3C]/26 py-6 text-[#A06B43]">
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
        <p className="type-small text-red-400">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="type-label group inline-flex items-center gap-2 text-[#A06B43] transition-colors duration-300 hover:text-[#37C6F4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A06B43]/60 disabled:opacity-40"
      >
        {status === 'loading' ? 'Sending…' : 'Send Message'}
        {status !== 'loading' && (
          <svg viewBox="0 0 20 20" className="h-4 w-4 fill-none stroke-current stroke-2 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">
            <path d="M4 10h11M10 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    </form>
  )
}
