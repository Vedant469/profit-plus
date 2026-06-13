import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, company, budget, message } = req.body

  try {
    await resend.emails.send({
      from: 'ProfitPlus <onboarding@resend.dev>',
      to: ['profitplus025@gmail.com'],
      subject: `🔥 New Lead: ${name} ${company ? `from ${company}` : ''}`,
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #020617; color: #f8fafc; border-radius: 16px; overflow: hidden;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 32px; text-align: center;">
            <h1 style="margin: 0; color: #020617; font-size: 24px; font-weight: 900;">🚀 New Lead!</h1>
            <p style="margin: 8px 0 0; color: #020617; opacity: 0.8; font-size: 14px;">Someone just submitted the ProfitPlus contact form</p>
          </div>

          <!-- Body -->
          <div style="padding: 32px;">
            
            <!-- Lead details -->
            <div style="background: #1e293b; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
              <h2 style="color: #10b981; font-size: 16px; margin: 0 0 16px; text-transform: uppercase; letter-spacing: 0.1em;">Lead Details</h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 30%;">Name</td>
                  <td style="padding: 8px 0; color: #f8fafc; font-size: 14px; font-weight: 600;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Email</td>
                  <td style="padding: 8px 0;">
                    <a href="mailto:${email}" style="color: #10b981; font-size: 14px; font-weight: 600;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Company</td>
                  <td style="padding: 8px 0; color: #f8fafc; font-size: 14px;">${company || 'Not provided'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Budget</td>
                  <td style="padding: 8px 0;">
                    <span style="background: #10b98120; color: #10b981; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600;">${budget || 'Not specified'}</span>
                  </td>
                </tr>
              </table>
            </div>

            <!-- Message -->
            <div style="background: #1e293b; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
              <h2 style="color: #10b981; font-size: 16px; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.1em;">Their Message</h2>
              <p style="color: #94a3b8; font-size: 14px; line-height: 1.7; margin: 0;">${message}</p>
            </div>

            <!-- CTA -->
            <div style="text-align: center;">
              <a href="mailto:${email}" style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: #020617; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 12px; text-decoration: none;">
                Reply to ${name} →
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="padding: 20px 32px; border-top: 1px solid #1e293b; text-align: center;">
            <p style="color: #334155; font-size: 12px; margin: 0;">ProfitPlus — Profit-Driven Marketing Agency</p>
          </div>
        </div>
      `,
    })

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Email error:', error)
    return res.status(500).json({ error: 'Failed to send email' })
  }
}