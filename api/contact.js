export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, message, lang } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const subjects = {
    tr: 'Web sitesinden yeni iletişim formu',
    en: 'New contact form submission',
    az: 'Saytdan yeni əlaqə forması'
  };
  const subject = subjects[lang] || subjects.en;

  const html = `
    <table style="font-family:sans-serif;font-size:15px;color:#222;max-width:540px">
      <tr><td style="padding-bottom:16px">
        <strong style="font-size:18px">${subject}</strong>
      </td></tr>
      <tr><td><strong>Name:</strong> ${escHtml(name)}</td></tr>
      <tr><td><strong>Email:</strong> <a href="mailto:${escHtml(email)}">${escHtml(email)}</a></td></tr>
      ${phone ? `<tr><td><strong>Phone:</strong> ${escHtml(phone)}</td></tr>` : ''}
      <tr><td style="padding-top:12px"><strong>Message:</strong></td></tr>
      <tr><td style="white-space:pre-wrap;padding-top:4px">${escHtml(message)}</td></tr>
    </table>
  `;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      from: 'Alba Visa <noreply@albavisa.com>',
      to: ['contact@albavisa.com'],
      reply_to: email,
      subject,
      html
    })
  });

  if (!response.ok) {
    console.error('Resend error:', await response.text());
    return res.status(500).json({ error: 'Failed to send email' });
  }

  return res.status(200).json({ ok: true });
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
