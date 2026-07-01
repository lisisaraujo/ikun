'use client'

import { useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
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
      <div className="rounded bg-[#37C6F4]/10 border border-[#37C6F4]/30 p-6">
        <p className="text-[#1C2433] font-medium">Thank you — your message has been sent.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[#1C2433] mb-1.5">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full rounded border border-[#C9C9C9] bg-white px-4 py-3 text-sm text-[#0B0B0B] placeholder-[#C9C9C9] focus:outline-none focus:border-[#1C2433] transition-colors"
          placeholder="Your name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#1C2433] mb-1.5">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded border border-[#C9C9C9] bg-white px-4 py-3 text-sm text-[#0B0B0B] placeholder-[#C9C9C9] focus:outline-none focus:border-[#1C2433] transition-colors"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-[#1C2433] mb-1.5">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className="w-full rounded border border-[#C9C9C9] bg-white px-4 py-3 text-sm text-[#0B0B0B] placeholder-[#C9C9C9] focus:outline-none focus:border-[#1C2433] transition-colors resize-y"
          placeholder="Your message…"
        />
      </div>

      {status === 'error' && (
        <p className="text-red-600 text-sm">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="rounded bg-[#1C2433] px-8 py-3 text-sm font-semibold text-[#F3F1EB] transition-colors hover:bg-[#37C6F4] hover:text-[#0B0B0B] disabled:opacity-50"
      >
        {status === 'loading' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  )
}
