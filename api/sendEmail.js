import { Resend } from 'resend'

const WINDOW_MS = 10 * 60 * 1000
const MAX_REQUESTS = 5
const rateLimit = new Map()

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character])
}

function cleanText(value, maxLength) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLength)
}

function checkRateLimit(ip) {
  const now = Date.now()
  const current = rateLimit.get(ip)

  if (!current || now - current.startedAt >= WINDOW_MS) {
    rateLimit.set(ip, { startedAt: now, count: 1 })
    return true
  }

  if (current.count >= MAX_REQUESTS) return false
  current.count += 1
  return true
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const contentLength = Number(req.headers['content-length'] || 0)
  if (contentLength > 12000) {
    return res.status(413).json({ error: 'Request is too large' })
  }

  const forwardedFor = req.headers['x-forwarded-for']
  const ip = (typeof forwardedFor === 'string' ? forwardedFor.split(',')[0] : '') ||
    req.headers['x-real-ip'] ||
    'unknown'

  if (!checkRateLimit(String(ip).trim())) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' })
  }

  const name = cleanText(req.body?.name, 100)
  const email = cleanText(req.body?.email, 254).toLowerCase()
  const company = cleanText(req.body?.company, 120)
  const budget = cleanText(req.body?.budget, 40)
  const message = cleanText(req.body?.message, 3000)

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const allowedBudgets = new Set(['', '50k-1L', '1L-2.5L', '2.5L-5L', '5L+'])

  if (!name || !emailPattern.test(email) || !message) {
    return res.status(400).json({ error: 'Please provide a valid name, email, and message.' })
  }

  if (!allowedBudgets.has(budget)) {
    return res.status(400).json({ error: 'Please select a valid budget range.' })
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not configured')
    return res.status(503).json({ error: 'Email notifications are temporarily unavailable.' })
  }

  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeCompany = escapeHtml(company || 'Not provided')
  const safeBudget = escapeHtml(budget || 'Not specified')
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, '<br />')

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error } = await resend.emails.send({
      from: 'ProfitPlus <onboarding@resend.dev>',
      to: ['profitplus025@gmail.com'],
      subject: `New ProfitPlus lead: ${name.replace(/[\r\n]/g, ' ')}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#0f172a">
          <h1>New ProfitPlus contact request</h1>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
          <p><strong>Company:</strong> ${safeCompany}</p>
          <p><strong>Budget:</strong> ${safeBudget}</p>
          <h2>Message</h2>
          <p style="white-space:normal;line-height:1.6">${safeMessage}</p>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return res.status(502).json({ error: 'Lead saved, but email notification failed.' })
    }

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Email error:', error)
    return res.status(502).json({ error: 'Lead saved, but email notification failed.' })
  }
}
