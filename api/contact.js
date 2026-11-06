export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, message, lang, summary } = req.body || {};

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
      html,
      ...(summary && { text: summary })
    })
  });

  if (!response.ok) {
    console.error('Resend error:', await response.text());
    return res.status(500).json({ error: 'Failed to send email' });
  }

  // Instant auto-reply to the lead, sent via Brevo (authenticated for this
  // domain). Best-effort: a failure here must never fail the form submission
  // itself, since the internal notification above already succeeded.
  try {
    await sendAutoReply({ name, email, lang });
  } catch (err) {
    console.error('Auto-reply error:', err);
  }

  return res.status(200).json({ ok: true });
}

async function sendAutoReply({ name, email, lang }) {
  const brevoKey = process.env.BREVO_API_KEY;
  if (!brevoKey) {
    console.error('Auto-reply skipped: BREVO_API_KEY not configured');
    return;
  }

  const firstName = String(name).trim().split(/\s+/)[0] || name;
  const whatsappNumber = '355673615880';
  const whatsappDisplay = '+355 67 361 5880';
  const whatsappText = encodeURIComponent(
    "Merhaba, web sitesinden ulaştım. / Hi, I just contacted you via the website."
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappText}`;

  const copy = {
    tr: {
      subject: 'Alba Visa - Mesajınızı Aldık',
      greeting: `Merhaba ${escHtml(firstName)},`,
      body: [
        'Alba Visa&rsquo;ya ulaştığınız için teşekkür ederiz! Mesajınızı aldık ve ekibimiz genellikle <strong>1 saat içinde</strong> size dönüş yapıyor.',
        'Daha hızlı yanıt isterseniz WhatsApp&rsquo;tan da bize ulaşabilirsiniz:'
      ],
      cta: `WhatsApp&rsquo;tan Yaz: ${whatsappDisplay}`,
      signoff: 'Alba Visa Ekibi'
    },
    en: {
      subject: 'Alba Visa - We Got Your Message',
      greeting: `Hi ${escHtml(firstName)},`,
      body: [
        'Thank you for reaching out to Alba Visa! We&rsquo;ve received your message and our team typically replies <strong>within an hour</strong>.',
        'For a faster response, you can also reach us on WhatsApp:'
      ],
      cta: `Message us on WhatsApp: ${whatsappDisplay}`,
      signoff: 'The Alba Visa Team'
    },
    az: {
      subject: 'Alba Visa - Mesajınızı Aldıq',
      greeting: `Salam ${escHtml(firstName)},`,
      body: [
        'Alba Visa-ya müraciət etdiyiniz üçün təşəkkür edirik! Mesajınızı aldıq və komandamız adətən <strong>1 saat ərzində</strong> cavab verir.',
        'Daha sürətli cavab üçün WhatsApp vasitəsilə də bizə yaza bilərsiniz:'
      ],
      cta: `WhatsApp-dan yazın: ${whatsappDisplay}`,
      signoff: 'Alba Visa Komandası'
    }
  };

  const c = copy[lang] || copy.en;

  const html = `
    <div style="font-family:sans-serif;font-size:15px;color:#222;max-width:540px;line-height:1.6">
      <p>${c.greeting}</p>
      ${c.body.map((p) => `<p>${p}</p>`).join('')}
      <p style="margin:20px 0">
        <a href="${whatsappUrl}" target="_blank" style="display:inline-block;background:#111;color:#c9a84c;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:bold">${c.cta}</a>
      </p>
      <p>${c.signoff}</p>
    </div>
  `;

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'api-key': brevoKey
    },
    body: JSON.stringify({
      sender: { name: 'Alba Visa', email: 'contact@albavisa.com' },
      to: [{ email, name }],
      subject: c.subject,
      htmlContent: html
    })
  });

  if (!response.ok) {
    console.error('Brevo auto-reply error:', await response.text());
  }
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
